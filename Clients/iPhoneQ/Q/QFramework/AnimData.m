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

#import "AnimData.h"
#import "GameonModelRef.h"
#import "GameonWorld.h"
#import "AnimFactory.h"
#import "GLColor.h"
#import "GameonApp.h"
#import "GMath.h"
#import "LayoutArea.h"

@implementation AnimData_AnimFrame
@synthesize mScale;
@synthesize mScaleAnim;
@synthesize mRotate;
@synthesize mRotateAnim;
@synthesize mTranslate;
@synthesize mTranslateAnim;
@synthesize mRotate2;
@synthesize mRotate2Anim;
@synthesize mTranslate2;
@synthesize mTranslate2Anim;

- (id)init
{
    self = [super init];
    
    if (self) {
		mScale = malloc(sizeof(float)*3);
		mScaleAnim = false;
		mRotate = malloc(sizeof(float)*3);
		mRotateAnim = false;
		mTranslate = malloc(sizeof(float)*3);
		mTranslateAnim = false;

		mRotate2 = malloc(sizeof(float)*3);
		mRotate2Anim = false;
		mTranslate2 = malloc(sizeof(float)*3);
		mTranslate2Anim = false;
    }

    return self;
}

-(void) dealloc 
{
    free(mScale);
	free(mRotate);
	free(mTranslate);
	free(mRotate2);
	free(mTranslate2);
    [super dealloc];
}

@end

@implementation AnimData

static int		mMaxFrames = 16;

@synthesize mActive;
@synthesize mAreaOwner;


-(void) dealloc 
{
    [mSavedRef release];
    [mCallback release];
    [mEnd release];
    [mStart release];
    [mColorPool release];
	[mCallback release];
    [super dealloc];
}


-(void) restore
{
    
    if (mType == ADT_COLOR)
    {
        [self setColorEnd];
    }

}


-(void) reset{
    [self restore];
    mRepeat = 1;
    mToFinish =false;
	mType = ADT_REF;
    mRefCount = 0;
    mSteps = 0;
    mTimeStep = 0;
    mActive = false;
    if (mToFree)
    {
        //[mSavedRef release];
        mToFree = false;
    }
    mSavedRef = nil;    
    [mApp.anims decCount];
	
    mAnimDelay = 0;
	mPerctVal = -1;
	mPerctMin = 0;
	mPerctMax = 0;
	mPerctDiff = 0;
	if (mAreaOwner != nil)
	{
		mAreaOwner.mScollerAnim = nil;
		mAreaOwner = nil; 
	}	
	
    NSLog(@" end anim " );
    //Log.d("model", "afinish " + mId);
    
}



-(void) setColorStart
 {
	GLColor* c = [mColorPool objectAtIndex:0];
	[mApp.world setAmbientLight:c.red/255.0f g:c.green/255.0f b:c.blue/255.0f  a:c.alpha /255.0f];

}

-(void) setColorEnd
{
	GLColor* c = [mColorPool objectAtIndex:mRefCount-1];
	[mApp.world setAmbientLight:c.red/255.0f g:c.green/255.0f b:c.blue/255.0f  a:c.alpha /255.0f];
    
}

-(float) setRef:(double)time
{
    
    // set current source and destination key frames
    double diff = time;
    if (diff == 0)diff = 1;
    float perct = (float)diff / (float)mDifftime;
    int frame = (int) ( perct * (float)mSteps);
    
    if (frame > mSteps -1) {
        frame = mSteps -1;
    }
    if(frame > mMaxFrames-1 || frame < 0) {
        [self reset];
        //Log.d("model", " anim failed "  + frame);
        return 1.0f;
    }
	
	if (mType == ADT_COLOR)
	{
		mCurrSourceCol = [mColorPool objectAtIndex:frame];//mDestRefVec.get(frame);
		mCurrDestCol = [mColorPool objectAtIndex:frame+1];//mDestRefVec.get(frame+1);
		
	}
    float rest = (diff - ((float)frame * (float)mTimeStep)) / (float)mTimeStep;
    return rest;
}

-(void) calcLinearColor:(GLColor*)sourceCol dest:(GLColor*)destCol p:(float) perct 
{
	float rs = (float)sourceCol.red;
	float bs = (float)sourceCol.blue;
	float gs = (float)sourceCol.green;
	float as = (float)sourceCol.alpha;
	
	float rd = (float)destCol.red;
	float bd = (float)destCol.blue;
	float gd = (float)destCol.green;
	float ad = (float)destCol.alpha;

	float r = rs + (rd-rs) * perct;
	float g = gs + (gd-gs) * perct;
	float b = bs + (bd-bs) * perct;
	float a = as + (ad-as) * perct;
	//NSLog(@" %f %f %f %f " , r,g,b,a);
	
	[mApp.world setAmbientLight:r/255.0f g:g/255.0f b:b/255.0f a:a/255.0f];		

}

-(void)copyColor:(GLColor*)src dst:(GLColor*) dst
{
	dst.alpha = src.alpha;
	dst.red = src.red;
	dst.blue = src.blue;
	dst.green = src.green;	
}

