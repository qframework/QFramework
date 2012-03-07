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

#import "GLModel.h"
#import "ByteBuffer.h"
#import "FloatBuffer.h"
#import "ShortBuffer.h"
#import "GLShape.h"
#import "GLVertex.h"
#import "GameonModelRef.h"
#import "TextureFactory.h"
#import "GameonApp.h"

#import <OpenGLES/ES1/gl.h>
#import <OpenGLES/ES1/glext.h>

@implementation GLModel

@synthesize mEnabled;
@synthesize mTextureID;
@synthesize mForceHalfTexturing;
@synthesize mForcedOwner;

- (id) initWithApp:(GameonApp*)app
{
	if (self = [super init])
	{
        mVertexList = [[NSMutableArray alloc] init] ;
        mShapeList = [[NSMutableArray alloc] init] ;
        mApp = app;
        mEnabled = false;
        mTextureOffset = 0;
        mTextureW = 1;
        mTextureH = 1;        
        
        mBBoxMin[0] = 1E10f;
        mBBoxMin[1] = 1E10f;
        mBBoxMin[2] = 1E10f;
        mBBoxMax[0] = -1E10f;
        mBBoxMax[1] = -1E10f;
        mBBoxMax[2] = -1E10f;	
        
        
        mIndexCount = 0;
        
        mVertexBuffer = [[FloatBuffer alloc] init] ;
        mColorBuffer = [[ByteBuffer alloc] init] ;
        mIndexBuffer = [[ShortBuffer alloc] init] ;
        mTextureBuffer = [[FloatBuffer alloc] init] ;

        mTextureOffset = 0;
        mTextureW = 1;
        mTextureH = 1;
        mTextureID = 1;
        mTransform = false;
        mForceHalfTexturing = false;
        mForcedOwner = 0;
        mVertexOffset = 0;
        
    }
    return self;
}

- (void) dealloc 
{
    [mVertexList release];
    [mShapeList release] ;
    [mVertexBuffer release];
    [mColorBuffer release];
    [mIndexBuffer release];
    [mTextureBuffer release];
    
    [super dealloc];  
}

- (void) addShape:(GLShape*) shape 
{
    [mShapeList addObject:shape];
    mIndexCount += [shape getIndexCount];
}




- (void) generate 
{	

    if (mTextureW == 1 && mTextureH == 1) {
        for (int a=0; a< [mVertexList count]; a++)
        {
            GLVertex* vertex = [mVertexList objectAtIndex:a];
            [vertex put:mVertexBuffer cb:mColorBuffer tb:mTextureBuffer];
        }
        
    } else {
        for (int a=0; a< [mVertexList count]; a++)
        {
            GLVertex* vertex = [mVertexList objectAtIndex:a];
            [vertex put:mVertexBuffer cb:mColorBuffer];
        }
        
        int cnt = 0;
        int cnttrig = [mVertexList count] /2;
        int fx = mForcedOwner % mTextureW;
        int fy = mForcedOwner / mTextureW;
        
        for (int b=0; b< mTextureH; b++) {
            for (int a=0; a< mTextureW; a++) {
                cnt = 0;

                for (int c = 0; c< [mVertexList count]; c++)
                {
                    GLVertex* vertex = [mVertexList objectAtIndex:c];
                    if (mForceHalfTexturing && cnt >= cnttrig) 
                    {
                        [vertex putText:mTextureBuffer x:fx y:fy w:mTextureW h:mTextureH];                        
                    }else
                    {
                        [vertex putText:mTextureBuffer x:a y:b w:mTextureW h:mTextureH];
                    }
                    cnt++;
                    

                }
            }
        }
    }
    for (int a=0; a< [mShapeList count]; a++)
    {
        GLShape* shape = [mShapeList objectAtIndex:a];
        [shape  putIndices:mIndexBuffer];
        
    }
    
    
}

