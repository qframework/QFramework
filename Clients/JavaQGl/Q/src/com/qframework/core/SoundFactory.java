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
import java.util.HashMap;
import javax.sound.sampled.*;


public class SoundFactory {
	private HashMap<String, Clip > mSoundPoolMap; 
	private int mLastStream = 0;
	private int mMute = 0;
	private boolean mInit = false;
	private float 	mVolume = 50;
	private GameonApp mApp;
	
	protected void init(GameonApp context) {
		mInit = false;
		mLastStream = 0;
		mSoundPoolMap = new HashMap<String, Clip>(); 
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
			if (mSoundPoolMap != null) {
			     if (mSoundPoolMap.containsKey(sound)) {
			    	Clip soundid = mSoundPoolMap.get(sound);
			    	try
			    	{
			    		
			    		FloatControl gainControl = 
			    		    (FloatControl) soundid.getControl(FloatControl.Type.MASTER_GAIN);
			    		float range = gainControl.getMaximum() - gainControl.getMinimum();
			    		float volume = range * (float)Math.sin(mVolume*3.14/2) + gainControl.getMinimum();
			    		gainControl.setValue(volume);			    		
			    		soundid.setFramePosition(0);
			    		soundid.start();
			    	}
			    	catch (Exception e)
			    	{
			    		e.printStackTrace();
			    	}			    	
			     }
				
			}
			
		}
	      
	} 

	protected void stop()
	{
		if (mLastStream > 0)
		{
			mLastStream = 0;
		}
	
	}
	protected void loadFromFile(String strType, String strData) {
		
        String location = "";
        location += strData;
        InputStream  instream = mApp.getInputStream(location, false);
        AudioInputStream ain = null;
		try {
			ain = AudioSystem.getAudioInputStream(instream);
		} catch (UnsupportedAudioFileException e1) {
			e1.printStackTrace();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
        try {
            DataLine.Info info =
                new DataLine.Info(Clip.class,ain.getFormat( ));
            Clip clip = null;
			try {
				clip = (Clip) AudioSystem.getLine(info);
			} catch (LineUnavailableException e) {
				e.printStackTrace();
			}
            try {
				clip.open(ain);
			} catch (LineUnavailableException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
            if (clip != null)
            {
            	mSoundPoolMap.put(strType, clip);
            }            
        }
        finally { // We're done with the input stream.
            try {
				ain.close( );
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
        
	}

	
	protected void onPlaySound(String type, String data)
	{
		playSound(data);
	}
	
	protected void setVolume(float volume)
	{

		mVolume = volume  / 100;
	}
	protected void newSound(String name , String file)
	{
		
		loadFromFile(name, file + ".wav");
	}	


	protected void setMute(int val)
	{
		mMute = val;
	}
}
