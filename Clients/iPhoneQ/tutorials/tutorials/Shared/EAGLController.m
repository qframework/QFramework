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

#import "EAGLController.h"
#import "EAGLView_iPad.h"

@implementation EAGLController


- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization.
    }
    return self;
}


/*
// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
}
*/


// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    [super viewDidLoad];
    EAGLView_iPad* view = (EAGLView_iPad*)self.view;
    mGlView = view;
    [view setController:self];
    
}

- (void)viewDidAppear:(BOOL)animated 
{ 
    [super viewDidAppear:animated];
}
- (void)viewWillDisappear:(BOOL)animated 
{ 
    [super viewWillDisappear:animated]; 
}


-(EAGLView_iPad*)getView
{
    return (EAGLView_iPad*)self.view;
}

// Override to allow orientations other than the default portrait orientation.
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    // Return YES for supported orientations.
    return (interfaceOrientation == UIInterfaceOrientationLandscapeRight);
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc. that aren't in use.
}

- (void)viewDidUnload {
    
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (void) startAnimation
{
    [mGlView startAnimation];
}

- (void) stopAnimation
{
    [mGlView stopAnimation];
}

- (void)dealloc {

    [super dealloc];
}


@end
