console.log( " cards.js " );


var areas = new Array();

var item = new LayoutArea();
item.type = "layout.back";
item.background="FF114411";
item.location= "0.0,0.0,0.0";
item.bounds="4.8,3.2";
areas.push(item);


var areaDeck = new LayoutArea();
areaDeck.type = "cards.deckback2";
areaDeck.size = "8";
areaDeck.background = "44FFFFFF";
areaDeck.location= "0.0,0.6,0.01";
areaDeck.bounds= "0.4,0.6";
areaDeck.id  = "cardsdeck";
areas.push(areaDeck);

var areaMess = new LayoutArea();
areaMess.type = "text.label";
areaMess.text = "wait for next round";
areaMess.display = "hud";
areaMess.location= "0.0,0.0,0.0";
areaMess.bounds= "2.6,0.12";
areaMess.id = "cardsmessage";
areas.push(areaMess);

var areaCards1 = new LayoutArea();
areaCards1.type = "cards.cards";
areaCards1.size = "8,8,1";
areaCards1.location= "0.0,-0.7,0.01";
areaCards1.bounds= "3.0,0.6";
areaCards1.id  = "cards1";
areaCards1.onclick = "js:send_data";
areas.push(areaCards1);

console.log( " cards.js " );

// add cards layout
// add list of users joined , as small score list!
// draw eight cards , find ACE spades

// small helpers in clients main.js


// events...

function client_onConnected(userID)
{

    Q.clientStartUpdate(userID);
    Q.layout.hide("serverb").toUser(userID);
    Q.layout.add("cardsgame", areas).toUser(userID);
    Q.layout.show("cardsgame").toUser(userID);
    Q.clientSendUpdate(userID);

}

function client_onClientdata(userID, data)
{

}

function client_onDisConnected(userID)
{

}

// register handlers
Q.handlers.onData.push(client_onClientdata);
Q.handlers.onUserJoined.push(client_onConnected);
Q.handlers.onUserLeft.push(client_onDisConnected);

var dealcount = 0;

function restart_game()
{
    Q.startUpdate();
    Q.layout.areaClear("cards1");
    Q.layout.areaSetText("cardsmessage" , " javascript dealing cards");
    var cards = "";
    var drawncards = new Array();

    for (var a=0; a< 8; )
    {
        var card = Math.floor( Math.random() * 32 );
        if (Q.util.indexOf(drawncards, card) == -1)
        {
            drawncards.push( card );
            cards += "[i]images."+card+",";
            a++;
        }
    }

    Q.layout.areaSetItems("cardsdeck", cards);
    Q.sendUpdate();
    game_start();
    dealcount = 0;
}


function deal_card()
{
    if (dealcount < 8)
    {
        Q.startUpdate();
        Q.layout.itemMoveA("cardsdeck" , 7-dealcount, "cards1", dealcount, 'walkhigh', 100,"");
        Q.sendUpdate();
        Q.evals( 100, "deal_card();");
        dealcount++;
    }else
    {
        Q.evals(1000, "restart_game();" );
    }

}

function game_start()
{
    // deal 8 cards
    console.log(" deal cards " );
    Q.evals(100, "deal_card();" );
}


// kick off game
Q.evals(1000, "restart_game();" ).now();



