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


Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
} 

var LayoutArea_Border =  {

	NONE:0,
	THINRECT:1
}  


var LayoutArea_Type =  {

	NONE:0,
	TEXT:1,
	LABEL:2,
	TABLE:3,
	BUTTON:4,
	LAYOUT:5,
	CARDS:6
}  


LayoutArea_State =  {

	NONE:0,
	VISIBLE:1,
	HIDDEN:2
}


LayoutArea_Layout=  {

	NONE:0,
	HORIZONTAL:1,
	VERTICAL:2,
	NORTH_WEST:3,
	NORTH_EAST:4,
	SOUTH_WEST:5,
	SOUTH_EAST:6,
	DIAMOND:7,
	CIRCLE:8,
	SQUARE:9,
	NORTH_SOUTH:10,
	EAST_WEST:11,
	SOUTH_NORTH:12,
	WEST_EAST:13
}

LayoutArea_TextAlign=  {

	NONE:0,
	NORTH:1,
	SOUTH:2,
	WEST:3,
	EAST:4,
	NORTH_WEST:5,
	NORTH_EAST:6,
	SOUTH_WEST:7,
	SOUTH_EAST:8,
	CENTER:9
}

LayoutArea_FieldItemType=  {

	ITEM:0,
	TEXT:1,
	TEXTH:2
}


function LayoutArea() 
{
/*
  this.mApp = app;
    this.mID= undefined;
    this.mBounds = [1,1,1];
    this.mLocation = [0,0,0,0,0];
    this.mRotation = [0,0,0];
    this.mScale = [1,1,1];

    this.mType = LayoutArea_Type.NONE;
    this.mState = LayoutArea_State.VISIBLE;
    this.mInitState = LayoutArea_State.VISIBLE;
    this.mOwner = [];
    this.mParent =  undefined;
    this.mLayout = LayoutArea_Layout.NONE;
    this.mDisplay = GameonWorld_Display.WORLD;
    this.mItemFields = [];
    this.mText = undefined;
    this.mData = undefined;
    this.mSize = 0;
    this.mSizeW = 0;
    this.mSizeH = 0;
    this.mColorForeground = undefined;
    this.mColorForeground2 = undefined;
    this.mColorBackground = undefined;
    this.mColorBackground2 = undefined;
    this.mOnclick = undefined;
	this.mOnFocusLost = undefined;
	this.mOnFocusGain = undefined;
	this.world() = undefined;
	this.mPageId = undefined;
	
	this.mModel = undefined;// = new GameonModel();
    this.mModelBack = undefined;

	this.mSubType = LayoutAreaCards_SubType.NONE;
	
	this.mColors = new Array(4);
	this.mColors[0] = this.mApp.colors().white;
	this.mColors[1] = this.mApp.colors().white;
	this.mColors[2] = this.mApp.colors().white;
	this.mColors[3] = this.mApp.colors().white;
*/	

}


LayoutArea.prototype.removeFigure  = function(index) {
	// TODO Auto-generated method stub
	if (index >= 0 && index < this.mItemFields.length) {
		this.mItemFields[index].removeFigure();
	}
}



LayoutArea.prototype.updateData  = function(strData) {
	// TODO Auto-generated method stub
}

LayoutArea.prototype.setDisplay  = function(state, delay) {
	this.mDisplay = state;

}


LayoutArea.prototype.setTextColor = function(strData) 
{
	for (var a=0; a< this.mItemFields.length; a++) 
	{
		var f = this.mItemFields[a];
		if (f.mText != undefined)
		{
			f.mText.setOffset( parseInt( strData) );
		}
	}    	
}

LayoutArea.prototype.setText_impl  = function(strData) {
	//console.log( " area set text impl  " + this.mID + " " + strData );
	if (strData.indexOf("#64#") == 0)
	{
		this.mText = base64_decode(strData.substring(4));
	}else
	{
		this.mText = strData;
	}   	
}

LayoutArea.prototype.setText  = function(strData) {
	this.setText_impl(strData);
}

LayoutArea.prototype.setText_S  = function(strData) {
	this.setText_impl(strData);
}

LayoutArea.prototype.fieldSetItem  = function(index, itemID) {

	if (index >= 0 && index < this.mSize) {
		this.setField(index);
		this.mItemFields[index].setItem(itemID, false , false);
	}
}

LayoutArea.prototype.updateDisplay  = function(strData) {
	var style = strData;
	var delay = 0;
	var closeonclick = false;

	if (style == "hud") {
		this.mDisplay = GameonWorld_Display.HUD;
	}else
	{
		this.mDisplay = GameonWorld_Display.WORLD;	
	}

}

LayoutArea.prototype.onKey  = function(keyCode) {
	return false;
}

