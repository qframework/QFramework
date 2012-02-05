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



#ifndef HTTP_USER_H
#define HTTP_USER_H


#include <string>
#include <map>
#include <vector>

#include "httpconnection.h"

//namespace qserver 
namespace qserver 
{

/** 
 * Http user class. 
 * Stores and performs operations on users
 */
class HttpUser
{
public:

  /** 
  * Constructor
  */
  HttpUser();

  /** 
  * Destructor
  */
  ~HttpUser();

  /** 
    * user username
    */
  std::string mUsername;

  /** 
    * user current server id
    */
  std::string mServerID;

  /** 
    * user current room id
    */
  std::string mRoomID;

  /** 
    * user buffered data
    */
  std::vector<std::string>        mBufferData;

  /**
   * timeout reset	
  */
  bool	  m_timeout;


  bool    m_logged;


  HttpConnection*  mConnection;
};

typedef std::map<std::string, HttpUser> UsersMap;
typedef std::pair<std::string, HttpUser> UsersPair;

} //namespace qserver 


#endif // HTTP_USER_H


