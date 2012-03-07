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

#import "LayoutArea.h"
#import "GameonModel.h"
#import "GameonApp.h"
#import "GameonWorld.h"
#import "LayoutGrid.h"
#import "LayoutField.h"
#import "AreaIndexPair.h"
#import "GameonCS.h"
#import "LayoutItem.h"
#import "ColorFactory.h"
#import "GameonModelRef.h"
#import "TextureFactory.h"
#import "ItemFactory.h"
#import "TextItem.h"
#import "NSData+Base64.h"
#import "AnimFactory.h"
#import "AnimData.h"

@implementation LayoutArea


//@synthesize mModel;
@synthesize mParent;
@synthesize mDisplay;
@synthesize mID;
@synthesize mPageID;
@synthesize mState;
@synthesize mInitState;
@synthesize mLayout;
@synthesize mPageVisible;
@synthesize mBounds;
@synthesize mLocation;
@synthesize mScale;
@synthesize mRotation;
@synthesize mApp;
@synthesize mOnclick;
@synthesize mOnFocusGain;
@synthesize mOnFocusLost;
@synthesize mScrollers;
@synthesize mScollerAnim;
@synthesize mHasScrollH;
@synthesize mHasScrollV;
@synthesize mActiveItems;	

-(id) initWithSubtype:(NSString*)subtype app:(GameonApp*)app
{
    
    self = [super init];
    
    if (self) {
        mColorForeground = 0;

		mScale = malloc(sizeof(float)*3);
		mScale[0] = 1.0f;
		mScale[1] = 1.0f;
		mScale[2] = 1.0f;

		mBounds = malloc(sizeof(float)*3);
		mBounds[0] = 1.0f;
		mBounds[1] = 1.0f;
		mBounds[2] = 1.0f;		
		
		mRotation = malloc(sizeof(float)*3);
		mRotation[0] = 0.0f;
		mRotation[1] = 0.0f;
		mRotation[2] = 0.0f;

		mLocation = malloc(sizeof(float)*5);
		mLocation[0] = 0.0f;
		mLocation[1] = 0.0f;
		mLocation[2] = 0.0f;
		mLocation[3] = 0.0f;
		mLocation[4] = 0.0f;

		
        mBorder = LABT_NONE;
        mType = LAT_NONE;
        mState = LAS_VISIBLE;
        mInitState = LAS_VISIBLE;
        mLayout = LAL_NONE;
        mDisplay = GWLOC_WORLD;
        mItemFields = [[NSMutableArray alloc] init] ;

        mOnclick = nil ;
		mOnFocusLost = nil ;
		mOnFocusGain = nil ;
        mSize = 0;
        mSizeW = 0;//1;
        mSizeH = 1;
		mSizeText = -1;
        mColorForeground = nil;
        mColorForeground2 = 1; 
        mColorBackground2 = 1;
		mStrColorBackground = nil;
        mPageID = nil;

		mApp = app;	
        mParent = app.grid;
		mColors[0] = mApp.colors.white;
		mColors[1] = mApp.colors.white;
		mColors[2] = mApp.colors.white;
		mColors[3] = mApp.colors.white;
        mDisabledInput = false;
        mPageVisible = false;
		
		mHasScrollH = false;
		mHasScrollV = false;
		mActiveItems = 1;
        
        mScrollers = malloc(sizeof(float)*3);
		mScrollers[0] = 0.0f;
		mScrollers[1] = -0.5f;
		mScrollers[2] = 0.5f;		

    }
    return self;
}

-(void) dealloc 
{
    [mStrColorBackground release];
    [mColorBackground release];
    [mColorForeground release];
    [mID release];
    [mItemFields removeAllObjects];
    [mItemFields release];
    [mOnFocusLost release];
    [mOnFocusGain release];
    [mOnclick release];
    [mModelBack release];
    [mModel release];
    [mPageID release];
    [mText release];
    free(mScrollers);    
    free(mScale);
    free(mRotation);
    free(mLocation);
    free(mBounds);
    [super dealloc];
}

-(void) initLayout {
    
   
}

-(void) updateData:(NSString*) strData {
}

-(void) setTextColor:(NSString*) strData 
{

	for (int a=0; a< [mItemFields count]; a++) 
	{
		LayoutField* f = [mItemFields objectAtIndex:a];
		if (f.mText != nil)
		{
			[f.mText setOffset: [strData intValue] ];
		}
	}    	
}


-(void) setText:(NSString*)strData
{
	[mText release];
	if (strData == nil)
		return;
	if ([strData hasPrefix:@"#64#"])
	{
		NSData *data = [NSData dataFromBase64String:[strData substringFromIndex:4]];
		mText = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
	}else
	{
    
		mText = [[NSString alloc] initWithString:strData];
	}
}

-(void) fieldSetItem:(int)index id:(NSString*)itemID {
    
    if (index >= 0 && index < mSize) //[mItemFields count]) 
    {
        [self setField:index];
        LayoutField* field = [mItemFields objectAtIndex:index];
        [field setItem:itemID doeffect:false showback:false];
    }
}

