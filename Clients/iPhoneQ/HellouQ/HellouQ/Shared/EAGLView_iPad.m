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
#import "EAGLView_iPad.h"

#import "ES1Renderer.h"
#import "ES2Renderer.h"
#import "GameonWorldView.h"
#import "GameonWorld.h"
#import "GameonApp.h"
#import "TextInput.h"

@implementation EAGLView_iPad

@synthesize animating;
@dynamic animationFrameInterval;

// You must implement this method
+ (Class)layerClass
{
    return [CAEAGLLayer class];
}


//The EAGL view is stored in the nib file. When it's unarchived it's sent -initWithCoder:
- (id)initWithCoder:(NSCoder*)coder
{    
    if ((self = [super initWithCoder:coder]))
    {
        // Get the layer
        CAEAGLLayer *eaglLayer = (CAEAGLLayer *)self.layer;

        if ([self respondsToSelector:@selector(setContentScaleFactor:)])
        {
            self.contentScaleFactor = [[UIScreen mainScreen] scale];
        }        
        /*
        CGSize frameSize = self.frame.size;
        if ([self respondsToSelector:@selector(setContentScaleFactor:)])
        {
            frameSize.width *= self.contentScaleFactor;
            frameSize.height *= self.contentScaleFactor;
        }*/
        
        eaglLayer.opaque = TRUE;
        eaglLayer.drawableProperties = [NSDictionary dictionaryWithObjectsAndKeys:
                                        [NSNumber numberWithBool:FALSE], kEAGLDrawablePropertyRetainedBacking, kEAGLColorFormatRGBA8, kEAGLDrawablePropertyColorFormat, nil];

        //renderer = [[ES2Renderer alloc] init];

        if (!renderer)
        {
            renderer = [[ES1Renderer alloc] init];

            if (!renderer)
            {
                [self release];
                return nil;
            }
        }

        animating = FALSE;
        displayLinkSupported = FALSE;
        animationFrameInterval = 2;
        displayLink = nil;
        animationTimer = nil;

        // A system version of 3.1 or greater is required to use CADisplayLink. The NSTimer
        // class is used as fallback when it isn't available.
        NSString *reqSysVer = @"3.1";
        NSString *currSysVer = [[UIDevice currentDevice] systemVersion];
        if ([currSysVer compare:reqSysVer options:NSNumericSearch] != NSOrderedAscending)
            displayLinkSupported = TRUE;
        
        
        mTextInputA = [[UITextField alloc] initWithFrame: CGRectMake(10, 10, [UIScreen mainScreen].bounds.size.width, 50)];
        mTextInputA.autocorrectionType = UITextAutocorrectionTypeNo;
        mTextInputA.autocapitalizationType = UITextAutocapitalizationTypeNone;
        mTextInputA.delegate = self;
        mTextInputA.hidden = YES;
        [self addSubview:mTextInputA];

        
        
        [self initWorld];
    }

    return self;
}

- (void)drawView:(id)sender
{
    //[renderer render];
    if ([mGameonApp hasData])
    {
        [renderer render:mGameonApp];
        //NSLog(@"  rendering ");        
    }else
    {
        //NSLog(@" not rendering ");
    }
}

- (void)layoutSubviews
{
    [renderer resizeFromLayer:(CAEAGLLayer*)self.layer];
    [self drawView:nil];
}

- (NSInteger)animationFrameInterval
{
    return animationFrameInterval;
}

- (void)setAnimationFrameInterval:(NSInteger)frameInterval
{
    // Frame interval defines how many display frames must pass between each time the
    // display link fires. The display link will only fire 30 times a second when the
    // frame internal is two on a display that refreshes 60 times a second. The default
    // frame interval setting of one will fire 60 times a second when the display refreshes
    // at 60 times a second. A frame interval setting of less than one results in undefined
    // behavior.
    if (frameInterval >= 1)
    {
        animationFrameInterval = frameInterval;

        if (animating)
        {
            [self stopAnimation];
            [self startAnimation];
        }
    }
}

- (void)startAnimation
{
    if (!animating)
    {
        if (displayLinkSupported)
        {
            // CADisplayLink is API new to iPhone SDK 3.1. Compiling against earlier versions will result in a warning, but can be dismissed
            // if the system version runtime check for CADisplayLink exists in -initWithCoder:. The runtime check ensures this code will
            // not be called in system versions earlier than 3.1.

            displayLink = [NSClassFromString(@"CADisplayLink") displayLinkWithTarget:self selector:@selector(drawView:)];
            [displayLink setFrameInterval:animationFrameInterval];
            [displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
        }
        else
            animationTimer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval)((2.0 / 60.0) * animationFrameInterval) target:self selector:@selector(drawView:) userInfo:nil repeats:TRUE];

        animating = TRUE;
    }
}

