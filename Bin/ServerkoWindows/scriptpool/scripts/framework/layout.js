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
    
    this.createLayout = function(type, areas, send)
    {
        
        // send cached layout info
        var a;
        
        //print("JS:layout_createLayout " + type + " " + areas.length);  
        
        if (send == 1)
        	this.qapp.serverko.startData();

        this.qapp.serverko.startTag();
        this.qapp.serverko.appendTag( "res", "layout");
        this.qapp.serverko.addSeparator()  
        this.qapp.serverko.appendTag( "pageid", type );
        this.qapp.serverko.addSeparator()      
        this.qapp.serverko.startTags("area");
        
        for (a=0; a< areas.length; a++)
        {
            
            // add properties
            if (areas[a].type == "") return;
            if (areas[a].id == "") return;
            
            if ( a> 0)
            {
                this.qapp.serverko.addSeparator();
            }
            this.qapp.serverko.startTag();
            this.qapp.serverko.appendTag( "type", areas[a].type);

            this.qapp.serverko.addSeparator();
            this.qapp.serverko.appendTag( "id", areas[a].id);
            
            if (areas[a].layout != "")
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "layout", areas[a].layout);
            }
            if (areas[a].state != "")
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "state", areas[a].state);
            }
            if (areas[a].owner != -111111)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "owner", areas[a].owner);
            }
            if (areas[a].size != -111111)
            {
                this.qapp.serverko.addSeparator();
                this.qapp.serverko.appendTag( "size", areas[a].size);
            }
            if (areas[a].display != "")
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "display", areas[a].display);
            }
            if (areas[a].data != "")
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "data", areas[a].data);
            }
            if (areas[a].items != "")
            {
                this.qapp.serverko.addSeparator();            
                this.qapp.serverko.appendTag( "items", areas[a].items);            
            }
            if (areas[a].text != "")
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "text", areas[a].text);
            }
            if (areas[a].location != "")
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "location", areas[a].location);
            }
            if (areas[a].onclick != "")
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "onclick", areas[a].onclick);
            }
            if (areas[a].onfocuslost != "")
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "onfocuslost", areas[a].onfocuslost);
            }
            if (areas[a].onfocusgain != "")
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "onfocusgain", areas[a].onfocusgain);
            }        
            if (areas[a].font != "")
            {
                this.qapp.serverko.addSeparator();            
                this.qapp.serverko.appendTag( "font", areas[a].font);
            }
            if (areas[a].foreground != "")
            {
                this.qapp.serverko.addSeparator();            
                this.qapp.serverko.appendTag( "foreground", areas[a].foreground);
            }
            if (areas[a].background != "")
            {
                this.qapp.serverko.addSeparator();            
                this.qapp.serverko.appendTag( "background", areas[a].background);
            }
            if (areas[a].border != "")
            {
                this.qapp.serverko.addSeparator();            
                this.qapp.serverko.appendTag( "border", areas[a].border);
            }        
            if (areas[a].fields != "")
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "fields", areas[a].fields);                                                            
            }
            if (areas[a].colors != "")
            {
                this.qapp.serverko.addSeparator();           
                this.qapp.serverko.appendTag( "colors", areas[a].colors);                                                            
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
        this.qapp.serverko.startData();
        this.qapp.serverko.appendEvent(3180 , "stdout" , message ); //text
        this.qapp.serverko.sendData();
    }
    this.print_ = function ( message)
    {
        this.qapp.serverko.startData();
        this.qapp.serverko.appendEvent(3180 , "stdout" , message ); //text
        this.qapp.serverko.sendData();
    }    
    
    this.print = function ( message)
    {
        this.qapp.serverko.appendEvent(3180 , "stdout" , message ); //text
    }
    
	//2000
	this.scriptEnd = function ()
	{
	    this.qapp.serverko.appendEvent( 2000 , "" , "" );
	}

	this.areaCreate = function ( area, areaid)
	{
		this.qapp.serverko.appendEvent( 3000 , area , areaid );
	}
	
	this.clientAreaCreate = function ( userID, area, areaid)
	{
		this.qapp.serverko.clientAppendEvent( userID, 3000 , area , areaid );
	}
	
	//3001 - delete area
	this.areaDelete = function ( area)
	{
		this.qapp.serverko.appendEvent( 3001 , area , "" );
	}

	this.clientAreaDelete = function ( userID, area)
	{
		this.qapp.serverko.clientAppendEvent( userID, 3001 , area , "" );
	}

	
	//3002 - clear area
	this.areaClear = function (  area)
	{
		this.qapp.serverko.appendEvent( 3002 , area , "" );
	}

	this.clientAreaClear = function ( userID, area)
	{
		this.qapp.serverko.clientAppendEvent( userID, 3002 , area , "" );
	}

	
    //3003
	this.areaSwapID = function (  area, areato)
	{
		this.qapp.serverko.appendEvent( 3003 , area , areato );
	}

	this.clientAreaSwapID = function ( userID, area, areato)
	{
		this.qapp.serverko.clientAppendEvent( userID, 3003 , area , areato );
	}


	//3050 - place item 
	this.itemPlace = function ( item, itemid, areaTo, indexTo, userData)   // 3050
	{
	    this.qapp.serverko.appendEvent( 3050 , item +"." +itemid +"|"+userData, areaTo + "," + indexTo);
	}
	
	this.clientItemPlace = function ( userID, item, itemid, areaTo, indexTo, userData)   // 3050
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3050 , item +"." +itemid +"|"+userData, areaTo + "," + indexTo);
	}
		

	//3051 - move figure
	this.itemMove               = function ( areaFrom, indexFrom, areaTo, indexTo)   // 3051
	{
	    this.qapp.serverko.appendEvent( 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo);
	}
	
	this.clientItemMove         = function ( userID, areaFrom, indexFrom, areaTo, indexTo)   // 3051
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo );
	}
	
	//3052 - remove figure 
	this.itemRemove               = function ( areaFrom, indexFrom)
	{
	    this.qapp.serverko.appendEvent( 3052 , areaFrom, indexFrom);
	}

	this.clientItemRemove         = function ( userID, areaFrom, indexFrom)
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3052 , areaFrom, indexFrom);
	}
	
	//3053 - move figure 
	this.itemMoveA               = function ( areaFrom, indexFrom, areaTo, indexTo, type, delay, path)   // 3053
	{
	    this.qapp.serverko.appendEvent( 3053 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo + "," + type + "," + delay + "," + path);
	}
	
	this.clientItemMoveA         = 	function ( userID ,  areaFrom, indexFrom, areaTo, indexTo, type, delay, path)   // 3053
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3053 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo + "," + type + "," + delay + "," + path);
	}

	//3055 - item anim 
	this.itemsAnim               = function (areaId, type, delay)
	{
	    this.qapp.serverko.appendEvent( 3054 , areaId , type + "," + delay );
	}

	this.itemAnim               = function (areaId, index , type, delay)
	{
	    this.qapp.serverko.appendEvent( 3055 , areaId , index + "|" + type + "," + delay );
	}

    this.clientItemsAnim         = function (userID , areaId, type, delay)
    {
        this.qapp.serverko.clientAppendEvent( userID , 3054 , areaId , type + "," + delay );
    }

	//3100 - layout
	this.areaSetLayout = function ( area, text)   // 3100
	{
	    this.qapp.serverko.appendEvent( 3100 , area , text );
	}

	this.clientAreaSetLayout = function ( userID, area, text)   // 3100
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3100 , area , text );
	}

	//3110 - state
	this.areaSetState = function ( area, state)   // 3110
	{
	    this.qapp.serverko.appendEvent( 3110 , area , state);
	}

	this.areaSetState_ = function ( area, state)   // 3110
	{
	    this.qapp.serverko.startData();
	    this.qapp.serverko.appendEvent( 3110 , area , state);
	    this.qapp.serverko.sendData();
	}
	
	this.clientAreaSetState = function ( userID, area, state)   // 3110
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3110 , area , state);
	}
	
	this.clientAreaSetState_ = function ( userID, area, state)   // 3110
	{
	    this.qapp.serverko.clientStartData(userID);
	    this.qapp.serverko.clientAppendEvent( userID, 3110 , area , state);
	    this.qapp.serverko.clientSendData(userID);
	}

	
	//3120 - owner
	this.areaSetOwner = function ( area, owner)   // 3120
	{
	    this.qapp.serverko.appendEvent( 3120 , area , owner  );
	}
	
	this.clientAreaSetOwner = function ( userID, area, owner)   // 3120
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3120 , area , owner  );
	}
	
	this.areaSetSize = function ( area, size)   // 3130
	{
	    this.qapp.serverko.appendEvent( 3130 , area , size );
	}

	this.clientAreaSetSize = function ( userID, area, size)   // 3130
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3130 , area , size  );
	}

	
	//3160 - display
	this.areaSetDisplay = function ( area, disp)   // 3160
	{
	    this.qapp.serverko.appendEvent( 3160 , area , disp );
	}

	this.clientAreaSetDisplay = function ( userID, area, disp)   // 3160
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3160 , area , disp );
	}

	
	//3170 - data
	this.areaSetData = function ( area, data)   // 3170
	{
	    this.qapp.serverko.appendEvent( 3170 , area , data  );
	}

	this.clientAreaSetData = function ( userID, area, data)   // 3170
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3170 , area , data  );
	}
	
	
	//3180 - text
	this.areaSetText = function ( area, text)   
	{
	    this.qapp.serverko.appendEvent( 3180 , area , text );
	}
	
	this.areaSetText_ = function ( area, text)   
	{
	    this.qapp.serverko.startData();
	    this.qapp.serverko.appendEvent( 3180 , area , text );
	    this.qapp.serverko.sendData();
	}
	
	this.clientAreaSetText = function ( userID, area, text)   // 3180
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3180 , area , text );
	}
	
	//3190 - location
	this.areaSetLocation = function ( area , loc)
	{
		this.qapp.serverko.appendEvent( 3190 , area , loc );
	}
	

	this.clientAreaSetLocation = function ( userID, area, loc)   // 3190
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3190 , area , loc );
	}
	
	this.areaSetScale = function ( area, loc)   // 3190
	{
	    this.qapp.serverko.appendEvent( 3191 , area , loc );
	}
	
	this.clientAreaSetScale = function ( userID, area, loc)   // 3190
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3191 , area , loc );
	}
	
	this.areaSetItemScale = function ( area, index, loc)   // 3190
	{
	    this.qapp.serverko.appendEvent( 3192 , area , index + ","+ loc );
	}
	
	this.clientAreaSetItemScale = function ( userID, area, index, loc)   // 3190
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3192 , area , index + ","+ loc  );
	}

	
	
	//3200 - onclick
	this.areaSetOnclick = function ( area, data)   // 3200
	{
	    this.qapp.serverko.appendEvent( 3200 , area , data );
	}
	
	this.clientAreaSetOnclick = function ( userID, area, data)   // 3180
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3200 , area , data );
	}
	
	this.areaSetOnFocusGain = function ( area, data)   // 3200
	{
	    this.qapp.serverko.appendEvent( 3201 , area , data );
	}
	
	this.clientAreaSetOnFocusGain = function ( userID, area, data)   // 3180
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3201 , area , data );
	}
	
	this.areaSetOnFocusLost = function ( area, data)   // 3200
	{
	    this.qapp.serverko.appendEvent( 3202 , area , data );
	}
	
	this.clientAreaSetOnFocusLost = function ( userID, area, data)   // 3180
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3202 , area , data );
	}
	
	
	
	this.clientAreaSetItems     = function ( userID, area, items)   // 3220
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3220 , area , items );
	}
	
	this.areaSetItems           = function ( area, items)   // 3220
	{
	    this.qapp.serverko.appendEvent( 3220 , area , items );
	}


	//3221 - items
	this.clientAreaSetItemsA     = function ( userID, area, items)   // 3220
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3221 , area , items );
	}

	
	this.areaSetItemsA           = function ( area, items) 
	{
	    this.qapp.serverko.appendEvent( 3221 , area , items );
	}

	//3222 - items
	this.clientAreaSetItem      = function ( userID, area, field, item)   // 3222
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3222 , area , field+","+item );
	}	
	
	this.areaSetItem_           = function ( area, field, item)   // 3222
	{
		this.qapp.serverko.startData();
	    this.qapp.serverko.appendEvent( 3222 , area , field+","+item );
		this.qapp.serverko.sendData();
	}
	
	this.clientAreaInvertItem    = function ( userID, area, field)   // 3222
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3223 , area , field );
	}
	
	this.areaSetItem            = function ( area, field, item)   // 3222
	{
	    this.qapp.serverko.appendEvent( 3222 , area , field+","+item );
	}
	
	this.areaInvertItem            = function ( area, field)   // 3223
	{
	    this.qapp.serverko.appendEvent( 3223 , area , field );
	}
	
	//3223 - items
	this.clientAreaSetItemB      = function ( userID , area, field, item)   
	{
	    this.qapp.serverko.clientAppendEvent( userID , 3224 , area , field+","+item );
	}

	this.areaSetItemB            = function ( area, field, item) 
	{
	    this.qapp.serverko.appendEvent( 3224 , area , field+","+item );
	}

    //3225
    this.areaPushItemFront      = function (area, item)
    {
        this.qapp.serverko.appendEvent( 3225 , area , item );
    }
    

	//3230 - font
	this.areaSetFont = function ( area, text)   // 3230
	{
	    this.qapp.serverko.appendEvent( 3230 , area , text );
	}

	this.clientAreaSetFont = function ( userID, area, text)   // 3230
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3230 , area , text );
	}
	
	//3240 - foreground
    this.areaSetForeground = function ( area, text)   // 3240
	{
	    this.qapp.serverko.appendEvent( 3240 , area , text );
	}

	this.clientAreaSetForeground = function ( userID , area, text)   // 3240
	{
	    this.qapp.serverko.clientAppendEvent( userID , 3240 , area , text );
	}
	
	//3250 - background
    this.areaSetBackground = function ( area, text)   // 3250
	{
	    this.qapp.serverko.appendEvent( 3250 , area , text );
	}
    
	this.clientAreaSetBackground = function ( userID, area, text)   // 3250
	{
	    this.qapp.serverko.clientAppendEvent( userID , 3250 , area , text );
	}

	
	//3260 - border
	this.areaSetBorder = function ( area, text)   // 3260
	{
	    this.qapp.serverko.appendEvent( 3260 , area , text );
	}

	
	this.cilentAreaSetBorder = function ( userID, area, text)   // 3260
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3260 , area , text );
	}

	//3270 - fields
	this.areaSetFields = function ( area, fields)   // 3270
	{
	    this.qapp.serverko.appendEvent( 3270 , area , fields  );
	}
	
	this.cilentAreaSetFields = function ( userID, area, fields)   // 3270
	{
	    this.qapp.serverko.clientAppendEvent( userID, 3270 , area , fields  );
	}

    this.updateBack = function (area, time , newback, oldback)
    {
        //print( " update back " + area + time + newback +oldback);
        
    	this.areaSetBackground(area, newback);
    	
    	var data = 	"Q.startUpdate();Q.layout.areaSetBackground(";
    	data += "'" + area +"'" +  "," + "'" + oldback +"'" ;
    	data += ");Q.sendUpdate();"
    	this.qapp.exec_( time , data);
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
    	this.qapp.exec_( time , data);
    }
    
    this.add = function (type,areas)
    {
        this.createLayout(type,areas , 0);
    }

    this.clientAdd = function (userID , type,areas)
    {
    	this.createLayout(type,areas , 0);
    }
    
    this.add_ = function (type,areas)
    {
        this.createLayout(type,areas , 1);
    }

    this.clientAdd_ = function (userID , type,areas)
    {
    	this.createLayout(type,areas , 1);
    }

    
    this.show = function (pageid)
    {
        this.qapp.serverko.appendEvent( 2010 , pageid , "" );
    }

    
    this.showAnim = function (pageid, anim)
    {
        this.qapp.serverko.appendEvent( 2011 , pageid , anim );
    }
    
    this.clientShow = function (userID ,pageid)
    {
        this.qapp.serverko.clientAppendEvent( userID, 2010 , pageid , "" );
    }

    this.clientShowAnim = function (userID , pageid, anim)
    {
        this.qapp.serverko.clientAppendEvent( userID , 2011 , pageid , anim );
    }

    this.popup = function (pageid)
    {
        this.qapp.serverko.appendEvent( 2012 , pageid , "" );
    }

    
    this.popupAnim = function (pageid, anim)
    {
        this.qapp.serverko.appendEvent( 2013 , pageid , anim );
    }
    
    this.clientPopup = function (userID ,pageid)
    {
        this.qapp.serverko.clientAppendEvent( userID, 2012 , pageid , "" );
    }

    this.clientPopupAnim = function (userID , pageid, anim)
    {
        this.qapp.serverko.clientAppendEvent( userID , 2013 , pageid , anim );
    }


    
    this.hide = function (pageid)
    {
        this.qapp.serverko.appendEvent( 2020 , pageid , "" );
    }
    
    this.hideAnim = function (pageid, anim)
    {
        this.qapp.serverko.appendEvent( 2021 , pageid , anim );
    }

    
    this.show_ = function (pageid)
    {
    	this.startUpdate();    
        this.qapp.serverko.appendEvent( 2010 , pageid , "" );
        this.sendUpdate();    
    }
    
    this.clientShow_ = function (userID, pageid)
    {
    	this.qapp.serverko.clientStartData(userID);    
        this.qapp.serverko.clientAppendEvent( userID, 2010 , pageid , "" );
    	this.qapp.serverko.clientSendData(userID);    
    }
    
    this.clientHide = function(userID ,pageid)
    {
        this.qapp.serverko.clientAppendEvent( userID ,2020 , pageid , "" );
    }
    
    this.clientHide_ = function (userID ,pageid)
    {
    	this.qapp.serverko.clientStartData(userID);    
        this.qapp.serverko.clientAppendEvent( userID ,2020 , pageid , "" );
    	this.qapp.serverko.clientSendData(userID);        
    }

    this.showAnim_ = function (pageid , anim)
    {
    	this.startUpdate();    
        this.qapp.serverko.appendEvent( 2011 , pageid , anim );
        this.sendUpdate();    
    }
    
    this.hide_ = function (pageid)
    {
    	this.startUpdate();    
        this.qapp.serverko.appendEvent( 2020 , pageid , "" );
        this.sendUpdate();    
    }

    this.popup_ = function (pageid)
    {
    	this.qapp.startUpdate();    
    
        this.qapp.serverko.appendEvent( 2012 , pageid , "" );
    	this.qapp.sendUpdate();    
        
    }

    this.popupAnim_ = function (pageid, anim)
    {
    	this.qapp.startUpdate();    
    
        this.qapp.serverko.appendEvent( 2013 , pageid , anim );
    	this.qapp.sendUpdate();    
        
    }
    
    this.clientPopup_ = function (userID ,pageid)
    {
    	this.qapp.startUpdate();    
    
        this.qapp.serverko.clientAppendEvent( userID, 2012 , pageid , "" );
    	this.qapp.sendUpdate();    
        
    }

    this.clientPopupAnim_ = function (userID , pageid, anim)
    {
    	this.qapp.startUpdate();    
    
        this.qapp.serverko.clientAppendEvent( userID , 2013 , pageid , anim );
    	this.qapp.sendUpdate();    
        
    }
    
    
    this.hideAnim_ = function (pageid , anim)
    {
    	this.qapp.startUpdate();    
        this.qapp.serverko.appendEvent( 2021 , pageid , anim );
    	this.qapp.sendUpdate();    
    }
    
    this.editText = function (deftext, onreturn)
    {
        this.qapp.serverko.appendEvent( 1002 , deftext , onreturn );
    }
    
    this.anim = function (type, data)
    {
        this.qapp.serverko.appendEvent( 2030 , type , data );
    }
    
    this.anim_ = function (type, data)
    {
    	this.qapp.startUpdate();
        this.qapp.serverko.appendEvent( 2030 , type , data );
        this.qapp.sendUpdate(); 
    }


  

    this.startUpdate = function()
    {
    	this.qapp.startUpdate();
    }
    
    this.sendUpdate = function()
    {
    	this.qapp.sendUpdate();
    }   
      
}

