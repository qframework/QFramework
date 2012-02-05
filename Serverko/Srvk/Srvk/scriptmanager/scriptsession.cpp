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


#include "scriptsession.h"
#include "scriptsessionevent.h"
#include "scriptclient.h"
#include "script.h"
#include "../httpserv/httpconnection.h"
#include <boost/lexical_cast.hpp>

#define EVENT_DELAY 100

namespace qserver
{

  extern void server_traceOut(const char* pData);
#define TRACE_OUT(x) server_traceOut(x)
  extern void system_traceOut(const char* pData);

#define TRACE_OUT(x) server_traceOut(x)
#define TRACE_OUT_INFO(x) mTmpStr = std::string("INFO:") + x;\
  server_traceOut(x)

  ScriptSession::ScriptSession():
  mId(0),
    mPaused(false),
    mScript(NULL),
    mStarted(false)
#ifdef _ODE_SUPPORT_
    ,mpOde(NULL)
#endif
  {
#ifdef _ODE_SUPPORT_
    mpOde = new ServerkoOde();
#endif
  }


  ScriptSession::~ScriptSession()
  {
#ifdef _ODE_SUPPORT_
    if (mpOde)
    {
      delete mpOde;
    }
#endif
    delete mScript;
  }


  void ScriptSession::addClient(const std::string& user, int connid)
  {
    system_traceOut( user.c_str() );
    ScriptClient* pClient = new ScriptClient();
    if (pClient)
    {
      //pClient->enable();
      pClient->setName(user);
      pClient->setConnection(connid);
      HttpConnection::setClient(pClient , connid);
    }
    addSessionClient( user.c_str(), pClient);
    fireClientJoined(user);
  }

  void ScriptSession::startScript()
  {
    // send clients message that game starts

  }

  void ScriptSession::onCardGameEvent( ScriptSessionEvent* pEvent)
  {
    //TRACE_OUT("INFO:ScriptSession::onCardGameEvent");
    // on card event
    switch (pEvent->m_sessionEventType)
    {
    case SCRIPT_SESSION_EVENT_START: onStartScript();return;
    case SCRIPT_SESSION_EVENT_GAME:  onGameEvent(pEvent);return;
    case SCRIPT_SESSION_EXEC_SCRIPT:  onExecScript(pEvent);return;
    case SCRIPT_SESSION_CLIENT_CONNECTED: 
      onClientConnected(pEvent);
      return;
    case SCRIPT_SESSION_CLIENT_RECONNECTED: onClientReConnected(pEvent);return;
    }


  }

  void ScriptSession::broadcastMessage(const char* pMsg)
  {
    //TRACE_OUT_INFO(pMsg);
    if (strstr(pMsg, "{\"gs\":{}"))
    {
      // don;t send empty
      return;
    }
    ScriptClientsMap::iterator iter;
    for (iter = mClients.begin(); iter != mClients.end(); ++iter) 
    { 
      ScriptClient* pClient = iter->second;
      if (pClient->enabled())
      {
        pClient->send2User( pClient->getName(), pMsg);

      }
    } 

  }






  void ScriptSession::removeClient(const char* pName)
  {
    if (removeSessionClient(pName))
    {
      mScript->execOnClientDisConnected( pName );
    }

  }

  bool ScriptSession::load(const std::string& script)
  {
    //v8::Locker locker;
    if (!mScript)
    {
      return false;
    }
    bool res = mScript->loadGameScript(script);
    if (res)
    {

      //mScript->execGameInit();

      //mScript->execGameInfo( mRoomProperties );

    }
    return res;
  }


  void ScriptSession::onStartScript()
  {
    if (!mScript)
    {
      return;
    }

    //srand( (unsigned int)time(NULL) );
    // TODO check for error
    load( mScriptFileName );

    onResumeScript();

  }



  void ScriptSession::startData()
  {
    if (mSendData.size() > 3)
    {
        TRACE_OUT("ERROR: send data limit trigger");
    }
    mSendData.push_back( "" );
  }