LayoutArea.prototype.findField  = function(x, y) {
	for (var a = 0; a < this.mItemFields.length; a++) {
		if (this.mItemFields[a].isInside(x, y) == true) {
			return a;
		}
	}
	return -1;
}

LayoutArea.prototype.clear = function(all) {
	
	if (this.mModelBack != undefined && all == true)
	{
		this.mApp.world().remove(this.mModelBack);
		this.mModelBack = undefined;
	}
	
	if (this.mModel != undefined && all == true)
	{
		this.mApp.world().remove(this.mModel);
		this.mModel = undefined;
		
	}    	
	this.mText = "";
	this.mData = "";
	for (a = 0; a < this.mItemFields.length; a++) {
		this.mItemFields[a].clear();
	}
	this.mOwner  = [];
}


LayoutArea.prototype.updateForeground  = function(strData) {
	if (strData == "none") {
		this.mColorForeground = undefined;
	} else {
		// for now color only
		var tok = strData.split(",");
		if (tok.length > 0)
			this.mColorForeground = this.mApp.colors().getColor(tok[0]);
		if (tok.length > 1)
		{
			this.mColorForeground2 = this.mApp.textures().getTexture(tok[1]);
			if (this.mModel != undefined)
			{
				this.mModel.mTextureID = this.mColorForeground2;
			}
		}
	}	
}

LayoutArea.prototype.updateBackground  = function(strData , clear) {
	if (strData == "none") {
		this.mColorBackground = undefined;
	} else {
		//for now color only
		var tok = strData.split(",");
		if (tok.length > 0)
			this.mColorBackground = this.mApp.colors().getColor(tok[0]);
		if (tok.length > 1)
		{
			this.mColorBackground2 = this.mApp.textures().getTexture(tok[1]);
			this.mStrColorBackground2 = tok[1];
			if (this.mModelBack != undefined)
			{
				this.mModelBack.mTextureID = this.mColorBackground2;
			}
		}

	}
	if (clear)
	{
		if (this.mStrColorBackground2 != undefined && this.mModelBack != undefined)
		{
			var tok = this.mStrColorBackground2.split(".");
			var back = tok[0];
			if (tok.length > 1)
			{
				var text = mApp.textures().getTexture(back);
				var n = parseInt( tok[1] );
				var w = parseInt( tok[2] );
				var h = parseInt( tok[3] );

				this.mModelBack.setTexture(text);
				var ref = mModelBack.ref(0);
				ref.mOwner = n;
				ref.mTransformOwner = true;
				this.mModelBack.setTextureOffset( w , h);
				ref.mOwnerMax = w * h;
				this.mModelBack.mSubmodels = w * h;
			}
		}	
	}
	
}


LayoutArea.prototype.updateLayout  = function(areaLayout) {
	// area layout
	if (areaLayout == "hor") {
		this.mLayout = LayoutArea_Layout.HORIZONTAL;
	} else if (areaLayout == "ver") {
		this.mLayout = LayoutArea_Layout.VERTICAL;
	} else if (areaLayout == "south-east") {
		this.mLayout = LayoutArea_Layout.SOUTH_EAST;
	} else if (areaLayout == "south-west") {
		this.mLayout = LayoutArea_Layout.SOUTH_WEST;
	} else if (areaLayout == "north-east") {
		this.mLayout = LayoutArea_Layout.NORTH_EAST;
	} else if (areaLayout == "north-west") {
		this.mLayout = LayoutArea_Layout.NORTH_WEST;
	} else if (areaLayout == "circle") {
		this.mLayout = LayoutArea_Layout.CIRCLE;
	} else if (areaLayout == "square") {
		this.mLayout = LayoutArea_Layout.SQUARE;
	} else if (areaLayout == "diamond") {
		this.mLayout = LayoutArea_Layout.DIAMOND;
	} else if (areaLayout == "north-south") {
		this.mLayout = LayoutArea_Layout.NORTH_SOUTH;
	} else if (areaLayout == "east-west") {
		this.mLayout = LayoutArea_Layout.EAST_WEST;
	} else if (areaLayout == "south-north") {
		this.mLayout = LayoutArea_Layout.SOUTH_NORTH;
	} else if (areaLayout == "west-east") {
		this.mLayout = LayoutArea_Layout.WEST_EAST;
	}
}

LayoutArea.prototype.setInitState  = function()
{
	if (this.mPageVisible && this.mState == LayoutArea_State.VISIBLE) {
		this.mParent.setVisibleArea(this , true);
	} else 
	{
		this.mParent.setVisibleArea(this  , false);        
	}
	this.updateModelState(this.mState);    
}

LayoutArea.prototype.getX  = function(x, max, w) {

	// calculate divx
	var divx = (x) / ( max);

	// get x coordinate
	var rx =  w * divx;
	return  rx;
	
}

LayoutArea.prototype.getY  = function(y, max, h) {

	// calculate divx
	var divx = (y) / ( max);

	// get x coordinate
	var ry =  h * divx;
	return  ry;    	
}