-(void) updateDisplay:(NSString*) strData {
    NSString* style = strData;
    if ([style isEqualToString:@"hud"]) {
        mDisplay = GWLOC_HUD;
    }else
	{
        mDisplay = GWLOC_WORLD;
    	
	}
    
}

-(float) getX:(int)x max:(int)max w:(float) w
{
    
    float divx = (float)x / ( (float)max);
    
    // get x coordinate
    float rx =  w * divx;
    return (float) rx;
    
}

-(float) getY:(int)y max:(int) max h:(float) h {
    
    float divx = ((float)(y)) / ( (float)max);
    
    // get x coordinate
    float ry =  h * divx;
    return (float) ry;    	
}

-(float) getDivX:(float)x w:(float) w {
    
    // calculate x bounds
    // calculate divx
    float divx = (w) / (float)x;
    
    return (float) divx;
    
}

-(float) getDivY:(float)y h:(float)h {
    
    
    float divy = (h) / (float)(y);
    
    return (float) divy;
    
}

-(void) updateModelState:(int) state 
{
    if (!mPageVisible)
        state= LAS_HIDDEN;
    
    if (mModelBack != nil)
    {   
        [mModelBack setState:state];
    }
    if (mModel != nil)
    {
        [mModel setState:state];
    }    
    
    for (int a=0; a< [mItemFields count]; a++)
    {
        LayoutField* field = [mItemFields objectAtIndex:a];
        [field setState:state];
    }

}

-(void) updateState:(NSString*)strState init:(bool)initstate visible:(bool)visible
{
    //NSLog(@" updateState %@ %@ ", strState, mID);
    if ([strState isEqualToString:@"visible"]) {
        mState = LAS_VISIBLE;
        if (visible)
        {
            [mParent setVisibleArea:self visible:true];
        }
    } else if ([strState isEqualToString:@"hidden"]) {
		if (mScollerAnim != nil)
		{
			[mScollerAnim cancel];
		}	
        mState = LAS_HIDDEN;
        [mParent setVisibleArea:self visible:false];        
    }
    if (initstate)
    {
        mInitState = mState;
    }
    if (mState == LAS_VISIBLE && !visible)
        return;
    [self updateModelState:mState];
}


-(void) updateLocation:(NSString*)strData 
{

	int num = [ServerkoParse parseFloatArray:mLocation max:5 forData:strData];
	if (num == 5)
	{
		mBounds[0] = mLocation[2];
		mBounds[1] = mLocation[3];
		mLocation[2] = mLocation[4];    		
	}else if (num == 4)
	{
		mBounds[0] = mLocation[2];
		mBounds[1] = mLocation[3];
		mLocation[2] = 0.0f;    		
		
	}

	[self updateModelsTransformation];
}

-(void) updateBounds:(NSString*)strData 
{
	[ServerkoParse parseFloatArray:mBounds max:3 forData:strData];
	[self updateModelsTransformation];
}

-(void) setRotation:(NSString*)strData 
{
	[ServerkoParse parseFloatArray:mRotation max:3 forData:strData];
	[self updateModelsTransformation];
}

-(void) setScale:(NSString*)strData  
{
	[ServerkoParse parseFloatArray:mScale max:3 forData:strData];
	[self updateModelsTransformation];
}

-(void) setItemScale:(NSString*) strData 
{
	float scale[4];
	int len = [ServerkoParse parseFloatArray:scale max:4 forData:strData];
	if (len != 4)
	{
		return;
	}
	
	int i = (int)scale[0];
	if ( i < 0 || i >= [mItemFields count] || [mItemFields objectAtIndex:i] == nil)
	{
		return;
	}
	
	float scale2[3];
	scale2[0] = scale[1];
	scale2[1] = scale[2];
	scale2[2] = scale[3];
	
	LayoutField* f = [mItemFields objectAtIndex:i];
	if (f.mItem != nil)
	{
		[f.mItem.mModelRef setAddScale:scale2];
		[f.mItem.mModelRef set];
	}
	
	
}





-(void) setSize:(NSString*)areaType {
    NSArray* tokens = [areaType componentsSeparatedByString:@","];
    if ([tokens count] > 0) mSize = [[tokens objectAtIndex:0] intValue];
    if ([tokens count] > 1) mSizeW = [[tokens objectAtIndex:1] intValue];
    if ([tokens count] > 2) mSizeH = [[tokens objectAtIndex:2] intValue];
    

}

-(void) setField:(int) count {
    if (count < [mItemFields count]) {
        return;
    } else {
        while (count >= [mItemFields count])
        {
            LayoutField* field = [[[LayoutField alloc] initWithParent:self] autorelease];
            field.mID = count;
            [mItemFields addObject:field];
        }
    }
}

-(NSString*) getData:(NSString*) val
{
    NSRange loc = [val rangeOfString:@"]"];

    if (loc.location > 0 && [val length] > 3)
    {
        return [val substringFromIndex:loc.location+1];
    }
    return val;
}

