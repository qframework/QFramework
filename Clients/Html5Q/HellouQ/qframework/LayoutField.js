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

function LayoutField( parent) 
{	
	this.mParent = parent;
    this.mID = 0;
    this.mX = 0.0;
    this.mY = 0.0;
    this.mZ = 0.0;
    this.mW = 0.0;
    this.mH = 0.0;
    this.mRandX = 0.0;
    this.mRandY = 0.0;
    this.mRandRotZ = 0.0;
    this.mItemRotX = 0.0;
    this.mItemRotY = 0.0;
    this.mItemRotZ = 0.0;      
    this.mItem = undefined;
    this.mText = undefined;
    this.mGridx = -1;
    this.mGridy = -1;
    this.mGridSzX = 1;
    this.mGridSzY = 1;
    this.mFieldType = LayoutField_FieldType.NONE;
    this.mOwner = 0;
	this.mApp = parent.mApp;
	this.mRef = new GameonModelRef();	
	this.mActive = true;
	this.mState = LayoutArea_State.VISIBLE;
}


LayoutField_FieldType =
{

	NONE:0,
	PLAYER_START:1,
	PLAYER_END:2,
	PLAY_FIELD:3,
	NORM_FIELD:4,
	EMPTY:8, 
	EMPTY2:9
}


LayoutField.prototype.getLoc = function(loc) {
	loc.setPosition( this.mX , this.mY , this.mZ);
}

LayoutField.prototype.setItem = function(itemID, doeffect, showback) 
{
	// create new one
	if (itemID[0] == '[') {
		itemID = itemID.substring(3);
	}
	//Log.d("model", " setitem " + itemID);
	// dereference old one
	if (this.mItem != undefined) {
		this.mItem.remove();
		this.mItem = undefined;
	}
	
	this.mItem = this.mApp.mItems.createItem(itemID , undefined);
	if (this.mItem != undefined)
	{
		this.setItem2(this.mItem , doeffect , showback);
	}
	
	
	
}

LayoutField.prototype.removeFigure = function() {
	if (this.mItem != undefined)
	{
		this.mItem.remove();
		this.mItem = undefined;
	}
}

LayoutField.prototype.clear = function() {
	this.removeFigure();
	this.mOwner = 0;
	if (this.mText != undefined)
	{
		if (this.mParent.mDisplay == GameonWorld_Display.HUD)
		{
			var r = this.mApp.mWorld.mTextsHud;
			r.remove(this.mText);
		}
		else
		{
			var r = this.mApp.mWorld.mTexts;
			r.remove(this.mText);
		}                
		this.mText = undefined;
	}    	
}



LayoutField.prototype.setItem2 = function(item, doeffect, showback) {
	// TODO check if already exists??
	if (this.mItem != undefined) {
		this.mItem.remove();
		this.mItem = undefined;
	}
	
	this.mItem = item;
	if (this.mItem != undefined){

		var  w = this.mW;
		var  h = this.mH;        	
		if (w == 0 || h == 0)
			return;
		else
		{
			this.mItem.setPosition(this.mParent.mDisplay, this.mX, this.mY,this.mZ+0.001 ,  w , h , doeffect);
			this.mItem.setRand(this.mRandX,this.mRandY, 0,0,0, this.mRandRotZ);
			this.mItem.setParentLoc(this.mParent);
			this.mItem.addRotation(this.mItemRotX,this.mItemRotY , this.mItemRotZ);		        
			this.mItem.mModelRef.set();
			this.setState(this.mState);
		}

	}
	
}

