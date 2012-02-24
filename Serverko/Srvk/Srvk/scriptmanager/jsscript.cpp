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


#include "jsscript.h"
#include <stdio.h>
#include <boost/lexical_cast.hpp>
#include <string.h>


namespace qserver
{

    extern void server_traceOut(const char* pData);
#define TRACE_OUT(x) server_traceOut(x)

    v8::Handle<v8::Value> ServerTrace(const v8::Arguments& args)
    {
        bool first = true;
        for (int i = 0; i < args.Length(); i++) 
        {
            v8::HandleScope handle_scope;
            if (first) 
            {
                first = false;
            } else 
            {
                TRACE_OUT(" ");
            }
            v8::String::Utf8Value str(args[i]);
            TRACE_OUT(*str);
        }
        //TRACE_OUT("\n");
        return v8::Undefined();
    }


    JSScript::JSScript() :
    mActive(false)
    {
        mScriptType = JAVASCRIPT;
    }

    JSScript::~JSScript()
    {

    }

    void JSScript::init()
    {
        v8::Locker locker;
        v8::HandleScope handle_scope;


        v8::Handle<v8::ObjectTemplate>  global = v8::ObjectTemplate::New();

        //////////
        v8::Handle<v8::FunctionTemplate> templ = v8::FunctionTemplate::New();
        //v8::Handle<v8::ObjectTemplate> inst = v8::ObjectTemplate::New();
        templ->SetClassName(v8::String::New("serverkob"));
        v8::Handle<v8::ObjectTemplate> proto = templ->PrototypeTemplate();
        //
        // extend JS with our class

        proto->Set(v8::String::New("onRoomInfo"), v8::FunctionTemplate::New(JS_Server::onRoomInfo));
        proto->Set(v8::String::New("sendData"), v8::FunctionTemplate::New(JS_Server::sendData));

        proto->Set(v8::String::New("clientSendData"), v8::FunctionTemplate::New(JS_Server::clientSendData));
        proto->Set(v8::String::New("disconnectClient"), v8::FunctionTemplate::New(JS_Server::disconnectClient));


        proto->Set(v8::String::New("sendEvent"), v8::FunctionTemplate::New(JS_Server::sendEvent));
        proto->Set(v8::String::New("trace"), v8::FunctionTemplate::New(JS_Server::trace));
        proto->Set(v8::String::New("loadModule"), v8::FunctionTemplate::New(JS_Server::loadModule));
        proto->Set(v8::String::New("loadModule2"), v8::FunctionTemplate::New(JS_Server::loadModule2));
        proto->Set(v8::String::New("evals"), v8::FunctionTemplate::New(JS_Server::exec));
        proto->Set(v8::String::New("setSQLDB"), v8::FunctionTemplate::New(JS_Server::setSQLDB));
        proto->Set(v8::String::New("scriptAdd"), v8::FunctionTemplate::New(JS_Server::scriptAdd));
        proto->Set(v8::String::New("startTcp"), v8::FunctionTemplate::New(JS_Server::startTcp));
        proto->Set(v8::String::New("startHttp"), v8::FunctionTemplate::New(JS_Server::startHttp));
        proto->Set(v8::String::New("setDB"), v8::FunctionTemplate::New(JS_Server::setDB));
        proto->Set(v8::String::New("restartScript"), v8::FunctionTemplate::New(JS_Server::restartScript));

        // ode
        proto->Set(v8::String::New("odeInit"), v8::FunctionTemplate::New(JS_Server::odeInit));
        proto->Set(v8::String::New("odeCreatePlane"), v8::FunctionTemplate::New(JS_Server::odeCreatePlane));
        proto->Set(v8::String::New("odeCreateSphere"), v8::FunctionTemplate::New(JS_Server::odeCreateSphere));
        proto->Set(v8::String::New("odeBodySetPosition"), v8::FunctionTemplate::New(JS_Server::odeBodySetPosition));


        v8::Handle<v8::ObjectTemplate> inst = templ->InstanceTemplate();
        inst->SetInternalFieldCount(1);

        // println
        v8::Handle<v8::Context> context = v8::Context::New(NULL, global);
        v8::Context::Scope context_scope(context);

        global->Set(v8::String::New("print"), v8::FunctionTemplate::New(ServerTrace));
        v8::Handle<v8::Function> ctor = templ->GetFunction();
        v8::Local<v8::Object> obj = ctor->NewInstance();

        templ->SetClassName(v8::String::New("serverkob"));
        obj->SetInternalField(0, v8::External::New(this));
        global->Set(v8::String::New("serverkob"), obj);

        mContext = v8::Context::New(NULL, global);



    }

