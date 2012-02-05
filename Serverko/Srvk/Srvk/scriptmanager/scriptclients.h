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


#ifndef SCRIPT_CLIENTS_H
#define SCRIPT_CLIENTS_H


#include <vector>
#include <string>
//#include "../sqlmanager/SQLHelper.h"


namespace qserver
{

class ScriptClient;

/** 
* ScriptClients class
* Repository of clients
*/
class ScriptClients 
{
public:

  /** 
   * Constructor
   */
  ScriptClients();

  /** 
   * Destructor
   */
  virtual ~ScriptClients();

  /** 
   * Registeres client 
   * @return a pointer to new client
   */
  ScriptClient* registerClient();

  /** 
   * Removes client with ID
   * @param id an id of client to remove
   */
  void removeClient(unsigned int id); 

  /** 
   * Sends string to all clients
   * @param outstr a string to send
   */
  void send(const std::string& outstr);

  /** 
   * Returns true if we have client
   * @param pLogin a pointer to client login name
   */
  bool isClient(const char* pLogin);

  /** 
   * Returns client by id
   * @param id an id if of client to return
   * @return pointer to client or NULL on error
   */
  ScriptClient*  getClient( unsigned int id );

  /** 
   * Returns client by name
   * @param pName a pointer to client name
   * @return pointer to client or NULL on error
   */
  ScriptClient*  getClient( const char* pName);

protected:

  /** 
   * Clears all clients
   */
  void clear();

protected:


  /** 
   * Vector of clients
   */
  std::vector<ScriptClient*>     mClientsVector;
};

} // namespace qserver


#endif // SCRIPT_CLIENTS_H
