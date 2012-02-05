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
	info =  "gname:test_area_items1\t"
	info = info + "script:test_area_items1.py\t"
	info = info + "players:0\t"
	info = info + "status:0\t"
	#serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_area_items1 " )
	layout.println("Testing table sgrid items " )
	layout.println("area 1 - table with play fields table for sorry like game " )
	layout.println("area 2 - table for sorry like game - start field - owner 2" )
	layout.println("area 3 - table for sorry like game - end field - owner 1" )

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
	areaDef1.location="0,0,7,2"
	areaDef1.text = ""
	areaDef1.border = "round"
	areaDef1.foreground = colors.get("red");
	areaDef1.size = "16,8,2"
	areaDef1.fields = "play,0,0,8,1,0,1;play,0,1,8,1,0,1"
	areas.append(areaDef1)


	areaDef2 = LayoutArea()
	areaDef2.type = "table.sgrid"
	areaDef2.id = "table2"
	areaDef2.location="1,4,2,2"
	areaDef2.text = ""
	areaDef2.border = "none"
	areaDef2.foreground = colors.get("blue");
	areaDef2.size = "4,2,2"
	areaDef2.owner = "1,1,1,1"
	areaDef2.fields = "start,0,0,2,1,0,1;start,0,1,2,1,0,1"
	areas.append(areaDef2)

	areaDef3 = LayoutArea()
	areaDef3.type = "table.sgrid"
	areaDef3.id = "table3"
	areaDef3.location="5,4,1,4"
	areaDef3.text = ""
	areaDef3.border = "round1"
	areaDef3.foreground = colors.get("white");
	areaDef3.size = "4,1,4"
	areaDef3.owner = "1,1,1,1"
	areaDef3.fields = "end,0,0,4,0,1,1"
	areas.append(areaDef3)
	
	layout.define("*", areas)

def test_script_onEvent( id, data) :
	serverko.trace("JS: test_script_onEvent" + str(id) + " " + data)
	if id == 1 : 
		items = []
		layout.addItem( items, "figures.player", 1, 0)
		layout.addItem( items, "none.none", 0 , 0)
		layout.addItem( items, "figures.player", 2, 0)
		layout.addItem( items, "figures.player", 3, 0)
		layout.addItem( items, "none.none", 0, 0)
		layout.addItem( items, "figures.player", 4, 0)		
		layout.println("1. Setting items on areas using areaSetItems" )
		layout.startUpdate()
		layout.areaSetItems( "table1", items)
		layout.itemPlace( "figures.player", 2,"table1", 11, 0)		
		layout.sendUpdate()
		serverko.sendEvent( 2 , 4000 , "")
	elif id == 2 : 
		layout.println("2. Moving item 1 " )
		layout.startUpdate()
		layout.itemMove( "table1",0,"table2",0)
		layout.sendUpdate()
		serverko.sendEvent( 3 , 4000 , "")
	elif id == 3 : 
		layout.println("3. Moving item 2,3 " )
		layout.startUpdate()
		layout.itemMove( "table1",2,"table2",1)
		layout.itemMove( "table1",3,"table3",0)
		layout.sendUpdate()
		serverko.sendEvent( 4 , 4000 , "")		
	elif id == 4 : 
		layout.println("4. Moving item 4,5 " )
		layout.startUpdate()
		layout.itemMove( "table1",5,"table3",2)
		layout.itemMove( "table1",11,"table3",3)
		layout.sendUpdate()
		serverko.sendEvent( 5 , 4000 , "")				
	elif id == 5 : 
		layout.println("5. Do effect on items " )
		layout.startUpdate()
		layout.areaSetEffect("table2","grayitem","0,1");
		layout.areaSetEffect("table3","glowitem","2,3");
		layout.sendUpdate()
		serverko.sendEvent( 6 , 4000 , "")
	elif id == 6 : 
		layout.println("6. Delete items " )
		layout.startUpdate()
		layout.itemRemove("table2",0)
		layout.itemRemove("table2",1)
		layout.sendUpdate()
		serverko.sendEvent( 7 , 4000 , "")
	elif id == 7 : 
		layout.println("7. Clear fields on table " )
		layout.startUpdate()
		layout.areaClear("table3")
		layout.sendUpdate()
		serverko.sendEvent( 8 , 4000 , "")		
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
