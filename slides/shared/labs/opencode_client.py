"""Optional REAL OpenCode connection; deliberately never run by the offline lab.

Read sw.html first. Requires an already configured server/project and model.
OPENCODE_SERVER_PASSWORD is sent as Basic authentication (username defaults to opencode).
Use --url with loopback HTTP or authenticated HTTPS. Requests can execute tools and use model quota.
"""
import argparse
import base64
import json
import os
from urllib.parse import urlsplit, quote
from urllib.request import Request, build_opener, ProxyHandler
from urllib.error import HTTPError, URLError


def validate_response(data):
    if not isinstance(data,dict) or not isinstance(data.get('info'),dict):raise ValueError('Missing message info')
    if data['info'].get('error'):raise ValueError('Agent reported a message error')
    parts=data.get('parts')
    if not isinstance(parts,list):raise ValueError('Missing parts array')
    texts=[p['text'] for p in parts if isinstance(p,dict) and p.get('type')=='text' and isinstance(p.get('text'),str) and p['text'].strip()]
    if not texts:raise ValueError('No text response; inspect the session and tool events')
    return '\n'.join(texts)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url',default='http://127.0.0.1:4096')
    parser.add_argument('--prompt',required=True)
    parser.add_argument('--timeout',type=float,default=60)
    args=parser.parse_args()
    url=urlsplit(args.url)
    if url.username or url.password or url.query or url.fragment:parser.error('Keep credentials in environment variables')
    if url.scheme not in ('http','https') or not url.hostname:parser.error('Expected HTTP(S) server URL')
    if url.scheme=='http' and url.hostname not in ('127.0.0.1','localhost','::1'):parser.error('Remote server requires HTTPS')
    if not 0 < args.timeout <= 300:parser.error('timeout must be in (0, 300] seconds')
    headers={'Content-Type':'application/json'}
    password=os.environ.get('OPENCODE_SERVER_PASSWORD')
    if password:
        credential=os.environ.get('OPENCODE_SERVER_USERNAME','opencode')+':'+password
        headers['Authorization']='Basic '+base64.b64encode(credential.encode()).decode()
    elif url.hostname not in ('127.0.0.1','localhost','::1'):
        parser.error('Set OPENCODE_SERVER_PASSWORD for a remote server')
    opener=build_opener(ProxyHandler({}))
    def post(path,body):
        request=Request(args.url.rstrip('/')+path,data=json.dumps(body).encode(),headers=headers,method='POST')
        with opener.open(request,timeout=args.timeout) as response:
            raw=response.read(2_000_001)
        if len(raw)>2_000_000:raise ValueError('Response size limit')
        return json.loads(raw)
    session_id=None
    try:
        session=post('/session',{'title':'Course exercise: review the allowed workspace'})
        if not isinstance(session,dict):raise ValueError('Expected session object')
        session_id=session.get('id')
        if not isinstance(session_id,str) or not session_id:raise ValueError('Missing session id')
        print('Session:',session_id,flush=True)
        result=post('/session/'+quote(session_id,safe='')+'/message',{'parts':[{'type':'text','text':args.prompt}]})
        print(validate_response(result))
    except (HTTPError,URLError,TimeoutError,ValueError) as exc:
        print('Request failed:',type(exc).__name__)
        if session_id:
            # A client timeout does not mean the server stopped its tools.
            try:
                if post('/session/'+quote(session_id,safe='')+'/abort',{}) is not True:
                    raise ValueError('Abort was not acknowledged')
                print('Abort acknowledged; inspect session logs and workspace changes.')
            except (HTTPError,URLError,TimeoutError,ValueError):
                print('Abort not confirmed. Stop the session from the server UI and inspect changes.')
        raise SystemExit(2)


if __name__=='__main__':main()
