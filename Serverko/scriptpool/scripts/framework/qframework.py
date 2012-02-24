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

import base64
import math


class Camera:
    def __init__(self, qapp):
        self.qapp = qapp;
    
    def fit_(self,xsz, ysz):
        self.qapp.appendEvent_( 2500 , "fit" , xsz + "," + ysz )
        return self.qapp.serverko
    
    def set(self,x1, y1,z1 , x2,y2,z2):
        self.qapp.appendEvent( 2501 , x1+","+y1+","+z1 , x2+","+y2+","+z2)
        return self.qapp.serverko
    
    def proj(self,fov, near, far):
        self.qapp.appendEvent( 2502 , fov , near+","+far)
        return self.qapp.serverko

    def projHud(self,fov, near, far):
        self.qapp.appendEvent( 2512 , fov , near+","+far)
        return self.qapp.serverko

    def fitHud(self,xsz, ysz):
        self.qapp.appendEvent( 2510 , "fit" , xsz + "," + ysz )
        return self.qapp.serverko

    def setHud(self,x1, y1,z1 , x2,y2,z2):
        self.qapp.appendEvent( 2511 , x1+","+y1+","+z1 , x2+","+y2+","+z2)
        return self.qapp.serverko


class Connect:
    def __init__(self, qapp):
        self.qapp = qapp
    
    def connect(self,ip, callback):
        self.qapp.appendEvent( 7000 , ip ,callback)    
        return self.qapp.serverko

    def disconnect_(self):
        self.qapp.appendEvent_( 7003 , "" , "" )    
        return self.qapp.serverko
    
    def join(self,roomid, user, callback):
        self.qapp.appendEvent( 7001 , roomid+"|"+user ,callback)    
        return self.qapp.serverko

    def send(self,data):
        self.qapp.appendEvent( 7002 , data,"" )    
        return self.qapp.serverko

class Env:
    def __init__(self, qapp):
        self.qapp = qapp

    def set(self,name, value):
        self.qapp.appendEvent( 200 , name ,value)    
        return self.qapp.serverko


class Settings:
    def __init__(self, qapp):
        self.qapp = qapp

    def open(self):
        self.qapp.appendEvent( 2600 , "" ,"")
        return self.qapp.serverko

    def save(self):
        self.qapp.appendEvent( 2601 , "" ,"")
        return self.qapp.serverko
    
    def writeInt(self,name, value):
        self.qapp.appendEvent( 2610 , name ,value)
        return self.qapp.serverko
    
    def writeString(self,name, value):
        self.qapp.appendEvent( 2611 , name ,value)
        return self.qapp.serverko
    
    def loadInt(self,name, value):
        self.qapp.appendEvent( 2620 , name , value )
        return self.qapp.serverko
    
    def loadString(self,name, value):
        self.qapp.appendEvent( 2621 , name ,value)
        return self.qapp.serverko
    
    def loadArray(self,name, value):
        self.qapp.appendEvent( 2622 , name ,value)
        return self.qapp.serverko


class Client:
    def __init__(self, qapp):
        self.qapp = qapp

    def allevals(self, delay, script):
        self.qapp.appendEvent( 101 , delay , script)
        return self.qapp.serverko
    
    def evals(self,userID , delay, script):
        self.qapp.clientAppendEvent( userID, 101 , delay , script)
        return self.qapp.serverko

    def load(self,userID , script):
        self.qapp.clientAppendEvent( userID, 102 , script)
        return self.qapp.serverko

    def include(self,userID , script):
        self.qapp.clientAppendEvent( userID, 103 , script)
        return self.qapp.serverko



class Util:
    def __init__(self, qapp):
        self.qapp = qapp

    def touchonoff(self,delay):
        if (delay is None):
            delay = 1000;
        self.qapp.env.set('touch','off')
        self.qapp.evals(delay, "Q.env.set_('touch','on')" )        
    
    def touchonoff_(self,delay):
        if (delay is None):
            delay = 1000;
        self.qapp.env.set_('touch','off')
        self.qapp.evals_(delay,"Q.env.set_('touch','on')")        
    
      
    def tob64(self,data):
        str ="#64#" + base64.b64encode(data)
        return str;
    



