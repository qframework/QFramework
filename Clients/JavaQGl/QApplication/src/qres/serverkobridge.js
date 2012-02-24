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

console = 
{ 
	msgs: new Array(), 
    log: function(msg) 	{ print("JS:"+msg); }, 
	info: function(msg) { print("INFO:"+msg); }, 
	warn : function(msg) { print("WARN:"+msg); }, 
	error: function(msg) { print("ERROR:"+msg); }, 
	shift: function() { return console.msgs.shift(); } 
};
	

function Serverko()
{
	this.databuffer = new Array();
	this.clientbuffer = {};
	this.sendbuffer = new Array();
    console.log ( " client buffer " + this.clientbuffer.toString() );    	
}

Serverko.prototype.startData = function ()
{
	if (this.databuffer.length >  300)
	{
		console.log("ERROR: data push large " + this.databuffer[300]);
	}
	this.databuffer.push(new Array())
}

Serverko.prototype.appendEvent = 	function (id, area, data , data2, data3, data4, data5)
{
	if (this.databuffer.length == 0)
	{
		this.databuffer.push(new Array());
	}

	var str = "";
			
	str += "{\"res\":\"event\",\"id\":\""+id+"\",\"type\":\""+area;
	        
	if (data != undefined)
	    str += "\",\"data\":\""+data;
	if (data2 != undefined)
	    str += "\",\"data2\":\""+data2;
	if (data3 != undefined)
	    str += "\",\"data3\":\""+data3;
	if (data4 != undefined)
	    str += "\",\"data4\":\""+data4;	        
	        
	        	
	str += "\"}";
	        
	this.databuffer[ this.databuffer.length -1 ].push( str );
}
	
Serverko.prototype.appendEvent_ = 	function (id, area, data , data2, data3, data4, data5)
{
    this.startData();
    this.appendEvent(id , area, data , data2, data3, data4, data5)
    this.sendData();
}
	
	
Serverko.prototype.clientStartData = 	function (userID)
{
	// just in case of recursion , is 300 decent number? it was for spartans..
	databuffer = this.clientbuffer[userID];

	if (databuffer.length >  300)
	{
		console.log("ERROR: data push large " + databuffer[300]);
	}
	databuffer.push(new Array())
}

Serverko.prototype.clientAppendEvent = function (userID , id, area, data, data2, data3, data4)
{
    databuffer = this.clientbuffer[userID];

	if (databuffer.length == 0)
	{
		databuffer.push(new Array());
	}

	var str = "";
			
			
	str += "{\"res\":\"event\",\"id\":\""+id+"\",\"type\":\""+area;
	        
	if (data != undefined)
	    str += "\",\"data\":\""+data;
	if (data2 != undefined)
	    str += "\",\"data2\":\""+data2;
	if (data3 != undefined)
	    str += "\",\"data3\":\""+data3;
	if (data4 != undefined)
	    str += "\",\"data4\":\""+data4;	        
	        
	        	
	str += "\"}";
	        
	databuffer[ databuffer.length -1 ].push( str );
                
}

Serverko.prototype.clientAppendEvent_ = function (userID , id, area, data, data2, data3, data4)
{
	this.clientStartData(userID);
    this.clientAppendEvent(userID,id, area, data, data2, data3, data4)
	this.clientSendData(userID);
}

Serverko.prototype.reserveSpace = function ()
{
	if (this.databuffer.length == 0)
	{
		this.databuffer.push(new Array());
	}		
	arr = this.databuffer[ this.databuffer.length -1 ];
	arr.push("")
}


Serverko.prototype.startTag =  function (id) 
{
	
	var str;
    if (id != undefined)
    {
        str = "{\""+id+"\": ";
    }
    else
    {
        str = "{";
    }
    arr = this.databuffer[ this.databuffer.length -1 ]; 
    arr[ arr.length -1 ]+= str;
}

Serverko.prototype.startTags =  	function ( id, data)
{
	arr = this.databuffer[ this.databuffer.length -1 ];
	arr[arr.length-1] += "\""+id+"\": ["; 
}
	
Serverko.prototype.appendTag = 	function ( id, data)
{
	arr = this.databuffer[ this.databuffer.length -1 ];
	arr[arr.length-1] += "\""+id+"\": " + "\""+data+"\"";
}
	
Serverko.prototype.endTag = 	function (id)
{
	arr = this.databuffer[ this.databuffer.length -1 ];
	arr[arr.length-1] += "}";
}
	
Serverko.prototype.endTags = 	function (id)
{
	arr = this.databuffer[ this.databuffer.length -1 ];
	arr[arr.length-1] += "]";
}        

Serverko.prototype.addSeparator = function ()
{
	arr = this.databuffer[ this.databuffer.length -1 ];
	arr[arr.length-1] += ",";
}

	
// modifierers
Serverko.prototype.toUser = function(userid)
{
	arr = this.databuffer[ this.databuffer.length -1 ];
	var str = arr.pop();
    databuffer = this.clientbuffer[userid];
    databuffer[ databuffer.length -1 ].push( str );
 	return this;
}
	
Serverko.prototype.toUserNow = function(userid)
{
	arr = this.databuffer[ this.databuffer.length -1 ];
	var data = arr.pop();
    var str = "{\"gs\":{\"room\":[" + data + "]}}\r\n" 
    this.sendbuffer.push( str  );
	return this;
}	

Serverko.prototype.now = function()
{
	arr = this.databuffer[ this.databuffer.length -1 ];
	var data = arr.pop();
    if (data != undefined && data.length > 0)
    {
        var str = "{\"gs\":{\"room\":[" + data + "]}}\r\n" 
        this.sendbuffer.push( str  );    
    }
    return this;
}



Serverko.prototype.sendData =  function()
{
    if (this.databuffer.length > 0)
	{
		var arr = this.databuffer.pop();
		var data = "" 
		while (arr.length > 0)
		{
			data += arr.shift();
            if (arr.length > 0)
            {
                data += ",";
            }

		}
			
		var str = "{\"gs\":{\"room\":[" + data + "]}}\r\n" 
        this.sendbuffer.push( str  );
	}

}

Serverko.prototype.getData = function()
{

	if (this.sendbuffer.length > 0)
	{
		return this.sendbuffer.shift();
	} else {
		return "";
	}

}

Serverko.prototype.clientSendData =  function(userID)
{
    databuffer = this.clientbuffer[userID];
    if (databuffer.length > 0)
	{
      //  console.log ( "data buff " + databuffer.toString() );
		var arr = databuffer.pop();
		var data = "" 
		while (arr.length > 0)
		{
			data += arr.shift();
            if (arr.length > 0)
            {
                data += ",";
            }
		}
			
		var str = "{\"gs\":{\"room\":[" + data + "]}}\r\n" 
        this.sendbuffer.push( str  );
	}

        
}

Serverko.prototype.sendEvent = function(id, delay, data) 
{
    this.appendEvent( 100 , delay , "Q.handlers.script_onEvent(" + id + ","  + "'" + data + "'" + ");"  );
}

	
Serverko.prototype.loadModule = function(id)
{
    this.appendEvent( 102 , id    );
}

Serverko.prototype.loadModule2 = function(id)
{
    this.appendEvent( 103 , id , ""   );
}
