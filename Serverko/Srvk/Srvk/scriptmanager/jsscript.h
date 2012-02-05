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


#ifndef JS_GAME_H
#define JS_GAME_H


#include <v8.h>

#include <string>
#include <vector>
#include "script.h"

namespace qserver
{

class ScriptSession;

/** 
 * JS_Server class
 * Extends javascript 
 */
class JS_Server
{

  public:

	/** 
	 * Start server data v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> onRoomInfo(const v8::Arguments& args);


	/** 
	 * Start server data v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> startData(const v8::Arguments& args);


	/** 
	 * Appends event data v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> appendEvent(const v8::Arguments& args);
	/** 
	 * Sends data to all clients v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> sendData(const v8::Arguments& args);
	
	/** 
	 * Executes game event v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> sendEvent(const v8::Arguments& args);

	/** 
	 * Traces string
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> trace(const v8::Arguments& args);
	
	/** 
	 * Loads additional module in space v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> loadModule(const v8::Arguments& args);
    static v8::Handle<v8::Value> loadModule2(const v8::Arguments& args);
    static v8::Handle<v8::Value> exec(const v8::Arguments& args);
	
	/** 
	 * Sets sql database name v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> setSQLDB(const v8::Arguments& args);

	/** 
	 * Spawns new script v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> scriptAdd(const v8::Arguments& args);

	/** 
	 * Starts tcp server v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> startTcp(const v8::Arguments& args);
	
	/** 
	 * Starts http server v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> startHttp(const v8::Arguments& args);
	
  /** 
	 * Sets pqdatabase connector
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> setDB(const v8::Arguments& args);
	

	/** 
	 * Restarts script v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> restartScript(const v8::Arguments& args);

	/** 
	 * Starts client data buffer v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> clientStartData(const v8::Arguments& args);

	/** 
	 * Appends protocol tag event data v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> clientAppendTag(const v8::Arguments& args);
    static v8::Handle<v8::Value> clientAppendSeparator(const v8::Arguments& args);

	/** 
	 * Starts new protocol tag v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> clientStartTag(const v8::Arguments& args);
    static v8::Handle<v8::Value> clientStartTags(const v8::Arguments& args);

	/** 
	 * Ends tag v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> clientEndTag(const v8::Arguments& args);
    static v8::Handle<v8::Value> clientEndTags(const v8::Arguments& args);

	/** 
	 * Appends protocol tag event data v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> appendTag(const v8::Arguments& args);
    static v8::Handle<v8::Value> appendSeparator(const v8::Arguments& args);

	/** 
	 * Starts new protocol tag v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> startTag(const v8::Arguments& args);
    static v8::Handle<v8::Value> startTags(const v8::Arguments& args);

	/** 
	 * Ends tag v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> endTag(const v8::Arguments& args);
    static v8::Handle<v8::Value> endTags(const v8::Arguments& args);

	/** 
	 * Appends event to client buffer v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> clientAppendEvent(const v8::Arguments& args);

	/** 
	 * Sends client data v8 extending function
	 * @param args an function arguments
	 * @return result of function operation
	 */
    static v8::Handle<v8::Value> clientSendData(const v8::Arguments& args);


    static v8::Handle<v8::Value> disconnectClient(const v8::Arguments& args);


    // ode stuff
    static v8::Handle<v8::Value> odeInit(const v8::Arguments& args);
    static v8::Handle<v8::Value> odeCreatePlane(const v8::Arguments& args);
    static v8::Handle<v8::Value> odeCreateSphere(const v8::Arguments& args);
    static v8::Handle<v8::Value> odeBodySetPosition(const v8::Arguments& args);


};



/** 
 * JSScript class
 * Extends and embedds javascript engine 
 */
class JSScript : public Script
{
  friend class JS_Server;

public:

  /** 
   * Constructor
   */
  JSScript();

  /** 
   * Destructor
   */
  virtual ~JSScript();
  
  /** 
   * Inits engine
   */
  virtual void init();

  /** 
   * Loads game script
   * @param fnama a referenct to script name
   * @return true on success
   */
  virtual bool loadGameScript(const std::string& fname);


  /** 
   * Executes script game init function
   */
  virtual void execGameInit();

  /** 
   * Executes script start function
   */
  virtual void execGameStart();

  /** 
   * Executes game get info function
   * @param retVal a reference to vector of string values
   * @return true on success
   */
  virtual bool execGameInfo(std::vector<StringString>& retVal);

  /** 
   * Executes script on game event function
   * @param id an id of event
   * @param pUserData a pointer to string used as userdata
   * @return true on success
   */
  virtual bool execOnGameEvent(int id, const char* pUserData);


  /** 
   * Executes script on client connected
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientConnected(const char* pId);

  /** 
   * Executes script on client reconnected
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientReConnected(const char* pId);

  /** 
   * Executes script on client disconnected
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientDisConnected(const char* pId);

  /** 
   * Executes script on client data
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientData(const char* pId, const char* pData);
  
  bool execScript(const std::string& source);


  static void memclean();


protected:

  /** 
   * Loads new JS module in namespace
   * @param pModule a pointer to module name
   */
  void loadModule(const char* pModule);
  void loadModule2(const char* pModule);
  
  /** 
   * Loads new script 
   * @param fname a name of script to load
   * @return true on success
   */
  bool loadScript(const std::string& fname);

  /** 
   * Reports JS exepction 
   * @param try_catch a pointer to execption info
   */
  void reportException(v8::TryCatch* try_catch);

  /** 
   * sets curren sql database
   * @param pDb a current database name
   */
  void setSQLDB(const char* pDb);

  /** 
   * Retursn js v8 function by its name
   * @param outFunc a reference to js function
   * @param fName a pointer to function name 
   * @return true on success otherwise false
   */
  bool getFunction(v8::Persistent<v8::Function>& outFun, const char* fName);

  
  /** 
   *  Javascript context
   */
  v8::Persistent<v8::Context>     mContext;
  
  /** 
   *  script info function js v8 
   */
  v8::Persistent<v8::Function>    mRoomInfoFunc;
  
  /** 
   *  script init function js v8 
   */
  v8::Persistent<v8::Function>    mRoomInitFunc;
  
  /** 
   *  script on start function js v8 
   */
  v8::Persistent<v8::Function>    mRoomStartFunc;
  
  /** 
   *  script on end info function js v8 
   */
  v8::Persistent<v8::Function>    mRoomEndFunc;
  
  /** 
   *  script on event function in js v8 
   */
  v8::Persistent<v8::Function>    mRoomGameEventFunc;
  
  /** 
   *  script user joined function in js v8 
   */
  v8::Persistent<v8::Function>    mRoomUserJoined;

  /** 
   *  script user rejoined function in js v8 
   */
  v8::Persistent<v8::Function>    mRoomUserReJoined;
  

  /** 
   *  script on user left function in js v8 
   */
  v8::Persistent<v8::Function>    mRoomUserLeft;
  
  /** 
   *  script on user data function in js v8 
   */
  v8::Persistent<v8::Function>    mRoomUserData;



  void loadFramework();

  std::vector<std::string> mLoadedScripts;
};


} //namespace qserver


#endif  // JS_GAME_H