  void ScriptSession::appendEvent(int id1, const char* id2, const char* pData)
  {
    //char buff[16384];
    if (mSendData.size() == 0)
    {
      TRACE_OUT("ERROR: appending event on empty data");
      TRACE_OUT((std::string("ERROR:") + std::string(id2)).c_str());
      TRACE_OUT((std::string("ERROR:") + std::string(pData)).c_str());
      return;
    }
    
    //sprintf(buff, "<room><res>event</res><id>%d</id><type>%s</type><data>%s</data></room>", id1, id2, pData );
    std::string buff;
    if (mSendData.back().length() == 0)
    {
      //sprintf(buff, "{\"res\":\"event\",\"id\":\"%d\",\"type\":\"%s\",\"data\":\"%s\"}",id1, id2, pData );
      buff += "{\"res\":\"event\",\"id\":\"";
      buff +=  boost::lexical_cast<std::string>(id1);
      buff += "\",\"type\":\"";
      buff += id2;
      buff += "\",\"data\":\"";
      buff += pData;
      buff += "\"}";

    }else
    {
      //sprintf(buff, ",{\"res\":\"event\",\"id\":\"%d\",\"type\":\"%s\",\"data\":\"%s\"}",id1, id2, pData );
      buff += ",{\"res\":\"event\",\"id\":\"";
      buff +=  boost::lexical_cast<std::string>(id1);
      buff += "\",\"type\":\"";
      buff += id2;
      buff += "\",\"data\":\"";
      buff += pData;
      buff += "\"}";

    }
    mSendData.back() += buff;
  }


  void ScriptSession::sendData()
  {
    if (mSendData.size() == 0)
    {
      TRACE_OUT("ERROR: sending empty data");
      return;
    }

    if ( mSendData.back().length() == 0)
    {
      mSendData.pop_back();
      return;
    }
    /*
    std::string str("<gs>");
    str += mSendData.back();
    str += ("</gs>\r\n");
    */
    std::string str("{\"gs\":{\"room\":[");
    str += mSendData.back();
    str += ("]}}\r\n");
    mSendData.pop_back();

    broadcastMessage( str.c_str() );
  }

  void ScriptSession::eventScript(int id, int delay, const char* pUserData)
  {
    fireScriptEvent(id, delay, pUserData);
  }



  void ScriptSession::getGameInfo(std::string& res, bool appendRoom)
  {
    if (mScript == NULL)
    {
      return;
    }

    mRoomProperties.clear();

    mScript->execGameInfo( mRoomProperties );
    
    if (appendRoom)
    {
      res += "\"room\":[";
    }
      getGamePropertiesString(res);
    if (appendRoom)
    {
      res += "]";
    }

  }



  void ScriptSession::fireScriptEvent(int eventype, int time, const char*  pUserdata)
  {
    ScriptSessionEvent* pEvent = new ScriptSessionEvent();
    if (pEvent)
    {
      if (pUserdata)
      {
        pEvent->mUserData = pUserdata;
      }
      pEvent->m_sessionEventType = SCRIPT_SESSION_EVENT_GAME;
      pEvent->mEventID = eventype;
      pEvent->set(this, SCRIPT_EVENT_DONCE, time);
      mEvents.addEvent(pEvent);
    }
  }



  void ScriptSession::onGameEvent(ScriptSessionEvent* pEvent)
  {
    mScript->execOnGameEvent(pEvent->mEventID, pEvent->mUserData.c_str() );
  }




  void ScriptSession::getGamePropertiesString(std::string& res)
  {

    

  //"{\"res\":\"event\",\"id\":\"%d\",\"type\":\"%s\",\"data\":\"%s\"}"
    //sprintf(sbuff, "\"room\":{\"res\":\"rinfo\",\"id\":\"%d\"",mId);
    //\"room\":
    
    //sprintf(sbuff, "{\"res\":\"rinfo\",\"id\":\"%d\"",mId);
    res += "{\"res\":\"rinfo\",\"id\":\"";
    res +=  boost::lexical_cast<std::string>(mId);
    res += "\"";


    
    //"    <room><res>rinfo</res><id>%d</id>", mId);
    //res += sbuff;

    mScript->execGameInfo( mRoomProperties );
    for (unsigned int a=0; a< mRoomProperties.size(); a++)
    {
      res += ",\"";
      res += mRoomProperties[a].mId;
      res += "\":\"";
      res += mRoomProperties[a].mValue;
      res += "\"";
/*
      sprintf(sbuff, ",\"%s\":\"%s\"", mRoomProperties[a].mId.c_str(), 
        mRoomProperties[a].mValue.c_str());
      res += sbuff;
      */
    }

    //res += "</room>";
    res += "}";
  }

  bool ScriptSession::onPauseScript()
  {
    if (mPaused == false)
    {
      mPaused = true;
      return true;
    }
    else 
      return false;
  }

  bool ScriptSession::onResumeScript()
  {
    if (mPaused)
    {
      mPaused = false;
      return true;
    }
    else 
    {
      return false;
    }
  }

  bool ScriptSession::onStopScript()
  {
    mEvents.deleteAll();
    return true;
  }


