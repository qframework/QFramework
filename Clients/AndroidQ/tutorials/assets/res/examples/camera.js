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

// when camera is changed we can get coordinates for screen bounds
// we also have information about screen width/height

// setup layout
function setuplayout()
{
    var x1 = Q.layout.hudxmin;
    var x2 = Q.layout.hudxmax;    
    var y1 = Q.layout.hudymin;
    var y2 = Q.layout.hudymax;
    
    var wx1 = Q.layout.worldxmin;
    var wx2 = Q.layout.worldxmax;    
    var wy1 = Q.layout.worldymin;
    var wy2 = Q.layout.worldymax;

	var areas = new Array();
	
	// add text labels
	var item = new LayoutArea();
	item.type = "text.button";
	item.id = "proj";
	item.background="FF331133";
	item.location= "0.0,0.8,0.0";
	item.bounds="2.2,0.2";
	item.display = "hud";
	item.text = "projection, FOV 45";
	item.onclick = "js:menu_clicked";
	areas.push(item);

	
	// add some objects to display
	var object1 = new WorldObject();
	object1.name = "cube1";
	object1.template = "cube";
	object1.location = "0.0,0.0,0.2";
	object1.bounds = "0.2,0.2,0.2";
	object1.texture = "qtext";
	object1.state = "visible";	

	var object2 = new WorldObject();
	object2.name = "sphere1";
	object2.template = "sphere";
	object2.location = "-0.6,-0.0,0.2";
	object2.bounds = "0.2,0.2,0.2";
	object2.texture = "qtext";
	object2.state = "visible";
	
	var object3 = new WorldObject();
	object3.name = "plane1";
	object3.template = "plane";
	object3.location = "0.6,-0.0,0.2";
	object3.bounds = "0.2,0.2,0.2";
	object3.texture = "qtext";
	object3.state = "visible";

	
	var objects = new Array();
	objects.push(object1);
	objects.push(object2);
	objects.push(object3);
	
	Q.objects.add(objects).now();	
	
	// add exit area
	var areaExit = new LayoutArea();    
	areaExit.type = 'layout.back';
	areaExit.id = "cameraexit";
	areaExit.background = 'FFFFFFFF,icons.2.8.8';
	areaExit.location= (x2- 0.11) +','+(y2-0.11);
	areaExit.bounds = '0.20,0.20';
	areaExit.display = 'hud';
	areaExit.onclick = 'js:camera_exit';
    areas.push(areaExit);
    
	Q.layout.add("camera", areas).now();
	// show page
	Q.layout.show("camera").now();	
	
	
}

var projvals = [ 60,30,45];
var pcount = 0;

function menu_clicked(area, index)
{
	if (area == "proj")
	{
		
		Q.camera.proj( projvals[pcount++], 0.1,8.00).now();
		Q.evals(0,"camera_updateExit();").now();
		if (pcount >= projvals.length)
		{
			pcount = 0;
		}
		Q.layout.areaSetText("proj" , "projection, FOV " + projvals[pcount]).now();
		
	}
	
}

function camera_updateExit()
{
	
	var x2 = Q.layout.hudxmax;
	var y2 = Q.layout.hudymax;
	Q.layout.areaSetLocation("cameraexit" , ''+(x2- 0.11) +','+(y2-0.11) ).now();
	
}


function camera_exit(area,index)
{
	
	Q.startUpdate();
	Q.camera.proj( 45.0, 0.1,8.00);
	Q.layout.clear("camera");
	Q.objects.remove("cube1");
	Q.objects.remove("plane1");
	Q.objects.remove("sphere1");

	Q.camera.fit( "4.0,0");
	Q.camera.fitHud( "4.0,0");
	Q.layout.show('mainmenu');
	Q.sendUpdate();
}


// change camera to see difference
Q.camera.set(0,0,0, 0,-2,2).now();
// put layout into queue to allow camera change to take effect
Q.evals(0,"setuplayout();").now();

