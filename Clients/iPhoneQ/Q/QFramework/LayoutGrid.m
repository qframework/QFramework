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


#import "LayoutGrid.h"
#import "GameonWorld.h"
#import "GameonApp.h"
#import "GameonCS.h"
#import "TextItem.h"
#import "GameonModel.h"
#import "ServerkoParse.h"
#import "TextRender.h"
#import "LayoutAreaText.h"
#import "LayoutAreaTable.h"
#import "LayoutAreaLayout.h"
#import "LayoutAreaCards.h"
#import "LayoutItem.h"
#import "AreaIndexPair.h"
#import "GameonModelRef.h"
#import "SoundFactory.h"
#import "ColorFactory.h"
#import "TextureFactory.h"
#import "ItemFactory.h"
#import "Settings.h"
#import "TextureFactory.h"
#import "SoundFactory.h"
#import "AnimFactory.h"
#import "GameonWorldView.h"

@implementation Areas

@synthesize areas;
@synthesize mVisible;
@synthesize mIsHiding;

- (id) init
{
	if (self = [super init])
	{
        areas = [[NSMutableArray alloc] init];
        mVisible = false;
        mIsHiding = false;  
    }
        return self;
}


- (void) dealloc 
{
    [areas release];
        [super dealloc];
}

@end

@implementation LayoutGrid

@synthesize mPagePopup;

- (id) initWithApp:(GameonApp*)app
{
	if (self = [super init])
	{
        mApp = app;        
        mAreas = [[NSMutableDictionary alloc] init];
        mAreasHud = [[NSMutableDictionary alloc] init];
        mPageIds = [[NSMutableDictionary alloc] init];
        mVisibleAreas = [[NSMutableArray alloc] init];
        mModelBack = nil;
        mPagePopup = @"";

    }

    return self;
}

- (void) dealloc 
{
    //NSLog(@" 1 cnt %d " , [mStdOut1 retainCount]);
    //NSLog(@" 2 cnt %d " , [mStdOut2 retainCount]);    
    //for (int a=0; a< [mAreas count]; a++)
    //    NSLog(@" areas cnt %d " , [[mAreas objectAtIndex:a] retainCount]);

    [mModelBack release];
    [mVisibleAreas release];    
    [mPageIds release];    
    [mAreas release];
    [mAreasHud release];
    [super dealloc];
}

-(LayoutArea*) getArea:(NSString*)areaID
{
    LayoutArea* area = [mAreas objectForKey:areaID];
    if (area != nil)
    {
        return area;
    }
    
    LayoutArea* areahud = [mAreasHud objectForKey:areaID];
    if (areahud != nil)
    {
        return areahud;
    }
    
            
    return nil;
}


-(void) removeArea:(LayoutArea*) area
{
    
    if ( [mVisibleAreas indexOfObject:area] != NSNotFound)
    {
        [mVisibleAreas removeObject:area];
    }
    if ( [mAreas objectForKey:area.mID] != nil)
    {
        [mAreas removeObjectForKey:area.mID];
    }
    if ( [mAreasHud objectForKey:area.mID] != nil)
    {
        [mAreasHud removeObjectForKey:area.mID];
    }

    [area clear:true];    
    Areas* areap = [mPageIds objectForKey:area.mPageID];
    if (areap != nil)
    {
        [areap.areas removeObject:area];
    }
    [area release];
    
}

-(void) onAreaDelete:(NSString*)areaID data:(NSString*) strData {
    LayoutArea* area = [self getArea:areaID];
    if (area != nil)
    {
        [self removeArea:area];
    }
    
}

-(void) onAreaSwapId:(NSString*) areaid1 area2:(NSString*) areaid2
{
    LayoutArea* area1 = [self getArea:areaid1];
    LayoutArea* area2 = [self getArea:areaid2];
    if (area1 == nil || area2 == nil)
    {
        return;
    }
    if ( [mAreas objectForKey:area1.mID] != nil)
    {
        [mAreas removeObjectForKey:area1.mID];
    }
    if ( [mAreas objectForKey:area2.mID] != nil)
    {
        [mAreas removeObjectForKey:area1.mID];
    }
    
    NSString* id = area1.mID;
    area1.mID = area2.mID;
    area2.mID = id;
    
    [mAreas setObject:area1.mID  forKey:area1];
    [mAreas setObject:area2.mID  forKey:area2];
    
}



-(void) onAreaFieldSetItem:(NSString*)type data:(NSString*)strData
{
    NSArray* tokens = [strData componentsSeparatedByString:@","];
    
    NSString* areaid = [tokens objectAtIndex:0];
    int index = [[tokens objectAtIndex:1] intValue];
    LayoutArea* area = [self getArea:areaid];
    if (area != nil ) {
        [area fieldSetItem:index itemid:type];
    }
    
}

