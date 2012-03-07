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

#import "ObjectsFactory.h"
#import "GameonModel.h"
#import "GameonWorld.h"
#import "ColorFactory.h"
#import "TextureFactory.h"
#import "LayoutItem.h"
#import "GameonApp.h"
#import "GameonModelRef.h"
#import "ItemFactory.h"

@implementation ObjectsFactory


-(id) initWithApp:(GameonApp*) app
{
	if (self = [super init])
	{
		mApp = app;
		mItems = [[NSMutableDictionary alloc] init];
	}
    return self;
}

- (void) dealloc 
{
	[mItems release];
    [super dealloc];  
}
	
-(LayoutItem*) get:(NSString*)name
{
	LayoutItem* model = [mItems objectForKey:name];
	return model;
/*		
	if ( mItems.containsKey(name))
	{
		return nil;
	}
	LayoutItem model = mItems.get(name);
	return model;*/
}
-(void)addModel:(NSString*)name item:(LayoutItem*) item
{
	LayoutItem* itemsearch = [mItems objectForKey:name];
	if (itemsearch != nil)
	{
		return;
	}	

	item.mModel.mEnabled = true;
	[mApp.mWorld add:item.mModel];
	[mItems setObject:item forKey:name];
}

-(void)removeModel:(NSString*)name
{
	LayoutItem* item = [mItems objectForKey:name];
	if (item == nil)
	{
		return;
	}	
	GameonModel* model = item.mModel;
	[model setVisible:false];
	[mItems removeObjectForKey:name];
    [item release];
	[mApp.mWorld remove:model];
}
	

-(void)create:(NSString*)name data:(NSString*)data 
{
	LayoutItem* item = [mItems objectForKey:name];
	if (item != nil)
	{
		return;
	}		
	
	GameonModel* model = [mApp.items getFromTemplate:name data:data];
	if (model != nil)
	{
		LayoutItem* item = [[LayoutItem alloc]init];
		item.mModel = model;
		[self addModel:name item:item];
	}
}	
-(void)place:(NSString*)name data:(NSString*)data 
{
	LayoutItem* item = [mItems objectForKey:name];
	if (item == nil)
	{
		return;
	}
	GameonModel* model = item.mModel;

	// TODO submodels
	if ([model ref:0] == nil)
	{
		GameonModelRef* ref = [[GameonModelRef alloc] initWithParent:model];
		[model addref:ref];
		item.mModelRef = ref;
	}
	float loc[5] = {0,0,0,0,0};
	[ServerkoParse parseFloatArray:loc max:5 forData:data]; 
	[item setPosition2:loc[0] y:loc[1] z:loc[2]];
	

}

-(void)scale:(NSString*)name data:(NSString*)data 
{
	LayoutItem* item = [mItems objectForKey:name];
	if (item == nil)
	{
		return;
	}
	GameonModel* model = item.mModel;

	
	// TODO submodels
	if ([model ref:0] == nil)
	{
		GameonModelRef* ref = [[GameonModelRef alloc] initWithParent:model];
		[model addref:ref];
	}
	float scale[5] = {0,0,0,0,0};
	[ServerkoParse parseFloatArray:scale max:5 forData:data]; 
	
	GameonModelRef* r = [model ref:0];
	[r setScale:scale];
	[r set];
}

-(void)rotate:(NSString*)name data:(NSString*)data 
{
	LayoutItem* item = [mItems objectForKey:name];
	if (item == nil)
	{
		return;
	}
	GameonModel* model = item.mModel;

	
	// TODO submodels
	if ([model ref:0] == nil)
	{
		GameonModelRef* ref = [[GameonModelRef alloc] initWithParent:model];
		[model addref:ref];
	}
	float rotate[3] = {0,0,0};
	[ServerkoParse parseFloatArray:rotate max:3 forData:data]; 
	
	GameonModelRef* r = [model ref:0];
	[r setRotate:rotate];
	[r set];
}




-(void)texture:(NSString*)name data:(NSString*)data 
{
	LayoutItem* item = [mItems objectForKey:name];
	if (item == nil)
	{
		return;
	}
	GameonModel* model = item.mModel;
	
	int text = [mApp.textures getTexture:data];
	[model setTexture:text ];
}
//TODO mutliple references with name.refid , default 0!
-(void)state:(NSString*)name data:(NSString*)data {
	LayoutItem* item = [mItems objectForKey:name];
	if (item == nil)
	{
		return;
	}

	GameonModel* model = item.mModel;

	bool visible = false;
	if ([data  isEqualToString:@"visible"])
	{
		visible = true;
	}
	if ([model ref:0] == nil)
	{
		[self place:name data:@"0,0,0"];
	}
	
	[[model ref:0] setVisible:visible];
	[model setVisible:visible];
}

-(void)remove:(NSString*)name data:(NSString*)data {
	LayoutItem* item = [mItems objectForKey:name];
	if (item == nil)
	{
		return;
	}

	//GameonModel* model = item.mModel;
	[self removeModel:name];
}

-(void)initObjects:(NSMutableDictionary*)response
{
    NSMutableArray* models = [response valueForKey:@"object"];
    for (int a=0; a< [models count]; a++)
    {
		NSMutableDictionary* pCurr = [models objectAtIndex:a];
		[self processObject:pCurr];        
	}	
	
}

-(void) processObject:(NSMutableDictionary*)objData
{
	NSString* name = [objData valueForKey:@"name"];
	NSString* template = [objData valueForKey:@"template"];
	if (name == nil || template == nil)
	{
		return;
	}

	[self create:name data:template];
	
	NSString* location = [objData valueForKey:@"location"];
	if (location != nil)
	{
		[self place:name data:location];
	}
	
	NSString* bounds = [objData valueForKey:@"bounds"];
	if (bounds != nil)
	{
		[self scale:name data:bounds];
	}			
	
	NSString* texture = [objData valueForKey:@"texture"];
	if (texture != nil)
	{
		[self texture:name data:texture];
	}			
	
	NSString* state = [objData valueForKey:@"state"];
	if (state != nil)
	{
		[self state:name data:state];
	}			
}

@end


