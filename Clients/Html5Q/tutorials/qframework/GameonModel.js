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

function GameonModel(name , app)
{
	this.mName = name
    //GLVertex	mPosition;
	this.mRefs = [];
	this.mVisibleRefs = [];
	this.mLoc = GameonWorld_Display.WORLD;
    this.mSubmodels  = 0;
    this.mModelTemplate = GameonModelData_Type.NONE;
    this.mHasAlpha = false;	
    this.mIsModel = false;
	this.mApp = app;
	this.mWorld = app.mWorld;
	this.mVisible = true;

	this.mName = "";
	this.mBBoxMin = new Array(3);
	this.mBBoxMax = new Array(3);
	
	this.mTextureOffset = 0;
	this.mTextureW = 1;
	this.mTextureH = 1;
	this.mTextureWDiv = 0;
	this.mTextureHDiv = 0;
	
	this.mEnabled = false;
	this.mForceHalfTexturing = false;
	this.mForcedOwner = 0;
	this.mShapeList = [];	
	this.mVertexList = [];
	
	this.mIndexCount = 0;

    this.mVertexBuffer = undefined;
    this.mColorBuffer = undefined;
    this.mIndexBuffer = undefined;
    this.mTextureBuffer = undefined;
    this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
    this.mTransform = false;
    this.mBBoxMin = [];
    this.mBBoxMax = [];
	
    this.mVertexOffset = 0;
    this.mColorOffset = 0;
	this.mGenerated = false;
	this.mActive = true;
	
}

// inheritance
GameonModel.inheritsFrom( GLModel);


GameonModel.prototype.createPlane = function(left, bottom, back, right, top, front, color)  
{
	var shape = new GLShape(this);
	var leftBottomFront = shape.addVertex(left, bottom, front , 0.01, 0.99, color);
	var rightBottomFront = shape.addVertex(right, bottom, front , 0.99 , 0.99, color);
	var leftTopFront = shape.addVertex(left, top, front , 0.01 , 0.01, color);
	var rightTopFront = shape.addVertex(right, top, front , 0.99 , 0.01, color);
	// front
	//shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

//        shape.setFaceColor(0, color);
	//this.mTextureID = 1;//this.mApp.textures().get(TextureFactory_Type.DEFAULT);
	this.addShape(shape);
}

GameonModel.prototype.createPlaneTex = function(left, bottom, back, right, top, front,  tu1,tv1, tu2, tv2, color)  
{
	var shape = new GLShape(this);
	var leftBottomFront = shape.addVertex(left, bottom, front , tu1 , tv2, color);
	var rightBottomFront = shape.addVertex(right, bottom, front , tu2 , tv2, color);
	var leftTopFront = shape.addVertex(left, top, front , tu1 , tv1, color);
	var rightTopFront = shape.addVertex(right, top, front , tu2 , tv1, color);
	// front
	//shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

	this.addShape(shape);
}



GameonModel.prototype.createModel = function(type, left, bottom,  back, 
		right, top,  front, textid) {
	var ratiox = right - left;
	var ratioy = front - bottom;
	var ratioz = top - back;    	
	
	var data = GameonModelData.getData(type);
	
	var color = this.mApp.colors().white;
	// model info - vertex offset?
	var len = data.length;
	var shape = new GLShape(this);
	var xmid = (right + left) /2;
	var ymid = (top + bottom) /2;
	var zmid = (front + back) /2;

	for (var a=0; a< len; a+=9 ) {
		var vx1 = data[a][0];
		var vy1 = data[a][1];
		var vz1 = data[a][2];
		
		var tu1 = data[a+2][0];
		var tv1 = 1.0- data[a+2][1];    		
		vx1 *= ratiox; vx1 += xmid;
		vy1 *= ratioy; vy1 += ymid;
		vz1 *= ratioz; vz1 += zmid;
		var v1 = shape.addVertex(vx1, vy1, vz1, tu1, tv1, color);
		
		var vx2 = data[a+3][0];
		var vy2 = data[a+3][1];
		var vz2 = data[a+3][2];
		
		var tu2 = data[a+5][0];
		var tv2 = 1.0- data[a+5][1];    		
		
		vx2 *= ratiox; vx2 += xmid;
		vy2 *= ratioy; vy2 += ymid;
		vz2 *= ratioz; vz2 += zmid;
		var v2 = shape.addVertex(vx2, vy2, vz2, tu2, tv2, color);

		var vx3 = data[a+6][0];
		var vy3 = data[a+6][1];
		var vz3 = data[a+6][2];
		
		var tu3 = data[a+8][0];
		var tv3 = 1.0- data[a+8][1];    		
		
		vx3 *= ratiox; vx3 += xmid;
		vy3 *= ratioy; vy3 += ymid;
		vz3 *= ratioz; vz3 += zmid;
		var v3 = shape.addVertex(vx3, vy3, vz3, tu3, tv3, color);    		
		
		shape.addFace( new GLFace(v1,v2,v3));
		//shape.setFaceColor(a/9, color);
	}
	
	this.addShape(shape);
	this.mTextureID = textid;

}