-(void) areaUpdateText:(NSString*)areaid data:(NSString*) strData
{
    {
        LayoutArea* area = [self getArea:areaid];
        if (area != nil) {
            [area setText:strData];
        }
    }
}

-(void) areaUpdateTextColor:(NSString*)areaid data:(NSString*) strData
{
    {
        LayoutArea* area = [self getArea:areaid];
        if (area != nil) {
            [area setTextColor:strData];
        }
    }
}

-(void)moveFigure:(NSString*)areaFrom indexFrom:(int)indexFrom areaTo:(NSString*)areaTo
                        indexTo:(int) indexTo 
{
    LayoutItem* item = nil;
    LayoutArea* arearemove = nil;
    LayoutArea* areaset = nil;
    
    arearemove = [self getArea:areaFrom];
    areaset = [self getArea:areaTo];
    
    if (arearemove != nil) {
        item = [arearemove getItem:indexFrom];
        if (item == nil) {
            // ERROR
            //Log.d("model", "error " + areaFrom + " " + indexFrom + " "+ areaTo + " " + indexTo);
            return;
        }
        [arearemove setNoFigure:indexFrom];
        
    }
    
    if (item == nil) {
        return;
    }
    
    if (areaset != nil) {
        [areaset placeFigure:indexTo item:item showback:false];
    
    }

    

}

-(void)onItemAnim:(NSString*)type data:(NSString*) strData  
{
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        NSArray* tok = [strData componentsSeparatedByString:@"|"];

        NSString* indexes = [tok objectAtIndex:0];
        NSString* animtype = [tok objectAtIndex:1];
        
        [area itemAnim:indexes data:animtype];
    }
    
}


-(void)onItemsAnim:(NSString*)type data:(NSString*) strData 
{
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area itemsAnim:strData];
    }
    
}

-(void) onAreaUpdateItem:(NSString*)type data:(NSString*)strData doanim:(bool)doanim
{
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateItem:strData showback:doanim];
    }		
}

-(void) onAreaInvertItem:(NSString*)type data:(NSString*)strData
{
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area invertItem:strData];
    }		
}

-(void)onAreaUpdateItemsA:(NSString*)type data:(NSString*) strData
{
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateItemsA:strData];
    }
	
}

-(void)onAreaUpdateOnclick:(NSString*)type data:(NSString*) strData
{
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateOnclick:strData];
    }
    
}

-(void)onAreaUpdateOnFocusLost:(NSString*)type data:(NSString*) strData
{
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateOnFocusLost:strData];
    }
    
}

-(void)onAreaUpdateOnFocusGain:(NSString*)type data:(NSString*) strData
{
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateOnFocusGain:strData];
    }
    
}


-(void) onAreaClear:(NSString*)type data:(NSString*) strData clearall:(bool)all
{
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area clear:all];
    }
    
}

-(void) setAreaState:(NSString*)type data:(NSString*) strData {
    
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        Areas* areas = [mPageIds objectForKey:area.mPageID];
        if (areas == nil)
        {
            return;
        }
        bool pagevis = areas.mVisible;
        
        [area updateState:strData init:false visible:pagevis];
    }
}


-(void) onAreaPushFrontItem:(NSString*)type data:(NSString*) strData {
    
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area pushFrontItem:strData];
    }
}

-(void) setAreaLocation:(NSString*)type data:(NSString*) strData {
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateLocation:strData];
    }
    
}

-(void) setAreaBounds:(NSString*)type data:(NSString*) strData {
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateBounds:strData];
    }
    
}

-(void) setAreaRotation:(NSString*)type data:(NSString*) strData {
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateLocation:strData];
    }
    
}



-(void) setAreaScale:(NSString*)type data:(NSString*) strData {
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area setScale:strData];
    }
}

-(void) setAreaItemScale:(NSString*)type data:(NSString*) strData {
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area setItemScale:strData];
    }
}


-(void) setAreaSize:(NSString*)type data:(NSString*) strData {
    
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area clear:false];
        [area setSize:strData];
    }
}

-(void) areaUpdateBackground:(NSString*)type data:(NSString*) strData {
    
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateBackground:strData clear:true];
    }
}

-(void) areaUpdateBorder:(NSString*)type data:(NSString*) strData {
    
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateBorder:strData];
    }
}

-(void) areaUpdateForeground:(NSString*)type data:(NSString*) strData {
    
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateForeground:strData];
    }
}


-(void) onEndScore:(NSString*)type data:(NSString*) strData
{
    
    [mApp onEndScore:strData];
    
}

