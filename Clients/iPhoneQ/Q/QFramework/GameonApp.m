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

#import "GameonApp.h"
#import "GameonWorld.h"
#import "GameonWorldView.h"
#import "LayoutGrid.h"
#import "AreaIndexPair.h"
#import "GameonCS.h"
#import "SoundFactory.h"
#import "Settings.h"
#import "GameonCS.h"
#import "TextureFactory.h"
#import "LayoutAreaCards.h"
//#import "EAGLView_iPad.h"
#import "AnimFactory.h"
#import "ColorFactory.h"
#import "ItemFactory.h"
#import "TextureFactory.h"
#import "SoundFactory.h"
#import "Settings.h"
#import "ObjectsFactory.h"

@implementation GameonApp

@synthesize mView;
@synthesize mSplashScreen;
@synthesize mSplashX1;
@synthesize mSplashY1;
@synthesize mSplashX2;
@synthesize mSplashY2;
@synthesize mDataGrid;
@synthesize mWorld;
@synthesize mScript;
@synthesize mAnims;
@synthesize mColors;
@synthesize mItems;
@synthesize mTextures;
@synthesize mSounds;
@synthesize mSettings;
@synthesize mObjectsFact;
@synthesize mCS;

#define scorelead @"com.gameon.montescores"
//#define scorelead @"montescores"

static double currentTime()
{

    NSTimeInterval tm = [NSDate timeIntervalSinceReferenceDate];
    return tm * 1000;
}

- (id)init
{
    self = [super init];
    
    if (self) {
        mScript = [[ServerkoParse alloc] init] ;
        mDataGrid = [[LayoutGrid alloc] initWithApp:self];
        [mScript setApp:self];
        
        mWorld = [[GameonWorld alloc] initWithApp:self];
        mView = [[GameonWorldView alloc] initWithWorld:mWorld app:self];
        [mDataGrid setWorld:mWorld app:self];
        //[mWorld test];
        [mView onSurfaceCreated];
        mLayoutInit = false;
		mAnims = [[AnimFactory  alloc] initWithApp:self];
		mColors = [[ColorFactory alloc] init];
		mItems = [[ItemFactory alloc] initWithApp:self];
		mTextures = [[TextureFactory alloc] initWithApp:self];
		mSounds = [[SoundFactory alloc] initWithApp:self];
		mSettings = [[Settings alloc] initWithApp:self];
		mObjectsFact = [[ObjectsFactory alloc] initWithApp:self];
		mCS = [[GameonCS alloc] init];
	
        mResponsesQueue = [[NSMutableArray alloc] init];
        mTextEditing = false;
		mSplashTime = 0;
		mSplashTimeStart = 0;
		mDrawSPlash = false;
		mSplashOutStart = false;
        mTouchEnabled = true;
        
        mSplashX1 = -1.5;
        mSplashX2 = 1.5;
        mSplashY1 = -1.5;
        mSplashY2 = 1.5;	
		
		mDataChange = false;
		mRendering = false;
        mFrameDeltaTime = 0;
        mFrameLastTime = -1;
		
		mLastDrag = (float*)malloc(3 * sizeof(float));
		mLastDrag[0] = 1e07f;
		mLastDist = 0;
		mLastDragTime = 0;
		mLastClickTime = 0;
		mSupportOld = false;
    }
    return self;
}

-(void) dealloc 
{
	free( mLastDrag );
    [mView release];
    [mDataGrid release];
    [mWorld release];
    // problem sa eventima - moras se relasati kada svi eventi odrade?
    // ili imati queue sa timerima
    [mScript release];
    [mSettings release];
    [super dealloc];
}
- (void) start:(NSString*)script preexec:(NSString*)preexec {

    if (preexec != nil)
    {
        [mScript execScript:preexec];
    }
    
    // scripts
    UIApplication.sharedApplication.idleTimerDisabled = YES;   
	[mScript loadScript:script delay:100];
    [mScript start];
}

