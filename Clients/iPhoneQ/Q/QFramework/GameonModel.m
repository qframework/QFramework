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

#import "GameonModel.h"
#import "GameonModelData.h"
#import "GLVertex.h"
#import "GLShape.h"
#import "ColorFactory.h"
#import "GLFace.h"
#import "TextureFactory.h"
#import "GameonModelRef.h"
#import "GameonWorld.h"
#import "AnimData.h"
#import "AnimFactory.h"
#import "GameonCS.h"
#import "GameonApp.h"

@implementation GameonModel

@synthesize mHasAlpha;
@synthesize mIsModel;
@synthesize mLoc;
@synthesize mSubmodels;
@synthesize mModelTemplate;
@synthesize mName;

- (id) initWithName:(NSString*)name app:(GameonApp*)app
{
	if (self = [super initWithApp:app])
	{
        mRefs = [[NSMutableArray alloc] init] ;
		mVisibleRefs = [[NSMutableArray alloc] init] ;
        mLoc = GWLOC_WORLD;
        mVisible = true;
        mSubmodels = 0;
        mModelTemplate = GMODEL_NONE;
        mHasAlpha = false;
        mIsModel = false;
		mTextureID = [mApp.textures get:TFT_DEFAULT];
		mWorld = app.world;
		mApp = app;
		mActive = true;
    }
    
    return self;
}

- (void) dealloc 
{
    [mRefs release];
    [mVisibleRefs release];
    [super dealloc];  
}

- (void) createModel:(GameonModelData_Type)type left:(float)aleft bottom:(float)abottom back:(float)aback 
                    right:(float)aright top:(float)atop front:(float)afront tid:(int) textid 
{
    float ratiox = aright - aleft;
    float ratioy = afront - abottom;
    float ratioz = atop - aback;    	
    
    modeldata* data;
    data = GameonModelData_getData(type);

    GLColor* color = mApp.colors.white;
    
    int len = GameonModelData_getDataLen(type);
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];
    
    float xmid = (aright + aleft) /2;
    float ymid = (atop + abottom) /2;
    float zmid = (afront + aback) /2;
    
    for (int a=0; a< len; a+=9 ) {
        float vx1 = (*data)[a][0];
        float vy1 = (*data)[a][1];
        float vz1 = (*data)[a][2];
        
        float tu1 = (*data)[a+2][0];
        float tv1 = 1.0f- (*data)[a+2][1];    		
        vx1 *= ratiox; vx1 += xmid;
        vy1 *= ratioy; vy1 += ymid;
        vz1 *= ratioz; vz1 += zmid;
        GLVertex* v1 = [shape addVertex:vx1 y:vy1 z:vz1 tu:tu1 tv:tv1 c:color];
        
        float vx2 = (*data)[a+3][0];
        float vy2 = (*data)[a+3][1];
        float vz2 = (*data)[a+3][2];
        
        float tu2 = (*data)[a+5][0];
        float tv2 = 1.0f- (*data)[a+5][1];    		
        
        vx2 *= ratiox; vx2 += xmid;
        vy2 *= ratioy; vy2 += ymid;
        vz2 *= ratioz; vz2 += zmid;
        GLVertex* v2 = [shape addVertex:vx2 y:vy2 z:vz2 tu:tu2 tv:tv2 c:color];
        
        float vx3 = (*data)[a+6][0];
        float vy3 = (*data)[a+6][1];
        float vz3 = (*data)[a+6][2];
        
        float tu3 = (*data)[a+8][0];
        float tv3 = 1.0f- (*data)[a+8][1];    		
        
        vx3 *= ratiox; vx3 += xmid;
        vy3 *= ratioy; vy3 += ymid;
        vz3 *= ratioz; vz3 += zmid;
        GLVertex* v3 = [shape addVertex:vx3 y:vy3 z:vz3 tu:tu3 tv:tv3 c:color];    		
        
        GLFace* fc = [[[GLFace alloc] init] autorelease];
        [fc setVertex:v1 v2:v2 v3:v3];
        [shape addFace:fc];
        //shape.setFaceColor(a/9, color);
    }
    
    [self addShape:shape];
    mTextureID = textid;
    
}


