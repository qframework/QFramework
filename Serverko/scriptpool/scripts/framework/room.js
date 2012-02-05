



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
    
    //this.config =   new room_config();

    this.script_init = function()
    {
        var fn;
        var a;
        //print("JS:script_init:" );
    	for (a=0; a< this.onInit.length; a++)
    	{
    	
    	    fn = this.onInit[a];
    	    //print("JS:fn " + id);
    	    fn();
    	}
    }


    // called when game is about to be started
    this.script_start = function()
    {
        var fn;
        var a;
        //print("JS:script_start:" );
    	for (a=0; a< this.onStart.length; a++)
    	{
    	
    	    fn = this.onStart[a];
    	    //print("JS:fn " + id);
    	    fn();
    	}	

    }


    this.script_info = function ()
    {
        var fn;
        var a;
        var result = "";
        //print("JS:script_info:");
    	for (a=0; a< this.onInfo.length; a++)
    	{
    	
    	    fn = this.onInfo[a];
    	    //print("JS:fn " + id);
    	    result += fn();
    	}	

        return result;
    }

    this.script_end =function()
    {
        var fn;
        var a;
        //print("JS:script_end:");
    	for (a=0; a< this.onEnd.length; a++)
    	{
    	
    	    fn = this.onEnd[a];
    	    //print("JS:fn " + id);
    	    fn();
    	}	

    }


    this.script_onEvent = function(id, userdata)
    {
        var fn;
        var a;
        //print("JS:script_onEvent1: " + id + " " + room.script_onEvent.length);
    	for (a=0; a< this.onEvent.length; a++)
    	{
    	    //print("JS:script_onEvent2:" + id );
    	    fn = this.onEvent[a];
    	    fn(id, userdata);
    	}	

    }

    this.script_userJoined = function(id)
    {
        var fn;
        var a;
        //print("JS:script_userJoined:" + id );
    	for (a=0; a< this.onUserJoined.length; a++)
    	{
    	
    	    fn = this.onUserJoined[a];
    	    //print("JS:fn " + id);
    	    fn(id);
    	}	
    }


    this.script_userData = function(id, data)
    {
        var a;
        var fn;
        //print("JS:script_userData " + id + " " + data);

    	for (a=0; a< this.onData.length; a++)
    	{
    	    fn = this.onData[a];
    	    fn(id,data);
    	}
    }


    this.script_userLeft = function (id)
    {
        var a;
        var fn;
        //print("JS:script_userLeft " + id + " ");

    	for (a=0; a< this.onUserLeft.length; a++)
    	{
    	    fn = this.onUserLeft[a];
    	    fn(id);
    	}
    }


}


// load members module
//serverko.loadModule("framework/members.js");
   
// load events module
//print("JS:Room ");
//var room = new Room();