GameonModel.prototype.createModel = function(type, textid) {
    	
    	var data = GameonModelData.getData(type);
    	// model info - vertex offset?
    	var len = data.length;
    	var color = this.mApp.colors().white;
    	var shape = new GLShape(this);
    	for (var a=0; a< len; a+=9 ) {
    		var vx1 = data[a][0];
    		var vy1 = data[a][1];
    		var vz1 = data[a][2];
    		
    		var tu1 = data[a+2][0];
    		var tv1 = 1.0 - data[a+2][1];    		
    		var v1 = shape.addVertex(vx1, vy1, vz1, tu1, tv1, color);
    		
    		var vx2 = data[a+3][0];
    		var vy2 = data[a+3][1];
    		var vz2 = data[a+3][2];
    		
    		var tu2 = data[a+5][0];
    		var tv2 = 1.0 - data[a+5][1];    		
    		
    		var v2 = shape.addVertex(vx2, vy2, vz2, tu2, tv2, color);

    		var vx3 = data[a+6][0];
    		var vy3 = data[a+6][1];
    		var vz3 = data[a+6][2];
    		
    		var tu3 = data[a+8][0];
    		var tv3 = 1.0 - data[a+8][1];    		
    		
    		var v3 = shape.addVertex(vx3, vy3, vz3, tu3, tv3, color);    		
    		
    		shape.addFace( new GLFace(v1,v2,v3));
    		//shape.setFaceColor(a/9, color);
    	}
    	
		this.addShape(shape);
		this.mTextureID = textid;
    
    }    
	
GameonModel.prototype.createModel2 = function(type, left, bottom, back, 
		right, top, front,
		color)
{
	var ratiox = right - left;
	var ratioy = front - bottom;
	var ratioz = top - back;    	
	if (color == undefined)
	{
		color = this.mApp.colors().white;
	}
	var data = GameonModelData.getData(type);
	// model info - vertex offset?
	var len = data.length;
	var shape = new GLShape(this);
	var xmid = (right + left) /2;
	var ymid = (top + bottom) /2;
	var zmid = (front + back) /2;

	for (var a=0; a< len; a+=9 ) {
		var vx1 = data[a][0];
		var vy1 = data[a][1];
		var vz1 = data[a][2];
		
		vx1 *= ratiox; vx1 += xmid;
		vy1 *= ratioy; vy1 += ymid;
		vz1 *= ratioz; vz1 += zmid;
		var tu1 = data[a+2][0];
		var tv1 = 1.0 - data[a+2][1];    		
		var v1 = shape.addVertex(vx1, vy1, vz1 , tu1, tv1, color);
		
		var vx2 = data[a+3][0];
		var vy2 = data[a+3][1];
		var vz2 = data[a+3][2];
		
		vx2 *= ratiox; vx2 += xmid;
		vy2 *= ratioy; vy2 += ymid;
		vz2 *= ratioz; vz2 += zmid;
		var tu2 = data[a+5][0];
		var tv2 = 1.0 - data[a+5][1];    		
		var v2 = shape.addVertex(vx2, vy2, vz2, tu2 , tv2, color);

		var vx3 = data[a+6][0];
		var vy3 = data[a+6][1];
		var vz3 = data[a+6][2];
		
		vx3 *= ratiox; vx3 += xmid;
		vy3 *= ratioy; vy3 += ymid;
		vz3 *= ratioz; vz3 += zmid;
		var tu3 = data[a+8][0];
		var tv3 = 1.0 - data[a+8][1];    		
		var v3 = shape.addVertex(vx3, vy3, vz3, tu3, tv3, color);    		
		
		shape.addFace( new GLFace(v1,v2,v3));
		//shape.setFaceColor(a/9, color);
	}
	/*
	for (var a=0; a< len/9; a++) {
		shape.setFaceColor(a, color);
	}*/
	this.addShape(shape);
	//this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
}

