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


import com.qframework.core.GameonApp;
import com.qframework.core.GameonCS;

import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import javax.media.opengl.DebugGL2;
import javax.media.opengl.GL;
import javax.media.opengl.GL2;
import javax.media.opengl.GLAutoDrawable;
import javax.media.opengl.GLDrawable;
import javax.media.opengl.GLEventListener;
import javax.media.opengl.fixedfunc.GLLightingFunc;
import javax.media.opengl.glu.GLU;

public class GLRenderer implements GLEventListener{
    boolean mStarted = false;
    GameonApp mApp;
    public void init(GLAutoDrawable drawable) {
    	
    	GL2 gl = drawable.getGL().getGL2();
        gl.setSwapInterval(1);
    }
    public void setApp( GameonApp app)
    {
        mApp = app;
    }
    public void reshape(GLAutoDrawable drawable, int x, int y, int width, int height) {
        GL2 gl = drawable.getGL().getGL2();
        GLU glu = new GLU();

        if (height <= 0) 
        { 
        
            height = 1;
        }

        if (!mStarted)
        {   
        	String preexec = "";
        	if (width >= 800)
        	{
        		preexec = "CanvasW = 1024" + ";CanvasH = 768;";
        	}else
        	{
        		preexec = "CanvasW = " + width + ";CanvasH = " + height + ";";
        	}
        		    	
			mApp.start("main.js" , preexec);
            mStarted = true;
        }
		
        mApp.surfaceChanged(gl,glu, width, height);
        
    }

    public void display(GLAutoDrawable drawable) {

        GL2 gl = drawable.getGL().getGL2();
        mApp.drawFrame(gl);
  
        // Flush all drawing operations to the graphics card
        gl.glFlush();
    }

    public void displayChanged(GLAutoDrawable drawable, boolean modeChanged, boolean deviceChanged) {
    }

    public void mouseClicked(MouseEvent e) {
        
    }

    public void mousePressed(MouseEvent e) {
            }

    public void mouseReleased(MouseEvent e) {
    	System.out.println("  mouseReleased " + e.getX() + " " + e.getY());
    	mApp.mouseClicked(e.getX(), e.getY());
    }

    public void mouseEntered(MouseEvent e) {
    	System.out.println("  mouseEntered " + e.getX() + " " + e.getY());
    }

    public void mouseExited(MouseEvent e) {
    	System.out.println("  mouseExited " + e.getX() + " " + e.getY());
    }
	@Override
	public void dispose(GLAutoDrawable arg0) {
		// 
		
	}
}