-(void) onCameraFit:(NSString*)type data:(NSString*) strData
{
    
    if ( [type isEqual:@"fit"])
    {
        NSArray* tokens = [strData componentsSeparatedByString:@","]; 
        float canvasw = [[tokens objectAtIndex:0] floatValue];
        float canvash = [[tokens objectAtIndex:1] floatValue];
        float eye[3] = { 0.0f,0.0f,1};
        float center[3] ={ 0.0f, 0.0f, 0.0f};
        float up[3] = { 0.0f, 1.0f, 0.0f };
        [mApp.cs initCanvas:canvasw/2 h:canvash/2 o:0];
        [mApp.cs snap_cam_z:eye center:center up:up];        
        //NSLog(@"z = %f",z);
        [mApp setScreenBounds];        
    }
}

-(void) onCameraSet:(NSString*)lookAt data:(NSString*) eyeStr
{
    
    NSArray* tokens = [lookAt componentsSeparatedByString:@","]; 
    float lookat[3];
    lookat[0] = [[tokens objectAtIndex:0] floatValue];
    lookat[1] = [[tokens objectAtIndex:1] floatValue];
    lookat[2] = [[tokens objectAtIndex:2] floatValue];        

    NSArray* tokens2 = [eyeStr componentsSeparatedByString:@","];         
    float eye[3];
    eye[0] = [[tokens2 objectAtIndex:0] floatValue];
    eye[1] = [[tokens2 objectAtIndex:1] floatValue];
    eye[2] = [[tokens2 objectAtIndex:2] floatValue];        
    
    [mApp.cs setCamera:lookat eye:eye];
    [mApp setScreenBounds];    
}

-(void) onCameraFitHud:(NSString*)type data:(NSString*) strData
{
  
    if ( [type isEqual:@"fit"])
    {
        NSArray* tokens = [strData componentsSeparatedByString:@","]; 
        float canvasw = [[tokens objectAtIndex:0] floatValue];
        float canvash = [[tokens objectAtIndex:1] floatValue];
        float eye[3] = { 0.0f,0.0f,1};
        float center[3] ={ 0.0f, 0.0f, 0.0f};
        float up[3] = { 0.0f, 1.0f, 0.0f };
        [mApp.cs initCanvas:canvasw/2 h:canvash/2 o:0];
        [mApp.cs snap_cam_z_hud:eye center:center up:up];        
        //NSLog(@"z = %f",z);

        [mApp setScreenBounds];
    }
}

-(void) onCameraSetHud:(NSString*)lookAt data:(NSString*) eyeStr
{
    
    NSArray* tokens = [lookAt componentsSeparatedByString:@","]; 
    float lookat[3];
    lookat[0] = [[tokens objectAtIndex:0] floatValue];
    lookat[1] = [[tokens objectAtIndex:1] floatValue];
    lookat[2] = [[tokens objectAtIndex:2] floatValue];        
    
    NSArray* tokens2 = [eyeStr componentsSeparatedByString:@","];         
    float eye[3];
    eye[0] = [[tokens2 objectAtIndex:0] floatValue];
    eye[1] = [[tokens2 objectAtIndex:1] floatValue];
    eye[2] = [[tokens2 objectAtIndex:2] floatValue];        
    
    [mApp.cs setCameraHud:lookat eye:eye];
    [mApp setScreenBounds];
}

-(void) onCameraProjHud:(NSString*)fov data:(NSString*)far data2:(NSString*)near
{
	float fovf = [fov floatValue];
	float farf = 0;
	float nearf = 0;
    nearf  = [far floatValue];
	farf = [near floatValue];

    GameonWorldView* v = mApp.view;
    [v setFovHud:fovf near:nearf far:farf];
	[mApp setScreenBounds];	
}


-(void) onCameraProj:(NSString*)fov data:(NSString*) far data2:(NSString*)near
{
	float fovf = [fov floatValue];
	float farf = 0;
	float nearf = 0;
    nearf  = [far floatValue];
	farf = [near floatValue];

    GameonWorldView* v = mApp.view;
    [v setFov:fovf near:nearf far:farf];
	[mApp setScreenBounds];
}


-(void) goUrl:(NSString*)type data:(NSString*) data
{
        
    NSURL *url = [NSURL URLWithString:data];
    [[UIApplication sharedApplication] openURL:url];    
}

-(void) areaAnim:(NSString*)areaid type:(NSString*)type delay:(NSString*)delay data:(NSString*) data
{
	
	LayoutArea* area = [self getArea:areaid];
	if (area != nil) {
		[area anim:type delay:delay data:data];
	}
	
}

-(void)areaSetScrollers:(NSString*)areaid data:(NSString*)strData 
{
	LayoutArea* area = [self getArea:areaid];
	if (area != nil) {
		//area.clear();
		[area setScrollers:strData];
	}
}