-(LayoutAreaFieldItemType) getType:(NSString*)val  
{
    if ([val characterAtIndex:0] != '[') {
        return LAFIT_TEXT;
    }else
    if ([val characterAtIndex:1] == 'i') {
        return LAFIT_ITEM;
    }else
    if ([val characterAtIndex:1] == 't') {
        return LAFIT_TEXT;
    }else
    if ([val characterAtIndex:1] == 'T') {
        return LAFIT_TEXTH;
    }
    
    return LAFIT_TEXT;
}

-(void) createItem:(int)fieldind item:(NSString*)val showback:(bool)showback 
{
    int type = LFFT_NONE;
    LayoutField* field = nil;
    
    NSString* data;
    type = [self getType:val ];
    data = [self getData:val];
    [self setField:fieldind];
    field = [mItemFields objectAtIndex:fieldind];
	mActiveItems ++;
    if (type == LAFIT_ITEM) {
        // just draw item
        if (field.mW > 0) {
            [field setItem:data doeffect:false showback:showback];
        }                
    } else if (type == LAFIT_TEXT) {
        [field setText:data len:mSizeText];
    }else if (type == LAFIT_TEXTH) {
        [field setText:data len:mSizeText];
    }
}

-(void) updateItem:(NSString*)strData showback:(bool) showback {
    // 
    
    NSArray* tokens = [strData componentsSeparatedByString:@","];
    int field = [[tokens objectAtIndex:0] intValue];
    if (field < 0)
    {
        NSLog(@" error setting field %@ %d " , mID , field);
        return;
    }
    NSString* item = [tokens objectAtIndex:1];
    [self createItem:field item:item showback:showback];

}    

-(void) invertItem:(NSString*)strData  {
    // 
    
    int field = [strData intValue];
    LayoutField* f = nil;
    [self setField:field];
    f = [mItemFields objectAtIndex:field];
    [f invertItem];
    
}    



-(void)createItems:(NSString*)strData doeffect:(bool)doeffect 
{
    if (strData == nil) {
        return;
    }
    
    NSArray* tokens = [strData componentsSeparatedByString:@","];

    
    NSString* val;
    NSString* data;
    LayoutAreaFieldItemType type = LAFIT_TEXT;
    LayoutField* field = nil;
    mActiveItems ++;
	
    // update vector of items on fields
    for (int a=0; a< [tokens count]; a++) {
        val = [tokens objectAtIndex:a];
        if ( [val length] == 0)
        {
            continue;
        }
        type = [self getType:val];
        data = [self getData:val];
        
        [self setField:a];
        field = [mItemFields objectAtIndex:a];
        
        if (type == LAFIT_ITEM) {
            // just draw item
            if (field.mW > 0) {
                [field setItem:data doeffect:doeffect showback:false];
            }
            //field.mText = nil;
        } else if (type == LAFIT_TEXT) {
            [field setText:data len:mSizeText];
        } else if (type == LAFIT_TEXTH) {
            [field setText:data len:mSizeText];
        } else {
        }
        

    }
    
}

-(void) updateItems:(NSString*)strData
{
    
    [self createItems:strData  doeffect:false];
}


-(NSString*) getFinfo:(int*) info token:(NSString*)token
{
    NSArray* tokens = [token componentsSeparatedByString:@","];
    
    // default values
    info[0] = 0;
    info[1] = 0;
    info[2] = 1;
    info[3] = 0;
    info[4] = 0;
    info[5] = 1;
    info[6] = 1;

    
    for (int a=1; a< [tokens count]; a++)
    {
        info[a-1] = [[tokens objectAtIndex:a] intValue];
    }
    
    return [tokens objectAtIndex:0];
}

-(void)createFields:(NSString*)strData
{
    if (strData == nil) {
        return;
    }
    
    NSArray* tokens = [strData componentsSeparatedByString:@";"];
    
    
    
    
    int fieldinfo[7];
    int fieldc = 0;
    NSString* type = nil;
    
    
    // get field Width / height
    int count = 0;
    int max = 0;
    int fieldind = 0;
    int x = 0,y = 0;
    int szx = 0;
    int szy = 0;
    
    for (int a=0; a < [tokens count] ; a++)
    {
        NSString* token = [tokens objectAtIndex:a];
        if ( [token length] == 0)
        {
            continue;
        }
        type = [self getFinfo:fieldinfo token:token];

        x = fieldinfo[0];
        y = fieldinfo[1];
        max = fieldinfo[2];
        szx = fieldinfo[5];
        szy = fieldinfo[6];
        
        for (count = 0; count < max; count++) {
            [self setField:fieldind];
            
            LayoutField* field = [mItemFields objectAtIndex:fieldind++];
            field.mGridx = x;
            field.mGridy = y;
            field.mGridSzX = szx;
            field.mGridSzY = szy;            

            if ([type isEqualToString:@"empty"]) {
                field.mFieldType = LFFT_PLAYER_EMPTY;
            }else                
            if ([type isEqualToString:@"empty2"]) {
                field.mFieldType = LFFT_PLAYER_EMPTY2;
            }else                                
            if ([type isEqualToString:@"norm"]) {
                field.mFieldType = LFFT_NORM_FIELD;
            }else                
            if ([type isEqualToString:@"play"]) {
                field.mFieldType = LFFT_PLAY_FIELD;
            } else if ([type isEqualToString:@"start"]) {
                field.mFieldType = LFFT_PLAYER_START;
            } else if ([type isEqualToString:@"end"]) {
                field.mFieldType = LFFT_PLAYER_END;
            } 
            
            field.mID = fieldc;
            
            
            x += fieldinfo[3];
            y += fieldinfo[4];
            
            fieldc++;
        }

    }
}


