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

#include "threadmanager.h"

#include "../scriptmanager/scriptsession.h"
#include "../scriptmanager/scriptclient.h"
#include "../scriptmanager/scriptscore.h"


namespace qserver
{

void server_traceOut(const char* pData)
{
  threadManager.trace(pData);
}

void system_traceOut(const char* pData)
{
  threadManager.systrace(pData);
}


ThreadManager threadManager;


void timerServiceRun()
{
  threadManager.mTimerService.run();
}


void serverManagerRun()
{
  threadManager.mServerManager.run();
}


void scriptManagerRun()
{
  threadManager.mScriptManager.run();
}

ThreadManager::ThreadManager() : 
    mpServerManagerThrd(NULL), 
    mpOutCallback(NULL), 
    mpScriptManagerThrd(NULL),
    mpTimerServiceThrd(NULL)
{
  puts (" ThreadManager ok ");
}

ThreadManager::~ThreadManager()
{
  delete mpServerManagerThrd;
  delete mpScriptManagerThrd;
  delete mpTimerServiceThrd;

}


void ThreadManager::start()
{
  system_traceOut( "--- starting threads ----");
  mpScriptManagerThrd = new boost::thread(&scriptManagerRun);
  system_traceOut( "    script thread OK ");
  mpTimerServiceThrd  = new boost::thread(&timerServiceRun);
  system_traceOut( "    timer thread OK ");
  mpServerManagerThrd = new boost::thread(&serverManagerRun);
  system_traceOut( "    server thread OK ");

}


void ThreadManager::trace( const char* pMsg)
{
  if (mpOutCallback)
  {
    mpOutCallback(pMsg);
  }
}

void ThreadManager::systrace( const char* pMsg)
{
  if (mpOutCallback)
  {
    mpSysOutCallback(pMsg);
  }
}


void ThreadManager::setTrace( ThreadTraceOutCallback pOutCallback)
{
  mpOutCallback = pOutCallback;
}

void ThreadManager::setSysTrace( ThreadTraceOutCallback pOutCallback)
{
  mpSysOutCallback = pOutCallback;
}


void ThreadManager::putScriptRequest( ScriptRequest::ScriptRequestType type, 
                                      const char* pCmd, int size, int intdata )
{
  //scoped_lock lk(mutex_req);

  ScriptRequest* pReq = new ScriptRequest();
  if (pCmd)
  {
    if (size <= 0)
    {
      pReq->mStrData = std::string(pCmd);
    }else
    {
      pReq->mStrData = std::string(pCmd, size);
    }
  }

  pReq->mType = type;
  pReq->mIntData = intdata;
  mScriptManager.put(pReq);
  
}


bool ThreadManager::shutdownScriptSession(int scriptID)
{
  // TODO shutdown
  return false;
}


void ThreadManager::putSessionRequest( int id, ScriptRequest::ScriptRequestType type, const char* pCmd, int size, int intdata )
{
  //scoped_lock lk(mutex_req);

  ScriptRequest* pReq = new ScriptRequest();
  if (pCmd)
  {
    if (size <= 0)
    {
      pReq->mStrData = std::string(pCmd);
    }else
    {
      pReq->mStrData = std::string(pCmd, size);
    }
  }

  pReq->mType = type;
  pReq->mIntData = intdata;
  pReq->mScriptRoute = id;
  mScriptManager.put(pReq);
}

void ThreadManager::putScriptRequest(ScriptRequest::ScriptRequestType type, 
                                     const char* pUser, int roomid, int intdata, 
                                     const char* pVal1, const char* pVal2, const char* pVal3)
{
  //scoped_lock lk(mutex_req);

  ScriptRequest* pReq = new ScriptRequest();
  if (pUser)pReq->mStrUser = std::string(pUser);
  
  if (pVal1)pReq->mStrData = std::string(pVal1);
  if (pVal2)pReq->mStrData2 = std::string(pVal2);
  if (pVal3)pReq->mStrData3 = std::string(pVal3);
  

  pReq->mType = type;

  pReq->mIntData = intdata;
  pReq->mScriptRoute = roomid;
  mScriptManager.put(pReq);

}

void ThreadManager::putScriptRequest(ScriptRequest::ScriptRequestType type, 
                                     const char* pUser, int roomid, 
                                     const char* pVal1, const char* pVal2, const char* pVal3, const char* pVal4)
{
  //scoped_lock lk(mutex_req);

  ScriptRequest* pReq = new ScriptRequest();
  if (pUser)pReq->mStrUser = std::string(pUser);
  
  if (pVal1)pReq->mStrData = std::string(pVal1);
  if (pVal2)pReq->mStrData2 = std::string(pVal2);
  if (pVal3)pReq->mStrData3 = std::string(pVal3);
  if (pVal4)pReq->mStrData4 = std::string(pVal4);
  

  pReq->mType = type;
  pReq->mScriptRoute = roomid;
  mScriptManager.put(pReq);

}

void ThreadManager::putScriptRequest(ScriptRequest::ScriptRequestType type, const char* pUser, int roomid, 
                          int intdata, int intdata2, const char* pVal1)
{
  //scoped_lock lk(mutex_req);

  ScriptRequest* pReq = new ScriptRequest();
  if (pUser)pReq->mStrUser = std::string(pUser);
  
  if (pVal1)pReq->mStrData = std::string(pVal1);
  

  pReq->mType = type;

  pReq->mIntData = intdata;
  pReq->mIntData2 = intdata2;
  pReq->mScriptRoute = roomid;

  mScriptManager.put(pReq);
}


void ThreadManager::putUserConnected(const std::string& user, int connection, int roomid)
{
  //scoped_lock lk(mutex_req);

  mScriptManager.userConnected(user,connection, roomid);
  
}

void ThreadManager::putUserDisConnected(const std::string& user, int roomid)
{
  //scoped_lock lk(mutex_req);

  mScriptManager.userDisConnected(user, roomid);
}

void ThreadManager::putUserData(const std::string& user, const std::string& data,int roomid)
{
  //scoped_lock lk(mutex_req);

  mScriptManager.userData(user, data, roomid);
}



} //namespace qserver

