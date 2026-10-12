"""Minimal MCP 2025-11-25 stdio server. Fictional manuals only; no LLM.

python mcp_server.py
python mcp_server.py --scenario denied
Newline-delimited JSON-RPC only on stdout; configured clients launch this process.
"""
import argparse
import json
import sys
from lab import LabError, tool_call

PROTOCOL='2025-11-25'
TOOL={'name':'manual_lookup','description':'Look up the fictional MockSTA r1 manual, not a commercial EDA tool.',
      'inputSchema':{'type':'object','properties':{'version':{'type':'string'},'command':{'type':'string'}},
                     'required':['version','command'],'additionalProperties':False}}


def serve(scenario):
    initialized=False
    negotiated=False
    for line in sys.stdin:
        id=None
        try:
            request=json.loads(line)
            if not isinstance(request,dict) or request.get('jsonrpc')!='2.0' or not isinstance(request.get('method'),str):
                raise ValueError('Invalid JSON-RPC request')
            id=request.get('id');method=request['method'];params=request.get('params',{})
            if 'id' not in request:
                # MCP initialization completion and other notifications have no response.
                if method=='notifications/initialized' and negotiated: initialized=True
                continue
            if method=='initialize':
                initialized=negotiated=False
                if not isinstance(params,dict) or not isinstance(params.get('protocolVersion'),str) or not isinstance(params.get('capabilities'),dict) or not isinstance(params.get('clientInfo'),dict):
                    raise ValueError('Invalid initialize parameters')
                if not all(isinstance(params['clientInfo'].get(key),str) for key in ('name','version')):
                    raise ValueError('Invalid clientInfo')
                negotiated=True
                result={'protocolVersion':PROTOCOL,'capabilities':{'tools':{}},'serverInfo':{'name':'mock-eda-manual','version':'1.0.0'}}
            elif method=='ping': result={}
            elif not initialized:
                raise ValueError('Complete initialize and notifications/initialized first')
            elif method=='tools/list': result={'tools':[TOOL]}
            elif method=='tools/call':
                if not isinstance(params,dict):raise ValueError('params must be an object')
                try:
                    result_data=tool_call('eda',params.get('name'),params.get('arguments'),scenario)
                    result={'content':[{'type':'text','text':json.dumps(result_data,ensure_ascii=False)}],'isError':False}
                except LabError as exc:
                    result={'content':[{'type':'text','text':exc.reason}],'isError':True}
            else:
                print(json.dumps({'jsonrpc':'2.0','id':id,'error':{'code':-32601,'message':'Method not found'}}),flush=True)
                continue
            response={'jsonrpc':'2.0','id':id,'result':result}
        except json.JSONDecodeError:
            response={'jsonrpc':'2.0','id':None,'error':{'code':-32700,'message':'Parse error'}}
        except (ValueError,TypeError,KeyError):
            response={'jsonrpc':'2.0','id':id,'error':{'code':-32602,'message':'Invalid request or parameters'}}
        print(json.dumps(response,ensure_ascii=False),flush=True)


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--scenario',choices=['normal','missing','denied','wrong-version'],default='normal')
    serve(parser.parse_args().scenario)