GameonModel.prototype.createOctogon = function(left, bottom, back, right, top, front, color)  
{
	var shape = new GLShape(this);
	var divx = (right - left ) / 4;
	var divy = (top - bottom ) / 4;
	
	var p1 = shape.addVertex(left + divx, top, front , 0.0 , 1.00, color);
	var p2 = shape.addVertex(left + 3 * divx, top, front , 0.0 , 1.00, color);
	var p3 = shape.addVertex(right,  bottom + 3 * divy, front , 0.0 , 1.00, color);
	var p4 = shape.addVertex(right,  bottom +  divy, front , 0.0 , 1.00, color);
	var p5 = shape.addVertex(left + 3*divx, bottom, front , 0.0 , 1.00, color);
	var p6 = shape.addVertex(left + divx, bottom, front , 0.0 , 1.00, color);
	var p7 = shape.addVertex(left , bottom + divy, front , 0.0 , 1.00, color);
	var p8 = shape.addVertex(left , bottom + 3* divy, front , 0.0 , 1.00, color);
	
	

	var center = shape.addVertex( (right + left) / 2, (top + bottom ) / 2, front, 0.5,0.5, this.mApp.colors().white);
	// front
	//shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
	shape.addFace(new GLFace(center, p1 , p8));
	shape.addFace(new GLFace(center, p2 , p1));
	shape.addFace(new GLFace(center, p3 , p2));
	shape.addFace(new GLFace(center, p4 , p3));
	shape.addFace(new GLFace(center, p5 , p4));
	shape.addFace(new GLFace(center, p6 , p5));
	shape.addFace(new GLFace(center, p7 , p6));
	shape.addFace(new GLFace(center, p8 , p7));

//        shape.setFaceColor(0, color);
	//this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
	this.addShape(shape);
}    

GameonModel.prototype.createPlane = function(left, bottom, back, right, top, front, color)  
{
	var shape = new GLShape(this);
	var leftBottomFront = shape.addVertex(left, bottom, front , 0.0 , 1.00, color);
	var rightBottomFront = shape.addVertex(right, bottom, front , 1.0 , 1.00, color);
	var leftTopFront = shape.addVertex(left, top, front , 0.0 , 0.00, color);
	var rightTopFront = shape.addVertex(right, top, front , 1.00 , 0.00, color);
	// front
	//shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

//        shape.setFaceColor(0, color);
	//this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
	this.addShape(shape);
}

GameonModel.prototype.createPlane4 = function(left, bottom, back, right, top, front, color, color2 )  
{
	var shape = new GLShape(this);
	if (color == undefined)
	{
		color = this.mApp.colors().white;
	}
	if (color2 == undefined)
	{
		color2 = this.mApp.colors().white;
	}    	
	var leftBottomFront = shape.addVertex(left, bottom, front , 0.0 , 1.00, color);
	var rightBottomFront = shape.addVertex(right, bottom, front , 1.0 , 1.00, color);
	var leftTopFront = shape.addVertex(left, top, front , 0.0 , 0.00, color2);
	var rightTopFront = shape.addVertex(right, top, front , 1.00 , 0.00, color2);
	// front
	//shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

//        shape.setFaceColor(0, color);
	//this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
	this.addShape(shape);
}    

