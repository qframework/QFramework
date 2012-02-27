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
	item.id = "menutext1";
	item.background="55331133";
	item.location= "0.0,-0.6,0.0";
	item.bounds="2.2,0.3";
	item.display = "hud";
	item.text = "Delete texture 1";
	item.onclick = "js:delete_texture('text1');";
	item.onfocuslost = "js:menu_focuslost";
	item.onfocusgain = "js:menu_focusgain";	
	areas.push(item);
	
	var item = new LayoutArea();
	item.type = "text.button";
	item.id = "menutext2";
	item.background="55331133";
	item.location= "0.0,0.0,0.0";
	item.bounds="2.2,0.3";
	item.display = "hud";
	item.text = "Delete texture 2";
	item.onclick = "js:delete_texture('text2');";
	item.onfocuslost = "js:menu_focuslost";
	item.onfocusgain = "js:menu_focusgain";	
	areas.push(item);
	
	var item = new LayoutArea();
	item.type = "text.button";
	item.id = "menutext3";
	item.background="55331133";
	item.location= "0.0,0.6,0.0";
	item.bounds="2.2,0.3";
	item.display = "hud";
	item.text = "Reload textures";
	item.onclick = "js:reload_textures();";
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
	areaExit.onclick = 'js:textures_exit';
    areas.push(areaExit);
    
	Q.layout.add("textures", areas).now();
	// show page
	Q.layout.show("textures").now();	
	
	
}


function textures_exit(area,index)
{
	Q.startUpdate();
	Q.textures.remove("text1");
	Q.textures.remove("text2");
	Q.objects.remove("cube1");

	Q.layout.clear("textures");
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


// load textures 
function loadObjects()
{
	
	Q.startUpdate();
	// load texture
	Q.textures.newFromFile("text1","textures/text1.png");
	Q.textures.newFromFile("text2","textures/text2.png");
	// create cube
	Q.objects.create("cube1","cube");
	//set its texture
	Q.objects.texture("cube1","text2");
	//show it on screen
	Q.objects.place("cube1","0,0,0.5");
	Q.objects.scale("cube1","0.5,0.5,0.5");
	Q.objects.state("cube1","visible");
	Q.anim.rotate("cube1","360,360,0","5000,inf","");	
	Q.sendUpdate();
	
	var areas = new Array();
	var backArea = new LayoutArea();
	backArea.type = "layout.back";
	backArea.id = "texturesback";
	backArea.location = "0,1.4,0";
	backArea.bounds = "6,6";
	backArea.background = "FFFFFFFF,text1";
	areas.push(backArea);
	Q.layout.add("textures", areas).now();
	
}

function delete_texture(name)
{
	Q.textures.remove(name).now();
}


var swap = 0;
function reload_textures()
{
	Q.startUpdate();
	// load texture
	if (swap % 2 == 0)
	{
		Q.textures.newFromFile("text2","textures/text1.png");
		Q.textures.newFromFile("text1","textures/text2.png");
	}else
	{
		Q.textures.newFromFile("text1","textures/text1.png");
		Q.textures.newFromFile("text2","textures/text2.png");
	}
	
	swap ++;
	
	Q.objects.texture("cube1","text2");
	Q.layout.areaSetBackground("texturesback" ,"FFFFFFFF,text1" );
	Q.sendUpdate();
}

loadObjects();
setuplayout();

Q.camera.set(0,0,0 , 0,-4.5,4.0).now();