-(void) updateFields:(NSString*)fields {
    [self createFields:fields];
}
-(LayoutItem*) getItem:(int) index
{
    if (index < [mItemFields count]) {
        LayoutField* f = [mItemFields objectAtIndex:index];
        return f.mItem;
    }
    return nil;
}

-(void) placeFigure:(int)index item:(LayoutItem*) item showback:(bool)showback
{
    if (index < [mItemFields count]) {
        LayoutField* f = [mItemFields objectAtIndex:index];
        [f removeFigure];
        [f setItem2:item doeffect:false showback:showback];
    }
    
}

-(void) updateOnclick:(NSString*)data {

    [mOnclick release];
    mOnclick = [[NSString alloc] initWithString:data];
}

-(void) updateOnFocusLost:(NSString*)data {

    [mOnFocusLost release];
    mOnFocusLost = [[NSString alloc] initWithString:data];
    
}

-(void) updateOnFocusGain:(NSString*)data {

    [mOnFocusGain release];
    mOnFocusGain = [[NSString alloc] initWithString:data];

}

-(void) updateItemsA:(NSString*)strData {
    [self createItems:strData doeffect:true];
}



-(void) createWorldModel {
    
    if (mModelBack == nil) {
        if (mColorBackground != nil) {
			GameonModelRef* ref = [[[GameonModelRef alloc] initWithParent:nil] autorelease];
			if (mStrColorBackground != nil)
			{
                NSArray* tok = [mStrColorBackground componentsSeparatedByString:@"."];
                
                NSString* back = [tok objectAtIndex:0];
				if ([tok count] > 1)
				{
					int text = [mApp.textures getTexture:back];
					int n = [[tok objectAtIndex:1] intValue ];
					int w = [[tok objectAtIndex:2] intValue ];
					int h = [[tok objectAtIndex:3] intValue ];
					
                    if(mType == LAT_LAYOUT)
                    {
                        mModelBack = [mApp.items createFromType:GMODEL_BACKIMAGE color:mColorBackground texture:text];                        
                    }else
                    {
                        mModelBack = [mApp.items createFromType:GMODEL_BACKGROUND color:mColorBackground texture:text];
                    }
					ref.mOwner = n;
					ref.mTransformOwner = true;
					[mModelBack setTextureOffset:w h:h];
					ref.mOwnerMax = w * h;
					mModelBack.mSubmodels = w * h;
				}else
				{			
					// create plane for background
                    if(mType == LAT_LAYOUT)
                    {
                        mModelBack = [mApp.items createFromType:GMODEL_BACKIMAGE color:mColorBackground texture:mColorBackground2];                        
                    }else
                    {                    
                        mModelBack = [mApp.items createFromType:GMODEL_BACKGROUND color:mColorBackground texture:mColorBackground2];
                    }
				}
			
			}else
            {			
                // create plane for background
                if(mType == LAT_LAYOUT)
                {
                    mModelBack = [mApp.items createFromType:GMODEL_BACKIMAGE color:mColorBackground texture:mColorBackground2];                    
                }else
                {                
                    mModelBack = [mApp.items createFromType:GMODEL_BACKGROUND color:mColorBackground texture:mColorBackground2];
                }
            }
			
            mModelBack.mLoc = mDisplay;
            mModelBack.mEnabled = true;
            if (mColorBackground.alpha < 255)
            {
                mModelBack.mHasAlpha = true;
            }
			if (mBorder == LABT_THINRECT)
			{
				[mModelBack createFrame:-0.5f btm:-0.5f b:0.000f r:0.5f t:0.5f f:0.000f 
                                     fw:0.03f/mBounds[0] fh:0.03f/mBounds[1] c:mColorForeground];
			}			
            ref.mLoc = mDisplay;
			
			[ref setAreaPosition:mLocation];
			[mModelBack addref:ref];
			[mApp.world add:mModelBack];
        }
    }
	if (mType == LAT_LABEL || mType == LAT_TABLE)
	{
		[self createWorldItemsModel];
	}

}
    
