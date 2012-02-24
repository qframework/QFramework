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


public class GameonModelRef {
	private static float mStaticBounds[] =  { 
		-0.5f,-0.5f,0.0f,1.0f,
		0.5f,-0.5f,0.0f,1.0f,
		-0.5f,0.5f,0.0f,1.0f,
		 0.5f,0.5f,0.0f,1.0f };
	
	private float mBounds[] = new float[16];
	protected float mAreaPosition[] = { 0,0,0};
	protected float mAreaRotation[] = { 0,0,0};
	protected float mPosition[] = { 0,0,0};
	protected float mRotation[] = { 0,0,0};
	protected float mScale[] = { 1, 1, 1};
	protected float mScaleAdd[] = { 1,1,1};
	
	protected int	   mOwner;
	protected int	   mOwnerMax;
	protected boolean  mTransformOwner;
    protected boolean mEnabled = true;
	
	
	private GameonModel	mParent;
	private boolean 	mAdded = false;
    private boolean		mVisible = false;

    protected GameonWorld.Display mLoc = GameonWorld.Display.WORLD;
    private float[] mMatrix =  new float[16];
    
    
    // animations
    private boolean mAnimating = false;
    private AnimData	mAnimData;
    
    public GameonModelRef(GameonModel parent) {
    	mParent = parent;

    }
    
    public void clear()
    {
    	mPosition[0] = 0.0f;
    	mPosition[1] = 0.0f;
    	mPosition[2] = 0.0f;
    	
    	mRotation[0] = 0.0f;
    	mRotation[1] = 0.0f;
    	mRotation[2] = 0.0f;
    	
    	mScale[0] = 1.0f;
    	mScale[1] = 1.0f;
    	mScale[2] = 1.0f;
    	
    	mAreaPosition[0] = 0.0f;
    	mAreaPosition[1] = 0.0f;
    	mAreaPosition[2] = 0.0f;
    	
    	mAreaRotation[0] = 0.0f;
    	mAreaRotation[1] = 0.0f;
    	mAreaRotation[2] = 0.0f;

    	mScaleAdd[0] = 1.0f;
    	mScaleAdd[1] = 1.0f;
    	mScaleAdd[2] = 1.0f;
    	
        mOwner = 0;
    }
    public void setOwner(int owner, int ownerMax) {
    	mOwner = owner;
    	mOwnerMax = ownerMax;
    	mTransformOwner = true;
    }
    public void setPosition(float x, float y, float z) {

    	mPosition[0] = x;
    	mPosition[1] = y;
    	mPosition[2] = z;    	
    }

    public void setAreaPosition(float x, float y, float z) {

    	mAreaPosition[0] = x;
    	mAreaPosition[1] = y;
    	mAreaPosition[2] = z;    	
    }
    
    public void addPosition(float x, float y, float z) {

    	mPosition[0] += x;
    	mPosition[1] += y;
    	mPosition[2] += z;    	
    }
    
    public void addAreaPosition(float x, float y, float z) {

    	mAreaPosition[0] += x;
    	mAreaPosition[1] += y;
    	mAreaPosition[2] += z;    	
    }
    
    
    public void setScale(float x, float y, float z) {
    	mScale[0] = x;
    	mScale[1] = y;
    	mScale[2] = z;  
    }
    public void setRotate(float x, float y, float z) {
    	mRotation[0] = x;
    	mRotation[1] = y;
    	mRotation[2] = z;  
    }

    public void setRotate(float[] vals) {
    	mRotation[0] = vals[0];
    	mRotation[1] = vals[1];
    	mRotation[2] = vals[2];  
    }

    
    public void setAreaRotate(float x, float y, float z) {
    	mAreaRotation[0] = x;
    	mAreaRotation[1] = y;
    	mAreaRotation[2] = z;  
    }
    
