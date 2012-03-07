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

//#define GAMECENTER 
#import <Foundation/Foundation.h>
#import "ServerkoParse.h"
#import <GameKit/GameKit.h>
#import "SocialDelegate.h"

@class LayoutGrid;

@class GameonWorldView;
@class GameonWorld;
@class AreaIndexPair;
@class GameCenterManager;
@class EAGLController;
@class AnimFactory;
@class ColorFactory;
@class ItemFactory;
@class TextureFactory;
@class SoundFactory;
@class Settings;
@class ObjectsFactory;
@class GameonCS;

@interface GameonApp : NSObject{

    ServerkoParse* mScript;
    
    LayoutGrid*         mDataGrid;
    GameonWorld*        mWorld;
    GameonWorldView*    mView;

    NSObject*           mEndScoreSelector;
    NSObject*           mEndGameSelector;
    NSObject*           mInputTextSelector;    
    bool                mLayoutInit;
    NSString*           mTextInputScript;
    
    NSMutableArray*     mResponsesQueue;
    bool                mTextEditing;
    float				mScreenb[8];
    float				mHudb[8];        
    
    double 				mSplashTime;
    double 				mSplashTimeStart;
	bool 				mDrawSPlash;
	bool 				mSplashOutStart;
    AreaIndexPair*		mFocused;
    bool                mTouchEnabled;
    
    AnimFactory*		mAnims;
    ColorFactory*		mColors;
    ItemFactory*		mItems;
    TextureFactory*		mTextures;
    SoundFactory*		mSounds;
    Settings*			mSettings;
    ObjectsFactory*		mObjectsFact;
    GameonCS*			mCS;
    
    bool				mCameraSet;
    double 				mFrameDeltaTime;
    double 				mFrameLastTime;
	
	NSString*			mSplashScreen;
    float mSplashX1;
    float mSplashX2;
    float mSplashY1;
    float mSplashY2;	

	bool				mDataChange;
	bool				mRendering;

    NSObject<SocialDelegate>*     mSocialDelegate;
	///
	
    float* mLastDrag;
    float mLastDist;
    double mLastDragTime;
    double mLastClickTime;
    bool mSupportOld;	

	
    
}

@property (nonatomic, readonly, getter=grid) LayoutGrid* mDataGrid;
@property (nonatomic, readonly, getter=world) GameonWorld* mWorld;
@property (nonatomic, readonly, getter=view) GameonWorldView* mView;
@property (nonatomic, readonly, getter=script) ServerkoParse* mScript;
@property (nonatomic, readonly, getter=anims) AnimFactory*	mAnims;
@property (nonatomic, readonly, getter=colors) ColorFactory* mColors;
@property (nonatomic, readonly, getter=items) ItemFactory*	mItems;
@property (nonatomic, readonly, getter=textures) TextureFactory* mTextures;
@property (nonatomic, readonly, getter=sounds) SoundFactory* mSounds;
@property (nonatomic, readonly, getter=settings) Settings* mSettings;
@property (nonatomic, readonly, getter=objects) ObjectsFactory*	mObjectsFact;
@property (nonatomic, readonly, getter=cs) GameonCS* mCS;
@property (nonatomic, readonly)	NSString*			mSplashScreen;
@property (nonatomic, readonly) float mSplashX1;
@property (nonatomic, readonly) float mSplashX2;
@property (nonatomic, readonly) float mSplashY1;
@property (nonatomic, readonly) float mSplashY2;	


-(void) performClick:(float)x y:(float)y;
-(void)mouseDragged:(float)x y:(float) y forClick:(bool)notimecheck;

-(void) endScript;

-(void) onEndScore:(NSString*) strData;

-(void) onTextInput:(NSString*)title script:(NSString*)script;

-(void) onTextInputEnd:(NSString*)text finish:(bool)finish;

-(void) queueResponses:(NSMutableArray*)responses;

-(void) execResponses;

-(void)setScreenBounds;

-(void)sendEvent:(NSString*)resptype script:(NSString*)respdata;
-(void)sendExec:(NSString*)resptype script:(NSString*)respdata;
-(void)loadModule:(NSString*)resptype script:(NSString*)respdata;
-(void)loadModule2:(NSString*)resptype script:(NSString*)respdata;
-(void)onFocusLost:(AreaIndexPair*) field;
-(void)onFocusGain:(AreaIndexPair*) field;
-(void)onFocusProbe:(float)x y:(float) y;
-(void)drawFrame;
- (void) onSurfaceChanged:(int)width h:(int) height;
-(void) setSplash:(NSString*)splash delay:(long)delay;
-(void) setSplashSize:(float)x1 y1:(float)y1 x2:(float)x2 y2:(float) y2 ;
-(void) setEnv:(NSString*)name value:(NSString*)value;
- (void)processData;
- (bool)hasData;

///
-(void) socialLogin:(NSString*)data callback:(NSString*)callback;
-(void) scoresSubmit:(NSString*)data callback:(NSString*)callback;
-(void) socialShow:(NSString*)data callback:(NSString*)callback;
-(void) reloadScores:(NSString*)data callback:(NSString*)callback;
-(double)frameDelta;
-(void)execScript:(NSString*)script;
-(void) calcFrameDelay;
- (void) start:(NSString*)script preexec:(NSString*)preexec;
-(void) onEvent2:(NSMutableDictionary*)response;
-(void) setInputTextSelector:(NSObject*)sel;
-(void) setSocial:(NSObject<SocialDelegate>*)delegate;
@end
