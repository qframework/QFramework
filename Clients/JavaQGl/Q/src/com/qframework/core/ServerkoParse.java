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

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.NoSuchElementException;
import java.util.StringTokenizer;
import java.util.Vector;
import javax.swing.Timer;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.json.JSONObject;

import com.qframework.Serverko.ServerkoConnect;

public class ServerkoParse {

	private GameonApp mApp;
	private ScriptEngineManager mMgr;
	private ScriptEngine mScriptView ;
	private String mUsername = "LUser";
	private Timer mConsoleTimer;
	private Timer mDataTimer;
   
	private Vector<String>	mLoadedScripts = new Vector<String>();
	private ServerkoConnect	mConnect;
   
	ServerkoParse(GameonApp theApp)  {
	
		mApp = theApp;
                mMgr = new ScriptEngineManager();
                mScriptView = mMgr.getEngineByName("JavaScript");
        String scr = new String("console ={msgs: new Array(), log: function(msg)	{ console.msgs.push(msg); },info: function(msg) { console.msgs.push(msg); },warn : function(msg) { console.msgs.push(msg); },error: function(msg) { console.msgs.push(msg); },shift: function() { return console.msgs.shift(); }};");
        try {
			mScriptView.eval(scr);
		} catch (ScriptException e) {
			e.printStackTrace();
		}
	}

    public void set() {
        readJavascriptLogger();
        showData();
    }
     
    void readJavascriptLogger()
    {
        mConsoleTimer = new javax.swing.Timer(50, new ActionListener() {
          public void actionPerformed(ActionEvent e) {

        	  	Object res = null;
                try {
                	do {
                		res =  mScriptView.eval("console.shift();");
                		if (res instanceof String )
                		{
                			System.out.println( "JS :" + res + "\n");
                		}else if (res != null)
                		{
                			System.out.println( "JS :" + res.toString() + "\n");
                		}
                	} while (res !=  null);
                	
                } catch (ScriptException ex) {
                    Logger.getLogger(ServerkoParse.class.getName()).log(Level.SEVERE, null, ex);
                }

          }
       });
       mConsoleTimer.start();
       mConsoleTimer.setRepeats(true);

    }
    void showData()
    {
        mDataTimer = new javax.swing.Timer(50, new ActionListener() {
          public void actionPerformed(ActionEvent e) {
            String msg = null;
            while( (msg = execScript("Q.serverko.getData();")) != null && msg.length() != 0)
            {
                ///System.out.println( "Data :" + msg + "\n");
                if (msg.length() > 0)
                {
                	onJSONData(msg);
                }
            }
          }
       });
       mDataTimer.start();
       mDataTimer.setRepeats(true);
    
    }



	public String execScript(String script) {
			//System.out.println("scriptexec " + script);
            String trycatch;
            trycatch = "try{" + script + "} catch (error){ console.error( \"error: \" + error.toString() ); for (var e in error) console.error(error[e]);}";
            try {
            	//System.out.println(script); 
                Object res = mScriptView.eval(trycatch);
                if (res != null && res.getClass() == String.class)
                {
                    return (String)res;
                }
            } catch (ScriptException ex) {
            	System.out.println(script);
                Logger.getLogger(ServerkoParse.class.getName()).log(Level.SEVERE, null, ex);
            }
            return null;
	}

	public String convertStreamToString(InputStream is)
            throws IOException {
        if (is != null) {
            Writer writer = new StringWriter();

            char[] buffer = new char[1024];
            try {
                Reader reader = new BufferedReader(
                        new InputStreamReader(is, "UTF-8"));
                int n;
                while ((n = reader.read(buffer)) != -1) {
                    writer.write(buffer, 0, n);
                }
            } finally {
                is.close();
            }
            return writer.toString();
        } else {
            return "";
        }
    }
	public void execScriptFromFile(String fname) {
        try {
        	//System.out.println("scriptexec " + fname);
            String location = "";
            location += fname;
            InputStream instream = mApp.getInputStream(location, false);
            String script = convertStreamToString(instream);
            execScript(script);
        } catch (IOException ex) {
            Logger.getLogger(ServerkoParse.class.getName()).log(Level.SEVERE, null, ex);
        }

	}

	public void execQScriptFromFile(String fname) {
        try {
        	//System.out.println("qscriptexec " + fname);
            String location = "";
            location += fname;
            InputStream instream = mApp.getInputStream(location, true); 
            	//mApp.context().getClass().getResourceAsStream(location);
            String script = convertStreamToString(instream);
            execScript(script);
        } catch (IOException ex) {
            Logger.getLogger(ServerkoParse.class.getName()).log(Level.SEVERE, null, ex);
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
		if (mApp.mSupportOld)
		{
			execQScriptFromFile("supportold.js");
		}
	    
	}


	public void loadModule2(final String resptype) {
        Timer t  = new javax.swing.Timer(0, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	 execLoadModule2(resptype);
            }
        });
        //t.setIntialDelay(delay);
        t.setRepeats(false);
        t.start();
	}


	public void loadScript(final String resptype, int time) {
        Timer t  = new javax.swing.Timer(time, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	 execLoadModule2(resptype);
            }
        });
        //t.setIntialDelay(delay);
        t.setRepeats(false);
        t.start();
	}

	
	
	
	public void loadModule(final String resptype) {
        Timer t  = new javax.swing.Timer(0, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	execLoadModule(resptype);
            }
        });		
        t.setRepeats(false);
        t.start();

	}


	public void execScript(final String respdata, int delay) {
        Timer t  = new javax.swing.Timer(delay, new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            	execScript(respdata);
            }
        });		
        t.setRepeats(false);
        t.start();
	}

	void execLoadModule(String data)
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
