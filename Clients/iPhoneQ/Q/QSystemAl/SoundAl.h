//
//  QSoundAl.h
//  ThePrimes
//
//  Created by damir kolobaric on 1/28/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface SoundAl : NSObject {

}

+(id) initSound: (NSString*) filename;
+(void) playSound:(id) fileid;
+(void) stopSound:(id) fileid;
+(void) closeSound:(id) fileid;
+(void) setVolume:(int) vol;

+(void) init;
+(void) deinit;


@end
