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

#import "LayoutAreaCards.h"
#import "LayoutField.h"
#import "GameonModelRef.h"

@implementation LayoutAreaCards

-(id) initWithSubtype:(NSString*)subtype  app:(GameonApp*)app
{
    self = [super initWithSubtype:subtype app:app];
	int val = [subtype characterAtIndex:[subtype length] -1 ];

	mRandX = 0;
	mRandY = 0;
	mRandZ = 0;
	
	mThickness = 0.0005;
	if (val >= '0' && val <= '9')
	{
		mModifier = (val-'0')*1.0f+1.0f;
		mRandX = mModifier * 0.01f;
		mRandY = mModifier * 0.01f;
		mRandZ = mModifier * 0.01f;
	}
	
    if (self)
    {
        mSubType = LACST_NONE;
        
        if ([subtype hasPrefix:@"deck"])
        {
            mSubType = LACST_DECK;            
        }if ([subtype hasPrefix:@"deckback"])
        {
            mSubType = LACST_DECKBACK;            
        }else if ([subtype hasPrefix:@"hand"])
        {
            mSubType = LACST_HAND;            
        }else if ([subtype hasPrefix:@"inhand"])
        {
            mSubType = LACST_INHAND;            
        }else if ([subtype hasPrefix:@"cards"])
        {
            mSubType = LACST_CARDS;            
        }
        mType = LAT_CARDS;
        
    }
    return self;
}

-(void) dealloc 
{
    [super dealloc];
}

-(void) initDeck:(bool)turnback
{
    int fieldc = 0;
    int x = 0,y = 0;    	
    //float width = mBounds[0];
    //float height = mBounds[1];
    int fieldind = 0;        
    LayoutField* field= nil;
    //float rotzadd = 0;
    
    for (int a=0; a< mSize ; a++)
    {
        [self setField:a];

        field = [mItemFields objectAtIndex:fieldind++];
        x = field.mGridx;
        y = field.mGridy;
        field.mX = 0;
        field.mY = 0;
        field.mW = 1;
        field.mH = 1;
        field.mZ = a * mThickness + mThickness;
        field.mRandX = mRandX;
        field.mRandY = mRandY;
        field.mRandRotZ = mRandZ * 360;
        if (turnback)
        {
            field.mItemRotY = 180;
        }
        fieldc++;
    }

	if (mLayout == LAL_WEST_EAST)
	{
		mRotation[2] = 90;
	}else if(mLayout == LAL_EAST_WEST)
	{
		mRotation[2] = 270;
	}else if(mLayout == LAL_NORTH_SOUTH)
	{
		mRotation[2] = 0;
	}else if(mLayout == LAL_SOUTH_NORTH)
	{
		mRotation[2] = 180;
	}	
    

}

-(void) initHand
{
    int fieldc = 0;
    // get field Width / height
    
    float width = mBounds[0];
    float divx = width - width / 2.2;
//    float height = mBounds[1];
    int fieldind = 0;
	float zadd = mThickness;
	
    for (int a=0; a< mSize ; a++)
    {
        [self setField:a];
        LayoutField* field = [mItemFields objectAtIndex:fieldind++];
		field.mX = a * divx + divx/2 - width/2 + mRandX;
		field.mY = 0 + mRandY;
		field.mW = 1 - 1 / 2.2f;
		field.mH = 1;
		field.mZ = 0 + a * zadd;
		if (mRandZ > 0)
		{
			field.mItemRotZ = (mRandZ-0.05f) * 360;
		}
		[field.mRef setPosition:field.mX y:0 z:field.mZ];
		[field.mRef setScale:divx y:1 z:1];

        fieldc++;
        
    }
}

-(void) initInHand
{
    int fieldc = 0;

    float width = mBounds[0];
    float divx = width / (float)mSize;
    float divx2 = width / (float)mSizeW;
    
//    float height = mBounds[1];
    int fieldind = 0;
    for (int a=0; a< mSize ; a++)
    {
        [self setField:a];
        LayoutField* field = [mItemFields objectAtIndex:fieldind++];        
		field.mX = a * divx + divx/2 - width/2;
		field.mW =  1 / (float)mSizeW;
		field.mH = 1;
		field.mZ = mThickness + a * mThickness;//cosy * 1/3;
		fieldc++;
		field.mRandRotZ = mRandZ * 360;
		[field.mRef setPosition:field.mX y:0 z:field.mZ];
		[field.mRef setScale:divx2 y:1 z:1];
        
    }
	
	if (mLayout == LAL_WEST_EAST)
	{
		mRotation[0] = 45;
	}else if(mLayout == LAL_EAST_WEST)
	{
		mRotation[0] = 45;
		mRotation[2] = 180;
	}else if(mLayout == LAL_NORTH_SOUTH)
	{
		mRotation[0] = 90;
		mRotation[1] = 90;
	}else if(mLayout == LAL_SOUTH_NORTH)
	{
		mRotation[0] = 90;
		mRotation[1] = 270;
	}	

	
}


-(void) initCards
{
    int fieldc = 0;
    
    float width = mBounds[0];
    float divx = width / (float)mSize;
    float divx2 = 1 / (float)mSizeW;
    //float height = mBounds[1];
    int fieldind = 0;
    for (int a=0; a< mSize ; a++)
    {
        [self setField:a];
        LayoutField* field = [mItemFields objectAtIndex:fieldind++];        
		field.mX = a * divx + divx/2 - width/2;
		field.mW = 1 / (float)mSizeW;
		field.mH = 1;
		field.mZ = mThickness + a * mThickness;
		field.mY = 0;           
		if (mRandZ > 0)
		{
			field.mItemRotZ = (mRandZ-0.05f) * 360;
		}
		fieldc++;
		[field.mRef setPosition:field.mX y:0 z:field.mZ];
		[field.mRef setScale:divx2 y:1 z:1];
        
        fieldc++;
        
    }
	
	if (mLayout == LAL_WEST_EAST)
	{
		mRotation[2] = 0;
	}else if(mLayout == LAL_EAST_WEST)
	{
		mRotation[2] = 180;
	}else if(mLayout == LAL_NORTH_SOUTH)
	{
		mRotation[2] = 90;
	}else if(mLayout == LAL_SOUTH_NORTH)
	{
		mRotation[2] = 270;
	}	
	

}

-(void) initLayout
{
    [super initLayout];
    
    if (mSubType == LACST_DECK)
    {
        [self initDeck:false];
    }else if (mSubType == LACST_DECKBACK)
    {
        [self initDeck:true];
    } 	else if (mSubType == LACST_HAND)
    {
        [self initHand];
    } 	else if (mSubType == LACST_INHAND)
    {
        [self initInHand];
    } 	else if (mSubType == LACST_CARDS)
    {
        [self initCards];
    } 		
	
}


@end
