serverko.trace("INFO: room.py")

# define room class
class Room:
	script_init = []
	script_start = []
	script_info = []
	script_end = []
	script_onGameEvent = []
	script_onUserJoined = []
	script_onUserData = []
	script_onUserLeft = []
	script_onEvent = []

# define object
room = Room()

# define server interface functions
def script_init() :
	serverko.trace("INFO: script_init")
	[cb() for cb in room.script_init]

def script_start() :
	serverko.trace("INFO: script_start")
	[cb() for cb in room.script_start]

def script_info() :
	serverko.trace("INFO: script_info")
	results = [cb() for cb in room.script_info]
	info = "".join(results)
	return info


def script_end() :
	serverko.trace("INFO: script_end")
	[cb() for cb in room.script_end]


def script_onEvent(id, data) :
	serverko.trace("INFO: script_onEvent")
	[cb(id, data) for cb in room.script_onEvent]

def script_onUserJoined(userID) :
	serverko.trace("INFO: script_onUserJoined")
	[cb(userID) for cb in room.script_onUserJoined]


def script_onUserData(userID, data) :
	serverko.trace("INFO: script_onUserData")
	[cb(userID, data) for cb in room.script_onUserData]

def script_onUserLeft(userID) :
	serverko.trace("INFO: script_onUserLeft")
	[cb(userID) for cb in room.script_onUserLeft]