- (void) createModel:(GameonModelData_Type)type ti:(int)textid 
{
    
    
    modeldata* data;
    data = GameonModelData_getData(type);
    
    int len = GameonModelData_getDataLen(type);
    GLColor* color = mApp.colors.white;

    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];
    
    for (int a=0; a< len; a+=9 ) {
        float vx1 = (*data)[a][0];
        float vy1 = (*data)[a][1];
        float vz1 = (*data)[a][2];
        
        float tu1 = (*data)[a+2][0];
        float tv1 = 1.0f - (*data)[a+2][1];    		
        GLVertex* v1 = [shape addVertex:vx1 y:vy1 z:vz1 tu:tu1 tv:tv1 c:color];
        
        float vx2 = (*data)[a+3][0];
        float vy2 = (*data)[a+3][1];
        float vz2 = (*data)[a+3][2];
        
        float tu2 = (*data)[a+5][0];
        float tv2 = 1.0f - (*data)[a+5][1];    		
        
        GLVertex* v2 = [shape addVertex:vx2 y:vy2 z:vz2 tu:tu2 tv:tv2 c:color];
        
        float vx3 = (*data)[a+6][0];
        float vy3 = (*data)[a+6][1];
        float vz3 = (*data)[a+6][2];
        
        float tu3 = (*data)[a+8][0];
        float tv3 = 1.0f - (*data)[a+8][1];    		
        
        GLVertex* v3 = [shape addVertex:vx3 y:vy3 z:vz3 tu:tu3 tv:tv3 c:color];    		
        
        GLFace* fc = [[[GLFace alloc] init] autorelease] ;
        [fc setVertex:v1 v2:v2 v3:v3];
        [shape addFace:fc];
        
    }
    
    [self addShape:shape];
    mTextureID = textid;
    
}    

- (void) createModel:(GameonModelData_Type)type left:(float)aleft bottom:(float)abottom back:(float)aback 
               right:(float)aright top:(float)atop front:(float)afront c:(GLColor*) color
{
    float ratiox = aright - aleft;
    float ratioy = afront - abottom;
    float ratioz = atop - aback;    	
    
    
    modeldata* data;
    data = GameonModelData_getData(type);
    
    int len = GameonModelData_getDataLen(type);
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];
    
    float xmid = (aright + aleft) /2;
    float ymid = (atop + abottom) /2;
    float zmid = (afront + aback) /2;
    
    for (int a=0; a< len; a+=9 ) {
        float vx1 = (*data)[a][0];
        float vy1 = (*data)[a][1];
        float vz1 = (*data)[a][2];
        
        vx1 *= ratiox; vx1 += xmid;
        vy1 *= ratioy; vy1 += ymid;
        vz1 *= ratioz; vz1 += zmid;
        float tu1 = (*data)[a+2][0];
        float tv1 = 1.0f - (*data)[a+2][1];    		
        GLVertex* v1 = [shape addVertex:vx1 y:vy1 z:vz1 tu:tu1 tv:tv1 c:color];
        
        float vx2 = (*data)[a+3][0];
        float vy2 = (*data)[a+3][1];
        float vz2 = (*data)[a+3][2];
        
        vx2 *= ratiox; vx2 += xmid;
        vy2 *= ratioy; vy2 += ymid;
        vz2 *= ratioz; vz2 += zmid;
        float tu2 = (*data)[a+5][0];
        float tv2 = 1.0f - (*data)[a+5][1];    		
        GLVertex* v2 = [shape addVertex:vx2 y:vy2 z:vz2 tu:tu2 tv:tv2 c:color];
        
        float vx3 = (*data)[a+6][0];
        float vy3 = (*data)[a+6][1];
        float vz3 = (*data)[a+6][2];
        
        vx3 *= ratiox; vx3 += xmid;
        vy3 *= ratioy; vy3 += ymid;
        vz3 *= ratioz; vz3 += zmid;
        float tu3 = (*data)[a+8][0];
        float tv3 = 1.0f - (*data)[a+8][1];    		
        GLVertex* v3 = [shape addVertex:vx3 y:vy3 z:vz3 tu:tu3 tv:tv3 c:color];    		
        
        GLFace* fc = [[[GLFace alloc] init] autorelease];
        [fc setVertex:v1 v2:v2 v3:v3];
        [shape addFace:fc];
        
    }
    
    [self addShape:shape];
}
- (void) createOctogon:(float)left btm:(float)bottom b:(float)back 
                 r:(float)right t:(float)top f:(float)front c:(GLColor*)color
{
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];

    float divx = (right - left ) / 4;
    float divy = (top - bottom ) / 4;
    GLColor* c = [[[GLColor alloc] init] autorelease];
    c.red = color.red;
    c.blue = color.blue;
    c.green = color.green;
    c.alpha = color.alpha/2;    
    
    GLVertex* p1 = [shape addVertex:(left + divx) y:top z:front tu:0.0f tv:1.00f c:c ];
    GLVertex* p2 = [shape addVertex:(left + 3 * divx) y:top z:front tu:0.0f tv:1.00f c:c];
    GLVertex* p3 = [shape addVertex:right  y:(bottom + 3 * divy) z:front tu:0.0f tv:1.00f c:c];
    GLVertex* p4 = [shape addVertex:right  y:(bottom +  divy) z:front tu:0.0f tv:1.00f c:c];
    GLVertex* p5 = [shape addVertex:(left + 3*divx) y:bottom z:front tu:0.0f  tv:1.00f c:c];
    GLVertex* p6 = [shape addVertex:(left + divx) y:bottom z:front  tu:0.0f  tv:1.00f c:c];
    GLVertex* p7 = [shape addVertex:left y:(bottom + divy) z:front tu:0.0f tv:1.00f c:c ];
    GLVertex* p8 = [shape addVertex:left y:(bottom + 3* divy) z:front tu:0.0f tv:1.00f c:c ];
    
    
    //GLColor* ccolor = [cf getColor:@"AAFFFFFF"];
    GLVertex* center = [shape addVertex:( (right + left) / 2) y:((top + bottom ) / 2) z:front tu:0.5f tv:0.5f c:mApp.colors.white];
    // front

    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:center v2:p1 v3:p8];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:center v2:p2 v3:p1];
    [shape addFace:face2];
    
    GLFace* face3 = [[[GLFace alloc] init] autorelease];
    [face3   setVertex:center v2:p3 v3:p2];
    [shape addFace:face3];
    
    GLFace* face4 = [[[GLFace alloc] init] autorelease];
    [face4   setVertex:center v2:p4 v3:p3];
    [shape addFace:face4];
    
    GLFace* face5 = [[[GLFace alloc] init] autorelease];
    [face5   setVertex:center v2:p5 v3:p4];
    [shape addFace:face5];
    
    GLFace* face6 = [[[GLFace alloc] init] autorelease];
    [face6   setVertex:center v2:p6 v3:p5];
    [shape addFace:face6];    

    GLFace* face7 = [[[GLFace alloc] init] autorelease];
    [face7  setVertex:center v2:p7 v3:p6];
    [shape addFace:face7];    

    GLFace* face8 = [[[GLFace alloc] init] autorelease];
    [face8   setVertex:center v2:p8 v3:p7];
    [shape addFace:face8];    
    
    [self addShape:shape];

}    



