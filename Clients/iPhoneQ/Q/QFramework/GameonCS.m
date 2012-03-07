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


#import "GameonCS.h"
#import "GMath.h"
#import <OpenGLES/ES1/gl.h>
#import <OpenGLES/ES1/glext.h>


@implementation GameonCS

@synthesize mCameraEye;
@synthesize mCameraEyeHud;


- (void) dealloc
{
    free(mCameraEye);
    free(mCameraLookAt);
    free(mCameraEyeHud);
    free(mCameraLookAtHud);    

    free(mHudBBox);
    free(mWorldBBox);
    free(mLookAt);
    free(mLookAtHud);
    free(mProjection);
    free(mProjectionHud);    
    free(mProjectionSaved);
    free(mProjectionHudSaved);        
    [super dealloc];
}


- (id)init
{
    self = [super init];
    
    if (self) {
        
        mCanvasW = 0;
        mCanvasH = 0;
        
        mViewport = malloc( 4 * sizeof(int) );
        mViewport[0] =0;
        mViewport[1] =0;
        mViewport[2] =0;
        mViewport[3] =0;
        
        mLookAt = malloc( 16 * sizeof(float));
        matrixIdentity(mLookAt);
        mLookAtHud = malloc( 16 * sizeof(float));
        matrixIdentity(mLookAtHud);
        mProjection = malloc( 16 * sizeof(float));
        matrixIdentity(mProjection);
        mProjectionHud = malloc( 16 * sizeof(float));
        matrixIdentity(mProjectionHud);

        mProjectionSaved = malloc( 8 * sizeof(float));
        memset(mProjectionSaved , 0 , 8 * sizeof(float));
        mProjectionHudSaved = malloc( 8 * sizeof(float));
        memset(mProjectionHudSaved , 0 , 8 * sizeof(float));        
        
        mWorldBBox = malloc( 8 * sizeof(float));
        memset(mWorldBBox , 0 , 8 * sizeof(float));
        mHudBBox = malloc( 8 * sizeof(float));
        memset(mHudBBox , 0 , 8 * sizeof(float));
        
        mCameraEye = malloc( 3 * sizeof(float));
        mCameraEye[0] =0;
        mCameraEye[1] =0;
        mCameraEye[2] =10;        

        mCameraLookAt= malloc( 3 * sizeof(float));    
        mCameraLookAt[0] = 0;
        mCameraLookAt[1] = 0;
        mCameraLookAt[2] = 0;        

        mCameraEyeHud = malloc( 3 * sizeof(float));
        mCameraEyeHud[0] =0;
        mCameraEyeHud[1] =0;
        mCameraEyeHud[2] =5;        
        
        mCameraLookAtHud= malloc( 3 * sizeof(float));    
        mCameraLookAtHud[0] = 0;
        mCameraLookAtHud[1] = 0;
        mCameraLookAtHud[2] = 0;        
        
		mUpZ = malloc( 3 * sizeof(float));    
		mUpZ[0] = 0;
		mUpZ[1] = 1;
		mUpZ[2] = 0;
		mUpZHud = malloc( 3 * sizeof(float));    
		mUpZHud[0] = 0;
		mUpZHud[1] = 1;
		mUpZHud[2] = 0;		
        mHudInit = false;
        mSpaceInit = false;        
    }
    return self;
}


-(void) saveViewport:(int)aw h:(int) ah {
    mViewport[2] = aw;
    mViewport[3] = ah;
    
}

-(void)saveProjection:(float)left r:(float)right t:(float)top b:(float)bottom n:(float)near f:(float) far 
{
    memset(mProjection , 0 , 16 * sizeof(float));
	frustrumMat(left,right,top,bottom,near,far, mProjection);

    mProjectionSaved[0] = left;
    mProjectionSaved[1] = right;
    mProjectionSaved[2] = top;
    mProjectionSaved[3] = bottom;
    mProjectionSaved[4] = near;
    mProjectionSaved[5] = far;    
}

-(void)saveProjectionHud:(float)left r:(float)right t:(float)top b:(float)bottom n:(float)near f:(float) far 
{
    memset(mProjectionHud , 0 , 16 * sizeof(float));
	frustrumMat(left,right,top,bottom,near,far, mProjectionHud);
    mProjectionHudSaved[0] = left;
    mProjectionHudSaved[1] = right;
    mProjectionHudSaved[2] = top;
    mProjectionHudSaved[3] = bottom;
    mProjectionHudSaved[4] = near;
    mProjectionHudSaved[5] = far;        
}

