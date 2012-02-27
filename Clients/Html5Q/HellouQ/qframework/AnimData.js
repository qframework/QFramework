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


function AnimData_AnimFrame()
{
	this.mScale = undefined;
	this.mScaleAnim = false;
	this.mRotate = undefined;
	this.mRotateAnim = false;
	this.mTranslate = undefined;
	this.mTranslateAnim = false;

	this.mRotate2 = undefined;
	this.mRotate2Anim = false;
	this.mTranslate2 = undefined;
	this.mTranslate2Anim = false;
}

AnimData_Type =
{
	NONE:0,
	REF:1,
	COLOR:2,
	SCROLLER:3
}



AnimData.prototype.reset = function()
{
	
	this.mRefCount = 0;
	this.mSteps = 0;
	this.mTimeStep = 0;
	this.mActive = false;
	this.mRepeat = 1;
	this.mToFinish =false;
	this.mType  = AnimData_Type.REF;
	this.mCallback = undefined;
	this.restore();
	if (this.mSavedRef != undefined)
	{
	this.mSavedRef.set();
	this.mSavedRef = undefined;
	}
	
	
	this.mApp.anims().decCount();
	this.mPerctVal = -1;
	this.mPerctMin = 0;
	this.mPerctMax = 0;
	this.mPerctDiff = 0;
	if (this.mAreaOwner != undefined)
	{
		this.mAreaOwner.mScollerAnim = undefined;
		this.mAreaOwner = undefined; 
	}	
	//Log.d("model", "afinish " + mId);
	
}

AnimData.prototype.restore = function() {
	if (this.mType == AnimData_Type.COLOR)
	{
		this.setColorEnd();
	}
}




AnimData.prototype.setColorStart = function(gl) {
	var c = this.mColorPool[0];
	this.mApp.world().setAmbientLight(c.red, c.green, c.blue, c.alpha );

}

AnimData.prototype.setColorEnd = function(gl) {
	var c = this.mColorPool[this.mRefCount-1];
	this.mApp.world().setAmbientLight(c.red, c.green, c.blue, c.alpha );

}


AnimData.prototype.setRef = function(time) {
	// set current source and destination key frames
	var diff = time;
	if (diff == 0)diff = 1.0;
	perct = diff / this.mAnimDelay;
	var frame =  Math.floor( ( perct * this.mSteps) );
	
	if (frame > this.mSteps -1) {
		frame = this.mSteps -1;
	}
	
	if(frame > this.mMaxFrames-1 || frame < 0) {
		this.reset();
		//console.log(" anim failed "  + frame);
		return 1.0;
	}
	if (this.mType == AnimData_Type.COLOR)
	{
		this.mCurrSourceCol = this.mColorPool[frame];//mDestRefVec.get(frame);
		this.mCurrDestCol = this.mColorPool[frame+1];//mDestRefVec.get(frame+1);
		
	}

	rest = (diff - (frame * this.mTimeStep)) / this.mTimeStep;
	return rest;
}

AnimData.prototype.calcLinearColor = function(gl , sourceCol, destCol, perct) 
{
	var rs = sourceCol.red;
	var bs = sourceCol.blue;
	var gs = sourceCol.green;
	var as = sourceCol.alpha;
	
	var rd = destCol.red;
	var bd = destCol.blue;
	var gd = destCol.green;
	var ad = destCol.alpha;

	var r = rs + (rd-rs) * perct;
	var g = gs + (gd-gs) * perct;
	var b = bs + (bd-bs) * perct;
	var a = as + (ad-as) * perct;
	
	
	this.mApp.world().setAmbientLight(r, g, b, a );		

}

AnimData.prototype.copyColor = function(src, dst) 
{
	dst.alpha = src.alpha;
	dst.red = src.red;
	dst.blue = src.blue;
	dst.green = src.green;
}

AnimData.prototype.setCallback = function(callback)
{
	this.mCallback = callback;
}
AnimData.prototype.addFrameColor = function(c) 
{
	if (this.mColorPool == undefined)
	{
		this.mColorPool= new Array();
		
		for (var a=0; a< this.mMaxFrames; a++) {
			this.mColorPool.push( new GLColor(0) );
		}			
	}
	
	if (this.mRefCount < this.mMaxFrames) {
		var col = this.mColorPool[this.mRefCount++];
		this.copyColor( c,  col );
	}
		//mDestRefVec.add(ref);
}

AnimData.prototype.copyColor = function(src, dst) 
{
	dst.alpha = src.alpha;
	dst.red = src.red;
	dst.blue = src.blue;
	dst.green = src.green;
}



