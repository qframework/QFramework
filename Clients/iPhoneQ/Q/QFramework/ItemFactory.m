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

#import "ItemFactory.h"
#import "GameonModel.h"
#import "GameonWorld.h"
#import "ColorFactory.h"
#import "TextureFactory.h"
#import "LayoutItem.h"
#import "GameonApp.h"
#import "ServerkoParse.h"

@implementation ItemFactory


-(id) initWithApp:(GameonApp*) app
{
	if (self = [super init])
	{
        mApp = app;
		mWorld = app.world;
		mModels = [[NSMutableDictionary alloc] init];
	}
    return self;
}

- (void) dealloc 
{
	[mModels release];
    [super dealloc];  
}
	

-(LayoutItem*) createItemFromModel:(GameonModel*)model itemid:(int)itemID data:(int)data  item:(LayoutItem*) item
{
    LayoutItem* fig = item;
    if (fig == nil)
    {
        fig = [[LayoutItem alloc] init];
    }
    fig.mType = model.mModelTemplate;
    fig.mModel = model;
    fig.mOwnerMax = model.mSubmodels;
    fig.mOwner = itemID;
    
    return fig;
    
}

-(LayoutItem*)	createItem:(NSString*)type userdata:(int)userdata item:(LayoutItem*) item
{
    NSArray* tokens = [type componentsSeparatedByString:@"."];
    
    if ([tokens count] == 0) return nil;
    
    NSString* imageset = [tokens objectAtIndex:0];
    //NSString* imagetype = [tokens objectAtIndex:1]; 
    
    GameonModel* model = [mModels  objectForKey:imageset];
    if (model == nil) {
        return nil;
    }
    int  imageid = -1;
    if ([tokens count] > 1)
        imageid = [[tokens objectAtIndex:1] intValue];
    
    return [self createItemFromModel:model itemid:imageid data:userdata item:item];
    
}


-(LayoutItem*)	createItem:(NSString*)data source:(LayoutItem*)item
{
    NSString* type = nil;
    NSArray* tokens = [data componentsSeparatedByString:@"|"];
    int userdata = 0;
    if ([tokens count] == 1)
    {
        type = data;
    }
    else {
        
        if ([tokens count] > 0)type = [tokens objectAtIndex:0];
        if ([tokens count] > 1)userdata = [[tokens objectAtIndex:1] intValue];
        
    }
    
    return [self createItem:type userdata:userdata item:item];
}

-(GameonModel*)getFromTemplate:(NSString*)strType data:(NSString*)strData
{
	if ([strData isEqualToString:@"sphere"])
		{
			GameonModel* model = [self createFromType:GMODEL_SPHERE color:mApp.colors.white texture:mApp.textures.mTextureDefault];
	        model.mModelTemplate = GMODEL_SPHERE;
	        model.mIsModel = true;
	        return model;
			
		}else if ([strData isEqualToString:@"cube"])
		{
			GameonModel* model = [self createFromType:GMODEL_CUBE color:mApp.colors.white texture:mApp.textures.mTextureDefault];
	        model.mModelTemplate = GMODEL_CUBE;
	        model.mIsModel = true;
	        return model;
			
		}
		
    GameonModel* model = [[GameonModel alloc] initWithName:strType app:mApp];
	
    if ([strData isEqualToString:@"cylinder"])
    {
        [model createModel:GMODEL_CYLYNDER ti:[mApp.textures get:TFT_DEFAULT]];
        model.mModelTemplate = GMODEL_CYLYNDER;
        model.mIsModel = true;        
    } else if ([strData isEqualToString:@"plane"])
    {
        [model createPlane:(-0.5) btm:(-0.5) b:(0) r:(0.5) t:(0.5) f:(0) c:mApp.colors.white ];
        model.mModelTemplate = GMODEL_CYLYNDER;
        model.mIsModel = true;
    } else if ([strData isEqualToString:@"card52"])
    {
        [model createCard2:-0.5f btm:-0.5f b:0.0f r:0.5f t:0.5f f:0.0f c:mApp.colors.transparent];
        model.mModelTemplate = GMODEL_CARD52;
		model.mForceHalfTexturing = true;
		model.mForcedOwner = 32;   
        model.mHasAlpha = true;
        model.mIsModel = true;        
    } else if ([strData isEqualToString:@"cardbela"])
    {
        [model createCard:-0.5f btm:-0.5f b:0.0f r:0.5f t:0.5f f:0.0f c:mApp.colors.transparent];
        model.mModelTemplate = GMODEL_CARD52;
		model.mForceHalfTexturing = true;
		model.mForcedOwner = 32;   
        model.mHasAlpha = true;
        model.mIsModel = true;        
    } else if ([strData isEqualToString:@"background"])
    {
        [model createPlane:(-0.5) btm:(-0.5) b:(0) r:(0.5) t:(0.5) f:(0) c:mApp.colors.white ];
        model.mModelTemplate = GMODEL_BACKGROUND;
        model.mHasAlpha = true;
        model.mIsModel = false;        
    } else
    {
        [model release];
        return nil;
    }
    
    return model;
    
}

