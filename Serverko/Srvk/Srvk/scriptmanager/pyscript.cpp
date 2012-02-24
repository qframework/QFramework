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
#include <frameobject.h>


namespace qserver 
{


extern void server_traceOut(const char* pData);
#define TRACE_OUT(x) server_traceOut(x)

    std::string extractException()
    {
        using namespace boost::python;
    
        PyObject *exc,*val,*tb;
        PyErr_Fetch(&exc,&val,&tb);
        PyErr_NormalizeException(&exc,&val,&tb);
        handle<> hexc(exc),hval(allow_null(val)),htb(allow_null(tb));
        if(!hval)
        {
            return extract<std::string>(str(hexc));
        }
        else
        {
            object traceback(import("traceback"));
            object format_exception(traceback.attr("format_exception"));
            object formatted_list(format_exception(hexc,hval,htb));
            object formatted(str("").join(formatted_list));
            return extract<std::string>(formatted);
        }

    }


    class PythonException
    {
        std::string     m_exception_type;
        std::string     m_error_message;
        std::string     m_traceback;

    public:
        PythonException():m_exception_type(""),m_error_message(""){};

        void setExceptionType(std::string msg) {m_exception_type = msg;}
        void setErrorMessage(std::string msg) {m_error_message = msg;}
        void setTraceback(std::string msg) {m_traceback = msg;}
        std::string getExceptionType() {return m_exception_type;}
        std::string getErrorMessage(void) {return m_error_message;}
        std::string getTraceback(void) {return m_traceback;}
    };

