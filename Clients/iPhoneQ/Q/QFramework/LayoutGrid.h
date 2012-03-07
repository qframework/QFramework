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
#import "ServerkoParse.h"

@class GameonWorld;
@class GameonApp;
@class GameonModel;
@class LayoutArea;
@class AreaIndexPair;

@interface Areas : NSObject {
    NSMutableArray* areas;
    bool mVisible;
    bool mIsHiding;
}

@property (nonatomic, assign) NSMutableArray* areas;
@property (nonatomic, assign) bool mVisible;
@property (nonatomic, assign) bool mIsHiding;

@end

@interface LayoutGrid : NSObject {

    GameonApp*      mApp;
    GameonWorld*    mWorld;
    
    NSMutableArray*      mVisibleAreas;
    NSMutableDictionary* mAreas;
    NSMutableDictionary* mAreasHud;
    NSMutableDictionary* mPageIds;
    GameonModel*    mModelBack;
    NSString*       mPagePopup;
    
}

@property (nonatomic, readonly) NSString* mPagePopup;

- (id) initWithApp:(GameonApp*)app;
-(void) setWorld:(GameonWorld*)world app:(GameonApp*)app;
-(void) initLayout2:(NSMutableDictionary*)responses;
-(void) onEvent2:(NSMutableDictionary*)responses;
-(LayoutArea*) processAreaData2:(NSMutableDictionary*)areaData;
-(void) onAreaUpdateItems:(NSString*)type data:(NSString*) strData;
-(void) onAreaFieldMoveItem:(NSString*)type data:(NSString*) strData;
-(void) onAreaFieldMoveItemA:(NSString*)type data:(NSString*) strData;
-(void) onAreaFieldRemoveItem:(NSString*)type data:(NSString*) strData ;
-(void) moveFigureA:(NSString*)areaFrom indexFrom:(int)indexFrom areaTo:(NSString*)areaTo
        indexTo:(int)indexTo type:(NSString*)movetype delay:(NSString*)delay path:(NSArray*)path;
-(AreaIndexPair*)onClickNearest:(float*)vec vecHud:(float*)vecHud;
-(AreaIndexPair*)onDragNearest:(float*)vec vecHud:(float*)vecHud;
-(void) setVisibleArea:(LayoutArea*)area visible:(bool)visible;
-(void) addToPage:(LayoutArea*)area forPage:(NSString*)pageid;
-(void) showPage:(NSString*)pageid data:(NSString*)respdata;
-(void) hidePage:(NSString*)pageid data:(NSString*)respdata;
-(void) animScreen:(NSString*)resptype data:(NSString*) respdata;
-(void) clearPage:(NSString*) pageid;
-(void) onCameraFit:(NSString*)type data:(NSString*) strData;
-(void) onCameraFitHud:(NSString*)type data:(NSString*) strData;
-(LayoutArea*) getArea:(NSString*)areaID;

@end
