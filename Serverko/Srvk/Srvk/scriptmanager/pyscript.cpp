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


#include "pyscript.h"
#include <string>
#include <boost/lexical_cast.hpp>
#include "../threadmanager/threadmanager.h"
#include "scriptsession.h"


namespace qserver 
{



extern void server_traceOut(const char* pData);
#define TRACE_OUT(x) server_traceOut(x)


class PythonException
{
    std::string     m_exception_type;
    std::string     m_error_message;

public:
    PythonException():m_exception_type(""),m_error_message(""){};

    void setExceptionType(std::string msg) {m_exception_type = msg;}
    void setErrorMessage(std::string msg) {m_error_message = msg;}
    std::string getExceptionType() {return m_exception_type;}
    std::string getErrorMessage(void) {return m_error_message;}
};

void getExceptionDetail(PythonException& exc)
{
    PyObject*   exc_type;
    PyObject*   exc_value;
    PyObject*   exc_traceback;
    PyObject*   pystring;

    PyErr_Fetch(&exc_type, &exc_value, &exc_traceback);
    if( exc_type==0 && exc_value==0 && exc_traceback==0)
    {
        exc.setExceptionType("Strange: No Python exception occured");
        exc.setErrorMessage("Strange: Nothing to report");
    }
    else
    {
        pystring = NULL;
        if (exc_type != NULL &&
           (pystring = PyObject_Str(exc_type)) != NULL &&     /*
str(object) */
           (PyString_Check(pystring))
           )
            exc.setExceptionType(PyString_AsString(pystring));
        else
            exc.setExceptionType("<unknown exception type>");

        Py_XDECREF(pystring);

        pystring = NULL;
        if (exc_value != NULL &&
           (pystring = PyObject_Str(exc_value)) != NULL &&     /*
str(object) */
           (PyString_Check(pystring))
           )
            exc.setErrorMessage(PyString_AsString(pystring));
        else
            exc.setErrorMessage("<unknown exception data>");

        Py_XDECREF(pystring);

        Py_XDECREF(exc_type);
        Py_XDECREF(exc_value);         /* caller owns all 3 */
        Py_XDECREF(exc_traceback);     /* already NULL'd out */
    }
}

// A function taking a hello object as an argument.
  // A friendly class.
class ServerkoClass
{
  public:
    ServerkoClass(int id)
    {
      pScript = (PYScript*)Script::getScript(id);
    }

    void trace(std::string mess)
    { 
      TRACE_OUT(mess.c_str());
    }
    
    void startTcp(std::string port)
    { 
      pScript->startTcp(port.c_str() );
    }

    void startHttp(std::string port)
    { 
      pScript->startHttp(port.c_str() );
    }

    void setDB(std::string connstr)
    { 
      pScript->setDB(connstr.c_str() );
    }

    void scriptAdd(std::string wdir, std::string script, std::string name)
    { 
      pScript->scriptAdd( wdir.c_str() , script.c_str() , name.c_str() );
    }
    void loadModule(std::string module)
    { 
      pScript->loadModule( module.c_str() );
    }

    void startData()
    {
      pScript->startData();
    }
    void appendEvent(int id1, std::string id2, std::string data )
    {
	  pScript->appendEvent(id1, id2.c_str(), data.c_str() );
    }
    void sendData()
    {
      pScript->sendData();
    }

    void clientStartData(std::string data)
    {
      pScript->clientStartData(data.c_str() );
    }

    void clientAppendTag(std::string userID, std::string tag, std::string  value )
    {
      pScript->clientAppendTag(userID.c_str(), tag.c_str(), value.c_str() );
    }
    
    void clientStartTag(std::string userID, std::string tag)
    {
      pScript->clientStartTag(userID.c_str(), tag.c_str() );
    }

    void clientEndTag(std::string userID, std::string tag)
    {
      pScript->clientEndTag(userID.c_str(), tag.c_str() );
    }

	void appendTag(std::string tag, std::string  value )
    {
      pScript->appendTag(tag.c_str(), value.c_str() );
    }
    
    void startTag(std::string tag)
    {
      pScript->startTag(tag.c_str() );
    }

    void endTag(std::string tag)
    {
      pScript->endTag( tag.c_str() );
    }

    void clientAppendEvent(std::string userID, int id1, std::string id2, std::string data )
    {
	  pScript->clientAppendEvent(userID.c_str(), id1, id2.c_str(), data.c_str() );
    }

    void clientSendData(std::string userID)
    {
      pScript->clientSendData(userID.c_str() );
    }

