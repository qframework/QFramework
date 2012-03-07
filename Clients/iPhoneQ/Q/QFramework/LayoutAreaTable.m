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

#import "LayoutAreaTable.h"
#import "LayoutField.h"
#import "GameonModelRef.h"
#import "ServerkoParse.h"
#import "GameonModel.h"
#import "GameonApp.h"
#import "ColorFactory.h"
#include "stdlib.h"

@implementation LayoutAreaTable

-(id) initWithSubtype:(NSString*)subtype  app:(GameonApp*)app
{
	mModifiersZ = NULL;
	mModifiersW = NULL;
	mModifiersH = NULL;
	mFieldsData = NULL;	
	
    self = [super initWithSubtype:subtype app:app];
    if (self)
    {
	
        mSubType = LATST_NONE;
        int val = [subtype characterAtIndex:[subtype length] -1 ];
        if (val >= '0' && val <= '9')
        {
        	mModifier = (val-'0');
        }
		
        mTableWidth = 0;
        mTableHeight = 0;
        mTitleHeight = 0;

        if ([subtype hasPrefix:@"sgrid"])
        {
            mSubType = LATST_SGRID;
        }else
        if ([subtype hasPrefix:@"cardt"])
        {
            mSubType = LATST_CARDTABLE;
        }else
        if ([subtype hasPrefix:@"list"])
        {
            mSubType = LATST_LIST;
        }else
        if ([subtype hasPrefix:@"hlist"])
        {
            mSubType = LATST_HLIST;
        }
        
        mType = LAT_TABLE;
        
    }
    return self;
}


-(void) initSquareGrid
{
    int fieldc = 0;
    // get field Width / height
    int x = 0,y = 0;
    float width = mBounds[0];
    float height = mBounds[1];
    int fieldind = 0;
    
    float divx = [self getDivX:mSizeW w:width];
	float divx2 = 1.0f/mSizeW;
    float divy = [self getDivY:mSizeH h:height];
    float divy2 = 1.0f/mSizeH;
	int xc = 0;
	int yc = 0;
	
    for (int a=0; a< mSize ; a++)
    {
        [self setField:a];
        LayoutField* field = [mItemFields objectAtIndex:fieldind++];
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
		
        field.mX = [self getX:x max:mSizeW w:width] + divx/2 - width/2;
        field.mY = [self getY:y max:mSizeH h:height] + divy/2 - height/2;
        field.mW = divx2 * field.mGridSzX;
        field.mH = divy2 * field.mGridSzY ;
        field.mZ = 0.001f;
		[field.mRef setPosition:field.mX y:field.mY z:field.mZ];
		[field.mRef setScale:field.mW y:field.mH z:1];                

        if (field.mFieldType == LFFT_PLAYER_EMPTY2)
        {
            //NSLog(@" empty2 %@ %d " , field.mParent.mID , a);
            
            float w = field.mW;
            float h = field.mH;
            w = w * 0.33f;
            h = h * 0.33f;
            
            field.mW -= w;
            field.mH -= h;
            field.mX += w/2;
            field.mH += h/2;
            
        }        
        fieldc++;
        
    }
}
-(void) dealloc 
{
	if(mModifiersZ)
		free(mModifiersZ);
	if(mModifiersW)
		free(mModifiersW);
	if(mModifiersH)
		free(mModifiersH);
	if(mFieldsData)
		free(mFieldsData);

    [super dealloc];
}


-(void) initList
{
	mHasScrollV = true;

	mListScaleMinH = 1.0f - mModifier/12.0f;
	mListScaleMaxH = 1.0f + mModifier/12.0f;
	mListScaleMinW = 1.0f - mModifier/12.0f;
	mListScaleMaxW = 1.0f;
	
	[self createDefaultFields];
			
	[self updateScrollers];    
}

-(void) initLayout
{
    [super initLayout];
    
    if (mSubType == LATST_SGRID)
    {
        [self initSquareGrid];
        
    } else if (mSubType == LATST_LIST)
    {
        // for now we only draw table border
        [self initList];
    }else if (mSubType == LATST_HLIST)
    {
        // for now we only draw table border
        [self initHList];
    }
}