-(void)  storeArrays:(AnimData_AnimFrame*)outfr inFrame:(AnimFactory_AnimFrame*)infr  ref:(GameonModelRef*)ref
{
	if (outfr.mTranslateAnim)
	{
		if (outfr.mTranslate == NULL)
			outfr.mTranslate = malloc( 3 * sizeof(float));
		outfr.mTranslate[0] = ref.mPosition[0];
		outfr.mTranslate[1] = ref.mPosition[1];
		outfr.mTranslate[2] = ref.mPosition[2];
	}
	
	if (outfr.mRotateAnim)
	{
		if (outfr.mRotate == NULL)
			outfr.mRotate = malloc( 3 * sizeof(float));
		outfr.mRotate[0] = ref.mRotation[0];
		outfr.mRotate[1] = ref.mRotation[1];
		outfr.mRotate[2] = ref.mRotation[2];
	}
	
	if (outfr.mScaleAnim)
	{
		if (outfr.mScale == NULL)
			outfr.mScale = malloc( 3 * sizeof(float));
		outfr.mScale[0] = ref.mScale[0];
		outfr.mScale[1] = ref.mScale[1];
		outfr.mScale[2] = ref.mScale[2];			
	}

	
	if (outfr.mTranslate2Anim)
	{
		if (outfr.mTranslate2 == NULL)
			outfr.mTranslate2 = malloc( 3 * sizeof(float));
		outfr.mTranslate2[0] = ref.mAreaPosition[0];
		outfr.mTranslate2[1] = ref.mAreaPosition[1];
		outfr.mTranslate2[2] = ref.mAreaPosition[2];
	}
	
	if (outfr.mRotate2Anim)
	{
		if (outfr.mRotate2 == NULL)
			outfr.mRotate2 = malloc( 3 * sizeof(float));
		outfr.mRotate2[0] = ref.mAreaRotation[0];
		outfr.mRotate2[1] = ref.mAreaRotation[1];
		outfr.mRotate2[2] = ref.mAreaRotation[2];
	}
	
}

-(void)  storeArrays3:(AnimData_AnimFrame*)outfr inFrame:(AnimFactory_AnimFrame*)infr start:(GameonModelRef*)start end:(GameonModelRef*)end p:(float)p 
{
	if (outfr.mTranslateAnim)
	{
		if (outfr.mTranslate == NULL)
			outfr.mTranslate = malloc( 3 * sizeof(float));
		outfr.mTranslate[0] = (end.mPosition[0] - start.mPosition[0]) * p + start.mPosition[0];
		outfr.mTranslate[1] = (end.mPosition[1] - start.mPosition[1]) * p + start.mPosition[1];
		outfr.mTranslate[2] = (end.mPosition[2] - start.mPosition[2]) * p + start.mPosition[2];
	}
	
	if (outfr.mRotateAnim)
	{
		if (outfr.mRotate == NULL)
			outfr.mRotate = malloc( 3 * sizeof(float));
		outfr.mRotate[0] = (end.mRotation[0] - start.mRotation[0]) * p + start.mRotation[0];
		outfr.mRotate[1] = (end.mRotation[1] - start.mRotation[1]) * p + start.mRotation[1];
		outfr.mRotate[2] = (end.mRotation[2] - start.mRotation[2]) * p + start.mRotation[2];
	}
	
	if (outfr.mScaleAnim)
	{
		if (outfr.mScale == NULL)
			outfr.mScale = malloc( 3 * sizeof(float));
		outfr.mScale[0] = (end.mScale[0] - start.mScale[0]) * p + start.mScale[0];
		outfr.mScale[1] = (end.mScale[1] - start.mScale[1]) * p + start.mScale[1];
		outfr.mScale[2] = (end.mScale[2] - start.mScale[2]) * p + start.mScale[2];			
	}
	
	if (outfr.mTranslate2Anim)
	{
		if (outfr.mTranslate2 == NULL)
			outfr.mTranslate2 = malloc( 3 * sizeof(float));
		outfr.mTranslate2[0] = (end.mAreaPosition[0] - start.mAreaPosition[0]) * p + start.mAreaPosition[0];
		outfr.mTranslate2[1] = (end.mAreaPosition[1] - start.mAreaPosition[1]) * p + start.mAreaPosition[1];
		outfr.mTranslate2[2] = (end.mAreaPosition[2] - start.mAreaPosition[2]) * p + start.mAreaPosition[2];
	}
	
	if (outfr.mRotate2Anim)
	{
		if (outfr.mRotate2 == NULL)
			outfr.mRotate2 = malloc( 3 * sizeof(float));
		outfr.mRotate2[0] = (end.mAreaRotation[0] - start.mAreaRotation[0]) * p + start.mAreaRotation[0];
		outfr.mRotate2[1] = (end.mAreaRotation[1] - start.mAreaRotation[1]) * p + start.mAreaRotation[1];
		outfr.mRotate2[2] = (end.mAreaRotation[2] - start.mAreaRotation[2]) * p + start.mAreaRotation[2];
	}
	
}

