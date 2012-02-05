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

#import "LayoutAreaLayout.h"
#import "LayoutField.h"
#import "GameonModelRef.h"

@implementation LayoutAreaLayout

-(id) initWithSubtype:(NSString*)subtype  app:(GameonApp*)app
{
    self = [super initWithSubtype:subtype app:app];
    if (self)
    {
        mSubType = LALST_NONE;
        
        if ([subtype isEqualToString:@"grid"])
        {
            mSubType = LALST_GRID;
        }else
        if ([subtype isEqualToString:@"back"])
        {
            mSubType = LALST_BACK;
        }            
        mType = LAT_LAYOUT;
        
    }
    return self;
}

-(void) dealloc 
{
    [super dealloc];
}


-(void) setTitle
{
    
}

-(void) initGrid
{
    
    LayoutField* field = nil;
    float width = mBounds[0];
    float height = mBounds[1];
    int x = 0;
    int y = 0;
    int count = 0;
    float divx = [self getDivX:mSizeW w:width];
    float divy = [self getDivY:mSizeH h:height];
    
    while ( count < mSize)
    {
        [self setField:count];
        field = [mItemFields objectAtIndex:count++];
        
        field.mX = [self getX:x max:mSizeW w:width] - width /2;
        field.mY = [self getY:y max:mSizeH h:height]- height /2;
        field.mW = divx;
        field.mH = divy;
        field.mZ = mLocation[2];
        x++;
        if (x >= mSizeW)
        {
            x = 0; y++;
        }
         
		[field.mRef setPosition:field.mX y:field.mY z:field.mZ];
        [field.mRef setScale:divx y:divy z:1];	                
    }
    
}

-(void) initLayout
{
    [super initLayout];
    
    if (mSubType == LALST_GRID)
    {
        [self initGrid];
    } 		
}

@end