-(void) onClick:(float*)vec vecHud:(float*)vecHud
{
    if (mTextEditing || !mTouchEnabled)
    {
        return;
	}

	double delay = currentTime() - mLastClickTime;	

    //NSLog(@" onClick %f %f %f %f", x,y,xhud,yhud);    
    AreaIndexPair* field = [mDataGrid onClickNearest:vec vecHud:vecHud];
    if (field != nil && field.mOnclick != nil) {
        // send data
        NSMutableString* datastr = [[[NSMutableString alloc] initWithString:field.mOnclick] autorelease];
		if ([datastr hasPrefix:@"js:"])
		{
			if ([datastr hasSuffix:@";"])
			{
				[mScript execScript:[datastr substringFromIndex:3 ]];
			}else
			{
				NSMutableString* cmd  = [[NSMutableString alloc] initWithString:[datastr substringFromIndex:3]];
				[cmd appendFormat:@"('%@',%d , %d, [%f,%f,%f] , %f);",field.mArea,field.mIndex , (int)delay,field.mLoc[0],field.mLoc[1],field.mLoc[2]  , mLastDist];
				[mScript execScript:cmd];
                [cmd release];
			}
		}else
		{
			[datastr appendFormat:@",%@,%d",field.mArea,field.mIndex];
			[mScript sendUserData:datastr onclick:field.mOnclick];
		} 
        //NSLog(@" Clicked  %@ %@ " , field.mArea , datastr);    
        
    }
    if (mFocused != nil)
    {
        [self onFocusLost:mFocused];
        [mFocused release];        
        mFocused = nil;
    }    	
    
	mLastDist = 0;
    [field release];

}


-(void) performClick:(float)x y:(float)y
{
    float rayVec[3];
    float rayVecHud[3];
    if (!mTouchEnabled)
    {
        return;
    }    
    [mCS screen2spaceVec:x y:y vec:rayVec];
    [mCS screen2spaceVecHud:x y:y vec:rayVecHud];    		
	
	[self onClick:rayVec vecHud:rayVecHud];
	
    
}

-(void) drawFrame
{
	if (mRendering)
		return;
	mRendering = true;
	[self calcFrameDelay];
	
    [self processData];
    
	if (mDrawSPlash)
	{
		mSplashTimeStart += mFrameDeltaTime;
        //NSLog(@" %f %f " , curr - mSplashTimeStart , mSplashTime-800);
		if (mSplashTimeStart > mSplashTime-500)
		{
			if (mSplashOutStart == false)
			{
				[mDataGrid animScreen:@"color" data:@"500,FFFFFFFF,00000000"];
				mSplashOutStart = true;
			}
		}			
		if (mSplashTimeStart > mSplashTime)
		{
			mDrawSPlash = false;
			[mView lockDraw:false];
			[mDataGrid animScreen:@"color" data:@"500,00000000,FFFFFFFF"];
		}
		else
		{
			[mView lockDraw:true];
            [mView drawSplash];
		}
		
	}else
	{
		[mView onDrawFrame];
	}
	if (!mCameraSet)
	{
		[mDataGrid onCameraFit:@"fit" data:@"4.0,0"];
		[mDataGrid onCameraFitHud:@"fit" data:@"4.0,0"];
		mCameraSet = true;
	}	
	mRendering = false;
}

-(void) endScript
{
    //[mScript stopScript];

    if ( mEndGameSelector != nil)
    {
        [mEndGameSelector performSelector:@selector(endGame) withObject:nil];
    }
    UIApplication.sharedApplication.idleTimerDisabled = NO;        
}


-(void) onEndScore:(NSString*) strData
{
}

-(NSString*) filterString:(NSString*) input
{
    NSMutableString *strippedString = [NSMutableString 
                                       stringWithCapacity:input.length];
    
    NSScanner *scanner = [NSScanner scannerWithString:input];
    NSCharacterSet *numbers = [NSCharacterSet 
                               characterSetWithCharactersInString:@":;\"'<>,.±!@#$%6&*()__~`?/}]{[|\\"];
    
    //[scanner setCharactersToBeSkipped:numbers];
    do {
        NSString *ok;
        if([scanner scanUpToCharactersFromSet:numbers intoString:&ok]) [strippedString appendString:ok];
        if ([scanner isAtEnd])
        {
            return strippedString;
        }
        [scanner setScanLocation:([scanner scanLocation] + 1)];

    } while(![scanner isAtEnd]);
    
    return strippedString;
}

