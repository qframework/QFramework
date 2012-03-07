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

#import "AnimFactory.h"
#import "AnimData.h"
#import "LayoutItem.h"
#import "ServerkoParse.h"
#import "GameonModelRef.h"
#import "GameonApp.h"
#import "ObjectsFactory.h"
#include <time.h>

@implementation AnimFactory_AnimFrame


@synthesize  rotate;
@synthesize  scale;
@synthesize  translate;
@synthesize  rotate2;
@synthesize  scale2;
@synthesize  translate2;
@synthesize  rotateActive;
@synthesize  rotate2Active;
@synthesize  scaleActive;
@synthesize  scale2Active;
@synthesize  translateActive;
@synthesize  translate2Active;
@synthesize  operation;

- (id)init
{
    self = [super init];
    
    if (self) {
		rotate = NULL;
        scale = NULL;
        translate = NULL;
        
        rotate2 = NULL;
        scale2 = NULL;
        translate2 = NULL;
        
        rotateActive = false;
        rotate2Active = false;
        scaleActive = false;
        scale2Active = false;
        translateActive = false;
        translate2Active = false;
        operation = nil;
        
    }
    
    return self;
}

-(void) dealloc 
{
    if(rotate)
        free(rotate);
    if(scale)
        free(scale);
    if(translate)
        free(translate);
    if(rotate2)
        free(rotate2);
    if(scale2)
        free(scale2);
    if(translate2)
        free(translate2);
    
    [operation release];
    [super dealloc];
}        

@end

@implementation AnimFactory_AnimType

@synthesize animid;
@synthesize frames;
@synthesize repeat;
@synthesize delay;


- (id)init
{
    self = [super init];
    
    if (self) {
        animid = nil;
        frames = nil;
        repeat = 1;
        delay = 1000;
    }
    return self;
}


@end


@implementation AnimFactory

-(void) dealloc 
{
	[mAnimPool release];
	[mAnimations release];
    [super dealloc];
}

-(void)buildObjectAdata:(GameonModelRef*)ref atype:(AnimFactory_AnimType*)atype delay:(int)delay repeat:(int)repeat data:(NSString*)data callback:(NSString*) callback
{
	AnimData* adata = [ref getAnimData:mApp];
	// fill anim data!
	
	// for object destination is stored in data
	float values[32];
	int count = [ServerkoParse parseFloatArray:values max:32 forData:data];
	[adata setDelay:delay repeat:repeat];    	
	[adata setup:atype values:values count:count ref:ref];

	[adata setCallback:callback];
	[ref activateAnim];
	
	
}

-(void)processAnimFrame:(NSMutableDictionary*)objData  forFrame:(AnimFactory_AnimFrame*)frame 
{

	int count = 0;
	NSString* rotate = [objData valueForKey:@"rotate"];
	if (rotate != nil)
	{
		frame.rotate = malloc(sizeof(float)*3);
		count = [ServerkoParse parseFloatArray:frame.rotate max:3 forData:rotate];
		frame.rotateActive = count > 0;
	}

	NSString* scale = [objData valueForKey:@"scale"];
	if (scale != nil)
	{
		frame.scale= malloc(sizeof(float)*3);
		count = [ServerkoParse parseFloatArray:frame.scale max:3 forData:scale];
		frame.scaleActive = count > 0;
	}

	NSString* translate = [objData valueForKey:@"translate"];
	if (translate != nil)
    {
		frame.translate= malloc(sizeof(float)*3);
		count = [ServerkoParse parseFloatArray:frame.translate max:3 forData:translate];
		frame.translateActive = count > 0;
	}

	NSString* rotate2 = [objData valueForKey:@"rotate2"];
	if (rotate2 != nil)
	{
		frame.rotate2 = malloc(sizeof(float)*3);
		count = [ServerkoParse parseFloatArray:frame.rotate2 max:3 forData:rotate2];
		frame.rotate2Active = count > 0;
	}

	NSString* translate2 = [objData valueForKey:@"translate2"];
	if (translate2 != nil)
	{
		frame.translate2= malloc(sizeof(float)*3);
		count = [ServerkoParse parseFloatArray:frame.translate2 max:3 forData:translate2];
		frame.translate2Active = count > 0;
	}

	NSString* operation = [objData valueForKey:@"operation"];
	if (operation != nil)
	{
		frame.operation = [[NSString alloc]initWithString:operation];
	}			
	
}


