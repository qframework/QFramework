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
	item.type = "text.label";
	item.background="FFEE1111";
	item.location= "0.0,-0.6,0.0";
	item.bounds="2.2,0.2";
	item.text = "area in world space";
	areas.push(item);
	
	var item = new LayoutArea();
	item.type = "text.label";
	item.background="FF11EE11";
	item.location= "0.0,-0.0,0.0";
	item.bounds="2.2,0.2";
	item.text = "area in world space";
	areas.push(item);
	
	var item = new LayoutArea();
	item.type = "text.label";
	item.background="FF1111EE";
	item.location= "0.0,0.6,0.0";
	item.bounds="2.2,0.2";
	item.text = "area in world space";
	areas.push(item);


	var item = new LayoutArea();
	item.type = "text.label";
	item.background="77EE1111";
	item.location= "0.0,-1.0,0.0";
	item.bounds="2.2,0.2";
	item.display = "hud";
	item.text = "area on hud display";
	areas.push(item);
	
	var item = new LayoutArea();
	item.type = "text.label";
	item.background="771111EE";
	item.location= "0.0,1.0,0.0";
	item.bounds="2.2,0.2";
	item.display = "hud";
	item.text = "area on hud display";
	areas.push(item);

	// change camera to see difference
	Q.camera.set(0,0,0, 0,-2,2).now();
	
	

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
	areaExit.onclick = 'js:coords_exit';
    areas.push(areaExit);
    
	Q.layout.add("worldhud", areas).now();
	// show page
	Q.layout.show("worldhud").now();	
	
	
}


function coords_exit(area,index)
{
	Q.startUpdate();
	Q.layout.clear("worldhud");
	// go to default
	Q.camera.fit( "4.0,0");
	Q.camera.fitHud( "4.0,0");
	Q.layout.show('mainmenu');
	Q.sendUpdate();
}



setuplayout();
