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

function ServerkoParse( app ) 
{
	this.mApp = app;
	this.mUsername = "Dembinjo";
	this.mOptions = "";
	this.mLoadedScripts = [];

	this.mSocket = undefined;
	this.mRoot = "10000";
	this.mCache = "";
}

ServerkoParse.prototype.set = function() {
	//this.readJavascriptLogger();
	this.showData(true);
}
 
ServerkoParse.prototype.readJavascriptLogger = function()
{
	

	var res = undefined;
	do {
		res =  console.shift();
		if (res instanceof String )
		{
			print( "JS :" + res + "\n");
		}else if (res != undefined)
		{
			//String ggg = res.toString();
			print ("JS :" + str(res) + "\n");
		}
	} while (res !=  undefined && res.length > 0);
	
	

   window.setTimeout( "q_serverparser.readJavascriptLogger();" ,50); 
}

var q_serverparser = undefined;
var q_serverConnected = false;
ServerkoParse.prototype.showData = function(first)
{
	q_serverparser = this;
	var msg = undefined;
	while( (msg = this.execScript("Q.serverko.getData();")) != undefined && msg.length != 0)
	{
		if (msg.length > 0)
		{
			this.onJSONData(msg);
		}

	}

	if (first)
	{
		window.setInterval( "q_serverparser.showData(false);" ,50); 
	}

}


ServerkoParse.prototype.execScript = function(script, delay) 
{
	
	if (delay != undefined)
	{
		if (delay == 0) delay = 1;
		//console.log(script);
		//if (delay == 0) delay = 10;
		window.setTimeout( script , delay);
		return;
	}
	//console.log(script); 
	var res =  eval( script  );
	if (res != undefined)
	{
		return res;
	}
	//mScriptView.loadUrl("javascript:"  + "try{" + script + "} catch (error){ alert( \"error: \" + error.toString() );}");
	return undefined;
}




ServerkoParse.prototype.execScriptFromFile = function(fname) {
	var location = "res/";
	location += fname;
//	$.ajaxSetup({async: false});
	q_getScript( location );
//	$.ajaxSetup({async: true});
}

ServerkoParse.prototype.execQScriptFromFile = function(fname) 
{
	var location = "qres/";
	location += fname;
//	$.ajaxSetup({async: false});
	q_getScript( location);
//	$.ajaxSetup({async: true});

}


ServerkoParse.prototype.startScript = function(username, options)
{
	this.mUsername = username;
	this.mOptions = options;
}


ServerkoParse.prototype.sendUserData = function(datastr) {
	this.execScript("Q.handlers.script_userData('"+this.mUsername+"', '" + datastr + "');" );
}	 
   


ServerkoParse.prototype.stop = function() {
}

ServerkoParse.prototype.loadFramework = function()
{
/*
	execQScriptFromFile("serverkobridge.js");
	execQScriptFromFile("room.js");
	execQScriptFromFile("layout.js");
	execQScriptFromFile("colors.js");    
	execQScriptFromFile("qframework.js");
*/	
}


ServerkoParse.prototype.loadScript = function(script, delay)
{
	GameonApp.lock = true;	
	window.setTimeout( "q_serverparser.execLoadModule2('" + script + "');" , delay);
}

ServerkoParse.prototype.loadModule2 = function(resptype) 
{
	//console.log(resptype);
	//console.log("lock set2");
	GameonApp.lock = true;	
	window.setTimeout( "q_serverparser.execLoadModule2('" + resptype + "');" , 0);
}


ServerkoParse.prototype.loadModule = function(resptype) 
{
	//console.log(resptype);
	//console.log("lock set2");
	GameonApp.lock = true;	
	
	window.setTimeout( "q_serverparser.execLoadModule('" + resptype + "');" , 0);
}


ServerkoParse.prototype.execLoadModule = function(data)
{
	if (this.mLoadedScripts.indexOf(data) < 0)
	{
		this.mLoadedScripts.push(data);
		this.execScriptFromFile(data);
	}
	 
}

ServerkoParse.prototype.execLoadModule2 = function(data)
{
	this.execScriptFromFile(data);		 
}



ServerkoParse.prototype.onJSONData = function(data) {

	//console.log(data);
	var response  = eval( '(' + data + ')' );
	if (response != undefined)
	{
		this.mApp.queueResponse(response);
	}                	
	
}


var q_script_reqs = new Array();
var q_req_working = false;

function q_getScript(url)	
{
	console.log( " get script " + url );
	
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = url;

  // Handle Script loading
  {
	 var done = false;
	 //console.log("lock set");
	GameonApp.lock = true;
	 // Attach handlers for all browsers
	 script.onload = script.onreadystatechange = function(){
		if ( !done && (!this.readyState ||
			  this.readyState == "loaded" || this.readyState == "complete") ) {
		   done = true;
		   // Handle memory leak in IE
		   script.onload = script.onreadystatechange = null;
		   //console.log("lock unset");
		   GameonApp.lock = false;
		}
	 };
  }

  head.appendChild(script);
  return;
}

function q_onLoadScript(req)
{
	var text = req.response;
	q_serverparser.execScript(text, 10);
	q_req_working = false;
	if (q_script_reqs.length > 0)
	{
		var req = q_script_reqs.shift();
		q_req_working = True;
		req.send(null);
	}
	
}

ServerkoParse.prototype.sendConnect = function(data)
{
	var userdata;
	userdata = this.mConnectScript + "(" + data + ",'" + this.mServerAddr   + "');";
	this.execScript(userdata);
}

ServerkoParse.prototype.onSocketData = function(data)
{
	this.mCache += data;
	do
	{
		console.log( "data cache: " + this.mCache);
		var i = this.mCache.indexOf("\r\n\r\n");
		if (i >= 0)
		{
			var data = this.mCache.substr(0, i + 4);
			this.mCache = this.mCache.substr(i + 4);
			this.onData(data);
		}
	}while (i >= 0);
	
}