AnimData.prototype.storeArrays = function(outarr, inarr , ref )
{
	if (outarr.mTranslateAnim == true)
	{
		if (outarr.mTranslate == undefined)
			outarr.mTranslate = [0.0,0.0,0.0];
		outarr.mTranslate[0] = ref.mPosition[0];
		outarr.mTranslate[1] = ref.mPosition[1];
		outarr.mTranslate[2] = ref.mPosition[2];
	}

	
	if (outarr.mRotateAnim == true)
	{
		if (outarr.mRotate == undefined)
			outarr.mRotate = [0.0,0.0,0.0];
		outarr.mRotate[0] = ref.mRotation[0];
		outarr.mRotate[1] = ref.mRotation[1];
		outarr.mRotate[2] = ref.mRotation[2];
	}
	
	if (outarr.mScaleAnim == true)
	{
		if (outarr.mScale == undefined)
			outarr.mScale = [0.0,0.0,0.0];
		outarr.mScale[0] = ref.mScale[0];
		outarr.mScale[1] = ref.mScale[1];
		outarr.mScale[2] = ref.mScale[2];			
	}

	
	if (outarr.mTranslate2Anim == true)
	{
		if (outarr.mTranslate2 == undefined)
			outarr.mTranslate2 = [0.0,0.0,0.0];
		outarr.mTranslate2[0] = ref.mAreaPosition[0];
		outarr.mTranslate2[1] = ref.mAreaPosition[1];
		outarr.mTranslate2[2] = ref.mAreaPosition[2];
	}

	
	if (outarr.mRotate2Anim == true)
	{
		if (outarr.mRotate2 == undefined)
			outarr.mRotate2 = [0.0,0.0,0.0];
		outarr.mRotate2[0] = ref.mAreaRotation[0];
		outarr.mRotate2[1] = ref.mAreaRotation[1];
		outarr.mRotate2[2] = ref.mAreaRotation[2];
	}
	
}

AnimData.prototype.storeArrays3 = function(outarr, inarr , start, end, p )
{
	if (outarr.mTranslateAnim == true)
	{
		if (outarr.mTranslate == undefined)
			outarr.mTranslate = [0.0,0.0,0.0];
		outarr.mTranslate[0] = (end.mPosition[0] - start.mPosition[0]) * p + start.mPosition[0];
		outarr.mTranslate[1] = (end.mPosition[1] - start.mPosition[1]) * p + start.mPosition[1];
		outarr.mTranslate[2] = (end.mPosition[2] - start.mPosition[2]) * p + start.mPosition[2];
	}

	
	if (outarr.mRotateAnim == true)
	{
		if (outarr.mRotate == undefined)
			outarr.mRotate = [0.0,0.0,0.0];
		outarr.mRotate[0] = (end.mRotation[0] - start.mRotation[0]) * p + start.mRotation[0];
		outarr.mRotate[1] = (end.mRotation[1] - start.mRotation[1]) * p + start.mRotation[1];
		outarr.mRotate[2] = (end.mRotation[2] - start.mRotation[2]) * p + start.mRotation[2];
	}
	
	if (outarr.mScaleAnim == true)
	{
		if (outarr.mScale == undefined)
			outarr.mScale = [0.0,0.0,0.0];
		outarr.mScale[0] = (end.mScale[0] - start.mScale[0]) * p + start.mScale[0];
		outarr.mScale[1] = (end.mScale[1] - start.mScale[1]) * p + start.mScale[1];
		outarr.mScale[2] = (end.mScale[2] - start.mScale[2]) * p + start.mScale[2];			
	}

	
	if (outarr.mTranslate2Anim == true)
	{
		if (outarr.mTranslate2 == undefined)
			outarr.mTranslate2 = [0.0,0.0,0.0];
		outarr.mTranslate2[0] = (end.mAreaPosition[0] - start.mAreaPosition[0]) * p + start.mAreaPosition[0];
		outarr.mTranslate2[1] = (end.mAreaPosition[1] - start.mAreaPosition[1]) * p + start.mAreaPosition[1];
		outarr.mTranslate2[2] = (end.mAreaPosition[2] - start.mAreaPosition[2]) * p + start.mAreaPosition[2];
	}

	
	if (outarr.mRotate2Anim == true)
	{
		if (outarr.mRotate2 == undefined)
			outarr.mRotate2 = [0.0,0.0,0.0];
		outarr.mRotate2[0] = (end.mAreaRotation[0] - start.mAreaRotation[0]) * p + start.mAreaRotation[0];
		outarr.mRotate2[1] = (end.mAreaRotation[1] - start.mAreaRotation[1]) * p + start.mAreaRotation[1];
		outarr.mRotate2[2] = (end.mAreaRotation[2] - start.mAreaRotation[2]) * p + start.mAreaRotation[2];
	}
	
	
}