-(void) onEvent2:(NSMutableDictionary*)response
{
    NSString* respid = [response valueForKey:@"id"];
    NSString* respdata = [response valueForKey:@"data"];
	NSString* respdata2 = [response valueForKey:@"data2"];
	NSString* respdata3 = [response valueForKey:@"data3"];
	//NSString* respdata4 = [response valueForKey:@"data4"];
    NSString* resptype = [response valueForKey:@"type"];

    int eventid = [respid intValue];
    //NSLog(@" %d " , eventid);
    
    
    switch (eventid) {
        case 1200:
            [self goUrl:resptype data:respdata];
            break;            
            
        case 2012:
            mPagePopup = [[NSString alloc] initWithString:resptype];
        case 2010:
            [self showPage:resptype data:nil];
            break;
        case 2013:
            mPagePopup = [[NSString alloc] initWithString:resptype];
        case 2011:
            [self showPage:resptype data:respdata];
            break;            
		case 2015:
			[self clearPage:resptype];
			break;
        case 2020:
            if ([mPagePopup isEqualToString:resptype])
                mPagePopup = @"";
            [self hidePage:resptype data:nil];
            break;
        case 2021:
            if ([mPagePopup isEqualToString:resptype])
                mPagePopup = @"";
            [self hidePage:resptype data:respdata];
            break;            
		case 2030:
            [self animScreen:resptype data:respdata];
            break;            
        case 2500:
            [self onCameraFit:resptype data:respdata];
            break;
        case 2501:
            [self onCameraSet:resptype data:respdata];
            break;            
        case 2502:
            [self onCameraProj:resptype data:respdata data2:respdata2];
            break;			
        case 2510:
            [self onCameraFitHud:resptype data:respdata];
            break;
        case 2511:
            [self onCameraSetHud:resptype data:respdata];
            break;            
        case 2512:
            [self onCameraProjHud:resptype data:respdata data2:respdata2];
            break;            
        case 3001:
            [self onAreaDelete:resptype data:respdata];
            break;				                
        case 3002:
            [self onAreaClear:resptype data:respdata clearall:true];
            break;            
        case 3003:
            [self onAreaSwapId:resptype area2:respdata];
            break;			                   
        case 3004:
            [self onAreaClear:resptype data:respdata clearall:false];
            break;            
            
        case 3041:
            [self onEndScore:resptype data:respdata];
            break;			  
        case 3050:
            [self onAreaFieldSetItem:resptype data:respdata];
            break;
            
        case 3051:	// figure move
            [self onAreaFieldMoveItem:resptype data:respdata];
            break;
        case 3053:	// figure move
            [self onAreaFieldMoveItemA:resptype data:respdata];
            break;
        case 3054:	// figure move
            [self onItemsAnim:resptype data:respdata];
            break;   
        case 3055:	// figure move
            [self onItemAnim:resptype data:respdata];
            break;              
        case 3052:
            [self onAreaFieldRemoveItem:resptype data:respdata];
            break;
        case 3110:	// area new state
            [self setAreaState:resptype data:respdata];
            break;
        case 3130:	// area new state
            [self setAreaSize:resptype data:respdata];
            break;            
        case 3190:	// area new state
            [self setAreaLocation:resptype data:respdata];
            break;            
        case 3191:	// area new state
            [self setAreaScale:resptype data:respdata];
            break;                   
		case 3195:	
			[self setAreaRotation:resptype data:respdata];
			break;              
        case 3192:	// area new state
            [self setAreaItemScale:resptype data:respdata];
            break;            			
        case 3220:
            [self onAreaUpdateItems:resptype data:respdata];
            break;
        case 3221:
            [self onAreaUpdateItemsA:resptype data:respdata];
            break;
        case 3222:
            [self onAreaUpdateItem:resptype data:respdata doanim:false ];
            break;
        case 3223:
            [self onAreaInvertItem:resptype data:respdata ];
            break;            
        case 3224:
            [self onAreaUpdateItem:resptype data:respdata doanim:true ];
            break;
        case 3225:
            [self onAreaPushFrontItem:resptype data:respdata];
            break;	              
            
        case 3240:
            [self areaUpdateForeground:resptype data:respdata];
            
        case 3250:
            [self areaUpdateBackground:resptype data:respdata];
            break;
        case 3260:
            [self areaUpdateBorder:resptype data:respdata];
            break;            
        case 3200:
            [self onAreaUpdateOnclick:resptype data:respdata];
            break;
        case 3201:
            [self onAreaUpdateOnFocusGain:resptype data:respdata];
            break;			
        case 3202:
            [self onAreaUpdateOnFocusLost:resptype data:respdata];
            break;						
        case 3180:
            [self areaUpdateText:resptype data:respdata];
            break;
		case 3120:
			[self areaUpdateTextColor:resptype data:respdata];
			break;				
		case 3400:
			[self areaSetScrollers:resptype data:respdata];
			break;
		case 3210:
			[self areaAnim:resptype type:respdata  delay:respdata2 data:respdata3];
			break;				        
    }		  
}


