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
#import "GameonWorld.h"
#import "GLColor.h"

@class GameonWorld;
@class GameonModel;
@class LayoutGrid;
@class GameonModelRef;
@class LayoutItem;
@class AreaIndexPair;
@class GameonApp;
@class AnimData;

@interface LayoutArea : NSObject {


    NSString*                       mID;
    NSString*                       mPageID;    
	GLColor*                        mColors[4];
	float*							mBounds;
	float*							mLocation;
	float*							mScale;
	float*							mRotation;
	float*							mScrollers;

    LayoutAreaType                  mType;
    LayoutAreaState                 mState;
    LayoutAreaState                 mInitState;
    LayoutArea_Layout                mLayout;
    GameonWorld_Location            mDisplay;
    NSMutableArray*                 mItemFields;
    NSString*                       mText;
    int                             mSize;
    int                             mSizeW;
    int                             mSizeH;
	int                             mSizeText;

    GLColor*                        mColorForeground;
    int                             mColorForeground2;
    GLColor*                        mColorBackground;
    int                             mColorBackground2;
    NSString*                       mStrColorBackground;
    NSString*                       mOnclick;
    NSString*                       mOnFocusLost;
    NSString*                       mOnFocusGain;    
    GameonModel*                    mModel;
    GameonModel*                    mModelBack;
    LayoutGrid*                     mParent;
    LayoutAreaBorderType            mBorder;
    bool                            mDisabledInput;
    bool                            mPageVisible;
	bool 							mHasScrollH;
	bool 							mHasScrollV;
	AnimData*						mScollerAnim;
	int 							mActiveItems;	
	GameonApp*						mApp;
}

//@property (nonatomic, assign) GameonModel*    mModel;
@property (nonatomic, readonly) GameonApp*     mApp;
@property (nonatomic, readonly) LayoutGrid*     mParent;
@property (nonatomic, readonly) GameonWorld_Location  mDisplay;
@property (nonatomic, assign) NSString*                           mID;
@property (nonatomic, assign) NSString*                           mPageID;
@property (nonatomic, readonly) LayoutAreaState                 mState;
@property (nonatomic, readonly) LayoutAreaState                 mInitState;
@property (nonatomic, readonly) LayoutArea_Layout mLayout;
@property (nonatomic, assign) bool                      mPageVisible;
@property (nonatomic, readonly) float*	mBounds;
@property (nonatomic, readonly) float*	mLocation;
@property (nonatomic, readonly) float*	mScale;
@property (nonatomic, readonly) float*	mRotation;
@property (nonatomic, readonly) NSString* mOnclick;
@property (nonatomic, readonly) NSString* mOnFocusLost;
@property (nonatomic, readonly) NSString* mOnFocusGain;
@property (nonatomic, assign) float*	mScrollers;
@property (nonatomic, assign) AnimData* mScollerAnim;
@property (nonatomic, readonly) bool mHasScrollH;
@property (nonatomic, readonly) bool mHasScrollV;
@property (nonatomic, readonly) int mActiveItems;	

-(id) initWithSubtype:(NSString*)subtype app:(GameonApp*)app;
-(void) initLayout;
-(void) updateBackground:(NSString*) strData clear:(bool)clear;
-(void) updateBorder:(NSString*) strData;
-(void) updateForeground:(NSString*) strData;
-(void)createFields:(NSString*)strData;
-(void)createItems:(NSString*)strData doeffect:(bool)doeffect;
-(void) createWorldModel;
-(void) setSize:(NSString*)areaType;
-(void) updateLocation:(NSString*) areaType;
-(void) updateBounds:(NSString*)strData ;
-(void) setRotation:(NSString*)strData ;
-(void) updateState:(NSString*)strState init:(bool)initstate visible:(bool)visible;
-(void) updateData:(NSString*) strData ;
-(void) setText:(NSString*)strData;
-(void) updateOnclick:(NSString*)data;
-(void) updateDisplay:(NSString*) strData;
-(void) setField:(int) count;
-(float) getX:(int)x max:(int)max w:(float) w;
-(float) getY:(int)y max:(int) max h:(float) h;
-(float) getDivX:(float)x w:(float) w;
-(float) getDivY:(float)y h:(float)h;
-(void) updateItems:(NSString*)strData;
-(void) fieldSetItem:(int)index itemid:(NSString*) itemID;
-(void) removeFigure:(int) index;
-(void) setNoFigure:(int) index;
-(LayoutItem*) getItem:(int) index ;
-(void) placeFigure:(int) index item:(LayoutItem*) item showback:(bool)showback;
-(void)itemsAnim:(NSString*)strData;
-(void) updateItemsA:(NSString*)strData;
-(AreaIndexPair*) fieldClicked:(float*)eye vec:(float*)ray;
-(void) updateItem:(NSString*)strData showback:(bool) showback;
-(void) itemAnim:(NSString*)indexes data:(NSString*) strData;
-(void) clear:(bool)all;
-(void) setInitState;
-(void) createWorldItemsModel;
-(void) invertItem:(NSString*)strData;
-(void) pushFrontItem:(NSString*)strData;
-(bool) hasTouchEvent;
-(GLColor**) getColors;
-(void) setScale:(NSString*) strData;
-(void) setItemScale:(NSString*) strData;
-(void) updateOnFocusLost:(NSString*)data;
-(void) updateOnFocusGain:(NSString*)data;
-(void) updateColors:(NSString*) strData;
-(int) initAnim:(NSString*)strData away:(bool)away;
-(void) disableInput:(bool)disable;
-(void) setTextColor:(NSString*) strData ;
-(void)updateModelsTransformation;
-(void) updateLayout:(NSString*) areaLayout;
-(void) setScrollerVal:(float) val;
-(void) onDragg:(float)dx y:(float)dy z:(float)dz;
-(void) createCustomModel;
-(void) setScrollers:(NSString*)data;
-(void) anim:(NSString*)type delay:(NSString*)delay data:(NSString*)data;

@end
