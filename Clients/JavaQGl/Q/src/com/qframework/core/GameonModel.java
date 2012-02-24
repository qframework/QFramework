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

import com.qframework.core.GameonWorld.Display;
import com.qframework.core.LayoutArea.State;

import java.util.Vector;

import javax.media.opengl.GL2;

// TODO 
// model creation , from formula? and parameters?
// different geometry shapes
// difrerent mapping
// all programatically 

public class GameonModel extends GLModel{
	
	private Vector<GameonModelRef> mRefs = new Vector<GameonModelRef>();
	private Vector<GameonModelRef> mVisibleRefs = new Vector<GameonModelRef>();
	protected Display mLoc = GameonWorld.Display.WORLD;
	protected int mSubmodels  = 0;
	protected GameonModelData.Type mModelTemplate = GameonModelData.Type.NONE;
	protected boolean mHasAlpha = false;	
	protected boolean mIsModel = false;
	private GameonWorld mWorld;
	private boolean mVisible = true;
	private boolean mActive = true;
	
	public GameonModel(String name, GameonApp app) {
		super(name , app);
		mApp = app;
		mWorld = mApp.world();
	}
    public void createModel(GameonModelData.Type type, float left, float bottom, float back, 
    		float right, float top, float front,
    		int textid) {
    	float ratiox = right - left;
    	float ratioy = front - bottom;
    	float ratioz = top - back;    	
    	
    	float data[][] = GameonModelData.getData(type);
    	
    	GLColor color = mApp.colors().white;
    	// model info - vertex offset?
    	int len = data.length;
    	GLShape shape = new GLShape(this);
    	float xmid = (right + left) /2;
    	float ymid = (top + bottom) /2;
    	float zmid = (front + back) /2;

    	for (int a=0; a< len; a+=9 ) {
    		float vx1 = data[a][0];
    		float vy1 = data[a][1];
    		float vz1 = data[a][2];
    		
    		float tu1 = data[a+2][0];
    		float tv1 = 1.0f- data[a+2][1];    		
    		vx1 *= ratiox; vx1 += xmid;
    		vy1 *= ratioy; vy1 += ymid;
    		vz1 *= ratioz; vz1 += zmid;
    		GLVertex v1 = shape.addVertex(vx1, vy1, vz1, tu1, tv1, color);
    		
    		float vx2 = data[a+3][0];
    		float vy2 = data[a+3][1];
    		float vz2 = data[a+3][2];
    		
    		float tu2 = data[a+5][0];
    		float tv2 = 1.0f- data[a+5][1];    		
    		
    		vx2 *= ratiox; vx2 += xmid;
    		vy2 *= ratioy; vy2 += ymid;
    		vz2 *= ratioz; vz2 += zmid;
    		GLVertex v2 = shape.addVertex(vx2, vy2, vz2, tu2, tv2, color);

    		float vx3 = data[a+6][0];
    		float vy3 = data[a+6][1];
    		float vz3 = data[a+6][2];
    		
    		float tu3 = data[a+8][0];
    		float tv3 = 1.0f- data[a+8][1];    		
    		
    		vx3 *= ratiox; vx3 += xmid;
    		vy3 *= ratioy; vy3 += ymid;
    		vz3 *= ratioz; vz3 += zmid;
    		GLVertex v3 = shape.addVertex(vx3, vy3, vz3, tu3, tv3, color);    		
    		
    		shape.addFace( new GLFace(v1,v2,v3));

    	}
    	
		addShape(shape);
		mTextureID = textid;
    
    }
    public void createModel(GameonModelData.Type type,
    		int textid) {
    	
    	float data[][] = GameonModelData.getData(type);
    	// model info - vertex offset?
    	int len = data.length;
    	GLColor color = mApp.colors().white;
    	GLShape shape = new GLShape(this);
    	for (int a=0; a< len; a+=9 ) {
    		float vx1 = data[a][0];
    		float vy1 = data[a][1];
    		float vz1 = data[a][2];
    		
    		float tu1 = data[a+2][0];
    		float tv1 = 1.0f - data[a+2][1];    		
    		GLVertex v1 = shape.addVertex(vx1, vy1, vz1, tu1, tv1, color);
    		
    		float vx2 = data[a+3][0];
    		float vy2 = data[a+3][1];
    		float vz2 = data[a+3][2];
    		
    		float tu2 = data[a+5][0];
    		float tv2 = 1.0f - data[a+5][1];    		
    		
    		GLVertex v2 = shape.addVertex(vx2, vy2, vz2, tu2, tv2, color);

    		float vx3 = data[a+6][0];
    		float vy3 = data[a+6][1];
    		float vz3 = data[a+6][2];
    		
    		float tu3 = data[a+8][0];
    		float tv3 = 1.0f - data[a+8][1];    		
    		
    		GLVertex v3 = shape.addVertex(vx3, vy3, vz3, tu3, tv3, color);    		
    		
    		shape.addFace( new GLFace(v1,v2,v3));

    	}
    	
		addShape(shape);
		mTextureID = textid;
    
    }    
    public void createModel(GameonModelData.Type type, float left, float bottom, float back, 
    		float right, float top, float front,
    		GLColor color)
    {
    	float ratiox = right - left;
    	float ratioy = front - bottom;
    	float ratioz = top - back;    	
    	
    	float data[][] = GameonModelData.getData(type);
    	// model info - vertex offset?
    	int len = data.length;
    	GLShape shape = new GLShape(this);
    	float xmid = (right + left) /2;
    	float ymid = (top + bottom) /2;
    	float zmid = (front + back) /2;

    	for (int a=0; a< len; a+=9 ) {
    		float vx1 = data[a][0];
    		float vy1 = data[a][1];
    		float vz1 = data[a][2];
    		
    		vx1 *= ratiox; vx1 += xmid;
    		vy1 *= ratioy; vy1 += ymid;
    		vz1 *= ratioz; vz1 += zmid;
    		float tu1 = data[a+2][0];
    		float tv1 = 1.0f - data[a+2][1];    		
    		GLVertex v1 = shape.addVertex(vx1, vy1, vz1 , tu1, tv1, color);
    		
    		float vx2 = data[a+3][0];
    		float vy2 = data[a+3][1];
    		float vz2 = data[a+3][2];
    		
    		vx2 *= ratiox; vx2 += xmid;
    		vy2 *= ratioy; vy2 += ymid;
    		vz2 *= ratioz; vz2 += zmid;
    		float tu2 = data[a+5][0];
    		float tv2 = 1.0f - data[a+5][1];    		
    		GLVertex v2 = shape.addVertex(vx2, vy2, vz2, tu2 , tv2, color);

    		float vx3 = data[a+6][0];
    		float vy3 = data[a+6][1];
    		float vz3 = data[a+6][2];
    		
    		vx3 *= ratiox; vx3 += xmid;
    		vy3 *= ratioy; vy3 += ymid;
    		vz3 *= ratioz; vz3 += zmid;
    		float tu3 = data[a+8][0];
    		float tv3 = 1.0f - data[a+8][1];    		
    		GLVertex v3 = shape.addVertex(vx3, vy3, vz3, tu3, tv3, color);    		
    		
    		shape.addFace( new GLFace(v1,v2,v3));

    	}

		addShape(shape);
		mTextureID = mApp.textures().get(TextureFactory.Type.DEFAULT);
    }
    public void createOctogon(float left, float bottom, float back, float right, float top, float front, GLColor color)  
    {
    	GLShape shape = new GLShape(this);
    	float divx = (right - left ) / 4;
    	float divy = (top - bottom ) / 4;
    	
    	GLVertex p1 = shape.addVertex(left + divx, top, front , 0.0f , 1.00f, color);
    	GLVertex p2 = shape.addVertex(left + 3 * divx, top, front , 0.0f , 1.00f, color);
    	GLVertex p3 = shape.addVertex(right,  bottom + 3 * divy, front , 0.0f , 1.00f, color);
    	GLVertex p4 = shape.addVertex(right,  bottom +  divy, front , 0.0f , 1.00f, color);
    	GLVertex p5 = shape.addVertex(left + 3*divx, bottom, front , 0.0f , 1.00f, color);
    	GLVertex p6 = shape.addVertex(left + divx, bottom, front , 0.0f , 1.00f, color);
    	GLVertex p7 = shape.addVertex(left , bottom + divy, front , 0.0f , 1.00f, color);
    	GLVertex p8 = shape.addVertex(left , bottom + 3* divy, front , 0.0f , 1.00f, color);
    	
    	

        GLVertex center = shape.addVertex( (right + left) / 2, (top + bottom ) / 2, front, 0.5f,0.5f, mApp.colors().white);
        // front

        shape.addFace(new GLFace(center, p1 , p8));
        shape.addFace(new GLFace(center, p2 , p1));
        shape.addFace(new GLFace(center, p3 , p2));
        shape.addFace(new GLFace(center, p4 , p3));
        shape.addFace(new GLFace(center, p5 , p4));
        shape.addFace(new GLFace(center, p6 , p5));
        shape.addFace(new GLFace(center, p7 , p6));
        shape.addFace(new GLFace(center, p8 , p7));

		mTextureID = mApp.textures().get(TextureFactory.Type.DEFAULT);
        addShape(shape);
    }    
    public void createPlane(float left, float bottom, float back, float right, float top, float front, GLColor color)  
    {
    	GLShape shape = new GLShape(this);
       	GLVertex leftBottomFront = shape.addVertex(left, bottom, front , 0.01f , 0.99f, color);
        GLVertex rightBottomFront = shape.addVertex(right, bottom, front , 0.99f , 0.99f, color);
    	GLVertex leftTopFront = shape.addVertex(left, top, front , 0.01f , 0.01f, color);
        GLVertex rightTopFront = shape.addVertex(right, top, front , 0.99f , 0.01f, color);
        // front
        shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
        shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

        addShape(shape);
    }
    public void createPlane4(float left, float bottom, float back, float right, float top, float front, GLColor color, GLColor color2 )  
    {
    	GLShape shape = new GLShape(this);
    	if (color == null)
    	{
    		color = mApp.colors().white;
    	}
    	if (color2 == null)
    	{
    		color2 = mApp.colors().white;
    	}    	
    	GLVertex leftBottomFront = shape.addVertex(left, bottom, front , 0.0f , 1.00f, color);
        GLVertex rightBottomFront = shape.addVertex(right, bottom, front , 1.0f , 1.00f, color);
    	GLVertex leftTopFront = shape.addVertex(left, top, front , 0.0f , 0.00f, color2);
        GLVertex rightTopFront = shape.addVertex(right, top, front , 1.00f , 0.00f, color2);
        // front

        shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
        shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

//        shape.setFaceColor(0, color);
		mTextureID = mApp.textures().get(TextureFactory.Type.DEFAULT);
        addShape(shape);
    }    
    public void createPlaneForLetter(float left, float bottom, float back, float right, float top, float front, GLColor color)  
    {
    	GLShape shape = new GLShape(this);
       	GLVertex leftBottomFront = shape.addVertex(left, bottom, front , 0.00f , 1.00f, color);
        GLVertex rightBottomFront = shape.addVertex(right, bottom, front , 1.00f , 1.00f, color);
    	GLVertex leftTopFront = shape.addVertex(left, top, front , 0.09f , 0.00f, color);
        GLVertex rightTopFront = shape.addVertex(right, top, front , 1.00f , 0.00f, color);
        // front

        shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
        shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

//        shape.setFaceColor(0, color);
		mTextureID = mApp.textures().get(TextureFactory.Type.DEFAULT);
        addShape(shape);
    }
    public void createPlane2(float left, float bottom, float back, float right, float top, float front, GLColor color)  
    {
    	GLShape shape = new GLShape(this);
       	GLVertex leftBottomFront = shape.addVertex(left, bottom, front , 0.0f , 1.0f, color);
        GLVertex rightBottomFront = shape.addVertex(right, bottom, front , 1.0f , 1.0f, color);
    	GLVertex leftTopFront = shape.addVertex(left, top, front , 0.0f , 0.0f, color);
        GLVertex rightTopFront = shape.addVertex(right, top, front , 1.0f , 0.0f, color);
        // front

        shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
        shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

//        shape.setFaceColor(0, color);
		mTextureID = mApp.textures().get(TextureFactory.Type.DEFAULT);
        addShape(shape);
    }
    public void createPlane3(float left, float bottom, float back, float right, float top, float front, GLColor color)  
    {
    	GLShape shape = new GLShape(this);
       	GLVertex leftBottomFront = shape.addVertex(left, bottom, front , 0.0f , 1.0f, color);
        GLVertex rightBottomFront = shape.addVertex(right, bottom, front , 1.0f , 1.0f, mApp.colors().white);
    	GLVertex leftTopFront = shape.addVertex(left, top, front , 0.10f , 0.0f, color);
        GLVertex rightTopFront = shape.addVertex(right, top, front , 0.90f , 0.0f, color);
        // front

        shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
        shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

//        shape.setFaceColor(0, color);
		mTextureID = mApp.textures().get(TextureFactory.Type.DEFAULT);
        addShape(shape);
    }    
	public void createCube(float left, float bottom, float back, float right, float top, float front, GLColor color) {
		GLShape shape = new GLShape(this);
		
		GLColor white = mApp.colors().white;
		
		GLVertex leftBottomBack = shape.addVertex(left, bottom, back , 0 , 0, white);
        GLVertex rightBottomBack = shape.addVertex(right, bottom, back , 0 , 0, white);
       	GLVertex leftTopBack = shape.addVertex(left, top, back , 0 , 0, white);
        GLVertex rightTopBack = shape.addVertex(right, top, back , 0 , 0, white);
       	GLVertex leftBottomFront = shape.addVertex(left, bottom, front , 0 , 0, color);
        GLVertex rightBottomFront = shape.addVertex(right, bottom, front , 0 , 0, color);
       	GLVertex leftTopFront = shape.addVertex(left, top, front , 0 , 0, color);
        GLVertex rightTopFront = shape.addVertex(right, top, front , 0 , 0, white );//color);

        
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

		mTextureID = mApp.textures().get(TextureFactory.Type.DEFAULT);
        addShape(shape);
	}

