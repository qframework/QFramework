def test_script_init() :
	serverko.trace("INFO: test_script_init")
	serverko.sendEvent( 1 , 4000 , "" )
	
def test_script_info() :
	info =  "gname:test_lang\t"
	info = info + "script:test_lang.py\t"
	info = info + "players:0\t"
	info = info + "status:0\t"
	#serverko.trace("JS: test_script_info " + info)
	return info

def test_script_userJoined(userID) :
	serverko.trace("JS: test_script_userJoined " + userID)
	serverko.clientSpectate(userID , 1)
	layout.println("test_lang " )
	layout.println("Testing different label area capabilities" )

serverko.trace("INFO: test_lang ")
#load system room module
# todo load with system?
serverko.loadModule( "framework/room.py" )
serverko.loadModule( "framework/layout.py" )
serverko.loadModule( "framework/colors.py" )
serverko.loadLanguage( "EN","test/lang1.txt" )

def configureLayout() :
	serverko.trace("JS:configureLayout")
	layout.gtype = "board"
	layout.players = 1
	layout.canvasw = 8
	layout.canvash = 8

	areas = []
	areaDef1 = LayoutArea()
	areaDef1.type = "text.label"
	areaDef1.id = "label1"
	areaDef1.location="2,2,6,2"
	areaDef1.text = "The %+ID1+% i dodano %+ID2+% ?"
	areaDef1.foreground=colors.get("darkgreen")
	areaDef1.font = "small, normal"
	areaDef1.background = colors.get("yellow")
	areaDef1.border = "none"
	areas.append(areaDef1)

	layout.define("*", areas)

def test_script_onEvent( id, data) :
	serverko.trace("JS: test_script_onEvent" + str(id) + " " + data)
	if id == 1 : 
		layout.println("1. Setting new label text" )
		layout.startUpdate()
		layout.areaSetText( "label1", "New text")
		layout.sendUpdate()
		serverko.sendEvent( 2 , 4000 , "")
	elif id == 2 :
		layout.println("2. Setting area font to bold large" )
		layout.startUpdate()
		layout.areaSetFont( "label1", "large,bold")
		layout.sendUpdate()
		serverko.sendEvent( 3 , 4000 , "")
	elif id == 3 :
		layout.println("3. Setting area font to small italic" )
		layout.startUpdate()
		layout.areaSetFont( "label1", "small,italic")
		layout.sendUpdate()
		serverko.sendEvent( 4 , 4000 , "");  
	elif id == 4 :
		layout.println("4. Setting area font to normal medium" )
		layout.startUpdate()
		layout.areaSetFont( "label1", "medium,normal")
		layout.sendUpdate()
		serverko.sendEvent( 5 , 4000 , "")
	elif id == 5 :
		layout.println("5. Changing foreground yellow and background back color " )
		layout.startUpdate()
		layout.areaSetForeground( "label1", colors.get("yellow"))
		layout.areaSetBackground( "label1", colors.get("darkgreen"))
		layout.sendUpdate()
		serverko.sendEvent( 6 , 4000 , "")
	elif id == 6 :
		layout.println("6. Removing background " )
		layout.startUpdate()
		layout.areaSetBackground( "label1", "none")
		layout.sendUpdate()
		serverko.sendEvent( 7 , 4000 , "")
	elif id == 7 :
		layout.println("7. Returning original colors " )
		layout.startUpdate()
		layout.areaSetForeground( "label1", colors.get("darkgreen"))
		layout.areaSetBackground( "label1", colors.get("yellow"))
		layout.sendUpdate()
		serverko.sendEvent( 8 , 4000 , "")
	elif id == 8 :
		layout.println("8. Setting round border" )
		layout.startUpdate()
		layout.areaSetBorder( "label1", "round")
		layout.sendUpdate()
		serverko.sendEvent( 9 , 4000 , "")
	elif id == 9 :
		layout.println("9. Setting rect border" )
		layout.startUpdate()
		layout.areaSetBorder( "label1", "rect")
		layout.sendUpdate()
		serverko.sendEvent( 10 , 4000 , "")
	elif id == 10 :
		layout.println("10. Setting no border" )
		layout.startUpdate()
		layout.areaSetBorder( "label1", "none")
		layout.sendUpdate()
		serverko.sendEvent( 11 , 4000 , "")
	elif id == 11 :
		layout.println("11. Testinfglayout - north-west" )
		layout.startUpdate()
		layout.areaSetLayout( "label1", "north-west")
		layout.sendUpdate()
		serverko.sendEvent( 12 , 4000 , "")		
	elif id == 12 :
		layout.println("12. Testing layout - north-south" )
		layout.startUpdate()
		layout.areaSetLayout( "label1", "north-south")
		layout.sendUpdate()
		serverko.sendEvent( 13 , 4000 , "")				
	elif id == 13 :
		layout.println("13. Testing layout - south-west" )
		layout.startUpdate()
		layout.areaSetLayout( "label1", "south-west")
		layout.sendUpdate()
		serverko.sendEvent( 14 , 4000 , "")						
	elif id == 14 :
		layout.println("14. Testing layout - west-east" )
		layout.startUpdate()
		layout.areaSetLayout( "label1", "west-east")
		layout.sendUpdate()
		serverko.sendEvent( 15 , 4000 , "")								
	else :
		layout.startUpdate()
		layout.areaSetText( "label1", "The label")
		layout.sendUpdate()
		serverko.sendEvent( 1 , 4000 , "")


#register out functions
room.script_init.append( test_script_init )
room.script_info.append( test_script_info )
room.script_onUserJoined.append( test_script_userJoined )
room.script_onEvent.append( test_script_onEvent )


configureLayout()
