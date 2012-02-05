//
//  ESRenderer.h
//  Test3
//
//  Created by damir kolobaric on 11/21/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <QuartzCore/QuartzCore.h>

#import <OpenGLES/EAGL.h>
#import <OpenGLES/EAGLDrawable.h>

@class GameonApp;

@protocol ESRenderer <NSObject>


- (void)render:(GameonApp*) view;
- (BOOL)resizeFromLayer:(CAEAGLLayer *)layer;

- (int) getWidth;
- (int) getHeight;

@end
