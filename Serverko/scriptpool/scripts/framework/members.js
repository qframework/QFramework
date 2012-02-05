// team balance


// list of teams
// list of players in teams (configurable)
// when player is connected - it goes to spectate (if there is free slot)

// numteams 
// teamplayers
// maxplayers
// autoassign
//
// -> team,2, , , team,2, specs,...
// jteam,0 , jteam,1
// slanje string poruka ( za sada na engleskom - language .... )


// on user joined
// send teams 
// send message -> joined room

// on user jteam
// on error -> send error
// on OK  - > send string

// on user left

function member(id, iscomp, team)
{
    print("JS:member " + id + " " + iscomp + " " + team );  
    // each member
        // id
    this.id = id;
        // iscomp
    this.iscomp = iscomp;
        // team
    this.team = 0;
    
    if (team <= room.members.numteams)
    {
        this.team = team;        
    }

}

function members()
{
    
    print("JS:members " );  
    // init overidables
    
    room.onSystemInit = members_Init;
    // for client join
    room.onSystemUserJoined = members_UserJoined;
    
    // for client data
    room.onSystemUserData = members_UserData;
    
    // for client left
    room.onSystemUserLeft = members_UserLeft;

    
    this.numteams = 2;
    this.playersinteams = 2;    
    this.maxplayers = 12;
    this.humanplayers = 0;
}



function members_Init()
{
    var a;
    var count =0;
    var currteam = 1;
    print("JS:members_Init " );  
    
    room.members.member = new Array( room.members.maxplayers );
    
    room.members.teamsnum = new Array(room.members.numteams);
    
    // run default setup (default is all comps)
    for (a=0; a< room.members.maxplayers; a++)
    {
        room.members.member[a] = new member("computer", 1, currteam);
        count++;
        if (count == room.members.playersinteams)
        {
            room.members.teamsnum[currteam-1] = count;
            currteam++;
            count = 0;
        }
    }

}

function members_setMemberTeam(id, team)
{
    var a;
    var free = -1;
    print("JS:members_setMemberTeam " + id + " " + team );  
    
    if (team < 0 || team > room.members.numteams)
    {
        // ERROR team wrong
        return 0;
    }
    // find are we already in team
    for (a=0; a< room.members.maxplayers; a++)
    {
        if (room.members.member[a].id == id)
        {
            if (room.members.member[a].team == team)
            {
                // already member
                return 1;
            } else if(room.members.member[a].team == 0)
            {
                // just join us
                room.members.member[a].team = team;
                room.members.member[a].id = id;
                room.members.teamsnum[team]++;
                room.members.member[a].iscomp = 0;
                room.members.humanplayers++;
                return 1;
            }  else if(room.members.member[a].team != 0)
            {
                // move from another team
                room.members.teamsnum[ room.members.member[a].team ]--;
                room.members.member[a].team = team;
                room.members.member[a].id = id;
                room.members.member[a].iscomp = 0;
                room.members.teamsnum[team]++;
                return 1;
            }
        }
        
        if (room.members.member[a].iscomp == 1 && free == -1 &&
            room.members.member[a].team == 0)
        {
            free = a;
        }
    }    
    if (free == -1)
    {
        // ERROR - don't have free
        return 0;
    }
    
    // set to free slot
    // TODO function?
    room.members.member[free].team = team;
    room.members.teamsnum[team]++;
    room.members.member[free].id = id;
    room.members.humanplayers++;  
    room.members.member[free].iscomp = 0;
    
    return 1;  
}


function members_getTeamStr()
{
    var ret = "";
    var a;
    
    for (a=0;a < room.members.maxplayers; a++)
    {
       if (room.members.member[a].iscomp == 1 && 
           room.members.member[a].team == 0)
       {
        // don't send comps that spectate
        continue;
       }
       ret += room.members.member[a].id;
       ret += ",";
       ret += room.members.member[a].team;
       if (a < room.members.maxplayers-1)
       {
            ret += ",";
       }
    }   
    
    print("JS:members_getTeamStr " + ret );  
    return ret; 
}


