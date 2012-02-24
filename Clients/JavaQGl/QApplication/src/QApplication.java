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

import com.jogamp.opengl.util.Animator;
import com.jogamp.opengl.util.FPSAnimator;

import com.qframework.core.GameonApp;

import java.applet.Applet;
import java.awt.BorderLayout;
import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.media.nativewindow.util.Dimension;
import javax.media.opengl.GLCapabilities;
import javax.media.opengl.GLProfile;
import javax.media.opengl.awt.GLCanvas;
import javax.swing.JApplet;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JPopupMenu;
import javax.swing.Timer;
import javax.swing.UIManager;

public class QApplication extends JFrame {
    static {
        // When using a GLCanvas, we have to set the Popup-Menues to be HeavyWeight,
        // so they display properly on top of the GLCanvas
        JPopupMenu.setDefaultLightWeightPopupEnabled(false);
    }
    
    //private FPSAnimator animator;
    private GameonApp mApp;
    GLRenderer mRenderer;
    String mWDir;
    GLCanvas mCanvas;
    Timer mRenderTimer;
    public QApplication() {
    
     setLayout(new BorderLayout());

     	selectWDir();
        mApp = new GameonApp(this, "QAPP");
        mApp.supportOld(true);
        if (mWDir != null)
        	mApp.setWDir(mWDir);
        mApp.init();
        mRenderer = new GLRenderer();
        mRenderer.setApp( mApp );
        
        //GLProfile glp = GLProfile.getDefault();
        //GLCapabilities caps = new GLCapabilities(glp);
        mCanvas = new GLCanvas();
        
        mCanvas.addGLEventListener(mRenderer);
        
        mCanvas.setSize(getSize());
        add(mCanvas ,  BorderLayout.CENTER);
        JoglEventListener listener = new JoglEventListener(mCanvas);
        listener.setApp(mApp);
        mCanvas.addMouseListener(listener);
        mCanvas.addMouseMotionListener(listener);
        //animator = new FPSAnimator(canvas, 60);    	
        
        //canvas.setMinimumSize(new Dimension());
        setSize(1024, 768);
        this.addWindowListener(new WindowAdapter() {

            public void windowClosing(WindowEvent e) {
              		System.exit(0);
            }
        });      
      
    }
  
    public void setVisible(boolean show){
    	super.setVisible(show);
    	if (show)
    	{
    		render();
    	}else
    	{
    		if (mRenderTimer != null)
    			mRenderTimer.stop();
    	}
    	/*
        if(!show)
            //animator.stop();
        
        if(show)
            //animator.start();
             * */
             
    }  
    
	public static void main(String args[]) {
        EventQueue.invokeLater(new Runnable() {
            public void run() {

                try{
                    UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
                }catch(Exception ex) {
                    Logger.getLogger(getClass().getName()).log(Level.INFO, "can not enable system look and feel", ex);
                }

                QApplication frame = new QApplication();
                frame.setVisible(true);
            }
        });
    }
	
	void selectWDir()
	{
        
        
        final JFileChooser fc = new JFileChooser();
        fc.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
        int returnVal = fc.showOpenDialog(null);

        if (returnVal == JFileChooser.APPROVE_OPTION) {
            File file = fc.getSelectedFile();
            this.mWDir = file.getPath();
            //This is where a real application would open the file.
            //log.append("Opening: " + file.getName() + "." + newline);
        } else {
            //log.append("Open command cancelled by user." + newline);
        }
        
		
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
    	mRenderTimer = new javax.swing.Timer(25, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	render();
            }
    	});
    	
    	
    	mRenderTimer.start();
    	mRenderTimer.setRepeats(false);    	
    }	
}

