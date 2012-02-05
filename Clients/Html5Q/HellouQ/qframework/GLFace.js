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

function GLFace(v1,v2,v3,v4) {
	this.mVertexList = [];
	this.mColor = new GLColor();
	
	if (arguments.length == 3)
	{
		this.addVertex(v1);
		this.addVertex(v2);
		this.addVertex(v3);
	}else
	if (arguments.length == 4)
	{
		this.addVertex(v1);
		this.addVertex(v2);
		this.addVertex(v3);	
		this.addVertex(v4);
	}
	
}
		
GLFace.prototype.addVertex = function(v) {
	this.mVertexList.push(v);
}
	
	// must be called after all vertices are added
GLFace.prototype.setColor = function(c) {
	
	var last = this.mVertexList.length - 1;
	if (last < 2) {
		//Log.e("GLFace", "not enough vertices in setColor()");
	} else {
		var vertex = this.mVertexList[last];
		var start = vertex;
		
		vertex.red = c.red;
		vertex.green = c.green;
		vertex.blue = c.blue;
		vertex.alpha = c.alpha;
	}

	this.mColor = c;
}
	
GLFace.prototype.getIndexCount = function() {
	return (this.mVertexList.length - 2) * 3;
}
	
GLFace.prototype.putIndices = function(buffer) {
	var last = this.mVertexList.length - 1;

	var v0 = this.mVertexList[0];
	var vn = this.mVertexList[last];
	
	// push triangles into the buffer
	for (var i = 1; i < last; i++) {
		var v1 = this.mVertexList[i];
		buffer.push(v0.index);
		buffer.push(v1.index);
		buffer.push(vn.index);
		v0 = v1;
	}
}

