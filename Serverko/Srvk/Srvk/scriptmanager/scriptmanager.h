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


#ifndef SCRIPT_MANAGER_H
#define SCRIPT_MANAGER_H

#include <boost/thread/thread.hpp>
#include <boost/thread/mutex.hpp>
#include <boost/thread/condition.hpp>

#include "scriptrequest.h"
#include <vector>

class HttpConnection;
typedef boost::shared_ptr<HttpConnection> HttpConnection_ptr;

#include "scriptscore.h"

namespace qserver
{

class ScriptClient;
class ProtocolRequest;
class ScriptSession;

typedef std::map<int, std::string> SrvBufferMap;
typedef std::pair<int, std::string> SrvBufferMapPair;


/** 
 * ScriptManager class
 * Manager for all scripts
 */
class ScriptManager
{

  public: 
	/** 
	 * Constructor
	 */
	ScriptManager();

	/** 
	 * Destructor
	 */
	~ScriptManager();

  /** 
   * Puts request to thread pool
   * @param packet a script request to put in thread pool
   */
  void put(ScriptRequest* packet);

  /** 
   * Runs thread
   */
  void run();

  /** 
   * Returns buffered data. 
   * @param reqID an id of request to get result
   * @param pDataOut a pointer to output buffer
   * @param dataLen a size of output buffer
   * @return length of remaining data
   */
  int getBufferData(int reqID, char* pDataOut, int dataLen);

  /** 
   * Adds new script to scripts
   * @param pointer to new session to add
   * @return id of new script
   */
  int addScript(ScriptSession* pScript);

  /** 
   * Adds string to buffer
   * @param reqmId a id of request 
   * @param res a string to add
   */
  void add2Buffer( int reqmId , const std::string& res );

  /** 
   * Returns script session with id
   * @param id an id of session to return
   * @return a pointer to session or NULL on error
   */
  ScriptSession* getScript(int id);

  /** 
   * Starts new script session
   * @param pScriptFile a pointer to script filename
   * @return an id of script or -1 on error
   */
  int  spawnScriptSession(const char* pWdir , const char* pScriptFile, const char* pName);


  void restartScriptSession( ScriptSession* pSession);

  void getInfo(std::string& info);

  void getRoomInfo(std::string& roomid, std::string& info);

  void userConnected(const std::string& user, int connection, int roomid);
  void userDisConnected(const std::string& user, int roomid);
  void userData(const std::string& user, const std::string& data, int roomid);

private:

  /** 
   * Handles request from thread pool
   * @param packet a packet to handle
   */
  void handlePacket(ScriptRequest* packet);

  /** 
   * Executes command request
   * @param req a request to handle
   */
  void onCommand( const ProtocolRequest& req);

  /** 
   * Handles restart request
   * @param req a request to handle
   */
  void onRestart( ScriptRequest* req);


private:

  /** 
   * Vector of pending requests in thread pool
   */
  std::vector<ScriptRequest*>  mPendingRequests;

  std::vector<ScriptRequest*>  mNewRequests;

  /** 
   * thread lock
   */
  typedef boost::mutex::scoped_lock   scoped_lock;

  /** 
   * mutex for request handling
   */
  boost::mutex        mutex_script;

  boost::mutex        mutex_put;


  /** 
   * mutex for buffer adding
   */
  boost::mutex        mutex_buffer;

  /** 
   * semaphore for request handling
   */
  boost::condition    cond_script;


  /** 
   * Map of server buffers
   */
  SrvBufferMap      mSrvBuffer;

  /** 
   * Script core - main script facility
   */  
  ScriptsCore       mScriptCore;
};

} //namespace qserver



#endif

