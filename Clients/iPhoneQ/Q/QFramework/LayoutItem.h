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
#import "GameonModelData.h"
#import "LayoutArea.h"
#import "LayoutTypes.h"


@class GameonModelRef;
@class AnimData;

@interface LayoutItem : NSObject {

     GameonModelData_Type mType;
     GameonModel*		mModel;
     GameonModelRef*   mModelRef;
     GameonModelRef*   mModelRefOld;
     int 	mOwner;
     int	mOwnerMax;
    
}

@property (nonatomic, assign) GameonModel* mModel;
@property (nonatomic, assign) GameonModelRef* mModelRef;
@property (nonatomic, assign) GameonModelData_Type mType;
@property (nonatomic, assign) int 	mOwner;
@property (nonatomic, assign) int	mOwnerMax;

-(void) setPosition:(GameonWorld_Location)loc x:(float)x y:(float)y z:(float)z
                  w:(float)w h:(float)h doeffect:(bool)doeffect;
-(bool) remove;
-(void) setRand:(float)x y:(float)y z:(float)z rx:(float)rx ry:(float)ry rz:(float) rz;
-(void) setRotation:(float)x y:(float)y z:(float) z;
-(void) addRotation:(float)x y:(float)y z:(float) z;
-(void) setParentLoc:(LayoutArea*) area;
-(void)setRotation2:(float)x y:(float)y z:(float)z;
-(void)setPosition2:(float)x y:(float)y z:(float)z;

@end