-(void)  storeArrays2:(AnimData_AnimFrame*)outfr inFrame:(AnimFactory_AnimFrame*)infr values:(float*)values max:(int) countmax
{
	int count = 0;
	if (outfr.mTranslateAnim)
	{
		if (outfr.mTranslate == NULL)
			outfr.mTranslate = malloc( 3 * sizeof(float));
		outfr.mTranslate[0] = values[count++];
		outfr.mTranslate[1] = values[count++];
		outfr.mTranslate[2] = values[count++];
	}

	if (outfr.mRotateAnim)
	{
		if (outfr.mRotate == NULL)
			outfr.mRotate = malloc( 3 * sizeof(float));
		outfr.mRotate[0] = values[count++];
		outfr.mRotate[1] = values[count++];
		outfr.mRotate[2] = values[count++];
	}
	
	if (outfr.mScaleAnim)
	{
		if (outfr.mScale == NULL)
			outfr.mScale = malloc( 3 * sizeof(float));
		outfr.mScale[0] = values[count++];
		outfr.mScale[1] = values[count++];
		outfr.mScale[2] = values[count++];			
	}

	
	if (outfr.mTranslate2Anim)
	{
		if (outfr.mTranslate2 == NULL)
			outfr.mTranslate2 = malloc( 3 * sizeof(float));
		outfr.mTranslate2[0] = values[count++];
		outfr.mTranslate2[1] = values[count++];
		outfr.mTranslate2[2] = values[count++];
	}
	
	if (outfr.mRotate2Anim)
	{
		if (outfr.mRotate2 == NULL)
			outfr.mRotate2 = malloc( 3 * sizeof(float));
		outfr.mRotate2[0] = values[count++];
		outfr.mRotate2[1] = values[count++];
		outfr.mRotate2[2] = values[count++];
	}

	
}


-(void)  addArrays:(AnimData_AnimFrame*)outfr inFrame:(AnimFactory_AnimFrame*)infr ref:(GameonModelRef*)ref 
{
	if (outfr.mTranslateAnim)
	{
		if (outfr.mTranslate == NULL)
			outfr.mTranslate = malloc( 3 * sizeof(float));
		outfr.mTranslate[0] += ref.mPosition[0];
		outfr.mTranslate[1] += ref.mPosition[1];
		outfr.mTranslate[2] += ref.mPosition[2];
	}

	
	if (outfr.mRotateAnim)
	{
		if (outfr.mRotate == NULL)
			outfr.mRotate = malloc( 3 * sizeof(float));
		outfr.mRotate[0] += ref.mRotation[0];
		outfr.mRotate[1] += ref.mRotation[1];
		outfr.mRotate[2] += ref.mRotation[2];
	}
	
	if (outfr.mScaleAnim)
	{
		if (outfr.mScale == NULL)
			outfr.mScale = malloc( 3 * sizeof(float));
		outfr.mScale[0] *= ref.mScale[0];
		outfr.mScale[1] *= ref.mScale[1];
		outfr.mScale[2] *= ref.mScale[2];			
	}

	
	if (outfr.mTranslate2Anim)
	{
		if (outfr.mTranslate2 == NULL)
			outfr.mTranslate2 = malloc( 3 * sizeof(float));
		outfr.mTranslate2[0] += ref.mAreaPosition[0];
		outfr.mTranslate2[1] += ref.mAreaPosition[1];
		outfr.mTranslate2[2] += ref.mAreaPosition[2];
	}

	
	if (outfr.mRotate2Anim)
	{
		if (outfr.mRotate2 == NULL)
			outfr.mRotate2 = malloc( 3 * sizeof(float));
		outfr.mRotate2[0] += ref.mAreaRotation[0];
		outfr.mRotate2[1] += ref.mAreaRotation[1];
		outfr.mRotate2[2] += ref.mAreaRotation[2];
	}

	
}


