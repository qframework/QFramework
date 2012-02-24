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


function LayoutArea()
{
    this.type = undefined; 
    this.id = undefined; 
    this.layout = undefined; 
    this.state = undefined;
    this.bounds = undefined;
    this.size = undefined;
    this.display = undefined;
    this.items = undefined;
    this.text = undefined;
    this.location = undefined;
    this.rotation = undefined;
    this.scale = undefined;
    this.onclick = undefined;
    this.onfocuslost = undefined;
    this.onfocusgain = undefined;    
    this.items = undefined;
    this.fields = undefined;
    this.foreground = undefined;
    this.background = undefined;
    this.border = undefined;
    this.colors = undefined;
    this.scrollers = undefined;
}
        

function Layout(qapp)
{
	this.qapp = qapp;
    this.pageid = "";
    this.canvasw = 0;
    this.canvash = 0;    
    this.worldxmin = 0;
    this.worldxmax = 0;    
    this.worldymin = 0;
    this.worldymax = 0;
    this.hudxmin = 0;
    this.hudxmax = 0;    
    this.hudymin = 0;
    this.hudymax = 0;
    
	this.areacount = 0;
	
    this.createLayout = function(type, areas, send)
    {
        
        // send cached layout info
        var a;
        
        //print("JS:layout_createLayout " + type + " " + areas.length);  
        
        if (send == 1)
        	this.qapp.serverko.startData();

        this.qapp.serverko.reserveSpace();
        this.qapp.serverko.startTag();
        this.qapp.serverko.appendTag( "res", "layout");
        this.qapp.serverko.addSeparator()  
        this.qapp.serverko.appendTag( "pageid", type );
        this.qapp.serverko.addSeparator()      
        this.qapp.serverko.startTags("area");
        
        for (a=0; a< areas.length; a++)
        {
            
            // add properties
            if (areas[a].type == "") continue;
            //if (areas[a].id == "") return;
            
            if ( a> 0)
            {
                this.qapp.serverko.addSeparator();
            }
            this.qapp.serverko.startTag();
            this.qapp.serverko.appendTag( "type", areas[a].type);

            this.qapp.serverko.addSeparator();
			if (areas[a].id == "" || areas[a].id == undefined)
			{
				areas[a].id = "temparea" + this.areacount;
				this.areacount++;
			}
            this.qapp.serverko.appendTag( "id", areas[a].id);
            
            if (areas[a].layout != undefined)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "layout", areas[a].layout);
            }
            if (areas[a].state != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "state", areas[a].state);
            }
            if (areas[a].bounds != undefined)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "bounds", areas[a].bounds);
            }
            if (areas[a].size != undefined)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "size", areas[a].size);
            }
            if (areas[a].display != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "display", areas[a].display);
            }
            if (areas[a].items != undefined)
            {
                this.qapp.serverko.addSeparator();            
                this.qapp.serverko.appendTag( "items", areas[a].items);            
            }
            if (areas[a].text != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "text", areas[a].text);
            }
            if (areas[a].location != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "location", areas[a].location);
            }
            if (areas[a].onclick != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "onclick", areas[a].onclick);
            }
            if (areas[a].onfocuslost != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "onfocuslost", areas[a].onfocuslost);
            }
            if (areas[a].onfocusgain != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "onfocusgain", areas[a].onfocusgain);
            }        
            if (areas[a].foreground != undefined)
            {
                this.qapp.serverko.addSeparator();            
                this.qapp.serverko.appendTag( "foreground", areas[a].foreground);
            }
            if (areas[a].background != undefined)
            {
                this.qapp.serverko.addSeparator();            
                this.qapp.serverko.appendTag( "background", areas[a].background);
            }
            if (areas[a].border != undefined)
            {
                this.qapp.serverko.addSeparator();            
                this.qapp.serverko.appendTag( "border", areas[a].border);
            }        
            if (areas[a].fields != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "fields", areas[a].fields);                                                            
            }
            if (areas[a].colors != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "colors", areas[a].colors);                                                            
            }        
            if (areas[a].translation != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "translation", areas[a].translation);                                                            
            }
            if (areas[a].rotation != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "rotation", areas[a].rotation);                                                            
            }
            if (areas[a].scale != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "scale", areas[a].scale);                                                            
            }            

            if (areas[a].scrollers != undefined)
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "scrollers", areas[a].scrollers);                                                            
            }      
            
            this.qapp.serverko.endTag( "area");    /// TODO without param        
        }    
        this.qapp.serverko.endTags( "area");    /// TODO without param
        this.qapp.serverko.endTag();    

        if (send == 1)
        	this.qapp.serverko.sendData(type);       
    }
    
    this.println = function ( message)
    {
        this.qapp.serverko.appendEvent_(3180 , "stdout" , message ); //text
        return this.qapp.serverko;
    }

	//2000
	this.scriptEnd = function ()
	{
	    this.qapp.serverko.appendEvent( 2000 , "" , "" );
	    return this.qapp.serverko;
	}
