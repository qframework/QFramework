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

import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;

import javax.media.opengl.GLAutoDrawable;
import javax.media.opengl.GLEventListener;
import javax.media.opengl.awt.GLCanvas;

public class JoglEventListener implements GLEventListener, KeyListener, MouseListener, MouseMotionListener {

	private GameonApp mApp;
	boolean 	mClicked = false;
	public JoglEventListener(GLCanvas canvas) {
	}


	@Override
	public void display(GLAutoDrawable arg0) {
	}

	@Override
	public void dispose(GLAutoDrawable arg0) {
	}

	@Override
	public void init(GLAutoDrawable arg0) {
	}

	@Override
	public void reshape(GLAutoDrawable arg0, int arg1, int arg2, int arg3,
			int arg4) {
	}

	public void setApp(GameonApp app) {
		mApp = app;
		
	}

	@Override
	public void mouseClicked(MouseEvent e) {
		
	}

	@Override
	public void mouseEntered(MouseEvent arg0) {
	}

	@Override
	public void mouseExited(MouseEvent arg0) {
	}

	@Override
	public void mousePressed(MouseEvent e) {
		// 
		mClicked = true;
		mApp.onFocusProbe(e.getX(), e.getY());
	}

	@Override
	public void mouseReleased(MouseEvent e) {
		//System.out.println("  mouseReleased " + e.getX() + " " + e.getY());
		mClicked = false;
		mApp.mouseClicked(e.getX(), e.getY());
	}

	@Override
	public void keyPressed(KeyEvent e) {
	}

	@Override
	public void keyReleased(KeyEvent arg0) {
	}

	@Override
	public void keyTyped(KeyEvent arg0) {
	}


	@Override
	public void mouseDragged(MouseEvent e) {
		//System.out.println("  mouseDragged " + e.getX() + " " + e.getY());
		if (mClicked)
		{
			mApp.mouseDragged(e.getX(), e.getY() , false);
		}
	}


	@Override
	public void mouseMoved(MouseEvent e) {
		//System.out.println("  mouseMoved " + e.getX() + " " + e.getY());
	}

}
