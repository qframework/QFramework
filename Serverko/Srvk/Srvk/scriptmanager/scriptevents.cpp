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


#include "scriptevents.h"


namespace qserver
{

ScriptEvents::ScriptEvents() 
{
}

ScriptEvents::~ScriptEvents()
{
  for (unsigned int a=0; a < mEvents.size(); a++)
  {
    if (mEvents[a])
    {
      delete mEvents[a];
    }
  }
  
}

void ScriptEvents::addEvent(ScriptEventBase* pNew)
{
  add( (ScriptEventBase*)pNew);
}


void ScriptEvents::process(int msec)
{
  std::vector<ScriptEventBase*> toexec;

  unsigned int c = 0;
  
  // check all events if there is one to be executed
  while (c< mEvents.size())
  {
    ScriptEventBase* pEvent = mEvents[c];
    if (pEvent)
    {
      pEvent->mCurrTick+= msec;
      if (pEvent->mCurrTick >= pEvent->mEventTime )
      {
        toexec.push_back(pEvent);
        if (pEvent->getPeriod() == SCRIPT_EVENT_DONCE)
        {
          pEvent->mExpired = true;
          mEvents[c]=0;
        }
      }
    }
    c++;
  }

  c=0;
  // execute events
  while(c < toexec.size())
  {
    ScriptEventBase* pEvent = toexec[c];
    if (pEvent)
    {
      pEvent->process( msec );
      delete pEvent;
    }
    c++;
  }

}

void ScriptEvents::add(ScriptEventBase* pEvent)
{
  for (unsigned int a=0; a< mEvents.size(); a++)
  {
    if (mEvents[a] == NULL)
    {
      mEvents[a] = pEvent;
      return;
    }
  }
  mEvents.push_back( pEvent);
}

void ScriptEvents::remove(unsigned int id)
{
  if ( id >= mEvents.size() )
  {
    return;
  }

  if (mEvents[id])
  {
    delete mEvents[id];
    mEvents[id] = 0;
  }
}

void ScriptEvents::addOffset(int msec)
{
  // add offset to all events
  unsigned int c = 0;
  while (c < mEvents.size())
  {
    ScriptEventBase* pEvent = mEvents[c];
    if (pEvent)
    {
      pEvent->mCurrTick+= msec;
      pEvent->mEventTime += msec;
    }
    c++;
  }
}

void ScriptEvents::deleteAll()
{
  for (unsigned int a=0; a < mEvents.size(); a++)
  {
    if (mEvents[a])
    {
      delete mEvents[a];
    }
  }
  mEvents.clear();
}

} //namespace qserver