-(void) initCanvas:(float) canvasw h:(float) canvash o:(int)orientation
{
    
    
    mCanvasW = (float)canvasw;
    mCanvasH = (float)canvash;

    
}

- (void) screen2spaceVec:(float)x y:(float)y  vec:(float*) vec
{
	float c[3];
	y = mViewport[3] - y;
	gluUnProject(x,y, 1.0f,mLookAt, 
			mProjection, 
			mViewport, 
			&c[0],&c[1],&c[2]);
	vec[0] = c[0] - mCameraEye[0];
	vec[1] = c[1] - mCameraEye[1];
	vec[2] = c[2] - mCameraEye[2];
}

- (void) screen2spaceVecHud:(float)x y:(float)y  vec:(float*) vec
{
	float c[3];
	y = mViewport[3] - y;
	gluUnProject(x,y, 1.0f,mLookAtHud, 
			mProjectionHud, 
			mViewport, 
			&c[0],&c[1],&c[2]);
	vec[0] = c[0] - mCameraEyeHud[0];
	vec[1] = c[1] - mCameraEyeHud[1];
	vec[2] = c[2] - mCameraEyeHud[2];
}

 
 
- (void) screen2space:(float)x sy:(float)y sc:(float*) spacecoords 
{
     float c[3];
     float f[3];
        
     y = mViewport[3] - y;
    gluUnProject(x,y, 1.0f,mLookAt,
                  mProjection,
                  mViewport,
                  &f[0] , &f[1] , &f[2]);
    
    gluUnProject(x,y, 0.0f,mLookAt,
                  mProjection,
                  mViewport,
                  &c[0],&c[1],&c[2]);    	
    
     f[0] -= c[0];
     f[1] -= c[1];
     f[2] -= c[2];
     float rayLength = (float)sqrt(c[0]*c[0] + c[1]*c[1] + c[2]*c[2]);
     //normalize
     f[0] /= rayLength;
     f[1] /= rayLength;
     f[2] /= rayLength;
     
     //T = [planeNormal.(pointOnPlane - rayOrigin)]/planeNormal.rayDirection;
     //pointInPlane = rayOrigin + (rayDirection * T);
     
     float dot1, dot2;
     
     float pointInPlaneX = 0;
     float pointInPlaneY = 0;
     float pointInPlaneZ = 0;
     float planeNormalX = 0;
     float planeNormalY = 0;
     float planeNormalZ = -1;
     
     pointInPlaneX -= c[0];
     pointInPlaneY -= c[1];
     pointInPlaneZ -= c[2];
     
     dot1 = (planeNormalX * pointInPlaneX) + (planeNormalY * pointInPlaneY) + (planeNormalZ * pointInPlaneZ);
     dot2 = (planeNormalX * f[0]) + (planeNormalY * f[1]) + (planeNormalZ * f[2]);
     
     float t = dot1/dot2;
     
     f[0] *= t;
     f[1] *= t;
     spacecoords[0] = f[0] + c[0];
     spacecoords[1] = f[1] + c[1];
}
 

-(void) saveLookAt:(float*)eye  c:(float*)center u:(float*) up 
{
    memset(mLookAt , 0 , 16 * sizeof(float));
    lookAtf(mLookAt,eye,center,up);
}
 
