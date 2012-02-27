function Areas() 
{
	this.areas = [];
	this.mVisible = false;
};

function LayoutGrid( world,  app) 
{

	this.mVisibleAreas = [];
	this.mAreas = {};
	this.mAreasHud = {};
	this.mPageIds = {};
	this.mWorld = world;
	this.mApp = app;
	this.mPagePopup = "";
}

LayoutGrid.prototype.getWorld = function()
{
	return this.mWorld;
}


LayoutGrid.prototype.initLayout2 = function(response)
{
	// init layout
	var areas;
	areas = response["area"];

	for (var a=0; a< areas.length; a++)
	{
		//ServerkoAreaData* pCurr = [response.mAreaDatas objectAtIndex:a];
		var pCurr = areas[a];
		var area = this.processAreaData2(pCurr);
		var pageid = response["pageid"];
		this.addToPage(area,pageid);
		if (pageid =="*")
		{
			area.mPageVisible = true;
			area.updateState("visible",false);
		}
	}
}


LayoutGrid.prototype.processAreaData2 = function(areaData) {
		var type = areaData["type"];
		var id = areaData["id"];
		var areaold = this.getArea(id);
		if (areaold != undefined)
		{
			this.removeArea(areaold);
		}
		var area = this.createArea(type);
		if (area == undefined) {
				return undefined;
		}
		area.mWorld = this.mWorld;
		area.mParent = this;
		area.mID = areaData["id"];
		area.mParent = this;

		// process area data
		// area size
		if (areaData["size"] != undefined)
		{	        
			var size = areaData["size"];    
			area.setSize(size);
		}
		if (areaData["location"] != undefined)
		{
			var location = areaData["location"];
			area.updateLocation(location);
		}
		if (areaData["rotation"] != undefined)
		{
			var rotation = areaData["rotation"];
			area.setRotation(rotation);
		}		
		if (areaData["bounds"] != undefined)
		{
			var bounds = areaData["bounds"];
			area.updateBounds(bounds);
		}
		
		if (areaData["scrollers"] != undefined)
		{
			var bounds = areaData["scrollers"];
			area.setScrollers(bounds);
		}

		if (areaData["state"] != undefined)
		{
			var state = areaData["state"];
			area.updateState(state , true );
		}

		if (areaData["display"] != undefined)
		{	        
			var display = areaData["display"];
			area.updateDisplay(display);
		}
		if (areaData["layout"] != undefined)
		{	        
			var layout = areaData["layout"];    
			area.updateLayout(layout);
		}
		if (areaData["text"] != undefined)
		{	        
			var text = areaData["text"];    
			area.setText(text);
		}

		if (areaData["onclick"] != undefined)
		{	        
			var onclick = areaData["onclick"];    
			area.updateOnclick(onclick);
		}
		if (areaData["onfocusgain"] != undefined)
		{	        
			var onfocusgain = areaData["onfocusgain"];    
			area.updateOnFocusGain(onfocusgain);
		}
		if (areaData["onfocuslost"] != undefined)
		{	        
			var onfocuslost = areaData["onfocuslost"];    
			area.updateOnFocusLost(onfocuslost);
		}
		if (areaData["data"] != undefined)
		{	        	        
			var data = areaData["data"];    
			area.mData = data;
		}
	
		if (areaData["background"] != undefined)
		{	        	        
			var background = areaData["background"];    
			area.updateBackground(background);
		}
	
		if (areaData["foreground"] != undefined)
		{	        	        
			var foreground = areaData["foreground"];    
			area.updateForeground(foreground);
		}
		
		if (areaData["colors"] != undefined)
		{	        	        
			var colors = areaData["colors"];    
			area.updateColors(colors);
		}
		
		if (areaData["border"] != undefined)
		{	        	        
			var border = areaData["border"];    
			area.updateBorder(border);
		}
		
		if (areaData["fields"] != undefined)
		{	        	        
			var fields = areaData["fields"];    
			area.createFields(fields);
		}
		
		area.initLayout();

		if (areaData["items"] != undefined)
		{	        	        
			var items = areaData["items"];    
			area.createItems(items , false);
		}

		if (area.mDisplay == GameonWorld_Display.HUD) 
		{
			this.mAreasHud[area.mID] =  area;
		} else {
			this.mAreas[area.mID] = area;
		}
	
		area.createWorldModel();
		area.updateModelsTransformation();
		return area;
}


