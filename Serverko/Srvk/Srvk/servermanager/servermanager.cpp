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

#include "servermanager.h"
#include "serverclient.h"
//#include "../sqlmanager/SQLHelper.h"


#include "../threadmanager/threadmanager.h"
#include "../serverapi/serverko.h"


namespace qserver
{

ServerManager*  ServerManager::mpServerManager = NULL;

ServerManager::ServerManager() :
mOutFunc(NULL),
mpServerClient(NULL)
{
  puts (" ServerManager ok ");
}

ServerManager::~ServerManager()
{

  if (mpServerClient)
  {
    mpServerClient->stop();
    mpServerClient->clear();

  }

  mOutFunc = NULL;
}



int ServerManager::create(ServerOutCallback pFunc, ServerOutCallback pFunc2)
{

  
  if (pFunc )
  {
    threadManager.setTrace( (ThreadTraceOutCallback)pFunc );
    threadManager.setSysTrace( (ThreadTraceOutCallback)pFunc2 );
    mOutFunc = pFunc;
    //SQLHelper::setOutFunc( pFunc);
    
  }

  return 0;
}


bool ServerManager::start()
{
  threadManager.start();
  return true;//success;
}

bool ServerManager::stop()
{
  //threadManager.stop();
  return true;//success;
}



void ServerManager::exec(char* pBuffer, int size)
{
  //threadManager.putCommand(pBuffer, size);
}


void ServerManager::exec(char* pBuffer, int size, std::string& res)
{
  ///threadManager.putCommand(pBuffer, size);
}

void ServerManager::run()
{
  // execute default script
  //execFile("start.txt");
  //execScript("boot.js");
  puts(" starting to boot ");
  execScript("boot.py");

}

void ServerManager::execFile(char* pFile)
{
  FILE* f = fopen(pFile, "rb");
  if (f == NULL) return;
  fseek(f, 0, SEEK_END);
  int sz = ftell(f);
  fseek(f, 0, SEEK_SET);
  char* pBuffer = new char[ sz + 1];
  if (pBuffer == NULL) return;
  fread(pBuffer, sz ,1, f);
  pBuffer[sz] = 0;
  fclose(f);
  
  server_onPushCommand(1, pBuffer, sz);

  //pServer->exec(pBuffer, sz);
  delete []pBuffer;
}

void ServerManager::execScript(const char* pFile)
{
  threadManager.mScriptManager.spawnScriptSession("",pFile,"");

}

} //namespace qserver

