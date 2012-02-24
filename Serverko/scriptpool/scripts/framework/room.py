console.log("INFO: room.py")

# define room class
class Room:
    onInit = []
    onStart = []
    onInfo = []
    onEnd = []
    onGameEvent = []
    onUserJoined = []
    onData = []
    onUserLeft = []
    onEvent = []

    # define server interface functions
    def script_init(self) :
        #console.log("INFO: script_init")
        [cb() for cb in self.onInit]

    def script_start(self) :
        #console.log("INFO: script_start")
        [cb() for cb in self.onStart]

    def script_info(self) :
        #console.log("INFO: script_info")
        results = [cb() for cb in self.onInfo]
        info = "".join(results)
        return info


    def script_end(self) :
        #console.log("INFO: script_end")
        [cb() for cb in self.onEnd]


    def script_onEvent(self,id, data) :
        #console.log("INFO: script_onEvent")
        [cb(id, data) for cb in self.onEvent]

    def script_userJoined(self,userID) :
        #console.log("INFO: script_onUserJoined")
        [cb(userID) for cb in self.onUserJoined]


    def script_userData(self,userID, data) :
        #console.log("INFO: script_onUserData")
        [cb(userID, data) for cb in self.onData]

    def script_userLeft(self,userID) :
        #console.log("INFO: script_onUserLeft")
        [cb(userID) for cb in self.onUserLeft]

