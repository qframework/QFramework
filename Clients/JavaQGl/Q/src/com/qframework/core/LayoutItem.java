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


public class LayoutItem {

	protected GameonModelData.Type mType = GameonModelData.Type.NONE;
    protected GameonModel		mModel;
    protected GameonModelRef   mModelRef;
    protected GameonModelRef   mModelRefOld = new GameonModelRef(null);
    protected int 	mOwner = 0;
    protected int	mOwnerMax = 0;
    protected GameonApp mApp;
	
	public LayoutItem(GameonApp app)
	{
		mApp = app;
	}
	
    public boolean remove() {
        if (mModelRef != null) {
        	mModelRef.remove();
        }
        return true;

    }


    public void setRotation(float x,float y, float z) 
    {
    	mModelRef.setRotate( x, y, z);
    }
    
    void addRotation(float x, float y, float z) 
    {
        mModelRef.addRotation(x, y ,z);
    }
    
	public void setPosition(GameonWorld.Display loc, float x, float y, float z,  
			float w, float h, boolean doeffect) {

		
		boolean copyref = false;
		if (mModelRef == null) 
		{
			mModelRef = new GameonModelRef(mModel);
			mModelRef.mLoc = loc;
			copyref = true;
		} else {
        	mModelRefOld.copy( mModelRef);
        	mModelRefOld.copyMat( mModelRef);
		}
		
	    float height = 1.0f;//
		mModelRef.setPosition(x, y , z+0.01f);
		mModelRef.setScale(w, h , height);
		mModelRef.setRotate( 0, 0, 0);
		mModelRef.apply();
		
		if (copyref) {
			mModelRefOld.copy( mModelRef);
			mModelRefOld.copyMat( mModelRef);
		}		

		if (mOwnerMax > 0) {
			mModelRef.setOwner(mOwner, mOwnerMax);
		}


	}

	

	public void clearAnim() {
		mModelRef.clear();
	}	


	void setRand(float x, float y, float z, float rx, float ry, float rz)
	{
		
		if (x > 0) {
			float add = mApp.random().nextFloat() * x - x/2;
			//Log.d("model", "add x " + x + " " + add);
			mModelRef.mPosition[0] +=add ;
		}
		if (y > 0) {
			float add = mApp.random().nextFloat() * y - y/2;
			//Log.d("model", "add y " + y + " " + add);
			mModelRef.mPosition[1] += add;
		}
		if (z > 0) {
			float add = mApp.random().nextFloat() * z - z/2;
			//Log.d("model", "add z " + z + " " + add);
			mModelRef.mPosition[2] += add;
		}		
		if (rx > 0) {
			float add = mApp.random().nextFloat() * rx - rx/2;
			//Log.d("model", "add rx " + rx + " " + add);
			mModelRef.mRotation[0] += add;
		}		
		if (ry > 0) {
			float add = mApp.random().nextFloat() * ry - ry/2;
			//Log.d("model", "add ry " + rz + " " + add);
			mModelRef.mRotation[1] += add;
		}		
		if (rz > 0) {
			float add = mApp.random().nextFloat() * rz - rz/2;
			//Log.d("model", "add rz " + rz  + " " + add);
			mModelRef.mRotation[2] += add;
		}				
	}
	
    public void setRotation2(float x,float y, float z) 
    {
		if (mModelRef == null) 
		{
			return;
		}
    	mModelRefOld.copy( mModelRef);			
    	mModelRef.setRotate( x, y, z);
		mModelRef.set();
    	
    }
    

    
	public void setPosition2(float x, float y, float z) {

		if (mModelRef == null) 
		{
			return;
		}
    	mModelRefOld.copy( mModelRef);			
		mModelRef.setPosition(x, y , z );
		mModelRef.set();

	}

	
	public void setParentLoc(LayoutArea area) {
		if (mModelRef != null)
		{
			mModelRef.setAreaPosition(area.mLocation);
			mModelRef.setAreaRotate(area.mRotation);
			mModelRef.mulScale(area.mBounds);
			mModelRef.set();
		}
		
	}
	
}
