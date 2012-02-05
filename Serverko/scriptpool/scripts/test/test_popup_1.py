def test_script_init() :
	serverko.trace("INFO: test_script_init")
	serverko.sendEvent( 1 , 4000 , "" )
	
def test_script_info() :
	info =  "gname:test_popup_1\t"
	info = info + "script:test_popup_1.py\t"
	info = info + "players:0\t"
	info = info + "status:0\t"
	#serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_text " )
	layout.println("Testing text poup area capabilities" )

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
	layout.canvasw = 6
	layout.canvash = 6

	areas = []
	areaDef10 = LayoutArea()
	areaDef10.type = "layout.grid"
	areaDef10.id = "grid1"
	areaDef10.location="0,0,7,7"
	areaDef10.text = ""
	areaDef10.border = "round"
	areaDef10.font = "medium, bold"
	areaDef10.foreground = colors.get("yellow")
	areaDef10.background = colors.get("green")
	areaDef10.size = "32,8,5"
	areaDef10.items = "[i]cards.bela.0,[i]cards.bela.1,[i]cards.bela.2,[i]cards.bela.3,[i]cards.bela.4,[i]cards.bela.5,[i]cards.bela.6,[i]cards.bela.7,"
	areaDef10.items = areaDef10.items+ "[i]cards.bela.8,[i]cards.bela.9,[i]cards.bela.10,[i]cards.bela.11,[i]cards.bela.12,[i]cards.bela.13,[i]cards.bela.14,[i]cards.bela.15,"
	areaDef10.items = areaDef10.items+ "[i]cards.bela.16,[i]cards.bela.17,[i]cards.bela.18,[i]cards.bela.19,[i]cards.bela.20,[i]cards.bela.21,[i]cards.bela.22,[i]cards.bela.23,"
	areaDef10.items = areaDef10.items+ "[i]cards.bela.24,[i]cards.bela.25,[i]cards.bela.26,[i]cards.bela.27,[i]cards.bela.28,[i]cards.bela.29,[i]cards.bela.30,[i]cards.bela.31,"
	areaDef10.items = areaDef10.items+ "[i]cards.bela.32,[i]cards.bela.33,[i]cards.bela.34,[i]cards.bela.35,[i]cards.bela.36,[i]cards.bela.37,[i]cards.bela.38,[i]cards.bela.39"
	areas.append(areaDef10)
	
	
	areaDef1 = LayoutArea()
	areaDef1.type = "text.area"
	areaDef1.id = "text1"
	areaDef1.location="2,2,3,3"
	areaDef1.text = "This is text area with long text that should be wrapped"
	areaDef1.foreground=colors.get("black")
	areaDef1.font = "medium, normal"
	areaDef1.background = colors.get("white")
	areaDef1.display = "dialog"
	areaDef1.state = "hidden"
	areaDef1.border = "none"
	areas.append(areaDef1)

	areaDef2 = LayoutArea()
	areaDef2.type = "layout.grid"
	areaDef2.id = "grid2"
	areaDef2.location="0,0,3,3"
	areaDef2.text = ""
	areaDef2.border = "round"
	areaDef2.font = "medium, bold"
	areaDef2.foreground = colors.get("white")
	areaDef2.size = "16,4,4"
	areaDef2.background = colors.get("darkblue")
	areaDef2.display = "dialog"
	areaDef2.state = "hidden"
	areaDef2.fields = "start,0,0,4,1,0,1;play,0,1,4,1,0,1;end,0,1,4,1,0,1;none,0,1,4,1,0,1"
	areaDef2.items = "[i]figures.player.1,[i]figures.player.1,[i]figures.player.3,[i]figures.player.4,"
	areaDef2.items = areaDef2.items+ "[i]cards.bela.1,[i]cards.bela.2,[i]cards.bela.3,[i]cards.bela.4,"
	areaDef2.items = areaDef2.items+ "[i]figures.dice.1,[i]figures.dice.2,[i]figures.dice.4,[i]figures.dice.5"
	areas.append(areaDef2)


	areaDef3 = LayoutArea()
	areaDef3.type = "text.area"
	areaDef3.id = "popup1"
	areaDef3.location="3,3,2,1"
	areaDef3.text = "This is popup - it should close auto"
	areaDef3.foreground=colors.get("white")
	areaDef3.font = "medium, normal"
	areaDef3.background = colors.get("darkred")
	areaDef3.display = "popup,5000"
	areaDef3.state = "hidden"
	areaDef3.border = "none"
	areas.append(areaDef3)

	layout.define("*", areas)
	
def test_script_onEvent( id, data) :
	serverko.trace("JS: test_script_onEvent" + str(id) + " " + data + " " + testnum)
	if id == 1 : 
		layout.println("1. Showing dialog 1"  )
		layout.startUpdate()
		layout.areaSetState( "grid2", "visible")
		layout.sendUpdate()
		serverko.sendEvent( 2 , 4000 , "")
	elif id == 2 :
		layout.println("2. Showing dialog 2"  )
		layout.startUpdate()
		layout.areaSetState( "text1", "visible")
		layout.sendUpdate()
		serverko.sendEvent( 3 , 4000 , "")
	elif id == 3 :
		layout.println("3. Hiding dialog 2"  )
		layout.startUpdate()
		layout.areaSetState( "text1", "hidden")
		layout.sendUpdate()
		serverko.sendEvent( 4 , 4000 , "")  
	elif id == 4 :
		layout.println("4. Hiding dialog 1"  )
		layout.startUpdate()
		layout.areaSetState( "grid2", "hidden")
		layout.sendUpdate()
		serverko.sendEvent( 5 , 4000 , "")
	elif id == 5 :
		layout.println("5. Showing popup 1"  )
		layout.startUpdate()
		layout.areaSetState( "popup1", "visible")
		layout.sendUpdate()
		serverko.sendEvent( 6 , 4000 , "")
	else :
		serverko.sendEvent( 1 , 4000 , "")


#register out functions
room.script_init.append( test_script_init )
room.script_info.append( test_script_info )
room.script_onUserJoined.append( test_script_userJoined )
room.script_onEvent.append( test_script_onEvent )


configureLayout()