- (void) createPlane:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front c:(GLColor*)color
{
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];

    GLVertex* leftBottomFront = [shape addVertex:left y:bottom z:front tu:0.01f tv:0.99f c:color];
    GLVertex* rightBottomFront = [shape addVertex:right y:bottom z:front tu:0.99f tv:0.99f c:color];
    GLVertex* leftTopFront = [shape addVertex:left y:top z:front tu:0.01f  tv:0.01f c:color];
    GLVertex* rightTopFront = [shape addVertex:right y:top z:front tu:0.99f tv:0.01f c:color];

    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:leftBottomFront v2:rightTopFront v3:leftTopFront];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:leftBottomFront v2:rightBottomFront v3:rightTopFront];
    [shape addFace:face2];
  
    [self addShape:shape];
    
}

- (void) createPlane4:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front c1:(GLColor*)c1 c2:(GLColor*)c2
{
    
    if (c1 == nil) c1 = mApp.colors.white;
    if (c2 == nil) c2 = mApp.colors.white;    
    
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];
    
    GLVertex* leftBottomFront = [shape addVertex:left y:bottom z:front tu:0.0f tv:1.00f c:c1];
    GLVertex* rightBottomFront = [shape addVertex:right y:bottom z:front tu:1.0f tv:1.00f c:c1];
    GLVertex* leftTopFront = [shape addVertex:left y:top z:front tu:0.0f  tv:0.00f c:c2];
    GLVertex* rightTopFront = [shape addVertex:right y:top z:front tu:1.00f tv:0.00f c:c2];
    
    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:leftBottomFront v2:rightTopFront v3:leftTopFront];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:leftBottomFront v2:rightBottomFront v3:rightTopFront];
    [shape addFace:face2];
    
    [self addShape:shape];
    
}


- (void) createPlaneForLetter:(float)left btm:(float)bottom b:(float)back 
                            r:(float)right t:(float)top f:(float)front c:(GLColor*)color
{
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease ];

    GLVertex* leftBottomFront = [shape addVertexNew:left y:bottom z:front tu:0.00f tv:1.00f c:color];
    GLVertex* rightBottomFront = [shape addVertexNew:right y:bottom z:front tu:1.00f tv:1.00f c:color];
    GLVertex* leftTopFront = [shape addVertexNew:left y:top z:front tu:0.00f  tv:0.00f c:color];
    GLVertex* rightTopFront = [shape addVertexNew:right y:top z:front tu:1.00f tv:0.00f c:color];
    
    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:leftBottomFront v2:rightTopFront v3:leftTopFront];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:leftBottomFront v2:rightBottomFront v3:rightTopFront];
    [shape addFace:face2];
    
    [self addShape:shape];

}

