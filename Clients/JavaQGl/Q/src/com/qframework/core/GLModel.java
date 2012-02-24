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
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;
import java.util.Iterator;
import java.util.ArrayList;
import javax.media.opengl.GL;
import javax.media.opengl.GL2;


public class GLModel {

	protected boolean mEnabled = false;
	protected boolean mForceHalfTexturing = false;
	protected int     mForcedOwner = 0;
	private ArrayList<GLShape>	mShapeList = new ArrayList<GLShape>();	
	private ArrayList<GLVertex>	mVertexList = new ArrayList<GLVertex>();
	private int mIndexCount = 0;
    private FloatBuffer   mVertexBuffer;
    private ByteBuffer   mColorBuffer;
    private ShortBuffer mIndexBuffer;
    private FloatBuffer   mTextureBuffer;
    private int			mTextureOffset = 0;
    private int			mTextureW;
    private int			mTextureH;

    protected int mTextureID = 1;
    
    protected boolean mTransform = false;
    
    protected float mBBoxMin[];
    protected float mBBoxMax[];
    protected int mVertexOffset = 0;
	private boolean mGenerated = false;
	protected String mName;
    protected GameonApp mApp;
    
	public GLModel(String name , GameonApp app) {
		mApp  = app;
		mName = name;
		mBBoxMin = new float[3];
	    mBBoxMax = new float[3];
	    mBBoxMin[0] = 1E10f;
	    mBBoxMin[1] = 1E10f;
	    mBBoxMin[2] = 1E10f;
	    mBBoxMax[0] = -1E10f;
	    mBBoxMax[1] = -1E10f;
	    mBBoxMax[2] = -1E10f;	
	    
    	mTextureOffset = 0;
        mTextureW = 1;
        mTextureH = 1;
    	
	}
	public boolean isValid()
	{
		return mVertexList.size() > 0;
	}
	public void addShape(GLShape shape) {
		mShapeList.add(shape);
		mIndexCount += shape.getIndexCount();
	}
	
	public void generate() {
        mGenerated = true;
        ByteBuffer bb = ByteBuffer.allocateDirect(mVertexList.size()*4*4);
        bb.order(ByteOrder.nativeOrder());
        mColorBuffer = bb;

        bb = ByteBuffer.allocateDirect(mVertexList.size()*3*Float.SIZE /8);
        bb.order(ByteOrder.nativeOrder());
        mVertexBuffer = bb.asFloatBuffer();

        bb = ByteBuffer.allocateDirect(mIndexCount* Short.SIZE/8);
        bb.order(ByteOrder.nativeOrder());
        mIndexBuffer = bb.asShortBuffer();

        bb = ByteBuffer.allocateDirect(mVertexList.size()*Float.SIZE/8 * 2 * (mTextureW * mTextureH));
        bb.order(ByteOrder.nativeOrder());
        mTextureBuffer = bb.asFloatBuffer();

		if (mTextureW == 1 && mTextureH == 1) {
			Iterator<GLVertex> iter2 = mVertexList.iterator();
			while (iter2.hasNext()) {
				GLVertex vertex = iter2.next();
				vertex.put(mVertexBuffer, mColorBuffer, mTextureBuffer);
			}
		} else {
			Iterator<GLVertex> iter2 = mVertexList.iterator();
			while (iter2.hasNext()) {
				GLVertex vertex = iter2.next();
				vertex.put(mVertexBuffer, mColorBuffer);
			}
			
			int cnt = 0;
			int cnttrig = mVertexList.size() /2;
			int fx = mForcedOwner % mTextureW;
			int fy = mForcedOwner / mTextureW;
			for (int b=0; b< mTextureH; b++) {
				for (int a=0; a< mTextureW; a++) {
					cnt = 0;
					Iterator<GLVertex> iter3 = mVertexList.iterator();
					while (iter3.hasNext()) {
						GLVertex vertex = iter3.next();
						if (mForceHalfTexturing && cnt >= cnttrig) 
						{
							vertex.putText( mTextureBuffer , fx, fy,  mTextureW, mTextureH);
						}else
						{
							vertex.putText( mTextureBuffer , a, b,  mTextureW, mTextureH);
						}
						cnt++;
					}					
					
				}
			}
		}

		Iterator<GLShape> iter3 = mShapeList.iterator();
		while (iter3.hasNext()) {
			GLShape shape = iter3.next();
			shape.putIndices(mIndexBuffer);
		}
		
	}
	
	
	public GLVertex addVertex(float x, float y, float z, float tu, float tv) {
		GLVertex vertex = new GLVertex(x, y, z, tu , tv , mVertexList.size());
		mVertexList.add(vertex);
		if (x < mBBoxMin[0]) mBBoxMin[0] = x;
		if (y < mBBoxMin[1]) mBBoxMin[1] = y;
		if (z < mBBoxMin[2]) mBBoxMin[2] = z;		

		if (x > mBBoxMax[0]) mBBoxMax[0] = x;
		if (y > mBBoxMax[1]) mBBoxMax[1] = y;
		if (z > mBBoxMax[2]) mBBoxMax[2] = z;

		return vertex;
	}	

