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


#include "script.h"

#include "scriptscore.h"
#include "../serverapi/serverko.h"
#include "../threadmanager/threadmanager.h"
#include "../httpserv/httpserver.h"
#include "../httpserv/dataselector.h"
//#include "../httpserv/pqdataselector.h"
#include "scriptsession.h"

#include "jsscript.h"
#include "pyscript.h"



namespace qserver
{

  extern void server_traceOut(const char* pData);
#define TRACE_OUT(x) server_traceOut(x)



Script::Script():
  mpParent(NULL)
{
}

Script::~Script()
{
}



void Script::setParent(ScriptSession* pParent)
{
  mpParent = pParent;
}

void Script::onRoomInfo(const char* pInfo)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_ROOM_INFO, 
                                      NULL, mpParent->getID(), 0, 
                                     pInfo, NULL, NULL);
  //mpParent->onRoomInfo(pInfo);
}


void Script::startData()
{
  //mpParent->startData(); 
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_START_DATA, 
                                      NULL, mpParent->getID(), 0, 
                                     NULL, NULL, NULL);
}


void Script::appendEvent(int id1, const char* id2,  const char* pData )
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_APPEND_EVENT, 
                                      NULL, mpParent->getID(), id1, 
                                     id2, pData, NULL);
  //mpParent->appendEvent(id1, id2, pData);
}

void Script::clientAppendTag(const char *pUserID, const char* pTag, const char* pValue )
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_CLIENT_APPEND_TAG, 
                                      pUserID, mpParent->getID(), 0, 
                                     pTag, pValue, NULL);
  //mpParent->clientAppendTag(pUserID, pTag, pValue);
}

void Script::clientAppendSeparator(const char *pUserID )
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_CLIENT_APPEND_SEPARATOR, 
                                      pUserID, mpParent->getID(), 0, 
                                     NULL, NULL, NULL);
  //mpParent->clientAppendSeparator(pUserID);
}

void Script::clientStartTag(const char *pUserID, const char* pTag)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_CLIENT_START_TAG, 
                                      pUserID, mpParent->getID(), 0, 
                                     pTag, NULL, NULL);

  //mpParent->clientStartTag(pUserID, pTag);
}

void Script::clientEndTag(const char *pUserID, const char* pTag)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_CLIENT_END_TAG, 
                                      pUserID, mpParent->getID(), 0, 
                                     pTag, NULL, NULL);
  //mpParent->clientEndTag(pUserID, pTag);
}

void Script::clientStartTags(const char *pUserID, const char* pTag)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_CLIENT_START_TAGS, 
                                      pUserID, mpParent->getID(), 0, 
                                     pTag, NULL, NULL);
  //mpParent->clientStartTags(pUserID, pTag);
}

void Script::clientEndTags(const char *pUserID, const char* pTag)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_CLIENT_END_TAGS, 
                                      pUserID, mpParent->getID(), 0, 
                                     pTag, NULL, NULL);
//  mpParent->clientEndTags(pUserID, pTag);
}


void Script::appendTag(const char* pTag, const char* pValue )
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_APPEND_TAG, 
                                      NULL, mpParent->getID(), 0, 
                                     pTag, pValue, NULL);
  //mpParent->appendTag(pTag, pValue);
}


void Script::startTag(const char* pTag)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_START_TAG, 
                                      NULL, mpParent->getID(), 0, 
                                     pTag, NULL, NULL);
  //mpParent->startTag(pTag);
}

void Script::endTag(const char* pTag)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_END_TAG, 
                                      NULL, mpParent->getID(), 0, 
                                     pTag, NULL, NULL);
  //mpParent->endTag(pTag);
}

void Script::startTags(const char* pTag)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_START_TAGS, 
                                      NULL, mpParent->getID(), 0, 
                                     pTag, NULL, NULL);
  //mpParent->startTags(pTag);
}

void Script::endTags(const char* pTag)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_END_TAGS, 
                                      NULL, mpParent->getID(), 0, 
                                     pTag, NULL, NULL);
  //mpParent->endTags(pTag);
}

void Script::appendSeparator()
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_APPEND_SEPARATOR, 
                                      NULL, mpParent->getID(), 0, 
                                     NULL, NULL, NULL);
  //mpParent->appendSeparator();
}


