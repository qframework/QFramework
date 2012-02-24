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

import com.qframework.core.LayoutArea.State;

public class LayoutField {

	protected int mID;
	protected float mX;
    protected float mY;
    protected float mZ;
    protected float mW;
    protected float mH;
    protected float mRandX;
    protected float mRandY;
    protected float mRandRotZ;
    protected float mItemRotX;
    protected float mItemRotY;
    protected float mItemRotZ;      
    protected LayoutItem mItem;
    protected LayoutArea mParent;
    protected TextItem mText;
    protected int mGridx = -1;
    protected int mGridy = -1;
    protected int mGridSzX = 1;
    protected int mGridSzY = 1;
    protected GameonApp	mApp;
    protected GameonModelRef	mRef;
    protected FieldType mFieldType = FieldType.NONE;
    protected int mOwner = 0;
    protected LayoutArea.State mState = LayoutArea.State.VISIBLE;
    protected boolean mActive = true;
    public enum FieldType {

        NONE,
        PLAYER_START,
        PLAYER_END,
        PLAY_FIELD,
        NORM_FIELD,
        EMPTY, 
        EMPTY2
    }

    public LayoutField(LayoutArea parent) 
    {
    	mApp = parent.mApp;
    	mParent = parent;
    	mRef = new GameonModelRef(null);
    }

    public void getLoc(GameonModelRef loc) {
    	loc.setPosition( mX , mY , mZ);
    }
    public void setItem(String itemID, boolean doeffect, boolean showback) {
        // create new one
        if (itemID.charAt(0) == '[') {
            itemID = itemID.substring(3);
        }
        // dereference old one
        if (mItem != null) {
        	mItem.remove();
        	mItem = null;
        }
        
        mItem = mApp.items().createItem(itemID , null);
        if (mItem != null)
		{
            setItem2(mItem , doeffect , showback);
		}
        
        
    }

    public void removeFigure() {
    	if (mItem != null)
        {
        	mItem.remove();
            mItem = null;
        }
    }

    public void clear() {
    	removeFigure();
    	mOwner = 0;
        if (mText != null)
        {
            if (mParent.mDisplay == GameonWorld.Display.HUD)
            {
                TextRender r = mApp.world().textshud();
                r.remove(mText);
            }
            else
            {
                TextRender r = mApp.world().texts();
                r.remove(mText);
            }                
            mText = null;
        }    	
    }

	public void setItem2(LayoutItem item, boolean doeffect,  boolean showback) {
        if (mItem != null) {
        	mItem.remove();
        	mItem = null;
        }
        
		mItem = item;
        if (mItem != null){

        	float w = mW;
        	float h = mH;        	
			if (w == 0 || h == 0)
				return;
			else
			{
		        mItem.setPosition(mParent.mDisplay, mX, mY,mZ+0.002f ,  w , h , doeffect);
		        mItem.setRand(mRandX,mRandY, 0,0,0, mRandRotZ);
		        mItem.setParentLoc(mParent);
				mItem.addRotation(mItemRotX,mItemRotY , mItemRotZ);
				mItem.mModelRef.set();
				setState(mState);
			}

        }
		
	}

