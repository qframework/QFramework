def test_script_init() :
	serverko.trace("INFO: test_script_init")
	serverko.sendEvent( 1 , 4000 , "" )
	
def test_script_info() :
	info =  "gname:test_area_table\t"
	info = info + "script:test_area_table.py\t"
	info = info + "players:0\t"
	info = info + "status:0\t"
	#serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_table " )
	layout.println("Testing table sgrid type" )
	layout.println("area 1 - table for sorry like game -play field - play grid" )
	layout.println("area 2 - table for sorry like game - start field - owner 2" )
	layout.println("area 3 - table for sorry like game - end field - owner 1" )
	layout.println("area 4 - table for sorry like game - start field - dirrefent owners" )
	layout.println("area 5 - table for sorry like game - end field - dirrefent owners" )

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
	areaDef1.type = "table.sgrid"
	areaDef1.id = "table1"
	areaDef1.location="0,0,4,4"
	areaDef1.border = "round"
	areaDef1.foreground = colors.get("red")
	areaDef1.size = "48,13,13"
	areaDef1.owner = "1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0"
	areaDef1.fields = "play,6,0,6,1,0,1;play,12,0,12,0,1,1;play,12,12,12,-1,0,1;play,0,12,12,0,-1,1;play,0,0,6,1,0,1;"
	areas.append(areaDef1)


	areaDef2 = LayoutArea()
	areaDef2.type = "table.sgrid"
	areaDef2.id = "table2"
	areaDef2.location="5,0,2,2"
	areaDef2.text = ""
	areaDef2.border = "none"
	areaDef2.foreground = colors.get("blue")
	areaDef2.size = "4,2,2"
	areaDef2.owner = "1,1,1,1"
	areaDef2.fields = "start,0,0,2,1,0,1;start,0,1,2,1,0,1"
	areas.append(areaDef2)

	areaDef3 = LayoutArea()
	areaDef3.type = "table.sgrid"
	areaDef3.id = "table3"
	areaDef3.location="5,3,2,2"
	areaDef3.text = ""
	areaDef3.border = "round1"
	areaDef3.foreground = colors.get("white")
	areaDef3.size = "4,2,2"
	areaDef3.owner = "1,1,1,1"
	areaDef3.fields = "end,0,0,2,1,0,1;end,0,1,2,1,0,1"
	areas.append(areaDef3)

	areaDef4 = LayoutArea()
	areaDef4.type = "table.sgrid"
	areaDef4.id = "table4"
	areaDef4.location="1,5,1,4"
	areaDef4.text = "table4"
	areaDef4.border = "none"
	areaDef4.foreground = colors.get("white")
	areaDef4.size = "4,1,4"
	areaDef4.owner = "1,2,3,4"
	areaDef4.fields = "start,0,0,4,0,1,1"
	areas.append(areaDef4)

	areaDef5 = LayoutArea()
	areaDef5.type = "table.cardt"
	areaDef5.id = "table5"
	areaDef5.location="5,6,2,2"
	areaDef5.text = ""
	areaDef5.border = "round3"
	areaDef5.foreground = colors.get("white")
	areaDef5.background = colors.get("green")
	areas.append(areaDef5)
	
	layout.define("*", areas)
	

def test_script_onEvent( id, data) :
	serverko.trace("JS: test_script_onEvent" + str(id) + " " + data)


#register out functions
room.script_init.append( test_script_init )
room.script_info.append( test_script_info )
room.script_onUserJoined.append( test_script_userJoined )
room.script_onEvent.append( test_script_onEvent )


configureLayout()