-(void) onTextInput:(NSString*)data script:(NSString*)script
{
    mTextInputScript = [[NSString alloc ] initWithString:script];    
    if (mInputTextSelector != nil)
    {
        NSString* stripped = [self filterString:data];
        [mInputTextSelector performSelector:@selector(onTextInput:) withObject:stripped withObject:nil];
        mTextEditing = true;
    }
    
}

-(void) onTextInputEnd:(NSString*)text  finish:(bool)finish
{
    NSString* stripped = [self filterString:text]; 
    NSString* script = [NSString stringWithFormat:@"%@('%@' , %d);", mTextInputScript, stripped, (int)finish];
    //NSLog(@" script %@ ", script);
    [mScript execScript:script];
    mTextEditing = false;
}



-(void) onJSONData:(id)jsonData
{
    NSMutableDictionary* gs = [jsonData valueForKey:@"gs"];
    if (gs == nil)
    {
        return;
    }
    NSMutableArray* room = [gs valueForKey:@"room"];
    if (room == nil)
    {
        return;
    }
    //NSLog(@" ------------  %d " , [room count]);
    for (int a=0; a< [room count]; a++)
    {
        NSMutableDictionary* roomobj = [room objectAtIndex:a];
        if (roomobj == nil)
            return;
        NSString* type = [roomobj valueForKey:@"res"];
        if (type == nil)
            return;
        //NSLog(@"type %@" , type);
        if ([type isEqualToString:@"event"])
        {
            // on event
            [self onEvent2:roomobj];
        }else if ([type isEqualToString:@"layout"])
        {
            // onlayout
            [mDataGrid initLayout2:roomobj];
		}else if ([type isEqualToString:@"texts"])
        {
			// onlayout
			[mTextures initTextures:roomobj];
		}else if ([type isEqualToString:@"objs"]){
			// onlayout
			[mObjectsFact initObjects:roomobj];
		}else if ([type isEqualToString:@"models"]){
			// onlayout
			[mItems initModels:roomobj];
		}else if ([type isEqualToString:@"animation"]){
			// onlayout
			[mAnims initAnimation:roomobj];
		}

//        NSString* restype = 
    }
    
    //NSLog(@" ++++++++++++++  " );    
}


-(void) execResponses
{
    @try {
    
        while( [mResponsesQueue count] > 0)
        {
			mDataChange = true;            
            id jsonData = [mResponsesQueue objectAtIndex:0];
            [self onJSONData:jsonData];
            [mResponsesQueue removeObjectAtIndex:0];
            [jsonData release];
        }

    }@catch (NSException* ex) {
        NSLog(@"ERROR  %@", [ex reason]);
        NSArray *stack = [ex callStackSymbols];
        NSLog(@"ERROR STACK %@", stack);
        return;
    }
    
}
-(void) queueResponses:(NSMutableArray*)responses
{
    for (int a=0; a< [responses count]; a++)
    {
        id response = [responses objectAtIndex:a];
        [response retain];
        [mResponsesQueue addObject:response];
    }
    
}


-(void)setScreenBounds
{
    [mCS getScreenBounds:mScreenb hud:mHudb];
    NSString* script = [NSString stringWithFormat:@"Q.layout.canvasw = %f;Q.layout.canvash = %f;    Q.layout.worldxmin = %f;Q.layout.worldxmax = %f;    Q.layout.worldymin = %f;Q.layout.worldymax = %f;Q.layout.hudxmin = %f;Q.layout.hudxmax = %f;    Q.layout.hudymin = %f;Q.layout.hudymax = %f;",
                        [mCS getCanvasW],
                        [mCS getCanvasH],
                        mScreenb[0], mScreenb[2],
                        mScreenb[5], mScreenb[3],
                        mHudb[0], mHudb[2],
                        mHudb[5], mHudb[3]                        
                        ];
	
    NSLog(@" setScreenBounds %@ ", script);
    [mScript execScript:script];    
}

-(void)sendEvent:(NSString*)resptype script:(NSString*)respdata
{
    int delay = [resptype intValue];
    [mScript execScript:delay script:respdata];
}


-(void)sendExec:(NSString*)resptype script:(NSString*)respdata
{
    int delay = [resptype intValue];
    [mScript execScript:delay script:respdata];    
}

-(void)loadModule:(NSString*)resptype script:(NSString*)respdata
{
    [mScript loadModule:resptype];        
}

-(void)loadModule2:(NSString*)resptype script:(NSString*)respdata
{
    [mScript loadModule2:resptype];
}

