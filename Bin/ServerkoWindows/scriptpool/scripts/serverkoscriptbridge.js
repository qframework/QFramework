try {

	console = 
	{ 
		msgs: new Array(), log: function(msg) 
		{ console.msgs.push(msg); }, 
		info: function(msg) { console.msgs.push(msg); }, 
		warn : function(msg) { console.msgs.push(msg); }, 
		error: function(msg) { console.msgs.push(msg); }, 
		shift: function() { return console.msgs.shift(); } 
	};
		
	databuffer = new Array();
	clientbuffer = new Array();
	sendbuffer = new Array();
	scriptlayouts = new Array();
		
    function print(str) {
        console.log( str );
    }
	function serverko_startData()
	{
		// add to array
		databuffer.push("");
	}

	function serverko_appendEvent(id, area, data)
	{
		databuffer[ databuffer.length -1 ] += "<room><res>event</res><id>"+id+"</id><type>"+area+"</type><data>"+data+"</data></room>";
	}

	function serverko_sendData()
	{
		// add to buffer array
		sendbuffer.push( "<gs>" + databuffer.pop()  + "</gs>\r\n" );
	}


	function serverko_clientStartData(userID)
	{
		clientbuffer.push("");
		
	}

	function serverko_clientAppendEvent(userID , id, area, data)
	{
		clientbuffer[ clientbuffer.length -1 ] += "<room><res>event</res><id>"+id+"</id><type>"+area+"</type><data>"+data+"</data></room>";
	}

	function serverko_clientSendData(userID)
	{
		clientbuffer.push( "<gs>" + clientbuffer.pop()  + "</gs>\r\n" );
	}

	
	function serverko_startTag(id) 
	{
		databuffer[ databuffer.length -1 ] += "<"+id+">";
	}
	
	function serverko_appendTag( id, data)
	{
		databuffer[ databuffer.length -1 ] += "<"+id+">" + data + "</"+id+">";
	}
	
	function serverko_endTag(id)
	{
		databuffer[ databuffer.length -1 ] += "</"+id+">";
	}

	function serverko_storeLayout(id)
	{
		// get last serverbuffer
		
		// store with array
		scriptlayouts[id] = "<gs>" + databuffer.pop()  + "</gs>\r\n" ;
        //console.log("laout: " + id + " " + scriptlayouts[id]);
	}
	

	function serverko_loadModule(id)
	{
		// do nothing
        console.log("Serverko module: " + id);

	}
	
    function serverko_trace(str)
	{
		console.log(str);
	}
    
    function serverko_sendEvent(id, delay, data) {
    
        var str = "http://cmd?" +delay+"=script_onEvent(" + id + ","  + "'" + data + "'" + ");" ;
        print(" event -> " + str );
        window.location  = str;
    }
    
	function Serverko()
	{
		this.startData = serverko_startData;
		this.appendEvent = serverko_appendEvent;
		this.sendData =  serverko_sendData;
		this.clientStartData = serverko_clientStartData;
		this.clientAppendEvent =  serverko_clientAppendEvent;
		this.clientSendData =  serverko_clientSendData;
		this.startTag =  serverko_startTag;
		this.appendTag = serverko_appendTag;
		this.endTag = serverko_endTag;
		this.storeLayout = serverko_storeLayout;
		this.getLayout = serverko_getLayout;
		this.loadModule = serverko_loadModule;
        this.trace = serverko_trace;
        this.sendEvent = serverko_sendEvent;
	}

	//////
	function serverko_getLayout(id)
	{
        //console.log("getlaout: " + id + " " + scriptlayouts[id]);
		return scriptlayouts[ id ];
	}

	function serverko_getdata()
	{
		if (sendbuffer.length > 0)
		{
			return sendbuffer.shift();
		} else {
			return "";
		}
	}
	
	var serverko = new Serverko();
	console.log(" serverko bridge load ok");
}
catch (error)
{
	console.error( "error: " + error.toString() );
}
