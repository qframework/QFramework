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


#ifndef SCRIPT_CLIENT_H
#define SCRIPT_CLIENT_H


#include "boost/shared_ptr.hpp"
#include "boost/enable_shared_from_this.hpp"
#include "boost/noncopyable.hpp"
#include <vector>
#include <queue>
#include <deque>

#include "scriptclients.h"
#include "../httpserv/httpconnection.h"

namespace qserver
{

class ConnectionManager;
class ScriptsCore;
class ScriptSession;
class HttpConnection;

/** 
* ScriptClient class
* Client connected to script
*/
class ScriptClient
{
  friend class ScriptClients;
  friend class ScriptsCore;

public:

  /** 
   * Sets connection id for this client 
   * @param connection a connection id for client
   */
  //void setConnection(long connection);

  /** 
   * Gets connection id for this client 
   * @return connection id for client
   */
  int getConnection(){ return mConnectionID; }

  /** 
   * Gets client id 
   * @return client id
   */
  int getId() { return mId;}

  /** 
   * Sends data to tcp conection without adding user headers
   * @param outstr a reference to output string which is sent
   */
  void send(const std::string& outstr);

  /** 
   * Sends data to tcp conection with adding user headers
   * @param user an user to add as header
   * @param outstr a reference to output string which is sent
   */
  void send2User(const std::string& user, const std::string& outstr);


  /** 
   * Sets name of this user
   * @param name a new name to set
   */
  void setName(const std::string& name);

  /** 
   * Returns name of this user
   * @return name of user
   */
  const char* getName();

  /** 
   * Returns true if client has name
   * @param pName a name to check
   * @return name of user
   */
  bool isName(const char* pName);

  /** 
   * Sets parent of this client
   * @param pParent parent
   */
  void setParent(ScriptsCore* pParent);

  /** 
   * Associate script with this client
   */
  void setScript(ScriptSession* pScript);

  /** 
   * Handles start data request
   */
  void startData();

  /** 
   * Appends event to client data buffer
   * @param id1 and id of event
   * @param pType a type of event 
   * @param pData a data of event
   */
  void appendEvent(int id1, const char* pType, const char* pData);

  /** 
   * Sends data to user
   */
  void sendData(const char* pData);

  /** 
   * Appends protocol tag to client data buffer
   * @param pTag a tag to add
   * @param pValue a value of tag
   */
  void appendTag(const char* pTag, const char* pValue );

  /** 
   * Appends protocol tag to client data buffer
   * @param pTag a tag to add
   */
  void startTag(const char* pTag);

  /** 
   * Ends protocol tag to client data buffer
   * @param pTag a tag to end
   */
  void endTag(const char* pTag);

  /** 
   * Request to leave scripts. Notifies parent 
   */
  void leaveScript();

  /** 
   * Returns current script session
   */
  ScriptSession* getSession() const;

//protected:

  /** 
   * Constructor
   */
  ScriptClient();

  /** 
   * Destructor
   */
  virtual ~ScriptClient();

  /** 
   * Leaves scritp - todo - check if needed
   */

  void setConnection(int connectionID);
  
  void startTags(const char* pTag);
  void appendSeparator();
  void endTags(const char* pTag);

  void disable() { mEnabled = false; }
  void enable() { mEnabled = true;}
  bool enabled() { return mEnabled; }
protected:
  
  /** 
   * Id of client
   */
  int					mId;

  /** 
   * Connection if of this client
   */
  int                  mConnectionID;

  /** 
   * Parent of client
   */
  ScriptsCore*          mpParent;

  /** 
   * Name of client
   */
  std::string           mName;

  /** 
   * Parent session
   */
  ScriptSession*        mpSession;


  /** 
   * Data buffer to send
   */
  std::deque<std::string> mSendData;

  bool              mEnabled;

  std::string             mBufferedData;
};

} // namespace qserver



#endif
