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

import java.applet.Applet;
import java.awt.Frame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Random;
import java.util.StringTokenizer;
import java.util.Vector;
import javax.media.opengl.GL;
import javax.media.opengl.GL2;
import javax.media.opengl.glu.GLU;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.Timer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
public class GameonApp {
	private GameonWorld mWorld;
	private LayoutGrid mDataGrid;
	private ServerkoParse mScript;
	private GameonWorldView mView;
	private String	mPreExec;
	private String mAppWDir;
	private String mAppName;
	private Vector <JSONObject> mResponsesQueue =  new Vector <JSONObject>();
	private float[] mScreenb = new float[8];
	private float[] mHudb = new float[8];        
	
	protected float mSplashX1 = -1.5f;
	protected float mSplashX2 = 1.5f;
	protected float mSplashY1 = -1.0f;
	protected float mSplashY2 = 1.0f;
	protected String mSplashScreen;
	
	private long mSplashTime;
	private  long mSplashTimeStart;
	private boolean mDrawSPlash = false;
	private boolean mSplashOutStart = false;
	private boolean mTouchEnabled = true;
	private     AreaIndexPair		mFocused;
	
	private AnimFactory		mAnims;
	private ColorFactory	mColors;
	private ItemFactory		mItems;
	private TextureFactory	mTextures;
	private SoundFactory	mSounds;
	private Settings		mSettings;
	private ObjectsFactory	mObjectsFact;
	private GameonCS		mCS;
    
    private Applet 	mAppletContext;
    private JFrame 	mAppContext;

    private  boolean	mCameraSet = false;
    private  Random 	mRandom = new Random(System.currentTimeMillis());
    
    private boolean 			mDataChange = false;
    private long mFrameDeltaTime = -1;
    private long mFrameLastTime = -1;
	private GLU mGlu;
    private boolean			  mRendering  = false;

    private float mLastDrag[] = new float[3];
    private float mLastDist = 0;
    private long mLastDragTime = 0;
    private long mLastClickTime = 0;
    protected boolean mSupportOld = false;
    
    public GameonApp(Applet context, String appname/*, EAGLViewInterface view*/)
    {

    	mAppletContext = context;
        this.createObjects(appname);
    }
    
    private void createObjects(String appname)
    {
        mWorld = new GameonWorld(this);
        mView = new GameonWorldView( mWorld, this);
    	mDataGrid = new LayoutGrid(mWorld, this);
    	mScript = new ServerkoParse(this);
        mAppName = appname;
        mSettings = new Settings(this);
        
        mObjectsFact = new ObjectsFactory(this);
        mAnims = new AnimFactory(this);
        mColors = new ColorFactory();
        mSounds = new SoundFactory();
        mTextures = new TextureFactory(this);
        mItems = new ItemFactory(this);
        mCS = new GameonCS();    	
        mSettings.init(mScript, appname);
        
        mLastDrag[0] = 1e07f;
    }
        
    public GameonApp(JFrame context, String appname) {
		// TODO Auto-generated constructor stub
    	mAppContext = context;
        this.createObjects(appname);
	}

	public void onJSONData(GL2 gl,JSONObject jsonData) {
        JSONObject gs;
		try {
			gs = jsonData.getJSONObject("gs");
	        JSONArray room = gs.getJSONArray("room");
	        for (int a=0; a< room.length(); a++)
	        {
	            JSONObject roomobj = room.getJSONObject(a);
	            String type = roomobj.getString("res");
	            if (type.equals("event"))
	            {
	                // on event
	                onEvent2(gl,roomobj);
	            }else if (type.equals("layout")){
	                // onlayout
	                mDataGrid.initLayout2(roomobj);
	            }else if (type.equals("texts")){
	                // onlayout
	                mTextures.initTextures(gl,roomobj);
	            }else if (type.equals("objs")){
	                // onlayout
	            	mObjectsFact.initObjects(gl,roomobj);
	            }else if (type.equals("models")){
	                // onlayout
	            	this.mItems.initModels(gl,roomobj);
	            }else if (type.equals("animation")){
	                // onlayout
	            	this.mAnims.initAnimation(gl,roomobj);
	            }	            
	        }
		} catch (JSONException e) {
			e.printStackTrace();
        }
	      
	}        

