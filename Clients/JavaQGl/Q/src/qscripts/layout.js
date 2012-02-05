function LayoutArea()
{
    this.type = ""; 
    this.id = ""; 
    this.layout = ""; // layout type - hor, vert, grid, ...
    this.state = "";
    this.owner = -111111;
    this.opacity = "";
    this.size = -111111;
    this.display = "";
    this.data = "";
    this.items = "";
    this.text = "";
    this.location = "";
    this.onclick = "";
    this.onfocuslost = "";
    this.onfocusgain = "";    
    this.effect = "";
    this.items = "";
    this.font =  "";
    this.fields = "";
    this.foreground =  "";
    this.background =  "";
    this.border =  "";
    this.colors =  "";
    
    //this.
}
        

function layout_createLayout2(type, areas, send)
{
    
    // send cached layout info
    var a;
    
    //print("JS:layout_createLayout " + type + " " + areas.length);  
    
    serverko.startData();

    serverko.startTag();
    
    serverko.appendTag( "res", "layout");
    serverko.addSeparator()  
    serverko.appendTag( "canvas", layout.canvas);
    serverko.addSeparator()  
    serverko.appendTag( "orientation", layout.orientation);    
    serverko.addSeparator()  
    serverko.appendTag( "background", layout.background );
    serverko.addSeparator()  
    serverko.appendTag( "pageid", type );
    serverko.addSeparator()      
    serverko.startTags("area");
    
    for (a=0; a< areas.length; a++)
    {
        
        // add properties
        if (areas[a].type == "") return;
        if (areas[a].id == "") return;
        
        if ( a> 0)
        {
            serverko.addSeparator();
        }
        serverko.startTag();
        serverko.appendTag( "type", areas[a].type);

        serverko.addSeparator();
        serverko.appendTag( "id", areas[a].id);
        
        if (areas[a].layout != "")
        {
            serverko.addSeparator();
            serverko.appendTag( "layout", areas[a].layout);
        }
        if (areas[a].state != "")
        {
            serverko.addSeparator();           
            serverko.appendTag( "state", areas[a].state);
        }
        if (areas[a].owner != -111111)
        {
            serverko.addSeparator();
            serverko.appendTag( "owner", areas[a].owner);
        }
        if (areas[a].size != -111111)
        {
            serverko.addSeparator();
            serverko.appendTag( "size", areas[a].size);
        }
        if (areas[a].display != "")
        {
            serverko.addSeparator();           
            serverko.appendTag( "display", areas[a].display);
        }
        if (areas[a].data != "")
        {
            serverko.addSeparator();           
            serverko.appendTag( "data", areas[a].data);
        }
        if (areas[a].items != "")
        {
            serverko.addSeparator();            
            serverko.appendTag( "items", areas[a].items);            
        }
        if (areas[a].text != "")
        {
            serverko.addSeparator();           
            serverko.appendTag( "text", areas[a].text);
        }
        if (areas[a].location != "")
        {
            serverko.addSeparator();           
            serverko.appendTag( "location", areas[a].location);
        }
        if (areas[a].onclick != "")
        {
            serverko.addSeparator();           
            serverko.appendTag( "onclick", areas[a].onclick);
        }
        if (areas[a].onfocuslost != "")
        {
            serverko.addSeparator();           
            serverko.appendTag( "onfocuslost", areas[a].onfocuslost);
        }
        if (areas[a].onfocusgain != "")
        {
            serverko.addSeparator();           
            serverko.appendTag( "onfocusgain", areas[a].onfocusgain);
        }        
        if (areas[a].font != "")
        {
            serverko.addSeparator();            
            serverko.appendTag( "font", areas[a].font);
        }
        if (areas[a].foreground != "")
        {
            serverko.addSeparator();            
            serverko.appendTag( "foreground", areas[a].foreground);
        }
        if (areas[a].background != "")
        {
            serverko.addSeparator();            
            serverko.appendTag( "background", areas[a].background);
        }
        if (areas[a].border != "")
        {
            serverko.addSeparator();            
            serverko.appendTag( "border", areas[a].border);
        }        
        if (areas[a].fields != "")
        {
            serverko.addSeparator();           
            serverko.appendTag( "fields", areas[a].fields);                                                            
        }
        if (areas[a].colors != "")
        {
            serverko.addSeparator();           
            serverko.appendTag( "colors", areas[a].colors);                                                            
        }        
        
        serverko.endTag( "area");    /// TODO without param        
    }    
    serverko.endTags( "area");    /// TODO without param
    serverko.endTag();    

    
    // TODO request caching ? 
    //if (send == 1)
    {
        serverko.sendData(type);       
    }
    //else
    //{
     //   serverko.storeLayout(type);    
    //}
}

