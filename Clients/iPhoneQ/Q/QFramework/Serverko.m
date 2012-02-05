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


#import "Serverko.h"


@implementation Serverko

@synthesize mDelegate;


static const NSTimeInterval kTimeoutInterval = 180.0;

- (id)initWithDelegate:(id<ServerkoDelegate>)delegate
{
    if (self = [super init]) {
        mDelegate = delegate;
        
    }
    
    mConnection = nil;
    
    return self;
}

- (void)dealloc
{

    [mConnection cancel];
    [mConnection release];

    [super dealloc];
}

- (BOOL)queryServer: (NSString* ) url;{

    NSString* serverUrl = [NSString stringWithFormat:@"%@/*", url];
    mCurrentAddress = [[[NSString alloc] initWithString:url] autorelease];
    
    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:serverUrl]
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData 
                                                       timeoutInterval:kTimeoutInterval];
   
   [request setHTTPMethod:@"GET"];

    mConnection = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    return TRUE;
}

-(void)login2Server:(NSString* )username  withPassword:(NSString*) password {
    NSString* serverUrl = [NSString stringWithFormat:@"%@/%@",  mCurrentAddress ,username];
    
    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:serverUrl]
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData 
                                                       timeoutInterval:kTimeoutInterval];
    
    [request setHTTPMethod:@"POST"];
    
    mConnection = [[NSURLConnection alloc] initWithRequest:request delegate:self];
}

- (void)sendRequest {
}

- (void)joinServer:(NSString*)username withServer:(NSString*) serverID {
    NSString* serverUrl = [NSString stringWithFormat:@"%@/%@/%@", mCurrentAddress , username, serverID];
    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:serverUrl]
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData 
                                                       timeoutInterval:kTimeoutInterval];
    
    [request setHTTPMethod:@"POST"];
    
    mConnection = [[NSURLConnection alloc] initWithRequest:request delegate:self];
}

- (void)getData:(NSString* )username  {
    NSString* serverUrl = [NSString stringWithFormat:@"%@/%@", mCurrentAddress, username];
    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:serverUrl]
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData 
                                                       timeoutInterval:kTimeoutInterval];
    
    [request setHTTPMethod:@"GET"];
    
    mConnection = [[NSURLConnection alloc] initWithRequest:request delegate:self];
}

- (void)joinScript:(NSString*)username withServer:(NSString*) serverID toScript:(NSString*)scriptID {
    NSString* serverUrl = [NSString stringWithFormat:@"%@/%@/%@/%@", mCurrentAddress, username, serverID, scriptID];
    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:serverUrl]
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData 
                                                       timeoutInterval:kTimeoutInterval];
    
    [request setHTTPMethod:@"POST"];
    
    mConnection = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    
    
}

- (void)connection:(NSURLConnection*)connection didReceiveResponse:(NSURLResponse*)response {
   
    mResponseText = [[NSMutableData alloc] init];
   /* 
    NSHTTPURLResponse* httpResponse = (NSHTTPURLResponse*)response;
    if ([_delegate respondsToSelector:@selector(request:didReceiveResponse:)]) {    
        [_delegate request:self didReceiveResponse:httpResponse];
    }*/
}

-(void)connection:(NSURLConnection*)connection didReceiveData:(NSData*)data {
   [mResponseText appendData:data];
}

- (NSCachedURLResponse*)connection:(NSURLConnection*)connection
                 willCacheResponse:(NSCachedURLResponse*)cachedResponse {
    return nil;
}

-(void)connectionDidFinishLoading:(NSURLConnection*)connection {
   //[self handleResponseData:mResponseText];
   /*
    NSError* error = nil;
    id result = [self parseXMLResponse:data error:&error];
    if (error) {
        //TODO error
        //[self failWithError:error];
    } else if ([_delegate respondsToSelector:@selector(request:didLoad:)]) {
        [_delegate request:self didLoad:result];
    }*/
    
    
}

- (void)connection:(NSURLConnection*)connection didFailWithError:(NSError*)error {  
/*
    [self failWithError:error];
  */  
    [mResponseText release];
    mResponseText = nil;
    [mConnection release];
    mConnection = nil;
}


@end
