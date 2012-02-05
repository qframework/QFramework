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
import java.util.HashMap;


import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.SoundPool;
import android.util.Log;

public class SoundFactory {
	private static SoundPool mSoundPool; 
	private HashMap<String, Integer> mSoundPoolMap;
	private Context	mContext;
	private int mLastStream = 0;
	private int mMute = 0;
	private boolean mInit = false;
	private float 	mVolume = 50;
	private GameonApp mApp;
	
	protected void init(GameonApp context) {
		mInit = false;
		mLastStream = 0;
		mContext = context.context();
		mSoundPool = new SoundPool(4, AudioManager.STREAM_MUSIC, 0); 
		mSoundPoolMap = new HashMap<String, Integer>(); 
		mInit = true;
		mApp = context;
	} 
	           
	protected void playSound(String sound) {
		if (!mInit || mMute == 1)
		{
			return;
		}
		//Log.d("model" , "stream play = " + sound);
		if ( mVolume > 0) 
		{
			if (mSoundPool != null && mSoundPoolMap != null) {
			     AudioManager mgr = (AudioManager)mContext.getSystemService(Context.AUDIO_SERVICE); 
			     int streamVolume = mgr.getStreamVolume(AudioManager.STREAM_MUSIC);
			     float vol = 1;//
			     float sv = (float)mgr.getStreamMaxVolume(AudioManager.STREAM_MUSIC); 
			     if ( sv > 0)
			     {
			    	 float sr = (float)streamVolume / sv;
			    	 float gv = mVolume;
			    	 vol = (sr) * (gv);
			     }else
			     {
			    	 return;
			     }
			     if (mSoundPoolMap.containsKey(sound)) {
			    	 /*
			    	MediaPlayer m = mSoundPoolMap.get(sound);
			    	m.start();*/
			    	Integer soundid = mSoundPoolMap.get(sound);
			    	mLastStream = mSoundPool.play(soundid.intValue(), vol, vol, 0, 0, 1f);
			    	//Log.d("model" , "stream vol = " + vol);
			     }
			}
		}
	      
	} 

	protected void stop()
	{
		if (mLastStream > 0)
		{
			mSoundPool.stop(mLastStream);
			mLastStream = 0;
		}
	
	}
	protected void loadFromFile(String strType, String strData) {
		String pathdir = "res/" + strData ;
	    AssetManager asset  = mContext.getAssets();
	    AssetFileDescriptor fd = null;
	    try {
			fd = asset.openFd(pathdir);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return;
		}
		
		int soundid = mSoundPool.load( fd, 1);
		
		if (soundid >= 0)
		{
			mSoundPoolMap.put(strType, new Integer(soundid));
		}
		
	}
	
	protected void onPlaySound(String type, String data)
	{
		playSound(data);
	}
	
	protected void setVolume(float volume)
	{
		mVolume = volume  / 100;
		//Log.d("model" , "soundv " + mVolume + " " + volume);		
	}
	protected void newSound(String name , String file)
	{
		loadFromFile(name, file + ".mp3");
	}
	

	protected void setMute(int val)
	{
		mMute = val;
	}
}