- (void) createPlane2:(float)left btm:(float)bottom b:(float)back 
                    r:(float)right t:(float)top f:(float)front c:(GLColor*)color
{
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];
    
    GLVertex* leftBottomFront = [shape addVertex:left y:bottom z:front tu:0.0f tv:1.0f c:color];
    GLVertex* rightBottomFront = [shape addVertex:right y:bottom z:front tu:1.0f tv:1.0f c:color];
    GLVertex* leftTopFront = [shape addVertex:left y:top z:front tu:0.00f  tv:0.0f c:color];
    GLVertex* rightTopFront = [shape addVertex:right y:top z:front tu:1.0f tv:0.0f c:color];
    
    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:leftBottomFront v2:rightTopFront v3:leftTopFront];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:leftBottomFront v2:rightBottomFront v3:rightTopFront];
    [shape addFace:face2];
    
    [self addShape:shape];

}


- (void) createPlane3:(float)left btm:(float)bottom b:(float)back 
                    r:(float)right t:(float)top f:(float)front c:(GLColor*)color
{
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];
    
    GLVertex* leftBottomFront = [shape addVertex:left y:bottom z:front tu:0.0f tv:1.0f c:color];
    GLVertex* rightBottomFront = [shape addVertex:right y:bottom z:front tu:1.0f tv:1.0f c:mApp.colors.white];
    GLVertex* leftTopFront = [shape addVertex:left y:top z:front tu:0.0f  tv:0.0f c:color];
    GLVertex* rightTopFront = [shape addVertex:right y:top z:front tu:1.0f tv:0.0f c:color];
    
    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:leftBottomFront v2:rightTopFront v3:leftTopFront];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:leftBottomFront v2:rightBottomFront v3:rightTopFront];
    [shape addFace:face2];
    
    [self addShape:shape];

}

- (void) createCube:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front c:(GLColor*)color
{
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease ];

    GLColor* white = mApp.colors.white;
 
    GLVertex* leftBottomBack = [shape addVertex:left y:bottom z:back tu:0 tv:0  c:white ];
    GLVertex* rightBottomBack = [shape addVertex:right y:bottom z:back tu:0 tv:0 c:white ];
    GLVertex* leftTopBack = [shape addVertex:left y:top z:back tu:0 tv:0 c:white];
    GLVertex* rightTopBack = [shape addVertex:right y:top z:back tu:0 tv:0 c:white];
    GLVertex* leftBottomFront = [shape addVertex:left y:bottom z:front tu:0 tv:0 c:color];
    GLVertex* rightBottomFront = [shape addVertex:right y:bottom z:front tu:0 tv:0 c:color];
    GLVertex* leftTopFront = [shape addVertex:left y:top z:front tu:0 tv:0 c:color];
    GLVertex* rightTopFront = [shape addVertex:right y:top z:front tu:0 tv:0 c:white];

    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:leftBottomBack v2:rightBottomFront v3:leftBottomFront];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:leftBottomBack v2:rightBottomBack v3:rightBottomFront];
    [shape addFace:face2];
    
    GLFace* face3 = [[[GLFace alloc] init] autorelease];
    [face3   setVertex:leftBottomFront v2:rightTopFront v3:leftTopFront];
    [shape addFace:face3];
    
    GLFace* face4 = [[[GLFace alloc] init] autorelease];
    [face4   setVertex:leftBottomFront v2:rightBottomFront v3:rightTopFront];
    [shape addFace:face4];
    
    
    GLFace* face5 = [[[GLFace alloc] init] autorelease];
    [face5   setVertex:leftBottomBack v2:leftTopFront v3:leftTopBack];
    [shape addFace:face5];
    
    GLFace* face6 = [[[GLFace alloc] init] autorelease];
    [face6   setVertex:leftBottomBack v2:leftBottomFront v3:leftTopFront];
    [shape addFace:face6];
    
    
    GLFace* face7 = [[[GLFace alloc] init] autorelease];
    [face7   setVertex:rightBottomBack v2:rightTopFront v3:rightBottomFront];
    [shape addFace:face7];
    
    GLFace* face8 = [[[GLFace alloc] init] autorelease];
    [face8   setVertex:rightBottomBack v2:rightTopBack v3:rightTopFront];
    [shape addFace:face8];
    

    GLFace* face9 = [[[GLFace alloc] init] autorelease];
    [face9   setVertex:leftBottomBack v2:rightTopBack v3:rightBottomBack];
    [shape addFace:face9];
    
    GLFace* face10 = [[[GLFace alloc] init] autorelease];
    [face10   setVertex:leftBottomBack v2:leftTopBack v3:rightTopBack];
    [shape addFace:face10];

    GLFace* face11 = [[[GLFace alloc] init] autorelease];
    [face11   setVertex:leftTopBack v2:rightTopFront v3:rightTopBack];
    [shape addFace:face11];
    
    GLFace* face12 = [[[GLFace alloc] init] autorelease];
    [face12   setVertex:leftTopBack v2:leftTopFront v3:rightTopFront];
    [shape addFace:face12];
    
    [self addShape:shape];

 }

