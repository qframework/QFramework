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



LayoutAreaText_SubType = 
{
	MLINE:0,
	MLINEW:1,
	LABEL:2,
	BUTTON:3,
	BUTTON2:4,
	BUTTON3:5,
	NONE:6
}


function LayoutAreaText(subtype , app)
{
	this.mApp = app;
    this.mID= undefined;
    this.mBounds = [1,1,1];
    this.mLocation = [0,0,0,0,0];
    this.mRotation = [0,0,0];
    this.mScale = [1,1,1];

    this.mType = LayoutArea_Type.NONE;
    this.mState = LayoutArea_State.VISIBLE;
    this.mInitState = LayoutArea_State.VISIBLE;
    this.mOwner = [];
    this.mParent =  undefined;
    this.mLayout = LayoutArea_Layout.NONE;
    this.mDisplay = GameonWorld_Display.WORLD;
    this.mItemFields = [];
    this.mText = undefined;
    this.mData = undefined;
    this.mSize = 0;
    this.mSizeW = 0;
    this.mSizeH = 0;
    this.mColorForeground = undefined;
    this.mColorForeground2 = undefined;
    this.mColorBackground = undefined;
    this.mColorBackground2 = undefined;
    this.mOnclick = undefined;
	this.mOnFocusLost = undefined;
	this.mOnFocusGain = undefined;
	this.mWorld = undefined;
	this.mPageId = undefined;
	
	this.mModel = undefined;// = new GameonModel();
    this.mModelBack = undefined;

	this.mSubType = LayoutAreaCards_SubType.NONE;
	
	this.mColors = new Array(4);
	this.mColors[0] = this.mApp.mColors.white;
	this.mColors[1] = this.mApp.mColors.white;
	this.mColors[2] = this.mApp.mColors.white;
	this.mColors[3] = this.mApp.mColors.white;
	
	this.mModifier = 0;
	
	var val = subtype.charAt( subtype.length -1 );
	if (val >= '0' && val <= '9')
	{
		this.mModifier = (val-'0')*1.0+1.0;
	}
		
	if (subtype.indexOf("mline") == 0)
	{
		this.mSubType = LayoutAreaText_SubType.MLINE;
	}else if (subtype.indexOf("mlinew") == 0)
	{
		this.mSubType = LayoutAreaText_SubType.MLINEW;
	}else if (subtype.indexOf("label") == 0)
	{
		this.mSubType = LayoutAreaText_SubType.LABEL;
	}else if (subtype.indexOf("button") == 0)
	{
		this.mSubType = LayoutAreaText_SubType.BUTTON;
	}
	
	this.mType = LayoutArea_Type.TEXT;	
	this.mPageVisible = false;
	
	this.mActive = true;
	this.mSizeText = -1;
	this.mScrollers = [0,-0.5,0.5,0,0,0];
	this.mHasScrollH = false;
	this.mHasScrollV = false;
	this.mScollerAnim = undefined;
	this.mActiveItems = 1;
	
}

LayoutAreaText.prototype = new LayoutArea();
LayoutAreaText.prototype.constructor=LayoutAreaText;

LayoutAreaText.prototype.getTextOnLine = function(y)
{
	if (this.mText == undefined)
		return "";
	var from = y * this.mSizeW;
	var to = (y+1) * this.mSizeW;
	if (from >= this.mText.length )
	{
		return "";
	}
	if (to >= this.mText.length )
	{
		to = this.mText.length;
	}

	var txt = this.mText.substring(from,to);
	return txt;
}

LayoutAreaText.prototype.getTextW = function(max, text)
{
	var retstr = new String();
	var currlen = 0;
	while (text.length> 0)
	{
		var newstr = text[0];
		var len2 = currlen + newstr.length + 1;
		if (len2 > max)
		{
			return retstr;
		}
		retstr += " ";
		retstr += newstr;
		currlen = retstr.length;
		text.slice(0,1);
	}
	
	return retstr;
}

LayoutAreaText.prototype.initMLineW = function()
{
	if (this.mText == undefined)return;
	
	var width = this.mBounds[0];
	var height = this.mBounds[1];
	var fieldcnt = 0;
	var charcnt = 0;
	var text =  this.mText.split(" ");
	
	var divy = height / this.mSize;
	var divy2 = 1.0 / this.mSize;	
	
	for (var a=this.mSize-1; a>=0 ; a--)
	{
		this.setField(fieldcnt);
		var field = this.mItemFields[fieldcnt];
		field.mX = 0;
		field.mY = 0  - height/2 + a* divy+ divy/2;
		field.mZ = 0;
		field.mW = 1 - 1 / 20;;
		field.mH = divy2  - divy2/20;
		field.mRef.setPosition(field.mX,field.mY,field.mZ);
		field.mRef.setScale(field.mW,field.mH,1);       
		field.setText( this.getTextW(this.mSizeW,text ) , this.mSizeW);
		fieldcnt++;
		
	}
	
}


