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

#import "GLColor.h"


@implementation GLColor


@synthesize red;
@synthesize green;
@synthesize blue;
@synthesize alpha;


- (id) initWithRGBA:(int)ared g:(int)agreen b:(int)ablue a:(int)aalpha
{
	if (self = [super init])
	{
        red = ared;
        green = agreen;
        blue = ablue;
        alpha = aalpha;
    }
    return self;

}

- (id) initWithRGBA:(int)rgba
{
	if (self = [super init])
	{
        red = (rgba >> 16 & 0xff);// * (0x10000/0xff);
        green = (rgba >> 8 & 0xff);// * (0x10000/0xff);
        blue = (rgba  & 0xff);// * (0x10000/0xff);
        alpha = (rgba >> 24 & 0xff);
        
    }
    return self;

}

- (id) initWithRGBA:(int)ared g:(int)agreen b:(int)ablue
{
	if (self = [super init])
	{
        red = ared;
        green = agreen;
        blue = ablue;
        alpha = 255;
        
    }
    return self;

}

- (bool) equals:(GLColor*)color 
{
    return (red == color.red &&
            green == color.green &&
            blue == color.blue &&
            alpha == color.alpha);
    
}


@end

