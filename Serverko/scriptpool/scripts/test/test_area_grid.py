def test_script_init() :
	serverko.trace("INFO: test_script_init")
	serverko.sendEvent( 1 , 4000 , "" )
	
def test_script_info() :
	info =  "gname:test_area_grid\t"
	info = info + "script:test_area_grid.py\t"
	info = info + "players:0\t"
	info = info + "status:0\t"
	#serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_grid " )
	layout.println("area - testing grid arae - different types of fields in grid" )

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
	
	areaDef1 = LayoutArea()
	areaDef1.type = "layout.grid"
	areaDef1.id = "grid1"
	areaDef1.location="0,0,4,4"
	areaDef1.text = ""
	areaDef1.border = "round"
	areaDef1.font = "medium, bold"
	areaDef1.foreground = colors.get("white")
	areaDef1.size = "6,3,2"
	areaDef1.items = "[i]20010000,[t]smilej,[t]jasta,[i]20020000,[t]smilej2,[t]jasta2"
	areas.append(areaDef1)

	layout.define("*", areas )
	

def test_script_onEvent( id, data) :
	serverko.trace("JS: test_script_onEvent" + str(id) + " " + data)


#register out functions
room.script_init.append( test_script_init )
room.script_info.append( test_script_info )
room.script_onUserJoined.append( test_script_userJoined )
room.script_onEvent.append( test_script_onEvent )


configureLayout()
