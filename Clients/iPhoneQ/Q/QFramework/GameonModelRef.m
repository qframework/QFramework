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

#import "GameonModelRef.h"
#import "GMath.h"
#import "GameonModel.h"
#import "AnimData.h"

@implementation GameonModelRef

@synthesize mPosition;
@synthesize mRotation;
@synthesize mScale;
@synthesize mLoc;
@synthesize mTransformOwner;
@synthesize mOwner;
@synthesize mOwnerMax;
@synthesize mMatrix;
@synthesize mAnimating;
@synthesize mEnabled;
@synthesize mAreaPosition;
@synthesize mAreaRotation;
@synthesize mScaleAdd;

static float mStaticBounds[] =  
{ 
    -0.5f,-0.5f,0.0f,1.0f,
    0.5f,-0.5f,0.0f,1.0f,
    -0.5f,0.5f,0.0f,1.0f,
    0.5f,0.5f,0.0f,1.0f 
};


- (id) initWithParent:(GameonModel*)parent
{
	if (self = [super init])
	{
        mPosition = malloc(3 * sizeof(GLfloat));
        mPosition[0] = 0;
        mPosition[1] = 0;
        mPosition[2] = 0;

        mRotation = malloc(3 * sizeof(GLfloat));        
        mRotation[0] = 0;
        mRotation[1] = 0;
        mRotation[2] = 0;

        mAreaPosition = malloc(3 * sizeof(GLfloat));
        mAreaPosition[0] = 0;
        mAreaPosition[1] = 0;
        mAreaPosition[2] = 0;

        mAreaRotation = malloc(3 * sizeof(GLfloat));        
        mAreaRotation[0] = 0;
        mAreaRotation[1] = 0;
        mAreaRotation[2] = 0;

		
        
        mScale = malloc(3 * sizeof(GLfloat));
        mScale[0] = 1;
        mScale[1] = 1;
        mScale[2] = 1;

        mScaleAdd = malloc(3 * sizeof(GLfloat));
        mScaleAdd[0] = 1;
        mScaleAdd[1] = 1;
        mScaleAdd[2] = 1;
		
        mBounds = malloc(16 * sizeof(GLfloat));
        mMatrix = malloc(16 * sizeof(GLfloat));
		matrixIdentity(mMatrix);
        mTransformOwner = false;
        mParent = parent;
        mAdded = false;
        mLoc = GWLOC_WORLD;
        mVisible = false;
		mAnimData = nil;
		mAnimating = false;
    }
    return self;
}


- (id) init
{
    return [self initWithParent:nil];
}


-(void) dealloc
{
    free(mPosition);
    free(mScale);
    free(mRotation);
    free(mAreaPosition);
    free(mScaleAdd);
    free(mAreaRotation);
	free(mBounds);
	free(mMatrix);
    [mAnimData release];
    [super  dealloc];
}

- (void) setParent:(GameonModel*)parent
{
    mParent = parent;
}

- (void) clear
{
    mPosition[0] = 0.0f;
    mPosition[1] = 0.0f;
    mPosition[2] = 0.0f;
    
    mRotation[0] = 0.0f;
    mRotation[1] = 0.0f;
    mRotation[2] = 0.0f;
    
    mAreaPosition[0] = 0.0f;
    mAreaPosition[1] = 0.0f;
    mAreaPosition[2] = 0.0f;
    
    mAreaRotation[0] = 0.0f;
    mAreaRotation[1] = 0.0f;
    mAreaRotation[2] = 0.0f;

    mScale[0] = 1.0f;
    mScale[1] = 1.0f;
    mScale[2] = 1.0f;

    mScaleAdd[0] = 1.0f;
    mScaleAdd[1] = 1.0f;
    mScaleAdd[2] = 1.0f;
    
    mTransformOwner = false;
    mOwner = 0;
}

- (void) setOwner:(int)owner max:(int) ownerMax
{
    mOwner = owner;
    mOwnerMax = ownerMax;
    mTransformOwner = true;
}



- (void) setPosition:(float)ax y:(float)ay z:(float)az 
{
    
    mPosition[0] = ax;
    mPosition[1] = ay;
    mPosition[2] = az;    	
}

- (void) setAreaPosition:(float)ax y:(float)ay z:(float)az 
{
    
    mAreaPosition[0] = ax;
    mAreaPosition[1] = ay;
    mAreaPosition[2] = az;    	
}

- (void) setAreaPosition:(float*)position
{
    
    mAreaPosition[0] = position[0];
    mAreaPosition[1] = position[1];
    mAreaPosition[2] = position[2];    	
}


