Q.env.set_('textparam','0.005,0.01,0.005,0.001,0.0');

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
	Q.textures.add_(textures);
	

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
	Q.models.add_(models);
	
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
    var x1 = Q.layout.hudxmin;
    var x2 = Q.layout.hudxmax;    
    var y1 = Q.layout.hudymin;
    var y2 = Q.layout.hudymax;

    
	// add areas
	var areas = new Array();

	var areaBack = new LayoutArea();
	areaBack.type = 'layout.back';
	areaBack.location= '0,0,6.4,6.4,-0.1';
	areaBack.background = 'FFFFFFFF,back';
	areas.push(areaBack);

	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '-0.8,1.2,0.0'
	menu.text = 'Coordinate system';
	menu.onclick = "js:menu_loadtutorial('examples/coordinates.js');";
	areas.push(menu);

	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '0.8,1.2,0.0'
	menu.text = 'World and Hud display';
	menu.onclick = "js:menu_loadtutorial('examples/worldhudsystem.js');";
	areas.push(menu);
	
	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '-0.8,0.9,0.0'
	menu.text = 'Coords snaping';
	menu.onclick = "js:menu_loadtutorial('examples/cameracoords.js');";
	areas.push(menu);

	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '0.8,0.9,0.0'
	menu.text = 'Menu example';
	menu.onclick = "js:menu_loadtutorial('examples/menu.js');";
	areas.push(menu);
	

	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '-0.8,0.6,0.0'
	menu.text = 'Cards example';
	menu.onclick = "js:menu_loadtutorial('examples/cards.js');";
	areas.push(menu);

	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '0.8,0.6,0.0'
	menu.text = 'Texts example';
	menu.onclick = "js:menu_loadtutorial('examples/dyntexts.js');";
	areas.push(menu);
	
	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '-0.8,0.3,0.0'
	menu.text = 'Simple objects';
	menu.onclick = "js:menu_loadtutorial('examples/objects.js');";
	areas.push(menu);
	
	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '0.8,0.3,0.0'
	menu.text = 'Camera operations';
	menu.onclick = "js:menu_loadtutorial('examples/camera.js');";
	//areas.push(menu);	

	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '-0.8,0.0,0.0'
	menu.text = 'Area Pages';
	menu.onclick = "js:menu_loadtutorial('examples/pages.js');";
	areas.push(menu);	
	
	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '0.8,0.0,0.0'
	menu.text = 'Grid areas';
	menu.onclick = "js:menu_loadtutorial('examples/sgrid.js');";
	areas.push(menu);

	
	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '-0.8,-0.3,0.0'
	menu.text = 'Matrix example';
	menu.onclick = "js:menu_loadtutorial('examples/matrixeff.js');";
	areas.push(menu);	

	var menu = new MenuArea();
	menu.type = 'text.label';
	menu.location= '0.8,-0.3,0.0'
	menu.text = 'Screen color';
	menu.onclick = "js:menu_loadtutorial('examples/animscreen.js');";
	areas.push(menu);	
	
	
	Q.layout.add_('mainmenu', areas);

	// show page
	Q.layout.show_('mainmenu');
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

function menu_loadtutorial(id)
{
	// clear
	Q.layout.hide_('mainmenu');
	Q.load_(id);
}

function navigate_exit()
{
	test_clear();
	main_load();
}




console.log('sadasd');

main_loadresources();
main_load();




// tutorials

// cards - placing card - moving cards

// creating items from models - placing models 
// display text, dynamic text change
// seting up pages
// moving camera , hud + 3d objects
//
// simple objects
// languages!


