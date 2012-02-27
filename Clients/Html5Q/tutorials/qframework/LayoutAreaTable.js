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


function LayoutAreaTable(subtype , app)
{
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
    this.mSizeH = 1;
    this.mColorForeground = undefined;
    this.mColorForeground2 = undefined;
    this.mColorBackground = undefined;
    this.mColorBackground2 = undefined;
    this.mOnclick = undefined;
	this.mOnFocusLost = undefined;
	this.mOnFocusGain = undefined;
	this.mWorld = undefined;
	this.mPageId = undefined;
	
	this.mModel = undefined;// = new GameonModel();
    this.mModelBack = undefined;

	this.mSubType = LayoutAreaCards_SubType.NONE;
	
	this.mColors = new Array(4);
	this.mColors[0] = this.mApp.mColors.white;
	this.mColors[1] = this.mApp.mColors.white;
	this.mColors[2] = this.mApp.mColors.white;
	this.mColors[3] = this.mApp.mColors.white;
	
	var val = subtype.charAt( subtype.length -1 );
	if (val >= '0' && val <= '9')
	{
		this.mModifier = (val-'0');
	}
	
	if (subtype.indexOf("sgrid") == 0)
	{
		this.mSubType = LayoutAreaTable_SubType.SGRID;
	}else
	if (subtype.indexOf("cardt") == 0)
	{
		this.mSubType = LayoutAreaTable_SubType.CARDTABLE;
	}else
	if (subtype.indexOf("list") == 0)
	{
		this.mSubType = LayoutAreaTable_SubType.LIST;
	}else
	if (subtype.indexOf("hlist") == 0)
	{
		this.mSubType = LayoutAreaTable_SubType.HLIST;
	}
	
	this.mType = LayoutArea_Type.TABLE;
	this.mPageVisible = false;
	this.mActive = true;
	this.mSizeText = -1;

	this.mScrollers = [0,-0.5,0.5,0,0,0];
	this.mHasScrollH = false;
	this.mHasScrollV = false;
	this.mScollerAnim = undefined;
	this.mActiveItems = 1;
	
	this.mModifier = 0;
	this.mListScaleMaxW = undefined;
	this.mListScaleMinW = undefined;
	this.mListScaleMaxH = undefined;
	this.mListScaleMinH = undefined;
	
	this.mModifiersZ = undefined;
	this.mModifiersW = undefined;
	this.mModifiersH = undefined;
	this.mFieldsData = undefined;

	
}

LayoutAreaTable.prototype = new LayoutArea();
LayoutAreaTable.prototype.constructor=LayoutAreaTable;

LayoutAreaTable_SubType = 
{
	NONE:0,
	SGRID:1,
	CARDTABLE:2,
	LIST:3,
	HLIST:4
}

// inheritance



LayoutAreaTable.prototype.initLayout = function() 
{
	if (this.mSubType == LayoutAreaTable_SubType.SGRID)
	{
		this.initSquareGrid();

	} else if (this.mSubType == LayoutAreaTable_SubType.CARDTABLE)
	{

	}else if (this.mSubType == LayoutAreaTable_SubType.LIST)
	{
		this.initList();
	}else if (this.mSubType == LayoutAreaTable_SubType.HLIST)
	{
		this.initHList();
	}
}


