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

#import "LayoutField.h"
#import "LayoutArea.h"
#import "LayoutField.h"
#import "TextItem.h"
#import "GameonModelRef.h"
#import "GameonCS.h"
#import "ItemFactory.h"
#import "TextRender.h"
#import "LayoutItem.h"
#import "GameonModel.h"
#import "GameonApp.h"

@implementation LayoutField


@synthesize mID;
@synthesize mX;
@synthesize mY;
@synthesize mMarginX;
@synthesize mMarginY;
@synthesize mZ;
@synthesize mW;
@synthesize mH;
@synthesize mItem;
@synthesize mParent;
@synthesize mType;
@synthesize mText;
@synthesize mGridx;
@synthesize mGridy;
@synthesize mGridSzY;
@synthesize mGridSzX;
@synthesize mFieldType;
@synthesize mRandX;
@synthesize mRandY;
@synthesize mRandRotZ;
@synthesize mItemRotX;
@synthesize mItemRotY;
@synthesize mItemRotZ;    
@synthesize mRef;
@synthesize mActive;

- (id)initWithParent:(LayoutArea*)parent
{
    self = [super init];
    
    if (self) {
        mItem = nil;
        mParent = parent;
		mType = LFT_NONE;
        mGridx = -1;
        mGridy = -1;
        mGridSzX = 1;
        mGridSzY = 1;        
        mFieldType = LFFT_NONE;
        mItemRotX = 0;
        mItemRotY = 0;
        mItemRotZ = 0;    
        mOwner = 0;
		mRef = [[GameonModelRef alloc] init];
        mApp = parent.mApp;
		
		mState = LAS_VISIBLE;
		mActive = true;
		
    }
    return  self;
}

- (void) dealloc 
{
    [mRef release];
    [mItem release];
    [mText release];
    [super dealloc];
}


-(void) getLoc:(GameonModelRef*) loc
{
	[loc setPosition:mX y:mY  z:mZ];
}

-(void) setItem:(NSString*)itemID doeffect:(bool)doeffect showback:(bool)showback
{
    NSString* itemid2 = itemID;
    // create new one
    if ([itemID characterAtIndex:0] == '[') {
        itemid2 = [itemID substringFromIndex:3];
    }

    /*
    if (mItem != nil) {
        [mItem remove];
        [mItem release];
    }*/
    LayoutItem* item = [mApp.items createItem:itemid2 source:nil];

    if (item != nil)
    {
        [self setItem2:item doeffect:doeffect showback:showback];
    }
}

-(void) removeFigure {
    if (mItem != nil)
    {
        [mItem remove];
        [mItem release];
        mItem = nil;
    }
}

-(void) setNoFigure {
    if (mItem != nil)
    {
        [mItem remove];
        mItem = nil;
    }
}

-(void) clear
{
    [self removeFigure];
    if (mText != nil)
    {
        if (mParent.mDisplay == GWLOC_HUD)
        {
            TextRender* r = mApp.world.mTextsHud;
            [r remove:mText];
        }
        else
        {
            TextRender* r = mApp.world.mTexts;
            [r remove:mText];
        }                
        [mText release];
        mText = nil;
    }
}

-(void) setItem2:(LayoutItem*)item doeffect:(bool)doeffect showback:(bool)showback
{
    // TODO check if already exists??
    if (mItem != nil) {
        [mItem remove];
        mItem = nil;
    }

    mItem = item;
    if (mItem != nil){
        float w = mW;
        float h = mH;
        
        
        if (w == 0 || h == 0)
            return;
        else
        {
            //NSLog(@" %f %f %f %f " , mX, mY, mZ, mH);
            
            [mItem setPosition:mParent.mDisplay x:mX y:mY z:(mZ+0.001) w:w h:h doeffect:doeffect];
            [mItem setRand:mRandX y:mRandY z:0 rx:0 ry:0 rz:mRandRotZ];
			[mItem setParentLoc:mParent];
            [mItem  addRotation:mItemRotX y:mItemRotY z:mItemRotZ];
            [mItem.mModelRef set];
            [self setState:mState];
        }
    }
    
}