//------------------------------
	//3001 - delete area
	this.areaDelete = function ( area)
	{
		this.qapp.serverko.appendEvent( 3001 , area , "" );
		return this.qapp.serverko;		
	}
	
//------------------------------
	this.areaClear = function (  area)
	{
		this.qapp.serverko.appendEvent( 3002 , area , "" );
		return this.qapp.serverko;
	}

//------------------------------	
	this.areaClearItems = function (  area)
	{
		this.qapp.serverko.appendEvent( 3004 , area , "" );
		return this.qapp.serverko;
	}

//------------------------------
	this.itemPlace = function ( item, itemid, areaTo, indexTo, userData)   // 3050
	{
	    this.qapp.serverko.appendEvent( 3050 , item +"." +itemid +"|"+userData, areaTo + "," + indexTo);
	    return this.qapp.serverko;
	}
	
//------------------------------
	this.itemMove               = function ( areaFrom, indexFrom, areaTo, indexTo)   // 3051
	{
	    this.qapp.serverko.appendEvent( 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo);
	}
	
	this.clientItemMove         = function ( userID, areaFrom, indexFrom, areaTo, indexTo)   // 3051
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo );
	}
	
	this.itemMove_               = function ( areaFrom, indexFrom, areaTo, indexTo)   // 3051
	{
	    this.qapp.serverko.appendEvent_( 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo);
	}
	
	this.clientItemMove_         = function ( userID, areaFrom, indexFrom, areaTo, indexTo)   // 3051
	{
	    this.qapp.serverko.clientAppendEvent_( userID, 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo );
	}
	
//------------------------------ 
	this.itemRemove               = function ( areaFrom, indexFrom)
	{
	    this.qapp.serverko.appendEvent( 3052 , areaFrom, indexFrom);
	    return this.qapp.serverko;
	}

//------------------------------
	this.itemMoveA               = function ( areaFrom, indexFrom, areaTo, indexTo, type, delay, path)   // 3053
	{
	    this.qapp.serverko.appendEvent( 3053 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo + "," + type + "," + delay + "," + path);
	    return this.qapp.serverko;
	}
	
//------------------------------ 
	this.itemsAnim               = function (areaId, type, delay)
	{
	    this.qapp.serverko.appendEvent( 3054 , areaId , type + "," + delay );
	    return this.qapp.serverko;
	}

//------------------------------
	this.itemAnim               = function (areaId, index , type, delay)
	{
	    this.qapp.serverko.appendEvent( 3055 , areaId , index + "|" + type + "," + delay );
	    return this.qapp.serverko;
	}
	
//------------------------------
	this.areaSetState = function ( area, state)   // 3110
	{
	    this.qapp.serverko.appendEvent( 3110 , area , state);
	    return this.qapp.serverko;
	}

//------------------------------
	
	this.areaSetBounds = function ( area, bounds)   // 3120
	{
	    this.qapp.serverko.appendEvent( 3120 , area , bounds  );
	    return this.qapp.serverko;
	}
	
//------------------------------
	this.areaSetText = function ( area, text)   
	{
	    this.qapp.serverko.appendEvent( 3180 , area , text );
	    return this.qapp.serverko;
	}
	
//------------------------------
	this.areaSetLocation = function ( area , loc)
	{
		this.qapp.serverko.appendEvent( 3190 , area , loc );
		return this.qapp.serverko;
	}

