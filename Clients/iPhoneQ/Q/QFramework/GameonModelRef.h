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
#import <OpenGLES/ES1/gl.h>
#import <OpenGLES/ES1/glext.h>
#import "LayoutTypes.h"

@class GameonWorld;
@class GameonModel;
@class AnimData;
@class GameonApp;

@interface GameonModelRef : NSObject {

    
    GLfloat *mPosition;
    GLfloat *mRotation;
	GLfloat *mAreaPosition;
    GLfloat *mAreaRotation;
    GLfloat *mScale;
	GLfloat *mScaleAdd;
    
    GLfloat *mMatrix;
    
    int	   mOwner;
    int	   mOwnerMax;

    GameonModel*	mParent;
    bool 	mAdded;
    GameonWorld_Location    mLoc;
    bool	mVisible;
	bool	mEnabled;
	
    bool		mAnimating;
    float*      mBounds;
    AnimData*	mAnimData;
	
}

@property (nonatomic, assign) GLfloat* mPosition;
@property (nonatomic, assign) GLfloat* mRotation;
@property (nonatomic, assign) GLfloat* mAreaPosition;
@property (nonatomic, assign) GLfloat* mAreaRotation;
@property (nonatomic, assign) GLfloat* mScale;
@property (nonatomic, assign) GLfloat* mScaleAdd;
@property (nonatomic, assign) GLfloat* mMatrix;

@property (nonatomic, assign) GameonWorld_Location    mLoc;
@property (nonatomic, assign) bool	mEnabled;

@property (nonatomic, assign) bool mTransformOwner;
@property (nonatomic, readonly, getter = animating) bool mAnimating;
@property (nonatomic, assign) int	   mOwner;
@property (nonatomic, assign) int	   mOwnerMax;

- (void) setParent:(GameonModel*)parent;
- (void) clear;
- (void) setOwner:(int)owner max:(int) ownerMax;
- (void) addPosition:(float)ax y:(float)ay z:(float)az;
- (void) addRotation:(float)ax y:(float)ay z:(float)az;
- (void) addAreaRotation:(float)ax y:(float)ay z:(float)az;
- (void) addAreaPosition:(float)ax y:(float)ay z:(float)az;
- (void) setAreaPosition:(float)ax y:(float)ay z:(float)az;
- (void) setPosition:(float)ax y:(float)ay z:(float)az;
- (void) setScale:(float)ax y:(float)ay z:(float)az;   
- (void) setRotate:(float)ax y:(float)ay z:(float)az;
- (void) setRotate:(float*)rotate;
- (void) mulScale:(float)x y:(float)y z:(float) z ;
-(void) setAddScale:(float*)addScale;
- (void) setAreaRotate:(float*)rotate;

- (void) apply;
- (void) remove;
- (void) copy:(GameonModelRef*)modelRef;
- (void) copyMat:(GameonModelRef*)modelRef;
//- (void) setScale:(GameonModelRef*) modelRef;
//- (void) setRotation:(GameonModelRef*) modelRef;    
- (float) distxy:(GameonModelRef*) from;

- (void) setScaleAdd:(float)ax y:(float)ay z:(float)az;   
- (void) setScale:(float*)scale;
- (void) setAreaPosition:(float*)position;
-(void) mulScale:(float*)scale;
- (void) set;
- (id) initWithParent:(GameonModel*)parent;
- (bool) getVisible;
-(void) setVisible:(bool) visible;
-(float*) matrix;
-(AnimData*) getAnimData:(GameonApp*)app;
-(void) activateAnim;
-(float) intersectsRay:(float*)eye ray:(float*)ray loc:(float*)loc;
-(void) animate:(long) deltaTime;

@end