-(void) setWorld:(GameonWorld*)world app:(GameonApp*)app
{
    mWorld = world;
    mApp = app;
}

-(void) createBackground:(int)canvasW h:(int)canvasH back:(NSString*)strData 
{
    if (mModelBack != nil || strData == nil || [strData length] == 0) {
        return;
    }
    GLColor* colorBackground = nil;
    int colorBackground2 = -1;
    
    if ([strData isEqual:@"none"]) {
        
    } else {
        NSArray* tokens = [strData componentsSeparatedByString:@","];
        
        if ( [tokens count] > 0)
        {
            colorBackground = [mApp.colors getColor:[tokens objectAtIndex:0]];
        }
        if ( [tokens count] > 1)
        {
            colorBackground2 = [mApp.textures getTexture:[tokens objectAtIndex:1]];
        }
        
    }
    
    
    
    
}


-(void) initLayout2:(NSMutableDictionary*)response
{
    // init layout
    
    
    NSMutableArray* areas = [response valueForKey:@"area"];
    
    for (int a=0; a< [areas count]; a++)
    {
        //ServerkoAreaData* pCurr = [response.mAreaDatas objectAtIndex:a];
        NSMutableDictionary* pCurr = [areas objectAtIndex:a];
        LayoutArea* area = [self processAreaData2:pCurr];        
        //NSLog(@"         area  %@ " , area.mID );
        NSString* pageid = [response valueForKey:@"pageid"];
        //NSLog(@" pageid %@" , pageid);
        [self addToPage:area forPage:pageid];
        if( [pageid isEqual:@"*"] )
		{
            [area updateState:@"visible" init:false visible:true];
        }		
    } 
}



-(LayoutArea*) createArea:(NSString*)areaType
{
    
    NSArray* tokens = [areaType componentsSeparatedByString:@"."];
    NSString* type = [tokens objectAtIndex:0];
    NSString* subtype = [tokens objectAtIndex:1];    
    
    if ([type isEqualToString:@"table"]) {
        return [[LayoutAreaTable alloc] initWithSubtype:subtype app:mApp];
    } else if ([type isEqualToString:@"text"]) {
        return [[LayoutAreaText alloc] initWithSubtype:subtype app:mApp];
    } else if ([type isEqualToString:@"layout"]) {
        return [[LayoutAreaLayout alloc] initWithSubtype:subtype app:mApp];
    } else if ([type isEqualToString:@"cards"]) {
        return [[LayoutAreaCards alloc] initWithSubtype:subtype app:mApp];
    }
    return nil;
}


-(LayoutArea*) processAreaData2:(NSMutableDictionary*)areaData
{
    NSString* type = [areaData valueForKey:@"type"];
    NSString* areid = [areaData valueForKey:@"id"];
    
    LayoutArea* areaold = [self getArea:areid];
    if (areaold != nil)
    {
        //NSLog(@" removing %@ " , areid);
        [self removeArea:areaold];
    }
    
    LayoutArea* area = [self createArea:type];
    if (area == nil) {
        return nil;
    }
    
    //area.mModel = mModel;
    
    NSString* strid = [areaData valueForKey:@"id"];    
    area.mID =  [[NSString alloc] initWithString:strid];
    
    // process area data    
    // area size
    NSString* size = [areaData valueForKey:@"size"];    
    if (size != nil) {
        [area setSize:size];
        
    }
    
    NSString* location = [areaData valueForKey:@"location"];
    if (location != nil) {
        [area updateLocation:location];
    }        
    
    // area state
    NSString* state = [areaData valueForKey:@"state"];
    
    if (state != nil) {
        [area updateState:state init:true visible:false];
    }else {
        //[self setVisibleArea:area visible:true];
    }
    
    NSString* bounds = [areaData valueForKey:@"bounds"];
    if (bounds != nil) {
        [area updateBounds:bounds];
    }
    
    NSString* rotation = [areaData valueForKey:@"rotation"];
    if (rotation != nil) {
        [area setRotation:rotation];
    }    
    
    NSString* display = [areaData valueForKey:@"display"];
    if (display != nil) {
        [area updateDisplay:display];
    }

    NSString* layout = [areaData valueForKey:@"layout"];
    if (layout != nil) {
        [area updateLayout:layout];
    }
    
    
    NSString* text = [areaData valueForKey:@"text"];    
    if (text != nil) {
        [area setText:text];
    }
    
    NSString* onclick = [areaData valueForKey:@"onclick"];    
    if (onclick != nil) {
        [area updateOnclick:onclick];
    }
	
    NSString* onfocusgain = [areaData valueForKey:@"onfocusgain"];    
    if (onfocusgain != nil) {
        [area updateOnFocusGain:onfocusgain];
    }

	NSString* onfocuslost = [areaData valueForKey:@"onfocuslost"];    
    if (onfocuslost != nil) {
        [area updateOnFocusLost:onfocuslost];
    }
    
    NSString* background = [areaData valueForKey:@"background"];    
    if (background != nil) {
        [area updateBackground:background clear:false];
    }

    NSString* border = [areaData valueForKey:@"border"];    
    if (border != nil) {
        [area updateBorder:border];
    }
    
    NSString* foreground = [areaData valueForKey:@"foreground"];    
    if (foreground != nil) {
        [area updateForeground:foreground];
    }
	
    NSString* colors = [areaData valueForKey:@"colors"];    
    if (colors != nil) {
        [area updateColors:colors];
    }	
    
    NSString* fields = [areaData valueForKey:@"fields"];    
    if (fields != nil) {
        [area createFields:fields];
    }
	
    NSString* scrolls = [areaData valueForKey:@"scrollers"];    
    if (scrolls != nil) {
        [area setScrollers:scrolls];
    }
	
    
    [area initLayout];
    
    NSString* items = [areaData valueForKey:@"items"];    
    if (items != nil) {
        [area createItems:items doeffect:false];
    }
    [area createWorldModel];
	[area updateModelsTransformation];
    
    
    if (area.mDisplay == GWLOC_HUD) {
        if ([mAreasHud objectForKey:area.mID] != nil)
        {
            return area;
        }
        [mAreasHud setObject:area forKey:area.mID];
    } else {
        [mAreas setObject:area forKey:area.mID];
    }
    
    
    
    return area;
}