-(void)connect:(NSString*)serverip callback:(NSString*)script
{
    [mScript connect:serverip callback:script];
}

-(void)join:(NSString*)data callback:(NSString*)script
{
    NSArray* tokens = [data componentsSeparatedByString:@"|"];
    [mScript join:[tokens objectAtIndex:0] user:[tokens objectAtIndex:1] callback:script];
}


-(void)send:(NSString*)data
{
    [mScript send:data ];
}

-(void)disconnect
{
    [mScript disconnect ];
}


-(void)mouseDragged:(float)x y:(float) y forClick:(bool)notimecheck
 {
	// 
	float rayVec[3];
	float rayVecHud[3];

    if (!mTouchEnabled)
    {
     return;
    }
	
	if (mFrameDeltaTime == 0)
		mLastDragTime += 100;
	else
		mLastDragTime += mFrameDeltaTime;
	if (!notimecheck && mLastDragTime < 50)
	{
        NSLog(@" out of dragg %f " , mLastDragTime);
		return;
	}
	mLastDragTime = 0;
		
    [mCS screen2spaceVec:x y:y vec:rayVec];
    [mCS screen2spaceVecHud:x y:y vec:rayVecHud];

    AreaIndexPair* field = [mDataGrid onDragNearest:rayVec vecHud:rayVecHud];
	
	if (field != nil && mFocused != nil)
	{
		if ([field.mArea isEqual:mFocused.mArea] )
		{
			if (mLastDrag[0] == 1e07f)
			{
				mLastDrag[0] = field.mLoc[0];
				mLastDrag[1] = field.mLoc[1];
				mLastDrag[2] = field.mLoc[2];
				return;
			}else
			{
				float delta0 = field.mLoc[0]-mLastDrag[0];
				float delta1 = field.mLoc[1]-mLastDrag[1];
				float delta2 = field.mLoc[2]-mLastDrag[2];
				mLastDist = (float)sqrt( (delta0*delta0)+(delta1*delta1)+(delta2*delta2) );
				NSLog(@" delta of dragg %f %f %f " , delta0, delta1, delta2);
				LayoutArea* area = [mDataGrid getArea:field.mArea];
				if (area != nil)
				{
					[area onDragg:(field.mLoc[0] -mLastDrag[0])
									y:(field.mLoc[1] -mLastDrag[1])
									z:(field.mLoc[2] -mLastDrag[2])];
				}
			}
			
			mLastDrag[0] = field.mLoc[0];
			mLastDrag[1] = field.mLoc[1];
			mLastDrag[2] = field.mLoc[2];
		}
			
		if ([field.mArea isEqual:mFocused.mArea] && 
			field.mIndex == mFocused.mIndex)
		{
			return;
		}else
		{
			[self onFocusLost:mFocused];
            [mFocused release];            
			mFocused = nil;
			mLastDrag[0] = 1e07f;
		}
	}else if (mFocused != nil)
	{
		[self onFocusLost:mFocused];
        [mFocused release];
		mFocused = nil;        		
	}
	mFocused = field;
	if (field != nil)
	{
		[self onFocusGain:field];
	}
	
	mLastDrag[0] = 1e07f;		

	
}


-(void)onFocusGain:(AreaIndexPair*) field
{
	if (field == nil || field.mOnFocusGain == nil)
		return;
	
	NSMutableString* datastr = [[[NSMutableString alloc] initWithString:field.mOnFocusGain] autorelease];
	if ([datastr hasPrefix:@"js:"])
	{
		if ([datastr hasSuffix:@";"])
		{
			[mScript execScript:[datastr substringFromIndex:3 ]];
		}else
		{			
			NSMutableString* cmd  = [[NSMutableString alloc] initWithString:[datastr substringFromIndex:3]];
			[cmd appendFormat:@"('%@',%d);",field.mArea,field.mIndex];
			[mScript execScript:cmd];
            [cmd release];
		}
		
	}else
	{
		[datastr appendFormat:@",%@,%d",field.mArea,field.mIndex];
		[mScript sendUserData:datastr onclick:field.mOnclick];
	} 		
    //NSLog(@" Focus gain %@ %@ " , field.mArea , datastr);    
}