-(void) createWorldItemsModel 
{	
    if ([mItemFields count] == 0 || mModel != nil)
    {
        return;
    }
    int count = 0;
	mActiveItems = 0;
    for (int a=0; a< [mItemFields count]; a++ ) {
        //   for (int a=0; a< 1; a++ ) {
        LayoutField* field = [mItemFields objectAtIndex:a];
        if (field.mFieldType == LFFT_PLAYER_EMPTY ||
            field.mFieldType == LFFT_PLAYER_EMPTY2 ||
            field.mFieldType == LFFT_NONE)
        {
            count ++;
        }
		if (field.mText != nil || field.mItem != nil)
		{
			mActiveItems++;
		}		
    }        

    if ( count == [mItemFields count] )
    {
		[self createCustomModel];
        return;
    }

    mModel = [[GameonModel alloc] initWithName:self.mID app:mApp];
    GameonModel* model = mModel;
    mModel.mLoc = mDisplay;
    for (int a=0; a< [mItemFields count]; a++ ) {
     //   for (int a=0; a< 1; a++ ) {
        LayoutField* field = [mItemFields objectAtIndex:a];
        float w = field.mW;
        float h = field.mH;
        float x = field.mX / mBounds[0] - w/2;
        float y = field.mY / mBounds[1]- h/2;
		float z = field.mZ;
        float dw = w/80;
        float dh = h/80;  
		float up = 0.001f;		
        
        GLColor* fcolor = nil;
        if (mColorForeground != nil)
        {
            fcolor = mColorForeground;
        }else {
            fcolor = mApp.colors.white;
        }

        switch (field.mFieldType)
        {
            case LFFT_NORM_FIELD:
                if (mColorForeground != nil)
                {
                    [model createPlane:(x) btm:(y) b:(z + up) r:(x +w) t:(y + h) f:(z + up) c:fcolor ];    
                }else {
                    [model createPlane4:(x) btm:(y) b:(z + up) r:(x +w) t:(y + h) f:(z + up) c1:fcolor c2:fcolor];    
                }
                
				break;                
            case LFFT_PLAY_FIELD:
                if (mColorForeground != nil)
                {
                    [model createOctogon:(x+dw) btm:(y+dh) b:(z + up) r:(x +w - dw -dw) t:(y + h - dh - dh) f:(z + up) c:fcolor];
                }else {                
                    [model createOctogon:(x+dw) btm:(y+dh) b:(z + up) r:(x +w - dw -dw) t:(y + h - dh - dh) f:(z + up) c:fcolor];
                }
				break;
            case LFFT_PLAYER_START:
                    [model createPlane:(x) btm:(y) b:(z + up) r:(x +w) t:(y + h) f:(z + up) c:fcolor];
                
                break;				
            case LFFT_PLAYER_END:
            //case LFFT_PLAYER_EMPTY2:                
                if (mColorForeground != nil)
                {
                //    [model createPlane:(x) btm:(y) b:(z + up) r:(x +w) t:(y + h) f:(z + up) c:fcolor];
                    [model createPlane3:(x+0.1f) btm:(y+0.1f) b:(-1.0f) r:(x +w-0.2f) t:(y + h-0.2f) f:(0.001) c:fcolor];
                }else {                
                [model createPlane3:(x+0.1f) btm:(y+0.1f) b:(-1.0f) r:(x +w-0.2f) t:(y + h-0.2f) f:(0.001) c:fcolor];
                //    [model createPlane2:(x) btm:(y) b:(z + up) r:(x +w) t:(y + h) f:(z + up) c:fcolor];
                }
                break;				
            case LFFT_PLAYER_EMPTY:               
				break;        
            default:
                break;
        }
        
		[field.mRef setPosition:field.mX y:field.mY z:field.mZ];
		[field.mRef setScale:w y:h z:1 ];

    }
    GameonModelRef* ref = [[GameonModelRef alloc] init];
    ref.mLoc = mDisplay;
    [ref setScale:mBounds];
    [model addref:ref];    
    model.mEnabled = true;
    model.mIsModel = false;
    if (mColorForeground2 >= 0)
    {
        [mModel setTexture:mColorForeground2];
    }
    [mApp.world add:model];
    //[self updateModelState:mState];
}

-(AreaIndexPair*) fieldClicked:(float*)eye vec:(float*)ray
{
    
	if (mDisabledInput || ![self hasTouchEvent] )
		return nil;

	if (mPageVisible == false || mState != LAS_VISIBLE)
	{
		return nil;
	}		

    NSLog(@" Checking input %@ ==  %@ " , mID , mPageID);
    
    if ( [mParent.mPagePopup length] > 0 && ![mPageID isEqualToString:mParent.mPagePopup])
    {
        return nil;
    }


	float mindist = 1e06f;
	int index = 0;
	float loc[3];
	
	for (int a=0; a < [mItemFields count]; a++)
	{
	
		LayoutField* f = [mItemFields objectAtIndex:a];
		if (f.mActive && (f.mText != nil || f.mItem != nil))
		{
			GameonModelRef* ref = f.mRef;
			float dist = [ref intersectsRay:eye ray:ray loc:loc];
			if (dist < mindist)
			{
				mindist = dist;
				index = a;
			}
		}
	}		
	
	if (mindist != 1e6f)
	{
		AreaIndexPair* pair = [[AreaIndexPair alloc] init];
		pair.mArea = mID;
		pair.mOnclick = mOnclick;
		pair.mOnFocusLost = mOnFocusLost;
		pair.mOnFocusGain = mOnFocusGain;
		pair.mIndex = index;
		pair.mLoc[0] = loc[0];
		pair.mLoc[1] = loc[1];
		pair.mLoc[2] = loc[2];		
		return pair;							
	}

	
	if (mModelBack != nil)
	{
		GameonModelRef* ref = [mModelBack ref:0];
		float dist = [ref intersectsRay:eye ray:ray loc:loc];
		if (dist <= mindist)
		{
			mindist = dist;
			index = -1;
		}			
	}
	if (mModel != nil)
	{
		GameonModelRef* ref = [mModel ref:0];
		float dist = [ref intersectsRay:eye ray:ray loc:loc];
		if (dist <= mindist)
		{
			mindist = dist;
			index = -1;
		}
	}			
	if (mindist != 1e6f)
	{
		AreaIndexPair* pair = [[AreaIndexPair alloc] init];
		pair.mArea = mID;
		pair.mOnclick = mOnclick;
		pair.mOnFocusLost = mOnFocusLost;
		pair.mOnFocusGain = mOnFocusGain;
		pair.mIndex = -1;
		pair.mLoc[0] = loc[0];
		pair.mLoc[1] = loc[1];
		pair.mLoc[2] = loc[2];
		return pair;							
	}
	
   
    return nil;
    
}