//------------------------------
	this.areaSetScale = function ( area, loc)   
	{
	    this.qapp.serverko.appendEvent( 3191 , area , loc );
	    return this.qapp.serverko;
	}
	
//------------------------------
	this.areaSetItemScale = function ( area, index, loc)   // 3190
	{
	    this.qapp.serverko.appendEvent( 3192 , area , index + ","+ loc );
	    return this.qapp.serverko;
	}
	
//------------------------------
	this.areaSetRotation = function ( area, loc)   
	{
	    this.qapp.serverko.appendEvent( 3195 , area , loc );
	    return this.qapp.serverko;
	}
	
//------------------------------
	
	this.areaSetItemScale = function ( area, index, loc)   
	{
	    this.qapp.serverko.appendEvent( 3192 , area , index + ","+ loc );
	    return this.qapp.serverko;
	}
	
//------------------------------
	this.areaSetOnclick = function ( area, data)   // 3200
	{
	    this.qapp.serverko.appendEvent( 3200 , area , data );
	    return this.qapp.serverko;
	}
	
//------------------------------
	this.areaSetOnFocusGain = function ( area, data)   // 3200
	{
	    this.qapp.serverko.appendEvent( 3201 , area , data );
	    return this.qapp.serverko;
	}
	
//------------------------------
	
	this.areaSetOnFocusLost = function ( area, data)   // 3200
	{
	    this.qapp.serverko.appendEvent( 3202 , area , data );
	    return this.qapp.serverko;
	}
	
	
//------------------------------
	
	this.areaSetItems           = function ( area, items)   // 3220
	{
	    this.qapp.serverko.appendEvent( 3220 , area , items );
	    return this.qapp.serverko;
	}
	
	//------------------------------
	this.areaAnim = function ( area, type , delay , data )   
	{
	    this.qapp.serverko.appendEvent( 3210 , area , type , delay , data );
	    return this.qapp.serverko;
	}
	
	

//------------------------------
	
	this.areaSetItem            = function ( area, field, item)   // 3222
	{
	    this.qapp.serverko.appendEvent( 3222 , area , field+","+item );
	    return this.qapp.serverko;
	}

//------------------------------
	this.areaInvertItem            = function ( area, field)   // 3223
	{
	    this.qapp.serverko.appendEvent( 3223 , area , field );
	    return this.qapp.serverko;
	}

	this.areaSetItemB            = function ( area, field, item) 
	{
	    this.qapp.serverko.appendEvent( 3224 , area , field+","+item );
	    return this.qapp.serverko;
	}

	//------------------------------	
    this.areaSetBackground = function ( area, text)   // 3250
	{
	    this.qapp.serverko.appendEvent( 3250 , area , text );
	    return this.qapp.serverko;
	}
	//3270 - fields
//------------------------------	
	this.areaSetFields = function ( area, fields)   // 3270
	{
	    this.qapp.serverko.appendEvent( 3270 , area , fields  );
	    return this.qapp.serverko;
	}
	
//------------------------------	
    this.updateBack = function (area, time , newback, oldback)
    {
        //print( " update back " + area + time + newback +oldback);
        
    	this.areaSetBackground(area, newback);
    	
    	var data = 	"Q.startUpdate();Q.layout.areaSetBackground(";
    	data += "'" + area +"'" +  "," + "'" + oldback +"'" ;
    	data += ");Q.sendUpdate();"
    	this.qapp.evals_( time , data);
    }

    this.updateBack_ = function (area, time , newback, oldback)
    {
        //print( " update back " + area + time + newback +oldback);
        
    	this.startUpdate();
    	this.areaSetBackground(area, newback);
    	this.sendUpdate();
    	
    	var data = 	"Q.startUpdate();Q.layout.areaSetBackground(";
    	data += "'" + area +"'" +  "," + "'" + oldback +"'" ;
    	data += ");Q.sendUpdate();"
    	this.qapp.evals_( time , data);
    }
    
//------------------------------    
    this.add = function (type,areas)
    {
        this.createLayout(type,areas , 0);
        return this.qapp.serverko;
    }

//------------------------------    
    this.show = function (pageid)
    {
        this.qapp.serverko.appendEvent( 2010 , pageid , "" );
        return this.qapp.serverko;
    }