class Anim:
    def __init__(self, qapp):
        self.qapp = qapp

    def move(self, name, path, type, callback):
        self.qapp.appendEvent( 4200 , name ,path,type,callback)
        return self.qapp.serverko
    
    def rotate(self, name, path, type, callback):
        self.qapp.appendEvent( 4210 , name ,path,type,callback)
        return self.qapp.serverko

    def object(self,id,name,delay,coords):
        self.qapp.appendEvent3( 4300 , id , name ,delay,coords)
        return self.qapp.serverko

class WorldObject:
    name = None
    template = None
    location = None
    bounds = None
    texture = None
    state = None

class Objects:
    def __init__(self, qapp):
        self.qapp = qapp

    def create(self, name ,value):
        self.qapp.appendEvent( 4100 , name ,value)
        return self.qapp.serverko
    
    def place(self,name,value):
        self.qapp.appendEvent( 4110 , name ,value)
        return self.qapp.serverko
    
    def remove(self,name,value):
        self.qapp.appendEvent( 4150 , name ,value)
        return self.qapp.serverko

    def scale(self,name,value):
        self.qapp.appendEvent( 4120 , name ,value)
        return self.qapp.serverko

    def texture(self,name,value):
        self.qapp.appendEvent( 4130 , name ,value)
        return self.qapp.serverko
    
    def state(self,name,value):
        self.qapp.appendEvent( 4140 , name ,value)
        return self.qapp.serverko
    
    def createObjects(self,objs, send):
        # send cached layout info
        a = 0
        
        if (send == 1):
            self.qapp.serverko.startData()

        self.qapp.serverko.reserveSpace()
        self.qapp.serverko.startTag()
        self.qapp.serverko.appendTag( "res", "objs")
        self.qapp.serverko.addSeparator()      
        self.qapp.serverko.startTags("object")
        
        for obj in objs:
            if ( a> 0):
                self.qapp.serverko.addSeparator()
            a += 1

            self.qapp.serverko.startTag()
            if (obj.name is not None):
                self.qapp.serverko.appendTag( "name", obj.name)

            if (obj.template is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "template", obj.template)
            
            if (obj.location is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "location", obj.location)

            if (obj.bounds is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "bounds", obj.bounds)

            if (obj.texture is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "texture", obj.texture)

            if (obj.state is not None):
                self.qapp.serverko.addSeparator()           
                self.qapp.serverko.appendTag( "state", obj.state)
            
            self.qapp.serverko.endTag( "object")    #/ TODO without param        

        self.qapp.serverko.endTags( "object")    #/ TODO without param
        self.qapp.serverko.endTag("")    

        if (send == 1):
            self.qapp.serverko.sendData()       

    def add(self,objs):
        self.createObjects(objs , 0)

    def clientAdd(self,userID , objs):
        self.createObjects(objs , 0)
    
    def add_(self,objs):
        self.createObjects(objs , 1)

    def clientAdd_(self,userID , objs):
        self.createObjects(objs , 1)
    

class AnimFrame:

    rotate = None
    scale = None
    translate = None
    
    rotate2 = None
    scale2 = None
    translate2 = None
    
    offset = None
    operation = None


class AnimType:
    id = None
    frames = []
    delay = None
    repeat = None


