//
//  HighScoreAlert.m
//  Sedmice
//
//  Created by damir kolobaric on 9/8/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "TextInput.h"


@implementation TextInput

@synthesize textField;
@synthesize enteredText;

- (id)initWithTitle:(NSString *)title message:(NSString *)message delegate:(id)delegate 
       kButtonTitle:(NSString *)okayButtonTitle kText:(NSString*)text
{
    
    if (self = [super initWithTitle:title message:@" " delegate:self cancelButtonTitle:nil otherButtonTitles:okayButtonTitle, nil])
    {
        UITextField *theTextField = [[UITextField alloc] initWithFrame:CGRectMake(12.0, 45.0, 260.0, 25.0)]; 
        [theTextField setBackgroundColor:[UIColor whiteColor]]; 
        theTextField.text = text;
        [self addSubview:theTextField];
        
        self.textField = theTextField;
        self.textField.delegate = self;
        [theTextField release];
        CGAffineTransform translate = CGAffineTransformMakeTranslation(0.0, 10.0); 
        [self setTransform:translate];
        
        mDelegate = delegate;
    }
    return self;
}
- (void)show
{
    [textField becomeFirstResponder];
    [super show];
}
- (NSString *)enteredText
{
    return textField.text;
}
- (void)dealloc
{
    [textField release];
    [super dealloc];
}

- (void)alertView:(UIAlertView *)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex {

    [mDelegate performSelector:@selector(onTextInputEnd:) withObject:textField.text];
}

- (BOOL)textFieldShouldReturn:(UITextField *)text {
    //[text resignFirstResponder];
    //[mDelegate performSelector:@selector(onTextInputEnd:) withObject:textField.text afterDelay:0.01];
    [self dismissWithClickedButtonIndex:1 animated:YES];
    return YES;
}

@end
