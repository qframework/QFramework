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

// rendering is done in two passes
// first pass renders areas with "world" display property
// then areas with "hud" display properties, as overlay

// setup layout
function setuplayout()
{
	var areas = new Array();
	
	// add text labels
	var item = new LayoutArea();
	item.type = "table.list";
	item.id = "list1";
	item.background="FF331133";
	item.location= "-0.7,-0.4,0.0";
	item.bounds="1.2,1.2";
	item.display = "hud";
	//item.text = "Menu Item 1";
	item.items = "";
	item.size = "25,7,1"; // max, visible , stride
	item.onclick = "js:listclick";
	for (var a=0; a< 25; a++)
	{
		item.items += "[t]"+a+"list item "+ a + ","; 
	}
	areas.push(item);
	
	var item = new LayoutArea();
	item.type = "table.list4";
	item.id = "list2";
	item.background="FF331133";
	item.location= "0.7,-0.4,0.0";
	item.bounds="1.2,1.2";
	item.display = "hud";
	//item.text = "Menu Item 1";
	item.items = "";
	item.size = "50,7,2"; // max, visible , stride
	item.onclick = "js:listclick";
	for (var a=0; a< 25; a++)
	{
		item.items += "[i]icons.2,";
		item.items += "[t]"+a+"list item "+ a + ","; 
	}
	item.fields = "-0.40,0.0,0.08,0.90;0.1,0.0,0.85,1.0";
	areas.push(item);

	
	var item = new LayoutArea();
	item.type = "table.hlist";
	item.id = "list9";
	item.background="FF331133";
	item.location= "0.2,1.2,0.0";
	item.bounds="2.4,0.3";
	item.display = "hud";
	item.items = "";
	item.size = "20,10,1"; // max, visible , stride
	item.onclick = "js:listclick";
	for (var a=0; a< 5; a++)
	{
//		item.items += "[t]"+a+",";
		
		item.items += "[i]icons.16,";
		item.items += "[i]icons.24,";
		item.items += "[i]icons.25,";
		item.items += "[i]icons.26,";
	}
	areas.push(item);


	var item = new LayoutArea();
	item.type = "table.hlist";
	item.id = "list4";
	item.background="FF331133";
	item.location= "0.2,0.6,0.0";
	item.bounds="2.4,0.3";
	item.display = "hud";
	item.items = "";
	item.size = "40,10,2"; // max, visible , stride
	item.onclick = "js:listclick";
	for (var a=0; a< 5; a++)
	{
		item.items += "[t]"+a+",";
		item.items += "[i]icons.16,";
		item.items += "[t]"+a+",";
		item.items += "[i]icons.24,";
		item.items += "[t]"+a+",";
		item.items += "[i]icons.25,";
		item.items += "[t]"+a+",";
		item.items += "[i]icons.26,";
	}
	item.fields = "0.0,0.28,0.20,0.20;0.0,-0.2,0.6,0.6";
	areas.push(item);

	
	
    var x2 = Q.layout.hudxmax;    
    var y2 = Q.layout.hudymax;
    
	// add exit area
	var areaExit = new LayoutArea();    
	areaExit.type = 'layout.back';
	// setbackground
	areaExit.background = 'FFFFFFFF,icons.2.8.8';
	areaExit.location= (x2- 0.11) +','+(y2-0.11);
	areaExit.bounds = '0.20,0.20';
	areaExit.display = 'hud';
	areaExit.onclick = 'js:list_exit';
    areas.push(areaExit);
    
	Q.layout.add("lists", areas).now();
	// show page
	Q.layout.show("lists").now();	
	
	
}


function list_exit(area,index)
{
	Q.startUpdate();
	Q.layout.clear("lists");
	// go to default
	Q.camera.fit( "4.0,0");
	Q.camera.fitHud( "4.0,0");
	Q.layout.show('mainmenu');
	Q.sendUpdate();
}

var scrolls = 0.0;
var val = 0.002;


function updateScrollers()
{
	Q.layout.areaSetScrollers("list1" , scrolls).now();
	scrolls += val;
	Q.evals(10, "js:updateScrollers();").now();
	if (scrolls > 1)
	{
		val = -0.002;
	}else
	if (scrolls < 0)
	{
		val = 0.002;
	}
	
	
}


function listclick(area, index , delay , loc )
{
	console.log( " list click area " + area +  " at index " + index + " with delay " + delay + "ms at location " + loc);
}

setuplayout();