class Animations:
    def __init__(self, qapp):
        self.qapp = qapp
    
    def add(self,adata):
        self.createAnim(adata , 0)
        return self.qapp.serverko

    def createAnim(self,adata, send):
        
        # send cached layout info
        #print("JS:layout_createLayout " + type + " " + len(areas)  
        
        if (send == 1):
            self.qapp.serverko.startData()

        self.qapp.serverko.reserveSpace()
        self.qapp.serverko.startTag()
        self.qapp.serverko.appendTag( "res", "animation")
        self.qapp.serverko.addSeparator()  
        self.qapp.serverko.appendTag( "id", adata.id )
        if (adata.delay is not None):
            self.qapp.serverko.addSeparator()      
            self.qapp.serverko.appendTag( "delay", adata.delay )

        if (adata.repeat is not None):
            self.qapp.serverko.addSeparator()      
            self.qapp.serverko.appendTag( "repeat", adata.repeat )
        
        self.qapp.serverko.addSeparator()      
        self.qapp.serverko.startTags("frames")
        
        a = 0
        for frame in adata.frames:
            # add properties
            
            if ( a> 0):
                self.qapp.serverko.addSeparator()

            self.qapp.serverko.startTag()
            self.qapp.serverko.appendTag( "id", str(a) )

            if (frame.rotate is not None):
                self.qapp.serverko.addSeparator()
                self.qapp.serverko.appendTag( "rotate", frame.rotate)

            if (frame.scale is not None):
                self.qapp.serverko.addSeparator()
                self.qapp.serverko.appendTag( "scale", frame.scale)

            if (frame.translate is not None):
                self.qapp.serverko.addSeparator()
                self.qapp.serverko.appendTag( "translate", frame.translate)
            
            if (frame.rotate2 is not None):
                self.qapp.serverko.addSeparator()
                self.qapp.serverko.appendTag( "rotate2", frame.rotate2)

            if (frame.scale2 is not None):
                self.qapp.serverko.addSeparator()
                self.qapp.serverko.appendTag( "scale2", frame.scale2)

            if (frame.translate2 is not None):
                self.qapp.serverko.addSeparator()
                self.qapp.serverko.appendTag( "translate2", frame.translate2)
            
            if (frame.operation is not None):
                self.qapp.serverko.addSeparator()
                self.qapp.serverko.appendTag( "operation", frame.operation)

            self.qapp.serverko.endTag("")        

        self.qapp.serverko.endTags( "frames")    
        self.qapp.serverko.endTag("")    

        if (send == 1):
            self.qapp.serverko.sendData()


class Scores:
    def __init__(self, qapp):
        self.qapp = qapp

    def login(self,callback):
        serverko.appendEvent(500, ""  ,callback)    
        return self.qapp.serverko

    def submit(self,value, callback):
        serverko.appendEvent(510 , value , callback)       
        return self.qapp.serverko

    def showscores(self,value , callback):
        serverko.appendEvent(520 , value , callback)       
        return self.qapp.serverko

    def reload(self,value , callback):
        serverko.appendEvent(521 , value , callback)       
        return self.qapp.serverko

class QApp:

    def __init__(self):
        self.serverko = Serverko()
        self.layout = Layout(self)
        self.textures = Textures(self)
        self.sounds = Sounds(self)
        self.models = Models(self)
        self.settings = Settings(self)
        self.camera = Camera(self)
        self.env = Env(self)
        self.connect = Connect(self)
        self.handlers = Room()
        self.util = Util(self)
        self.client = Client(self)
        self.objects = Objects(self)
        self.anim = Anim(self)
        self.animations = Animations(self)
        self.scores = Scores(self)
        

    def evals(self, delay, script):
        self.serverko.evals(delay , script)
        return self.serverko
    
    
    def goUrl(self,type, url):
        self.appendEvent( 1200 , type, url )
        return self.serverko

    def startUpdate(self):
        self.serverko.startData()

    def sendUpdate(self):
        self.serverko.sendData()

    def appendEvent(self,id, area, data, data2 = None, data3 = None, data4 = None):
        self.serverko.appendEvent(id, area, data, data2, data3, data4)

    def clientAppendEvent(self,userID , id, area, data, data2 = None, data3 = None, data4 = None):
        self.serverko.clientAppendEvent(userID , id, area, data, data2, data3, data4)

    def appendEvent_(self,id, area, data, data2 = None, data3 = None, data4 = None):
        self.serverko.appendEvent_(id, area, data, data2, data3, data4)

    def clientAppendEvent_(self,userID , id, area, data, data2 = None, data3 = None, data4 = None):
        self.serverko.clientAppendEvent_(userID , id, area, data, data2, data3, data4)
    
    def clientStartUpdate(self,userID):
        self.serverko.clientStartData(userID)

    def clientSendUpdate(self,userID):
        self.serverko.clientSendData(userID)
    
    def println(self,data):
        self.layout.println(data)
        return self.serverko
    
    def event(self,id, delay, data):
        serverko.sendEvent(id, delay, data)
        return self.serverko
    
    def include(self,id):
        self.serverko.loadModule(id)
        return self.serverko
    
    def load(self,id):
        self.serverko.loadModule2(id) 
        return self.serverko        

    def scriptAdd(self , wdir , script , name):
        serverkob.scriptAdd(wdir , script , name)

