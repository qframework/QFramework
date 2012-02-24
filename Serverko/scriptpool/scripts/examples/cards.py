console.log( " cards.js " )

areas = [];

item = LayoutArea()
item.type = "layout.back"
item.background="FF114411"
item.location= "0.0,0.0,0.0"
item.bounds="4.8,3.2"
areas.append(item)


areaDeck = LayoutArea()
areaDeck.type = "cards.deckback2"
areaDeck.size = "8"
areaDeck.background = "44FFFFFF"
areaDeck.location= "0.0,0.6,0.01"
areaDeck.bounds= "0.4,0.6"
areaDeck.items = "[i]images.31,[i]images.31,[i]images.31,[i]images.31,[i]images.31,[i]images.31,[i]images.31,[i]images.31"
areaDeck.id  = "cardsdeck"
areas.append(areaDeck)

areaMess = LayoutArea()
areaMess.type = "text.label"
areaMess.text = "wait for next round"
areaMess.display = "hud"
areaMess.location= "0.0,0.0,0.0"
areaMess.bounds= "2.0,0.12"
areaMess.id = "cardsmessage"
areas.append(areaMess)

areaCards1 = LayoutArea()
areaCards1.type = "cards.cards"
areaCards1.size = "8,8,1"
areaCards1.location= "0.0,-0.7,0.01"
areaCards1.bounds= "3.0,0.6"
areaCards1.id  = "cards1"
areaCards1.onclick = "js:send_data"
areas.append(areaCards1)

console.log( " cards.js " )

# add cards layout
# add list of users joined , as small score list!
# draw eight cards , find ACE spades

# small helpers in clients main.js


# events...

def client_onConnected(userID):
    Q.clientStartUpdate(userID)
    Q.layout.hide("serverb").toUser(userID)
    Q.layout.add("cardsgame", areas).toUser(userID)
    Q.layout.show("cardsgame").toUser(userID)
    Q.clientSendUpdate(userID)

def client_onClientdata(userID, data):
    pass

def client_onDisConnected(userID):
    pass

# register handlers
Q.handlers.onData.append(client_onClientdata)
Q.handlers.onUserJoined.append(client_onConnected)
Q.handlers.onUserLeft.append(client_onDisConnected)

dealcount = 0

def restart_game():
    global dealcount
    Q.startUpdate()
    Q.layout.areaClear("cards1")
    Q.layout.areaSetText("cardsmessage" , " dealing cards... ")
    Q.layout.areaSetItems("cardsdeck", "[i]images.31,[i]images.31,[i]images.31,[i]images.31,[i]images.31,[i]images.31,[i]images.31,[i]images.31")
    Q.sendUpdate()
    game_start()
    dealcount = 0


def deal_card():
    global dealcount
    if (dealcount < 8):
        Q.startUpdate()
        Q.layout.itemMoveA("cardsdeck" , 7-dealcount, "cards1", dealcount, 'walkhigh', 100,"")
        Q.sendUpdate()
        Q.evals( 100, "deal_card();")
        dealcount += 1
    else:
        Q.evals(1000, "restart_game();" )

def game_start():
    # deal 8 cards
    console.log(" deal cards " )
    Q.evals(100, "deal_card();" )

# kick off game
Q.evals(1000, "game_start();" ).now()

