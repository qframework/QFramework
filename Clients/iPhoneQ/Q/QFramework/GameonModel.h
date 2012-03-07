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
#import "GLModel.h"
#import "LayoutTypes.h"

@class GLModel;
@class GLColor;
@class GameonWorld;
@class GameonApp;

@interface GameonModel : GLModel {

    NSMutableArray*         mRefs;
    NSMutableArray*         mVisibleRefs;    
    GameonWorld_Location    mLoc;
    GameonWorld*            mWorld;
    int                     mSubmodels;
    int                     mModelTemplate;
    bool    mVisible;
    bool    mHasAlpha;
    bool    mIsModel;
    NSString*               mName;
	bool 					mActive;
}

@property (nonatomic, assign) GameonWorld_Location    mLoc;
@property (nonatomic, assign) bool mHasAlpha;
@property (nonatomic, assign) bool mIsModel;
@property (nonatomic, assign) int mSubmodels;
@property (nonatomic, assign) int mModelTemplate;
@property (nonatomic, assign) NSString* mName;

- (void) draw:(GameonWorld_Location) loc;
- (void) createPlane:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front c:(GLColor*)color;
- (void) createCube:(float)left btm:(float)bottom b:(float)back 
                  r:(float)right t:(float)top f:(float)front c:(GLColor*)color;
- (void)addref:(GameonModelRef*) ref;
-(void) removeref:(GameonModelRef*) ref;
- (void) createOctogon:(float)left btm:(float)bottom b:(float)back 
                     r:(float)right t:(float)top f:(float)front c:(GLColor*)color;
- (void) createModel:(GameonModelData_Type)type left:(float)aleft bottom:(float)abottom back:(float)aback 
               right:(float)aright top:(float)atop front:(float)afront tid:(int) textid ;


- (void) createModel:(GameonModelData_Type)type ti:(int)textid;

- (void) createModel:(GameonModelData_Type)type left:(float)aleft bottom:(float)abottom back:(float)aback 
               right:(float)aright top:(float)atop front:(float)afront c:(GLColor*) color;


- (void) createPlane:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front c:(GLColor*)color;
- (void) createPlane2:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front c:(GLColor*)color;
- (void) createPlane3:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front c:(GLColor*)color;
- (void) createPlane4:(float)left btm:(float)bottom b:(float)back 
                    r:(float)right t:(float)top f:(float)front c1:(GLColor*)color c2:(GLColor*)color;

- (void) setTexture:(int) i ;

- (void) createPlaneForLetter:(float)left btm:(float)bottom b:(float)back 
                            r:(float)right t:(float)top f:(float)front c:(GLColor*)color;

- (void) createCard:(float)left btm:(float)bottom b:(float)back 
                  r:(float)right t:(float)top f:(float)front c:(GLColor*)color;

- (void) createCard2:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front c:(GLColor*)color;

-(void) setState:(int) state;

-(void) createAnimTrans:(NSString*)type delay:(int)delay away:(bool)away  no:(int) no;

- (id) initWithName:(NSString*)name app:(GameonApp*)app;

- (void) createPlaneTex:(float)left btm:(float)bottom b:(float)back r:(float)right t:(float)top f:(float)front 
                    tu1:(float)tu1 tv1:(float)tv1 tu2:(float)tu2 tv2:(float)tv2 c:(GLColor**)colors
                     no:(float)no div:(float)div;
- (void) createPlaneTex2:(float)left btm:(float)bottom b:(float)back r:(float)right t:(float)top f:(float)front 
                    tu1:(float)tu1 tv1:(float)tv1 tu2:(float)tu2 tv2:(float)tv2 c:(GLColor**)colors
                     no:(float)no div:(float)div;
-(void) addVisibleRef:(GameonModelRef*) ref;
-(void) remVisibleRef:(GameonModelRef*) ref;
- (void) createFrame:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front 
                  fw:(float)fw fh:(float)fh c:(GLColor*)color;
-(void) setVisible:(bool) visible;
-(bool) getVisible;

-(GameonModelRef*) ref:(int)no;
-(int) findRef:(GameonModelRef*)ref;
-(void) unsetWorld;
-(void)setActive:(bool) active;
-(void) createAnim:(NSString*)type forId:(int)refid delay:(NSString*)delay data:(NSString*) data;

@end

