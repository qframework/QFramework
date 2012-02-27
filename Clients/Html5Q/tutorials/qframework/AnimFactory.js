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
*/

function AnimFactory_AnimFrame()
{
	this.rotate= undefined;
	this.scale= undefined;
	this.translate= undefined;

	this.rotate2= undefined;
	this.translate2= undefined;
	
	this.operation = undefined;
	
	this.rotateActive = false;
	this.rotate2Active = false;
	this.scaleActive = false;
		
	this.translateActive = false;
	this.translate2Active = false;
	
}

function AnimFactory_AnimType()
{
	this.id = undefined;
	this.frames = undefined;
	this.repeat = 1;
	this.delay = 1000;
}


AnimFactory.prototype.processAnimFrame = function(objData , frame) 
{
	var count = 0;
	if (objData["rotate"] != undefined)
	{
		var data = objData["rotate"];
		frame.rotate = [0,0,0];
		count = ServerkoParse.parseFloatArray(frame.rotate, data);
		frame.rotateActive = count > 0;
	}
	if (objData["scale"] != undefined)
	{
		var data = objData["scale"];
		frame.scale= [0,0,0];
		count = ServerkoParse.parseFloatArray(frame.scale, data);
		frame.scaleActive = count > 0;
	}
	if (objData["translate"] != undefined)
	{
		var data = objData["translate"];
		frame.translate= [0,0,0];
		count = ServerkoParse.parseFloatArray(frame.translate, data);
		frame.translateActive = count > 0;
	}
	
	if (objData["rotate2"] != undefined)
	{
		var data = objData["rotate2"];
		frame.rotate2 = [0,0,0];
		count = ServerkoParse.parseFloatArray(frame.rotate2, data);
		frame.rotate2Active = count > 0;
	}

	if (objData["translate2"] != undefined)
	{
		var data = objData["translate2"];
		frame.translate2= [0,0,0];
		count = ServerkoParse.parseFloatArray(frame.translate2, data);
		frame.translate2Active = count > 0;
	}
	
	if (objData["operation"] != undefined)
	{
		var data = objData["operation"];
		frame.operation = data;
	}			

}

AnimFactory.prototype.buildObjectAdata = function(ref, atype, delay, repeat, data, callback)
{
	var adata = ref.getAnimData(this.mApp);
	// fill anim data!
	
	// for object destination is stored in data
	var values = new Array(32);
	var count = ServerkoParse.parseFloatArray(values, data);
	adata.setDelay(delay, repeat);    	
	adata.setup(atype,values,count,ref);

	adata.setCallback(callback);
	ref.activateAnim();
	
	
}

// public members
function AnimFactory(app)
{
	this.mApp = app;
	this.mFallback= new AnimData(255, app);
	this.mAnimPool = [];
	for (var a=0; a<16 ; a++ ) {
		this.mAnimPool.push( new AnimData(a, this.mApp) );
	}
	this.mCount = 0;
	this.mAnimations = {}
}

	
AnimFactory.prototype.get = function(owner) 
{
	if (owner != undefined && owner.mCurrentAnim != undefined) {
		//console.log( "resetting anim ");
		owner.mCurrentAnim.process( undefined , owner.mCurrentAnim.mEndtime, false);
		owner.mCurrentAnim = undefined;
	}

	for (var  a=0; a< this.mAnimPool.length; a++) {
		if (this.mAnimPool[a].mActive == false) {
			this.mAnimPool[a].mActive = true;
			this.mCount ++;
			this.mAnimPool[a].mOwner = owner;
			if (owner != undefined)
			{
				owner.mCurrentAnim = this.mAnimPool[a];
			}
			return this.mAnimPool[a];
		}
	}
	return this.mFallback;
}

	
	
AnimFactory.prototype.process = function(framedelta)
{

	for (var  a=0; a< this.mAnimPool.length; a++) {
		if (this.mAnimPool[a].mActive == true) 
		{
			if (this.mAnimPool[a].process(framedelta , true) == false)
			{
				//console.log("anim cnt = " + this.mCount);
			}
		}
	}
}
	
AnimFactory.prototype.add = function(anim) {
	
	anim.mActive = true;
}

AnimFactory.prototype.createAnimColor = function(delay, color1, color2, color3) 
{
	var adata = this.get(undefined);
	
	adata.setDelay(delay , 1);
	adata.addFrameColor( color1);
	adata.addFrameColor( color2);
	if (color3 !=undefined)
		adata.addFrameColor( color3);
	adata.apply();
}