ServerkoParse.prototype.onData = function(data)
{
	console.log("rec -> " , data);
	if (this.mWaitingForContent)
	{
		//System.out.println("JSON " + data);
		this.onJSONData(data);
		this.mWaitingForContent = false;
	}
	else {
		//analyze
		var tok;
		tok = data.split("\r\n");
		//System.out.println("\n");
		for (var a=0; a < tok.length; a++)
		{
			var header = tok[a];
			//System.out.println("Header " + header);
			if (header.indexOf("HTTP/1.0 300") == 0)
			{
				// multiple_choices 
				// user already exists
				this.sendJoin(-1);
				return;
			}
			else if (header.indexOf("HTTP/1.0 202") == 0)
			{
				if (this.mWaitingForJoin)
				{
					this.mWaitingForJoin = false;
					this.sendJoin(1);
				}
			}
			else
			if (header.indexOf("Content-length") == 0)
			{
				//System.out.println("CONTENT " + header);
				this.mWaitingForContent = true;
				return;	    			
			}
		}
	}
}

ServerkoParse.prototype.connect = function(serverip, script) {
	if (q_serverConnected == true)
	{
		this.disconnect();
	}
	q_serverConnected = false;
	//this.mSocket = new WebSocket("ws://" + serverip);
	var sdata = serverip.split(":");
	//this.mSocket = new io.Socket(sdata[0],{ port: parseInt(sdata[1]) , transports: [ 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling'] });
	//this.mSocket = new io.Socket(sdata[0],{ port: parseInt(sdata[1]) , transports: [ 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling'] });
	//this.mSocket = new io.Socket(sdata[0],{ port: parseInt(sdata[1]) });
	//this.mSocket.connect();
	this.mSocket = io.connect("http://" + serverip);
	this.mServerAddr = serverip;
	this.mConnectScript = script;
	/*
	 console.log('Socket Status: '+ this.mSocket.readyState);
	this.mSocket.onopen = function(evt) {
		q_serverparser.sendConnect(1);
	};	
	this.mSocket.onmessage = function(evt) {
		q_serverparser.onSocketData(evt);
	};	
	this.mSocket.onclose = function(evt) {
		q_serverparser.sendConnect(-1);
	};
*/
	this.mSocket.on('connect',function() {
		q_serverConnected = true;
		q_serverparser.sendConnect(1);
	});
	// Add a connect listener
	this.mSocket.on('message',function(data) {
		console.log( ' MESSAGE =' + data );
		var newdata = base64_decode(data);
		console.log( ' MESSAGE ' + newdata );
		q_serverparser.onSocketData(newdata);
	});
	// Add a disconnect listener
	this.mSocket.on('disconnect',function() {
		q_serverConnected = false;
		q_serverparser.sendConnect(-1);
	});	
	/*
	if (mConnect == undefined)
	{
		mConnect = new ServerkoConnect();
	}
	
	mConnect.connect(serverip, script, this);
	*/
}

ServerkoParse.prototype.disconnect = function() {
/*
	if (mConnect != undefined)
	{
		mConnect.close();
	}
	*/
	this.mCache = "";
	if (this.mSocket != undefined)
	{
	/*
		this.mSocket.onclose = function() {};
		this.mSocket.close();
		this.mSocket = undefined;
	*/
		this.mSocket.disconnect();
		q_serverConnected = false;
		this.mSocket = undefined;
	}
}

ServerkoParse.prototype.sendJoin = function(data)
{
	var userdata;
	userdata = this.mJoinScript + "(" + data + ",'" + this.mServerAddr  + "');";
	this.execScript(userdata);
}

ServerkoParse.prototype.join = function(room, user, script) {

	if (this.mSocket == undefined)
		return;
	if (q_serverConnected == false)
	{	
		return;
	}		
	this.mRoom = room;
	this.mUser = user;
	//mUser = "DembLee3";
	this.mJoinScript = script;
	this.mWaitingForJoin = true;
	//System.out.println(" getServers() >>>> \n");
	var path = "/" + this.mRoot + "/" + this.mRoom + "/" + this.mUser;
	var data = "POST " + path +  " HTTP/1.1\r\n";
	data += "Host: qframework\r\n";
	data += "User-Agent: webgl\r\n";
	data += "\r\n";
	//System.out.println( " POST = >>>" + data +  "<<<");
	console.log("send -> " , data);
	this.mSocket.send(base64_encode(data));

	
}

ServerkoParse.prototype.send = function(dataStr) {
	if (q_serverConnected == false)
	{	
		return;
	}
	var path = "/" + this.mRoot + "/" + this.mRoom + "/" + this.mUser;
	var data = "PUT " + path +  " HTTP/1.1\r\n";
	data += "Host: qframework\r\n";
	data += "User-Agent: jogampapp\r\n";
	data += "Data: " + dataStr + "\r\n";
	data += "\r\n";
	
	console.log("send -> " , data);
	this.mSocket.send(base64_encode(data));
}


ServerkoParse.parseFloatArray = function(array,data)
{
	if (data == undefined || data == "" )
		return 0;
	var count = 0;
	var tok = data.split(",");
	for (var a=0; a< tok.length ; a++)
	{
		array[count++] =  parseFloat( tok[a]  );
	}

	return count;
}

ServerkoParse.parseIntArray = function(array,data)
{
	if (data == undefined || data == "" )
		return 0;
	var count = 0;
	var tok = data.split(",");
	for (var a=0; a< tok.length ; a++)
	{
		array[count++] =  parseInt( tok[a]  );
	}

	return count;
}