//print("JS:layout_handler start "  );  

	


//create figures

function Textures(qapp)
{
	this.qapp = qapp;
	this.newFromFile = function (name, file)
	{
		this.qapp.serverko.appendEvent( 4000 , name, file);
	}
	
}
function Sounds(qapp)
{
	this.qapp = qapp;
	this.newFromFile = function (name, file)
	{
		this.qapp.serverko.appendEvent( 5000 , name, file);
	}

    this.play =  function (sound)
    {
    	this.qapp.serverko.appendEvent( 5010 , "play", sound );
    }

    this.play_ = function (sound)
    {
    	this.qapp.startUpdate();    
    	this.qapp.serverko.appendEvent( 5010 , "play", sound );
    	this.qapp.sendUpdate();    
        
    }

    
    this.volume = function (value)
    {
    	this.qapp.serverko.appendEvent( 5011 , value, "" );
    }

    this.volume_ = function (value)
    {
    	this.qapp.startUpdate();    	
    	this.qapp.serverko.appendEvent( 5011 , value, "" );
    	this.qapp.sendUpdate();    	
    }

    this.mute = function (val)
    {
    	this.qapp.serverko.appendEvent( 5012 , "mute", val );
    }

    this.mute_ = function (val)
    {
    	this.qapp.startUpdate();
    	this.qapp.serverko.appendEvent( 5012 , "mute", val );
    	this.qapp.sendUpdate();
    }


}

function Models(qapp)
{
	this.qapp = qapp;
	
	this.newFromTemplate = function (name , template)
	{
		this.qapp.serverko.appendEvent( 6001 , name, template);
	}
	
	this.setTexture = function (name, texture, offset)
	{
		this.qapp.serverko.appendEvent( 6002 , name, texture + ";" + offset);
	}
	
	this.create = function (name)
	{
		this.qapp.serverko.appendEvent( 6003 , name, "");
	}

	this.setSubmodels = function (name, count)
	{
		this.qapp.serverko.appendEvent( 6004 , name, count);
	}
	
}

/*
var textures = new Textures();
var sounds = new Sounds();
var layout = new Layout();
var models = new Models();
*/


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