- (void) addPosition:(float)ax y:(float)ay z:(float)az 
{
    
    mPosition[0] += ax;
    mPosition[1] += ay;
    mPosition[2] += az;    	
}

- (void) addAreaPosition:(float)ax y:(float)ay z:(float)az 
{
    
    mAreaPosition[0] += ax;
    mAreaPosition[1] += ay;
    mAreaPosition[2] += az;    	
}

- (void) setScale:(float)ax y:(float)ay z:(float)az {
    mScale[0] = ax;
    mScale[1] = ay;
    mScale[2] = az;  
}

- (void) setScale:(float*)scale
{
    mScale[0] = scale[0];
    mScale[1] = scale[1];
    mScale[2] = scale[2];  
}

- (void) setScaleAdd:(float)ax y:(float)ay z:(float)az {
    mScaleAdd[0] = ax;
    mScaleAdd[1] = ay;
    mScaleAdd[2] = az;  
}


- (void) setRotate:(float)ax y:(float)ay z:(float)az {
    mRotation[0] = ax;
    mRotation[1] = ay;
    mRotation[2] = az;  
}

- (void) setRotate:(float*)rotate
{
    mRotation[0] = rotate[0];
    mRotation[1] = rotate[1];
    mRotation[2] = rotate[2];  
}


- (void) addRotation:(float)ax y:(float)ay z:(float)az {
    mRotation[0] += ax;
    mRotation[1] += ay;
    mRotation[2] += az;  
}

- (void) addAreaRotation:(float)ax y:(float)ay z:(float)az {
    mAreaRotation[0] += ax;
    mAreaRotation[1] += ay;
    mAreaRotation[2] += az;  
}

- (void) setAreaRotate:(float)ax y:(float)ay z:(float)az {
    mAreaRotation[0] = ax;
    mAreaRotation[1] = ay;
    mAreaRotation[2] = az;  
}

- (void) setAreaRotate:(float*)rotate
{
    mAreaRotation[0] = rotate[0];
    mAreaRotation[1] = rotate[1];
    mAreaRotation[2] = rotate[2];  
}

- (void) apply
{
    if (!mAdded) {
        mAdded = true;
        [mParent addref:self];
        //[self setVisible:true];
    }
}
- (void) remove
{
    [mParent removeref:self];
    mAdded = false;
    [self setVisible:false];
}

- (void) copy:(GameonModelRef*)modelRef {
    
    mPosition[0] = modelRef.mPosition[0];
    mPosition[1] = modelRef.mPosition[1];
    mPosition[2] = modelRef.mPosition[2];

    mAreaPosition[0] = modelRef.mAreaPosition[0];
    mAreaPosition[1] = modelRef.mAreaPosition[1];
    mAreaPosition[2] = modelRef.mAreaPosition[2];
	
    mScale[0] = modelRef.mScale[0];
    mScale[1] = modelRef.mScale[1];
    mScale[2] = modelRef.mScale[2];
    
	mScaleAdd[0] = modelRef.mScaleAdd[0];
    mScaleAdd[1] = modelRef.mScaleAdd[1];
    mScaleAdd[2] = modelRef.mScaleAdd[2];	
    
    mRotation[0] = modelRef.mRotation[0];
    mRotation[1] = modelRef.mRotation[1];
    mRotation[2] = modelRef.mRotation[2];
	
    mAreaRotation[0] = modelRef.mAreaRotation[0];
    mAreaRotation[1] = modelRef.mAreaRotation[1];
    mAreaRotation[2] = modelRef.mAreaRotation[2];
    
    mLoc = modelRef.mLoc;
}

 

- (float) distxy:(GameonModelRef*) from 
{
    float dist = (float)sqrt((double)( (from.mPosition[0] - mPosition[0])*
                                           (from.mPosition[0] - mPosition[0]) +
                                           (from.mPosition[1] - mPosition[1])*
                                           (from.mPosition[1] - mPosition[1])));
    return dist;
}


- (float) distxyMat:(GameonModelRef*) from 
{
										   
	float dist = (float)sqrt((double)( (from.mMatrix[12] - mMatrix[12])*
							(from.mMatrix[12] - mMatrix[12]) +
							(from.mMatrix[13] - mMatrix[13])*
							(from.mMatrix[13] - mMatrix[13])));
										   
    return dist;
}



