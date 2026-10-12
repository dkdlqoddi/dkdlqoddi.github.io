"""Check offline lab outcomes, the real stdio MCP exchange, and API parsing."""
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
LABS = ROOT/'slides/shared/labs'
sys.path.insert(0, str(LABS))
import lab
from opencode_client import validate_response

lab.selftest()
messages = [
    {'jsonrpc':'2.0','id':1,'method':'initialize','params':{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'course-test','version':'1'}}},
    {'jsonrpc':'2.0','method':'notifications/initialized'},
    {'jsonrpc':'2.0','id':2,'method':'tools/list'},
    {'jsonrpc':'2.0','id':3,'method':'tools/call','params':{'name':'manual_lookup','arguments':{'version':'r1','command':'report_mock_timing'}}},
    {'jsonrpc':'2.0','id':4,'method':'tools/call','params':{'name':'arbitrary_shell','arguments':{'command':'anything'}}},
]
for scenario in ('normal','denied','wrong-version'):
    result = subprocess.run([sys.executable,str(LABS/'mcp_server.py'),'--scenario',scenario],input='\n'.join(json.dumps(m) for m in messages)+'\n',capture_output=True,text=True,timeout=5,check=True)
    replies = [json.loads(line) for line in result.stdout.splitlines()]
    assert len(replies)==4 and [r['id'] for r in replies]==[1,2,3,4]
    assert replies[0]['result']['protocolVersion']=='2025-11-25'
    assert replies[1]['result']['tools'][0]['name']=='manual_lookup'
    actual=replies[2]['result']
    assert actual['isError']==(scenario=='denied')
    if scenario!='denied':
        data=json.loads(actual['content'][0]['text'])
        assert data['version']==('r2' if scenario=='wrong-version' else 'r1')
    assert replies[3]['result']['isError'] is True
invalid_sequence = [
    {'jsonrpc':'2.0','method':'notifications/initialized'},
    {'jsonrpc':'2.0','id':1,'method':'tools/list'},
    {'jsonrpc':'2.0','id':2,'method':'initialize','params':{}},
    {'jsonrpc':'2.0','method':'notifications/initialized'},
    {'jsonrpc':'2.0','id':3,'method':'tools/list'},
]
result = subprocess.run([sys.executable,str(LABS/'mcp_server.py')],input='\n'.join(json.dumps(m) for m in invalid_sequence)+'\n',capture_output=True,text=True,timeout=5,check=True)
replies = [json.loads(line) for line in result.stdout.splitlines()]
assert len(replies)==3 and all('error' in reply for reply in replies), 'Initialization cannot be skipped or bypassed with invalid params'
assert validate_response({'info':{},'parts':[{'type':'text','text':'one'},{'type':'tool','state':{}},{'type':'text','text':'two'}]})=='one\ntwo'
for invalid in [{},{'info':{},'parts':[]},{'info':{'error':{'name':'failure'}},'parts':[{'type':'text','text':'misleading'}]}, {'info':{},'parts':[{'type':'text','text':7}]}]:
    try:
        validate_response(invalid)
    except ValueError:
        pass
    else:
        raise AssertionError(invalid)
print('PASS: MCP initialize/list/call/denial/version mismatch/unknown tool; API empty/error/multipart parsing')

# Exercise the optional client's HTTP contract against a local stub, not a model.
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import threading
import time

class AgentStub(BaseHTTPRequestHandler):
    scenario = 'normal'
    calls = []

    def log_message(self, *_):
        pass

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        self.calls.append((self.path, body))
        if self.path == '/session':
            response = {'id':'course-stub'}
        elif self.path == '/session/course-stub/message':
            assert body == {'parts':[{'type':'text','text':'fixture request'}]}
            if self.scenario == 'timeout':
                time.sleep(.15)
            response = {'info':{}, 'parts':[] if self.scenario == 'empty' else [{'type':'text','text':'fixture answer'}]}
        elif self.path == '/session/course-stub/abort':
            response = self.scenario != 'abort-refused'
        else:
            raise AssertionError(self.path)
        if self.scenario == 'abort-refused' and self.path.endswith('/message'):
            response['info']['error'] = {'name':'fixture failure'}
        payload = json.dumps(response).encode()
        try:
            self.send_response(200)
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except (BrokenPipeError, ConnectionResetError):
            pass

for scenario in ('normal','empty','timeout','abort-refused'):
    AgentStub.scenario = scenario
    AgentStub.calls = []
    server = ThreadingHTTPServer(('127.0.0.1',0), AgentStub)
    worker = threading.Thread(target=server.serve_forever, kwargs={'poll_interval':.01}, daemon=True)
    worker.start()
    try:
        r = subprocess.run([sys.executable,str(LABS/'opencode_client.py'),'--url',f'http://127.0.0.1:{server.server_port}','--timeout','.05','--prompt','fixture request'],capture_output=True,text=True,timeout=5)
        assert r.returncode == (0 if scenario=='normal' else 2), r.stderr
        assert 'fixture answer' in r.stdout if scenario=='normal' else 'fixture answer' not in r.stdout
        assert any(p.endswith('/abort') for p,_ in AgentStub.calls) == (scenario!='normal')
        if scenario in ('empty','timeout'): assert 'Abort acknowledged' in r.stdout
        if scenario == 'abort-refused': assert 'Abort not confirmed' in r.stdout
    finally:
        server.shutdown()
        server.server_close()
        worker.join(timeout=1)
        time.sleep(.16 if scenario=='timeout' else 0)
print('PASS: optional OpenCode client against local stub: message success, empty response, timeout, boolean abort acknowledgement/refusal')
