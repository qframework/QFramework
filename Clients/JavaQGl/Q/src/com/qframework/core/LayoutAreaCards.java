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

class LayoutAreaCards extends LayoutArea {


    enum SubType {

        NONE,
        DECK,
        DECKBACK,
        HAND,
        INHAND,
        CARDS
    }
    SubType mSubType = SubType.NONE;
    float mModifier = 0;
    float mRandX = 0;
    float mRandY = 0;
    float mRandZ = 0;
    float mThickness = 0.0005f;
    
    public LayoutAreaCards(String subtype, GameonApp app) {
    	super(app);

        int val = subtype.charAt( subtype.length() -1 );
        if (val >= '0' && val <= '9')
        {
        	mModifier = (val-'0')*1.0f+1.0f;
        	mRandX = mModifier * 0.01f;
        	mRandY = mModifier * 0.01f;
        	mRandZ = mModifier * 0.01f;
        }
         
        if (subtype.startsWith("deckback")) {
            mSubType = SubType.DECKBACK;

        } else if (subtype.startsWith("deck")) {
            mSubType = SubType.DECK; 
        } else if (subtype.startsWith("hand")) {
            mSubType = SubType.HAND;
        } else if (subtype.startsWith("inhand")) {
            mSubType = SubType.INHAND;
        }else if (subtype.startsWith("cards")) {
            mSubType = SubType.CARDS;
        }


        mType = LayoutArea.Type.CARDS;
    }

    public void initLayout() {
        super.initLayout();

        if (mSubType == SubType.DECK) {
            initDeck(false);
        } else if (mSubType == SubType.DECKBACK) {
            initDeck(true);
        } else if (mSubType == SubType.HAND) {
            initHand();
        } else if (mSubType == SubType.INHAND) {
            initInHand();
        } else if (mSubType == SubType.CARDS) {
            initCards();
        }

    }

    void initDeck(boolean turnback)
    {
        int fieldc = 0;   	
        float width = mBounds[0];
        float height = mBounds[1];
        int fieldind = 0;        
        LayoutField field= null;
        for (int a=0; a< mSize ; a++)
        {
            setField(a);
            field = (LayoutField)mItemFields.elementAt(fieldind++);

            field.mX = 0;
            field.mY = 0;
            field.mW = 1;
            field.mH = 1;
            field.mZ = mThickness + a * mThickness;
            field.mRandX = mRandX;
            field.mRandY = mRandY;
            field.mRandRotZ = mRandZ * 360;
            if (turnback)
            {
                field.mItemRotY = 180;
            }
            fieldc++;
            
        }
        
        // adjust angle!
        if (this.mLayout == Layout.WEST_EAST)
        {
        	this.mRotation[2] = 90;	
        }else if (this.mLayout == Layout.EAST_WEST)
        {
        	this.mRotation[2] = 270;	
        }else if (this.mLayout == Layout.NORTH_SOUTH)
        {
        	this.mRotation[2] = 0;	
        }else if (this.mLayout == Layout.SOUTH_NORTH)
        {
        	this.mRotation[2] = 180;	
        }   
        
    }

    void initHand()
    {
        int fieldc = 0;
        // get field Width / height
        
        float width = mBounds[0];
        float divx = width - width / 2.2f;
        float height = mBounds[1];
        int fieldind = 0;
        float zadd = mThickness;
        for (int a=0; a< mSize ; a++)
        {
            setField(a);
            LayoutField field = mItemFields.get(fieldind++);
            field.mX = a * divx + divx/2 - width/2 + mRandX;
            field.mY = 0 + mRandY;
            field.mW = 1 - 1 / 2.2f;
            field.mH = 1;
            field.mZ = 0 + a * zadd;
            if (mRandZ > 0)
            {
            	field.mItemRotZ = (mRandZ-0.05f) * 360;
            }
            field.mRef.setPosition(field.mX,0,field.mZ);
            field.mRef.setScale(divx,1,1);
            fieldc++;
            
        }
    }

    void initInHand()
    {
    	int fieldc = 0;
	    float width = mBounds[0];
	    float divx = width / (float)mSize;
	    float divx2 = width / (float)mSizeW;
	    
	    float height = mBounds[1];
        int fieldind = 0;
        for (int a=0; a< mSize ; a++)
        {
            setField(a);
	        LayoutField field = mItemFields.get(fieldind++);        
            field.mX = a * divx + divx/2 - width/2;
            field.mW =  1 / (float)mSizeW;
            field.mH = 1;
            field.mZ = mThickness + a * mThickness;//cosy * 1/3;
            fieldc++;
            field.mRandRotZ = mRandZ * 360;
            field.mRef.setPosition(field.mX,0,field.mZ);
            field.mRef.setScale(divx2,1,1);

        }
        
        // adjust angle!
        if (this.mLayout == Layout.WEST_EAST)
        {
        	this.mRotation[0] = 45;	
        }else if (this.mLayout == Layout.EAST_WEST)
        {
        	this.mRotation[0] = 45;
        	this.mRotation[2] = 180;	
        }else if (this.mLayout == Layout.NORTH_SOUTH)
        {
        	this.mRotation[0] = 90;
        	this.mRotation[1] = 90;	
        }else if (this.mLayout == Layout.SOUTH_NORTH)
        {
        	this.mRotation[0] = 90;
        	this.mRotation[1] = 270;	
        }        	
        
    }


    void initCards()
    {
        int fieldc = 0;
        float width = mBounds[0];
        float divx = width / (float)mSize;
        float divx2 = 1 / (float)mSizeW;
        
        float height = mBounds[1];
        int fieldind = 0;
        float zadd = mThickness;

        for (int a=0; a< mSize ; a++)
        {
	        setField(a);
	        LayoutField field = mItemFields.get(fieldind++);        
            field.mX = a * divx + divx/2 - width/2;
            field.mW = 1 / (float)mSizeW;
            field.mH = 1;
            field.mZ = 0 + zadd + a * mThickness;
            field.mY = 0;           
            if (mRandZ > 0)
            {
            	field.mItemRotZ = (mRandZ-0.05f) * 360;
            }
            fieldc++;
            field.mRef.setPosition(field.mX,0,field.mZ);
            field.mRef.setScale(divx2,1,1);
        }
        
        // adjust angle!
        if (this.mLayout == Layout.WEST_EAST)
        {
        	this.mRotation[2] = 0;	
        }else if (this.mLayout == Layout.EAST_WEST)
        {
        	this.mRotation[2] = 180;	
        }else if (this.mLayout == Layout.NORTH_SOUTH)
        {
        	this.mRotation[2] = 90;	
        }else if (this.mLayout == Layout.SOUTH_NORTH)
        {
        	this.mRotation[2] = 270;	
        }           
    }
}
