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

import android.content.Context;
import android.content.SharedPreferences;

public class Settings {
	String mPrefsName;
	ServerkoParse mParser;
	Context mContext;
	SharedPreferences mSettings;
	SharedPreferences.Editor mEditor;
	GameonApp 	mApp;
	public Settings(GameonApp app)
	{
		mApp = app;
	}
	protected void init(ServerkoParse parser, Context context, String appname)
	{
		mPrefsName = appname + "_prefs";
		mParser = parser;
		mContext = context;
	}
	protected void setParser(ServerkoParse parser)
	{
		mParser = parser;
	}

	protected void open() {

		mSettings = mContext.getSharedPreferences(mPrefsName, 0);
		mEditor = mSettings.edit();
	}

	protected void save() {
		if (mSettings != null && mEditor != null)
		{
			mEditor.commit();
		}
	}

	protected void writeInt(String resptype, String respdata) {
		//Log.d("q", respdata);
		if (mSettings != null && mEditor != null)
		{
		
			mEditor.putInt(resptype, Integer.parseInt(respdata));
		}
	}

	protected void writeStr(String resptype, String respdata) {
		// TODO Auto-generated method stub
		if (mSettings != null && mEditor != null)
		{
		
			mEditor.putString(resptype, respdata);
		}
	}

	protected void loadInt(String resptype, String respdata) {
		//
		if (mSettings != null && mEditor != null)
		{
		
			int val  = mSettings.getInt(resptype, 0);
	        String script =  respdata + "="+ val + ";";
	        mParser.execScript(script);
		}
	}

	protected void loadStr(String resptype, String respdata) {
		if (mSettings != null && mEditor != null)
		{
		
			String val  = mSettings.getString(resptype, "");
			if (val.length() > 0)
			{
				String script =  respdata + "='"+ val + "';";
				mParser.execScript(script);
			}
		}
	}
	// 


	protected void loadArray(String resptype, String respdata) {
		if (mSettings != null && mEditor != null)
		{
		
			String val  = mSettings.getString(resptype, "");
			
			if (val.length() > 0)
			{
				String script =  respdata + "=eval(["+ val + "]);";
				mParser.execScript(script);
			}
		}
	}
}
