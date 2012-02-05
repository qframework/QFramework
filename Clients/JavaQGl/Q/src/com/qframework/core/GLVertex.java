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

import java.nio.ByteBuffer;
import java.nio.FloatBuffer;



public class GLVertex {

    protected float x;
    protected float y;
    protected float z;
    protected short index; // index in vertex table
    protected int red;
    protected int green;
    protected int blue;
    protected int alpha;
    
    protected float tu;
    protected float tv;

    GLVertex() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.tu = 0;
        this.tv = 0;
        this.index = -1;
        red = 255;
        green = 255;
        blue = 255;
        alpha = 255;

    }

    GLVertex(float x, float y, float z, float tu, float tv ,  int index) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.tu = tu;
        this.tv = tv;
        this.index = (short)index;
    }

    @Override
    public boolean equals(Object other) {
        if (other instanceof GLVertex) {
            GLVertex v = (GLVertex)other;
            return (x == v.x && y == v.y && z == v.z &&
            		v.tu == tu && v.tv == tv && 
            		alpha == v.alpha &&
            		red == v.red &&
            		green == v.green &&
            		blue == v.blue);
        }
        return false;
    }

    public void put(FloatBuffer vertexBuffer, ByteBuffer colorBuffer, FloatBuffer textBuffer) {
        vertexBuffer.put((float)x);
        vertexBuffer.put((float)(y));
        vertexBuffer.put((float)(z));
        colorBuffer.put((byte)red);
        colorBuffer.put((byte)green);
        colorBuffer.put((byte)blue);
        colorBuffer.put((byte)alpha);
        
        textBuffer.put((float)tu);
        textBuffer.put((float)tv);
        
    }
    public void put(FloatBuffer vertexBuffer, ByteBuffer colorBuffer) {
        vertexBuffer.put((float)(x));
        vertexBuffer.put((float)(y));
        vertexBuffer.put((float)(z));
        colorBuffer.put((byte)red);
        colorBuffer.put((byte)green);
        colorBuffer.put((byte)blue);
        colorBuffer.put((byte)alpha);
        
        
    }

    public void putText(FloatBuffer textBuffer, int x, int y, int w, int h) {
        
    	double tu1 = tu / (double)w + (double)x / (double)w;
    	double tv1 = tv / (double)h + (double)y / (double)h;
        textBuffer.put((float)tu1);
        textBuffer.put((float)tv1);
        
    }

}
