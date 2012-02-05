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
#import "GLColor.h"
#import <OpenGLES/ES1/gl.h>
#import <OpenGLES/ES1/glext.h>

@class ShortBuffer;
@class FloatBuffer;
@class ByteBuffer;

@interface GLVertex : NSObject {

    GLfloat x;
    GLfloat y;
    GLfloat z;
    
    short index;
    int red;
    int green;
    int blue;
    int alpha;

    GLfloat tu;
    GLfloat tv;
}

@property (nonatomic, assign) GLfloat x;
@property (nonatomic, assign) GLfloat y;
@property (nonatomic, assign) GLfloat z;
@property (nonatomic, assign) short index;
@property (nonatomic, assign) int  red;
@property (nonatomic, assign) int  green;
@property (nonatomic, assign) int  blue;
@property (nonatomic, assign) int  alpha;
@property (nonatomic, assign) GLfloat tu;
@property (nonatomic, assign) GLfloat tv;

- (id) initWithCords:(GLfloat)ax y:(GLfloat)ay z:(GLfloat)az tu:(GLfloat)atu tv:(GLfloat)atv i:(short)aindex;
- (void) put:(FloatBuffer*)vertexBuffer cb:(ByteBuffer*)colorBuffer tb:(FloatBuffer*) textBuffer;
- (void) put:(FloatBuffer*)vertexBuffer cb:(ByteBuffer*)colorBuffer;
- (void) putText:(FloatBuffer*) textBuffer x:(int)ax y:(int)ay w:(int)aw h:(int)ah;

@end
