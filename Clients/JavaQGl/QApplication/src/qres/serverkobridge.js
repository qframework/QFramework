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
		// add to array
		if (this.databuffer.length >  300)
		{
			console.log("ERROR: data push large " + this.databuffer[3]);
		}
		
		this.databuffer.push("");
	}

	this.appendEvent_ = 	function (id, area, data , data2, data3, data4, data5)
	{
		this.startData();
	        if ( this.databuffer[ this.databuffer.length -1 ].length != 0)
	        	this.databuffer[ this.databuffer.length -1 ] += ",";
	        this.databuffer[ this.databuffer.length -1 ] += "{\"res\":\"event\",\"id\":\""+id+"\",\"type\":\""+area;
	        
	        if (data != undefined)
	        	this.databuffer[ this.databuffer.length -1 ] += "\",\"data\":\""+data;
	        if (data2 != undefined)
	        	this.databuffer[ this.databuffer.length -1 ] += "\",\"data2\":\""+data2;
	        if (data3 != undefined)
	        	this.databuffer[ this.databuffer.length -1 ] += "\",\"data3\":\""+data3;
	        if (data4 != undefined)
	        	this.databuffer[ this.databuffer.length -1 ] += "\",\"data4\":\""+data4;	        
	        this.databuffer[ this.databuffer.length -1 ] += "\"}";
        
        this.sendData();
	}
	
	this.appendEvent = 	function (id, area, data , data2, data3, data4, data5)
	{
		if (this.databuffer.length == 0)
		{
			console.log("ERROR: data append " + id + " " + area + " "+ data);
			return;
		}		
		
	        if ( this.databuffer[ this.databuffer.length -1 ].length != 0)
	        	this.databuffer[ this.databuffer.length -1 ] += ",";
	        this.databuffer[ this.databuffer.length -1 ] += "{\"res\":\"event\",\"id\":\""+id+"\",\"type\":\""+area;
	        
	        if (data != undefined)
	        	this.databuffer[ this.databuffer.length -1 ] += "\",\"data\":\""+data;
	        if (data2 != undefined)
	        	this.databuffer[ this.databuffer.length -1 ] += "\",\"data2\":\""+data2;
	        if (data3 != undefined)
	        	this.databuffer[ this.databuffer.length -1 ] += "\",\"data3\":\""+data3;
	        if (data4 != undefined)
	        	this.databuffer[ this.databuffer.length -1 ] += "\",\"data4\":\""+data4;	        
	        
	        
	        this.databuffer[ this.databuffer.length -1 ] += "\"}";
	}
	
	this.sendData = function ()
	{
		// add to buffer array
		if (this.databuffer.length == 0)
		{
			console.error("ERROR: data length 0");
			return;
		}
		
        data = this.databuffer.shift();
        this.sendbuffer.push( "{\"gs\":{\"room\":[" + data  + "]}}\r\n"  );
	}

	this.clientStartData = 	function (userID)
	{
		// just in case of recursion , is 300 decent number? it was for spartans..
		if (this.clientbuffer.length >  300)
		{
			console.error("ERROR: client data push large " + this.clientbuffer[3]);
		}		
		this.clientbuffer.push("");
		
	}

	this.clientAppendEvent = function (userID , id, area, data, data2, data3, data4)
	{
		if (this.clientbuffer.length == 0)
		{
			console.log("ERROR: client data append " + id + " " + area + " "+ data);
			return;
		}		
		//clientbuffer[ clientbuffer.length -1 ] += "<room><res>event</res><id>"+id+"</id><type>"+area+"</type><data>"+data+"</data></room>";
        if ( this.clientbuffer[ this.clientbuffer.length -1 ].length != 0)
        	this.clientbuffer[ this.clientbuffer.length -1 ] += ",";

        
        this.clientbuffer[ this.clientbuffer.length -1 ] += "{\"res\":\"event\",\"id\":\""+id+"\",\"type\":\""+area+"\",\"data\":\""+data+"\"}";
        if (data2 != undefined)
        	this.clientbuffer[ this.clientbuffer.length -1 ] += "\",\"data2\":\""+data2;
        if (data3 != undefined)
        	this.clientbuffer[ this.clientbuffer.length -1 ] += "\",\"data3\":\""+data3;
        if (data4 != undefined)
        	this.clientbuffer[ this.clientbuffer.length -1 ] += "\",\"data4\":\""+data4;	        
                
	}

	this.clientAppendEvent_ = function (userID , id, area, data, data2, data3, data4)
	{
		this.clientStartData(userID);
		//clientbuffer[ clientbuffer.length -1 ] += "<room><res>event</res><id>"+id+"</id><type>"+area+"</type><data>"+data+"</data></room>";
        if ( this.clientbuffer[ this.clientbuffer.length -1 ].length != 0)
        	this.clientbuffer[ this.clientbuffer.length -1 ] += ",";
        
        
        this.clientbuffer[ this.clientbuffer.length -1 ] += "{\"res\":\"event\",\"id\":\""+id+"\",\"type\":\""+area+"\",\"data\":\""+data+"\"}";
        
        if (data2 != undefined)
        	this.clientbuffer[ this.clientbuffer.length -1 ] += "\",\"data2\":\""+data2;
        if (data3 != undefined)
        	this.clientbuffer[ this.clientbuffer.length -1 ] += "\",\"data3\":\""+data3;
        if (data4 != undefined)
        	this.clientbuffer[ this.clientbuffer.length -1 ] += "\",\"data4\":\""+data4;	        
        
		this.clientSendData(userID);
        
	}

	
	this.clientSendData =  	function (userID)
	{
		if (this.clientbuffer.length == 0)
		{
			console.log("ERROR: client data length 0");
			return;
		}
		
        data = this.clientbuffer.shift();
        this.sendbuffer.push( "{\"gs\":{\"room\":[" + data  + "]}}\r\n"  );
	}
	
	this.startTag =  function (id) 
	{
        if (id != undefined)
        {
            this.databuffer[ this.databuffer.length -1 ] += "{\""+id+"\": ";
        }
        else
        {
        	this.databuffer[ this.databuffer.length -1 ] += "{";            
        }
	}
	
	this.startTags =  	function ( id, data)
	{
		this.databuffer[ this.databuffer.length -1 ] += "\""+id+"\": [";
	}
	
	this.appendTag = 	function ( id, data)
	{
		this.databuffer[ this.databuffer.length -1 ] += "\""+id+"\": " + "\""+data+"\"";
	}
	
	this.endTag = 	function (id)
	{
		this.databuffer[ this.databuffer.length -1 ] += "}";
	}
	
	this.endTags = 	function (id)
	{
		this.databuffer[ this.databuffer.length -1 ] += "]";
	}        
	this.addSeparator = function ()
	{
		this.databuffer[ this.databuffer.length -1 ] += ",";
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
}

	
console.log(" serverko bridge load ok");
