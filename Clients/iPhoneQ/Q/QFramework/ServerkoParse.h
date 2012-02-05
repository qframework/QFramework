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

#import "ServerkoJS.h"

@class GameonApp;
@class AsyncSocket;

@interface ServerkoParse : NSObject 
    < ServerkoJSDelegate >{
    
    ServerkoJS* mJSServerko;
    GameonApp*  mApp;
    bool        mActive;
    NSString*   mUsername;

    AsyncSocket *mAsyncSocket;        
    NSString*       mCallbackScript;
    NSString*       mCallbackScriptJoin;        
    NSString*       mRoomId;      
    NSString*       mServerAddr;
    int       mServerPort;        
    bool        mInConnect;
	bool    mConnected;
	bool    mInRoom;
	bool    mWaitingForContent;
	bool mWaitingForJoin;

}

- (void) execScript:(NSString*) script;

-(void) sendUserData:(NSString*) datastr onclick:(NSString*)click;


- (void)serverkoJS:(ServerkoJS*)serverkoJS onEvent:(NSMutableArray*)response;

- (void)serverkoJS:(ServerkoJS*)serverkoJS onLayout:(NSMutableArray*)response;

- (void)setApp:(GameonApp*) app;


-(void) execScript:(int)time script:(NSString*)respdata;
-(void)loadModule:(NSString*)file;
-(void)loadModule2:(NSString*)file;

-(void)connect:(NSString*)serverip callback:(NSString*)script;

-(void)join:(NSString*)room user:(NSString*)userid callback:(NSString*)script;

-(NSMutableString*) getJoinReq:(NSString*)room user:(NSString*)userid;
-(NSMutableString*) getDataReq:(NSString*)data;

-(void)send:(NSString*)data;
-(void)disconnect;

+(int) parseIntArray:(int*)array max:(int)max forData:(NSString*) data;
+(int) parseFloatArray:(float*)array max:(int)max forData:(NSString*) data;
-(void)loadScript:(NSString*)file delay:(int)delay;
-(void)start;
@end
