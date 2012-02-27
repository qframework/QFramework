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

glModelLastText  = undefined;

Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
} 



GLModel = 
{
/*
	mName : "",
	mBBoxMin : new Array(3),
	mBBoxMax : new Array(3),
	
	mTextureOffset : 0,
	mTextureW : 1,
	mTextureH : 1,
	mTextureWDiv : 0,
	mTextureHDiv : 0,
	
	mEnabled : false,
	mForceHalfTexturing : false,
	mForcedOwner : 0,
	mShapeList : [],	
	mVertexList : [],
	
	mIndexCount : 0,

    mVertexBuffer : undefined,
    mColorBuffer : undefined,
    mIndexBuffer : undefined,
    
    //private DoubleBuffer   mNormalBuffer,
    mTextureBuffer : undefined,

    mTextureID : 1,
    
    mTransform : false,
    
    mBBoxMin : [],
    mBBoxMax : [],
    
    mPosition : new Array(3),
    mRotation : new Array(3),
    mScale : new Array(3),

    mVertexOffset : 0,
    mColorOffset : 0,
	mGenerated : false,

*/
	
 
isValid : function()
{
	return this.mVertexList.length > 0;
},

addShape : function(shape) 
{
	this.mShapeList.push(shape);
	this.mIndexCount += shape.getIndexCount();
},
	
generate : function(gl) 
{
	if (this.mGenerated == true)
	{
		return;
	}
	this.mGenerated = true;
	this.vertexBuffer = [];
	this.colorBuffer = [];
	this.textureBuffer = [];
	this.indexBuffer = [];

	this.mTextureWDiv = 1 / this.mTextureW;
	this.mTextureHDiv = 1 / this.mTextureH;
	
	if (this.mTextureW == 1 && this.mTextureH == 1) 
	{	
		for (var i = 0; i < this.mVertexList.length; i++)
		{
			var vertex = this.mVertexList[i];
			vertex.put(this.vertexBuffer, this.colorBuffer, this.textureBuffer);
		}
	}
	else
	{
		for (var i = 0; i < this.mVertexList.length; i++)
		{
			var vertex = this.mVertexList[i];
			vertex.put2(this.vertexBuffer, this.colorBuffer);
		}	
		var cnttrig = this.mVertexList.length /2;		
		for (var i = 0; i < this.mVertexList.length; i++)
		{			
			var vertex = this.mVertexList[i];
			if (this.mForceHalfTexturing && i >= cnttrig) 
			{			
				vertex.putTextHalf( this.textureBuffer , 0, 0,  this.mTextureW, this.mTextureH);
			}else
			{
				vertex.putText( this.textureBuffer , 0, 0,  this.mTextureW, this.mTextureH);
			}
		}
	}
	
	
	
	for (var i = 0; i < this.mShapeList.length; i++)
	{
		var shape = this.mShapeList[i];
		shape.putIndices(this.indexBuffer);
	}

	this.mColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.mColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colorBuffer), gl.STATIC_DRAW);
	this.mColorBuffer.itemSize = 4;
	this.mColorBuffer.numItems = this.vertexBuffer.length / 4;		

	this.mVertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexBuffer), gl.STATIC_DRAW);
	this.mVertexBuffer.itemSize = 3;
	this.mVertexBuffer.numItems = this.vertexBuffer.length / 3;		

	this.mIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STREAM_DRAW);
	this.mIndexBuffer.itemSize = 1;
	this.mIndexBuffer.numItems = this.indexBuffer.length;

	
	this.mTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureBuffer), gl.STATIC_DRAW);
	this.mTextureBuffer.itemSize = 2;
	this.mTextureBuffer.numItems = this.textureBuffer.length / 2;		
	//bb = ByteBuffer.allocateDirect(mVertexList.size()*Float.SIZE/8 * 2 * (mTextureW * mTextureH));


	this.mEnabled = true;
	
	if (this.mTextureID == undefined)
	{
		this.mTextureID = this.mApp.textures().get( TextureFactory_Type.DEFAULT);
	}
},
	
	
addVertex : function(x, y, z, tu,  tv) 
{
	var vertex = new GLVertex(x, y, z, tu , tv , this.mVertexList.length);
	this.mVertexList.push(vertex);
	if (x < this.mBBoxMin[0]) this.mBBoxMin[0] = x;
	if (y < this.mBBoxMin[1]) this.mBBoxMin[1] = y;
	if (z < this.mBBoxMin[2]) this.mBBoxMin[2] = z;		

	if (x > this.mBBoxMax[0]) this.mBBoxMax[0] = x;
	if (y > this.mBBoxMax[1]) this.mBBoxMax[1] = y;
	if (z > this.mBBoxMax[2]) this.mBBoxMax[2] = z;

	return vertex;
}	,

