
#ifndef HTTP_SCRIPT_SERVERS_H
#define HTTP_SCRIPT_SERVERS_H

#include <boost/asio.hpp>
#include <boost/bind.hpp>

#include <string>
#include <queue>
#include <deque>

#include <boost/noncopyable.hpp>
#include <boost/thread/thread.hpp>
#include <boost/thread/mutex.hpp>
#include <boost/thread/condition.hpp>
#include <boost/shared_ptr.hpp>
#include <boost/enable_shared_from_this.hpp>
#include "../serverapi/serverko.h"


namespace gameon
{

class HttpScriptConnection;
/// The top-level class of the HTTP TcpServer.


class HttpScriptServers
{
public:

  HttpScriptServers();
  ~HttpScriptServers();

  bool addServer(HttpScriptConnection* pServer);
  static bool getServers(std::string& buffer);
  bool putData(const std::string& server , const std::string& user , const std::string& data);
  bool removeUser(const std::string& userid, const std::string& server, const std::string& room);
  bool addUser2Room( const std::string& userid, const std::string& server, const std::string& room);
  bool reconnectUser2Room( const std::string& userid, const std::string& server, const std::string& room);
  
  HttpScriptConnection* getConnection(const std::string& id) ;

  HttpScriptConnection* getConnection(int id) { return mpServers[id] ;}

private:

  void requestStatus();
  void parse( const char* pData, std::size_t size);
  void postData(std::string& queuedData);

  static HttpScriptConnection* getServer(const std::string& server);

  HttpScriptConnection*	  mpServers[10];
};


} //namespace gameon


#endif // HTTP_SCRIPT_SERVERS_H