-(void)  perctArrays:(AnimData_AnimFrame*)outfr inFrame:(AnimFactory_AnimFrame*) infr  
		ref0:(GameonModelRef*)ref0 ref:(GameonModelRef*)ref  p:(float) p
{
	float dist =distRefs(ref0,ref);
	
	if (outfr.mTranslateAnim && infr.translateActive)
	{
		if (outfr.mTranslate == NULL)
			outfr.mTranslate = malloc( 3 * sizeof(float));
		outfr.mTranslate[0] += infr.translate[0] * dist ;
		outfr.mTranslate[1] += infr.translate[1] *dist ;
		outfr.mTranslate[2] += infr.translate[2] *dist ;
	}

	
	if (outfr.mRotateAnim && infr.rotateActive)
	{
		if (outfr.mRotate == NULL)
			outfr.mRotate = malloc( 3 * sizeof(float));
		outfr.mRotate[0] += infr.rotate[0] *dist;
		outfr.mRotate[1] += infr.rotate[1] *dist;
		outfr.mRotate[2] += infr.rotate[2] *dist;
	}
	
	if (outfr.mScaleAnim && infr.scaleActive)
	{
		if (outfr.mScale == NULL)
			outfr.mScale = malloc( 3 * sizeof(float));
		outfr.mScale[0] *= infr.scale[0] * dist;
		outfr.mScale[1] *= infr.scale[1] * dist;
		outfr.mScale[2] *= infr.scale[2] * dist;			
	}

	
	if (outfr.mTranslate2Anim && infr.translate2Active)
	{
		if (outfr.mTranslate2 == NULL)
			outfr.mTranslate2 = malloc( 3 * sizeof(float));
		outfr.mTranslate2[0] += infr.translate2[0] * dist;
		outfr.mTranslate2[1] += infr.translate2[1] * dist;
		outfr.mTranslate2[2] += infr.translate2[2] * dist;
	}

	
	if (outfr.mRotate2Anim && infr.rotate2Active)
	{
		if (outfr.mRotate2 == NULL)
			outfr.mRotate2 = malloc( 3 * sizeof(float));
		outfr.mRotate2[0] += infr.rotate2[0] * dist;
		outfr.mRotate2[1] += infr.rotate2[1] * dist;
		outfr.mRotate2[2] += infr.rotate2[2] * dist;
	}
	
}

-(void) clearArrays:(AnimData_AnimFrame*)outfr inFrame:(AnimFactory_AnimFrame*)infr
{
	if (outfr.mTranslateAnim)
	{
		if (outfr.mTranslate == NULL)
			outfr.mTranslate = malloc( 3 * sizeof(float));
		outfr.mTranslate[0] = 0;
		outfr.mTranslate[1] = 0;
		outfr.mTranslate[2] = 0;
	}
	
	if (outfr.mRotateAnim)
	{
		if (outfr.mRotate == NULL)
			outfr.mRotate = malloc( 3 * sizeof(float));
		outfr.mRotate[0] = 0;
		outfr.mRotate[1] = 0;
		outfr.mRotate[2] = 0;
	}
	
	if (outfr.mScaleAnim)
	{
		if (outfr.mScale == NULL)
			outfr.mScale = malloc( 3 * sizeof(float));
		outfr.mScale[0] = 1;
		outfr.mScale[1] = 1;
		outfr.mScale[2] = 1;			
	}
	
	if (outfr.mTranslate2Anim)
	{
		if (outfr.mTranslate2 == NULL)
			outfr.mTranslate2 = malloc( 3 * sizeof(float));
		outfr.mTranslate2[0] = 0;
		outfr.mTranslate2[1] = 0;
		outfr.mTranslate2[2] = 0;
	}
	
	if (outfr.mRotate2Anim)
	{
		if (outfr.mRotate2 == NULL)
			outfr.mRotate2 = malloc( 3 * sizeof(float));
		outfr.mRotate2[0] = 0;
		outfr.mRotate2[1] = 0;
		outfr.mRotate2[2] = 0;
	}
	
}


-(void) fillFrameEnd:(AnimData_AnimFrame*)frame atype:(AnimFactory_AnimType*)atype values:(float*)values count:(int)count ref:(GameonModelRef*) ref
{
	AnimFactory_AnimFrame* def = [atype.frames lastObject];
	[self storeArrays2:mEnd inFrame:def values:values max:count];
	if (def.operation  != NULL)
	{
		if ([def.operation isEqualToString:@"add"])
		{
			[self addArrays:mEnd inFrame:def ref:ref];
		}
	}		
	
}

-(void) fillFrameEnd2:(AnimData_AnimFrame*)frame atype:(AnimFactory_AnimType*)atype ref:(GameonModelRef*)ref
{
	AnimFactory_AnimFrame* def = [atype.frames lastObject];
	[self clearArrays:mEnd inFrame:def];
	[self addArrays:mEnd inFrame:def ref:ref];
	
}

-(void) fillFrameStart:(AnimData_AnimFrame*)frame atype:(AnimFactory_AnimType*)atype ref:(GameonModelRef*) ref
{
	AnimFactory_AnimFrame* def = [atype.frames objectAtIndex:0];
	[self storeArrays:mStart inFrame:def ref:ref];		
}


-(void) maskFrames2:(AnimData_AnimFrame*)frame inFrame:(AnimFactory_AnimFrame*) inframe
{
	if (inframe.rotate2Active)
	{
		frame.mRotate2Anim = true;
	}else
	{
		frame.mRotate2Anim = false;
	}
	
	if (inframe.rotateActive)
	{
		frame.mRotateAnim = true;
	}else
	{
		frame.mRotateAnim = false;
	}		
	if (inframe.scaleActive)
	{
		frame.mScaleAnim = true;
	}else
	{
		frame.mScaleAnim = false;
	}
	
	if (inframe.translate2Active)
	{
		frame.mTranslate2Anim = true;
	}else
	{
		frame.mTranslate2Anim = false;
	}
	
	if (inframe.translateActive)
	{
		frame.mTranslateAnim = true;
	}else
	{
		frame.mTranslateAnim = false;
	}		
}