Q = QApp()

console.log(" q ok")

sysareas = []

areaStdOut = LayoutArea()
areaStdOut.type = "text.mline";
areaStdOut.id = "stdout";
areaStdOut.location="0,0,2,2";
areaStdOut.size = "10,10,10";
areaStdOut.text = "";
areaStdOut.display = "hud";
sysareas.append(areaStdOut)
Q.layout.add("*", sysareas).now()


# create animations
frame = AnimFrame()
frame.translate = "0,0,0";
anim = AnimType()
anim.id = "move";
anim.frames.append(frame)
Q.animations.add(anim).now()

frame = AnimFrame()
frame.rotate = "0,0,0";
anim = AnimType()
anim.id = "rotate";
anim.frames.append(frame)
Q.animations.add(anim).now()

frame1 = AnimFrame()
frame1.scale = "0.001,0.001,0.001";
frame2 = AnimFrame()
frame2.scale = "1.0,1.0,1.0";
anim = AnimType()
anim.id = "spawn";
anim.frames.append(frame1)
anim.frames.append(frame2)
Q.animations.add(anim).now()

frame1 = AnimFrame()
frame1.scale = "1.0,1.0,1.0";
frame2 = AnimFrame()
frame2.scale = "1000.0,1000.0,1000.0";
anim = AnimType()
anim.id = "away";
anim.frames.append(frame1)
anim.frames.append(frame2)
Q.animations.add(anim).now()


frame = AnimFrame()
frame.translate = "0,0,0";
frame.rotate = "0,0,0";
frame.scale = "0,0,0";
frame.translate2 = "0,0,0";
frame.rotate2 = "0,0,0";
frame.scale2 = "0,0,0";
anim = AnimType()
anim.id = "transform";
anim.frames.append(frame)
Q.animations.add(anim).now()

anim = AnimType()
anim.id = "walk";
anim.frames.append(frame)
Q.animations.add(anim).now()


anim = AnimType()
anim.id = "walkhigh";
div = 3.14/5;
for a in range(0,6):
    frame = AnimFrame()
    frame.translate2 = "0,0,"+str( (0.5*math.sin(a*div)) )
    frame.operation = "pdist";
    anim.frames.append(frame)

Q.animations.add(anim).now()

Q.handlers.onUserJoined.append(Q.serverko.onClientConnected)
Q.handlers.onUserLeft.append(Q.serverko.onClientDisconnected)


def Q_handlers_script_info():
    global Q
    return Q.handlers.script_info()

def Q_handlers_script_init():
    global Q
    return Q.handlers.script_init()
    
def Q_handlers_script_start():
    global Q
    return Q.handlers.script_start()

def Q_handlers_script_end():
    global Q
    return Q.handlers.script_end()

def Q_handlers_script_onEvent(type , data):
    global Q
    return Q.handlers.script_onEvent(type , data)

def Q_handlers_script_userJoined(userid):
    global Q
    return Q.handlers.script_userJoined(userid)

def Q_handlers_script_userLeft(userid):
    global Q
    return Q.handlers.script_userLeft(userid)

def Q_handlers_script_userData( userid , data):
    global Q
    return Q.handlers.script_userData(userid, data)

