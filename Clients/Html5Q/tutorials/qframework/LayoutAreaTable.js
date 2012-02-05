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
    this.mSizeH = 0;
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
	
	
	if (subtype == "sgrid")
	{
		this.mSubType = LayoutAreaTable_SubType.SGRID;
	}else
	if (subtype == "cardt")
	{
		this.mSubType = LayoutAreaTable_SubType.CARDTABLE;
	}else
	if (subtype == "list")
	{
		this.mSubType = LayoutAreaTable_SubType.LIST;
	}
	
	this.mType = LayoutArea_Type.TABLE;
	this.mPageVisible = false;
}

LayoutAreaTable.prototype = new LayoutArea();
LayoutAreaTable.prototype.constructor=LayoutAreaTable;

LayoutAreaTable_SubType = 
{
	NONE:0,
	SGRID:1,
	CARDTABLE:2,
	LIST:3
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


	var x = 0,y = 0;
	var width = this.mBounds[0];
	var height = this.mBounds[1];
	var mx = width / 20;
	var my = height / 20;
	var height2 = 1.0 - my;
	var width2 = 1.0 - mx;
	
	var fieldind = 0;
	var fieldc = 0;
	var divx = this.getDivX(1, width2);
	var divy = this.getDivY(this.mSizeH, height2);
	var divx2 = this.getDivX(1, width2);
	var divy2 = this.getDivY(this.mSizeH, height2);	    
	
	y = this.mSizeH-1;
	for (var a=this.mSizeH-1; a >=0 ; a--)
	{
		this.setField(fieldind);
		var field = this.mItemFields[fieldind++];
	   
		field.mX = 0 + mx/2 + this.getX( x, 1 ,  width2) + divx/2 - width/2 ;
		field.mY = 0 + my/2+ this.getY( y , this.mSizeH,height2) + divy/2 - height/2;
		field.mW = divx2 * field.mGridSzX;
		field.mH = divy2 * field.mGridSzY ;
		field.mRef.setPosition(field.mX,field.mY,field.mZ);
		field.mRef.setScale(field.mW,field.mH,1);	       		
		field.mMarginX = field.mW /10;
		field.mMarginY = field.mH /5;
		
		field.mZ = 0;
		fieldc++;
		x++;
		if (x >= 1)
		{
			x=0;
			y--;
		}
	}
	
}