LayoutGrid.prototype.createArea = function(areaType) {

	var type = undefined, subtype = undefined;

	// area owner
	var tok = areaType.split(".");

	if (tok.length > 0) {
		type = tok[0];
	}
	if (tok.length > 1) {
		subtype = tok[1];
	}

	if (type == undefined) {
		return undefined;
	}

	if (type == "table") {
		return new LayoutAreaTable(subtype , this.mApp);
	} else if (type == "text") {
		return new LayoutAreaText(subtype , this.mApp);
	} else if (type == "layout") {
		return new LayoutAreaLayout(subtype , this.mApp);
	} else if (type == "cards") {
		return new LayoutAreaCards(subtype , this.mApp);
	} ///////////////
	else {
		return undefined;
	}
}


LayoutGrid.prototype.moveFigure = function(areaFrom, indexFrom, areaTo,indexTo) 
{

	var item = undefined;
	var arearemove = undefined;
	var areaset = undefined;

	arearemove = this.getArea(areaFrom);
	areaset = this.getArea(areaTo);
	 if (arearemove != undefined) {
		item = arearemove.getItem(indexFrom);
		arearemove.removeFigure(indexFrom);
	}
	 
	if (item == undefined) {
		return;
	}
	if (areaset != undefined) {
		areaset.placeFigure(indexTo, item, false);
	}
}

LayoutGrid.prototype.setAreaState = function(areaid , strState) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		area.updateState(strState, false);
	}
}


LayoutGrid.prototype.setAreaLocation = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		//area.clear();
		area.updateLocation(strData);
	}
}

LayoutGrid.prototype.setAreaRotation = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		//area.clear();
		area.setRotation(strData);
	}
}

LayoutGrid.prototype.setAreaScrollers = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		area.setScrollers(strData);
	}
}

LayoutGrid.prototype.setAreaScale = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		area.setScale(strData);
	}
}

LayoutGrid.prototype.setAreaItemScale = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		area.setItemScale(strData);
	}
}


LayoutGrid.prototype.setAreaSize = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		area.setSize(strData);
	}
}

LayoutGrid.prototype.areaDataUpdate = function(areaID , strData) {
	var area = this.getArea(areaID);
	if (area != undefined) {
		area.updateData(strData);
	}

}


LayoutGrid.prototype.getArea = function(ID) {
	
	//console.log("getArea " + ID );
	var area = this.mAreas[ID];
	if (area != undefined)
	{
		//console.log("return " + area.mID );
		return area;
	}

	var areahud = this.mAreasHud[ID];
	if (areahud != undefined)
	{
		//console.log("return hud " + areahud.mID );
		return areahud;
	}
	
	return undefined;
}

LayoutGrid.prototype.areaFieldSetItem = function(itemID, areaID, index) {

	var area = this.getArea(areaID);
	if (area != undefined) {
		area.fieldSetItem(index, itemID);
	}

}

LayoutGrid.prototype.areaUpdateItems = function(areaID , strData) {

	var area = this.getArea(areaID);
	if (area != undefined) {
		area.updateItems(strData);
	}

}

LayoutGrid.prototype.areaUpdateText = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		//console.log(" area update text " + area.mID + " " + strData );
		area.setText(strData);
	}
}

LayoutGrid.prototype.areaUpdateTextColor = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		//console.log(" area update text " + area.mID + " " + strData );
		area.setTextColor(strData);
	}
}

LayoutGrid.prototype.onAreaDelete = function(areaID , strData) {
/*    	
	System.out.println(" _________________________ " );
	for (var a=0; a< this.mVisibleAreas.length; a++)
	{
		LayoutArea ar = this.mVisibleAreas[a];
		System.out.println( ar.mID);
	}
	System.out.println(" _________________________ " );

*/    	
	var area = this.getArea(areaID);
	if (area != undefined)
	{
		this.removeArea(area);
	}
	/*
	System.out.println(" +++++++++++++++++++++++++++ " );
	for (var a=0; a< this.mVisibleAreas.length; a++)
	{
		LayoutArea ar = this.mVisibleAreas[a];
		System.out.println( ar.mID);
	}
	System.out.println(" +++++++++++++++++++++++++++ " );
	*/
	return;
}

