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


#include "scriptscore.h"
#include "scriptclient.h"
#include "scripteventbase.h"
//#include "../sqlmanager/SQLHelper.h"
#include "../threadmanager/threadmanager.h"
#include <boost/tokenizer.hpp>
#include "jsscript.h"

namespace qserver
{

extern void server_traceOut(const char* pData);



void ScriptsCore::clear()
{

}

ScriptsCore::ScriptsCore()  :
  mInfoEvent(0)
{
  
}

ScriptsCore::~ScriptsCore()
{
  
  close(); 
}

int ScriptsCore::start()
{
  return 1;
}



void ScriptsCore::doTick(unsigned int msec)
{
  mEvents.process(msec);

  mInfoEvent += msec;
  if (mInfoEvent > 5*1000) //10
  {
    mInfoEvent = 0;
    // fire gather info 
    doInfo();

    JSScript::memclean();
  }
}

int ScriptsCore::close()
{
  for (unsigned int a = 0; a < mScripts.size(); a++)
  {
    if (mScripts[a] )
    {
      delete mScripts[a];
      mScripts[a] = NULL;
      
      boost::this_thread::sleep( boost::posix_time::millisec((long)100));
    }
  }
  mScripts.clear();
  return 0;
}






void ScriptsCore::stop()
{
  close();
}





void ScriptsCore::trace(const char* pTrace)
{
  server_traceOut(pTrace);

}

void ScriptsCore::getRoomInfo(int roomid, std::string& info)
{
	if (roomid >=0 && roomid < (int)mScripts.size() && mScripts[roomid])
	{
    info = "{\"gs\":{";
	  mScripts[roomid]->getGameInfo(info, true);
	  info += "}}\r\n"; 
	}
}


void ScriptsCore::getInfo(std::string& info)
{
  info = "{\"gs\":{";
  info += "\"room\":[";
  for (unsigned int a=1; a< mScripts.size(); a++)
  {
    if (mScripts[a])
    {
      mScripts[a]->getGameInfo(info, false);
    }
    if (a < mScripts.size() -1)
    {
      info += ",";
    }
  }
  info += "]";
  info += "}}\r\n"; 
}

/*
void ScriptsCore::getGameInfo(std::string& info , int id)
{
  for (unsigned int a=0; a< mScripts.size(); a++)
  {
    if (mScripts[a] && mScripts[a]->getID() == id)
    {
      mScripts[a]->getGameInfo(info);
      return;
    }
  }
  
}
*/


int ScriptsCore::addScript(ScriptSession* pScript)
{
  for (unsigned int a=0; a< mScripts.size(); a++)
  {
    if (mScripts[a] == NULL)
    {
      mScripts[a] = pScript;
      pScript->setID(a);
      return a;
    }
  }
  mScripts.push_back(pScript);
  pScript->setID((unsigned int)mScripts.size()-1);
  return (unsigned int)(mScripts.size()-1);
}


ScriptSession* ScriptsCore::getScript(int id)
{
  if (id < 0 || id >= (int)mScripts.size() || mScripts[id] == NULL)
  {
    return NULL;
  }
  return mScripts[id];
}

void ScriptsCore::doInfo()
{
  if (mScripts.size() < 2)
  {
    return;
  }
  int last = (int)mScripts.size()-1;
  if (!mScripts[last]->started())
  {
    return;
  }
  std::string info;
  getInfo(info);
  //0 
  ScriptSession* pServerB = mScripts[1];
  if (pServerB)
  {
    pServerB->onClientData("serverko_system", info.c_str());
  }
}

   

} //namespace qserver


