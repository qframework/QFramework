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

@class GLModel;
@class GLFace;
@class GLColor;
@class ShortBuffer;
@class GLVertex;

@interface GLShape : NSObject {

    
    NSMutableArray*     mFaceList;
    NSMutableArray*     mVertexList;
    //NSMutableArray*     mIndexList;
    GLModel*            mWorld;
}

- (id) initWithWorld:(GLModel*)world;
- (void) addFace:(GLFace*) face;
- (void) setFaceColor:(int)face color:(GLColor*)c;
- (int) getIndexCount;
- (void) putIndices:(ShortBuffer*) buffer;
-(GLVertex*) addVertex:(float)ax y:(float)ay z:(float)az tu:(float)atu tv:(float)atv c:(GLColor*)color;
-(GLVertex*) addVertexNew:(float)ax y:(float)ay z:(float)az tu:(float)atu tv:(float)atv c:(GLColor*)color;

@end
