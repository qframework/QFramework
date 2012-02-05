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


#ifndef HTTP_REPLY_H
#define HTTP_REPLY_H


#include <string>
#include <vector>
#include "httpheader.h"
#include "boost/asio.hpp"

namespace qserver {

/** 
 * HttpReply structure
 * Represents reply that will be sent to client
 */
struct HttpReply
{
  /** 
    * The status of the reply.
    */
  enum status_type
  {
    ok = 200,
    created = 201,
    accepted = 202,
    no_content = 204,
    multiple_choices = 300,
    moved_permanently = 301,
    moved_temporarily = 302,
    not_modified = 304,
    bad_request = 400,
    unauthorized = 401,
    forbidden = 403,
    not_found = 404,
    internal_server_error = 500,
    not_implemented = 501,
    bad_gateway = 502,
    service_unavailable = 503
  } status;

  /** 
    * The headers to be included in the reply.
    */
  std::vector<HttpHeader> mHeaders;

  /** 
    * The content to be sent in the reply.
    */
  std::string           mContent;

  /** 
    * Convert the reply into a vector of buffers. 
    * The buffers do not own the
    * underlying memory blocks, therefore the reply object must remain valid and
    * not be changed until the write operation has completed.
    *
    * @return vector of reply buffers
    */
  std::vector<boost::asio::const_buffer> to_buffers();
  std::string to_string();

  /**
    * Generates error reply
    * @param status a status for which error will be generated
    * @return a error reply structure
    */
  static HttpReply error_reply(status_type status);
  std::string   mUserid;

  //std::string   mToString;

  void clear() {
    mUserid.clear();
    mContent.clear();
    mHeaders.clear();
    status = service_unavailable;
  }
};

} // namespace qserver

#endif // HTTP_REPLY_H