//------------------------------    
    this.showAnim = function (pageid, anim)
    {
        this.qapp.serverko.appendEvent( 2011 , pageid , anim );
        return this.qapp.serverko;
    }

//------------------------------
    this.popup = function (pageid)
    {
        this.qapp.serverko.appendEvent( 2012 , pageid , "" );
        return this.qapp.serverko;
    }

    this.popupAnim = function (pageid, anim)
    {
        this.qapp.serverko.appendEvent( 2013 , pageid , anim );
        return this.qapp.serverko;
    }
    
  //------------------------------    
    this.clear = function (pageid)
    {
        this.qapp.serverko.appendEvent( 2015 , pageid , "" );
        return this.qapp.serverko;
    }
	
//------------------------------    
    this.hide = function (pageid)
    {
        this.qapp.serverko.appendEvent( 2020 , pageid , "" );
        return this.qapp.serverko;
    }

    this.hideAnim = function (pageid, anim)
    {
        this.qapp.serverko.appendEvent( 2021 , pageid , anim );
        return this.qapp.serverko;
    }

    
//------------------------------    
    
    this.editText = function (deftext, onreturn)
    {
        this.qapp.serverko.appendEvent( 1002 , deftext , onreturn );
        return this.qapp.serverko;
    }
    
//------------------------------    
    this.anim = function (type, data)
    {
        this.qapp.serverko.appendEvent( 2030 , type , data );
        return this.qapp.serverko;
    }
    
  //------------------------------    

    
    this.startUpdate = function()
    {
    	this.qapp.startUpdate();
    }
    
    this.sendUpdate = function()
    {
    	this.qapp.sendUpdate();
    }   
      

  //------------------------------
	this.areaSetScrollers = function ( area, loc)   
	{
	    this.qapp.serverko.appendEvent( 3400 , area , loc );
	    return this.qapp.serverko;
	}
	
	
//------------------------------
	this.areaPushItemFront = function ( area, item)   
	{
	    this.qapp.serverko.appendEvent( 3225,  area , item );
	    return this.qapp.serverko;
	}


//------------------------------
}

//print("JS:layout_handler start "  );  

	


//create figures

function Textures(qapp)
{
	this.qapp = qapp;
	this.newFromFile = function (name, file)
	{
		this.qapp.serverko.appendEvent( 4000 , name, file);
		return this.qapp.serverko;
	}
	this.remove = function (name)
	{
		this.qapp.serverko.appendEvent( 4001 , name);
		return this.qapp.serverko;
	}
	
    this.createTextures = function(textures, send)
    {
        
        // send cached layout info
        var a;
        
        if (send == 1)
        	this.qapp.serverko.startData();

        this.qapp.serverko.reserveSpace();
        this.qapp.serverko.startTag();
        this.qapp.serverko.appendTag( "res", "texts");
        this.qapp.serverko.addSeparator()      
        this.qapp.serverko.startTags("texture");
        
        for (a=0; a< textures.length; a++)
        {
            if ( a> 0)
            {
                this.qapp.serverko.addSeparator();
            }
            this.qapp.serverko.startTag();
            if (textures[a].name != undefined)
            {            
            	this.qapp.serverko.appendTag( "name", textures[a].name);
            }

            if (textures[a].file != undefined)
            {
            	this.qapp.serverko.addSeparator();           
            	this.qapp.serverko.appendTag( "file", textures[a].file);
            }
            
            this.qapp.serverko.endTag( "texture");    /// TODO without param        
        }    
        this.qapp.serverko.endTags( "texture");    /// TODO without param
        this.qapp.serverko.endTag();    

        if (send == 1)
        	this.qapp.serverko.sendData();       
        
    }

    this.add = function (texts)
    {
        this.createTextures(texts , 0);
        return this.qapp.serverko;
    }

    
}

function Texture()
{
	this.name = undefined;
	this.file = undefined;
	
}


