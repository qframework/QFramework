def test_script_init() :
	serverko.trace("INFO: test_script_init")
	serverko.sendEvent( 1 , 4000 , "" )
	
def test_script_info() :
	info =  "gname:test_area_text\t"
	info = info + "script:test_area_text.py\t"
	info = info + "players:0\t"
	info = info + "status:0\t"
	#serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_text " )
	layout.println("Testing different text area capabilities" )

serverko.trace("INFO: test_area 2 ")
#load system room module
# todo load with system?
serverko.loadModule( "framework/room.py" )
serverko.loadModule( "framework/layout.py" )
serverko.loadModule( "framework/colors.py" )

testnum = "test_area_text"
def configureLayout() :
	serverko.trace("JS:configureLayout")
	layout.gtype = "board"
	layout.players = 1
	layout.background = colors.get("darkred")
	layout.canvasw = 6
	layout.canvash = 6

	areas = []
	
	areaDef1 = LayoutArea()
	areaDef1.type = "text.area"
	areaDef1.id = "text1"
	areaDef1.location="2,2,3,3"
	areaDef1.text = "This is text area with long text that should be wrapped"
	areaDef1.foreground=colors.get("black")
	areaDef1.font = "medium, normal"
	areaDef1.background = colors.get("white")
	areaDef1.border = "none"
	areas.append(areaDef1)
	
	layout.define("*",areas)


def test_script_onEvent( id, data) :
	serverko.trace("JS: test_script_onEvent" + str(id) + " " + data + " " + testnum)
	if id == 1 : 
		layout.println("1. Setting new area text which is long text thath should be wrapped" )
		layout.startUpdate()
		layout.areaSetText( "text1", "New text for area")
		layout.sendUpdate()
		serverko.sendEvent( 2 , 4000 , "")
	elif id == 2 :
		layout.println("2. Setting area font to bold large" )
		layout.startUpdate()
		layout.areaSetFont( "text1", "large,bold")
		layout.sendUpdate()
		serverko.sendEvent( 3 , 4000 , "")
	elif id == 3 :
		layout.println("3. Setting area font to small italic" )
		layout.startUpdate()
		layout.areaSetFont( "text1", "small,italic")
		layout.sendUpdate()
		serverko.sendEvent( 4 , 4000 , "");  
	elif id == 4 :
		layout.println("4. Setting area font to normal medium" )
		layout.startUpdate()
		layout.areaSetFont( "text1", "medium,normal")
		layout.sendUpdate()
		serverko.sendEvent( 5 , 4000 , "")
	elif id == 5 :
		layout.println("5. Changing foreground white and background back color " )
		layout.startUpdate()
		layout.areaSetForeground( "text1", colors.get("white"))
		layout.areaSetBackground( "text1", colors.get("black"))
		layout.sendUpdate()
		serverko.sendEvent( 6 , 4000 , "")
	elif id == 6 :
		layout.println("6. Removing background " )
		layout.startUpdate()
		layout.areaSetBackground( "text1", "none")
		layout.sendUpdate()
		serverko.sendEvent( 7 , 4000 , "")
	elif id == 7 :
		layout.println("7. Returning original colors " )
		layout.startUpdate()
		layout.areaSetForeground( "text1", colors.get("black"))
		layout.areaSetBackground( "text1", colors.get("white"))
		layout.sendUpdate()
		serverko.sendEvent( 8 , 4000 , "")
	elif id == 8 :
		layout.println("8. Setting round border" )
		layout.startUpdate()
		layout.areaSetBorder( "text1", "round")
		layout.sendUpdate()
		serverko.sendEvent( 9 , 4000 , "")
	elif id == 9 :
		layout.println("9. Setting rect border" )
		layout.startUpdate()
		layout.areaSetBorder( "text1", "rect")
		layout.sendUpdate()
		serverko.sendEvent( 10 , 4000 , "")
	elif id == 10 :
		layout.println("10. Setting no border" )
		layout.startUpdate()
		layout.areaSetBorder( "text1", "none")
		layout.sendUpdate()
		serverko.sendEvent( 11 , 4000 , "")
	else :
		layout.startUpdate()
		layout.areaSetText( "text1", "This is text area")
		layout.sendUpdate()
		serverko.sendEvent( 1 , 4000 , "")


#register out functions
room.script_init.append( test_script_init )
room.script_info.append( test_script_info )
room.script_onUserJoined.append( test_script_userJoined )
room.script_onEvent.append( test_script_onEvent )


configureLayout()