	int count = 0;
	static int mLastText = -1;
	public void setupRef(GL2 gl)
	{
		if (mTextureID != mLastText || mApp.textures().isUpdated())
		{
			if (gl.glIsTexture(mTextureID))
			{
				gl.glBindTexture(GL2.GL_TEXTURE_2D, mTextureID);
				mLastText = mTextureID;
				
			}else
			{
				gl.glBindTexture(GL2.GL_TEXTURE_2D, 1);
				mLastText = 1;
				
			}
			
			mApp.textures().resetUpdated();
		}
	}
	public boolean drawRef(GL2 gl, GameonModelRef ref , boolean initRef)
	{
    	if (!mEnabled || mIndexCount == 0) {
    		return true;
    	}

    	
    	if (ref.animating())
    	{
    		ref.animate(mApp.frameDelta());
    	}
    	if (!ref.getVisible() || !ref.mEnabled){
    		return true;
    	}
    	if (initRef)
    	{
    		setupRef(gl);
    	}
    	

    	
    	if (ref.mTransformOwner) {
    		if (ref.mOwner >=0 && ref.mOwner < ref.mOwnerMax)
    			mTextureOffset = mTextureBuffer.capacity() * ref.mOwner / ref.mOwnerMax;
    		else
    			System.out.println( "owner error " + ref.mOwner);
    	}


		mColorBuffer.position(0);
		mVertexBuffer.position(mVertexOffset);
        mTextureBuffer.position(mTextureOffset);
        mIndexBuffer.position(0);

        if (mColorBuffer.remaining() == 0)
        {
        	System.out.println("canceling " + mName);
        	return false;
        }
        gl.glVertexPointer(3, GL.GL_FLOAT, 0, mVertexBuffer);
        gl.glColorPointer(4, GL.GL_UNSIGNED_BYTE, 0, mColorBuffer);
        gl.glTexCoordPointer(2, GL.GL_FLOAT, 0, mTextureBuffer);
	
    	gl.glPushMatrix();
    	gl.glMultMatrixf( ref.matrix() , 0);
        if (mIndexCount > 0)
        {
        	gl.glDrawElements(GL.GL_TRIANGLES, mIndexCount, GL.GL_UNSIGNED_SHORT, mIndexBuffer);
        }

    	
   		gl.glPopMatrix();

   		return false;
   	
	}
   

    public void setTextureOffset(int w, int h) {
    	mTextureW = w;
    	mTextureH = h;
    	mTextureOffset = 0;
    }
    
	public void reset() {
		mColorBuffer.clear();
	    mVertexBuffer.clear();
	    mIndexBuffer.clear();
		mTextureBuffer.clear();
		generate();

	}

	public void setupOffset(int value)
	{
	    mVertexOffset = value * 12;
	}

	public void forceIndexCount( int count)
	{
		mIndexCount = count;
	}
}