-(void) onAreaUpdateItems:(NSString*)type data:(NSString*) strData
{
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area updateItems:strData];
    }
}	    

-(void) onAreaFieldMoveItem:(NSString*)type data:(NSString*) strData
{
    // areaFrom, indexFrom,  areaTo, indexTo
    NSArray* tokens = [strData  componentsSeparatedByString:@","];
    
    NSString*   areaFrom = nil;
    NSString*   areaTo = nil;
    int indexFrom = 0;
    int indexTo = 0;
    
    if ([tokens count] > 0) areaFrom = [tokens objectAtIndex:0];
    if ([tokens count] > 1) indexFrom = [[tokens objectAtIndex:1] intValue];
    if ([tokens count] > 2) areaTo = [tokens objectAtIndex:2];
    if ([tokens count] > 3) indexTo = [[tokens objectAtIndex:3] intValue];
    
    
    [self moveFigure:areaFrom indexFrom:indexFrom areaTo:areaTo indexTo:indexTo];
}

-(void) onAreaFieldMoveItemA:(NSString*)type data:(NSString*) strData
{
    // areaFrom, indexFrom,  areaTo, indexTo
    NSArray* tokens = [strData  componentsSeparatedByString:@","];
    
    NSString*   areaFrom = nil;
    NSString*   areaTo = nil;
    int indexFrom = 0;
    int indexTo = 0;
    
    if ([tokens count] > 0) areaFrom = [tokens objectAtIndex:0];
    if ([tokens count] > 1) indexFrom = [[tokens objectAtIndex:1] intValue];
    if ([tokens count] > 2) areaTo = [tokens objectAtIndex:2];
    if ([tokens count] > 3) indexTo = [[tokens objectAtIndex:3] intValue];
    
    NSString* movetype = nil;
    NSString* delay = nil;
    
    if ([tokens count] > 4)movetype = [tokens objectAtIndex:4];
    if ([tokens count] > 5)delay = [tokens objectAtIndex:5];
    //NSLog(@" moveItemA %@ %d" , strData, [tokens count]);
    if ([tokens count] < 8 || [tokens count] % 2 )
    {
        [self moveFigureA:areaFrom indexFrom:indexFrom areaTo:areaTo indexTo:indexTo type:movetype delay:delay path:nil];
        return;
    }
    
    NSMutableArray* path = [[[NSMutableArray alloc] init] autorelease];
    for (int a=6; a< [tokens count]; a+=2)
    {
        AreaIndexPair* p = [[[AreaIndexPair alloc] init] autorelease];
        p.mArea = [tokens objectAtIndex:a];
        p.mIndex = [[tokens objectAtIndex:a+1] intValue];
        [path addObject:p];
    }
    [self moveFigureA:areaFrom indexFrom:indexFrom areaTo:areaTo indexTo:indexTo type:movetype delay:delay path:path];
}

-(void) onAreaFieldRemoveItem:(NSString*)type data:(NSString*) strData 
{
    int indexFrom = [strData intValue];
    
    LayoutArea* area = [self getArea:type];
    if (area != nil) {
        [area removeFigure:indexFrom];
    }
}

