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

function ColorFactory( ) 
{

	var one = 1.0;
	var half = 0.5;
	var half2 = 200.0/255.0;
	//int quarter = 0x04000;

	this.red = new GLColor(one, 0, 0);
	this.green = new GLColor(0, one, 0);
	this.blue = new GLColor(0, 0, one);
	this.yellow = new GLColor(one, one, 0);
	
	this.transparent = new GLColor(one, one, one , one);
	
	this.redL = new GLColor(one, half2, half2 , half);
	this.greenL = new GLColor(half2, one, half2, half);
	this.blueL = new GLColor(half2, half2, one, half);
	this.yellowL = new GLColor(one, one, half2, half);

	this.orange = new GLColor(one, half, 0);
	this.white = new GLColor(one, one, one);
	this.gray = new GLColor(half2, half2, half2);
	this.black = new GLColor(0, 0, 0);	
	
	this.grayL = new GLColor(half , half , half);
	this.magnentaL = new GLColor(half2 , half , half2);
	this.brownL = new GLColor(half2, half , 0);
	this.magnenta = new GLColor(one , half , one);	
	this.brown = new GLColor(one , half , 0);

}

ColorFactory.prototype.getPlayerColor = function(player)
{
	switch (player)
	{
	case 0: return this.gray;
	case 1: return this.red;
	case 4: return this.blue;
	case 2: return this.green;
	case 3: return this.orange;//yellow;    	
	}
	return this.white;
}    

ColorFactory.prototype.getColor = function(value) {
	if (value.search("player") == 0) {
		// get player color
		var c = value.substr(6);
		return this.getPlayerColorFore(parseInt(c));
	}	
	try 
	{
		var alpha = parseInt(value.substring(0, 2) , 16) / 255.0;
		var red = parseInt(value.substring(2, 4) , 16) / 255.0;
		var green = parseInt(value.substring(4, 6) , 16) / 255.0;
		var blue = parseInt(value.substring(6, 8) , 16) / 255.0;
		var c = new GLColor(red, green, blue, alpha);
		return c;
		
	} catch (e) {
		return this.white;
	}
	
}

ColorFactory.prototype.getPlayerColorFore = function(player) {
	switch (player)
	{
		case 1: return this.redL;
		case 4: return this.blueL;
		case 2: return this.greenL;
		case 3: return this.yellowL;    	
	}
	return this.white;
}



ColorFactory.prototype.getColorId = function(color)
{
	switch(color)
	{
		case 0:
			return this.white;
		break;
		case 1:
			return this.red;
		break;
		case 2:
			return this.green;
		break;
		case 3:
			return this.blue;
		break;
		case 4:
			return this.yellow;
		break;
		case 5:
			return this.magnenta;
		break;
		case 6:
			return this.brown;
		break;
		case 7:
			return this.black;
		break;
		case 8:
			return this.gray;
		break;
		case 9:
			return this.redL;
		break;		
		case 10:
			return this.greenL;
		break;
		case 11:
			return this.blueL;
		break;
		case 12:
			return this.yellowL;
		break;
		case 13:
			return this.magnentaL;
		break;	
		case 14:
			return this.brownL;
		break;
		case 15:
			return this.grayL;
		break;		
		
		
	}
	
	return this.white;
}

