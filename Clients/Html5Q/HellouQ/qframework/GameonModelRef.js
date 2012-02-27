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



function GameonModelRef( parent ) 
{
	this.mStaticBounds =  [ 
		-0.5,-0.5,0.0,1.0,
		0.5,-0.5,0.0,1.0,
		-0.5,0.5,0.0,1.0,
		 0.5,0.5,0.0,1.0 ];
	
	this.mBounds =  new Array(16);
    this.mAreaPosition =  [ 0,0,0];
    this.mAreaRotation =  [ 0,0,0];
	
	this.mPosition = new Array( 0,0,0 );
    this.mRotation = new Array(  0,0,0 );
    this.mScale = new Array(  1, 1, 1 );
	this.mScaleAdd =  [ 1,1,1];
    
    this.mTransformOwner = false;
    this.mOwner = 0;
    this.mOwnerMax = 0;
    
    this.mParent = parent;
    this.mAdded = false;
    this.mVisible = false;
	this.mEnabled = true;

    this.mLoc = GameonWorld_Display.WORLD;
	this.mMatrix =  new J3DIMatrix4();

	this.mAnimating = false;
    this.mAnimData = undefined;

}

GameonModelRef.prototype.clear = function()
{
	this.mPosition[0] = 0.0;
	this.mPosition[1] = 0.0;
	this.mPosition[2] = 0.0;
	
	this.mRotation[0] = 0.0;
	this.mRotation[1] = 0.0;
	this.mRotation[2] = 0.0;
	
	this.mScale[0] = 1.0;
	this.mScale[1] = 1.0;
	this.mScale[2] = 1.0;
	
	this.mAreaPosition[0] = 0.0;
	this.mAreaPosition[1] = 0.0;
	this.mAreaPosition[2] = 0.0;
	
	this.mAreaRotation[0] = 0.0;
	this.mAreaRotation[1] = 0.0;
	this.mAreaRotation[2] = 0.0;
	
	this.mScaleAdd[0] = 1.0;
	this.mScaleAdd[1] = 1.0;
	this.mScaleAdd[2] = 1.0;
	
	this.mTransformOwner = false;
	this.mOwner = 0;
}

GameonModelRef.prototype.setOwner = function(owner, ownerMax) 
{
	this.mOwner = owner;
	this.mOwnerMax = ownerMax;
	this.mTransformOwner = true;
}

GameonModelRef.prototype.setPosition = function(x, y, z) {

	if (y == undefined)
	{
		this.mPosition[0] = x[0];
		this.mPosition[1] = x[1];
		this.mPosition[2] = x[2];  	
	}else
	{
		this.mPosition[0] = x;
		this.mPosition[1] = y;
		this.mPosition[2] = z;
	}    	
}

GameonModelRef.prototype.setAreaPosition = function(x, y, z) {

	if (y == undefined)
	{
		this.mAreaPosition[0] = x[0];
		this.mAreaPosition[1] = x[1];
		this.mAreaPosition[2] = x[2];  	
	}else
	{
		this.mAreaPosition[0] = x;
		this.mAreaPosition[1] = y;
		this.mAreaPosition[2] = z;    	
	}
}

GameonModelRef.prototype.addPosition = function(x, y, z) {
	if (y == undefined)
	{
		this.mPosition[0] += x[0];
		this.mPosition[1] += x[1];
		this.mPosition[2] += x[2];  	
	}else
	{
		this.mPosition[0] += x;
		this.mPosition[1] += y;
		this.mPosition[2] += z;    	
	}
}

GameonModelRef.prototype.addAreaPosition = function(x, y, z) {

	if (y == undefined)
	{
		this.mAreaPosition[0] += x[0];
		this.mAreaPosition[1] += x[1];
		this.mAreaPosition[2] += x[2];  	
	}else
	{
		this.mAreaPosition[0] += x;
		this.mAreaPosition[1] += y;
		this.mAreaPosition[2] += z;    	
	}
}

GameonModelRef.prototype.setScale = function(x, y, z) {
	if (y == undefined)
	{
		this.mScale[0] = x[0];
		this.mScale[1] = x[1];
		this.mScale[2] = x[2];  	
	}else
	{
		this.mScale[0] = x;
		this.mScale[1] = y;
		this.mScale[2] = z;  
	}
}    

GameonModelRef.prototype.setRotate = function(x, y, z) {
	if (y == undefined)
	{
		this.mRotation[0] = x[0];
		this.mRotation[1] = x[1];
		this.mRotation[2] = x[2];  	
	}else
	{

		this.mRotation[0] = x;
		this.mRotation[1] = y;
		this.mRotation[2] = z;  
	}
}

