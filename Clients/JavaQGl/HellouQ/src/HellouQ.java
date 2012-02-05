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

import java.applet.Applet;
import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.media.opengl.awt.GLCanvas;
import javax.swing.Timer;

public class HellouQ extends Applet {

    private GameonApp mApp;
    GLRenderer mRenderer;
    GLCanvas mCanvas;
    public void start()
    {
    	render();
    }
    public void stop()
    {
    	mApp.stop();
    }

    public void init(){
        setLayout(new BorderLayout());
        
        mApp = new GameonApp(this, "HellouQ");
        mApp.init();
        mRenderer = new GLRenderer();
        mRenderer.setApp( mApp );
        
        mCanvas = new GLCanvas();
        
        mCanvas.addGLEventListener(mRenderer);
        mCanvas.setSize(getSize());
        add(mCanvas ,  BorderLayout.CENTER);
        JoglEventListener listener = new JoglEventListener(mCanvas);
        listener.setApp(mApp);
        mCanvas.addMouseListener(listener);
        mCanvas.addMouseMotionListener(listener);
    }
    
    void render()
    {
    	if (mApp != null && mCanvas != null && mCanvas.getGL() != null)
    	{
	    	if (mApp.hasData())
	    	{
	    		mCanvas.display();
	    	}
    	}
    	Timer renderTimer = new javax.swing.Timer(25, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	render();
            }
    	});
    	
    	renderTimer.start();
    	renderTimer.setRepeats(false);    	
    }
}