- (void)stopAnimation
{
    if (animating)
    {
        if (displayLinkSupported)
        {
            [displayLink invalidate];
            displayLink = nil;
        }
        else
        {
            [animationTimer invalidate];
            animationTimer = nil;
        }

        animating = FALSE;
    }
}

- (void)dealloc
{
    [renderer release];

    [super dealloc];
}



- (void) initWorld
{
    mGameonApp = [[GameonApp alloc] init];
    [mGameonApp setInputTextSelector:self];
    
    CGRect bounds = self.bounds;
    int width = bounds.size.width;
    int height = bounds.size.height;
    if ([self respondsToSelector:@selector(setContentScaleFactor:)])
    {
        width *= self.contentScaleFactor;
        height *= self.contentScaleFactor;
        
    }
    
    NSString* preexec = [NSString stringWithFormat:@"CanvasW = %d;CanvasH = %d;" , 
                         width ,height];                            
    
    //[mGameonApp setSplashSize:-1.3 y1:-1.3 x2:1.3 y2:1.3];    
    //[mGameonApp setSplash:@"font.png" delay:3000];
    [mGameonApp start:@"main.js" preexec:preexec];
    
    
}

// Handles the end of a touch event.
-(void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    // Enumerates through all touch object
    for (UITouch *touch in touches) {
        CGPoint	location;
        location = [touch locationInView:self];
        if ([self respondsToSelector:@selector(setContentScaleFactor:)])
        {
            [mGameonApp performClick:location.x*self.contentScaleFactor y:location.y*self.contentScaleFactor];
            
        }else {
            [mGameonApp performClick:location.x y:location.y];
        }
        
        
        return;
    }
    
}

-(void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    
    // Enumerates through all touch object
    for (UITouch *touch in touches) {
        CGPoint	location;
        location = [touch locationInView:self];
        if ([self respondsToSelector:@selector(setContentScaleFactor:)])
        {
            [mGameonApp mouseDragged:location.x*self.contentScaleFactor y:location.y*self.contentScaleFactor];
            
        }else {
            [mGameonApp mouseDragged:location.x y:location.y];
        }
    }
    
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    for (UITouch *touch in touches) {
        CGPoint	location;
        location = [touch locationInView:self];
        if ([self respondsToSelector:@selector(setContentScaleFactor:)])
        {
            [mGameonApp onFocusProbe:location.x*self.contentScaleFactor y:location.y*self.contentScaleFactor];

        }else {
            [mGameonApp onFocusProbe:location.x y:location.y];
        }

                
        return;
    }
    
}

- (GameonApp*)  getApp
{
    return mGameonApp;
}


- (BOOL)textFieldShouldReturn:(UITextField *)text {
    [mGameonApp onTextInputEnd:text.text finish:true];
    [[NSNotificationCenter defaultCenter] removeObserver:self  name:UITextFieldTextDidChangeNotification object:nil];    
    [text resignFirstResponder];
    //[mDelegate performSelector:@selector(onTextInputEnd:) withObject:textField.text afterDelay:0.01];
    return YES;
}
-(void)textDidChange:(id) sender {
    // whatever you wanted to do
//    if (sender == mTextInputA)
    {
        //NSLog(@" %@ ", mTextInputA.text);
            [mGameonApp onTextInputEnd:mTextInputA.text finish:false];
    }
}

-(void) onTextInput:(NSString*)deftext
{
    [mTextInputA setText:deftext];
    //    mTextInput.hidden = NO;
    [mTextInputA becomeFirstResponder];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(textDidChange:) name:UITextFieldTextDidChangeNotification object:nil];
    
    /*
    mTextInput = [TextInput alloc];
    [mTextInput initWithTitle:title message:@"Name" delegate:self kButtonTitle:@"Ok" kText:deftext];    
    [mTextInput show];
     */
}

- (void)onTextInputEnd:(NSString*)text {
    [mGameonApp onTextInputEnd:text finish:false];
    [mTextInput release];
}
- (void)setController:(EAGLController*) controller
{
    mController = controller;
//    [mGameonApp setController:controller];
}


@end
