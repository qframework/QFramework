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

function TextRender( world ) 
{

	this.mTexts = [];
	this.mVisibleTexts = [];    
	this.mWorld = world;
}

	

TextRender.prototype.remove = function(item) 
{
	var i = this.mTexts.indexOf(item) ;
	if ( i >= 0)
	{
		this.mTexts.splice(i,1);
		this.removeVisible(item);
	}
}

TextRender.prototype.add = function(item , visible) 
{
	if (this.mTexts.indexOf(item) < 0) 
	{
		this.mTexts.push(item);
		if (visible)
		{
			this.addVisible(item);
		}
	}
}

TextRender.prototype.render = function(gl) 
{
	
	var len = this.mVisibleTexts.length;
	if (len == 0)
		return;

	var lastoffset = 0;
	for(var a=0; a< len ;a++) {
		var item = this.mVisibleTexts[a];
		if (item.getVisible()) 
		{
			item.draw(gl , a);
		}
	}
	/*
	ItemFactory.mLetter.mEnabled = false;
	ItemFactory.mLetter.setupOffset(0);
	*/
}

TextRender.prototype.clear = function() {
	this.mTexts = [];
	this.mVisibleTexts = [];
}



TextRender.prototype.addVisible = function(textItem) {
	if (this.mVisibleTexts.indexOf(textItem) < 0)
	{
		this.mVisibleTexts.push(textItem);
	}
	
}

TextRender.prototype.removeVisible = function(textItem) {
	var i = this.mVisibleTexts.indexOf(textItem);
	if ( i >= 0)
	{
		this.mVisibleTexts.splice(i,1);
	}		
	
}