-(void) maskFrames:(AnimData_AnimFrame*)startFrame endFrame:(AnimData_AnimFrame*) endFrame
		start:(GameonModelRef*)start end:(GameonModelRef*) end 
		{
	// 
	if (start.mPosition[0] != end.mPosition[0] || 
		start.mPosition[1] != end.mPosition[1] ||
		start.mPosition[2] != end.mPosition[2])
	{
		startFrame.mTranslateAnim = true;
		endFrame.mTranslateAnim = true;
	}else
	{
		startFrame.mTranslateAnim = false;
		endFrame.mTranslateAnim = false;
	}

	if (start.mAreaPosition[0] != end.mAreaPosition[0] || 
		start.mAreaPosition[1] != end.mAreaPosition[1] ||
		start.mAreaPosition[2] != end.mAreaPosition[2])
	{
		startFrame.mTranslate2Anim = true;
		endFrame.mTranslate2Anim = true;
	}else
	{
		startFrame.mTranslate2Anim = false;
		endFrame.mTranslate2Anim = false;
	}

	if (start.mRotation[0] != end.mRotation[0] || 
		start.mRotation[1] != end.mRotation[1] ||
		start.mRotation[2] != end.mRotation[2])
	{
		startFrame.mRotateAnim = true;
		endFrame.mRotateAnim = true;
	}else
	{
		startFrame.mRotateAnim = false;
		endFrame.mRotateAnim = false;
	}
	
	

	if (start.mAreaRotation[0] != end.mAreaRotation[0] || 
		start.mAreaRotation[1] != end.mAreaRotation[1] ||
		start.mAreaRotation[2] != end.mAreaRotation[2])
	{
		startFrame.mRotate2Anim = true;
		endFrame.mRotate2Anim = true;
	}else
	{
		startFrame.mRotate2Anim = false;
		endFrame.mRotate2Anim = false;
	}
	
	if (start.mScale[0] != end.mScale[0] || 
		start.mScale[1] != end.mScale[1] ||
		start.mScale[2] != end.mScale[2])
	{
		startFrame.mScaleAnim = true;
		endFrame.mScaleAnim = true;
	}else
	{
		startFrame.mScaleAnim = false;
		endFrame.mScaleAnim = false;
	}		


}

-(void) maskFrame:(AnimData_AnimFrame*) frame start:(GameonModelRef*)start end:(GameonModelRef*)end 
{
	// 
	if (start.mPosition[0] != end.mPosition[0] || 
		start.mPosition[1] != end.mPosition[1] ||
		start.mPosition[2] != end.mPosition[2])
	{
		frame.mTranslateAnim = true;
	}else
	{
		frame.mTranslateAnim = false;
	}

	if (start.mAreaPosition[0] != end.mAreaPosition[0] || 
		start.mAreaPosition[1] != end.mAreaPosition[1] ||
		start.mAreaPosition[2] != end.mAreaPosition[2])
	{
		frame.mTranslate2Anim = true;
	}else
	{
		frame.mTranslate2Anim = false;
	}

	if (start.mRotation[0] != end.mRotation[0] || 
		start.mRotation[1] != end.mRotation[1] ||
		start.mRotation[2] != end.mRotation[2])
	{
		frame.mRotateAnim = true;
	}else
	{
		frame.mRotateAnim = false;
	}

	if (start.mAreaRotation[0] != end.mAreaRotation[0] || 
		start.mAreaRotation[1] != end.mAreaRotation[1] ||
		start.mAreaRotation[2] != end.mAreaRotation[2])
	{
		frame.mRotate2Anim = true;
	}else
	{
		frame.mRotate2Anim = false;
	}
	
	if (start.mScale[0] != end.mScale[0] || 
		start.mScale[1] != end.mScale[1] ||
		start.mScale[2] != end.mScale[2])
	{
		frame.mScaleAnim = true;
	}else
	{
		frame.mScaleAnim = false;
	}		
	
}


-(void) fillFrames:(AnimFactory_AnimType*)atype start:(GameonModelRef*)start end:(GameonModelRef*)end 
{
	
	float div = 1.0f/([atype.frames count]-1);
	float p = div;
	for (int a=1; a< [atype.frames count]-1; a++)
	{
		int id = a-1;
		AnimData_AnimFrame* frameout = nil;
		if (mFrames == nil)
			mFrames = [[NSMutableArray alloc]init];
		if (id < [mFrames count])
		{
			frameout = [mFrames objectAtIndex:id];
		}else
		{
			frameout = [[AnimData_AnimFrame alloc] init];
			[mFrames addObject:frameout];
		}
		AnimFactory_AnimFrame* framein = [atype.frames objectAtIndex:a];
		[self clearArrays:frameout inFrame:framein];
		[self maskFrame:frameout start:start end:end];			
		if ([framein.operation isEqualToString:@"add"])
		{
			[self storeArrays3:frameout inFrame:framein start:start end:end p:p];
			[self addArrays:frameout inFrame:framein ref:end];

		}else if ([framein.operation isEqualToString:@"pdist"])
		{
			[self storeArrays3:frameout inFrame:framein start:start end:end p:p];
			[self perctArrays:frameout inFrame:framein ref0:start ref:end p:p];
		}else
		{
			[self storeArrays:frameout inFrame:framein  ref:end];
		}
		p += div;
		mActiveFrames++;
	}
}