-(void)onFocusLost:(AreaIndexPair*) field
{
	if (field == nil)
		return;
	if (field == nil || field.mOnFocusLost == nil)
		return;
	
	NSMutableString* datastr = [[[NSMutableString alloc] initWithString:field.mOnFocusLost] autorelease];
	if ([datastr hasPrefix:@"js:"])
	{
		if ([datastr hasSuffix:@";"])
		{
			[mScript execScript:[datastr substringFromIndex:3 ]];
		}else
		{			
			NSMutableString* cmd  = [[NSMutableString alloc] initWithString:[datastr substringFromIndex:3]];
			[cmd appendFormat:@"('%@',%d);",field.mArea,field.mIndex];
			[mScript execScript:cmd];
            [cmd release];
		}
		
	}else
	{
		[datastr appendFormat:@",%@,%d",field.mArea,field.mIndex];
		[mScript sendUserData:datastr onclick:field.mOnclick];
	} 		
    //NSLog(@" Focus lost %@ %@ " , field.mArea , datastr);

}

-(void)onFocusProbe:(float)x y:(float) y
{
	mLastClickTime = currentTime();
	[self mouseDragged:x y:y forClick:true];
}

- (void) onSurfaceChanged:(int)width h:(int) height
{
	[mCS initCanvas:width h:height o:1];
    [mView onSurfaceChanged:width h:height];
}

-(void) setSplash:(NSString*)splash delay:(long)delay
{
    mSplashTimeStart = 0;
    mSplashTime = (double)delay;
    mSplashScreen = [NSString stringWithString:splash];
    if (mSplashScreen != nil && mSplashScreen.length > 0)
    {
        mDrawSPlash = true;
        [mWorld initSplash:mSplashScreen];
    }		
    
}

-(void) setEnv:(NSString*)name value:(NSString*)value
{
	if ([name isEqual:@"textparam"])
	{
		NSArray* tokens = [value componentsSeparatedByString:@","];
		float u1 = [[tokens objectAtIndex:0] floatValue];
		float v1 = [[tokens objectAtIndex:1] floatValue];
		float u2 = [[tokens objectAtIndex:2] floatValue];
		float v2 = [[tokens objectAtIndex:3] floatValue];
		float p = 0;
        if ( [tokens count] > 4)
		{
			p = [[tokens objectAtIndex:4] floatValue];
		}
		
        [mTextures setParam:u1 v1:v1 u2:u2 v2:v2 p:p];
	}else if ([name isEqualToString:@"touch"])
    {
        if ( [value isEqualToString:@"on"])
        {
            mTouchEnabled = true;            
        }else if ( [value isEqualToString:@"off"])
        {
            mTouchEnabled = false;
        }
    } 

}

-(void) setSplashSize:(float)x1 y1:(float)y1 x2:(float)x2 y2:(float) y2 
{
    mSplashX1 = x1;
    mSplashX2 = x2;
    mSplashY1 = y1;
    mSplashY2 = y2;
    
}    



-(void) socialLogin:(NSString*)data callback:(NSString*)callback
{

}

-(void) reloadScores:(NSString*)data callback:(NSString*)callback
{

}

-(void) scoresSubmit:(NSString*)data callback:(NSString*)callback
{
 
}

- (void) scoreReported: (NSError*) error;
{

}


-(void) socialShow:(NSString*)data callback:(NSString*)callback
{
    [mSocialDelegate show];
}





-(void)processData
{
    [mAnims process:mFrameDeltaTime];
	[self execResponses];
    [mWorld addModels];    
	[mTextures flushTextures];
}

-(bool)hasData
{
    //System.out.println("to skip " + mResponsesQueue.size() + " " + mAnims.mCount);
    if (mDrawSPlash)
    {
        return true;
    }
	if (mDataChange)
	{
		mDataChange = false;
		return true;
	}
	if (mRendering)
	{
		return false;
	}	
    if ([mResponsesQueue count] <= 0 && [mAnims getCount]<= 0)
    {
		mFrameLastTime  = -1;
        //System.out.println("skipping");
        return false;
    }
    return true;
}

