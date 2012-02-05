
function game_info()
{
    var info;
	info =  "gname:test_area_2\t";
	info += "script:test_area_2.js\t";
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
    layout.println("First area - text area" );
    layout.println("Second area - label area" );
}


function configureLayout()
{
    print("JS:configureLayout");
    
    layout.gtype   = "board";
    layout.players = 1;
    layout.canvasw = 16;
    layout.canvash = 16;

	var areas = new Array();
	
    var areaDef1 = new layout_area();
    areaDef1.type = "text";
    areaDef1.id = 01;
    areaDef1.location="1,1,7,7";
    areaDef1.text = "Area 1  - text ";     //name
    areaDef1.foreground=colors.get("blue");
    areaDef1.font = "large,normal";
    areaDef1.background = "White";
    areaDef1.border = "rect";   // color - move into field?? render border separatly from text area?
    areas.push(areaDef1);


    var areaDef10 = new layout_area();
    areaDef10.type = "label";
    areaDef10.id = 10;
    areaDef10.location="8,8,7,7";
    areaDef10.text = "Area 2 - label ";     //name
    areaDef10.foreground=colors.get("aliceBlue");
    areaDef10.font = "large,italic";
    areaDef10.background = "DarkGreen";
    areaDef10.border = "rect";   // color - move into field?? render border separatly from text area?
    areaDef10.layout = "south-west";
    areas.push(areaDef10);
    
    layout.define("*", areas);
}

function game_init()
{
    serverko.sendEvent( 1 , 4000 );   
}

function game_onGameEvent(type, userdata)
{
	print("JS:game_GameonEvent:" + type + " - " + userdata);

    
    switch (type)
    {
        case 1: 
            layout.println("start " );
            layout_startUpdate();
            layout_areaSetBackground( 01, colors.get("blue"));
            layout_areaSetBackground( 10, colors.get("green"));
            layout_areaSetForeground( 01, colors.get("yellow"));
            layout_areaSetForeground( 10, colors.get("white"));            
            layout_areaSetText( 01, "text aaaaaa");
            layout_areaSetText( 10, "text aaaaaa");
            layout_areaSetFont( 01, "medium");
            layout_areaSetFont( 10, "medium");            
            layout_sendUpdate();
            serverko.sendEvent( 2 , 4000 );   
        break;
        case 2: 
            layout.println("new text = text bbbbb " );
            layout_startUpdate();
            layout_areaSetText( 01, "text bbbbb");
            layout_areaSetText( 10, "text bbbbb");
            layout_sendUpdate();
            serverko.sendEvent( 3 , 4000 );   
        break;
        case 3: 
            layout.println("new background colors - DarkBlue ,  DarkRed" );
            layout_startUpdate();
            layout_areaSetBackground( 01, "DarkBlue");
            layout_areaSetBackground( 10, "DarkRed");
            layout_sendUpdate();
            serverko.sendEvent( 4 , 4000 );   
        break;        
        case 4: 
            layout.println("new layout west-east - label supports new layout " );
            layout_startUpdate();
            layout_areaSetLayout( 10, "west-east");
            layout_sendUpdate();
            serverko.sendEvent( 5 , 4000 );   
        break;        
        case 5: 
            layout.println("new layout east-west - label supports new layout " );
            layout_startUpdate();
            layout_areaSetLayout( 10, "east-west");
            layout_sendUpdate();
            serverko.sendEvent( 6 , 4000 );   
        break;                
        case 6: 
            layout.println("new foreground color - white ,  yellow" );
            layout_startUpdate();
            layout_areaSetForeground( 01, colors.get("white"));
            layout_areaSetForeground( 10, colors.get("yellow"));
            layout_sendUpdate();
            serverko.sendEvent( 7 , 4000 );   
        break;                
        case 7: 
            layout.println("italic fonts" );
            layout_startUpdate();
            layout_areaSetFont( 01, "large,italic");
            layout_areaSetFont( 10, "large,italic");
            layout_sendUpdate();
            serverko.sendEvent( 8 , 4000 );   
        break;                        
        case 8: 
            layout.println("medium fonts" );
            layout_startUpdate();
            layout_areaSetFont( 01, "medium,normal");
            layout_areaSetFont( 10, "medium,normal");
            layout_sendUpdate();
            serverko.sendEvent( 9 , 4000 );   
        break;                                
        case 9: 
            layout.println("large bold fonts" );
            layout_startUpdate();
            layout_areaSetFont( 01, "large,bold");
            layout_areaSetFont( 10, "large,bold");
            layout_sendUpdate();
            serverko.sendEvent( 10 , 4000 );   
        break;                         
        default:
            serverko.sendEvent( 1 , 4000 );   
        break;
    }
    
    
}



serverko.loadModule("framework/room.js");
serverko.loadModule("framework/layout.js");
serverko.loadModule( "framework/colors.js" );

// for teams

room.onInit = game_init;
room.onRoomInfo = game_info;
room.onUserJoined   = client_onConnected;
room.onGameEvent = game_onGameEvent;

configureLayout();


// additional area properties
// .font="small|italic";   .font="small|bold";                  // default - small, normal
// .background="httpcolorname";                                 // back - 
// .foreground="httpcolorname";
// .border="none";            .border="round";  .border="thick";

