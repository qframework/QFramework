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

function GameonWorld(app)
{

    this.mModelList = [];
    this.mVisibleModelList = [];	
    this.mModelList2 = [];    
	this.mVisibleModelList2 = [];    	
    this.mNewModels = [];
	this.mTexts = new TextRender();
	this.mTextsHud = new TextRender();
	this.mInDraw = false;
	
	this.mSplashModel = undefined;
	this.mAmbientLight = [ 1.0 , 1.0, 1.0, 1.0];
	this.mAmbientLightChanged = false;
	this.mApp = app;
	GameonWorld.mWorld = this;	
}



GameonWorld_Display =
{
	WORLD:0,
	HUD:1
}

GameonWorld.prototype.initSplash = function(gl , name)
{
	var model = new GameonModel("splash", this.mApp);
	model.createPlane(-1.5, -1.0, 0.0, 1.5, 1.0, 0.0,this.mApp.colors().white);
	
	this.mApp.textures().newTexture(gl, "q_splash", name, true);
	model.setTexture( this.mApp.textures().getTexture("q_splash"));
	var ref = new GameonModelRef(undefined , this);
	ref.mLoc = GameonWorld_Display.HUD;
	model.addref(ref);
	this.mSplashModel = model;
	model.generate(gl);
	model.mEnabled = true;		
}

GameonWorld.prototype.add = function(model, gl)
{
	if (model.isValid())
	{	
		var i = this.mNewModels.indexOf(model);
		if (i>= 0)
		{
			console.error(" model alerady in ");
		}
		this.mNewModels.push(model);
		//model.generate(gl);
	}

}

GameonWorld.prototype.remove = function(model)
{
	var i = this.mModelList.indexOf(model);
	if ( i >= 0)
	{
		this.mModelList.splice(i,1);
	}
	i = this.mModelList2.indexOf(model);
	if ( i >= 0)
	{
		this.mModelList2.splice(i,1);
	}
	this.remVisible(model);

}
	

GameonWorld.prototype.addModels = function(gl)
{
	for (var a=0 ; a < this.mNewModels.length; a++)
	{
		var model= this.mNewModels[a];
		if (model.mIsModel)
		{
			var i = this.mModelList2.indexOf(model);
			if (i>= 0)
			{
				console.error(" model alerady in 1");
			}		
			model.generate(gl);
			this.mModelList2.push(model);				
		}else
		{
			var i = this.mModelList.indexOf(model);
			if (i>= 0)
			{
				console.error(" model alerady in 2");
			}				
			model.generate(gl);
			this.mModelList.push(model);
		}
		/*
		if (model.getVisible())
		{
			this.setVisible(model);
		}
*/		
	}
	this.mNewModels = [];

}

GameonWorld.prototype.draw = function(gl) {
	if (this.mLockedDraw) return;
	if (this.mAmbientLightChanged)
	{
		//gl.glLightModelfv(gl.LIGHT_MODEL_AMBIENT, this.mAmbientLight,0);
		this.mAmbientLightChanged = false;
		gl.uniform4f(gl.getUniformLocation(gl.program, "ambientL"), 
		this.mAmbientLight[0], this.mAmbientLight[1],
		this.mAmbientLight[2], this.mAmbientLight[3]);		
	}
	
	//this.prepare(gl);
/*
	if (this.testModel == undefined)
	{
		this.testModel = new GameonModel();
		this.testModel.createPlane( -1.0, -1.0, 0, 1.0, 1.0, 0,this.mApp.colors().red );
		this.testModel.generate(gl);
		//var ref = new GameonModelRef();
		//this.testModel.addref(ref);
	}
	
	if (this.testModel != undefined)
	{
		//this.testModel.drawRef(gl );
	}
*/	

	
	//gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	var len = this.mVisibleModelList.length;
	
	for (var a=0; a< len; a++) {
		var model = this.mVisibleModelList[a];
		if (!model.mHasAlpha)
		{
			model.draw(gl, GameonWorld_Display.WORLD);
		}
	}
	for (var a=0; a < len ; a++) {
		var model = this.mVisibleModelList[a];
		if (model.mHasAlpha)
		{
			model.draw(gl, GameonWorld_Display.WORLD);
		}
	}

	len = this.mVisibleModelList2.length;
	for (var a=0; a< len; a++) {
		var model = this.mVisibleModelList2[a];
		if (!model.mHasAlpha)
		{
			model.draw(gl, GameonWorld_Display.WORLD);
		}
	}
	for (var a=0; a < len ; a++) {
		var model = this.mVisibleModelList2[a];
		if (model.mHasAlpha)
		{
			model.draw(gl, GameonWorld_Display.WORLD);
		}
	}
	
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	this.mTexts.render(gl);
}