LayoutGrid.prototype.clearArea = function(areaID) {

	if (areaID== "*") {
		for (var a = this.mAreas.length - 1; a >= 0; a--) {
			this.mAreas[a].clear();
		}
	} else {
		var area = this.getArea(areaID);
		if (area != undefined) {
			area.clear();
		}
	}

}


LayoutGrid.prototype.areaUpdateForeground = function(areaid , strData) {

	var area = this.getArea(areaid);
	if (area != undefined) {
		area.updateForeground(strData);
	}

}

LayoutGrid.prototype.areaUpdateBackground = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		area.updateBackground(strData, true);
	}
}


LayoutGrid.prototype.areaUpdateFields = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		area.updateFields(strData);
	}
}

LayoutGrid.prototype.areaUpdateLayout = function(areaid , strData) {
	var area = this.getArea(areaid);
	if (area != undefined) {
		area.updateLayout(strData);
	}
}

LayoutGrid.prototype.onAreaUpdateLocation = function(areaID , strData) {
	var area = this.getArea(areaID);
	if (area != undefined) {
		area.updateLocation(strData);
	}

}

LayoutGrid.prototype.removeFigure = function(areaID, indexFrom) {
	var area = this.getArea(areaID);
	if (area != undefined) {
		area.removeFigure(indexFrom);
	}

}


LayoutGrid.prototype.onAreaUpdateOnclick = function(areaID, data) {
	var area = this.getArea(areaID);
	if (area != undefined) {
		area.updateOnclick(data);
	}
	
}

LayoutGrid.prototype.onAreaUpdateOnFocusLost = function(areaID, data) {
	var area = this.getArea(areaID);
	if (area != undefined) {
		area.updateOnFocusLost(data);
	}
	
}

LayoutGrid.prototype.onAreaUpdateOnFocusGain = function(areaID, data) {
	var area = this.getArea(areaID);
	if (area != undefined) {
		area.updateOnFocusGain(data);
	}
	
}

LayoutGrid.prototype.clearAll = function() {
	this.mAreas.clear();
	this.mAreasHud.clear();

}


LayoutGrid.prototype.onEvent2 = function(response)
{

	var respid = response["id"];
	var respdata = response["data"];
	var resptype = response["type"];
	var respdata2 = response["data2"];
	var respdata3 = response["data3"];
	var respdata4 = response["data4"];
	
	var eventid = parseInt( respid);
	switch (eventid) 
	{
		case 2012:
			this.mPagePopup = resptype;			  
		case 2010:
			this.showPage(resptype , undefined);
			break;
		case 2013:
			this.mPagePopup = resptype;
		case 2011:
			this.showPage(resptype , respdata);
			break;			
		  case 2015:
				this.clearPage(resptype);			
		case 2020:
			if (this.mPagePopup == resptype)
				this.mPagePopup = "";
		
			this.hidePage(resptype , undefined);
			break;
		case 2021:
			if (this.mPagePopup == resptype)
				this.mPagePopup = "";
		
			this.hidePage(resptype , respdata);
			break;            
		case 2030:
			this.animScreen(resptype , respdata);
			break;            			
		case 2500:
			this.onCameraFit(resptype , respdata);
			break;
		case 2501:
			this.onCameraSet(resptype , respdata);
			break;
		case 2502:
			this.onCameraProj(resptype , respdata ,respdata2);
			break;         
		case 2510:
			this.onCameraFitHud(resptype , respdata);
			break;
		case 2511:
			this.onCameraSetHud(resptype , respdata);
		break;
		case 2512:
			this.onCameraProjHud(resptype , respdata , respdata2);
		break;		  
		 case 3001:
			  this.onAreaDelete(resptype, respdata);
		 break;				    
		case 3002:
			  this.onAreaClear(resptype, respdata, true);
		break;
		case 3003:
			this.onAreaSwapId(resptype, respdata);
		break;			                   
		case 3004:
			this.onAreaClear(resptype, respdata, false);
			break;		
		case 3050:
			 this.onAreaFieldSetItem(resptype, respdata);
		 break;
			 
		case 3051:	// figure move
			this.onAreaFieldMoveItem(resptype, respdata);
		 break;
		case 3053:	// figure move
			this.onAreaFieldMoveItemA(resptype, respdata);
		 break;
		case 3054:	// figure move
			this.onItemsAnim(resptype, respdata);
		 break;              
		case 3055:	// figure move
			this.onItemAnim(resptype, respdata);
		 break;              
			
		case 3052:
			 this.onAreaFieldRemoveItem(resptype, respdata);
		break;
		  
		case 3110:	// area new state
			 this.setAreaState(resptype, respdata);
			 break;
		case 3130:	// area new state
			  this.setAreaSize(resptype, respdata);
		break;
		case 3190:	// area new state
			this.setAreaLocation(resptype, respdata);
		break;
		case 3191:	// area new state
			this.setAreaScale(resptype, respdata);
		break;	
		case 3195:	
			this.setAreaRotation(resptype, respdata);
		break;              
		case 3192:	
			this.setAreaItemScale(resptype, respdata);
		break; 
		
		case 3220:
			this.onAreaUpdateItems(resptype, respdata);
		break;
		case 3221:
			this.onAreaUpdateItemsA(resptype, respdata);
		break;
		case 3222:
			this.onAreaUpdateItem(resptype, respdata, false);
		 break;
		case 3223:              
			this.onAreaInvertItem(resptype , respdata );
		break;
		case 3224:
			this.onAreaUpdateItem(resptype, respdata, true);
		break;
		case 3225:
		  this.onAreaPushFrontItem(resptype, respdata);
		 break;	              
		case 3240:
		  this.areaUpdateForeground(resptype, respdata);
		break;
		case 3250:
			this.areaUpdateBackground(resptype, respdata);
		 break;

		case 3200:
			this.onAreaUpdateOnclick(resptype, respdata);
		 break;
		case 3201:
			this.onAreaUpdateOnFocusGain(resptype, respdata);
		 break;		
		case 3202:
			this.onAreaUpdateOnFocusLost(resptype, respdata);
		 break;		 
		case 3180:
			this.areaUpdateText(resptype, respdata);
		break;
		case 3120:
			this.areaUpdateTextColor(resptype, respdata);
		break;			
		case 3400:
			this.areaSetScrollers(resptype, respdata);
		break;
		case 3210:
			this.areaAnim(resptype, respdata  , respdata2 , respdata3);
		break;		
	}		  
	

}