LayoutArea.prototype.getDivX  = function(x, w) {

	// calculate x bounds
	// calculate divx
	var divx = (w) / x;

	return  divx;

}

LayoutArea.prototype.getDivY  = function(y, h) {


	var divy = ( h) / (y);

	return  divy;

}

LayoutArea.prototype.updateInitState  = function(strState, initstate) {
	if (this.mState == LayoutArea_State.VISIBLE) {
		this.mParent.setVisibleArea(this, true);
	} else if (this.mState == LayoutArea_State.HIDDEN) {
		this.mParent.setVisibleArea(this, false);
	} 
	if (initstate)
	{
		this.mInitState = this.mState;
	}
	this.updateModelState(this.mState);
}

LayoutArea.prototype.updateState  = function(strState, initstate) {

	if (strState == "visible") {
		this.mState = LayoutArea_State.VISIBLE;
		this.mParent.setVisibleArea(this, true);
	} else if (strState == "hidden") {
		this.mState = LayoutArea_State.HIDDEN;
		this.mParent.setVisibleArea(this, false);
	} 
	if (initstate)
	{
		this.mInitState = this.mState;
	}
	this.updateModelState(this.mState);
}

LayoutArea.prototype.updateModelState  = function(state)
{

    if (!this.mPageVisible)
	{
        state= LayoutArea_State.HIDDEN;
	}
	
	if (this.mModelBack != undefined)
	{
		this.mModelBack.setState(state);
	}
	if (this.mModel != undefined)
	{
		this.mModel.setState(state);
	}    	
	for (a=0; a< this.mItemFields.length; a++)
	{
		this.mItemFields[a].setState(state);
	}
}

LayoutArea.prototype.updateLocation  = function(strData) {
	var count= ServerkoParse.parseFloatArray(this.mLocation , strData);
	if (count == 5)
	{
		this.mBounds[0] = this.mLocation[2];
		this.mBounds[1] = this.mLocation[3];
		this.mLocation[2] = this.mLocation[4];    		
	}else if (count == 4)
	{
		this.mBounds[0] = this.mLocation[2];
		this.mBounds[1] = this.mLocation[3];
		this.mLocation[2] = 0.0;    		
	}
	this.updateModelsTransformation();
}

LayoutArea.prototype.updateBounds  = function(strData) {
	var count =  ServerkoParse.parseFloatArray(this.mBounds , strData);
	this.updateModelsTransformation();
}
LayoutArea.prototype.setRotation  = function(strData) {
	ServerkoParse.parseFloatArray(this.mRotation , strData);
	this.updateModelsTransformation();
}

LayoutArea.prototype.setScale  = function(strData) {
	ServerkoParse.parseFloatArray(this.mScale , strData);
	this.updateModelsTransformation();
}

LayoutArea.prototype.setItemScale  = function(strData) 
{
	var scale = [0.0 , 0.0 , 0.0 , 0.0];
	var len = ServerkoParse.parseFloatArray(scale, strData);
	if (len != 4)
	{
		return;
	}
	
	var i = scale[0];
	if ( i < 0 || i >= this.mItemFields.length || mItemFields[i] == undefined)
	{
		return;
	}
	
	var scale2 = [0.0 , 0.0 , 0.0 , 0.0];
	scale2[0] = scale[1];
	scale2[1] = scale[2];
	scale2[2] = scale[3];
	
	var f = this.mItemFields[i];
	if (f.mItem != undefined)
	{
		f.mItem.mModelRef.setAddScale(scale2);
		f.mItem.mModelRef.set();
	}

		
}

LayoutArea.prototype.setSize  = function(strData) 
{
	var tok = strData.split(",");
	if (tok.length > 0)
	{
		this.mSize = parseInt(tok[0]);
	}
	if (tok.length > 1)
		this.mSizeW = parseInt(tok[1]);
	if (tok.length > 2)			
		this.mSizeH = parseInt(tok[2]);
}

LayoutArea.prototype.setField  = function(count) {
	if (count < this.mItemFields.length) {
		return;
	} else {
		while (count >= this.mItemFields.length)
		{
			var field = new LayoutField(this);
			field.mID = count;
			this.mItemFields.push(field);
		}
	}
}

LayoutArea.prototype.getData  = function(val) {
	var index = val.indexOf(']');
	if (index == -1) {
		return val;
	}
	return val.substring(index + 1);
}

LayoutArea.prototype.getType  = function(val) {
	if (val[0] != '[') {
		return LayoutArea_FieldItemType.TEXT;
	}
	if (val[1] == 'i') {
		return LayoutArea_FieldItemType.ITEM;
	}
	if (val[1] == 't') {
		return LayoutArea_FieldItemType.TEXT;
	}
	if (val[1] == 'T') {
		return LayoutArea_FieldItemType.TEXTH;
	}

	return LayoutArea_FieldItemType.TEXT;
}

