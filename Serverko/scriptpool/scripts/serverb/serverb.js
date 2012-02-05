//
//
//
var serverdata = undefined;
var users = new Array();
var roomnames = new Array();
var usersSel = {};

Array.prototype.removeItems = function(itemsToRemove) {

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
    //print("INFO: serverb client_onDisConnected:"+ userID );
    users.removeItems(["[t]"+userID]);
    //print("INFO: serverb client_onDisConnected:"+ users);
//    send_users();
    //update_clients();
}

function client_onClientdata(userID, data)
{
    //print("INFO:client_onClientdata:"+ userID + "," + data);
    
    if (userID == "serverko_system")
    {
        serverdata  = eval( '(' + data + ')' );
        print_serverdata();
//        update_clients();
        //print("INFO: eval :" + serverdata.toString());
    } else
    {
        var args = data.split(",");
        if (args[0] == "roominfo")
        {
            usersSel[userID] = 0;
            serverb_setUserRoom(userID);
        }else 
        if (args[0] == "roominfoleft")
        {
            usersSel[userID] = usersSel[userID]-1;
            if (usersSel[userID] < 0)
            {
                usersSel[userID] = roomnames.length-1;
            }
            serverb_setUserRoom(userID);
        }else 
        if (args[0] == "roominforight")
        {
            usersSel[userID] = usersSel[userID]+1;
            if (usersSel[userID] >= roomnames.length-1)
            {
                usersSel[userID] = 0;
            }
            serverb_setUserRoom(userID);
        }else                 
        if (args[0] == "say")
        {     
            Q.startUpdate();
            Q.layout.areaPushItemFront("clist", "[t]" + userID + ":" + args[1]);
            Q.sendUpdate();
        } else
        if (args[0] == "quickp")
        {
            var gs = serverdata["gs"];
            var rooms = gs["room"];        
            for (var id = 1; id < rooms.length ; id ++)
            {
                var room = rooms[id];
                var users = parseInt(room["users"]);
                if (users > 0 && users < 4)
                {
                    var exec = "roomsSel="+ (id-1) + ";";
                    exec += "serverb_onPlay();";
                    print ("INFO: " + exec);
                    Q.client.exec_(userID, 0, exec );
                    print ("INFO: sent " + exec);
                    return;
                }
            }
                        
            for (var id = 1; id < rooms.length ; id ++)
            {
                var room = rooms[id];
                var users = parseInt(room["users"]);
                if (users < 4)
                {
                    var exec = "roomsSel="+ (id-1) + ";";
                    exec += "serverb_onPlay();";
                    print ("INFO: " + exec);
                    Q.client.exec_(userID, 0, exec );
                    print ("INFO: sent " + exec);
                    return;
                }
            }
            
            Q.client.exec_(userID, 100, "onQuickPlay(111);");
        }
        // do user req
        // todo - user chat
        
    }
}

function update_client(userID)
{
    //print("INFO:updateclient:" + userID);
/*    
    Q.clientStartUpdate(userID);
    // send client rooms
    Q.layout.clientAreaSetItems(userID , "rlist",roomnames.toString());
    Q.clientSendUpdate(userID);
*/
}

function update_clients()
{
    //print("INFO:updateclient:" + userID);
    Q.startUpdate();
    // send client rooms
    Q.layout.areaSetItems("rlist",roomnames.toString());
    Q.sendUpdate();

}

function client_onConnected(userID)
{
    print("INFO: serverb client_onConnected:" + userID);
    //layout.println("user joined " + userID);
    //Q.clientStartUpdate(userID);
    // send client rooms
    //Q.layout.clientAreaSetText(userID , "serverinfo","belaserverinfo");
    //Q.clientSendUpdate(userID);
    serverko.clientSpectate(userID , 1);
    
    //update_client(userID);
    users.push("[t]"+userID);
    
    usersSel[userID] = 0;
    
    serverb_setUserRoom(userID);
    
    //Q.exec_(0,"update_client("+ userID + ");" )
//    send_users();
//    update_clients();
}

function print_serverdata()
{
    var gs = serverdata["gs"];
    var rooms = gs["room"];
    //print ("INFO:print_serverdata "+ rooms.length);
    roomnames = new Array();
    
    for (var a=1; a < rooms.length; a++)
    {
        var room = rooms[a];
        /*
        print("JS:--------------");
        print("JS:  " + room["id"]);
        print("JS:  " + room["name"]);
        print("JS:  " + room["script"]);
        print("JS:  " + room["users"]);
        print("JS:  " + room["maxusers"]);
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
        var gs = serverdata["gs"];
        var rooms = gs["room"];        
        var id = parseInt(usersSel[userID]);
        
        print("INFO: roominfo :" + userID + "," +  rooms.length);
        //print("INFO: roominfo :" + args[0] + " " + args[1] + " " + id);

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
        
        print("INFO: roominfo :" + userID + "," +  str);
        
        Q.clientStartUpdate(userID);
        Q.client.exec_(userID, 0 ,  "roomsSel = " + id + ";");
        //Q.layout.clientAreaSetItem(userID , "ilist", id , str);
        Q.layout.clientAreaSetText(userID , "rinfo", str);
        
        if (parseInt(room["users"]) < 4)
        {
            //Q.layout.clientAreaSetState(userID, "serverconn", "visible");
            //Q.layout.clientAreaSetItems(userID, "rinfostat", "[i]cards.52");
            Q.clientSendUpdate(userID);
            Q.client.exec_(userID,0,"serverb_enablejoin(true);");
        }
        else
        {
           // Q.layout.clientAreaSetState(userID, "serverconn", "hidden");
           // Q.layout.clientAreaSetItems(userID, "rinfostat", "[i]cards.51");
            Q.clientSendUpdate(userID);
            Q.client.exec_(userID,0,"serverb_enablejoin(false);");
        }
        
}

Q.handlers.onData.push(client_onClientdata);
Q.handlers.script_userJoined.push(client_onConnected);
Q.handlers.script_userLeft.push(client_onDisConnected);