LayoutAreaText.prototype.initMLine = function()
{
	var width = this.mBounds[0];
	var height = this.mBounds[1];
	var fieldcnt = 0;
	var divy = height / this.mSize;
	var divy2 = 1 / this.mSize;
	for (var a=this.mSize-1; a>=0 ; a--)
	{
		this.setField(fieldcnt);
		var field = this.mItemFields[fieldcnt];
		field.mX = 0;
		field.mY = 0  - height/2 + a* divy+ divy/2;
		field.mZ = 0;
		field.mW = 1 - 1/20;
		field.mH = divy2 - divy2/20;
		if (this.mOwner.length > 0) {
			field.mOwner = this.mOwner[0];
		}        
		field.mRef.setPosition(field.mX,field.mY,field.mZ);
		field.mRef.setScale(field.mW,field.mH,1);  		
		field.setText( this.getTextOnLine(fieldcnt) , this.mSizeW);
		fieldcnt++;
	}
	
}



LayoutAreaText.prototype.initLabel = function() 
{
	this.setField(0);
	var field = this.mItemFields[0];

	var width = 1;
	var height = 1;
	
	field.mH = height;
	field.mW = width;
	field.mX = 0;
	field.mY = 0;
	field.mZ = 0;
	if (this.mOwner.length > 0) {
		field.mOwner = this.mOwner[0];
	}            
	field.setText(this.mText, this.mSize);
}

LayoutAreaText.prototype.initButton = function()
{
	this.setField(0);
	var width = this.mBounds[0];
	var height = this.mBounds[1];	
	var ratio = this.mBounds[0] / this.mBounds[1];
	
	var  bw = 1 - (11.0-this.mModifier) / 10.0;
	var  w = 1.0 - bw;
	
	var x = width * (0.5-w/2); 
	var x1 = width * (-0.5 + bw/2);
	
	if (this.mModifier == 0)
	{
		w = 0.8;
		x = 0;//0.1 * width;
		bw  = 0.1;
		x1 = -width/2.1 + 1/ratio;
	}	
	
	var field = this.mItemFields[0];
	field.mH = 1.0-this.mModifier/10.0;
	field.mW = w;
	field.mX = x;
	field.mY = 0;
	field.mZ = 0;
	field.mRef.setPosition(field.mX,field.mY,field.mZ);
	field.mRef.setScale(field.mW,field.mH,1);
	field.setText(this.mText, this.mSize);
	
	this.setField(1);
	field = this.mItemFields[1];
	field.mH = 1;
	field.mW = 1/ratio;
	field.mX = x1;
	field.mY = 0;
	field.mZ = 0;
	field.updateLocation();
	field.mRef.setPosition(field.mX,field.mY,field.mZ);
	field.mRef.setScale(field.mW,field.mH,1);	
}

LayoutAreaText.prototype.initLayout = function() 
{
	this.mSizeText = this.mSize;
	if (this.mSubType == LayoutAreaText_SubType.LABEL) {
		this.initLabel();
	} else if (this.mSubType == LayoutAreaText_SubType.MLINE) {
		this.initMLine();
	}  else if (this.mSubType == LayoutAreaText_SubType.MLINEW) {
		this.initMLineW();
	} else if (this.mSubType == LayoutAreaText_SubType.BUTTON) {
		this.initButton();
	} 

}	

LayoutAreaText.prototype.setText = function(strData) 
{
	//console.log( " area set text text  " + this.mID + " " + strData );
	this.setText_S(strData);
	if (strData.length == 0 && this.mItemFields.length > 0)
	{
		for (var a=0; a< this.mItemFields.length; a++)
		{
			var f = this.mItemFields[a];
			f.setText("", 0);        
		}
		return;
	}
	
	if (strData.length > 0 && this.mItemFields.length > 0)
	{
		if (this.mSubType == LayoutAreaText_SubType.LABEL || this.mSubType == LayoutAreaText_SubType.BUTTON)
		{
			//console.log( " update field text " + this.mItemFields[0].id + " from " + this.mID);
			this.mItemFields[0].setText(strData , this.mSize);
		} else if (this.mSubType == LayoutAreaText_SubType.MLINE)
		{
			var fc = 0;
			for (var a=this.mSize-1; a>=0 ; a--)
			{
				var field = this.mItemFields[fc];
				field.setText( this.getTextOnLine(fc), this.mSizeW);
				fc++;
			}
			
		} else if (this.mSubType == LayoutAreaText_SubType.MLINEW){
			var fc = 0;
			
			
			var text =  this.mText.split(" ");
			for (var a=this.mSize-1; a>=0 ; a--)
			{
				var field = this.mItemFields[fc];
				field.setText( this.getTextW(this.mSizeW,text ) , this.mSizeW);
				fc++;
			}
		}			
	}
}

