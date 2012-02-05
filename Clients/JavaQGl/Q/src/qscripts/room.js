


// define default event handlers that will be called from scriptsession

// enable user to add its handler of events - for example to handle
// non system events - like user adding/removing

function script_init()
{
    var fn;
    var a;
    //print("JS:script_init:" );
	for (a=0; a< room.script_init.length; a++)
	{
	
	    fn = room.script_init[a];
	    //print("JS:fn " + id);
	    fn();
	}
}


// called when game is about to be started
function script_start()
{
    var fn;
    var a;
    //print("JS:script_start:" );
	for (a=0; a< room.script_start.length; a++)
	{
	
	    fn = room.script_start[a];
	    //print("JS:fn " + id);
	    fn();
	}	

}


function script_info()
{
    var fn;
    var a;
    var result = "";
    //print("JS:script_info:");
	for (a=0; a< room.script_info.length; a++)
	{
	
	    fn = room.script_info[a];
	    //print("JS:fn " + id);
	    result += fn();
	}	

    return result;
}

function script_end()
{
    var fn;
    var a;
    //print("JS:script_end:");
	for (a=0; a< room.script_end.length; a++)
	{
	
	    fn = room.script_end[a];
	    //print("JS:fn " + id);
	    fn();
	}	

}


function script_onEvent(id, userdata)
{
    var fn;
    var a;
    //print("JS:script_onEvent1: " + id + " " + room.script_onEvent.length);
	for (a=0; a< room.onEvent.length; a++)
	{
	    //print("JS:script_onEvent2:" + id );
	    fn = room.onEvent[a];
	    fn(id, userdata);
	}	

}

function script_userJoined(id)
{
    var fn;
    var a;
    //print("JS:script_userJoined:" + id );
	for (a=0; a< room.script_userJoined.length; a++)
	{
	
	    fn = room.script_userJoined[a];
	    //print("JS:fn " + id);
	    fn(id);
	}	
}


function script_userData(id, data)
{
    var a;
    var fn;
    //print("JS:script_userData " + id + " " + data);

	for (a=0; a< room.onData.length; a++)
	{
	    fn = room.onData[a];
	    fn(id,data);
	}
}


function script_userLeft(id)
{
    var a;
    var fn;
    //print("JS:script_userLeft " + id + " ");

	for (a=0; a< room.script_userLeft.length; a++)
	{
	    fn = room.script_userLeft[a];
	    fn(id);
	}
}


function Room()
{
    //print("JS:Room ");
    
    
    this.script_init = new Array();
    this.script_info = new Array();
    this.script_start = new Array();
    this.script_end = new Array();
    this.onEvent = new Array();
    this.script_userJoined = new Array();
    this.script_userLeft = new Array();
    this.onData = new Array();
    
    //this.config =   new room_config();
    
}


// load members module
//serverko.loadModule("framework/members.js");
   
// load events module
//print("JS:Room ");
var room = new Room();

