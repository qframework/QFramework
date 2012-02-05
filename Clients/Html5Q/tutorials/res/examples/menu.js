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
	item.type = "text.button";
	item.id = "menu1";
	item.background="FF331133";
	item.location= "0.0,-0.6,0.0";
	item.bounds="2.2,0.3";
	item.display = "hud";
	item.text = "Menu Item 1";
	item.onclick = "js:menu_clicked";
	item.onfocuslost = "js:menu_focuslost";
	item.onfocusgain = "js:menu_focusgain";	
	areas.push(item);
	
	var item = new LayoutArea();
	item.type = "text.button";
	item.id = "menu2";
	item.background="FF331133";
	item.location= "0.0,0.0,0.0";
	item.bounds="2.2,0.3";
	item.display = "hud";
	item.text = "Menu Item 2";
	item.onclick = "js:menu_clicked";
	item.onfocuslost = "js:menu_focuslost";
	item.onfocusgain = "js:menu_focusgain";	
	areas.push(item);
	
	var item = new LayoutArea();
	item.type = "text.button";
	item.id = "menu3";
	item.background="FF331133";
	item.location= "0.0,0.6,0.0";
	item.bounds="2.2,0.3";
	item.display = "hud";
	item.text = "Menu Item 3";
	item.onclick = "js:menu_clicked";
	item.onfocuslost = "js:menu_focuslost";
	item.onfocusgain = "js:menu_focusgain";
	areas.push(item);
	
	
	var item = new LayoutArea();
	item.type = "text.label";
	item.location= "0.0,1.2,0.0";
	item.bounds="2.2,0.3";
	item.id = "menutext";	
	item.display = "hud";
	item.text = "(........)";
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
	areaExit.onclick = 'js:coords_exit';
    areas.push(areaExit);
    
	Q.layout.add_("worldhud", areas);
	// show page
	Q.layout.show_("worldhud");	
	
	
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

// simulate press by scaling area
function menu_focusgain(area,index)
{
	Q.startUpdate();
	Q.layout.areaSetScale(area,'0.9,0.9');
	Q.sendUpdate();
}

//simulate release by scaling back area
function menu_focuslost(area,index)
{
	Q.startUpdate();
	Q.layout.areaSetScale(area,'1.0,1.0');
	Q.sendUpdate();
}

function menu_clicked(area,index)
{
	Q.startUpdate();
	Q.layout.areaSetText('menutext',area + ' clicked');
	Q.sendUpdate();	
}


setuplayout();
