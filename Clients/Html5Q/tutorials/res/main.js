Q.env.set('textparam','0.005,0.01,0.005,0.001,0.0').now();

var MenuArea = function(){};
MenuArea.prototype = new LayoutArea;
MenuArea.prototype.onfocusgain = "js:menuFocusGain";
MenuArea.prototype.background = "FF553333";
MenuArea.prototype.display = "hud";
MenuArea.prototype.bounds = '1.4,0.2';
MenuArea.prototype.layout = "hor";
MenuArea.prototype.size = 22;
MenuArea.prototype.onfocuslost = "js:menuFocusLost";
MenuArea.prototype.constructor = MenuArea;

var testnames = [ "Coordinate system",
                  "World and Hud display",
                  "Coords snaping",
                  "Menu example",
                  "Cards example",
                  "Texts example",
                  "Simple objects",
                  "Camera operations",
                  "Area Pages",
                  "Grid areas",
                  "Matrix example",
                  "Screen color",
                  "Lists",
                  "Anims",
                  "Textures"];

var testlinks = ["examples/coordinates.js",
                 "examples/worldhudsystem.js",
                 "examples/cameracoords.js",
                 "examples/menu.js",
                 "examples/cards.js",
                 "examples/dyntexts.js",
                 "examples/objects.js",
                 "examples/camera.js",
                 "examples/pages.js",
                 "examples/sgrid.js",
                 "examples/matrixeff.js",
                 "examples/animscreen.js",
                 "examples/lists.js",
                 "examples/anims.js",
                 "examples/textures.js"];

function main_loadresources()
{
	var text = new Texture();
	text.name = 'back';
	text.file = 'textures/back.png';
	
	var text2 = new Texture();
	text2.name = 'icons';
	text2.file = 'textures/images.png';

	var text3 = new Texture();
	text3.name = 'qtext';
	text3.file = 'textures/qtext.png';
	
	var textures = new Array();
	textures.push(text);
	textures.push(text2);
	textures.push(text3);
	Q.textures.add(textures).now();
	

	var model = new Model();
	model.name = 'icons';
	model.template = 'background';
	model.texture = 'icons;8,8';
	model.submodels = '64';
	
	var model1 = new Model();
	model1.name = 'cards';
	model1.template = 'card52';
	model1.texture = 'icons;8,8';
	model1.submodels = '64,24';
	
	var models = new Array();
	models.push(model);
	models.push(model1);
	Q.models.add(models).now();
	
	/*
	Q.startUpdate();
 
    Q.models.newFromTemplate('icons', 'background');
    Q.models.setTexture('icons','icons','8,8');
    Q.models.setSubmodels('icons','64');
    Q.models.create('icons');
    
    Q.models.newFromTemplate("cards", "card52");
    Q.models.setTexture("cards","icons","8,8");
    Q.models.setSubmodels("cards","64,24");
    Q.models.create("cards");
    
	Q.sendUpdate();*/
}

function main_load()
{
    var x1 = Q.layout.worldxmin;
    var x2 = Q.layout.worldxmax;    
    var y1 = Q.layout.worldymin;
    var y2 = Q.layout.worldymax;
    var w = x2-x1;
    var h = y2-y1;
    
	// add areas
	var areas = new Array();

	var areaBack = new LayoutArea();
	areaBack.type = 'layout.back';
	areaBack.location= '0,0,'+w+','+h+',-0.0';
	areaBack.background = 'FFFFFFFF,back';
	areas.push(areaBack);

	var title = new LayoutArea();
	title.type = 'text.label';
	title.location = '0,1.1';
	title.bounds = '2.0,0.2';
	title.display = "hud";
	title.text = 'Select test and click to run';
	title.background = "FFAA3333";
	areas.push(title);
	
	var menu = new LayoutArea();
	menu.type = 'table.list';
	menu.location= '-0.0,0.0,0.0'
	menu.bounds = "2.0,2.0";
	menu.display = "hud";
	menu.background = "88553333";
	menu.size = testlinks.length + "," + "11,1";
	menu.items = "";
	for (var a=0; a< testnames.length; a++)
	{
		menu.items += "[t]"+PadDigits2(testnames[a],20," ")+",";
	}
	
	menu.onclick = "js:menu_loadtutorial";
	areas.push(menu);

	
	Q.layout.add('mainmenu', areas).now();

	// show page
	Q.layout.show('mainmenu').now();
}

function menuFocusGain(area,index)
{
	console.log('gain');
	Q.startUpdate();
	Q.layout.areaSetScale(area,'0.9,0.9');
	Q.sendUpdate();
}

function menuFocusLost(area,index)
{
	Q.startUpdate();
	Q.layout.areaSetScale(area,'1.0,1.0');
	Q.sendUpdate();
}

function menu_loadtutorial(area, id, delay , loc, dist)
{
	// clear
	console.log( dist );
	//Q.layout.hide_('mainmenu');
	if (id >= 0 && delay <500 && dist < 0.01 )
	{
		Q.layout.hide('mainmenu').now();
		Q.load(testlinks[id]).now();
	}
}

function navigate_exit()
{
	test_clear();
	main_load();
}


main_loadresources();
main_load();

/*


Q.evals(1000, "stdouttest();").now();
function stdouttest()
{
	for (var a =0; a< 20; a++)
	{
		Q.layout.println(" test line " + a);
	}
	
}

*/