  void ScriptSession::processEvents(unsigned int msec)
  {
    if (mPaused)
    {
      mEvents.addOffset(msec);
    }else
    {
      mEvents.process(msec);
    }
  }


  void ScriptSession::clientAppendTag(const char *pUserID, const char* pTag, const char* pValue )
  {
    ScriptClient* pClient = findSessionClient(pUserID);
    if (pClient == NULL)
    {
      return;
    }

    pClient->appendTag(pTag, pValue);

  }

  void ScriptSession::clientStartTag(const char *pUserID, const char* pTag)
  {
    ScriptClient* pClient = findSessionClient(pUserID);
    if (pClient == NULL)
    {
      return;
    }

    pClient->startTag(pTag);
  }

  void ScriptSession::clientStartTags(const char *pUserID, const char* pTag)
  {
    ScriptClient* pClient = findSessionClient(pUserID);
    if (pClient == NULL)
    {
      return;
    }

    pClient->startTags(pTag);
  }

  void ScriptSession::clientAppendSeparator(const char *pUserID)
  {
    ScriptClient* pClient = findSessionClient(pUserID);
    if (pClient == NULL)
    {
      return;
    }

    pClient->appendSeparator();
  }

  void ScriptSession::clientEndTag(const char *pUserID, const char* pTag)
  {
    ScriptClient* pClient = findSessionClient(pUserID);
    if (pClient == NULL)
    {
      return;
    }

    pClient->endTag(pTag);
  }

  void ScriptSession::clientEndTags(const char *pUserID, const char* pTag)
  {
    ScriptClient* pClient = findSessionClient(pUserID);
    if (pClient == NULL)
    {
      return;
    }

    pClient->endTags(pTag);
  }

  void ScriptSession::appendTag(const char* pTag, const char* pValue )
  {
    if (mSendData.size() == 0) return;

      if (pTag && pValue  && strlen(pValue))
      {
        std::string& str = mSendData.back();
        str += "\"";
        str +=pTag;
        str += "\": ";
        str += "\"";
        str += pValue;
        str += "\"";
      }
  }

  void ScriptSession::startTags(const char* pTag)
  {
    if (mSendData.size() == 0) return;
      if (pTag)
      {
        std::string& str = mSendData.back();
        str +="\"";
        str += pTag;
        str += "\": [";
      }
  }

  void ScriptSession::startTag(const char* pTag)
  {
    if (mSendData.size() == 0) return;
      if (pTag)
      {
        std::string& str = mSendData.back();
        if (strcmp(pTag, "undefined") != 0)
        {
          str += "{\"";
          str += pTag;
          str += "\": ";

        }else
        {
          str += "{";
        }
      }

  }

  void ScriptSession::endTag(const char* pTag)
  {
    if (mSendData.size() == 0) return;
      if (pTag)
      {
        std::string& str = mSendData.back();
        str += "}";
      }
  }

  void ScriptSession::endTags(const char* pTag)
  {
    if (mSendData.size() == 0) return;
      if (pTag)
      {
        std::string& str = mSendData.back();
        str += "]";
      }
  }

  void ScriptSession::appendSeparator()
  {
    if (mSendData.size() == 0) return;
        std::string& str = mSendData.back();
        str += ",";
  }


  void ScriptSession::clientStartData(const char* pUserID)
  {
    ScriptClient* pClient = findSessionClient(pUserID);
    if (pClient == NULL)
    {
      return;
    }

    pClient->startData();
  }

  void ScriptSession::clientAppendEvent(const char* pUserID, int id1, const char* id2, const char* pData)
  {
    ScriptClient* pClient = findSessionClient(pUserID);
    if (pClient == NULL)
    {
      return;
    }

    pClient->appendEvent(id1, id2, pData);
  }

  void ScriptSession::clientSendData(const char* pUserID)
  {
    ScriptClient* pClient = findSessionClient(pUserID);
    if (pClient == NULL)
    {
      return;
    }

    pClient->sendData();
  }




  void ScriptSession::fireClientJoined(ScriptClient* pClient)
  {
    // queue command as data
    ScriptSessionEvent* pEvent = new ScriptSessionEvent();
    if (pEvent)
    {
      pEvent->mStrUser = pClient->getName();
      pEvent->m_sessionEventType = SCRIPT_SESSION_CLIENT_CONNECTED;
      pEvent->set(this, SCRIPT_EVENT_DONCE, EVENT_DELAY);
      mEvents.addEvent(pEvent);
    }  
  }

