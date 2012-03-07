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


#import "LayoutItem.h"
#import "GameonWorld.h"
#import "GameonModelRef.h"
#import "AnimFactory.h"
#import "AnimData.h"

#include "stdlib.h"
#define ARC4RANDOM_MAX      0x100000000

@implementation LayoutItem


@synthesize  mModel;
@synthesize  mModelRef;
@synthesize  mType;
@synthesize  mOwner;
@synthesize  mOwnerMax;

- (id) init
{
	if (self = [super init])
	{
        mModel = nil;
        mModelRef = nil;
        mModelRefOld = [[GameonModelRef alloc]init];
        mOwner = 0;
        mOwnerMax = 0;
    }
    
    return self;
}

- (void) dealloc 
{
    [mModelRefOld release];
    [mModelRef release];
    [super dealloc];  
}


-(bool) remove 
{
    if (mModelRef != nil) {
        [mModelRef remove];
        
    }
    return true;
    
}


-(void) setRotation:(float)x y:(float)y z:(float) z 
{
    [mModelRef setRotate:x y:y z:z];
}

-(void) addRotation:(float)x y:(float)y z:(float) z 
{
    [mModelRef addRotation:x y:y z:z];
}


-(void) setPosition:(GameonWorld_Location)loc x:(float)x y:(float)y z:(float)z
                    w:(float)w h:(float)h doeffect:(bool)doeffect {
    
    bool copyref = false;
    if (mModelRef == nil) 
    {
        mModelRef = [[GameonModelRef alloc] init];
        [mModelRef setParent:mModel];
        mModelRef.mLoc = loc;
        copyref = true;
    } else {
        [mModelRefOld copy:mModelRef];			
    }



	[mModelRef setPosition:x y:y z:z+0.01];
	[mModelRef setRotate:0 y:0 z:0 ];    
	[mModelRef setScale:w y:h z:1];
    
    if (copyref) {
        [mModelRefOld copy:mModelRef];
    }		
    
    if (mOwnerMax > 0) {
        [mModelRef setOwner:mOwner max:mOwnerMax];
    }
    
    [mModelRef apply];
    
}

-(float) getRand
{
    float rand = (float)arc4random();
    float val = rand / (float)ARC4RANDOM_MAX;    
    //NSLog( @" %f %f " , rand , val);
    return val;
}

-(void) setRand:(float)x y:(float)y z:(float)z rx:(float)rx ry:(float)ry rz:(float) rz
{
    
    if (x > 0) {
        float add = [self getRand] * x - x/2;
        mModelRef.mPosition[0] +=add ;
    }
    if (y > 0) {
        float add = [self getRand]  * y - y/2;
        mModelRef.mPosition[1] += add;
    }
    if (z > 0) {
        float add = [self getRand] * z - z/2;
        mModelRef.mPosition[2] += add;
    }		
    if (rx > 0) {
        float add = [self getRand] * rx - rx/2;
        mModelRef.mRotation[0] += add;
    }		
    if (ry > 0) {
        float add = [self getRand] * ry - ry/2;
        mModelRef.mRotation[1] += add;
    }		
    if (rz > 0) {
        float add = [self getRand] * rz - rz/2;
        mModelRef.mRotation[2] += add;
    }				
}


-(void)setRotation2:(float)x y:(float)y z:(float)z
{
    if (mModelRef == nil) 
    {
        return;
    }
    
    [mModelRefOld copy:mModelRef];			
    [mModelRef setRotate:x y:y z:z];
    [mModelRef set];
    
}



-(void)setPosition2:(float)x y:(float)y z:(float)z 
{
    
    if (mModelRef == nil) 
    {
        return;
    }
    [mModelRefOld copy:mModelRef];			
    [mModelRef setPosition:x y:y z:z];
    [mModelRef set];
    
}

-(void) setParentLoc:(LayoutArea*) area 
{
	if (mModelRef != nil)
	{
		[mModelRef setAreaPosition:area.mLocation];
		[mModelRef setAreaRotate:area.mRotation];
		[mModelRef mulScale:area.mBounds];
		[mModelRef set];
	}
	
}

@end
