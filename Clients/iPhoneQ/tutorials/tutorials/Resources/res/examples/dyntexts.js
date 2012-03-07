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


// most of properties can be changed dynamically
// this example shows how to change some of text field properties

// setup layout
var text1 = "Text with frame, press me!";
var text11 = "New text, press me!";
var help = new Array("This is [first] page of help "
					,"This is [another] page of help "
					,"This is {yet another page} of help");

var text1count = 0;
var loc = 0.8;
	
function setuplayout()
{
	// round to fixed for better display, but use full float in calculations
    var x1 = Q.layout.hudxmin.toFixed(1);
    var x2 = Q.layout.hudxmax.toFixed(1);    
    var y1 = Q.layout.hudymin.toFixed(1);
    var y2 = Q.layout.hudymax.toFixed(1);
    
    var wx1 = Q.layout.worldxmin.toFixed(1);
    var wx2 = Q.layout.worldxmax.toFixed(1);    
    var wy1 = Q.layout.worldymin.toFixed(1);
    var wy2 = Q.layout.worldymax.toFixed(1);

	var areas = new Array();
	
	// add text labels
	var item = new LayoutArea();
	item.type = "text.label";   // multiline
	item.background="FFFFFFFF,icons.9.8.8";
	item.location= "-0.8,0.6,0.0";
	item.bounds="2.2,0.2";
	item.text = text1;
	item.display = "hud";
	item.foreground = "FF990000";
	item.border = "thinrect";	
	item.onclick = "js:text_change1";
	areas.push(item);

	var item = new LayoutArea();
	item.type = "text.label";   // multiline
	item.background="FFFFFFFF,icons.9.8.8";
	item.location= "-1.2,-0.6,0.0";
	item.bounds="1.2,0.2";
	item.text = "Count:";
	item.display = "hud";
	item.id = "counter";
	item.size = 18;
	item.layout = "hor";
	item.foreground = "FF990000";
	item.border = "thinrect";	
	areas.push(item);


	var item = new LayoutArea();
	item.type = "text.mlinew";   // multiline white spaces!
	item.background="FF330000";
	item.location= "0.8,-0.6,0.0";
	item.bounds="1.2,0.6";
	item.text = Q.util.tob64(help[0]);
	item.display = "hud";
	item.id = "helps";
	item.size = "6,12";
	item.foreground = "FF990000";
	item.border = "thinrect";	
	areas.push(item);

	var item = new LayoutArea();
	item.type = "layout.back";   
	item.background="FFFFFFFF,icons.1.8.8";
	item.location= "1.6,-0.6,0.0";
	item.bounds="0.2,0.2";
	item.display = "hud";
	item.onclick = "js:next_help";
	areas.push(item);
	

	var item = new LayoutArea();
	item.type = "text.button";   
	item.background="FF333333";
	item.location= "0.8,1.0,0.0";
	item.bounds="0.8,0.2";
	item.items="[t]Move me,[i]icons.0";
	item.display = "hud";
	item.id = "moveitem";
	item.foreground = "FF000099";
	item.onclick = "js:move_area";
	item.border = "thinrect";	
	areas.push(item);

	
	
	// add exit area
	var areaExit = new LayoutArea();    
	areaExit.type = 'layout.back';
	areaExit.background = 'FFFFFFFF,icons.2.8.8';
	areaExit.location= (x2- 0.11) +','+(y2-0.11);
	areaExit.bounds = '0.20,0.20';
	areaExit.display = 'hud';
	areaExit.onclick = 'js:test_exit';
    areas.push(areaExit);
    
	Q.layout.add("dyntexts", areas).now();
	// show page
	Q.layout.show("dyntexts").now();	
	
	
}


function text_change1(area, index)
{
	Q.startUpdate();
	text1count ++;
	if (text1count %2 == 1)
	{
		Q.layout.areaSetText(area,text11);
	}else
	{
		Q.layout.areaSetText(area,text1);
	}
	
	Q.sendUpdate();
}

var testactive = 1;
function test_exit(area,index)
{
	testactive = 0;
	Q.startUpdate();
	Q.layout.clear("dyntexts");
	// go to default
	Q.camera.fit( "4.0,0");
	Q.camera.fitHud( "4.0,0");
	Q.layout.show('mainmenu');
	Q.sendUpdate();
	
}

var counter = 0;
function text_change()
{
	if (testactive == 0)
	{
		return;
	}
	
	Q.layout.areaSetText("counter","Count:"+counter).now();
	counter++;
	Q.evals(1000,"text_change();").now();
}

var helppage = 0;
function next_help()
{
	helppage++;
	if (helppage >= help.length)
	{
		helppage = 0;
	}
	Q.layout.areaSetText("helps",Q.util.tob64(help[helppage])).now();
}


function move_area(area, index)
{
	loc -= 0.2;
	if (loc < 0)
	{
		loc = 0.8;
	}
		
	Q.startUpdate();
	Q.layout.areaSetLocation(area, loc+",1.0,0.0");
	Q.sendUpdate();

}


// put layout into queue to allow camera change to take effect
setuplayout();
// kick text change timer
Q.evals(1000,"text_change();").now();