- (void)addref:(GameonModelRef*) ref
{
    if ([mRefs indexOfObject:ref] == NSNotFound )
    {
        [mRefs addObject:ref];
        [ref set];
        mEnabled = true;
    }
    [ref setParent:self];
    if ([ref getVisible])
    {
        [self addVisibleRef:ref];
    }
    
    
}

-(void)draw:(GameonWorld_Location) loc
{

    if (!mEnabled || !mVisible) {
        return;
    }    
    
    int len = [mVisibleRefs count];
    //NSLog(@" refsno %d" , len);

    if (len > 0) {
        [self setupRef];
        for (int a=0; a<len ; a++)
        {
            GameonModelRef* ref = [mVisibleRefs objectAtIndex:a];
            if (ref.mLoc == loc) {
                [self drawRef:ref init:true];
            }
        }
    }
}

-(void) removeref:(GameonModelRef*) ref 
{
    if ([mRefs indexOfObject:ref] != NSNotFound )
    {
        [mRefs removeObject:ref];
        if ([mRefs count] == 0)
        {
            mEnabled = false;
        }
    }
    
}

- (void) setTexture:(int) i 
{
    mTextureID = i;
    
}

- (void) createCard:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front c:(GLColor*)color
{
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];
    float t =0.002f;
    
    GLVertex* leftBottomFront = [shape addVertex:left y:bottom z:front+t tu:0.0f tv:0.00f c:color];
    GLVertex* rightBottomFront = [shape addVertex:right y:bottom z:front+t tu:1.0f tv:0.00f c:color];
    GLVertex* leftBottom2Front = [shape addVertex:left y:(bottom+top)/2 z:front+t tu:0.0f  tv:1.00f c:color];
    GLVertex* rightBottom2Front = [shape addVertex:right y:(bottom+top)/2 z:front+t tu:1.00f tv:1.00f c:color];

    GLVertex* leftBottom2Front1 = [shape addVertex:left y:(bottom+top)/2 z:front+t tu:0.0f  tv:1.00f c:color];
    GLVertex* rightBottom2Front1 = [shape addVertex:right y:(bottom+top)/2 z:front+t tu:1.00f tv:1.00f c:color];
    
    GLVertex* leftTopFront = [shape addVertex:left y:top z:front+t tu:0.0f  tv:0.00f c:color];
    GLVertex* rightTopFront = [shape addVertex:right y:top z:front+t tu:1.00f tv:0.00f c:color];
    
    
    
    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:leftBottom2Front v2:rightTopFront v3:leftTopFront];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:leftBottom2Front v2:rightBottom2Front v3:rightTopFront];
    [shape addFace:face2];

    GLFace* face3 = [[[GLFace alloc] init] autorelease];
    [face3   setVertex:leftBottomFront v2:rightBottom2Front1 v3:leftBottom2Front1];
    [shape addFace:face3];
    
    GLFace* face4 = [[[GLFace alloc] init] autorelease];
    [face4   setVertex:leftBottomFront v2:rightBottomFront v3:rightBottom2Front1];
    [shape addFace:face4];
    
    
    GLVertex* leftBottomFront_ = [shape addVertex:left y:bottom z:front-t tu:0.0f tv:0.00f c:color];
    GLVertex* rightBottomFront_ = [shape addVertex:right y:bottom z:front-t tu:1.0f tv:0.00f c:color];
    GLVertex* leftBottom2Front_ = [shape addVertex:left y:(bottom+top)/2 z:front-t tu:0.0f  tv:1.00f c:color];
    GLVertex* rightBottom2Front_ = [shape addVertex:right y:(bottom+top)/2 z:front-t tu:1.00f tv:1.00f c:color];
    
    GLVertex* leftTopFront_ = [shape addVertex:left y:top z:front-t tu:0.0f  tv:0.00f c:color];
    GLVertex* rightTopFront_ = [shape addVertex:right y:top z:front-t tu:1.00f tv:0.00f c:color];
    
    GLFace* face1_ = [[[GLFace alloc] init] autorelease];
    [face1_   setVertex:leftBottom2Front_ v2:leftTopFront_ v3:rightTopFront_];
    [shape addFace:face1_];
    
    GLFace* face2_ = [[[GLFace alloc] init] autorelease];
    [face2_   setVertex:leftBottom2Front_ v2:rightTopFront_ v3:rightBottom2Front_];
    [shape addFace:face2_];
    
    GLFace* face3_ = [[[GLFace alloc] init] autorelease];
    [face3_   setVertex:rightBottom2Front_ v2:leftBottomFront_ v3:leftBottom2Front_];
    [shape addFace:face3_];
    
    GLFace* face4_ = [[[GLFace alloc] init] autorelease];
    [face4_   setVertex:rightBottomFront_ v2:leftBottomFront_ v3:rightBottom2Front_];
    [shape addFace:face4_];
    
    [self addShape:shape];

}

