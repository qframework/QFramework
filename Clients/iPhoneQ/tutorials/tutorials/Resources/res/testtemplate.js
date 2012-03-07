testname = "testtemplate";

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

	var menu1 = new LayoutArea();
	menu1.type = "text.label";
	menu1.location= "0.0,0.0,2.4,0.25,0.0";
	menu1.background = "FF553333";
	menu1.display = "hud";
	menu1.text = "test1: Q.event_";
	menu1.onclick = "js:"+sendevent;
	menu1.onfocusgain = "js:menuFocusGain";
	menu1.onfocuslost = "js:menuFocusLost";    		
	areas.push(menu1);
	
	
	var menu2 = new LayoutArea();
	menu2.type = "text.label";
	menu2.location= "0.0,0.3,2.4,0.25,0.0";
	menu2.background = "FF553333";
	menu2.display = "hud";
	menu2.text = "test2: Q.event_";
	menu2.onclick = "js:sendevent2";
	menu2.onfocusgain = "js:menuFocusGain";
	menu2.onfocuslost = "js:menuFocusLost";    		
	areas.push(menu2);
	
	var menu3 = new LayoutArea();
	menu3.type = "text.label";
	menu3.location= "0.0,0.6,2.4,0.25,0.0";
	menu3.background = "FF553333";
	menu3.display = "hud";
	menu3.text = "test3: Q.evals";
	menu3.onclick = "js: tq1_exec();";
	menu3.onfocusgain = "js:menuFocusGain";
	menu3.onfocuslost = "js:menuFocusLost";    		
	areas.push(menu3);

	
	var menu4 = new LayoutArea();
	menu4.type = "text.label";
	menu4.location= "0.0,-0.3,2.4,0.25,0.0";
	menu4.background = "FF553333";
	menu4.display = "hud";
	menu4.text = "test4: Q.load_";
	menu4.onclick = "js: tq1_load();";
	menu4.onfocusgain = "js:menuFocusGain";
	menu4.onfocuslost = "js:menuFocusLost";    		
	areas.push(menu4);
	
	
	var menu5 = new LayoutArea();
	menu5.type = "text.label";
	menu5.location= "0.0,-0.6,2.4,0.25,0.0";
	menu5.background = "FF553333";
	menu5.display = "hud";
	menu5.text = "test4: Q.include_";
	menu5.onclick = "js: tq1_include();";
	menu5.onfocusgain = "js:menuFocusGain";
	menu5.onfocuslost = "js:menuFocusLost";    		
	areas.push(menu5);
	
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

