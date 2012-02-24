serverko = Q.serverko;
serverko.sendEvent = function (id, delay, data) 
{
	Q.serverko.startData();
	Q.serverko.appendEvent( 100 , delay , "Q.handlers.script_onEvent(" + id + ","  + "'" + data + "'" + ");"  );
	Q.serverko.sendData();
}

Q.appendEvent_ = function(id, area, data, data2, data3, data4)
{
	Q.serverko.appendEvent(id, area, data, data2, data3, data4).now();
}
Q.clientAppendEvent_ = function (userID , id, area, data, data2, data3, data4)
{
	Q.serverko.appendEvent(id, area, data, data2, data3, data4).toUserNow(userID);
}

Q.layout.areaSetOwner = function ( area, owner)   // 3120
{
	Q.serverko.appendEvent( 3120 , area , owner  );
}
	
Q.layout.clientAreaSetOwner = function ( userID, area, owner)   // 3120
{
	Q.serverko.appendEvent( 3120 , area , owner  ).toUserNow(userID);
}

Q.layout.clientAdd = function (userID , texts)
{
	Q.layout.add(texts);
}

Q.layout.add_ = function (texts)
{
	Q.layout.add(texts).now();
}

Q.layout.clientAdd_ = function (userID , texts)
{
	Q.layout.createLayout(texts , 1);
}

//Q.layout.add = Q.layout.add_;
Q.layout.clientAdd = Q.layout.clientAdd_;
Q.event = Q.event_;



Q.include_ = function (id)
{
	Q.startUpdate();
	Q.serverko.loadModule(id);
	Q.sendUpdate();
}


Q.load_ = function (id)
{
	Q.startUpdate();
	Q.serverko.loadModule2(id);
	Q.sendUpdate();
}

Q.load = Q.load_;
Q.include = Q.include_;

Q.evals_ = function (delay, script)
{
	Q.evals(delay,script).now();
}

layout = Q.layout;



Q.models.newFromTemplate_ = function (name , template)
{
	Q.models.qapp.serverko.appendEvent_( 6001 , name, template);
}

Q.models.setTexture_ = function (name, texture, offset)
{
	Q.models.qapp.serverko.appendEvent_( 6002 , name, texture + ";" + offset);
}

Q.models.create_ = function (name)
{
	Q.models.qapp.serverko.appendEvent_( 6003 , name, "");
}

Q.models.setSubmodels_ = function (name, count)
{
	Q.models.qapp.serverko.appendEvent_( 6004 , name, count);
}

Q.models.clientAdd = function (userID , objs)
{
	Q.models.createModels(objs , 0);
}

Q.models.add_ = function (objs)
{
	Q.models.createModels(objs , 1);
}

Q.models.clientAdd_ = function (userID , objs)
{
	Q.models.createModels(objs , 1);
}


Q.sounds.newFromFile_ = function (name, file)
{
	Q.sounds.qapp.serverko.appendEvent_( 5000 , name, file);
}
Q.sounds.play_ = function (sound)
{
	Q.sounds.qapp.serverko.appendEvent_( 5010 , "play", sound );
}

Q.sounds.volume_ = function (value)
{
	Q.sounds.qapp.serverko.appendEvent_( 5011 , value, "" );
} 

Q.sounds.mute_ = function (val)
{
	Q.sounds.qapp.serverko.appendEvent_( 5012 , "mute", val );
}



Q.textures.newFromFile_ = function (name, file)
{
	Q.textures.qapp.serverko.appendEvent_( 4000 , name, file);
}


Q.textures.remove_ = function (name)
{
	Q.textures.qapp.serverko.appendEvent_( 4001 , name);
}

Q.layout.print_ = function ( message)
{
	Q.layout.qapp.serverko.appendEvent_(3180 , "stdout" , message ); //text
}    

Q.layout.print = function ( message)
{
    Q.layout.qapp.serverko.appendEvent(3180 , "stdout" , message ); //text
}
    