// public members

-(id) initWithApp:(GameonApp*)app
{
    self = [super init];
    
    if (self) {    
        mApp = app;
        mAnimPool = [[NSMutableArray alloc] init]; 
        for (int a=0; a< ANIM_POOL_LEN; a++ ) {
            AnimData* adata = [[[AnimData alloc] initWithId:a app:app] autorelease];
            [mAnimPool addObject:adata];
        }
        
        mAnimations = [[NSMutableDictionary alloc] init];
        mCount = 0;
    }
    return self;
}

-(AnimData*) get
{
    for (int a=0; a< ANIM_POOL_LEN ; a++) 
    {
        AnimData* ad = [mAnimPool objectAtIndex:a];
        if (ad.isActive == false) 
        {            
            ad.mActive = true;
            //Log.d("model", "aget " + a);
            mCount ++;
            return ad;
        }
    }
    return mFallback;
}


-(void) process:(float)framedelta
{

    for (int a=0; a< ANIM_POOL_LEN; a++) {
        AnimData* ad = [mAnimPool objectAtIndex:a];
        if (ad.isActive == true) {
            if ([ad process:framedelta copy:true] == false)
            {
                //mCount--;
                //NSLog(@"model animcnt = %d",mCount);
            }
        }
    }
}

-(void) add:(AnimData*) anim
 {
    
    anim.mActive = true;
}


-(void) createAnimColor:(int)delay c1:(GLColor*) color1
		c2:(GLColor*)color2 c3:(GLColor*) color3
{
	// TODO Auto-generated method stub
    AnimData* adata = [self get];
	
	[adata setDelay:delay repeat:1];
	[adata addFrameColor:color1];
    [adata addFrameColor:color2];
	if (color3 != nil)
		[adata addFrameColor:color3];
	[adata apply];
}


////
-(void)move:(NSString*) name loc:(NSString*) location data:(NSString*)data callback:(NSString*) callback
{
	[self animObject:@"move" objid:name data:location delay:data callback:callback];
}
-(void)rotate:(NSString*) name angle:(NSString*)angles data:(NSString*)data callback:(NSString*) callback
{
	[self animObject:@"rotate" objid:name data:angles delay:data callback:callback];
}	

-(void)initAnimation:(NSMutableDictionary*)response
{
	// init layout
    NSMutableArray* frames = [response valueForKey:@"frames"];
	AnimFactory_AnimType* atype =[[ AnimFactory_AnimType alloc] init];
	atype.frames = [[NSMutableArray alloc ]init];
	
	NSString* animid = [response valueForKey:@"id"];
	if (animid != nil)
	{
		atype.animid = [NSString stringWithString:animid];
	}

	NSString* delay = [response valueForKey:@"delay"];
	if (delay != nil)
	{
		atype.delay = [[NSString stringWithString:delay] intValue];
	}    
	
	NSString* repeat = [response valueForKey:@"repeat"];
	if (delay != nil)
	{
		atype.repeat = [[NSString stringWithString:repeat] intValue];
	}    
	
    for (int a=0; a< [frames count]; a++)
    {
        NSMutableDictionary* pCurr = [frames objectAtIndex:a];
        AnimFactory_AnimFrame* frame = [[AnimFactory_AnimFrame alloc] init];
        [self processAnimFrame:pCurr forFrame:frame];        
		[atype.frames addObject:frame];
    } 

	[mAnimations setObject:atype forKey:atype.animid];

}