-(void) endAnimation:(GameonModelRef*) ref
{
	if (mBackupSaved)
	{
		[ref copy:mSavedRef];
        [ref copyMat:mSavedRef];
	}
	else
	{
		if (mEnd.mTranslateAnim)
		{
			ref.mPosition[0] = mEnd.mTranslate[0];
			ref.mPosition[1] = mEnd.mTranslate[1];
			ref.mPosition[2] = mEnd.mTranslate[2];
		}
		if (mEnd.mTranslate2Anim)
		{
			ref.mAreaPosition[0] = mEnd.mTranslate2[0];
			ref.mAreaPosition[1] = mEnd.mTranslate2[1];
			ref.mAreaPosition[2] = mEnd.mTranslate2[2];
		}
		
		if (mEnd.mRotate2Anim)
		{
			ref.mAreaRotation[0] = mEnd.mRotate2[0];
			ref.mAreaRotation[1] = mEnd.mRotate2[1];
			ref.mAreaRotation[2] = mEnd.mRotate2[2];
		}
		
		if (mEnd.mRotateAnim)
		{
			ref.mRotation[0] = mEnd.mRotate[0];
			ref.mRotation[1] = mEnd.mRotate[1];
			ref.mRotation[2] = mEnd.mRotate[2];
		}
		
		if (mEnd.mScaleAnim)
		{
			ref.mScale[0] = mEnd.mScale[0];
			ref.mScale[1] = mEnd.mScale[1];
			ref.mScale[2] = mEnd.mScale[2];
		}

	}
	
	[ref set];

	if (mOnEndHide)
	{
		ref.mEnabled = false;
	}
	
	mAnimDelay = 0;
	mRepeatDir = 0;
	mAnimRepeat = 1;		
	mCallback = @"";
	mActiveFrames = 0;
	mBackupSaved = false;
	mOnEndHide = false;
	[mApp.anims decCount];
}

-(void) calcLinearData:(AnimData_AnimFrame*)start  end:(AnimData_AnimFrame*)end p:(float)p ref:(GameonModelRef*) ref
{
	// TODO directly change matrix
	if (start.mTranslateAnim)
	{
		ref.mPosition[0] = (end.mTranslate[0] - start.mTranslate[0]) * p + start.mTranslate[0];
		ref.mPosition[1] = (end.mTranslate[1] - start.mTranslate[1]) * p + start.mTranslate[1];
		ref.mPosition[2] = (end.mTranslate[2] - start.mTranslate[2]) * p + start.mTranslate[2];
	}
	if (start.mTranslate2Anim)
	{
		ref.mAreaPosition[0] = (end.mTranslate2[0] - start.mTranslate2[0]) * p + start.mTranslate2[0];
		ref.mAreaPosition[1] = (end.mTranslate2[1] - start.mTranslate2[1]) * p + start.mTranslate2[1];
		ref.mAreaPosition[2] = (end.mTranslate2[2] - start.mTranslate2[2]) * p + start.mTranslate2[2];
	}
	
	if (start.mRotate2Anim)
	{
		ref.mAreaRotation[0] = (end.mRotate2[0] - start.mRotate2[0]) * p + start.mRotate2[0];
		ref.mAreaRotation[1] = (end.mRotate2[1] - start.mRotate2[1]) * p + start.mRotate2[1];
		ref.mAreaRotation[2] = (end.mRotate2[2] - start.mRotate2[2]) * p + start.mRotate2[2];
	}
	
	if (start.mRotateAnim)
	{
		ref.mRotation[0] = (end.mRotate[0] - start.mRotate[0]) * p + start.mRotate[0];
		ref.mRotation[1] = (end.mRotate[1] - start.mRotate[1]) * p + start.mRotate[1];
		ref.mRotation[2] = (end.mRotate[2] - start.mRotate[2]) * p + start.mRotate[2];
	}
	
	if (start.mScaleAnim)
	{
		ref.mScale[0] = (end.mScale[0] - start.mScale[0]) * p + start.mScale[0];
		ref.mScale[1] = (end.mScale[1] - start.mScale[1]) * p + start.mScale[1];
		ref.mScale[2] = (end.mScale[2] - start.mScale[2]) * p + start.mScale[2];
	}

	[ref set];
}