LayoutAreaTable.prototype.initSquareGrid = function() 
{
	var fieldc = 0;
	// get field Width / height
	var x = 0,y = 0;
	var width = this.mBounds[0];
	var height = this.mBounds[1];
	var fieldind = 0;
	
	var divx = this.getDivX(this.mSizeW, width);
	var divx2 = 1.0/this.mSizeW;
	var divy = this.getDivY(this.mSizeH, height);
	var divy2 = 1.0/this.mSizeH;
	var xc = 0;
	var yc = 0;	
	for (var a=0; a< this.mSize ; a++)
	{
		this.setField(a);
		var field = this.mItemFields[fieldind++];
		if (field.mGridx >= 0)
		{		
			x = field.mGridx;
			y = field.mGridy;
		}else
		{
			x = xc;
			y = yc;                	
		}
		xc++;
		if (xc >= this.mSizeW)
		{
			xc  =0;
			yc++;
		}			
		field.mX = this.getX(x , this.mSizeW ,width)  + divx/2 - width/2;
		field.mY = this.getY(y , this.mSizeH ,height)  + divy/2 - height/2;
		field.mW = divx2 * field.mGridSzX;
		field.mH = divy2 * field.mGridSzY ;
		field.mRef.setPosition(field.mX,field.mY,field.mZ);
		field.mRef.setScale(field.mW,field.mH,1);                
		field.mZ = 0.001;		
		if (field.mFieldType == LayoutField_FieldType.EMPTY2)
		{
			var w = field.mW;
			var h = field.mH;
			w = w * 0.33;
			h = h * 0.33;
			
			field.mW -= w;
			field.mH -= h;
			field.mX += w/2;
			field.mY += h/2;
			
		}
		fieldc++;

	}
}

LayoutAreaTable.prototype.setTitle = function()
{

}

LayoutAreaTable.prototype.initList = function()
{

	this.mHasScrollV = true;
	this.mListScaleMinH = 1.0 - this.mModifier/12.0;
	this.mListScaleMaxH = 1.0 + this.mModifier/12.0;
	this.mListScaleMinW = 1.0 - this.mModifier/12.0;
	this.mListScaleMaxW = 1.0;
	
	this.createDefaultFields();
			
	this.updateScrollers();
}


LayoutAreaTable.prototype.getScrollCoords = function(col , ind , f)
{
	var div = 1.0/(this.mSizeW-1);
	var p = ind * div;
	
	var rowsize = (this.mSize)/ (this.mSizeH);
	var max = div * rowsize;
	p-= (this.mScrollers[0]+0.5) * div * rowsize;
	var pmin = (p-div/2);
	var pmax = (p+div/2);
	
	// temp
	if (pmax < -0.5 ||
		pmin > 0.5 )
	{
		return false;
	}
		
	// calculate X based on row info
	f.mX = 0;
	f.mY = 0;
	f.mW = 1;
	f.mH = 1;
	
	if (this.mHasScrollV)
	{
		f.mX -= (0.05*this.mBounds[0]);
		f.mY -= (p*this.mBounds[1]);// - div/2;
		f.mZ = 0.0;
		f.mW *= 0.9;
		if (pmax > 0.5)
		{
			f.mH *= div - (pmax - 0.5);
			f.mY += (pmax - 0.5)* this.mBounds[1]/2; 
		}else if (pmin < -0.5)
		{
			f.mH *= div- (-0.5 - pmin) ;
			f.mY -= (-0.5 - pmin )* this.mBounds[1]/2;
		}else
		{
			f.mH *= div;
		}
		if (f.mH < 0)
			return false;
		
		f.mX += this.mFieldsData[col * 4]*this.mBounds[0];
		f.mY += this.mFieldsData[col * 4+1]*this.mBounds[1]*div;
		
	}
	else if (this.mHasScrollH)
	{
		f.mX += (p*this.mBounds[0]);// - div/2;
		f.mY -= (0.05*this.mBounds[1]);
		f.mZ = 0.0;
		
		f.mH *= 0.9;
		if (pmax > 0.5)
		{
			f.mW *= div - (pmax - 0.5);
			f.mX -= (pmax - 0.5)* this.mBounds[0]/2; 
		}else if (pmin < -0.5)
		{
			f.mW *= div- (-0.5 - pmin );
			f.mX += (-0.5 - pmin )* this.mBounds[0]/2;
		}else
		{
			f.mW *= div;
		}		
		if (f.mW < 0)
			return false;
		f.mX += this.mFieldsData[col * 4]*this.mBounds[0]*div;
		f.mY += this.mFieldsData[col * 4+1]*this.mBounds[1];
		
	}

	f.mW *= this.mFieldsData[col * 4+2];
	f.mH *= this.mFieldsData[col * 4+3];
	
	return true;
}