AnimData.prototype.storeArrays2 = function(outarr, inarr , values, countmax)
{
	var count = 0;
	if (outarr.mTranslateAnim == true)
	{
		if (outarr.mTranslate == undefined)
			outarr.mTranslate = [0.0,0.0,0.0];
		outarr.mTranslate[0] = values[count++];
		outarr.mTranslate[1] = values[count++];
		outarr.mTranslate[2] = values[count++];
	}

	
	if (outarr.mRotateAnim == true)
	{
		if (outarr.mRotate == undefined)
			outarr.mRotate = [0.0,0.0,0.0];
		outarr.mRotate[0] = values[count++];
		outarr.mRotate[1] = values[count++];
		outarr.mRotate[2] = values[count++];
	}
	
	if (outarr.mScaleAnim == true)
	{
		if (outarr.mScale == undefined)
			outarr.mScale = [0.0,0.0,0.0];
		outarr.mScale[0] = values[count++];
		outarr.mScale[1] = values[count++];
		outarr.mScale[2] = values[count++];			
	}

	
	if (outarr.mTranslate2Anim == true)
	{
		if (outarr.mTranslate2 == undefined)
			outarr.mTranslate2 = [0.0,0.0,0.0];
		outarr.mTranslate2[0] = values[count++];
		outarr.mTranslate2[1] = values[count++];
		outarr.mTranslate2[2] = values[count++];
	}

	
	if (outarr.mRotate2Anim == true)
	{
		if (outarr.mRotate2 == undefined)
			outarr.mRotate2 = [0.0,0.0,0.0];
		outarr.mRotate2[0] = values[count++];
		outarr.mRotate2[1] = values[count++];
		outarr.mRotate2[2] = values[count++];
	}

	
}


AnimData.prototype.addArrays = function(outarr, inarr , ref )
{
	if (outarr.mTranslateAnim == true)
	{
		if (outarr.mTranslate == undefined)
			outarr.mTranslate = [0.0,0.0,0.0];
		outarr.mTranslate[0] += ref.mPosition[0];
		outarr.mTranslate[1] += ref.mPosition[1];
		outarr.mTranslate[2] += ref.mPosition[2];
	}

	
	if (outarr.mRotateAnim == true)
	{
		if (outarr.mRotate == undefined)
			outarr.mRotate = [0.0,0.0,0.0];
		outarr.mRotate[0] += ref.mRotation[0];
		outarr.mRotate[1] += ref.mRotation[1];
		outarr.mRotate[2] += ref.mRotation[2];
	}
	
	if (outarr.mScaleAnim == true)
	{
		if (outarr.mScale == undefined)
			outarr.mScale = [0.0,0.0,0.0];
		outarr.mScale[0] *= ref.mScale[0];
		outarr.mScale[1] *= ref.mScale[1];
		outarr.mScale[2] *= ref.mScale[2];			
	}

	
	if (outarr.mTranslate2Anim == true)
	{
		if (outarr.mTranslate2 == undefined)
			outarr.mTranslate2 = [0.0,0.0,0.0];
		outarr.mTranslate2[0] += ref.mAreaPosition[0];
		outarr.mTranslate2[1] += ref.mAreaPosition[1];
		outarr.mTranslate2[2] += ref.mAreaPosition[2];
	}

	
	if (outarr.mRotate2Anim == true)
	{
		if (outarr.mRotate2 == undefined)
			outarr.mRotate2 = [0.0,0.0,0.0];
		outarr.mRotate2[0] += ref.mAreaRotation[0];
		outarr.mRotate2[1] += ref.mAreaRotation[1];
		outarr.mRotate2[2] += ref.mAreaRotation[2];
	}
	
}


AnimData.prototype.perctArrays = function(outarr, inarr , ref0 , ref , p)
{
	var dist = GMath.dist(ref0,ref);
	
	if (outarr.mTranslateAnim == true && inarr.translateActive == true)
	{
		if (outarr.mTranslate == undefined)
			outarr.mTranslate = [0.0,0.0,0.0];
		outarr.mTranslate[0] += inarr.translate[0] * dist ;
		outarr.mTranslate[1] += inarr.translate[1] *dist ;
		outarr.mTranslate[2] += inarr.translate[2] *dist ;
	}
	
	if (outarr.mRotateAnim == true && inarr.rotateActive == true)
	{
		if (outarr.mRotate == undefined)
			outarr.mRotate = [0.0,0.0,0.0];
		outarr.mRotate[0] += inarr.rotate[0] *dist;
		outarr.mRotate[1] += inarr.rotate[1] *dist;
		outarr.mRotate[2] += inarr.rotate[2] *dist;
	}
	
	if (outarr.mScaleAnim == true && inarr.scaleActive == true)
	{
		if (outarr.mScale == undefined)
			outarr.mScale = [0.0,0.0,0.0];
		outarr.mScale[0] *= inarr.scale[0] * dist;
		outarr.mScale[1] *= inarr.scale[1] * dist;
		outarr.mScale[2] *= inarr.scale[2] * dist;			
	}

	
	if (outarr.mTranslate2Anim == true && inarr.translate2Active == true)
	{
		if (outarr.mTranslate2 == undefined)
			outarr.mTranslate2 = [0.0,0.0,0.0];
		outarr.mTranslate2[0] += inarr.translate2[0] * dist;
		outarr.mTranslate2[1] += inarr.translate2[1] * dist;
		outarr.mTranslate2[2] += inarr.translate2[2] * dist;
	}

	
	if (outarr.mRotate2Anim == true && inarr.rotate2Active == true)
	{
		if (outarr.mRotate2 == undefined)
			outarr.mRotate2 = [0.0,0.0,0.0];
		outarr.mRotate2[0] += inarr.rotate2[0] * dist;
		outarr.mRotate2[1] += inarr.rotate2[1] * dist;
		outarr.mRotate2[2] += inarr.rotate2[2] * dist;
	}

	
}