LayoutArea.prototype.pushFrontItem  = function(strData) {
	// go through fields
	for (var a=this.mItemFields.length-1; a > 0 ; a--)
	{
		var f2 = this.mItemFields[a];
		f2.clear();
		var f1 = this.mItemFields[a-1];
		if (f1.mText != undefined && f1.mText.mText != undefined )
		{
			f2.setText(f1.mText.mText, this.mSizeText);
		}
		
	}
	
	this.createItem(0, strData ,false);

}

LayoutArea.prototype.updateItems  = function(strData) {
	this.createItems(strData, false);

}

LayoutArea.prototype.updateItem  = function(strData, showback) {
	// 

	var tok = strData.split(",");
	var field = parseInt( tok[0]);
	var item = tok[1];
	this.createItem(field, item, showback);
}    

LayoutArea.prototype.createItem  = function(fieldind, val, showback) {
	var type = LayoutArea_FieldItemType.TEXT;
	var field = undefined;
	var data;
	type = this.getType(val);
	data = this.getData(val);
	if (fieldind < 0 || fieldind > this.mSize)
	{
		//System.out.println( " ERRRRRROR field index out of bounds " + this.mID + " " + fieldind);
		return;
	}
	this.setField(fieldind);
	this.mActiveItems ++;
	field = this.mItemFields[fieldind];
	if (type == LayoutArea_FieldItemType.ITEM) {
			// just draw item
			//field.mItem = this.mApp.items().createItem(data, undefined);
			if (field.mW > 0) {
				field.setItem(data, false, showback);
			}                
			field.mText = undefined;
			
		} else if (type == LayoutArea_FieldItemType.TEXT) {
			field.setText(data, this.mSizeText);
			field.mItem = undefined;
		}else if (type == LayoutArea_FieldItemType.TEXTH) {
			field.setText(data, this.mSizeText);
			field.mItem = undefined;
		}
}

LayoutArea.prototype.createItems  = function(strData, doeffect) {
	if (strData == undefined) {
		return;
	}

	var tok = strData.split(",");
	var val;
	var data;
	var type = LayoutArea_FieldItemType.TEXT;
	var field = undefined;
	var count = 0;
	this.mActiveItems ++;
	// update vector of items on fields
	for (var c = 0 ; c < tok.length ; c++)
	{
		val = tok[c];
		type = this.getType(val);
		data = this.getData(val);
		this.setField(count);
		field = this.mItemFields[count++];
		if (type == LayoutArea_FieldItemType.ITEM) {
			// just draw item
			if (field.mW > 0) {
				field.setItem(data, doeffect, false);
			}
			field.mItemID = data;
			field.mText = undefined;
		} else if (type == LayoutArea_FieldItemType.TEXT) {
			field.setText(data, this.mSizeText);
			//field.mColorFore = this.mColorForeground;
			field.mItem = undefined;
		} else {
		}
	}

}

LayoutArea.prototype.updateFields  = function(fields) {
	this.createFields(fields);
}

LayoutArea.prototype.getFinfo  = function(info, token) {
	var tt;
	var tok;
	var a = 0;
	tok = token.split(",");
	tt = tok[0];
	// default values
	info[0] = 0;
	info[1] = 0;
	info[2] = 1;
	info[3] = 0;
	info[4] = 0;
	info[5] = 1;
	info[6] = 1;
	for (var c = 1; c < tok.length && a < 6; c++)
	{
		info[a++] = parseInt(tok[c]);
	}
	
	return tt;
}

LayoutArea.prototype.createFields  = function(strData) {
	this.createFields_impl(strData);
}

LayoutArea.prototype.createFields_S  = function(strData) {
	this.createFields_impl(strData);
}


LayoutArea.prototype.createFields_impl  = function(strData) {
	if (strData == undefined) {
		return;
	}

	var fieldinfo = new Array(7);
	var fieldc = 0;
	var type = new String();


	var tok = strData.split(";");

	// get field Width / height
	var count = 0;
	var max = 0;
	var fieldind = 0;
	var x = 0,y = 0;
	var szx = 0;
	var szy = 0;
	for (var c = 0; c < tok.length ; c++) 
	{
		type = this.getFinfo(fieldinfo, tok[c]);
		x = fieldinfo[0];
		y = fieldinfo[1];
		max = fieldinfo[2];
		szx = fieldinfo[5];
		szy = fieldinfo[5];
		for (count = 0; count < max; count++) {
			this.setField(fieldind);
			var field = this.mItemFields[fieldind++];
			field.mGridx = x;
			field.mGridy = y;
			field.mGridSzX = szx;
			field.mGridSzY = szy;
			if (type == "empty") {
				field.mFieldType = LayoutField_FieldType.EMPTY;
			}else
			if (type == "empty2") {
				field.mFieldType = LayoutField_FieldType.EMPTY2;
			}else                	
			if (type == "norm") {
				field.mFieldType = LayoutField_FieldType.NORM_FIELD;
			}else                	
			if (type == "play") {
				field.mFieldType = LayoutField_FieldType.PLAY_FIELD;
			} else if (type == "norm") {
				field.mFieldType = LayoutField_FieldType.NORM_FIELD;
			} else if (type == "start") {
				field.mFieldType = LayoutField_FieldType.PLAYER_START;
			} else if (type == "end") {
				field.mFieldType = LayoutField_FieldType.PLAYER_END;
			}

			field.mID = fieldc;

			x += fieldinfo[3];
			y += fieldinfo[4];

			fieldc++;
		}
	}
}

