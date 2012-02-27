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



function LayoutAreaLayout(subtype , app)
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

	
	if (subtype == "grid")
	{
		this.mSubType = LayoutAreaLayout_SubType.GRID;
	}else
	if (subtype == "back")
	{
		this.mSubType = LayoutAreaLayout_SubType.BACK;
	}
	this.mType = LayoutArea_Type.LAYOUT;
	this.mPageVisible = false;
	this.mActive = true;
	this.mSizeText = -1;
	this.mScrollers = [0,-0.5,0.5,0,0,0];
	this.mHasScrollH = false;
	this.mHasScrollV = false;
	this.mScollerAnim = undefined;
	this.mActiveItems = 1;
	
}

LayoutAreaLayout.prototype = new LayoutArea();
LayoutAreaLayout.prototype.constructor=LayoutAreaLayout;

LayoutAreaLayout_SubType = 
{
	NONE:0,
	GRID:1,
	BACK:2
}


LayoutAreaLayout.prototype.initLayout = function() 
{
	if (this.mSubType == LayoutAreaLayout_SubType.GRID)
	{
		this.initGrid();
	} 		
}


LayoutAreaLayout.prototype.initGrid = function() 
{

	var field = null;
	var width = this.mBounds[0];
	var height = this.mBounds[1];
	var x = 0;
	var y = 0;
	var count = 0;
	var divx = this.getDivX(this.mSizeW , width);
	var divy = this.getDivY(this.mSizeH , height);
	
	while ( count < this.mSize)
	{
		this.setField(count);
		field = mItemFields[count++];

		field.mX = 0  + this.getX(x , this.mSizeW , width) - width / 2;
		field.mY = 0  + this.getY(y , this.mSizeH  , height) - height / 2;
		field.mW = divx;
		field.mH = divy;
		field.mRef.setPosition(field.mX,field.mY,field.mZ);
		field.mRef.setScale(divx,divy,1);	        
		x++;
		if (x >= this.mSizeW)
		{
			x = 0; y++;
		}
	}
	
}


