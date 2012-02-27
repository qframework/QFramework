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


function LayoutAreaCards(subtype , app)
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
	
    this.mModifier = 0;
    this.mRandX = 0;
    this.mRandY = 0;
    this.mRandZ = 0;	

	var val = subtype.charAt( subtype.length -1 );
	if (val >= '0' && val <= '9')
	{
		this.mModifier = (val-'0')*1.0+1.0;
		this.mRandX = this.mModifier * 0.01;
		this.mRandY = this.mModifier * 0.01;
		this.mRandZ = this.mModifier * 0.01;
	}

	
	if (subtype.indexOf("deckback") == 0) {
		this.mSubType = LayoutAreaCards_SubType.DECKBACK;
	} else if (subtype.indexOf("deck") == 0) {
		this.mSubType = LayoutAreaCards_SubType.DECK;
	} else if (subtype.indexOf("hand") == 0) {
		this.mSubType = LayoutAreaCards_SubType.HAND;
	} else if (subtype.indexOf("inhand") == 0) {
		this.mSubType = LayoutAreaCards_SubType.INHAND;
	}else if (subtype.indexOf("cards") == 0) {
		this.mSubType = LayoutAreaCards_SubType.CARDS;
	}

		
	this.mType = LayoutArea_Type.CARDS;
	this.mPageVisible = false;
	this.mThickness = 0.0005;
	this.mActive = true;
	this.mSizeText = -1;
	this.mScrollers = [0,-0.5,0.5,0,0,0];
	this.mHasScrollH = false;
	this.mHasScrollV = false;
	this.mScollerAnim = undefined;
	this.mActiveItems = 1;
	
}

LayoutAreaCards.prototype = new LayoutArea();
LayoutAreaCards.prototype.constructor=LayoutAreaCards;


LayoutAreaCards_SubType = 
{
	NONE:0,
	DECK:1,
	DECKBACK:2,
	HAND:3,
	INHAND:4,
	CARDS:5		
}
	
// inheritance



LayoutAreaCards.prototype.initLayout = function() 
{
	if (this.mSubType == LayoutAreaCards_SubType.DECK) {
		this.initDeck(false);
	} else if (this.mSubType == LayoutAreaCards_SubType.DECKBACK) {
		this.initDeck(true);
	} else if (this.mSubType == LayoutAreaCards_SubType.HAND) {
		this.initHand();
	} else if (this.mSubType == LayoutAreaCards_SubType.INHAND) {
		this.initInHand();
	} else if (this.mSubType == LayoutAreaCards_SubType.CARDS) {
		this.initCards();
	}

}

LayoutAreaCards.prototype.initDeck = function(turnback)
{
	var fieldc = 0; 	
	var width = this.mBounds[0];
	var height = this.mBounds[1];
	var fieldind = 0;        
	var field= null;
	var rotzadd = 0;
	
	for (var a=0; a< this.mSize ; a++)
	{
		this.setField(a);
		field = this.mItemFields[fieldind++];

		x = field.mGridx;
		y = field.mGridy;
		field.mX = 0;
		field.mY = 0;
		field.mW = 1;
		field.mH = 1;
		field.mZ = this.mThickness + a * this.mThickness;
		field.mRandX = this.mRandX;
		field.mRandY = this.mRandY;
		field.mRandRotZ = this.mRandZ * 360;
		if (turnback)
		{
			field.mItemRotY = 180;
		}
		fieldc++;
	}
	
	if (this.mLayout == LayoutArea_Layout.WEST_EAST)
	{
		this.mRotation[2] = 90;	
	}else if (this.mLayout == LayoutArea_Layout.EAST_WEST)
	{
		this.mRotation[2] = 270;	
	}else if (this.mLayout == LayoutArea_Layout.NORTH_SOUTH)
	{
		this.mRotation[2] = 0;	
	}else if (this.mLayout == LayoutArea_Layout.SOUTH_NORTH)
	{
		this.mRotation[2] = 180;	
	}   
	
}

