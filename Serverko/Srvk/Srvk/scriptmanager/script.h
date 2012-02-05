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


#ifndef SCRIPT_BASE_H
#define SCRIPT_BASE_H


#include <string>
#include <vector>

namespace qserver
{


typedef struct _StringString
{
  std::string mId;
  std::string mValue;
} StringString;


class ScriptSession;

/** 
* Script class
* Extends scripts - this is base class
*/
class Script
{
public:

  /** 
   * Constructor
   */
  Script();

  /** 
   * Destructor
   */
  virtual ~Script();


  /** 
   * Inits PY engine
   */
  virtual void init(){};

  /** 
   * Loads game script
   * @param fnama a referenct to script name
   * @return true on success
   */
  virtual bool loadGameScript(const std::string& fname){return false;}

  virtual bool execScript(const std::string& source){return false;}

  /** 
   * Executes script game init function
   */
  virtual void execGameInit(){}

  /** 
   * Executes script start function
   */
  virtual void execGameStart(){}

  /** 
   * Executes game get info function
   * @param retVal a reference to vector of string values
   * @return true on success
   */
  virtual bool execGameInfo(std::vector<StringString>& retVal){return false;}

  /** 
   * Executes script on game event function
   * @param id an id of event
   * @param pUserData a pointer to string used as userdata
   * @return true on success
   */
  virtual bool execOnGameEvent(int id, const char* pUserData){return false;}

  /** 
   * Executes script on client connected
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientConnected(const char* pId){return false;}

  virtual bool execOnClientReConnected(const char* pId){return false;}

  /** 
   * Executes script on client disconnected
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientDisConnected(const char* pId){return false;}

  /** 
   * Executes script on client data
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientData(const char* pId, const char* pData){return false;}

  /** 
   * Sets parent session for this script
   * @param pSession a pointer to parent session 
   */
  void setParent(ScriptSession* pParent);

  /** 
   * Gets parent session for this script
   * @return pointer to this object
   */
  static Script* get(const char* pScript);

public:

  /** 
   * Reports room info 
   */
  void onRoomInfo(const char* pInfo);

  /** 
   * Starts data buffer for all clients
   */
  void startData();

  /** 
   * Appends event to data buffer 
   * @param id an id of event
   * @param pType a type tag of event data
   * @param pData a data tag of event data
   */
  void appendEvent(int id1, const char* pType, const char* pData );

  /** 
   * Send data buffer to all clients
   */
  void sendData();

  /** 
   * Store layout to layout map
   */
  void storeLayout(const char* pName);

  /** 
   * Starts client data buffer 
   * @param pUserID a pointer to user
   */
  void clientStartData(const char *pUserID);

  /** 
   * Appends protocol tag data to client data buffer 
   * @param pUserID a pointer to user
   * @param pTag a pointer to tag name
   * @param pValue a pointer to data of tag
   */
  void clientAppendTag(const char *pUserID, const char* pTag, const char* pValue );

  /** 
   * Appends protocol start tag to client data buffer 
   * @param pUserID a pointer to user
   * @param pTag a pointer to tag name
   */
  void clientStartTag(const char *pUserID, const char* pTag);
  void clientStartTags(const char *pUserID, const char* pTag);

  /** 
   * Ends tag to client data buffer 
   * @param pUserID a pointer to user
   * @param pTag a pointer to tag name
   */
  void clientEndTag(const char *pUserID, const char* pTag);
  void clientEndTags(const char *pUserID, const char* pTag);
  void clientAppendSeparator(const char *pUserID);

  /** 
   * Appends protocol tag data to data buffer 
   * @param pTag a pointer to tag name
   * @param pValue a pointer to data of tag
   */
  void appendTag(const char* pTag, const char* pValue );

  /** 
   * Appends protocol start tag to data buffer 
   * @param pTag a pointer to tag name
   */
  void startTag(const char* pTag);
  void startTags(const char* pTag);

  /** 
   * Ends tag to data buffer 
   * @param pTag a pointer to tag name
   */
  void endTag(const char* pTag);
  void endTags(const char* pTag);
  void appendSeparator();


  /** 
   * Appends event data to client data buffer 
   * @param pUserID a pointer to user
   * @param id1 an event id
   * @param pType a pointer to event type 
   * @param pData a pointer to event data
   */
  void clientAppendEvent(const char *pUserID, int id1, const char* pType, const char* pData );


  /** 
   * Sends data to client
   * @param pUserID a pointer to user
   */
  void clientSendData(const char *pUserID);

  void disconnectClient(const char *pUserID);

  /** 
   * Starts new event
   * @param id an id of event
   * @param delay an delay when event will occurr
   * @param pUserdata a pointer to userdata string
   */
  void eventScript(int id, int delay, const char* pUserdata);

  /** 
   * Starts Tcp server mode
   * @param pPort a server port
   */
  void startTcp(const char* pPort);

  /** 
   * Starts Http server mode
   * @param pPort a server port
   */
  void startHttp(const char* pPort);

  /** 
   * Sets db connection
   * @param pString a connection string
   */
  void setDB(const char* pStr);


  /** 
   * Adds script to server
   * @param pScript a pointer to script name
   */
  void scriptAdd(const char* pWDir, const char* pScript, const char* pName);

  /**	 
   * Restarts script
   */
  void restartScript();


  // ode

  //
  void odeInit(const char* g);
  void odeCreatePlane(const char* name, const char* a, const char* b, const char* c, const char* d);
  void odeCreateSphere(const char* name, const char* mass, const char* rad);
  void odeBodySetPosition(const char* name, const char* x, const char* y, const char* z);


  void exec(int delay, const char* pScript);

  void setWDir(const std::string& wdir){ mWDir = wdir ; }
  /**	 
   * Gets script from script pool
   * @param id an id of script
   */
  static Script* getScript(int id);

  /**	 
   * a pointer to parent session
   */
  ScriptSession*                  mpParent;


  /**	 
   * script name
   */
  std::string             mScriptName;

  std::string             mWDir;

};

}  //namespace qserver

#endif ///SCRIPT_BASE_H


