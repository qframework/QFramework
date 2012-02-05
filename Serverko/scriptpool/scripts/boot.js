print("INFO: boot statup ");

// TODO make new class for this
serverko.setSQLDB("card.db");



// for server http gateway mode
/*
serverko.startHttp(51000);
serverko.connect4Http(10000, "127.0.0.1",51001);
serverko.connect4Http(10001, "127.0.0.1",51002);
*/

// todo server start
 
//for normal gameplay server mode
serverko.startTcp(51001);

//var id1 = serverko.scriptAdd("main_chat/main_chat.js");
//var id2 = serverko.scriptAdd("bela/bela.js");
//var id3 = serverko.scriptAdd("sorry/sorry.js");

var id;
id = serverko.scriptAdd("test/test_area_1.js");
print( "JS:test/test_area_1.js =" + id );
id = serverko.scriptAdd("test/test_area_2.js");
print( "JS:test/test_area_2.js =" + id );



// TODO
//  http server role
//  boot http 
//  make list of server connections
//  connect to each standalone server

// vote -> client requests sysmenu to display?

// startvote, kick,....
// startvote, restart
// startvote, game,....

// menu displayed by client
// menu data sent to server -> server responds with menu to all clients

// vote:restart
// vote:game,
// vote:restart - vote sent - confirm vote for restart - sent to all users
// response - yes no - another menu - dyn ???

// bug 1 - focusi - treba pane dodati novi :( 

// java meniji na clijentima... 


