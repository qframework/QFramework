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

import java.sql.Ref;

import javax.media.opengl.GL2;


public class TextItem {

	private float mX;
	private float mY;
	private float mZ;
	private float mW;
	private float mH;	
	protected String mText; //todo
	private float mNum;
	private boolean mVisible = false;
	private int mOffset = -1;
	private float         mDirX = 1.0f;
	private float         mDirY = 0.0f;
    
	private GameonModelRef mRef = new GameonModelRef(null);
	protected  GameonModel mModel = null;
	private  GameonApp mApp = null;
	private  GameonWorld.Display mLoc;
	protected TextRender	mParent;
	private  GLColor mColors[] = new GLColor[4];
	private  boolean	mCentered = false;
	
	public TextItem(GameonApp app,  float x, float y, float w, float h, float z, 
			String text, float num, int offset , GameonWorld.Display loc,
			LayoutArea.Layout layout, GLColor[] colors)
	{
		mX = x;
		mY = y;
		mW = w;
		mH = h;
		mZ = z;
		mText = text;
		mNum = num;
		mOffset = offset;
		mLoc = loc;
		mRef.mLoc = loc;
		setOrientation(layout);
		mColors = colors;
		mApp = app;
		set(true);
	}

	public TextItem( GameonApp app, float x, float y, float w, float h, float z, 
			String text, int offset , GameonWorld.Display loc,
			LayoutArea.Layout layout, GLColor[] colors)
	{
		mX = x;
		mY = y;
		mW = w;
		mH = h;
		mZ = z;
		mText = text;
		mNum = -1.0f;
		mOffset = offset;
		mLoc = loc;
		mRef.mLoc = loc;
		setOrientation(layout);
		mColors = colors;
		mApp = app;
		set(true);
	}
	
	public boolean updateText(String text ,  GameonWorld.Display loc) {
		boolean update = false;
		if (mText.length() != text.length() && mNum < 0)
		{
			update = true;
		}
		mText = text;
		mLoc = loc;
		mRef.mLoc = loc;
		set(update);
		return update;
	}
	
	public void setOrientation(LayoutArea.Layout orientation)
	{

	    if (orientation == LayoutArea.Layout.WEST_EAST ||
	        orientation == LayoutArea.Layout.NONE || 
	        orientation == LayoutArea.Layout.HORIZONTAL)
	    {
	        mDirX = 1;
	        mDirY = 0;        
	    }else
	    if (orientation == LayoutArea.Layout.EAST_WEST)
	    {
	        mDirX = -1;
	        mDirY = 0;        
	    }
	    else
	    if (orientation == LayoutArea.Layout.NORTH_SOUTH|| 
		        orientation == LayoutArea.Layout.VERTICAL)
	    {
	        mDirX = 0;
	        mDirY = -1;        
	    }    
	    else
	    if (orientation == LayoutArea.Layout.SOUTH_NORTH)
	    {
	        mDirX = 0;
	        mDirY = 1;        
	    }    
	    if (orientation == LayoutArea.Layout.HORIZONTAL|| 
	        orientation == LayoutArea.Layout.VERTICAL)
	    {
	    	mCentered = true;
	    }
	}

	void setOffset(int offset)
	{
	    mOffset = offset;
	}
	