- (void) createCard2:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front c:(GLColor*)color
{
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];
    float w = (right-left) / 30;    
    float t =0.002f;
    
    GLVertex* leftBottomFront = [shape addVertex:left+w y:bottom+w z:front+t tu:0.0f tv:1.00f c:color];
    GLVertex* rightBottomFront = [shape addVertex:right-w y:bottom+w z:front+t tu:1.0f tv:1.00f c:color];
    GLVertex* leftTopFront = [shape addVertex:left+w y:top-w z:front+t tu:0.0f  tv:0.00f c:color];
    GLVertex* rightTopFront = [shape addVertex:right-w y:top-w z:front+t tu:1.00f tv:0.00f c:color];
    
    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:leftBottomFront v2:rightTopFront v3:leftTopFront];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:leftBottomFront v2:rightBottomFront v3:rightTopFront];
    [shape addFace:face2];

    GLVertex* leftBottomFront_ = [shape addVertex:left+w y:bottom+w z:front-t tu:1.0f tv:1.00f c:color];
    GLVertex* rightBottomFront_ = [shape addVertex:right-w y:bottom+w z:front-t  tu:0.0f tv:1.00f c:color];
    GLVertex* leftTopFront_ = [shape addVertex:left+w y:top-w z:front-t  tu:1.00f tv:0.00f c:color];
    GLVertex* rightTopFront_ = [shape addVertex:right-w y:top-w z:front-t tu:0.0f  tv:0.00f c:color];
    
    GLFace* face1_ = [[[GLFace alloc] init] autorelease];
    [face1_   setVertex:leftBottomFront_ v2:leftTopFront_ v3:rightTopFront_];
    [shape addFace:face1_];
    
    GLFace* face2_ = [[[GLFace alloc] init] autorelease];
    [face2_   setVertex:leftBottomFront_ v2:rightTopFront_ v3:rightBottomFront_];
    [shape addFace:face2_];
    
    
    [self addShape:shape];
    
}

-(void) setState:(int) state
{
	if (!mActive && state == LAS_VISIBLE)
		return;

			
    for (int a=0; a< [mRefs count]; a++)
    {
        GameonModelRef* ref = [mRefs objectAtIndex:a];
        if (state == LAS_HIDDEN)
        {
            [ref setVisible:false];
        }else
        {
            [ref setVisible:true];
        }
    }
    if (state == LAS_HIDDEN)
    {
        [self setVisible:false];
    }else
    {
        [self setVisible:true];
    }
}

- (void) createFrame:(float)left btm:(float)bottom b:(float)back 
                   r:(float)right t:(float)top f:(float)front 
				   fw:(float)fw fh:(float)fh c:(GLColor*)color
{
	
	GLColor* c;
	if (color == nil)
	{
		c = mApp.colors.white;
	}
	else
	{
		c = color;
	}
	
	[self createPlane:left-fw/2 btm:bottom-fh/2 b:front   r:left+fw/2 t:top+fh/2 f:front c:color];
	[self createPlane:right-fw/2 btm:bottom-fh/2 b:front  r:right+fw/2 t:top+fh/2 f:front c:color];
	
	[self createPlane:left+fw/2 btm:bottom-fh/2 b:front r:right-fw/2 t:bottom+fh/2 f:front c:color];
	[self createPlane:left+fw/2 btm:top-fh/2 b:front r:right-fw/2 t:top+fh/2 f:front c:color];
	
}

