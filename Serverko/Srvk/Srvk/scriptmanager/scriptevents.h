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



#ifndef SCRIPT_EVENTS_H
#define SCRIPT_EVENTS_H


#include  "scripteventbase.h"
#include <vector>

namespace qserver
{

/** 
 * ScriptEvents class
 * Container for events
 */
class ScriptEvents
{
public:

  /** 
   * Constructor
   */
  ScriptEvents();

  /** 
   * Destructor
   */
  ~ScriptEvents();

  /** 
   * Processes events
   * @param msec a current time  in msec
   */
  void process(int msec);

  /** 
   * Adds event
   * @param pNew a pointer to new event
   */
  void addEvent(ScriptEventBase* pNew);

  /** 
   * Adds offset to all events - used to pause events
   * @param msec a number of msecs to add
   */
  void addOffset(int msec);

  /** 
   * Clears all events
   */
  void deleteAll();

protected:

  /** 
   * Removes event with ID
   * @param id an id of event to add
   */
  void remove(unsigned int id);

  /** 
   * Adds new event
   * @param pEvent a pointer to new event
   */
  void add(ScriptEventBase* pEvent);

protected:

  /** 
   * Vector of all events
   */
  std::vector<ScriptEventBase*> mEvents;

};

} //namespace qserver


#endif //SCRIPT_EVENTS_H
