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


#include <vector>
#include "httpserver.h"
#include "httpuser.h"
#include "boost/thread.hpp"
#include "boost/bind.hpp"
#include "boost/shared_ptr.hpp"
#include "dataselector.h"
#include "../threadmanager/threadmanager.h"


namespace qserver {

HttpServer* HttpServer::mpInstance = NULL;
extern void server_traceOut(const char* pData);

static void httpServerRun()
{
  if (HttpServer::mpInstance)
  {
	
	  HttpServer::mpInstance->run();
  }
}


HttpServer::HttpServer(const std::string& address, const std::string& port,
    std::size_t thread_pool_size) 
  : mpThread(NULL),
    mPool(thread_pool_size),
    mAcceptor(mPool.get_io_service())//,
{
    HttpConnection_ptr newConnection(new HttpConnection(mPool.get_io_service(), mReqHandler));

  // Open the acceptor with the option to reuse the address (i.e. SO_REUSEADDR).
  boost::asio::ip::tcp::resolver resolver(mPool.get_io_service());
  boost::asio::ip::tcp::resolver::query query(address, port);
  boost::asio::ip::tcp::endpoint endpoint = *resolver.resolve(query);
  mAcceptor.open(endpoint.protocol());
  mAcceptor.set_option(boost::asio::ip::tcp::acceptor::reuse_address(true));
  mAcceptor.bind(endpoint);
  mAcceptor.listen();
  mAcceptor.async_accept(newConnection->socket(),
      boost::bind(&HttpServer::handleAccept, this, newConnection, 
        boost::asio::placeholders::error));

}

void HttpServer::run()
{
    
  // Create a pool of threads to run all of the io_services.
    mPool.run();
}

void HttpServer::stop()
{
    mPool.stop();
}

void HttpServer::handle_stop()
{
  mAcceptor.close();
}


void HttpServer::handleAccept(HttpConnection_ptr connection, const boost::system::error_code& e)
{
  if (!e)
  {
    //mNewConnection->start();
      connection->start();
    //mNewConnection.reset(new HttpConnection(threadManager.mPool.get_io_service(), mReqHandler));
    HttpConnection_ptr newConnection(new HttpConnection(mPool.get_io_service(), mReqHandler));
    mAcceptor.async_accept(newConnection->socket(),
        boost::bind(&HttpServer::handleAccept, this,newConnection,
          boost::asio::placeholders::error));
  }
}


void HttpServer::start(const std::string& port)
{
  if (mpInstance) return;
  mpInstance = new HttpServer("0.0.0.0", port, 6);
  mpInstance->mPort = port;
  mpInstance->mpThread = new boost::thread(&httpServerRun);

}

void HttpServer::shutdown()
{
  if (!mpInstance) return;

  mpInstance->stop();
  delete mpInstance->mpThread;

  boost::this_thread::sleep( boost::posix_time::millisec((long)1000));

  delete mpInstance;
  mpInstance = NULL;


}


} // namespace qserver
