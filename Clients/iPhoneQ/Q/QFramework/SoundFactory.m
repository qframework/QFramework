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

#import "SoundFactory.h"
#import <AVFoundation/AVAudioPlayer.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioServices.h>
#import "SoundAl.h"

@implementation SoundFactory


- (id)initWithApp:(GameonApp*) app;
{
    self = [super init];
    
    if (self) {
        [SoundAl init];
        mSoundPoolMap = [[NSMutableDictionary alloc] init];
        mVolume = 50;
        mMute = 0;
		mApp = app;
    }
	
    return  self;
}


- (void)dealloc
{
    
    [mSoundPoolMap release];
    [SoundAl deinit];
    [super dealloc];
}

-(void) playSound:(NSString*) sound { 
    if (mMute)
    {
        return;
    }
      if (mSoundPoolMap != nil) 
      {
          
          
          id val = [mSoundPoolMap objectForKey:sound];
          if (val != nil)
          {
              [SoundAl playSound:val];
//          val.volume = (float)mVolume / 100;
          }
      }
}

-(void) setVolume:(int) vol
{
    mVolume = vol;
    [SoundAl setVolume:mVolume];
}
-(void) mute:(int)val
{
    mMute = val;
}

         
-(void) stop
{
    if (mLastStream > 0)
    {
     //mSoundPool.stop(mLastStream);
        mLastStream = 0;
    }
}         

-(void) newSound:(NSString *)name file:(NSString*)file
{
    id soundid = [SoundAl initSound:file];
    if (soundid != nil)
    {
        [mSoundPoolMap setObject:soundid forKey:name];
    }
}

 @end
