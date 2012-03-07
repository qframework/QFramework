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

#import "GameonWorldView.h"
#import <OpenGLES/ES1/gl.h>
#import <OpenGLES/ES1/glext.h>
#import "GameonWorld.h"
#import "GameonApp.h"
#import "GameonCS.h"
#import "TextItem.h"
#import "GMath.h"

@implementation GameonWorldView

-(id) initWithWorld:(GameonWorld*)world app:(GameonApp*)app 
{
	if (self = [super init])
	{
        mWorld = world;
        mApp = app; 
        mSetRenderer = false;
		mLockedDraw = false;
		mFov = 45;
		mNear = 0.1f;
		mFar = 8.7f;
		mFovHud = 45;
		mNearHud = 0.1f;
		mFarHud = 8.7f;
		
    }
    return self;
}

- (void) dealloc 
{
    [super dealloc];  
}

-(void) performClick:(float)x y:(float)y
{
    float spacecoords[2];
    float spacecoordsHud[2];
    [mApp.cs screen2space:x sy:y sc:spacecoords];
    [mApp.cs screen2spaceHud:x sy:y sc:spacecoordsHud];

    
    //mContext.onClick(spacecoords[0], spacecoords[1],
    //                 spacecoordsHud[0], spacecoordsHud[1]);
}

-(void) onDrawFrame
{
    //if (mContext.mLayoutInit == false)
    //    return;
	if (mLockedDraw)return;
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);  
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	[self perspective:mFov aspect:(float)mWidth/(float)mHeight zmin:mNear zmax:mFar  updateFrustrum:true];
    
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    [mApp.cs applyCamera];
    
    // render 3d world
    [mWorld draw];
    
    
	glClear(GL_DEPTH_BUFFER_BIT);
	//glPopMatrix();
    
    glMatrixMode(GL_PROJECTION);
	//glPopMatrix();
 
	glLoadIdentity();
	[self perspectiveHud:mFovHud aspect:(float)mWidth/(float)mHeight zmin:mNearHud zmax:mFarHud updateFrustrum:true];
	
 	glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    [mApp.cs applyCameraHud];
    [mWorld drawHud];
    //glPopMatrix();
    
    
    //glMatrixMode(GL_PROJECTION);
    //glPopMatrix();
    
    
}

-(void) perspective:(float)fovy aspect:(float)aspect zmin:(float)zmin zmax:(float) zmax  updateFrustrum:(bool)update
{
    GLfloat xmin, xmax, ymin, ymax;
    ymax = zmin * tan(fovy * M_PI / 360.0);
    ymin = -ymax;
    xmin = ymin * aspect;
    xmax = ymax * aspect;
	if (update)
	{
		glFrustumf(xmin, xmax, ymin, ymax, zmin, zmax);
	}else
	{
		[mApp.cs saveProjection:xmin r:xmax t:ymin b:ymax n:zmin f:zmax];
	}
}

-(void) perspectiveHud:(float)fovy aspect:(float)aspect zmin:(float)zmin zmax:(float) zmax updateFrustrum:(bool)update
{
    GLfloat xmin, xmax, ymin, ymax;
    ymax = zmin * tan(fovy * M_PI / 360.0);
    ymin = -ymax;
    xmin = ymin * aspect;
    xmax = ymax * aspect;
	if (update)
	{
		glFrustumf(xmin, xmax, ymin, ymax, zmin, zmax);
	}else
	{
		[mApp.cs saveProjectionHud:xmin r:xmax t:ymin b:ymax n:zmin f:zmax];
	}
}

- (void) onSurfaceChanged:(int)width h:(int) height 
{
    mWidth = (float)width;
    mHeight = (float)height;
    [mWorld prepare];
    glViewport(0, 0, width, height);
    [mApp.cs saveViewport:width h:height];
  
	[self perspective:mFov aspect:(float)mWidth/(float)mHeight zmin:mNear zmax:mFar  updateFrustrum:false];
	[self perspectiveHud:mFovHud aspect:(float)mWidth/(float)mHeight zmin:mNearHud zmax:mFarHud updateFrustrum:false];
	[mApp setScreenBounds];
}

-(void)onSurfaceCreated {
    

	if (mApp.mSplashScreen != nil && [mApp.mSplashScreen length] > 0)
	{
		//[mWorld initSplash:mContext.mSplashScreen];	
	}

    
}


- (void) start {
    if (mSetRenderer) {
//        setVisibility( VISIBLE );
    }
}

- (void) stop {
    mSetRenderer = true;
    
}


-(bool)drawSplash
 {
     glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);  
     glMatrixMode(GL_PROJECTION);
     glLoadIdentity();
     [self perspective:45.0f aspect:(GLfloat)mWidth/mHeight zmin:0.14f zmax:8.7f updateFrustrum:true];
     
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();		
	gluLookAt(0.0, 0.0, 5, 
			  0, 0, 0,    
			  0, 1.0f, 0.0f);            
	[mWorld drawSplash];
    glPopMatrix();		 
     
     
    glMatrixMode(GL_PROJECTION);
    glPopMatrix();		 
	return true;
}

- (void) lockDraw:(bool) lock
{
	
	mLockedDraw = lock;
}


- (void) setFov:(float)fovf near:(float)nearf far:(float)farf 
{
	mFar = farf;
	mNear = nearf;
	mFov = fovf;
	[self perspective:mFov aspect:(float)mWidth/(float)mHeight zmin:mNear zmax:mFar  updateFrustrum:false];
	
}

- (void) setFovHud:(float)fovf near:(float)nearf far:(float)farf 
{
	mFarHud = farf;
	mNearHud = nearf;
	mFovHud = fovf;
	[self perspectiveHud:mFovHud aspect:(float)mWidth/(float)mHeight zmin:mNearHud zmax:mFarHud updateFrustrum:false];
	
}

@end


