function game_info()
{
    var info;
	info =  "gname:test_area_1\t";
	info += "script:test_area_1.js\t";
	info += "players:4\t";
	info += "status:0\t";
    print("JS:game_info:" + info );
	return info;
}


function client_onConnected(userID)
{
    print("JS:client_onConnected " + userID);
    serverko.clientSpectate(userID , 1);
    layout.println("test_area_1 test" );
    layout.println("First row - four different 'text' areas" );
    layout.println("Second row - four different 'label' areas" );
}


function configureLayout()
{
    print("JS:configureLayout");
    
    layout.gtype   = "board";
    layout.players = 1;
    layout.canvasw = 180;
    layout.canvash = 180;
    layout.background = colors.get("black");
    layout.pageid = "page1";
    
    var areas = new Array();

    var areaDef1 = new layout_area();
    areaDef1.type = "text";
    areaDef1.id = 01;
    areaDef1.location="8,8,16,16";
    areaDef1.text = "Area 1 ";     //name
    areaDef1.foreground=colors.get("blue");
    areaDef1.font = "small,normal";
    areaDef1.background = colors.get("white");
    areaDef1.border = "rect";   // color - move into field?? render border separatly from text area?
    areas.push(areaDef1);


    var areaDef2 = new layout_area();
    areaDef2.type = "text";
    areaDef2.id = 02;
    areaDef2.location="32,8,24,24";
    areaDef2.text = "Area 2 ";     //name
    areaDef2.foreground=colors.get("white");
    areaDef2.font = "medium,italic";
    areaDef2.background = colors.get("red");
    areaDef2.border = "none";   // color - move into field?? render border separatly from text area?
    areas.push(areaDef2);


    var areaDef3 = new layout_area();
    areaDef3.type = "text";
    areaDef3.id = 03;
    areaDef3.location="64,8,32,32";
    areaDef3.text = "Text Area 3 long text no background";     //name
    areaDef3.foreground=colors.get("yellow");
    areaDef3.font = "medium,bold";
    areaDef3.border = "none";   // color - move into field?? render border separatly from text area?
    areas.push(areaDef3);

    var areaDef4 = new layout_area();
    areaDef4.type = "text";
    areaDef4.id = 04;
    areaDef4.location="104,8,64,64";
    areaDef4.text = "A4";     //name
    areaDef4.foreground=colors.get("blue");
    areaDef4.font = "large,bold";
    areaDef4.background = colors.get("red");
    areaDef4.border = "round";   // color - move into field?? render border separatly from text area?
    areas.push(areaDef4);



    var areaDef10 = new layout_area();
    areaDef10.type = "label";
    areaDef10.id = 10;
    areaDef10.location="8,56,64,64";
    areaDef10.text = "Area 1 ";     //name
    areaDef10.foreground=colors.get("aliceblue");
    areaDef10.font = "large,italic";
    areaDef10.background = colors.get("darkgreen");
    areaDef10.border = "rect";   // color - move into field?? render border separatly from text area?
    areaDef10.layout = "south-west";
    areas.push(areaDef10);


    var areaDef20 = new layout_area();
    areaDef20.type = "label";
    areaDef20.id = 20;
    areaDef20.location="80,88,32,32";
    areaDef20.text = "Area 2 ";     //name
    areaDef20.foreground=colors.get("black");
    areaDef20.font = "medium,italic";
    areaDef20.background = colors.get("white");
    areaDef20.border = "none";   // color - move into field?? render border separatly from text area?
    areaDef20.layout = "east-west";
    areas.push(areaDef20);


    var areaDef30 = new layout_area();
    areaDef30.type = "label";
    areaDef30.id = 30;
    areaDef30.location="120,96,24,24";
    areaDef30.text = "Text 3";     //name
    areaDef30.foreground=colors.get("Yellow");
    areaDef30.font = "small,bold";
    areaDef30.border = "none";   // color - move into field?? render border separatly from text area?
    areaDef30.layout = "north-south";
    areas.push(areaDef30);

    var areaDef40 = new layout_area();
    areaDef40.type = "label";
    areaDef40.id = 40;
    areaDef40.location="152,104,16,16";
    areaDef40.text = "A4";     //name
    areaDef40.foreground=colors.get("Blue");
    areaDef40.font = "small,bold";
    areaDef40.background = colors.get("Red");
    areaDef40.border = "round";   // color - move into field?? render border separatly from text area?
    areaDef40.layout = "south-north";
    areas.push(areaDef40);
    
    layout.define("*", areas);
}

serverko.loadModule("framework/room.js");
serverko.loadModule("framework/layout.js");
serverko.loadModule( "framework/colors.js" );

// for teams

room.onRoomInfo = game_info;
room.onUserJoined   = client_onConnected;

configureLayout();


// additional area properties
// .font="small|italic";   .font="small|bold";                  // default - small, normal
// .background="httpcolorname";                                 // back - 
// .foreground="httpcolorname";
// .border="none";            .border="round";  .border="thick";

