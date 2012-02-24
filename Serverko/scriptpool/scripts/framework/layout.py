#
#   Copyright 2012, Telum Slavonski Brod, Croatia.
#
#   Licensed under the Apache License, Version 2.0 (the "License")
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#   
#   This file is part of QFramework project, and can be used only as part of project.
#   Should be used for peace, not war :)   
#

console.log('layout.py')



def layout_script_userJoined(userID) :
    console.log("layout_script_userJoined " + userID)
    #layout.send(userID)    

# define layout area
class LayoutArea:
    type = None
    id = None
    layout = None
    state = None
    bounds = None
    size = None
    display = None
    text = None
    location = None
    rotation = None
    scale = None
    onclick = None
    onfocuslost = None
    onfocusgain = None
    items = None
    fields = None
    foreground =  None
    background =  None
    border =  None
    colors = None

# define layout class
class Layout:
    qapp = None
    pageid = "";
    canvasw = 0;
    canvash = 0;    
    worldxmin = 0;
    worldxmax = 0;    
    worldymin = 0;
    worldymax = 0;
    hudxmin = 0;
    hudxmax = 0;    
    hudymin = 0;
    hudymax = 0;
    areacount = 0;

    def __init__(self, qapp):
        self.qapp = qapp

    def createLayout(self , type ,areas ,send) :

        if (send == 1):
            self.qapp.serverko.startData()

        self.qapp.serverko.reserveSpace()
        self.qapp.serverko.startTag()
        self.qapp.serverko.appendTag( "res", "layout")
        self.qapp.serverko.addSeparator()  
        self.qapp.serverko.appendTag( "pageid", type )
        self.qapp.serverko.addSeparator()      
        self.qapp.serverko.startTags("area")

        a = 0
        for area in areas :

            if (area.type is None) or len(area.type) == 0: 
                return

            if ( a> 0):
                self.qapp.serverko.addSeparator()
            a += 1

            self.qapp.serverko.startTag()
            self.qapp.serverko.appendTag( "type", area.type)

            self.qapp.serverko.addSeparator()
            if (area.id == "" or area.id is None):
                area.id = "temparea" + str(self.areacount)
                self.areacount += 1

            self.qapp.serverko.appendTag( "id", area.id)
            
            if (area.layout is not None):
                self.qapp.serverko.addSeparator()
                self.qapp.serverko.appendTag( "layout", area.layout)

            if (area.state is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "state", area.state)

            if (area.bounds is not None):
                self.qapp.serverko.addSeparator()
                self.qapp.serverko.appendTag( "bounds", area.bounds)

            if (area.size is not None):
                self.qapp.serverko.addSeparator()
                self.qapp.serverko.appendTag( "size", area.size)

            if (area.display is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "display", area.display)

            if (area.items is not None):
                self.qapp.serverko.addSeparator()            
                self.qapp.serverko.appendTag( "items", area.items)            

            if (area.text is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "text", area.text)

            if (area.location is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "location", area.location)

            if (area.onclick is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "onclick", area.onclick)

            if (area.onfocuslost is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "onfocuslost", area.onfocuslost)

            if (area.onfocusgain is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "onfocusgain", area.onfocusgain)

            if (area.foreground is not None):
                self.qapp.serverko.addSeparator()            
                self.qapp.serverko.appendTag( "foreground", area.foreground)

            if (area.background is not None):
                self.qapp.serverko.addSeparator()            
                self.qapp.serverko.appendTag( "background", area.background)

            if (area.border is not None):
                self.qapp.serverko.addSeparator()            
                self.qapp.serverko.appendTag( "border", area.border)

            if (area.fields is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "fields", area.fields)                                                            

            if (area.colors is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "colors", area.colors)                                                            

            if (area.rotation is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "rotation", area.rotation)                                                            

            if (area.scale is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "scale", area.scale)                                                            
            
            self.qapp.serverko.endTag( "area")    

        self.qapp.serverko.endTags( "area")    
        self.qapp.serverko.endTag("")    

        if (send == 1):
            self.qapp.serverko.sendData()       

        
    def println(self,message):
        self.qapp.serverko.appendEvent_(3180 , "stdout" , message )
    
    def printl(self,message):
        self.qapp.serverko.appendEvent(3180 , "stdout" , message )
    
    def print_(self,message) :
        self.qapp.serverko.appendEvent_(3180 , "stdout" , message )

