function Camera()
{
    this.fit_ = function (xsz, ysz)
    {
        serverko.startData();
        serverko.appendEvent( 2500 , "fit" , xsz + "," + ysz );
        serverko.sendData();
    }
    
    this.fit = function (xsz, ysz)
    {
        serverko.appendEvent( 2500 , "fit" , xsz + "," + ysz );
    }
    
    this.set_ = function (x1, y1,z1 , x2,y2,z2)
    {
        serverko.startData();
        serverko.appendEvent( 2501 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
        serverko.sendData();
    }

    
    this.set = function (x1, y1,z1 , x2,y2,z2)
    {
        serverko.appendEvent( 2501 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
    }
    
    this.proj_ = function (fov, near, far)
    {
        serverko.startData();
        serverko.appendEvent( 2502 , fov , near+","+far);
        serverko.sendData();
    }
    
    this.proj = function (fov, near, far)
    {
        serverko.appendEvent( 2502 , fov , near+","+far);
    }

    this.projHud_ = function (fov, near, far)
    {
        serverko.startData();
        serverko.appendEvent( 2512 , fov , near+","+far);
        serverko.sendData();
    }

    this.projHud = function (fov, near, far)
    {
        serverko.appendEvent( 2512 , fov , near+","+far);
    }
    
    this.fitHud_ = function (xsz, ysz)
    {
        serverko.startData();
        serverko.appendEvent( 2510 , "fit" , xsz + "," + ysz );
        serverko.sendData();
    }    
    this.fitHud = function (xsz, ysz)
    {
        serverko.appendEvent( 2510 , "fit" , xsz + "," + ysz );
    }
    
    this.setHud_ = function (x1, y1,z1 , x2,y2,z2)
    {
        serverko.startData();
        serverko.appendEvent( 2511 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
        serverko.sendData();
    }

    this.setHud = function (x1, y1,z1 , x2,y2,z2)
    {
        serverko.appendEvent( 2511 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
    }

}


function Connect()
{
    this.connect =  function (ip, callback)
    {
        serverko.appendEvent( 7000 , ip ,callback);    
    }

    this.connect_ =  function (ip, callback)
    {
        serverko.startData();    
        serverko.appendEvent( 7000 , ip ,callback);    
        serverko.sendData();    
    }


    
    this.disconnect_ =  function ()
    {
        serverko.startData();    
        serverko.appendEvent( 7003 , "" , "" );    
        serverko.sendData();    
    }

    this.disconnect =  function ()
    {
        serverko.appendEvent( 7003 , "" , "" );    
    }

    this.join_ = function (roomid, user, callback)
    {
        serverko.startData();    
        serverko.appendEvent( 7001 , roomid+"|"+user ,callback);    
        serverko.sendData();    
    }

    this.join = function (roomid, user, callback)
    {
        serverko.appendEvent( 7001 , roomid+"|"+user ,callback);    
    }

    this.send_ = function (data)
    {
        serverko.startData();    
        serverko.appendEvent( 7002 , data,"");    
        serverko.sendData();    
    }
    
    this.send = function (data)
    {
        serverko.appendEvent( 7002 , data,"" );    
    }


}

function Settings()
{
    this.open = function ()
	{
	    serverko.appendEvent( 2600 , "" ,"");
	}

	this.save = function ()
	{
	    serverko.appendEvent( 2601 , "" ,"");
	}

	this.writeInt = function (name, value)
	{
	    serverko.appendEvent( 2610 , name ,value);
	}

	this.writeString = function (name, value)
	{
	    serverko.appendEvent( 2611 , name ,value);
	}

	this.loadInt = function (name, value)
	{
	    serverko.appendEvent( 2620 , name , value );
	}

	this.loadString = function (name, value)
	{
	    serverko.appendEvent( 2621 , name ,value);
	}
     
	this.loadArray = function (name, value)
	{
	    serverko.appendEvent( 2622 , name ,value);
	}	
}




function Client()
{
    this.allexec_ = function (delay, script)
    {
    	Q.startUpdate();
        serverko.appendEvent( 101 , delay , script);
        Q.sendUpdate();
    }
    
    this.allexec = function ( delay, script)
    {
        
        serverko.appendEvent( 101 , delay , script);
        
    }
    
    this.exec_ = function (userID , delay, script)
    {
        
    	Q.clientStartUpdate(userID);
        serverko.clientAppendEvent( userID, 101 , delay , script);
        Q.clientSendUpdate(userID);
        
    }

    this.exec = function (userID , delay, script)
    {
        serverko.clientAppendEvent( userID, 101 , delay , script);
    }


    
}




function QApp()
{
	this.println = layout.println;
    this.exec = function ( delay, script)   
    {
        serverko.appendEvent( 101 , delay , script );
    }
    
    this.exec_ = function ( delay, script)   
    {
    	layout_startUpdate();    
    	serverko.appendEvent( 101 , delay , script );
    	layout_sendUpdate();    
    }
    
    
    this.event = serverko.sendEvent;
    this.include = serverko.loadModule;
    this.load = serverko.loadModule2; 
    
    this.goUrl_ = function (type, url)
    {
        
        serverko.startData();
        serverko.appendEvent( 1200 , type, url );
        serverko.sendData();
        
    }
    
    
    this.layout = layout;
    this.serverko = serverko;
    this.textures = textures;
    this.sounds = sounds;
    this.models = models;
    this.settings = new Settings();
    this.camera = new Camera();
    this.connect = new Connect();
    this.handlers = room;
    
    this.startUpdate = layout.startUpdate;
    this.sendUpdate = layout.sendUpdate;
    this.clientStartUpdate = layout.clientStartUpdate;
    this.clientSendUpdate = layout.clientSendUpdate;
    
    var areas = new Array();
	layout.define("*", areas, 1);
	this.client = new Client();
	
}

var Q = new QApp();
console.log(" q ok");
