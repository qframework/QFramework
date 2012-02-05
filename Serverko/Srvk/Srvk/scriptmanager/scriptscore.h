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


#ifndef _SCRIPTS_CORE_H_
#define _SCRIPTS_CORE_H_

#include "../servermanager/serverclient.h"
#include "scriptclients.h"
#include "scriptsplayer.h"
#include "scriptevents.h"
#include "scriptsession.h"
#include <boost/asio.hpp>
#include <boost/date_time/posix_time/posix_time.hpp>


namespace qserver
{

class ScriptClients;
class ScriptClient;
class ProtocolRequest;
class ProtocolResult;

class ScriptsCore : public ServerClient
{
public:
  ScriptsCore();
  virtual ~ScriptsCore();

  //void getGameInfo(std::string& info , int id);
  void trace(const char* pTrace); // TODO - helper
  void executeCmd(ProtocolResult& result, const ProtocolRequest& req);

  int start();
  void onEventConnected( const char* pLogin, long connectionid , const std::string& screen ,const std::string& language,ProtocolResult& result );
  void onConfig(const ProtocolRequest& req);
  void doTick(unsigned int msec);
  int addScript(ScriptSession* pScript);
  ScriptSession* getScript(int id);
  ScriptClient*     getClient(const char* pUser);
  void getInfo(std::string& info);
  void getRoomInfo(int roomid, std::string& info);
  int   getScriptsSize() { return (int)mScripts.size(); } 
protected:

  void clear();

  
  int close();
  

  virtual void stop();
  void setClientName(unsigned int mId, const char* pLogin); 
  
  
  void onClientDisconnect(ProtocolResult& result, const ProtocolRequest& req);
  void doInfo();

protected:


  ScriptEvents                   mEvents;


  std::vector<ScriptSession*>       mScripts;      // TODO - vector of games
  std::string               mServerID;
  unsigned int              mInfoEvent;
  
};

} //namespace qserver


#endif
