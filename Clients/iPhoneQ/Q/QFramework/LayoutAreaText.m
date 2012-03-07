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

#import "LayoutAreaText.h"
#import "LayoutField.h"
#import "GameonModelRef.h"

@implementation LayoutAreaText

-(id) initWithSubtype:(NSString*)subtype  app:(GameonApp*)app
{
    self = [super initWithSubtype:subtype app:app];
	mModifier = 0;
	
	int val = [subtype characterAtIndex:[subtype length] -1 ];
	if (val >= '0' && val <= '9')
	{
		mModifier = (val-'0')*1.0f+1.0f;
	}
	
    if (self)
    {
        if ([subtype hasPrefix:@"mline"])
        {
            mSubType = LATxST_MLINE;
        }else
        if ([subtype hasPrefix:@"mlinew"])
        {
            mSubType = LATxST_MLINEW;
        }else            
        if ([subtype hasPrefix:@"label"])
        {
            mSubType = LATxST_LABEL;
        }else
        if ([subtype hasPrefix:@"button"])
        {
            mSubType = LATxST_BUTTON;
        }
        
    }
    
    mType = LAT_TEXT;

    return self;
}

-(void) dealloc 
{
    [super dealloc];
}


-(void) initLabel
{
   
    [self setField:0];
    LayoutField* field = [mItemFields objectAtIndex:0];
    
    
    float width = 1;
    float height = 1;
    
    field.mH = height;
    field.mW = width;
    field.mX = 0;
    field.mY = 0;
    field.mZ = 0;
    [field setText:mText len:mSize];

}

-(void) initButton
{
    
    [self setField:0];
    LayoutField* field = [mItemFields objectAtIndex:0];
    
    float width = mBounds[0];
    //float height = mBounds[1];
    
	float ratio = mBounds[0] / mBounds[1];
	
	float bw = 1.0f - (11.0f-mModifier) / 10.0f;
	float w = 1.0f - bw;
	
	float x = width*(0.5f-w/2); 
	float x1 = width *(-0.5f + 1/(2*ratio));
	
	if (mModifier == 0)
	{
		w = 0.8f;
		x = 0;//0.1f * width;
		bw  = 0.1f;
		x1 = -width/2.1f + 1/ratio;
	}
	field.mH = 1.0f-mModifier/10.0f;
	field.mW = w;
	field.mX = x;
	field.mY = 0;
	field.mZ = 0;
	[field.mRef setPosition:field.mX y:field.mY z:field.mZ];
	[field.mRef setScale:field.mW y:field.mH z:1];
    [field setText:mText len:mSize];
    
    [self setField:1];
    field = [mItemFields objectAtIndex:1];
	field.mH = 1;
	field.mW = 1/ratio;
	field.mX = x1;
	field.mY = 0;
	field.mZ = 0;
	[field.mRef setPosition:field.mX y:field.mY z:field.mZ];
	[field.mRef setScale:field.mW y:field.mH z:1];
    
}



-(NSString*) getTextW:(int)max cnt:(int*)counter data:(NSArray*)text
{
    int from = (*counter);
    NSMutableString* retstr = [[NSMutableString alloc] init];
    
    int currlen = 0;
    
    int len = [text count];        
    while ( from < len)
    {
        if (from >= len)
        {
            return retstr;
        }
        NSString* newstr = [text objectAtIndex:from];
        int len2 = currlen + [newstr length] + 1;
        if (len2 > max)
        {
            return retstr;
        }
        [retstr appendString:@" " ];
        [retstr appendString:newstr ];
        currlen = [retstr length];
        from ++;
        (*counter)++;
    }
    
    return retstr;    
    
}

-(NSString*) getTextOnLine:(int)y
{
    int from = y * mSizeW;
    int to = (y+1) * mSizeW;
    if (from >= [mText length] )
    {
        return [NSString stringWithFormat:@""];
    }
    if (to >= [mText length] )
    {
        to = [mText length];
    }
    
    NSRange range = NSMakeRange (from, to-from);
    NSString* txt = [mText substringWithRange:range];
    //NSLog(@" getText %@ %d %d" , txt, from ,to);
    return txt;
}