LayoutArea.prototype.getItem  = function(index) {
	if (index < this.mItemFields.length) {
		return this.mItemFields[index].mItem;
	}
	return undefined;
}

LayoutArea.prototype.placeFigure  = function(index, item, showback) {
	if (index < this.mItemFields.length) {
		var f = this.mItemFields[index];
		f.removeFigure();
		f.setItem2(item, false, showback);
	}
	
}

LayoutArea.prototype.updateOnclick  = function(data) {

	this.mOnclick = data;

}

LayoutArea.prototype.updateOnFocusLost  = function(data) {

	this.mOnFocusLost = data;

}

LayoutArea.prototype.updateOnFocusGain  = function(data) {

	this.mOnFocusGain = data;

}

LayoutArea.prototype.updateItemsA  = function(strData) {
	this.createItems(strData, true);
}




LayoutArea.prototype.createWorldModel  = function() {
	if (this.mModelBack == undefined) {
		if (this.mColorBackground != undefined) {
		    var ref = new GameonModelRef(undefined , this.mParent.getWorld() );
			// create plane for background
			if (this.mStrColorBackground2 != undefined)
			{
				var tok = this.mStrColorBackground2.split(".");
				back = tok[0];
				if (tok.length > 1)
				{
					var text = this.mApp.textures().getTexture(back);
					var n = parseInt( tok[1] );
					var w = parseInt( tok[2] );
					var h = parseInt( tok[3] );
					
					if (this.mType == LayoutArea_Type.LAYOUT)
					{
						this.mModelBack = this.mApp.items().createFromType(GameonModelData_Type.BACKIMAGE , 
							this.mColorBackground , text);					
					}else
					{
						this.mModelBack = this.mApp.items().createFromType(GameonModelData_Type.BACKGROUND , 
							this.mColorBackground , text);
					}
					ref.mOwner = n;
					ref.mTransformOwner = true;
					this.mModelBack.setTextureOffset( w , h);
					ref.mOwnerMax = w * h;
					this.mModelBack.mSubmodels = w * h;
				}else
				{
					if (this.mType == LayoutArea_Type.LAYOUT)
					{
						this.mModelBack = this.mApp.items().createFromType(GameonModelData_Type.BACKIMAGE , 
							this.mColorBackground , this.mColorBackground2);					
					}else
					{
				
						this.mModelBack = this.mApp.items().createFromType(GameonModelData_Type.BACKGROUND , 
							this.mColorBackground , this.mColorBackground2);
					}
				}
			}else
			{
					if (this.mType == LayoutArea_Type.LAYOUT)
					{
						this.mModelBack = this.mApp.items().createFromType(GameonModelData_Type.BACKIMAGE , 
								this.mColorBackground , this.mColorBackground2);					
					}else
					{
			
						this.mModelBack = this.mApp.items().createFromType(GameonModelData_Type.BACKGROUND , 
								this.mColorBackground , this.mColorBackground2);
					}
			}
			
			
			this.mModelBack.mLoc = this.mDisplay;
			this.mModelBack.mEnabled = true;
			
			if (this.mColorBackground.alpha < 255)
			{
				this.mModelBack.mHasAlpha = true;
			}
			if (this.mBorder == LayoutArea_Border.THINRECT)
			{
				var ratio = this.mW / this.mH;
				this.mModelBack.createFrame(-0.5,-0.5,0.001,0.5, 0.5,0.001, 0.03/this.mBounds[0], 0.03/this.mBounds[1], this.mColorForeground);
			}			
			
			ref.mLoc = this.mDisplay;
			//ref.setAreaScale(this.mBounds);
			ref.setAreaPosition(this.mLocation);
			this.mModelBack.addref(ref);
			this.mModelBack.mName = "back " + this.mID;
			this.mApp.world().add(this.mModelBack);
		}
	}
	if (this.mType == LayoutArea_Type.LABEL || this.mType == LayoutArea_Type.TABLE)
	{
		this.createWorldModelItems();
	}
}

