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
#import <OpenGLES/ES1/gl.h>
#import <OpenGLES/ES1/glext.h>

@class GameonApp;

typedef enum  {
    TFT_DEFAULT,
    TFT_FONT
} TextureFactoryType;

@interface TextureFactory : NSObject {

	int mTextureDefault;
	bool mUpdated;
	NSMutableDictionary* mTextures;
    NSMutableArray* mToDelete;
	float mU1;
	float mV1;
	float mU2;
	float mV2;
	float mCp;
    
}

@property (nonatomic, readonly) float mU1;
@property (nonatomic, readonly) float mV1;
@property (nonatomic, readonly) float mU2;
@property (nonatomic, readonly) float mV2;
@property (nonatomic, readonly) float mCp;
@property (nonatomic, readonly) int mTextureDefault;

-(id) initWithApp:(GameonApp*) app;
-(int) get:(TextureFactoryType) type;
-(int) getTexture:(NSString*) strData;
-(void)newTexture:(NSString*)textname file:(NSString*)textfile;
-(bool)isUpdated;
-(void)resetUpdate;
-(void)setParam:(float)u1 v1:(float)v1 u2:(float)u2 v2:(float)v2 p:(float)cp;
-(void)initTextures:(NSMutableDictionary*)response;
-(void)flushTextures;
-(void)deleteTexture:(NSString*)textname;

@end