-(void)itemsAnim:(NSString*)strData {
    
    NSArray* tokens = [strData componentsSeparatedByString:@","];

    
    NSString* movetype = [tokens objectAtIndex:0];
	NSString* delay = nil;
	if ([tokens count] > 2)
	{
		delay = [NSString stringWithFormat:@"%@,%@" , [tokens objectAtIndex:0] ,  [tokens objectAtIndex:1]];
	}else
	{
		delay = [tokens objectAtIndex:1];
	}
	

    LayoutItem* item = nil;
    for (int a=0; a< [mItemFields count]; a++) {
        LayoutField* f = [mItemFields objectAtIndex:a];
        item = [f mItem];
        if (item != nil && item.mModelRef != nil) 
		{
            [mApp.mAnims animRef:movetype start:item.mModelRef end:item.mModelRef delay:delay];
        }
    }
}


-(void) itemAnim:(NSString*)indexes data:(NSString*) strData {
    
    // get type
    //get delay
    NSArray* tokens = [strData componentsSeparatedByString:@","];

    NSString* movetype = [tokens objectAtIndex:0];
	NSString* delay = nil;
	if ([tokens count] > 2)
	{
		delay = [NSString stringWithFormat:@"%@,%@" , [tokens objectAtIndex:0] ,  [tokens objectAtIndex:1] ];
	}else
	{
		delay = [tokens objectAtIndex:1];
	}
    LayoutItem* item = nil;
    
    NSArray* tokind = [indexes componentsSeparatedByString:@","];
    for (int c =0 ; c< [tokind count]; c++)
    {
        int a= [[tokind objectAtIndex:c] intValue];
        LayoutField* field = [mItemFields objectAtIndex:a];
        item = field.mItem;
        if (item != nil) {
            [mApp.mAnims animRef:movetype start:item.mModelRef end:item.mModelRef delay:delay];
        }
    }
}

-(void) updateBorder:(NSString*) strData 
{
    if ([strData isEqualToString:@"thinrect"]) {
        mBorder = LABT_THINRECT;
    }
        
}
    
-(void) updateBackground:(NSString*) strData clear:(bool)clear
{
    if ([strData isEqualToString:@"none"]) {
        mColorBackground = nil;
    } else {
        NSArray* tokens = [strData componentsSeparatedByString:@","];
        if ([tokens count] > 0) mColorBackground = [mApp.colors getColor:[tokens objectAtIndex:0]];
        if ([tokens count] > 1) 
        {
            mColorBackground2 = [mApp.textures getTexture:[tokens objectAtIndex:1]];
   			mStrColorBackground = [[NSString alloc] initWithString:[tokens objectAtIndex:1]];				
			
            if (mModelBack != nil)
            {
                mModelBack.mTextureID = mColorBackground2;
            }
        }
        
    }
    
    if (clear && mModelBack != nil)
    {
    
        if (mStrColorBackground != nil)
        {
            NSArray* tok = [mStrColorBackground componentsSeparatedByString:@"."];
            
            NSString* back = [tok objectAtIndex:0];
            if ([tok count] > 1)
            {
                int text = [mApp.textures getTexture:back];
                int n = [[tok objectAtIndex:1] intValue ];
                int w = [[tok objectAtIndex:2] intValue ];
                int h = [[tok objectAtIndex:3] intValue ];

                GameonModelRef* ref = [mModelBack ref:0];
                ref.mOwner = n;
                ref.mTransformOwner = true;
                [mModelBack setTextureOffset:w h:h];
                ref.mOwnerMax = w * h;
                [mModelBack setTexture:text];
                mModelBack.mSubmodels = w * h;
            }
        }
    }
}