    void JSScript::loadFramework()
    {
        loadScript("framework/serverkobridge.js");
        loadScript("framework/room.js");
        loadScript("framework/colors.js");
        loadScript("framework/layout.js");
        loadScript("framework/qframework.js");

        mActive = true;
    }


    bool JSScript::loadGameScript(const std::string& fname)
    {
        loadFramework();
        // load user script
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

        // get functions - embedd
        bool  res  = getFunction(mRoomInfoFunc, "Q_handlers_script_info");
        res &= getFunction(mRoomInitFunc, "Q_handlers_script_init");
        res &= getFunction(mRoomStartFunc, "Q_handlers_script_start");
        res &= getFunction(mRoomEndFunc, "Q_handlers_script_end");
        res &= getFunction(mRoomGameEventFunc, "Q_handlers_script_onEvent");
        res &= getFunction(mRoomUserJoined, "Q_handlers_script_userJoined");
        res &= getFunction(mRoomUserLeft, "Q_handlers_script_userLeft");
        res &= getFunction(mRoomUserData, "Q_handlers_script_userData");

        if (res == false)
        {
            TRACE_OUT("Warning! Few functions undefined!");
        }

        return true; // res;
    }

    bool JSScript::loadScript(const std::string& fname)
    {
        v8::Locker locker;

        v8::Context::Scope context_scope(mContext);
        v8::HandleScope handle_scope;
        std::string fullpath("../scriptpool/scripts/");
        std::string path = (fullpath + fname);
        FILE *f = fopen( path.c_str(), "rb");
        if (f == NULL)
        {
            return false;
        }

        fseek( f, 0, SEEK_END);
        long sz = ftell(f);

        fseek(f, 0, SEEK_SET);
        char* buff = new char[sz];
        if (buff == NULL)
        {
            fclose(f);
            return false;
        }
        fread(buff, sz, 1, f);
        fclose(f);


        v8::Handle<v8::String> source =  v8::String::New(buff, sz);
        v8::Handle<v8::String> name = v8::String::New(fname.c_str(),(int)fname.length()); 
        v8::TryCatch try_catch;

        v8::Handle<v8::Script>          script;
        script = v8::Script::Compile(source, name);
        if (script.IsEmpty()) 
        {
            reportException( &try_catch);		
            delete []buff;

            return false;
        }


        delete []buff;



        v8::Handle<v8::Value> result =script->Run();
        if (result.IsEmpty()) 
        {
            reportException( &try_catch);		
            return false;
        }


        return true;
    }

    void JSScript::execGameInit()
    {
        if ( mRoomInitFunc.IsEmpty() )
        {
            return;
        }
        v8::Locker locker;
        v8::HandleScope handle_scope;
        v8::Context::Scope context_scope(mContext);
        v8::TryCatch try_catch;


        const int argc = 0;
        v8::Handle<v8::Value> ev;
        v8::Handle<v8::Value> argv[] = {ev};
        v8::Handle<v8::Value> result = mRoomInitFunc->Call(mContext->Global(), argc, argv);


        if (result.IsEmpty()) 
        {
            reportException( &try_catch);		    
            return;
        }
    }