    public void setAreaRotate(float[] area) {
    	mAreaRotation[0] = area[0];
    	mAreaRotation[1] = area[1];
    	mAreaRotation[2] = area[2];  
    }
    public void setAreaPosition(float[] area) {
    	mAreaPosition[0] = area[0];
    	mAreaPosition[1] = area[1];
    	mAreaPosition[2] = area[2];  
    }
    
    
    public void setScale(float[] area) {
    	mScale[0] = area[0];
    	mScale[1] = area[1];
    	mScale[2] = area[2];  
    }
    
    public void setPosition(float[] area) {
    	mPosition[0] = area[0];
    	mPosition[1] = area[1];
    	mPosition[2] = area[2];  
    }
    
    
    public void addRotation(float x, float y, float z) {
    	mRotation[0] += x;
    	mRotation[1] += y;
    	mRotation[2] += z;  
    }    
        
    public void addAreaRotation(float x, float y, float z) {
    	mAreaRotation[0] += x;
    	mAreaRotation[1] += y;
    	mAreaRotation[2] += z;  
    }    
        

    public void apply()
    {
    	if (!mAdded) {
    		mAdded = true;
    		mParent.addref(this);
    	}
    }
	public void remove() {
		mParent.removeref(this);
		mAdded = false;
		setVisible(false);
	}
	public void copy(GameonModelRef mModelRef) {
		mPosition[0] = mModelRef.mPosition[0];
		mPosition[1] = mModelRef.mPosition[1];
		mPosition[2] = mModelRef.mPosition[2];

    	mScale[0] = mModelRef.mScale[0];
    	mScale[1] = mModelRef.mScale[1];
    	mScale[2] = mModelRef.mScale[2];
    
		mRotation[0] = mModelRef.mRotation[0];
    	mRotation[1] = mModelRef.mRotation[1];
    	mRotation[2] = mModelRef.mRotation[2];

    	mAreaPosition[0] = mModelRef.mAreaPosition[0];
		mAreaPosition[1] = mModelRef.mAreaPosition[1];
		mAreaPosition[2] = mModelRef.mAreaPosition[2];

		mAreaRotation[0] = mModelRef.mAreaRotation[0];
    	mAreaRotation[1] = mModelRef.mAreaRotation[1];
    	mAreaRotation[2] = mModelRef.mAreaRotation[2];
    	
    	
    	mLoc = mModelRef.mLoc;
	}

	public void setScaleRef(GameonModelRef mModelRef) {
    	mScale[0] = mModelRef.mScale[0];
    	mScale[1] = mModelRef.mScale[1];
    	mScale[2] = mModelRef.mScale[2];
	}

	public void setRotation(GameonModelRef mModelRef) {
		mRotation[0] = mModelRef.mRotation[0];
    	mRotation[1] = mModelRef.mRotation[1];
    	mRotation[2] = mModelRef.mRotation[2];
	}

	public float distxy(GameonModelRef from) {
		float dist = (float)Math.sqrt((double)( (from.mPosition[0] - mPosition[0])*
								(from.mPosition[0] - mPosition[0]) +
								(from.mPosition[1] - mPosition[1])*
								(from.mPosition[1] - mPosition[1])));
		return dist;
	}
	
	public float distxyMat(GameonModelRef from) {
		float dist = (float)Math.sqrt((double)( (from.mMatrix[12] - mMatrix[12])*
								(from.mMatrix[12] - mMatrix[12]) +
								(from.mMatrix[13] - mMatrix[13])*
								(from.mMatrix[13] - mMatrix[13])));
		return dist;
	}
	
