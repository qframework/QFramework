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

function Camera(qapp)
{
	this.qapp = qapp;

    this.fit = function (xsz, ysz)
    {
        this.qapp.appendEvent( 2500 , "fit" , xsz + "," + ysz );
        return this.qapp.serverko;
    }

    this.set = function (x1, y1,z1 , x2,y2,z2)
    {
        this.qapp.appendEvent( 2501 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
        return this.qapp.serverko;
    }
    

    this.proj = function (fov, near, far)
    {
        this.qapp.appendEvent( 2502 , fov , near ,far);
        return this.qapp.serverko;
    }

    this.projHud = function (fov, near, far)
    {
        this.qapp.appendEvent( 2512 , fov , near ,far);
        return this.qapp.serverko;
    }

    this.fitHud = function (xsz, ysz)
    {
        this.qapp.appendEvent( 2510 , "fit" , xsz + "," + ysz );
        return this.qapp.serverko;
    }


    this.setHud = function (x1, y1,z1 , x2,y2,z2)
    {
        this.qapp.appendEvent( 2511 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
        return this.qapp.serverko;
    }

}


function Connect(qapp)
{
	this.qapp = qapp;
    this.connect =  function (ip, callback)
    {
        this.qapp.appendEvent( 7000 , ip ,callback);
        return this.qapp.serverko;
    }


    this.disconnect =  function ()
    {
        this.qapp.appendEvent( 7003 , "" , "" );
        return this.qapp.serverko;
    }

    this.join = function (roomid, user, callback)
    {
        this.qapp.appendEvent( 7001 , roomid+"|"+user ,callback);
        return this.qapp.serverko;
    }

    this.send = function (data)
    {
        this.qapp.appendEvent( 7002 , data,"" );
        return this.qapp.serverko;
    }


}

function Env(qapp)
{
	this.qapp = qapp;
    this.set =  function (name, value)
    {
        this.qapp.appendEvent( 200 , name ,value);    
        return this.qapp.serverko;
    }

}


function Settings(qapp)
{
	this.qapp = qapp;
    this.open = function ()
	{
	    this.qapp.appendEvent( 2600 , "" ,"");
	    return this.qapp.serverko;
	}
    
	this.save = function ()
	{
	    this.qapp.appendEvent( 2601 , "" ,"");
	    return this.qapp.serverko;
	}

	this.writeInt = function (name, value)
	{
	    this.qapp.appendEvent( 2610 , name ,value);
	    return this.qapp.serverko;
	}

	
	this.writeString = function (name, value)
	{
	    this.qapp.appendEvent( 2611 , name ,value);
	    return this.qapp.serverko;
	}

	this.loadInt = function (name, value)
	{
	    this.qapp.appendEvent( 2620 , name , value );
	    return this.qapp.serverko;
	}
	
	this.loadString = function (name, value)
	{
	    this.qapp.appendEvent( 2621 , name ,value);
	    return this.qapp.serverko;
	}

	this.loadArray = function (name, value)
	{
	    this.qapp.appendEvent( 2622 , name ,value);
	    return this.qapp.serverko;
	}

}




function Client(qapp)
{
	this.qapp = qapp;
    
    this.allevals = function ( delay, script)
    {
        this.qapp.appendEvent( 101 , delay , script);
        return this.qapp.serverko;
    }

    this.evals = function (userID , delay, script)
    {
        this.qapp.clientAppendEvent( userID, 101 , delay , script);
        return this.qapp.serverko;
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
        this.qapp.evals(delay,"Q.env.set_('touch','on');");        

    }
    
    this.touchonoff_ = function (delay)
    {
        if (delay == undefined)
            delay = 1000;
        
        this.qapp.env.set_('touch','off');
        this.qapp.evals_(delay,"Q.env.set_('touch','on');");        

    } 
    
    this.indexOf = function(ar,v,n){
  	  n = (n==null)?0:n; var m = ar.length;
  	  for(var i = n; i < m; i++)
  	    if(ar[i] == v)
  	       return i;
  	  return -1;
      }    
      
      this.arrayRemove = function(array,element)
      {
          for(var i=0; i<array.length;i++ )
          { 
              if(array[i]==element)
              {
                  array.splice(i,1); 
              }
          } 
      }    
      
    this.tob64 = function(data)
    {
    	var str ="#64#" + Base64.encode(data);
    	//console.log ("b64 =   " + str);
    	return str;
    }
    
}

function Anim(qapp)
{
	this.qapp = qapp;
	this.move = function( name, path, type, callback)
	{
		this.qapp.appendEvent( 4200 , name ,path,type,callback);
		return this.qapp.serverko;
	}
	

	this.rotate = function( name, path, type, callback)
	{
		this.qapp.appendEvent( 4210 , name ,path,type,callback);
		return this.qapp.serverko;
	}
	


	this.object = function(id,name,delay,coords)
	{
		this.qapp.appendEvent3( 4300 , id , name ,delay,coords);
		return this.qapp.serverko;
	}
	
}


function WorldObject()
{
	this.name = undefined;
	this.template = undefined;
	this.location = undefined;
	this.bounds = undefined;
	this.texture = undefined;
	this.state = undefined;
}

function Objects(qapp)
{
	this.qapp = qapp;
	this.create = function ( name ,value)
	{
		this.qapp.appendEvent( 4100 , name ,value);
		return this.qapp.serverko;
	}

	
	this.place = function (name,value)
	{
		this.qapp.appendEvent( 4110 , name ,value);
		return this.qapp.serverko;
	}

	
	this.remove = function (name,value)
	{
		this.qapp.appendEvent( 4150 , name ,value);
		return this.qapp.serverko;
	}


	this.scale = function (name,value)
	{
		this.qapp.appendEvent( 4120 , name ,value);
		return this.qapp.serverko;
	}

	this.rotate = function (name,value)
	{
		this.qapp.appendEvent( 4160 , name ,value);
		return this.qapp.serverko;
	}

	this.texture = function (name,value)
	{
		this.qapp.appendEvent( 4130 , name ,value);
		return this.qapp.serverko;
	}

	
	this.state = function (name,value)
	{
		this.qapp.appendEvent( 4140 , name ,value);
		return this.qapp.serverko;
	}

	
    this.createObjects = function(objs, send)
    {
        // send cached layout info
        var a;
        
        if (send == 1)
        	this.qapp.serverko.startData();

        this.qapp.serverko.reserveSpace();
        this.qapp.serverko.startTag();
        this.qapp.serverko.appendTag( "res", "objs");
        this.qapp.serverko.addSeparator()      
        this.qapp.serverko.startTags("object");
        
        for (a=0; a< objs.length; a++)
        {
            if ( a> 0)
            {
                this.qapp.serverko.addSeparator();
            }
            this.qapp.serverko.startTag();
            if (objs[a].name != undefined)
            {            
            	this.qapp.serverko.appendTag( "name", objs[a].name);
            }

            if (objs[a].template != undefined)
            {
            	this.qapp.serverko.addSeparator();           
            	this.qapp.serverko.appendTag( "template", objs[a].template);
            }
            
            if (objs[a].location != undefined)
            {
            	this.qapp.serverko.addSeparator();           
            	this.qapp.serverko.appendTag( "location", objs[a].location);
            }
            if (objs[a].bounds != undefined)
            {
            	this.qapp.serverko.addSeparator();           
            	this.qapp.serverko.appendTag( "bounds", objs[a].bounds);
            }
            if (objs[a].texture != undefined)
            {
            	this.qapp.serverko.addSeparator();           
            	this.qapp.serverko.appendTag( "texture", objs[a].texture);
            }
            if (objs[a].state != undefined)
            {
            	this.qapp.serverko.addSeparator();           
            	this.qapp.serverko.appendTag( "state", objs[a].state);
            }            
            
            this.qapp.serverko.endTag( "object");    /// TODO without param        
        }    
        this.qapp.serverko.endTags( "object");    /// TODO without param
        this.qapp.serverko.endTag();    

        if (send == 1)
        	this.qapp.serverko.sendData();       
        
    }

    this.add = function (objs)
    {
        this.createObjects(objs , 0);
        return this.qapp.serverko;
    }

    
}

function AnimFrame()
{
	this.rotate = undefined;
	this.scale = undefined;
	this.translate = undefined;
	
	this.rotate2 = undefined;
	this.scale2 = undefined;
	this.translate2 = undefined;
	
	this.offset = undefined;
	this.operation = undefined;
	
}




function AnimType()
{
	this.id = undefined;
	this.frames = new Array();
	this.delay = undefined;
	this.repeat = undefined;
}


function Animations(qapp)
{
	this.qapp = qapp;
    
    this.add = function (adata)
    {
        this.createAnim(adata , 0);
        return this.qapp.serverko;
    }
  
    this.createAnim = function(adata, send)
    {
        
        // send cached layout info
        var a;
        
        //print("JS:layout_createLayout " + type + " " + areas.length);  
        
        if (send == 1)
        	this.qapp.serverko.startData();

        this.qapp.serverko.reserveSpace();
        this.qapp.serverko.startTag();
        this.qapp.serverko.appendTag( "res", "animation");
        this.qapp.serverko.addSeparator()  
        this.qapp.serverko.appendTag( "id", adata.id );
        if (adata.delay != undefined)
        {
        	this.qapp.serverko.addSeparator()      
        	this.qapp.serverko.appendTag( "delay", adata.delay );
        }
        if (adata.repeat != undefined)
        {        
        	this.qapp.serverko.addSeparator()      
        	this.qapp.serverko.appendTag( "repeat", adata.repeat );
        }
        
        this.qapp.serverko.addSeparator()      
        
        this.qapp.serverko.startTags("frames");
        
        for (a=0; a< adata.frames.length; a++)
        {
            
            // add properties
            if (adata.frames[a].id == "") continue;
            
            if ( a> 0)
            {
                this.qapp.serverko.addSeparator();
            }
            this.qapp.serverko.startTag();
            this.qapp.serverko.appendTag( "id", adata.frames[a].id);

            if (adata.frames[a].rotate != undefined)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "rotate", adata.frames[a].rotate);
            }
            if (adata.frames[a].scale != undefined)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "scale", adata.frames[a].scale);
            }
            if (adata.frames[a].translate != undefined)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "translate", adata.frames[a].translate);
            }
            
            if (adata.frames[a].rotate2 != undefined)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "rotate2", adata.frames[a].rotate2);
            }
            if (adata.frames[a].scale2 != undefined)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "scale2", adata.frames[a].scale2);
            }
            if (adata.frames[a].translate2 != undefined)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "translate2", adata.frames[a].translate2);
            }
            
            if (adata.frames[a].operation != undefined)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "operation", adata.frames[a].operation);
            }
            
            
            this.qapp.serverko.endTag();        
        }    
        this.qapp.serverko.endTags( "frames");    
        this.qapp.serverko.endTag();    

        if (send == 1)
        	this.qapp.serverko.sendData();
    }
        
}

