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

function TextItem(app,x, y, w, h, z, text, num, offset, loc , layout, colors) 
{
	this.mApp = app;
	this.mX = x;
	this.mY = y;
	this.mZ = z;
	this.mW = w;
	this.mH = h;	
	this.mText = text;
	this.mNum = num;
	this.mOffset = offset;
	this.mLoc = loc;
	this.mColors = colors;
	this.mCentered = false;
	
	this.mVisible = true;
		
    this.mDirX = 1.0;
    this.mDirY = 0.0; 

	this.mOffset = offset;
    this.mRef  = new GameonModelRef(undefined);
	this.mRef.mLoc = loc;
	this.mModel = undefined;
	this.mParent = undefined;
	this.setOrientation( layout);
	this.set(true);
}


TextItem.prototype.updateText = function(text , loc) 
{
	//console.log( "textitem update text " + this.id + " " + text);
	var update = false;
	if (this.mText.length != text.length && this.mNum < 0)
	{
		update = true;
	}	
	this.mText = text;
	this.mLoc = loc;
	this.mRef.mLoc = loc;
	this.set(update);
	return update;
}

TextItem.prototype.setOrientation = function(orientation)
{

	if (orientation == LayoutArea_Layout.WEST_EAST ||
		orientation == LayoutArea_Layout.NONE||
		orientation == LayoutArea_Layout.HORIZONTAL)
	{
		this.mDirX = 1.0;
		this.mDirY = 0.0;        
	}else
	if (orientation == LayoutArea_Layout.EAST_WEST)
	{
		this.mDirX = -1.0;
		this.mDirY = 0.0;        
	}
	else
	if (orientation == LayoutArea_Layout.NORTH_SOUTH || 
		orientation == LayoutArea_Layout.VERTICAL)
	{
		this.mDirX = 0.0;
		this.mDirY = -1.0;        
	}    
	else
	if (orientation == LayoutArea_Layout.SOUTH_NORTH)
	{
		this.mDirX = 0.0;
		this.mDirY = 1.0;        
	}    
	
	if (orientation == LayoutArea_Layout.HORIZONTAL || 
		orientation == LayoutArea_Layout.VERTICAL)
	{
		this.mCentered = true;
	}
}

TextItem.prototype.setOffset = function(offset)
{
	this.mOffset = offset;    
}


TextItem.prototype.set = function(updateref)
{
	this.mRef.setVisible(true);
	if (this.mModel != undefined)
	{
		//this.mModel.clear();
	}
	if (this.mText == undefined)
	{
		return;
		
	}
	
	var wfact = 0.48;
	this.mModel = new GameonModel("letter" , this.mApp);
	this.mModel.mWorld = undefined;
	this.mModel.mLoc = this.mLoc;
	this.mModel.addref( this.mRef );
	
	if (this.mDirX != 0)
	{
		var len = this.mText.length;
		if (len == 0)return;
		var num = this.mNum;
		if (num <= 0) {
			num = len;
		}
	
		if (updateref)
		{
			this.mRef.mPosition[0] = this.mX;
			this.mRef.mPosition[1] = this.mY;
			this.mRef.mPosition[2] = this.mZ;
			this.mRef.mScale[0] = this.mW / num;
			this.mRef.mScale[1] = this.mH;
			
		}
		var start = - num / 2.0 + 0.5;
		if (this.mCentered && this.mNum > 0)
		{
			start = - len / 2.0 + 0.5;
		}
		
		
		var div = 1.0/16.0;
		
		for (var a=0; a< len && a < num ; a++ ) 
		{
			//var x = start + a * divx  * dirx; 
			var val = this.getVal(this.mText.charCodeAt(a)); 
			var tu1 = div * (val  % 16);
			var tv1 = div * Math.floor(val  / 16);
			var tu2 = tu1 + div;
			var tv2 = tv1 + div;	
			
			
			tu1 += this.mApp.mTextures.mU1;
			tv1 += this.mApp.mTextures.mV1;
			tu2 -= this.mApp.mTextures.mU2;
			tv2 -= this.mApp.mTextures.mV2;
			
			if (this.mDirX > 0)
			{
				this.mModel.createPlaneTex2( start-wfact, -wfact, 0.0, start+wfact+this.mApp.mTextures.mCp, wfact, 0.0, 
						tu1,tv1, tu2,tv2,this.mColors, a,1/Math.max(len,num));
			}else
			{
				this.mModel.createPlaneTex2( num-1-start-wfact-this.mApp.mTextures.mCp, -wfact, 0.0, num-1-start+wfact, wfact, 
						0.0, tu1,tv1, tu2,tv2,this.mColors,a,1/Math.max(len,num));
			}
			start += 1.0;
		}
			
	} else {
		var len = this.mText.length;
		if (len == 0)
		{
			return;
		}
		var num = this.mNum;
		if (num <= 0) {
			num = len;
		}
		

		if (updateref)
		{
		
			this.mRef.mPosition[0] = this.mX;
			this.mRef.mPosition[1] = this.mY;
			this.mRef.mPosition[2] = this.mZ;
			this.mRef.mScale[0] = this.mW;
			this.mRef.mScale[1] = this.mH / num;
		}
		
		// NSLog(@" text +++ = %@" , text);
		var start =  num / 2.0 - 0.5;
		if (this.mCentered && this.mNum > 0)
		{
			start = len / 2.0 - 0.5;
		}			
		
		
		var div = 1.0/16.0;
		for (var a=0; a< len && a < num ; a++ ) 
		{
			//var x = start + a * divx  * dirx; 
			var val = this.getVal(this.mText.charCodeAt(a)); 
			var tu1 = div * (val  % 16);
			var tv1 = div * Math.floor(val  / 16);
			var tu2 = tu1 + div;
			var tv2 = tv1 + div;	
			tu1 += this.mApp.mTextures.mU1;
			tv1 += this.mApp.mTextures.mV1;
			tu2 -= this.mApp.mTextures.mU2;
			tv2 -= this.mApp.mTextures.mV2
			
			if (this.mDirY > 0)
			{
				this.mModel.createPlaneTex( -wfact, start-wfact, 0.0, wfact, start+wfact+this.mApp.mTextures.mCp, 0.0, 
						tu1,tv1, tu2,tv2, this.mColors, a,1/Math.max(len,num));
			}else
			{
				this.mModel.createPlaneTex( -wfact, num-1-start-wfact-this.mApp.mTextures.mCp, 0.0, wfact, num-1-start+wfact, 
						0.0, tu1,tv1, tu2,tv2, this.mColors, a,1/Math.max(len,num));
			}
			start += 1.0;
			
		}
	}
	
	this.mModel.setTexture(this.mApp.mTextures.get( TextureFactory_Type.FONT));
	this.mModel.generate(this.mApp.gl);
	this.mModel.mEnabled = true;

	if (updateref)
	{
		//this.mRef.set();
	}
}