void Script::sendData()
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_SEND_DATA, 
                                      NULL, mpParent->getID(), 0, 
                                     NULL, NULL, NULL);
  //mpParent->sendData(); 
}



void Script::clientStartData(const char *pUserID)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_CLIENT_START_DATA, 
                                      pUserID, mpParent->getID(), 0, 
                                     NULL, NULL, NULL);
  //mpParent->clientStartData(pUserID); 
}


void Script::clientAppendEvent(const char *pUserID, int id1, const char* id2,  const char* pData )
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_CLIENT_APPEND_EVENT, 
                                      pUserID, mpParent->getID(), id1, 
                                     id2, pData, NULL);
  //mpParent->clientAppendEvent(pUserID, id1, id2, pData);
}



void Script::clientSendData(const char *pUserID)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_CLIENT_SEND_DATA, 
                                      pUserID, mpParent->getID(), 0, 
                                     NULL, NULL, NULL);
  //mpParent->clientSendData(pUserID); 
}


void Script::disconnectClient(const char *pUserID)
{
  threadManager.putScriptRequest(ScriptRequest::DISCONNECT_CLIENT, 
                                      pUserID, mpParent->getID(), 0, 
                                     NULL, NULL, NULL);

}


void Script::eventScript(int id, int delay, const char* pUserdata)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_EVENT, 
                                      NULL, mpParent->getID(), id, delay, pUserdata);

  //mpParent->eventScript(id, delay, pUserdata); 
}

void Script::exec(int delay, const char* pScript)
{
  threadManager.putScriptRequest(ScriptRequest::SCRIPT_EXEC, 
                                      NULL, mpParent->getID(), delay, 0, pScript);
  //mpParent->execScript(delay, pScript); 
}




void Script::startTcp(const char* pPort)
{
  // TODO
  if (pPort && strlen(pPort) > 1)
  {
  	//TcpServer::run(pPort);
  }

}


void Script::startHttp(const char* pPort)
{
  // TODO
  HttpServer::start(pPort);

}




void Script::setDB(const char* pStr)
{
  //DataSelector::set("pq");
  //PQDataSelector::setConnString(pStr);
}


void Script::restartScript()
{
  // create request to restart script
  
  //threadManager.putScriptRequest( ScriptRequest::RESTART, 0,0, 0,mpParent->getID() );
  //threadManager.mScriptManager.restartScriptSession( mpParent);
}

void Script::scriptAdd(const char* pWDir, const char* pScript, const char* pName)
{

  threadManager.mScriptManager.spawnScriptSession( pWDir , pScript , pName);
}


Script* Script::get(const char* pScript)
{
  if (!pScript)
  {
    return NULL;
  }

  if (strstr(pScript, ".js"))
  {
    return new JSScript();
  }else if(strstr(pScript, ".py"))
  {
    return new PYScript();
  }
  return NULL;
}

Script* Script::getScript(int id)
{
  ScriptSession* pSession = threadManager.mScriptManager.getScript(id);
  if (pSession)
  {
    return pSession->getScript();
  }
  return NULL;
}

void Script::odeInit(const char* g)
{

  threadManager.putScriptRequest(ScriptRequest::ODE_INIT, 
                                      NULL, mpParent->getID(), g, NULL, NULL, NULL);
}

void Script::odeCreatePlane(const char* name, const char* a, const char* b, const char* c, const char* d)
{

  threadManager.putScriptRequest(ScriptRequest::ODE_CREATEPLANE, 
                                      name, mpParent->getID(), a, b, c, d);
}

void Script::odeCreateSphere(const char* name, const char* mass, const char* rad)
{

  threadManager.putScriptRequest(ScriptRequest::ODE_CREATESPHERE, 
                                      name, mpParent->getID(), mass, rad, NULL, NULL);
}

void Script::odeBodySetPosition(const char* name, const char* x, const char* y, const char* z)
{

  threadManager.putScriptRequest(ScriptRequest::ODE_SETBODYPOSITION, 
                                    name, mpParent->getID(),  x, y, z , NULL);

}



}  //namespace qserver


