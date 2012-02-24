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
	
	// add text labels
	var item = new LayoutArea();
	item.type = "text.label";   // multiline
	item.background="FFEE1111";
	item.location= "0.0,"+(y2-0.1)+",0.0";
	item.bounds="2.2,0.2";
	item.display = "hud";
	item.text = " press to animate";
	item.onclick = "js:animobjects";
	areas.push(item);

	var object1 = new WorldObject();
	object1.name = "cube1";
	object1.template = "cube";
	object1.location = "0.0,0.0,0.2";
	object1.bounds = "0.5,0.5,0.5";
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
	areaExit.background = 'FFFFFFFF,icons.2.8.8';
	areaExit.location= (x2- 0.11) +','+(y2-0.11);
	areaExit.bounds = '0.20,0.20';
	areaExit.display = 'hud';
	areaExit.onclick = 'js:test_exit';
    areas.push(areaExit);
    
	Q.layout.add("objects", areas).now();
	// show page
	Q.layout.show("objects").now();	
	
	
}


function test_exit(area,index)
{
	Q.startUpdate();
	Q.layout.clear("objects");
	
	Q.objects.remove("cube1");
	Q.objects.remove("plane1");
	Q.objects.remove("sphere1");
	
	// go to default
	Q.camera.fit( "4.0,0");
	Q.camera.fitHud( "4.0,0");
	Q.layout.show('mainmenu');
	Q.sendUpdate();
	
	
}

function animobjects()
{
	Q.startUpdate();
	Q.anim.rotate("cube1","360,0,0","1000,10","");
	Q.anim.move("plane1","0.3,-0.5,0.2","1000,3","");
	Q.anim.move("sphere1","-0.3,-1.1,0.2","1000,-3","");
	Q.sendUpdate();
}


// change camera to see difference
Q.camera.set(0,0,0, 0,-2,2).now();
// put layout into queue to allow camera change to take effect
Q.evals(0,"setuplayout();").now();

