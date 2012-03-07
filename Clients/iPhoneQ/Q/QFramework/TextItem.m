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


#import "TextItem.h"
#import "TextRender.h"
#import "LayoutTypes.h"
#import "TextureFactory.h"
#import "GameonModel.h"
#import "GameonModelRef.h"
#import "ColorFactory.h"
#import "GameonWorld.h"
#import "GameonApp.h"
#import "LayoutArea.h"

@implementation TextItem

@synthesize mText;
@synthesize mModel;
@synthesize mParent;
@synthesize mRef;

-(id) initWithApp:(GameonApp*)app x:(float)ax y:(float)ay w:(float)aw h:(float)ah z:(float)az t:(NSString*)text n:(float)num o:(int)offset 
	loc:(GameonWorld_Location)loc layout:(LayoutArea_Layout)layout colors:(GLColor**)colors
{
	if (self = [super init])
	{
		mApp = app;
        mX = ax;
        mY = ay;
        mW = aw;
        mH = ah;
        mZ = az;
        mText = [[NSString alloc]  initWithString:text];
        mNum = num;        
        mVisible = false;
        mOffset = offset;
        mDirX = 1;
        mDirY = 0;        
		mLoc = loc;
		mLayout = layout;
		mColors[0] = colors[0];
		mColors[1] = colors[1];
		mColors[2] = colors[2];
		mColors[3] = colors[3];
        mRef = [[GameonModelRef alloc] initWithParent:nil];
        mRef.mLoc = loc;
        mCentered = false;
        [self setOrientation:layout];        
		[self set:true];
    }
    return self;    
}


-(id) initWithApp:(GameonApp*)app x:(float)ax y:(float)ay w:(float)aw h:(float)ah z:(float)az t:(NSString*)text  o:(int)offset
	loc:(GameonWorld_Location)loc layout:(LayoutArea_Layout)layout colors:(GLColor**)colors
{
	if (self = [super init])
	{
		mApp = app;
        mX = ax;
        mY = ay;
        mW = aw;
        mH = ah;
        mZ = az;
        mText = [[NSString alloc] initWithString:text];
        mNum = -1.0;
        mVisible = false;
        mOffset = offset;
        mDirX = 1;
        mDirY = 0;                
		mLoc = loc;
		mLayout = layout;
		mColors[0] = colors[0];
		mColors[1] = colors[1];
		mColors[2] = colors[2];
		mColors[3] = colors[3];
        mRef = [[GameonModelRef alloc] initWithParent:nil];
        mRef.mLoc = loc;     
        mCentered = false;    
        [self setOrientation:layout];
		[self set:true];		
    }
    return self;    
}

- (void) dealloc 
{
    [mRef release];
    [mText release];
    [mModel release];
    [super dealloc];  
}
- (bool)updateText:(NSString*) text  loc:(GameonWorld_Location)loc
{
	bool update = false;
	if ([mText length] != [text length] && mNum < 0)
	{
		update = true;
	}

    [mText release];
    mText = nil;
    if (text != nil) {
        mText = [[NSString alloc] initWithString:text];
    }else
    {
        return false;
    }
	mLoc = loc;
    mRef.mLoc = loc;    
	[self set:update];
	return update;
}

- (void)setOrientation:(int)orientation
{
//    LAL_NONE
//    LAL_WEST_EAST
//    LAL_EAST_WEST
//    LAL_NORTH_SOUTH
//    LAL_SOUTH_NORTH
    if (orientation == LAL_WEST_EAST ||
        orientation == LAL_NONE || 
		orientation == LAL_HORIZONTAL)
    {
        mDirX = 1;
        mDirY = 0;        
    }else
    if (orientation == LAL_EAST_WEST)
    {
        mDirX = -1;
        mDirY = 0;        
    }
    else
    if (orientation == LAL_NORTH_SOUTH ||
		orientation == LAL_VERTICAL)
    {
        mDirX = 0;
        mDirY = -1;        
    }    
    else
    if (orientation == LAL_SOUTH_NORTH)
    {
        mDirX = 0;
        mDirY = 1;        
    }    
	
	if (orientation == LAL_HORIZONTAL|| 
		orientation == LAL_VERTICAL)
	{
		mCentered = true;
	}	
}
- (void)setOffset:(int)offset
{
    mOffset = offset;    
}