AnimData.prototype.clearArrays = function(outarr, inarr )
{
	if (outarr.mTranslateAnim == true)
	{
		if (outarr.mTranslate == undefined)
			outarr.mTranslate = [0.0,0.0,0.0];
		outarr.mTranslate[0] = 0;
		outarr.mTranslate[1] = 0;
		outarr.mTranslate[2] = 0;
	}
	
	if (outarr.mRotateAnim == true)
	{
		if (outarr.mRotate == undefined)
			outarr.mRotate = [0.0,0.0,0.0];
		outarr.mRotate[0] = 0;
		outarr.mRotate[1] = 0;
		outarr.mRotate[2] = 0;
	}
	
	if (outarr.mScaleAnim == true)
	{
		if (outarr.mScale == undefined)
			outarr.mScale = [0.0,0.0,0.0];
		outarr.mScale[0] = 1;
		outarr.mScale[1] = 1;
		outarr.mScale[2] = 1;			
	}
	
	if (outarr.mTranslate2Anim == true )
	{
		if (outarr.mTranslate2 == undefined)
			outarr.mTranslate2 = [0.0,0.0,0.0];
		outarr.mTranslate2[0] = 0;
		outarr.mTranslate2[1] = 0;
		outarr.mTranslate2[2] = 0;
	}
	
	if (outarr.mRotate2Anim == true)
	{
		if (outarr.mRotate2 == undefined)
			outarr.mRotate2 = [0.0,0.0,0.0];
		outarr.mRotate2[0] = 0;
		outarr.mRotate2[1] = 0;
		outarr.mRotate2[2] = 0;
	}
	
}


AnimData.prototype.fillFrameEnd = function(frame, atype, values,count , ref)
{
	var def = atype.frames[atype.frames.length-1];
	this.storeArrays2(this.mEnd, def, values, count);
	if (def.operation  != undefined)
	{
		if (def.operation == "add")
		{
			this.addArrays(this.mEnd, def , ref);
		}
	}		
	
}

AnimData.prototype.fillFrameEnd2 = function(frame, atype, ref)
{
	var def = atype.frames[ atype.frames.length-1];
	this.clearArrays(this.mEnd, def );
	this.addArrays(this.mEnd, def , ref);
	
}

AnimData.prototype.fillFrameStart = function(frame, atype, ref)
{
	var def = atype.frames[0];
	this.storeArrays(this.mStart, def , ref);		
}

AnimData.prototype.setup = function(atype, values, count, ref) {
	// start to end
	// setup start
	if (this.mStart == undefined)
		this.mStart = new AnimData_AnimFrame();
	if (this.mEnd == undefined)
		this.mEnd = new AnimData_AnimFrame();

	
	this.maskFrames2(this.mStart,atype.frames[0]);
	this.maskFrames2(this.mEnd,atype.frames[ atype.frames.length-1]);	
	this.clearArrays(this.mStart,atype.frames[0] );
	this.clearArrays(this.mEnd,atype.frames[ atype.frames.length-1] );
	
	this.fillFrameStart(this.mStart, atype,ref);
	this.fillFrameEnd(this.mEnd, atype,values,count , ref);
}

AnimData.prototype.setup2 = function(atype, start, end) {
	// start to end
	// setup start
	if (this.mStart == undefined)
		this.mStart = new AnimData_AnimFrame();
	if (this.mEnd == undefined)
		this.mEnd = new AnimData_AnimFrame();

	//console.log( "start = " + start.mAreaRotation.toString());
	//console.log( "end = " + end.mAreaRotation.toString());

	if (atype.frames.length == 1)
	{
		this.addFrame(atype.frames[0],end);
	}
		
	this.maskFrames(this.mStart,this.mEnd, start,end);
	this.maskFrame(this.mStart,start,end);
	this.fillFrameStart(this.mStart, atype,start);
	this.fillFrameEnd2(this.mEnd, atype,end	);
	if (atype.frames.length > 2)
	{
		this.fillFrames(atype,start,end);
	}
}