	private synchronized void execResponses(GL2 gl)
    {
        while( mResponsesQueue.size() > 0)
        {
        	mDataChange = true;
            JSONObject jsonData = mResponsesQueue.get(0);
            onJSONData(gl,jsonData);
            mResponsesQueue.remove(0);
            //Log.d("model", "exec execResponses done" );
        }
    }

    synchronized void queueResponse(JSONObject response)
    {
    	mResponsesQueue.add(response);
    }
      
    public void start(String script, String preexec) {
        
    	mSettings.setParser(mScript);
    	mPreExec = preexec;
    	if (mPreExec != null)
    	{
    		mScript.execScript(mPreExec);
    	}
        // exec scripts
    	//mScript.execScriptFromFile(script);
    	mScript.loadScript(script, 100);
    }
    
    public void onClick(float[] vec, float[] vecHud) {
		if (!mTouchEnabled)
			return;    
		long delay = System.currentTimeMillis() - mLastClickTime;
    	
    	AreaIndexPair field = mDataGrid.onClickNearest(vec, vecHud);

    	if (field != null && field.mOnclick != null) {
    		// send data
    		//System.out.println( " click nearest = " + field.mArea + " " + field.mOnclick);
    		String datastr = field.mOnclick;
    		if (datastr.startsWith("js:"))
    		{
    			if (datastr.endsWith(";"))
    			{
    				mScript.execScript(datastr.substring(3));
    			}else
    			{
    				String cmd  = datastr.substring(3);
    				cmd += "('" + field.mArea + "',"+ field.mIndex;
    				cmd += "," + delay + ",[" + field.mLoc[0] + "," + field.mLoc[1] + "," + field.mLoc[2] + "]";
    				cmd += ","+mLastDist;
    				cmd += ");" ;
    				mScript.execScript(cmd);
    			}
    		}else
    		{
    			datastr += "," + field.mArea + "," + field.mIndex;
    			mScript.sendUserData( datastr);
    		} 
    	}
    	if (mFocused != null)
    	{
    		onFocusLost(mFocused);
    		mFocused = null;
    	}    	
    	mLastDist = 0;
	}

	public void init()
	{
		mScript.loadFramework();
		mScript.set();
	}
	