	public void addref(GameonModelRef ref)
	{
		if (mRefs.indexOf(ref) < 0)
		{
			mRefs.add(ref);
			ref.set();
			mEnabled = true;
		}
		ref.setParent(this);
		if (ref.getVisible())
		{
			addVisibleRef(ref);
		}
		
	}
	
	public void draw(GL2 gl, GameonWorld.Display loc)
    {
		if (!mEnabled || !mVisible) {
			return;
		}
		int len = mVisibleRefs.size();
		if (len > 0) {
			//setupRef(gl);
			for (int a=0; a<mVisibleRefs.size() ; a++)
			{
				GameonModelRef ref = mVisibleRefs.get(a);
				boolean initRef = true;
				if (ref.mLoc == loc ) {
					//setupRefV(gl);
					initRef = drawRef( gl, ref , initRef);
				}
			}
		}
	}
	public void removeref(GameonModelRef ref) {
		if (mRefs.indexOf(ref) >= 0)
		{
			mRefs.remove(ref);
			if (mRefs.size() == 0)
		{
				mEnabled = false;
			}
		}
    }
	public void setTexture(int i) {
		this.mTextureID = i;
		
	}

    public void createCard(float left, float bottom, float back, float right, float top, float front, GLColor color)  
    {
    	GLShape shape = new GLShape(this);
    	float t = 0.002f;
       	GLVertex leftBottomFront = shape.addVertex(left, bottom, front+t , 0.0f , 0.00f, color);
        GLVertex rightBottomFront = shape.addVertex(right, bottom, front+t , 1.0f , 0.00f, color);
       	GLVertex leftBottom2Front = shape.addVertex(left, (bottom+top)/2, front+t , 0.0f , 1.0f, color);
        GLVertex rightBottom2Front = shape.addVertex(right, (bottom+top)/2, front+t , 1.0f ,1.0f, color);

        GLVertex leftTopFront = shape.addVertex(left, top, front+t , 0.0f , 0.00f, color);
        GLVertex rightTopFront = shape.addVertex(right, top, front+t , 1.00f , 0.00f, color);

        // front
        shape.addFace(new GLFace(leftBottom2Front, rightTopFront , leftTopFront));
        shape.addFace(new GLFace(leftBottom2Front, rightBottom2Front , rightTopFront ));

        shape.addFace(new GLFace(leftBottomFront, rightBottom2Front , leftBottom2Front));
        shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightBottom2Front ));
        
        
        //back vertexex
