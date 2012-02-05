def test_script_init() :
	serverko.trace("INFO: test_script_init")
	serverko.sendEvent( 1 , 4000 , "iz0" )
	
def test_script_info() :
	info =  "gname:test_area_operations\t"
	info = info + "script:test_area_operations.py\t"
	info = info + "players:0\t"
	info = info + "status:0\t"
	#serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_operations " )
	layout.println("Testing different label area operations" )

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
	layout.canvasw = 8
	layout.canvash = 8

	areas = []
	layout.define("*", areas )

def test_script_onEvent( id, data) :
	serverko.trace("JS: test_script_onEvent" + str(id) + " " + data)
	if id == 1 : 
		layout.println("1. Create new label area,set text/colors,show it" )
		layout.startUpdate()
		layout.areaCreate( "label1", "text.label")
		layout.areaSetLocation( "label1", "1,1,4,4")
		layout.areaSetText( "label1", "label1 text")
		layout.areaSetBorder( "label1", "rect3")
		layout.areaSetForeground( "label1", colors.get("white"))
		layout.areaSetFont( "label1", "medium")
		layout.areaSetState( "label1", "visible")
		layout.sendUpdate()
		serverko.sendEvent( 2 , 4000 , "iz1")
	elif id == 2 : 
		layout.println("2. Move area" )
		layout.startUpdate()
		layout.areaMoveTo( "label1", 2,3)
		layout.sendUpdate()
		serverko.sendEvent( 3 , 4000 , "iz1")		
	elif id == 3 : 
		layout.println("3. Resize area" )
		layout.startUpdate()
		layout.areaResize( "label1", 2,2)
		layout.sendUpdate()
		serverko.sendEvent( 4 , 4000 , "iz1")				
	elif id == 4 : 
		layout.println("4. Delete are that we created" )
		layout.startUpdate()
		layout.areaDelete( "label1")
		layout.sendUpdate()
		serverko.sendEvent( 5 , 4000 , "iz2")
	else :
		serverko.sendEvent( 1 , 4000 , "iz3")


#register out functions
room.script_init.append( test_script_init )
room.script_info.append( test_script_info )
room.script_onUserJoined.append( test_script_userJoined )
room.script_onEvent.append( test_script_onEvent )


configureLayout()
