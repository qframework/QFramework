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

testname = "testcards";

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
	areaBack.location= "0,0,-0.1";
	areaBack.bounds = "6.4,6.4";
	areaBack.background = "FF225522";
	areas.push(areaBack);

    var areaCards1 = new LayoutArea();
    areaCards1.type = "cards.inhand";
    areaCards1.background = "AAFFFFFF";
    areaCards1.size = "4,4,1";
    areaCards1.location= "-1.2,1.0,0.2";
    areaCards1.bounds= "1.2,0.6";
    areaCards1.id  = "cards1";
    areaCards1.items = "[i]cards.18,[i]cards.19,[i]cards.20,[i]cards.21";
    areas.push(areaCards1);

    var areaCards11 = new LayoutArea();
    areaCards11.type = "cards.inhand2";
    areaCards11.size = "4,3,1";
    areaCards11.location= "-1.2,0.4,0.2";
    areaCards11.bounds= "1.2,0.6";
    areaCards11.id  = "cards11";
    areaCards11.rotation = "0,0,0";
    areaCards11.scale = "1,1,1";
    areaCards11.items = "[i]cards.18,[i]cards.19,[i]cards.20,[i]cards.21";
    areas.push(areaCards11);

    var areaCards2 = new LayoutArea();
    areaCards2.type = "cards.inhand";
    areaCards2.size = "8,4,1";
    areaCards2.location= "0.6,-1.0,0.2";
    areaCards2.bounds = "2.0,0.6";
    areaCards2.items = "[i]cards.26,[i]cards.27,[i]cards.28,[i]cards.29,[i]cards.26,[i]cards.27,[i]cards.28,[i]cards.29";
    areas.push(areaCards2);
    
    var areaCards21 = new LayoutArea();
    areaCards21.type = "cards.inhand";
    areaCards21.size = "8,6,1";
    areaCards21.location= "0.6,-0.4,0.2";
    areaCards21.bounds = "2.0,0.6";
    areaCards21.rotation = "-30,0,0";
    areaCards21.scale = "1.1,1.1,1";    
    areaCards21.items = "[i]cards.26,[i]cards.27,[i]cards.28,[i]cards.29,[i]cards.26,[i]cards.27,[i]cards.28,[i]cards.29";
    areas.push(areaCards21);
    
    
    var areaCards3 = new LayoutArea();
    areaCards3.type = "cards.deck";
    areaCards3.size = "8";
    areaCards3.location= "-1.6,-1.0,0.02";
    areaCards3.bounds = "0.5,0.75";
    areaCards3.items = "[i]cards.16,[i]cards.16,[i]cards.16,[i]cards.16,[i]cards.16,[i]cards.16,[i]cards.16,[i]cards.16";
    areas.push(areaCards3);

    var areaCards31 = new LayoutArea();
    areaCards31.type = "cards.deck4";
    areaCards31.size = "8";
    areaCards31.location= "-1.0,-1.0,0.02";
    areaCards31.bounds = "0.5,0.75";
    areaCards31.items = "[i]cards.16,[i]cards.16,[i]cards.16,[i]cards.16,[i]cards.16,[i]cards.16,[i]cards.16,[i]cards.16";
    areas.push(areaCards31);
    
    var areaCards4 = new LayoutArea();
    areaCards4.type = "cards.cards";
    areaCards4.size = "4,3,1";
    areaCards4.layout = "west-east";
    areaCards4.location= "1.2,1.0,0.02";
    areaCards4.bounds = "1.2,0.6";
    areaCards4.items = "[i]cards.18,[i]cards.19,[i]cards.20,[i]cards.21";
    areas.push(areaCards4);    
    
    var areaCards41 = new LayoutArea();
    areaCards41.type = "cards.cards2";
    areaCards41.size = "4,3,1";
    areaCards41.layout = "west-east";
    areaCards41.location= "1.2,0.4,0.02";
    areaCards41.bounds = "1.2,0.6";
    areaCards41.items = "[i]cards.18,[i]cards.19,[i]cards.20,[i]cards.21";
    areas.push(areaCards41);
    
    
    
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

