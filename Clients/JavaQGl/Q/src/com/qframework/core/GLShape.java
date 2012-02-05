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
import java.util.Iterator;


public class GLShape {
	protected ArrayList<GLFace>		mFaceList = new ArrayList<GLFace>();
	protected ArrayList<GLVertex>	mVertexList = new ArrayList<GLVertex>();
	protected GLModel mWorld;
	
	public GLShape(GLModel world) {
		mWorld = world;
	}
	
	public void addFace(GLFace face) {
		mFaceList.add(face);
	}
	
	public void setFaceColor(int face, GLColor color) {
		mFaceList.get(face).setColor(color);
	}
			
	public void putIndices(ShortBuffer buffer) {
		Iterator<GLFace> iter = mFaceList.iterator();
		while (iter.hasNext()) {
			GLFace face = iter.next();
			face.putIndices(buffer);
		}		
	}
	
	public int getIndexCount() {
		int count = 0;
		Iterator<GLFace> iter = mFaceList.iterator();
		while (iter.hasNext()) {
			GLFace face = iter.next();
			count += face.getIndexCount();
		}		
		return count;
	}


	public GLVertex addVertex(float x, float y, float z, float tu, float tv, GLColor color) {
		
		Iterator<GLVertex> iter = mVertexList.iterator();
		while (iter.hasNext()) {
			GLVertex vertex = iter.next();
			if (vertex.x == x && vertex.y == y && vertex.z == z &&
					vertex.tu == tu && vertex.tv == tv && 
					vertex.red== color.red &&
					vertex.green== color.green &&
					vertex.blue== color.blue &&
					vertex.alpha== color.alpha) {
				return vertex;
			}
		}
		
		GLVertex vertex = mWorld.addVertex(x, y, z, tu, tv);
		vertex.red= color.red;
		vertex.green= color.green;
		vertex.blue= color.blue;
		vertex.alpha= color.alpha;
		mVertexList.add(vertex);
		return vertex;
	}
	

}
