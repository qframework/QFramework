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

#import "GLFace.h"
#import "GLVertex.h"
#import "GLColor.h"
#import "ShortBuffer.h"

@implementation GLFace
- (id) init
{
	if (self = [super init])
	{
        mVertexList = [[NSMutableArray alloc] init] ;
        
        mColor = nil;
    }
    return self;
}

- (void) dealloc 
{
    [mVertexList release];
    [super dealloc];  
}

- (void) setVertex:(GLVertex*)av1 v2:(GLVertex*)av2 v3:(GLVertex*)av3
{
    [self addVertex:av1];
    [self addVertex:av2];
    [self addVertex:av3];        
}
- (void) setVertex:(GLVertex*)av1 v2:(GLVertex*)av2 v3:(GLVertex*)av3 v4:(GLVertex*)av4
{
    [self addVertex:av1];
    [self addVertex:av2];
    [self addVertex:av3];
    [self addVertex:av4];        
}

-(void) addVertex:(GLVertex*) v {
    [mVertexList addObject:v];
}

-(void) setColor:(GLColor*) c {
    
    int last = [mVertexList count] - 1;
    if (last < 2) {
        //Log.e("GLFace", "not enough vertices in setColor()");
        
    } else {
        GLVertex* vertex = [mVertexList objectAtIndex:last];
        //GLVertex* start = vertex;
		vertex.red = c.red;
		vertex.green = c.green;
		vertex.blue = c.blue;
		vertex.alpha = c.alpha;
    }
    
    mColor = c;
}



// must be called after all vertices are added
-(int) getIndexCount {
    return ([mVertexList count] - 2) * 3;
}

- (void) putIndices:(ShortBuffer*) buffer {
    int last = [mVertexList count] - 1;
    
    GLVertex* v0 = [mVertexList objectAtIndex:0];
    GLVertex* vn = [mVertexList objectAtIndex:last];
    
    // push triangles into the buffer
    for (int i = 1; i < last; i++) {
        GLVertex* v1 = [mVertexList objectAtIndex:i];
        [buffer put:v0.index];
        [buffer put:v1.index];
        [buffer put:vn.index];
        v0 = v1;
    }
}

@end
