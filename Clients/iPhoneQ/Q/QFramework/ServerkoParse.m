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

#import "ServerkoParse.h"
#import "GameonApp.h"
#import "AsyncSocket.h"
#import "JSON.h"

@implementation ServerkoParse



- (id)init
{
    self = [super init];
    
    if (self) {
        
        mJSServerko =  [[ServerkoJS alloc ] initWithDelegate:self];
        mActive = false;
        mAsyncSocket = nil;
        mCallbackScript = nil;
        mInConnect = false;
        
        mConnected = false;
        mInRoom  = false;  
        mWaitingForContent = false;
        mWaitingForJoin = false;
        mUsername = @"luser";
    }
    
    return self;
}



-(void) dealloc 
{
    [mJSServerko release];
    [mRoomId release];    
    [self disconnect];
    [super dealloc];
}


-(void) sendUserData:(NSString*) datastr onclick:(NSString*)click {
    if (!mActive)
    {
        return;
    }
    
    if ([click hasPrefix:@"js:"])
    {
        NSString* script = [click substringFromIndex:3];
        [mJSServerko execScript:script];        
    }else {
        NSMutableString* userdata = [[[NSMutableString alloc] init] autorelease];
        [userdata appendFormat:@"Q.handlers.script_userData('%@', '%@');",mUsername,datastr];
        [mJSServerko execScript:userdata];
        
    }
}	 


- (void) execScript:(NSString*) script
{
    [mJSServerko execScript:script];
}

- (void)serverkoJS:(ServerkoJS*)serverkoJS onEvent:(NSMutableArray*)response {
    if (!mActive)
    {
        return;
    }    
    //[self output:response];
//    [mApp onData:response];
    [mApp queueResponses:response];
    //[ServerkoResponse releaseData:response];
    
}

- (void)serverkoJS:(ServerkoJS*)serverkoJS onLayout:(NSMutableArray*)response {
    if (!mActive)
    {
        return;
    }    
    //[self output:response];
//    [mApp onData:response];
    [mApp queueResponses:response];
    //[ServerkoResponse releaseData:response];
    
}

- (void)setApp:(GameonApp*) app
{
    mApp = app;
}


- (void)stopScript
{
    mActive = false;
    [NSObject cancelPreviousPerformRequestsWithTarget:mJSServerko ];
    [mJSServerko stopScript];
}


-(void) execScript:(int)time script:(NSString*)respdata
{

    double delay = (float)time * 0.001;
    
    if (delay < 1)
    {
        delay = 1;
    }
    
    [mJSServerko performSelector:@selector(execScript:) withObject:respdata afterDelay:delay];
    
    
    
}


-(void)loadScript:(NSString*)file delay:(int)scriptdelay
{
    double delay = (float)scriptdelay * 0.001;
    if (delay < 0.000001)
    {
        [mJSServerko performSelector:@selector(parse:) withObject:file];
        return;
    }
    
    [mJSServerko performSelector:@selector(parse:) withObject:file afterDelay:delay];
    
	
}


-(void)loadModule:(NSString*)file
{
//    [mJSServerko parse:file];
    [mJSServerko performSelector:@selector(parse:) withObject:file];
}

-(void)loadModule2:(NSString*)file
{
    [mJSServerko performSelector:@selector(loadScript:) withObject:file];
//    [mJSServerko mJSServerko:file];

}

-(void)initSocket
{
//	dispatch_queue_t mainQueue = dispatch_get_main_queue();	
	mAsyncSocket = [[AsyncSocket alloc] initWithDelegate:self];
    
}

- (void)onSocket:(AsyncSocket *)sock didConnectToHost:(NSString *)host port:(UInt16)port
{
    NSLog(@" connected ");
    mInConnect = false;
    if (mCallbackScript)
    {
        mConnected = true;
        NSMutableString* userdata = [[[NSMutableString alloc] init] autorelease];
        [userdata appendFormat:@"%@(1, '%@:%d');",mCallbackScript,host,port];
        [mJSServerko execScript:userdata];
        [mAsyncSocket readDataToData:[AsyncSocket CRLFCRLFData] withTimeout:-1 tag:0];
        
    }
}

- (void) sendJoin:(int) data
{
    if (mCallbackScriptJoin)
    {
        NSMutableString* userdata = [[[NSMutableString alloc] init] autorelease];
        [userdata appendFormat:@"%@(%d);",mCallbackScriptJoin,data];
        [mJSServerko execScript:userdata];
        
    }
        
}

- (void)onSocketDidDisconnect:(AsyncSocket *)sock
{
    mInConnect = false;
    if(mCallbackScript)
    {
        if (mConnected)
        {
            NSMutableString* userdata = [[[NSMutableString alloc] init] autorelease];
            [userdata appendFormat:@"%@(2);",mCallbackScript];
            [mJSServerko execScript:userdata];
            
        }else {
            NSMutableString* userdata = [[[NSMutableString alloc] init] autorelease];
            [userdata appendFormat:@"%@(0);",mCallbackScript];
            [mJSServerko execScript:userdata];
            
        }

        mConnected = false;
    }
    // start reading    
    
    
    NSLog(@" disconnected ");
}


