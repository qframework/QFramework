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

testname = "testtable";

function test_loadresources()
{
//	Q.startUpdate();
	//Q.textures.newFromFile("back","back.png");
//	Q.sendUpdate();
}

function test_clear()
{
	
}

function test_loadlayout()
{
	// add areas
	var areas = new Array();

	var areaBack = new LayoutArea();
	areaBack.type = "layout.back";
	areaBack.location= "0,0,6.4,6.4,-0.1";
	areaBack.background = "FF666666";
	areas.push(areaBack);

	var grid = new LayoutArea();
	grid.type = "table.sgrid";
	grid.id = "helpgrid";
	grid.location="-0.0,-0.6,0.0";
	grid.bounds = "1.2,1.2";
	grid.size = "9,3,3"; 
	grid.items = "[i]icons.0,[i]icons.1,[i]icons.2,"; 
	grid.items += "[i]icons.24,[i]icons.25,[i]icons.26,";
	grid.items += "[i]icons.16,[i]icons.17,[i]icons.18";
	areas.push(grid);

	var stack = new LayoutArea();
	stack.type = "table.sgrid";
	stack.id = "stack";
	stack.location="1.3,-0.0,0.01";
	stack.bounds = "0.5,2.0";
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
	
	areas.push(stack);

	
	
	Q.layout.add_(testname, areas);

	// show page
	Q.layout.show_(testname);
}

function test_start()
{
	
}
function test_clear()
{
	Q.startUpdate();
	Q.layout.clear(testname);
	Q.sendUpdate();
}


test_loadresources();
test_loadlayout();