GameonWorld.prototype.drawHud = function(gl) {
	
	if (this.mLockedDraw) return;
	var len = this.mVisibleModelList.length;
	//gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	/*
	gl.mvMatrix.makeIdentity();
	gl.mvpMatrix.load(gl.perspectiveMatrix);
	gl.mvpMatrix.multiply(gl.mvMatrix);
	gl.mvpMatrix.setUniform(gl, gl.u_modelViewProjMatrixLoc, false);
	*/
	//for (int a=0; a< len; a++) 
	
	for (var a=len-1; a>=0 ; a--)
	{
		var model = this.mVisibleModelList[a];
		//if (model.mLoc == GameonWorld_Display.HUD && !mLockedDraw)
		model.draw(gl, GameonWorld_Display.HUD);
		if (this.mLockedDraw) return;
	}
	
	len = this.mVisibleModelList2.length;
	for (var a=len-1; a>=0 ; a--)
	{
		var model = this.mVisibleModelList2[a];
		//if (model.mLoc == GameonWorld_Display.HUD && !mLockedDraw)
			model.draw(gl, GameonWorld_Display.HUD);
	}

	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	this.mTextsHud.render(gl);
}

GameonWorld.prototype.prepare = function(gl) {

	//gl.glEnableClientState(gl.GL_TEXTURE_COORD_ARRAY);
	//gl.glEnableClientState(gl.GL_COLOR_ARRAY);
	//gl.glEnable( gl.GL_COLOR_MATERIAL);
	//gl.glEnableClientState(gl.GL_VERTEX_ARRAY);	
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	//gl.glEnable(gl.GL_TEXTURE_2D);
	//gl.activeTexture(gl.GL_TEXTURE0);
	 //gl.shadeModel(gl.GL_SMOOTH);
	gl.hint(gl.PERSPECTIVE_CORRECTION_HINT,
			gl.NICEST);

			
	gl.clearColor(0.0, 0.0, 0.0,1.0);
	//gl.glShadeModel(GL.GL_SMOOTH);
	
	gl.disable(gl.STENCIL_TEST);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	//gl.depthFunc(gl.LESS);
	//gl.depthMask(1);
	//gl.depthRange( 0.01, 10 );
	console.log (" DEPTH_TEST " + gl.getParameter(gl.DEPTH_TEST));
	console.log (" DEPTH_RANGE " + gl.getParameter(gl.DEPTH_RANGE)[0]);
	console.log (" DEPTH_RANGE " + gl.getParameter(gl.DEPTH_RANGE)[1]);
	console.log (" DEPTH_FUNC " + gl.getParameter(gl.DEPTH_FUNC));
	console.log (" DEPTH_BITS " + gl.getParameter(gl.DEPTH_BITS));
	
	
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	//gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	//gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	
	//gl.glEnable(GL.GL_TEXTURE_2D);
	//gl.disable(gl.DITHER);
	
	//gl.enable(gl.ALPHA_TEST);
	//gl.alphaFunc(gl.GREATER,0.0);
	//gl.enable(gl.LIGHTING);
	//gl.lightModelfv(gl.LIGHT_MODEL_AMBIENT, this.mAmbientLight,0);
	gl.uniform4f(gl.getUniformLocation(gl.program, "ambientL"), 
		this.mAmbientLight[0], this.mAmbientLight[1],
		this.mAmbientLight[2], this.mAmbientLight[3]);		
	
}

