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

// create areas on different coordinates

// setup layout
function setuplayout()
{
	var areas = new Array();
	
	// add text labels
	var item0 = new LayoutArea();
	item0.type = "text.label";
	item0.background="AABBAABB";
	item0.location= "0.0,0.0,0.0";
	item0.bounds="1.2,0.2";
	item0.text = "(0.0,0.0,0.0)";
	areas.push(item0);
	
	var item1 = new LayoutArea();
	item1.type = "text.label";
	item1.background="AABBAABB";
	item1.location= "-1.0,1.0,0.5";
	item1.bounds="1.2,0.2";
	item1.text = "(-1.0,1.0,0.5)";
	areas.push(item1);
	
	var item2 = new LayoutArea();
	item2.type = "text.label";
	item2.background="AABBAABB";
	item2.location= "1.0,1.0,0.0";
	item2.bounds="1.2,0.2";
	item2.text = "(1.0,1.0,0.0)";
	areas.push(item2);
	
	var item3 = new LayoutArea();
	item3.type = "text.label";
	item3.background="AABBAABB";
	item3.location= "-1.0,-1.0,0.0";
	item3.bounds="1.2,0.2";
	item3.text = "(-1.0,-1.0,0.0)";
	areas.push(item3);
	
	var item4 = new LayoutArea();
	item4.type = "text.label";
	item4.background="AABBAABB";
	item4.location= "1.0,-1.0,-0.5";
	item4.bounds="1.2,0.2";
	item4.text = "(1.0,-1.0,-0.5)";
	areas.push(item4);
	
	

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
    
	Q.layout.add("coordareas", areas).now();
	// show page
	Q.layout.show("coordareas").now();	
	
	
}


function coords_exit(area,index)
{
	Q.startUpdate();
	Q.layout.clear("coordareas");
	Q.layout.show('mainmenu');
	Q.sendUpdate();
}



setuplayout();