    void sendEvent( int id, int delay, std::string data)
    {
      pScript->eventScript(id, delay, data.c_str() );
    }

protected:
  PYScript* pScript;
};


BOOST_PYTHON_MODULE(extending)
{
    using namespace boost::python;
    class_<ServerkoClass>("ServerkoClass",init<int>())
        .def("trace", &ServerkoClass::trace)
        .def("startTcp", &ServerkoClass::startTcp)
        .def("scriptAdd", &ServerkoClass::scriptAdd)
        .def("loadModule", &ServerkoClass::loadModule)
        .def("startHttp", &ServerkoClass::startHttp)
        .def("setDB", &ServerkoClass::setDB)
        .def("startData", &ServerkoClass::startData)
        .def("appendEvent", &ServerkoClass::appendEvent)
        .def("sendData", &ServerkoClass::sendData)
        .def("clientStartData", &ServerkoClass::clientStartData)
        .def("clientAppendTag", &ServerkoClass::clientAppendTag)
        .def("clientStartTag", &ServerkoClass::clientStartTag)
        .def("startData", &ServerkoClass::clientStartData)
        .def("appendTag", &ServerkoClass::appendTag)
        .def("startTag", &ServerkoClass::startTag)
        .def("endTag", &ServerkoClass::endTag)
        .def("clientAppendEvent", &ServerkoClass::clientAppendEvent)
        .def("clientSendData", &ServerkoClass::clientSendData)
        .def("sendEvent", &ServerkoClass::sendEvent)
        ;
    
}



PYScript::PYScript()
{

 
}


PYScript::~PYScript()
{
}

void PYScript::init()
{
  boost::python::handle_exception( boost::bind(qserver::PYScript::exec_init, this) );

  if (PyErr_Occurred())
  {
	traceError();
      //PyErr_Print();
  }

}

void PYScript::exec_init(PYScript* pThis)
{


 if (PyImport_AppendInittab("extending", initextending) == -1)
 {
    throw std::runtime_error("Failed to add embedded_hello to the interpreter's "
                 "builtin modules");
 }

  Py_Initialize();


  pThis->mMain = boost::python::import("__main__");
  
  // get our namespace
  pThis->mDict = boost::python::dict( pThis->mMain.attr("__dict__") );
  
  boost::python::exec("import extending", pThis->mDict, pThis->mDict );//pThis->mGlobal, pThis->mGlobal);
  if (PyErr_Occurred())
  {
	traceError();
      //PyErr_Print();
  }

  std::string initstr = "serverko = extending.ServerkoClass(";
  initstr += boost::lexical_cast<std::string>( pThis->mpParent->getID() );
  initstr += ")";
  boost::python::exec( initstr.c_str(), pThis->mDict, pThis->mDict ); //pThis->mGlobal, pThis->mGlobal);
  if (PyErr_Occurred())
  {
	traceError();
      //PyErr_Print();
  }
  
  // extend python
}


bool PYScript::loadGameScript(const std::string& fname)
{
  mScriptName = "../scriptpool/scripts/" + fname;


  boost::python::handle_exception( boost::bind(qserver::PYScript::exec_loadscript, this, mScriptName.c_str()) );

  if (PyErr_Occurred())
  {

    //boost::python::object result= mDict.get("sys.exc_traceback");
    //std::string ret = boost::python::extract<std::string>(result);
    traceError();
    return false;
  }

  return true;
}

void PYScript::exec_loadscript(PYScript* pThis, const char* pScript )
{
  boost::python::object result = boost::python::exec_file(pScript, pThis->mDict, pThis->mDict );//pThis->mGlobal, pThis->mGlobal);

}

void PYScript::execGameInit()
{
  try
  {
    if (mDict.get("script_init"))
    {
      mDict.get("script_init")();
    }
  }
  catch(...)
  {
    traceError();
  }

}

void PYScript::execGameStart()
{
  try
  {
    if (mDict.get("script_start"))
    {
      mDict.get("script_start")();
    }
  }
  catch(...)
  {
    traceError();
  }

}

bool PYScript::execGameInfo(std::vector<StringString>& retVal)
{
  if (!mDict.get("script_info"))
  {
    return false;
  }
  boost::python::object result = mDict.get("script_info")();
  if (result == NULL)
  {
    return false;
  }

  std::string ret = boost::python::extract<std::string>(result);

  char* retstr = (char*)ret.c_str();
  char* name  = strtok( retstr, ":\t");
  char* val  = strtok( NULL, ":\t");
  StringString prop;
  while (name && val)
  {
    prop.mId = name;
    prop.mValue = val;
    retVal.push_back(prop);
    name  = strtok( NULL, ":\t");
    val  = strtok( NULL, ":\t");

  }

  return true;
  
}

bool PYScript::execOnGameEvent(int id, const char* pUserData)
{
  try
  {
    if (mDict.get("script_onEvent"))
    {
      mDict.get("script_onEvent")(id, std::string(pUserData));
      return true;
    }
  }
  catch(...)
  {
    traceError();
  }
  return false;
}



bool PYScript::execOnClientConnected(const char* pId)
{
  try
  {
    if (mDict.get("script_userJoined"))
    {
      mDict.get("script_userJoined")(pId);
      return true;
    }
  }
  catch(...)
  {
    traceError();
  }

  return false;
}

bool PYScript::execOnClientReConnected(const char* pId)
{
  try
  {
    if (mDict.get("script_onUserReJoined"))
    {
      mDict.get("script_onUserReJoined")(pId);
      return true;
    }
  }
  catch(...)
  {
    traceError();
  }

  return false;
}

bool PYScript::execOnClientDisConnected(const char* pId)
{
  try
  {
    if (mDict.get("script_onUserLeft"))
    {
      mDict.get("script_onUserLeft")(pId);
      return true;
    }
  }
  catch(...)
  {
    traceError();
  }

  return false;
}

bool PYScript::execOnClientData(const char* pId, const char* pData)
{
  try
  {

    if (mDict.get("script_onUserData"))
    {
      mDict.get("script_onUserData")(std::string(pId), std::string(pData));
      return true;
    }
  }
  catch(...)
  {
    traceError();
  }

  return false;
}


void PYScript::loadModule(const char* pModule)
{
  std::string fname;
  fname = "../scriptpool/scripts/" + std::string(pModule);


  boost::python::handle_exception( boost::bind(qserver::PYScript::exec_loadscript, this, fname.c_str() ) );

  if (PyErr_Occurred())
  {
      //PyErr_Print();
	  traceError();
      return ;
  }

}

void PYScript::traceError()
{
  PythonException e;
  getExceptionDetail(e);
  TRACE_OUT( "PY ERROR");
  TRACE_OUT( std::string(std::string("ERROR:") + e.getExceptionType()).c_str() );
  TRACE_OUT( std::string(std::string("ERROR:") + e.getErrorMessage()).c_str() );
}

} // namespace qserver