GameonModel.prototype.createPlaneForLetter = function(left, bottom, back, right, top, front, color)  
{
	var shape = new GLShape(this);
	var leftBottomFront = shape.addVertex(left, bottom, front , 0.01 , 0.99, color);
	var rightBottomFront = shape.addVertex(right, bottom, front , 0.99 , 0.99, color);
	var leftTopFront = shape.addVertex(left, top, front , 0.01 , 0.01, color);
	var rightTopFront = shape.addVertex(right, top, front , 0.99 , 0.01, color);
	// front
	//shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

//        shape.setFaceColor(0, color);
	//this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
	this.addShape(shape);
}

GameonModel.prototype.createPlane2 = function(left, bottom, back, right, top, front, color)  
{
	var shape = new GLShape(this);
	var leftBottomFront = shape.addVertex(left, bottom, front , 0.0 , 1.0, color);
	var rightBottomFront = shape.addVertex(right, bottom, front , 1.0 , 1.0, color);
	var leftTopFront = shape.addVertex(left, top, front , 0.0 , 0.0, color);
	var rightTopFront = shape.addVertex(right, top, front , 1.0 , 0.0, color);
	// front
	//shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

//        shape.setFaceColor(0, color);
	//this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
	this.addShape(shape);
}

GameonModel.prototype.createPlane3 = function(left, bottom, back, right, top, front, color)  
{
	var shape = new GLShape(this);
	var leftBottomFront = shape.addVertex(left, bottom, front , 0.0 , 1.0, color);
	var rightBottomFront = shape.addVertex(right, bottom, front , 1.0 , 1.0, this.mApp.colors().white);
	var leftTopFront = shape.addVertex(left, top, front , 0.10 , 0.0, color);
	var rightTopFront = shape.addVertex(right, top, front , 0.90 , 0.0, color);
	// front
	//shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

//        shape.setFaceColor(0, color);
	//this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
	this.addShape(shape);
}    

GameonModel.prototype.createCube = function(left, bottom, back, right, top, front, color) {
	var shape = new GLShape(this);
	
	var white = this.mApp.colors().white;
	
	var leftBottomBack = shape.addVertex(left, bottom, back , 0 , 0, white);
	var rightBottomBack = shape.addVertex(right, bottom, back , 0 , 0, white);
	var leftTopBack = shape.addVertex(left, top, back , 0 , 0, white);
	var rightTopBack = shape.addVertex(right, top, back , 0 , 0, white);
	var leftBottomFront = shape.addVertex(left, bottom, front , 0 , 0, color);
	var rightBottomFront = shape.addVertex(right, bottom, front , 0 , 0, color);
	var leftTopFront = shape.addVertex(left, top, front , 0 , 0, color);
	var rightTopFront = shape.addVertex(right, top, front , 0 , 0, white );//color);

	/*
	var one = 0x10000;
	var half = 0x08000;
	GLColor red = new GLColor(one, 0, 0);
	GLColor green = new GLColor(0, one, 0);
	GLColor blue = new GLColor(0, 0, one);
	GLColor yellow = new GLColor(one, one, 0);
	GLColor orange = new GLColor(one, half, 0);
	GLColor white = new GLColor(one, one, one);
	GLColor black = new GLColor(0, 0, 0);
	*/
	
	// vertices are added in a clockwise orientation (when viewed from the outside)
	// bottom
	shape.addFace(new GLFace(leftBottomBack, rightBottomFront ,leftBottomFront ));
	shape.addFace(new GLFace(leftBottomBack, rightBottomBack , rightBottomFront ));

	// front
	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront ));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

	// left
	shape.addFace(new GLFace(leftBottomBack, leftTopFront , leftTopBack ));
	shape.addFace(new GLFace(leftBottomBack, leftBottomFront , leftTopFront ));

	// right
	shape.addFace(new GLFace(rightBottomBack, rightTopFront , rightBottomFront  ));
	shape.addFace(new GLFace(rightBottomBack, rightTopBack , rightTopFront ));

	// back
	shape.addFace(new GLFace(leftBottomBack, rightTopBack , rightBottomBack  ));
	shape.addFace(new GLFace(leftBottomBack,  leftTopBack , rightTopBack ));

	// top
	shape.addFace(new GLFace(leftTopBack, rightTopFront , rightTopBack));
	shape.addFace(new GLFace(leftTopBack, leftTopFront , rightTopFront ));