function Scores(qapp)
{
    this.login = function(callback)
    {
        serverko.appendEvent(500, ""  ,callback);
        return this.qapp.serverko;
    }

    this.submit = function(value, callback)
    {
        serverko.appendEvent(510 , value , callback);
        return this.qapp.serverko;
    }

    this.showscores = function(value , callback)
    {
        serverko.appendEvent(520 , value , callback);
        return this.qapp.serverko;
    }

    this.reload = function(value , callback)
    {
        serverko.appendEvent(521 , value , callback);
        return this.qapp.serverko;
    }

    
}
function QApp()
{

    this.evals = function ( delay, script)   
    {
        this.appendEvent( 101 , delay , script );
        return this.serverko;
    }
    


    this.goUrl = function (type, url)
    {
        this.appendEvent( 1200 , type, url );
        return this.serverko;
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
    this.animations = new Animations(this);
    this.scores = new Scores(this);
    
    this.startUpdate = function()
    {
    	this.serverko.startData();
    }
    this.sendUpdate = function() 
    {
    	this.serverko.sendData();
    }
    this.clientStartUpdate = function(userID)
    {
    	this.serverko.clientStartData(userID);
    }
    this.clientSendUpdate = function(userID) 
    {
    	this.serverko.clientSendData(userID);
    }

    this.appendEvent = function(id, area, data, data2, data3, data4)
    {
    	this.serverko.appendEvent(id, area, data, data2, data3, data4);
    }
    this.clientAppendEvent = function (userID , id, area, data, data2, data3, data4)
    {
    	this.serverko.clientAppendEvent(userID , id, area, data, data2, data3, data4);
    }

    
    this.println = function (data)
    {
    	this.layout.print(data);
    	return this.serverko;
    }
    
    this.event = function (id, delay, data) 
    {
    	this.serverko.sendEvent(id, delay, data) ;
    	return this.serverko;
    }

    
    this.include = function (id)
    {
    	this.serverko.loadModule(id);
    	return this.serverko;
    }
   
    this.load = function (id)
    {
    	this.serverko.loadModule2(id);
    	return this.serverko;
    }
    

    
}

var Q = new QApp();
console.log(" q ok");

var sysareas = new Array();

areaStdOut = new LayoutArea();
areaStdOut.type = "table.list";
areaStdOut.id = "stdout";
areaStdOut.location="0,0,2,2";
areaStdOut.size = "20,10,1";
areaStdOut.display = "hud";
sysareas.push(areaStdOut);
Q.layout.add("*", sysareas).now();


// create animations
var frame = new AnimFrame();
frame.translate2 = "0,0,0";
var anim = new AnimType();
anim.id = "move";
anim.frames.push(frame);
Q.animations.add(anim).now();

var frame = new AnimFrame();
frame.rotate = "0,0,0";
var anim = new AnimType();
anim.id = "rotate";
anim.frames.push(frame);
Q.animations.add(anim).now();

var frame1 = new AnimFrame();
frame1.scale = "0.001,0.001,0.001";
var frame2 = new AnimFrame();
frame2.scale = "1.0,1.0,1.0";
var anim = new AnimType();
anim.id = "spawn";
anim.frames.push(frame1);
anim.frames.push(frame2);
Q.animations.add(anim).now();

var frame1 = new AnimFrame();
frame1.scale = "1.0,1.0,1.0";
var frame2 = new AnimFrame();
frame2.scale = "1000.0,1000.0,1000.0";
var anim = new AnimType();
anim.id = "away";
anim.frames.push(frame1);
anim.frames.push(frame2);
Q.animations.add(anim).now();



var frame = new AnimFrame();
frame.translate = "0,0,0";
frame.rotate = "0,0,0";
frame.scale = "0,0,0";
frame.translate2 = "0,0,0";
frame.rotate2 = "0,0,0";
frame.scale2 = "0,0,0";
var anim = new AnimType();
anim.id = "transform";
anim.frames.push(frame);
Q.animations.add(anim).now();

var anim = new AnimType();
anim.id = "walk";
anim.frames.push(frame);
Q.animations.add(anim).now();


var frame1 = new AnimFrame();
frame1.scale = "1.0,1.0,1.0";
var frame2 = new AnimFrame();
frame2.scale = "1000.0,1000.0,1000.0";
frame2.scale = "0.0,100.0,0.0";
var anim = new AnimType();
anim.frames.push(frame1);
anim.frames.push(frame2);
Q.animations.add(anim).now();


var anim = new AnimType();
anim.id = "walkhigh";
var div = 3.14/5;
for (var a=0; a< 6;a++)
{
	var frame = new AnimFrame();
	frame.translate2 = "0,0,"+(0.5*Math.sin(a*div));
	frame.operation = "pdist";
	anim.frames.push(frame);
}
Q.animations.add(anim).now();


 
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}


