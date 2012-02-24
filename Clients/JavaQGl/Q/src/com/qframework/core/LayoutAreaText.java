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
import java.util.Vector;



public class LayoutAreaText extends LayoutArea {

	enum SubType
	{
		MLINE,
		MLINEW,
		LABEL,
		BUTTON,
		NONE
	}
	
	SubType mSubType = SubType.NONE;
	float mModifier = 0;
	
	LayoutAreaText(String subtype, GameonApp app) 
	{
    	super(app);
    	
        int val = subtype.charAt( subtype.length() -1 );
        if (val >= '0' && val <= '9')
        {
        	mModifier = (val-'0')*1.0f+1.0f;
        }
        
		if (subtype.startsWith("mline"))
		{
			mSubType = SubType.MLINE;
		}else if (subtype.startsWith("mlinew"))
		{
			mSubType = SubType.MLINEW;
		}else if (subtype.startsWith("label"))
		{
			mSubType = SubType.LABEL;
		}else if (subtype.startsWith("button"))
		{
			mSubType = SubType.BUTTON;
		}
		mType = LayoutArea.Type.TEXT;
	}		


	String  getTextOnLine(int y)
	{
		if (mText == null)
			return "";
	    int from = y * mSizeW;
	    int to = (y+1) * mSizeW;
	    if (from >= mText.length() )
	    {
	        return "";
	    }
	    if (to >= mText.length() )
	    {
	        to = mText.length();
	    }

	    String txt = mText.substring(from,to);
	    return txt;
	}

	String getTextW(int max, Vector<String> text)
	{
		String retstr = new String();
		int currlen = 0;
		while (text.size()> 0)
		{
			String newstr = text.elementAt(0);
			int len2 = currlen + newstr.length() + 1;
			if (len2 > max)
			{
				return retstr;
			}
			retstr += " ";
			retstr += newstr;
			currlen = retstr.length();
			text.remove(0);
		}
		
		return retstr;
	}
	
	void initMLineW()
	{
		if (mText == null)return;
		
	    float width = mBounds[0];
	    float height = mBounds[1];
	    int fieldcnt = 0;
	    StringTokenizer tok =  new StringTokenizer(mText, " ");
	    Vector<String> text = new Vector<String>();
	    while (tok.hasMoreTokens())
	    {
	    	text.add(tok.nextToken());
	    }
	    float divy = height / mSize;
	    float divy2 = 1.0f / mSize;
	    
	    for (int a=mSize-1; a>=0 ; a--)
	    {
	        setField(fieldcnt);
	        LayoutField field = mItemFields.get(fieldcnt);
	        field.mX = 0;
	        field.mY = 0  - height/2 + a* divy+ divy/2;
	        field.mZ = 0;
	        field.mW = 1 - 1 / 20;;
	        field.mH = divy2  - divy2/20;
            field.mRef.setPosition(field.mX,field.mY,field.mZ);
            field.mRef.setScale(field.mW,field.mH,1);       
	        field.setText( getTextW(mSizeW,text ) , mSizeW);
	        fieldcnt++;
	        
	    }
	    
	}

	
	void initMLine()
	{
	    float width = mBounds[0];
	    float height = mBounds[1];
	    int fieldcnt = 0;
	    float divy = height / mSize;
	    float divy2 = 1.0f / mSize;
	    for (int a=mSize-1; a>=0 ; a--)
	    {
	        setField(fieldcnt);
	        LayoutField field = mItemFields.get(fieldcnt);
	        field.mX = 0;
	        field.mY = 0  - height/2 + a* divy+ divy/2;
	        field.mZ = 0;
	        field.mW = 1 - 1 / 20;
	        field.mH = divy2  - divy2/20;
            field.mRef.setPosition(field.mX,field.mY,field.mZ);
            field.mRef.setScale(field.mW,field.mH,1);	        
	        field.setText( getTextOnLine(fieldcnt) , mSizeW);
	        fieldcnt++;
	        
	    }
	    
	}

	

	public void initLabel() 
	{
        setField(0);
        LayoutField field = mItemFields.get(0);


		//field.mColorFore = mColorForeground;
        //        field.mColorFore2 = mColorForeground2;
		
        float width = 1;
        float height = 1;
        
        field.mH = height;
        field.mW = width;
        field.mX = 0;
        field.mY = 0;
		field.mZ = 0;
		field.setText(mText, mSize);
	}

	void initButton()
	{
        setField(0);
	    float width = mBounds[0];
	    float height = mBounds[1];
        
	    float ratio = mBounds[0] / mBounds[1];
	    
	    float bw = 1.0f - (11.0f-mModifier) / 10.0f;
	    float w = 1.0f - bw;
	    
	    float x = width*(0.5f-w/2); 
	    float x1 = width *(-0.5f + 1/(2*ratio));
	    
	    if (mModifier == 0)
	    {
	    	w = 0.8f;
	    	x = 0;//0.1f * width;
	    	bw  = 0.1f;
	    	x1 = -width/2.1f + 1/ratio;
	    }
	    
        LayoutField field = mItemFields.get(0);
	    field.mH = 1.0f-mModifier/10.0f;
	    field.mW = w;
	    field.mX = x;
	    field.mY = 0;
	    field.mZ = 0;
        field.mRef.setPosition(field.mX,field.mY,field.mZ);
        field.mRef.setScale(field.mW,field.mH,1);
		field.setText(mText, mSize);
		
		setField(1);
		field = mItemFields.get(1);
	    field.mH = 1;
	    field.mW = 1/ratio;
	    field.mX = x1;
	    field.mY = 0;
	    field.mZ = 0;
	    field.updateLocation();
        field.mRef.setPosition(field.mX,field.mY,field.mZ);
        field.mRef.setScale(field.mW,field.mH,1);	    
	
	}

	
    public void initLayout() {
        super.initLayout();
        mSizeText = mSize;
        if (mSubType == SubType.LABEL) {
            initLabel();
        } else if (mSubType == SubType.MLINE) {
            initMLine();
        }  else if (mSubType == SubType.MLINEW) {
            initMLineW();
        } else if (mSubType == SubType.BUTTON) {
            initButton();
        } 

    }	
    
	public void setText(String strData) 
	{
		if (strData == null)
			return;
		
		super.setText(strData);
	    if (strData.length() == 0 && mItemFields.size() > 0)
	    {
	    	for (int a=0; a< mItemFields.size(); a++)
	    	{
		        LayoutField f = mItemFields.get(a);
		        f.setText("", 0);        
	    	}
	        return;
	    }
	    
		if (strData.length() > 0 && mItemFields.size() > 0)
		{
	        if (mSubType == SubType.LABEL || mSubType == SubType.BUTTON)
	        {
	        	mItemFields.get(0).setText(strData , mSize);
	        } else if (mSubType == SubType.MLINE){
	            int fc = 0;
	            for (int a=mSize-1; a>=0 ; a--)
	            {
	                LayoutField field = mItemFields.get(fc);
	                field.setText( getTextOnLine(fc), mSizeW);
	                fc++;
	            }
	            
	        } else if (mSubType == SubType.MLINEW){
	            int fc = 0;
	            StringTokenizer tok =  new StringTokenizer(mText, " ");
	    	    Vector<String> text = new Vector<String>();
	    	    while (tok.hasMoreTokens())
	    	    {
	    	    	text.add(tok.nextToken());
	    	    }	    	    
	            for (int a=mSize-1; a>=0 ; a--)
	            {
	                LayoutField field = mItemFields.get(fc);
	                field.setText( getTextW(mSizeW,text ) , mSizeW);
	                fc++;
	            }
	            
	        }		
			
		}
	}
}