- (void) set:(bool) updateref
{
	[mRef setVisible:true];
	if (mText == nil)
	{
		return;
	}

	if (mModel != nil)
	{
		//mModel.clear();
        [mModel release];
	}
        
	float wfact = 0.48f;
	mModel = [[GameonModel alloc] initWithName:@"letter" app:mApp];
    [mModel unsetWorld];
	mModel.mLoc = mLoc;
	[mModel addref:mRef];
	
	if (mDirX != 0)
	{
		int len = [mText length];
		if (len == 0)return;
		float num = mNum;
		
		if (num <= 0) {
			num = len;
		}
        //NSLog( @" %@ " , mText);
		if (updateref)
		{
			mRef.mPosition[0] = mX;
			mRef.mPosition[1] = mY;
			mRef.mPosition[2] = mZ;
			mRef.mScale[0] = mW / num;
			mRef.mScale[1] = mH;
			
		}
		float start = - (float)num / 2.0f + 0.5f;
		if (mCentered && mNum > 0)
		{
			start = - (float)len / 2.0f + 0.5f;
		}
		
		
		float div = 1.0f/16.0f;
		float cp = mApp.textures.mCp;
        
		for (int a=0; a< len && a < num ; a++ ) 
		{
			//var x = start + a * divx  * dirx; 
			int val = [self getVal:[mText characterAtIndex:a]]; 
			float tu1 = div * (val  % 16);
			float tv1 = div * (float)floor(val  / 16);
			float tu2 = tu1 + div;
			float tv2 = tv1 + div;	
			
			tu1 += [mApp.textures mU1];
			tv1 += [mApp.textures mV1];
			tu2 -= [mApp.textures mU2];
			tv2 -= [mApp.textures mV2];
			
			if (mDirX > 0)
			{
				[mModel createPlaneTex2:start-wfact btm:-wfact b:0.0f r:start+wfact+cp t:wfact f:0.0f
						tu1:tu1 tv1:tv1 tu2:tu2 tv2:tv2 c:mColors no:(float)a div:1/MAX(len,num)];
			}else
			{
				[mModel createPlaneTex2:num-1-start-wfact-cp btm:-wfact b:0.0f r:num-1-start+wfact t:wfact f:0.0f 
						tu1:tu1 tv1:tv1 tu2:tu2 tv2:tv2 c:mColors no:(float)a div:1/MAX(len,num)];			
				
			}
			start += 1.0;
		}
			
	} else {
		int len = [mText length];
		if (len == 0)
		{
			return;
		}
		float num = mNum;
		if (num <= 0) {
			num = len;
		}
		

		if (updateref)
		{
		
			mRef.mPosition[0] = mX;
			mRef.mPosition[1] = mY;
			mRef.mPosition[2] = mZ;
			mRef.mScale[0] = mW;
			mRef.mScale[1] = mH / num;
		}
		
		// NSLog(@" text +++ = %@" , text);
		float start =  (float)num / 2.0f - 0.5f;
		if (mCentered && mNum > 0)
		{
			start = (float)len / 2.0f - 0.5f;
		}			
		
		
		float div = 1.0f/16.0f;
        float cp = mApp.textures.mCp;
		for (int a=0; a< len && a < num ; a++ ) 
		{
			//var x = start + a * divx  * dirx; 
			int val = [self getVal:[mText characterAtIndex:a]]; 
			float tu1 = div * (val  % 16);
			float tv1 = div * (float)floor(val  / 16);
			float tu2 = tu1 + div;
			float tv2 = tv1 + div;	
			tu1 += [mApp.textures mU1];
			tv1 += [mApp.textures mV1];
			tu2 -= [mApp.textures mU2];
			tv2 -= [mApp.textures mV2];
			
			if (mDirY > 0)
			{
				[mModel createPlaneTex:-wfact btm:start-wfact b:0.0f r:wfact t:start+wfact+cp f:0.0f 
						tu1:tu1 tv1:tv1 tu2:tu2 tv2:tv2 c:mColors no:(float)a div:1/MAX(len,num)];
			
			}else
			{
				[mModel createPlaneTex:-wfact btm:num-1-start-wfact-cp b:0.0f r:wfact t:num-1-start+wfact f:0.0f 
						tu1:tu1 tv1:tv1 tu2:tu2 tv2:tv2 c:mColors no:(float)a div:1/MAX(len,num)];			
							
			}
			start += 1.0;
			
		}
	}
	
	[mModel setTexture:[mApp.textures get:TFT_FONT]];
	[mModel generate];
	mModel.mEnabled = true;

	if (updateref)
	{
		//[mRef set];
	}
}

