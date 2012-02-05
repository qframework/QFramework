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


#ifndef HTTP_REQUEST_HANDLER_H
#define HTTP_REQUEST_HANDLER_H



#include <string>
#include "boost/noncopyable.hpp"
#include "httpconnection.h" 

namespace qserver {

struct HttpReply;
struct HttpRequest;

/** 
 * HttpRequestHandler class
 * Handler for all incoming http requests
 */
class HttpRequestHandler
  : private boost::noncopyable
{
public:
  /**
   * Default constructor
   */
  HttpRequestHandler();

  /**
   * Handles http request and produces reply
   * @param req a source http request to handle
   * @param rep a output http reply to generate
   */
  bool handleRequest(const HttpRequest& req, HttpReply& rep, HttpConnection* con);


private:


  /**
   * Handles http GET method
   * @param path a request path
   * @param req a source http request to handle
   * @param rep a output http reply to generate
   */
  bool handleGet(const std::string& path, const HttpRequest& req, HttpReply& rep, HttpConnection* con);

  /**
   * Handles http POST method
   * @param path a request path
   * @param req a source http request to handle
   * @param rep a output http reply to generate
   */
  bool handlePost(const std::string& path, const HttpRequest& req, HttpReply& rep, HttpConnection* con);

  /**
   * Handles http PUT method
   * @param path a request path
   * @param req a source http request to handle
   * @param rep a output http reply to generate
   */
  bool handlePut(const std::string& path, const HttpRequest& req, HttpReply& rep);

  /**
   * Handles http DELETE method
   * @param path a request path
   * @param req a source http request to handle
   * @param rep a output http reply to generate
   */
  bool handleDelete(const std::string& path, const HttpRequest& req, HttpReply& rep);

  /**
   * Parses path into user/server/room strings
   * @param path a path to parse
   * @param userid an user id retrieved from path
   * @param server a server retrieved from path
   * @param room a room retrieved from path
   */
  void decodePath(const std::string& path, std::string& userid, std::string& server, std::string& room);

  void decodePath2(const std::string& path, std::string& server, std::string& room, std::string& userid);


  std::string getHeader(const HttpRequest& req, const std::string& name);

  unsigned int getKeyNumber(std::string& s);
};

} // namespace qserver

#endif // HTTP_REQUEST_HANDLER_H