function layout_define(type, areas)
{
	print("JS:layout_define " + type + " " +  areas);  
    areas.push(layout.areaStdOut);
	if (type == "")
	{
		type = "*";
	}
	layout.areas[type] = areas;	
    layout_createLayout2(type,areas,1);
 
}


///

function layout_startUpdate()
{
    serverko.startData();

}

function layout_sendUpdate()
{
    serverko.sendData();
}

function layout_clientStartUpdate(userID)
{
    serverko.clientStartData(userID);

}

function layout_clientSendUpdate(userID)
{
    serverko.clientSendData(userID);
}


//


function Layout()
{
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
    
    
    this.areas = new Array();
    
    this.println = function ( message)
    {
        serverko.startData();
        serverko.appendEvent(3180 , "stdout" , message ); //text
        serverko.sendData();
    }
    this.print_ = function ( message)
    {
        serverko.startData();
        serverko.appendEvent(3180 , "stdout" , message ); //text
        serverko.sendData();
    }    
    
    this.print = function ( message)
    {
        serverko.appendEvent(3180 , "stdout" , message ); //text
    }
    
    this.startUpdate = layout_startUpdate;
    this.sendUpdate = layout_sendUpdate;

	this.clientStartUpdate = layout_clientStartUpdate;
	this.clientSendUpdate = layout_clientSendUpdate;

	//2000
	this.scriptEnd = function ()
	{
	    serverko.appendEvent( 2000 , "" , "" );
	}

	this.areaCreate = function ( area, areaid)
	{
		serverko.appendEvent( 3000 , area , areaid );
	}
	
	this.clientAreaCreate = function ( userID, area, areaid)
	{
		serverko.clientAppendEvent( userID, 3000 , area , areaid );
	}

		
	
	//3001 - delete area
	this.areaDelete = function ( area)
	{
		serverko.appendEvent( 3001 , area , "" );
	}

	this.clientAreaDelete = function ( userID, area)
	{
		serverko.clientAppendEvent( userID, 3001 , area , "" );
	}

	
	//3002 - clear area
	this.areaClear = function (  area)
	{
		serverko.appendEvent( 3002 , area , "" );
	}

	this.clientAreaClear = function ( userID, area)
	{
		serverko.clientAppendEvent( userID, 3002 , area , "" );
	}

	
    //3003
	this.areaSwapID = function (  area, areato)
	{
		serverko.appendEvent( 3003 , area , areato );
	}

	this.clientAreaSwapID = function ( userID, area, areato)
	{
		serverko.clientAppendEvent( userID, 3003 , area , areato );
	}


	//3050 - place item 
	this.itemPlace = function ( item, itemid, areaTo, indexTo, userData)   // 3050
	{
	    serverko.appendEvent( 3050 , item +"." +itemid +"|"+userData, areaTo + "," + indexTo);
	}
	
	this.clientItemPlace = function ( userID, item, itemid, areaTo, indexTo, userData)   // 3050
	{
	    serverko.clientAppendEvent( userID, 3050 , item +"." +itemid +"|"+userData, areaTo + "," + indexTo);
	}
		

	//3051 - move figure
	this.itemMove               = function ( areaFrom, indexFrom, areaTo, indexTo)   // 3051
	{
	    serverko.appendEvent( 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo);
	}
	
	this.clientItemMove         = function ( userID, areaFrom, indexFrom, areaTo, indexTo)   // 3051
	{
	    serverko.clientAppendEvent( userID, 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo );
	}
	
	//3052 - remove figure 
	this.itemRemove               = function ( areaFrom, indexFrom)
	{
	    serverko.appendEvent( 3052 , areaFrom, indexFrom);
	}

	this.clientItemRemove         = function ( userID, areaFrom, indexFrom)
	{
	    serverko.clientAppendEvent( userID, 3052 , areaFrom, indexFrom);
	}
	
	//3053 - move figure 
	this.itemMoveA               = function ( areaFrom, indexFrom, areaTo, indexTo, type, delay, path)   // 3053
	{
	    serverko.appendEvent( 3053 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo + "," + type + "," + delay + "," + path);
	}
	
	this.clientItemMoveA         = 	function ( userID ,  areaFrom, indexFrom, areaTo, indexTo, type, delay, path)   // 3053
	{
	    serverko.clientAppendEvent( userID, 3053 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo + "," + type + "," + delay + "," + path);
	}

	//3055 - item anim 
	this.itemsAnim               = function (areaId, type, delay)
	{
	    serverko.appendEvent( 3054 , areaId , type + "," + delay );
	}

	this.itemAnim               = function (areaId, index , type, delay)
	{
	    serverko.appendEvent( 3055 , areaId , index + "|" + type + "," + delay );
	}

    this.clientItemsAnim         = function (userID , areaId, type, delay)
    {
        serverko.clientAppendEvent( userID , 3054 , areaId , type + "," + delay );
    }

	//3100 - layout
	this.areaSetLayout = function ( area, text)   // 3100
	{
	    serverko.appendEvent( 3100 , area , text );
	}

	this.clientAreaSetLayout = function ( userID, area, text)   // 3100
	{
	    serverko.clientAppendEvent( userID, 3100 , area , text );
	}

	//3110 - state
	this.areaSetState = function ( area, state)   // 3110
	{
	    serverko.appendEvent( 3110 , area , state);
	}

	this.areaSetState_ = function ( area, state)   // 3110
	{
	    serverko.startData();
	    serverko.appendEvent( 3110 , area , state);
	    serverko.sendData();
	}
	
	this.clientAreaSetState = function ( userID, area, state)   // 3110
	{
	    serverko.clientAppendEvent( userID, 3110 , area , state);
	}
	
	this.clientAreaSetState_ = function ( userID, area, state)   // 3110
	{
	    serverko.clientStartData(userID);
	    serverko.clientAppendEvent( userID, 3110 , area , state);
	    serverko.clientSendData(userID);
	}

	
	//3120 - owner
	this.areaSetOwner = function ( area, owner)   // 3120
	{
	    serverko.appendEvent( 3120 , area , owner  );
	}
	
	this.clientAreaSetOwner = function ( userID, area, owner)   // 3120
	{
	    serverko.clientAppendEvent( userID, 3120 , area , owner  );
	}
	
	this.areaSetSize = function ( area, size)   // 3130
	{
	    serverko.appendEvent( 3130 , area , size );
	}

	this.clientAreaSetSize = function ( userID, area, size)   // 3130
	{
	    serverko.clientAppendEvent( userID, 3130 , area , size  );
	}

	
	//3160 - display
	this.areaSetDisplay = function ( area, disp)   // 3160
	{
	    serverko.appendEvent( 3160 , area , disp );
	}

	this.clientAreaSetDisplay = function ( userID, area, disp)   // 3160
	{
	    serverko.clientAppendEvent( userID, 3160 , area , disp );
	}

	
	//3170 - data
	this.areaSetData = function ( area, data)   // 3170
	{
	    serverko.appendEvent( 3170 , area , data  );
	}

	this.clientAreaSetData = function ( userID, area, data)   // 3170
	{
	    serverko.clientAppendEvent( userID, 3170 , area , data  );
	}
	
	
	//3180 - text
	this.areaSetText = function ( area, text)   
	{
	    serverko.appendEvent( 3180 , area , text );
	}
	
	this.areaSetText_ = function ( area, text)   
	{
	    serverko.startData();
	    serverko.appendEvent( 3180 , area , text );
	    serverko.sendData();
	}
	
	this.clientAreaSetText = function ( userID, area, text)   // 3180
	{
	    serverko.clientAppendEvent( userID, 3180 , area , text );
	}
	
	//3190 - location
	this.areaSetLocation = function ( area , loc)
	{
		serverko.appendEvent( 3190 , area , loc );
	}
	

	this.clientAreaSetLocation = function ( userID, area, loc)   // 3190
	{
	    serverko.clientAppendEvent( userID, 3190 , area , loc );
	}
	
	this.areaSetScale = function ( area, loc)   // 3190
	{
	    serverko.appendEvent( 3191 , area , loc );
	}
	
	this.clientAreaSetScale = function ( userID, area, loc)   // 3190
	{
	    serverko.clientAppendEvent( userID, 3191 , area , loc );
	}
	
	this.areaSetItemScale = function ( area, index, loc)   // 3190
	{
	    serverko.appendEvent( 3192 , area , index + ","+ loc );
	}
	
	this.clientAreaSetItemScale = function ( userID, area, index, loc)   // 3190
	{
	    serverko.clientAppendEvent( userID, 3192 , area , index + ","+ loc  );
	}

	
	
	//3200 - onclick
	this.areaSetOnclick = function ( area, data)   // 3200
	{
	    serverko.appendEvent( 3200 , area , data );
	}
	
	this.clientAreaSetOnclick = function ( userID, area, data)   // 3180
	{
	    serverko.clientAppendEvent( userID, 3200 , area , data );
	}
	
	this.areaSetOnFocusGain = function ( area, data)   // 3200
	{
	    serverko.appendEvent( 3201 , area , data );
	}
	
	this.clientAreaSetOnFocusGain = function ( userID, area, data)   // 3180
	{
	    serverko.clientAppendEvent( userID, 3201 , area , data );
	}
	
	this.areaSetOnFocusLost = function ( area, data)   // 3200
	{
	    serverko.appendEvent( 3202 , area , data );
	}
	
	this.clientAreaSetOnFocusLost = function ( userID, area, data)   // 3180
	{
	    serverko.clientAppendEvent( userID, 3202 , area , data );
	}
	
	
	
	this.clientAreaSetItems     = function ( userID, area, items)   // 3220
	{
	    serverko.clientAppendEvent( userID, 3220 , area , items );
	}
	
	this.areaSetItems           = function ( area, items)   // 3220
	{
	    serverko.appendEvent( 3220 , area , items );
	}


	//3221 - items
	this.clientAreaSetItemsA     = function ( userID, area, items)   // 3220
	{
	    serverko.clientAppendEvent( userID, 3221 , area , items );
	}

	
	this.areaSetItemsA           = function ( area, items) 
	{
	    serverko.appendEvent( 3221 , area , items );
	}

	//3222 - items
	this.clientAreaSetItem      = function ( userID, area, field, item)   // 3222
	{
	    serverko.clientAppendEvent( userID, 3222 , area , field+","+item );
	}	
	
	this.clientAreaInvertItem    = function ( userID, area, field)   // 3222
	{
	    serverko.clientAppendEvent( userID, 3223 , area , field );
	}
	
	this.areaSetItem            = function ( area, field, item)   // 3222
	{
	    serverko.appendEvent( 3222 , area , field+","+item );
	}
	
	this.areaInvertItem            = function ( area, field)   // 3223
	{
	    serverko.appendEvent( 3223 , area , field );
	}
	
	//3223 - items
	this.clientAreaSetItemB      = function ( userID , area, field, item)   
	{
	    serverko.clientAppendEvent( userID , 3224 , area , field+","+item );
	}

	this.areaSetItemB            = function ( area, field, item) 
	{
	    serverko.appendEvent( 3224 , area , field+","+item );
	}

    //3225
    this.areaPushItemFront      = function (area, item)
    {
        serverko.appendEvent( 3225 , area , item );
    }
    

	//3230 - font
	this.areaSetFont = function ( area, text)   // 3230
	{
	    serverko.appendEvent( 3230 , area , text );
	}

	this.clientAreaSetFont = function ( userID, area, text)   // 3230
	{
	    serverko.clientAppendEvent( userID, 3230 , area , text );
	}
	
	//3240 - foreground
    this.areaSetForeground = function ( area, text)   // 3240
	{
	    serverko.appendEvent( 3240 , area , text );
	}

	this.clientAreaSetForeground = function ( userID , area, text)   // 3240
	{
	    serverko.clientAppendEvent( userID , 3240 , area , text );
	}
	
	//3250 - background
    this.areaSetBackground = function ( area, text)   // 3250
	{
	    serverko.appendEvent( 3250 , area , text );
	}
    
	this.clientAreaSetBackground = function ( userID, area, text)   // 3250
	{
	    serverko.clientAppendEvent( userID , 3250 , area , text );
	}

	
	//3260 - border
	this.areaSetBorder = function ( area, text)   // 3260
	{
	    serverko.appendEvent( 3260 , area , text );
	}

	
	this.cilentAreaSetBorder = function ( userID, area, text)   // 3260
	{
	    serverko.clientAppendEvent( userID, 3260 , area , text );
	}

	//3270 - fields
	this.areaSetFields = function ( area, fields)   // 3270
	{
	    serverko.appendEvent( 3270 , area , fields  );
	}
	
	this.cilentAreaSetFields = function ( userID, area, fields)   // 3270
	{
	    serverko.clientAppendEvent( userID, 3270 , area , fields  );
	}




	this.define = layout_define;

    
    this.updateBack = function (area, time , newback, oldback)
    {
        //print( " update back " + area + time + newback +oldback);
        
    	this.areaSetBackground(area, newback);
    	
    	var data = 	"Q.startUpdate();Q.layout.areaSetBackground(";
    	data += "'" + area +"'" +  "," + "'" + oldback +"'" ;
    	data += ");Q.sendUpdate();"
    	Q.exec_( time , data);
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
    	Q.exec_( time , data);
    }
    
    this.add = function (type,areas)
    {
        //layout_createLayout(type,areas , 1);
        layout_createLayout2(type,areas , 1);
    }

    this.clientAdd = function (userID , type,areas)
    {
        layout_createLayout2(type,areas , 1);
    }
    
    this.show = function (pageid)
    {
        serverko.appendEvent( 2010 , pageid , "" );
    }

    
    this.showAnim = function (pageid, anim)
    {
        serverko.appendEvent( 2011 , pageid , anim );
    }
    
    this.clientShow = function (userID ,pageid)
    {
        serverko.clientAppendEvent( userID, 2010 , pageid , "" );
    }

    this.clientShowAnim = function (userID , pageid, anim)
    {
        serverko.clientAppendEvent( userID , 2011 , pageid , anim );
    }

    
    this.hide = function (pageid)
    {
        serverko.appendEvent( 2020 , pageid , "" );
    }
    
    this.hideAnim = function (pageid, anim)
    {
        serverko.appendEvent( 2021 , pageid , anim );
    }

    
    this.show_ = function (pageid)
    {
    	layout_startUpdate();    
        serverko.appendEvent( 2010 , pageid , "" );
    	layout_sendUpdate();    
    }
    
    this.clientShow_ = function (userID, pageid)
    {
    	serverko.clientStartData(userID);    
        serverko.clientAppendEvent( userID, 2010 , pageid , "" );
    	serverko.clientSendData(userID);    
    }
    
    this.clientHide = function(userID ,pageid)
    {
        serverko.clientAppendEvent( userID ,2020 , pageid , "" );
    }
    
    this.clientHide_ = function (userID ,pageid)
    {
    	serverko.clientStartData(userID);    
        serverko.clientAppendEvent( userID ,2020 , pageid , "" );
    	serverko.clientSendData(userID);        
    }

    this.showAnim_ = function (pageid , anim)
    {
    	layout_startUpdate();    
        serverko.appendEvent( 2011 , pageid , anim );
    	layout_sendUpdate();    
    }
    
    this.hide_ = function (pageid)
    {
    	layout_startUpdate();    
        serverko.appendEvent( 2020 , pageid , "" );
    	layout_sendUpdate();    
    }

    
    
    this.hideAnim_ = function (pageid , anim)
    {
    	layout_startUpdate();    
        serverko.appendEvent( 2021 , pageid , anim );
    	layout_sendUpdate();    
    }
    
    this.editText = function (deftext, onreturn)
    {
        serverko.appendEvent( 1002 , deftext , onreturn );
    }
    
    this.anim = function (type, data)
    {
        serverko.appendEvent( 2030 , type , data );
    }
    
    this.anim_ = function (type, data)
    {
    	layout_startUpdate();
        serverko.appendEvent( 2030 , type , data );
        layout_sendUpdate(); 
    }


    
    this.areaStdOut = new LayoutArea();
    this.areaStdOut.type = "text.mline";
    this.areaStdOut.id = "stdout";
    this.areaStdOut.location="0,0,2,2";
    this.areaStdOut.size = "10,10,10";
    this.areaStdOut.text = "";
    this.areaStdOut.display = "hud";    
    
}