/*
	shape.setFaceColor(GameonModel.kBottom, this.mApp.colors().white);
	shape.setFaceColor(GameonModel.kFront, color);
	shape.setFaceColor(GameonModel.kLeft, color);
	shape.setFaceColor(GameonModel.kRight, color);
	shape.setFaceColor(GameonModel.kBack, color);
	shape.setFaceColor(GameonModel.kTop, color);
	*/
	//this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
	this.addShape(shape);
}

GameonModel.prototype.addref = function(ref)
{
	if (this.mRefs.indexOf(ref) < 0)
	{
		this.mRefs.push(ref);
		ref.set();
		this.mEnabled = true;
	}
	ref.setParent(this);
	if (ref.getVisible())
	{
		this.addVisibleRef(ref);
	}
			
}

GameonModel.prototype.draw = function(gl, loc)
{
	if (!this.mEnabled || !this.mVisible) {
		return;
	}
	var len = this.mVisibleRefs.length;
	if (len > 0) {
		this.setupRef(gl);
		for (var a=0; a< this.mVisibleRefs.length ; a++)
		{
			var ref = this.mVisibleRefs[a];
			if (ref.mLoc == loc) {
				this.drawRef( gl, ref );
			}
		}
	}
}
	
GameonModel.prototype.removeref = function(ref) {
	var i  = this.mRefs.indexOf(ref);
	if ( i >= 0)
	{
		this.mRefs.splice(i,1);
		if (this.mRefs.length == 0)
		{
			this.mEnabled = false;
		}
	}
}

GameonModel.prototype.setTexture = function(i) {
	this.mTextureID = i;
	
}

GameonModel.prototype.createCard = function(left, bottom, back, right, top, front, color)  
{
	var shape = new GLShape(this);
	var t = 0.002;
	var leftBottomFront = shape.addVertex(left, bottom, front+t , 0.0 , 0.00, color);
	var rightBottomFront = shape.addVertex(right, bottom, front+t , 1.0 , 0.00, color);
	var leftBottom2Front = shape.addVertex(left, (bottom+top)/2, front+t , 0.0 , 1.0, color);
	var rightBottom2Front = shape.addVertex(right, (bottom+top)/2, front+t , 1.0 ,1.0, color);

	var leftTopFront = shape.addVertex(left, top, front+t , 0.0 , 0.00, color);
	var rightTopFront = shape.addVertex(right, top, front+t , 1.00 , 0.00, color);

	// front
	shape.addFace(new GLFace(leftBottom2Front, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottom2Front, rightBottom2Front , rightTopFront ));

	shape.addFace(new GLFace(leftBottomFront, rightBottom2Front , leftBottom2Front));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightBottom2Front ));
	
	
	//back vertexex
//        color = this.mApp.colors().blue;
	var leftBottomFront_ = shape.addVertex(left, bottom, front-t , 0.0 , 0.00, color);
	var rightBottomFront_ = shape.addVertex(right, bottom, front-t , 1.0 , 0.00, color);
	var leftBottom2Front_ = shape.addVertex(left, (bottom+top)/2, front -t, 0.0 , 1.0, color);
	var rightBottom2Front_ = shape.addVertex(right, (bottom+top)/2, front -t, 1.0 ,1.0, color);

	var leftTopFront_ = shape.addVertex(left, top, front - t, 0.0 , 0.00, color);
	var rightTopFront_ = shape.addVertex(right, top, front - t, 1.00 , 0.00, color);

	// back
	shape.addFace(new GLFace(leftBottom2Front_, leftTopFront_, rightTopFront_ ));
	shape.addFace(new GLFace(leftBottom2Front_, rightTopFront_ , rightBottom2Front_ ));

	shape.addFace(new GLFace(rightBottom2Front_ ,  leftBottomFront_,leftBottom2Front_));
	shape.addFace(new GLFace(rightBottomFront_, leftBottomFront_,rightBottom2Front_  ));
	
//        shape.setFaceColor(0, color);
	//this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
	this.addShape(shape);
	
}