function members_UserJoined(id)
{
    var res;
    var team;
    print("JS:members_UserJoined " + id );  
    
    // user joined  - go to spec
    /*
    if (members_joinTeam(id, 0) == 0)
    {
        return;
    }
    */
    
    // send teams to user
    /*
    team = members_getTeamStr();
    serverko.clientStartData(id);
    // join specs
    serverko.clientAppendEvent(id, 10002, 0, team);
    serverko.clientSendData(id);    
    
    // send string to all
    res = "User: " + id + " joined room";
    serverko.startData();
    serverko.appendString( 1001, 0, res , 0);    
    serverko.sendData();
    */
}


function members_joinTeam(id, team)
{
    var a;
    print("JS:members_joinTeam " + id+ " " + team );  

    // num team  0 - spec
    //           1 .... 
    //           -1 auto
    
    // check for num of users in team
    if (team == 0)
    {
        // for spec just join if we can
        if (room.members.humanplayers < room.members.maxplayers)
        {
            members_setMemberTeam(id, team);
            return 1;
        }else
        {
            return 0;
        }
    }
    if (team == -1)
    {
        // for now first first avaiable team - TODO teambalance mode
        for (a=0 ; a < room.members.teamsnum.length ; a++)
        {
            if (room.members.teamsnum[a] < room.members.playersinteams)
            {
                team = a+1;
                break;
            }
        }
    }
    if (team == -1)
    {
        // still no room - fail
        return -1;
    }
    
    // assign player to team
    members_setMemberTeam(id, team);
    return team;
}

function members_UserData(id, data)
{
    // 
    var args;
    var ret;
    var res;
    print("JS:members_UserData " + id + " " + data);  
    args = data.split(",");
    
    // join team
    if (args[0] == "jteam")
    {
        ret = members_joinTeam(id, args[1]);
        if (ret == 0)
        {
            // fail
            serverko.clientStartData(id);
            // 10003 jointeam
            serverko.clientAppendEvent(id, 10003, 0, "FAIL");
            serverko.clientSendData(id);    
        } else
        {
            // success
            serverko.clientStartData(id);
            // 10003 jointeam
            serverko.clientAppendEvent(id, 10003, 0, "OK");
            serverko.clientSendData(id);                
            
            res = "User: " + id + " joined team " + args[1];
            serverko.startData();
            serverko.appendString( 1001, 0, res , 0);    
            serverko.sendData();            
        }
    } else if (args[0] == "teams")
    {
        // send teams info
        res = members_getTeamStr();
        serverko.clientStartData(id);
        // 10004 teams
        serverko.clientAppendEvent(id, 10004, 0, res);
        serverko.clientSendData(id);        
    }
    // TODO lteam - leave team 
    // TODO teamscore 
  
}

function members_UserLeft(id)
{
    // remove from team
    var a;
    print("JS:members_UserLeft " + id );  
    
    // find are we already in team
    for (a=0; a< room.members.maxplayers; a++)
    {
        if (room.members.member[a].id == id)
        {
            room.members.teamsnum[ room.members.member[a].team ]--;
            // same team - comp just replaces
            //room.members.member[a].team = team;
            room.members.member[a].iscomp = 1;
            room.members.member[a].id = "computer";
            room.members.humanplayers--;   
    
            res = "User: " + id + " left ";
            serverko.startData();
            serverko.appendString( 1001, 0, res , 0);    
            serverko.sendData();           
            // notify users with string        
            return;           
        }
    }    
    
    // TODO error?
    return;
}

function members_IsUserComp( id )
{
    var a;
    
    for (a=0;a < room.members.maxplayers; a++)
    {
        if (room.members.member[a].id == id)
        {
            print("JS:members_IsUserComp " + id + " 1");  
            return room.members.member[a].iscomp;
        }
    }
    print("JS:members_IsUserComp " + id + " 0");  
    return 0;
}


room.members = new members();


