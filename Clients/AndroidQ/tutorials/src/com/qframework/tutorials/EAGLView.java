package com.qframework.tutorials;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import com.qframework.core.EAGLViewInterface;
import com.qframework.core.GameonApp;
import com.qframework.core.GameonWorldView;

import android.content.Context;
import android.opengl.GLSurfaceView;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.MotionEvent;

public class EAGLView extends EAGLViewInterface  {

	private EAGLViewRenderer mRenderer;
	GameonApp mApp;
	QTutorialsActivity mContext;
	boolean doOnce1 = false;
	boolean doOnce2 = false;
	private Handler mMessageHandler;
	
	public EAGLView(QTutorialsActivity context, String appname) {
		super(context);
		initWorld(context, appname);
		setEGLConfigChooser(true);
		//setEGLConfigChooser(5, 6,5, 0,16, 0);
		mContext = context;
		//setDebugFlags(DEBUG_CHECK_GL_ERROR );//| DEBUG_LOG_GL_CALLS);

        mRenderer = new EAGLViewRenderer(context, mApp);
        setRenderer(mRenderer);
        this.setRenderMode(RENDERMODE_WHEN_DIRTY);
        setKeepScreenOn(true);
        
        mMessageHandler = new Handler() {
	        public void handleMessage(Message msg) { 
	        	switch (msg.what) {
	        		case 1: render();	
	        	}
             }
        };
        
        render();
        
	}
	
	 public boolean onTouchEvent(MotionEvent e) {
	        float x = e.getX();
	        float y = e.getY();
	        switch (e.getAction()) {
	        case MotionEvent.ACTION_DOWN:
	        	mApp.onFocusProbe((int)x, (int)y);        	
	        break;
	        case MotionEvent.ACTION_UP:
	        	mApp.mouseClicked((int)x, (int)y);
	        break;
	        case MotionEvent.ACTION_MOVE:
	        	mApp.mouseDragged((int)x, (int)y  , false);
	        }
	        return true;
	    }
		private class EAGLViewRenderer implements GLSurfaceView.Renderer {
	    	Context mContext;
	    	GameonWorldView mView;
	    	GameonApp 		mApp;
		    public EAGLViewRenderer(Context context, GameonApp app) {
		    	mContext = context;
		    	mView  = app.view();
		    	mApp = app;
		    }
		    
		    public void onDrawFrame(GL10 gl) {
		        //gl.glClearColor(.2f,.2f,.2f,1);
		        //gl.glClear(GL10.GL_COLOR_BUFFER_BIT | GL10.GL_DEPTH_BUFFER_BIT);
		        mApp.drawFrame(gl);
		    }
		
		    public void onSurfaceChanged(GL10 gl, int width, int height) {
		    	if (!doOnce1)
		    	{
		    		String preexec = "CanvasW = " + width + ";CanvasH = " + height + ";";	    	
		    		mApp.start("main.js" , preexec);
		    		mApp.surfaceChanged(gl, width, height);
		    		doOnce1 = true;
		    	}else
		    	{
		    		mView.onSurfaceChanged(gl, width, height);
		    	}
		    }
		
		    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
		    	if (!doOnce2)
		    	{
		    		mApp.init(gl);
		    		mView.onSurfaceCreated(gl);
		    		doOnce2 = true;
		    	}else
		    	{
		    		mView.onSurfaceCreated(gl);	    		
		    	}
		    }
		    
	    }
		
		public void initWorld(Context context, String appname)
		{
			mApp = new GameonApp(context, appname, this);
		}

		public void onTextInput(String resptype, String respdata) {
			mContext.onTextInput(resptype, respdata);
		}

		public void onResume() {
			super.onResume();
	        if(mApp != null) {
	        	//mGameonApp.onResume();
	        }
			
		}
		public void onPause() {
			super.onPause();
	        if (mApp != null) {
	        	mApp.onPause();
	        }		
		}

		public void onTextInputEnd(String script) {
			mApp.execScript(script);
		}


	    void render()
	    {
	    	if (mApp != null)
	    	{
		    	if (mApp.hasData())
		    	{
		    		//Log.d("model", "req render");
		    		this.requestRender();
		    	}
	    	}
	    	 
	    	Message msg = new Message(); 
        	msg.what = 1;
        	mMessageHandler.sendMessageDelayed(msg, 25);
	    }
	
}
