/*
   Copyright 2012, Telum Slavonski Brod, Croatia.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   
   This file is part of QFramework project, and can be used only as part of project.
   Should be used for peace, not war :)   
*/


// example server browser script 
// this script is started as first ' and can serve as root information about
// all started rooms


// stored last data from server
var serverdata = [];

// list of all users
var users = new Array();
// list of all roomnames
var roomnames = new Array();
// room that user selected
var usersSel = {};

Array.prototype.removeItems = function(itemsToRemove) 
{
    if (!/Array/.test(itemsToRemove.constructor)) {
        itemsToRemove = [ itemsToRemove ];
    }

    var j;
    for (var i = 0; i < itemsToRemove.length; i++) {
        j = 0;
        while (j < this.length) {
            if (this[j] == itemsToRemove[i]) {
                this.splice(j, 1);
            } else {
                j++;
            }
        }
    }
}


function client_onDisConnected(userID)
{
    //console.log("INFO: serverb client_onDisConnected:"+ userID );
    users.removeItems(["[t]"+userID]);
    //console.log("INFO: serverb client_onDisConnected:"+ users);
//    send_users();
}

function client_onClientdata(userID, data)
{
    //console.log("INFO:client_onClientdata:"+ userID + "," + data);
    
    if (userID == "serverko_system")
    {
        serverdata  = eval( '(' + data + ')' );
        print_serverdata();

    } else
    {
        var str = PadString(">"+ userID + ":" + data ,30,  " ");
        chatMessages.unshift(str);
        chatMessages.pop();
        Q.layout.areaPushItemFront("chatlist", str).now();        
    }
}


function update_clients()
{
    //console.log("INFO:updateclient:" + userID);
    Q.startUpdate();
    // send client rooms
    Q.layout.areaSetItems("rlist",roomnames.toString());
    Q.sendUpdate();

}

function client_onConnected(userID)
{
    console.log("serverb client_onConnected:" + userID);
    print("serverb client_onConnected:" + userID);
    //serverko.clientSpectate(userID , 1);
    
    //update_client(userID);
    users.push("[t]"+userID);
    
    usersSel[userID] = 0;
    serverb_setUserRoom(userID);
    send_clientLayout(userID);
    
}

function print_serverdata()
{
    if (serverdata == undefined)
    {
        return;
    }
    var gs = serverdata["gs"];
    var rooms = gs["room"];
    //print ("INFO:print_serverdata "+ rooms.length);
    roomnames = new Array();
    
    for (var a=1; a < rooms.length; a++)
    {
        var room = rooms[a];
        /*
        console.log("JS:--------------");
        console.log("JS:  " + room["id"]);
        console.log("JS:  " + room["name"]);
        console.log("JS:  " + room["script"]);
        console.log("JS:  " + room["users"]);
        console.log("JS:  " + room["maxusers"]);
        */
        // full ID - room id
        // + chat list
        //var str = "[t]"+room["name"] +" "+ room["id"] + " "+ room["users"]+"/"+room["maxusers"];
        var str = "[t]"+room["name"] +" "+ room["users"]+"/"+room["maxusers"];
        
        roomnames.push(  PadString(str, 15, " ")  );
        
    }
}

function send_users()
{
    Q.startUpdate();
    Q.layout.areaSetItems("ulist", users.toString() );
    Q.sendUpdate();

}

function serverb_setUserRoom(userID)
{
    return;
    if (serverdata == undefined)
    {
        return;
    }
    var gs = serverdata["gs"];
    var rooms = gs["room"];        
    var id = parseInt(usersSel[userID]);
        
    console.log("INFO: roominfo :" + userID + "," +  rooms.length);
    //console.log("INFO: roominfo :" + args[0] + " " + args[1] + " " + id);

    var room = rooms[id+1];
    //var str = room["name"] +" "+ room["id"] + " "+ room["users"]+"/"+room["maxusers"];
    var str = "";
    //str += PadString( room["name"], 10, " ");
    str += PadString( "("+id + ") " + room["users"]+"/"+room["maxusers"] , 10, " ");
    var names = room["names"].split(",");
    for (var a=0; a< names.length; a++)
    {
        //str += names[a] + "/";
        str += PadString( names[a] , 10, " ");
    }
        
    console.log("INFO: roominfo :" + userID + "," +  str);
        
    Q.clientStartUpdate(userID);
    Q.client.exec(userID, 0 ,  "roomsSel = " + id + ";").now();
    //Q.layout.clientAreaSetItem(userID , "ilist", id , str);
    Q.layout.clientAreaSetText(userID , "rinfo", str);
        
    if (parseInt(room["users"]) < 4)
    {
        //Q.layout.clientAreaSetState(userID, "serverconn", "visible");
        //Q.layout.clientAreaSetItems(userID, "rinfostat", "[i]cards.52");
        Q.clientSendUpdate(userID);
        Q.client.exec(userID,0,"serverb_enablejoin(true);").now();
    }
    else
    {
        // Q.layout.clientAreaSetState(userID, "serverconn", "hidden");
        // Q.layout.clientAreaSetItems(userID, "rinfostat", "[i]cards.51");
        Q.clientSendUpdate(userID);
        Q.client.exec(userID,0,"serverb_enablejoin(false);").now();
    }
        
}


var testnames = [ "JS Cards example", "PY Cards example"];

var chatMessages = new Array(30);

var roomAreas = new Array();
var chatarea = new LayoutArea();
chatarea.type = "table.list";
chatarea.id = "chatlist";
chatarea.size = "30,10,1";
chatarea.location = "1.0,0,0";
chatarea.bounds = "2.0,2.0";
chatarea.items = "";
chatarea.foreground = "FFAABBCC,white";
chatarea.border = "thinrect";

//allocate default space for items
for (var a=0; a< 30; a++)
{
    chatarea.items += "[t] ,";
}
chatarea.scrollers = "-0.4";
chatarea.background = "FFAA3333";
chatarea.display = "hud";
roomAreas.push(chatarea);


var testsarea = new LayoutArea();
testsarea.type = "table.list";
testsarea.id = "testlist";
testsarea.size = testnames.length+",10,1";
testsarea.location = "-1.0,0,0";
testsarea.bounds = "2.0,2.0";
testsarea.items = "";
testsarea.foreground = "FFAABBCC,white";
testsarea.border = "thinrect";
testsarea.onclick = "js:start_test";
//allocate default space for items
for (var a=0; a< testnames.length; a++)
{
    testsarea.items += "[t]"+testnames[a] +",";
}
testsarea.scrollers = "-0.4";
testsarea.background = "FF3333AA";
testsarea.display = "hud";
roomAreas.push(testsarea);



function send_clientLayout(userID)
{
    // one way - add layut from server to user
    console.log( "sending layout to user " + userID);

    // send client existing message data
    chatarea.items = "";
    for (var a=0; a< 30; a++)
    {
        if (chatMessages[a] != undefined)
        {
            chatarea.items += "[t]"+chatMessages[a]+",";
        }else
        {
            chatarea.items += "[t] ,";
        }
    }

    Q.layout.add("serverb", roomAreas).toUserNow(userID);
    Q.layout.show("serverb").toUserNow(userID);

    // or we can say user to do some work by itself
    Q.client.evals(0,"add_chatLayout();").toUserNow(userID);

    // push notification to list
    Q.layout.areaPushItemFront("chatlist", "> user joined: "+ userID).now();
}


// register handlers
Q.handlers.onData.push(client_onClientdata);
Q.handlers.onUserJoined.push(client_onConnected);
Q.handlers.onUserLeft.push(client_onDisConnected);


console.log("load ok  ");
