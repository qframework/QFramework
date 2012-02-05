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


#ifndef PY_SCRIPT_H
#define PY_SCRIPT_H


#include <boost/python.hpp>
#include "script.h"

namespace qserver 
{

/** 
* PYScript class
* Extends python
*/
class PYScript : public Script,
    private boost::noncopyable
{

  friend class ServerkoClass;
public:

  /** 
   * Constructor
   */
  PYScript();

  /** 
   * Destructor
   */
  virtual ~PYScript();
  
  /** 
   * Inits PY engine
   */
  virtual void init();

  /** 
   * Loads game script
   * @param fnama a referenct to script name
   * @return true on success
   */
  virtual bool loadGameScript(const std::string& fname);

  /** 
   * Executes script game init function
   */
  virtual void execGameInit();

  /** 
   * Executes script start function
   */
  virtual void execGameStart();

  /** 
   * Executes game get info function
   * @param retVal a reference to vector of string values
   * @return true on success
   */
  virtual bool execGameInfo(std::vector<StringString>& retVal);

  /** 
   * Executes script on game event function
   * @param id an id of event
   * @param pUserData a pointer to string used as userdata
   * @return true on success
   */
  virtual bool execOnGameEvent(int id, const char* pUserData);

  /** 
   * Executes script on client connected
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientConnected(const char* pId);

  /** 
   * Executes script on client reconnected
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientReConnected(const char* pId);

  /** 
   * Executes script on client disconnected
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientDisConnected(const char* pId);

  /** 
   * Executes script on client data
   * @param pId a pointer to userID 
   * @return true on success
   */
  virtual bool execOnClientData(const char* pId, const char* pData);

protected:

  /** 
   * Loads new JS module in namespace
   * @param pModule a pointer to module name
   */
  virtual void loadModule(const char* pModule);

  /** 
   * traces current script error
   * @param pModule a pointer to module name
   */
  static void traceError();

  /** 
   * handler for init function exec
   * @param pThis a pointer to this object
   */
  static void exec_init(PYScript* pThis);


  /** 
   * handler for load script function exec
   * @param pThis a pointer to this object
   * @param pScript a name of script to exec
   */
  static void exec_loadscript(PYScript* pThis, const char* pScript );

  /** 
   * pointer to main PY object
   */
  boost::python::object    mMain;

  /** 
   * pointer to script dictonary
   */
  boost::python::dict      mDict;
};


} // namespace qserver

#endif



