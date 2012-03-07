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

#import <Foundation/Foundation.h>
@class GameonModelRef;
@class LayoutItem;
@class AnimData;
@class GLColor;
@class GameonApp;
@class LayoutArea;

@interface AnimFactory_AnimFrame : NSObject
{

	float *rotate;
	float *scale;
	float *translate;

	float *rotate2;
	float *scale2;
	float *translate2;

	bool rotateActive;
	bool rotate2Active;
	bool scaleActive;
	bool scale2Active;
	
	bool translateActive;
	bool translate2Active;
	
	NSString* operation;

};

@property (nonatomic, assign) float *rotate;
@property (nonatomic, assign) float *scale;
@property (nonatomic, assign) float *translate;
@property (nonatomic, assign) float *rotate2;
@property (nonatomic, assign) float *scale2;
@property (nonatomic, assign) float *translate2;
@property (nonatomic, assign) bool rotateActive;
@property (nonatomic, assign) bool rotate2Active;
@property (nonatomic, assign) bool scaleActive;
@property (nonatomic, assign) bool scale2Active;
@property (nonatomic, assign) bool translateActive;
@property (nonatomic, assign) bool translate2Active;
@property (nonatomic, assign) NSString* operation;

@end


@interface AnimFactory_AnimType : NSObject
{
	NSString* animid;
	NSMutableArray* frames;
	int	repeat;
	int delay;
}

@property (nonatomic, assign) NSString* animid;
@property (nonatomic, assign) NSMutableArray* frames;
@property (nonatomic, assign) int	repeat;
@property (nonatomic, assign) int delay;

@end

#define ANIM_POOL_LEN 16

@interface AnimFactory : NSObject {

	NSMutableDictionary* mAnimations;
	NSMutableArray* mAnimPool;
	AnimData* mFallback;
	int mCount;
	GameonApp*	mApp;
}

-(id) initWithApp:(GameonApp*)app;
-(AnimData*) get;
-(void) process:(float)framedelta;
-(void) add:(AnimData*) anim;
-(void) createAnimColor:(int)delay c1:(GLColor*) color1
		c2:(GLColor*)color2 c3:(GLColor*) color3;
-(void) process:(float)framedelta;
-(void)move:(NSString*) name loc:(NSString*) location data:(NSString*)data callback:(NSString*) callback;
-(void)rotate:(NSString*) name angle:(NSString*)angles data:(NSString*)data callback:(NSString*) callback;
-(void)initAnimation:(NSMutableDictionary*)response;
-(void)animObject:(NSString*)animid objid:(NSString*)objectid data:(NSString*)data delay:(NSString*)delaydata callback:(NSString*)callback;
-(void)animRef:(NSString*)animid start:(GameonModelRef*)start end:(GameonModelRef*)end delay:(NSString*)delaydata;	
-(void)createAnim:(GameonModelRef*)start
		end:(GameonModelRef*)end def:(GameonModelRef*)def 
		delay:(int)delay steps:(int)steps owner:(LayoutItem*)owner 
		repeat:(int)repeat hide:(bool)hide ;
			
-(void) decCount;
-(void) incCount;
-(int) getCount;
-(void) animModelRef:(NSString*)animid ref:(GameonModelRef*)ref delay:(NSString*)delaydata data:(NSString*)data;
-(AnimData*) getScollerAnim:(LayoutArea*) owner;

@end
