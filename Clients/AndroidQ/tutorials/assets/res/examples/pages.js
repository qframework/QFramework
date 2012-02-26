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
	var y2 = Q.layout.hudymax;
	var areas = new Array();
	
	// add text labels
	var item = new LayoutArea();
	item.type = "text.button";
	item.id = "pagemenu1";
	item.background="FF331133";
	item.location= "-0.7,"+(y2-0.11)+",0.0";
	item.bounds="1.2,0.2";
	item.display = "hud";
	item.text = "Show page1";
	item.onclick = "js:pages_action";
	item.onfocuslost = "js:menu_focuslost";
	item.onfocusgain = "js:menu_focusgain";	
	areas.push(item);
	
	var item = new LayoutArea();
	item.type = "text.button";
	item.id = "pagemenu2";
	item.background="FF331133";
	item.location= "0.7,"+(y2-0.11)+",0.0";
	item.bounds="1.2,0.2";
	item.display = "hud";
	item.text = "ShowPage 2";
	item.onclick = "js:pages_action";
	item.onfocuslost = "js:menu_focuslost";
	item.onfocusgain = "js:menu_focusgain";	
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
    
	Q.layout.add("areapages", areas).now();
	// show page
	Q.layout.show("areapages").now();	

	
	var areas = new Array();
	var item = new LayoutArea();
	item.type = "layout.back";
	item.background="FF113333";
	item.location= "-0.7,-0.3,0.01";
	item.bounds="1.4,0.6";
	item.display = "hud";
	areas.push(item);
		
	var item = new LayoutArea();
	item.type = "text.label";
	item.location= "-0.7,-0.3,0.1";
	item.bounds="1.2,0.2";
	item.display = "hud";
	item.text = "Page1";
	areas.push(item);

	Q.layout.add("pages1", areas).now();
	
	
	var areas = new Array();
	var item = new LayoutArea();
	item.type = "layout.back";
	item.background="FF113333";
	item.location= "0.7,-0.3,0.01";
	item.bounds="1.4,0.6";
	item.display = "hud";
	areas.push(item);
		
	var item = new LayoutArea();
	item.type = "text.label";
	item.location= "0.7,-0.3,0.1";
	item.bounds="1.2,0.2";
	item.display = "hud";
	item.text = "Page2";
	areas.push(item);

	Q.layout.add("pages2", areas).now();
	
}


function coords_exit(area,index)
{
	Q.startUpdate();
	Q.layout.clear("areapages");
	Q.layout.clear("pages1");
	Q.layout.clear("pages2");	
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

var typecounter = 0;
var types = new Array("left" , "right", "top", "bottom", "scaleout", "scalein", "swirlin", "swirlout");
var page1status = 0;
var page2status = 0;

function pages_action(area, index)
{
	
	if (area == "pagemenu1")
	{
		page1status++;
		if (page1status % 2== 1)
		{
			Q.startUpdate();
			Q.layout.areaSetText(area,"HidePage 1");
			Q.layout.showAnim("pages1", types[typecounter]+",1000");
			Q.sendUpdate();
		}else
		{
			Q.startUpdate();
			Q.layout.areaSetText(area,"ShowPage 1");
			Q.layout.hideAnim("pages1", types[typecounter]+",1000");
			Q.sendUpdate();
			
		}
		
		
	}else if (area == "pagemenu2")
	{
		page2status++;
		if (page2status % 2== 1)
		{
			Q.startUpdate();
			Q.layout.areaSetText(area,"HidePage 2");
			Q.layout.showAnim("pages2", types[typecounter]+",1000");
			Q.sendUpdate();
		}else
		{
			Q.startUpdate();
			Q.layout.areaSetText(area,"ShowPage 2");
			Q.layout.hideAnim("pages2", types[typecounter]+",1000");
			Q.sendUpdate();
			
		}		
	}

	typecounter ++;
	if (typecounter >= types.length)
	{
		typecounter = 0;
	}
	
	
	// lock touch until transition is over
	Q.util.touchonoff_(1000);
	
}


setuplayout();
