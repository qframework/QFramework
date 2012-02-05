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


#include "scriptmanager.h"
#include "scriptscore.h"
#include <boost/lexical_cast.hpp>


namespace qserver
{

extern void server_traceOut(const char* pData);
extern void system_traceOut(const char* pData);
#define TRACE_OUT(x) server_traceOut(x)

ScriptManager::ScriptManager() 
{
  puts (" ScriptManager ok ");
}

ScriptManager::~ScriptManager()
{
}


void ScriptManager::put(ScriptRequest* packet)
{
  scoped_lock lk(mutex_put);
  {
    mNewRequests.push_back(packet);
    //mPendingRequests.push_back(packet);
  }
//  cond_script.notify_one();
}




void ScriptManager::run()
{

  mScriptCore.start();
  // loop 
  // wait until we have something to read

  for (;;)
  {

    //scoped_lock lk(mutex_script);
    {
      // wait for data
      /*
      if (mPendingRequests.size() == 0)
      {


        while (mPendingRequests.size() == 0)
        {
          cond_script.wait(lk);
        }
      }*/

      boost::this_thread::sleep( boost::posix_time::millisec((long)100));
    
      //char buff[256];
      //sprintf(buff, "IN buff sz %d ", mPendingRequests.size());
      //system_traceOut(buff);
      // get data
      mPendingRequests.clear();
      {
        scoped_lock lk(mutex_put);
        for (unsigned int a=0; a< mNewRequests.size(); a++)
        {
          mPendingRequests.push_back( mNewRequests[a]);
        }
        mNewRequests.clear();
      }


      for (unsigned int a=0; a< mPendingRequests.size() ; a++)
      {
        ScriptRequest* packet = mPendingRequests[a];
        handlePacket(packet);
        delete packet;
        // erase packet for queuee
      }
      
      
      //sprintf(buff, " OUT buff sz %d ", mPendingRequests.size());
      //system_traceOut(buff);


      //sprintf(buff, " NEW  buff sz %d ", mPendingRequests.size());
      //system_traceOut(buff);
    }
  }
}

void ScriptManager::handlePacket(ScriptRequest* req)
{
  // -2 = route to script manager
  if (req->mScriptRoute == -2)
  {
    switch ( req->mType )
    {
      case ScriptRequest::TIMEREVENT:
        mScriptCore.doTick(req->mIntData);
        break;
    }
  }
  else
  {

	// route to all scripts
    if (req->mScriptRoute == -1)
    { // TODO get num from scriptmanager
      int sz = mScriptCore.getScriptsSize();
      for (int a=0; a< sz ; a++)
      {
        ScriptSession* pSession = mScriptCore.getScript(a);
        if (pSession)
        {
          pSession->handlePacket(req);  
        }else
        {
          return;
        }
      }
    } // >0 route to speficic script
    else if (req->mScriptRoute >=0 && req->mScriptRoute < mScriptCore.getScriptsSize() )
    {
      ScriptSession* pSession = mScriptCore.getScript(req->mScriptRoute);
      if (pSession)
      {
        pSession->handlePacket(req);  
      }
    }

  }
}

void ScriptManager::onRestart( ScriptRequest* req)
{
  ScriptSession* pSession  = mScriptCore.getScript(req->mIntData);
  if (pSession)
  {
    pSession->handlePacket(req);
  }

}




int ScriptManager::getBufferData(int reqID,char* pDataOut, int dataLen)
{
  //scoped_lock lk2(mutex_buffer);

  // lock 
  SrvBufferMap::iterator iter = mSrvBuffer.find(reqID);
  if (iter == mSrvBuffer.end() )
  {
    return 0;
  }
  std::string& srvBuffer = iter->second;

  if (srvBuffer.length() )
  {
    if ( (int)srvBuffer.length() < dataLen)
    {
      strcpy(pDataOut, srvBuffer.c_str() );
      mSrvBuffer.erase(reqID);
      return 0;
    }
    else
    {
      strncpy(pDataOut, srvBuffer.c_str(), dataLen );
      srvBuffer.erase( dataLen );
      return (int)srvBuffer.length();
    }
  }

  return 0;
}
int ScriptManager::addScript(ScriptSession* pScript)
{
  return mScriptCore.addScript(pScript);
}

ScriptSession* ScriptManager::getScript(int id)
{
  return mScriptCore.getScript(id);
}

void ScriptManager::add2Buffer( int reqId , const std::string& res )
{
  //scoped_lock lk2(mutex_buffer);
  SrvBufferMap::iterator iter = mSrvBuffer.find(reqId);
  if (iter == mSrvBuffer.end() )
  {
    mSrvBuffer.insert( SrvBufferMapPair(reqId, res) );
    return;
  }
  
  std::string& srvBuffer = iter->second;  
  srvBuffer += res;
}


int ScriptManager::spawnScriptSession(const char* pWDir, const char* pScriptFile, const char* pName)
{
  system_traceOut( " --- starting script ");
  puts(pScriptFile);

  ScriptSession* pSession = new ScriptSession();
  if (pSession == NULL )
  {
    return -1;
  }

  pSession->setScriptFile(pWDir , pScriptFile);
  pSession->setName(pName);

  int id = addScript(pSession);
  if (id < 0)
  {
    return -1;
  }

  ScriptRequest* pReq = new ScriptRequest();

  pReq->mType = ScriptRequest::RESTART;
  pReq->mScriptRoute = id;
  put(pReq);

  return id;
}

void ScriptManager::restartScriptSession( ScriptSession* pSession)
{
  if (pSession)
  {
    //pSession->reloadScript();
    ScriptRequest* pReq = new ScriptRequest();

    pReq->mType = ScriptRequest::RESTART;
    pReq->mScriptRoute = pSession->getID();
    put(pReq);

  }
}

void ScriptManager::getInfo(std::string& info)
{
  mScriptCore.getInfo(info);
}

void ScriptManager::getRoomInfo(std::string& roomid, std::string& info)
{
	int id = boost::lexical_cast<int>(roomid);
	mScriptCore.getRoomInfo(id, info);
}

void ScriptManager::userConnected(const std::string& user, int connection, int roomid)
{

  ScriptRequest* pReq = new ScriptRequest();

  pReq->mStrUser = user;
  pReq->mIntData = connection;
  pReq->mType = ScriptRequest::USER_CONNECTED;
  pReq->mScriptRoute = roomid;
  
  put(pReq);

}

void ScriptManager::userDisConnected(const std::string& user, int roomid)
{
  ScriptRequest* pReq = new ScriptRequest();

  pReq->mStrUser = user;
  pReq->mType = ScriptRequest::USER_DISCONNECTED;
  pReq->mScriptRoute = roomid;
  
  put(pReq);
}

void ScriptManager::userData(const std::string& user, const std::string& data, int roomid)
{
  ScriptRequest* pReq = new ScriptRequest();

  pReq->mStrData = data;
  pReq->mStrUser = user;
  pReq->mType = ScriptRequest::USER_DATA;
  pReq->mScriptRoute = roomid;

  put(pReq);
}

} //namespace qserver


