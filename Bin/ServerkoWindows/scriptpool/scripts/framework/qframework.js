function Camera(qapp)
{
	this.qapp = qapp;
    this.fit_ = function (xsz, ysz)
    {
        this.qapp.startUpdate();
        this.qapp.appendEvent( 2500 , "fit" , xsz + "," + ysz );
        this.qapp.sendUpdate();
    }
    
    this.fit = function (xsz, ysz)
    {
        this.qapp.appendEvent( 2500 , "fit" , xsz + "," + ysz );
    }
    
    this.set_ = function (x1, y1,z1 , x2,y2,z2)
    {
        this.qapp.startUpdate();
        this.qapp.appendEvent( 2501 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
        this.qapp.sendUpdate();
    }

    
    this.set = function (x1, y1,z1 , x2,y2,z2)
    {
        this.qapp.appendEvent( 2501 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
    }
    
    this.proj_ = function (fov, near, far)
    {
        this.qapp.startUpdate();
        this.qapp.appendEvent( 2502 , fov , near+","+far);
        this.qapp.sendUpdate();
    }
    
    this.proj = function (fov, near, far)
    {
        this.qapp.appendEvent( 2502 , fov , near+","+far);
    }

    this.projHud_ = function (fov, near, far)
    {
        this.qapp.startUpdate();
        this.qapp.appendEvent( 2512 , fov , near+","+far);
        this.qapp.sendUpdate();
    }

    this.projHud = function (fov, near, far)
    {
        this.qapp.appendEvent( 2512 , fov , near+","+far);
    }
    
    this.fitHud_ = function (xsz, ysz)
    {
        this.qapp.startUpdate();
        this.qapp.appendEvent( 2510 , "fit" , xsz + "," + ysz );
        this.qapp.sendUpdate();
    }    
    this.fitHud = function (xsz, ysz)
    {
        this.qapp.appendEvent( 2510 , "fit" , xsz + "," + ysz );
    }
    
    this.setHud_ = function (x1, y1,z1 , x2,y2,z2)
    {
        this.qapp.startUpdate();
        this.qapp.appendEvent( 2511 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
        this.qapp.sendUpdate();
    }

    this.setHud = function (x1, y1,z1 , x2,y2,z2)
    {
        this.qapp.appendEvent( 2511 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
    }

}


function Connect(qapp)
{
	this.qapp = qapp;
    this.connect =  function (ip, callback)
    {
        this.qapp.appendEvent( 7000 , ip ,callback);    
    }

    this.connect_ =  function (ip, callback)
    {
        this.qapp.startUpdate();    
        this.qapp.appendEvent( 7000 , ip ,callback);    
        this.qapp.sendUpdate();    
    }


    
    this.disconnect_ =  function ()
    {
        this.qapp.startUpdate();    
        this.qapp.appendEvent( 7003 , "" , "" );    
        this.qapp.sendUpdate();    
    }

    this.disconnect =  function ()
    {
        this.qapp.appendEvent( 7003 , "" , "" );    
    }

    this.join_ = function (roomid, user, callback)
    {
        this.qapp.startUpdate();    
        this.qapp.appendEvent( 7001 , roomid+"|"+user ,callback);    
        this.qapp.sendUpdate();    
    }

    this.join = function (roomid, user, callback)
    {
        this.qapp.appendEvent( 7001 , roomid+"|"+user ,callback);    
    }

    this.send_ = function (data)
    {
        this.qapp.startUpdate();    
        this.qapp.appendEvent( 7002 , data,"");    
        this.qapp.sendUpdate();    
    }
    
    this.send = function (data)
    {
        this.qapp.appendEvent( 7002 , data,"" );    
    }


}

function Env(qapp)
{
	this.qapp = qapp;
    this.set =  function (name, value)
    {
        this.qapp.appendEvent( 200 , ip ,callback);    
    }

    this.set_ =  function (name, value)
    {
        this.qapp.startUpdate();    
        this.qapp.appendEvent( 200 , ip ,callback);    
        this.qapp.sendUpdate();    
    }

}


function Settings(qapp)
{
	this.qapp = qapp;
    this.open = function ()
	{
	    this.qapp.appendEvent( 2600 , "" ,"");
	}

	this.save = function ()
	{
	    this.qapp.appendEvent( 2601 , "" ,"");
	}

	this.writeInt = function (name, value)
	{
	    this.qapp.appendEvent( 2610 , name ,value);
	}

	this.writeString = function (name, value)
	{
	    this.qapp.appendEvent( 2611 , name ,value);
	}

	this.loadInt = function (name, value)
	{
	    this.qapp.appendEvent( 2620 , name , value );
	}

	this.loadString = function (name, value)
	{
	    this.qapp.appendEvent( 2621 , name ,value);
	}
	
	this.loadArray = function (name, value)
	{
	    this.qapp.appendEvent( 2622 , name ,value);
	}	
}




function Client(qapp)
{
	this.qapp = qapp;
    this.allexec_ = function (delay, script)
    {
    	this.qapp.startUpdate();
        this.qapp.appendEvent( 101 , delay , script);
        this.qapp.sendUpdate();
    }
    
    this.allexec = function ( delay, script)
    {
        
        this.qapp.appendEvent( 101 , delay , script);
        
    }
    
    this.exec_ = function (userID , delay, script)
    {
        
    	this.qapp.clientStartUpdate(userID);
        this.qapp.clientAppendEvent( userID, 101 , delay , script);
        this.qapp.clientSendUpdate(userID);
        
    }

    this.exec = function (userID , delay, script)
    {
        this.qapp.clientAppendEvent( userID, 101 , delay , script);
    }
    
}


function Env(qapp)
{
	this.qapp = qapp;
    this.set =  function (name, value)
    {
        this.qapp.appendEvent( 200 , name ,value);    
    }

    this.set_ =  function (name, value)
    {
        this.qapp.startUpdate();    
        this.qapp.appendEvent(200 , name ,value);    
        this.qapp.sendUpdate();    
    }

}

function Util(qapp)
{
	this.qapp = qapp;
    this.touchonoff = function (delay)
    {
        if (delay == undefined)
            delay = 1000;
        
        this.qapp.env.set('touch','off');
        this.qapp.exec(delay,"Q.env.set_('touch','on');");        

    }
    
    this.touchonoff_ = function (delay)
    {
        if (delay == undefined)
            delay = 1000;
        
        this.qapp.env.set_('touch','off');
        this.qapp.exec_(delay,"Q.env.set_('touch','on');");        

    }    
}

function Anim(qapp)
{
	this.qapp = qapp;
	this.move = function( name, path, type, callback)
	{
		var value = path + "|" + type + "|" + callback;
		this.qapp.appendEvent( 4200 , name ,value);
	}
	
	this.move_ = function( name, path, type, callback)
	{
		var value = path + "|" + type + "|" + callback;
		this.qapp.startUpdate();
		this.qapp.appendEvent( 4200 , name ,value);
		this.qapp.sendUpdate();
	}
	
	this.rotate = function( name, path, type, callback)
	{
		var value = path + "|" + type + "|" + callback;
		this.qapp.appendEvent( 4210 , name ,value);
	}
	
	this.rotate_ = function( name, path, type, callback)
	{
		var value = path + "|" + type + "|" + callback;
		this.qapp.startUpdate();
		this.qapp.appendEvent( 4210 , name ,value);
		this.qapp.sendUpdate();
	}
	
}


function Objects(qapp)
{
	this.create = function ( name ,value)
	{
		serverko.appendEvent( 4100 , name ,value);
	}
	this.create_ = function (name,value)
	{
		qapp.startUpdate();
		serverko.appendEvent( 4100 , name ,value);
		qapp.sendUpdate();
	}	
	
	this.place = function (name,value)
	{
		serverko.appendEvent( 4110 , name ,value);
	}
	this.place_ = function (name,value)
	{
		qapp.startUpdate();
		serverko.appendEvent( 4110 , name ,value);
		qapp.sendUpdate();
	}	

	this.scale = function (name,value)
	{
		serverko.appendEvent( 4120 , name ,value);
	}
	this.scale_ = function (name,value)
	{
		qapp.startUpdate();
		serverko.appendEvent( 4120 , name ,value);
		qapp.sendUpdate();
	}	

	this.texture = function (name,value)
	{
		serverko.appendEvent( 4130 , name ,value);
	}
	this.texture_ = function (name,value)
	{
		qapp.startUpdate();
		serverko.appendEvent( 4130 , name ,value);
		qapp.sendUpdate();
	}	
	
	this.state = function (name,value)
	{
		serverko.appendEvent( 4140 , name ,value);
	}
	this.state_ = function (name,value)
	{
		qapp.startUpdate();
		serverko.appendEvent( 4140 , name ,value);
		qapp.sendUpdate();
	}	
	


}


function QApp()
{
	
    this.exec = function ( delay, script)   
    {
        this.appendEvent( 101 , delay , script );
    }
    
    this.exec_ = function ( delay, script)   
    {
    	this.startUpdate();    
    	this.appendEvent( 101 , delay , script );
    	this.sendUpdate();    
    }
    
    
    this.goUrl_ = function (type, url)
    {
        
        this.startUpdate();
        this.appendEvent( 1200 , type, url );
        this.sendUpdate();
        
    }
    
    this.serverko = new Serverko();
    
    this.layout = new Layout(this);
    this.textures = new Textures(this);
    this.sounds = new Sounds(this);
    this.models = new Models(this);
    this.settings = new Settings(this);
    this.camera = new Camera(this);
	this.env = new Env(this);
    this.connect = new Connect(this);
    this.handlers = new Room(this);
    this.util = new Util(this);
    this.client = new Client(this);
    this.objects = new Objects(this);
    this.anim = new Anim(this);
    
    this.startUpdate = function()
    {
    	this.serverko.startData();
    }
    this.sendUpdate = function() 
    {
    	this.serverko.sendData();
    }
    this.appendEvent = function(id, area, data)
    {
    	this.serverko.appendEvent(id, area, data);
    }
    
    	
    this.clientAppendEvent = function (userID , id, area, data)
    {
    	this.serverko.clientAppendEvent(userID , id, area, data);
    
    }
    this.clientStartUpdate = function(userID)
    {
    	this.serverko.clientStartData(userID);
    }
    this.clientSendUpdate = function (userID)
    {
    	this.serverko.clientSendData(userID);
    
    }
    
    this.print = function (data)
    {
    	this.layout.print(data);
    }
    
    this.print_ = function (data)
    {
    	this.layout.print_(data);
    }
    
    this.event = function (id, delay, data) 
    {
    	this.serverko.sendEvent(id, delay, data) ;
    
    }
    this.include = function (id)
    {
    	this.serverko.loadModule(id);
    
    }
    this.load = function (id)
    {
    	this.serverko.loadModule2(id); 
    
    }
    
    
    //var areas = new Array();
	//layout.define("*", areas, 1);
	console.log( this.serverko.databuffer.length );
	
}

var Q = new QApp();
console.log(" q ok");

// backward compatibility
layout = Q.layout;
serverko = Q.serverko;

var sysareas = new Array();

areaStdOut = new LayoutArea();
areaStdOut.type = "text.mline";
areaStdOut.id = "stdout";
areaStdOut.location="0,0,2,2";
areaStdOut.size = "10,10,10";
areaStdOut.text = "";
areaStdOut.display = "hud";
sysareas.push(areaStdOut);
Q.layout.add_("*", sysareas);


