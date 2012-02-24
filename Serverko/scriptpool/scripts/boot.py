#start
console.log('boot statup ')

#start server as http listener at port
serverkob.startHttp('8080')

#add script to listen to room stats , must be started as first!
# for now it is hardcoded that this script will recieve info about other rooms
serverkob.scriptAdd('serverb' , 'serverb.js' , 'sb'); 

#add other scripts ' syntah, working folder relative to scripts - startup script , its name

testnames = [ "JS Cards example", "PY Cards example"];


testscripts = ["cards.js", "cards.py"]

for a in range(0, len(testscripts)):
    Q.scriptAdd('examples' , testscripts[a], testnames[a])

console.log('DONE ')