LayoutGrid.prototype.areaAnim = function(areaid, type, delay, data)
{
	var area = this.getArea(areaid);
	if (area != undefined) {
		area.anim(type, delay , data);
	}
	
}

LayoutGrid.prototype.onAreaClear = function(type , strData) {
	var area = this.getArea(type);
	if (area != undefined) {
		area.clear(false);
	}
	
}



LayoutGrid.prototype.onItemsAnim = function(type , strData) {
	var area = this.getArea(type);
	if (area != undefined) {
		area.itemsAnim(strData);
	}
	
}
LayoutGrid.prototype.onItemAnim = function(type , strData) {
	var area = this.getArea(type);
	if (area != undefined) {
		var tok = strData.split("|");
		var indexes = tok[0];
		var animtype = tok[1];

		area.itemAnim(indexes, animtype);
	}
	
}



LayoutGrid.prototype.onAreaPushFrontItem = function(type , strData) {
	var area = this.getArea(type);
	if (area != undefined) {
		area.pushFrontItem(strData);
	}
	
}
LayoutGrid.prototype.onAreaUpdateItemsA = function(type , strData) {
	var area = this.getArea(type);
	if (area != undefined) {
		area.updateItemsA(strData);
	}

}



LayoutGrid.prototype.onAreaFieldSetItem = function(type , strData) {
	var tok = strData.split(",");

	var areaid = tok[0];
	var index = parseInt(tok[1]);
	var area = this.getArea(areaid);
	if (area != undefined) {
		area.fieldSetItem(index , type);
	}

}

LayoutGrid.prototype.onAreaFieldMoveItem = function(type , strData) {
	// areaFrom, indexFrom,  areaTo, indexTo
	var tok = strData.split(",");
	var areaFrom = tok[0];
	var indexFrom = parseInt(tok[1]);
	var areaTo = tok[2];
	var indexTo = parseInt(tok[3]);

	this.moveFigure(areaFrom, indexFrom, areaTo, indexTo);
}

