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



#ifndef HTTP_SERVER_H
#define HTTP_SERVER_H


#include <string>
#include <vector>
#include "boost/asio.hpp"
#include "boost/noncopyable.hpp"
#include "boost/shared_ptr.hpp"
#include "boost/thread.hpp"
#include "httpconnection.h"
#include "httprequesthandler.h"
#include "../tools/io_service_pool.hpp"

namespace qserver 
{

/** 
 * Http server class. 
 * Used to accept incoming http requests
 */
class HttpServer
  : private boost::noncopyable
{
public:

  static void start(const std::string& port);
  static void shutdown();

  boost::thread*  mpThread;
  std::string mPort;
  static HttpServer* mpInstance;

  /**
   * Constructor
   * @param address an address to listen on
   * @port a port to listen on
   * @size a number of threads used for server
   */
  HttpServer(const std::string& address, const std::string& port,
      std::size_t thread_pool_size);

  /**
   * Run the server's io_service loop.
   */
  void run();

  /**
   * Stop the server.
   */
  void stop();
  
private:

  /**
   * Handle completion of an asynchronous accept operation.
   * @param e an error code
   */
  void handleAccept(HttpConnection_ptr connection, const boost::system::error_code& e);

  void handle_stop();

  io_service_pool   mPool;
  /**
   * The number of threads that will call io_service::run().
   */
  //std::size_t mThreadPoolSize;

  /**
   * The io_service used to perform asynchronous operations.
   */
  //boost::asio::io_service& mIoService;

  /**
   * Acceptor used to listen for incoming connections.
   */
  boost::asio::ip::tcp::acceptor mAcceptor;

  /**
   * The next connection to be accepted.
   */
  HttpConnection_ptr mNewConnection;

  /**
   * The handler for all incoming requests.
   */
  HttpRequestHandler mReqHandler;

  
};

} // namespace qserver

#endif // HTTP_SERVER_H