-(void) updateForeground:(NSString*) strData 
{
    if ([strData isEqualToString:@"none"]) {
        mColorForeground = nil;
    } else {
        NSArray* tokens = [strData componentsSeparatedByString:@","];
        if ([tokens count] > 0) mColorForeground = [mApp.colors getColor:[tokens objectAtIndex:0]];
        if ([tokens count] > 1) 
        {
            mColorForeground2 = [mApp.textures getTexture:[tokens objectAtIndex:1]];
            if (mModel != nil)
            {
                mModel.mTextureID = mColorForeground2;
            }
        }
               
    }
    /*
     mRedrawAll = true;
     mParent.addredraw(this);
     */
}



-(void) fieldSetItem:(int)index itemid:(NSString*) itemID
{
    
    if (index >= 0 && index < [mItemFields count]) {
        LayoutField* f = [mItemFields objectAtIndex:index];
        [f setItem:itemID doeffect:false showback:false];
    }
}

-(void) removeFigure:(int) index
{
    // TODO Auto-generated method stub
    if (index >= 0 && index < [mItemFields count]) {
        LayoutField* f = [mItemFields objectAtIndex:index];
        [f removeFigure];
    }
}

-(void) setNoFigure:(int) index
{
    // TODO Auto-generated method stub
    if (index >= 0 && index < [mItemFields count]) {
        LayoutField* f = [mItemFields objectAtIndex:index];
        [f setNoFigure];
    }
}


-(void) clear:(bool)all {
    [mText release];
    mText = nil;
    for (int a = 0; a < [mItemFields count]; a++) 
    {
        LayoutField* field = [mItemFields objectAtIndex:a];
        [field clear];
    }
    
    if (mModelBack != nil && all)
    {
        [mApp.world remove:mModelBack];
		[mModelBack release];
		mModelBack = nil;
    }
    if (mModelBack != nil && all)
    {
        [mApp.world remove:mModel];
		[mModel release];
		mModel = nil;		
    }
	
	if (mScollerAnim != nil)
	{
		[mScollerAnim cancel];
	}	
}

-(void) updateLayout:(NSString*) areaLayout {
    // area layout
    if ([areaLayout isEqual:@"hor"]) {
        mLayout = LAL_HORIZONTAL;
    } else if ([areaLayout isEqual:@"ver"]) {
        mLayout = LAL_VERTICAL;
    } else if ([areaLayout isEqual:@"south-east"]) {
        mLayout = LAL_SOUTH_EAST;
    } else if ([areaLayout isEqual:@"south-west"]) {
        mLayout = LAL_SOUTH_WEST;
    } else if ([areaLayout isEqual:@"north-east"]) {
        mLayout = LAL_NORTH_EAST;
    } else if ([areaLayout isEqual:@"north-west"]) {
        mLayout = LAL_NORTH_WEST;
    } else if ([areaLayout isEqual:@"circle"]) {
        mLayout = LAL_CIRCLE;
    } else if ([areaLayout isEqual:@"square"]) {
        mLayout = LAL_SQUARE;
    } else if ([areaLayout isEqual:@"diamond"]) {
        mLayout = LAL_DIAMOND;
    } else if ([areaLayout isEqual:@"north-south"]) {
        mLayout = LAL_NORTH_SOUTH;
    } else if ([areaLayout isEqual:@"east-west"]) {
        mLayout = LAL_EAST_WEST;
    } else if ([areaLayout isEqual:@"south-north"]) {
        mLayout = LAL_SOUTH_NORTH;
    } else if ([areaLayout isEqual:@"west-east"]) {
        mLayout = LAL_WEST_EAST;
    }
}

-(void) setInitState
{
    if (mPageVisible && mState == LAS_VISIBLE)
    {
         [mParent setVisibleArea:self visible:true];
    }else {
        [mParent setVisibleArea:self visible:false];        
    }

    [self updateModelState:mState];
    
    //mState = mInitState;
    /*
    if (mState == LAS_VISIBLE) {
        [mParent setVisibleArea:self visible:true];
    } else if (mState == LAS_HIDDEN) {
        [mParent setVisibleArea:self visible:false];        
    } */
    [self updateModelState:mState];    
}

-(void) pushFrontItem:(NSString*) strData 
{
    // go through fields
    for (int a=[mItemFields count] - 1; a > 0 ; a--)
    {
        LayoutField* f2 = [mItemFields objectAtIndex:a];
        if (a >= mSize)
        {
            [f2 clear];
        }else
        {
            LayoutField* f1 = [mItemFields objectAtIndex:a-1];
            if (f1.mText != nil )
            {
                TextItem* item = f1.mText;
                if (item.mText != nil)
                {
                    [f2 setText:item.mText len:mSizeText];
                }
            }
        }
        
    }
    
    [self createItem:0 item:strData showback:false];
    
}


-(int) initAnim:(NSString*)strData away:(bool)away
{
    // get type
    //get delay
    NSArray* tok = [strData componentsSeparatedByString:@","];
    NSString* movetype = [tok objectAtIndex:0];    
    int delay = [[tok objectAtIndex:1] intValue];
    
    //
    if (mModel)
    {
        [mModel createAnimTrans:movetype delay:delay away:away no:0];
    }
    if (mModelBack)
    {
        [mModelBack createAnimTrans:movetype delay:delay away:away no:0];
    }    
    for (int a=0; a< [mItemFields count]; a++)
    {
        LayoutField* field = [mItemFields objectAtIndex:a];
        [field createAnimTrans:movetype delay:delay away:away];
    }
    return delay;
}