LayoutGrid.prototype.onAreaFieldMoveItemA = function(type, strData) {
	// areaFrom, indexFrom,  areaTo, indexTo
	var tok = strData.split(",");
	var areaFrom = tok[0];
	var indexFrom = parseInt(tok[1]);
	var areaTo = tok[2];
	var indexTo = parseInt(tok[3]);

	var movetype = tok[4];
	var delay = tok[5];
	
	var path = [];
	for (var a = 6; a< tok.length ; a+=2 ) 
	{
		var p = new AreaIndexPair();
		p.mArea = tok[a];
		p.mIndex = parseInt(tok[a+1]);
		path.push(p);
	}
	this.moveFigureA(areaFrom, indexFrom, areaTo, indexTo, movetype, delay, path);
}

LayoutGrid.prototype.onAreaFieldRemoveItem = function(type, strData) {
	var indexFrom = parseInt(strData);
	var area = this.getArea(type);
	if (area != undefined) {
		area.removeFigure(indexFrom);
	}
}
LayoutGrid.prototype.onAreaUpdateItems = function(type, strData) {
	var area = this.getArea(type);
	if (area != undefined) {
		area.updateItems(strData);
	}
}

LayoutGrid.prototype.onAreaInvertItem = function(type,  strData)
{
	var area = this.getArea(type);
	if (area != undefined) {
		area.invertItem(strData);
	}		
}

LayoutGrid.prototype.onAreaUpdateItem = function(type, strData, showback) {
	var area = this.getArea(type);
	if (area != undefined) {
		area.updateItem(strData, showback);
	}		
}

LayoutGrid.prototype.moveFigureA = function(areaFrom, indexFrom, areaTo, indexTo,  movetype, delay , path) {
	//System.out.println(  "moveFigureA " + areaFrom + " " + indexFrom + " "+ areaTo + " " + indexTo);
	if (indexFrom < 0 || indexTo < 0)
	{
		console.error(  "moveFigureA " + areaFrom + " " + indexFrom + " "+ areaTo + " " + indexTo);
		return;
	}
	// TODO move animation
	var startAnim = undefined;
	var endAnim = undefined;
	var item = undefined;
	var arearemove = undefined;
	var areaset = undefined;

	arearemove = this.getArea(areaFrom);
	areaset = this.getArea(areaTo);
	//
	if (arearemove != undefined) {
		item = arearemove.getItem(indexFrom);
		if (item == undefined) {
			// ERROR
			//Log.d("model", "error " + areaFrom + " " + indexFrom + " "+ areaTo + " " + indexTo);
			return;
		}
		
		startAnim = new GameonModelRef(undefined);
		startAnim.copy( item.mModelRef);
		startAnim.copyMat( item.mModelRef);
		arearemove.removeFigure(indexFrom);
	}
	 
	if (item == undefined) {
		return;
	}
	
	if (areaset != undefined) {
		if (movetype== "walk2back")
		{
			areaset.placeFigure(indexTo, item, true);
		}else
		{
			areaset.placeFigure(indexTo, item, false);
		}
		endAnim = item.mModelRef;
	}

	if (startAnim != undefined && endAnim != undefined) {
		this.mApp.anims().animRef(movetype, startAnim , endAnim, delay);
	}
}



LayoutGrid.prototype.pathRefsFromPath = function(pathrefs,path, item) {

	var area;
	//Log.d("model", "path size " + path.length);
	for (var a=0; a< path.length; a++) 
	{
		
		area = this.getArea(path[a].mArea);
		if (area != undefined) {
			// remove allocations
			var pos = new GameonModelRef(undefined);
			area.getModelRef( path[a].mIndex, pos, item);
			//Log.d("model" , " path = " + path[a].mArea + " " + path[a].mIndex);
			pathrefs.push(pos);
		}
	}

}

LayoutGrid.prototype.onDragNearest = function(vec, vecHud)
{
	return this.findNearest(vec, vecHud, false);
}
LayoutGrid.prototype.onClickNearest = function(vec, vecHud) 
{
	return this.findNearest(vec, vecHud, true);
}