AnimFactory.prototype.move = function(name, location, data, callback)
{
	this.animObject("move", name, location, data, callback);
}

AnimFactory.prototype.rotate = function(name, angles, data, callback)
{
	this.animObject("rotate", name, angles, data, callback);
}	

AnimFactory.prototype.initAnimation = function(response)
{
	var frames;
	frames = response["frames"];
	var atype = new AnimFactory_AnimType();
	atype.frames = new Array();

	if (response["id"] != undefined)
	{
		atype.id = response["id"];
	}			
	
	if (response["delay"] != undefined)
	{
		atype.delay= parseInt( response["delay"] );
	}
	
	if (response["repeat"] != undefined)
	{
		atype.repeat= parseInt( response["repeat"] );
	}

	
	for (var a=0; a< frames.length; a++)
	{
		var pCurr = frames[a];
		var frame = new AnimFactory_AnimFrame();
		this.processAnimFrame(pCurr , frame);
		atype.frames.push(frame);

	}	
	this.mAnimations[atype.id] = atype;
}


AnimFactory.prototype.animObject = function(animid,objectid,data, delaydata,callback)
{
	// find AnimType
	if (this.mAnimations[animid] == undefined)
	{
		return;
	}
	
	var item = this.mApp.mObjectsFact.mItems[objectid];
	var ref = item.mModelRef;
	
	var intdata = [0,0];
	var count = ServerkoParse.parseIntArray(intdata, delaydata);
	
	var atype = this.mAnimations[animid];
	
	// find ref

	// generate AnimData from AnimType
	// configure AnimData with ref!
	var repeat = atype.repeat;
	var delay = atype.delay;
	if (count >= 1)
		delay = intdata[0];    	
	if (count == 2)
		repeat = intdata[1];
	this.buildObjectAdata(ref, atype, delay, repeat , data , callback);
	  
	// ref - is animated! - has AnimData, once allocated
	
	
}

AnimFactory.prototype.animRef = function(animid, start, end,delaydata)
{
	if (this.mAnimations[animid] == undefined)
	{
		return;
	}
	
	var intdata = [0,0];
	var atype = this.mAnimations[animid];
	var adata = end.getAnimData(this.mApp);
	var repeat = atype.repeat;
	var delay = atype.delay;
	var count = ServerkoParse.parseIntArray(intdata, delaydata);
	if (count >= 1)
		delay = intdata[0];    	
	if (count == 2)
		repeat = intdata[1];
	adata.setDelay(delay, repeat);
	adata.setup2(atype,start,end);
	end.activateAnim();
}

AnimFactory.prototype.createAnim = function(start,end, def, delay , steps, owner, repeat, hide) {
	
	var adata = def.getAnimData(this.mApp);
	var atype = this.mAnimations["transform"];
	adata.setDelay(delay, repeat);
	adata.setup2(atype,start,end);
	adata.saveBackup(def , hide);
	def.activateAnim();
	
}

AnimFactory.prototype.getCount = function()
{
    return this.mCount;
}

AnimFactory.prototype.decCount = function()
{
    this.mCount--;
}

AnimFactory.prototype.incCount = function()
{
    this.mCount++;
}

AnimFactory.prototype.getScollerAnim = function(owner)
{
	var adata = undefined;
	for (var a=0; a< this.mAnimPool.length; a++) 
	{
		var data = this.mAnimPool[a]; 
		if (data.isActive() == false) 
		{
			if (data.mAreaOwner != undefined && data.mAreaOwner == owner)
			{
				adata = data;
				break;
			}
			if (adata == undefined)
			{
				adata = data;
			}
		}
	}
	return adata;
}

 AnimFactory.prototype.animModelRef = function(animid,ref, delaydata , data)
{
	// find AnimType
	if (this.mAnimations[animid] == undefined)
	{
		return;
	}
	
	var intdata = [0,0];
	var count = ServerkoParse.parseIntArray(intdata, delaydata);
	
	var atype = this.mAnimations[animid];
	
	// find ref
	// generate AnimData from AnimType
	// configure AnimData with ref!
	
	var repeat = atype.repeat;
	var delay = atype.delay;
	if (count >= 1)
		delay = intdata[0];    	
	if (count == 2)
		repeat = intdata[1];
	this.buildObjectAdata(ref, atype, delay, repeat , data , undefined);
}	