#------------------------------
    #3001 - delete area
    def areaDelete(self, area):
        self.qapp.serverko.appendEvent( 3001 , area , "" )
        return self.qapp.serverko
    
#------------------------------
    def areaClear(self,  area):
        self.qapp.serverko.appendEvent( 3002 , area , "" )
        return self.qapp.serverko
    
#------------------------------	
    def areaClearItems(self,  area):
        self.qapp.serverko.appendEvent( 3004 , area , "" )
        return self.qapp.serverko

#------------------------------
    def itemPlace(self, item, itemid, areaTo, indexTo, userData):
        self.qapp.serverko.appendEvent( 3050 , item +"." +itemid +"|"+userData, areaTo + "," + str(indexTo) )
        return self.qapp.serverko
    
#------------------------------
    def itemMove(self, areaFrom, indexFrom, areaTo, indexTo):
        self.qapp.serverko.appendEvent( 3051 , "", areaFrom + "," + str(indexFrom) + "," + areaTo + "," + str(indexTo) )
        return self.qapp.serverko
    
#------------------------------ 
    def itemRemove(self, areaFrom, indexFrom):
        self.qapp.serverko.appendEvent( 3052 , areaFrom, indexFrom)
        return self.qapp.serverko

    
#------------------------------
    def itemMoveA(self, areaFrom, indexFrom, areaTo, indexTo, type, delay, path):
        self.qapp.serverko.appendEvent( 3053 , "", areaFrom + "," + str(indexFrom) + "," + areaTo + "," + str(indexTo) + "," + type + "," + str(delay) + "," + path)
        return self.qapp.serverko
    
#------------------------------ 
    def itemsAnim(self,areaId, type, delay):
        self.qapp.serverko.appendEvent( 3054 , areaId , type + "," + str(delay) )
        return self.qapp.serverko
    
#------------------------------
    def itemAnim(self,areaId, index , type, delay):
        self.qapp.serverko.appendEvent( 3055 , areaId , index + "|" + type + "," + str(delay) )
        return self.qapp.serverko
    
#------------------------------
    def areaSetState(self, area, state):
        self.qapp.serverko.appendEvent( 3110 , area , state)
        return self.qapp.serverko

#------------------------------
    
    def areaSetBounds(self, area, bounds):
        self.qapp.serverko.appendEvent( 3120 , area , bounds  )
        return self.qapp.serverko
    
#------------------------------
    def areaSetText(self, area, text):
        self.qapp.serverko.appendEvent( 3180 , area , text )
        return self.qapp.serverko
    
#------------------------------
    def areaSetLocation(self, area , loc):
        self.qapp.serverko.appendEvent( 3190 , area , loc )
        return self.qapp.serverko
    
#------------------------------
    def areaSetScale(self, area, loc):
        self.qapp.serverko.appendEvent( 3191 , area , loc )
        return self.qapp.serverko
    
#------------------------------
    def areaSetItemScale(self, area, index, loc):
        self.qapp.serverko.appendEvent( 3192 , area , index + ","+ loc )
        return self.qapp.serverko
    
#------------------------------
    def areaSetRotation(self, area, loc):
        self.qapp.serverko.appendEvent( 3195 , area , loc )
        return self.qapp.serverko
    
#------------------------------
    
    def areaSetItemScale(self, area, index, loc):
        self.qapp.serverko.appendEvent( 3192 , area , index + ","+ loc )
        return self.qapp.serverko
    
