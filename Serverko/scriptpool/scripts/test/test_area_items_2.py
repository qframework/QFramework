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
	info =  "gname:test_area_items_2\t"
	info = info + "script:test_area_items_2.py\t"
	info = info + "players:0\t"
	info = info + "status:0\t"
	#serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_items_2 " )
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
	areaDef1.location="0,0,7,8"
	areaDef1.text = ""
	areaDef1.border = "round"
	areaDef1.font = "medium, bold"
	areaDef1.foreground = colors.get("white")
	areaDef1.size = "20,4,5"
	areaDef1.fields = "start,0,0,4,1,0,1;play,0,1,4,1,0,1;end,0,1,4,1,0,1;chessrowwhite,0,1,4,1,0,1;chessrowblack,0,1,4,1,0,1"
	areaDef1.items = "[i]figures.player.1,[i]figures.player.2,[i]figures.player.3,[i]figures.player.4,"
	areaDef1.items = areaDef1.items+ "[i]cards.bela.1,[i]cards.bela.2,[i]cards.bela.3,[i]cards.bela.4,"
	areaDef1.items = areaDef1.items+ "[i]figures.dice.1,[i]figures.dice.2,[i]figures.dice.4,[i]figures.dice.5,"
	areaDef1.items = areaDef1.items+ "[i]figures.chess.0,[i]figures.chess.1,[i]figures.chess.2,[i]figures.chess.3,"
	areaDef1.items = areaDef1.items+ "[i]figures.chess.4,[i]figures.chess.5,[i]figures.chess.6,[i]figures.chess.7"
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
