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


#ifndef _SCRIPT_REQUEST_H_
#define _SCRIPT_REQUEST_H_

#include <boost/shared_ptr.hpp>
#include <boost/enable_shared_from_this.hpp>


#include <string>

namespace qserver
{

class HttpConnection;
typedef boost::shared_ptr<HttpConnection> HttpConnection_ptr;

class ScriptClient;

class ScriptRequest
  //: public boost::enable_shared_from_this<ScriptRequest>
{
public:
  typedef enum  ScriptRequestType
  {
    NONE,
    INIT,
    
    COMMAND,
    RESTART,
    TIMEREVENT,

    USER_CONNECTED,
    USER_DISCONNECTED,
    USER_DATA,

    SCRIPT_ROOM_INFO,
    SCRIPT_CLIENT_APPEND_TAG,
    SCRIPT_CLIENT_START_TAG,
    SCRIPT_CLIENT_END_TAG,
    SCRIPT_CLIENT_START_TAGS,
    SCRIPT_CLIENT_END_TAGS,
    SCRIPT_CLIENT_APPEND_SEPARATOR,
    SCRIPT_APPEND_TAG,
    SCRIPT_START_TAG,
    SCRIPT_END_TAG,
    SCRIPT_START_TAGS,
    SCRIPT_END_TAGS,
    SCRIPT_APPEND_SEPARATOR,
    SCRIPT_START_DATA,
    SCRIPT_APPEND_EVENT,
    SCRIPT_SEND_DATA,
    SCRIPT_CLIENT_START_DATA,
    SCRIPT_CLIENT_APPEND_EVENT,
    SCRIPT_CLIENT_SEND_DATA,
    SCRIPT_EVENT,
    SCRIPT_EXEC,
    DISCONNECT_CLIENT,
    ODE_INIT,
    ODE_CREATEPLANE,
    ODE_CREATESPHERE,
    ODE_SETBODYPOSITION
    
  }   ScriptRequestType;

public:
  ScriptRequest();
  ~ScriptRequest();


  ScriptRequestType mType;
  std::string       mStrUser;
  std::string       mStrData;
  std::string       mStrData2;
  std::string       mStrData3;
  std::string       mStrData4;
  

  int               mIntData;
  int               mIntData2;

  int               mScriptRoute;
  
};


//  typedef boost::shared_ptr<ScriptRequest> ScriptRequest_ptr;
  
} //namespace qserver



#endif

