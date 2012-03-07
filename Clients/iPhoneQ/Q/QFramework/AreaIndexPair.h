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


@interface AreaIndexPair : NSObject {

	NSString*     mArea;
	int                 mIndex;
	NSString*     mOnclick;
	NSString*     mOnFocusLost;
	NSString*     mOnFocusGain;
	float               mDist;
	int                 mIntData;    
	float*               mLoc;
}


@property (nonatomic, assign) NSString*     mArea;
@property (nonatomic, assign) NSString*     mOnclick;
@property (nonatomic, assign) NSString*     mOnFocusLost;
@property (nonatomic, assign) NSString*     mOnFocusGain;
@property (nonatomic, assign) int                  mIndex;
@property (nonatomic, assign) float                mDist;
@property (nonatomic, assign) int                  mIntData;
@property (nonatomic, assign) float*               mLoc;


@end
