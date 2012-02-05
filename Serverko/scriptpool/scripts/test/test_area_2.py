def test_script_init() :
	serverko.trace("INFO: test_script_init")
	serverko.sendEvent( 1 , 4000 , "dataaaaa" )
	
def test_script_info() :
	info =  "gname:test_area_2\t"
	info = info + "script:test_area_2.py\t"
	info = info + "players:4\t"
	info = info + "status:0\t"
	serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_2 test" )
	layout.println("First area - text area" )
	layout.println("Second area - label area" )

serverko.trace("INFO: test_area 2 ")
#load system room module
# todo load with system?
serverko.loadModule( "framework/room.py" )
serverko.loadModule( "framework/layout.py" )
serverko.loadModule( "framework/colors.py" )

def configureLayout() :
	serverko.trace("JS:configureLayout")
	layout.gtype = "board"
	layout.players = 1
	layout.canvasw = 16
	layout.canvash = 16

	areas = []
	areaDef1 = LayoutArea()
	areaDef1.type = "text.area"
	areaDef1.id = "01"
	areaDef1.location="1,1,7,7"
	areaDef1.text = "Area 1  - text "
	areaDef1.foreground=colors.get("blue")
	areaDef1.font = "large,normal"
	areaDef1.background = colors.get("white")
	areaDef1.border = "rect"
	areas.append(areaDef1)

	areaDef10 = LayoutArea()
	areaDef10.type = "text.label"
	areaDef10.id = "10"
	areaDef10.location="8,8,7,7"
	areaDef10.text = "Area 2 - label "
	areaDef10.foreground=colors.get("aliceblue")
	areaDef10.font = "large,italic"
	areaDef10.background = colors.get("darkgreen")
	areaDef10.border = "rect"
	areaDef10.layout = "south-west"
	areas.append(areaDef10)

	layout.define("*", areas )

def test_script_onEvent( id, data) :
	serverko.trace("JS: test_script_onEvent" + str(id) + " " + data)
	if id == 1 : 
		layout.println(" changing area 01" )
		layout.startUpdate()
		layout.areaSetBackground("01",colors.get("blue"))		
		layout.areaSetBackground("10",colors.get("green"))
		layout.areaSetForeground("01",colors.get("yellow"))
		layout.areaSetForeground("10",colors.get("white"))            
		layout.areaSetText( "01", "text aaaaaa")
		layout.areaSetText( "10", "text aaaaaa")
		layout.areaSetFont( "01", "medium")
		layout.areaSetFont( "10", "medium")
		layout.sendUpdate()
		serverko.sendEvent( 2 , 4000 , "")
	elif id == 2 :
		layout.println("new text = text bbbbb " )
		layout.startUpdate()
		layout.areaSetText( "01", "text bbbbb")
		layout.areaSetText( "10", "text bbbbb")
		layout.sendUpdate()
		serverko.sendEvent( 3 , 4000 , "")
	elif id == 3 :
		layout.println("new background colors - DarkBlue ,  DarkRed" )
		layout.startUpdate()
		layout.areaSetBackground( "01", colors.get("darkblue"))
		layout.areaSetBackground( "10", colors.get("darkred"))
		layout.sendUpdate()
		serverko.sendEvent( 4 , 4000 , "");  
	elif id == 4 :
		layout.println("new layout west-east - label supports new layout " )
		layout.startUpdate()
		layout.areaSetLayout( "10", "west-east")
		layout.sendUpdate()
		serverko.sendEvent( 5 , 4000 , "")
	elif id == 5 :
		layout.println("new layout east-west - label supports new layout " )
		layout.startUpdate()
		layout.areaSetLayout( "10", "east-west")
		layout.sendUpdate()
		serverko.sendEvent( 6 , 4000 , "")
	elif id == 6 :
		layout.println("new foreground color - white ,  yellow" )
		layout.startUpdate()
		layout.areaSetForeground( "01", colors.get("white"))
		layout.areaSetForeground( "10", colors.get("yellow"))
		layout.sendUpdate()
		serverko.sendEvent( 7 , 4000 , "")
	elif id == 7 :
		layout.println("italic fonts" )
		layout.startUpdate()
		layout.areaSetFont( "01", "large,italic")
		layout.areaSetFont( "10", "large,italic")
		layout.sendUpdate()
		serverko.sendEvent( 8 , 4000 , "")
	elif id == 8 :
		layout.println("medium fonts" )
		layout.startUpdate()
		layout.areaSetFont( "01", "medium,normal")
		layout.areaSetFont( "10", "medium,normal")
		layout.sendUpdate()
		serverko.sendEvent( 9 , 4000, "" )
	elif id == 9 :
		layout.println("large bold fonts" )
		layout.startUpdate()
		layout.areaSetFont( "01", "large,bold")
		layout.areaSetFont( "10", "large,bold")
		layout.sendUpdate()
		serverko.sendEvent( 10 , 4000, "" )
	else :
		serverko.sendEvent( 1 , 4000 , "")


#register out functions
room.script_init.append( test_script_init )
room.script_info.append( test_script_info )
room.script_onUserJoined.append( test_script_userJoined )
room.script_onEvent.append( test_script_onEvent )


configureLayout()