AnimData.prototype.addFrame = function (animFrame,ref) 
{
	
	if (animFrame.rotateActive == true && animFrame.rotate != undefined)
	{
		ref.mRotation[0] += animFrame.rotate[0];
		ref.mRotation[1] += animFrame.rotate[1];
		ref.mRotation[2] += animFrame.rotate[2];
	}
	
	if (animFrame.rotate2Active == true && animFrame.rotate2 != undefined)
	{
		ref.mAreaRotation[0] += animFrame.rotate2[0];
		ref.mAreaRotation[1] += animFrame.rotate2[1];
		ref.mAreaRotation[2] += animFrame.rotate2[2];
	}
	
	if (animFrame.translate2Active == true && animFrame.translate2 != undefined)
	{
		ref.mAreaPosition[0] += animFrame.translate2[0];
		ref.mAreaPosition[1] += animFrame.translate2[1];
		ref.mAreaPosition[2] += animFrame.translate2[2];
	}		
	
	if (animFrame.translateActive == true && animFrame.translate != undefined)
	{
		ref.mPosition[0] += animFrame.translate[0];
		ref.mPosition[1] += animFrame.translate[1];
		ref.mPosition[2] += animFrame.translate[2];
	}		

	if (animFrame.scaleActive == true && animFrame.scale != undefined)
	{
		ref.mScale[0] += animFrame.scale[0];
		ref.mScale[1] += animFrame.scale[1];
		ref.mScale[2] += animFrame.scale[2];
	}		

	
}



AnimData.prototype.maskFrames2 = function(frame,inframe) 
{
	if (inframe.rotate2Active == true)
	{
		frame.mRotate2Anim = true;
	}else
	{
		frame.mRotate2Anim = false;
	}
	
	if (inframe.rotateActive == true)
	{
		frame.mRotateAnim = true;
	}else
	{
		frame.mRotateAnim = false;
	}		
	if (inframe.scaleActive == true)
	{
		frame.mScaleAnim = true;
	}else
	{
		frame.mScaleAnim = false;
	}
	
	if (inframe.translate2Active == true)
	{
		frame.mTranslate2Anim = true;
	}else
	{
		frame.mTranslate2Anim = false;
	}
	
	if (inframe.translateActive == true)
	{
		frame.mTranslateAnim = true;
	}else
	{
		frame.mTranslateAnim = false;
	}		
}

AnimData.prototype.maskFrames = function(startFrame, endFrame,start,end) 
{
	// 
	if (start.mPosition[0] != end.mPosition[0] || 
		start.mPosition[1] != end.mPosition[1] ||
		start.mPosition[2] != end.mPosition[2])
	{
		startFrame.mTranslateAnim = true;
		endFrame.mTranslateAnim = true;
	}else
	{
		startFrame.mTranslateAnim = false;
		endFrame.mTranslateAnim = false;
	}

	if (start.mAreaPosition[0] != end.mAreaPosition[0] || 
		start.mAreaPosition[1] != end.mAreaPosition[1] ||
		start.mAreaPosition[2] != end.mAreaPosition[2])
	{
		startFrame.mTranslate2Anim = true;
		endFrame.mTranslate2Anim = true;
	}else
	{
		startFrame.mTranslate2Anim = false;
		endFrame.mTranslate2Anim = false;
	}

	if (start.mRotation[0] != end.mRotation[0] || 
		start.mRotation[1] != end.mRotation[1] ||
		start.mRotation[2] != end.mRotation[2])
	{
		startFrame.mRotateAnim = true;
		endFrame.mRotateAnim = true;
	}else
	{
		startFrame.mRotateAnim = false;
		endFrame.mRotateAnim = false;
	}
	
	if (start.mAreaRotation[0] != end.mAreaRotation[0] || 
		start.mAreaRotation[1] != end.mAreaRotation[1] ||
		start.mAreaRotation[2] != end.mAreaRotation[2])
	{
		startFrame.mRotate2Anim = true;
		endFrame.mRotate2Anim = true;
	}else
	{
		startFrame.mRotate2Anim = false;
		endFrame.mRotate2Anim = false;
	}
	
	if (start.mScale[0] != end.mScale[0] || 
		start.mScale[1] != end.mScale[1] ||
		start.mScale[2] != end.mScale[2])
	{
		startFrame.mScaleAnim = true;
		endFrame.mScaleAnim = true;
	}else
	{
		startFrame.mScaleAnim = false;
		endFrame.mScaleAnim = false;
	}		

}

