def test_script_init() :
	serverko.trace("INFO: test_script_init")

def test_script_info() :
	info =  "gname:test_area_1\t"
	info = info + "script:test_area_1.py\t"
	info = info + "players:4\t"
	info = info + "status:0\t"
	serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_1 test" )
	layout.println("First row - four different text areas" )
	layout.println("Second row - four different label areas" )

serverko.trace("INFO: test_area 1 ")
#load system room module
# todo load with system?
serverko.loadModule( "framework/room.py" )
serverko.loadModule( "framework/layout.py" )
serverko.loadModule( "framework/colors.py" )

def configureLayout() :
	serverko.trace("JS:configureLayout")
	layout.gtype = "board"
	layout.players = 1
	layout.canvasw = 180
	layout.canvash = 180
	
	areas = []
	areaDef1 = LayoutArea()
	areaDef1.type = "text.area"
	areaDef1.id = "text1"
	areaDef1.location="8,8,16,16"
	areaDef1.text = "Area 1 "
	areaDef1.foreground=colors.get("blue")
	areaDef1.font = "small,normal"
	areaDef1.background = colors.get("white")
	areaDef1.border = "rect"
	areas.append(areaDef1)

	areaDef2 = LayoutArea()
	areaDef2.type = "text.area"
	areaDef2.id = "text2"
	areaDef2.location="32,8,24,24"
	areaDef2.text = "Area 2 "
	areaDef2.foreground=colors.get("white")
	areaDef2.font = "medium,italic"
	areaDef2.background = colors.get("red")
	areaDef2.border = "none"
	areas.append(areaDef2)

	areaDef3 = LayoutArea()
	areaDef3.type = "text.area"
	areaDef3.id = "text3"
	areaDef3.location="64,8,32,32"
	areaDef3.text = "Text Area 3 long text no background"
	areaDef3.foreground=colors.get("yellow")
	areaDef3.font = "medium,bold"
	areaDef3.border = "none"
	areas.append(areaDef3)

	areaDef4 = LayoutArea()
	areaDef4.type = "text.area"
	areaDef4.id = "text4"
	areaDef4.location="104,8,64,64"
	areaDef4.text = "A4"
	areaDef4.foreground=colors.get("blue")
	areaDef4.font = "large,bold"
	areaDef4.background = colors.get("red")
	areaDef4.border = "round"
	areas.append(areaDef4)

	areaDef10 = LayoutArea()
	areaDef10.type = "label"
	areaDef10.id = "text10"
	areaDef10.location="8,56,64,64"
	areaDef10.text = "Area 1 "
	areaDef10.foreground=colors.get("aliceBlue")
	areaDef10.font = "large,italic"
	areaDef10.background = colors.get("darkgreen")
	areaDef10.border = "rect"
	areaDef10.layout = "south-west"
	areas.append(areaDef10)

	areaDef20 = LayoutArea()
	areaDef20.type = "label"
	areaDef20.id = "text20"
	areaDef20.location="80,88,32,32"
	areaDef20.text = "Area 2 "
	areaDef20.foreground=colors.get("black")
	areaDef20.font = "medium,italic"
	areaDef20.background = colors.get("white")
	areaDef20.border = "none"
	areaDef20.layout = "east-west"
	areas.append(areaDef20)

	areaDef30 = LayoutArea()
	areaDef30.type = "label"
	areaDef30.id = "text30"
	areaDef30.location="120,96,24,24"
	areaDef30.text = "Text 3"
	areaDef30.foreground=colors.get("yellow")
	areaDef30.font = "small,bold"
	areaDef30.border = "none"
	areaDef30.layout = "north-south"
	areas.append(areaDef30)

	areaDef40 = LayoutArea()
	areaDef40.type = "label"
	areaDef40.id = "text40"
	areaDef40.location="152,104,16,16"
	areaDef40.text = "A4"
	areaDef40.foreground=colors.get("blue")
	areaDef40.font = "small,bold"
	areaDef40.background = colors.get("red")
	areaDef40.border = "round"
	areaDef40.layout = "south-north"
	areas.append(areaDef40)
	
	layout.define( "*", areas )

#register out functions
room.script_init.append( test_script_init )
room.script_info.append( test_script_info )
room.script_onUserJoined.append( test_script_userJoined )


configureLayout()
