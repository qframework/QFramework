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

function LayoutItem( app) 
{
	this.mApp = app;
    this.mType = GameonModelData_Type.NONE;
    this.mModel = undefined;
    this.mModelRef = undefined;
    this.mModelRefOld = new GameonModelRef(undefined);
	this.mOwner = 0;
	this.mOwnerMax = 0;

}

LayoutItem.prototype.remove = function() {
	this.mItemID = -1;
	if (this.mModelRef != undefined) {
		this.mModelRef.remove();
		// remember old one
	}
	return true;

}



LayoutItem.prototype.setEffect = function(effect) {
	this.mEffect = effect;
}

LayoutItem.prototype.setRotation = function(x,y, z) 
{
	this.mModelRef.setRotate( x, y, z);
}

LayoutItem.prototype.addRotation = function(x, y, z) 
{
	this.mModelRef.addRotation(x, y ,z);
}

LayoutItem.prototype.setRotation2 = function(x,y, z) 
{
	if (this.mModelRef == undefined) 
	{
		return;
	}
	this.mModelRefOld.copy( this.mModelRef);			
	this.mModelRef.setRotate( x, y, z);
	this.mModelRef.set();
	
}

LayoutItem.prototype.setPosition2 = function(x, y, z) 
{

	// TODO Auto-generated method stub
	if (this.mModelRef == undefined) 
	{
		return;
	}
	this.mModelRefOld.copy( this.mModelRef);			
	this.mModelRef.setPosition(x, y , z );
	this.mModelRef.set();

}


LayoutItem.prototype.setPosition = function(loc, x, y, z,  
		w, h, doeffect) {

	// TODO Auto-generated method stub
	var copyref = false;
	if (this.mModelRef == undefined) 
	{
		this.mModelRef = new GameonModelRef(this.mModel);
		this.mModelRef.mLoc = loc;
		copyref = true;
	} else {
		this.mModelRefOld.copy( this.mModelRef);
		this.mModelRefOld.copyMat( this.mModelRef);		
	}
	
	var height = 1.0;
	this.mModelRef.setPosition(x, y , z+0.01 );
	this.mModelRef.setScale(w, h , height);
	this.mModelRef.setRotate( 0, 0, 0);
	this.mModelRef.apply();
	if (copyref) {
		this.mModelRefOld.copy( this.mModelRef);
		this.mModelRefOld.copyMat( this.mModelRef);
	}		
	if (this.mOwnerMax > 0) {
		this.mModelRef.setOwner(this.mOwner, this.mOwnerMax);
	}


}


LayoutItem.prototype.setRand = function(x, y, z, rx, ry, rz)
{
	if (x > 0) {
		var add = Math.random() * x - x/2;
		this.mModelRef.mPosition[0] +=add ;
	}
	if (y > 0) {
		var add = Math.random() * y - y/2;
		this.mModelRef.mPosition[1] += add;
	}
	if (z > 0) {
		var add = Math.random() * z - z/2;
		this.mModelRef.mPosition[2] += add;
	}		
	if (rx > 0) {
		var add = Math.random() * rx - rx/2;
		this.mModelRef.mRotation[0] += add;
	}		
	if (ry > 0) {
		var add = Math.random() * ry - ry/2;
		this.mModelRef.mRotation[1] += add;
	}		
	if (rz > 0) {
		var add = Math.random() * rz - rz/2;
		this.mModelRef.mRotation[2] += add;
	}	
}

LayoutItem.prototype.setParentLoc = function(area) 
{
	if (this.mModelRef != undefined)
	{
		this.mModelRef.setAreaPosition(area.mLocation);
		this.mModelRef.setAreaRotate(area.mRotation);
		this.mModelRef.mulScale(area.mBounds);
		this.mModelRef.set();
	}
	
}