Q.layout.clientAreaDelete = function ( userID, area)
{
	Q.layout.qapp.serverko.clientAppendEvent( userID, 3001 , area , "" );
}

Q.layout.areaDelete_ = function ( area)
{
	Q.layout.qapp.serverko.appendEvent_( 3001 , area , "" );
}

Q.layout.clientAreaDelete_ = function ( userID, area)
{
	Q.layout.qapp.serverko.clientAppendEvent_( userID, 3001 , area , "" );
}
	

Q.layout.areaClear_ = function (  area)
{
	Q.layout.qapp.serverko.appendEvent_( 3002 , area , "" );
}

Q.layout.clientAreaClear = function ( userID, area)
{
	Q.layout.qapp.serverko.clientAppendEvent( userID, 3002 , area , "" );
}

Q.layout.clientAreaClear_ = function ( userID, area)
{
	Q.layout.qapp.serverko.clientAppendEvent_( userID, 3002 , area , "" );
}


Q.layout.clientAreaClearItems = function ( userID, area)
{
	Q.layout.qapp.serverko.clientAppendEvent( userID, 3004 , area , "" );
}

Q.layout.areaClearItems_ = function (  area)
{
	Q.layout.qapp.serverko.appendEvent_( 3004 , area , "" );
}

Q.layout.clientAreaClearItems_ = function ( userID, area)
{
	Q.layout.qapp.serverko.clientAppendEvent_( userID, 3004 , area , "" );
}

Q.layout.clientItemPlace = function ( userID, item, itemid, areaTo, indexTo, userData)   // 3050
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3050 , item +"." +itemid +"|"+userData, areaTo + "," + indexTo);
}
	
Q.layout.itemPlace_ = function ( item, itemid, areaTo, indexTo, userData)   // 3050
{
    Q.layout.qapp.serverko.appendEvent_( 3050 , item +"." +itemid +"|"+userData, areaTo + "," + indexTo);
}

Q.layout.clientItemPlace_ = function ( userID, item, itemid, areaTo, indexTo, userData)   // 3050
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3050 , item +"." +itemid +"|"+userData, areaTo + "," + indexTo);
}
	
Q.layout.clientItemMove         = function ( userID, areaFrom, indexFrom, areaTo, indexTo)   // 3051
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo );
}

Q.layout.itemMove_               = function ( areaFrom, indexFrom, areaTo, indexTo)   // 3051
{
    Q.layout.qapp.serverko.appendEvent_( 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo);
}

Q.layout.clientItemMove_         = function ( userID, areaFrom, indexFrom, areaTo, indexTo)   // 3051
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3051 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo );
}
	

Q.layout.clientItemRemove         = function ( userID, areaFrom, indexFrom)
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3052 , areaFrom, indexFrom);
}

Q.layout.itemRemove_               = function ( areaFrom, indexFrom)
{
    Q.layout.qapp.serverko.appendEvent_( 3052 , areaFrom, indexFrom);
}

Q.layout.clientItemRemove_         = function ( userID, areaFrom, indexFrom)
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3052 , areaFrom, indexFrom);
}


Q.layout.clientItemMoveA         = 	function ( userID ,  areaFrom, indexFrom, areaTo, indexTo, type, delay, path)   // 3053
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3053 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo + "," + type + "," + delay + "," + path);
}

Q.layout.itemMoveA_               = function ( areaFrom, indexFrom, areaTo, indexTo, type, delay, path)   // 3053
{
    Q.layout.qapp.serverko.appendEvent_( 3053 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo + "," + type + "," + delay + "," + path);
}

Q.layout.clientItemMoveA_         = 	function ( userID ,  areaFrom, indexFrom, areaTo, indexTo, type, delay, path)   // 3053
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3053 , "", areaFrom + "," + indexFrom + "," + areaTo + "," + indexTo + "," + type + "," + delay + "," + path);
}
	
