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

// displays how to handle cards and card throwing
// 

// this resource is defined in main.js
// 

// setup layout
function setuplayout()
{
	var areas = new Array();
	
	// add simple table
	var item = new LayoutArea();
	item.type = "layout.back";
	item.background="FF117711";
	item.location= "0.0,0.0,0.0";
	item.bounds="2.4,1.6";
	areas.push(item);

	
	// change camera to see difference
	Q.camera.set(0,0,0, 0,-0.8,2).now();
	

	// add cards that are on table
	// 
    var areaCards1 = new LayoutArea();
    areaCards1.type = "cards.cards";
    areaCards1.size = "4,3,1";
    areaCards1.location= "-0.6,-0.5,0.01";
    areaCards1.bounds= "0.5,0.2";
    areaCards1.background = "AAFFFFFF";
    areaCards1.id  = "cards1";
    areaCards1.items = "[i]cards.18,[i]cards.19,[i]cards.20,[i]cards.21";
    areaCards1.onclick = "js:move_card1";
    areas.push(areaCards1);

    var areaCards11 = new LayoutArea();
    areaCards11.type = "cards.cards";
    areaCards11.size = "4,3,1";
    areaCards11.location= "-0.6,0.0,0.01";
    areaCards11.bounds= "0.5,0.2";
    areaCards11.id = "cards11";
    areaCards11.onclick = "js:move_card11";
    areas.push(areaCards11);
    
    
    var areaCards2 = new LayoutArea();
    areaCards2.type = "cards.inhand";
    areaCards2.size = "4,3,1";
    areaCards2.location= "0.6,-0.5,0.2";
    areaCards2.bounds= "0.5,0.2";
    areaCards2.id  = "cards2";
    areaCards2.items = "[i]cards.18,[i]cards.19,[i]cards.20,[i]cards.21";
    areaCards2.onclick = "js:move_card2";
    areaCards2.rotation = "30,0,0";
    areas.push(areaCards2);

    var areaCards21 = new LayoutArea();
    areaCards21.type = "cards.inhand";
    areaCards21.size = "4,3,1";
    areaCards21.location= "0.6,0.0,0.2";
    areaCards21.bounds= "0.5,0.2";
    areaCards21.id = "cards21";
    areaCards21.rotation = "30,180,0";
    areaCards21.onclick = "js:move_card21";
    areas.push(areaCards21);

    
    var areaCards3 = new LayoutArea();
    areaCards3.type = "cards.deckback2";
    areaCards3.size = "4";
    areaCards3.location= "0.6,0.5,0.0";
    areaCards3.bounds= "0.2,0.3";
    areaCards3.id  = "cards3";
    areaCards3.items = "[i]cards.18,[i]cards.19,[i]cards.20,[i]cards.21";
    areaCards3.onclick = "js:move_card3";
    areas.push(areaCards3);

    var areaCards31 = new LayoutArea();
    areaCards31.type = "cards.deck9";
    areaCards31.size = "4";
    areaCards31.location= "-0.6,0.5,0.0";
    areaCards31.bounds= "0.2,0.3";
    areaCards31.id = "cards31";
    areaCards31.onclick = "js:move_card31";
    areas.push(areaCards31);
    
    
    var areaCards4 = new LayoutArea();
    areaCards4.type = "cards.inhand";
    areaCards4.size = "4,3,1";
    areaCards4.location= "0.0,0.3,0.02";
    areaCards4.bounds= "0.6,0.25";
    areaCards4.id  = "cards4";
    areaCards4.items = "[i]cards.18,[i]cards.19,[i]cards.20,[i]cards.21";
    areaCards4.onfocusgain = "js:move_card4";
    areaCards4.rotation = "0,0,0";
    areaCards4.onfocuslost = "js:move_card41";
    areas.push(areaCards4);

    var areaCards41 = new LayoutArea();
    areaCards41.type = "cards.inhand";
    areaCards41.size = "4,3,1";
    areaCards41.location= "0.0,0.35,0.02";
    areaCards41.bounds= "0.6,0.25";
    areaCards41.id = "cards41";
    areaCards41.rotation = "0,0,0";
    areas.push(areaCards41);
    
    
    var areaCards1T = new LayoutArea();
    areaCards1T.type = "text.label";
    areaCards1T.location= "-0.6,-0.2,0.7,0.07,0.01";
    areaCards1T.text  = "press card";
    areas.push(areaCards1T);
    
	
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
	areaExit.onclick = 'js:cards_exit';
    areas.push(areaExit);
    
	Q.layout.add("cards", areas).now();
	// show page
	Q.layout.show("cards").now();	
	
	
}


function cards_exit(area,index)
{
	Q.startUpdate();
	Q.layout.clear("cards");
	// go to default
	Q.camera.fit( "4.0,0");
	Q.camera.fitHud( "4.0,0");
	Q.layout.show('mainmenu');
	Q.sendUpdate();
}


function move_card1(area, index)
{
	Q.startUpdate();
	Q.layout.itemMoveA("cards1" , index , "cards11", index, 'transform', 500,"");
	Q.sendUpdate();
}

function move_card11(area, index)
{
	Q.startUpdate();
	Q.layout.itemMoveA("cards11" , index , "cards1", index, 'walkhigh', 500,"");
	Q.sendUpdate();
}



function move_card2(area, index)
{
	Q.startUpdate();
	Q.layout.itemMoveA("cards2" , index , "cards21", index, 'transform', 500,"");
	Q.sendUpdate();
}

function move_card21(area, index)
{
	console.log('movecard ' + index);
	Q.startUpdate();
	Q.layout.itemMoveA("cards21" , index , "cards2", index, 'transform', 500,"");
	Q.sendUpdate();
}


function move_card3(area, index)
{
	Q.startUpdate();
	Q.layout.itemMoveA("cards3" , 3 , "cards31", 0, 'transform', 500,"");
	Q.layout.itemMoveA("cards3" , 2 , "cards31", 1, 'transform', 800,"");
	Q.layout.itemMoveA("cards3" , 1 , "cards31", 2, 'transform', 1100,"");
	Q.layout.itemMoveA("cards3" , 0 , "cards31", 3, 'transform', 1300,"");
	Q.sendUpdate();
}

function move_card31(area, index)
{
	Q.startUpdate();
	Q.layout.itemMoveA("cards31" , 3 , "cards3", 0, 'walkhigh', 500,"");
	Q.layout.itemMoveA("cards31" , 2 , "cards3", 1, 'walkhigh', 800,"");
	Q.layout.itemMoveA("cards31" , 1 , "cards3", 2, 'walkhigh', 1100,"");
	Q.layout.itemMoveA("cards31" , 0 , "cards3", 3, 'walkhigh', 1300,"");
	Q.sendUpdate();
}


function move_card4(area, index)
{
	Q.startUpdate();
	Q.layout.itemMoveA("cards4" , index , "cards41", index, 'transform', 500,"");
	Q.sendUpdate();
}

function move_card41(area, index)
{
	Q.startUpdate();
	Q.layout.itemMoveA("cards41" , index , "cards4", index, 'transform', 500,"");
	Q.sendUpdate();
}



setuplayout();

var c = 0;
function setRotation()
{
	Q.startUpdate();
	Q.layout.areaSetRotation('cards2','70,'+(c*10)+',0');
	c++;
	Q.sendUpdate();
	Q.evals(200,"setRotation();").now();
}