GameonWorld.prototype.clear = function() {

	this.mLockedDraw = true;
	this.mModelList.clear();
	this.mNewModels.clear();
	this.mTexts.clear();
	this.mTextsHud.clear();
	this.mLocked = false;
	this.mLockedDraw = false;

}

GameonWorld.prototype.reinit = function() {
	this.mLockedDraw = true;
	var len = this.mModelList.length;
	for (var a=0; a< len; a++) {
		var model = this.mModelList[a];
		model.reset();
	}

	this.mLockedDraw = false;
}


GameonWorld.prototype.setVisible = function(model)
{
	if (model.mIsModel)
	{
		if (this.mVisibleModelList2.indexOf(model) < 0)
		{
		
			for (var a=0; a< this.mVisibleModelList2.length; a++)
			{
				if (this.mVisibleModelList2[a].mTextureID == model.mTextureID)
				{
					this.mVisibleModelList2.splice(a,0,model);	
					return;
				}
			}
			this.mVisibleModelList2.push(model);	
		}
	}else
	{
		if (this.mVisibleModelList.indexOf(model) < 0)
		{
			for (var a=0; a< this.mVisibleModelList.length; a++)
			{
				if (this.mVisibleModelList[a].mTextureID == model.mTextureID)
				{
					this.mVisibleModelList.splice(a,0,model);	
					return;
				}
			}		
			this.mVisibleModelList.push(model);	
		}		
	}
}

GameonWorld.prototype.remVisible = function(model)
{
	if (model.mIsModel)
	{
		var i = this.mVisibleModelList2.indexOf(model);
		if ( i >= 0)
		{
			this.mVisibleModelList2.splice(i,1);	
		}
	}else
	{
		var i = this.mVisibleModelList.indexOf(model);
		if (i >= 0)
		{
			this.mVisibleModelList.splice(i,1);	
		}		
	}
}	

GameonWorld.prototype.drawSplash = function(gl) {
	if (this.mSplashModel != undefined)
	{
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		if (this.mAmbientLightChanged)
		{
			//gl.glLightModelfv(gl.LIGHT_MODEL_AMBIENT, this.mAmbientLight,0);
			this.mAmbientLightChanged = false;
			gl.uniform4f(gl.getUniformLocation(gl.program, "ambientL"), 
			this.mAmbientLight[0], this.mAmbientLight[1],
			this.mAmbientLight[2], this.mAmbientLight[3]);		
		}	
	
		this.mSplashModel.setState(LayoutArea_State.VISIBLE);
		this.mSplashModel.draw(gl, GameonWorld_Display.HUD);
		this.mSplashModel.setState(LayoutArea_State.HIDDEN);
	}
	
}

GameonWorld.prototype.setAmbientLight = function(a , r, g, b)
{
	this.mAmbientLight[0] = a;
	this.mAmbientLight[1] = r;
	this.mAmbientLight[2] = g;
	this.mAmbientLight[3] = b;
	this.mAmbientLightChanged = true;
}

GameonWorld.prototype.getAmbientLight = function()
{
	var ret = new Array(4);
	ret[0] = this.mAmbientLight[0];
	ret[1] = this.mAmbientLight[1];
	ret[2] = this.mAmbientLight[2];
	ret[3] = this.mAmbientLight[3]; 
	return ret;
}

GameonWorld.prototype.setAmbientLightGl = function( a , r, g, b, gl)
{
	this.mAmbientLight[0] = a;
	this.mAmbientLight[1] = r;
	this.mAmbientLight[2] = g;
	this.mAmbientLight[3] = b;
	this.mAmbientLightChanged = true;
	//gl.glLightModelfv(GL2.GL_LIGHT_MODEL_AMBIENT, mWorld.mAmbientLight,0);
	gl.uniform4f(gl.getUniformLocation(gl.program, "ambientL"), 
			this.mAmbientLight[0], this.mAmbientLight[1],
			this.mAmbientLight[2], this.mAmbientLight[3]);	
}

GameonWorld.prototype.texts = function()
{
	return this.mTexts;
}

GameonWorld.prototype.textsHud = function()
{
	return this.mTextsHud;
}

	
	
