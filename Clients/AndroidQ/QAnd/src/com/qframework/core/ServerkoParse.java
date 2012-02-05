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

import java.io.IOException;
import java.io.InputStream;
import java.util.NoSuchElementException;
import java.util.StringTokenizer;
import java.util.Vector;

import org.json.JSONObject;

import com.qframework.serverko.ServerkoConnect;

import android.util.Log;
import android.webkit.JsResult;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.os.Handler;
import android.os.Message;

public class ServerkoParse {

    private static final int EXECSCRIPT= 3; 
    private static final int LOADMODULE= 4; 
    private static final int LOADMODULE2= 5;

    private WebView mScriptView;
	private GameonApp mApp;
	private String			mUsername = "LUser";
	private Handler mMessageHandler;   
	private Vector<String>	mLoadedScripts = new Vector<String>();
	private ServerkoConnect 	mConnect;
   
	ServerkoParse(GameonApp theApp) {
	
		mApp = theApp;
		mScriptView = new WebView(theApp.context());
		WebSettings settings = mScriptView.getSettings();
		settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
		settings.setNavDump(false);

		mScriptView.getSettings().setJavaScriptEnabled(true);
		
		//mScriptView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
		mScriptView.setWebViewClient(new WebViewClient() {
			   public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
			     //Toast.makeText(activity, "Oh no! " + description, Toast.LENGTH_SHORT).show();
				   System.out.println(" Errror:" + description);
			   }
			 });		
		mScriptView.setWebChromeClient(new QWebChromeClient() );
		mMessageHandler = new Handler() { 

	        @Override 
	        public void handleMessage(Message msg) { 
	             switch (msg.what) { 
	             case LOADMODULE: 
	            	 execLoadModule((String)msg.obj);
	                 break;
	             case LOADMODULE2: 
	            	 execLoadModule2((String)msg.obj);
	                 break;	                 
	             case EXECSCRIPT: 
	            	 execScript((String)msg.obj);
	                 break;	                 	                 
	             default:
	                 super.handleMessage(msg); 

	             } 
	        } 
	   }; 	
		
	}

	
	public void execScript(String script) {
	
		//mScriptView.loadUrl("javascript:"  + "try{" + script + "} catch (error){ alert( \"error: \" + error.toString() );for (var i in error) console.error(i + ' = ' + error[i]);}");
		mScriptView.loadUrl("javascript:"  + script );
		
	}
	public void execScriptRaw(String script) {
		
		mScriptView.loadUrl( script );
		
	}

	public void execScriptEvent(String script, int counter) {
		//Log.d("model", "cnt = " + counter);
		if (script.startsWith("cmd?"))
		{
			String data = script.substring(4);
			//mScriptView.loadUrl("javascript:"  + "try{" + data + "} catch (error){ alert( \"error: \" + error.toString() );}for (var i in error) console.error(i + ' = ' + error[i]);");	
			mScriptView.loadUrl("javascript:"  + data );
		}else if (script.startsWith("include?"))
		{
			String data = script.substring(8);
			if (mLoadedScripts.indexOf(data) < 0)
			{
				mLoadedScripts.add(data);
				this.execScriptFromFile(data);
			}
		}else if (script.startsWith("load?"))
		{
			String data = script.substring(5);
			this.execScriptFromFile(data);
		}
			
	}

	  final class QWebChromeClient extends WebChromeClient {

	        @Override
	        // used for script log
	        public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
	            Log.d("model", "logalert->" + message);
	            result.confirm();
	            return true;
	        }
	        public void onConsoleMessage (String message, int lineNumber, String sourceID) {
	            //Log.d(LOG_TAG, "error->" + message + " " + lineNumber + " " + sourceID);
	        }

	        public boolean onJsConfirm (WebView view, String url, String message, JsResult result)
	        {
	        	result.confirm();
	        	if (message.length() > 0)
	        	{
		        	//Log.d("model", "logconfirm2->" + message);
		        	JSONObject response  = MessageParse.parse2( message);
		        	if (response != null)
		        	{
		        		mApp.queueResponse(response);
		        	}
	        	}
	        	return true;
	        }
	    }
	public void execScriptFromFile(String fname) {
		try {
			InputStream is = mApp.context().getAssets().open("res/"+fname);
            int size = is.available();
            // Read the entire asset into a local byte buffer.
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();

            String script = new String(buffer);
			//mScriptView.loadUrl("javascript:" + "try{" + script + "} catch (error){ alert( \"error: \" + error.toString() );}for (var i in error) console.error(i + ' = ' + error[i]);");
            mScriptView.loadUrl("javascript:" + script );
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	public void execQScriptFromFile(String fname) {
		try {
			InputStream is = mApp.context().getAssets().open("qres/"+fname);
            int size = is.available();
            // Read the entire asset into a local byte buffer.
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();

            String script = new String(buffer);
            mScriptView.loadUrl("javascript:" +script);
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public void sendUserData(String datastr) {
		execScript("Q.handlers.script_userData('"+mUsername+"', '" + datastr + "');");
	}	 


	public void loadFramework()
	{
		execQScriptFromFile("serverkobridge.js");
		execQScriptFromFile("room.js");
		execQScriptFromFile("layout.js");
		execQScriptFromFile("colors.js");    
		execQScriptFromFile("qframework.js");
	    
	}


	public void loadModule2(String resptype) {
		Message msg = new Message(); 
        msg.what = LOADMODULE2; 
        msg.obj = resptype;	            
        mMessageHandler.sendMessageDelayed(msg, 0);				
	}
	
	public void loadScript(final String resptype, int time) {
		
		loadModule2(resptype);
	}
	
	protected void loadModule(String resptype) {
		Message msg = new Message(); 
        msg.what = LOADMODULE; 
        msg.obj = resptype;	            
        mMessageHandler.sendMessageDelayed(msg, 0);		
	}


	protected void execScript(String respdata, int delay) {
		Message msg = new Message(); 
        msg.what = EXECSCRIPT; 
        msg.obj = respdata;	            
        mMessageHandler.sendMessageDelayed(msg, delay); 
		
	}

	protected void execLoadModule(String data)
	{
		if (mLoadedScripts.indexOf(data) < 0)
		{
			mLoadedScripts.add(data);
			this.execScriptFromFile(data);
		}
		 
	}
	
	protected void execLoadModule2(String data)
	{
		this.execScriptFromFile(data);		 
	}

	protected void connect(String serverip, String script) {
		if (mConnect == null)
		{
			mConnect = new ServerkoConnect();
		}
		
		mConnect.connect(serverip, script, this);
	}

	protected void disconnect() {
		if (mConnect != null)
		{
			mConnect.close();
		}
		
		
	}
	
	protected void join(String addr, String user, String script) {
		if (mConnect != null)
		{
			mConnect.join(addr, user, script);
			mUsername = user;
		}
	}

	protected void send(String data) {
		if (mConnect != null)
		{
			mConnect.send(data);
		}
		
	}

	public void onJSONData(String data) {
    	JSONObject response  = MessageParse.parse2( data);
    	if (response != null)
    	{
    		mApp.queueResponse(response);
    	}                	
		
	}

	public static int parseFloatArray(float[] array, String data)
	{
		int count = 0;
		float val = 0;
        StringTokenizer tok = new StringTokenizer(data, ",");
        while (tok.hasMoreTokens() && count < array.length)
        try {
            try {
                val= Float.parseFloat(tok.nextToken());
            } catch (NumberFormatException e) {
            }
            array[count++] = val;
        } catch (NoSuchElementException e) {
        }
		return count;
	}

	public static int parseIntArray(int[] array, String data)
	{
		int count = 0;
		int val = 0;
        StringTokenizer tok = new StringTokenizer(data, ",");
        while (tok.hasMoreTokens() && count < array.length)
        try {
            try {
                val= Integer.parseInt(tok.nextToken());
            } catch (NumberFormatException e) {
            }
            array[count++] = val;
        } catch (NoSuchElementException e) {
        }
		
        return count;
	}

}
