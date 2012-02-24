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

testname = "testq1";

var sendevent = "Q.event_(1,1000,'event after 1 sec');";


function test_loadresources()
{
//	Q.startUpdate();
	//Q.textures.newFromFile("back","back.png");
//	Q.sendUpdate();
}

function test_clear()
{
	Q.startUpdate();
	Q.layout.areaClear('desc1');
	Q.layout.areaClear('desc2');
	Q.layout.clear(testname);
	Q.sendUpdate();
	
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

	var menu1 = new MenuArea();
	menu1.type = "text.label";
	menu1.location= "0.0,0.0,2.4,0.25,0.0";
	menu1.text = "test1: Q.event_";
	menu1.onclick = "js:"+sendevent;
	areas.push(menu1);
	
	
	var menu2 = new MenuArea();
	menu2.type = "text.label";
	menu2.location= "0.0,0.3,2.4,0.25,0.0";
	menu2.text = "test2: Q.event_";
	menu2.onclick = "js:sendevent2";
	areas.push(menu2);
	
	var menu3 = new MenuArea();
	menu3.type = "text.label";
	menu3.location= "0.0,0.6,2.4,0.25,0.0";
	menu3.text = "test3: Q.evals";
	menu3.onclick = "js: tq1_exec();";
	areas.push(menu3);

	
	var menu4 = new MenuArea();
	menu4.type = "text.label";
	menu4.location= "0.0,-0.3,2.4,0.25,0.0";
	menu4.text = "test4: Q.load_";
	menu4.onclick = "js: tq1_load();";
	areas.push(menu4);
	
	
	var menu5 = new MenuArea();
	menu5.type = "text.label";
	menu5.location= "0.0,-0.6,2.4,0.25,0.0";
	menu5.text = "test4: Q.include_";
	menu5.onclick = "js: tq1_include();";
	areas.push(menu5);
	
	
	
	
	Q.layout.add_(testname, areas);

	// show page
	Q.layout.show_(testname);
}

function test_start()
{
	
}

function test_onData(id , data)
{
	Q.startUpdate();
	Q.layout.areaSetText('desc1' , 'Event:'+id);
	Q.layout.areaSetText('desc2' , 'Data:'+data);
	Q.sendUpdate();
}

function sendevent2()
{
	Q.event_(2,2000,'event after 2 sec');
}


function tq1_exec()
{
	Q.exec_(500, "tq1_onexec('test exec data');" );	
}

function tq1_onexec(data)
{
	Q.startUpdate();
	Q.layout.areaSetText('desc1' , 'Delayed exec');
	Q.layout.areaSetText('desc2' , data);
	Q.sendUpdate();
	
}


function tq1_include()
{
	Q.startUpdate();
	Q.layout.areaSetText('desc1' , 'Q.include - include once');
	Q.layout.areaSetText('desc2' , '');
	Q.sendUpdate();
	
	Q.include_('testq/tq1_inc.js')

	
}

function tq1_load()
{

	Q.startUpdate();
	Q.layout.areaSetText('desc1' , 'Q.load - loads script ');
	Q.layout.areaSetText('desc2' , '');
	Q.sendUpdate();
	
	Q.load_('testq/tq1_load.js')

}




test_loadresources();
test_loadlayout();

Q.handlers.onEvent.push(test_onData);