// public members
- (id)initWithId:(int)refid app:(GameonApp*)app
{
    self = [super init];
    
    if (self) {
        mApp = app;
        mDifftime = 0;
        
        mSteps = 0;
        mTimeStep = 0;
        
        mRefCount=0;
        mActive = false;
        mId = refid;

		// max  8 frames
        mSavedRef = nil;
        mRepeat = 1;
        mToFinish = false;
        mType = ADT_REF;
        mToFree =false;
		
		mAnimDelay = 0;
		mRepeatDir = 0;
		mAnimRepeat = 0;
		mActiveFrames = 0;
		mBackupSaved = false;
		mOnEndHide = false;
		mCallback = nil;

		
    }

    return self;
}


-(void) setDelay:(int)delay repeat:(int)repeat
{
	mAnimDelay += delay;
	if (repeat < 0)
	{
		mAnimRepeat = repeat  * -1 ;
		mRepeatDir = 1;
	}else
	{
		mAnimRepeat = repeat;
	}

}

-(void) saveBackup:(GameonModelRef*)backup tohide:(bool) hide
{
	if (mSavedRef == nil)
		mSavedRef = [[GameonModelRef alloc]initWithParent:nil];
	
	[mSavedRef copy:backup];
	[mSavedRef copyMat:backup];
	mBackupSaved = true;
	mOnEndHide = hide;
}


-(void) setActive:(bool)active
 {
	mActive = active;
}

-(void)finish
{
    mRepeat = 1;
    mToFinish = true;
}

-(void) apply
{
    
	if (mType == ADT_COLOR)
	{
		
	}
    
    
    mSteps  = mRefCount-1;
    if (mSteps <= 0) {
        [self reset];
        return;
    }
    float diff = (float)mAnimDelay/ (float)mSteps;
    mTimeStep = diff;
    mActive = true;
	mDifftime = 0;	
}

-(bool) process:(double)delta copy:(bool)copyref 
{
    /*
    if (mSavedRef == nil)
    {
        return false;
    } */   
    
    mDifftime += delta;
    if (mToFinish || mDifftime >= mAnimDelay) {
        mRepeat --;
        if (mRepeat <= 0) 
        {
			if (mType == ADT_COLOR)
			{
				[self setColorEnd];
			}
			
            // remove anim
            //Log.d("model", "anim end");
            [self reset];
            return false;
        } else
        {
            mDifftime = 0;
        }
        
    }
    
    
    float perct = [self setRef:mDifftime];
	if (mType == ADT_COLOR)
	{
		[self calcLinearColor:mCurrSourceCol dest:mCurrDestCol p:perct];
	}else 
	if (mType == ADT_SCROLLER)
	{
		[self calcLinearScroller:perct];
	}
    //NSLog(@" sav %d = %f %f %f %d",mSavedRef,mSavedRef.mPosition[0],mSavedRef.mPosition[1],mSavedRef.mPosition[2], mSavedRef.mAdded);
    return true;
}

-(void) addFrameColor:(GLColor*) c
 {
	if (mColorPool == nil)
	{
		mColorPool= [[NSMutableArray alloc] init];;
		for (int a=0; a< mMaxFrames; a++) 
		{
            GLColor* col = [[[GLColor alloc] init] autorelease];
			[mColorPool addObject:col];
		}			
	}
	if (mRefCount < mMaxFrames) {
		GLColor* col = [mColorPool objectAtIndex:mRefCount++];
		[self copyColor:c dst:col];
	}
	
	mType  = ADT_COLOR;
}

-(void) setCallback:(NSString*) callback
 {
	mCallback = callback;
}

-(void) setAnimTime:(NSString*) type 
{
	// time , type
	NSArray* tok = [type componentsSeparatedByString:@","];
	long delay = [[tok objectAtIndex:0] intValue];
	
	mDifftime = 0;
	mAnimDelay += delay;
}

-(void)addFrame:(AnimFactory_AnimFrame*)animFrame ref:(GameonModelRef*) ref
{
	
	if (animFrame.rotateActive && animFrame.rotate != nil)
	{
		ref.mRotation[0] += animFrame.rotate[0];
		ref.mRotation[1] += animFrame.rotate[1];
		ref.mRotation[2] += animFrame.rotate[2];
	}
	
	if (animFrame.rotate2Active && animFrame.rotate2 != nil)
	{
		ref.mAreaRotation[0] += animFrame.rotate2[0];
		ref.mAreaRotation[1] += animFrame.rotate2[1];
		ref.mAreaRotation[2] += animFrame.rotate2[2];
	}
	
	if (animFrame.translate2Active && animFrame.translate2 != nil)
	{
		ref.mAreaPosition[0] += animFrame.translate2[0];
		ref.mAreaPosition[1] += animFrame.translate2[1];
		ref.mAreaPosition[2] += animFrame.translate2[2];
	}		
	
	if (animFrame.translateActive && animFrame.translate != nil)
	{
		ref.mPosition[0] += animFrame.translate[0];
		ref.mPosition[1] += animFrame.translate[1];
		ref.mPosition[2] += animFrame.translate[2];
	}		

	if (animFrame.scaleActive && animFrame.scale != nil)
	{
		ref.mScale[0] += animFrame.scale[0];
		ref.mScale[1] += animFrame.scale[1];
		ref.mScale[2] += animFrame.scale[2];
	}		

	
}
-(void) setup:(AnimFactory_AnimType*) atype values:(float*)values count:(int)count ref:(GameonModelRef*) ref 
{
	// start to end
	// setup start
	if (mStart == nil)
		mStart = [[AnimData_AnimFrame alloc] init];
	if (mEnd == nil)
		mEnd = [[AnimData_AnimFrame alloc] init];

	[self maskFrames2:mStart inFrame:[atype.frames objectAtIndex:0]];
	[self maskFrames2:mEnd inFrame:[atype.frames lastObject]];
	[self clearArrays:mStart inFrame:[atype.frames objectAtIndex:0]];
	[self clearArrays:mEnd inFrame:[atype.frames lastObject]];
	[self fillFrameStart:mStart atype:atype ref:ref];
	[self fillFrameEnd:mEnd atype:atype values:values count:count ref:ref];
}