	public void setText(String data, int num) {
    	float w = mW;
    	float h = mH;
    	float x = mX;
    	float y = mY;
    	if (data == null || data.length() == 0)
    	{
    		if (mText != null)
    		{
    			mApp.world().textshud().remove(mText);
    			mApp.world().texts().remove(mText);
    			mText = null;
    		}
    		return;
    	}
    	//System.out.println( "settext " + data + " " + mParent.mLocation.toString() + " " + mParent.mID);
		if (mText != null) {
			mText.updateText(data , mParent.mDisplay);
			mText.setRef();
		}else {

        	
        	if (mParent.mDisplay == GameonWorld.Display.HUD)
        	{
        	if (num > 0) {
	        		mText = new TextItem(mApp,x,y,w,h,mZ+0.002f, data, 
	        				(float)num, mOwner , mParent.mDisplay, mParent.mLayout,
	        				mParent.mColors);
        	}else{
	        		mText = new TextItem(mApp,x,y,w,h,mZ+0.002f, data, 
	        				mOwner , mParent.mDisplay , mParent.mLayout,mParent.mColors);
        	}
        		mApp.world().textshud().add(mText, mState == LayoutArea.State.VISIBLE&& mParent.mPageVisible);
        		mText.setParent(mApp.world().textshud());
        	}else
        	{
	        	if (num > 0) {
	        		mText = new TextItem(mApp,x,y,w,h,mZ+0.002f, data, (float)num, 
	        				mOwner , mParent.mDisplay , mParent.mLayout,mParent.mColors);
	        	}else{
	        		mText = new TextItem(mApp,x,y,w,h,mZ+0.002f, data, 
	        				mOwner , mParent.mDisplay , mParent.mLayout,mParent.mColors);
	        	}
	        	mApp.world().texts().add(mText , mState == LayoutArea.State.VISIBLE&& mParent.mPageVisible);
        		mText.setParent(mApp.world().texts());
        	}
    	
		}
		GameonModelRef ref = mText.ref();
		ref.setAreaPosition(mParent.mLocation);
        ref.setAreaRotate(mParent.mRotation);
        ref.mulScale(mParent.mBounds);
        ref.set();    		
	}

	public void setState(State state) {
		if (!mActive)
			return;
	    if (!mParent.mPageVisible)
	        state = State.HIDDEN;
	    mState = state;
		if (state == State.VISIBLE)
		{
			if (mText != null) {
				mText.setVisible(true);
			}
			if (mItem != null) {
				mItem.mModelRef.setVisible(true);
			}
		}else
		{
			if (mText != null) {
				mText.setVisible(false);
			}			
			if (mItem != null) {
				mItem.mModelRef.setVisible(false);
			}			
		}
		
	}

	void setOwner(int owner)
	{
	    mOwner = owner;
	    if (mText != null) {
	        mText.setOffset(owner);
	    }
	}


	void invertItem()
	{
	    if (mOwner == 0)
	    {
	        mOwner = 4;
	    }else {
	        mOwner = 0;
	    }
	    if (mText != null)
	    {
	        mText.setOffset(mOwner);
	    }
	    
	}


	void updateLocation()
	{
        float w = mW;
        float h = mH;
        
        if (w == 0 || h == 0)
            return;
		
	    if (mItem != null){
            mItem.setPosition(mParent.mDisplay,mX,mY,(mZ),w ,h ,false);
	        mItem.setRand(mRandX,mRandY, 0,0,0, mRandRotZ);
	        mItem.setParentLoc(mParent);
			mItem.addRotation(mItemRotX,mItemRotY , mItemRotZ);
            mItem.mModelRef.set();
	    }
	    
	    if (this.mText != null)
	    {
	    	mText.setPosition(mX,mY,mZ+0.002f,w ,h);
	    	mText.setParentLoc(mParent);
	    	mText.ref().set();
	    }
	    
	    
	}

	public void createAnimTrans(String movetype, int delay, boolean away) {
		if (mText != null && mText.mModel != null)
		{
			mText.mModel.createAnimTrans(movetype , delay, away, 0);
		}
		if (mItem != null)
		{
			int index = mItem.mModel.findRef( mItem.mModelRef);
			mItem.mModel.createAnimTrans(movetype , delay, away, index);
		}
		
	}
	public void setScale()
	{
		if (mItem != null && mItem.mModelRef != null)
		{
			mItem.mModelRef.setScale(mW,mH,1);
		}
		if (mText != null)
		{
			mText.setRef();
		}
		if (mRef != null)
		{
			mRef.setScale(mW,mH,1);
		}
	}

	public void createAnim(String type, String delay, String data) {
		if (mText != null && mText.mModel != null)
		{
			mText.mModel.createAnim(type , 0 , delay, data);
		}
		if (mItem != null)
		{
			int index = mItem.mModel.findRef( mItem.mModelRef);
			mItem.mModel.createAnim(type , index ,delay, data);
		}		
	}
}
