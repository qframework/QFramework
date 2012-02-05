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

#import "GameonWorld.h"
#import "TextRender.h"
#import "GameonModel.h"
#import "GameonModelRef.h"
#import "ColorFactory.h"
#import <OpenGLES/ES1/gl.h>
#import <OpenGLES/ES1/glext.h>
#import "TextureFactory.h"
#import "GameonApp.h"

@implementation GameonWorld

@synthesize mTexts;
@synthesize mTextsHud;

float gAmbientLight[4] = { 1.0f, 1.0f, 1.0f, 1.0f};
bool gAmbientLightChanged = false;

- (id) initWithApp:(GameonApp*)app
{
	if (self = [super init])
	{
        mApp = app;
        mModelList = [[NSMutableArray alloc] init] ;
		mVisibleModelList = [[NSMutableArray alloc] init] ;
        mModelList2 = [[NSMutableArray alloc] init] ;        
		mVisibleModelList2 = [[NSMutableArray alloc] init] ;        
        mNewModels = [[NSMutableArray alloc] init];
        
        mTexts = [[TextRender alloc] init];
        mTextsHud = [[TextRender alloc] init];
        mLocked = false;
        mLockedDraw = false;
        mInDraw = false;
		
		
    }
    return self;
}

- (void) dealloc
{
    [mSplashModel release];
    [mModelList release] ;
	[mVisibleModelList release] ;
    [mNewModels release] ;
    [mModelList2 release] ;    
	[mVisibleModelList2 release] ;    
    [mTexts release] ;
    [mTextsHud release] ;
    [super dealloc];
}

-(void) test
{
    
    GameonModel* model = [[GameonModel alloc] initWithName:@"test" app:mApp];
    [model createCube:-4.0f  btm:-4.0f b:-4.0f r:4.0f t:4.0f f:4.0f c:mApp.colors.red];
    [model generate];
    model.mEnabled = true;
    [mModelList addObject:model];		
}

-(void)initSplash:(NSString*) name
{
	GameonModel* model = [[GameonModel alloc] initWithName:@"test" app:mApp];
	
//	[model createPlane:-2.0 btm:-1.32f b:0.0f r:2.0f t:1.32f f:0.0f c:mApp.colors.white];
	
    [model createPlane:mApp.mSplashX1 btm:mApp.mSplashY1 b:0.0f r:mApp.mSplashX2 t:mApp.mSplashY2 f:0.0f c:mApp.colors.white];    
    
	[mApp.textures newTexture:@"q_splash" file:name];
	[model setTexture:[mApp.textures getTexture:@"q_splash"]];
	GameonModelRef* ref = [[GameonModelRef alloc] initWithParent:nil];
	ref.mLoc = GWLOC_HUD;
    [ref setVisible:true];
    [ref set];
	[model addref:ref];
	mSplashModel = model;
	[model generate];
	model.mEnabled = true;		
}

-(void) remove:(GameonModel*) model
{
    if ([mModelList2 indexOfObject:model]!= NSNotFound) {    
        [mModelList2 removeObject:model];
    }
         
    if ([mModelList indexOfObject:model]!= NSNotFound) {    
        [mModelList removeObject:model];
    }
    //[model retain];
    
}

-(void) add:(GameonModel*) model
{
    [model generate];
    [mNewModels addObject:model];
    //[model retain];
    
}


-(void) addModels
{
    if (mLocked )return;

    
    for (int a=0; a< [mNewModels count]; a++)
    {
        GameonModel* model = [ mNewModels objectAtIndex:a];
        //[model  retain];
        if (model.mIsModel)
        {
            [mModelList2 addObject:model];
        }else{
            [mModelList addObject:model];
        }
        /*
        if ([model getVisible])
        {
            [self setVisible:model];
        }*/
    }
    
    [mNewModels removeAllObjects];
    
    
}

-(void) setLocked:(bool) locked {
    mLocked = locked;
}

-(void) setLockedDraw:(bool) locked {
    mLockedDraw = locked;
}	

-(void) draw {
    if (gAmbientLightChanged)
	{
        //NSLog(@" set alight %f %f %f %f" , gAmbientLight[0], gAmbientLight[1],gAmbientLight[2],gAmbientLight[3]);
		glLightModelfv(GL_LIGHT_MODEL_AMBIENT, gAmbientLight);
		gAmbientLightChanged = false;
	}	
    //NSLog(@" start draw ---------");
    int len = [mVisibleModelList count];
    for (int a=0; a< len; a++) {
        GameonModel* model = [mVisibleModelList objectAtIndex:a];
        
        if (!model.mHasAlpha)
            [model draw:GWLOC_WORLD];
    }

    for (int a=0; a < len; a++) {
        GameonModel* model = [mVisibleModelList objectAtIndex:a];
        if (model.mHasAlpha)
            [model draw:GWLOC_WORLD];
    }
    
    len = [mVisibleModelList2 count];    
    for (int a=0; a< len; a++) {
        GameonModel* model = [mVisibleModelList2 objectAtIndex:a];
        
        if (!model.mHasAlpha)
            [model draw:GWLOC_WORLD];
    }    
    for (int a=0; a< len; a++) {
        GameonModel* model = [mVisibleModelList2 objectAtIndex:a];
        
        if (model.mHasAlpha)
            [model draw:GWLOC_WORLD];
    }    
    
	[mTexts render];
    
    
}

