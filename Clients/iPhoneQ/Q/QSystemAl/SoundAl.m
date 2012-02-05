//
//  QSoundAl.m
//  ThePrimes
//
//  Created by damir kolobaric on 1/28/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "SoundAl.h"
//#import "Finch.h"
//#import "Sound.h"
#import <AVFoundation/AVAudioPlayer.h>
#import <AVFoundation/AVFoundation.h>

//Finch* gFinch = nil;
float mVolume = 0.50;

@implementation SoundAl

+(void) init
{
    //gFinch = [[Finch alloc] init];
}

+(void) deinit
{
    //[gFinch release];
}

+(id) initSound: (NSString*) filename
{
    NSString* textPath  = [[NSBundle mainBundle] resourcePath];
    NSString* fullPath = [textPath stringByReplacingOccurrencesOfString:@"/" withString:@"//"];    
    NSArray* fnames = [filename componentsSeparatedByString:@"/"];
    NSString* fname = [fnames objectAtIndex: [fnames count]-1];
    
    NSString* filepath = [NSString stringWithFormat:@"%@//%@.%@", fullPath , fname, @"caf"];
    
    NSURL* url = [NSURL fileURLWithPath:filepath];
    
    //Sound* sound = [[Sound alloc] initWithFile:url];
    
    //return sound;
    AVAudioPlayer* player =[[AVAudioPlayer alloc] initWithContentsOfURL:url error:NULL];
    [player prepareToPlay];    
    //    return nil;
    return player;
}

+(void) playSound:(id) fileid
{
    /*
    Sound* sound = (Sound*)fileid; 
    [sound setGain:mVolume];
    [sound play];
     */
    AVAudioPlayer* val = (AVAudioPlayer*)fileid;
    val.volume = (float)mVolume;
    if (val == nil )
    {
        return;
    }
    [val play];
        
    
}

+(void) stopSound:(id) fileid
{
    AVAudioPlayer* val = (AVAudioPlayer*)fileid;    
    [val stop];
//    Sound* sound = (Sound*)fileid;
//    [sound stop];
}

+(void) closeSound:(id) fileid
{
    AVAudioPlayer* val = (AVAudioPlayer*)fileid;
    [val release];
 //   Sound* sound = (Sound*)fileid;
 //   [sound release];
}

+(void) setVolume:(int) vol
{
    mVolume = (float)vol / 100.0;
}

@end