-(void) setText:(NSString*)data len:(int)num {
	float w = mW;
	float h = mH;
	float x = mX;
	float y = mY;
    if (data == nil)
    {
        return;
    }
	if (data == nil || [data length] == 0)
	{
		if (mText != nil)
		{
			[mApp.world.mTextsHud remove:mText];
			[mApp.world.mTexts remove:mText];
            [mText release];
			mText = nil;
		}
		return;
	}    
    if (mText != nil) {
        //[mText setOffset:mOwner];
        [mText updateText:data loc:mParent.mDisplay];
		[mText setRef];
    }else {
        
        
        if (mParent.mDisplay == GWLOC_HUD)
        {        
            if (num > 0) {
                mText = [[TextItem alloc] initWithApp:mApp x:x y:y w:w h:h z:(mZ+0.002f) t:data n:num o:mOwner
							loc:mParent.mDisplay layout:mParent.mLayout colors:[mParent getColors]];
            }else{
                mText = [[TextItem alloc] initWithApp:mApp x:x y:y w:w h:h z:(mZ+0.002f) t:data o:mOwner
							loc:mParent.mDisplay layout:mParent.mLayout colors:[mParent getColors]];
            }
        }else {
            if (num > 0) {
                mText = [[TextItem alloc] initWithApp:mApp x:x y:y w:w h:h z:(mZ+0.002f) 
                                                     t:data n:num o:mOwner                         
							loc:mParent.mDisplay layout:mParent.mLayout colors:[mParent getColors]];
            }else{
                mText = [[TextItem alloc] initWithApp:mApp x:x y:y w:w h:h z:(mZ+0.002f) t:data o:mOwner
							loc:mParent.mDisplay layout:mParent.mLayout colors:[mParent getColors]];
            }            
        }


        if (mParent.mDisplay == GWLOC_HUD)
        {
            TextRender* r = mApp.world.mTextsHud;
            [r add:mText visible:mParent.mState == LAS_VISIBLE && mParent.mPageVisible];
            [mText setParent:r];
        }
        else
        {
            TextRender* r = mApp.world.mTexts;
            [r add:mText visible:mParent.mState == LAS_VISIBLE && mParent.mPageVisible];
            [mText setParent:r];            
        } 			
    }
    
    GameonModelRef* ref = mText.mRef;
    [ref setAreaPosition:mParent.mLocation];
    [ref setAreaRotate:mParent.mRotation];
    [ref mulScale:mParent.mBounds];
    [ref set];       
}

-(void) setState:(int)state {
	if (!mActive)
		return;
    if (!mParent.mPageVisible)
        state = LAS_HIDDEN;

	mState = state;
    if (state == LAS_VISIBLE)
    {
        if (mText != nil) {
            [mText setVisible:true];
        }
        if (mItem != nil)
        {
            [mItem.mModelRef setVisible:true];
        }
    }else
    {
        if (mText != nil) {
            [mText setVisible:false];
        }			
        if (mItem != nil)
        {
            [mItem.mModelRef setVisible:false];
        }        
    }
    
}

-(void) setOwner:(int)owner
{
    mOwner = owner;
    if (mText != nil) {
        [mText setOffset: owner];
    }
}

-(void) invertItem
{
    if (mOwner == 0)
    {
        mOwner = 4;
    }else {
        mOwner = 0;
    }
    if (mText != nil)
    {
        [mText setOffset:mOwner];
    }
    // todo - with item
    
}

-(void)updateLocation
{
	float w = mW;
	float h = mH;
	
	
	if (w == 0 || h == 0)
		return;
	
	if (mItem != nil)
    {
		[mItem setPosition:mParent.mDisplay x:mX y:mY z:(mZ) w:w h:h doeffect:false];
		[mItem setRand:mRandX y:mRandY z:0 rx:0 ry:0 rz:mRandRotZ];
		[mItem setParentLoc:mParent];
		
		[mItem.mModelRef set];
	}
	
	if (mText != nil)
	{
		[mText setPosition:mX y:mY z:mZ+0.002f w:w-mMarginX h:h-mMarginY];            
		[mText setParentLoc:mParent];
		[mText.ref set];        
	}
	
	
}

-(void) createAnimTrans:(NSString*)movetype delay:(int)delay away:(bool)away 
{
	if (mText != nil && mText.mModel != nil)
	{
		[mText.mModel createAnimTrans:movetype  delay:delay away:away no:0];
	}
	if (mItem != nil)
	{
		int index = [mItem.mModel findRef:mItem.mModelRef];
        //NSLog(@" index %d object %p parent %@ " , index, mItem.mModelRef ,mParent.mID);
		[mItem.mModel createAnimTrans:movetype delay:delay away:away no:index];
	}
	
}

-(void) setScale
{
   if (mItem != nil && mItem.mModelRef != nil)
   {
       [mItem.mModelRef setScale:mW y:mH z:1];
   }
   if (mText != nil)
   {
       [mText setRef];
   }
   if (mRef != nil)
   {
       [mRef setScale:mW y:mH z:1];
   }
}
                           
-(void) createAnim:(NSString*)type delay:(NSString*)delay data:(NSString*)data 
{
	if (mText != nil && mText.mModel != nil)
	{
		[mText.mModel createAnim:type forId:0 delay:delay data:data];
	}
	if (mItem != nil)
	{
		int index = [mItem.mModel findRef: mItem.mModelRef];
		[mItem.mModel createAnim:type forId:index delay:delay data:data];
	}		
}
	
@end