Q.layout.clientItemsAnim         = function (userID , areaId, type, delay)
{
    Q.layout.qapp.serverko.clientAppendEvent( userID , 3054 , areaId , type + "," + delay );
}

Q.layout.itemsAnim_               = function (areaId, type, delay)
{
    Q.layout.qapp.serverko.appendEvent_( 3054 , areaId , type + "," + delay );
}

Q.layout.clientItemsAnim_         = function (userID , areaId, type, delay)
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID , 3054 , areaId , type + "," + delay );
}
	
Q.layout.clientItemAnim               = function (userID , areaId, index , type, delay)
{
    Q.layout.qapp.serverko.clientAppendEvent(userID ,  3055 , areaId , index + "|" + type + "," + delay );
}

Q.layout.itemAnim_               = function (areaId, index , type, delay)
{
    Q.layout.qapp.serverko.appendEvent_( 3055 , areaId , index + "|" + type + "," + delay );
}

Q.layout.clientItemAnim_               = function (userID , areaId, index , type, delay)
{
    Q.layout.qapp.serverko.clientAppendEvent_(userID ,  3055 , areaId , index + "|" + type + "," + delay );
}
	
Q.layout.areaSetState_ = function ( area, state)   // 3110
{
    Q.layout.qapp.serverko.appendEvent_( 3110 , area , state);
}

Q.layout.clientAreaSetState = function ( userID, area, state)   // 3110
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3110 , area , state);
}

Q.layout.clientAreaSetState_ = function ( userID, area, state)   // 3110
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3110 , area , state);
}


Q.layout.clientAreaSetBounds = function ( userID, area, bounds)   // 3120
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3120 , area , bounds  );
}

Q.layout.areaSetBounds_ = function ( area, bounds)   // 3120
{
    Q.layout.qapp.serverko.appendEvent_( 3120 , area , bounds  );
}

Q.layout.clientAreaSetBounds_ = function ( userID, area, bounds)   // 3120
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3120 , area , bounds  );
}	
	

Q.layout.areaSetText_ = function ( area, text)   
{
    Q.layout.qapp.serverko.appendEvent_( 3180 , area , text );
}

Q.layout.clientAreaSetText = function ( userID, area, text)   // 3180
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3180 , area , text );
}

Q.layout.clientAreaSetText_ = function ( userID, area, text)   // 3180
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3180 , area , text );
}
	
Q.layout.clientAreaSetLocation = function ( userID, area, loc)   
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3190 , area , loc );
}

Q.layout.areaSetLocation_ = function ( area , loc)
{
	Q.layout.qapp.serverko.appendEvent_( 3190 , area , loc );
}	

Q.layout.clientAreaSetLocation_ = function ( userID, area, loc)   
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3190 , area , loc );
}
	

Q.layout.clientAreaSetScale = function ( userID, area, loc)   
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3191 , area , loc );
}

Q.layout.areaSetScale_ = function ( area, loc)   
{
    Q.layout.qapp.serverko.appendEvent_( 3191 , area , loc );
}

Q.layout.clientAreaSetScale_ = function ( userID, area, loc)   
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3191 , area , loc );
}


Q.layout.areaSetItemScale_ = function ( area, index, loc)   // 3190
{
    Q.layout.qapp.serverko.appendEvent_( 3192 , area , index + ","+ loc );
}

Q.layout.clientAreaSetItemScale_ = function ( userID, area, index, loc)   // 3190
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3192 , area , index + ","+ loc  );
}

Q.layout.clientAreaSetItemScale_ = function ( userID, area, index, loc)   // 3190
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3192 , area , index + ","+ loc  );
}


Q.layout.clientAreaSetRotation = function ( userID, area, loc)   
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3195 , area , loc );
}

Q.layout.areaSetRotation_ = function ( area, loc)   
{
    Q.layout.qapp.serverko.appendEvent_( 3195 , area , loc );
}