-(void)connect:(NSString*)serverip callback:(NSString*)script
{
    if (mInConnect)
        return;
    
    if (mAsyncSocket == nil)
    {
        [self initSocket];
    }
    mCallbackScript = [[NSString alloc] initWithString:script];
    mInConnect = true;
    NSArray* tokens = [serverip componentsSeparatedByString:@":"];
    NSString* host = [tokens objectAtIndex:0];
    int port = [[tokens objectAtIndex:1] intValue];
    
	NSError *error = nil;
    if (![mAsyncSocket connectToHost:host onPort:port error:&error])
	{
		NSLog(@"Error connecting: %@", error);
        mInConnect = false;
        if (mCallbackScript)
        {
            NSMutableString* userdata = [[[NSMutableString alloc] init] autorelease];
            [userdata appendFormat:@"%@(0, '%@:%d');",mCallbackScript,host,port];
            [mJSServerko execScript:userdata];        
        }
	}
    
}

- (void)doSocketData:(NSString*)data
{
    if (mWaitingForContent)
    {
        [mJSServerko onJSONData:data];
        mWaitingForContent = false;
    }
    else {
        //analyze
        NSArray* tokens = [data componentsSeparatedByString:@"\r\n"];
        for (int a=0; a<[tokens count]; a++)
        {
            NSString* token = [tokens objectAtIndex:a];
            if ([token hasPrefix:@"HTTP/1.0 300"])
            {
                // multiple_choices 
                // user already exists
                [self sendJoin:-1];
                return;
            }
            else if ([token hasPrefix:@"HTTP/1.0 202"])
            {
                if (mWaitingForJoin)
                {
                    mWaitingForJoin = false;
                    [self sendJoin:1 ];
                }
            }            
            if ( [token hasPrefix:@"Content-length"] )
            {
                mWaitingForContent = true;
                return;
            }
        }
    }


}

- (void)onSocket:(AsyncSocket *)sock didReadData:(NSData *)data withTag:(long)tag
{
    NSString* strdata = [[NSString alloc] initWithBytes:[data bytes] length:[data length] encoding:NSUTF8StringEncoding];
    //NSLog(@"Received Data: %@", strdata);
    [self doSocketData:strdata];
    [strdata release];

    [mAsyncSocket readDataToData:[AsyncSocket CRLFCRLFData] withTimeout:-1 tag:0];
}


-(NSMutableString*) getJoinReq:(NSString*)room user:(NSString*)userid
{
    NSMutableString* strdata = [[NSMutableString alloc] initWithFormat:@"POST /10000/%@/%@ HTTP/1.1\r\n" , room, userid];    
    [strdata appendFormat:@"Host: www.100kas.com\r\n"];
    [strdata appendFormat:@"User-Agent: iosapp\r\n"];    
    [strdata appendFormat:@"\r\n"];
    return strdata;
}

-(NSMutableString*) getDataReq:(NSString*)data
{
    NSMutableString* strdata = [[NSMutableString alloc] initWithFormat:@"PUT /10000/%@/%@ HTTP/1.1\r\n" , mRoomId, mUsername];    
    [strdata appendFormat:@"Host: www.100kas.com\r\n"];
    [strdata appendFormat:@"User-Agent: iosapp\r\n"];        
    [strdata appendFormat:@"Data: %@\r\n", data];
    [strdata appendFormat:@"\r\n"];
    return strdata;
}

-(void)join:(NSString*)room user:(NSString*)userid callback:(NSString*)script
{

    mCallbackScriptJoin = [[NSString alloc] initWithString:script];
    NSLog(@" join room : %@ %@ %@" ,room, userid, script); 
    [mRoomId release];
    [mUsername release];
    
    mRoomId = [[NSString alloc] initWithString:room];
    mUsername = [[NSString alloc] initWithString:userid];    
    NSMutableString* req = [self getJoinReq:room user:userid]; 
    NSData *reqData = [req dataUsingEncoding:NSUTF8StringEncoding];
    mWaitingForJoin = true;

    [mAsyncSocket writeData:reqData withTimeout:1000 tag:0];
    [req release];
}

-(void)send:(NSString*)data
{
    
    NSMutableString* req = [self getDataReq:data ]; 
    NSData *reqData = [req dataUsingEncoding:NSUTF8StringEncoding];
    
    [mAsyncSocket writeData:reqData withTimeout:1000 tag:0];
    [req release];
}

-(void) disconnect
{
    if (mAsyncSocket == nil)
    {
        return;
    }
    [mAsyncSocket setDelegate:nil];
    [mAsyncSocket disconnect];
    [mAsyncSocket release];
    [mCallbackScript release];
    [mCallbackScriptJoin release];
    mCallbackScript = nil;
    mCallbackScriptJoin = nil;
    mAsyncSocket = nil;
    mInConnect = false;
    mConnected = false;
    mInRoom  = false;  
    mWaitingForContent = false;
    mWaitingForJoin = false;
    
}

+(int) parseFloatArray:(float*)array max:(int)max forData:(NSString*)data
{
	NSArray* tok = [data componentsSeparatedByString:@","];
	int count;
	for (count=0; count < [tok count] &&  count < max; count++)
	{
		array[count] = [[tok objectAtIndex:count ] floatValue];
	}
	
	return count;
}

+(int) parseIntArray:(int*)array max:(int)max forData:(NSString*) data
{
	NSArray* tok = [data componentsSeparatedByString:@","];
	int count;
	for (count=0; count < [tok count] &&  count < max; count++)
	{
		array[count] = [[tok objectAtIndex:count ] intValue];
	}
	
	return count;
}

-(void)start
{
    mActive = true;    
    [mJSServerko loadFramework];
    [mJSServerko runLoggers];

}
@end
