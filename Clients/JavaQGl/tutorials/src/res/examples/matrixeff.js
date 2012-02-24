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


var matrix_no;
var matrix_x1;
var matrix_x2;
var matrix_y1;
var matrix_y2;
var matrix_loc;
var matrix_state;
var matrix_speed;
var matrix_count;
var matrix_int;
var matrix_texts;
var matrix_rows;
var matrix_loops;
var matrix_active = false;
var matrix_toclose = true;
var matrix_firstpass = true;

function matrix_init( no , speed, xmin, xmax, ymin, ymax, loc, color1, color2)
{
	matrix_no = no;
	matrix_x1 = xmin;
	matrix_x2 = xmax;
	
	matrix_y1 = ymin;
	matrix_y2 = ymax;
	
	matrix_loc = loc;
	matrix_state = false;
	
	matrix_speed = speed;
	
	matrix_count = 0;
	// kick event
	
	matrix_int = speed / no;
	
	matrix_texts = new Array(matrix_no);
	
	matrix_rows = [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	
	matrix_loops = 0;
	matrix_toclose = false;
}

function matrix_update()
{
	if (!matrix_active)
	{
		return;
	}
	if (matrix_toclose)
	{
		matrix_toclose = false;
		matrix_active = false;
		return;
	}
	if (matrix_count >= matrix_no)
	{
		matrix_count = 0;
		matrix_loops ++;
        matrix_firstpass = false;
	}
	
    var hx1 = Q.layout.hudxmin;
    var hx2 = Q.layout.hudxmax;    
    var hy1 = Q.layout.hudymin;
    var hy2 = Q.layout.hudymax;

    var x1 = Q.layout.worldxmin;
    var x2 = Q.layout.worldxmax;    
    var y1 = Q.layout.worldymin;
    var y2 = Q.layout.worldymax;

    
	var areaname = "matrix" + matrix_count;
	var w = 0.1;
	var h = 1.0;
	var div = Math.floor((x2-x1) / matrix_rows.length * 100) / 100;
	var row = Math.floor(Math.random() * matrix_rows.length);
	while (matrix_rows[row] > matrix_loops)
	{
		row = Math.floor(Math.random() * matrix_rows.length);
	}
	matrix_rows[row] = matrix_loops+1;
	
	var x = x1 + div * row;
	//console.log( div + " "  + x  + " " + x1);
	var y = y1 - 1.5;
	var z = -0.1;
	//y = 0;
	
    if (matrix_firstpass == true)
    {	
		var area = new LayoutArea();
	    area.type = "text.label";
	    area.id = areaname;
	    area.size = "10";    
	    area.text = "0";
	    //area.display = "hud";
	    area.layout = "south-north";
	    area.location=  x +","+y+","+w+","+h+","+z;
	    area.colors = "FF11FF11,FF11FF11,00111111,00111111";
        var areas = new Array();
        areas.push(area);
        Q.layout.add(areaname, areas).now();
    }else
    {
       // console.log(" update matrix " + areaname + " " +x +","+y+","+w+","+h+","+z);    
        Q.layout.areaSetLocation(areaname,x +","+y+","+w+","+h+","+z).now();
    }
    
    matrix_texts[matrix_count] = "0";
	
    // start area moving...
    Q.layout.showAnim(areaname,"top,"+matrix_speed).now();

    Q.startUpdate();
    for (var a =0; a < matrix_no; a++)
    {
    	areaname = "matrix" + a;
    	if (matrix_texts[a] != undefined)
    	{
    		matrix_texts[a] = Math.floor( Math.random() * 10) + matrix_texts[a];
    		//matrix_texts[a] += Math.floor( Math.random() * 10);
    		//console.log( areaname +  " "  + matrix_texts[a]);
    		Q.layout.areaSetText(areaname, matrix_texts[a]);
    	}
    }
    Q.sendUpdate();
    
    
	matrix_count++;

    
    Q.evals(matrix_int, "matrix_update();").now();
    
}


function matrix_disable()
{
	matrix_toclose = true;
	Q.startUpdate();
	for (var a= 0; a< matrix_no; a++)
	{
		Q.layout.hide("matrix"+ a);
	}
	Q.sendUpdate();
	
}

function matrix_enable()
{
	if (matrix_active == true)
		return;
	
	if (matrix_toclose)
	{
		matrix_toclose = false;
		return;
	}
	matrix_active = true;
	Q.evals(matrix_int, "matrix_update();").now();
}


function setuplayout()
{
	// round to fixed for better display, but use full float in calculations
    var x1 = Q.layout.hudxmin.toFixed(1);
    var x2 = Q.layout.hudxmax.toFixed(1);    
    var y1 = Q.layout.hudymin.toFixed(1);
    var y2 = Q.layout.hudymax.toFixed(1);
    
    var wx1 = Q.layout.worldxmin.toFixed(1);
    var wx2 = Q.layout.worldxmax.toFixed(1);    
    var wy1 = Q.layout.worldymin.toFixed(1);
    var wy2 = Q.layout.worldymax.toFixed(1);

    var areas = new Array();

	// add exit area
	var areaExit = new LayoutArea();    
	areaExit.type = 'layout.back';
	areaExit.background = 'FFFFFFFF,icons.2.8.8';
	areaExit.location= (x2- 0.11) +','+(y2-0.11);
	areaExit.bounds = '0.20,0.20';
	areaExit.display = 'hud';
	areaExit.onclick = 'js:test_exit';
    areas.push(areaExit);
    
	Q.layout.add("matrix", areas).now();
	// show page
	Q.layout.show("matrix").now();	
	
	matrix_init( 12 , 12000 , wx1, wx2, wy1, wy2, "hud");
	matrix_enable();
}

function test_exit(area,index)
{
	matrix_disable();
	Q.startUpdate();
	Q.layout.clear("matrix");
	for (var a=0; a< 12; a++)
	{
		Q.layout.clear("matrix"+a);
	}
	
	Q.layout.show('mainmenu');
	Q.sendUpdate();
	
	
}


setuplayout();