-(void) set
{
	matrixIdentity(mMatrix);

	if (mAreaPosition[0] != 0.0f || mAreaPosition[1] != 0.0f || mAreaPosition[2] != 0.0f)
	{
		matrixTranslate(mMatrix, mAreaPosition[0], mAreaPosition[1], mAreaPosition[2]);
	}
	
	if (mAreaRotation[0] != 0.0f || mAreaRotation[1] != 0.0f || mAreaRotation[2] != 0.0f)
	{
	
		matrixRotate(mMatrix,mAreaRotation[0], 1, 0, 0);
		matrixRotate(mMatrix,mAreaRotation[1], 0, 1, 0);
		matrixRotate(mMatrix,mAreaRotation[2], 0, 0, 1);
	}
	
	if (mPosition[0] != 0.0f || mPosition[1] != 0.0f || mPosition[2] != 0.0f)
	{
	
		matrixTranslate(mMatrix, mPosition[0], mPosition[1], mPosition[2]);
	}
	
	if (mRotation[0] != 0.0f || mRotation[1] != 0.0f || mRotation[2] != 0.0f)
	{
	
		matrixRotate(mMatrix,mRotation[0], 1, 0, 0);
		matrixRotate(mMatrix,mRotation[1], 0, 1, 0);
		matrixRotate(mMatrix,mRotation[2], 0, 0, 1);
	}
	
	if (mScale[0]!= 1.0f  || mScale[1] != 1.0f || mScale[2] != 1.0f ||
		mScaleAdd[0] != 1.0f || mScaleAdd[1] != 1.0f || mScaleAdd[2] != 1.0f )
	{
	
		matrixScale(mMatrix, mScale[0]*mScaleAdd[0],mScale[1]*mScaleAdd[1],mScale[2]*mScaleAdd[2]);
	}
    
    matrixVecMultiply2(mMatrix, mStaticBounds, 0 , mBounds,0);
    matrixVecMultiply2(mMatrix, mStaticBounds, 4 , mBounds,4);
    matrixVecMultiply2(mMatrix, mStaticBounds, 8 , mBounds,8);
    matrixVecMultiply2(mMatrix, mStaticBounds, 12 , mBounds,12);
    
    /*
    
    NSLog(@" %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f ",
          mMatrix[0],mMatrix[1],mMatrix[2],mMatrix[3],
          mMatrix[4],mMatrix[5],mMatrix[6],mMatrix[7],
          mMatrix[8],mMatrix[9],mMatrix[10],mMatrix[11],
          mMatrix[12],mMatrix[13],mMatrix[14],mMatrix[15]);          	
     */
}

-(void) translate:(float)x y:(float)y z:(float) z
{
	matrixTranslate(mMatrix, x, y, z);
}

-(void) setVisible:(bool) visible
{
	mEnabled = true;
	mVisible = visible;
	if (visible)
	{
		if (mParent != nil)[mParent addVisibleRef:self];
	}else
	{
		if (mParent != nil)[mParent remVisibleRef:self];
		if (mAnimating && mAnimData != nil)
		{
			[mAnimData cancelAnimation:self];
			mAnimating = false;
		}		
	}
}

-(bool) getVisible
{
	return mVisible;
}

-(void) copyMat:(GameonModelRef*) ref
{
	for (int a= 0; a< 16; a++)
	{
		mMatrix[a] = ref.mMatrix[a];
	}
}

-(void) setAddScale:(float*)addScale 
{
	mScaleAdd[0] = addScale[0];
	mScaleAdd[1] = addScale[1];
	mScaleAdd[2] = addScale[2];
}


-(void) mulScale:(float*)scale
 {
	mScale[0] *= scale[0];
	mScale[1] *= scale[1];
	mScale[2] *= scale[2];
}

-(void) mulScale:(float)x y:(float)y z:(float) z 
{
	mScale[0] *= x;
	mScale[1] *= y;
	mScale[2] *= z;
	
}

-(float) intersectsRay:(float*)eye ray:(float*)ray loc:(float*)loc
{
	// transform bounds!
	float dist = rayIntersectsBounds(eye, ray, mBounds , loc);
	if (dist >= 0)
	{
		return dist;
	}
	return 1e6f;
}

-(AnimData*) getAnimData:(GameonApp*)app
{
	if (mAnimData == nil)
	{
		mAnimData = [[AnimData alloc] initWithId:-1 app:app];
	}
	return mAnimData;
}

-(void) activateAnim
{
	if (mAnimData == nil)
		return;		
	mAnimating = true;
	[mAnimData activate];
}

-(void) animate:(long) deltaTime 
{
	if (mAnimData == nil)
		return;
	if ([mAnimData process2:self delta:deltaTime])
	{
		mAnimating = false;
	}
	
}

-(bool) animating
{
	return mAnimating;
}

-(float*) matrix 
{
	return mMatrix;
}


@end