- (void) createPlaneTex:(float)left btm:(float)bottom b:(float)back r:(float)right t:(float)top f:(float)front 
						tu1:(float)tu1 tv1:(float)tv1 tu2:(float)tu2 tv2:(float)tv2 c:(GLColor**)colors
                        no:(float)no div:(float)div
{
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];


    GLVertex* leftBottomFront = [shape addVertex:left y:bottom z:front tu:tu1 tv:tv2 c:mApp.colors.white];
    GLVertex* rightBottomFront = [shape addVertex:right y:bottom z:front tu:tu2 tv:tv2 c:mApp.colors.white];
    GLVertex* leftTopFront = [shape addVertex:left y:top z:front tu:tu1  tv:tv1 c:mApp.colors.white];
    GLVertex* rightTopFront = [shape addVertex:right y:top z:front tu:tu2 tv:tv1 c:mApp.colors.white];

	float val1 = no * div;
	float val2 = (no+1) * div;

	leftBottomFront.red = colors[0].red + (int)((colors[2].red-colors[0].red) * val1);
	leftBottomFront.green = colors[0].green + (int)((colors[2].green-colors[0].green) * val1);
	leftBottomFront.blue = colors[0].blue + (int)((colors[2].blue-colors[0].blue) * val1);
	leftBottomFront.alpha = colors[0].alpha + (int)((colors[2].alpha-colors[0].alpha) * val1);

	rightBottomFront.red = colors[1].red + (int)((colors[3].red-colors[1].red) * val1);
	rightBottomFront.green = colors[1].green + (int)((colors[3].green-colors[1].green) * val1);
	rightBottomFront.blue = colors[1].blue + (int)((colors[3].blue-colors[1].blue) * val1);
	rightBottomFront.alpha = colors[1].alpha + (int)((colors[3].alpha-colors[1].alpha) * val1);

	leftTopFront.red = colors[0].red + (int)((colors[2].red-colors[0].red) * val2);
	leftTopFront.green = colors[0].green + (int)((colors[2].green-colors[0].green) * val2);
	leftTopFront.blue = colors[0].blue + (int)((colors[2].blue-colors[0].blue) * val2);
	leftTopFront.alpha = colors[0].alpha + (int)((colors[2].alpha-colors[0].alpha) * val2);

	rightTopFront.red = colors[1].red + (int)((colors[3].red-colors[1].red) * val2);
	rightTopFront.green = colors[1].green + (int)((colors[3].green-colors[1].green) * val2);
	rightTopFront.blue = colors[1].blue + (int)((colors[3].blue-colors[1].blue) * val2);
	rightTopFront.alpha = colors[1].alpha + (int)((colors[3].alpha-colors[1].alpha) * val2);
	
    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:leftBottomFront v2:rightTopFront v3:leftTopFront];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:leftBottomFront v2:rightBottomFront v3:rightTopFront];
    [shape addFace:face2];
  
    [self addShape:shape];
}

- (void) createPlaneTex2:(float)left btm:(float)bottom b:(float)back r:(float)right t:(float)top f:(float)front 
                    tu1:(float)tu1 tv1:(float)tv1 tu2:(float)tu2 tv2:(float)tv2 c:(GLColor**)colors
                     no:(float)no div:(float)div
{
    GLShape* shape = [[[GLShape alloc] initWithWorld:self] autorelease];
    
    
    GLVertex* leftBottomFront = [shape addVertex:left y:bottom z:front tu:tu1 tv:tv2 c:mApp.colors.white];
    GLVertex* rightBottomFront = [shape addVertex:right y:bottom z:front tu:tu2 tv:tv2 c:mApp.colors.white];
    GLVertex* leftTopFront = [shape addVertex:left y:top z:front tu:tu1  tv:tv1 c:mApp.colors.white];
    GLVertex* rightTopFront = [shape addVertex:right y:top z:front tu:tu2 tv:tv1 c:mApp.colors.white];
    
	float val1 = no * div;
	float val2 = (no+1) * div;
    
	leftBottomFront.red = colors[0].red + (int)((colors[2].red-colors[0].red) * val1);
	leftBottomFront.green = colors[0].green + (int)((colors[2].green-colors[0].green) * val1);
	leftBottomFront.blue = colors[0].blue + (int)((colors[2].blue-colors[0].blue) * val1);
	leftBottomFront.alpha = colors[0].alpha + (int)((colors[2].alpha-colors[0].alpha) * val1);
    
	rightBottomFront.red = colors[0].red + (int)((colors[2].red-colors[0].red) * val2);
	rightBottomFront.green = colors[0].green + (int)((colors[2].green-colors[0].green) * val2);
	rightBottomFront.blue = colors[0].blue + (int)((colors[2].blue-colors[0].blue) * val2);
	rightBottomFront.alpha = colors[0].alpha + (int)((colors[2].alpha-colors[0].alpha) * val2);
    
	leftTopFront.red = colors[1].red + (int)((colors[3].red-colors[1].red) * val1);
	leftTopFront.green = colors[1].green + (int)((colors[3].green-colors[1].green) * val1);
	leftTopFront.blue = colors[1].blue + (int)((colors[3].blue-colors[1].blue) * val1);
	leftTopFront.alpha = colors[1].alpha + (int)((colors[3].alpha-colors[1].alpha) * val1);
    
	rightTopFront.red = colors[1].red + (int)((colors[3].red-colors[1].red) * val2);
	rightTopFront.green = colors[1].green + (int)((colors[3].green-colors[1].green) * val2);
	rightTopFront.blue = colors[1].blue + (int)((colors[3].blue-colors[1].blue) * val2);
	rightTopFront.alpha = colors[1].alpha + (int)((colors[3].alpha-colors[1].alpha) * val2);
	
    GLFace* face1 = [[[GLFace alloc] init] autorelease];
    [face1   setVertex:leftBottomFront v2:rightTopFront v3:leftTopFront];
    [shape addFace:face1];
    
    GLFace* face2 = [[[GLFace alloc] init] autorelease];
    [face2   setVertex:leftBottomFront v2:rightBottomFront v3:rightTopFront];
    [shape addFace:face2];
    
    [self addShape:shape];
}