    void JSScript::execGameStart()
    {
        if ( mRoomStartFunc.IsEmpty() )
        {
            return;
        }
        v8::Locker locker;
        v8::HandleScope handle_scope;
        v8::Context::Scope context_scope(mContext);
        v8::TryCatch try_catch;

        const int argc = 0;
        v8::Handle<v8::Value> ev;
        v8::Handle<v8::Value> argv[] = {ev};
        v8::Handle<v8::Value> result = mRoomStartFunc->Call(mContext->Global(), argc, argv);


        if (result.IsEmpty()) 
        {
            reportException( &try_catch);		
            return;
        }

    }

    bool JSScript::execGameInfo(std::vector<StringString>& retVal)
    {
        if ( mRoomInfoFunc.IsEmpty() )
        {
            return true;
        }
        v8::Locker locker;
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;
        v8::Context::Scope context_scope(mContext);


        const int argc = 0;
        v8::Handle<v8::Value> ev;
        v8::Handle<v8::Value> argv[] = {ev};
        v8::Handle<v8::Value> result = mRoomInfoFunc->Call(mContext->Global(), argc, argv);


        if (result.IsEmpty()) 
        {
            reportException( &try_catch);		
            return false;
        }

        v8::String::AsciiValue ascii(result);

        char* retstr = *ascii;
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

    bool JSScript::getFunction(v8::Persistent<v8::Function>& outFun, const char* fName)
    {

        v8::Locker locker;
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;
        v8::Context::Scope context_scope(mContext);

        v8::Handle<v8::String> fun_name = v8::String::New(fName);
        v8::Handle<v8::Value> fun_val = mContext->Global()->Get(fun_name);
        if (!fun_val ->IsFunction()) 
        {
            return false;
        }

        v8::Handle<v8::Function> fun = v8::Handle<v8::Function>::Cast(fun_val);
        outFun =  v8::Persistent<v8::Function>::New(fun);

        return true;
    }

    v8::Handle<v8::Value> JS_Server::onRoomInfo(const v8::Arguments& args)
    {
        v8::Locker locker;
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();
        if (pScript)
        {
            if (args.Length() == 1)
            {
                v8::String::AsciiValue roomInfo(args[0]);
                pScript->onRoomInfo(*roomInfo);
            }
        }
        return v8::Undefined();
    }


    v8::Handle<v8::Value> JS_Server::sendData(const v8::Arguments& args)
    {
        v8::Locker locker;
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();
        if (pScript)
        {

            if (args.Length() == 1)
            {
                v8::String::AsciiValue data(args[0]);
                pScript->sendData(*data);
            }

        }

        return v8::Undefined();
    }





    v8::Handle<v8::Value> JS_Server::clientSendData(const v8::Arguments& args)
    {
        v8::Locker locker;
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();
        if (pScript && args.Length() == 2)
        {
            v8::String::AsciiValue userid(args[0]);
            v8::String::AsciiValue data(args[1]);
            pScript->clientSendData(*userid , *data);
        }

        return v8::Undefined();
    }

    v8::Handle<v8::Value> JS_Server::disconnectClient(const v8::Arguments& args)
    {
        v8::Locker locker;
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();
        if (pScript && args.Length() == 1)
        {
            v8::String::AsciiValue userid(args[0]);
            pScript->disconnectClient(*userid);
        }

        return v8::Undefined();
    }


    bool JSScript::execOnGameEvent(int id, const char* pUserData)
    {
        if ( mRoomGameEventFunc.IsEmpty() )
        {
            return true;
        }

        v8::Locker locker;
        v8::HandleScope handle_scope;
        const int argc = 2;
        v8::TryCatch try_catch;
        v8::Context::Scope context_scope(mContext);


        v8::Handle<v8::Value> ev( v8::Integer::New( id ) );
        std::string userdata;
        if (pUserData)
        {
            userdata = pUserData;
        }
        v8::Handle<v8::Value> ev1( v8::String::New( userdata.c_str() ) );

        v8::Handle<v8::Value> argv[] = {ev, ev1};
        v8::Handle<v8::Value> result = mRoomGameEventFunc->Call(mContext->Global(), argc, argv);


        if (result.IsEmpty()) 
        {
            reportException( &try_catch);		
            return false;
        }
        return true;
        /*
        std::string scriptstr = "Q.handlers.script_onEvent("+  boost::lexical_cast<std::string>(id)   +",'"+ std::string(pUserData) + "');";
        return runScript(scriptstr);
        */
    }




    v8::Handle<v8::Value> JS_Server::sendEvent(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();
        if (pScript && args.Length() == 2)
        {
            int id = args[0]->Int32Value();
            int delay = args[1]->Int32Value();
            pScript->eventScript(id, delay, NULL);
        } else
            if (pScript && args.Length() == 3)
            {
                int id = args[0]->Int32Value();
                int delay = args[1]->Int32Value();
                v8::String::AsciiValue userdata(args[2]);

                pScript->eventScript(id, delay, *userdata);
            }

            return v8::Undefined();
    }

    v8::Handle<v8::Value> JS_Server::trace(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();
        if (pScript && args.Length() == 1)
        {
            v8::String::AsciiValue userdata(args[0]);

            server_traceOut(*userdata);
        }

        return v8::Undefined();
    }

    v8::Handle<v8::Value> JS_Server::loadModule(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 1)
        {
            v8::String::AsciiValue mess(args[0]);
            pScript->loadModule(*mess);
        }

        return v8::Undefined();
    }