-(void) draw:(int) no
{

	if (mModel == nil)
	{
		return;
	}
	//if (no == 0)
	{
		[mModel setupRef];
	}
	if( mText == nil || [mText length] == 0)
	{
		return;
	}
	
	if (mOffset > 0)
	{

		GLColor* c = [mApp.colors getColorId:mOffset];
		float alights[4];
		[mApp.world getAmbientLight:alights];
		
		[mApp.world setAmbientLightGl:
				alights[0] * (float)c.red / 255.0f
				g:alights[1] * (float)c.green / 255.0f
				b:alights[2] * (float)c.blue / 255.0f 
				a:alights[3] * (float)c.alpha / 255.0f
				];
		[mModel setupRef];
		[mModel drawRef:mRef init:true];

		[mApp.world setAmbientLightGl:
				alights[0] 
				g:alights[1] 
				b:alights[2] 
				a:alights[3]];			
		
	}else
	{
		//mModel.setupRef(gl);
		[mModel drawRef:mRef init:true];
	}
	
}


-(int) getVal:(int) val
{
	int ref = 32;
	if (val < 0 || val > 255) 
	{
			
		switch (val) 
		{
			case 268: ref = 0;break;
			case 269: ref = 1;break;
			case 262: ref = 2;break;
			case 263: ref = 3;break;
			case 272: ref = 13*16;break;
			case 273: ref = 15*16;break;
			case 352: ref = 8*16+10;break;
			case 353: ref = 9*16+10;break;										
			case 381: ref = 8*16+14;break;
			case 382: ref = 9*16+14;break;					
			default:
				ref = 38;
				break;
		}
	} else {
		ref = val;
	}
	return ref;
}

-(void) setParent:(TextRender*) parent
{
	mParent = parent;
}

-(void) setVisible:(bool) visible
{
	mVisible = visible;
	if (visible)
	{
		[mParent addVisible:self];
	}else
	{
		[mParent removeVisible:self];
	}
	
	if (mRef != nil)
	{
		[mRef setVisible:visible];
	}	
}

-(bool) getVisible
{
	return mVisible;
}

-(void) setPosition:(float)x y:(float)y z:(float)z w:(float)w h:(float) h 
{
	mX = x;
	mY = y;
	mZ = z;
	mW = w;
	mH = h;
//	System.out.println(" set pos " + mText + " " + mX + " " + mY+  " " + mZ + " " + mW + " " + mH);
	[self setRef];
}

-(void) setRef
{
	if (mRef != nil)
	{
		if (mDirX != 0)
		{
			float num = mNum;
			
			if (num <= 0) {
				num = [mText length];
			}
			mRef.mPosition[0] = mX;
			mRef.mPosition[1] = mY;
			mRef.mPosition[2] = mZ;
			mRef.mScale[0] = mW / num;
			mRef.mScale[1] = mH;

		}
		else
		{
			float num = mNum;
			
			if (num <= 0) {
				num = [mText length]; 
			}
			
			mRef.mPosition[0] = mX;
			mRef.mPosition[1] = mY;
			mRef.mPosition[2] = mZ;
			mRef.mScale[0] = mW;
			mRef.mScale[1] = mH / num;
			
		}
	}
}

-(void) setParentLoc:(LayoutArea*)area 
{
	if (mRef != nil)
	{
		[mRef setAreaPosition:area.mLocation];
		[mRef setAreaRotate:area.mRotation];
		[mRef mulScale:area.mBounds];
		[mRef setAddScale:area.mScale];			
		[mRef set];
	}
	
}
@end


