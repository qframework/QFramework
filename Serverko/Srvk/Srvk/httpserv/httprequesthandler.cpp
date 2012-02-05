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


#include "httprequesthandler.h"
#include "httpconnection.h"
#include "httpreply.h"
#include "httprequest.h"
#include "httpserver.h"
#include <string>
#include "boost/lexical_cast.hpp"
#include <boost/tokenizer.hpp>
#include "dataselector.h"
#include "../threadmanager/threadmanager.h"
#include <algorithm>
#include "../tools/md5.h"

namespace qserver {

HttpRequestHandler::HttpRequestHandler()
{
}

bool HttpRequestHandler::handleRequest(const HttpRequest& req, 
                                       HttpReply& rep, 
                                       HttpConnection* con)
{

  // Request path must be absolute and not contain "..".
  if (req.mUri.empty())
  {
    rep = HttpReply::error_reply(HttpReply::bad_request);
    return false;
  }

  if (req.mMethod == "GET")
  {
    // handle get
    return handleGet(req.mUri, req, rep, con);
  } else if (req.mMethod == "POST")
  {
    // handle post
    return handlePost(req.mUri, req, rep, con);
  } else if (req.mMethod == "PUT")
  {
    // handle post
    return handlePut(req.mUri, req, rep);
  } else if (req.mMethod == "DELETE")
  {
    // handle post
    return handleDelete(req.mUri, req, rep);
  }

  return false;
}


bool HttpRequestHandler::handlePost(const std::string& path, const HttpRequest& req, HttpReply& rep, HttpConnection* con)
{
  std::string server;
  std::string room;
  std::string userid;

  decodePath2(path, server, room , userid);
  if (server == "" || room == "" || userid == "" )
  {
      rep.status = HttpReply::unauthorized;
      return false;
  }
  else
  {
    if (!DataSelector::get()->find(userid))
    {
      //add to server and room
      DataSelector::get()->add(userid);
      DataSelector::get()->setServer(userid, "10000");
      DataSelector::get()->setRoom(userid, "10000", room);
      DataSelector::get()->setUserConnection(userid, room,con);
      rep.status = HttpReply::accepted;
    }else
    {
      if (DataSelector::get()->getUserConnection(userid) != con)
      {
        rep.status = HttpReply::multiple_choices;
        return true;
      }

      DataSelector::get()->leaveRoom(userid);
      DataSelector::get()->setRoom(userid, "10000", room);
      DataSelector::get()->setUserConnection(userid, room,con);
      rep.status = HttpReply::accepted;
    }

    //DataSelector::get()->get( userid, rep.mContent );
  }
  
  return true;

}

bool HttpRequestHandler::handlePut(const std::string& path, const HttpRequest& req, HttpReply& rep)
{

 std::string server;
  std::string room;
  std::string userid;

  decodePath2(path, server, room , userid);

  if (server == "" || room == "" || userid == "" )
  {
      rep.status = HttpReply::unauthorized;
      return false;
  }
  else
  {
    if (DataSelector::get()->find(userid))
    {
      if (req.mData.length())
      {
		    DataSelector::get()->put(userid, req.mData);
      }else
      {
        std::string data = req.getHeaderVal("Data");
        DataSelector::get()->put(userid, data);
      }
		rep.status = HttpReply::ok;
    }
  }
  
  return true;

}

bool HttpRequestHandler::handleDelete(const std::string& path, const HttpRequest& req, HttpReply& rep)
{
  // remove user from server 
 std::string server;
  std::string room;
  std::string userid;

  decodePath2(path, server, room , userid);
  if (server == "" || room == "" || userid == "" )
  {
      rep.status = HttpReply::unauthorized;
      return false;
  }
  else
  {
    if (DataSelector::get()->find(userid))
    {
		DataSelector::get()->leaveRoom(userid);
		DataSelector::get()->remove(userid);
		rep.status = HttpReply::ok;
    }
  }
  
  return true;

}

bool HttpRequestHandler::handleGet(const std::string& path, 
                                   const HttpRequest& req, 
                                   HttpReply& rep,
                                   HttpConnection* con)
{
  // retrieve data from server for this user
  std::string server;
  std::string room;
  std::string userid;

  if (server == "" || room == "")
  {
    threadManager.mScriptManager.getInfo(rep.mContent );
    rep.status = HttpReply::ok;
    return true;
  }
  else
  {
	  threadManager.mScriptManager.getRoomInfo( room,  rep.mContent );
    rep.status = HttpReply::ok;
  }
  
  return true;

  
}

void HttpRequestHandler::decodePath(const std::string& path, std::string& userid, std::string& server, std::string& room)
{
  typedef boost::tokenizer<boost::char_separator<char> > tokenizer;
  boost::char_separator<char> sep("/");
  tokenizer tokens(path, sep);
  tokenizer::iterator tok_iter = tokens.begin(); 

  if (tok_iter != tokens.end())
  {
    userid = *tok_iter;
    ++tok_iter;
  }
  if (tok_iter != tokens.end())
  {
    server = *tok_iter;
    ++tok_iter;
  }
  if (tok_iter != tokens.end())
  {
    room = *tok_iter;
    ++tok_iter;
  }
}


void HttpRequestHandler::decodePath2(const std::string& path, std::string& server, std::string& room, std::string& userid)
{
  typedef boost::tokenizer<boost::char_separator<char> > tokenizer;
  boost::char_separator<char> sep("/");
  tokenizer tokens(path, sep);
  tokenizer::iterator tok_iter = tokens.begin(); 

  if (tok_iter != tokens.end())
  {
    server = *tok_iter;
    ++tok_iter;
  }
  if (tok_iter != tokens.end())
  {
    room = *tok_iter;
    ++tok_iter;
  }


  if (tok_iter != tokens.end())
  {
    userid = *tok_iter;
    ++tok_iter;
  }

}

std::string HttpRequestHandler::getHeader(const HttpRequest& req, const std::string& name)
{
    for (unsigned int a=0; a< req.mHeaders.size(); a++)
    {
	  if (req.mHeaders[a].name == name) 
	  {
	    return req.mHeaders[a].value;
	  }
  }
  return "";
}

unsigned int HttpRequestHandler::getKeyNumber(std::string& s)
{
  unsigned int ret = 0;
  for (int a=0; a < s.length() ; a++ )
  {
    if (s[a] >= '0' && s[a] <= '9') 
    {
      ret = ret*10 + (s[a] - '0');
    }
  }
  return ret;
}

} // namespace qserver
