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

testname = "testlayout";

function testlayout_loadresources()
{
//	Q.startUpdate();
	//Q.textures.newFromFile("back","back.png");
//	Q.sendUpdate();
}


function testlayout_load()
{
	// add areas
	var areas = new Array();

	var areaBack = new LayoutArea();
	areaBack.type = "layout.back";
	areaBack.location= "0,0,6.4,6.4,-0.1";
	areaBack.background = "FF111111,back";
	areas.push(areaBack);
	

	var menu1 = new MenuArea();
	menu1.type = "text.label";
	menu1.location= "0.0,0.0,2.4,0.25,0.0";
	menu1.text = "layout.text";
	menu1.onclick = "js:menu_gotest('testlayout/tl2.js');";
	areas.push(menu1);

	var menu2 = new MenuArea();
	menu2.type = "text.label";
	menu2.location= "0.0,0.3,2.4,0.25,0.0";
	menu2.text = "layout.table";
	menu2.onclick = "js:menu_gotest('testlayout/tl3.js');";
	areas.push(menu2);

	var menu3 = new MenuArea();
	menu3.type = "text.label";
	menu3.location= "0.0,-0.3,2.4,0.25,0.0";
	menu3.text = "layout.cards";
	menu3.onclick = "js:menu_gotest('testlayout/tl4.js');";
	areas.push(menu3);
	
	var menu4 = new MenuArea();
	menu4.type = "text.label";
	menu4.location= "0.0,-0.6,2.4,0.25,0.0";
	menu4.text = "layout.layout";
	menu4.onclick = "js:menu_gotest('testlayout/tl5.js');";
	areas.push(menu4);

	var menu5 = new MenuArea();
	menu5.type = "text.label";
	menu5.location= "0.0,0.6,2.4,0.25,0.0";
	menu5.text = "layout pages";
	menu5.onclick = "js:menu_gotest('testlayout/tl6.js');";
	areas.push(menu5);	
	
	Q.layout.add_(testname, areas);

	// show page
	Q.layout.show_(testname);
}


function test_clear()
{
	Q.startUpdate();
	Q.layout.clear(testname);
	Q.sendUpdate();
}


testlayout_loadresources();
testlayout_load();
