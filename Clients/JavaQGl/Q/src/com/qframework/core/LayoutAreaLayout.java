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



public class LayoutAreaLayout extends LayoutArea {

	enum SubType
	{
		NONE,
		GRID,
		BACK
	}

	
	SubType mSubType = SubType.NONE;
	public LayoutAreaLayout(String subtype, GameonApp app) 
	{
    	super(app);
		if (subtype.equals("grid"))
		{
			mSubType = SubType.GRID;
		}else
		if (subtype.equals("back"))
		{
			mSubType = SubType.BACK;
		}			
		mType = LayoutArea.Type.LAYOUT;
		
	}
	
	public void initLayout() 
	{
		super.initLayout();
		
		if (mSubType == SubType.GRID)
		{
			initGrid();
		} 		
	}
	
	
	private void initGrid() 
	{

		LayoutField field = null;
	    float width = mBounds[0];
	    float height = mBounds[1];
		int x = 0;
		int y = 0;
		int count = 0;
	    float divx = getDivX(mSizeW , width);
	    float divy = getDivY(mSizeH , height);
		
		while ( count < mSize)
		{
            setField(count);
            field = mItemFields.get(count++);

	        field.mX = 0  + getX(x , mSizeW , width) - width /2;
	        field.mY = 0  + getY(y , mSizeH  , height) - height /2;
	        field.mW = divx;
	        field.mH = divy;
            field.mRef.setPosition(field.mX,field.mY,field.mZ);
            field.mRef.setScale(divx,divy,1);	        
            x++;
            if (x >= mSizeW)
            {
                    x = 0; y++;
            }
			
		}
		
	}


}
