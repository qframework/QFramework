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


#include "scriptclients.h"
#include "scriptclient.h"

namespace qserver
{


ScriptClients::ScriptClients() 
{
  
}

ScriptClients::~ScriptClients()
{
  clear(); 
}

void ScriptClients::clear()
{
  for (unsigned int a=0; a< mClientsVector.size(); a++)
  {
    if (mClientsVector[a])
    {
      delete mClientsVector[a];
    }
  }

}

ScriptClient* ScriptClients::registerClient()
{
  unsigned int a=0;


  // add new node into DOM
  // assign this new node with client 

  ScriptClient* pCl = new ScriptClient();
    
  for (a=0; a< mClientsVector.size(); a++)
  {
    if (mClientsVector[a] == NULL)
    {
      mClientsVector[a] = pCl;
      pCl->mId = a;
      return pCl;
    }
  }
  pCl->mId = a;
  mClientsVector.push_back(pCl);
  return pCl;

  return NULL;
}


void ScriptClients::removeClient(unsigned int id)
{
  if (id >= mClientsVector.size() )
  {
    return;
  }
  if (mClientsVector[id])
  {
    delete mClientsVector[id];
    mClientsVector[id] = NULL;
  }
}



// sends string to connected client
void ScriptClients::send(const std::string& outstr)
{
  for (unsigned int a=0; a< mClientsVector.size(); a++)
  {
    ScriptClient* pCl = mClientsVector[a];
    if (pCl)
    {
      pCl->send( outstr );
    }
  }
}

bool ScriptClients::isClient(const char* pLogin)
{
  if (pLogin == NULL)
  {
    return false;
  }
  for (unsigned int a=0; a< mClientsVector.size(); a++)
  {
    ScriptClient* pCl = mClientsVector[a];
    if (pCl && pCl->isName(pLogin) )
    {
      return true;
    }
  }
  return false;
}

ScriptClient*  ScriptClients::getClient( unsigned int id )
{
  if (id >= mClientsVector.size() )
  {
    return NULL;
  }
  return mClientsVector[id];
}






ScriptClient*  ScriptClients::getClient( const char* pName)
{
  unsigned int a;

  // process clients - transport ticks
  for (a=0; a< mClientsVector.size(); a++)
  {
    if (mClientsVector[a] && mClientsVector[a]->isName( pName) )
    {
      return mClientsVector[a];
    }
  }
  return NULL;
}

} //namespace qserver

