//
//  HighScoreAlert.h
//  Sedmice
//
//  Created by damir kolobaric on 9/8/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface TextInput : UIAlertView <UITextFieldDelegate> {

    UITextField *textField;
    NSString *enteredText;
    NSObject* mDelegate;
}

@property (nonatomic, retain) UITextField *textField;
@property (readonly) NSString *enteredText;


- (id)initWithTitle:(NSString *)title message:(NSString *)message delegate:(id)delegate 
      kButtonTitle:(NSString *)okButtonTitle kText:(NSString*)text;

@end