-(void)animObject:(NSString*)animid objid:(NSString*)objectid data:(NSString*)data delay:(NSString*)delaydata callback:(NSString*)callback
{
	// find AnimType
	AnimFactory_AnimType* atype = [mAnimations objectForKey:animid];
	
	if (atype == nil)
	{
		return;
	}
	
	LayoutItem* item = [mApp.objects get:objectid];
	GameonModelRef* ref = item.mModelRef;
	
	int intdata[16];
	int count = [ServerkoParse parseIntArray:intdata max:16 forData:delaydata];
	
	// find ref

	// generate AnimData from AnimType
	// configure AnimData with ref!
	int repeat = atype.repeat;
	int delay = atype.delay;
	if (count >= 1)
		delay = intdata[0];    	
	if (count == 2)
		repeat = intdata[1];
	[self buildObjectAdata:ref atype:atype delay:delay repeat:repeat data:data callback:callback];
	  
	// ref - is animated! - has AnimData, once allocated
	
	
}

-(void)animRef:(NSString*)animid start:(GameonModelRef*)start end:(GameonModelRef*)end delay:(NSString*)delaydata
{
	AnimFactory_AnimType* atype = [mAnimations objectForKey:animid];
	
	if (atype == nil)
	{
		return;
	}

	int intdata[16];
	int count = [ServerkoParse parseIntArray:intdata max:16 forData:delaydata];
	
	// find ref

	// generate AnimData from AnimType
	// configure AnimData with ref!
	int repeat = atype.repeat;
	int delay = atype.delay;
	if (count >= 1)
		delay = intdata[0];    	
	if (count == 2)
		repeat = intdata[1];

	
	AnimData* adata = [end getAnimData:mApp];

	[adata setDelay:delay repeat:repeat];
	[adata setup2:atype start:start end:end];
	[end activateAnim];
}

-(void)createAnim:(GameonModelRef*)start
		end:(GameonModelRef*)end def:(GameonModelRef*)def 
		delay:(int)delay steps:(int)steps owner:(LayoutItem*)owner 
		repeat:(int)repeat hide:(bool)hide 
{

	AnimData* adata = [def getAnimData:mApp];
	AnimFactory_AnimType* atype = [mAnimations objectForKey:@"transform"];
	[adata setDelay:delay repeat:repeat];
	[adata setup2:atype start:start end:end];
	[adata saveBackup:def tohide:hide];
	[def activateAnim];
	
}


-(int)getCount
{
    return mCount;
}

-(void) decCount
{
    mCount--;
}

-(void) incCount
{
    mCount++;
}

-(AnimData*) getScollerAnim:(LayoutArea*) owner
{
	AnimData* adata = nil;
	for (int a=0; a< ANIM_POOL_LEN; a++) 
	{
		AnimData* data = [mAnimPool objectAtIndex:a]; 
		if (![data isActive]) 
		{
			if (data.mAreaOwner != nil && data.mAreaOwner == owner)
			{
				adata = data;
				break;
			}
			if (adata == nil)
			{
				adata = data;
			}
		}
	}
	return adata;
}

-(void) animModelRef:(NSString*)animid ref:(GameonModelRef*)ref delay:(NSString*)delaydata data:(NSString*)data
{
	// find AnimType
	AnimFactory_AnimType* atype = [mAnimations objectForKey:animid];
	if (atype == nil)
	{
		return;
	}	
	
	int intdata[16];
	int count = [ServerkoParse parseIntArray:intdata max:16 forData:delaydata];
	
	// find ref

	// generate AnimData from AnimType
	// configure AnimData with ref!
	int repeat = atype.repeat;
	int delay = atype.delay;
	if (count >= 1)
		delay = intdata[0];    	
	if (count == 2)
		repeat = intdata[1];
		
	[self buildObjectAdata:ref atype:atype delay:delay repeat:repeat data:data callback:nil];
}	

@end

