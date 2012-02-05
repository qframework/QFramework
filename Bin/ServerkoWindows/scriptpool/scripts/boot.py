#start
serverko.trace('INFO: boot statup ')

#start server also as listener
serverko.startHttp('8085')

#add script to listen to room stats
#serverko.scriptAdd('serverb' , 'serverb.js' , 'sb'); 

#serverko.scriptAdd('bela' , 'main.js', '0. ');


serverko.trace('JS:DONE ')
