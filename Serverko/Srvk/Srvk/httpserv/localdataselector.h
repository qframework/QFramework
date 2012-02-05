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



#ifndef LOCAL_DATA_SELECTOR_H
#define LOCAL_DATA_SELECTOR_H


#include <string>
#include <map>
#include <vector>
#include "dataselector.h"
#include "httpuser.h"

//namespace qserver 
namespace qserver 
{

typedef std::map<std::string, HttpUser> UsersMap;
typedef std::pair<std::string, HttpUser> UsersPair;

/** 
 * Http user class. 
 * Stores and performs operations on users
 */
class LocalDataSelector : public DataSelector
{
public:

  /** 
  * Constructor
  */
  LocalDataSelector();

  /** 
  * Destructor
  */
  ~LocalDataSelector();

  /** 
  * Adds user to users 
  * @param user an username to add
  * @return true on success otherwise false
  */
  bool add(const std::string& user);

  /** 
  * Finds user 
  * @param user an username to find
  * @return true on success otherwise false
  */
  bool find(const std::string& user);

  /** 
  * Removes user 
  * @param user an username to remove
  * @return true on success otherwise false
  */
  bool remove(const std::string& user);

  /** 
  * Sets current server for user 
  * @param user an username to set server
  * @param server a server to associated user with
  * @return true on success otherwise false
  */
  bool setServer(const std::string& user, const std::string& server);

  /** 
  * Sets current room for user 
  * @param user an username to set server
  * @param server a server to associated user with
  * @param room a room to associated user with
  * @return true on success otherwise false
  */
  bool setRoom(const std::string& user, const std::string& server, const std::string& room);

  /** 
  * Leave user from its current room
  * @param user an username to leave room
  * @return true on success otherwise false
  */
  bool leaveRoom(const std::string& user);


  /** 
  * Puts user data to user current server
  * @param user an username to put data
  * @param data a data to put to server
  * @return true on success otherwise false
  */
  bool put(const std::string& user , const std::string& data);



  void setUserConnection( const std::string& userid,const std::string& room,  HttpConnection* connection);

  HttpConnection* getUserConnection( const std::string& userid);
  UsersMap mUsers;

  boost::mutex        users_mutex;
};



} //namespace qserver 


#endif // LOCAL_DATA_SELECTOR_H


