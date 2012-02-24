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

#ifndef SCRIPT_SESSION_H
#define SCRIPT_SESSION_H

#include <map>
#include <string>
#include <queue>
#include <deque>

#include "scriptrequest.h"
#include "scriptsessionevent.h"
#include "scriptevents.h"
#include "script.h"
#include <boost/thread/thread.hpp>
#include <boost/thread/mutex.hpp>
#include <boost/thread/condition.hpp>
#ifdef _ODE_SUPPORT_
  #include "../ode/serverkoode.h"
#endif

namespace qserver
{

  /** 
 * ResultDataSinfo structure
 * Stores data for server info request
 */
#ifdef _ODE_SUPPORT_
  class ServerkoOde;
#endif

class ResultDataSinfo
{
public:

  /** 
   * Name of script
   */
  std::string   mScript;

  /** 
   * Room name
   */
  std::string   mGName;

  /** 
   * NUmber of players
   */
  std::string   mPlayers;

  /** 
   * Id of room ??
   */
  std::string   mId;

  /** 
   * Status of room ??
   */
  std::string   mStatus;
};




class Script;
class ScriptClient;
class ScriptLanguage;
class HttpConnection;

typedef std::map<std::string, ScriptClient*> ScriptClientsMap;
typedef std::pair<std::string, ScriptClient*> ScriptClientsPair;

class ScriptSession
{
public:

  ScriptSession();
  ~ScriptSession();


  bool load(const std::string& script);
  void startScript();
  void onCardGameEvent( ScriptSessionEvent* pEvent);

  void fireScriptEvent(int eventype, int time, const char* pUserData = NULL);
  void removeClient(const char* pName);
    void broadcastMessage(const char* pMsg);
  
  void onStartScript();

  void onRoomInfo(const char* pInfo);
  void onGameEvent(ScriptSessionEvent* pEvent);

  void startData();
  void appendEvent(int id1, const char* id2, const char* pData);
  void sendData();

  void clientStartData(const char* pUserID);
  void clientAppendEvent(const char* pUserID, int id1, const char* id2, const char* pData);
  void clientSendData(const char* pUserID);
  void clientAppendTag(const char *pUserID, const char* pTag, const char* pValue );
  void clientStartTag(const char *pUserID, const char* pTag);
  void clientEndTag(const char *pUserID, const char* pTag);
  void clientStartTags(const char *pUserID, const char* pTag);
  void clientEndTags(const char *pUserID, const char* pTag);
  void clientAppendSeparator(const char *pUserID); 
  void appendTag(const char* pTag, const char* pValue );
  void startTag(const char* pTag);
  void endTag(const char* pTag);
  void startTags(const char* pTag);
  void appendSeparator();
  void endTags(const char* pTag);

  void eventScript(int id, int delay, const char* pUserData);
  void getGameInfo(std::string& res, bool appendRoom);
  
  
  void getGamePropertiesString(std::string& res);

  void setID(unsigned int id){ mId = id;}
  int getID(){ return mId;}
  bool onStopScript();
  bool onPauseScript();
  bool onResumeScript();
  void processEvents(unsigned int msec);
  void fireClientJoined(ScriptClient* pClient);
  void fireClientReJoined(ScriptClient* pClient);
  void onClientData(const char* pUser, const char* pData);
  
  void handlePacket(ScriptRequest* req);
  
  //

  ScriptClient*   findSessionClient(const char* pName);
  bool            addSessionClient(const char* pName, ScriptClient* pClient);
  bool            removeSessionClient(const char* pName);

  void            setScriptFile(const char* pWDir, const char* pFile) { mWDir = pWDir ; mScriptFileName = pFile; }

  void            reloadScript();
  Script*         getScript(){return mScript;}

  void fireClientJoined(std::string name);
  void addClient(const std::string& user, int connid);

  void execScript(int  delay, const char* pScript);
  void onExecScript( ScriptSessionEvent* pEvent);
  bool started() { return mStarted; }
  void setName(const char* name) { mName = name;}

  Script::Type getType();

protected:
  void onClientConnected(ScriptSessionEvent* pEvent);
  void onClientReConnected(ScriptSessionEvent* pEvent);

protected:

    
  Script*                        mScript;
  std::string                     mScriptFileName;
  std::string                    mName;
  std::string                     mWDir;
protected:

  ScriptEvents                     mEvents;
  ScriptClientsMap               mClients;

  std::vector<StringString>      mRoomProperties;


  std::string                    mTmpStr;
  int                            mId;
  bool                           mPaused;


  std::deque<std::string>		    mSendData;
  bool                          mStarted;


/** 
   * thread lock
   */
  typedef boost::mutex::scoped_lock   scoped_lock;


  /** 
   * mutex for buffer adding
   */
  boost::mutex        mutex_client;

#ifdef _ODE_SUPPORT_
  ServerkoOde*                  mpOde;
#endif

};

} //namespace qserver



#endif // _CARD_GAME_