LayoutAreaTable.prototype.createCustomModel = function()
{
	// scroller
	if (this.mSubType == LayoutAreaTable_SubType.LIST || this.mSubType == LayoutAreaTable_SubType.HLIST)
	{
		this.mModel = new GameonModel("scroll"+ this.mID , this.mApp);
		var model = this.mModel;
		var fcolor = undefined;
		if (this.mColorForeground != undefined)
		{
			fcolor = this.mColorForeground;
		}else {
			fcolor = this.mApp.colors().white;//getPlayerColor(owner);
		}
		
		var div = this.mSizeH / this.mSize;
		var ref = new GameonModelRef(undefined);
		ref.mLoc = this.mDisplay;
		var scrollpos = this.mScrollers[0] / (this.mScrollers[2]-this.mScrollers[1]);
		if (this.mSubType == LayoutAreaTable_SubType.LIST)
		{
			model.createPlane( 0.40, -div/2, 0.01 ,  0.5,div/2 , 0.01, fcolor);
			ref.setPosition(0.0, - scrollpos * this.mBounds[1], 0.001);
		}else
		{
			model.createPlane(  -div/2, 0.40,0.01 ,  div/2 , 0.5, 0.01, fcolor);
			ref.setPosition( - scrollpos * this.mBounds[0], 0.0,0.001);
			
		}
		
		model.addref(ref);    

		model.mEnabled = true;
		model.mIsModel = false;
		if (this.mColorForeground2 > 0)
		{
			this.mModel.setTexture(this.mColorForeground2);
		}
		
		this.mApp.world().add(model);
		
		
		if (this.mActiveItems == 0)
		{
			model.setState(LayoutArea_State.HIDDEN);
			model.setActive(false);
		}
	}
}

LayoutAreaTable.prototype.createDefaultFields = function()
{
	var div = this.mSizeW / this.mSize;
	this.mScrollers[1] = -0.5 + div/3;
	this.mScrollers[2] = 0.5 - div/3;
	if (this.mScrollers[0] < this.mScrollers[1])
	{
		this.mScrollers[0] = this.mScrollers[1];
	}else if (this.mScrollers[0] > this.mScrollers[2])
	{
		this.mScrollers[0] = this.mScrollers[2];
	}
	
	this.mModifiersW = new Array(this.mSizeW);
	this.mModifiersH = new Array(this.mSizeW);
	this.mModifiersZ = new Array(this.mSizeW);
	
	var divmodW = (this.mListScaleMaxW - this.mListScaleMinW)/this.mSizeW;
	var divmodH = (this.mListScaleMaxH - this.mListScaleMinH)/this.mSizeW;
	divmodW *= 2;
	divmodH *= 2;
	var count = 0;
	for (var a=0; a< this.mSizeW; a++)
	{
		this.mModifiersH[a] = this.mListScaleMinH + count * divmodH;
		this.mModifiersW[a] = this.mListScaleMinW + count * divmodW;
		this.mModifiersZ[a] = count * 0.01;
		if (a < this.mSizeW/2.0 - 1.0)
		{
			count++;
		}else
		{
			count--;
		}
	}
	
	if (this.mFieldsData == undefined)
	{
		this.mFieldsData = new Array(this.mSizeH * 4);
		div = 1 / (this.mSizeH);
		if (this.mSubType == LayoutAreaTable_SubType.LIST)
		{
			for (var a=0; a< this.mSizeH; a++)
			{
				// default data
				this.mFieldsData[a*4] = (-0.5 + (a) * div + div/2)*this.mBounds[0];
				this.mFieldsData[a*4+1] = 0.0;
				this.mFieldsData[a*4+2] = div;
				this.mFieldsData[a*4+3] = 1.0;
			}
		}
		else
		{
			for (var  a=0; a< this.mSizeH; a++)
			{
				// default data
				this.mFieldsData[a*4] = 0.0;
				this.mFieldsData[a*4+1] = (-0.5 + (a) * div + div/2)*this.mBounds[1] ;
				this.mFieldsData[a*4+2] = 1.0;
				this.mFieldsData[a*4+3] = div;
			}
		}
	}
}