LayoutArea.prototype.createWorldModelItems  = function()
{
	if ( this.mItemFields.length == 0 || this.mModel != null)
	{
		return;
	}
	var count  = 0;
	this.mActiveItems = 0;
	for (a=0; a < this.mItemFields.length; a++)
	{
		var field = this.mItemFields[a];
		if (field.mFieldType == LayoutField_FieldType.NONE ||
			field.mFieldType == LayoutField_FieldType.EMPTY ||
			field.mFieldType == LayoutField_FieldType.EMPTY2)
		{
			count ++;
		}
		if (field.mText != undefined || field.mItem != undefined)
		{
			this.mActiveItems++;
		}		
	}
	if (count == this.mItemFields.length){
		this.createCustomModel();
		return;
	}
	this.mModel = new GameonModel("area"+ this.mID , this.mApp );
	var model = this.mModel;
	//Log.d("model" , " cordstart ------");
	for (var a=0; a< this.mItemFields.length; a++ ) {
		var field = this.mItemFields[a];
		var w = field.mW;
		var h = field.mH;
		var x = field.mX / this.mBounds[0] -w/2;
		var y = field.mY / this.mBounds[1] -h/2;
		var z = field.mZ;
		var dw = w/80;
		var dh = h/80;        
		var up = 0.001;
		
		//Log.d("model" , x + " " + y + " "  + w + " " + h);
		var fcolor = undefined;
		if (this.mColorForeground != undefined)
		{
			fcolor = this.mColorForeground;
		}else {
			fcolor = this.mApp.colors().white;
		}
		
		switch (field.mFieldType)
		{
			case LayoutField_FieldType.NORM_FIELD:
				if (this.mColorForeground != undefined)
				{					
					model.createPlane( x, y, z+up ,  x +w , y + h, z+up  ,   fcolor);	                	
				}
				else
				{
					model.createPlane4( x, y, z+up ,  x +w , y + h, z+up ,   fcolor, fcolor);
				}
			break;
			case LayoutField_FieldType.PLAY_FIELD:
				if (this.mColorForeground != undefined)
				{
					model.createOctogon( x+dw, y+dh, z+up ,  x +w-dw-dw , y + h-dh-dh, z+up ,   fcolor);
				}else
				{
					model.createOctogon( x+dw, y+dh, z+up ,  x +w-dw-dw , y + h-dh-dh, z+up ,   fcolor);
				}
			break;
			case LayoutField_FieldType.PLAYER_START:
				//model.createPlane2( x, y, this.mZ+0.001 ,  x +w , y + h, this.mZ+0.001  ,   fcolor);
				model.createPlane( x+dw, y+dh, z+up ,  x +w-dw-dw , y + h-dh-dh, z+up ,   fcolor);

				break;				
			case LayoutField_FieldType.PLAYER_END:
			//case LayoutField_FieldType.EMPTY2:
				model.createPlane3( x, y, z+up ,  x +w , y + h, z+up  ,   fcolor);
				break;
			case LayoutField_FieldType.EMPTY:
			break;
		}
		
		field.mRef.setPosition(field.mX,field.mY,field.mZ);
		field.mRef.setScale(w,h,1);

		//Log.d("model", (field.mY) +" "+ (y));
	}
	var ref = new GameonModelRef(undefined);
	ref.mLoc = this.mDisplay;
	ref.setScale(this.mBounds);
	model.addref(ref);    
	model.mEnabled = true;
	model.mIsModel = false;
	if (this.mColorForeground2 != undefined)
	{
		this.mModel.setTexture(this.mColorForeground2);
	}
	this.mApp.world().add(model);
}