LayoutField.prototype.setText = function(data, num) 
{
	var w = this.mW;
	var h = this.mH;
	var x = this.mX;
	var y = this.mY;
	if (data == undefined || data.length == 0)
	{
		if (this.mText != undefined)
		{
			this.mApp.mWorld.mTextsHud.remove(this.mText);
			this.mApp.mWorld.mTexts.remove(this.mText);
			this.mText = undefined;
		}
		return;
	}
	
	if (this.mText != undefined) 
	{
		//console.log( "layoutfield update text " + this.mParent.mID + " " + this.id + " " + odata );
		this.mText.updateText(data , this.mParent.mDisplay);
		this.mText.setRef();
	}else {
		
		if (this.mParent.mDisplay == GameonWorld_Display.HUD)
		{
			if (num > 0) {
				this.mText = new TextItem(this.mApp, x,y,w,h,this.mZ+0.002,
					data, num, this.mOwner , this.mParent.mDisplay, this.mParent.mLayout,
	        				this.mParent.mColors);
			}else{
				this.mText = new TextItem(this.mApp, x,y,w,h,this.mZ+0.002, data, -1.0,
				this.mOwner, this.mParent.mDisplay, this.mParent.mLayout,
	        				this.mParent.mColors);
			}
			this.mApp.mWorld.mTextsHud.add(this.mText , 
							this.mParent.mState == LayoutArea_State.VISIBLE && this.mParent.mPageVisible);
			this.mText.setParent(  this.mApp.mWorld.mTextsHud );
		}else
		{
			if (num > 0) {
				this.mText = new TextItem(this.mApp, x,y,w,h,this.mZ+0.002, 
					data, num, this.mOwner, this.mParent.mDisplay, this.mParent.mLayout,
	        				this.mParent.mColors);
			}else{
				this.mText = new TextItem(this.mApp, x,y,w,h,this.mZ+0.002, 
					data, -1.0 , this.mOwner, this.mParent.mDisplay, this.mParent.mLayout,
	        				this.mParent.mColors);
			}
			this.mApp.mWorld.mTexts.add(this.mText , 
							this.mParent.mState == LayoutArea_State.VISIBLE && this.mParent.mPageVisible);
			this.mText.setParent(  this.mApp.mWorld.mTexts );
		}
		//this.mText.setOrientation(this.mParent.mLayout);	
	}
	var ref = this.mText.mRef;
	ref.setAreaPosition(this.mParent.mLocation);
	ref.setAreaRotate(this.mParent.mRotation);
	ref.mulScale(this.mParent.mBounds);
	ref.set(); 		
	
}

LayoutField.prototype.setState = function(state) {
	if (!this.mActive)
		return;
		
    if (!this.mParent.mPageVisible)
        state = LayoutArea_State.HIDDEN;
	this.mState = state;
	if (state == LayoutArea_State.VISIBLE)
	{
		if (this.mText != undefined) {
			this.mText.setVisible(true);
		}
		if (this.mItem != undefined) {
			this.mItem.mModelRef.setVisible(true);
		}
	}else
	{
		if (this.mText != undefined) {
			this.mText.setVisible(false);
		}			
		if (this.mItem != undefined) {
			this.mItem.mModelRef.setVisible(false);
		}			
	}
	
}

LayoutField.prototype.setOwner = function(owner)
{
	this.mOwner = owner;
	if (this.mText != undefined) {
		this.mText.setOffset(owner);
	}
}


LayoutField.prototype.invertItem = function()
{
	if (this.mOwner == 0)
	{
		this.mOwner = 4;
	}else {
		this.mOwner = 0;
	}
	if (this.mText != undefined)
	{
		this.mText.setOffset(this.mOwner);
	}
	
}


LayoutField.prototype.updateLocation = function()
{
	var  w = this.mW;
	var  h = this.mH;

	if (this.mItem != undefined){
		if (w == 0 || h == 0)
			return;
		else
		{
			//NSLog(@" %f %f %f %f " , this.mX, this.mY, this.mZ, this.mH);            
			this.mItem.setPosition(this.mParent.mDisplay,this.mX,this.mY,this.mZ+0.001,w ,h ,false);
			this.mItem.setRand(this.mRandX,this.mRandY, 0,0,0, this.mRandRotZ);
			this.mItem.setParentLoc(this.mParent);
			this.mItem.addRotation(this.mItemRotX,this.mItemRotY , this.mItemRotZ);		        
			this.mItem.mModelRef.set();
		}
	}
	if (this.mText != undefined)
	{
		this.mText.setPosition(this.mX,this.mY,this.mZ+0.002,w ,h);
		this.mText.setParentLoc(this.mParent);
		this.mText.ref().set();
		
	}	
	
	
}
	
LayoutField.prototype.createAnimTrans = function(movetype, delay, away) {
	if (this.mText != undefined && this.mText.mModel != undefined)
	{
		this.mText.mModel.createAnimTrans(movetype , delay, away);
	}
	if (this.mItem != undefined)
	{
		var index = this.mItem.mModel.mRefs.indexOf( this.mItem.mModelRef);
		this.mItem.mModel.createAnimTrans(movetype , delay, away, index);
	}	
}


LayoutField.prototype.setScale = function()
{
	if (this.mItem != undefined && this.mItem.mModelRef != undefined)
	{
		this.mItem.mModelRef.setScale(this.mW,this.mH,1);
	}
	if (this.mText != undefined)
	{
		this.mText.setRef();
	}
	if (this.mRef != undefined)
	{
		this.mRef.setScale(this.mW,this.mH,1);
	}
}
	

LayoutField.prototype.createAnim = function(type, delay, data) 
{
	if (this.mText != undefined && this.mText.mModel != undefined)
	{
		this.mText.mModel.createAnim(type , 0 , delay, data);
	}
	if (this.mItem != undefined)
	{
		var index = this.mItem.mModel.findRef( this.mItem.mModelRef);
		this.mItem.mModel.createAnim(type , index ,delay, data);
	}		
}
