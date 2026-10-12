"""Deterministic teaching lab, Python 3.10+, stdlib only. No real LLM or external calls.

python lab.py sw --mode direct
python lab.py sw --mode agent --scenario transient
python lab.py eda --scenario wrong-version
python lab.py selftest
"""
import argparse
from contextlib import contextmanager
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import socket
import tempfile
import threading
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen, build_opener, ProxyHandler
import uuid

FIXTURES = json.loads(Path(__file__).with_name('fixtures.json').read_text(encoding='utf-8'))
SCENARIOS = ('normal', 'invalid', 'denied', 'timeout', 'transient', 'missing', 'wrong-version', 'empty', 'malformed', 'no-progress')


class LabError(Exception):
    def __init__(self, reason, retryable=False):
        super().__init__(reason)
        self.reason, self.retryable = reason, retryable


def tool_call(domain, name, arguments, scenario):
    """A fixed tool allowlist: no user-controlled paths, shell or external network."""
    expected_name = 'read_log' if domain == 'sw' else 'manual_lookup'
    if name != expected_name or not isinstance(arguments, dict):
        raise LabError('unknown_tool_or_arguments')
    if scenario == 'denied':
        raise LabError('permission_denied')
    if scenario == 'missing':
        raise LabError('not_found')
    if domain == 'sw':
        if arguments != {'input_id': FIXTURES['sw']['input_id']}:
            raise LabError('invalid_arguments')
        return {'input_id': arguments['input_id'], 'text': FIXTURES['sw']['text']}
    if arguments != {'version': 'r1', 'command': 'report_mock_timing'}:
        raise LabError('invalid_arguments')
    result = dict(FIXTURES['eda']['expected'])
    result['text'] = FIXTURES['eda']['manual']['text']
    if scenario == 'wrong-version':
        result.update(version='r2', document='manual-r2')
    return result


def model_policy(request):
    """Scripted model substitute, deliberately deterministic and clearly labelled."""
    domain, phase = request['domain'], request.get('phase', 'input')
    if request['mode'] == 'agent' and phase == 'input':
        return {'tool': 'read_log' if domain == 'sw' else 'manual_lookup', 'arguments':
                {'input_id': FIXTURES['sw']['input_id']} if domain == 'sw' else
                {'version': 'r1', 'command': 'report_mock_timing'}}
    if request['mode'] == 'agent' and not isinstance(request.get('tool_result'), dict):
        raise LabError('missing_observation')
    result = dict(FIXTURES[domain]['expected'])
    if domain == 'eda' and request.get('tool_result'):
        result.update({k: request['tool_result'][k] for k in result})
    if request['scenario'] == 'invalid':
        result.update(evidence='재시도 불가') if domain == 'sw' else result.update(unit='ps')
    if request['scenario'] == 'wrong-version' and domain == 'eda':
        result.update(version='r2', document='manual-r2')
    if request['scenario'] == 'no-progress':
        return {'retry': 'same unresolved input'}
    return {'answer': result}


class MockHandler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def do_POST(self):
        if self.path != '/model':
            self.send_error(404)
            return
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if size <= 0 or size > 65536:
                raise ValueError('invalid request size')
            request = json.loads(self.rfile.read(size))
            if request['domain'] not in FIXTURES or request['scenario'] not in SCENARIOS:
                raise ValueError('invalid scenario')
            if request['scenario'] == 'timeout':
                time.sleep(.3)
            status = 503 if request['scenario'] == 'transient' and request['attempt'] == 1 else 200
            payload = json.dumps(model_policy(request) if status == 200 else {'error': 'temporary'}, ensure_ascii=False).encode()
            if request['scenario'] == 'empty': payload = b''
            if request['scenario'] == 'malformed': payload = b'{bad json'
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except (BrokenPipeError, ConnectionResetError):
            pass  # Expected when the teaching client exercises its timeout.
        except (ValueError, KeyError, TypeError, LabError):
            self.send_error(400, 'Invalid mock request')