-(void) setup2:(AnimFactory_AnimType*)atype start:(GameonModelRef*)start end:(GameonModelRef*)end 
{
	// start to end
	// setup start
	if (mStart == nil)
		mStart = [[AnimData_AnimFrame alloc] init];
	if (mEnd == nil)
		mEnd = [[AnimData_AnimFrame alloc] init];

	if ([atype.frames count] == 1)
	{
		[self addFrame:[atype.frames objectAtIndex:0] ref:end];
	}
		
	
	[self maskFrames:mStart endFrame:mEnd start:start end:end];
	[self maskFrame:mStart start:start end:end];
	[self fillFrameStart:mStart atype:atype ref:start];
	[self fillFrameEnd2:mEnd atype:atype ref:end];
	
	
	if ([atype.frames count] > 2)
	{
		[self fillFrames:atype start:start end:end];
	}
}


-(void) activate
 {
	mDifftime = 0;
	[mApp.anims incCount];
}

-(bool) process2:(GameonModelRef*)ref delta:(long) diff
{
	mDifftime += diff;
	if (mDifftime >= mAnimDelay)
	{
		mAnimRepeat --;
		if (mAnimRepeat > 0)
		{
			mDifftime = 0;
			
			if (mRepeatDir == 1)
			{
				// which direction?
				AnimData_AnimFrame* tmp = mStart;
				mStart = mEnd;
				mEnd = tmp;
				mRepeatDir = -1;
			}else if (mRepeatDir == -1)
			{
				AnimData_AnimFrame* tmp = mStart;
				mStart = mEnd;
				mEnd = tmp;
				mRepeatDir = 1;					
			}
			
			return false;
		}
		
		mDifftime = mAnimDelay;
		[self endAnimation:ref];

		if (mCallback != nil && [mCallback length] > 0)
		{
			[mApp execScript:mCallback];
		}
		return true;
	}
	// process animation
	float p = (float)mDifftime / (float)mAnimDelay;
	if (mActiveFrames == 0)
	{
		[self calcLinearData:mStart end:mEnd p:p ref:ref];
	}
	else
	{
		// get frames! - get new p for frame!
		int steps = mActiveFrames + 1; // for start and end
		int frame = (int)floor( (double)p * steps);
		float timeStep = (float)(mAnimDelay) / (float)steps;
		float p2 = (mDifftime - ((float)frame * (float)timeStep)) / (float)timeStep;
		if (frame == 0)
		{
			[self calcLinearData:mStart end:[mFrames objectAtIndex:0] p:p2 ref:ref];
		}else if(frame >= steps-1) 
		{
			[self calcLinearData:[mFrames lastObject] end:mEnd p:p2 ref:ref];
		}else if (frame < [mFrames count])
		{
			[self calcLinearData:[mFrames objectAtIndex:frame-1] end:[mFrames objectAtIndex:frame] p:p2 ref:ref];
		}
	}
	return false;
}


-(void)calcLinearScroller:(float) perct
{
	if (mAreaOwner != nil)
	{
		float currval = mAreaOwner.mScrollers[0];
		float newval = currval + (mPerctVal - currval)*perct;
		if (newval < mPerctMin)
		{
			newval = mPerctMin;
		}else 
		if (newval > mPerctMax)
		{
			newval = mPerctMax;
		}
		[mAreaOwner setScrollerVal:newval];
	}
}

-(void)cancelAnimation:(GameonModelRef*)ref
{
	[self endAnimation:ref];
}

-(void)addScrollerData:(float)add delay:(int)delay min:(float)min max:(float) max
{
	mType = ADT_SCROLLER;
	mPerctDiff = -add;
	if (mPerctVal == -1)
	{
		mPerctVal = mAreaOwner.mScrollers[0];
	}else
	{
		mPerctVal -= add;
	}
	mDifftime = 0;
	mAnimDelay = (double)delay;
	mPerctMin = min;
	mPerctMax = max;
	mSteps = 1 ;
	mActive = true;
	mTimeStep = mAnimDelay; 
}

-(void)cancel
{
	[self reset];
	
}
@end
