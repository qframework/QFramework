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

var qsupportold = 0;

function print(str) {
    console.log( str + "\n\r" );
}

function Serverko()
{
	this.databuffer = new Array();
	this.clientbuffer = new Array();
	this.sendbuffer = new Array();
	
	this.startData = function ()
	{
		
		if (this.databuffer.length >  300)
		{
			console.log("ERROR: data push large " + this.databuffer[300]);
		}
		this.databuffer.push(new Array())
	}

	this.appendEvent = 	function (id, area, data , data2, data3, data4, data5)
	{
		if (this.databuffer.length == 0)
		{
			this.databuffer.push(new Array());
		}
		
		var str = "";
		if (this.databuffer.length >  0)
		{
			if ( this.databuffer[ this.databuffer.length -1 ].length != 0)
				str += ",";
		}
		
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

	this.appendEvent_ = 	function (id, area, data , data2, data3, data4, data5)
	{
		this.startData();
		var str = "";
		if (this.databuffer.length >  0)
		{
			if ( this.databuffer[ this.databuffer.length -1 ].length != 0)
				str += ",";
		}
		
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
        this.sendData();
	}
	
	this.sendData = function ()
	{
		// add to buffer array
		if (this.databuffer.length > 0)
		{
			arr = this.databuffer.pop();
			data = "" 
			while (arr.length > 0)
			{
				data += arr.shift();
			}
			
			this.sendbuffer.push( "{\"gs\":{\"room\":[" + data  + "]}}\r\n"  );
		}
	}

	this.clientStartData = 	function (userID)
	{
		this.lastLen = 0;
		// just in case of recursion , is 300 decent number? it was for spartans..
		if (this.clientbuffer.length >  300)
		{
			console.error("ERROR: client data push large " + this.clientbuffer[3]);
		}		
		this.clientbuffer.push(new Array());
		
	}

	this.clientAppendEvent = function (userID , id, area, data, data2, data3, data4)
	{
		var str = "";
		
		//clientbuffer[ clientbuffer.length -1 ] += "<room><res>event</res><id>"+id+"</id><type>"+area+"</type><data>"+data+"</data></room>";
        if ( this.clientbuffer[ this.clientbuffer.length -1 ].length != 0)
        	str += ",";

        
        str += "{\"res\":\"event\",\"id\":\""+id+"\",\"type\":\""+area+"\",\"data\":\""+data+"\"}";
        if (data2 != undefined)
        	str += "\",\"data2\":\""+data2;
        if (data3 != undefined)
        	str += "\",\"data3\":\""+data3;
        if (data4 != undefined)
        	str += "\",\"data4\":\""+data4;
        
        this.clientbuffer[ this.clientbuffer.length -1 ].push(str)
	}
	
	this.clientAppendEvent_ = function (userID , id, area, data, data2, data3, data4)
	{
		this.clientStartData(userID);
		var str = "";
		
		//clientbuffer[ clientbuffer.length -1 ] += "<room><res>event</res><id>"+id+"</id><type>"+area+"</type><data>"+data+"</data></room>";
        if ( this.clientbuffer[ this.clientbuffer.length -1 ].length != 0)
        	str += ",";

        
        str += "{\"res\":\"event\",\"id\":\""+id+"\",\"type\":\""+area+"\",\"data\":\""+data+"\"}";
        if (data2 != undefined)
        	str += "\",\"data2\":\""+data2;
        if (data3 != undefined)
        	str += "\",\"data3\":\""+data3;
        if (data4 != undefined)
        	str += "\",\"data4\":\""+data4;
        
        this.clientbuffer[ this.clientbuffer.length -1 ].push(str)
        this.clientSendData(userID);
	}	

	this.clientSendData =  	function (userID)
	{
		if (this.clientbuffer.length > 0)
		{
			arr = this.clientbuffer.pop();
			data = "" 
			while (arr.length > 0)
			{
				data += arr.shift();
			}
			
			this.sendbuffer.push( "{\"gs\":{\"room\":[" + data  + "]}}\r\n"  );
		}

	}
	
	this.reserveSpace = function ()
	{
		if (this.databuffer.length == 0)
		{
			this.databuffer.push(new Array());
		}		
		arr = this.databuffer[ this.databuffer.length -1 ];
		arr.push("")
	}
	
	
	this.startTag =  function (id) 
	{
		if (this.databuffer.length > 0)
		{
			this.lastLen = this.databuffer[ this.databuffer.length -1 ].length;
		}
		
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

	this.startTags =  	function ( id, data)
	{
		arr = this.databuffer[ this.databuffer.length -1 ];
		arr[arr.length-1] += "\""+id+"\": ["; 
	}
	
	this.appendTag = 	function ( id, data)
	{
		arr = this.databuffer[ this.databuffer.length -1 ];
		arr[arr.length-1] += "\""+id+"\": " + "\""+data+"\"";
	}
	
	this.endTag = 	function (id)
	{
		arr = this.databuffer[ this.databuffer.length -1 ];
		arr[arr.length-1] += "}";
	}
	
	this.endTags = 	function (id)
	{
		arr = this.databuffer[ this.databuffer.length -1 ];
		arr[arr.length-1] += "]";
	}        

	this.addSeparator = function ()
	{
		arr = this.databuffer[ this.databuffer.length -1 ];
		arr[arr.length-1] += ",";
	}
	
	this.loadModule = function (id)
	{
        this.appendEvent( 102 , id    );
	}
	
	this.loadModule2 = function(id)
	{
        this.appendEvent( 103 , id , ""   );
	}
	
    this.trace = function (str)
	{
		console.log(str);
	}
    this.sendEvent = function (id, delay, data) 
    {
        this.appendEvent( 100 , delay , "Q.handlers.script_onEvent(" + id + ","  + "'" + data + "'" + ");"  );
    }
    this.clientSpectate = function (userID , yesno)
	{
	}
    
	this.getData = function()
	{

		if (this.sendbuffer.length > 0)
		{
			return this.sendbuffer.shift();
		} else {
			return "";
		}

	}
	
	// modifierers
	this.toUser = function(userid)
	{
		arr = this.databuffer[ this.databuffer.length -1 ];
		str = arr.pop();
		this.clientbuffer[ this.clientbuffer.length -1 ].push(str)
		return this;
	}
	
	this.toUserNow = function()
	{
		arr = this.databuffer[ this.databuffer.length -1 ];
		str = arr.pop();

		this.sendbuffer.push( "{\"gs\":{\"room\":[" + str + "]}}\r\n"  );
		return this;
	}	

	this.now = function()
	{
		arr = this.databuffer[ this.databuffer.length -1 ];
		str = arr.pop();
		
		//console.log ( "now " +  this.lastData  + this.databuffer.length)
		this.sendbuffer.push( "{\"gs\":{\"room\":[" + str + "]}}\r\n"  );
		//console.log ( "afternow " +  this.databuffer)
		return this;
	}
	
    // TODO - after delay function

		
	
}

	
console.log(" serverko bridge load ok");
