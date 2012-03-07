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


function Room(qapp)
{
    //print("JS:Room ");
    
	this.qapp = qapp;
    
    this.onInit = new Array();
    this.onInfo = new Array();
    this.onStart = new Array();
    this.onEnd = new Array();
    this.onEvent = new Array();
    this.onUserJoined = new Array();
    this.onUserLeft = new Array();
    this.onData = new Array();
}


function Q_handlers_script_info()
{
    var fn;
    var a;
    var result = "";
    //print("JS:script_info:");
    for (a=0; a< Q.handlers.onInfo.length; a++)
    {
    	
    	fn = this.onInfo[a];
    	//print("JS:fn " + id);
    	result += fn();
    }	

    return result;
}

function Q_handlers_script_init(){
    var fn;
    var a;
    //print("JS:script_init:" );
    for (a=0; a< Q.handlers.onInit.length; a++)
    {
    	
    	fn = Q.handlers.onInit[a];
    	//print("JS:fn " + id);
    	fn();
    }
}

function Q_handlers_script_start ()
{
    var fn;
    var a;
    //print("JS:script_start:" );
    for (a=0; a< Q.handlers.onStart.length; a++)
    {
    	
    	fn = Q.handlers.onStart[a];
    	//print("JS:fn " + id);
    	fn();
    }	

}

function Q_handlers_script_end()
{
    var fn;
    var a;
    //print("JS:script_end:");
    for (a=0; a< Q.handlers.onEnd.length; a++)
    {
    	
    	fn = Q.handlers.onEnd[a];
    	//print("JS:fn " + id);
    	fn();
    }	

}

function Q_handlers_script_onEvent(id, userdata)
{
    var fn;
    var a;
    //print("JS:script_onEvent1: " + id + " " + room.script_onEvent.length);
    for (a=0; a< Q.handlers.onEvent.length; a++)
    {
    	//print("JS:script_onEvent2:" + id );
    	fn = Q.handlers.onEvent[a];
    	fn(id, userdata);
    }	

}

function Q_handlers_script_userJoined(id)
{
    var fn;
    var a;
    //print("JS:script_userJoined:" + id );
    for (a=0; a< Q.handlers.onUserJoined.length; a++)
    {
    	
    	fn = Q.handlers.onUserJoined[a];
    	//print("JS:fn " + id);
    	fn(id);
    }	
}

function Q_handlers_script_userLeft(id)
{
    var a;
    var fn;
    //print("JS:script_userLeft " + id + " ");

    for (a=0; a< Q.handlers.onUserLeft.length; a++)
    {
    	fn = Q.handlers.onUserLeft[a];
    	fn(id);
    }
}


function Q_handlers_script_userData(id, data)
{
    var a;
    var fn;
        
    //print("JS:script_userData " + id + " " + data);

    for (a=0; a< Q.handlers.onData.length; a++)
    {
    	fn = Q.handlers.onData[a];
    	fn(id,data);
    }
}