LayoutAreaCards.prototype.initHand = function()
{
	var fieldc = 0;
	// get field Width / height
	
	var width = this.mBounds[0];
	var divx = width - width / 2.2;
	var height = this.mBounds[1];
	var fieldind = 0;
	var zadd = this.mThickness;
	for (var a=0; a< this.mSize ; a++)
	{
		this.setField(a);
		var field = this.mItemFields[fieldind++];
		field.mX = a * divx + divx/2 - width/2 + this.mRandX;
		field.mY = 0 + this.mRandY;
		field.mW = 1 - 1 / 2.2;
		field.mH = 1;
		field.mZ = 0 + a * zadd;
		if (this.mRandZ > 0)
		{
			field.mItemRotZ = (this.mRandZ-0.05) * 360;
		}
		field.mRef.setPosition(field.mX,0,field.mZ);
		field.mRef.setScale(divx,1,1);		
		fieldc++;
		
	}
}

LayoutAreaCards.prototype.initInHand = function()
{
	var fieldc = 0;
	var width = this.mBounds[0];
	var divx = width / this.mSize;
	var divx2 = width / this.mSizeW;
	var height = this.mBounds[1];
	var fieldind = 0;
	for (var a=0; a< this.mSize ; a++)
	{
		this.setField(a);
		var field = this.mItemFields[fieldind++];        
		field.mX = a * divx + divx/2 - width/2;
		field.mW =  1 / this.mSizeW;
		field.mH = 1;
		field.mZ = this.mThickness  + a * this.mThickness;
		field.mY = 0;//this.mY  - a * 0.002;
		field.mRandRotZ = this.mRandZ * 360;
		field.mRef.setPosition(field.mX,0,field.mZ);
		field.mRef.setScale(divx2,1,1);
		fieldc++;
	}
	
	if (this.mLayout == LayoutArea_Layout.WEST_EAST)
	{
		this.mRotation[0] = 45;	
	}else if (this.mLayout == LayoutArea_Layout.EAST_WEST)
	{
		this.mRotation[0] = 45;
		this.mRotation[2] = 180;	
	}else if (this.mLayout == LayoutArea_Layout.NORTH_SOUTH)
	{
		this.mRotation[0] = 90;
		this.mRotation[1] = 90;	
	}else if (this.mLayout == LayoutArea_Layout.SOUTH_NORTH)
	{
		this.mRotation[0] = 90;
		this.mRotation[1] = 270;	
	} 	
}


LayoutAreaCards.prototype.initCards = function()
{
	var fieldc = 0;
	var width = this.mBounds[0];
	var divx = width / this.mSize;
	var divx2 = width / this.mSizeW;
	
	var height = this.mBounds[1];
	var fieldind = 0;
	var zadd = this.mThickness;
	
	for (var a=0; a< this.mSize ; a++)
	{
		this.setField(a);
		var field = this.mItemFields[fieldind++];        
		field.mX = a * divx + divx/2 - width/2;
		field.mW = 1 / this.mSizeW;
		field.mH = 1;
		field.mZ = 0 + zadd + a * this.mThickness;
		field.mY = 0;
		if (this.mRandZ > 0)
		{
			field.mItemRotZ = (this.mRandZ-0.05) * 360;
		}
		field.mRef.setPosition(field.mX,0,field.mZ);
		field.mRef.setScale(divx2,height,1);
		fieldc++;

	}
	
	if (this.mLayout == LayoutArea_Layout.WEST_EAST)
	{
		this.mRotation[2] = 0;	
	}else if (this.mLayout == LayoutArea_Layout.EAST_WEST)
	{
		this.mRotation[2] = 180;	
	}else if (this.mLayout == LayoutArea_Layout.NORTH_SOUTH)
	{
		this.mRotation[2] = 90;	
	}else if (this.mLayout == LayoutArea_Layout.SOUTH_NORTH)
	{
		this.mRotation[2] = 270;	
	}
	
}