AnimData.prototype.maskFrame = function(frame, start, end) 
{
	// 
	if (start.mPosition[0] != end.mPosition[0] || 
		start.mPosition[1] != end.mPosition[1] ||
		start.mPosition[2] != end.mPosition[2])
	{
		frame.mTranslateAnim = true;
	}else
	{
		frame.mTranslateAnim = false;
	}

	if (start.mAreaPosition[0] != end.mAreaPosition[0] || 
		start.mAreaPosition[1] != end.mAreaPosition[1] ||
		start.mAreaPosition[2] != end.mAreaPosition[2])
	{
		frame.mTranslate2Anim = true;
	}else
	{
		frame.mTranslate2Anim = false;
	}

	if (start.mRotation[0] != end.mRotation[0] || 
		start.mRotation[1] != end.mRotation[1] ||
		start.mRotation[2] != end.mRotation[2])
	{
		frame.mRotateAnim = true;
	}else
	{
		frame.mRotateAnim = false;
	}

	if (start.mAreaRotation[0] != end.mAreaRotation[0] || 
		start.mAreaRotation[1] != end.mAreaRotation[1] ||
		start.mAreaRotation[2] != end.mAreaRotation[2])
	{
		frame.mRotate2Anim = true;
	}else
	{
		frame.mRotate2Anim = false;
	}
	
	if (start.mScale[0] != end.mScale[0] || 
		start.mScale[1] != end.mScale[1] ||
		start.mScale[2] != end.mScale[2])
	{
		frame.mScaleAnim = true;
	}else
	{
		frame.mScaleAnim = false;
	}		

}


AnimData.prototype.fillFrames = function(atype, start,end) {
	
	var div = 1.0/(atype.frames.length-1);
	var p = div;
	for (var a=1; a< atype.frames.length-1; a++)
	{
		var id = a-1;
		var frameout = undefined;
		if (this.mFrames == undefined)
			this.mFrames = new Array();
		if (id < this.mFrames.length)
		{
			frameout = this.mFrames[id];
		}else
		{
			frameout = new AnimData_AnimFrame();
			this.mFrames.push(frameout);
		}
		var framein = atype.frames[a];
		this.clearArrays(frameout, framein );
		this.maskFrame(frameout,start,end);
		if (framein.operation == "add")
		{
			this.clearArrays(frameout, framein );
			this.storeArrays3(frameout, framein , start,end , p);
			this.addArrays(frameout, framein , end);

		}else if (framein.operation == "pdist")
		{
			this.clearArrays(frameout, framein );
			this.storeArrays3(frameout, framein , start,end , p);
			this.perctArrays(frameout, framein , start,end , p);
		}else
		{
			this.storeArrays(frameout, framein , end);
		}
		p += div;
		this.mActiveFrames++;
	}
}

AnimData.prototype.activate = function() {
	this.mDifftime = 0;
	this.mApp.anims().incCount();
}

AnimData.prototype.process2 = function(ref, delta)
{
	this.mDifftime += delta;
	if (this.mDifftime >= this.mAnimDelay)
	{
		this.mAnimRepeat --;
		if (this.mAnimRepeat > 0)
		{
			this.mDifftime = 0;
			
			if (this.mRepeatDir == 1)
			{
				// which direction?
				var tmp = this.mStart;
				this.mStart = this.mEnd;
				this.mEnd = tmp;
				this.mRepeatDir = -1;
			}else if (this.mRepeatDir == -1)
			{
				var tmp = this.mStart;
				this.mStart = this.mEnd;
				this.mEnd = tmp;
				this.mRepeatDir = 1;					
			}
			
			return false;
		}
		
		this.mDifftime = 0;
		this.endAnimation(ref);

		if (this.mCallback != undefined && this.mCallback.length > 0)
		{
			this.mApp.execScript(this.mCallback);
		}
		return true;
	}
	// process animation
	var p = this.mDifftime / this.mAnimDelay;
	//console.log(" p = " + p);
	if (this.mActiveFrames == 0)
	{
		this.calcLinearData(this.mStart, this.mEnd, p, ref);
	}
	else
	{
		// get frames! - get new p for frame!
		var steps = this.mActiveFrames + 1; // for start and end
		var frame =  Math.floor( p * steps);
		var timeStep = (this.mAnimDelay) / steps;
		var p2 = (this.mDifftime - (frame * timeStep)) / timeStep;
		//console.log( " p2 = " + frame + " " + p2);
		if (frame == 0)
		{
			this.calcLinearData(this.mStart, this.mFrames[0], p2, ref);
		}else if(frame >= steps-1) 
		{
			this.calcLinearData(this.mFrames[ this.mFrames.length-1], this.mEnd, p2, ref);
		}else if (frame < this.mFrames.length)
		{
			this.calcLinearData(this.mFrames[frame-1], this.mFrames[frame], p2, ref);
		}
	}
	return false;
}

