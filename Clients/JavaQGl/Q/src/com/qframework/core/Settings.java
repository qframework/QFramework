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

import java.util.HashMap;
import java.util.prefs.BackingStoreException;
import java.util.prefs.Preferences;

public class Settings {
	private String mPrefsName;
	private ServerkoParse mParser;

	HashMap<String, String> mSettings;
	Preferences mPreferences = null;
	GameonApp 	mApp;
	public Settings(GameonApp app)
	{
		mApp = app;
	}
	private Preferences getPreferences() {
	    Preferences prefs;
        try {
            prefs = new PersistencePreferences();
        }
        catch (Exception e) {
        	System.out.println( "PersistencePreferences " + e.toString());
    	    try {
    	    	System.out.println( "Trying Preferences " + e.toString());
    	        prefs = Preferences.userRoot();
    	    }
    	    catch (SecurityException disabled) {
    	    	System.out.println( "Failed Preferences " + disabled.toString());
    	        return null;
    	    }
        	
        }	        	    
	    return prefs.node("com/gameon/bela");
	}
	
	protected void init(ServerkoParse parser, String appname)
	{
		mPrefsName = appname + "_prefs";
		mParser = parser;
		mSettings = new HashMap<String, String>();
		mPreferences = getPreferences();
		if (mPreferences == null)
		{
			System.out.println( "PersistencePreferences failed  ");
		}
	}
	
	protected void setParser(ServerkoParse parser)
	{
		mParser = parser;
	}

	protected void open() {
		mSettings = new HashMap<String, String>();
	}

	protected void save() {
		if  ( mPreferences != null)
		{
			try {
				mPreferences.flush();
			} catch (BackingStoreException e) {
				e.printStackTrace();
			}
			
		}
	}

	protected void writeInt(String resptype, String respdata) {
		mSettings.put(resptype, respdata);
		if  ( mPreferences != null)
		{
			mPreferences.put(resptype, respdata);
		}
	}

	protected void writeStr(String resptype, String respdata) {
		mSettings.put(resptype, respdata);
		if  ( mPreferences != null)
		{
			mPreferences.put(resptype, respdata);
		}		
		System.out.println(resptype + " <- " + respdata );
	}

	protected void loadInt(String resptype, String respdata) {
		String val = "0";

		if  ( mPreferences != null)
		{
			val = mPreferences.get(resptype, "0");
			
		}else
		{
			if (mSettings.containsKey(resptype))
			{
				val = mSettings.get(resptype);
			}
		}
		// 
		if (val.length() > 0)
		{		
			String script =  respdata + "="+ val + ";";
			mParser.execScript(script);
			System.out.println(resptype + " >- " + val );
		}
		
	}

	protected void loadStr(String resptype, String respdata) {
		String val = "";
		if  ( mPreferences != null)
		{
			val = mPreferences.get(resptype, "");
			
		}else
		{		
			if (mSettings.containsKey(resptype))
			{
				val = mSettings.get(resptype);
			}
		}
		
		if (val.length() > 0)
		{
			String script =  respdata + "='"+ val + "';";
			mParser.execScript(script);
		}
		
	}
	// 


	protected void loadArray(String resptype, String respdata) {
		String val = "";
		if  ( mPreferences != null)
		{
			val = mPreferences.get(resptype, "");
			
		}else
		{		
			if (mSettings.containsKey(resptype))
			{
				val = mSettings.get(resptype);
			}
		}
		
		System.out.println(resptype + " -> " + val);
		
		if (val.length() > 0)
		{
			String script =  respdata + "=eval(["+ val + "]);";
			mParser.execScript(script);
		}
	}
	
}