-(void) moveFigureA:(NSString*)areaFrom indexFrom:(int)indexFrom areaTo:(NSString*)areaTo 
                    indexTo:(int)indexTo type:(NSString*)movetype delay:(NSString*)delay path:(NSArray*)path 
{
    
    // TODO move animation
    GameonModelRef* startAnim = nil;
    GameonModelRef* endAnim = nil;
    LayoutItem* item = nil;
    LayoutArea* arearemove = nil;
    LayoutArea* areaset = nil;
    
    arearemove = [self getArea:areaFrom];
    areaset = [self getArea:areaTo];
    
    if (arearemove != nil) {
        item = [arearemove getItem:indexFrom];
        if (item == nil) {
            // ERROR
            //Log.d("model", "error " + areaFrom + " " + indexFrom + " "+ areaTo + " " + indexTo);
            return;
        }
        
		startAnim = [[GameonModelRef alloc] initWithParent:nil];
        [startAnim copy:item.mModelRef];
		[startAnim copyMat:item.mModelRef];
        [arearemove setNoFigure:indexFrom];
    }
    
    if (item == nil) {
        return;
    }
    
    if (areaset != nil) {
        if ([movetype  isEqualToString:@"walk2back"]) 
        {
            [areaset placeFigure:indexTo item:item showback:true];
        }else {
            [areaset placeFigure:indexTo item:item showback:false];
        }

        
        endAnim = item.mModelRef;
    }
    
    if (startAnim != nil && endAnim != nil) {
        [mApp.mAnims animRef:movetype start:startAnim end:endAnim delay:delay];
    }
	[startAnim release];
}

-(AreaIndexPair*)findNearest:(float*)vec vecHud:(float*)vecHud findClick:(bool)click
{
    AreaIndexPair* nearest = nil;    	
    float mindist = 1e7;

    // find first if HUD is clicked
    for (int a=[mVisibleAreas count]-1; a >=0 ; a--)
    {
        LayoutArea* ahud = [mVisibleAreas objectAtIndex:a];
		if (ahud.mActiveItems == 0)
		{
			continue;
		}		
		if (click)
		{
			if ( ahud.mOnclick == nil || [ahud.mOnclick length] == 0 )
				continue;
		}else
		{
			if (!ahud.mHasScrollV && !ahud.mHasScrollH)
			{		
				if ( (ahud.mOnFocusGain== nil || [ahud.mOnFocusGain length] == 0) &&  
					(ahud.mOnFocusLost== nil || [ahud.mOnFocusLost length] == 0))
					continue;
			}
		}
		
        if (ahud.mState != LAS_VISIBLE || ahud.mDisplay != GWLOC_HUD)            
        {
            continue;
        }
        AreaIndexPair* pair = [ahud fieldClicked:[mApp.cs eyeHud] vec:vecHud];
        if (pair != nil && pair.mDist <= mindist)
        {
			[nearest release];
			nearest = pair;
			mindist = pair.mDist;

        }
    }

    if (mindist != 1e7){
        return nearest;
    }
    
    [nearest release];
    nearest = nil;
    
    for (int a=[mVisibleAreas count]-1; a >=0 ; a--)
    {
        LayoutArea* area = [mVisibleAreas objectAtIndex:a];
		if (area.mActiveItems == 0)
		{
			continue;
		}
		
		if (click)
		{
			if ( area.mOnclick == nil || [area.mOnclick length] == 0 )
				continue;
		}else
		{
			if (!area.mHasScrollV && !area.mHasScrollH)
			{
				if ( (area.mOnFocusGain== nil || [area.mOnFocusGain length] == 0) &&  
					(area.mOnFocusLost== nil || [area.mOnFocusLost length] == 0))
					continue;
			}
		}
		
        if (area.mState != LAS_VISIBLE || area.mDisplay == GWLOC_HUD)
        {
            continue;
        }
		
        AreaIndexPair* pair = [area fieldClicked:[mApp.cs eye] vec:vec];
        if (pair != nil && pair.mDist <= mindist)
        {
			[nearest release];
			nearest = pair;
			mindist = pair.mDist;

        }
    }
    
    if (mindist != 1e7){
        return nearest;
    }

    return nil;
}


-(AreaIndexPair*)onDragNearest:(float*)vec vecHud:(float*)vecHud
{
	return [self findNearest:vec vecHud:vecHud findClick:false];
}

-(AreaIndexPair*)onClickNearest:(float*)vec vecHud:(float*)vecHud
{
	return [self findNearest:vec vecHud:vecHud findClick:true];
}