LayoutArea.prototype.fieldClicked  = function(eye, ray) {
	if (!this.hasTouchEvent() )
		return undefined;

	if (this.mPageVisible == false || this.mState != LayoutArea_State.VISIBLE)
	{
		return null;
	}
		
	var mindist = 1e06;
	var index = 0;
	var loc = [0,0,0];
	for (var a=0; a < this.mItemFields.length; a++)
	{
		var f = this.mItemFields[a];
		if (f.mText != undefined || f.mItem != undefined)
		{		
			var ref = f.mRef;
			var dist = ref.intersectsRay(eye, ray,loc);
			if (dist <= mindist)
			{
				mindist = dist;
				index = a;
			}
		}
	}		
	
	if (mindist != 1e6)
	{
		var pair = new AreaIndexPair();
		pair.mArea = this.mID;
		pair.mOnclick = this.mOnclick;
		pair.mOnFocusLost = this.mOnFocusLost;
		pair.mOnFocusGain = this.mOnFocusGain;
		pair.mIndex = index;
		pair.mLoc[0] = loc[0];
		pair.mLoc[1] = loc[1];
		pair.mLoc[2] = loc[2];		
		return pair;							
	}
	
	for (var a=0; a < this.mItemFields.length; a++)
	{
		var f = this.mItemFields[a];
		var ref = f.mRef;
		var dist = ref.intersectsRay(eye, ray , loc);
		if (dist < mindist)
		{
			mindist = dist;
			index = a;
		}

	}		
	
	if (mindist != 1e6)
	{
		var pair = new AreaIndexPair();
		pair.mArea = this.mID;
		pair.mOnclick = this.mOnclick;
		pair.mOnFocusLost = this.mOnFocusLost;
		pair.mOnFocusGain = this.mOnFocusGain;
		pair.mIndex = index;
		pair.mLoc[0] = loc[0];
		pair.mLoc[1] = loc[1];
		pair.mLoc[2] = loc[2];		
		return pair;							
	}
	
	if (this.mModelBack != undefined)
	{
		var ref = this.mModelBack.ref(0);
		var dist = ref.intersectsRay(eye,ray , loc);
		if (dist <= mindist)
		{
			mindist = dist;
			index = -1;
		}			
	}
	if (this.mModel != undefined)
	{
		var ref = this.mModel.ref(0);
		var dist = ref.intersectsRay(eye,ray,loc);
		if (dist <= mindist)
		{
			mindist = dist;
			index = -1;
		}
	}			
	if (mindist != 1e6)
	{
		var pair = new AreaIndexPair();
		pair.mArea = this.mID;
		pair.mOnclick = this.mOnclick;
		pair.mOnFocusLost = this.mOnFocusLost;
		pair.mOnFocusGain = this.mOnFocusGain;
		pair.mIndex = index;
		pair.mLoc[0] = loc[0];
		pair.mLoc[1] = loc[1];
		pair.mLoc[2] = loc[2];		
		return pair;							
	}
			
	
	
	return undefined;

}

LayoutArea.prototype.itemsRemoveAnim  = function(strData) {
	//serverko.appendEvent( 3056 , areaFrom, indexes + "| " + type + "," + delay);
	var tok = strData.split("|");
	var indexes  = tok[0];
	var animdata = tok[1];
	
	var tok2 = animdata.split(",");
	
	var type = tok2[0];
	var delay = parseInt(tok2[1]);
	var item = undefined;
	var tokind = indexes.split(",");
	
	for (var c=0; c < tokind.length; c++)
	{
		var a= parseInt(tokind[c]);
		var f = this.mItemFields[a];
		if (f.mItem != undefined) {
			f.removeFigure();
			/*
			if (movetype == "jumps")) {
				item.createAnimJumps(delay, 2.0f +  1.7f);
			}*/
		}
	}
	
}

LayoutArea.prototype.itemsAnim  = function(strData) {

	// get type
	//get delay
	var tok = strData.split(",");

	var movetype = tok[0];
	var delay = tok[1];
	if (tok.length > 2)
	{
		delay += ",";
		delay += tok[2]
	}

	var item = undefined;
	for (var a=0; a< this.mItemFields.length; a++) 
	{
		item = this.mItemFields[a].mItem;
		this.mApp.mAnims.animRef(movetype, item.mModelRef , item.mModelRef, delay);
	}
}

LayoutArea.prototype.itemAnim  = function(indexes, strData) {

	// get type
	//get delay
	var tok = strData.split(",");

	var movetype = tok[0];
	
	var delay = tok[1];
	if (tok.length > 2)
	{
		delay += ",";
		delay += tok[2]
	}

	var item = undefined;
	
	var tokind = indexes.split(",");
	
	for (var c =0 ; c < tokind.length; c++)
	{
		var a= parseInt(tokind[c]);
		
		item = this.mItemFields[a].mItem;
		if (item != undefined) {
			this.mApp.mAnims.animRef(movetype, item.mModelRef , item.mModelRef, delay);			
		}
	}
}




LayoutArea.prototype.invertItem  = function(strData ) {
	// 
	
	var field = parseInt(strData);
	var f = undefined;
	this.setField(field);
	f = this.mItemFields[field];
	f.invertItem();
	
}   



LayoutArea.prototype.updateBorder = function(border) {
	// 
	if (border == "thinrect")
	{
		this.mBorder = LayoutArea_Border.THINRECT;
	}
}

LayoutArea.prototype.initAnim = function(strData, away)
{
	// get type
	//get delay
	var tok = strData.split(",");
		
	var movetype = tok[0];    
	var delay = parseInt( tok[1] );
	
	//
	if (this.mModel != undefined)
	{
		this.mModel.createAnimTrans(movetype , delay, away , 0);
	}
	if (this.mModelBack != undefined)
	{
		this.mModelBack.createAnimTrans(movetype , delay , away, 0);
	}    
	
	for (var a=0; a< this.mItemFields.length; a++)
	{
		var field = this.mItemFields[a];
		field.createAnimTrans(movetype, delay , away);
	}
	return delay;
}

