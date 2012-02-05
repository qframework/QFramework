console = 
{ 
	msgs: new Array(), log: function(msg) 
	{ print(msg); }, 
	info: function(msg) { print(msg); }, 
	warn : function(msg) { print(msg); }, 
	error: function(msg) { print(msg); }, 
	shift: function() { return console.msgs.shift(); } 
};
	

function serverko_startData()
{
    serverkob.startData();
    
}

function serverko_appendEvent(id, area, data)
{
    serverkob.appendEvent(id, area, data);
}

function serverko_sendData()
{
    serverkob.sendData();
}



function serverko_clientStartData(userID)
{
    serverkob.clientStartData(userID);
}

function serverko_clientAppendEvent(userID , id, area, data)
{
    serverkob.clientAppendEvent(userID , id, area, data)
}

function serverko_clientSendData(userID)
{
    serverkob.clientSendData(userID);
}

function serverko_disconnectClient(userID)
{
    serverkob.disconnectClient(userID);
}


function serverko_startTag(id) 
{
	serverkob.startTag(id);
}

function serverko_appendTag( id, data)
{
	serverkob._appendTag( id, data);
}

function serverko_endTag(id)
{
	serverkob.endTag(id);
}

function serverko_startTag2(id) 
{
    serverkob.startTag(id);

}

function serverko_appendTag2( id, data)
{
    serverkob.appendTag( id, data);
}

function serverko_startTags2( id, data)
{
    serverkob.startTags( id, data);
}

function serverko_endTags2(id)
{
    serverkob.endTags(id);
}

function serverko_appendSeparator2()
{
    serverkob.addSeparator();
}


function serverko_endTag2(id)
{
    serverkob.endTag(id);
}



function serverko_clientStartTag(userID , id) 
{
	serverkob.clientStartTag(userID , id);
}

function serverko_clientAppendTag( userID , id, data)
{
	serverkob.clientAppendTag( userID , id, data);
}

function serverko_clientEndTag(userID , id)
{
	serverkob.clientEndTag(userID , id);
}

function serverko_clientStartTag2(userID , id) 
{
    serverkob.clientStartTag(userID , id);

}

function serverko_clientAppendTag2( userID , id, data)
{
    serverkob.clientAppendTag( userID , id, data);
}

function serverko_clientStartTags2( userID , id)
{
    serverkob.clientStartTags( userID , id);
}

function serverko_clientEndTags2(userID , id)
{
    serverkob.clientEndTags(userID , id);
}

function serverko_clientAppendSeparator2(userID )
{
    serverkob.clientAddSeparator(userID );
}


function serverko_clientEndTag2(userID , id)
{
    serverkob.clientEndTag(userID , id);
}



function serverko_storeLayout(id)
{
	
}


function serverko_loadModule(id)
{
    serverkob.loadModule(id);
    
}
function serverko_loadModule2(id)
{
	serverkob.loadModule2(id);
    
}

function serverko_trace(str)
{
}

function serverko_clientSpectate(userID , yesno)
{
}

function serverko_sendEvent(id, delay, data) {
    serverkob.sendEvent(id, delay, data);
}

function serverko_exec(delay, script) {
    serverkob.exec(delay, script);
}

function serverko_exec_(delay, script) {
    //print("INFO: exec " + delay + " " + script);
    serverkob.exec(delay, script);
}

function Serverko()
{
	this.startData = serverko_startData;
	this.appendEvent = serverko_appendEvent;
	this.sendData =  serverko_sendData;
	this.clientStartData = serverko_clientStartData;
	this.clientAppendEvent =  serverko_clientAppendEvent;
	this.clientSendData =  serverko_clientSendData;
	this.disconnectClient =  serverko_disconnectClient;
	this.startTag =  serverko_startTag2;
	this.startTags =  serverko_startTags2;        
	this.appendTag = serverko_appendTag2;
	this.endTag = serverko_endTag2;
	this.endTags = serverko_endTags2;        
	this.addSeparator = serverko_appendSeparator2;
	
	this.clientStartTag =  serverko_clientStartTag2;
	this.clientStartTags =  serverko_clientStartTags2;        
	this.clientAppendTag = serverko_clientAppendTag2;
	this.clientEndTag = serverko_clientEndTag2;
	this.clientEndTags = serverko_clientEndTags2;        
	this.clientAddSeparator = serverko_clientAppendSeparator2;
	
			
	this.storeLayout = serverko_storeLayout;
	//this.getLayout = serverko_getLayout;
	this.loadModule = serverko_loadModule;
	this.loadModule2 = serverko_loadModule2;
    this.trace = serverko_trace;
    this.sendEvent = serverko_sendEvent;
    this.clientSpectate = serverko_clientSpectate;
    this.exec = serverko_exec;
    this.exec_ = serverko_exec_;

}

var serverko = new Serverko();