Q.layout.clientAreaSetRotation_ = function ( userID, area, loc)   
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3195 , area , loc );
}
	

Q.layout.clientAreaSetItemScale = function ( userID, area, index, loc)   
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3192 , area , index + ","+ loc  );
}

Q.layout.areaSetItemScale_ = function ( area, index, loc)   
{
    Q.layout.qapp.serverko.appendEvent_( 3192 , area , index + ","+ loc );
}

Q.layout.clientAreaSetItemScale_ = function ( userID, area, index, loc)   
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3192 , area , index + ","+ loc  );
}


Q.layout.clientAreaSetOnclick = function ( userID, area, data)   // 3180
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3200 , area , data );
}

Q.layout.areaSetOnclick_ = function ( area, data)   // 3200
{
    Q.layout.qapp.serverko.appendEvent_( 3200 , area , data );
}

Q.layout.clientAreaSetOnclick_ = function ( userID, area, data)   // 3180
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3200 , area , data );
}


Q.layout.clientAreaSetOnFocusGain = function ( userID, area, data)   // 3180
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3201 , area , data );
}
Q.layout.areaSetOnFocusGain_ = function ( area, data)   // 3200
{
    Q.layout.qapp.serverko.appendEvent_( 3201 , area , data );
}

Q.layout.clientAreaSetOnFocusGain_ = function ( userID, area, data)   // 3180
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3201 , area , data );
}
	

Q.layout.clientAreaSetOnFocusLost = function ( userID, area, data)   // 3180
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3202 , area , data );
}


Q.layout.areaSetOnFocusLost_ = function ( area, data)   // 3200
{
    Q.layout.qapp.serverko.appendEvent_( 3202 , area , data );
}

Q.layout.clientAreaSetOnFocusLost_ = function ( userID, area, data)   // 3180
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3202 , area , data );
}
	
Q.layout.clientAreaSetItems     = function ( userID, area, items)   // 3220
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3220 , area , items );
}

Q.layout.areaSetItems_           = function ( area, items)   // 3220
{
    Q.layout.qapp.serverko.appendEvent_( 3220 , area , items );
}

Q.layout.clientAreaSetItems_     = function ( userID, area, items)   // 3220
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3220 , area , items );
}



Q.layout.areaAnim_ = function ( area, type , delay , data )   
{
    Q.layout.qapp.serverko.appendEvent_( 3210 , area , type , delay , data);
}

Q.layout.clientAreaAnim = function ( userID, area , type , delay , data )   // 3210
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3210 , area, type , delay , data );
}

Q.layout.clientAreaAnims_ = function ( userID, area , type , delay , data )   // 3210
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3210 , area , type , delay , data );
}
	
Q.layout.areaSetItem_           = function ( area, field, item)   // 3222
{
    Q.layout.qapp.serverko.appendEvent_( 3222 , area , field+","+item );
}	
Q.layout.clientAreaSetItem      = function ( userID, area, field, item)   // 3222
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3222 , area , field+","+item );
}	
Q.layout.clientAreaSetItem_      = function ( userID, area, field, item)   // 3222
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3222 , area , field+","+item );
}	
	
Q.layout.clientAreaInvertItem    = function ( userID, area, field)   // 3222
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3223 , area , field );
}
	
//3223 - items
Q.layout.clientAreaSetItemB      = function ( userID , area, field, item)   
{
    Q.layout.qapp.serverko.clientAppendEvent( userID , 3224 , area , field+","+item );
}

Q.layout.areaSetItemB            = function ( area, field, item) 
{
    Q.layout.qapp.serverko.appendEvent( 3224 , area , field+","+item );
}

Q.layout.areaSetBackground_ = function ( area, text)   // 3250
{
    Q.layout.qapp.serverko.appendEvent_( 3250 , area , text );
}

Q.layout.clientAreaSetBackground = function ( userID, area, text)   // 3250
{
    Q.layout.qapp.serverko.clientAppendEvent( userID , 3250 , area , text );
}