//print("JS:layout_handler start "  );  

	


//create figures

function Textures()
{
	this.newFromFile = function (name, file)
	{
		serverko.appendEvent( 4000 , name, file);
	}
	
}
function Sounds()
{
	this.newFromFile = function (name, file)
	{
		serverko.appendEvent( 5000 , name, file);
	}

    this.play =  function (sound)
    {
    	serverko.appendEvent( 5010 , "play", sound );
    }

    this.play_ = function (sound)
    {
    	layout_startUpdate();    
    	serverko.appendEvent( 5010 , "play", sound );
    	layout_sendUpdate();    
        
    }

    
    this.volume = function (value)
    {
    	serverko.appendEvent( 5011 , value, "" );
    }

    this.volume_ = function (value)
    {
    	layout_startUpdate();    	
    	serverko.appendEvent( 5011 , value, "" );
    	layout_sendUpdate();    	
    }

    this.mute = function (val)
    {
    	serverko.appendEvent( 5012 , "mute", val );
    }

    this.mute_ = function (val)
    {
    	layout_startUpdate();
    	serverko.appendEvent( 5012 , "mute", val );
    	layout_sendUpdate();
    }


}

function Models()
{
	
	this.newFromTemplate = function (name , template)
	{
		serverko.appendEvent( 6001 , name, template);
	}
	
	this.setTexture = function (name, texture, offset)
	{
		serverko.appendEvent( 6002 , name, texture + ";" + offset);
	}
	
	this.create = function (name)
	{
		serverko.appendEvent( 6003 , name, "");
	}

	this.setSubmodels = function (name, count)
	{
		serverko.appendEvent( 6004 , name, count);
	}
	
}

var textures = new Textures();
var sounds = new Sounds();
var layout = new Layout();
var models = new Models();



// delayed script event/execution 
// onlick with prefix [s] will automaticly exec script

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
