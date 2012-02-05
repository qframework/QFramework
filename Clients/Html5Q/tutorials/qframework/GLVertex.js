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

function GLVertex( x,y,z,tu,tv,index) {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.tu = 0;
	this.tv = 0;
	this.index = -1;
	this.red = 1;
	this.green = 1;
	this.blue = 1;
	this.alpha = 1;
	


    if (arguments.length == 6)
	{
        this.x = x;
        this.y = y;
        this.z = z;
        this.tu = tu;
        this.tv = tv;
        this.index = index;
    }
}

GLVertex.prototype.equals = function(v) {
	return (this.x == v.x && this.y == v.y && this.z == v.z &&
			v.tu == tu && v.tv == tv && 
			alpha == v.alpha &&
			red == v.red &&
			green == v.green &&
			blue == v.blue);
}

//(FloatBuffer vertexBuffer, ByteBuffer colorBuffer, FloatBuffer textBuffer) {
	GLVertex.prototype.put = function( vertexBuffer,  colorBuffer,  textBuffer) 
	{
        vertexBuffer.push(this.x);
        vertexBuffer.push(this.y);
        vertexBuffer.push(this.z);
		colorBuffer.push(this.red);
		colorBuffer.push(this.green);
		colorBuffer.push(this.blue);
		colorBuffer.push(this.alpha);
        
        textBuffer.push(this.tu);
        textBuffer.push(this.tv);
        
    }

	GLVertex.prototype.put2 = function(vertexBuffer, colorBuffer) 
	{
        vertexBuffer.push(this.x);
        vertexBuffer.push(this.y);
        vertexBuffer.push(this.z);
		colorBuffer.push(this.red);
		colorBuffer.push(this.green);
		colorBuffer.push(this.blue);
		colorBuffer.push(this.alpha);
        
        
    }

    GLVertex.prototype.putText = function(textBuffer,  x, y,  w,  h) 
	{
    	tu1 = this.tu / w + x / w;
    	tv1 = this.tv / h + y / h;
        textBuffer.push(tu1);
        textBuffer.push(tv1);
    }

    GLVertex.prototype.putTextHalf = function(textBuffer,  x, y,  w,  h) 
	{
    	tu1 = this.tu / w + x / w + 1.0;
    	tv1 = this.tv / h + y / h + 1.0;
        textBuffer.push(tu1);
        textBuffer.push(tv1);
    }
	
   