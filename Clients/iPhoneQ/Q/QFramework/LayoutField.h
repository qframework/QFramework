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
#import "LayoutTypes.h"

@class TextItem;
@class LayoutArea;
@class LayoutField;
@class LayoutItem;
@class GameonModelRef;
@class GameonApp;
@class GameonModelRef;

@interface LayoutField : NSObject {

    int mID;
    float mX;
    float mY;
    float mZ;
    float mW;
    float mH;
    float mMarginX;
    float mMarginY;
    LayoutItem* mItem;
    LayoutArea* mParent;
    LayoutFieldType mType;
    TextItem* mText;
    int mGridx;
    int mGridy;
    int mGridSzX;
    int mGridSzY;    
    int mAlignX;
    int mAlignY;
    LayoutFieldFieldType mFieldType;
    int mOwner;

    float mRandX;
    float mRandY;
    float mRandRotZ;
    float mItemRotX;
    float mItemRotY;
    float mItemRotZ; 

	GameonModelRef* mRef;
    GameonApp*  mApp;
	
    LayoutAreaState mState;
    bool 			mActive;	
}


@property (nonatomic, assign) GameonModelRef* mRef;
@property (nonatomic, assign) int mID;
@property (nonatomic, assign) float mX;
@property (nonatomic, assign) float mY;
@property (nonatomic, assign) float mZ;
@property (nonatomic, assign) float mW;
@property (nonatomic, assign) float mH;
@property (nonatomic, assign) float mMarginX;
@property (nonatomic, assign) float mMarginY;
@property (nonatomic, assign) LayoutItem* mItem;
@property (nonatomic, assign) LayoutArea* mParent;
@property (nonatomic, assign) LayoutFieldType mType;
@property (nonatomic, assign) TextItem* mText;
@property (nonatomic, assign) int mGridx;
@property (nonatomic, assign) int mGridy;
@property (nonatomic, assign) int mGridSzX;
@property (nonatomic, assign) int mGridSzY;
@property (nonatomic, assign) LayoutFieldFieldType mFieldType;
@property (nonatomic, assign) float mRandX;
@property (nonatomic, assign) float mRandY;
@property (nonatomic, assign) float mRandRotZ;
@property (nonatomic, assign) float mItemRotX;
@property (nonatomic, assign) float mItemRotY;
@property (nonatomic, assign) float mItemRotZ;    
@property (nonatomic, assign) bool 	mActive;


- (id)initWithParent:(LayoutArea*)parent;
-(void) setItem:(NSString*)itemID doeffect:(bool)doeffect showback:(bool)showback;
-(void) setItem2:(LayoutItem*)item doeffect:(bool)doeffect showback:(bool)showback;
-(void) getLoc:(GameonModelRef*) loc;
-(void) setText:(NSString*)data len:(int)num;
-(void) removeFigure;
-(void) setNoFigure;
-(void) setState:(int)state;
-(void) clear;
-(void) setOwner:(int)owner;
-(void) invertItem;
-(void) updateLocation;
-(void) createAnimTrans:(NSString*)movetype delay:(int)delay away:(bool)away;
-(void) setScale;
-(void) createAnim:(NSString*)type delay:(NSString*)delay data:(NSString*)data ;

@end