@contextmanager
def mock_server():
    server = ThreadingHTTPServer(('127.0.0.1', 0), MockHandler)
    worker = threading.Thread(target=server.serve_forever, kwargs={'poll_interval': .01}, daemon=True)
    worker.start()
    try:
        yield f'http://127.0.0.1:{server.server_port}/model'
    finally:
        server.shutdown()
        server.server_close()
        worker.join(timeout=1)


def call_model(url, request, timeout):
    # Bypass environment proxies: the default exercise never leaves loopback.
    opener = build_opener(ProxyHandler({}))
    try:
        req = Request(url, data=json.dumps(request).encode(), headers={'Content-Type': 'application/json'}, method='POST')
        with opener.open(req, timeout=timeout) as response:
            raw = response.read(65537)
        if not raw: raise LabError('empty_response')
        if len(raw) > 65536: raise LabError('response_too_large')
        result = json.loads(raw)
        if not isinstance(result, dict): raise LabError('invalid_schema')
        return result
    except HTTPError as exc:
        raise LabError(f'http_{exc.code}', exc.code in (429, 502, 503, 504)) from exc
    except (TimeoutError, socket.timeout) as exc:
        raise LabError('call_timeout') from exc
    except URLError as exc:
        raise LabError('transport_error') from exc
    except (ValueError, UnicodeError) as exc:
        raise LabError('invalid_json') from exc


def validate(domain, answer):
    if not isinstance(answer, dict): raise LabError('invalid_schema')
    expected = FIXTURES[domain]['expected']
    if set(answer) != set(expected): raise LabError('invalid_schema')
    if domain == 'sw':
        if answer['label'] not in FIXTURES['sw']['allowed_labels']: raise LabError('invalid_label')
        if not isinstance(answer['evidence'], str) or not answer['evidence'] or answer['evidence'] not in FIXTURES['sw']['text']:
            raise LabError('unsupported_evidence')
    if any(answer[k] != value for k, value in expected.items()):
        raise LabError('ground_truth_mismatch')
    return True


def validate_report(summary):
    """Compare a proposed report summary with the independent source fixture."""
    expected = FIXTURES['eda']['report']
    if not isinstance(summary, dict) or set(summary) != set(expected):
        raise LabError('invalid_report_schema')
    if any(type(summary[key]) is not type(value) or summary[key] != value
           for key, value in expected.items()):
        raise LabError('report_source_mismatch')
    return True


