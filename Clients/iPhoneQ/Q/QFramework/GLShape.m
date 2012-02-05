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

#import "GLShape.h"
#import "GLModel.h"
#import "GLFace.h"
#import "GLColor.h"
#import "GLVertex.h"

@implementation GLShape
- (id) init
{
	if (self = [super init])
	{
        mVertexList = [[NSMutableArray alloc] init] ;
        mFaceList = [[NSMutableArray alloc] init] ;
        mWorld = nil;
    }
    return self;
}

- (id) initWithWorld:(GLModel*)world
{
	if (self = [super init])
	{
        mVertexList = [[NSMutableArray alloc] init];
        mFaceList = [[NSMutableArray alloc] init] ;
        mWorld = world;
    }
    return self;
}

- (void) dealloc 
{
    [mVertexList release];
    [mFaceList release];
    [super dealloc];  
}


- (void) addFace:(GLFace*) face {
    [mFaceList addObject:face];
}


- (void) setFaceColor:(int)face color:(GLColor*) c {
    GLFace* f = [mFaceList objectAtIndex:face];
    [f setColor:c];
}


- (void) putIndices:(ShortBuffer*) buffer {
    for (int a=0; a< [mFaceList count]; a++)
    {
        GLFace* f = [mFaceList objectAtIndex:a];
        [f putIndices:buffer];
    }
}

- (int) getIndexCount {
    int count = 0;
    for (int a=0; a< [mFaceList count]; a++)
    {
        GLFace* f = [mFaceList objectAtIndex:a];
        count += [f getIndexCount];
    }
    return count;
}


-(GLVertex*) addVertex:(float)ax y:(float)ay z:(float)az tu:(float)atu tv:(float)atv c:(GLColor*)color {
    
    // look for an existing GLVertex first
    for (int a=0; a< [mVertexList count]; a++)
    {
        GLVertex* vertex = [mVertexList objectAtIndex:a];
        if (vertex.x == ax && vertex.y == ay && vertex.z == az &&
            vertex.tu == atu && vertex.tv == atv && 
				vertex.red== color.red &&
				vertex.green== color.green &&
				vertex.blue== color.blue &&
				vertex.alpha== color.alpha) {
            return vertex;
        }
        
    }
    
    // doesn't exist, so create new vertex
    GLVertex* vertex = [mWorld addVertex:ax y:ay z:az tu:atu tv:atv];
	vertex.red= color.red;
	vertex.green= color.green;
	vertex.blue= color.blue;
	vertex.alpha= color.alpha;

    [mVertexList addObject:vertex];
    return vertex;
}

-(GLVertex*) addVertexNew:(float)ax y:(float)ay z:(float)az tu:(float)atu tv:(float)atv c:(GLColor*)color {
    
    // doesn't exist, so create new vertex
    GLVertex* vertex = [mWorld addVertex:ax y:ay z:az tu:atu tv:atv];
    vertex.red= color.red;
    vertex.green= color.green;
    vertex.blue= color.blue;
    vertex.alpha= color.alpha;    
    [mVertexList addObject:vertex];
    return vertex;
}


@end
