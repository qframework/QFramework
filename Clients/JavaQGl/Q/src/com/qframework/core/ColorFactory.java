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

package com.qframework.core;

import java.awt.Color;


public class ColorFactory {

	protected GLColor red;
	protected GLColor green;
	protected GLColor blue;
	protected GLColor yellow;
	protected GLColor redL;
	protected GLColor greenL;
	protected GLColor blueL;
	protected GLColor yellowL;

	protected GLColor orange;
	protected GLColor white;
	protected GLColor gray;
	protected GLColor black;	
	
	protected GLColor transparent;
	protected GLColor grayL;     
	protected GLColor magnenta;
	protected GLColor magnentaL;    
	protected GLColor brown;
	protected GLColor brownL;
	
    public ColorFactory()
    {
        int one = 255;
        int half = 128;
        int half2 = 200;
        //int quarter = 0x04000;

        red = new GLColor(one, 0, 0);
        green = new GLColor(0, one, 0);
        blue = new GLColor(0, 0, one);
        yellow = new GLColor(one, one, 0);

        
        transparent = new GLColor(one, one, one , one);
        
        redL = new GLColor(one, half2, half2 , half);
        greenL = new GLColor(half2, one, half2, half);
        blueL = new GLColor(half2, half2, one, half);
        yellowL = new GLColor(one, one, half2, half);

        orange = new GLColor(one, half, 0);
        white = new GLColor(one, one, one);
        gray = new GLColor(half2, half2, half2);
        black = new GLColor(0, 0, 0);	
        
        grayL = new GLColor(half , half , half);
        magnentaL = new GLColor(half2 , half , half2);
        brownL = new GLColor(half2, half , 0);
        magnenta = new GLColor(one , half , one);	
        brown = new GLColor(one , half , 0);

        
    }
    
    public GLColor getPlayerColor(int player)
    {
    	switch (player)
    	{
    	case 0: return gray;
    	case 1: return red;
    	case 4: return blue;
    	case 2: return green;
    	case 3: return orange;//yellow;    	
    	}
    	return white;
    }
    
    public GLColor getColor(String value) {
    	try 
    	{
            if (value.length() == 6)
            {
                Color c = Color.decode("0x" + value);
                return new GLColor(c.getRGB());
            }
            else
            {

                int alpha = Integer.parseInt(value.substring(0, 2) , 16);
                int red = Integer.parseInt(value.substring(2, 4) , 16);
                int green = Integer.parseInt(value.substring(4, 6) , 16);
                int blue = Integer.parseInt(value.substring(6, 8) , 16);
                GLColor c = new GLColor(red, green, blue, alpha);
                return c;
            }
            
    	} catch (IllegalArgumentException e) {
    		return white;
    	}
    	
    }

	public GLColor getColorId(int color)
	{
		switch(color)
		{
			case 0:
				return white;
			case 1:
				return red;
			case 2:
				return green;
			case 3:
				return blue;
			case 4:
				return yellow;
			case 5:
				return magnenta;
			case 6:
				return brown;
			case 7:
				return black;
			case 8:
				return gray;
			case 9:
				return redL;
			case 10:
				return greenL;
			case 11:
				return blueL;
			case 12:
				return yellowL;
			case 13:
				return magnentaL;
			case 14:
				return brownL;
			case 15:
				return grayL;
		}
		
		return white;
	}
}