def run_task(domain, scenario='normal', mode='agent', max_attempts=3, budget=2.0, call_timeout=.1, output_root=None):
    if max_attempts < 1 or budget <= 0 or call_timeout <= 0:
        raise ValueError('Limits must be positive')
    started = time.monotonic()
    trace, status, reason, answer = [], 'stopped', 'attempt_limit', None
    previous = None
    task_id = uuid.uuid4().hex[:12]
    def record(event, **detail):
        trace.append(dict(event=event, elapsed_ms=round((time.monotonic()-started)*1000, 1), **detail))
    with mock_server() as url:
        for attempt in range(1, max_attempts+1):
            remaining = budget - (time.monotonic()-started)
            if remaining <= 0:
                reason = 'time_budget'; break
            request = dict(domain=domain, mode=mode, scenario=scenario, attempt=attempt, phase='input', input=FIXTURES[domain])
            try:
                record('model.request', attempt=attempt, mode=mode, model='scripted_mock')
                response = call_model(url, request, min(call_timeout, remaining))
                if mode == 'agent' and 'tool' in response:
                    record('tool.request', tool=response['tool'], arguments=response.get('arguments'))
                    observation = tool_call(domain, response['tool'], response.get('arguments'), scenario)
                    record('tool.result', result=observation)
                    remaining = budget - (time.monotonic()-started)
                    if remaining <= 0: raise LabError('time_budget')
                    response = call_model(url, dict(request, phase='observation', tool_result=observation), min(call_timeout, remaining))
                if time.monotonic()-started >= budget: raise LabError('time_budget')
                if 'retry' in response:
                    fingerprint = json.dumps(response, sort_keys=True)
                    if fingerprint == previous: raise LabError('no_progress')
                    previous = fingerprint
                    record('retry.request', attempt=attempt)
                    continue
                validate(domain, response.get('answer'))
                answer = response['answer']
                record('verification', result='passed', scope='fixed_fixture')
                status, reason = 'completed', 'verified'; break
            except LabError as exc:
                record('failure', reason=exc.reason, retryable=exc.retryable)
                reason = exc.reason
                if not exc.retryable:
                    status = 'stopped' if exc.reason in ('time_budget','no_progress','call_timeout') else 'handoff'
                    break
                if attempt == max_attempts: reason = 'attempt_limit'
    record('task.end', status=status, reason=reason)
    report = dict(task_id=task_id, domain=domain, scenario=scenario, mode=mode, model='scripted_mock', status=status, reason=reason, attempts=attempt if 'attempt' in locals() else 0, answer=answer, trace=trace)
    if output_root is not None:
        directory = Path(output_root)/task_id
        directory.mkdir(parents=True, exist_ok=False)
        (directory/'trace.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
        if status == 'completed':
            (directory/'answer.json').write_text(json.dumps(answer, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
        report['output'] = str(directory)
    return report


def selftest():
    cases = [('sw','normal','completed','verified'), ('eda','normal','completed','verified'),
             ('sw','invalid','handoff','unsupported_evidence'), ('eda','invalid','handoff','ground_truth_mismatch'),
             ('eda','wrong-version','handoff','ground_truth_mismatch'), ('eda','denied','handoff','permission_denied'),
             ('eda','missing','handoff','not_found'), ('sw','timeout','stopped','call_timeout'),
             ('sw','transient','completed','verified'), ('sw','empty','handoff','empty_response'),
             ('sw','malformed','handoff','invalid_json'), ('sw','no-progress','stopped','no_progress')]
    with tempfile.TemporaryDirectory() as temp:
        for domain,scenario,status,reason in cases:
            r=run_task(domain,scenario,output_root=temp)
            assert (r['status'],r['reason'])==(status,reason),r
            assert (Path(r['output'])/'answer.json').exists()==(status=='completed')
            assert r['attempts']<=3
        direct=run_task('sw',mode='direct')
        assert direct['status']=='completed' and not any(x['event']=='tool.request' for x in direct['trace'])
        assert run_task('sw','transient',max_attempts=1)['reason']=='attempt_limit'
        assert run_task('sw',budget=1e-9)['reason']=='time_budget'
    assert validate_report(dict(FIXTURES['eda']['report']))
    for change in ({'unit':'ps'}, {'corner':'TT'}, {'slack':.08}, {'version':'r2'}):
        try:
            validate_report(dict(FIXTURES['eda']['report'], **change))
        except LabError as exc:
            assert exc.reason == 'report_source_mismatch'
        else:
            raise AssertionError(f'Invalid report accepted: {change}')
    print(f'PASS: {len(cases)+3} normal/failure/budget checks + 5 report checks; fixed fixtures, no external LLM')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('domain',choices=['sw','eda','selftest'])
    parser.add_argument('--scenario',choices=SCENARIOS,default='normal')
    parser.add_argument('--mode',choices=['direct','agent'],default='agent')
    parser.add_argument('--output',default='out')
    args=parser.parse_args()
    if args.domain=='selftest': selftest(); return
    r=run_task(args.domain,args.scenario,args.mode,output_root=args.output)
    print(json.dumps({k:v for k,v in r.items() if k!='trace'},ensure_ascii=False,indent=2))
    raise SystemExit(0 if r['status']=='completed' else 2)


if __name__=='__main__': main()