	void setScreenBounds()
	{
	    mCS.getScreenBounds(mScreenb , mHudb);
	    
	    String script = "Q.layout.canvasw =";
	    script += mCS.getCanvasW(); 
	    script += ";Q.layout.canvash = ";
	    script += mCS.getCanvasH();
	    
	    script += ";Q.layout.worldxmin = ";
	    script += mScreenb[0];
	    script += ";Q.layout.worldxmax = ";
	    script += mScreenb[2];
	    
	    script += ";Q.layout.worldymin = ";
	    script += mScreenb[5];
	    script += ";Q.layout.worldymax = ";
	    script += mScreenb[3];
	    
	    script += ";Q.layout.hudxmin = ";
	    script += mHudb[0];
	    script += ";Q.layout.hudxmax = ";
	    script += mHudb[2];
	    
	    script += ";Q.layout.hudymin = ";
	    script += mHudb[5];
	    script += ";Q.layout.hudymax = ";
	    script += mHudb[3];
	    
	    script += ";";	    
	    mScript.execScript(script);    
	}

		
	private void onTextInput(final String resptype, final String respdata) {
		
        Timer t  = new javax.swing.Timer(50, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
        		JTextField area = new JTextField(resptype);
                Object options[] = new Object[]{ area};
                Frame parent = null;
                if (mAppContext != null)
                	parent = (Frame)SwingUtilities.getAncestorOfClass(java.awt.Frame.class, mAppContext);
                else
                	parent = (Frame)SwingUtilities.getAncestorOfClass(java.awt.Frame.class, mAppletContext);
                
                int option = JOptionPane.showOptionDialog(parent,
                        options,
                        "", JOptionPane.YES_OPTION,
                        JOptionPane.INFORMATION_MESSAGE, null,
                        null, null);
                if (option == JOptionPane.YES_OPTION)
                {
                	String truncated = area.getText().replaceAll("[^A-Za-z0-9:. ]", ""); 
                	String script = respdata + "('" + truncated + "' , 1);";
                	mScript.execScript(script);
                }else
                {
                	String script = respdata + "(undefined, 1);";
                	mScript.execScript(script);
                	
                	
                }
            }
        });		
        t.setRepeats(false);
        t.start();
				
	}
	
	private void sendEvent(String resptype , String respdata)
    {
        int delay = Integer.parseInt(resptype);
        mScript.execScript(respdata , delay);    	
    }
	
	public void sendExec(String resptype , String respdata)
	{
        int delay = Integer.parseInt(resptype);
        mScript.execScript(respdata , delay);    	
    }
	public void onPause() {
		//mScript.onPause();
	}
    
	public void loadModule(String resptype , String respdata)
    {
    	mScript.loadModule(resptype);            
	}
    
	public void loadModule2(String resptype , String respdata)
    {
        mScript.loadModule2(resptype);    
    }

    public void surfaceChanged(GL2 gl, GLU glu, int width, int height)
    {
	 	mCS.init((float)width, (float)height, 1);
    	mGlu  = glu;
    	mCS.setGlu(glu);
        mView.onSurfaceChanged(gl, width, height);
        mView.onSurfaceCreated(gl, glu);
    }


    public void execScript(String script)
    {
    	mScript.execScript(script , 10);
    }
    
    public void goUrl(String type , String  data)
    {
    	//mEaglView.goUrl(type, data);
    }
    public void mouseClicked(int x, int y) {
		if (!mTouchEnabled)
			return;    	
		float rayVec[] = new float[3];
		float rayVecHud[] = new float[3];
		mCS.screen2spaceVec(x , y, rayVec);
		mCS.screen2spaceVecHud(x , y, rayVecHud);
		onClick(rayVec , rayVecHud);
    }

	public void drawFrame(GL2 gl) {
		// 
		if (mRendering)
			return;
		mRendering = true;
		calcFrameDelay();
		//Log.d("model", " time "+ this.mFrameDeltaTime);
		processData(gl);
		
		if (mDrawSPlash)
		{
			mSplashTimeStart += this.mFrameDeltaTime;
			//
			if (mSplashTimeStart > mSplashTime-500)
			{
				if (this.mSplashOutStart == false)
				{
					this.mDataGrid.animScreen("color" , "500,FFFFFFFF,00000000");
					this.mSplashOutStart = true;
				}
			}			
			if (mSplashTimeStart > mSplashTime)
			{
				mDrawSPlash = false;
				mView.lockDraw(false);
				this.mDataGrid.animScreen("color" , "500,00000000,FFFFFFFF");
			}
			else
			{
				mView.lockDraw(true);
				mView.drawSplash(gl, mGlu);
			}
			
		}else
		{
			mView.onDrawFrame(gl);
		}
		
    	if (!mCameraSet)
    	{
            mDataGrid.onCameraFit("fit", "4.0,0");
            mDataGrid.onCameraFitHud("fit", "4.0,0");
            mCameraSet = true;
    	}
    	mRendering = false;
		
	}
	

	private void connect(String serverip , String script)
	{
	    mScript.connect(serverip , script);
	}

	private void disconnect()
	{
	    mScript.disconnect();
	}
	
	private void join(String data , String script)
	{
    	StringTokenizer tok =  new StringTokenizer(data, "|");
    	String addr = null;
    	String user = null;
    	if (tok.hasMoreTokens())
    	{
    		addr = tok.nextToken();
    	}
    	if (tok.hasMoreTokens())
    	{
    		user = tok.nextToken();
    	}    	
		
	    mScript.join(addr, user , script);
	}


	private void send(String data)
	{
	    mScript.send(data);
	}

	public void mouseDragged(int x, int y, boolean notimecheck) {
		// 
		if (!mTouchEnabled)
			return;
		
		if (this.mFrameDeltaTime == 0)
			mLastDragTime += 100;
		else
			mLastDragTime += this.mFrameDeltaTime;
		if (!notimecheck && mLastDragTime < 100)
		{
			return;
		}
		mLastDragTime = 0;
		
		float rayVec[] = new float[3];
		float rayVecHud[] = new float[3];
		mCS.screen2spaceVec(x , y, rayVec);
		mCS.screen2spaceVecHud(x , y, rayVecHud);
    	AreaIndexPair field = mDataGrid.onDragNearest(rayVec , rayVecHud);
    	if (field != null && mFocused != null)
    	{
    		if (field.mArea.equals( mFocused.mArea) )
    		{
    			if (mLastDrag[0] == 1e07f)
    			{
    				mLastDrag[0] = field.mLoc[0];
    				mLastDrag[1] = field.mLoc[1];
    				mLastDrag[2] = field.mLoc[2];
    				return;
    			}else
    			{
    				float delta0 = field.mLoc[0]-mLastDrag[0];
    				float delta1 = field.mLoc[1]-mLastDrag[1];
    				float delta2 = field.mLoc[2]-mLastDrag[2];
    				mLastDist = (float)Math.sqrt( (delta0*delta0)+(delta1*delta1)+(delta2*delta2) );
    				
    				LayoutArea area = mDataGrid.getArea(field.mArea);
    				if (area != null)
    				{
    					area.onDragg(field.mLoc[0] -mLastDrag[0],
    									field.mLoc[1] -mLastDrag[1],
    									field.mLoc[2] -mLastDrag[2]);
    				}
    			}
    			
				mLastDrag[0] = field.mLoc[0];
				mLastDrag[1] = field.mLoc[1];
				mLastDrag[2] = field.mLoc[2];
    		}
    		if (field.mArea.equals( mFocused.mArea) && 
    			field.mIndex == mFocused.mIndex)
    		{
    			// moving around focused item
    			return;
    		}else
    		{
    			onFocusLost(mFocused);
    			mFocused = null;
    			mLastDrag[0] = 1e07f;
    		}
    	}else if (mFocused != null)
    	{
    		onFocusLost(mFocused);
			mFocused = null;   
    	}
    	mFocused = field;
    	if (field != null)
    	{
    		onFocusGain(field);
    	}
  
    	mLastDrag[0] = 1e07f;		
	}
	
	
	public void onFocusGain(AreaIndexPair field)
	{
		if (field == null || field.mOnFocusGain == null)
			return;
		//System.out.println( " focusgain = " + field.mArea + " " + field.mOnFocusGain);
		String datastr = field.mOnFocusGain;
		if (datastr.startsWith("js:"))
		{
			if (datastr.endsWith(";"))
			{
				mScript.execScript(datastr.substring(3));
			}else
			{			
				String cmd  = datastr.substring(3);
				cmd += "('" + field.mArea + "',"+ field.mIndex + ");" ;
				mScript.execScript(cmd);
			}
			
		}else
		{
			datastr += "," + field.mArea + "," + field.mIndex;
			mScript.sendUserData( datastr);
		} 		
	}
	
	public void onFocusLost(AreaIndexPair field)
	{
		if (field == null)
			return;
		if (field == null || field.mOnFocusLost == null)
			return;
		
		
		String datastr = field.mOnFocusLost;
		if (datastr.startsWith("js:"))
		{
			if (datastr.endsWith(";"))
			{
				mScript.execScript(datastr.substring(3));
			}else
			{			
				String cmd  = datastr.substring(3);
				cmd += "('" + field.mArea + "',"+ field.mIndex + ");" ;
				mScript.execScript(cmd);
			}
		}else
		{
			datastr += "," + field.mArea + "," + field.mIndex;
			mScript.sendUserData( datastr);
		} 		
		
	}
	
	public void onFocusProbe(int x, int y)
	{
		mLastClickTime = System.currentTimeMillis();
		this.mouseDragged(x, y , true);
	}
	
	public void setSplash(String splash, long delay)
	{
		mSplashTime = delay;
		mSplashScreen = splash;
		
		mSplashTimeStart = 0;
		if (mSplashScreen != null && this.mSplashScreen.length() > 0)
		{
			mDrawSPlash = true;
		}
	}

	public void setEnv(String name, String value) {
		if ( name.equals("textparam"))
		{
			StringTokenizer tok =  new StringTokenizer(value, ",");
			float u1 = Float.parseFloat( tok.nextToken() );
			float v1 = Float.parseFloat( tok.nextToken() );
			float u2 = Float.parseFloat( tok.nextToken() );
			float v2 = Float.parseFloat( tok.nextToken() );
			float p = 0;
			if (tok.hasMoreTokens())
				p = Float.parseFloat( tok.nextToken() );
			mTextures.setParam( u1,v1,u2,v2,p );
		}else
		if ( name.equals("touch"))
		{
			if (value.equals("on"))
			{
				mTouchEnabled = true;
			}else if (value.equals("off"))
			{
				mTouchEnabled = false;
			}
		}

	}

	public void setSplashSize(float x1, float y1, float x2, float y2) {
		mSplashX1 = x1;
		mSplashX2 = x2;
		mSplashY1 = y1;
		mSplashY2 = y2;
		
	}

	public InputStream getInputStream(String location, boolean sysfile) {
		if (mAppletContext != null)
		{
			if (sysfile)
			{
				return mAppletContext.getClass().getResourceAsStream("qres/"+location);
			}else
			{
				return mAppletContext.getClass().getResourceAsStream("res/"+location);
			}
		}else
		{
			if (sysfile)
			{
				return mAppContext.getClass().getResourceAsStream("qres/"+location);
			}
			try {
				 String path = "";
				 if (mAppWDir == null)
				 {
					 path = System.getProperty("user.dir");
					 path += "/res/";
				 }else
				 {
					 path = mAppWDir;
				 }
					 
				FileInputStream stream= new FileInputStream(path + location);
				return stream;
			} catch (FileNotFoundException e) {
				e.printStackTrace();
				return null;
			}
			
		}
	}
	
	public void processData(GL2 gl) {
		mAnims.process(gl, mFrameDeltaTime);
		execResponses(gl);
		mWorld.addModels();

		// flush textures 
		mTextures.flushTextures(gl);
	}
	
	public boolean hasData()
	{
		
		//System.out.println("to skip " + mResponsesQueue.size() + " " + mAnims.getCount());
		if (mDrawSPlash)
		{
			return true;
		}
		if (mDataChange)
		{
			mDataChange = false;
			return true;
		}
		if (mRendering)
		{
			return false;
		}
		
		if (mResponsesQueue.size() == 0 && mAnims.getCount() == 0)
		{
			//System.out.println("skipping");
			mFrameLastTime  = -1;
			return false;
		}
		return true;
	}
    void onEvent2(GL2 gl, JSONObject response)
    {
        try {
			String respid = response.getString("id");
			
			String respdata = null;
			String respdata2 = null;
			String respdata3 = null;
			String respdata4 = null;
			String resptype = response.getString("type");
			if (response.has("data"))
			{
				respdata = response.getString("data");
			}
			if (response.has("data2"))
			{
				respdata2 = response.getString("data2");
			}
			if (response.has("data3"))
			{
				respdata3 = response.getString("data3");
			}
			if (response.has("data4"))
			{
				respdata4 = response.getString("data4");
			}						
			
			int eventid = Integer.parseInt( respid);
			switch (eventid) {
				case 100:
					sendEvent(resptype, respdata);
					break;
				case 101:
					sendExec(resptype, respdata);
					break;
				case 102:
					loadModule(resptype , respdata);
					break;
				case 103:
					loadModule2(resptype , respdata);
					break;            
				case 200:
					setEnv(resptype, respdata);
					break;	            
				case 1002:
					onTextInput(resptype , respdata);
					break;
				case 1200:
					goUrl(resptype, respdata);
					break;            
				case 2600:
				    mSettings.open();
				    break;
				case 2601:
				    mSettings.save();
				    break;
				case 2610:
				    mSettings.writeInt(resptype , respdata);
				    break;
				case 2611:
				    mSettings.writeStr(resptype , respdata);
				    break;            
				case 2620:
				    mSettings.loadInt(resptype , respdata);
				    break;
				case 2621:
				    mSettings.loadStr(resptype , respdata);
				    break;
				case 2622:
				    mSettings.loadArray(resptype , respdata);
				    break;		
				case 4000:
					mTextures.newTexture(gl ,resptype  , respdata, true);
					break;
				case 4001:
					mTextures.deleteTexture(gl ,resptype );
					break;					
				case 4100:
					mObjectsFact.create(resptype , respdata);
					break;
				case 4110:
					mObjectsFact.place(resptype , respdata);
					break;
				case 4120:
					mObjectsFact.scale(resptype , respdata);
					break;
				case 4130:
					mObjectsFact.texture(resptype , respdata);
					break;
				case 4140:
					mObjectsFact.state(resptype , respdata);
					break;
				case 4150:
					mObjectsFact.remove(resptype , respdata);
					break;
				case 4160:
					mObjectsFact.rotate(resptype , respdata);
					break;							
				case 4200:
					mAnims.move(resptype , respdata , respdata2,respdata3);
					break;			
				case 4210:
					mAnims.rotate(resptype , respdata, respdata2,respdata3);
					break;			
				case 5000:
					mSounds.newSound(resptype , respdata);
					break;
				case 5010:
					mSounds.onPlaySound(resptype  , respdata);
					break;
				case 5011:
					float val = Float.parseFloat(resptype);
					mSounds.setVolume(val);
					break;
				case 5012:
					int mutval = Integer.parseInt(respdata);
					mSounds.setMute(mutval);
					break;

				case 6001:
					mItems.newFromTemplate(resptype, respdata);
					break;
				case 6002:
					mItems.setTexture(resptype, respdata);
					break;        	  
				case 6003:
					mItems.createModel(resptype, respdata);
					break;        	          	  
				case 6004:
					mItems.setSubmodels(resptype, respdata);
					break;
				case 7000:
					connect(resptype, respdata);
					break;            
				case 7001:
					join(resptype , respdata);
					break;                        
				case 7002:
					send(resptype);
					break;
				case 7003:
					disconnect();
					break;    		
					
				case 4300:
					//mAnims.animObject(resptype,respdata,respdata2,respdata3);
			default:
				mDataGrid.onEvent2(gl, response);
			}
        }
        catch (JSONException e) {
        	e.printStackTrace();
    	}        
    }

    public void stop() {
		mScript.disconnect();
		
	}


    public void calcFrameDelay()
    {
		if (mFrameLastTime  == -1)
		{
			mFrameLastTime  = System.currentTimeMillis(); 
			mFrameDeltaTime = 0;
		}else
		{
			mFrameDeltaTime = System.currentTimeMillis() - mFrameLastTime;
			mFrameLastTime += mFrameDeltaTime; 
		}
    }
    
    public AnimFactory anims()
    {
    	return mAnims;
    }
    public ColorFactory	colors()
    {
    	return mColors;
    }
    public ItemFactory items()
    {
    	return mItems;
    }
    public TextureFactory textures()
    {
    	return mTextures;
    }
    public SoundFactory	sounds()
    {
    	return mSounds;
    }
    public Settings settings()
    {
    	return mSettings;
    }
    public ObjectsFactory objects()
    {
    	return mObjectsFact;
    }
    public GameonCS	cs()
    {
    	return mCS;    
    }
    public GameonWorld world()
	{
		return mWorld;
	}
	public LayoutGrid grid()
	{
		return mDataGrid;
	}
	public ServerkoParse script()
	{
		return mScript;
	}
	public GameonWorldView view()
	{
		return mView;
	}

	public long frameDelta() {
		return mFrameDeltaTime;
	}

	public Random random()
	{
		return mRandom;
	}

	public void setWDir(String wdir) {
		mAppWDir = wdir;
		if (!mAppWDir.endsWith("/"))
		{
			mAppWDir += "/";
		}
	}
	
	public void supportOld(boolean support)
	{
		mSupportOld = support;		
	}
}