LayoutGrid.prototype.findNearest = function(vec, vecHud , click) 
{
	var nearest = undefined;    	
	var mindist = 1e7;

	for (var a=this.mVisibleAreas.length-1; a>=0 ; a--)
	{
		var ahud = this.mVisibleAreas[a];
		
		if (ahud.mActiveItems == 0)
		{
			continue;
		}		
		
		if (click == true)
		{
			if ( ahud.mOnclick == undefined || ahud.mOnclick.length == 0 )
				continue;
		}else
		{
        		if (!ahud.mHasScrollV && !ahud.mHasScrollH)
        		{
		
					if ( (ahud.mOnFocusGain== undefined || ahud.mOnFocusGain.length == 0) &&  
						(ahud.mOnFocusLost== undefined || ahud.mOnFocusLost.length == 0))
						continue;
				}
		}
		
		if (ahud.mDisplay != GameonWorld_Display.HUD)
		{
			continue;
		}
		var pair = ahud.fieldClicked(this.mApp.cs().eyeHud() , vecHud);
		if (pair != undefined)
		{
			if (pair.mDist <= mindist) {
				// set nearest
				nearest = pair;
				mindist = pair.mDist;
			}        		
		}
	}
	if (mindist != 1e7){
		return nearest;
	}        
	for (var a= this.mVisibleAreas.length-1; a>=0 ; a--)
	{
		var ahud = this.mVisibleAreas[a];
		if (ahud.mActiveItems == 0)
		{
			continue;
		}
		
		if (click == true)
		{
			if ( ahud.mOnclick == undefined || ahud.mOnclick.length == 0 )
				continue;
		}else
		{
			if (!ahud.mHasScrollV && !ahud.mHasScrollH)
			{		
				if ( (ahud.mOnFocusGain== undefined || ahud.mOnFocusGain.length == 0) &&  
					(ahud.mOnFocusLost== undefined || ahud.mOnFocusLost.length == 0))
					continue;
			}
		}
		
		if (ahud.mDisplay == GameonWorld_Display.HUD)
		{
			continue;
		}
		var pair = ahud.fieldClicked(this.mApp.cs().eye() , vec);
		if (pair != undefined)
		{
			if (pair.mDist <= mindist) {
				// set nearest
				nearest = pair;
				mindist = pair.mDist;
			}        		
		}
	}        
	
	if (mindist != 1e7){
		return nearest;
	}    	
	
	return undefined;
}

/*
LayoutGrid.prototype.onClickNearest = function(x, y, xhud, yhud, div, divhud) {
	// find first if HUD is clicked
	for (var a=this.mVisibleAreas.length-1; a>=0 ; a--)
	{
		var ahud = this.mVisibleAreas[a];
		if (ahud.mDisplay != LayoutArea_Display.HUD)
			continue;
		if (ahud.mState != LayoutArea_State.VISIBLE)
		{
			continue;
		}
			
		var pair = ahud.fieldClicked(xhud,yhud);
		if (pair != undefined)
		{
			//Log.d("model" , " found hud");
			return pair;
		}
	}
	
	for (var a=this.mVisibleAreas.length-1; a>=0 ; a--)
	{
		var area = this.mVisibleAreas[a];
		if (area.mDisplay == LayoutArea_Display.HUD)
			continue;
		if (area.mState != LayoutArea_State.VISIBLE)
		{
			continue;
		}        
		
		var pair = area.fieldClicked(x,y);
		if (pair != undefined)
		{
			//Log.d("model" , " found hud");
			return pair;
		}
	}

	
	var nearest =undefined;    	
	var mindist = 10000000;
	for (var a=this.mVisibleAreas.length-1; a>=0 ; a--)
	{
		var area = this.mVisibleAreas[a];
		if (area.mDisplay != LayoutArea_Display.HUD)
			continue;
		
		if (area.mState != LayoutArea_State.VISIBLE)
		{
			continue;
		}

		var pair = area.fieldClickNearest(xhud,yhud);
		if (pair != undefined)
		{
			if (pair.mDist < mindist && pair.mDist < divhud) {
				// set nearest
				nearest = pair;
				mindist = pair.mDist;
				
			}
		}
				}
	if (mindist != 10000000){
		return nearest;
	}

	nearest =undefined;    	
	 mindist = 10000000;
	for (var a=this.mVisibleAreas.length-1; a>=0 ; a--)
	{
		var area = this.mVisibleAreas[a];
		if (area.mDisplay != LayoutArea_Display.NONE)
			continue;
		
		if (area.mState != LayoutArea_State.VISIBLE)
		{
			continue;
		}

		var pair = area.fieldClickNearest(x,y);
		if (pair != undefined)
		{
			if (pair.mDist < mindist && pair.mDist < div) {
				// set nearest
				nearest = pair;
				mindist = pair.mDist;
			}
		}
	}
	if (mindist != 10000000){
		return nearest;
	}
	
	
	return undefined;
}
*/