TextItem.prototype.draw = function(gl , no)
{
	if (this.mModel == undefined || this.mText == undefined || this.mText.length == 0)
	{
		return;
	}
	
//	if (no == 0)
	{
		this.mModel.setupRef(gl);
	}	
	
	if (this.mOffset > 0)
	{
		var c = this.mApp.mColors.getColorId(this.mOffset);
		var alights = this.mApp.mWorld.getAmbientLight();
		this.mApp.mWorld.setAmbientLightGl(
				alights[0] * c.red, 
				alights[1] * c.green, 
				alights[2] * c.blue, 
				alights[3] * c.alpha,
				gl);
		this.mModel.setupRef(gl);
		this.mModel.drawRef(gl,this.mRef);

		this.mApp.mWorld.setAmbientLightGl(
				alights[0], 
				alights[1], 
				alights[2], 
				alights[3],
				gl);			
		
	}else
	{
		//mModel.setupRef(gl);
		this.mModel.drawRef(gl,this.mRef);
	}
	
	//this.mModel.setupRef(gl, this.mOffset);
	
	//this.mModel.drawRef(gl,this.mRef);
}


TextItem.prototype.getVal = function(val)
{
	var ref = 32;
	if (val < 0 || val > 255) 
	{
			
		switch (val) 
		{
			case 268: ref = 0;break;
			case 269: ref = 1;break;
			case 262: ref = 2;break;
			case 263: ref = 3;break;
			case 272: ref = 13*16;break;
			case 273: ref = 15*16;break;
			case 352: ref = 8*16+10;break;
			case 353: ref = 9*16+10;break;										
			case 381: ref = 8*16+14;break;
			case 382: ref = 9*16+14;break;					
			default:
				ref = 38;
				break;
		}
	} else {
		ref = val;
	}
	return ref;
}


TextItem.prototype.setParent = function(parent)
{
	this.mParent = parent;
}

TextItem.prototype.setVisible = function(visible)
{
	this.mVisible = visible;
	if (visible)
	{
		this.mParent.addVisible(this);
	}else
	{
		this.mParent.removeVisible(this);
	}
	if (this.mRef != undefined)
	{
		this.mRef.setVisible(visible);
	}	
}

TextItem.prototype.getVisible = function()
{
	return this.mVisible;
}

TextItem.prototype.setPosition = function(x, y, z, w, h) {
	this.mX = x;
	this.mY = y;
	this.mZ = z;
	this.mW = w;
	this.mH = h;
	//System.out.println(" set pos " + mText + " " + mX + " " + mY+  " " + mZ + " " + mW + " " + mH);
	this.setRef();
}


TextItem.prototype.setRef = function()
{
	if (this.mRef != undefined)
	{
		if (this.mDirX != 0)
		{
			var  num = this.mNum;
			
			if (num <= 0) {
				num = this.mText.length;
			}
			
			this.mRef.mPosition[0] = this.mX;
			this.mRef.mPosition[1] = this.mY;
			this.mRef.mPosition[2] = this.mZ;
			this.mRef.mScale[0] = this.mW / num;
			this.mRef.mScale[1] = this.mH;

		}
		else
		{
			var num = this.mNum;
			
			if (num <= 0) {
				num = this.mText.length;
			}
			
			this.mRef.mPosition[0] = this.mX;
			this.mRef.mPosition[1] = this.mY;
			this.mRef.mPosition[2] = this.mZ;
			this.mRef.mScale[0] = this.mW;
			this.mRef.mScale[1] = this.mH / num;
			
		}
	}
}

TextItem.prototype.ref = function()
{
	return this.mRef;
}

TextItem.prototype.setParentLoc = function(area) 
{
	if (this.mRef != undefined)
	{
		this.mRef.setAreaPosition(area.mLocation);
		this.mRef.setAreaRotate(area.mRotation);
		this.mRef.mulScale(area.mBounds);
		this.mRef.setAddScale(area.mScale);			
		this.mRef.set();
	}
	
}