AnimData.prototype.endAnimation = function(ref)
{
	if (this.mBackupSaved == true)
	{
		ref.copy(this.mSavedRef);
		ref.copyMat	(this.mSavedRef);
	}
	else
	{
		if (this.mEnd.mTranslateAnim == true)
		{
			ref.mPosition[0] = this.mEnd.mTranslate[0];
			ref.mPosition[1] = this.mEnd.mTranslate[1];
			ref.mPosition[2] = this.mEnd.mTranslate[2];
		}
		if (this.mEnd.mTranslate2Anim == true)
		{
			ref.mAreaPosition[0] = this.mEnd.mTranslate2[0];
			ref.mAreaPosition[1] = this.mEnd.mTranslate2[1];
			ref.mAreaPosition[2] = this.mEnd.mTranslate2[2];
		}
		
		if (this.mEnd.mRotate2Anim == true)
		{
			ref.mAreaRotation[0] = this.mEnd.mRotate2[0];
			ref.mAreaRotation[1] = this.mEnd.mRotate2[1];
			ref.mAreaRotation[2] = this.mEnd.mRotate2[2];
		}
		
		if (this.mEnd.mRotateAnim == true)
		{
			ref.mRotation[0] = this.mEnd.mRotate[0];
			ref.mRotation[1] = this.mEnd.mRotate[1];
			ref.mRotation[2] = this.mEnd.mRotate[2];
		}
		
		if (this.mEnd.mScaleAnim == true)
		{
			ref.mScale[0] = this.mEnd.mScale[0];
			ref.mScale[1] = this.mEnd.mScale[1];
			ref.mScale[2] = this.mEnd.mScale[2];
		}

	}
	
	ref.set();

	if (this.mOnEndHide == true)
	{
		ref.mEnabled = false;
	}
	
	this.mAnimDelay = 0;
	this.mRepeatDir = 0;
	this.mAnimRepeat = 1;		
	this.mCallback = "";
	this.mActiveFrames = 0;
	this.mBackupSaved = false;
	this.mOnEndHide = false;
	this.mApp.anims().decCount();
}

AnimData.prototype.calcLinearData = function(start, end, p, ref)
{
	// TODO directly change matrix
	if (start.mTranslateAnim == true)
	{
		ref.mPosition[0] = (end.mTranslate[0] - start.mTranslate[0]) * p + start.mTranslate[0];
		ref.mPosition[1] = (end.mTranslate[1] - start.mTranslate[1]) * p + start.mTranslate[1];
		ref.mPosition[2] = (end.mTranslate[2] - start.mTranslate[2]) * p + start.mTranslate[2];
	}
	if (start.mTranslate2Anim == true)
	{
		ref.mAreaPosition[0] = (end.mTranslate2[0] - start.mTranslate2[0]) * p + start.mTranslate2[0];
		ref.mAreaPosition[1] = (end.mTranslate2[1] - start.mTranslate2[1]) * p + start.mTranslate2[1];
		ref.mAreaPosition[2] = (end.mTranslate2[2] - start.mTranslate2[2]) * p + start.mTranslate2[2];
	}
	
	if (start.mRotate2Anim == true)
	{
		ref.mAreaRotation[0] = (end.mRotate2[0] - start.mRotate2[0]) * p + start.mRotate2[0];
		ref.mAreaRotation[1] = (end.mRotate2[1] - start.mRotate2[1]) * p + start.mRotate2[1];
		ref.mAreaRotation[2] = (end.mRotate2[2] - start.mRotate2[2]) * p + start.mRotate2[2];
	}
	
	if (start.mRotateAnim == true)
	{
		ref.mRotation[0] = (end.mRotate[0] - start.mRotate[0]) * p + start.mRotate[0];
		ref.mRotation[1] = (end.mRotate[1] - start.mRotate[1]) * p + start.mRotate[1];
		ref.mRotation[2] = (end.mRotate[2] - start.mRotate[2]) * p + start.mRotate[2];
	}
	
	if (start.mScaleAnim == true)
	{
		ref.mScale[0] = (end.mScale[0] - start.mScale[0]) * p + start.mScale[0];
		ref.mScale[1] = (end.mScale[1] - start.mScale[1]) * p + start.mScale[1];
		ref.mScale[2] = (end.mScale[2] - start.mScale[2]) * p + start.mScale[2];
	}
	
	//console.log( ref.mAreaRotation.toString() + " "+ end.mRotate2.toString() + " "+ start.mRotate2.toString() );
	ref.set();
}



// public members

