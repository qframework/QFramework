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
*/

#import <Foundation/Foundation.h>
#import "GLColor.h"


@interface ColorFactory : NSObject {

    GLColor* red;
    GLColor* green;
    GLColor* blue;
    GLColor* yellow;
    GLColor* redL;
    GLColor* greenL;
    GLColor* blueL;
    GLColor* yellowL;
    GLColor* orange;
    GLColor* white;    
    GLColor* gray; 
    GLColor* grayL;     
    GLColor* black;
    GLColor* transparent;
    GLColor* magnenta;
    GLColor* magnentaL;    
    GLColor* brown;
    GLColor* brownL;    
}

- (id)init;		

@property (nonatomic, readonly) GLColor* red;
@property (nonatomic, readonly) GLColor* green;
@property (nonatomic, readonly) GLColor* blue;
@property (nonatomic, readonly) GLColor* yellow;
@property (nonatomic, readonly) GLColor* redL;
@property (nonatomic, readonly) GLColor* greenL;
@property (nonatomic, readonly) GLColor* blueL;
@property (nonatomic, readonly) GLColor* yellowL;
@property (nonatomic, readonly) GLColor* orange;
@property (nonatomic, readonly) GLColor* white;    
@property (nonatomic, readonly) GLColor* gray;    
@property (nonatomic, readonly) GLColor* grayL;    
@property (nonatomic, readonly) GLColor* black;
@property (nonatomic, readonly) GLColor* transparent;
@property (nonatomic, readonly) GLColor* magnenta;
@property (nonatomic, readonly) GLColor* magnentaL;
@property (nonatomic, readonly) GLColor* brown;
@property (nonatomic, readonly) GLColor* brownL;

-(GLColor*)getPlayerColor:(int) player;
-(GLColor*)getPlayerColorFore:(int) player;
-(GLColor*)getColor:(NSString*)value;
-(GLColor*)getColorId:(int) color;

@end