LayoutGrid.prototype.onCameraFit = function(type , strData)
{
	
	if ( type== "fit")
	{
		var tok = strData.split(",");
		var canvasw = 0;
		var canvash = 0;
		if (tok.length > 1)
		{
			canvasw = parseFloat( tok[ 0 ]);
			canvash = parseFloat( tok[ 1 ]);
		}

		var eye = new Array( 0.0,0.0,1);
		var center = new Array(  0.0, 0.0, 0.0);
		var up = new Array(  0.0, 1.0, 0.0 );
		this.mApp.cs().init( canvasw/2 , canvash/2 , 0 );
		var z = this.mApp.cs().snap_cam_z(eye  ,  center , up); 
		this.mApp.setScreenBounds();
	}
}

LayoutGrid.prototype.onCameraSet = function(lookAt , eyeStr)
{
	
	var tok = lookAt.split( ","); 
	var lookat = new Array(3);
	if (tok.length > 0) lookat[0] = parseFloat( tok[0]);
	if (tok.length > 1) lookat[1] = parseFloat( tok[1]);
	if (tok.length > 2) lookat[2] = parseFloat( tok[2]);
		
	var tok2 =  eyeStr.split(","); 
	var eye = Array(3);
	if (tok2.length > 0) eye[0] = parseFloat( tok2[0]);
	if (tok2.length > 1) eye[1] = parseFloat( tok2[1]);
	if (tok2.length > 2) eye[2] = parseFloat( tok2[2]);

	this.mApp.cs().setCamera(lookat, eye);
	this.mApp.setScreenBounds();
}

LayoutGrid.prototype.onCameraFitHud = function(type , strData)
{
  
	if ( type == "fit")
	{
		var tok = strData.split(",");
		var canvasw = 0;
		var canvash = 0;
		if (tok.length > 1)
		{
			canvasw = parseFloat( tok[0]);
			canvash = parseFloat( tok[1]);
		}
		var eye = new Array( 0.0,0.0,1);
		var center = new Array( 0.0, 0.0, 0.0);
		var up = new Array( 0.0, 1.0, 0.0 );
		this.mApp.cs().init( canvasw/2 , canvash/2 , 0 );
		var z = this.mApp.cs().snap_cam_z_hud(eye  ,  center , up);
		this.mApp.setScreenBounds();
	}
}

LayoutGrid.prototype.onCameraSetHud = function(lookAt , eyeStr)
{
	var tok = lookAt.split( ","); 
	var lookat = new Array(3);
	if (tok.length > 0) lookat[0] = parseFloat( tok[0]);
	if (tok.length > 1) lookat[1] = parseFloat( tok[1]);
	if (tok.length > 2) lookat[2] = parseFloat( tok[2]);
		
	var tok2 =  eyeStr.split(","); 
	var eye = new Array(3);
	if (tok2.length > 0) eye[0] = parseFloat( tok2[0]);
	if (tok2.length > 1) eye[1] = parseFloat( tok2[1]);
	if (tok2.length > 2) eye[2] = parseFloat( tok2[2]);

	this.mApp.cs().setCameraHud(lookat, eye);
	this.mApp.setScreenBounds();
	
}


LayoutGrid.prototype.onCameraProjHud = function(fov , far , near )
{
	var fovf = parseFloat(fov);
	var farf = parseFloat(far);
	var nearf = parseFloat(near);
	
	this.mApp.view().setFovHud( fovf, farf, nearf);
	this.mApp.setScreenBounds();
}

LayoutGrid.prototype.onCameraProj = function(fov , far , near)
{
	var fovf = parseFloat(fov);
	var farf = parseFloat(far);
	var nearf = parseFloat(near);
	
	this.mApp.view().setFov( fovf, farf, nearf);
	this.mApp.setScreenBounds();
}


LayoutGrid.prototype.setVisibleArea = function(area , visible)
{
	var areas = this.mPageIds[area.mPageId];
	if (areas == undefined)
	{
		return;
	}
	var pagevis = areas.mVisible;
	if (visible && pagevis)
	{
		
		if ( this.mVisibleAreas.indexOf(area) < 0)
		{
			this.mVisibleAreas.push(area);
		}
	}else if (!visible){
		var  i = this.mVisibleAreas.indexOf(area);
		if ( i >= 0)
		{
			this.mVisibleAreas.splice(i,1);
		}
	}

}

