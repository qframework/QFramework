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

#ifndef _SERVER_CLIENT_H_
#define _SERVER_CLIENT_H_

#include <string>
#include <vector>

namespace qserver
{

class ServerConnect;

typedef void (*ClientCallback)(ServerConnect* pConnect, void* pUserData);
typedef void (*TraceOutCallback)( char* pData);

class ServerClient
{
  friend class ServerManager;

public:
  ServerClient();
  virtual ~ServerClient();

  virtual void clear() = 0;
  virtual void stop() = 0;

protected:

  TraceOutCallback        mOutFunc;
};

class ServerConnect
{

public:
  ServerConnect();
  virtual ~ServerConnect();

  virtual void exec(const char* pCmd) = 0;
  virtual void onDataReceived(const char* pData){};

protected:

  virtual void getData() = 0;
    
};

} //namespace qserver


#endif