-(GLVertex*) addVertex:(float)ax y:(float)ay z:(float)az tu:(float)atu tv:(float)atv 
{
    GLVertex* vertex = [[[GLVertex alloc] initWithCords:ax y:ay z:az tu:atu tv:atv i:[mVertexList count]] autorelease];

    [mVertexList addObject:vertex];
    if (ax < mBBoxMin[0]) mBBoxMin[0] = ax;
    if (ay < mBBoxMin[1]) mBBoxMin[1] = ay;
    if (az < mBBoxMin[2]) mBBoxMin[2] = az;		
    
    if (ax > mBBoxMax[0]) mBBoxMax[0] = ax;
    if (ay > mBBoxMax[1]) mBBoxMax[1] = ay;
    if (az > mBBoxMax[2]) mBBoxMax[2] = az;
    
    return vertex;
}	

- (void) setupRef
{
    
    static int lasttextId = -1;
//    glVertexPointer(3, GL_FLOAT, 0, [mVertexBuffer get]);
//    glColorPointer(4, GL_UNSIGNED_BYTE, 0, [mColorBuffer get]);
    
    if (mTextureID != lasttextId || [mApp.textures isUpdated])
    {
		if (glIsTexture(mTextureID) == GL_TRUE)
		{
			glBindTexture(GL_TEXTURE_2D, mTextureID);
			lasttextId = mTextureID;
		}else
		{
            NSLog(@" bad texture %d "  , mTextureID); 
			glBindTexture(GL_TEXTURE_2D, 1);
			lasttextId = 1;
		}
		[mApp.textures resetUpdate];
    }
    //gl.glTexCoordPointer(2, GL10.GL_FIXED, 0, mTextureBuffer);		
}

-(void) drawRef:(GameonModelRef*)ref init:(bool)initRef
{
    if (!mEnabled || mIndexCount ==0 ) {
        return;
    }
    
	if (ref.animating)
	{
		[ref animate:mApp.frameDelta];
	}
	if (![ref getVisible] || !ref.mEnabled)
	{
		return;
	}
	if (initRef)
	{
		[self setupRef];
	}

		
    if (ref.mTransformOwner) {
        if (ref.mOwner >=0 && ref.mOwner < ref.mOwnerMax)
            mTextureOffset = [mTextureBuffer capacity] * ref.mOwner / ref.mOwnerMax;	
    }else {
        mTextureOffset = 0;
    }
    
    glPushMatrix();

    /*
    NSLog(@" %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f  %f ",
          ref.mMatrix[0],ref.mMatrix[1],ref.mMatrix[2],ref.mMatrix[3],
          ref.mMatrix[4],ref.mMatrix[5],ref.mMatrix[6],ref.mMatrix[7],
          ref.mMatrix[8],ref.mMatrix[9],ref.mMatrix[10],ref.mMatrix[11],
          ref.mMatrix[12],ref.mMatrix[13],ref.mMatrix[14],ref.mMatrix[15]);          
    */
    glMultMatrixf( ref.mMatrix);
    float* toffset = [mTextureBuffer get] + mTextureOffset;
    glTexCoordPointer(2, GL_FLOAT, 0, toffset);
    
    glVertexPointer(3, GL_FLOAT, 0, [mVertexBuffer get]);
    glColorPointer(4, GL_UNSIGNED_BYTE, 0, [mColorBuffer get]);
    
    //glBindTexture(GL_TEXTURE_2D, mTextureID);
    glDrawElements(GL_TRIANGLES, mIndexCount, GL_UNSIGNED_SHORT, [mIndexBuffer get]);    
    
    glPopMatrix();
    
    
}

-(void) setTextureOffset:(int)aw h:(int)ah 
{
    mTextureW = aw;
    mTextureH = ah;
    mTextureOffset = 0;
}
- (void) reset {
    //generate;
    
}

- (void) setupOffset:(int) value
{
    mVertexOffset = value * 12;
    glVertexPointer(3, GL_FLOAT, 0, [mVertexBuffer get:mVertexOffset]);    
    glColorPointer(4, GL_UNSIGNED_BYTE, 0, [mColorBuffer get:value * 16]);
}

-(void) forceIndexCount:(int)count
{
    mIndexCount = count;
}

@end
