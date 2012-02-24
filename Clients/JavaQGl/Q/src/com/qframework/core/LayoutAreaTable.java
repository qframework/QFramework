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

import java.util.StringTokenizer;


public class LayoutAreaTable extends LayoutArea {

	
	enum SubType
	{
		NONE,
		SGRID,
		CARDTABLE,
		LIST,
		HLIST
	}

	
	SubType mSubType = SubType.NONE;
	int	mTableWidth;
	int	mTableHeight;
	int mTitleHeight = 0;
	float mModifier = 0;
	float mListScaleMaxW;
	float mListScaleMinW;
	float mListScaleMaxH;
	float mListScaleMinH;
	
	float[] mModifiersZ;
	float[] mModifiersW;
	float[] mModifiersH;
	float[] mFieldsData;

	
	LayoutAreaTable(String subtype, GameonApp app) 
	{
    	super(app);
    	
        int val = subtype.charAt( subtype.length() -1 );
        if (val >= '0' && val <= '9')
        {
        	mModifier = (val-'0');
        }
    	
		if (subtype.equals("sgrid"))
		{
			mSubType = SubType.SGRID;
		}else
		if (subtype.equals("cardt"))
		{
			mSubType = SubType.CARDTABLE;
		}else
		if (subtype.startsWith("list"))
		{
			mSubType = SubType.LIST;
		}else
		if (subtype.startsWith("hlist"))
		{
			mSubType = SubType.HLIST;
		}
		
		mType = LayoutArea.Type.TABLE;
	}
	

	public void initLayout() 
	{
		super.initLayout();
		if (mSubType == SubType.SGRID)
		{
			initSquareGrid();

		} else if (mSubType == SubType.CARDTABLE)
		{

		}else if (mSubType == SubType.LIST)
		{
			initList();
		}else if (mSubType == SubType.HLIST)
		{
			initHList();
		}
	}
	

	private void initSquareGrid() 
	{
            int fieldc = 0;
            // get field Width / height
            int x = 0,y = 0;

            float width = mBounds[0];
            float height = mBounds[1];
            int fieldind = 0;
            
            float divx = getDivX(mSizeW, width);
            float divx2 = 1.0f/mSizeW;
            float divy = getDivY(mSizeH, height);
            float divy2 = 1.0f/mSizeH;
            int xc = 0;
            int yc = 0;
            
            for (int a=0; a< mSize ; a++)
            {
                setField(a);
                LayoutField field = mItemFields.get(fieldind++);
                if (field.mGridx >= 0)
                {
                	x = field.mGridx;
                	y = field.mGridy;
                }else
                {
                	x = xc;
                	y = yc;                	
                }
                xc++;
                if (xc >= mSizeW)
                {
                	xc  =0;
                	yc++;
                }
                
                field.mX = getX(x , mSizeW ,width)  + divx/2 - width / 2;
                field.mY = getY(y , mSizeH ,height)  + divy/2 - height / 2;
                field.mW = divx2 * field.mGridSzX;
                field.mH = divy2 * field.mGridSzY ;
                field.mRef.setPosition(field.mX,field.mY,field.mZ);
                field.mRef.setScale(field.mW,field.mH,1);                
                field.mZ = 0.001f;
                if (field.mFieldType == LayoutField.FieldType.EMPTY2)
                {
                	float w = field.mW;
                	float h = field.mH;
                	w = w * 0.33f;
                	h = h * 0.33f;
                	
                	field.mW -= w;
                	field.mH -= h;
                	field.mX += w/2;
                	field.mY += h/2;
                	
                }
                fieldc++;

            }
	}
	
	void initList()
	{
	    mHasScrollV = true;

	    mListScaleMinH = 1.0f - mModifier/12.0f;
		mListScaleMaxH = 1.0f + mModifier/12.0f;
		mListScaleMinW = 1.0f - mModifier/12.0f;
		mListScaleMaxW = 1.0f;
		
		createDefaultFields();
				
		updateScrollers();
	}