function AnimData(id, app)
{
	this.mDifftime = 0;
	this.mAnimDelay = 1;
	this.mRepeatDir = 0;
	this.mAnimRepeat = 1;
	this.mActiveFrames = 0;
	this.mSavedRef = undefined;
	this.mBackupSaved = false;
	this.mOnEndHide = false;


	this.mCurrSourceRef = undefined;
	this.mCurrSourceCol = undefined;
	this.mCurrDestCol = undefined;	

	this.mSteps = 0;
	this.mTimeStep = 0;

	this.mColorPool = undefined;
	this.mRefCount=0;
	this.mActive = false;
	this.mId = 0;
	this.mMaxFrames = 16;
	this.mRepeat = 1;
	this.mToFinish = false;
	this.mType  = AnimData_Type.REF;

	this.mId = id;

	this.mApp = app;
	this.mPerctVal = 0;
	this.mPerctMin = 0;
	this.mPerctMax = 0;
	this.mPerctDiff = 0;
	this.mAreaOwner = undefined;	
	
}
AnimData.prototype.setDelay = function(delay, repeat)
{
	this.mAnimDelay += delay;
	if (repeat < 0)
	{
		this.mAnimRepeat = repeat  * -1 ;
		this.mRepeatDir = 1;
	}else
	{
		this.mAnimRepeat = repeat;
	}
	if (this.mAnimDelay != -1)
		this.mAnimDelay = this.mAnimDelay;

}

AnimData.prototype.saveBackup = function(backup, hide)
{
	if (this.mSavedRef == undefined)
		this.mSavedRef = new GameonModelRef(undefined);
	
	this.mSavedRef.copy(backup);
	this.mSavedRef.copyMat(backup);
	this.mBackupSaved = true;
	this.mOnEndHide = hide;
}

AnimData.prototype.isActive = function()
{
	return this.mActive;
}

AnimData.prototype.setActive = function(active)
{
	this.mActive = active;
}

AnimData.prototype.finish = function()
{
	this.mRepeat = 1;
	this.mToFinish = true;
}

AnimData.prototype.apply = function()
{
	if (this.mType == AnimData_Type.COLOR)
	{
	}
	this.mSteps  = this.mRefCount-1;//mDestRefVec.size -1;
	if (this.mSteps <= 0) {
		reset();
		return;
	}
	
	diff = this.mAnimDelay / this.mSteps;

	this.mTimeStep = diff;
	this.mActive = true;
	this.mDifftime = 0;	
}

AnimData.prototype.process = function(delta, copyref) {
	this.mDifftime += delta;
	if (this.mToFinish || this.mDifftime >= this.mAnimDelay) {
		this.mRepeat --;
		if (this.mRepeat <= 0) 
		{
			if (this.mType == AnimData_Type.COLOR)
			{
				this.setColorEnd(gl);
			}
			
			// remove anim
			//console.log("anim end");
			this.reset();
			return false;
		} else
		{
			this.mDifftime = 0;
		}
	}

	
	perct = this.setRef( this.mDifftime);
	if (this.mType == AnimData_Type.COLOR)
	{
		this.calcLinearColor(gl, this.mCurrSourceCol, this.mCurrDestCol, perct);
	}else 
	if (this.mType == AnimData_Type.SCROLLER)
	{
		this.calcLinearScroller(perct);
	}
	return true;
}

AnimData.prototype.addFrameColor = function(c) 
{
	if (this.mColorPool == undefined)
	{
		this.mColorPool= new Array();
		
		for (var a=0; a< this.mMaxFrames; a++) {
			this.mColorPool.push( new GLColor(0) );
		}			
	}
	
	if (this.mRefCount < this.mMaxFrames) {
		var col = this.mColorPool[this.mRefCount++];
		this.copyColor( c,  col );
	}
		//mDestRefVec.add(ref);
	this.mType  = AnimData_Type.COLOR;
}

AnimData.prototype.calcLinearScroller = function(perct)
{
	if (this.mAreaOwner != null)
	{
		var currval = this.mAreaOwner.mScrollers[0];
		var newval = currval + (this.mPerctVal - currval)*perct;
		
		if (newval < this.mPerctMin)
		{
			newval = this.mPerctMin;
		}else 
		if (newval > this.mPerctMax)
		{
			newval = this.mPerctMax;
		}

		this.mAreaOwner.setScrollerVal(newval);
	}
}


AnimData.prototype.cancelAnimation = function(ref)
{
	this.endAnimation(ref);
}

AnimData.prototype.addScrollerData = function(add, delay, min, max)
{
	this.mType = AnimData_Type.SCROLLER;
	this.mPerctDiff = -add;
	if (this.mPerctVal == -1)
	{
		this.mPerctVal = this.mAreaOwner.mScrollers[0];
	}else
	{
		this.mPerctVal -= add;
	}
	this.mDifftime = 0;
	this.mAnimDelay = delay;
	this.mPerctMin = min;
	this.mPerctMax = max;
	this.mSteps = 1 ;
	this.mActive = true;
	this.mTimeStep = delay;
}

AnimData.prototype.cancel = function() 
{
	this.reset();
}

