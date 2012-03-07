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


#include "LayoutTypes.h"
#import "AnimFactory.h"
@class GameonModelRef;
@class GLColor;
@class GameonApp;
@class LayoutArea;

@interface AnimData_AnimFrame : NSObject
{

	float* mScale;
	bool mScaleAnim;
	float* mRotate;
	bool mRotateAnim;
	float* mTranslate;
	bool mTranslateAnim;

	float* mRotate2;
	bool mRotate2Anim;
	float* mTranslate2;
	bool mTranslate2Anim;
};

@property (nonatomic, assign) float* mScale;
@property (nonatomic, assign) bool mScaleAnim;
@property (nonatomic, assign) float* mRotate;
@property (nonatomic, assign) bool mRotateAnim;
@property (nonatomic, assign) float* mTranslate;
@property (nonatomic, assign) bool mTranslateAnim;
@property (nonatomic, assign) float* mRotate2;
@property (nonatomic, assign) bool mRotate2Anim;
@property (nonatomic, assign) float* mTranslate2;
@property (nonatomic, assign) bool mTranslate2Anim;
@end


@interface AnimData : NSObject {

    double mDifftime;
    GameonModelRef* mSavedRef;

	double mAnimDelay;
	int	   mRepeatDir;
	int    mAnimRepeat;
	int	   mActiveFrames;
	bool mBackupSaved;
	bool mOnEndHide;
	NSString* mCallback;
	
    GLColor*		mCurrSourceCol;
	GLColor*		mCurrDestCol;
	int 	mSteps;
    float mTimeStep;
	
    NSMutableArray*        mColorPool;
    int				mRefCount;
    bool			mActive;
    int				mId;
	int             mRepeat;
	bool            mToFinish;
	AnimData_Type	mType;
 
    bool            mToFree;
    GameonApp*    	mApp;
    AnimData_AnimFrame* mStart;    
    AnimData_AnimFrame* mEnd;
    NSMutableArray* mFrames;
	
	float mPerctVal;
	float mPerctMin;
	float mPerctMax;
	float mPerctDiff;
	LayoutArea*	mAreaOwner;	
}

@property (nonatomic, assign, getter=isActive) bool mActive;
@property (nonatomic, assign) LayoutArea*	mAreaOwner;

-(void) setColorEnd;
-(void) setColorStart;


-(id)   initWithId:(int) id app:(GameonApp*)parent;
-(void) setDelay:(int)delay repeat:(int)repeat;
-(void) saveBackup:(GameonModelRef*)backup tohide:(bool) hide;
-(void) setActive:(bool)active;
-(void) finish;
-(void) apply;
-(bool) process:(double)time copy:(bool)copyref;
-(void) addFrameColor:(GLColor*) c;
-(void) setCallback:(NSString*) callback;
-(void) setAnimTime:(NSString*) type ;
-(void) setup:(AnimFactory_AnimType*) atype values:(float*)values count:(int)count ref:(GameonModelRef*) ref; 
-(void) setup2:(AnimFactory_AnimType*)atype start:(GameonModelRef*)start end:(GameonModelRef*)end;
-(void) activate;
-(bool) process2:(GameonModelRef*)ref delta:(long) diff;
-(void) cancelAnimation:(GameonModelRef*)ref;
-(void)addScrollerData:(float)add delay:(int)delay min:(float)min max:(float) max;
-(void)cancel;
-(void)calcLinearScroller:(float) perct;

@end
