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

#include "serverko.h"
#include "../threadmanager/threadmanager.h"
#include "../servermanager/servermanager.h"
#include <boost/lexical_cast.hpp>
#include <string>


int server_onPushCommand(int reqID, const char* pCmd, int cmdLen)
{

  //threadManager.putScriptRequest( ScriptRequest::COMMAND, pCmd, cmdLen, 0 );

  //pushes to server command
  /*
  qserver::TcpPacket* pPacket = new qserver::TcpPacket();
  if (pPacket)
  {
    if (cmdLen > 0)
    {
      pPacket->mStrData = std::string(pCmd, cmdLen);
    }else
    {
      pPacket->mStrData = std::string(pCmd);
    }
    //pPacket->mpConnection = NULL;
    
    pPacket->mReqId = reqID;

    qserver::TcpPacket_ptr packet(pPacket);
    qserver::threadManager.putIncomingPacket(packet);

  }*/
  return 0;
}

int server_onPullCommandRes(int reqID, const char* pResOut, int resLen)
{
  // pull until we have results
  // return will be how much data is left
  return qserver::threadManager.mScriptManager.getBufferData(reqID,(char*)pResOut, resLen);
}


int server_start( TraceOutCallback traceFunc, TraceOutCallback sysTraceFunc, int port)
{
  qserver::threadManager.mServerManager.create(traceFunc , sysTraceFunc);
  qserver::threadManager.mServerManager.start();
  return 1;
}


int server_stop()
{
  qserver::threadManager.mServerManager.stop();
  return 1;
}

