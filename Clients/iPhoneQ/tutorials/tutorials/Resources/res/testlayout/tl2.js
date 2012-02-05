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

testname = "testlayouttext";

function testlayout_loadresources()
{
//	Q.startUpdate();
	//Q.textures.newFromFile("back","back.png");
//	Q.sendUpdate();
}

function testlayout_clear()
{
}

function testlayout_load()
{
	// add areas
	var areas = new Array();

	var areaBack = new LayoutArea();
	areaBack.type = "layout.back";
	areaBack.location= "0,0,6.4,6.4,-0.1";
	areaBack.background = "FF666666,back";
	areas.push(areaBack);
	

	var item1 = new LayoutArea();
	item1.type = "text.label";
	item1.location= "-1.0,0.8,1.4,0.25,0.0";
	item1.text = "layout.label";
	item1.colors = "FF000000,FFFFFFFF,FFAAFFAA,FFFFFFAA";
	areas.push(item1);

	var item2 = new LayoutArea();
	item2.type = "text.label";
	item2.location= "1.0,0.8,1.4,0.25,0.0";
	item2.text = "transp back";
	item2.background = "44FFFFFF";
	areas.push(item2);
	
	var item3 = new LayoutArea();
	item3.type = "text.button";
	item3.location= "-1.0,0.4,1.4,0.25,0.0";
	item3.text = "layout.label";
	item3.colors = "FFFF0000,FFFF0000,FFFF0000,FFFF0000";
	areas.push(item3);

	var item3 = new LayoutArea();
	item3.type = "text.button";
	item3.location= "1.0,0.4,1.4,0.25,0.0";
	item3.text = "transp back";
	item3.background = "44FFFFFF";
	areas.push(item3);

	
    var item4 = new LayoutArea();
    item4.type = "text.button2";
    item4.location = "-1.0,0.0,0.8,0.25,0.0";
    item4.background = "FFDDDDDD";
    item4.items ="[t]button2,[i]icons.2";
    areas.push(item4);
    
    var item5 = new LayoutArea();
    item5.type = "text.button3";
    item5.location = "1.0,0.0,0.8,0.25,0.0";
    item5.background = "22DDDDDD";
    item5.items ="[t]button3,[i]icons.2";
    item5.colors = "FFFF0000,FFFF0000,11FF00AA,11FF00AA";
    areas.push(item5);
    
    
    var item6 = new LayoutArea();
    item6.type = "text.mline";
    item6.location = "-1.0,-0.6,1.2,0.6,0.0";
    item6.size = "4,10";
    item6.text ="This is multiline without space wrap";
    areas.push(item6);
    
    var item7 = new LayoutArea();
    item7.type = "text.mlinew";
    item7.location = "1.0,-0.6,1.2,0.6,0.0";
    item7.size = "4,10";
    item7.colors = "FFFF0000,FFFF0000,FFFF00AA,FFFF00AA";
    item7.text ="This is multiline with space wrap";
    areas.push(item7);


    var item8 = new LayoutArea();
    item8.type = "text.label";
    item8.location = "0.0,-0.0,0.25,1.4,0.0";
    item8.layout = "north-south";
    item8.background = "FFFFFFFF,icons.8.8.8";
    item8.text ="Vertical line";
    areas.push(item8);
    
    
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