  void ScriptSession::fireClientJoined(std::string name)
  {
    // queue command as data
    ScriptSessionEvent* pEvent = new ScriptSessionEvent();
    if (pEvent)
    {
      pEvent->mStrUser = name;
      pEvent->m_sessionEventType = SCRIPT_SESSION_CLIENT_CONNECTED;
      pEvent->set(this, SCRIPT_EVENT_DONCE, EVENT_DELAY);
      mEvents.addEvent(pEvent);
    }  
  }


  void ScriptSession::fireClientReJoined(ScriptClient* pClient)
  {
    // queue command as data
    ScriptSessionEvent* pEvent = new ScriptSessionEvent();
    if (pEvent)
    {
      pEvent->mStrUser = pClient->getName();
      pEvent->m_sessionEventType = SCRIPT_SESSION_CLIENT_RECONNECTED;
      pEvent->set(this, SCRIPT_EVENT_DONCE, EVENT_DELAY);
      mEvents.addEvent(pEvent);
    }  
  }


  void ScriptSession::onClientConnected(ScriptSessionEvent* pEvent)
  {
    if (pEvent == NULL)
    {
      return;
    }

    //sendClientLayout(pEvent->mStrUser.c_str());
    ScriptClient* pClient = findSessionClient(pEvent->mStrUser.c_str());
    if (pClient)
    {
      pClient->enable();
    }

    mScript->execOnClientConnected( pEvent->mStrUser.c_str() );  
  }

  void ScriptSession::onClientReConnected(ScriptSessionEvent* pEvent)
  {
    if (pEvent == NULL)
    {
      return;
    }

    mScript->execOnClientReConnected( pEvent->mStrUser.c_str() );  

  }