GameonModel.prototype.createCard2 = function(left, bottom, back, right, top, front, color)  
{
	var shape = new GLShape(this);
	var w = (right-left) / 30;    
	var t =0.002;
	var leftBottomFront = shape.addVertex(left+w, bottom+w, front +t, 0.01 , 0.99, color);
	var rightBottomFront = shape.addVertex(right-w, bottom+w, front+t , 0.99 , 0.99, color);
	var leftTopFront = shape.addVertex(left+w, top-w, front+t , 0.01 , 0.01, color);
	var rightTopFront = shape.addVertex(right-w, top-w, front+t , 0.99 , 0.01, color);
	// front

	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

	
	var leftBottomFront_ = shape.addVertex(left+w, bottom+w, front -t, 0.01 , 0.99, color);
	var rightBottomFront_ = shape.addVertex(right-w, bottom+w, front-t , 0.99 , 0.99, color);
	var leftTopFront_ = shape.addVertex(left+w, top-w, front-t , 0.01 , 0.01, color);
	var rightTopFront_ = shape.addVertex(right-w, top-w, front-t , 0.99 , 0.01, color);        

	shape.addFace(new GLFace(leftBottomFront_, leftTopFront_, rightTopFront_ ));
	shape.addFace(new GLFace(leftBottomFront_, rightTopFront_, rightBottomFront_  ));
	
	//        shape.setFaceColor(0, color);
	//this.mTextureID = this.mApp.textures().get(TextureFactory_Type.DEFAULT);
	this.addShape(shape);
	
}

GameonModel.prototype.setState = function(state) {
	if (!this.mActive)
		return;

	for (var a=0; a< this.mRefs.length; a++)
	{
		var ref = this.mRefs[a];
		if (state == LayoutArea_State.HIDDEN)
		{
			ref.setVisible(false);
		}else
		{
			ref.setVisible(true);
		}
	}
	if (state == LayoutArea_State.HIDDEN)
	{
		this.setVisible(false);
	}else
	{
		this.setVisible(true);
	}
}


 GameonModel.prototype.createFrame = function(left, bottom, back, right, top, front, fw, fh, color)  
{
	var c;
	if (color == undefined)
	{
		c = this.mApp.colors().white;
	}
	else
	{
		c = color;
	}
	
	this.createPlane(left-fw/2,bottom-fh/2,front   ,  left+fw/2, top+fh/2,front, color);
	this.createPlane(right-fw/2,bottom-fh/2,front   ,  right+fw/2, top+fh/2,front, color);
	
	this.createPlane(left+fw/2,bottom-fh/2,front   ,  right-fw/2, bottom+fh/2,front, color);
	this.createPlane(left+fw/2,top-fh/2,front   ,  right-fw/2, top+fh/2,front, color);
	
	//mTextureID = this.mApp.textures().get(this.mApp.textures().Type.DEFAULT);
}


GameonModel.prototype.createPlaneTex = function(left, bottom, back, right, top, front, 
		tu1, tv1 , tu2, tv2, colors , no , div)  
{
	var shape = new GLShape(this);
	var leftBottomFront = shape.addVertex(left, bottom, front , tu1 , tv2, this.mApp.colors().white);
	var rightBottomFront = shape.addVertex(right, bottom, front , tu2 , tv2, this.mApp.colors().white);
	var leftTopFront = shape.addVertex(left, top, front , tu1 , tv1, this.mApp.colors().white);
	var rightTopFront = shape.addVertex(right, top, front , tu2 , tv1, this.mApp.colors().white);
	
	var val1 = no * div;
	var val2 = (no+1) * div;
	
	leftBottomFront.red = colors[0].red + ((colors[2].red-colors[0].red) * val1);
	leftBottomFront.green = colors[0].green + ((colors[2].green-colors[0].green) * val1);
	leftBottomFront.blue = colors[0].blue + ((colors[2].blue-colors[0].blue) * val1);
	leftBottomFront.alpha = colors[0].alpha + ((colors[2].alpha-colors[0].alpha) * val1);

	rightBottomFront.red = colors[1].red + ((colors[3].red-colors[1].red) * val1);
	rightBottomFront.green = colors[1].green + ((colors[3].green-colors[1].green) * val1);
	rightBottomFront.blue = colors[1].blue + ((colors[3].blue-colors[1].blue) * val1);
	rightBottomFront.alpha = colors[1].alpha + ((colors[3].alpha-colors[1].alpha) * val1);

	leftTopFront.red = colors[0].red + ((colors[2].red-colors[0].red) * val2);
	leftTopFront.green = colors[0].green + ((colors[2].green-colors[0].green) * val2);
	leftTopFront.blue = colors[0].blue + ((colors[2].blue-colors[0].blue) * val2);
	leftTopFront.alpha = colors[0].alpha + ((colors[2].alpha-colors[0].alpha) * val2);

	rightTopFront.red = colors[1].red + ((colors[3].red-colors[1].red) * val2);
	rightTopFront.green = colors[1].green + ((colors[3].green-colors[1].green) * val2);
	rightTopFront.blue = colors[1].blue + ((colors[3].blue-colors[1].blue) * val2);
	rightTopFront.alpha = colors[1].alpha + ((colors[3].alpha-colors[1].alpha) * val2);
		
	// front
	//shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

	this.addShape(shape);
}

