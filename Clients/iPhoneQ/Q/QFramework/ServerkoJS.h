//
//  ServerkoJS.h
//  ServerkoParse
//
//  Created by Damir Kolobaric on 2/4/10.
//  Copyright 2010 zoomMediaPlus. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "JSON.h"

@protocol ServerkoJSDelegate;

@interface ServerkoJS : UIWebView <UIWebViewDelegate> {

    id<ServerkoJSDelegate> mDelegate;
    NSMutableArray* mParsedScripts;
    SBJsonParser*     mJSONParser;
}

- (void) loadFramework;
- (void) runLoggers;

- (void) readJavascriptLogger;

- (void) parse:(NSString*) file;

- (void) loadScript:(NSString*) script;

- (void) execScript:(NSString*) script;

- (void) showData;

- (void)stopScript;

- (void) onJSONData:(NSString*) script;

- (id)initWithDelegate:(id<ServerkoJSDelegate>)delegate;


@property(nonatomic,assign) id<ServerkoJSDelegate> mDelegate;

@end

@protocol ServerkoJSDelegate <NSObject>

@optional

- (id)initWithDelegate:(id<ServerkoJSDelegate>)delegate;

- (void)serverkoJS:(ServerkoJS*)serverkoJS onEvent:(NSMutableArray*)response;

@end