-(void) setVisibleArea:(LayoutArea*)area visible:(bool)visible
{
    Areas* areas = [mPageIds objectForKey:area.mPageID];
    if (areas == nil)
    {
        return;
    }
    bool pagevis = areas.mVisible;
    
    if (visible && pagevis)
    {
        if ( [mVisibleAreas indexOfObject:area] == NSNotFound)
        {
            [mVisibleAreas addObject:area];
        }
    }else if (!visible && !pagevis) //
    {
        if ( [mVisibleAreas indexOfObject:area] != NSNotFound)
        {
            [mVisibleAreas removeObject:area];
        }
    }


}

-(void) addToPage:(LayoutArea*)area forPage:(NSString*)pageid
{
    if (area == nil)
    {
        return;
    }
    Areas* areas = [mPageIds objectForKey:pageid];
    if (areas == nil)
    {
        areas = [[Areas alloc] init];
        [mPageIds setObject:areas forKey:pageid];        
		if ([pageid isEqual:@"*"])
		{
			areas.mVisible = true;
		}
		
    }
    area.mPageID  = [[NSString alloc] initWithString:pageid];
    if ([areas.areas indexOfObject:area] == NSNotFound)
    {
        [areas.areas addObject:area];    
        area.mPageVisible = areas.mVisible;
    }else {
        NSLog(@" adding area that exists!!!!!!");
    }

}


-(void) showPage:(NSString*)pageid data:(NSString*)respdata
{
    Areas* areas = [mPageIds objectForKey:pageid];
    if (areas == nil)
    {
        return;
    }
    if (areas.mVisible)
    {
        //return;
    }    
    areas.mVisible = true;
    for (int a =0 ; a< [areas.areas count]; a++)
    {
        LayoutArea* area = [areas.areas objectAtIndex:a];
        if (respdata != nil)
        {
            [area initAnim:respdata away:false];            
            [area performSelector:@selector(disableInput:) withObject:false afterDelay:[respdata doubleValue]/1000];
        }else {
            [area disableInput:false];
        }

        // todo - enable input after anim is done
        area.mPageVisible = true;
        [area setInitState];
    }
    
    
}

-(void) hidePage:(NSString*)pageid data:(NSString*)respdata
{

    Areas* areas = [mPageIds objectForKey:pageid];
    if (areas == nil)
    {
        return;
    }
    if (!areas.mVisible)
    {
        return;
    }    
    
    if (respdata != nil && areas.mIsHiding)
    {
        return;
    }

    if (respdata == nil)
    {
        areas.mVisible = false;
        areas.mIsHiding = false;
    }else {
        areas.mIsHiding = true;
    }

    
    int delay = 0;
    for (int a =0 ; a< [areas.areas count]; a++)
    {
        LayoutArea* area = [areas.areas objectAtIndex:a];
        if (respdata != nil)
        {
            delay = [area initAnim:respdata away:true] - 100;
        }else
        {
            area.mPageVisible = false;
            areas.mIsHiding = false;
            [area setInitState];
        }
        [area disableInput:true];
    }
    
    if (respdata != nil)
    {
        NSString* strdel = [NSString stringWithFormat:@"%d",delay];
        NSString* strdata = [NSString stringWithFormat:@"Q.layout.hide_('%@');" ,pageid];
        [mApp sendExec:strdel script:strdata];        
    }

}

-(void) animScreen:(NSString*)resptype data:(NSString*) respdata
{
	if ([resptype isEqual:@"color"])
	{
		NSArray* tok = [respdata componentsSeparatedByString:@","];
		//"1000,FFFFFFFF,00000000,FFFFFFFF"
		GLColor* color1 = mApp.colors.white;
		GLColor* color2 = mApp.colors.black;
		GLColor* color3 = nil;
		
		
		int delay = [[tok objectAtIndex:0] intValue];
		if ([tok count] > 1)
			color1 = [mApp.colors getColor:[tok objectAtIndex:1]];
		if ([tok count] > 2)
			color2 = [mApp.colors getColor:[tok objectAtIndex:2]];
		if ([tok count] > 3)
			color3 = [mApp.colors getColor:[tok objectAtIndex:3]];
		
		[mApp.anims createAnimColor:delay c1:color1 c2:color2 c3:color3];
		
	}
}

-(void) clearPage:(NSString*) pageid {
	Areas* areas = [mPageIds objectForKey:pageid];
	if (areas == nil)
	{
		return;
	}
	
	[self hidePage:pageid data:nil];
	
	//int len = [areas.areas count];
	while ([areas.areas count])
	{
		LayoutArea* area = [areas.areas objectAtIndex:0];
        [self removeArea:area];
		//[area clear:true];
	}
	[mPageIds removeObjectForKey:pageid];
    [areas release];
    NSLog(@"size %d %d " , [mAreas count] , [mAreasHud count]);
}

@end