-(void)newFromTemplate:(NSString*)strType data:(NSString*)strData 
{
    GameonModel* model = [self getFromTemplate:strType data:strData];
    
    if (model != nil)
    {
        [mModels setObject:model forKey:strType];
    }
    
}

-(void) setTexture:(NSString*)strType data:(NSString*)strData {
    // get object
    GameonModel* model = [mModels  objectForKey:strType];
    if (model == nil) {
        return;
    }
    
    int offsetx = 1, offsety = 1;
    NSString* texture = nil;
    NSArray* tok = [strData componentsSeparatedByString:@";"];
    if ([tok count] < 2)
    {
        // no offset
        texture = strData;
    }else {
        texture = [tok objectAtIndex:0];
        NSString* offset = [tok objectAtIndex:1];
        NSArray* tok2 = [offset componentsSeparatedByString:@","];
        if ([tok2 count] == 2)
        {
            offsetx = [[tok2 objectAtIndex:0] intValue];
            offsety = [[tok2 objectAtIndex:1] intValue];
        }
    }
    
    model.mTextureID = [mApp.textures getTexture:texture];
    [model setTextureOffset:offsetx h:offsety];
}

-(void) createModel:(NSString*)strType data:(NSString*)strData {
    // get object
    GameonModel* model = [mModels  objectForKey:strType];
    model.mIsModel = true;
    if (model == nil) {
        return;
    }
    
    
    [mWorld add:model];
}	

-(void) setSubmodels:(NSString*)strType data:(NSString*)strData {
    // get object
    GameonModel* model = [mModels  objectForKey:strType];
    if (model == nil) {
        return;
    }
	int vals[16];	
	int count = [ServerkoParse parseIntArray:vals max:16 forData:strData];
    
	if (count > 0) model.mSubmodels = vals[0];
	if (count > 1) model.mForcedOwner = vals[1];
	
}		

-(GameonModel*) createFromType:(int)template color:(GLColor*)color texture:(int)texid
{

    GameonModel* model = [[GameonModel alloc] initWithName:@"item" app:mApp];


	
    if (template == GMODEL_SPHERE)
    {
        [model createModel:GMODEL_SPHERE ti:texid];
        model.mModelTemplate = GMODEL_SPHERE;
        model.mIsModel = true;        
		model.mName = @"sphere";
    } else if (template == GMODEL_CUBE)
    {
        [model createModel:GMODEL_CUBE ti:texid];
        model.mModelTemplate = GMODEL_CUBE;
        model.mIsModel = true;        
    } else if (template == GMODEL_CARD52)
    {
        [model createCard2:-0.5f btm:-0.5f b:0.0f r:0.5f t:0.5f f:0.0f c:color];
        model.mModelTemplate = GMODEL_CARD52;
		model.mForceHalfTexturing = true;
		model.mForcedOwner = 32;   
        model.mHasAlpha = true;
        model.mIsModel = true;
        [model setTexture:texid ];
    } else if (template == GMODEL_BACKGROUND)
    {
        [model createPlane:-0.5f btm:-0.5f b:0.0f r:0.5f t:0.5f f:0.0f c:color];
        model.mModelTemplate = GMODEL_BACKGROUND;
		model.mForceHalfTexturing = false;
        model.mHasAlpha = true;
		model.mIsModel = false;
        [model setTexture:texid ];
    } else if (template == GMODEL_BACKIMAGE)
    {
        [model createPlane2:-0.5f btm:-0.5f b:0.0f r:0.5f t:0.5f f:0.0f c:color];
        model.mModelTemplate = GMODEL_BACKGROUND;
		model.mForceHalfTexturing = false;
        model.mHasAlpha = true;
		model.mIsModel = false;
        [model setTexture:texid ];
    } else
    {
        [model release];
        return nil;
    }
    
    return model;
    
}


-(void) processObject:(NSMutableDictionary*)objData
{
	NSString* name = [objData valueForKey:@"name"];
	NSString* template = [objData valueForKey:@"template"];
	if (name == nil || template == nil)
	{
		return;
	}

	[self newFromTemplate:name data:template];
		
	NSString* texture = [objData valueForKey:@"texture"];
	if (texture != nil)
	{
		[self setTexture:name data:texture];
	}

	NSString* submodels = [objData valueForKey:@"submodels"];
	if (submodels != nil)
	{
		[self setSubmodels:name data:submodels];
	}			
	
	[self createModel:name data:@""];

}

-(void)initModels:(NSMutableDictionary*)response
{
    NSMutableArray* models = [response valueForKey:@"model"];
    for (int a=0; a< [models count]; a++)
    {
		NSMutableDictionary* pCurr = [models objectAtIndex:a];
		[self processObject:pCurr];        
	}	
	
}



@end


