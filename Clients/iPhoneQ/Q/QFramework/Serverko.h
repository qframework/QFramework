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



@protocol ServerkoDelegate;

@interface Serverko : NSObject {
    id<ServerkoDelegate> mDelegate;

    NSURLConnection*      mConnection;
    NSMutableData*        mResponseText;
    NSString*          mCurrentAddress;
}

/**
 * The delegate.
 */
@property(nonatomic,assign) id<ServerkoDelegate> mDelegate;

- (id)initWithDelegate:(id<ServerkoDelegate>)delegate;

// requests

/**
 * Queries server 
 *
 */
- (BOOL)queryServer: (NSString* ) url;

/**
 * Logins user to server
 *
 */
- (void)login2Server:(NSString* )username  withPassword:(NSString*) password;

/**
 * Sends request to server
 *
 */
- (void)sendRequest;

/**
 * Joins user to server
 *
 */
- (void)joinServer:(NSString*)username withServer:(NSString*) serverID;

/**
 * Gets user data from server
 *
 */
- (void)getData:(NSString* )username;

/**
 * Joins user to script on server
 *
 */
- (void)joinScript:(NSString*)username withServer:(NSString*) serverID toScript:(NSString*)scriptID;


@end

// delegate
@protocol ServerkoDelegate <NSObject>

@optional


// delegates

- (void)serverko:(Serverko*)serverko onQueryServer:(id)response;

- (void)serverko:(Serverko*)serverko onLogin2Server:(id)response; 

- (void)serverko:(Serverko*)serverko onSendRequest:(id)response;

- (void)serverko:(Serverko*)serverko onJoinServer:(id)response;

- (void)serverko:(Serverko*)serverko onGetData:(id)response;

- (void)serverko:(Serverko*)serverko onJoinScript:(id)response;

@end
