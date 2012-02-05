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

import javax.media.opengl.GL2;
import javax.media.opengl.GLAutoDrawable;
import javax.media.opengl.GLEventListener;
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

        mApp.cs().setGlu(glu);
        mApp.surfaceChanged(gl,glu, width, height);
        if (!mStarted)
        {   
        	String preexec = "";
    		preexec = "Q.layout.canvasw = " + width + ";Q.layout.canvash = " + height + ";";
            mApp.start("main.js" , preexec);
            mStarted = true;
        }
        
    }

    public void display(GLAutoDrawable drawable) {

        GL2 gl = drawable.getGL().getGL2();
        mApp.drawFrame(gl);
        gl.glFlush();
    }

    public void displayChanged(GLAutoDrawable drawable, boolean modeChanged, boolean deviceChanged) {
    }

    
	@Override
	public void dispose(GLAutoDrawable arg0) {
		// 
		
	}
}