	boolean getScrollCoords(int col , int ind , LayoutField f)
	{
		float div = (float)1/(float)(mSizeW-1);
		float p = (float)ind * div;
		
		float rowsize = (mSize)/ (float)(mSizeH);
		float max = div * rowsize;
		p-= (mScrollers[0]+0.5f) * div * rowsize;
		float pmin = (p-div/2);
		float pmax = (p+div/2);
		
		// temp
		if (pmax < -0.5f ||
			pmin > 0.5f )
		{
			return false;
		}
			
		// calculate X based on row info
		f.mX = 0;
		f.mY = 0;
		f.mW = 1;
		f.mH = 1;
		
		if (mHasScrollV)
		{
			f.mX -= (0.05f*mBounds[0]);
			f.mY -= (p*mBounds[1]);// - div/2;
			f.mZ = 0.0f;
			f.mW *= 0.9f;
			if (pmax > 0.5f)
			{
				f.mH *= div - (pmax - 0.5f);
				f.mY += (pmax - 0.5f)* mBounds[1]/2; 
			}else if (pmin < -0.5f)
			{
				f.mH *= div- (-0.5f - pmin) ;
				f.mY -= (-0.5f - pmin )* mBounds[1]/2;
			}else
			{
				f.mH *= div;
			}
			if (f.mH < 0)
				return false;
			
			f.mX += mFieldsData[col * 4]*mBounds[0];
			f.mY += mFieldsData[col * 4+1]*mBounds[1]*div;
			
		}
		else if (mHasScrollH)
		{
			f.mX += (p*mBounds[0]);// - div/2;
			f.mY -= (0.05f*mBounds[1]);
			f.mZ = 0.0f;
			
			f.mH *= 0.9f;
			if (pmax > 0.5f)
			{
				f.mW *= div - (pmax - 0.5f);
				f.mX -= (pmax - 0.5f)* mBounds[0]/2; 
			}else if (pmin < -0.5f)
			{
				f.mW *= div- (-0.5f - pmin );
				f.mX += (-0.5f - pmin )* mBounds[0]/2;
			}else
			{
				f.mW *= div;
			}		
			if (f.mW < 0)
				return false;
			f.mX += mFieldsData[col * 4]*mBounds[0]*div;
			f.mY += mFieldsData[col * 4+1]*mBounds[1];
			
		}

		f.mW *= mFieldsData[col * 4+2];
		f.mH *= mFieldsData[col * 4+3];
		
		return true;
	}

	

	
	void createCustomModel()
	{
		// scroller
		if (mSubType == SubType.LIST || mSubType == SubType.HLIST)
		{
			if (mSize <= mSizeW)
			{
				return;
			}
			mModel = new GameonModel("scroll"+ this.mID , mApp);
			GameonModel model = mModel;
	        GLColor fcolor = null;
	        if (mColorForeground != null)
	        {
	            fcolor = mColorForeground;
	        }else {
	            fcolor = mApp.colors().white;//getPlayerColor(owner);
	        }
	        
	        float div = (float)mSizeH / mSize;
		    GameonModelRef ref = new GameonModelRef(null);
		    ref.mLoc = mDisplay;
			float scrollpos = mScrollers[0] / (mScrollers[2]-mScrollers[1]+div);		    
	        if (mSubType == SubType.LIST)
	        {
	        	model.createPlane( 0.40f, -div/2, 0.01f ,  0.5f,div/2 , 0.01f, fcolor);
			    ref.setPosition(0.0f, - scrollpos * mBounds[1], 0.001f);
	        }else
	        {
		        model.createPlane(  -div/2, 0.40f,0.01f ,  div/2 , 0.5f, 0.01f, fcolor);
			    ref.setPosition( - scrollpos * mBounds[0], 0.0f,0.001f);
	        	
	        }
	        
		    model.addref(ref);    

			model.mEnabled = true;
		    model.mIsModel = false;
		    if (mColorForeground2 > 0)
		    {
		        mModel.setTexture(mColorForeground2);
		    }
		    mApp.world().add(model);
		    
		    
	        if (mActiveItems == 0)
	        {
	        	model.setState(LayoutArea.State.HIDDEN);
	        	model.setActive(false);
	        }
		}
	}
	