-(void) createAnimTrans:(NSString*)type delay:(int)delay away:(bool)away  no:(int) no
{
    GameonModelRef*  to = [[GameonModelRef alloc] init];
    [to copy:[mRefs objectAtIndex:0]];
	[to copyMat:[mRefs objectAtIndex:0]];
    GameonModelRef* from = [[GameonModelRef alloc] init];
	float w,h,x,y;
	
    [to copy:[mRefs objectAtIndex:no]];
    [from copy:to];
    

	if (to.mLoc == GWLOC_WORLD)
	{
		w = [mApp.cs worldWidth];
		h = [mApp.cs worldHeight];
	
		x = [mApp.cs worldCenterX];
		y = [mApp.cs worldCenterY];
	}else
	{
		w = [mApp.cs hudWidth];
		h = [mApp.cs hudHeight];
	
		x = [mApp.cs hudCenterX];
		y = [mApp.cs hudCenterY];
	}
	//float z = to.mPosition[2];
	if ([type isEqual:@"left"])
	{
		[from addAreaPosition:-w y:0 z:0];	
	}else if ([type isEqual:@"right"])
	{
		[from addAreaPosition:w y:0 z:0];
	}else if ([type isEqual:@"top"])
	{
		[from addAreaPosition:0  y:+h z:0];
	}else if ([type isEqual:@"tophigh"])
	{
		[from addAreaPosition:0  y:+h+h z:0];
	}else if ([type isEqual:@"bottom"])
	{
		[from addAreaPosition:0  y:-h z:0];
	}else if ([type isEqual:@"scaleout"])
	{
		[from mulScale:30 y:30 z:30];
	}else if ([type isEqual:@"scalein"])
	{
		[from mulScale:30 y:30 z:30];
	}else if ([type isEqual:@"swirlin"])
	{
		[from mulScale:30 y:30 z:30];
		[from addAreaRotation:0 y:0 z:720];
	}else if ([type isEqual:@"swirlout"])
	{
		[from mulScale:30 y:30 z:30];
		[from addAreaRotation:0 y:0 z:720];
	}
	
	if (away)
	{
		[mApp.anims createAnim:to end:from def:[mRefs objectAtIndex:no] 
                                 delay:delay steps:2 owner:nil repeat:1 hide:true];
	}else
	{
		[mApp.anims createAnim:from end:to def:[mRefs objectAtIndex:no] 
                                 delay:delay steps:2 owner:nil repeat:1 hide:false];
	}
    [to release];
    [from release];
		
}

-(void) addVisibleRef:(GameonModelRef*) ref
{
	if ([ref getVisible] )
	{
		if ( [mVisibleRefs indexOfObject:ref] == NSNotFound )
		{
            if ([mVisibleRefs count] == 0)
            {
                [self setVisible:true];
            }
			[mVisibleRefs addObject:ref];
		}

	}
}

-(void) remVisibleRef:(GameonModelRef*) ref
{
	if (![ref getVisible] )
	{
		if ( [mVisibleRefs indexOfObject:ref] != NSNotFound)
		{
			[mVisibleRefs removeObject:ref];
            if ([mVisibleRefs count] == 0)
            {
                [self setVisible:false];
            }    
		}
	}
}

-(bool) getVisible
{
	return mVisible;
}

-(void) setVisible:(bool) visible
{
	if (visible)
	{
		mVisible = true;
		if (mWorld != nil)
		{
			[mWorld setVisible:self];
		}
	}
	else
	{
		mVisible = false;
		if (mWorld != nil)
		{
			[mWorld remVisible:self];
		}
	}
}    

-(GameonModelRef*) ref:(int)no
{
	if (no < 0 || no >= [mRefs count])
	{
		return nil;
	}
	return [mRefs objectAtIndex:no];
}

	
-(int) findRef:(GameonModelRef*)ref
{
	return [mRefs indexOfObject:ref];
}

-(void) unsetWorld
{
	mWorld = nil;
}    

-(void) createAnim:(NSString*)type forId:(int)refid delay:(NSString*)delay data:(NSString*) data
{
	if (refid < 0 && refid >= [mRefs count])
	{
		return;
	}
	
	GameonModelRef* ref = [mRefs objectAtIndex:refid];
	[[mApp anims] animModelRef:type ref:ref delay:delay data:data];
	
}



-(void)setActive:(bool) active
{
	mActive = active;
}

@end