-(void) initMLine
{
    //float width = mBounds[0];
	float height = mBounds[1];
	int fieldcnt = 0;
	float divy = height / mSize;
	float divy2 = 1.0f / mSize;
    
    for (int a=mSize-1; a>=0 ; a--)
    {
        [self setField:fieldcnt];
        LayoutField* field = [mItemFields objectAtIndex:fieldcnt];
        field.mX = 0;
        field.mY = 0  - height/2 + a* divy+ divy/2;
        field.mZ = 0;
        field.mW = 1.0f - 1.0f / 20;
        field.mH = divy2  - divy2/20;
		[field.mRef setPosition:field.mX y:field.mY z:field.mZ];
		[field.mRef setScale:field.mW y:field.mH z:1];

        [field setText:[self getTextOnLine:fieldcnt] len:mSizeW];
        fieldcnt++;
        
    }
    
}

-(void) initMLineW
{
    //float width = mBounds[0];
    float height = mBounds[1];
    int fieldcnt = 0;
    int charcnt = 0;
    NSArray* tokens = [mText componentsSeparatedByString:@" "];

    float divy = height / mSize;
    float divy2 = 1.0f / mSize;
    
    
    for (int a=mSize-1; a>=0 ; a--)
    {
        [self setField:fieldcnt];
        LayoutField* field = [mItemFields objectAtIndex:fieldcnt];        
        field.mX = 0;
        field.mY = 0  - height/2 + a* divy+ divy/2;
        field.mZ = 0;
        field.mW = 1.0f - 1.0f / 20;
        field.mH = divy2  - divy2/20;
		[field.mRef setPosition:field.mX y:field.mY z:field.mZ];
		[field.mRef setScale:field.mW y:field.mH z:1];

        NSString* text = [self getTextW:mSizeW cnt:&charcnt data:tokens];
        [field setText:text len:mSizeW];
        [text release];
        fieldcnt++;
        
    }
    
}

-(void) initLayout
{
    [super initLayout];
	mSizeText = mSize;
    if (mSubType == LATxST_LABEL)
    {
        [self initLabel];
        
    } else if (mSubType == LATxST_MLINE)
    {
        [self initMLine];
    } else if (mSubType == LATxST_MLINEW)
    {
        [self initMLineW];
    } else if (mSubType == LATxST_BUTTON)
    {
        [self initButton];
    }
}

-(void)setText:(NSString*) strData
{
	if (strData == nil)
		return;
    [super setText:strData];
    //strData length] > 0 && 
    if ([strData length] == 0 && [mItemFields count] > 0)
    {
        LayoutField* f = [mItemFields objectAtIndex:0];
        [f setText:@"" len:0];        
        return;
    }
    
    if ([mItemFields count] > 0)
    {
        if (mSubType == LATxST_LABEL || mSubType == LATxST_BUTTON)
        {
            LayoutField* f = [mItemFields objectAtIndex:0];
            [f setText:strData len:mSize];
        } else if (mSubType == LATxST_MLINE)
        {
            int fc = 0;
            for (int a=mSize-1; a>=0 ; a--)
            {
                LayoutField* field = [mItemFields objectAtIndex:fc];
                [field setText:[self getTextOnLine:fc] len:mSizeW];
                fc++;
            }
            
        }
        else if (mSubType == LATxST_MLINEW)
        {
            int fc = 0;
            int charcnt = 0;
            NSArray* tokens = [mText componentsSeparatedByString:@" "];
            for (int a=mSize-1; a>=0 ; a--)
            {
                LayoutField* field = [mItemFields objectAtIndex:fc];
                [field setText:[self getTextW:mSizeW cnt:&charcnt data:tokens]  len:mSizeW];
                fc++;
            }
            
        }        
    }
}


@end