	void set(boolean updateref)
	{
		if (mText == null)
		{
			return;
		}

		float wfact = 0.48f;
		if (mModel != null)
		{
			// TODO increase algorithm for text model generation
			mModel = null;
		}
		mModel = new GameonModel("letter" , mApp);
		mModel.unsetWorld();
		mModel.mLoc = mLoc;
		mModel.addref( this.mRef );
		this.mRef.setVisible(true);
		
		if (mDirX != 0)
		{
			int len = mText.length();
			if (len == 0)return;
			float num = mNum;
			
			if (num <= 0) {
				num = len;
			}
			//System.out.println( mText + " " + num);
			if (updateref)
			{
				mRef.mPosition[0] = mX;
				mRef.mPosition[1] = mY;
				mRef.mPosition[2] = mZ;
				mRef.mScale[0] = mW / num;
				mRef.mScale[1] = mH;
				
			}
			float start = - (float)num / 2.0f + 0.5f;
			if (mCentered && mNum > 0)
			{
				start = - (float)len / 2.0f + 0.5f;
			}
			
			
			float div = 1.0f/16.0f;
			
			for (int a=0; a< len && a < num ; a++ ) 
			{
				//var x = start + a * divx  * dirx; 
				int val = getVal(mText.charAt(a)); 
				float tu1 = div * (val  % 16);
				float tv1 = div * (float)Math.floor(val  / 16);
				float tu2 = tu1 + div;
				float tv2 = tv1 + div;	
				
				tu1 += mApp.textures().mU1;
				tv1 += mApp.textures().mV1;
				tu2 -= mApp.textures().mU2;
				tv2 -= mApp.textures().mV2;

				
				if (mDirX > 0)
				{
					mModel.createPlaneTex2( start-wfact, -wfact, 0.0f, start+wfact+mApp.textures().mCp, wfact, 0.0f, 
							tu1,tv1, tu2,tv2,mColors, (float)a,1/Math.max(len,num));
				}else
				{
					mModel.createPlaneTex2( num-1-start-wfact-mApp.textures().mCp, -wfact, 0.0f, num-1-start+wfact, wfact, 
							0.0f, tu1,tv1, tu2,tv2,mColors,(float)a,1/Math.max(len,num));
				}
				start += 1.0;
			}
				
		} else {
			int len = mText.length();
			if (len == 0)
			{
				return;
			}
			float num = mNum;
			if (num <= 0) {
				num = len;
			}
			

			if (updateref)
			{
				mRef.mPosition[0] = mX;
				mRef.mPosition[1] = mY;
				mRef.mPosition[2] = mZ;
				mRef.mScale[0] = mW;
				mRef.mScale[1] = mH / num;
			}
			
			// NSLog(@" text +++ = %@" , text);
			float start =  (float)num / 2.0f - 0.5f;
			if (mCentered && mNum > 0)
			{
				start = (float)len / 2.0f - 0.5f;
			}			
			
			
			float div = 1.0f/16.0f;
			for (int a=0; a< len && a < num ; a++ ) 
			{
				//var x = start + a * divx  * dirx; 
				int val = getVal(mText.charAt(a)); 
				float tu1 = div * (val  % 16);
				float tv1 = div * (float)Math.floor(val  / 16);
				float tu2 = tu1 + div;
				float tv2 = tv1 + div;	
				tu1 += mApp.textures().mU1;
				tv1 += mApp.textures().mV1;
				tu2 -= mApp.textures().mU2;
				tv2 -= mApp.textures().mV2;
				
				if (mDirY > 0)
				{
					mModel.createPlaneTex( -wfact, start-wfact, 0.0f, wfact, start+wfact+mApp.textures().mCp/2, 0.0f, 
							tu1,tv1, tu2,tv2, mColors,(float)a,1/Math.max(len,num));
				}else
				{
					mModel.createPlaneTex( -wfact, num-1-start-wfact-mApp.textures().mCp/2, 0.0f, wfact, num-1-start+wfact, 
							0.0f, tu1,tv1, tu2,tv2, mColors,(float)a,1/Math.max(len,num));
				}
				start += 1.0;
				
			}
		}
		
		mModel.setTexture(mApp.textures().get( TextureFactory.Type.FONT));
		mModel.generate();
		mModel.mEnabled = true;

		if (updateref)
		{
			//mRef.set();
		}
	}

	public void draw(GL2 gl, int no)
	{

		if (mModel == null)
		{
			return;
		}
		if (no == 0)
		{
			mModel.setupRef(gl);
		}
		if( mText == null || mText.length() == 0)
		{
			return;
		}
		
		if (mOffset > 0)
		{
			GLColor c = mApp.colors().getColorId(mOffset);
			float[] alights = mApp.world().getAmbientLight();
			mApp.world().setAmbientLightGl(
					alights[0] * (float)c.red / 255.0f, 
					alights[1] * (float)c.green / 255.0f, 
					alights[2] * (float)c.blue / 255.0f, 
					alights[3] * (float)c.alpha / 255.0f,
					gl);
			mModel.setupRef(gl);
			mModel.drawRef(gl,mRef , true);

			mApp.world().setAmbientLightGl(
					alights[0], 
					alights[1], 
					alights[2], 
					alights[3],
					gl);			
			
		}else
		{
			//mModel.setupRef(gl);
			mModel.drawRef(gl,mRef, true);
		}
		
	}


	public int getVal(int val)
	{
		int ref = 32;
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

	public void setParent(TextRender parent)
	{
		mParent = parent;
	}
	
	public void setVisible(boolean visible)
	{
		mVisible = visible;
		if (visible)
		{
			mParent.addVisible(this);
		}else
		{
			mParent.removeVisible(this);
		}
		if (this.mRef != null)
		{
			this.mRef.setVisible(visible);
		}		
	}
	
	public boolean getVisible()
	{
		return mVisible;
	}

	public void setPosition(float x, float y, float z, float w,
			float h) {
		mX = x;
		mY = y;
		mZ = z;
		mW = w;
		mH = h;
		
		//System.out.println(" set pos " + mText + " " + mX + " " + mY+  " " + mZ + " " + mW + " " + mH);
		setRef();
	}
	
	public void setRef()
	{
		if (mRef != null)
		{
			if (mDirX != 0)
			{
				float num = mNum;
				
				if (num <= 0) {
					num = mText.length();
				}
				mRef.mPosition[0] = mX;
				mRef.mPosition[1] = mY;
				mRef.mPosition[2] = mZ;
				mRef.mScale[0] = mW / num;
				mRef.mScale[1] = mH;

			}
			else
			{
				float num = mNum;
				
				if (num <= 0) {
					num = mText.length();
				}
				
				mRef.mPosition[0] = mX;
				mRef.mPosition[1] = mY;
				mRef.mPosition[2] = mZ;
				mRef.mScale[0] = mW;
				mRef.mScale[1] = mH / num;
				
			}
		}
	}
	
	GameonModelRef ref()
	{
		return mRef;
	}

	public void setParentLoc(LayoutArea area) {
		if (mRef != null)
		{
			mRef.setAreaPosition(area.mLocation);
			mRef.setAreaRotate(area.mRotation);
			mRef.mulScale(area.mBounds);
			mRef.setAddScale(area.mScale);			
			mRef.set();
		}
		
	}

}
