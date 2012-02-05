


// define default event handlers that will be called from scriptsession

// enable user to add its handler of events - for example to handle
// non system events - like user adding/removing

function room_dummy()
{
}

function room_init()
{
	print("JS:room_init");
	
	// call room on init handler
	if ( room.onInit != room_dummy )
	{
	    room.onInit();
	}
}


// called when game is about to be started
function room_start()
{
	print("JS:room_start");
	

	// call room on start handler
	if ( room.onStart != room_dummy )
	{
	    room.onStart();
	}
}


function room_arrayDataNum(id)
{
	print("JS:room_start");
	
	// call room on arraydata num handler
	if ( room.onArrayDataNum != room_dummy )
	{
	    return room.onArrayDataNum(id);
	}
    return -1;
}

function room_arrayData(id)
{
	// call room on arraydata handler
	if ( room.onArrayData != room_dummy )
	{
	    return room.onArrayData(id);
	}
    return "";
}

function room_roomInfo()
{
	// call room on arraydata handler
	if ( room.onRoomInfo != room_dummy )
	{
	    return room.onRoomInfo();
	}
    return "";
    
}

function room_end()
{
	// call room on arraydata handler
	if ( room.onEnd != room_dummy )
	{
	    return room.onEnd();
	}
    return "";
    
}


function room_preEvent(id)
{
	// call room on arraydata handler
	if ( room.onPreEvent != room_dummy )
	{
	    return room.onPreEvent(id);
	}
    return "";
}

function room_gameEvent(id)
{
	// call room on arraydata handler
	if ( room.onGameEvent != room_dummy )
	{
	    return room.onGameEvent(id);
	}
    return "";
}

function room_postEvent(id)
{
	// call room on arraydata handler
	if ( room.onPostEvent != room_dummy )
	{
	    return room.onPostEvent(id);
	}
    return "";
}

function room_userJoined(id)
{
	// call room on arraydata handler
	if ( room.onUserJoined != room_dummy )
	{
	    return room.onUserJoined(id);
	}
    return "";
}

function room_userData(id, data)
{
    print("JS:room_userData " + id + " " + data);
	// call room on arraydata handler
	if ( room.onUserData != room_dummy )
	{
	    return room.onUserData(id, data);
	}
    return "";
}


function room_userLeft(id)
{
	// call room on arraydata handler
	if ( room.onUserLeft != room_dummy )
	{
	    return room.onUserLeft(id);
	}
    return "";
}


function Room()
{

    this.onInit = room_dummy;
    this.onStart = room_dummy;
    this.onArrayDataNum = room_dummy;
    this.onArrayData = room_dummy;
    this.onRoomInfo = room_dummy;
    this.onEnd = room_dummy;
    
    // events
    this.onPreEvent = room_dummy;
    this.onGameEvent = room_dummy;
    this.onPostEvent  = room_dummy;
    
    
    // users
    this.onUserJoined   = room_dummy;
    this.onUserData     = room_dummy;
    this.onUserLeft     = room_dummy;
    
    
}


// load members module
//server.loadModule("framework/members.js");
   
// load events module
server.loadModule("framework/events.js");

var room = new Room();
