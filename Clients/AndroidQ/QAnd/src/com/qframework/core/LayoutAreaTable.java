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


public class LayoutAreaTable extends LayoutArea {

	
	enum SubType
	{
		NONE,
		SGRID,
		CARDTABLE,
		LIST
	}

	
	SubType mSubType = SubType.NONE;
	int	mTableWidth;
	int	mTableHeight;
	int mTitleHeight = 0;
	
	
	LayoutAreaTable(String subtype, GameonApp app) 
	{
    	super(app);
		if (subtype.equals("sgrid"))
		{
			mSubType = SubType.SGRID;
		}else
		if (subtype.equals("cardt"))
		{
			mSubType = SubType.CARDTABLE;
		}else
		if (subtype.equals("list"))
		{
			mSubType = SubType.LIST;
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

	    int x = 0,y = 0;
	    float width = mBounds[0];
	    float height = mBounds[1];
	    float mx = width / 20;
	    float my = height / 20;
	    float height2 = 1.0f - my;
	    float width2 = 1.0f - mx;
	    
	    int fieldind = 0;
	    int fieldc = 0;
        float divx = getDivX(1, width);
        float divy = getDivY(mSizeH, height);
        float divx2 = getDivX(1, width2);
        float divy2 = getDivY(mSizeH, height2);	    
	    y = mSizeH-1;
	    for (int a=mSizeH-1; a >=0 ; a--)
	    {
            setField(fieldind);
            LayoutField field = mItemFields.get(fieldind++);
           
	        field.mX = 0 + mx/2 + getX( x, 1 ,  width2) + divx/2 - width / 2;
	        field.mY = 0 + my/2+ getY( y , mSizeH,height2) + divy/2 - height / 2;
	        field.mW = divx2 * field.mGridSzX;
	        field.mH = divy2 * field.mGridSzY ;
            field.mRef.setPosition(field.mX,field.mY,field.mZ);
            field.mRef.setScale(field.mW,field.mH,1);	        
    	    field.mMarginX = field.mW /10;
    	    field.mMarginY = field.mH /5;
	        
	        field.mZ = 0;
	        fieldc++;
	        x++;
	        if (x >= 1)
	        {
	            x=0;
	            y--;
	        }
	    }
	    
	}
	
}

