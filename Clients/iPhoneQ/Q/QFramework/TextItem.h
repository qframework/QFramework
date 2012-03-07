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

#include "LayoutTypes.h"

@class GLColor;
@class GameonModelRef;
@class GameonModel;
@class GameonApp;
@class TextRender;
@class LayoutArea;

@interface TextItem : NSObject {

    float       mX;
    float       mY;
    float       mZ;
    float       mW;
    float       mH;	
    int         mOffset;
    NSString*       mText;
    float       mNum;
    bool    	mVisible;
    float       mDirX;
    float         mDirY;
	GameonWorld_Location mLoc;
	GLColor*	 mColors[4];
	bool		mCentered;
    LayoutArea_Layout mLayout;
    GameonModelRef* mRef;
    GameonModel* mModel;
    TextRender* mParent;
    GameonApp*  mApp;
}


@property (nonatomic, readonly) NSString*         mText;
@property (nonatomic, readonly) GameonModel* mModel;    
@property (nonatomic, readonly) TextRender* mParent;
@property (nonatomic, readonly , getter = ref) GameonModelRef* mRef;

-(id) initWithApp:(GameonApp*)app x:(float)ax y:(float)ay w:(float)aw h:(float)ah z:(float)az t:(NSString*)text n:(float)num  o:(int)offset 
	loc:(GameonWorld_Location)loc layout:(LayoutArea_Layout)layout colors:(GLColor**)colors;
-(id) initWithApp:(GameonApp*)app x:(float)ax y:(float)ay w:(float)aw h:(float)ah z:(float)az t:(NSString*)text o:(int)offset
	loc:(GameonWorld_Location)loc layout:(LayoutArea_Layout)layout colors:(GLColor**)colors;
-(bool)updateText:(NSString*) text loc:(GameonWorld_Location)loc;
- (void)setOrientation:(int)orientation;
- (void)setOffset:(int)offset;
-(void) draw:(int) no;
- (void) set:(bool) updateref;
-(void) setVisible:(bool) visible;
-(void) setPosition:(float)x y:(float)y z:(float)z w:(float)w h:(float) h;
-(int) getVal:(int) val;
-(void) setParent:(TextRender*) parent;
-(void) setRef;
-(void) setParentLoc:(LayoutArea*)area ;

@end
