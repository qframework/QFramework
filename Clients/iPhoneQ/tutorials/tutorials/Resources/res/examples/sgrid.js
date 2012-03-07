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

// simple objects 

// setup layout
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
    
	var areaBack = new LayoutArea();
	areaBack.type = "layout.back";
	areaBack.location= "0,0,6.4,6.4,-0.1";
	areaBack.background = "FF666666";
	areas.push(areaBack);

	var grid = new LayoutArea();
	grid.type = "table.sgrid";
	grid.id = "helpgrid";
	grid.background = "55FFFFFF";
	grid.location="-0.0,-0.6,0.0";
	grid.bounds = "1.2,1.2";
	grid.size = "9,3,3"; 
	grid.items = "[i]icons.0,[i]icons.1,[i]icons.2,"; 
	grid.items += "[i]icons.24,[i]icons.25,[i]icons.26,";
	grid.items += "[i]icons.16,[i]icons.17,[i]icons.18";
	grid.onclick = "js:onclickprint";
	areas.push(grid);

	var stack = new LayoutArea();
	stack.type = "table.sgrid";
	stack.id = "stack";
	stack.location="1.3,-0.0,0.01";
	stack.bounds = "0.5,2.5";
	stack.size = "5,1,5";
	stack.background = "FFBB0000";
	stack.foreground = "FFFFFFFF,back";   
	stack.display = "hud";
	stack.fields = "start,0,0,1,1,0,1;";
	stack.fields += "start,0,1,1,1,0,1;";
	stack.fields += "start,0,2,1,1,0,1;";
	stack.fields += "start,0,3,1,1,0,1;";
	stack.fields += "start,0,4,1,1,0,1";
	stack.items = "[i]icons.17,[i]icons.25,[i]icons.17,";
	stack.items += "[i]icons.25,[i]icons.17";
	stack.onclick = "js:onclickprint";
	areas.push(stack);
	

	// add exit area
	var areaExit = new LayoutArea();    
	areaExit.type = 'layout.back';
	areaExit.background = 'FFFFFFFF,icons.2.8.8';
	areaExit.location= (x2- 0.11) +','+(y2-0.11);
	areaExit.bounds = '0.20,0.20';
	areaExit.display = 'hud';
	areaExit.onclick = 'js:test_exit';
    areas.push(areaExit);
    
	Q.layout.add("sgrid", areas).now();
	// show page
	Q.layout.show("sgrid").now();	
	
	
}


function test_exit(area,index)
{
	Q.startUpdate();
	Q.layout.clear("sgrid");
	
	// go to default
	Q.camera.fit( "4.0,0");
	Q.camera.fitHud( "4.0,0");
	Q.layout.show('mainmenu');
	Q.sendUpdate();
	
	
}

function onclickprint(area, index)
{
	console.log ( "clicked " + area + " " + index);
}


// change camera to see difference
Q.camera.set(0,0,0, 0,-2,2).now();
// put layout into queue to allow camera change to take effect
Q.evals(0,"setuplayout();").now();

