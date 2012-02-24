console.log('hellou Q');
// print something
//Q.print_('hellou Q');

// start data
Q.startUpdate();
// load texture
Q.textures.newFromFile("qtext","qtext.png");
Q.textures.newFromFile("qback","qback.png");
// create cube
Q.objects.create("cube1","cube");
//set its texture
Q.objects.texture("cube1","qtext");
//show it on screen
Q.objects.place("cube1","0,0,0.5");
Q.objects.scale("cube1","0.5,0.5,0.5");
Q.objects.state("cube1","visible");
//do some rotation
Q.anim.rotate("cube1","360,360,0","5000,inf","");
// send data.... 
Q.sendUpdate();

Q.camera.set(0,0,0 , 0,-2.5,2.0).now();
var areas = new Array();
var backArea = new LayoutArea();
backArea.type = "layout.back";
backArea.location = "0,1.4,0";
backArea.bounds = "6,6";
backArea.background = "FFFFFFFF,qback";
areas.push(backArea);
Q.layout.add("hellouq", areas).now();
Q.layout.show("hellouq").now();
// create 