GameonModelRef.prototype.setAreaRotate = function(x, y, z) {
	if (y == undefined)
	{
		this.mAreaRotation[0] = x[0];
		this.mAreaRotation[1] = x[1];
		this.mAreaRotation[2] = x[2];  	
	}else
	{
		this.mAreaRotation[0] = x;
		this.mAreaRotation[1] = y;
		this.mAreaRotation[2] = z;  
	}
}

GameonModelRef.prototype.addRotation = function(x, y, z) {
	this.mRotation[0] += x;
	this.mRotation[1] += y;
	this.mRotation[2] += z;  
}    

GameonModelRef.prototype.addAreaRotation = function(x, y, z) {
	this.mAreaRotation[0] += x;
	this.mAreaRotation[1] += y;
	this.mAreaRotation[2] += z;  
}    

GameonModelRef.prototype.apply = function()
{
	if (!this.mAdded) {
		this.mAdded = true;
		this.mParent.addref(this);
		//this.setVisible(true);
	}
}

GameonModelRef.prototype.remove = function() {
	this.mParent.removeref(this);
	this.mAdded = false;
	this.setVisible(false);
}

GameonModelRef.prototype.copy = function(modelRef) {

	this.mPosition[0] = modelRef.mPosition[0];
	this.mPosition[1] = modelRef.mPosition[1];
	this.mPosition[2] = modelRef.mPosition[2];

	this.mScale[0] = modelRef.mScale[0];
	this.mScale[1] = modelRef.mScale[1];
	this.mScale[2] = modelRef.mScale[2];

	this.mScaleAdd[0] = modelRef.mScaleAdd[0];
	this.mScaleAdd[1] = modelRef.mScaleAdd[1];
	this.mScaleAdd[2] = modelRef.mScaleAdd[2];


	this.mRotation[0] = modelRef.mRotation[0];
	this.mRotation[1] = modelRef.mRotation[1];
	this.mRotation[2] = modelRef.mRotation[2];
	
	this.mAreaPosition[0] = modelRef.mAreaPosition[0];
	this.mAreaPosition[1] = modelRef.mAreaPosition[1];
	this.mAreaPosition[2] = modelRef.mAreaPosition[2];

	this.mAreaRotation[0] = modelRef.mAreaRotation[0];
	this.mAreaRotation[1] = modelRef.mAreaRotation[1];
	this.mAreaRotation[2] = modelRef.mAreaRotation[2];	
	
	this.mLoc = modelRef.mLoc;
}

GameonModelRef.prototype.setScaleRef = function(modelRef) {
	this.mScale[0] = modelRef.mScale[0];
	this.mScale[1] = modelRef.mScale[1];
	this.mScale[2] = modelRef.mScale[2];
	
}

GameonModelRef.prototype.setRotation = function(modelRef) {
	this.mRotation[0] = modelRef.mRotation[0];
	this.mRotation[1] = modelRef.mRotation[1];
	this.mRotation[2] = modelRef.mRotation[2];
}

GameonModelRef.prototype.distxy = function(from) {
	var dist = Math.sqrt(( (from.mPosition[0] - this.mPosition[0])*
							(from.mPosition[0] - this.mPosition[0]) +
							(from.mPosition[1] - this.mPosition[1])*
							(from.mPosition[1] - this.mPosition[1])));
	return dist;
}

GameonModelRef.prototype.distxyMat = function(from) {
	var dist = Math.sqrt(( (from.mMatrix[12] - this.mMatrix[12])*
							(from.mMatrix[12] - this.mMatrix[12]) +
							(from.mMatrix[13] - this.mMatrix[13])*
							(from.mMatrix[13] - this.mMatrix[13])));
	return dist;
}