  void ScriptSession::onClientData(const char* pUser, const char* pData)
  {
    mScript->execOnClientData( pUser, pData);
  }

  
  void ScriptSession::handlePacket(ScriptRequest* req)
  {
    switch ( req->mType )
    {
    case ScriptRequest::RESTART:
      // client command
      reloadScript();
      mStarted = true;
      break;
    case ScriptRequest::TIMEREVENT:
      {
        if (mStarted)
          processEvents(req->mIntData);
      }
      break;

    case ScriptRequest::USER_CONNECTED:
      {
        addClient(req->mStrUser, req->mIntData);
      }
      break;
    case ScriptRequest::USER_DISCONNECTED:
      {
        removeClient(req->mStrUser.c_str() );
      }
      break;
    case ScriptRequest::DISCONNECT_CLIENT:
      {
        ScriptClient*   pClient = findSessionClient(req->mStrUser.c_str());
        if (pClient)
        {
          HttpConnection::stop( pClient->getConnection() );
        }

      }
      break;

    case ScriptRequest::USER_DATA:
      {
        onClientData(req->mStrUser.c_str() , req->mStrData.c_str() );
      }
      break;

    case ScriptRequest::SCRIPT_ROOM_INFO:
      {
        onRoomInfo(req->mStrData.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_CLIENT_APPEND_TAG:
      {
        clientAppendTag(req->mStrUser.c_str(), req->mStrData.c_str(), req->mStrData2.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_CLIENT_START_TAG:
      {
        clientStartTag(req->mStrUser.c_str(), req->mStrData.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_CLIENT_END_TAG:
      {
        clientEndTag(req->mStrUser.c_str(), req->mStrData.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_CLIENT_START_TAGS:
      {
        clientStartTags(req->mStrUser.c_str(), req->mStrData.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_CLIENT_END_TAGS:
      {
        clientEndTags(req->mStrUser.c_str(), req->mStrData.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_CLIENT_APPEND_SEPARATOR:
      {
        clientAppendSeparator(req->mStrUser.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_APPEND_TAG:
      {
        appendTag(req->mStrData.c_str(), req->mStrData2.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_START_TAG:
      {
        startTag(req->mStrData.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_END_TAG:
      {
        endTag(req->mStrData.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_START_TAGS:
      {
        startTags(req->mStrData.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_END_TAGS:
      {
        endTags(req->mStrData.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_APPEND_SEPARATOR:
      {
        appendSeparator();
      }
      break;
    case ScriptRequest::SCRIPT_START_DATA:
      {
        startData(); 
      }
      break;
    case ScriptRequest::SCRIPT_APPEND_EVENT:
      {
        appendEvent(req->mIntData, req->mStrData.c_str(), req->mStrData2.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_SEND_DATA:
      {
        sendData();
      }
      break;
    case ScriptRequest::SCRIPT_CLIENT_START_DATA:
      {
        clientStartData(req->mStrUser.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_CLIENT_APPEND_EVENT:
      {
        clientAppendEvent(req->mStrUser.c_str() , req->mIntData, req->mStrData.c_str(), req->mStrData2.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_CLIENT_SEND_DATA:
      {
        clientSendData(req->mStrUser.c_str());
      }
      break;
    case ScriptRequest::SCRIPT_EVENT:
      {
        eventScript(req->mIntData, req->mIntData2, req->mStrData.c_str()); 
      }
      break;
    case ScriptRequest::SCRIPT_EXEC:
      {
        execScript(req->mIntData, req->mStrData.c_str()); 
      }
      break;
#ifdef _ODE_SUPPORT_
    case ScriptRequest::ODE_INIT:
      {
          if (mpOde == NULL)
          {
            mpOde = new ServerkoOde();
          }
          mpOde->init(req->mStrData);
      }
      break;
    case ScriptRequest::ODE_CREATEPLANE:
      {
          if (mpOde != NULL)
          {
            mpOde->createPlane(req->mStrUser , req->mStrData, req->mStrData2, req->mStrData3, req->mStrData4);
          }
      }
      break;
    case ScriptRequest::ODE_CREATESPHERE:
      {
          if (mpOde != NULL)
          {
            mpOde->createSphere(req->mStrUser , req->mStrData, req->mStrData2);
          }
      }
      break;
    case ScriptRequest::ODE_SETBODYPOSITION:
      {
          if (mpOde != NULL)
          {
            mpOde->setBodyPosition(req->mStrUser , req->mStrData, req->mStrData2, req->mStrData3);
          }
      }
      break;
#endif
    }


  }





  ScriptClient* ScriptSession::findSessionClient(const char* pName)
  {
    //scoped_lock lk(mutex_client);
    {
      ScriptClientsMap::iterator iter = mClients.find(pName);
      if (iter != mClients.end() )
      {
        return iter->second;
      } 
    }
    return NULL;
  }

  bool ScriptSession::addSessionClient(const char* pName, ScriptClient* pClient)
  {
      if (findSessionClient(pName) == NULL && pClient)
      {
        //scoped_lock lk(mutex_client);
        {

          mClients.insert( ScriptClientsPair(pName, pClient) );
          return true;
        }
      }
    return false;
  }

  bool ScriptSession::removeSessionClient(const char* pName)
  {
    //scoped_lock lk(mutex_client);
    ScriptClient* pClient = findSessionClient(pName);
    if(pClient)
    {
      ScriptClientsMap::iterator iter = mClients.find(pName);
      mClients.erase( iter);
      delete pClient;
      return true;
    }
    return false;
  }


  void ScriptSession::reloadScript()
  {
    // clear all script content - reload 
    onPauseScript();

    // clear all sending flags
    // let script decides again who can recieve
    ScriptClientsMap::iterator iter;

    onStopScript();

    if (mScript == NULL)
    {
      mScript = Script::get(mScriptFileName.c_str());
      mScript->setWDir( mWDir);
      mScript->setParent(this);
      mScript->init();
    }
    
    mPaused = false;
    ScriptSessionEvent* pEvent = new ScriptSessionEvent();
    if (pEvent)
    {
      pEvent->m_sessionEventType = SCRIPT_SESSION_EVENT_START;
      pEvent->mEventID = 0;
      pEvent->set(this, SCRIPT_EVENT_DONCE, 10);
      mEvents.addEvent(pEvent);
    }
    std::string namescr("appName='");
    namescr += mName;
    namescr += "';";
    mScript->execScript(namescr);
  }
  
  void ScriptSession::onRoomInfo(const char* pInfo)
  {
    mRoomProperties.clear();

    char* retstr = strdup(pInfo);
    char* name  = strtok( retstr, ":\t");
    char* val  = strtok( NULL, ":\t");
    StringString prop;
    while (name && val)
    {
      prop.mId = name;
      prop.mValue = val;
      mRoomProperties.push_back(prop);
      name  = strtok( NULL, ":\t");
      val  = strtok( NULL, ":\t");
    }

    free(retstr);
  }

  void ScriptSession::execScript(int  delay, const char* pScript)
  {
    ScriptSessionEvent* pEvent = new ScriptSessionEvent();
    if (pEvent)
    {
      if (pScript)
      {
        pEvent->mUserData = pScript;
      }
      pEvent->m_sessionEventType = SCRIPT_SESSION_EXEC_SCRIPT;
      pEvent->mEventID = 0;
      pEvent->set(this, SCRIPT_EVENT_DONCE, delay);
      mEvents.addEvent(pEvent);
    }
  }
  
  void ScriptSession::onExecScript( ScriptSessionEvent* pEvent)
  {
    if (mScript)
    {
      mScript->execScript(pEvent->mUserData);
    }
  }

} //namespace qserver