	private void createDefaultFields()
	{
		float div = (float)mSizeW / (float)mSize;
		mScrollers[1] = -0.5f + div/3;
		mScrollers[2] = 0.5f - div/3;
		if (mScrollers[0] < mScrollers[1])
		{
			mScrollers[0] = mScrollers[1];
		}else if (mScrollers[0] > mScrollers[2])
		{
			mScrollers[0] = mScrollers[2];
		}
		
		mModifiersW = new float[mSizeW];
		mModifiersH = new float[mSizeW];
		mModifiersZ = new float[mSizeW];
		
		float divmodW = (mListScaleMaxW - mListScaleMinW)/(float)mSizeW;
		float divmodH = (mListScaleMaxH - mListScaleMinH)/(float)mSizeW;
		divmodW *= 2;
		divmodH *= 2;
		int count = 0;
		for (int a=0; a< mSizeW; a++)
		{
			mModifiersH[a] = mListScaleMinH + count * divmodH;
			mModifiersW[a] = mListScaleMinW + count * divmodW;
			mModifiersZ[a] = count * 0.01f;
			if (a < mSizeW/2.0f - 1.0f)
			{
				count++;
			}else
			{
				count--;
			}
		}
		
		if (mFieldsData == null)
		{
			mFieldsData = new float[mSizeH * 4];
			div = 1 / (float)(mSizeH);
			if (this.mSubType == SubType.LIST)
			{
				for (int a=0; a< mSizeH; a++)
				{
					// default data
					mFieldsData[a*4] = (-0.5f + (float)(a) * div + div/2)*mBounds[0];
					mFieldsData[a*4+1] = 0.0f;
					mFieldsData[a*4+2] = div;
					mFieldsData[a*4+3] = 1.0f;
				}
			}
			else
			{
				for (int a=0; a< mSizeH; a++)
				{
					// default data
					mFieldsData[a*4] = 0.0f;
					mFieldsData[a*4+1] = (-0.5f + (float)(a) * div + div/2)*mBounds[1] ;
					mFieldsData[a*4+2] = 1.0f;
					mFieldsData[a*4+3] = div;
				}
			}
		}
	}
	
	public void createFields(String data)
	{
		if (mSubType == SubType.LIST || mSubType == SubType.HLIST)
		{
			// parse info for coordinates of each field in rows
			createDefaultFields();
			float []buff = new float[4];
			// parse what we have
			int count =0 ;
	        StringTokenizer tok = new StringTokenizer(data, ";");
	        while (tok.hasMoreTokens() && count < mSizeW)
	        {
	        	int val = ServerkoParse.parseFloatArray(buff, tok.nextToken());
	        	mFieldsData[count*4] = buff[0];
	        	mFieldsData[count*4+1] = buff[1];
	        	mFieldsData[count*4+2] = buff[2];
	        	mFieldsData[count*4+3] = buff[3];
	        	count++;
	        }
		}
		else
		{
			super.createFields(data);
		}
	}
	
	void initHList()
	{
	    mHasScrollH = true;
	    
		mListScaleMinW = 1.0f - mModifier/12.0f;
		mListScaleMaxW = 1.0f + mModifier/12.0f;
		mListScaleMinH = 1.0f - mModifier/12.0f;
		mListScaleMaxH = 1.0f;

		createDefaultFields();
				
		updateScrollers();
	    
	}

	void updateScrollers()
	{
		int count = 0;
		int x = 0,y = 0;
		for (int a=0; a < mSize ; a++)
	    {
			setField(a);
            LayoutField field = mItemFields.get(a);
            if (getScrollCoords(x,y , field))
            {
            	//field.mRef.clear();
            	field.mH *= mModifiersH[count];
            	field.mW *= mModifiersW[count];
            	field.mZ += mModifiersZ[count];
            	if (x == mSizeH-1 && count < mModifiersH.length-1)
            	{
                	count++;
            	}
            	field.mActive = true;
                field.mRef.setPosition(field.mX,field.mY,field.mZ);
                field.mRef.setScale(field.mW,field.mH,1);
                field.mRef.set();
                field.updateLocation();
                field.setState(LayoutArea.State.VISIBLE);
            }else
            {
            	field.mH = 1.0f;
            	field.mW = 1.0f;
            	field.setState(LayoutArea.State.HIDDEN);
            	field.mActive = false;
            }
            
            
            x++;
            if (x >= mSizeH)
            {
            	x = 0;
            	y++;
            }
            
	    }
		if (mModel != null)
		{
			mModel.setActive(true);
			mModel.setState(LayoutArea.State.VISIBLE);
			GameonModelRef ref = mModel.ref(0);
			float div = (float)mSizeH / mSize;
			float scrollpos = mScrollers[0] / (mScrollers[2]-mScrollers[1]+div);
			if (mHasScrollV)
			{
				ref.setPosition(0.0f, -scrollpos*mBounds[1], 0.001f);
			}else
			{
				ref.setPosition(scrollpos*mBounds[0], 0.0f, 0.001f);
			}
			ref.set();
		}
		
	}

	public void setText(String strData) 
	{
		super.setText(strData);

		if (this.mSubType == SubType.LIST || this.mSubType == SubType.HLIST)
		{
			this.pushFrontItem(strData);
		}
	}
}