    v8::Handle<v8::Value> JS_Server::loadModule2(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 1)
        {
            v8::String::AsciiValue mess(args[0]);
            pScript->loadModule2(*mess);
        }

        return v8::Undefined();
    }


    v8::Handle<v8::Value> JS_Server::exec(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        void* ptr = wrap->Value();
        JSScript* pScript = static_cast<JSScript*>(ptr);

        if (pScript && args.Length() == 2)
        {
            int delay = args[0]->Int32Value();
            v8::String::AsciiValue script(args[1]);
            pScript->exec(delay , *script);
        }

        return v8::Undefined();
    }


    void JSScript::loadModule2(const char* pModule)
    {
        bool res = false;
        if (pModule)
        {
            res = loadScript(mWDir + "/" + std::string(pModule));  
        }
        char buffer[256];
        if (res)
        {
            sprintf( buffer, "SCRIPT %s LOAD OK ", pModule);
        }else
        {
            sprintf( buffer, "SCRIPT %s LOAD FAIL! ", pModule);
        }
        //TRACE_OUT(pModule);
    }


    void JSScript::loadModule(const char* pModule)
    {
        bool res = false;
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
            res = loadScript(mWDir + "/" + std::string(pModule));  
        }
        char buffer[256];
        if (res)
        {
            sprintf( buffer, "SCRIPT %s LOAD OK ", pModule);
        }else
        {
            sprintf( buffer, "SCRIPT %s LOAD FAIL! ", pModule);
        }
        //TRACE_OUT(pModule);
    }




    bool JSScript::execOnClientConnected(const char* pId)
    {
        if ( mRoomUserJoined.IsEmpty() )
        {
            return true;
        }
        v8::Locker locker;
        v8::HandleScope handle_scope;
        const int argc = 1;
        v8::TryCatch try_catch;
        v8::Context::Scope context_scope(mContext);

        v8::Handle<v8::Value> ev( v8::String::New( pId ) );
        v8::Handle<v8::Value> argv[] = {ev};
        v8::Handle<v8::Value> result = mRoomUserJoined->Call(mContext->Global(), argc, argv);

        if (result.IsEmpty()) 
        {
            reportException( &try_catch);		
            return false;
        }

        return true;
        /*
        std::string scriptstr = "Q.handlers.script_userJoined('"+ std::string(pId) + "');";
        return runScript(scriptstr);
        */
    }

    bool JSScript::execOnClientDisConnected(const char* pId)
    {
        if ( mRoomUserLeft.IsEmpty() )
        {
            return true;
        }

        v8::Locker locker;
        v8::HandleScope handle_scope;
        const int argc = 1;
        v8::TryCatch try_catch;
        v8::Context::Scope context_scope(mContext);

        v8::Handle<v8::Value> ev( v8::String::New( pId ) );
        v8::Handle<v8::Value> argv[] = {ev};
        v8::Handle<v8::Value> result = mRoomUserLeft->Call(mContext->Global(), argc, argv);

        if (result.IsEmpty()) 
        {
            reportException( &try_catch);		
            return false;
        }

        return true;
        /*
        std::string scriptstr = "Q.handlers.script_userLeft('"+ std::string(pId) + "');";
        return runScript(scriptstr);
        */
    }


    bool JSScript::execOnClientData(const char* pId, const char* pData)
    {
        if ( mRoomUserData.IsEmpty() )
        {
            return true;
        }

        v8::Locker locker;
        v8::HandleScope handle_scope;
        const int argc = 2;
        v8::TryCatch try_catch;
        v8::Context::Scope context_scope(mContext);

        v8::Handle<v8::Value> ev( v8::String::New( pId ) );
        v8::Handle<v8::Value> ev1( v8::String::New( pData ) );
        v8::Handle<v8::Value> argv[] = {ev, ev1};
        v8::Handle<v8::Value> result = mRoomUserData->Call(mContext->Global(), argc, argv);

        if (result.IsEmpty()) 
        {
            reportException( &try_catch);		
            return false;
        }

        return true;

    }



    void JSScript::reportException(v8::TryCatch* try_catch) 
    {
        v8::HandleScope handle_scope;
        v8::String::Utf8Value exception(try_catch->Exception());
        v8::Handle<v8::Message> message = try_catch->Message();
        char buff[5120];

        if (message.IsEmpty()) 
        {
            // V8 didn't provide any extra information about this error; just
            // print the exception.
            sprintf(buff, "ERROR:%s", *exception);
            TRACE_OUT( buff);
        } else 
        {
            // Print (filename):(line number): (message).
            v8::String::Utf8Value filename(message->GetScriptResourceName());
            int linenum = message->GetLineNumber();
            sprintf(buff, "ERROR:%s:%i: %s", *filename, linenum, *exception);
            TRACE_OUT( buff);
            // Print line of source code.
            v8::String::Utf8Value sourceline(message->GetSourceLine());
            sprintf(buff, "ERROR:%s", *sourceline);
            TRACE_OUT( buff);
            // Print wavy underline (GetUnderline is deprecated).
            int start = message->GetStartColumn();
            buff[0] = 0;
            strcpy(buff, "ERROR:");
            for (int i = 0; i < start; i++) {
                strcat(buff, " ");
            }

            int end = message->GetEndColumn();
            for (int i = start; i < end; i++) {
                strcat(buff, "^");
            }
            TRACE_OUT( buff);
        }
    }

    v8::Handle<v8::Value> JS_Server::setSQLDB(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 1)
        {
            v8::String::AsciiValue mess(args[0]);
            pScript->setSQLDB(*mess);
        }

        return v8::Undefined();
    }

    v8::Handle<v8::Value> JS_Server::startTcp(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 1)
        {
            v8::String::AsciiValue mess(args[0]);
            pScript->startTcp(*mess);
        }

        return v8::Undefined();
    }


    v8::Handle<v8::Value> JS_Server::restartScript(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript )
        {
            pScript->restartScript();
        }

        return v8::Undefined();
    }



    v8::Handle<v8::Value> JS_Server::startHttp(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 1)
        {
            v8::String::AsciiValue mess(args[0]);
            pScript->startHttp(*mess);
        }

        return v8::Undefined();
    }

    v8::Handle<v8::Value> JS_Server::setDB(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 1)
        {
            v8::String::AsciiValue mess(args[0]);
            pScript->setDB(*mess);
        }

        return v8::Undefined();
    }


    void JSScript::setSQLDB(const char* pDb)
    {
        // TODO
        TRACE_OUT(pDb);
    }




    v8::Handle<v8::Value> JS_Server::scriptAdd(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 3)
        {
            v8::String::AsciiValue wdir(args[0]);
            v8::String::AsciiValue script(args[1]);
            v8::String::AsciiValue name(args[1]);
            pScript->scriptAdd(*wdir, *script, *name);
        }

        return v8::Undefined();
    }

    bool JSScript::execScript(const std::string& sourcescript)
    {
        v8::Locker locker;

        v8::Context::Scope context_scope(mContext);
        v8::HandleScope handle_scope;

        static int scriptcounter = 0;
        scriptcounter++;

        v8::Handle<v8::String> source =  v8::String::New(sourcescript.c_str(), sourcescript.length());

        std::string fname = "script"+ boost::lexical_cast<std::string>(scriptcounter);
        v8::Handle<v8::String> name = v8::String::New(fname.c_str(),(int)fname.length()); 

        v8::TryCatch try_catch;
        v8::Handle<v8::Script>      script;
        script = v8::Script::Compile(source, name);
        if (script.IsEmpty()) 
        {
            reportException( &try_catch);		
            return false;
        }


        v8::Handle<v8::Value> result =script->Run();
        if (result.IsEmpty()) 
        {
            reportException( &try_catch);		
            return false;
        }


        return true;
    }


    // ode stuff
    v8::Handle<v8::Value> JS_Server::odeInit(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 1)
        {
            v8::String::AsciiValue g(args[0]);
            pScript->odeInit(*g);
        }

        return v8::Undefined();
    }

    v8::Handle<v8::Value> JS_Server::odeCreatePlane(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 5)
        {
            v8::String::AsciiValue name(args[0]);
            v8::String::AsciiValue a(args[1]);
            v8::String::AsciiValue b(args[2]);
            v8::String::AsciiValue c(args[3]);
            v8::String::AsciiValue d(args[4]);
            pScript->odeCreatePlane(*name,*a,*b,*c,*d);
        }

        return v8::Undefined();
    }

    v8::Handle<v8::Value> JS_Server::odeCreateSphere(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 3)
        {
            v8::String::AsciiValue name(args[0]);
            v8::String::AsciiValue mass(args[1]);
            v8::String::AsciiValue rad(args[2]);
            pScript->odeCreateSphere(*name, *mass, *rad);
        }

        return v8::Undefined();
    }

    v8::Handle<v8::Value> JS_Server::odeBodySetPosition(const v8::Arguments& args)
    {
        v8::HandleScope handle_scope;
        v8::Locker locker;

        v8::TryCatch try_catch;

        v8::Local<v8::Object> self = args.Holder();
        v8::Local<v8::External> wrap = v8::Local<v8::External>::Cast(self->GetInternalField(0));
        JSScript* pScript = (JSScript*)wrap->Value();

        if (pScript && args.Length() == 4)
        {
            v8::String::AsciiValue name(args[0]);
            v8::String::AsciiValue x(args[1]);
            v8::String::AsciiValue y(args[2]);
            v8::String::AsciiValue z(args[3]);
            pScript->odeBodySetPosition(*name, *x, *y, *z);
        }

        return v8::Undefined();
    }

    void JSScript::memclean()
    {
        v8::V8::IdleNotification();
    }

    bool JSScript::runScript(const std::string& scriptstr)
    {

        v8::Locker locker;
        v8::HandleScope handle_scope;
        v8::Context::Scope context_scope(mContext);

        v8::Handle<v8::String> source =  v8::String::New(scriptstr.c_str() );
        v8::Handle<v8::String> name = v8::String::New("tempscript"); 
        v8::TryCatch try_catch;

        v8::Handle<v8::Script>          script;
        script = v8::Script::Compile(source, name);
        if (script.IsEmpty()) 
        {
            reportException( &try_catch);		

            return false;
        }
        v8::Handle<v8::Value> result =script->Run();
        if (result.IsEmpty()) 
        {
            reportException( &try_catch);		
            return false;
        }

        return true;
    }

    bool JSScript::execOnClientReConnected(const char* pId)
    {
        return false;
    }

} //namespace qserver