GameonModelRef.prototype.set = function()
{

	this.mMatrix.makeIdentity();

	if (this.mAreaPosition[0] != 0.0 || this.mAreaPosition[1] != 0.0 || this.mAreaPosition[2] != 0.0)
	{
		this.mMatrix.translate(this.mAreaPosition[0], this.mAreaPosition[1], this.mAreaPosition[2]);
	}
	
	if (this.mAreaRotation[0] != 0.0 || this.mAreaRotation[1] != 0.0 || this.mAreaRotation[2] != 0.0)
	{
	
		this.mMatrix.rotate(this.mAreaRotation[0], 1, 0, 0);
		this.mMatrix.rotate(this.mAreaRotation[1], 0, 1, 0);
		this.mMatrix.rotate(this.mAreaRotation[2], 0, 0, 1);
	}
	
	if (this.mPosition[0] != 0.0 || this.mPosition[1] != 0.0 || this.mPosition[2] != 0.0)
	{
	
		this.mMatrix.translate(this.mPosition[0], this.mPosition[1], this.mPosition[2]);
	}
	
	if (this.mRotation[0] != 0.0 || this.mRotation[1] != 0.0 || this.mRotation[2] != 0.0)
	{	
		this.mMatrix.rotate(this.mRotation[0], 1, 0, 0);
		this.mMatrix.rotate(this.mRotation[1], 0, 1, 0);
		this.mMatrix.rotate(this.mRotation[2], 0, 0, 1);
	}
	
	if (this.mScale[0]!= 1.0  || this.mScale[1] != 1.0 || this.mScale[2] != 1.0 ||
		this.mScaleAdd[0] != 1.0 || this.mScaleAdd[1] != 1.0 || this.mScaleAdd[2] != 1.0 )
	{
	
		this.mMatrix.scale(this.mScale[0]*this.mScaleAdd[0],
					this.mScale[1]*this.mScaleAdd[1],
					this.mScale[2]*this.mScaleAdd[2]);
	}

	var mat = this.mMatrix.getAsArray();
	GMath.matrixVecMultiply2(mat, this.mStaticBounds, 0 , this.mBounds,0);
	GMath.matrixVecMultiply2(mat, this.mStaticBounds, 4 , this.mBounds,4);
	GMath.matrixVecMultiply2(mat, this.mStaticBounds, 8 , this.mBounds,8);
	GMath.matrixVecMultiply2(mat, this.mStaticBounds, 12 , this.mBounds,12);	
}

GameonModelRef.prototype.translate = function (x,y,z)
{
	this.mMatrix.translate(x, y, z);
}

GameonModelRef.prototype.setVisible = function(visible)
{
	this.mVisible = visible;
	this.mEnabled = true;
	if (visible)
	{
		if (this.mParent != undefined)this.mParent.addVisibleRef(this);
	}else
	{
		if (this.mParent != undefined)this.mParent.remVisibleRef(this);
		if (this.mAnimating && this.mAnimData != undefined)
		{
			this.mAnimData.cancelAnimation(this);
			this.mAnimating = false;
		}		
	}
}

GameonModelRef.prototype.getVisible = function()
{
	return this.mVisible;
}

GameonModelRef.prototype.setParent = function(gameonModel) {
	this.mParent = gameonModel;
	
}


GameonModelRef.prototype.copyMat = function(ref)
{
	this.mMatrix.load( ref.mMatrix );

}


GameonModelRef.prototype.setAddScale = function(x,y, z) 
{
	if (y == undefined)
	{
		this.mScaleAdd[0] = x[0];
		this.mScaleAdd[1] = x[1];
		this.mScaleAdd[2] = x[2];
	
	}
	else
	{
		this.mScaleAdd[0] = x;
		this.mScaleAdd[1] = y;
		this.mScaleAdd[2] = z;
	}
}


GameonModelRef.prototype.mulScale = function(x, y, z) 
{
	if (y == undefined)
	{
		this.mScale[0] *= x[0];
		this.mScale[1] *= x[1];
		this.mScale[2] *= x[2];

	}
	else
	{
		this.mScale[0] *= x;
		this.mScale[1] *= y;
		this.mScale[2] *= z;
	
	}
}


GameonModelRef.prototype.intersectsRay = function(eye , ray , loc)
{
	// transform bounds!
	var dist = GMath.rayIntersectsBounds(eye, ray, this.mBounds , loc);
	if (dist >= 0)
	{
		return dist;
	}
	return 1e6;
}

GameonModelRef.prototype.getAnimData =function( app)
{
	if (this.mAnimData == undefined)
	{
		this.mAnimData = new AnimData(-1,app);
	}
	return this.mAnimData;
}

GameonModelRef.prototype.activateAnim =function()
{
	if (this.mAnimData == undefined)
		return;		
	this.mAnimating = true;
	this.mAnimData.activate();
}

GameonModelRef.prototype.animate =function(deltaTime) {
	if (this.mAnimData == undefined)
		return;
	if (this.mAnimData.process2(this , deltaTime))
	{
		this.mAnimating = false;
	}
	
}

GameonModelRef.prototype.animating =function()
{
	return this.mAnimating;
}


GameonModelRef.prototype.matrix = function() {
	return this.mMatrix;
}
