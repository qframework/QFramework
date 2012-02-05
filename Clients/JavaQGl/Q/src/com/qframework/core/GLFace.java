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

package com.qframework.core;


import java.nio.ShortBuffer;
import java.util.ArrayList;

public class GLFace {
	private ArrayList<GLVertex> mVertexList = new ArrayList<GLVertex>();

	public GLFace() {
		
	}
	
	public GLFace(GLVertex v1, GLVertex v2, GLVertex v3) {
		addVertex(v1);
		addVertex(v2);
		addVertex(v3);

	}	
		
	public void addVertex(GLVertex v) {
		mVertexList.add(v);
	}
	
	public void setColor(GLColor c) {
		
		int last = mVertexList.size() - 1;
		GLVertex vertex = mVertexList.get(last);
		vertex.red = c.red;
		vertex.green = c.green;
		vertex.blue = c.blue;
		vertex.alpha = c.alpha;

	}
	
	public int getIndexCount() {
		return (mVertexList.size() - 2) * 3;
	}
	
	public void putIndices(ShortBuffer buffer) {
		int last = mVertexList.size() - 1;

		GLVertex v0 = mVertexList.get(0);
		GLVertex vn = mVertexList.get(last);
		
		for (int i = 1; i < last; i++) {
			GLVertex v1 = mVertexList.get(i);
			buffer.put(v0.index);
			buffer.put(v1.index);
			buffer.put(vn.index);
			v0 = v1;
		}
	}
	

}
