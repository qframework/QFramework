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
#import "LayoutArea.h"


@class LayoutField;

typedef enum
{
    LATST_NONE,
    LATST_SGRID,
    LATST_CARDTABLE,
    LATST_LIST,
	LATST_HLIST
} LayoutAreaTableSubType;

@interface LayoutAreaTable : LayoutArea {
    
    
    LayoutAreaTableSubType mSubType;
	float mModifier;
    int	mTableWidth;
    int	mTableHeight;
    int mTitleHeight;
	float mListScaleMaxW;
	float mListScaleMinW;
	float mListScaleMaxH;
	float mListScaleMinH;
	
	float* mModifiersZ;
	float* mModifiersW;
	float* mModifiersH;
	float* mFieldsData;	
  
}

-(void)createDefaultFields;
-(void) updateScrollers;
-(void)initHList;
-(bool)getScrollCoords:(int)col ind:(int)ind field:(LayoutField*)f;


@end
