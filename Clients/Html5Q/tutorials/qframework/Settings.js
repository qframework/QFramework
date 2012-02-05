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


function Q_Settings(app ) 
{
	this.mApp = app;

	this.mPrefsName = "";
	this.mParser = undefined;

	this.mSettings = {};
	this.storage = undefined;
}

Q_Settings.prototype.init = function(parser, context, appname)
{
	this.mPrefsName = appname + "_prefs_";
	this.mParser = parser;
	this.mSettings = {};

	if ( 'localStorage' in window && window['localStorage'] !== null )
	{
		this.storage = window.localStorage;
	}
	else
	{
	}
	
	 
}
Q_Settings.prototype.setParser = function(parser)
{
	mParser = parser;
}

Q_Settings.prototype.open = function() {

	//mSettings = mContext.getSharedPreferences(mPrefsName, 0);
	this.mSettings = {};
}

Q_Settings.prototype.save = function() {
}

Q_Settings.prototype.writeInt = function(resptype, respdata) {
	if (this.storage != undefined)
	{
		this.storage.setItem(this.mPrefsName+resptype, respdata); 
	}
	else
	{
	
		this.mSettings[resptype] = respdata;
	}	
}

Q_Settings.prototype.writeStr = function(resptype, respdata) {
	if (this.storage != undefined)
	{
		this.storage.setItem(this.mPrefsName+resptype, respdata);
	}
	else
	{
		this.mSettings[resptype] = respdata;
	}

}

Q_Settings.prototype.loadInt = function(resptype, respdata) {
	var val = "0";

	if (this.storage != undefined)
	{	
		val = this.storage.getItem(this.mPrefsName+resptype);
	}
	else
	{
		if (this.mSettings[resptype] != undefined)
		{
			val = this.mSettings[resptype];
		}
	}
	if (val == undefined)
	{
		val = "0";
	}	
	// 
	//int val  = mSettings.getInt(resptype, 0);
	var script =  respdata + "="+ val + ";";
	this.mParser.execScript(script);
	
}

Q_Settings.prototype.loadStr = function(resptype, respdata) 
{
	var val = "";
	if (this.storage != undefined)
	{
		val = this.storage.getItem(this.mPrefsName+resptype);
	}
	else
	{	
		if (this.mSettings[resptype] != undefined)
		{
			val = this.mSettings.get(resptype);
		}
	}
	if (val == undefined)
	{
		val = "";
	}
	var script =  respdata + "='"+ val + "';";
	this.mParser.execScript(script);		
	
}


Q_Settings.prototype.loadArray = function(resptype, respdata) 
{
	var val = "";
	if (this.storage != undefined)
	{
		val = this.storage.getItem(this.mPrefsName+resptype);
	}
	else
	{	
		if (this.mSettings[resptype] != undefined)
		{
			val = this.mSettings.get(resptype);
		}
	}
	if (val == undefined || val.length == 0)
	{
		return;
	}
	var script =  respdata + "=eval(["+ val + "]);";
	this.mParser.execScript(script);		
	
}