#------------------------------
    def areaSetOnclick(self, area, data):
        self.qapp.serverko.appendEvent( 3200 , area , data )
        return self.qapp.serverko
    
#------------------------------
    def areaSetOnFocusGain(self, area, data):
        self.qapp.serverko.appendEvent( 3201 , area , data )
        return self.qapp.serverko

#------------------------------
    
    def areaSetOnFocusLost(self, area, data):
        self.qapp.serverko.appendEvent( 3202 , area , data )
        return self.qapp.serverko
    
#------------------------------
    
    def areaSetItems(self, area, items):
        self.qapp.serverko.appendEvent( 3220 , area , items )
        return self.qapp.serverko

#------------------------------
    
    def areaSetItem(self, area, field, item):
        self.qapp.serverko.appendEvent( 3222 , area , field+","+item )
        return self.qapp.serverko
    
#------------------------------
    def areaInvertItem(self, area, field):
        self.qapp.serverko.appendEvent( 3223 , area , field )
        return self.qapp.serverko

    def areaSetItemB(self, area, field, item):
        self.qapp.serverko.appendEvent( 3224 , area , field+","+item )
        return self.qapp.serverko

#------------------------------	
    def areaSetBackground(self, area, text):
        self.qapp.serverko.appendEvent( 3250 , area , text )
        return self.qapp.serverko

    #3270 - fields
#------------------------------	
    def areaSetFields(self, area, fields):
        self.qapp.serverko.appendEvent( 3270 , area , fields  )
        return self.qapp.serverko
    
#------------------------------	
    def updateBack(self,area, time , newback, oldback):
        self.areaSetBackground(area, newback)
        data = 	"Q.startUpdate();Q.layout.areaSetBackground("
        data += "'" + area +"'" +  "," + "'" + oldback +"'" 
        data += ");Q.sendUpdate()"
        self.qapp.exec_( time , data)
    

    def updateBack_(self,area, time , newback, oldback):
        self.startUpdate()
        self.areaSetBackground(area, newback)
        self.sendUpdate()
        
        data = "Q.startUpdate();Q.layout.areaSetBackground("
        data += "'" + area +"'" +  "," + "'" + oldback +"'"
        data += ");Q.sendUpdate()"
        self.qapp.exec_( time , data)
    
    
#------------------------------    
    def add(self,type,areas):
        self.createLayout(type,areas , 0)
        return self.qapp.serverko

#------------------------------    
    def show(self,pageid):
        self.qapp.serverko.appendEvent( 2010 , pageid , "" )
        return self.qapp.serverko

#------------------------------    
    def showAnim(self,pageid, anim):
        self.qapp.serverko.appendEvent( 2011 , pageid , anim )
        return self.qapp.serverko
    

#------------------------------
    def popup(self,pageid):
        self.qapp.serverko.appendEvent( 2012 , pageid , "" )
        return self.qapp.serverko
    
    def popupAnim(self,pageid, anim):
        self.qapp.serverko.appendEvent( 2013 , pageid , anim )
        return self.qapp.serverko
        
  #------------------------------    
    def clear(self,pageid):
        self.qapp.serverko.appendEvent( 2015 , pageid , "" )
        return self.qapp.serverko
        
#------------------------------    
    def hide(self,pageid):
        self.qapp.serverko.appendEvent( 2020 , pageid , "" )
        return self.qapp.serverko
    
    def hideAnim(self,pageid, anim):
        self.qapp.serverko.appendEvent( 2021 , pageid , anim )
        return self.qapp.serverko
    
#------------------------------    
    def editText(self,deftext, onreturn):
        self.qapp.serverko.appendEvent( 1002 , deftext , onreturn )
        return self.qapp.serverko
    
#------------------------------    
    def anim(self,type, data):
        self.qapp.serverko.appendEvent( 2030 , type , data )
        return self.qapp.serverko
    
    def startUpdate(self):
        self.qapp.startUpdate()
    
    def sendUpdate(self):
        self.qapp.sendUpdate()
       