-(void) saveLookAtHud:(float*)eye  c:(float*)center u:(float*) up 
{
    memset(mLookAtHud , 0 , 16 * sizeof(float));
    lookAtf(mLookAtHud, eye,  center,  up);
}
 
 
-(void) screen2spaceHud:(float)x sy:(float)y sc:(float*) spacecoords 
{
 float c[3];
 float f[3];
    
 y = mViewport[3] - y;
 
    // move to GMath
    
    gluUnProject(x,y, 1.0f,mLookAtHud, 
                 mProjection, 
                 mViewport, 
                 &f[0], &f[1],&f[2]);
    gluUnProject(x,y, 0.0f,mLookAtHud,
                 mProjection,
                 mViewport,
                 &c[0], &c[1],&c[2]);   
    
 f[0] -= c[0];
 f[1] -= c[1];
 f[2] -= c[2];
 float rayLength = (float)sqrt(c[0]*c[0] + c[1]*c[1] + c[2]*c[2]);
 //normalize
 f[0] /= rayLength;
 f[1] /= rayLength;
 f[2] /= rayLength;
 
 //T = [planeNormal.(pointOnPlane - rayOrigin)]/planeNormal.rayDirection;
 //pointInPlane = rayOrigin + (rayDirection * T);
 
 float dot1, dot2;
 
 float pointInPlaneX = 0;
 float pointInPlaneY = 0;
 float pointInPlaneZ = 0;
 float planeNormalX = 0;
 float planeNormalY = 0;
 float planeNormalZ = -1;
 
 pointInPlaneX -= c[0];
 pointInPlaneY -= c[1];
 pointInPlaneZ -= c[2];
 
 dot1 = (planeNormalX * pointInPlaneX) + (planeNormalY * pointInPlaneY) + (planeNormalZ * pointInPlaneZ);
 dot2 = (planeNormalX * f[0]) + (planeNormalY * f[1]) + (planeNormalZ * f[2]);
 
 float t = dot1/dot2;
 
 f[0] *= t;
 f[1] *= t;
 
 spacecoords[0] = f[0] + c[0];
 spacecoords[1] = f[1] + c[1];
 }
 
 

- (float) snap_cam_z:(float*)eye  center:(float*)center up:(float*) up 
{

    float lookAt[16];
    float eye2[3];
    memcpy(eye2, eye, sizeof(float)*3);
    
    for (float  ez = 1; ez <100; ez += 0.05)
    {
        float cordx = mCanvasW;
        float cordy = 0;

        float x,y,z;
        eye2[2] = ez;
        
        lookAtf(lookAt,eye2,center,up);
        if (gluProject(cordx, cordy, 0, 
                    lookAt, 
                     mProjection,
                     mViewport,
                     &x,&y,&z) == GL_TRUE &&  x> 0 && x < mViewport[2] )
        {
            //glhLookAtf2(mLookAt,eye,center,up);
			mCameraEye[0] = 0;
			mCameraEye[1] = 0;
            mCameraEye[2] = ez;
            [self saveLookAt:mCameraEye  c:mCameraLookAt u:mUpZ];            
            //NSLog(@" done x = %f z = %f",x, ez);
            return ez;
        }
        //NSLog(@" x = %f ",x);
    }
    return 0;
}


- (float) snap_cam_z_hud:(float*)eye  center:(float*)center up:(float*) up 
{
    
    float lookAt[16];
    float eye2[3];
    memcpy(eye2, eye, sizeof(float)*3);
    
    // TODO - binary alg
    for (float  ez = 1; ez <100; ez += 0.05)
    {
        float cordx = mCanvasW;
        float cordy = 0;
        
        float x,y,z;
        eye2[2] = ez;
        
        lookAtf(lookAt,eye2,center,up);
        if (gluProject(cordx, cordy, 0, 
                       lookAt, 
                       mProjectionHud,
                       mViewport,
                       &x,&y,&z) == GL_TRUE &&  x> 0 && x < mViewport[2] )
        {
			mCameraEye[0] = 0;
			mCameraEye[1] = 0;		
            mCameraEyeHud[2] = ez;
            [self saveLookAtHud:mCameraEyeHud  c:mCameraLookAtHud u:mUpZHud];
            
            return ez;
        }
        //NSLog(@" xh = %f ",x);
    }
    return 0;
}


-(void)setCamera:(float*)lookat eye:(float*)eye
{
    mCameraEye[0] = eye[0];
    mCameraEye[1] = eye[1];
    mCameraEye[2] = eye[2];    

    mCameraLookAt[0] = lookat[0];
    mCameraLookAt[1] = lookat[1];
    mCameraLookAt[2] = lookat[2];    
    
    [self saveLookAt:mCameraEye  c:mCameraLookAt u:mUpZ];
    
}

-(void)applyCamera
{
    //glMatrixMode(GL_MODELVIEW);
    //glLoadIdentity();
    
    gluLookAt(mCameraEye[0], mCameraEye[1], mCameraEye[2], 
              mCameraLookAt[0], mCameraLookAt[1], mCameraLookAt[2],    
              0, 1.0f, 0.0f);    
    
    
    if (!mSpaceInit)
    {
        mSpaceInit = true;
        [self saveLookAt:mCameraEye  c:mCameraLookAt u:mUpZ];
        
    }
    
}

