function getPositionX(event)
{
	var x = new Number();
	var canvas = document.getElementById("qappcanvas");

	if (event.x != undefined )
	{
	  x = event.x;
	}
	else // for Firefox 
	{
	  x = event.clientX + document.body.scrollLeft +
		  document.documentElement.scrollLeft;
	}

	x -= canvas.offsetLeft;

	return x;
}
	  
function getPositionY(event)
{
	var y = new Number();
	var canvas = document.getElementById("qappcanvas");
	if (event.y != undefined)
	{
	  y = event.y;
	}
	else // Firefox method to get the position
	{
	  y = event.clientY + document.body.scrollTop +
		  document.documentElement.scrollTop;
	}
	y -= canvas.offsetTop;
	return y;
}
	  

function QStarter()
{
	this.mApp = new GameonApp();

	this.width = -1;
	this.height = -1;
	this.topCoord = 0;
	this.leftCoord = 0;
	this.lastTime = new Date().getTime();
	this.lastTime2 = new Date().getTime();
	
	this.start = function()
	{
		gl = initWebGL(
			"qappcanvas",
			"vshader", "fshader",
			[ "vColor", "vTexCoord", "vPosition"],
			[ 0.1, 0.1, 0.1, 1 ], 1.0);
		if (!gl) {
		  return;
		}
		gl.uniform1i(gl.getUniformLocation(gl.program, "sampler2d"), 0);
		gl.uniform2f(gl.getUniformLocation(gl.program, "texOffset"), 0, 0);
		gl.uniform2f(gl.getUniformLocation(gl.program, "texOffsetF"), 0, 0);
		// Enable texturing
		gl.enable(gl.TEXTURE_2D);
		
		gl.mvMatrix = new J3DIMatrix4();
		gl.u_modelViewMatrixLoc =
				gl.getUniformLocation(gl.program, "u_modelViewMatrix");
		gl.u_modelProjMatrixLoc =
				gl.getUniformLocation(gl.program, "u_modelProjMatrix");				

		gl.enableVertexAttribArray(0);
		gl.enableVertexAttribArray(1);
		gl.enableVertexAttribArray(2);
		
		this.dragging = false;
		this.mApp.init();
		
		var c = document.getElementById("qappcanvas");		
		this.mApp.mPreExec = "CanvasW = " + c.width + ";CanvasH = " + c.height + ";";		
		this.mApp.start("main.js");
		this.reshape(gl);
		return gl;
	}
	this.handleMouseUp = function (event) {
		qstart.mApp.mouseClicked(getPositionX(event), getPositionY(event));
		qstart.dragging = false;
	}
	
	this.handleMouseDown = function (event) {
		qstart.dragging = true;
		qstart.mApp.onFocusProbe(getPositionX(event), getPositionY(event));
	}
	this.handleMouseMove = function (event) {
		if (qstart.dragging) {
			qstart.mApp.mouseDragged(getPositionX(event), getPositionY(event) , false);
		}		
	}
	this.reshape = function (gl)
	{
		var canvas = document.getElementById('qappcanvas');
		
		if (canvas.width == this.width && canvas.height == this.height)
			return;
			
		if (canvas.clientTop != undefined)
		{
			this.topCoord = canvas.clientTop;
			this.leftCoord = canvas.clientLeft;
		}
		
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;		

		canvas.addEventListener("mousedown", this.handleMouseDown , false);
		canvas.addEventListener("mouseup", this.handleMouseUp , false);
		canvas.addEventListener("mousemove", this.handleMouseMove , false);
		this.width = canvas.width;
		this.height = canvas.height;
		this.mApp.surfaceChanged(gl,this.width, this.height);
	
	}


}

function drawFrame()
{
	if (qstart.mApp.hasData() == true)
	{
		qstart.reshape(gl);

		gl.clearColor(0.0,0.0,0.0,1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		qstart.mApp.drawFrame(gl);
		gl.flush();
	}
	requestAnimFrame (drawFrame);
	//TODO finish logic that will redraw only when needed
}

	
function qstart()
{
	qstart = new QStarter();
	gl = qstart.start();
	if (!gl) {
	   return;
	}

	drawFrame(gl);
}