-(void) onEvent2:(NSMutableDictionary*)response
{
    NSString* respid = [response valueForKey:@"id"];
    NSString* respdata = [response valueForKey:@"data"];
    NSString* respdata2 = [response valueForKey:@"data2"];
    NSString* respdata3 = [response valueForKey:@"data3"];
    
    NSString* resptype = [response valueForKey:@"type"];

    int eventid = [respid intValue];
    //NSLog(@" %d " , eventid);
    
    
    switch (eventid) {
        case 100:
            [self sendEvent:resptype script:respdata];
            break;
        case 101:
            [self sendExec:resptype script:respdata];
            break;
        case 102:
            [self loadModule:resptype script:respdata];
            break;
        case 103:
            [self loadModule2:resptype script:respdata];
            break;
		case 200:
            [self setEnv:resptype value:respdata];
            break;
		case 500:
            [self socialLogin:resptype callback:respdata];
            break;            
		case 510:
            [self scoresSubmit:resptype callback:respdata];
            break;            
		case 520:
            [self socialShow:resptype callback:respdata];
            break;
		case 521:
            [self reloadScores:resptype callback:respdata];
            break;            
        case 1002:
            [self onTextInput:resptype script:respdata];
            //[mApp endScript];
            break;
        case 2000:
            [self performSelector:@selector(endScript) withObject:nil afterDelay:0.001];
            break;
        case 2600:
            [mSettings open];
            break;
        case 2601:
            [mSettings save];
            break;
        case 2610:
            [mSettings writeInt:resptype value:respdata];
            break;
        case 2611:
            [mSettings writeStr:resptype value:respdata];
            break;            
        case 2620:
            [mSettings loadInt:resptype value:respdata];
            break;
        case 2621:
            [mSettings loadStr:resptype value:respdata];
            break;
        case 2622:
            [mSettings loadArray:resptype value:respdata];
            break;			
        case 4000:
            [mTextures newTexture:resptype file:respdata];
            break;
		case 4001:
            [mTextures deleteTexture:resptype];
            break;			
        case 4100:
            [mObjectsFact create:resptype data:respdata];
            break;
        case 4110:
            [mObjectsFact place:resptype data:respdata];
            break;
        case 4120:
            [mObjectsFact scale:resptype data:respdata];
            break;
        case 4130:
            [mObjectsFact texture:resptype data:respdata];
            break;
        case 4140:
            [mObjectsFact state:resptype data:respdata];
            break;
        case 4150:
            [mObjectsFact remove:resptype data:respdata];
            break;			
		case 4160:
			[mObjectsFact rotate:resptype data:respdata];
			break;							
        case 4200:
            [mAnims move:resptype loc:respdata data:respdata2 callback:respdata3];
            break;			
        case 4210:
            [mAnims rotate:resptype angle:respdata data:respdata2 callback:respdata3];
            break;			            
        case 5000:
			[mSounds newSound:resptype file:respdata];
            break;
		case 5010:
            [mSounds playSound:resptype];
            break;			
        case 5011:
			[mSounds setVolume:(int)[resptype intValue]];
            break;
        case 5012:
			[mSounds mute:(int)[respdata intValue]];
            break;            
        case 6001:
            [mItems newFromTemplate:resptype data:respdata];
            break;
        case 6002:
            [mItems setTexture:resptype data:respdata];
            break;        	  
        case 6003:
            [mItems createModel:resptype data:respdata];
            break;        	          	  
        case 6004:
            [mItems setSubmodels:resptype data:respdata];
            break;        	          	          	  
        case 7000:
            [self connect:resptype callback:respdata];
            break;            
        case 7001:
            [self join:resptype callback:respdata];
            break;                        
        case 7002:
            [self send:resptype];
            break;  
        case 7003:
            [self disconnect];
            break;    
        default:
            [mDataGrid onEvent2:response];
    }		  
    
}


-(void) calcFrameDelay
{
	if (mFrameLastTime  == -1)
	{
		mFrameLastTime  = currentTime(); 
		mFrameDeltaTime = 0;
	}else
	{
		mFrameDeltaTime = currentTime() - mFrameLastTime;
		mFrameLastTime += mFrameDeltaTime; 
	}

}

-(double)frameDelta 
{
	return mFrameDeltaTime;
}


-(void)execScript:(NSString*)script
{
    [mScript execScript:script];
}

-(void) setInputTextSelector:(NSObject*)sel
{
    mInputTextSelector = sel;
    
}

-(void) setSocial:(NSObject<SocialDelegate>*)delegate
{
    mSocialDelegate = delegate;
}

@end
