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
	info =  "gname:test_area_cards_1\t"
	info = info + "script:test_area_cards_1.py\t"
	info = info + "players:0\t"
	info = info + "status:0\t"
	#serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_items1 " )
	layout.println("Testing table cards areas" )
	layout.println("area 1 - playing cards" )
	layout.println("area 2 - playing cards" )
	layout.println("area 3 - playing cards" )
	layout.println("area 4 - playing cards" )
	layout.println("area 5 - cards on table" )
	layout.println("area 6 - cards deck" )

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
	areassp = []
	
	areaDef1 = LayoutArea()
	areaDef1.type = "cards.playing"
	areaDef1.id = "cards1"
	areaDef1.location="4,14,8,2"
	areaDef1.layout = "south-north"
	areaDef1.size = "8,8,1"
	areaDef1.items = "[i]cards.bela.0,[i]cards.bela.1,[i]cards.bela.2,[i]cards.bela.3,[i]cards.bela.4,[i]cards.bela.5,[i]cards.bela.6,[i]cards.bela.7"
	areas.append(areaDef1)
	areassp.append(areaDef1)

	areaDef2 = LayoutArea()
	areaDef2.type = "cards.playing"
	areaDef2.id = "cards2"
	areaDef2.location="14,4,2,8"
	areaDef2.layout = "east-west"
	areaDef2.size = "8,1,8"
	areaDef2.items = "[i]cards.bela.8,[i]cards.bela.9,[i]cards.bela.10,[i]cards.bela.11,[i]cards.bela.12,[i]cards.bela.13,[i]cards.bela.14,[i]cards.bela.15"
	areas.append(areaDef2)
	
	areaDef2sp = LayoutArea()
	areaDef2sp.type = "cards.playing"
	areaDef2sp.id = "cards2"
	areaDef2sp.location="14,4,2,8"
	areaDef2sp.layout = "east-west"
	areaDef2sp.size = "8,2,4"
	areaDef2sp.items = "[i]cards.bela.8,[i]cards.bela.9,[i]cards.bela.10,[i]cards.bela.11,[i]cards.bela.12,[i]cards.bela.13,[i]cards.bela.14,[i]cards.bela.15"
	areassp.append(areaDef2sp)

	areaDef3 = LayoutArea()
	areaDef3.type = "cards.playing"
	areaDef3.id = "cards3"
	areaDef3.location="4,0,8,2"
	areaDef3.layout = "north-south"
	areaDef3.size = "8,8,1"
	areaDef3.items = "[i]cards.bela.16,[i]cards.bela.17,[i]cards.bela.18,[i]cards.bela.19,[i]cards.bela.20,[i]cards.bela.21,[i]cards.bela.22,[i]cards.bela.23"
	areas.append(areaDef3)
	areassp.append(areaDef3)
	
	areaDef4 = LayoutArea()
	areaDef4.type = "cards.playing"
	areaDef4.id = "cards4"
	areaDef4.location="0,4,2,8"
	areaDef4.layout = "west-east"
	areaDef4.size = "8,1,8"
	areaDef4.items = "[i]cards.bela.24,[i]cards.bela.25,[i]cards.bela.26,[i]cards.bela.27,[i]cards.bela.28,[i]cards.bela.29,[i]cards.bela.30,[i]cards.bela.31"
	areas.append(areaDef4)
	
	areaDef4sp = LayoutArea()
	areaDef4sp.type = "cards.playing"
	areaDef4sp.id = "cards4"
	areaDef4sp.location="0,4,2,8"
	areaDef4sp.layout = "west-east"
	areaDef4sp.size = "8,2,4"
	areaDef4sp.items = "[i]cards.bela.24,[i]cards.bela.25,[i]cards.bela.26,[i]cards.bela.27,[i]cards.bela.28,[i]cards.bela.29,[i]cards.bela.30,[i]cards.bela.31"
	areassp.append(areaDef4sp)
	
	areaDef5 = LayoutArea()
	areaDef5.type = "cards.played"
	areaDef5.id = "cards5"
	areaDef5.location="6,5,3,6"
	areaDef5.layout = "diamond"
	areaDef5.size = "4"
	areaDef5.items = "[i]cards.bela.3,[i]cards.bela.1,[i]cards.bela.24,[i]cards.bela.21"
	areas.append(areaDef5)
	areassp.append(areaDef5)


	areaDef6 = LayoutArea()
	areaDef6.type = "cards.stack"
	areaDef6.id = "cards6"
	areaDef6.location="4,4,1,2"
	areaDef6.size = "4"
	areaDef5.items = "[i]cards.bela.21,[i]cards.bela.21,[i]cards.bela.21,[i]cards.bela.21"
	areas.append(areaDef6)
	areassp.append(areaDef6)
	
	areaDef7 = LayoutArea()
	areaDef7.type = "cards.deck"
	areaDef7.id = "cards7"
	areaDef7.location="10,10,1,2"
	areaDef7.size = "4"
	areaDef5.items = "[i]cards.bela.21,[i]cards.bela.21,[i]cards.bela.21,[i]cards.bela.21"
	areas.append(areaDef7)
	areassp.append(areaDef7)
	
	layout.define("*", areas )
	layout.define("SP", areassp )
	
def test_script_onEvent( id, data) :
	serverko.trace("JS:configureLayout")
	
#register out functions
room.script_init.append( test_script_init )
room.script_info.append( test_script_info )
room.script_onUserJoined.append( test_script_userJoined )
room.script_onEvent.append( test_script_onEvent )


configureLayout()
