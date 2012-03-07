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

#import "ServerkoJS.h"

@implementation ServerkoJS


@synthesize mDelegate;

- (id)initWithDelegate:(id<ServerkoJSDelegate>)delegate
{
    if (self = [super init]) {
        mDelegate = delegate;
        mParsedScripts = [[NSMutableArray alloc] init];
        mJSONParser = [[SBJsonParser alloc] init];
    }
    
    self.delegate = self;
    return self;
}

- (void) dealloc 
{
    [mParsedScripts release];
    [mJSONParser release];
    [super dealloc];
}

- (void) readJavascriptLogger
{
    NSString *msg = NULL;
    while( (msg = [self stringByEvaluatingJavaScriptFromString:@"console.shift();"]) != NULL && [msg length] != 0)
    {
        NSLog(@"JSCONSOLE: %@", msg);
    }
    [self performSelector:@selector(readJavascriptLogger) withObject:nil afterDelay:0.1];
}

- (void) loadFramework {
    [self loadScript:@"serverkobridge.js"];
    [self loadScript:@"room.js"];
    [self loadScript:@"layout.js"];
    [self loadScript:@"social.js"];    
    [self loadScript:@"colors.js"];    
    [self loadScript:@"qframework.js"];    
}

- (void) runLoggers {
    [self readJavascriptLogger];
    [self showData];

}

/*
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType 
{
    NSString* strurldec = [[request URL] absoluteString];
    NSString *strurl = [strurldec
                          stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    //NSLog(@"Javascript exec url: %@" , strurl);

    NSString* type = [strurl substringToIndex:3];
    NSString* data = [strurl substringFromIndex:4];
    
    if ([type isEqual:@"evt"]) 
    {
    
        NSArray* strcommand = [data componentsSeparatedByString:@"="];

        if ([strcommand count] < 2)
            return NO;
        NSString* strdelay = [strcommand objectAtIndex:0];
        NSString* strscript = [strcommand objectAtIndex:1];
        
        double delay = [strdelay floatValue] * 0.001;
        
        SEL aSelector = @selector(execScript:);
        NSMethodSignature *aSignature = [[self class] instanceMethodSignatureForSelector:aSelector];
        NSInvocation *anInvocation = [NSInvocation invocationWithMethodSignature:aSignature];
        [anInvocation setSelector:aSelector];
        [anInvocation setTarget:self];
        [anInvocation setArgument:&strscript atIndex:2];
        [anInvocation retainArguments];
        
        [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval)delay invocation:anInvocation repeats:FALSE];
    }
    return NO;
}

- (void) execEvent:(NSString*) eventStr;
{
    
    NSString* strurl = eventStr;
    
    NSArray* strparams = [strurl componentsSeparatedByString:@"?"];
    if ([strparams count] < 2)
        return;
    NSString* str0 = [strparams objectAtIndex:0]; 
    NSString* str1 = [strparams objectAtIndex:1];
    
    if ( [str0 isEqual:@"http://include"])
    {
        [self parse:str1];
        return;
    }else if ( [str0 isEqual:@"http://load"])
    {
        [self loadScript:str1];
        return;
    }

    
    NSArray* strcommand = [str1 componentsSeparatedByString:@"="];
    
    if ([strcommand count] < 2)
        return;
    NSString* strdelay = [strcommand objectAtIndex:0];
    NSString* strscript = [strcommand objectAtIndex:1];
    
    double delay = [strdelay floatValue] * 0.001;
    if (delay < 0.000001)
    {
        [self execScript:strscript];
        return;
    }
    //[self performSelector:@selector(execScript:) withObject:strscript afterDelay:delay];
    
    
    SEL aSelector = @selector(execScript:);
    NSMethodSignature *aSignature = [[self class] instanceMethodSignatureForSelector:aSelector];
    NSInvocation *anInvocation = [NSInvocation invocationWithMethodSignature:aSignature];
    [anInvocation setSelector:aSelector];
    [anInvocation setTarget:self];
    [anInvocation setArgument:&strscript atIndex:2];
    [anInvocation retainArguments];
    
    [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval)delay invocation:anInvocation repeats:FALSE];
    
    return;
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error
{
    NSLog(@"Javascript errrorr log: ");
}
*/
- (void) parse:(NSString*) file
{
    // load bridge
    if ( [mParsedScripts indexOfObject:file] == NSNotFound)
    {
        [mParsedScripts addObject:file];
        [self loadScript:file];
    }
    // load 
}


- (void) loadScript:(NSString*) scriptname
{
    NSString* scriptPath  = [[NSBundle mainBundle] resourcePath];
    scriptPath = [scriptPath stringByReplacingOccurrencesOfString:@"/" withString:@"//"];

    NSArray* fnames = [scriptname componentsSeparatedByString:@"/"];
    NSString* sname = [fnames objectAtIndex: [fnames count]-1];
    
    NSString* filepath = [NSString stringWithFormat:@"%@//%@", scriptPath , sname];
    
    //NSLog(@"exec script %@", scriptname);
    NSString* script = [NSString stringWithContentsOfFile:filepath encoding:NSUTF8StringEncoding error:nil];
    
    NSString* trycatch = [NSString stringWithFormat:@"try{%@} catch (error){ console.error( \"error,%@: \" + error.toString() ); for (var i in error) console.error(i + ' = ' + error[i]);}", script, scriptname];    
    
    NSString* res = [self stringByEvaluatingJavaScriptFromString:trycatch];
    
    //NSLog ( @" script result %@ %@", scriptname, res);
    if (res == nil)
    {
        NSLog(@" error in  %@", scriptname);
    }
}



- (void) execScript:(NSString*) script
{
    //NSLog(@" SC %@", script);
    NSString* trycatch = [NSString stringWithFormat:@"try{%@} catch (error){ console.error( \"error,%@: \" + error.toString() ); for (var i in error) console.error(i + ' = ' + error[i]);}", script, @""];
    NSString* res = [self stringByEvaluatingJavaScriptFromString:trycatch];
    if (res == nil)
    {
        NSLog(@" error in  %@", script);
    }    
}


- (void) showData {
    
    NSString *msg = NULL;
    NSString* trycatch = [NSString stringWithFormat:@"try{%@} catch (error){ console.error( \"error,%@: \" + error.toString() );}", @"Q.serverko.getData();", @"Q.serverko.getdata();"];

    NSMutableArray* data = [[NSMutableArray alloc]init];
    
    while( (msg = [self stringByEvaluatingJavaScriptFromString:trycatch]) != NULL && [msg length] != 0)
    {

//        if ([mDelegate respondsToSelector:@selector(serverkoJS:onEvent:)]) {
            id result = [mJSONParser objectWithString:msg];
            //NSLog(@"Data: %@", msg);
            if (result != nil)
            {
                [data addObject:result];
            }else {
                NSLog(@"Data: %@", msg);
            }
//        }        
    }

    [mDelegate serverkoJS:self onEvent:data];
    [data release];
    
    [self performSelector:@selector(showData) withObject:nil afterDelay:0.05];
    
    
}


- (void)stopScript
{

}

- (void) onJSONData:(NSString*) jsondata
{
    
//    if ([mDelegate respondsToSelector:@selector(serverkoJS:onEvent:)]) {
        NSMutableArray* data = [[NSMutableArray alloc]init];
        id result = [mJSONParser objectWithString:jsondata];
        //NSLog(@"Data: %@", jsondata);
        if (result != nil)
        {
            [data addObject:result];
	        [mDelegate serverkoJS:self onEvent:data];
        }else {
            NSLog(@"Data: %@", jsondata);
        }
        [data release];
        
//    }        


}

@end