-(bool)getScrollCoords:(int)col ind:(int)ind field:(LayoutField*)f
{
	float div = (float)1/(float)(mSizeW-1);
	float p = (float)ind * div;
	
	float rowsize = (mSize)/ (float)(mSizeH);
	//float max = div * rowsize;
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




-(void)createCustomModel
{
	// scroller
	if (mSubType == LATST_LIST || mSubType == LATST_HLIST)
	{
		if (mSize <= mSizeW)
		{
			return;
		}
		mModel = [[GameonModel alloc] initWithName:@"scroll" app:mApp];
		GameonModel* model = mModel;
		GLColor* fcolor = nil;
		if (mColorForeground != nil)
		{
			fcolor = mColorForeground;
		}else {
			fcolor = mApp.colors.white;//getPlayerColor(owner);
		}
		
		float div = (float)mSizeH / mSize;
		GameonModelRef* ref = [[GameonModelRef alloc] initWithParent:nil];
		ref.mLoc = mDisplay;
		float scrollpos = mScrollers[0] / (mScrollers[2]-mScrollers[1]+div);		    
		if (mSubType == LATST_LIST)
		{
			[model createPlane:0.40f btm:(-div/2) b:0.01f r:0.5f t:div/2  f:0.01f c:fcolor];
			[ref setPosition:0.0f y:(- scrollpos * mBounds[1]) z:0.001f];
		}else
		{
			[model createPlane:-div/2 btm:0.40f b:0.01f r:div/2 t:0.5f f:0.01f c:fcolor];
			[ref setPosition:(- scrollpos * mBounds[0]) y:0.0f z:0.001f];
			
		}
		
		[model addref:ref];   

		model.mEnabled = true;
		model.mIsModel = false;
		if (mColorForeground2 > 0)
		{
			[mModel setTexture:mColorForeground2];
		}
		
		[mApp.world add:model];
		
		
		if (mActiveItems == 0)
		{
			[model setState:LAS_HIDDEN];
			[model setActive:false];
		}
	}
}

-(void)createDefaultFields
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
	
	mModifiersW = (float*)calloc(mSizeW , sizeof(float));
	mModifiersH = (float*)calloc(mSizeW , sizeof(float));
	mModifiersZ = (float*)calloc(mSizeW , sizeof(float));
	
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
	
	if (mFieldsData == nil)
	{
		mFieldsData = (float*)calloc(mSizeH * 4, sizeof(float));
		div = 1 / (float)(mSizeH);
		if (mSubType == LATST_LIST)
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

-(void)createFields:(NSString*)data
{
	if (mSubType == LATST_LIST || mSubType == LATST_HLIST)
	{
		// parse info for coordinates of each field in rows
		[self createDefaultFields];
		float buff[4];
		// parse what we have
		int count =0 ;
		NSArray* tok = [data componentsSeparatedByString:@";"];
		for (count = 0 ; count < [tok count]; count++)
		{
            NSString* data = [tok objectAtIndex:count];
			[ServerkoParse parseFloatArray:buff max:4 forData:data];
			mFieldsData[count*4] = buff[0];
			mFieldsData[count*4+1] = buff[1];
			mFieldsData[count*4+2] = buff[2];
			mFieldsData[count*4+3] = buff[3];
		}
	}
	else
	{
		[super createFields:data];
	}
}

-(void)initHList
{
	mHasScrollH = true;
	
	mListScaleMinW = 1.0f - mModifier/12.0f;
	mListScaleMaxW = 1.0f + mModifier/12.0f;
	mListScaleMinH = 1.0f - mModifier/12.0f;
	mListScaleMaxH = 1.0f;

	[self createDefaultFields];
			
	[self updateScrollers];
	
}

-(void) updateScrollers
{
	int count = 0;
	int x = 0,y = 0;
	for (int a=0; a < mSize ; a++)
	{
		[self setField:a];
		LayoutField* field = [mItemFields objectAtIndex:a];
		if ([self getScrollCoords:x ind:y  field:field])
		{
			//field.mRef.clear();
			field.mH *= mModifiersH[count];
			field.mW *= mModifiersW[count];
			field.mZ += mModifiersZ[count];
			if (x == mSizeH-1 && count < mSizeW-1)
			{
				count++;
			}
			field.mActive = true;
			[field.mRef setPosition:field.mX y:field.mY z:field.mZ];
			[field.mRef setScale:field.mW y:field.mH z:1];
			[field.mRef set];
			[field updateLocation];
			[field setState:LAS_VISIBLE];
		}else
		{
			field.mH = 1.0f;
			field.mW = 1.0f;
			[field setState:LAS_HIDDEN];
			field.mActive = false;
		}
		
		
		x++;
		if (x >= mSizeH)
		{
			x = 0;
			y++;
		}
		
	}
	if (mModel != nil)
	{
		[mModel setActive:true];
		[mModel setState:LAS_VISIBLE];
		GameonModelRef* ref = [mModel ref:0];
		float div = (float)mSizeH / mSize;
		float scrollpos = mScrollers[0] / (mScrollers[2]-mScrollers[1]+div);
		if (mHasScrollV)
		{
			[ref setPosition:0.0f y:-scrollpos*mBounds[1] z:0.001f];
		}else
		{
			[ref setPosition:scrollpos*mBounds[0] y:0.0f z:0.001f];
		}
		[ref set];
	}
	
}

-(void)setText:(NSString*)strData
{
	[super setText:strData];

	if (mSubType == LATST_LIST || mSubType == LATST_HLIST)
	{
		[self pushFrontItem:strData];
	}
}
@end