Q.layout.clientAreaSetBackground_ = function ( userID, area, text)   // 3250
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID , 3250 , area , text );
}


Q.layout.cilentAreaSetFields = function ( userID, area, fields)   // 3270
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3270 , area , fields  );
}

Q.layout.areaSetFields_ = function ( area, fields)   // 3270
{
    Q.layout.qapp.serverko.appendEvent_( 3270 , area , fields  );
}

Q.layout.cilentAreaSetFields_ = function ( userID, area, fields)   // 3270
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3270 , area , fields  );
}
	

Q.layout.clientAdd = function (userID , type,areas)
{
	Q.layout.createLayout(type,areas , 0);
}

Q.layout.add_ = function (type,areas)
{
    Q.layout.createLayout(type,areas , 1);
}

Q.layout.clientAdd_ = function (userID , type,areas)
{
	Q.layout.createLayout(type,areas , 1);
}

Q.layout.clientShow = function (userID ,pageid)
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 2010 , pageid , "" );
}


Q.layout.show_ = function (pageid)
{
    Q.layout.qapp.serverko.appendEvent_( 2010 , pageid , "" );
}

Q.layout.clientShow_ = function (userID, pageid)
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 2010 , pageid , "" );
}
    
Q.layout.showAnim_ = function (pageid , anim)
{
    Q.layout.qapp.serverko.appendEvent_( 2011 , pageid , anim );
}    

Q.layout.clientShowAnim = function (userID , pageid, anim)
{
    Q.layout.qapp.serverko.clientAppendEvent( userID , 2011 , pageid , anim );
}


Q.layout.clientPopup = function (userID ,pageid)
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 2012 , pageid , "" );
}

Q.layout.popup_ = function (pageid)
{
    Q.layout.qapp.serverko.appendEvent_( 2012 , pageid , "" );
}

Q.layout.clientPopup_ = function (userID ,pageid)
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 2012 , pageid , "" );
    
}

Q.layout.popupAnim_ = function (pageid, anim)
{
    Q.layout.qapp.serverko.appendEvent_( 2013 , pageid , anim );
    
}
    
Q.layout.clientPopupAnim = function (userID , pageid, anim)
{
    Q.layout.qapp.serverko.clientAppendEvent( userID , 2013 , pageid , anim );
}

Q.layout.clientPopupAnim_ = function (userID , pageid, anim)
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID , 2013 , pageid , anim );
    
}    
Q.layout.clear_ = function (pageid)
{
    Q.layout.qapp.serverko.appendEvent_( 2015 , pageid , "" );
}	

Q.layout.clientClear = function (userID , pageid)
{
    Q.layout.qapp.serverko.clientAppendEvent( userID , 2015 , pageid , "" );
}

Q.layout.clientClear_ = function (userID , pageid)
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID , 2015 , pageid , "" );
}	
	

Q.layout.hide_ = function (pageid)
{
    Q.layout.qapp.serverko.appendEvent_( 2020 , pageid , "" );
}

Q.layout.clientHide = function(userID ,pageid)
{
    Q.layout.qapp.serverko.clientAppendEvent( userID ,2020 , pageid , "" );
}

Q.layout.clientHide_ = function (userID ,pageid)
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID ,2020 , pageid , "" );
}

    
Q.layout.hideAnim_ = function (pageid , anim)
{
    Q.layout.qapp.serverko.appendEvent_( 2021 , pageid , anim );
}


Q.layout.clientHideAnim = function (userID , pageid, anim)
{
    Q.layout.qapp.serverko.clientAppendEvent(userID , 2021 , pageid , anim );
}


Q.layout.clientHideAnim_ = function (userID , pageid , anim)
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 2021 , pageid , anim );
}
    

Q.layout.editText_ = function (deftext, onreturn)
{
    Q.layout.qapp.serverko.appendEvent_( 1002 , deftext , onreturn );
}

    

