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

@class TextRender;
@class GameonModel;
@class GameonApp;


@interface GameonWorld : NSObject {

    NSMutableArray* mModelList;
	NSMutableArray* mVisibleModelList;
    NSMutableArray* mModelList2;    
	NSMutableArray* mVisibleModelList2;    
    NSMutableArray* mNewModels;
    TextRender*		mTexts;
    TextRender*		mTextsHud;
    bool            mLocked;
    bool            mLockedDraw;
    bool            mInDraw;    
	GameonModel* 	mSplashModel;
    GameonApp*      mApp;
	
}

@property (nonatomic, readonly, getter = texts)TextRender*		mTexts;
@property (nonatomic, readonly, getter = textshud )TextRender*		mTextsHud;


-(void) add:(GameonModel*) model;
-(void) remove:(GameonModel*) model;

-(void) addModels;
-(void) draw;
-(void) drawHud;
-(void) prepare;

-(void) test;

-(void) initSplash:(NSString*) name;
-(void) drawSplash;
-(void) setAmbientLight:(float)r g:(float)g b:(float)b a:(float) a;
-(void) getAmbientLight:(float*) ret;
-(void) setAmbientLightGl:(float)r g:(float)g b:(float)b a:(float)a;
-(void) setVisible:(GameonModel*) model;
-(void) remVisible:(GameonModel*) model;
- (id) initWithApp:(GameonApp*)app;
@end

