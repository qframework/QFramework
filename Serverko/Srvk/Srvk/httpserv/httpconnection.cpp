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

#include "httpconnection.h"
#include <vector>
#include "boost/bind.hpp"
#include <boost/lexical_cast.hpp>
#include "httprequesthandler.h"
#include "../threadmanager/threadmanager.h"
#include "../scriptmanager/scriptclient.h"
#include "dataselector.h"
#define MAX_CONNECTIONS_NUM  (256*128)

namespace qserver 
{
  typedef HttpConnection* HttpConnectionP ; 
  HttpConnectionP* gConnections = NULL;
  int gConnectionsCnt = 0;



  int http_connections_put(HttpConnection* pConnection)
  {
    while (gConnections[gConnectionsCnt] != NULL)
    {
      gConnectionsCnt++;
      if (gConnectionsCnt == MAX_CONNECTIONS_NUM)
      {
        gConnectionsCnt = 0;
      }
    }
    gConnections[gConnectionsCnt] = pConnection;
    return gConnectionsCnt;
  }

  void http_connections_remove(int id)
  {
    if (id >= 0 && id <MAX_CONNECTIONS_NUM)
    {
      gConnections[id] = NULL;
    }
  }

  bool http_connections_valid(int id)
  {
    if (id >= 0 && id <MAX_CONNECTIONS_NUM)
    {
      return gConnections[id] != NULL;
    }
    return false;
  }

  HttpConnection::HttpConnection(boost::asio::io_service& io_service,
    HttpRequestHandler& handler)
    : mStrand(io_service),
    mSocket(io_service),
    mIoService(io_service),
    mReqHandler(handler),
    mBodyParsed(false),
    mContentSize(0),
    mReadStarted(false) ,
    mActive(false),
    mWriting(false),
    mpClient(NULL),
    mMagicId(0xFFAADDEE),
    mConnectionId(0),
    mSavePos(0),
    mWritePos(0),
    mToClose(false)
  {
    if (gConnections == NULL)
    {
      gConnections = new HttpConnectionP[MAX_CONNECTIONS_NUM];
      memset( gConnections , 0 , MAX_CONNECTIONS_NUM *  sizeof(HttpConnectionP) );
      gConnectionsCnt = 0;
    }

    mConnectionId = http_connections_put(this);
  }

  HttpConnection::~HttpConnection()
  {
    http_connections_remove(mConnectionId);
    mConnectionId = -1;
    stop();
    mMagicId = 0;
  }

  void HttpConnection::close()
  {
    mToClose = true;
  }

  void HttpConnection::stop()
  {
    shutdownSocket();
    http_connections_remove(mConnectionId);
    mConnectionId = -1;
    
    //system_traceOut( (std::string("stopping client : ") + mUserID).c_str());
    if (mpClient)
    {
      mpClient->setConnection(-1);
      mpClient->disable();
      mpClient = NULL;
      if (mUserID.length())
      {
        DataSelector::get()->remove(mUserID);	
      }

    }

    mMagicId = 0;
    mActive = false;
    }

  boost::asio::ip::tcp::socket& HttpConnection::socket()
  {
    return mSocket;
  }

  void HttpConnection::start()
  {
    mActive = true;

    fireRead();
  }

void HttpConnection::handleRead2(const boost::system::error_code& e,
    std::size_t bytes_transferred)
{
  if (mToClose)
  {
    shutdownSocket();
    return;
  }
  
  //system_traceOut("-----------------------");
  std::string data(mSocketBuffer.data() , bytes_transferred );
  /*
  for (int a=0; a< bytes_transferred ; a++)
  {
    char buff[16];
    sprintf(buff,"%c", *(mSocketBuffer.data() + a));
    data += buff;
  }*/

  /*
  system_traceOut( data.c_str()  );
  system_traceOut("-----------------------");
  */
  mReadStarted = false;
  if (!e)
  {

    boost::tribool result;
    const char*  parseend;
    boost::tie(result, parseend) = mReqParser.parse(
        mRequest, mSocketBuffer.data(), mSocketBuffer.data() + bytes_transferred);

    if (result)
    {
      std::string val = mRequest.getHeaderVal("Host");
      if (val != "www.100kas.com")
      {
        send( HttpReply::error_reply(HttpReply::forbidden).to_string());
        return;
      }

      mReqHandler.handleRequest(mRequest, mReply, this);
      mRequest.clear();
      send( mReply.to_string());
      fireRead();
      mReqParser.reset();
    }
    else if (!result)
    {
      mReply = HttpReply::error_reply(HttpReply::bad_request);
      send( mReply.to_string());
      mReqParser.reset();
      fireRead();
    }
    else
    {
      fireRead();
    }
  }


}

  
  int HttpConnection::getRequestContentSize(const HttpRequest& req)
  {
    // Go through http HttpRequest httpHeaders
    for (unsigned int a=0; a< req.mHeaders.size(); a++)
    {
      if (req.mHeaders[a].name == "Content-Length")
      {
        //return size
        return boost::lexical_cast<int>(req.mHeaders[a].value);
      }
    }
    // return error
    return -1;
  }


