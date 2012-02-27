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

function GameonWorldView(world, app)
{
	this.mWorld = world;
	this.mDoOnce = false;
	this.mApp = app;
	
    this.mLockedDraw = false;
    this.mFov = 45;
    this.mNear = 0.1;
    this.mFar = 8.7;

    this.mFovHud = 45;
    this.mNearHud = 0.1;
    this.mFarHud = 8.7;	
	this.mSplashLookat = new J3DIMatrix4();
}

GameonWorldView.prototype.onDrawFrame = function (gl , time)
{
	// apply camera
	// set to shader. default camera
	
	// render world
	
	if (this.mLockedDraw)return;
	gl.colorMask(true, true, true, false);
	//this.mWorld.prepare(gl);
	gl.clearDepth(1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	this.perspective(gl, this.mFov , this.mWidth/this.mHeight , this.mNear , this.mFar , true);
	this.mApp.cs().applyCamera(gl);

		// render 3d world
	this.mWorld.mInDraw = true;
	
	// TODO bind proj
	
	this.mWorld.draw(gl);
	
    gl.clear(gl.DEPTH_BUFFER_BIT);
	
	this.perspectiveHud(gl, this.mFovHud , this.mWidth/this.mHeight , this.mNearHud , this.mFarHud, true);
	this.mApp.cs().applyCameraHud(gl);
	
	this.mWorld.drawHud(gl);
		
	this.mWorld.mInDraw = false;
	gl.colorMask(true, true, true, true);
}

GameonWorldView.prototype.onSurfaceChanged = function (gl , width, height)
{
	this.mWidth = width;
	this.mHeight = height;
	this.mWorld.prepare(gl);	
	gl.viewport(0, 0, width, height);
	this.mApp.cs().saveViewport(width, height);
	gl.perspectiveMatrix = new J3DIMatrix4();
	this.perspective(gl, this.mFov , this.mWidth/this.mHeight , this.mNear , this.mFar , false);
	this.perspectiveHud(gl, this.mFovHud , this.mWidth/this.mHeight , this.mNearHud , this.mFarHud , false);
	
}

GameonWorldView.prototype.onSurfaceCreated = function (gl , width, height)
{
	if (!this.doOnce)
	{
		//this.mApp.cs().setGlu(glu);
		//this.mApp.mAnims.init();
		this.mApp.textures().init(gl);
		//this.mApp.mItems.init(this.mWorld, gl);
		this.mApp.sounds().init(this.mApp);	    	
		if (this.mApp.mSplashScreen != undefined && this.mApp.mSplashScreen.length > 0)
		{
			this.mWorld.initSplash(gl, this.mApp.mSplashScreen);	
		}		
		this.doOnce = true;
	}else
	{
		this.mApp.textures().init(gl);
	}

}


GameonWorldView.prototype.perspective = function(gl,fovy, aspect, zmin , zmax, frustrumUpdate)
{
	var xmin, xmax, ymin, ymax;
	ymax = zmin * Math.tan(fovy * Math.PI / 360.0);
	ymin = -ymax;
	xmin = ymin * aspect;
	xmax = ymax * aspect;
	if (frustrumUpdate)
	{
		gl.perspectiveMatrix.perspective(fovy , aspect , zmin , zmax);
	}else
	{
		this.mApp.cs().saveProjection(xmin , xmax , ymin , ymax , zmin , zmax);
		this.mApp.cs().saveProj(fovy, aspect, zmin, zmax);
	}
}

GameonWorldView.prototype.perspectiveHud = function(gl,fovy, aspect, zmin , zmax, frustrumUpdate)
{
	var xmin, xmax, ymin, ymax;
	ymax = zmin * Math.tan(fovy * Math.PI / 360.0);
	ymin = -ymax;
	xmin = ymin * aspect;
	xmax = ymax * aspect;
	if (frustrumUpdate)
	{
		gl.perspectiveMatrix.makeIdentity();
		gl.perspectiveMatrix.perspective(fovy , aspect , zmin , zmax);
	}else
	{
		this.mApp.cs().saveProjectionHud(xmin , xmax , ymin , ymax , zmin , zmax);
		this.mApp.cs().saveProjHud(fovy, aspect, zmin, zmax);
	}
}


GameonWorldView.prototype.drawSplash = function(gl) {
	
	
	this.perspectiveHud(gl, this.mFovHud , this.mWidth/this.mHeight , this.mNearHud , this.mFarHud , true);
	
	var lookat = new J3DIMatrix4();
	var lookmat = new Array(16);
	GMath.lookAt(lookmat, [0.0, 0.0, 5] , [0, 0, 0] , [0, 1.0, 0.0]);
	lookat.load(lookmat);
	gl.perspectiveMatrix.multiply(lookat);
	gl.perspectiveMatrix.setUniform(gl , gl.u_modelProjMatrixLoc, false);

	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	this.mWorld.drawSplash(gl);
	return true;
}

GameonWorldView.prototype.lockDraw = function(lock)	
{
	this.mLockedDraw = lock;
}


GameonWorldView.prototype.setFov = function(fovf, nearf, farf) {
	this.mFar = farf;
	this.mNear = nearf;
	this.mFov = fovf;
	this.perspective(gl, this.mFov , this.mWidth/this.mHeight , this.mNear , this.mFar , false);
	
}

GameonWorldView.prototype.setFovHud = function(fovf, nearf, farf) 
{
	this.mFarHud = farf;
	this.mNearHud = nearf;
	this.mFovHud = fovf;
	this.perspectiveHud(gl, this.mFovHud , this.mWidth/this.mHeight , this.mNearHud , this.mFarHud , false);
	
}

