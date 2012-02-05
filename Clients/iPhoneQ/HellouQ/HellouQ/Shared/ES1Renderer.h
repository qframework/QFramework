//
//  ES1Renderer.h
//  Test3
//
//  Created by damir kolobaric on 11/21/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "ESRenderer.h"

#import <OpenGLES/ES1/gl.h>
#import <OpenGLES/ES1/glext.h>

@class  GameonApp;

@interface ES1Renderer : NSObject <ESRenderer>
{
@private
    EAGLContext *context;

    // The pixel dimensions of the CAEAGLLayer
    GLint backingWidth;
    GLint backingHeight;

    // The OpenGL ES names for the framebuffer and renderbuffer used to render to this view
    GLuint defaultFramebuffer, colorRenderbuffer;
    GLuint depthRenderbuffer;
    
}

- (void)render:(GameonApp*) view;
- (BOOL)resizeFromLayer:(CAEAGLLayer *)layer;

@end
