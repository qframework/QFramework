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

#ifndef _THREAD_MANAGER_H_
#define _THREAD_MANAGER_H_


#include <boost/thread/mutex.hpp>
#include <boost/thread/thread.hpp>

#include "../servermanager/servermanager.h"

#include "../scriptmanager/scriptmanager.h"
#include "../scriptmanager/scriptrequest.h"
#include "../scriptmanager/scriptsession.h"
#include "../httpserv/httpserver.h"

#include "timerservice.h"

#include <vector>

namespace qserver
{

typedef void (*ThreadTraceOutCallback)( const char* pData);

class ThreadManager
{

public:
  ThreadManager();
  ~ThreadManager();

  void start();

  ServerManager   mServerManager;
  ScriptManager   mScriptManager;
  TimerService    mTimerService;
  boost::thread*  mpServerManagerThrd;
  boost::thread*  mpScriptManagerThrd;
  boost::thread*  mpTimerServiceThrd;


  void putScriptRequest( ScriptRequest::ScriptRequestType type, 
    const char* pCmd, int size, int intdata = 0);
  

  void putSessionRequest( int id, ScriptRequest::ScriptRequestType type, 
          const char* pCmd, int size, int intdata = 0);

  void trace( const char* pMsg);
  void systrace( const char* pMsg);
  void setTrace( ThreadTraceOutCallback pOutCallback);
  void setSysTrace( ThreadTraceOutCallback pOutCallback);

  bool shutdownScriptSession(int scriptID);
  void putUserConnected(const std::string& user, int connection,  int roomid);
  void putUserDisConnected(const std::string& user, int roomid);
  void putUserData(const std::string& user, const std::string& data,int roomid);
  void putScriptRequest(ScriptRequest::ScriptRequestType type, const char* pUser, int roomid, 
                            int data, const char* pVal1, const char* pVal2, const char* pVal3);
  void putScriptRequest(ScriptRequest::ScriptRequestType type, const char* pUser, int roomid, 
                            int data, int data2, const char* pVal1);

  void putScriptRequest(ScriptRequest::ScriptRequestType type, const char* pUser, int roomid, 
                            const char* pVal1, const char* pVal2, const char* pVal3, const char* pVal4);

private:

  typedef boost::mutex::scoped_lock   scoped_lock;
  boost::mutex                        mutex_req;


  ThreadTraceOutCallback      mpOutCallback;
  ThreadTraceOutCallback      mpSysOutCallback;
};

extern ThreadManager threadManager;
extern void server_traceOut(const char* pData);
extern void system_traceOut(const char* pData);

} //namespace qserver


#endif