GameonModel.prototype.createPlaneTex2 = function(left, bottom, back, right, top, front, 
		tu1, tv1 , tu2, tv2, colors , no , div)  
{
	var shape = new GLShape(this);
	var leftBottomFront = shape.addVertex(left, bottom, front , tu1 , tv2, this.mApp.colors().white);
	var rightBottomFront = shape.addVertex(right, bottom, front , tu2 , tv2, this.mApp.colors().white);
	var leftTopFront = shape.addVertex(left, top, front , tu1 , tv1, this.mApp.colors().white);
	var rightTopFront = shape.addVertex(right, top, front , tu2 , tv1, this.mApp.colors().white);
	
	var val1 = no * div;
	var val2 = (no+1) * div;
	
	leftBottomFront.red = colors[0].red + ((colors[2].red-colors[0].red) * val1);
	leftBottomFront.green = colors[0].green + ((colors[2].green-colors[0].green) * val1);
	leftBottomFront.blue = colors[0].blue + ((colors[2].blue-colors[0].blue) * val1);
	leftBottomFront.alpha = colors[0].alpha + ((colors[2].alpha-colors[0].alpha) * val1);

	rightBottomFront.red = colors[0].red + ((colors[2].red-colors[0].red) * val2);
	rightBottomFront.green = colors[0].green + ((colors[2].green-colors[0].green) * val2);
	rightBottomFront.blue = colors[0].blue + ((colors[2].blue-colors[0].blue) * val2);
	rightBottomFront.alpha = colors[0].alpha + ((colors[2].alpha-colors[0].alpha) * val2);

	leftTopFront.red = colors[1].red + ((colors[3].red-colors[1].red) * val1);
	leftTopFront.green = colors[1].green + ((colors[3].green-colors[1].green) * val1);
	leftTopFront.blue = colors[1].blue + ((colors[3].blue-colors[1].blue) * val1);
	leftTopFront.alpha = colors[1].alpha + ((colors[3].alpha-colors[1].alpha) * val1);

	rightTopFront.red = colors[1].red + ((colors[3].red-colors[1].red) * val2);
	rightTopFront.green = colors[1].green + ((colors[3].green-colors[1].green) * val2);
	rightTopFront.blue = colors[1].blue + ((colors[3].blue-colors[1].blue) * val2);
	rightTopFront.alpha = colors[1].alpha + ((colors[3].alpha-colors[1].alpha) * val2);
		
	// front
	//shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
	shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
	shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

	this.addShape(shape);
}