-(void)setCameraHud:(float*)lookat eye:(float*)eye
{
    mCameraEyeHud[0] = eye[0];
    mCameraEyeHud[1] = eye[1];
    mCameraEyeHud[2] = eye[2];    
    
    mCameraLookAtHud[0] = lookat[0];
    mCameraLookAtHud[1] = lookat[1];
    mCameraLookAtHud[2] = lookat[2];    

    [self saveLookAtHud:mCameraEyeHud  c:mCameraLookAtHud u:mUpZHud];
    
    
    
}

-(void)applyCameraHud
{
    //glMatrixMode(GL_MODELVIEW);
    //glLoadIdentity();
    
    gluLookAt(mCameraEyeHud[0], mCameraEyeHud[1], mCameraEyeHud[2], 
              mCameraLookAtHud[0], mCameraLookAtHud[1], mCameraLookAtHud[2],    
              0, 1.0f, 0.0f);    
    
    if (!mHudInit)
    {
        mHudInit = true;
        [self saveLookAtHud:mCameraEyeHud  c:mCameraLookAtHud u:mUpZ];
        
    }
    
}

-(void)getScreenBounds:(float*)world hud:(float*) hud
{
    
    
    float temp[2];
    [self screen2space:mViewport[0] sy:mViewport[1] sc:temp];
    world[0] = temp[0] ;world[1] = temp[1];
    
    [self screen2space:mViewport[2] sy:mViewport[1] sc:temp];
    world[2] = temp[0] ;world[3] = temp[1];
    
    [self screen2space:mViewport[2] sy:mViewport[3] sc:temp];
    world[4] = temp[0] ;world[5] = temp[1];
    
    [self screen2space:mViewport[0] sy:mViewport[3] sc:temp];
    world[6] = temp[0] ;world[7] = temp[1];
    
    
    [self screen2spaceHud:mViewport[0] sy:mViewport[1] sc:temp];
    hud[0] = temp[0] ;hud[1] = temp[1];
    [self screen2spaceHud:mViewport[2] sy:mViewport[1] sc:temp];
    hud[2] = temp[0] ;hud[3] = temp[1];
    [self screen2spaceHud:mViewport[2] sy:mViewport[3] sc:temp];
    hud[4] = temp[0] ;hud[5] = temp[1];
    [self screen2spaceHud:mViewport[0] sy:mViewport[3] sc:temp];
    hud[6] = temp[0] ;hud[7] = temp[1];
    
    for (int a=0; a< 8; a++)
    {
        mWorldBBox[a] = world[a];
        mHudBBox[a] = hud[a];
    }
    
    
    
}

-(float)getCanvasW
{
    return mViewport[2] - mViewport[0];
}
-(float)getCanvasH
{
    return mViewport[3] - mViewport[1];
}

-(void)applyPerspective
{
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();    
    glFrustumf(mProjectionSaved[0], mProjectionSaved[1], mProjectionSaved[2], 
               mProjectionSaved[3], mProjectionSaved[4], mProjectionSaved[5]);    
}

-(void)applyPerspectiveHud
{
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();    
    glFrustumf(mProjectionHudSaved[0], mProjectionHudSaved[1], mProjectionHudSaved[2], 
               mProjectionHudSaved[3], mProjectionHudSaved[4], mProjectionHudSaved[5]);    

}

-(void) switchToHud
{
    glMatrixMode(GL_PROJECTION);
    glPushMatrix();
    glLoadIdentity();    

}

-(float) worldWidth
{
	return mWorldBBox[2] - mWorldBBox[0];
}

-(float) worldHeight
{
	return mWorldBBox[2] - mWorldBBox[0];
}	

-(float) worldCenterX
{
	return (mWorldBBox[2] + mWorldBBox[0]) / 2;
}
-(float) worldCenterY
{
	return (mWorldBBox[1] + mWorldBBox[5]) / 2;
}	

-(float) hudWidth
{
	return mHudBBox[2] - mHudBBox[0];
}

-(float) hudHeight
{
	return mHudBBox[2] - mHudBBox[0];
}	

-(float) hudCenterX
{
	return (mHudBBox[2] + mHudBBox[0]) / 2;
}
-(float) hudCenterY
{
	return (mHudBBox[1] + mHudBBox[5]) / 2;
}	

@end
