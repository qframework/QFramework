// preset with user IP to server for which we will connect

// we will always also leave exit button to disconnect from server and go back to main 
// screen
Q.env.set('textparam','0.005,0.01,0.005,0.001,0.0').now();

var text = new Texture();
text.name = 'images';
text.file = 'images.png';

var textures = new Array();
textures.push(text);
Q.textures.add(textures).now();

var model1 = new Model();
model1.name = 'images';
model1.template = 'card52';
model1.texture = 'images;8,8';
model1.submodels = '64,32';

var models = new Array();
models.push(model1);
Q.models.add(models).now();

var userName = "user" + Math.floor(Math.random() * 10000); 

var servers= [ "127.0.0.1:8080" , "www.teluminfo.hr:9090"]; 
var curraddr = servers[0];

function setupLayout()
{
	// list of servers  local / public
	
	var areas = new Array();
	

	// text box - connect button
	var area = new LayoutArea();
	area.type = "table.list";
	area.location = "0,-0.5,0";
	area.display = "hud";
	area.bounds = "2.6,1.0";
	area.size = "10,5,1";
	area.items = "";
	area.background = "AA222222";
	for (var a=0; a< servers.length; a++)
	{
		area.items += "[t]"+servers[a]+",";
	}
	area.foreground = "FFAABBCC,white";
	area.border = "thinrect";
	area.scrollers = "-0.4";
	area.onclick = "js:onFillText";
	areas.push(area);
	
	//add edit box
	var area = new LayoutArea();
	area.type = "text.label";
	area.id = "serveraddr";
	area.location = "0,1.0,0";
	area.display = "hud";
	area.bounds = "2.0,0.3";
	area.foreground = "FFAABBCC,white";
	area.background = "AA222222";
	area.border = "thinrect";
	area.text = "127.0.0.1:8080";
	area.onclick = "js:onEdit";
	areas.push(area);

	var area = new LayoutArea();
	area.type = "text.button";
	area.id = "connect";
	area.onfocusgain = "js:menuFocusGain";
	area.onfocuslost = "js:menuFocusLost";
	area.location = "0,0.65,0";
	area.display = "hud";
	area.bounds = "1.0,0.2";
	area.onclick = "js:connectToServer();";
	area.foreground = "FFAABBCC";
	area.background = "AA222222";
	area.border = "thinrect";
	area.text = "  Connect  ";
	area.onclick = "js:connectToServer";
	areas.push(area);

	
	Q.layout.add("mainpage", areas).now();
	
	
	// main control / exit window
	var areas = new Array();
	
	Q.layout.add("exitpage", areas).now();
	
	Q.layout.show("mainpage").now();
}


function onFillText(area, id)
{
	curraddr = id;
	Q.layout.areaSetText("serveraddr" , servers[id]).now();
}

function onEdit()
{
	Q.layout.editText(curraddr , "onEditCb").now();
}

function onEditCb(value, finish)
{
	Q.layout.areaSetText("serveraddr" , value).now();
	
	if (finish == 1 && value != undefined && value.length > 0 )
	{
		curraddr = value;
	}
	
}


function connectToServer()
{
	Q.layout.areaSetText("connect" , "Connecting").now();
	Q.evals(10, "doConnect();").now();

}

function doConnect()
{
	Q.connect.connect( curraddr, "onConnect" ).now();
}

function onJoin(result)
{
    if (result == 1)
    {
    	Q.layout.hide("mainpage").now();    
    }
}

function onConnect(result)
{
	console.log(" onConnect " + result);
    if (result == 1)
    {
    	Q.connect.join("1", userName , "onJoin").now();
    }else
    {
    	Q.layout.areaSetText("connect" , "  Connect  ").now();
    }
    
}

var currmessage = "Click to say";

function editMessage()
{
	Q.layout.editText(currmessage , "onEditMsgCb").now();
}

function onEditMsgCb(value, finish)
{
	Q.layout.areaSetText("message" , value).now();
	
	if (finish == 1 && value != undefined && value.length > 0 )
	{
		currmessage = value;
		Q.connect.send(value).now();
	}
	
}


function add_chatLayout()
{
	var areas = new Array();

	var x1 = Q.layout.hudxmin;
    var x2 = Q.layout.hudxmax;    
    var y1 = Q.layout.hudymin;
    var y2 = Q.layout.hudymax;
    var w = x2-x1;
    var h = y2-y1;
	
	var area = new LayoutArea();
	area.type = "text.button";
	area.id = "message";
	area.location = (x2-1.0)+","+(y2-0.12)+",0";
	area.display = "hud";
	area.bounds = "2.0,0.2";
	area.onclick = "js:editMessage();";
	area.background = "FF227722";
	area.text = currmessage;
	area.onclick = "js:editMessage";
	areas.push(area);
    
	var area = new LayoutArea();
	area.type = "text.button";
	area.location = (x1+1.0)+","+(y2-0.12)+",0";
	area.display = "hud";
	area.bounds = "2.0,0.2";
	area.onclick = "js:editMessage();";
	area.background = "FF772222";
	area.text = " select test to start";
	areas.push(area);
	
	
	Q.layout.add("serverb", areas).now();
	// show again to update new layouts
	Q.layout.show("serverb").now();
	
}

function menuFocusGain(area,index)
{
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

function start_test(area, index)
{
	if (index >= 0)
	{
		var room = index +2;
		Q.connect.join(room, userName , "onJoinTest").now();
	}
	
}


function onJoinTest(result)
{
    if (result == 1)
    {
    }
}


setupLayout();