    void getExceptionDetail(PythonException& exc)
    {
        PyObject*   exc_type;
        PyObject*   exc_value;
        PyObject*   exc_traceback;
        PyObject*   pystring;

        PyErr_Fetch(&exc_type, &exc_value, &exc_traceback);
        PyErr_NormalizeException(&exc_type, &exc_value, &exc_traceback);

        if( exc_type==0 && exc_value==0 && exc_traceback==0)
        {
            exc.setExceptionType("Strange: No Python exception occured");
            exc.setErrorMessage("Strange: Nothing to report");
        }
        else
        {
            pystring = NULL;
            if (exc_type != NULL && (pystring = PyObject_Str(exc_type)) != NULL &&  (PyString_Check(pystring)))
            {
                exc.setExceptionType(PyString_AsString(pystring));
            }
            else
            {
                exc.setExceptionType("<unknown exception type>");
            }

            Py_XDECREF(pystring);

            pystring = NULL;
            if (exc_value != NULL && (pystring = PyObject_Str(exc_value)) != NULL && (PyString_Check(pystring)))
            {
                exc.setErrorMessage(PyString_AsString(pystring));
            }
            else
            {
                exc.setErrorMessage("<unknown exception data>");
            }
            Py_XDECREF(pystring);

            pystring = NULL;
            if (exc_traceback != NULL && (pystring = PyObject_Str(exc_traceback)) != NULL && (PyString_Check(pystring)))
            {
                std::string str("frame:");
                PyThreadState *tstate = PyThreadState_GET();
                PyTracebackObject *frame = (PyTracebackObject *)exc_traceback;
                printf("Python stack trace:\n");
                while (frame->tb_next) {
                    int line = frame->tb_lineno;
                    const char* filename = PyString_AsString(frame->tb_frame->f_code->co_filename);
                    frame = frame->tb_next;
                    str += boost::lexical_cast<std::string>(line);
                    str += " ";
                    str += filename;
                    str += " | ";
                }

                exc.setTraceback(str);
            }
            else
            {
                exc.setTraceback("<no stack trace >");
            }
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

        void sendData(std::string data)
        {
            pScript->sendData(data.c_str());
        }


        void clientSendData(std::string userID , std::string data)
        {
            pScript->clientSendData(userID.c_str() , data.c_str() );
        }
        void disconnectClient(std::string userID)
        {
            pScript->disconnectClient(userID.c_str() );
        }
        void sendEvent( int id, int delay, std::string data)
        {
            pScript->eventScript(id, delay, data.c_str() );
        }
        void trace(std::string mess)
        { 
            TRACE_OUT(mess.c_str());
        }
        void loadModule(std::string module)
        { 
            pScript->loadModule( module.c_str() );
        }
        void loadModule2(std::string module)
        { 
            pScript->loadModule2( module.c_str() );
        }
        void evals(int delay , std::string module)
        { 
            pScript->exec( delay , module.c_str() );
        }



        void startTcp(std::string port)
        { 
            pScript->startTcp(port.c_str() );
        }
        void scriptAdd(std::string wdir, std::string script, std::string name)
        { 
            pScript->scriptAdd( wdir.c_str() , script.c_str() , name.c_str() );
        }

        void startHttp(std::string port)
        { 
            pScript->startHttp(port.c_str() );
        }

        void setDB(std::string connstr)
        { 
            pScript->setDB(connstr.c_str() );
        }





    protected:
        PYScript* pScript;
    };


    BOOST_PYTHON_MODULE(extending)
    {
        using namespace boost::python;
        class_<ServerkoClass>("ServerkobClass",init<int>())

            .def("sendData", &ServerkoClass::sendData)

            .def("clientSendData", &ServerkoClass::clientSendData)
            .def("disconnectClient", &ServerkoClass::disconnectClient)

            .def("sendEvent", &ServerkoClass::sendEvent)
            .def("trace", &ServerkoClass::trace)
            .def("loadModule", &ServerkoClass::loadModule)
            .def("loadModule2", &ServerkoClass::loadModule2)
            .def("evals", &ServerkoClass::evals)
            .def("startTcp", &ServerkoClass::startTcp)
            .def("scriptAdd", &ServerkoClass::scriptAdd)
            .def("startHttp", &ServerkoClass::startHttp)
            .def("setDB", &ServerkoClass::setDB)
            ;

    }



    PYScript::PYScript()
    {
        mScriptType = PYTHON;

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

    void PYScript::loadFramework()
    {
        loadScript("framework/serverkobridge.py");
        loadScript("framework/room.py");
        loadScript("framework/colors.py");
        loadScript("framework/layout.py");
        loadScript("framework/qframework.py");

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

        std::string initstr = "serverkob = extending.ServerkobClass(";
        initstr += boost::lexical_cast<std::string>( pThis->mpParent->getID() );
        initstr += ")";
        boost::python::exec( initstr.c_str(), pThis->mDict, pThis->mDict ); //pThis->mGlobal, pThis->mGlobal);
        if (PyErr_Occurred())
        {
            traceError();
            //PyErr_Print();
        }

    }

    bool PYScript::loadGameScript(const std::string& fname)
    {
        loadFramework();
        if (mWDir.length())
        {
            if (loadScript(mWDir + "/" + fname) == false)
            {
                return false;
            }
        }else
        {
            if (loadScript(fname) == false)
            {
                return false;
            }
        }

        return true;
    }

    bool PYScript::loadScript(const std::string& fname)
    {
        mScriptName = "../scriptpool/scripts/" + fname;


        boost::python::handle_exception( boost::bind(qserver::PYScript::exec_loadscript, this, mScriptName.c_str()) );

        if (PyErr_Occurred())
        {

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
            if (mDict.get("Q_handlers_script_init"))
            {
                mDict.get("Q_handlers_script_init")();
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
            if (mDict.get("Q_handlers_script_start"))
            {
                mDict.get("Q_handlers_script_start")();
            }
        }
        catch(...)
        {
            traceError();
        }

    }

    bool PYScript::execGameInfo(std::vector<StringString>& retVal)
    {

        boost::python::object result;

        try
        {

            boost::python::object fn = mDict.get("Q_handlers_script_info");
            if (!fn)
            {
                return false;
            }
            result = fn();
            if (result == NULL)
            {
                return false;
            }
        }
        catch(const boost::python::error_already_set& /*e*/)
        {
            traceError();
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
            if (mDict.get("Q_handlers_script_onEvent"))
            {
                mDict.get("Q_handlers_script_onEvent")(id, std::string(pUserData));
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
            if (mDict.get("Q_handlers_script_userJoined"))
            {
                mDict.get("Q_handlers_script_userJoined")(pId);
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
            if (mDict.get("Q_handlers_script_userLeft"))
            {
                mDict.get("Q_handlers_script_userLeft")(pId);
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

            if (mDict.get("Q_handlers_script_userData"))
            {
                mDict.get("Q_handlers_script_userData")(std::string(pId), std::string(pData));
                return true;
            }
        }
        catch(...)
        {
            traceError();
        }

        return false;
    }


    void PYScript::loadModule2(const char* pModule)
    {
        std::string fname;
        if (pModule)
        {
            fname = mWDir + "/" + std::string(pModule);
            boost::python::handle_exception( boost::bind(qserver::PYScript::exec_loadscript, this, fname.c_str() ) );
        }

        if (PyErr_Occurred())
        {
            //PyErr_Print();
            traceError();
            return ;
        }

    }

    void PYScript::loadModule(const char* pModule)
    {
        std::string fname;
        if (pModule)
        {
            std::string module(pModule);
            for (unsigned int a=0 ; a< mLoadedScripts.size(); a++)
            {
                if (mLoadedScripts[a] == module)
                {
                    return;
                }
            }

            mLoadedScripts.push_back(module);
            fname = mWDir + "/" + module;
            boost::python::handle_exception( boost::bind(qserver::PYScript::exec_loadscript, this, fname.c_str() ) );
        }

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
        std::string errstr = std::string("PY ERROR: ") + extractException();
        TRACE_OUT( errstr.c_str() );
        system_traceOut( errstr.c_str() );

        /*
        getExceptionDetail(e);
        TRACE_OUT( std::string(std::string("ERROR:") + e.getExceptionType()).c_str() );
        TRACE_OUT( std::string(std::string("ERROR:") + e.getErrorMessage()).c_str() );
        TRACE_OUT( std::string(std::string("ERROR:") + e.getTraceback()).c_str() );

        system_traceOut( std::string(std::string("ERROR:") + e.getExceptionType()).c_str()  );
        system_traceOut( std::string(std::string("ERROR:") + e.getErrorMessage()).c_str() );
        system_traceOut( std::string(std::string("ERROR:") + e.getTraceback()).c_str() );
        */
    }

    bool PYScript::execScript(const std::string& sourcescript)
    {
        try
        {

            boost::python::str script(sourcescript);
            boost::python::exec(script, mDict, mDict );
            if (PyErr_Occurred())
            {
                traceError();
                //PyErr_Print();
                return false;
            }
        }
        catch(...)
        {
            traceError();
        }

        return true;
    }

}

