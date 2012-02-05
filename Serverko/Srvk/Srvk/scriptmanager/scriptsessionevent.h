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

#ifndef _SCRIPT_SESSION_EVENT_
#define _SCRIPT_SESSION_EVENT_


#include "scripteventbase.h"

namespace qserver
{

typedef enum ScriptSessionEventType
{
  SCRIPT_SESSION_EVENT_NONE,
  SCRIPT_SESSION_EVENT_START,
  SCRIPT_SESSION_EVENT_GAME,
  SCRIPT_SESSION_EXEC_SCRIPT,
  SCRIPT_SESSION_CLIENT_CONNECTED,
  SCRIPT_SESSION_CLIENT_RECONNECTED

} ScriptSessionEventType;


class ScriptSessionEvent : public ScriptEventBase
{
public:
  ScriptSessionEvent();
  virtual ~ScriptSessionEvent();

  virtual bool process(int msec);

  ScriptSessionEventType m_sessionEventType;
  std::string       mUserData;
protected:
  void execute();


};

} //namespace qserver



#endif //_EVENT_CONNECT_H