	public void set()
	{
		GMath.matrixIdentity(mMatrix);

		if (mAreaPosition[0] != 0.0f || mAreaPosition[1] != 0.0f || mAreaPosition[2] != 0.0f)
		{
			GMath.matrixTranslate(mMatrix, mAreaPosition[0], 
					mAreaPosition[1], 
					mAreaPosition[2]);
		}

		if (mAreaRotation[0] != 0.0f || mAreaRotation[1] != 0.0f || mAreaRotation[2] != 0.0f)
		{
		
			GMath.matrixRotate(mMatrix,mAreaRotation[0], 1, 0, 0);
			GMath.matrixRotate(mMatrix,mAreaRotation[1], 0, 1, 0);
			GMath.matrixRotate(mMatrix,mAreaRotation[2], 0, 0, 1);
		}
		if (mPosition[0] != 0.0f || mPosition[1] != 0.0f || mPosition[2] != 0.0f)
		{
		
			GMath.matrixTranslate(mMatrix, mPosition[0], 
										mPosition[1], 
										mPosition[2]);
		}
		
		if (mRotation[0] != 0.0f || mRotation[1] != 0.0f || mRotation[2] != 0.0f)
		{

			GMath.matrixRotate(mMatrix,mRotation[0], 1, 0, 0);
			GMath.matrixRotate(mMatrix,mRotation[1], 0, 1, 0);
			GMath.matrixRotate(mMatrix,mRotation[2], 0, 0, 1);
		}
		
		if (mScale[0]!= 1.0f  || mScale[1] != 1.0f || mScale[2] != 1.0f ||
			mScaleAdd[0] != 1.0f || mScaleAdd[1] != 1.0f || mScaleAdd[2] != 1.0f )
		{
		
			GMath.matrixScale(mMatrix, mScale[0] * mScaleAdd[0],
					mScale[1] * mScaleAdd[1],
					mScale[2] * mScaleAdd[2]);
		}
		
		GMath.matrixVecMultiply2(mMatrix, mStaticBounds, 0 , mBounds,0);
		GMath.matrixVecMultiply2(mMatrix, mStaticBounds, 4 , mBounds,4);
		GMath.matrixVecMultiply2(mMatrix, mStaticBounds, 8 , mBounds,8);
		GMath.matrixVecMultiply2(mMatrix, mStaticBounds, 12 , mBounds,12);
		        
	}

	public void translate(float x,float y,float z)
	{
		GMath.matrixTranslate(mMatrix, x, y, z);
	}

	public void setVisible(boolean visible)
	{
		mEnabled = true;
		mVisible = visible;
		if (visible)
		{
			if (mParent != null)mParent.addVisibleRef(this);
		}else
		{
			if (mParent != null)mParent.remVisibleRef(this);
			if (this.mAnimating && this.mAnimData != null)
			{
				this.mAnimData.cancelAnimation(this);
				mAnimating = false;
			}
			
		}
	}
	
	public boolean getVisible()
	{
		return mVisible;
	}

	public void setParent(GameonModel gameonModel) {
		mParent = gameonModel;
		
	}

	public void copyMat(GameonModelRef ref)
	{
		for (int a= 0; a< 16; a++)
		{
			this.mMatrix[a] = ref.mMatrix[a];
		}
	}
	public void setAddScale(float[] addScale) {
		mScaleAdd[0] = addScale[0];
		mScaleAdd[1] = addScale[1];
		mScaleAdd[2] = addScale[2];
	}


	public void mulScale(float[] scale) {
		mScale[0] *= scale[0];
		mScale[1] *= scale[1];
		mScale[2] *= scale[2];
	}

	
	public void mulScale(float x,float y, float z) {
		mScale[0] *= x;
		mScale[1] *= y;
		mScale[2] *= z;
	}
	
	
	public float intersectsRay(float[] eye , float[] ray, float[] loc)
	{
		// transform bounds!
		float dist = GMath.rayIntersectsBounds(eye, ray, mBounds , loc);
		if (dist >=0)
		{
			return dist;
		}
		return 1e6f;
	}
	
	public AnimData getAnimData(GameonApp app)
	{
		if (mAnimData == null)
		{
			mAnimData = new AnimData(-1,app);
		}
		return mAnimData;
	}
	public void activateAnim()
	{
		if (mAnimData == null)
			return;		
		mAnimating = true;
		mAnimData.activate();
	}

	public void animate(long deltaTime) {
		if (mAnimData == null)
			return;
		if (mAnimData.process2(this , deltaTime))
		{
			mAnimating = false;
		}
		
	}
	
	public boolean animating()
	{
		return mAnimating;
	}

	public float[] matrix() {
		return mMatrix;
	}

	
}

