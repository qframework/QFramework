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


#include "httpreply.h"
#include <string>
#include "boost/lexical_cast.hpp"


namespace qserver {

  extern void system_traceOut(const char* pData);

namespace status_strings {

const std::string ok =
  "HTTP/1.0 200 OK\r\n";
const std::string created =
  "HTTP/1.0 201 Created\r\n";
const std::string accepted =
  "HTTP/1.0 202 Accepted\r\n";
const std::string no_content =
  "HTTP/1.0 204 No Content\r\n";
const std::string multiple_choices =
  "HTTP/1.0 300 Multiple Choices\r\n";
const std::string moved_permanently =
  "HTTP/1.0 301 Moved Permanently\r\n";
const std::string moved_temporarily =
  "HTTP/1.0 302 Moved Temporarily\r\n";
const std::string not_modified =
  "HTTP/1.0 304 Not Modified\r\n";
const std::string bad_request =
  "HTTP/1.0 400 Bad Request\r\n";
const std::string unauthorized =
  "HTTP/1.0 401 Unauthorized\r\n";
const std::string forbidden =
  "HTTP/1.0 403 Forbidden\r\n";
const std::string not_found =
  "HTTP/1.0 404 Not Found\r\n";
const std::string internal_server_error =
  "HTTP/1.0 500 Internal Server Error\r\n";
const std::string not_implemented =
  "HTTP/1.0 501 Not Implemented\r\n";
const std::string bad_gateway =
  "HTTP/1.0 502 Bad Gateway\r\n";
const std::string service_unavailable =
  "HTTP/1.0 503 Service Unavailable\r\n";

boost::asio::const_buffer to_buffer(HttpReply::status_type status)
{
  switch (status)
  {
  case HttpReply::ok:
    return boost::asio::buffer(ok);
  case HttpReply::created:
    return boost::asio::buffer(created);
  case HttpReply::accepted:
    return boost::asio::buffer(accepted);
  case HttpReply::no_content:
    return boost::asio::buffer(no_content);
  case HttpReply::multiple_choices:
    return boost::asio::buffer(multiple_choices);
  case HttpReply::moved_permanently:
    return boost::asio::buffer(moved_permanently);
  case HttpReply::moved_temporarily:
    return boost::asio::buffer(moved_temporarily);
  case HttpReply::not_modified:
    return boost::asio::buffer(not_modified);
  case HttpReply::bad_request:
    return boost::asio::buffer(bad_request);
  case HttpReply::unauthorized:
    return boost::asio::buffer(unauthorized);
  case HttpReply::forbidden:
    return boost::asio::buffer(forbidden);
  case HttpReply::not_found:
    return boost::asio::buffer(not_found);
  case HttpReply::internal_server_error:
    return boost::asio::buffer(internal_server_error);
  case HttpReply::not_implemented:
    return boost::asio::buffer(not_implemented);
  case HttpReply::bad_gateway:
    return boost::asio::buffer(bad_gateway);
  case HttpReply::service_unavailable:
    return boost::asio::buffer(service_unavailable);
  default:
    return boost::asio::buffer(internal_server_error);
  }
}

const std::string to_string(HttpReply::status_type status)
{
  switch (status)
  {
  case HttpReply::ok:
    return ok;
  case HttpReply::created:
    return created;
  case HttpReply::accepted:
    return accepted;
  case HttpReply::no_content:
    return no_content;
  case HttpReply::multiple_choices:
    return multiple_choices;
  case HttpReply::moved_permanently:
    return moved_permanently;
  case HttpReply::moved_temporarily:
    return moved_temporarily;
  case HttpReply::not_modified:
    return not_modified;
  case HttpReply::bad_request:
    return bad_request;
  case HttpReply::unauthorized:
    return unauthorized;
  case HttpReply::forbidden:
    return forbidden;
  case HttpReply::not_found:
    return not_found;
  case HttpReply::internal_server_error:
    return internal_server_error;
  case HttpReply::not_implemented:
    return not_implemented;
  case HttpReply::bad_gateway:
    return bad_gateway;
  case HttpReply::service_unavailable:
    return service_unavailable;
  default:
    return internal_server_error;
  }
}

} // namespace status_strings

namespace misc_strings {

const char name_value_separator[] = { ':', ' ' };
const char crlf[] = { '\r', '\n' };

} // namespace misc_strings

std::vector<boost::asio::const_buffer> HttpReply::to_buffers()
{
  std::vector<boost::asio::const_buffer> buffers;
  buffers.push_back(status_strings::to_buffer(status));
  for (std::size_t i = 0; i < mHeaders.size(); ++i)
  {
    HttpHeader& h = mHeaders[i];
    buffers.push_back(boost::asio::buffer(h.name));
    buffers.push_back(boost::asio::buffer(misc_strings::name_value_separator));
    buffers.push_back(boost::asio::buffer(h.value));
    buffers.push_back(boost::asio::buffer(misc_strings::crlf));
  }
  if (mContent.length() > 0)
  {
    std::string len = "Content-length:" + boost::lexical_cast<std::string>((unsigned int)mContent.length());
    buffers.push_back(boost::asio::buffer(len));
	  buffers.push_back(boost::asio::buffer(misc_strings::crlf));
	  buffers.push_back(boost::asio::buffer(mContent));
  }


  
  
  buffers.push_back(boost::asio::buffer(misc_strings::crlf));
  return buffers;
}

std::string HttpReply::to_string()
{
  
  std::string tostring;
  tostring = status_strings::to_string(status);
  
  for (std::size_t i = 0; i < mHeaders.size(); ++i)
  {
    HttpHeader& h = mHeaders[i];
    //system_traceOut( h.name.c_str() );
    tostring +=  h.name;
    tostring += misc_strings::name_value_separator;
    tostring +=  h.value;
    tostring += misc_strings::crlf;
  }
  if (mContent.length() > 0)
  {
    tostring += "Content-length:" + boost::lexical_cast<std::string>(mContent.length());
	  tostring += "\r\n";
    tostring += "\r\n";
	  tostring += mContent;
  }

  tostring += "\r\n";
  return tostring;
}

HttpReply HttpReply::error_reply(status_type status)
{
  HttpReply rep;
  rep.status = status;

  return rep;
}

} // namespace qserver

