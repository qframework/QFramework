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



#include "localdataselector.h"
#include "../scriptmanager/scriptsession.h"
#include <boost/thread/mutex.hpp>
#include <boost/thread/condition.hpp>
#include <boost/lexical_cast.hpp>
#include "httpserver.h"
#include "../threadmanager/threadmanager.h"

namespace qserver 
{


  /**
  * Map for storing users
  */

  

  LocalDataSelector::LocalDataSelector()
  {
  }


  LocalDataSelector::~LocalDataSelector()
  {

  }


  bool LocalDataSelector::add(const std::string& user)
  {
    if (!find(user))
    {
      boost::mutex::scoped_lock lck(users_mutex);

      // insert user into map
      HttpUser userdata;
      userdata.mUsername = user;
      mUsers.insert( UsersPair( user, userdata) );
      return true;
    }
    return false;
  }

  bool LocalDataSelector::find(const std::string& user)
  {
    boost::mutex::scoped_lock lck(users_mutex);
    UsersMap::iterator iter = mUsers.find(user);
    if (iter != mUsers.end() )
    {
      return true;
    }
    return false;
  }

  bool LocalDataSelector::remove(const std::string& user)
  {
    std::string server;
    std::string room;
    bool toremove = false;

    {
      boost::mutex::scoped_lock lck(users_mutex);
      UsersMap::iterator iter = mUsers.find(user);

      if (iter != mUsers.end() )
      {
        if (iter->second.mRoomID.length() )
        {
          // remove user from server
          server = iter->second.mServerID;
          room = iter->second.mRoomID;
          toremove = true;

          if (iter->second.mConnection)
          {
            iter->second.mConnection = NULL;
          }
        }
        mUsers.erase( user );
      }
    }

    if (toremove)
    {
      /*
      ScriptSession* session = threadManager.mScriptManager.getScript(boost::lexical_cast<int>(room));
      if (session)
      {
        session->removeClient(user.c_str());
      }*/
    
      threadManager.putUserDisConnected( user, boost::lexical_cast<int>(room));
      
    }
    return toremove;
  }


  bool LocalDataSelector::setServer(const std::string& user, const std::string& server)
  {
    std::string oldserver;
    std::string room;
    bool toremove = false;
    bool res = false;
    {
      boost::mutex::scoped_lock lck(users_mutex);
      UsersMap::iterator iter = mUsers.find(user);

      if (iter != mUsers.end() )
      {
        if (iter->second.mServerID.length() && iter->second.mRoomID.length() )
        {
          if (server == iter->second.mServerID) // allready logged on server
          {
            return false;
          }else
          {
            // send leave room to server
            oldserver = iter->second.mServerID;
            room = iter->second.mRoomID;
            toremove = true;
          }
        } 
      }
      iter->second.mServerID = server;
      res = true;
    }

    if (toremove)
    {
      //HttpServer::connections().removeUser(user, server , room);
    }

    return res;
  }

  bool LocalDataSelector::put(const std::string& user , const std::string& data)
  {
    std::string server;
    std::string room;
    {
      boost::mutex::scoped_lock lck(users_mutex);
      UsersMap::iterator iter = mUsers.find(user);
      if (iter != mUsers.end() )
      {
        // route data to server 
        server = iter->second.mServerID;
        room = iter->second.mRoomID;
      }
    }

	if (server.length() && room.length() )
    {
      /*
      ScriptSession* session = threadManager.mScriptManager.getScript(boost::lexical_cast<int>(room));
      if (session)
      {
        session->onClientData(user.c_str() , data.c_str() );
      }*/
      threadManager.putUserData( user, data, boost::lexical_cast<int>(room));

      return true;
    }
    return false;
  }


  

  bool LocalDataSelector::setRoom(const std::string& user, const std::string& server, const std::string& room)
  {
    boost::mutex::scoped_lock lck(users_mutex);

    UsersMap::iterator iter = mUsers.find(user);

    if (iter != mUsers.end() )
    {
      if (iter->second.mServerID.length() )
      {
        if (iter->second.mRoomID.length() )
        {
          if (iter->second.mServerID == server && iter->second.mRoomID == room)
          {
            //HttpServer::connections().reconnectUser2Room(user, iter->second.mServerID, iter->second.mRoomID);
          }else
          {
            // send leave room to server
            //HttpServer::connections().removeUser(user, iter->second.mServerID, iter->second.mRoomID);
          }
        }
      }


      iter->second.mServerID = server;
      iter->second.mRoomID = room;
      /// add user 
      //HttpServer::connections().addUser2Room(user, iter->second.mServerID, iter->second.mRoomID);
      /*
      ScriptSession* session = threadManager.mScriptManager.getScript(boost::lexical_cast<int>(room));
      if (session)
      {
        session->fireClientJoined(user);
      }
      */
      //threadManager.putUserConnected( user, boost::lexical_cast<int>(room));
      return true;
    }

    return false;
  }

  bool LocalDataSelector::leaveRoom(const std::string& user)
  {
    boost::mutex::scoped_lock lck(users_mutex);

    UsersMap::iterator iter = mUsers.find(user);
    if (iter != mUsers.end() )
    {
      if (iter->second.mServerID.length() && iter->second.mRoomID.length() )
      {
        if (iter->second.mConnection)
        {
          //iter->second.mConnection->stop();
          //iter->second.mConnection = NULL;
        }
        //HttpServer::connections().removeUser(user, iter->second.mServerID, iter->second.mRoomID);
        /*
        ScriptSession* session = threadManager.mScriptManager.getScript(boost::lexical_cast<int>(iter->second.mRoomID));
        if (session)
        {
          session->removeClient(user.c_str());
		      iter->second.mRoomID = "";
        }*/
        threadManager.putUserDisConnected( user, boost::lexical_cast<int>(iter->second.mRoomID));
        iter->second.mRoomID = "";
        return true;
      }
    }

    return false;
  }


  void LocalDataSelector::setUserConnection( const std::string& userid, const std::string& room,  HttpConnection* connection)
  {
    boost::mutex::scoped_lock lck(users_mutex);
    UsersMap::iterator iter = mUsers.find(userid);
    if (iter != mUsers.end() )
    {
      // store data to user buffers
      iter->second.mConnection = connection;
      connection->setUser(userid);
    }
    /*
	  ScriptSession* session = threadManager.mScriptManager.getScript(boost::lexical_cast<int>(room));
	  if (session)
	  {
		  session->addClient(userid,connection );
		  connection->setUser(userid);
	  }
    */
    threadManager.putUserConnected( userid, connection->getId(), boost::lexical_cast<int>(room));
	  
  }

  HttpConnection* LocalDataSelector::getUserConnection( const std::string& userid)
  {
    boost::mutex::scoped_lock lck(users_mutex);
    UsersMap::iterator iter = mUsers.find(userid);
    if (iter != mUsers.end() )
    {
      return iter->second.mConnection;
    }
    return NULL;
  }


} // namespace qserver