LayoutGrid.prototype.addToPage = function(area , pageid)
{
	if (area == undefined)
	{
		return;
	}
	
	var areas =this.mPageIds[pageid];
	if (areas == undefined)
	{
		areas = new Areas();
		if (pageid == "*")
		{
			areas.mVisible = true;
		}		
		
		this.mPageIds[pageid] = areas;
	}
	area.mPageId = pageid;
	if (areas.areas.indexOf(area) < 0)
	{
		areas.areas.push(area);
		area.mPageVisible = areas.mVisible;
	}
}


LayoutGrid.prototype.showPage = function(pageid , respdata)
{
	var areas = this.mPageIds[pageid];
	
	if (areas == undefined)
	{
		return;
	}
	//System.out.println(" show page " + pageid);
	areas.mVisible = true;
	for (var a =0 ; a< areas.areas.length; a++)
	{
		var area = areas.areas[a];
        if (respdata != undefined)
		{
			area.initAnim(respdata , false);            
		}  		
		area.mPageVisible = true;
		area.setInitState();
	}
}

LayoutGrid.prototype.hidePage = function(pageid , respdata)
{

	var areas = this.mPageIds[pageid];
	if (areas == undefined)
	{
		return;
	}
	areas.mVisible = false;
	var delay = 0;
	for (var a =0 ; a< areas.areas.length; a++)
	{
		var area = areas.areas[a];
		if (respdata != undefined)
		{
			delay = area.initAnim(respdata, true);
		}else
		{
			area.mPageVisible = false;
			area.setInitState();
		}
	}
	if (respdata != undefined)
	{
		this.mApp.sendExec(delay , "Q.layout.hide_('"+pageid+"');");
	}	
}

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


LayoutGrid.prototype.removeArea = function(area)
{
	area.clear(true);
	if ( this.mVisibleAreas.indexOf(area) >= 0)
	{
		array_removeElement(this.mVisibleAreas, area);
	}
	if ( this.mAreas[area.mID] != undefined)
	{
		array_removeElement(this.mAreas , area);
	}
	if ( this.mAreasHud[area.mID] != undefined )
	{
		array_removeElement(this.mAreasHud , area);
	}
	var areap = this.mPageIds[area.mPageId];
	if (areap != undefined)
	{
		array_removeElement(areap.areas , area);
	}

	
}

LayoutGrid.prototype.onAreaSwapId = function(areaid1, areaid2)
{
	var area1 = this.getArea(areaid1);
	var area2 = this.getArea(areaid2);
	if (area1 == undefined || area2 == undefined)
	{
		return;
	}
	if ( this.mAreas[area1.mID] != undefined)
	{
		array_removeElement(this.mAreas, area1);
	}
	if ( this.mAreas[area2.mID] != undefined)
	{
		array_removeElement(this.mAreas , area2);
	}
	
	var id = area1.mID;
	area1.mID = area2.mID;
	area2.mID = id;

	this.mAreas[area1.mID] = area1;
	this.mAreas[area2.mID] = area2;
	
}


LayoutGrid.prototype.animScreen = function(resptype, respdata)
{
	if (resptype == "color")
	{
		//"1000,FFFFFFFF,00000000,FFFFFFFF"
		var tok =  respdata.split(",");
		
		var color1 = this.mApp.colors().white;
		var color2 = this.mApp.colors().black;
		var color3 = undefined;
		
		
		var delay = parseInt( tok[0] );
		if (tok.length > 1)
			color1 = this.mApp.colors().getColor(tok[1]);
		if (tok.length > 2)
			color2 = this.mApp.colors().getColor(tok[2]);
		if (tok.length > 3)
			color3 = this.mApp.colors().getColor(tok[3]);    
		
		this.mApp.anims().createAnimColor( delay, color1, color2, color3);
		
	}
}

LayoutGrid.prototype.clearPage = function(pageid) {
	var areas = this.mPageIds[pageid];
	if (areas == undefined)
	{
		return;
	}
	
	this.hidePage(pageid, undefined);
	
	var len = areas.areas.length;
	for (var a=0; a < len; a++)
	{
		var area = areas.areas[a];
		area.clear(true);
	}
	delete this.mPageIds[areas];
}