//        color = mApp.colors().blue;
       	GLVertex leftBottomFront_ = shape.addVertex(left, bottom, front-t , 0.0f , 0.00f, color);
        GLVertex rightBottomFront_ = shape.addVertex(right, bottom, front-t , 1.0f , 0.00f, color);
       	GLVertex leftBottom2Front_ = shape.addVertex(left, (bottom+top)/2, front -t, 0.0f , 1.0f, color);
        GLVertex rightBottom2Front_ = shape.addVertex(right, (bottom+top)/2, front -t, 1.0f ,1.0f, color);

        GLVertex leftTopFront_ = shape.addVertex(left, top, front - t, 0.0f , 0.00f, color);
        GLVertex rightTopFront_ = shape.addVertex(right, top, front - t, 1.00f , 0.00f, color);

        // back
        shape.addFace(new GLFace(leftBottom2Front_, leftTopFront_, rightTopFront_ ));
        shape.addFace(new GLFace(leftBottom2Front_, rightTopFront_ , rightBottom2Front_ ));

        shape.addFace(new GLFace(rightBottom2Front_ ,  leftBottomFront_,leftBottom2Front_));
        shape.addFace(new GLFace(rightBottomFront_, leftBottomFront_,rightBottom2Front_  ));
        
		mTextureID = mApp.textures().get(TextureFactory.Type.DEFAULT);
        addShape(shape);
        
    }
	

    public void createCard2(float left, float bottom, float back, float right, float top, float front, GLColor color)  
    {
    	GLShape shape = new GLShape(this);
    	float w = (right-left) / 30;    
    	float t =0.002f;
       	GLVertex leftBottomFront = shape.addVertex(left+w, bottom+w, front +t, 0.01f , 0.99f, color);
        GLVertex rightBottomFront = shape.addVertex(right-w, bottom+w, front+t , 0.99f , 0.99f, color);
    	GLVertex leftTopFront = shape.addVertex(left+w, top-w, front+t , 0.01f , 0.01f, color);
        GLVertex rightTopFront = shape.addVertex(right-w, top-w, front+t , 0.99f , 0.01f, color);
        // front

        shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
        shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

        GLVertex leftBottomFront_ = shape.addVertex(left+w, bottom+w, front -t,  0.99f , 0.99f,color);
        GLVertex rightBottomFront_ = shape.addVertex(right-w, bottom+w, front-t , 0.01f , 0.99f, color);
    	GLVertex leftTopFront_ = shape.addVertex(left+w, top-w, front-t ,  0.99f , 0.01f,color);
        GLVertex rightTopFront_ = shape.addVertex(right-w, top-w, front-t , 0.01f , 0.01f, color);        
        shape.addFace(new GLFace(leftBottomFront_, leftTopFront_, rightTopFront_ ));
        shape.addFace(new GLFace(leftBottomFront_, rightTopFront_, rightBottomFront_  ));
        
        //        shape.setFaceColor(0, color);
		mTextureID = mApp.textures().get(TextureFactory.Type.DEFAULT);
        addShape(shape);
        
    }
	public void setState(State state) {
		if (!mActive && state == State.VISIBLE)
			return;
		
		for (int a=0; a< mRefs.size(); a++)
		{
			GameonModelRef ref = mRefs.elementAt(a);
			if (state == State.HIDDEN)
			{
				ref.setVisible(false);
			}else
			{
				ref.setVisible(true);
			}
		}
		if (state == State.HIDDEN)
		{
			setVisible(false);
		}else
		{
			setVisible(true);
		}
	}
    
	
    public void createFrame(float left, float bottom, float back, float right, float top, float front, float fw, float fh, GLColor color)  
    {
    	GLColor c;
    	if (color == null)
    	{
    		c = mApp.colors().white;
    	}
    	else
    	{
    		c = color;
    	}
    	
    	createPlane(left-fw/2,bottom-fh/2,front   ,  left+fw/2, top+fh/2,front, color);
    	createPlane(right-fw/2,bottom-fh/2,front   ,  right+fw/2, top+fh/2,front, color);
    	
    	createPlane(left+fw/2,bottom-fh/2,front   ,  right-fw/2, bottom+fh/2,front, color);
    	createPlane(left+fw/2,top-fh/2,front   ,  right-fw/2, top+fh/2,front, color);
    }
    

    public void createPlaneTex(float left, float bottom, float back, float right, float top, float front, 
    		float tu1, float tv1 , float tu2, float tv2, GLColor[] colors, float no, float div)  
    {
    	GLShape shape = new GLShape(this);
       	GLVertex leftBottomFront = shape.addVertex(left, bottom, front , tu1 , tv2, mApp.colors().white);
        GLVertex rightBottomFront = shape.addVertex(right, bottom, front , tu2 , tv2, mApp.colors().white);
    	GLVertex leftTopFront = shape.addVertex(left, top, front , tu1 , tv1, mApp.colors().white);
        GLVertex rightTopFront = shape.addVertex(right, top, front , tu2 , tv1, mApp.colors().white);

        float val1 = no * div;
        float val2 = (no+1) * div;
        
        leftBottomFront.red = colors[0].red + (int)((colors[2].red-colors[0].red) * val1);
        leftBottomFront.green = colors[0].green + (int)((colors[2].green-colors[0].green) * val1);
        leftBottomFront.blue = colors[0].blue + (int)((colors[2].blue-colors[0].blue) * val1);
        leftBottomFront.alpha = colors[0].alpha + (int)((colors[2].alpha-colors[0].alpha) * val1);

        rightBottomFront.red = colors[1].red + (int)((colors[3].red-colors[1].red) * val1);
        rightBottomFront.green = colors[1].green + (int)((colors[3].green-colors[1].green) * val1);
        rightBottomFront.blue = colors[1].blue + (int)((colors[3].blue-colors[1].blue) * val1);
        rightBottomFront.alpha = colors[1].alpha + (int)((colors[3].alpha-colors[1].alpha) * val1);

        leftTopFront.red = colors[0].red + (int)((colors[2].red-colors[0].red) * val2);
        leftTopFront.green = colors[0].green + (int)((colors[2].green-colors[0].green) * val2);
        leftTopFront.blue = colors[0].blue + (int)((colors[2].blue-colors[0].blue) * val2);
        leftTopFront.alpha = colors[0].alpha + (int)((colors[2].alpha-colors[0].alpha) * val2);

        rightTopFront.red = colors[1].red + (int)((colors[3].red-colors[1].red) * val2);
        rightTopFront.green = colors[1].green + (int)((colors[3].green-colors[1].green) * val2);
        rightTopFront.blue = colors[1].blue + (int)((colors[3].blue-colors[1].blue) * val2);
        rightTopFront.alpha = colors[1].alpha + (int)((colors[3].alpha-colors[1].alpha) * val2);

        // front
        //shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
        shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
        shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

        addShape(shape);
    }

    public void createPlaneTex2(float left, float bottom, float back, float right, float top, float front, 
    		float tu1, float tv1 , float tu2, float tv2, GLColor[] colors, float no, float div)  
    {
    	GLShape shape = new GLShape(this);
       	GLVertex leftBottomFront = shape.addVertex(left, bottom, front , tu1 , tv2, mApp.colors().white);
        GLVertex rightBottomFront = shape.addVertex(right, bottom, front , tu2 , tv2, mApp.colors().white);
    	GLVertex leftTopFront = shape.addVertex(left, top, front , tu1 , tv1, mApp.colors().white);
        GLVertex rightTopFront = shape.addVertex(right, top, front , tu2 , tv1, mApp.colors().white);

        float val1 = no * div;
        float val2 = (no+1) * div;
        
        leftBottomFront.red = colors[0].red + (int)((colors[2].red-colors[0].red) * val1);
        leftBottomFront.green = colors[0].green + (int)((colors[2].green-colors[0].green) * val1);
        leftBottomFront.blue = colors[0].blue + (int)((colors[2].blue-colors[0].blue) * val1);
        leftBottomFront.alpha = colors[0].alpha + (int)((colors[2].alpha-colors[0].alpha) * val1);

        rightBottomFront.red = colors[0].red + (int)((colors[2].red-colors[0].red) * val2);
        rightBottomFront.green = colors[0].green + (int)((colors[2].green-colors[0].green) * val2);
        rightBottomFront.blue = colors[0].blue + (int)((colors[2].blue-colors[0].blue) * val2);
        rightBottomFront.alpha = colors[0].alpha + (int)((colors[2].alpha-colors[0].alpha) * val2);

        leftTopFront.red = colors[1].red + (int)((colors[3].red-colors[1].red) * val1); 
        leftTopFront.green = colors[1].green + (int)((colors[3].green-colors[1].green) * val1);
        leftTopFront.blue = colors[1].blue + (int)((colors[3].blue-colors[1].blue) * val1);
        leftTopFront.alpha = colors[1].alpha + (int)((colors[3].alpha-colors[1].alpha) * val1);

        rightTopFront.red = colors[1].red + (int)((colors[3].red-colors[1].red) * val2);
        rightTopFront.green = colors[1].green + (int)((colors[3].green-colors[1].green) * val2);
        rightTopFront.blue = colors[1].blue + (int)((colors[3].blue-colors[1].blue) * val2);
        rightTopFront.alpha = colors[1].alpha + (int)((colors[3].alpha-colors[1].alpha) * val2);

        // front
        //shape.addFace(new GLFace(leftBottomFront, leftTopFront, rightTopFront, rightBottomFront));
        shape.addFace(new GLFace(leftBottomFront, rightTopFront , leftTopFront));
        shape.addFace(new GLFace(leftBottomFront, rightBottomFront , rightTopFront ));

        addShape(shape);
    }
    
    public void createAnimTrans(String type , int delay, boolean away , int no)
    {
        GameonModelRef to = new GameonModelRef(null); 
        to.copy( mRefs.get(no) );
        to.copyMat( mRefs.get(no) );
        GameonModelRef from = new GameonModelRef(null);
        from.copy(to);
        
        float w,h,x,y;
        if (to.mLoc == GameonWorld.Display.WORLD)
        {
        	w = mApp.cs().worldWidth();
        	h = mApp.cs().worldHeight();
        
        	x = mApp.cs().worldCenterX();
        	y = mApp.cs().worldCenterY();
        }else
        {
        	w = mApp.cs().hudWidth();
        	h = mApp.cs().hudHeight();
        
        	x = mApp.cs().hudCenterX();
        	y = mApp.cs().hudCenterY();        	
        }

        if (type.equals("left"))
        {
        	from.addAreaPosition(-w , 0 , 0);	
        }else if (type.equals("right"))
        {
        	from.addAreaPosition(w , 0 , 0);
        }else if (type.equals("top"))
        {
        	from.addAreaPosition(0  , +h , 0);
        }else if (type.equals("tophigh"))
        {
        	from.addAreaPosition(0  , +h+h , 0);
        }else if (type.equals("bottom"))
        {
        	from.addAreaPosition(0  , -h , 0);
        }else if (type.equals("scaleout"))
        {
        	from.mulScale( 30,30 ,30);
        }else if (type.equals("scalein"))
        {
        	from.mulScale( 30, 30 , 30);
        }else if (type.equals("swirlin"))
        {
        	from.mulScale( 30, 30 , 30);
        	from.addAreaRotation( 0, 0, 720);
        }else if (type.equals("swirlout"))
        {
        	from.mulScale( 30, 30 , 30);
        	from.addAreaRotation( 0, 0, 720);
        }
        
                                
        if (away)
        {
        	mApp.anims().createAnim( to , from , mRefs.get(no) , delay , 2 , null , 1, true);
        }else
        {
        	mApp.anims().createAnim( from , to , mRefs.get(no) , delay , 2 , null , 1 , false);
        }
            
    }

    public void addVisibleRef(GameonModelRef ref)
    {
    	if (ref.getVisible() )
    	{
    		if ( this.mVisibleRefs.indexOf(ref) < 0)
    		{
                if (mVisibleRefs.size() == 0)
                {
                    setVisible(true);
                }    			
    			mVisibleRefs.add( ref );
    		}
    	}
    }

    public void remVisibleRef(GameonModelRef ref)
    {
    	if (ref.getVisible() == false)
    	{
    		if ( this.mVisibleRefs.indexOf(ref) >= 0)
    		{
    			mVisibleRefs.remove( ref );
                if (mVisibleRefs.size() == 0)
                {
                    setVisible(false);
                }    			    			
    		}
    	}
    }
    
    public void setVisible(boolean visible)
    {
    	if (visible)
    	{
    		mVisible = true;
    		if (mWorld != null)
    		{
    			mWorld.setVisible(this);
    		}
    	}
    	else
    	{
    		mVisible = false;
    		if (mWorld != null)
    		{
    			mWorld.remVisible(this);
    		}
    	}
    }
    GameonModelRef ref(int no)
    {
    	if (no < 0 || no >= mRefs.size())
    	{
    		return null;
    	}
    	return mRefs.get(no);
    }
    
    int findRef(GameonModelRef ref)
    {
    	return mRefs.indexOf(ref);
    }
	public void unsetWorld() {
		mWorld = null;
		
	}
	
	protected void createAnim(String type, int refid , String delay, String data)
	{
		if (refid < 0 && refid >= mRefs.size())
		{
			return;
		}
		
		GameonModelRef ref = mRefs.get(refid);
		mApp.anims().animModelRef(type , ref, delay , data);
		
	}
	

	
	protected void setActive(boolean active)
	{
		mActive = active;
	}
}
