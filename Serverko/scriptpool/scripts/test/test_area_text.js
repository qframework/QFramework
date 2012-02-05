function test_script_init()
{
	serverko.trace("INFO: test_script_init");
	serverko.sendEvent( 1 , 4000 , "" );
}
	
function test_script_info()
{
	var info;
	info =  "gname:test_area_text\t";
	info += "script:test_area_text.js\t";
	info += "players:0\t";
	info += "status:0\t";
	serverko.trace("JS: test_script_info " + info);
	return info;
}

function test_script_userJoined(userID)
{
	serverko.trace("JS: test_script_userJoined " + userID);
	serverko.clientSpectate(userID , 1);
	layout.println("test_area_text " );
	layout.println("Testing different text area capabilities" );
}


function configureLayout()
{
	serverko.trace("JS:configureLayout");
	layout.gtype = "board";
	layout.players = 1;
	layout.canvasw = 6;
	layout.canvash = 6;

	var areas = new Array();
	
	var areaDef1 = new LayoutArea();
	areaDef1.type = "text.area";
	areaDef1.id = "text1";
	areaDef1.location="2,2,3,3";
	areaDef1.text = "This is text area with long text that should be wrapped";
	areaDef1.foreground=colors.get("black");
	areaDef1.font = "medium, normal";
	areaDef1.background = colors.get("white");
	areaDef1.border = "none";
	areas.push(areaDef1);
	
	layout.define("*",areas);
}

function test_script_onEvent( id, data)
{
	serverko.trace("JS: test_script_onEvent" + id + " " + data );
	switch(id)
	{
	    case 1:
	    {
		    layout.println("1. Setting new area text which is long text thath should be wrapped" );
		    layout.startUpdate();
		    layout.areaSetText( "text1", "New text for area");
		    layout.sendUpdate();
		    serverko.sendEvent( 2 , 4000 , "");
		    break;
	    }
	    case 2:
	    {
		    layout.println("2. Setting area font to bold large" );
		    layout.startUpdate();
		    layout.areaSetFont( "text1", "large,bold");
		    layout.sendUpdate();
		    serverko.sendEvent( 3 , 4000 , "");
		    break;
	    }
	    case 3:
	    {
		    layout.println("3. Setting area font to small italic" );
		    layout.startUpdate();
		    layout.areaSetFont( "text1", "small,italic");
		    layout.sendUpdate();
		    serverko.sendEvent( 4 , 4000 , "");  
		    break;
	    }
	    case 4:
	    {
		    layout.println("4. Setting area font to normal medium" );
		    layout.startUpdate();
		    layout.areaSetFont( "text1", "medium,normal");
		    layout.sendUpdate();
		    serverko.sendEvent( 5 , 4000 , "");
		    break;
	    }
	    case 5:
	    {
		    layout.println("5. Changing foreground white and background back color " );
		    layout.startUpdate();
		    layout.areaSetForeground( "text1", colors.get("white"));
		    layout.areaSetBackground( "text1", colors.get("black"));
		    layout.sendUpdate();
		    serverko.sendEvent( 6 , 4000 , "");
		    break;
	    }
	    case 6:
	    {
		    layout.println("6. Removing background " );
		    layout.startUpdate();
		    layout.areaSetBackground( "text1", "none");
		    layout.sendUpdate();
		    serverko.sendEvent( 7 , 4000 , "");
		    break;
	    }
	    case 7:
	    {
		    layout.println("7. Returning original colors " );
		    layout.startUpdate();
		    layout.areaSetForeground( "text1", colors.get("black"));
		    layout.areaSetBackground( "text1", colors.get("white"));
		    layout.sendUpdate();
		    serverko.sendEvent( 8 , 4000 , "");
		    break;
	    }
	    case 8:
	    {
		    layout.println("8. Setting round border" );
		    layout.startUpdate();
		    layout.areaSetBorder( "text1", "round");
		    layout.sendUpdate();
		    serverko.sendEvent( 9 , 4000 , "");
		    break;
	    }
	    case 9:
	    {
		    layout.println("9. Setting rect border" );
		    layout.startUpdate();
		    layout.areaSetBorder( "text1", "rect");
		    layout.sendUpdate();
		    serverko.sendEvent( 10 , 4000 , "");
		    break;
	    }
	    case 10:
	    {
		    layout.println("10. Setting no border" );
		    layout.startUpdate();
		    layout.areaSetBorder( "text1", "none");
		    layout.sendUpdate();
		    serverko.sendEvent( 11 , 4000 , "");
		    break;
	    }
	    default:
	    {
		    layout.startUpdate();
		    layout.areaSetText( "text1", "This is text area");
		    layout.sendUpdate();
		    serverko.sendEvent( 1 , 4000 , "");
	    }
    }
    serverko.trace("JS: test_script_onEvent out");
}

//register out functions
serverko.trace("INFO: test_area 2 ");
//load system room module
// todo load with system?
serverko.loadModule( "framework/room.js" );
serverko.loadModule( "framework/layout.js" );
serverko.loadModule( "framework/colors.js" );

room.script_init.push( test_script_init );
room.script_info.push( test_script_info );
room.script_userJoined.push( test_script_userJoined );
room.script_onEvent.push( test_script_onEvent );

configureLayout();
