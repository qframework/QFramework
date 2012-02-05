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


function SoundFactory( ) 
{
	this.mSoundPoolMap = {}; 
	this.mContext = undefined;
	this.mLastStream = 0;
	this.mMute = 0;
	this.mInit = false;
	this.mVolume = 50;
}

SoundFactory.prototype.init = function(context) 
{
	this.mInit = false;
	this.mLastStream = 0;
	this.mContext = context.context();
	this.mInit = true;
	this.mApp = context;
} 
		   
SoundFactory.prototype.playSound = function(sound) 
{
	if (!this.mInit || this.mMute == 1)
	{
		return;
	}
	//Log.d("model" , "stream play = " + sound);
	if ( this.mVolume > 0) 
	{
		
		var audio = this.mSoundPoolMap[sound];
		if (audio != undefined)
		{			
			audio.pause();
			audio.volume = this.mVolume;
			//audio.currentTime = 0;
			audio.play();
		}
			
		
	}
	  
} 

SoundFactory.prototype.stop = function()
{
	if (this.mLastStream > 0)
	{
		this.mLastStream = 0;
	}

}

SoundFactory.prototype.loadFromFile = function(strType, strData) 
{
	var audio  = new Audio("res/" + strData);
	if (audio != undefined)
	{
		this.mSoundPoolMap[strType] = audio;
	}

}


SoundFactory.prototype.onPlaySound = function(type, data)
{	
	this.playSound(data);
}

SoundFactory.prototype.setVolume = function(volume)
{

	this.mVolume = volume  / 100;
	//Log.d("model" , "soundv " + mVolume + " " + volume);		
}
SoundFactory.prototype.newSound = function(name , file)
{
	
	this.loadFromFile(name, file + ".mp3");
}	


SoundFactory.prototype.setMute = function(val)
{
	this.mMute = val;
}