setupRef : function(gl)
{

	//gl.glBindTexture(GL.GL_TEXTURE_2D, mTextureID);
	if (this.mTextureID != undefined)
	{
		//console.log( this.mTextureID.toString() );
		//if (glModelLastText != this.mTextureID)
		if (gl.isTexture(this.mTextureID))
		{
			gl.bindTexture(gl.TEXTURE_2D, this.mTextureID);
			glModelLastText = this.mTextureID;
		}
	}
	/*
	else
	{
		console.log( "texture error " + this.mTextureID);
	}*/	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mVertexBuffer);
	gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.mTextureBuffer);
	//gl.bufferSubData(gl.ARRAY_BUFFER, this.mTextureOffset , new Float32Array(this.textureBuffer));
	
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

	//gl.bufferSubData(gl.ARRAY_BUFFER, this.mColorOffset , this.mColorBuffer);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mColorBuffer);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
	
	// Bind the index array
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);	
	//mIndexBuffer.position(0);
	var row2 = Math.floor(this.mForcedOwner / this.mTextureW) * this.mTextureHDiv;
	var col2 = Math.floor(this.mForcedOwner % this.mTextureW) * this.mTextureWDiv;
	
	
	gl.uniform2f(gl.getUniformLocation(gl.program, "texOffsetF"), col2, row2);		
	/*
	if (diffcolor != undefined)
	{
		var color = ColorFactory.getColorId(diffcolor);
		gl.uniform4f(gl.getUniformLocation(gl.program, "ambientL"), color.red, color.green,color.blue,color.alpha);		
	}
	else
	{
		//gl.uniform4f(gl.getUniformLocation(gl.program, "ambientL"), 1.0, 1.0,1.0,1.0);		
	}*/
	
},

drawRef : function(gl, ref)
{
	if (!this.mEnabled) {
		return;
	}

	if (ref.animating() == true)
	{
		ref.animate(this.mApp.mFrameDeltaTime);
	}
	if (!ref.getVisible()  || ref.mEnabled == false)
	{
		return true;
	}	
	
	if (ref != undefined)
	{
		ref.mMatrix.setUniform(gl , gl.u_modelViewMatrixLoc, false);
	}	
	
	if (ref.mTransformOwner) 
	{
		if (ref.mOwner >=0 && ref.mOwner < ref.mOwnerMax)
		{
			//this.mTextureOffset = this.mTextureBuffer.numItems * ref.mOwner / ref.mOwnerMax;

			var row = Math.floor(ref.mOwner / this.mTextureW) * this.mTextureHDiv;
			var col = Math.floor(ref.mOwner % this.mTextureW) * this.mTextureWDiv;
			//console.log( " " + ref.mOwner + " "+ col + " "  + row );
			gl.uniform2f(gl.getUniformLocation(gl.program, "texOffset"), col, row);	

		}
		else
		{
			//console.log( "owner error " + ref.mOwner);
		}
	}else
	{
		gl.uniform2f(gl.getUniformLocation(gl.program, "texOffset"), 0.0, 0.0);	
	}
	
	gl.drawElements(gl.TRIANGLES, this.mIndexCount, gl.UNSIGNED_SHORT, 0);
	
},
   
setPosition : function(x,  y, z) 
{
	this.mPosition[0] = x;
	this.mPosition[1] = y;
	this.mPosition[2] = z;    	
	this.mTransform = true;
},

setScale : function( x, y, z) 
{
	this.mScale[0] = x;
	this.mScale[1] = y;
	this.mScale[2] = z;  
	this.mTransform = true;
},


setTextureOffset : function(w, h) 
{
	this.mTextureW = parseFloat(w);
	this.mTextureH = parseFloat(h);
	this.mTextureOffset = 0;
},

reset : function() {
/*
	mColorBuffer.clear();
	mVertexBuffer.clear();
	mIndexBuffer.clear();
	mTextureBuffer.clear();
	*/
	generate();

},

setupOffset : function(value)
{
	this.mVertexOffset = value * 12;
	this.mColorOffset  = value * 16;
	//glVertexPointer(3, GL_FLOAT, 0, [mVertexBuffer get:mVertexOffset]);    
	//glColorPointer(4, GL_UNSIGNED_BYTE, 0, [mColorBuffer get:value * 16]);
},

forceIndexCount : function(count)
{
	this.mIndexCount = count;
}

}