-(bool) hasTouchEvent
{

	if (mHasScrollH || mHasScrollV)
		return true;
	if ( (mOnclick != nil && [mOnclick length] > 0) || 
		(mOnFocusLost != nil && [mOnFocusLost length] > 0) ||
		(mOnFocusGain != nil && [mOnFocusGain length] > 0) )
	{
		return true;
	}
	return false;
}

-(void) updateColors:(NSString*) strData
{
    NSArray* tok = [strData componentsSeparatedByString:@","];
    if ([tok count] > 0) mColors[0] = [mApp.colors getColor:[tok objectAtIndex:0]];	
	if ([tok count] > 1) mColors[1] = [mApp.colors getColor:[tok objectAtIndex:1]];	
	if ([tok count] > 2) mColors[2] = [mApp.colors getColor:[tok objectAtIndex:2]];	
	if ([tok count] > 3) mColors[3] = [mApp.colors getColor:[tok objectAtIndex:3]];	
	
}

-(GLColor**) getColors
{
    return mColors;
}

-(void)disableInput:(bool)disable
{
    //NSLog(@" disableInput %@ %d " , mID , disable);
    mDisabledInput  = disable;
}

-(void)updateModelsTransformation
{
	if (mModelBack != nil)
	{
		GameonModelRef* ref = [mModelBack ref:0];
		[ref setAreaPosition:mLocation];
		[ref setAreaRotate:mRotation];
		[ref setScale:mBounds];
		[ref setAddScale:mScale];
		[ref set];
	}
	if (mModel != nil)
	{
		GameonModelRef* ref = [mModel ref:0];
		[ref setAreaPosition:mLocation];
		[ref addAreaPosition:0 y:0 z:0.001f];
		[ref setAreaRotate:mRotation];
		[ref setScale:mBounds];
		[ref setAddScale:mScale];
		[ref set];
	}		
	for (int a=0; a < [mItemFields count]; a++)
	{
		LayoutField* f = [mItemFields objectAtIndex:a];
		[f setScale];
		if (f.mItem != nil && f.mItem.mModelRef != nil)
		{
			GameonModelRef* ref = f.mItem.mModelRef;
			[ref setAreaPosition:mLocation];
			[ref setAreaRotate:mRotation];
			[ref mulScale:mBounds];
			[ref setAddScale:mScale];
			[ref set];
		}
		if (f.mText != nil && f.mText.mRef != nil)
		{
			GameonModelRef* ref = f.mText.mRef;
			[ref setAreaPosition:mLocation];
			[ref setAreaRotate:mRotation];
			[ref mulScale:mBounds];
			[ref setAddScale:mScale];
			[ref set];
		}
		
		GameonModelRef* ref = f.mRef;
		[ref setAreaPosition:mLocation];
		[ref setAreaRotate:mRotation];
		[ref mulScale:mBounds];
		[ref setAddScale:mScale];
		[ref set];
	}
}


-(void) updateScrollers
{
	
}

-(void) createCustomModel
{
	
}

-(void) setScrollers:(NSString*)data
{
	int num = [ServerkoParse parseFloatArray:mScrollers max:3 forData:data];
	
	if (num > 0)
	{
		// update scrollers
		if (mScrollers[0] < mScrollers[1])
		{
			mScrollers[0] = mScrollers[1];
		}else if (mScrollers[0] > mScrollers[2])
		{
			mScrollers[0] = mScrollers[2];
		}
		[self updateScrollers];
	}
}


-(void) setScrollerVal:(float) val
{
	mScrollers[0] = val;
	//System.out.println( "set scroll " + val);
	[self updateScrollers];
}

-(void) onDragg:(float)dx y:(float)dy z:(float)dz
{
	NSLog(@"dragg %f %f %f ",dx,dy, dz);
	if (mHasScrollH || mHasScrollV)
	{
		if (mScollerAnim == nil)
		{
			mScollerAnim = [mApp.anims getScollerAnim:self];
			[mScollerAnim setActive:true];
			mScollerAnim.mAreaOwner = self;
			[mApp.anims incCount];

		}
		if (mScollerAnim != nil)
		{
			float p;
			if (mHasScrollV)
			{
				p = dy / mBounds[1];
			}else
			{
				p = -dx / mBounds[0];
			}
			[mScollerAnim addScrollerData:p delay:200 min:mScrollers[1] max:mScrollers[2]];
		}
					
	}
}

-(void) anim:(NSString*)type delay:(NSString*)delay data:(NSString*)data
{
	//
	if (mModel != nil)
	{
		[mModel createAnim:type forId:0 delay:delay data:data];
	}
	if (mModelBack != nil)
	{
		[mModelBack createAnim:type  forId:0 delay:delay  data:data];
	}    
	for (int a=0; a< [mItemFields count]; a++)
	{
		LayoutField* field = [mItemFields objectAtIndex:a];
		[field createAnim:type delay:delay data:data];
	}
}
@end