LayoutAreaTable.prototype.createFields = function(data)
{
	if (this.mSubType == LayoutAreaTable_SubType.LIST || this.mSubType == LayoutAreaTable_SubType.HLIST)
	{
		// parse info for coordinates of each field in rows
		this.createDefaultFields();
		var buff = new Array(4);
		// parse what we have
		var count =0 ;
		var tok = data.split(";");
		
		for (var a=0; a< data.length && count < this.mSizeW; a++ )
		{
			var val = ServerkoParse.parseFloatArray(buff, tok[a]);
			this.mFieldsData[count*4] = buff[0];
			this.mFieldsData[count*4+1] = buff[1];
			this.mFieldsData[count*4+2] = buff[2];
			this.mFieldsData[count*4+3] = buff[3];
			count++;
		}
	}
	else
	{
		this.createFields_S(data);
	}
}

LayoutAreaTable.prototype.initHList = function()
{
	this.mHasScrollH = true;
	
	this.mListScaleMinW = 1.0 - this.mModifier/12.0;
	this.mListScaleMaxW = 1.0 + this.mModifier/12.0;
	this.mListScaleMinH = 1.0 - this.mModifier/12.0;
	this.mListScaleMaxH = 1.0;

	this.createDefaultFields();
			
	this.updateScrollers();
	
}

LayoutAreaTable.prototype.updateScrollers = function()
{
	var count = 0;
	var x = 0,y = 0;
	//console.log (" scroll "  + this.mScrollers[0] + " " + this.mScrollers[1]+ " " + this.mScrollers[2] );
	for (var a=0; a < this.mSize ; a++)
	{
		this.setField(a);
		var field = this.mItemFields[a];
		if (this.getScrollCoords(x,y , field))
		{
			//field.mRef.clear();
			field.mH *= this.mModifiersH[count];
			field.mW *= this.mModifiersW[count];
			field.mZ += this.mModifiersZ[count];
			if (x == this.mSizeH-1 && count < this.mModifiersH.length-1)
			{
				count++;
			}
			field.mActive = true;
			field.mRef.setPosition(field.mX,field.mY,field.mZ);
			field.mRef.setScale(field.mW,field.mH,1);
			field.mRef.set();
			field.updateLocation();
			field.setState(LayoutArea_State.VISIBLE);
		}else
		{
			field.mH = 1.0;
			field.mW = 1.0;
			field.setState(LayoutArea_State.HIDDEN);
			field.mActive = false;
		}
		
		
		x++;
		if (x >= this.mSizeH)
		{
			x = 0;
			y++;
		}
		
	}
	if (this.mModel != undefined)
	{
		this.mModel.setActive(true);
		this.mModel.setState(LayoutArea_State.VISIBLE);
		var ref = this.mModel.ref(0);
		var div = this.mSizeH / this.mSize;
		var scrollpos = this.mScrollers[0] / (this.mScrollers[2]-this.mScrollers[1]+div);
		if (this.mHasScrollV)
		{
			ref.setPosition(0.0, -scrollpos*this.mBounds[1], 0.001);
		}else
		{
			ref.setPosition(scrollpos*this.mBounds[0], 0.0, 0.001);
		}
		ref.set();
	}
	
}

LayoutAreaTable.prototype.setText = function(strData) 
{
	this.setText_S(strData);

	if (this.mSubType == LayoutAreaTable_SubType.LIST || this.mSubType == LayoutAreaTable_SubType.HLIST)
	{
		this.pushFrontItem(strData);
	}
}
