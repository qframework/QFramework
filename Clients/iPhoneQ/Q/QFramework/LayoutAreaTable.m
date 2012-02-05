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


@implementation LayoutAreaTable

-(id) initWithSubtype:(NSString*)subtype  app:(GameonApp*)app
{
    self = [super initWithSubtype:subtype app:app];
    if (self)
    {
        mSubType = LATST_NONE;
        mTableWidth = 0;
        mTableHeight = 0;
        mTitleHeight = 0;

        if ([subtype isEqualToString:@"sgrid"])
        {
            mSubType = LATST_SGRID;
        }else
        if ([subtype isEqualToString:@"cardt"])
        {
            mSubType = LATST_CARDTABLE;
        }else
        if ([subtype isEqualToString:@"list"])
        {
            mSubType = LATST_LIST;
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
    [super dealloc];
}


-(void) initList
{
    // location
    int x = 0,y = 0;
    float width = mBounds[0];
    float height = mBounds[1];
	float mx = width / 20;
	float my = height / 20;
	float height2 = 1.0f - my;
	float width2 = 1.0f - mx;
	
    int fieldind = 0;
    int fieldc = 0;
    float divx = [self getDivX:1 w:width];
    float divy = [self getDivY:mSizeH h:height];
    float divx2 = [self getDivX:1 w:width2];
    float divy2 = [self getDivY:mSizeH h:height2];
    
    y = mSizeH-1;
    for (int a=mSizeH-1; a >=0 ; a--)
    {
        [self setField:fieldind];
        LayoutField* field = [mItemFields objectAtIndex:fieldind++];
        field.mX = mx /2 +[self getX:x max:mSizeW w:width2] + divx/2 - width / 2;
        field.mY = my /2 +[self getY:y max:mSizeH h:height2] + divy/2- height / 2;
        field.mW = divx2 * field.mGridSzX;
        field.mH = divy2 * field.mGridSzY;
		[field.mRef setPosition:field.mX y:field.mY z:field.mZ];
		[field.mRef setScale:field.mW y:field.mH z:1];	        
		
        field.mMarginX = field.mW / 10;
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
    }
}


@end
