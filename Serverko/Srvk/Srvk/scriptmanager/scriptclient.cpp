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



#include "scriptclient.h"
#include "scriptsplayer.h"
#include "scriptscore.h"
//#include "../sqlmanager/SQLHelper.h"
#include "../threadmanager/threadmanager.h"
#include <string>
#include <boost/tokenizer.hpp>
#include "../httpserv/httpconnection.h"


namespace qserver
{

  #define TRACE_OUT(x) server_traceOut(x)

ScriptClient::ScriptClient():
  mpSession(NULL),
  mConnectionID(-1),
  mEnabled(false),
  mId(-1),
  mpParent(NULL)
{
}

ScriptClient::~ScriptClient()
{

}


void ScriptClient::setConnection(  int connection ) 
{

  mConnectionID = connection;

}



void ScriptClient::send(const std::string& outstr)
{
  if (mConnectionID)
  {
    if (outstr.find("{\"gs\":{}") == std::string::npos )
    {
//	  TcpConnection::send(mConnectionID , outstr.c_str(), (int)outstr.length());
    }
  }
}

void ScriptClient::send2User(const std::string& user, const std::string& outstr)
{
  if (mConnectionID >=0 && mEnabled)
	{
    if (mBufferedData.length() > 0)
    {
      HttpConnection::sendClientData( mBufferedData , mConnectionID);
      mBufferedData.clear();
    }
		//mConnection->sendReply(outstr);
    HttpConnection::sendClientData( outstr , mConnectionID);
	}else
  {
    mBufferedData += outstr;
  }
}


void ScriptClient::setName(const std::string& name)
{
  mName = name;
}


bool ScriptClient::isName(const char* pName)
{
  return  strcmp(pName, mName.c_str()) == 0;
}


void ScriptClient::setParent(ScriptsCore* pParent)
{
  mpParent = pParent;
 }






void ScriptClient::setScript(ScriptSession* pScript)
{
  mpSession = pScript;
}


void ScriptClient::startData()
{
  if (mConnectionID == -1)return;
  if (mSendData.size() > 3)
  {
      TRACE_OUT("ERROR: send data limit trigger");
  }
  mSendData.push_back( "" );
}


void ScriptClient::appendEvent(int id1, const char* id2, const char* pData)
{
  if (mConnectionID == -1)return;
  if (mSendData.size() == 0)
  {
      TRACE_OUT("ERROR: appending client event on empty data");
      TRACE_OUT((std::string("ERROR:") + std::string(id2)).c_str());
      TRACE_OUT((std::string("ERROR:") + std::string(pData)).c_str());
    return;
  }
  std::string buff;
    if (mSendData.back().length() == 0)
    {
      //sprintf(buff, "{\"res\":\"event\",\"id\":\"%d\",\"type\":\"%s\",\"data\":\"%s\"}",id1, id2, pData );
      buff += "{\"res\":\"event\",\"id\":\"";
      buff +=  boost::lexical_cast<std::string>(id1);
      buff += "\",\"type\":\"";
      buff += id2;
      buff += "\",\"data\":\"";
      buff += pData;
      buff += "\"}";

    }else
    {
      //sprintf(buff, ",{\"res\":\"event\",\"id\":\"%d\",\"type\":\"%s\",\"data\":\"%s\"}",id1, id2, pData );
      buff += ",{\"res\":\"event\",\"id\":\"";
      buff +=  boost::lexical_cast<std::string>(id1);
      buff += "\",\"type\":\"";
      buff += id2;
      buff += "\",\"data\":\"";
      buff += pData;
      buff += "\"}";

    }
  mSendData.back() += buff;
}


void ScriptClient::sendData()
{
  if (mConnectionID == -1)return;
  if (mSendData.size() == 0)
  {
      TRACE_OUT("ERROR: sendinf client empty data");
    return;
  }

  if ( mSendData.back().length() == 0)
  {
	  mSendData.pop_back();
	  return;
  }

  //sendbuffer.push( "{\"gs\":{\"room\":[" + data  + "]}}\r\n" );
  /*
  std::string str("<gs>");
  str += mSendData.back();
  str += ("</gs>\r\n");
  mSendData.pop_back();
  */
  std::string str("{\"gs\":{\"room\":[");
  str += mSendData.back();
  str += ("]}}\r\n");
  mSendData.pop_back();

  send2User( mName,  str );
}



const char* ScriptClient::getName()
{
  return mName.c_str();
}


void ScriptClient::leaveScript()
{
  if (mpSession)
  {
    mpSession->removeClient( getName() );
  }
}


ScriptSession* ScriptClient::getSession() const
{
  return mpSession;
}

void ScriptClient::appendTag(const char* pTag, const char* pValue )
{
  if (mSendData.size() == 0)
  {
    return;
  }
    if (pTag && pValue  && strlen(pValue))
    {
      std::string& str = mSendData.back();
      str += "\"";
      str +=pTag;
      str += "\": ";
      str += "\"";
      str += pValue;
      str += "\"";
    }
}

void ScriptClient::startTags(const char* pTag)
{
  if (mSendData.size() == 0)
  {
    return;
  }
    if (pTag)
    {
      std::string& str = mSendData.back();
      str +="\"";
      str += pTag;
      str += "\": [";
    }
}

void ScriptClient::startTag(const char* pTag)
{
  if (mSendData.size() == 0)
  {
    return;
  }
    if (pTag)
    {
      std::string& str = mSendData.back();
      if (strcmp(pTag, "undefined") != 0)
      {
        str += "{\"";
        str += pTag;
        str += "\": ";

      }else
      {
        str += "{";
      }
    }

}

void ScriptClient::endTag(const char* pTag)
{
  if (mSendData.size() == 0)
  {
    return;
  }
    if (pTag)
    {
      std::string& str = mSendData.back();
      str += "}";
    }
}

void ScriptClient::endTags(const char* pTag)
{
  if (mSendData.size() == 0)
  {
    return;
  }
    if (pTag)
    {
      std::string& str = mSendData.back();
      str += "]";
    }
}

void ScriptClient::appendSeparator()
{
  if (mSendData.size() == 0)
  {
    return;
  }
      std::string& str = mSendData.back();
      str += ",";
}


} // namespace qserver




