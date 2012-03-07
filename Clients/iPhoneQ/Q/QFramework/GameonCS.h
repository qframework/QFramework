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


@interface GameonCS : NSObject {

    float mCanvasW;
    float mCanvasH;

    int *mViewport;
    float *mLookAt;
    float *mLookAtHud;    
    float *mProjection;
    float *mProjectionHud;
    float *mProjectionSaved;
    float *mProjectionHudSaved;
    float* mCameraEye;
    float* mCameraLookAt;
    
    float* mCameraEyeHud;
    float* mCameraLookAtHud;  
    float* mWorldBBox;
    float* mHudBBox;    
    bool mHudInit;
    bool mSpaceInit;
	
	float* mUpZ;    
	float* mUpZHud;    
}

@property (nonatomic, readonly, getter=eye) float* mCameraEye;
@property (nonatomic, readonly, getter=eyeHud) float* mCameraEyeHud;

-(void) saveViewport:(int)aw h:(int) ah;
-(void) saveProjection:(float)left r:(float)right t:(float)top b:(float)bottom n:(float)near f:(float) far ;
-(void) saveProjectionHud:(float)left r:(float)right t:(float)top b:(float)bottom n:(float)near f:(float) far ;
-(void) saveLookAtHud:(float*)eye  c:(float*)center u:(float*) up;
-(void) saveLookAt:(float*)eye  c:(float*)center u:(float*) up;
-(void) initCanvas:(float) canvasw h:(float)canvash o:(int)orientation;
- (void) screen2space:(float)x sy:(float)y sc:(float*) spacecoords;
- (void) screen2spaceHud:(float)x sy:(float)y sc:(float*) spacecoords;
- (float) snap_cam_z:(float*)eye  center:(float*)center up:(float*) up;
- (float) snap_cam_z_hud:(float*)eye  center:(float*)center up:(float*) up;
-(void)setCamera:(float*)lookat eye:(float*) eye;
-(void)setCameraHud:(float*)lookat eye:(float*) eye;
-(void)applyCamera;
-(void)applyCameraHud;
-(void)applyPerspective;
-(void)applyPerspectiveHud;
-(void) switchToHud;
-(void)getScreenBounds:(float*)world hud:(float*) hud;
-(float)getCanvasW;
-(float)getCanvasH;
-(void) screen2spaceVec:(float)x y:(float)y  vec:(float*) vec;
-(void) screen2spaceVecHud:(float)x y:(float)y  vec:(float*) vec;

-(float) worldWidth;
-(float) worldHeight;
-(float) worldCenterX;
-(float) worldCenterY;
-(float) hudWidth;
-(float) hudHeight;
-(float) hudCenterX;
-(float) hudCenterY;

@end


