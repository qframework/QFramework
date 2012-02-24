
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


class Console:
    def log(self,strdata):
        serverkob.trace("JS:"+strdata)
    def error(self,strdata):
        serverkob.trace("ERROR:"+strdata)
    def info(self,strdata):
        serverkob.trace("INFO:"+strdata)
    def warn(self,strdata):
        serverkob.trace("WARN:"+strdata)

console = Console()

console.log( "serverkobridgepy start ")

class Serverko:
    databuffer = []
    clientbuffer = {}

    def reserveSpace(self):
        if len(self.databuffer) == 0:
            self.databuffer.append( [] )
        arr = self.databuffer[-1]
        arr.append("")


    def startData(self):
        if ( len(self.databuffer) >  300):
            console.log("ERROR: data push large " + self.databuffer[3])
        self.databuffer.append( [])

    def appendEvent(self,id, area, data  = None, data2 = None, data3 = None, data4 = None, data5 = None):
        if len(self.databuffer) == 0:
            self.databuffer.append("")

        strdata = "";
            
        strdata += "{\"res\":\"event\",\"id\":\""+str(id)+"\",\"type\":\""+area;
            
        if data != None:
            strdata += "\",\"data\":\""+data
        if data2 != None:
            strdata += "\",\"data2\":\""+data2
        if data3 != None:
            strdata += "\",\"data3\":\""+data3
        if data4 != None:
            strdata += "\",\"data4\":\""+data4
            
        strdata += "\"}"
            
        self.databuffer[ -1 ].append( strdata );
    
    def appendEvent_(self , id, area, data  = None, data2 = None, data3 = None, data4 = None, data5 = None):
        self.startData()
        self.appendEvent(id , area, data , data2, data3, data4, data5)
        self.sendData()

    
    def clientStartData(self,userID):
        databuffer = self.clientbuffer[userID];
        if ( len(databuffer) >  300):
            console.log("ERROR: data push large " + databuffer[3])
        databuffer.append( [])


    def clientAppendEvent_(self , userID , id, area, data  = None, data2 = None, data3 = None, data4 = None, data5 = None):
        self.clientStartData(userID)
        self.clientAppendEvent(userID , id , area, data , data2, data3, data4, data5)
        self.clientSendData(userID)


    def clientAppendEvent(self,userID , id, area, data  = None, data2 = None, data3 = None, data4 = None, data5 = None):
        databuffer = self.clientbuffer[userID];
        if len(databuffer) == 0:
            databuffer.append("")

        strdata = "";
            
        strdata += "{\"res\":\"event\",\"id\":\""+str(id)+"\",\"type\":\""+area
            
        if data != None:
            strdata += "\",\"data\":\""+data
        if data2 != None:
            strdata += "\",\"data2\":\""+data2
        if data3 != None:
            strdata += "\",\"data3\":\""+data3
        if data4 != None:
            strdata += "\",\"data4\":\""+data4
        strdata += "\"}"
            
        databuffer[ -1 ].append( strdata );


    def startTag(self,id = None):
        strdata = "" 
        if (id != None):
            strdata = "{\""+id+"\": "
        else:
            strdata = "{";
        
        arr = self.databuffer[ -1 ] 
        arr[ -1 ] += strdata
    
    def startTags(self ,  id):
        arr = self.databuffer[  -1 ]
        arr[-1] += "\""+id+"\": ["; 
    
    def appendTag( self , id, data):
        arr = self.databuffer[ -1 ]
        arr[-1] += "\""+id+"\": " + "\""+data+"\""
    
    def endTag(self,id):
        arr = self.databuffer[ -1 ]
        arr[-1] += "}";
    
    def endTags(self,id):
        arr = self.databuffer[ -1 ]
        arr[-1] += "]"

    def addSeparator(self):
        arr = self.databuffer[ -1 ]
        arr[-1] += ","

    def toUser(self,userid):
        arr = self.databuffer[ -1 ]
        strdata = arr.pop(-1)
        if len(strdata) > 0:
            databuffer = self.clientbuffer[userid];
            databuffer[-1].append(strdata)
        return self
    
    def toUserNow(self):
        arr = self.databuffer[  -1 ]
        data = arr.pop(-1)
        if len(data) > 0:
            strdata = "{\"gs\":{\"room\":[" + data + "]}}\r\n" 
            self.clientSendData(strdata);
        return self

    def now(self):
        arr = self.databuffer[ -1 ]
        if len(arr) > 0:
            data = arr.pop(-1)
            if len(data) > 0:
                strdata = "{\"gs\":{\"room\":[" + data + "]}}\r\n" 
                serverkob.sendData(strdata)
        return self

    def evals(self,delay, script):
        self.lastData = ""
        serverkob.evals(delay, script)

    def evals_(self,delay, script):
        self.lastData = ""
        serverkob.evals(delay, script)

    def sendData(self):
        if len(self.databuffer) > 0:
            arr = self.databuffer.pop(-1)
            data = "" 
            while len(arr):
                data += arr.pop(0)
                if len(arr) > 0:
                    data += ","
            strdata = "{\"gs\":{\"room\":[" + data + "]}}\r\n" 
            serverkob.sendData(strdata)

        

    def clientSendData(self,userID):
        databuffer = self.clientbuffer[userID];
        if len(databuffer) > 0:
            arr = databuffer.pop(-1)
            data = "" 
            while len(arr):
                data += arr.pop(0);
                if len(arr) > 0:
                    data += ","
            strdata = "{\"gs\":{\"room\":[" + data + "]}}\r\n" 
            serverkob.clientSendData(userID , strdata)


    def sendEvent(selfid, delay, data):
        self.lastData = ""
        serverkob.sendEvent(id, delay, data)

    def disconnectClient(self,id):
        serverkob.disconnectClient(id)
    
    def loadModule(self,id):
        self.lastData = ""
        serverkob.loadModule(id)

    def loadModule2(self,id):
        self.lastData = ""
        serverkob.loadModule2(id)

    def onClientConnected(self,userID):
        self.clientbuffer[userID] = []

    def onClientDisconnected(self , userID):
        del self.clientbuffer[userID]

console.log( "serverkobridgepy OK ")
