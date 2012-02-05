/*
   Copyright 2012, Telum Slavonski Brod, Croatia.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   
   This file is part of QFramework project, and can be used only as part of project.
   Should be used for peace, not war :)   
*/

#ifndef _SERVERKO_API_
#define _SERVERKO_API_

typedef void (*TraceOutCallback)( char* pData);

#ifdef __cplusplus
extern "C"
{
#endif

  // called to request server for command execution start, status etc..
  int server_onPushCommand(int reqID, const char* pCmd, int cmdLen);

  // called to get server request data
  // function will fill buffer with data 
  // and return how much data is left 
  int server_onPullCommandRes(int reqID, const char* pResOut, int resLen);

  int server_start( TraceOutCallback traceFunc, TraceOutCallback syncTraceFunc, int port);

  int server_stop();


#ifdef __cplusplus
}
#endif



#endif
