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

#import "AreaIndexPair.h"


@implementation AreaIndexPair

@synthesize     mArea;
@synthesize     mOnclick;
@synthesize     mOnFocusLost;
@synthesize     mOnFocusGain;
@synthesize     mIndex;
@synthesize     mDist;
@synthesize     mIntData;
@synthesize     mLoc;

- (id)init
{
    self = [super init];
    
    if (self) {
		mLoc = (float*)malloc( 3 * sizeof(float));
		mLoc[0] = 0;
		mLoc[1] = 0;
		mLoc[2] = 0;
		
	}
    return self;
}

-(void) dealloc 
{
	free(mLoc);
    [super dealloc];
}

@end