function Sounds(qapp)
{
	this.qapp = qapp;
	this.newFromFile = function (name, file)
	{
		this.qapp.serverko.appendEvent( 5000 , name, file);
		return this.qapp.serverko;
	}

    this.play =  function (sound)
    {
    	this.qapp.serverko.appendEvent( 5010 , "play", sound );
    	return this.qapp.serverko;
    }


    this.volume = function (value)
    {
    	this.qapp.serverko.appendEvent( 5011 , value, "" );
    	return this.qapp.serverko;
    }


    this.mute = function (val)
    {
    	this.qapp.serverko.appendEvent( 5012 , "mute", val );
    	return this.qapp.serverko;
    }



}

function Model()
{
	this.name = undefined;
	this.template = undefined;
	this.texture = undefined;
	this.submodels = undefined;
	
}

function Models(qapp)
{
	this.qapp = qapp;
	
	this.newFromTemplate = function (name , template)
	{
		this.qapp.serverko.appendEvent( 6001 , name, template);
		return this.qapp.serverko;
	}
	this.setTexture = function (name, texture, offset)
	{
		this.qapp.serverko.appendEvent( 6002 , name, texture + ";" + offset);
		return this.qapp.serverko;
	}
	
	this.create = function (name)
	{
		this.qapp.serverko.appendEvent( 6003 , name, "");
		return this.qapp.serverko;
	}

	this.setSubmodels = function (name, count)
	{
		this.qapp.serverko.appendEvent( 6004 , name, count);
		return this.qapp.serverko;
	}

	
    this.createModels = function(objs, send)
    {
        // send cached layout info
        var a;
        
        if (send == 1)
        	this.qapp.serverko.startData();

        this.qapp.serverko.reserveSpace();
        this.qapp.serverko.startTag();
        this.qapp.serverko.appendTag( "res", "models");
        this.qapp.serverko.addSeparator()      
        this.qapp.serverko.startTags("model");
        
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
            
            if (objs[a].texture != undefined)
            {
            	this.qapp.serverko.addSeparator();           
            	this.qapp.serverko.appendTag( "texture", objs[a].texture);
            }
            if (objs[a].submodels != undefined)
            {
            	this.qapp.serverko.addSeparator();           
            	this.qapp.serverko.appendTag( "submodels", objs[a].submodels);
            }            
            
            this.qapp.serverko.endTag( "model");    /// TODO without param        
        }    
        this.qapp.serverko.endTags( "model");    /// TODO without param
        this.qapp.serverko.endTag();    

        if (send == 1)
        	this.qapp.serverko.sendData();       
        
    }

    this.add = function (objs)
    {
        this.createModels(objs , 0);
        return this.qapp.serverko;
    }

    
}

function PadDigits2(n, totalDigits, str)
{
    n = n.toString(); 
    if (n.length > totalDigits)
    {
        n = n.slice( 0, totalDigits);
    }
    var pd = ''; 
    var pd2 = '';     
    if (totalDigits > n.length) 
    { 
        for (i=0; i < (totalDigits-n.length)/2; i++) 
        { 
            pd += str; 
            pd2 += str;             
        } 
    } 
    return pd + n.toString() + pd2; 
    
}


function PadDigits(n, totalDigits) 
{ 
    n = n.toString(); 
    if (n.length > totalDigits)
    {
        n = n.slice( 0, totalDigits);
    }
    var pd = ''; 
    if (totalDigits > n.length) 
    { 
        for (i=0; i < (totalDigits-n.length); i++) 
        { 
            pd += '0'; 
        } 
    } 
    return pd + n.toString(); 
} 
function PadStringC(n, totalDigits, str) 
{ 
    n = n.toString(); 
    var pd = ''; 
    var pd2 = '';     
    if (totalDigits > n.length) 
    { 
        for (i=0; i < (totalDigits-n.length); i++) 
        { 
            if (i%2 == 0)
            {
                pd += str; 
            }else
            {
                pd2 += str; 
                
            }
        } 
    } 
    return pd + n.toString() + pd2; 
} 

function PadString(n, totalDigits,str) 
{ 
    n = n.toString(); 
    if (n.length > totalDigits)
    {
        n = n.slice( 0, totalDigits);
    }    
    var pd = n; 
    if (totalDigits > n.length) 
    { 
        for (i=0; i < (totalDigits-n.length); i++) 
        { 
            pd += str; 
        } 
    } 
    return pd; 
} 