Q.layout.anim_ = function (type, data)
{
    Q.layout.qapp.serverko.appendEvent_( 2030 , type , data );
}


Q.layout.clientAnim = function (userID , type, data)
{
    Q.layout.qapp.serverko.clientAppendEvent( userID , 2030 , type , data );
}

Q.layout.clientAnim_ = function (userID, type, data)
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 2030 , type , data );
}
    
  //------------------------------    


Q.layout.startUpdate = function()
{
	Q.layout.qapp.startUpdate();
}

Q.layout.sendUpdate = function()
{
	Q.layout.qapp.sendUpdate();
}   
  


Q.layout.clientAreaSetScrollers = function ( userID, area, loc)   
{
    Q.layout.qapp.serverko.clientAppendEvent( userID, 3400 , area , loc );
}

Q.layout.areaSetScrollers_ = function ( area, loc)   
{
    Q.layout.qapp.serverko.appendEvent_( 3400 , area , loc );
}

Q.layout.clientAreaSetScrollers_ = function ( userID, area, loc)   
{
    Q.layout.qapp.serverko.clientAppendEvent_( userID, 3400 , area , loc );
}


Q.camera.fitHud_ = function (xsz, ysz)
{
	Q.camera.qapp.appendEvent_( 2510 , "fit" , xsz + "," + ysz );
}    


Q.camera.projHud_ = function (fov, near, far)
{
	Q.camera.qapp.appendEvent_( 2512 , fov , near ,far);
}

Q.camera.proj_ = function (fov, near, far)
{
	Q.camera.qapp.appendEvent_( 2502 , fov , near , far);
}
    
