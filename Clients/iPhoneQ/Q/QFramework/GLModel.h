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

@class ByteBuffer;
@class ShortBuffer;
@class FloatBuffer;
@class GLShape;
@class GLVertex;
@class GameonModelRef;
@class GameonApp;

@interface GLModel : NSObject {

    
    NSMutableArray*     mShapeList;	
    NSMutableArray*     mVertexList;
    int                 mIndexCount;
    FloatBuffer*          mVertexBuffer;
    ByteBuffer*          mColorBuffer;
    ShortBuffer*        mIndexBuffer;
    
    FloatBuffer*          mTextureBuffer;
    int                 mTextureOffset;
    int                 mTextureW;
    int                 mTextureH;
    
    int                 mTextureID;
    
    bool                mTransform;
    
    float               mBBoxMin[3];
    float               mBBoxMax[3];
    
    bool                mEnabled;
	bool                mForceHalfTexturing;
	int                 mForcedOwner;
    int                 mVertexOffset;
    GameonApp*				mApp;

}

@property (nonatomic, assign) int  mTextureID;
@property (nonatomic, assign) bool                mForceHalfTexturing;
@property (nonatomic, assign) int                 mForcedOwner;
@property (nonatomic, assign) bool                mEnabled;

- (id) initWithApp:(GameonApp*)app;
-(GLVertex*) addVertex:(float)ax y:(float)ay z:(float)az tu:(float)atu tv:(float)atv ;
- (void) addShape:(GLShape*) shape;
- (void) drawRef:(GameonModelRef*)ref init:(bool)initRef;
- (void) setupRef;
- (void) setupOffset:(int) value;
- (void) generate;
-(void) setTextureOffset:(int)aw h:(int)ah ;
-(void) forceIndexCount:(int)count;
@end