LayoutArea.prototype.updateModels = function()
{
	if (this.mModelBack != undefined)
	{
		var ref = this.mModelBack.ref(0);
		ref.setScale(this.mScale);
		ref.setPosition(this.mLocation);
		ref.set();
	}
}

LayoutArea.prototype.hasTouchEvent = function() 
{
	if (this.mHasScrollH || this.mHasScrollV)
		return true;

	if ( (this.mOnclick != undefined && this.mOnclick.length > 0) || 
		(this.mOnFocusLost != undefined && this.mOnFocusLost.length > 0) ||
		(this.mOnFocusGain != undefined && this.mOnFocusGain.length > 0) )
	{
		return true;
	}
	return false;
}

LayoutArea.prototype.updateColors = function(strData)
{
	var tok =  strData.split(",");
	if (tok.length > 0)
		this.mColors[0] = this.mApp.colors().getColor(tok[0]);
	if (tok.length > 1)
		this.mColors[1] = this.mApp.colors().getColor(tok[1]);
	if (tok.length > 2)
		this.mColors[2] = this.mApp.colors().getColor(tok[2]);
	if (tok.length > 3)
		this.mColors[3] = this.mApp.colors().getColor(tok[3]);
	
}

LayoutArea.prototype.updateModelsTransformation = function()
{
	if (this.mModelBack != undefined)
	{
		var ref = this.mModelBack.ref(0);
		ref.setAreaPosition(this.mLocation);
		ref.setAreaRotate(this.mRotation);
		ref.setScale(this.mBounds);
		ref.setAddScale(this.mScale);
		ref.set();
	}
	if (this.mModel != undefined)
	{
		var ref = this.mModel.ref(0);
		ref.setAreaPosition(this.mLocation);
		ref.addAreaPosition(0,0,0.001);
		ref.setAreaRotate(this.mRotation);
		ref.setScale(this.mBounds);
		ref.setAddScale(this.mScale);
		ref.set();
	}		
	for (var a=0; a < this.mItemFields.length; a++)
	{
		var f = this.mItemFields[a];
		f.setScale();
		if (f.mItem != undefined && f.mItem.mModelRef != undefined)
		{
			var ref = f.mItem.mModelRef;
			ref.setAreaPosition(this.mLocation);
			ref.setAreaRotate(this.mRotation);
			ref.mulScale(this.mBounds);
			ref.setAddScale(this.mScale);
			ref.set();
		}
		if (f.mText != undefined && f.mText.mRef != undefined)
		{
			var ref = f.mText.mRef;
			ref.setAreaPosition(this.mLocation);
			ref.setAreaRotate(this.mRotation);
			ref.mulScale(this.mBounds);
			ref.setAddScale(this.mScale);
			ref.set();
		}
		
		var ref = f.mRef;
		ref.setAreaPosition(this.mLocation);
		ref.setAreaRotate(this.mRotation);
		ref.mulScale(this.mBounds);
		ref.setAddScale(this.mScale);
		ref.set();
	}
}

LayoutArea.prototype.updateScrollers = function()
{
	
}

LayoutArea.prototype.createCustomModel = function()
{
	
}

LayoutArea.prototype.setScrollers = function(data)
{
	var num = ServerkoParse.parseFloatArray(this.mScrollers, data);
	if (num > 0)
	{
		// update scrollers
		this.updateScrollers();
	}
}


LayoutArea.prototype.setScrollerVal = function(val)
{
	this.mScrollers[0] = val;
	this.updateScrollers();
}

LayoutArea.prototype.onDragg = function(dx, dy, dz)
{
	if (this.mHasScrollH || this.mHasScrollV)
	{
		if (this.mScollerAnim == undefined)
		{
			this.mScollerAnim = this.mApp.anims().getScollerAnim(this);
			this.mScollerAnim.setActive(true);
			this.mScollerAnim.mAreaOwner = this;
			this.mApp.anims().incCount();

		}
		if (this.mScollerAnim != undefined)
		{
			var p;
			if (this.mHasScrollV)
			{
				p = dy / this.mBounds[1];
			}else
			{
				p = -dx / this.mBounds[0];
			}
			
			this.mScollerAnim.addScrollerData(p, 200, this.mScrollers[1] , this.mScrollers[2] );
		}
					
	}
}

LayoutArea.prototype.anim = function(type, delay, data)
{
	//
	if (this.mModel != undefined)
	{
		this.mModel.createAnim(type , 0,  delay , data);
	}
	if (this.mModelBack != undefined)
	{
		this.mModelBack.createAnim(type , 0, delay  , data);
	}    
	for (var a=0; a< this.mItemFields.length; a++)
	{
		var field = this.mItemFields[a];
		field.createAnim(type, delay , data );
	}
}
