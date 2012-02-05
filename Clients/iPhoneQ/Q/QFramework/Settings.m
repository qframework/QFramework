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

#import "Settings.h"
#import "AreaIndexPair.h"
#import "ServerkoParse.h"
#import "GameonApp.h"


@implementation Settings


-(id) initWithApp:(GameonApp*) app
{
	if (self = [super init])
	{
		mParser = app.script;
		mPrefs = nil;
	}
    return self;
}




-(void) open
{
	if (mPrefs == nil)
	{
		mPrefs = [NSUserDefaults standardUserDefaults];
	}
}

-(void) save
{
    [mPrefs synchronize];
	mPrefs = nil;
}

-(void) writeInt:(NSString*)name value:(NSString*)value
{
    if (mPrefs != nil)
    {
        int intVal = [value intValue];
        [mPrefs setInteger:intVal forKey:name];
    }
}

-(void) writeStr:(NSString*)name value:(NSString*)value
{
    if (mPrefs != nil)
    {
        [mPrefs setObject:value forKey:name];
        //NSLog(@" write setting str %@ %@" , name, value);
    }
}

-(void) loadInt:(NSString*)name value:(NSString*)value
{
    
    if (mPrefs != nil && mParser != nil)
    {
        int intVal = [mPrefs integerForKey:name];
        NSString* script = [NSString stringWithFormat:@"%@=%d;", value, intVal];
        //NSLog(@" load setting int %@" , script);
        [mParser execScript:script];
    }
}

-(void) loadStr:(NSString*)name value:(NSString*)value
{
    
    if (mPrefs != nil && mParser != nil)
    {
        NSString* strVal = [mPrefs objectForKey:name];
        if (strVal == nil || [strVal length] == 0)
        {
		/*
            NSString* script = [NSString stringWithFormat:@"%@='';", value];        
            NSLog(@" setting %@" , script);
            [mParser execScript:script];                    
            return;
		*/
			return;
        }
        NSString* script = [NSString stringWithFormat:@"%@='%@';", value, strVal];        
        //NSLog(@" load setting str %@" , script);
        [mParser execScript:script];        
    }
}

-(void) loadArray:(NSString*)name value:(NSString*)value
{
    
    if (mPrefs != nil && mParser != nil)
    {
        NSString* strVal = [mPrefs objectForKey:name];
//        NSLog(@" setting %@" , name);
        
        if (strVal == nil || [strVal length] == 0)
        {
            return;
        }
        NSString* script = [NSString stringWithFormat:@"%@=eval([%@]);", value, strVal];        
        //NSLog(@" load setting arr %@" , script);
        [mParser execScript:script];        
    }
}

@end
