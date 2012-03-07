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

#import "TextureFactory.h"


@implementation TextureFactory

@synthesize mU1;
@synthesize mV1;
@synthesize mU2;
@synthesize mV2;
@synthesize mCp;
@synthesize mTextureDefault;

//static bool mInitialized = false;

- (id)initWithApp:(GameonApp*) app;
{
    self = [super init];
    
    if (self) {
		mTextureDefault = 1;
		mUpdated = false;
		mTextures = [[NSMutableDictionary alloc] init];   
        mToDelete = [[NSMutableArray alloc] init];
		[self newTexture:@"white" file:@"whitesys.png"];
		[self newTexture:@"font" file:@"fontsys.png"];
		mU1 = 0.01;
		mV1 = 0.01;
		mU2 = 0.01;
		mV2 = 0.01;
		mCp = 0.00;
	
    }
	
    return  self;
}

- (void) dealloc 
{
    [mToDelete release];
    [mTextures release];
    [super dealloc];  
}

-(int) loadTexture:(NSString*)textname
{
    
    GLuint textures[1];
    glGenTextures(1, &textures[0]);
    
    int textureid = textures[0];
    glBindTexture(GL_TEXTURE_2D, textureid);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    
    glTexEnvf(GL_TEXTURE_ENV, GL_TEXTURE_ENV_MODE,GL_MODULATE);
    
    NSString* textPath  = [[NSBundle mainBundle] resourcePath];
    textPath = [textPath stringByReplacingOccurrencesOfString:@"/" withString:@"//"];
    mUpdated = true;
    NSArray* fnames = [textname componentsSeparatedByString:@"/"];
    NSString* tname = [fnames objectAtIndex: [fnames count]-1];
    
    NSString* filepath = [NSString stringWithFormat:@"%@//%@", textPath , tname];
    NSData *texData = [[NSData alloc] initWithContentsOfFile:filepath];
    UIImage *image = [[UIImage alloc] initWithData:texData];
    if (image == nil)
    {
        NSLog(@"Failed to load texture %@ " , textname);
        return -1;
    }
    GLuint width = CGImageGetWidth(image.CGImage);
    GLuint height = CGImageGetHeight(image.CGImage);
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    void *imageData = malloc( height * width * 4 );
    CGContextRef context = CGBitmapContextCreate( imageData, width, height, 8, 4 * width, colorSpace, kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big );
    CGColorSpaceRelease( colorSpace );
    CGContextClearRect( context, CGRectMake( 0, 0, width, height ) );
    CGContextTranslateCTM( context, 0, height - height );
    CGContextDrawImage( context, CGRectMake( 0, 0, width, height ), image.CGImage );
    
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, imageData);
    
    CGContextRelease(context);
    
    free(imageData);
    [image release];
    [texData release];
    
    return textureid;
    
}

-(int) getTexture:(NSString*) strData {
    NSNumber* num = [mTextures objectForKey:strData];
    if (num != nil)
    {
        return [num intValue];
    }
    
    return mTextureDefault;
}

-(int) get:(TextureFactoryType) type {
    
    switch (type) {
        case TFT_DEFAULT: return [self getTexture:@"white"];
        case TFT_FONT: return [self getTexture:@"font"];
    }
    return mTextureDefault;
}



-(void)deleteTexture:(NSString*)textname
{
	[mToDelete addObject:textname];
}


-(void)clearTexture:(NSString*)textname
{
	if ([mTextures objectForKey:textname])
	{
		NSNumber* num= [mTextures objectForKey:textname];
        GLuint ids[1];
		ids[0] = [num intValue];
		glDeleteTextures(1 , ids);
		[mTextures removeObjectForKey:textname];
		
	}
	
}

-(void)flushTextures
{
	for (int a=0; a< [mToDelete count]; a++)
	{
		[self clearTexture:[mToDelete objectAtIndex:a]];
	}
	
	[mToDelete removeAllObjects];
}


-(void)newTexture:(NSString*)textname file:(NSString*)textfile
{
    int tid = [self loadTexture:textfile];
    if (tid > 0)
    {
        [mTextures setObject:[NSNumber numberWithInt:tid] forKey:textname];        
    }
    
}

-(bool)isUpdated
{
    return mUpdated;
}

-(void)resetUpdate
{
    mUpdated = false;
}

-(void)setParam:(float)u1 v1:(float)v1 u2:(float)u2 v2:(float)v2 p:(float)cp
{
	mU1 = u1;
	mV1 = v1;
	mU2 = u2;
	mV2 = v2;
	mCp = cp;

}


-(void)processTexture:(NSMutableDictionary*)objData
{
	NSString* name = [objData valueForKey:@"name"];
	NSString* file = [objData valueForKey:@"file"];
        
    if (name != nil && [name length] > 0 && file != nil && [file length] > 0)
    {
        [self newTexture:name file:file];
    }
}

-(void)initTextures:(NSMutableDictionary*)response
{
    NSMutableArray* textures = [response valueForKey:@"texture"];
    
    for (int a=0; a< [textures count]; a++)
    {
		NSMutableDictionary* pCurr = [textures objectAtIndex:a];
		[self processTexture:pCurr];        
	}	
}


@end

