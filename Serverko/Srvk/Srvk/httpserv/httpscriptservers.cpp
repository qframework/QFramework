#include "HttpScriptServers.h"
#include "HttpScriptConnection.h"

#ifdef _WIN32
  #ifdef _DEBUG
  #undef THIS_FILE
  static char THIS_FILE[] = __FILE__;
  #endif
#endif


namespace gameon
{


  HttpScriptServers::HttpScriptServers()
  {
	for (int a=0; a< 10; a++)
	{
	  mpServers[a] = NULL;
	}
  }

  HttpScriptServers::~HttpScriptServers()
  {
  }

  bool HttpScriptServers::addServer(HttpScriptConnection* pServer)
  {
	for (int a=0; a< 10; a++)
	{
	  if (mpServers[a] == NULL)
	  {
		mpServers[a]= pServer;
		return true;
	  }
	}	
	return false;
  }

  bool HttpScriptServers::removeUser(const std::string& userid, const std::string& server, const std::string& room)
  {
	// route post to server
	HttpScriptConnection* pServer =	  getConnection(server);
	if (!pServer)
	{
	  return false;
	}

	// send remove user from script room
	std::string mess = "<gs><room><req>leave</req>";
	mess += "<userID>" + userid + "</userID>";
	mess += "<id>" + room + "</id>";
	mess += "</room></gs>\r\n";
	pServer->send( "httpgw$" + userid + "$" + mess);

	return true;

  }

  bool HttpScriptServers::putData(const std::string& server , const std::string& user , const std::string& data)
  {
	// route post to server
	HttpScriptConnection* pServer = getConnection(server);
	if (!pServer)
	{
	  return false;
	}
	pServer->send( "httpgw$" + user + "$" + data);

	return true;
  }

  bool HttpScriptServers::addUser2Room( const std::string& userid, const std::string& server, const std::string& room)
  {
	// route post to server
	HttpScriptConnection* pServer = getConnection(server);
	if (!pServer)
	{
	  return false;
	}

	// send remove user from script room
	std::string mess = "<gs><room><req>join</req>";
	mess += "<userID>" + userid + "</userID>";
	mess += "<id>" + room + "</id>";
	mess += "</room></gs>\r\n";
	pServer->send( "httpgw$" + userid + "$" + mess);

	return true;

  }

  bool HttpScriptServers::reconnectUser2Room( const std::string& userid, const std::string& server, const std::string& room)
  {
	// route post to server
	HttpScriptConnection* pServer = getConnection(server);
	if (!pServer)
	{
	  return false;
	}

	// send remove user from script room
	std::string mess = "<gs><room><req>rejoin</req>";
	mess += "<userID>" + userid + "</userID>";
	mess += "<id>" + room + "</id>";
	mess += "</room></gs>\r\n";
	pServer->send( "httpgw$" + userid + "$" + mess);

	return true;

  }

  HttpScriptConnection* HttpScriptServers::getConnection(const std::string& id)
  {
	for (int a=0; a< 10; a++)
	{
	  HttpScriptConnection* pConn = mpServers[a];
	  if (pConn && pConn->getID() == id)
	  {
		return pConn;
	  }
	}

	return NULL;
  }
}