GameonModel.prototype.createAnimTrans = function(type , delay, away , no)
{
	if (no == undefined)
		no = 0;
	var to = new GameonModelRef(undefined); 
	to.copy( this.mRefs[no] );
	to.copyMat( this.mRefs[no] );
	var from = new GameonModelRef(undefined);
	from.copy(to);
	
	var w,h,x,y;
	if (to.mLoc == GameonWorld_Display.WORLD)
	{
		w = this.mApp.mCS.mWorldBBox[2] - this.mApp.mCS.mHudBBox[0];
		h = this.mApp.mCS.mWorldBBox[1] - this.mApp.mCS.mHudBBox[5];
	
		x = (this.mApp.mCS.mWorldBBox[2] + this.mApp.mCS.mWorldBBox[0]) / 2;
		y = (this.mApp.mCS.mWorldBBox[1] + this.mApp.mCS.mWorldBBox[5]) / 2;
	}else
	{
		w = this.mApp.mCS.mHudBBox[2] - this.mApp.mCS.mHudBBox[0];
		h = this.mApp.mCS.mHudBBox[1] - this.mApp.mCS.mHudBBox[5];
	
		x = (this.mApp.mCS.mHudBBox[2] + this.mApp.mCS.mHudBBox[0]) / 2;
		y = (this.mApp.mCS.mHudBBox[1] + this.mApp.mCS.mHudBBox[5]) / 2;        	
	}
	var z = to.mPosition[2];
	if (type == "left")
	{
		from.addAreaPosition(-w , 0 , 0);	
	}else if (type == "right")
	{
		from.addAreaPosition(w , 0 , 0);
	}else if (type == "top")
	{
		from.addAreaPosition(0  , +h , 0);
	}else if (type == "tophigh")
    {
        	from.addAreaPosition(0  , +h+h , 0);
	}
	else if (type == "bottom")
	{
		from.addAreaPosition(0  , -h , 0);
	}else if (type == "scaleout")
	{
		from.mulScale( 30, 30 , 30);
	}else if (type == "scalein")
	{
		from.mulScale( 30, 30 , 30);
	}else if (type == "swirlin")
	{
		from.mulScale( 30, 30 , 30);
		from.addAreaRotate( 0, 0, 720);
	}else if (type == "swirlout")
	{
		from.mulScale( 30, 30 , 30);
		from.addAreaRotate( 0, 0, 720);
	}
	
							
	
	if (away)
	{
		anim = this.mApp.anims().createAnim( to , from , this.mRefs[no] , delay , 2 , undefined , 1 , true);
	}else
	{
		anim = this.mApp.anims().createAnim( from , to , this.mRefs[no] , delay , 2 , undefined , 1 , false);
	}
		
}

GameonModel.prototype.addVisibleRef = function(ref)
{
	if (ref.getVisible() )
	{
		if ( this.mVisibleRefs.indexOf(ref) < 0)
		{
			if (this.mVisibleRefs.length == 0)
			{
				this.setVisible(true);
			}
			this.mVisibleRefs.push( ref );
		}
	}
}

GameonModel.prototype.remVisibleRef = function(ref)
{
	if (ref.getVisible() == false)
	{
		var i = this.mVisibleRefs.indexOf(ref);
		if ( i >= 0)
		{
			this.mVisibleRefs.splice( i,1 );
			if (this.mVisibleRefs.length == 0)
			{
				this.setVisible(false);
			}			
		}
	}
}

GameonModel.prototype.setVisible = function(visible)
{
	if (visible)
	{
		this.mVisible = true;
		if (this.mWorld != undefined)
		{
			this.mWorld.setVisible(this);
		}
	}
	else
	{
		this.mVisible = false;
		if (this.mWorld != undefined)
		{
			this.mWorld.remVisible(this);
		}
	}
}    


GameonModel.prototype.ref = function(no)
{
	if (no < 0 || no >= this.mRefs.length)
	{
		return undefined;
	}
	return this.mRefs[no];
}

GameonModel.prototype.findRef = function(ref)
{
	return this.mRefs.indexOf(ref);
}

GameonModel.prototype.unsetWorld = function() 
{
	this.mWorld = undefined;
}    

GameonModel.prototype.createAnim = function(type, refid , delay, data)
{
	if (refid < 0 && refid >= mRefs.length)
	{
		return;
	}
	
	var ref = this.mRefs[refid];
	this.mApp.anims().animModelRef(type , ref, delay , data);
	
}

GameonModel.prototype.setActive = function(active)
{
	this.mActive = active;
}
