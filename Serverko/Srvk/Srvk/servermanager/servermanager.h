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

#ifndef _SERVER_MANAGER_H_
#define _SERVER_MANAGER_H_


#include <vector>
#include <boost/thread/mutex.hpp>
#include <boost/thread/condition.hpp>

namespace qserver
{

class ServerRequest;
class ServerResponse;
class ServerClient;


typedef void (*ServerOutCallback)( char* pData);

class ServerManager
{
public:

  ServerManager();
  virtual ~ServerManager();

public:

  int create(ServerOutCallback pFunc, ServerOutCallback pFunc2 );
  void closeResponse(ServerResponse* pRes);
  bool start();
  bool stop();
  void exec(char* pBuffer, int size);  
  void exec(char* pBuffer, int size, std::string& res);
  void setServerClient(ServerClient* pClient);

  typedef boost::mutex::scoped_lock   scoped_lock;
       
  void run();
  void execFile(char* pFile);
  void execScript(const char* pFile);

protected:
  std::string                       mPort;
  ServerOutCallback                 mOutFunc; 
  ServerClient*                     mpServerClient;
  static ServerManager*             mpServerManager;

 // std::vector<TcpPacket_ptr>  mPendingIncoming;
  boost::mutex        mutex;
  boost::condition    cond;
};

} //namespace qserver


#endif
