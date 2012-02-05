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

function GLColor( red,  green,  blue,  alpha) 
{

    this.red = 1.0;
    this.green = 1.0;
    this.blue = 1.0;
    this.alpha = 1.0;
	if (arguments.length == 1)
	{
		var argb = red;
    	this.red = (argb >> 16 & 0xff) / 255.0;
    	this.green = (argb >> 8 & 0xff) / 255.0;
    	this.blue = (argb  & 0xff) / 255.0;
        this.alpha = (argb >> 24 & 0xff) / 255.0;
		
	}else if (arguments.length == 3)
	{
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = 1.0;	
	}else if (arguments.length == 4)
	{
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;	
	}

}

GLColor.prototype.equals = function(other) {
		return (red == color.red &&
				green == color.green &&
				blue == color.blue &&
				alpha == color.alpha);
    }