  void HttpConnection::send(const std::string msg)
  {
    if (!mActive || mMagicId != 0xFFAADDEE)
    {
      mWriting = false;
      return;
    }
    if (mToClose)
    {
      shutdownSocket();
      return;
    }
    if (mWriting)
    {
      //mQueue.push_back(msg);
      mToBuffer += msg;
    }else
    {
      //mQueue.push_back(msg);
      mToWrite = msg;
      mWriting = true;
      boost::asio::async_write(mSocket, boost::asio::buffer(mToWrite),
          boost::bind(&HttpConnection::handleWrite2, shared_from_this(),
            boost::asio::placeholders::error,
            boost::asio::placeholders::bytes_transferred));

    }
  }

  void HttpConnection::handleWrite2(const boost::system::error_code& error , size_t /*bytes_transferred*/)
      {
   // return;
    if (mToClose)
      {
      shutdownSocket();
          return;
      }

    if (!mActive || mMagicId != 0xFFAADDEE)
    {
      mWriting = false;
      return;
    }
    if (error)
    {
        std::string errstr = error.message();
        //waitForExit();
        system_traceOut( "----------");
        system_traceOut( errstr.c_str() );
        system_traceOut( "----------");
        //stop();
        return;
    }
    if (mToBuffer.size() == 0)
    {
      mWriting = false;
      return;
    }

    mToWrite = mToBuffer; 
    mToBuffer = "";
    boost::asio::async_write(mSocket, boost::asio::buffer(mToWrite),
        boost::bind(&HttpConnection::handleWrite2, shared_from_this(),
          boost::asio::placeholders::error,
          boost::asio::placeholders::bytes_transferred));

    return;
  }


  void HttpConnection::fireRead()
  {

    if (!mActive|| mMagicId != 0xFFAADDEE)
    {
      return;
    }

    
    if (!mReadStarted )
    {

      mReadStarted = true;

    mSocket.async_read_some(boost::asio::buffer(mSocketBuffer),
      boost::bind(&HttpConnection::handleRead2, shared_from_this(),
        boost::asio::placeholders::error,
        boost::asio::placeholders::bytes_transferred));
    }
  }

  void HttpConnection::setUser(const std::string& userid)
  {
    mUserID = userid;
  }


  void HttpConnection::sendReply(const std::string& data)
  {
    if (mpClient != NULL)
    {
      HttpReply reply;
      reply.mContent = data;
      reply.status = HttpReply::ok; 
      send( reply.to_string());
    }
  }

  void HttpConnection::waitForExit()
  {
    int count = 0;
    while(mWriting && count < 10)
    {
      boost::this_thread::sleep( boost::posix_time::millisec((long)100));
      count ++;
    }
  }

  void HttpConnection::sendClientData(const std::string& data, int connid)
  {
    try {

      if (http_connections_valid(connid))
      {
        HttpConnection* pconn =  gConnections[connid];
        if (pconn->mMagicId == 0xFFAADDEE)
        {
          pconn->sendReply(data);
        }
      }
    } catch (std::exception& e) 
    {
      //std::cout << "Exception: " << e.what();
        std::string error = "HttpConnection::sendClientData ERROR : ";
        error += std::string( e.what());
        error += "\n";
        system_traceOut(error.c_str());
    }
  }


  void HttpConnection::setUser(const std::string& user, int connid)
  {
    try {

      if (http_connections_valid(connid))
      {

        HttpConnection* pconn =   gConnections[connid];
        if (pconn->mMagicId == 0xFFAADDEE)
        {
          pconn->setUser(user);
        }
      }

    } catch (std::exception& e) 
    {
      //std::cout << "Exception: " << e.what();
        std::string error = "HttpConnection::setUser ERROR : ";
        error += std::string( e.what());
        error += "\n";
        system_traceOut(error.c_str());

    }

  }

  void HttpConnection::setClient(ScriptClient*   pClient, int connid)
  {
    
    try {

      if (http_connections_valid(connid))
      {

        HttpConnection* pconn =   gConnections[connid];
        if (pconn->mMagicId == 0xFFAADDEE)
        {
          pconn->setClient(pClient);
        }
      }

    } catch (std::exception& e) 
    {
      //std::cout << "Exception: " << e.what();
        std::string error = "HttpConnection::setClient ERROR : ";
        error += std::string( e.what());
        error += "\n";
        system_traceOut(error.c_str());

    }


  }

  void HttpConnection::setClient(ScriptClient* client)
  { 
    if (mMagicId == 0xFFAADDEE)
    {
      mpClient = client; 
      mUserID = client->getName();
    }
  }

  void HttpConnection::stop(int connid)
  {
    try {

      if (http_connections_valid(connid))
      {

        HttpConnection* pconn =   gConnections[connid];
        if (pconn->mMagicId == 0xFFAADDEE)
        {
          pconn->close();
        }
      }

    } catch (std::exception& e) 
    {
      //std::cout << "Exception: " << e.what();
        std::string error = "HttpConnection::write ERROR : ";
        error += std::string( e.what());
        error += "\n";
        system_traceOut(error.c_str());

    }

  }

  void HttpConnection::shutdownSocket()
  {
      boost::system::error_code ec;
      mSocket.shutdown(boost::asio::ip::tcp::socket::shutdown_send, ec);
      if (ec)
      {
        // An error occurred.
      }
      mSocket.close();
      mActive = false;

  }

} // namespace qserver
