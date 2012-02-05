
function array_removeElement(array,element)
{
    for(var i=0; i<array.length;i++ )
    { 
        if(array[i]==element)
        {
            array.splice(i,1); 
        }
    } 
}


[].indexOf || (Array.prototype.indexOf = function(v,n){
  n = (n==null)?0:n; var m = this.length;
  for(var i = n; i < m; i++)
    if(this[i] == v)
       return i;
  return -1;
});

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
        console.log( str + "\n\r" );
    }
	function serverko_startData()
	{
		// add to array
		databuffer.push("");
	}

	function serverko_appendEvent(id, area, data)
	{
		//databuffer[ databuffer.length -1 ] += "<room><res>event</res><id>"+id+"</id><type>"+area+"</type><data>"+data+"</data></room>";
		if (databuffer.length > 0)
		{
	        if ( databuffer[ databuffer.length -1 ].length != 0)
	            databuffer[ databuffer.length -1 ] += ",";
	        
	        databuffer[ databuffer.length -1 ] += "{\"res\":\"event\",\"id\":\""+id+"\",\"type\":\""+area+"\",\"data\":\""+data+"\"}";
		}else
		{
			print ("ERROR: buffer empty while adding data ");
		}
		
	}

	function serverko_sendData()
	{
		// add to buffer array
        data = databuffer.shift();
         sendbuffer.push( "{\"gs\":{\"room\":[" + data  + "]}}\r\n"  );
	}


	function serverko_clientStartData(userID)
	{
		clientbuffer.push("");
		
	}

	function serverko_clientAppendEvent(userID , id, area, data)
	{
		//clientbuffer[ clientbuffer.length -1 ] += "<room><res>event</res><id>"+id+"</id><type>"+area+"</type><data>"+data+"</data></room>";
        if ( clientbuffer[ clientbuffer.length -1 ].length != 0)
        	clientbuffer[ clientbuffer.length -1 ] += ",";
        
        clientbuffer[ clientbuffer.length -1 ] += "{\"res\":\"event\",\"id\":\""+id+"\",\"type\":\""+area+"\",\"data\":\""+data+"\"}";

	}

	function serverko_clientSendData(userID)
	{
        data = clientbuffer.shift();
        sendbuffer.push( "{\"gs\":{\"room\":[" + data  + "]}}\r\n"  );
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

	function serverko_startTag2(id) 
	{
        if (id != undefined)
        {
            databuffer[ databuffer.length -1 ] += "{\""+id+"\": ";
        }
        else
        {
            databuffer[ databuffer.length -1 ] += "{";            
        }
	}
	
	function serverko_appendTag2( id, data)
	{
		databuffer[ databuffer.length -1 ] += "\""+id+"\": " + "\""+data+"\"";
	}

	function serverko_startTags2( id, data)
	{
		databuffer[ databuffer.length -1 ] += "\""+id+"\": [";
	}
    
	function serverko_endTags2(id)
	{
		databuffer[ databuffer.length -1 ] += "]";
	}

    function serverko_appendSeparator2()
	{
		databuffer[ databuffer.length -1 ] += ",";
	}
    
	
	function serverko_endTag2(id)
	{
		databuffer[ databuffer.length -1 ] += "}";
	}
    

    
	function serverko_storeLayout(id)
	{
		// get last serverbuffer
		
		// store with array
        //print("STORELAYOUT");
		//scriptlayouts[id] = "<gs>" + databuffer.pop()  + "</gs>\r\n" ;
        scriptlayouts[id] = "{gs:" + databuffer.pop()  + "}\r\n" ;

        //console.log("laout: " + id + " " + scriptlayouts[id]);
	}
	

	function serverko_loadModule(id)
	{
        serverko.startData();
        serverko.appendEvent( 102 , id    );
        serverko.sendData();		
	}
	function serverko_loadModule2(id)
	{
        serverko.startData();
        serverko.appendEvent( 103 , id , ""   );
        serverko.sendData();		
		// do nothing
	}	
    function serverko_trace(str)
	{
		console.log(str);
	}
    
    function serverko_clientSpectate(userID , yesno)
	{
	}
    
    function serverko_sendEvent(id, delay, data) 
    {
        serverko.startData();        
        serverko.appendEvent( 100 , delay , "script_onEvent(" + id + ","  + "'" + data + "'" + ");"  );
        serverko.sendData();    
    
        
    }
   
	function Serverko()
	{
		this.startData = serverko_startData;
		this.appendEvent = serverko_appendEvent;
		this.sendData =  serverko_sendData;
		this.clientStartData = serverko_clientStartData;
		this.clientAppendEvent =  serverko_clientAppendEvent;
		this.clientSendData =  serverko_clientSendData;
		this.startTag =  serverko_startTag2;
		this.startTags =  serverko_startTags2;        
		this.appendTag = serverko_appendTag2;
		this.endTag = serverko_endTag2;
		this.endTags = serverko_endTags2;        
		this.addSeparator = serverko_appendSeparator2;
		this.storeLayout = serverko_storeLayout;
		this.getLayout = serverko_getLayout;
		this.loadModule = serverko_loadModule;
		this.loadModule2 = serverko_loadModule2;
        this.trace = serverko_trace;
        this.sendEvent = serverko_sendEvent;
        this.clientSpectate = serverko_clientSpectate;
	}

	//////
	function serverko_getLayout(id)
	{
        //console.log("getlaout: " + id + " " + scriptlayouts[id]);
		//return scriptlayouts[ id ];
                sendbuffer.push( scriptlayouts[ id ] );
	}

	function serverko_getData()
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


