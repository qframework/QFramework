serverko.trace('INFO: layout.py')



def layout_script_userJoined(userID) :
	serverko.trace("JS:layout_script_userJoined " + userID)
	#layout.send(userID)    

# define layout area
class LayoutArea:
	type = 'dummy'
	id = 'dummy'
	x = -111111
	y = -111111
	w = -111111
	h = -111111
	layout = 'hor'
	state = 'dummy'
	owner = 'dummy'
	opacity = 'dummy' 
	size = -111111
	display = 'dummy'
	data = 'dummy'
	items = 'dummy'
	text = 'dummy'
	location = 'dummy'
	onclick = 'dummy'
	effect = 'dummy'
	font =  'dummy'
	foreground =  'dummy'
	background =  'dummy'
	border =  'dummy'
	fields = 'dummy'

# define layout class
class Layout:
	gtype = "none"
	canvasw = 1024
	canvash = 1024
	players = 0
	background = ""
	pageid = ""
	areas = {}
	
	def create(self , type ,areas) :
		serverko.startData()
		serverko.startTag( "room")
		serverko.appendTag( "res", "layout")
		serverko.appendTag( "gtype", self.gtype)
		serverko.appendTag( "canvasw", str(self.canvasw) )
		serverko.appendTag( "canvash", str(self.canvash) )
		serverko.appendTag( "playersnum", str(self.players) )
		serverko.appendTag( "background", self.background )
		serverko.appendTag( "pageid", self.pageid )
		
		for area in areas :
			if area.type == "dummy" : 
				return
			if area.id == "dummy" : 
				return	
			serverko.startTag( "area")
			serverko.appendTag( "type", area.type)

			serverko.appendTag( "id", area.id)
			if area.x != -111111 :
				serverko.appendTag( "x", str(area.x))
			if area.y != -111111 :
				serverko.appendTag( "y", str(area.y))
			if area.w != -111111 :
				serverko.appendTag( "w", str(area.w))
			if area.h != -111111 :
				serverko.appendTag( "h", str(area.h))
			if area.layout != "dummy" :
				serverko.appendTag( "layout", area.layout)
			if area.state != "dummy" :
				serverko.appendTag( "state", area.state)
			if area.owner != "dummy" :
				serverko.appendTag( "owner", area.owner)
			if area.opacity != "dummy" :
				serverko.appendTag( "opacity", area.opacity)
			if area.size != -111111 :
				serverko.appendTag( "size", str(area.size))
			if area.display != "dummy" :
				serverko.appendTag( "display", area.display)
			if area.data != "dummy" :
				serverko.appendTag( "data", area.data)
			if area.items != "dummy" :
				serverko.appendTag( "items", area.items)
			if area.text != "dummy" :
				serverko.appendTag( "text", area.text)
			if area.location != "dummy" :
				serverko.appendTag( "location", area.location)
			if area.onclick != "dummy" :
				serverko.appendTag( "onclick", area.onclick)
			if area.effect != "dummy" :
				serverko.appendTag( "effect", area.effect)
			if area.font != "dummy" :
				serverko.appendTag( "font", area.font)
			if area.foreground != "dummy" :
				serverko.appendTag( "foreground", area.foreground)
			if area.background != "dummy" :
				serverko.appendTag( "background", area.background)
			if area.border != "dummy" :
				serverko.appendTag( "border", area.border)                                         
			if area.fields != "dummy" :
				serverko.appendTag( "fields", area.fields)
			serverko.endTag( "area")
		
		serverko.endTag( "room")
		serverko.storeLayout(type)    
						
		
	def println(self,message) :
		serverko.startData()
		serverko.appendEvent(3180 , "stdout" , message )
		serverko.sendData()

	def define(self,type,areas) :
		if type == "" : 
			type = "*"
			
		self.areas[type] = areas
		self.create(type,areas)
		
		
	#define functions
	def startUpdate(self):
		serverko.startData()

	def sendUpdate(self):
		serverko.sendData()

	def clientStartUpdate(self, userID):
		serverko.clientStartData(userID)

	def clientSendUpdate(self, userID):
		serverko.clientSendData(userID)
		
	#3000 - create area
	def areaCreate(self, areaID, type):
		serverko.appendEvent( 3000 , areaID, type)
	def clientAreaCreate(self, userID, areaID, type):
		serverko.clientAppendEvent( userID, 3000 , areaID, type)		

	#3001 - delete area
	def areaDelete(self, areaID):
		serverko.appendEvent( 3001 , areaID, "")
	def clientAreaDelete(self, userID, areaID):
		serverko.clientAppendEvent( userID, 3001 , areaID, "")		

	#3002 - clear area
	def areaClear(self, areaID):
		serverko.appendEvent( 3002 , areaID, "")
	def clientAreaClear(self, userID, areaID):
		serverko.clientAppendEvent( 3002 , userID, areaID, "")				

	#3020 - new page
	def areaClear(self, pageID):
		serverko.appendEvent( 3020 , pageID, "")
	def clientAreaClear(self, userID, pageID):
		serverko.clientAppendEvent( 3020 , userID, pageID, "")				

	#3021 - delete page
	def areaClear(self, pageID):
		serverko.appendEvent( 3021 , pageID, "")
	def clientAreaClear(self, userID, pageID):
		serverko.clientAppendEvent( 3021 , userID, pageID, "")				

	#3022 - current page
	def areaClear(self, pageID):
		serverko.appendEvent( 3022 , pageID, "")
	def clientAreaClear(self, userID, pageID):
		serverko.clientAppendEvent( 3022 , userID, pageID, "")				

	#3023 - update page
	def areaClear(self, pageID):
		serverko.appendEvent( 3023 , pageID, "")
	def clientAreaClear(self, userID, pageID):
		serverko.clientAppendEvent( 3023 , userID, pageID, "")				

	#3050 - place item - itemID , area + index, gamedata				
	def itemPlace(self, item, itemdata, areaTo, indexTo, userData):
		serverko.appendEvent( 3050 , item + "." + str(itemdata) + "|" + str(userData), areaTo + "," + str(indexTo))
	def clientItemPlace(self, userID, item, itemdata, areaTo, indexTo, userData):
		serverko.clientAppendEvent( userID, 3050 , item +"."+itemdata+"|"+str(userData), areaTo + "," + str(indexTo))
		
	#3051 - move figure - itemID, areaFrom + index, areaTo + index, gamedata
	def itemMove( self,  areaFrom, indexFrom, areaTo, indexTo):
		serverko.appendEvent( 3051 , "", areaFrom + "," + str(indexFrom) + "," + areaTo + "," + str(indexTo))
	def clientItemMove( self, userID,  areaFrom, indexFrom, areaTo, indexTo):
		serverko.clientAppendEvent( userID, 3051 , "", areaFrom + "," + str(indexFrom) + "," + areaTo + "," + str(indexTo))

	#3052 - remove figure - itemID, areaFrom + index
	def itemRemove( self, areaFrom, indexFrom):
		serverko.appendEvent( 3052 , areaFrom , str(indexFrom) )
	def clientItemRemove( self, userID, areaFrom, indexFrom):
		serverko.clientAppendEvent( 3052 , userID, areaFrom , str(indexFrom) )


	#3100 - layout				
	def areaSetLayout(self , areaID, layout):	
		serverko.appendEvent( 3100 , areaID , layout )
	def clientAreaSetLayout(self , userID, areaID, layout):	
		serverko.clientAppendEvent( userID, 3100 , areaID , layout )		
	
	#3110 - state		
	def areaSetState(self, areaID, state):
		serverko.appendEvent( 3110 , areaID, state)		
	def clientAreaSetState(self, areaID, state):
		serverko.clientAppendEvent( userID, 3110 , areaID, state)		
				
	#3120 - owner
	def areaSetOwner(self, areaID, owner):
		serverko.appendEvent( 3120 , areaID, owner)		
	def clientAreaSetOwner(self, userID, areaID, owner):
		serverko.clientAppendEvent( userID, 3120 , areaID, owner)				
			
	#3130 - opacity
	def areaSetOpacity(self, areaID, opacity):
		serverko.appendEvent( 3130 , areaID, opacity)		
	def clientAreaSetOpacity(self, userID, areaID, opacity):
		serverko.clientAppendEvent( userID, 3130 , areaID, opacity)				
			
	#3140 - size
	def areaSetSize(self, areaID, size, sizew, sizeh):
		serverko.appendEvent( 3140 , areaID, str(size) + "," + str(sizew) + "," + str(sizeh))		
	def clientAreaSetSize(self, userID, areaID, size, sizew, sizeh):
		serverko.clientAppendEvent( userID, 3140 , areaID, str(size) + "," + str(sizew) + "," + str(sizeh))				
			
	#3160 - display
	def areaSetDisplay(self, areaID, disp):
		serverko.appendEvent( 3160 , areaID, disp)		
	def clientAreaSetDisplay(self, userID, areaID, disp):
		serverko.clientAppendEvent( userID, 3160 , areaID, disp)		
					
	#3170 - data
	def areaSetData(self, areaID, data):
		serverko.appendEvent( 3160 , areaID, data)			
	def clientAreaSetData(self, userID, areaID, data):
		serverko.clientAppendEvent( userID, 3160 , areaID, data)			
	
	#3180 - text
	def areaSetText(self , areaID, text):
		serverko.appendEvent( 3180 , areaID , text )
	def clientAreaSetText(self , userID, areaID, text):
		serverko.clientAppendEvent( userID, 3180 , areaID , text )
			
	#3190 - location
	def areaSetLocation(self, areaID, location):
		serverko.appendEvent( 3190 , areaID, location)
	def clientAreaSetLocation(self, userID, areaID, location):
		serverko.clientAppendEvent( userID, 3190 , areaID, location)

	def areaMoveTo(self, areaID, x,y):
		location = str(x) + "," + str(y)
		serverko.appendEvent( 3190 , areaID, location)
	def clientAreaMoveTo(self, userID, areaID, x,y):
		location = str(x) + "," + str(y)
		serverko.clientAppendEvent( 3190 , userID, areaID, location)

	def areaResize(self, areaID, w,h):
		size = " , ," + str(w) + "," + str(h)
		serverko.appendEvent( 3190 , areaID, size)
	def clientAreaResize(self, userID, areaID, w,h):
		size = " , ," + str(w) + "," + str(h)
		serverko.clientAppendEvent( 3190 , userID, areaID, size)
	
	#3200 - onclick
	def areaSetOnclick(self, areaID, data):
		serverko.appendEvent( 3200 , areaID, data)
	def clientAreaSetOnclick(self, userID, areaID, data):
		serverko.clientAppendEvent( 3200 , userID, areaID, data)
	
	
	#3210 - effect
	def areaSetEffect(self , areaID, effect, fields):	
		serverko.appendEvent( 3210 , areaID , effect + "," + fields )		
	def clientAreaSetEffect(self , userID, areaID, effect, fields):	
		serverko.clientAppendEvent( 3210 , userID, areaID , effect + "," + fields )		

	#3220 - items
	def addItem(self, items, itemid, itemdata, userdata):
		items.append( "[i]" + itemid +"."+str(itemdata)+"|"+str(userdata))
		items.append(",")
	def areaSetItems(self, areaID, items):
		itemstr = ("".join(items)).rstrip(",")
		serverko.appendEvent( 3220 , areaID, itemstr)		
	def clientAreaSetItems(self, userID, areaID, items):
		itemstr = ("".join(items)).rstrip(",")
		serverko.clientAppendEvent( 3220 , userID, areaID, itemstr)		
	
	#3230 - font
	def areaSetFont(self , areaID, font):	
		serverko.appendEvent( 3230 , areaID , font )
	def clientAreaSetFont(self , userID, areaID, font):	
		serverko.clientAppendEvent( 3230 , userID, areaID , font )
			
	#3240 - foreground
	def areaSetForeground(self, areaID, fore):
		serverko.appendEvent( 3240 , areaID , fore )
	def clientAreaSetForeground(self, userID, areaID, fore):
		serverko.clientAppendEvent( 3240 , userID, areaID , fore )
			
	#3250 - background
	def areaSetBackground(self ,areaID, back):
		serverko.appendEvent( 3250 , areaID , back )
	def clientAreaSetBackground(self ,userID, areaID, back):
		serverko.clientAppendEvent( 3250 , userID, areaID , back )
			
	#3260 - border
	def areaSetBorder(self , areaID, layout):	
		serverko.appendEvent( 3260 , areaID , layout )		
	def clientAreaSetBorder(self , userID, areaID, layout):	
		serverko.clientAppendEvent( 3260 , userID, areaID , layout )		
			
	#3270 - fields
	def areaSetFields(self, areaID, fields):
		fieldstr = ("".join(items)).rstrip(",")
		serverko.appendEvent( 3220 , areaID, fieldstr)		
	def clientAreaSetFields(self, userID, areaID, fields):
		fieldstr = ("".join(items)).rstrip(",")
		serverko.clientAppendEvent( 3220 , userID, areaID, fieldstr)		
		
		
			
# define object
layout = Layout()
room.script_onUserJoined.append( layout_script_userJoined )

