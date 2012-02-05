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


#ifndef SCRIPT_EVENTS_BASE_H
#define SCRIPT_EVENTS_BASE_H


#include <string>

namespace qserver
{

/*
 * Type of event period
 */
typedef enum
{
  SCRIPT_EVENT_DONCE,
  SCRIPT_EVENT_PERIODIC
} ScriptEventPeriod;

/** 
 * ScriptEventBase class
 * Base class for events
 */
class ScriptEventBase
{
  friend class ScriptEvents;

public:

  /** 
   * Constructor
   */
  ScriptEventBase();

  /** 
   * Destructor
   */
  virtual ~ScriptEventBase();

  /** 
   * Sets event data
   * @param pEventData a pointer to custom event data
   * @param eventPeriod a type of event
   * @param eventTime a time delay for event 
   */
  void set(void* pEventData, ScriptEventPeriod eventPeriod, int eventTime);


  /** 
   * Processes event - checks if event should fire
   * @param msec a current time  in msec
   * @return true if event should be executed 
   */
  virtual bool process(int msec);

  /** 
   * Returns type of event period
   * @return type of event
   */
  ScriptEventPeriod   getPeriod() const;

public:

  /** 
   * event id
   */
  int             mEventID;

  /** 
   * User that invoked event
   */
  std::string	    mStrUser;

protected:

  /** 
   * Pointer to event data
   */
  void*             mpEventData;

  /** 
   * Type of event
   */
  ScriptEventPeriod   mEventPeriod;

  /** 
   * Time when event should fire
   */
  int               mEventTime;

  /** 
   * Current time
   */
  int               mCurrTick;

  /** 
   * True if event expired - should be executed
   */
  bool              mExpired;
  
};

} //namespace qserver


#endif //SCRIPT_EVENTS_BASE_H
