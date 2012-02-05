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

#import "GLVertex.h"
#import "FloatBuffer.h"
#import "ByteBuffer.h"
#import "ColorFactory.h"

@implementation GLVertex

@synthesize x;
@synthesize y;
@synthesize z;
@synthesize index;
@synthesize alpha;
@synthesize red;
@synthesize green;
@synthesize blue;
@synthesize tu;
@synthesize tv;

- (id) init
{
	if (self = [super init])
	{
        x = 0;
        y = 0;
        z = 0;
        tu = 0;
        tv = 0;
        index = -1;
        red = 255;
        alpha = 255;
        blue = 255;
        green = 255;        
    }
    return self;
}

- (id) initWithCords:(GLfloat)ax y:(GLfloat)ay z:(GLfloat)az tu:(GLfloat)atu tv:(GLfloat)atv i:(short)aindex
{
	if (self = [super init])
	{
        x = ax;
        y = ay;
        z = az;
        tu = atu;
        tv = atv;
        index = aindex;
        red = 255;
        alpha = 255;
        blue = 255;
        green = 255;                
    }
    return self;
}

- (bool) equals:(GLVertex*) v 
{
    return (x == v.x && y == v.y && z == v.z &&
            v.tu == tu && v.tv == tv && 
				alpha == v.alpha &&
            	red == v.red &&
            	green == v.green &&
            	blue == v.blue);
}

- (void) put:(FloatBuffer*)vertexBuffer cb:(ByteBuffer*)colorBuffer tb:(FloatBuffer*) textBuffer {
    [vertexBuffer put:x];
    [vertexBuffer put:y];
    [vertexBuffer put:z];
    

    [colorBuffer put:red];
    [colorBuffer put:green];
    [colorBuffer put:blue];
    [colorBuffer put:alpha];
    
    [textBuffer put:tu];
    [textBuffer put:tv];
    
}


- (void) put:(FloatBuffer*)vertexBuffer cb:(ByteBuffer*)colorBuffer{
    [vertexBuffer put:x];
    [vertexBuffer put:y];
    [vertexBuffer put:z];
    
    [colorBuffer put:red];
    [colorBuffer put:green];
    [colorBuffer put:blue];
    [colorBuffer put:alpha];
    
    
}

- (void) putText:(FloatBuffer*) textBuffer x:(int)ax y:(int)ay w:(int)aw h:(int)ah {
    
    float tu1 = tu / (float)aw + (float)ax / (float)aw;
    float tv1 = tv / (float)ah + (float)ay / (float)ah;
    [textBuffer put:tu1 ];
    [textBuffer put:tv1 ];
    
}
@end