-(void) drawHud
{
    //NSLog(@" start draw hud ---------");
    
    int len = [mVisibleModelList count];
    for (int a=len-1; a >= 0; a--) {
        GameonModel* model = [mVisibleModelList objectAtIndex:a];
            [model draw:GWLOC_HUD];
    }
    
    len = [mVisibleModelList2 count];
    for (int a=len-1; a >= 0 ; a--) {
        GameonModel* model = [mVisibleModelList2 objectAtIndex:a];
        [model draw:GWLOC_HUD];
        
    }

    //glDisable(GL_DEPTH_TEST);
	[mTextsHud render];
    //glEnable(GL_DEPTH_TEST);
}

-(void) prepare{
    glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glEnableClientState(GL_COLOR_ARRAY);
    glEnable( GL_COLOR_MATERIAL);
    glEnableClientState(GL_VERTEX_ARRAY);	
    glEnable(GL_CULL_FACE);
    glFrontFace(GL_CCW);
    glEnable(GL_TEXTURE_2D);
    glActiveTexture(GL_TEXTURE0);
	
    glHint(GL_PERSPECTIVE_CORRECTION_HINT,
              GL_NICEST);
    
	glEnable(GL_DEPTH_TEST);
	glDepthFunc(GL_LEQUAL);
	
	
	
	glEnable(GL_BLEND);
	glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
	//glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
	
	glEnable(GL_ALPHA_TEST);
	glAlphaFunc(GL_GREATER,0.05f);
    
	glEnable(GL_LIGHTING);
	glLightModelfv(GL_LIGHT_MODEL_AMBIENT, gAmbientLight);
	
	glClearColor(0.0f, 0.0f, 0.0f,1);
	glShadeModel(GL_SMOOTH);

		
    /*
    glHint(GL_PERSPECTIVE_CORRECTION_HINT,
              GL_FASTEST);
    
    glClearColor(1.0f, 1.0f, 1.0f,1);
    glShadeModel(GL_SMOOTH);
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_TEXTURE_2D);
    glDisable(GL_DITHER);
    */
}

-(void) clear {

    while (mInDraw) {
/*        
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
 */
    }
    mLockedDraw = true;
    [mModelList2 removeAllObjects];
    [mModelList removeAllObjects];    
    [mNewModels removeAllObjects];
    [mTexts clear];
    [mTextsHud clear];
    mLocked = false;
    mLockedDraw = false;
    
}
-(void) reinit
{
    /*
    mLockedDraw = true;
    int len = [mModelList count];
    for (int a=0; a< len; a++) {
        GameonModel* model = [mModelList objectAtIndex:a];
        model.reset();
    }
    
    mLockedDraw = false;*/
}

-(void) setVisible:(GameonModel*) model
{
 	if (model.mIsModel)
	{
		if ([mVisibleModelList2 indexOfObject:model] == NSNotFound)
		{
            for (int b = 0; b < [mVisibleModelList2 count]; b++)
            {
                GameonModel* oldmodel = [mVisibleModelList2 objectAtIndex:b];
                if (model.mTextureID == oldmodel.mTextureID)
                {
                    [mVisibleModelList2 insertObject:model atIndex:b];
                    return;
                }                
            }
            
			[mVisibleModelList2 addObject:model];	
		} 
	}else
	{
		if ([mVisibleModelList indexOfObject:model]  == NSNotFound)
		{
            for (int b = 0; b < [mVisibleModelList count]; b++)
            {
                GameonModel* oldmodel = [mVisibleModelList objectAtIndex:b];
                if (model.mTextureID == oldmodel.mTextureID)
                {
                    [mVisibleModelList insertObject:model atIndex:b];
                    return;
                }                
            }
            
            
			[mVisibleModelList addObject:model];	
		}		
	}
}

-(void) remVisible:(GameonModel*) model
{
	if (model.mIsModel)
	{
		if ([mVisibleModelList2 indexOfObject:model] != NSNotFound)
		{
			[mVisibleModelList2 removeObject:model];	
		}
	}else
	{
		if ([mVisibleModelList indexOfObject:model]  != NSNotFound)
		{
			[mVisibleModelList removeObject:model];	
		}		
	}
}

-(void) drawSplash
{
	if (mSplashModel != nil)
	{
        if (gAmbientLightChanged)
        {
            //NSLog(@" set alight %f %f %f %f" , gAmbientLight[0], gAmbientLight[1],gAmbientLight[2],gAmbientLight[3]);
            glLightModelfv(GL_LIGHT_MODEL_AMBIENT, gAmbientLight);
            gAmbientLightChanged = false;
        }  
        [mSplashModel setState:LAS_VISIBLE];
		[mSplashModel draw:GWLOC_HUD];
        [mSplashModel setState:LAS_HIDDEN];        
	}
	
}

-(void) setAmbientLight:(float)r g:(float)g b:(float)b a:(float) a
{
	gAmbientLight[0] = r;
	gAmbientLight[1] = g;
	gAmbientLight[2] = b;
//	mAmbientLight[3] = a;
	gAmbientLightChanged = true;
    //NSLog(@" %f %f %f %f " , r,g,b,a);
}

-(void)getAmbientLight:(float*)ret
{
	ret[0] = gAmbientLight[0];
	ret[1] = gAmbientLight[1];
	ret[2] = gAmbientLight[2];
//	ret[3] = mAmbientLight[3]; 
}

-(void)setAmbientLightGl:(float)r g:(float)g b:(float)b a:(float)a
{
	gAmbientLight[0] = r;
	gAmbientLight[1] = g;
	gAmbientLight[2] = b;
//	mAmbientLight[3] = a;
	//gAmbientLightChanged = true;
	glLightModelfv(GL_LIGHT_MODEL_AMBIENT, gAmbientLight);

	
}

@end
