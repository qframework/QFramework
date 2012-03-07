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

#import "TextRender.h"
#import "GameonModelRef.h"
#import "ItemFactory.h"
#import <OpenGLES/ES1/gl.h>
#import <OpenGLES/ES1/glext.h>
#import "TextItem.h"

@implementation TextRender

-(id) init 
{
	if (self = [super init])
	{
        mTexts = [[NSMutableArray alloc] init] ;
		mToDelete = [[NSMutableArray alloc] init] ;
		mVisibleTexts = [[NSMutableArray alloc] init] ;
        mRef = [[GameonModelRef alloc] init] ;
    }
    return self;    
}

- (void) dealloc 
{
	[mToDelete release];
    [mTexts release];
	[mVisibleTexts release];
    [mRef release];
    [super dealloc];
}



- (void)remove:(TextItem*) item {
    if ([mTexts indexOfObject:item] != NSNotFound) {    
        [self removeVisible:item];
        [mTexts removeObject:item];
    }
}

- (void)add:(TextItem*)item visible:(bool)visible {
    if ([mTexts indexOfObject:item] == NSNotFound) {
        [mTexts addObject:item];
    }
	if (visible)
	{
		[self addVisible:item];
	}
}

-(void) render {
    //return;
    int len = [mVisibleTexts count];
    if (len == 0)
        return;
    
    for(int a=0; a< len ;a++) {
        TextItem* item = [mVisibleTexts objectAtIndex:a];
		[item draw:a];
    }
    
}

- (void) clear
{
    [mTexts removeAllObjects];
}

- (void) addVisible:(TextItem*)textItem 
{
	if ([mVisibleTexts indexOfObject:textItem] == NSNotFound )
	{
		[mVisibleTexts addObject:textItem];
	}
	
}

- (void) removeVisible:(TextItem*) textItem 
{
	if ([mVisibleTexts indexOfObject:textItem] != NSNotFound)
	{
		[mVisibleTexts removeObject:textItem];
	}		
	
}
@end