Q.camera.set_ = function (x1, y1,z1 , x2,y2,z2)
{
	Q.camera.qapp.appendEvent_( 2501 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
}

Q.camera.fit_ = function (xsz, ysz)
{
	Q.camera.qapp.appendEvent_( 2500 , "fit" , xsz + "," + ysz );
}
        
Q.camera.setHud_ = function (x1, y1,z1 , x2,y2,z2)
{
	Q.camera.qapp.appendEvent_( 2511 , x1+","+y1+","+z1 , x2+","+y2+","+z2);
}

Q.connect.connect_ =  function (ip, callback)
{
	Q.connect.qapp.appendEvent_( 7000 , ip ,callback);    
}


Q.connect.join_ = function (roomid, user, callback)
{
    this.qapp.appendEvent_( 7001 , roomid+"|"+user ,callback);    
}

Q.connect.send_ = function (data)
{
    this.qapp.appendEvent_( 7002 , data,"");    
}


Q.connect.disconnect_ =  function ()
{
    this.qapp.appendEvent_( 7003 , "" , "" );    
}


Q.connect.set_ =  function (name, value)
{
    this.qapp.appendEvent_( 200 , name ,value);    
}

Q.settings.open_ = function ()
{
	Q.settings.qapp.appendEvent_( 2600 , "" ,"");
}
Q.settings.save_ = function ()
{
	Q.settings.qapp.appendEvent_( 2601 , "" ,"");
}

Q.settings.writeInt_ = function (name, value)
{
	Q.settings.qapp.appendEvent_( 2610 , name ,value);
}	

Q.settings.writeString_ = function (name, value)
{
	Q.settings.qapp.appendEvent_( 2611 , name ,value);
}	
	
Q.settings.loadInt_ = function (name, value)
{
	Q.settings.qapp.appendEvent_( 2620 , name , value );
}	
Q.settings.loadArray_ = function (name, value)
{
	Q.settings.qapp.appendEvent_( 2622 , name ,value);
}	
	
Q.settings.loadString_ = function (name, value)
{
	Q.settings.qapp.appendEvent_( 2621 , name ,value);
}
	
Q.client.allexec_ = function (delay, script)
{
	Q.client.qapp.appendEvent_( 101 , delay , script);
}
        
Q.client.exec_ = function (userID , delay, script)
{
	Q.client.qapp.clientAppendEvent_( userID, 101 , delay , script);
}
	
Q.anim.move_ = function( name, path, type, callback)
{
	Q.anim.qapp.appendEvent_( 4200 , name ,path,type,callback);
}

Q.anim.rotate_ = function( name, path, type, callback)
{
	Q.anim.qapp.appendEvent_( 4210 , name ,path,type,callback);
}
	

Q.objects.create_ = function (name,value)
{
	Q.objects.qapp.appendEvent_( 4100 , name ,value);
}		

Q.objects.place_ = function (name,value)
{
	Q.objects.qapp.appendEvent_( 4110 , name ,value);
}

Q.objects.remove_ = function (name,value)
{
	Q.objects.qapp.appendEvent_( 4150 , name ,value);
}	
		
Q.objects.scale_ = function (name,value)
{
	Q.objects.qapp.appendEvent_( 4120 , name ,value);
}	
	
Q.objects.rotate_ = function (name,value)
{
	Q.objects.qapp.appendEvent_( 4160 , name ,value);
}
	
Q.objects.texture_ = function (name,value)
{
	Q.objects.qapp.appendEvent_( 4130 , name ,value);
}		

Q.objects.state_ = function (name,value)
{
	Q.objects.qapp.appendEvent_( 4140 , name ,value);
}	
			
Q.objects.clientAdd = function (userID , objs)
{
	Q.objects.createObjects(objs , 0);
}
    
Q.objects.add_ = function (objs)
{
	Q.objects.createObjects(objs , 1);
}

Q.objects.clientAdd_ = function (userID , objs)
{
	Q.objects.createObjects(objs , 1);
}
    
Q.animations.add_ = function (adata)
{
	Q.animations.createAnim(adata , 1);
}  
    

Q.scores.login_ = function(callback)
{
	Q.scores.qapp.appendEvent_(500  , "" , callback);    
}            
Q.scores.submit_ = function(value, callback)
{
	Q.scores.qapp.appendEvent_(510 , value , callback);    
}
Q.scores.showscores_ = function(value , callback)
{
	Q.scores.qapp.appendEvent_(520 , value , callback);    
}    
Q.scores.reload_ = function(value , callback)
{
	Q.scores.qapp.appendEvent_(521 , value , callback);    
}    

Q.goUrl_ = function (type, url)
{
    Q.appendEvent_( 1200 , type, url );
}
    
Q.appendEvent_ = function(id, area, data, data2, data3, data4)
{
	Q.serverko.appendEvent_(id, area, data, data2, data3, data4);
}
    
Q.clientAppendEvent_ = function (userID , id, area, data, data2, data3, data4)
{
	Q.serverko.clientAppendEvent_(userID , id, area, data, data2, data3, data4);
}
    
Q.print_ = function (data)
{
	Q.layout.print_(data);
}
    
Q.event_ = function (id, delay, data) 
{
	Q.startUpdate(); 
	Q.serverko.sendEvent(id, delay, data) ;
	Q.sendUpdate();
}

Q.include_ = function (id)
{
	console.log( " include " + id);
	Q.include(id).now();
}

Q.load_ = function (id)
{
	Q.load(id).now();
}
    
Q.clientStartUpdate = function(userID)
{
	Q.serverko.clientStartData(userID);
}

Q.clientSendUpdate = function (userID)
{
	Q.serverko.clientSendData(userID);
}


Q.env.set_ = function (name, value)
{
	Q.env.qapp.appendEvent_( 200 , name ,value);    
}

Q.layout.add = Q.layout.add_;
Q.layout.clientAdd = Q.layout.clientAdd_;


Q.exec = Q.evals;
Q.exec_ = function(delay, script)
{
	Q.evals(delay, script).now();
}

Q.client.allexec = Q.client.alleval;
Q.client.exec = Q.client.eval;


