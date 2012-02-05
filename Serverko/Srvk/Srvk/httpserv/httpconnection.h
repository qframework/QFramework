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



#ifndef HTTP_CONNECTION_H
#define HTTP_CONNECTION_H


#include <deque>
#include "httpreply.h"
#include "httprequest.h"
//#include "httprequesthandler.h"
#include "httprequestparser.h"
#include "boost/asio.hpp"
#include "boost/array.hpp"
#include "boost/noncopyable.hpp"
#include "boost/shared_ptr.hpp"
#include "boost/enable_shared_from_this.hpp"
#include "../scriptmanager/scriptclient.h" 
#include <boost/thread/mutex.hpp>

namespace qserver {

  class HttpRequestHandler;
  class ScriptClient;

  typedef std::deque<std::string> write_queue;

/** 
 * HttpConnection class
 * Connection class for handling single Http request from client
 */
class HttpConnection
  : public boost::enable_shared_from_this<HttpConnection>,
    private boost::noncopyable
{
public:

  //typedef boost::array<char, 8192 * 100> HttpDataBuffer; //8192 


  /**
   * Constructs connection with given io_service and request handler
   *
   * @param io_service an io_service to assoiciate connection with
   * @param handler a request handler
   */
  HttpConnection(boost::asio::io_service& io_service,
      HttpRequestHandler& handler);

  virtual ~HttpConnection();
  /** 
   * Returns reference to socket of this connection
   *
   * @return returns reference to this connection socket
   */
  boost::asio::ip::tcp::socket& socket();

  /**
   * Start the first asynchronous operation for the HttpConnection.
   */
  void start();

  void stop();
  void close();

  int getId() { return mConnectionId; }

  void send(const std::string data);

  void sendReply(const std::string& data);

  

  void waitForExit();

  void setClient(ScriptClient* client);

  static void sendClientData(const std::string& data, int connid);
  static void setUser(const std::string& user, int connid);
  static void setClient(ScriptClient*   pClient, int connid);
  static void stop(int connid);
  void setUser(const std::string& userid);
private:

    void shutdownSocket();
  /**
   * Handle completion of a read operation.
   * @param e an error code of read operation
   * @param bytes a number of bytes transferred
   */
  void handleRead2(const boost::system::error_code& e,
      std::size_t bytes);


  /**
   * Handle completion of a write operation.
   * @param e an error code of read operation
   */
  void handleWrite2(const boost::system::error_code& e, size_t /*bytes_transferred*/);

  /**
   * Returns size of Content-Size header
   * @param req a http request to look for csize
   * @return a defined content size or -1 on error
   */
  int getRequestContentSize(const HttpRequest& req);


  void fireRead();

  /**
    * Strand to ensure the HttpConnection's handlers are not called concurrently.
    */
  boost::asio::io_service::strand mStrand; 

  boost::asio::io_service& mIoService;
  /** 
    * Socket for the HttpConnection.
    */
  boost::asio::ip::tcp::socket mSocket;

  /** 
    * The handler used to process the incoming request.
    */
  HttpRequestHandler& mReqHandler;

  /** 
    * Buffer for incoming data.
    */
  boost::array<char, 8192> mSocketBuffer;
  /** 
    * The incoming request.
    */
//  HttpRequest mHttpReq;

  /** 
    * The parser for the incoming request.
    */
  HttpRequestParser mReqParser;

  /** 
    * The reply to be sent back to the client.
    */
  
  HttpReply mReply;
  HttpRequest mRequest;

  //HttpReply mHttpReplyJS;

  /** 
    * True if headers of http req were parsed
    */
  bool mBodyParsed;

  /** 
    * Content size of current request
    */
  int  mContentSize;

  int mReadStarted;

  std::string	mUserID;

  bool mActive;

  bool mWriting;

  ScriptClient*   mpClient;

  int      mMagicId;
  int      mConnectionId;
  typedef boost::mutex::scoped_lock   scoped_lock;
  boost::mutex                        mutex_conn;

  std::string*    mWriteBuffer;
  int             mWritePos;
  int             mSavePos;
  bool            mToClose;


  std::string     mToWrite;
  std::string     mToBuffer;
};

typedef boost::shared_ptr<HttpConnection> HttpConnection_ptr;

} // namespace qserver

#endif // HTTP_CONNECTION_H