class Textures:
    def __init__(self,qapp):
        self.qapp = qapp

    def newFromFile(self,name, file):
        self.qapp.serverko.appendEvent( 4000 , name, file)

    def newFromFile_(self,name, file):
        self.qapp.serverko.appendEvent_( 4000 , name, file)
    
    def createTextures(self,textures, send):
        if (send == 1):
            self.qapp.serverko.startData()

        self.qapp.serverko.reserveSpace()
        self.qapp.serverko.startTag()
        self.qapp.serverko.appendTag( "res", "texts")
        self.qapp.serverko.addSeparator()      
        self.qapp.serverko.startTags("texture")

        a = 0        
        for texture in textures:
            if ( a> 0):
                self.qapp.serverko.addSeparator()

            self.qapp.serverko.startTag()
            if (texture.name is not None):
                self.qapp.serverko.appendTag( "name", texture.name)

            if (texture.file is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "file", texture.file)
            
            self.qapp.serverko.endTag( "texture")
            a += 1

        self.qapp.serverko.endTags( "texture") 
        self.qapp.serverko.endTag("") 

        if (send == 1):
            self.qapp.serverko.sendData()

    def add(self,texts):
        self.createTextures(texts , 0)

    def clientAdd(self, userID , texts):
        self.createTextures(texts , 0)
    
    def add_(self,texts):
        self.createTextures(texts , 1)

    def clientAdd_(userID , texts):
        self.createTextures(texts , 1)
    

class Texture:
    name = None
    file = None


class Sounds:
    def __init__(self,qapp):
        self.qapp = qapp

    def newFromFile(self,name, file):
        self.qapp.serverko.appendEvent( 5000 , name, file)
        return self.qapp.serverko

    def play(self,sound):
        self.qapp.serverko.appendEvent( 5010 , "play", sound )
        return self.qapp.serverko

    def volume(self,value):
        self.qapp.serverko.appendEvent( 5011 , value, "" )
        return self.qapp.serverko

    def mute(self,val):
        self.qapp.serverko.appendEvent( 5012 , "mute", val )
        return self.qapp.serverko

class Model:
    name = None
    template = None
    texture = None
    submodels = None

class Models:

    def __init__(self,qapp):
        self.qapp = qapp
    
    def newFromTemplate(name , template):
        self.qapp.serverko.appendEvent( 6001 , name, template)
        return self.qapp.serverko
    
    def setTexture(name, texture, offset):
        self.qapp.serverko.appendEvent( 6002 , name, texture + ";" + offset)
        return self.qapp.serverko
    
    def create(self, name):
        self.qapp.serverko.appendEvent( 6003 , name, "")
        return self.qapp.serverko

    def setSubmodels(self, name, count):
        self.qapp.serverko.appendEvent( 6004 , name, count)
        return self.qapp.serverko
    
    def createModels(self, objs, send):
        if (send == 1):
            self.qapp.serverko.startData()

        self.qapp.serverko.reserveSpace()
        self.qapp.serverko.startTag()
        self.qapp.serverko.appendTag( "res", "models")
        self.qapp.serverko.addSeparator()      
        self.qapp.serverko.startTags("model")
    
        a = 0        
        for obj  in objs:
            if ( a> 0):
                self.qapp.serverko.addSeparator()

            a+= 1
            self.qapp.serverko.startTag()
            if (objs[a].name is not None):
                self.qapp.serverko.appendTag( "name", obj.name)

            if (objs[a].template is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "template", obj.template)
            
            if (objs[a].texture is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "texture", obj.texture)

            if (objs[a].submodels is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "submodels", obj.submodels)
            
            self.qapp.serverko.endTag( "model")

        self.qapp.serverko.endTags( "model")
        self.qapp.serverko.endTag("")    

        if (send == 1):
            self.qapp.serverko.sendData()       

    def add(self,objs):
        self.createModels(objs , 0)
        return self.qapp.serverko

