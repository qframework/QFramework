#test area items
#create fields 
#add different items
#move items from field to field
#do effects on items
#remove items

def test_script_init() :
	serverko.trace("INFO: test_script_init")
	serverko.sendEvent( 1 , 4000 , "" )
	
def test_script_info() :
	info =  "gname:test_area_items_3\t"
	info = info + "script:test_area_items_3.py\t"
	info = info + "players:0\t"
	info = info + "status:0\t"
	#serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_items_3 " )
	layout.println("Test displaying items" )
	layout.println("test display of items in grid" )

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
	areaDef1.location="0,0,7,7"
	areaDef1.text = ""
	areaDef1.border = "round"
	areaDef1.font = "medium, bold"
	areaDef1.foreground = colors.get("yellow")
	areaDef1.size = "32,8,5"
	areaDef1.items = "[i]cards.bela.0,[i]cards.bela.1,[i]cards.bela.2,[i]cards.bela.3,[i]cards.bela.4,[i]cards.bela.5,[i]cards.bela.6,[i]cards.bela.7,"
	areaDef1.items = areaDef1.items+ "[i]cards.bela.8,[i]cards.bela.9,[i]cards.bela.10,[i]cards.bela.11,[i]cards.bela.12,[i]cards.bela.13,[i]cards.bela.14,[i]cards.bela.15,"
	areaDef1.items = areaDef1.items+ "[i]cards.bela.16,[i]cards.bela.17,[i]cards.bela.18,[i]cards.bela.19,[i]cards.bela.20,[i]cards.bela.21,[i]cards.bela.22,[i]cards.bela.23,"
	areaDef1.items = areaDef1.items+ "[i]cards.bela.24,[i]cards.bela.25,[i]cards.bela.26,[i]cards.bela.27,[i]cards.bela.28,[i]cards.bela.29,[i]cards.bela.30,[i]cards.bela.31,"
	areaDef1.items = areaDef1.items+ "[i]cards.bela.32,[i]cards.bela.33,[i]cards.bela.34,[i]cards.bela.35,[i]cards.bela.36,[i]cards.bela.37,[i]cards.bela.38,[i]cards.bela.39"
	areas.append(areaDef1)
	
	layout.define("*", areas)

def test_script_onEvent( id, data) :
	serverko.trace("JS: test_script_onEvent" + str(id) + " " + data)


#register out functions
room.script_init.append( test_script_init )
room.script_info.append( test_script_info )
room.script_onUserJoined.append( test_script_userJoined )
room.script_onEvent.append( test_script_onEvent )


configureLayout()
