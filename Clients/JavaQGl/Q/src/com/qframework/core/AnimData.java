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

import java.util.StringTokenizer;
import java.util.Vector;
import javax.media.opengl.GL2;
import com.qframework.core.AnimFactory.AnimType;


public class AnimData {

	public class AnimFrame
	{
		float[] mScale;
		boolean mScaleAnim;
		float[] mRotate;
		boolean mRotateAnim;
		float[] mTranslate;
		boolean mTranslateAnim;

		float[] mRotate2;
		boolean mRotate2Anim;
		float[] mTranslate2;	
		boolean mTranslate2Anim;
	}

	
	public enum Type 
	{
		REF,
		COLOR,
		SCROLLER
	};
	
	private long mDifftime;
	private long mAnimDelay = 0;
	private int mRepeatDir = 0;
	private int mAnimRepeat = 1;
	private int	mActiveFrames = 0;
	private GameonModelRef mSavedRef;
	private boolean 	mBackupSaved = false;
	private boolean 	mOnEndHide = false;
	private GLColor					mCurrSourceCol;
	private GLColor					mCurrDestCol;
	private int 	mSteps = 0;
	private float mTimeStep = 0;
	private GLColor			mColorPool[];
	private int				mRefCount=0;
	private boolean			mActive = false;
	private int				mId;
	private int		mMaxFrames = 16;
	private int			mRepeat = 1;
	private boolean		mToFinish = false;
	private Type			mType  = Type.REF;	
	private GameonApp 	mApp;
	private String		mCallback;
	private AnimFrame mStart;
	private AnimFrame mEnd;
	private Vector<AnimFrame>	mFrames;
	float mPerctVal;
	float mPerctMin;
	float mPerctMax;
	float mPerctDiff;
	LayoutArea	mAreaOwner;
	
	private void reset(){
		
		mRefCount = 0;
		mSteps = 0;
		mTimeStep = 0;
		mActive = false;
		mRepeat = 1;
		mToFinish =false;
		mType  = Type.REF;
		mCallback = null;
		restore();
		mApp.anims().decCount();
		
		mPerctVal = -1;
		mPerctMin = 0;
		mPerctMax = 0;
		mPerctDiff = 0;
		if (mAreaOwner != null)
		{
			mAreaOwner.mScollerAnim = null;
			mAreaOwner = null; 
		}
	}

	private void restore()
	{
		if (mType == Type.COLOR)
		{
			setColorEnd(null);
		}
	}


	private void setColorStart(GL2 gl) {
		GLColor c = mColorPool[0];
		mApp.world().setAmbientLight(c.red/255.0f, c.green/255.0f, c.blue/255.0f, c.alpha /255.0f);

	}

	private void setColorEnd(GL2 gl) {
		GLColor c = mColorPool[mRefCount-1];
		mApp.world().setAmbientLight(c.red/255.0f, c.green/255.0f, c.blue/255.0f, c.alpha /255.0f);

	}
	
	private float setRef(long time) {
		// set current source and destination key frames
		long diff = time;
		if (diff == 0)diff = 1;
		float perct = (float)diff / (float)mAnimDelay;
		int frame = (int) ( perct * (float)mSteps);
		
		if (frame > mSteps -1) {
			frame = mSteps -1;
		}
		if(frame > mMaxFrames-1 || frame < 0) {
			//reset();
			System.out.println(" anim failed "  + frame);
			return 1.0f;
		}
		if (mType == Type.COLOR)
		{
			mCurrSourceCol = mColorPool[frame];
			mCurrDestCol = mColorPool[frame+1];
			
		}
		float rest = (diff - ((float)frame * (float)mTimeStep)) / (float)mTimeStep;
		return rest;
	}
	private void calcLinearColor(GL2 gl , GLColor sourceCol, GLColor destCol, float perct) {
		float rs = (float)sourceCol.red;
		float bs = (float)sourceCol.blue;
		float gs = (float)sourceCol.green;
		float as = (float)sourceCol.alpha;
		
		float rd = (float)destCol.red;
		float bd = (float)destCol.blue;
		float gd = (float)destCol.green;
		float ad = (float)destCol.alpha;

		float r = rs + (rd-rs) * perct;
		float g = gs + (gd-gs) * perct;
		float b = bs + (bd-bs) * perct;
		float a = as + (ad-as) * perct;
		
		
		mApp.world().setAmbientLight(r/255.0f, g/255.0f, b/255.0f, a /255.0f);		

	}
	private void copyColor(GLColor src, GLColor dst) {
		dst.alpha = src.alpha;
		dst.red = src.red;
		dst.blue = src.blue;
		dst.green = src.green;
		
	}

	private void storeArrays(AnimData.AnimFrame out, AnimFactory.AnimFrame in , GameonModelRef ref )
	{
		if (out.mTranslateAnim)
		{
			if (out.mTranslate == null)
				out.mTranslate = new float[3];
			out.mTranslate[0] = ref.mPosition[0];
			out.mTranslate[1] = ref.mPosition[1];
			out.mTranslate[2] = ref.mPosition[2];
		}
		
		if (out.mRotateAnim)
		{
			if (out.mRotate == null)
				out.mRotate = new float[3];
			out.mRotate[0] = ref.mRotation[0];
			out.mRotate[1] = ref.mRotation[1];
			out.mRotate[2] = ref.mRotation[2];
		}
		
		if (out.mScaleAnim)
		{
			if (out.mScale == null)
				out.mScale = new float[3];
			out.mScale[0] = ref.mScale[0];
			out.mScale[1] = ref.mScale[1];
			out.mScale[2] = ref.mScale[2];			
		}

		
		if (out.mTranslate2Anim)
		{
			if (out.mTranslate2 == null)
				out.mTranslate2 = new float[3];
			out.mTranslate2[0] = ref.mAreaPosition[0];
			out.mTranslate2[1] = ref.mAreaPosition[1];
			out.mTranslate2[2] = ref.mAreaPosition[2];
		}
		
		if (out.mRotate2Anim)
		{
			if (out.mRotate2 == null)
				out.mRotate2 = new float[3];
			out.mRotate2[0] = ref.mAreaRotation[0];
			out.mRotate2[1] = ref.mAreaRotation[1];
			out.mRotate2[2] = ref.mAreaRotation[2];
		}
		
	}

	private void storeArrays3(AnimData.AnimFrame out, AnimFactory.AnimFrame in , GameonModelRef start, GameonModelRef end, float p )
	{
		if (out.mTranslateAnim)
		{
			if (out.mTranslate == null)
				out.mTranslate = new float[3];
			out.mTranslate[0] = (end.mPosition[0] - start.mPosition[0]) * p + start.mPosition[0];
			out.mTranslate[1] = (end.mPosition[1] - start.mPosition[1]) * p + start.mPosition[1];
			out.mTranslate[2] = (end.mPosition[2] - start.mPosition[2]) * p + start.mPosition[2];
		}
		
		if (out.mRotateAnim)
		{
			if (out.mRotate == null)
				out.mRotate = new float[3];
			out.mRotate[0] = (end.mRotation[0] - start.mRotation[0]) * p + start.mRotation[0];
			out.mRotate[1] = (end.mRotation[1] - start.mRotation[1]) * p + start.mRotation[1];
			out.mRotate[2] = (end.mRotation[2] - start.mRotation[2]) * p + start.mRotation[2];
		}
		
		if (out.mScaleAnim)
		{
			if (out.mScale == null)
				out.mScale = new float[3];
			out.mScale[0] = (end.mScale[0] - start.mScale[0]) * p + start.mScale[0];
			out.mScale[1] = (end.mScale[1] - start.mScale[1]) * p + start.mScale[1];
			out.mScale[2] = (end.mScale[2] - start.mScale[2]) * p + start.mScale[2];			
		}
		
		if (out.mTranslate2Anim)
		{
			if (out.mTranslate2 == null)
				out.mTranslate2 = new float[3];
			out.mTranslate2[0] = (end.mAreaPosition[0] - start.mAreaPosition[0]) * p + start.mAreaPosition[0];
			out.mTranslate2[1] = (end.mAreaPosition[1] - start.mAreaPosition[1]) * p + start.mAreaPosition[1];
			out.mTranslate2[2] = (end.mAreaPosition[2] - start.mAreaPosition[2]) * p + start.mAreaPosition[2];
		}
		
		if (out.mRotate2Anim)
		{
			if (out.mRotate2 == null)
				out.mRotate2 = new float[3];
			out.mRotate2[0] = (end.mAreaRotation[0] - start.mAreaRotation[0]) * p + start.mAreaRotation[0];
			out.mRotate2[1] = (end.mAreaRotation[1] - start.mAreaRotation[1]) * p + start.mAreaRotation[1];
			out.mRotate2[2] = (end.mAreaRotation[2] - start.mAreaRotation[2]) * p + start.mAreaRotation[2];
		}
		
	}
	
	private void storeArrays2(AnimData.AnimFrame out, AnimFactory.AnimFrame in , float[] values, int countmax)
	{
		int count = 0;
		if (out.mTranslateAnim)
		{
			if (out.mTranslate == null)
				out.mTranslate = new float[3];
			out.mTranslate[0] = values[count++];
			out.mTranslate[1] = values[count++];
			out.mTranslate[2] = values[count++];
		}
	
		if (out.mRotateAnim)
		{
			if (out.mRotate == null)
				out.mRotate = new float[3];
			out.mRotate[0] = values[count++];
			out.mRotate[1] = values[count++];
			out.mRotate[2] = values[count++];
		}
		
		if (out.mScaleAnim)
		{
			if (out.mScale == null)
				out.mScale = new float[3];
			out.mScale[0] = values[count++];
			out.mScale[1] = values[count++];
			out.mScale[2] = values[count++];			
		}

		
		if (out.mTranslate2Anim)
		{
			if (out.mTranslate2 == null)
				out.mTranslate2 = new float[3];
			out.mTranslate2[0] = values[count++];
			out.mTranslate2[1] = values[count++];
			out.mTranslate2[2] = values[count++];
		}
		
		if (out.mRotate2Anim)
		{
			if (out.mRotate2 == null)
				out.mRotate2 = new float[3];
			out.mRotate2[0] = values[count++];
			out.mRotate2[1] = values[count++];
			out.mRotate2[2] = values[count++];
		}
		
	}

	
	private void addArrays(AnimData.AnimFrame out, AnimFactory.AnimFrame in , GameonModelRef ref )
	{
		if (out.mTranslateAnim)
		{
			if (out.mTranslate == null)
				out.mTranslate = new float[3];
			out.mTranslate[0] += ref.mPosition[0];
			out.mTranslate[1] += ref.mPosition[1];
			out.mTranslate[2] += ref.mPosition[2];
		}

		
		if (out.mRotateAnim)
		{
			if (out.mRotate == null)
				out.mRotate = new float[3];
			out.mRotate[0] += ref.mRotation[0];
			out.mRotate[1] += ref.mRotation[1];
			out.mRotate[2] += ref.mRotation[2];
		}
		
		if (out.mScaleAnim)
		{
			if (out.mScale == null)
				out.mScale = new float[3];
			out.mScale[0] *= ref.mScale[0];
			out.mScale[1] *= ref.mScale[1];
			out.mScale[2] *= ref.mScale[2];			
		}

		
		if (out.mTranslate2Anim)
		{
			if (out.mTranslate2 == null)
				out.mTranslate2 = new float[3];
			out.mTranslate2[0] += ref.mAreaPosition[0];
			out.mTranslate2[1] += ref.mAreaPosition[1];
			out.mTranslate2[2] += ref.mAreaPosition[2];
		}

		
		if (out.mRotate2Anim)
		{
			if (out.mRotate2 == null)
				out.mRotate2 = new float[3];
			out.mRotate2[0] += ref.mAreaRotation[0];
			out.mRotate2[1] += ref.mAreaRotation[1];
			out.mRotate2[2] += ref.mAreaRotation[2];
		}

		
	}
	
	
	private void perctArrays(AnimData.AnimFrame out, AnimFactory.AnimFrame in , 
			GameonModelRef ref0 , GameonModelRef ref , float p)
	{
		float dist = GMath.dist(ref0,ref);
		
		if (out.mTranslateAnim && in.translateActive)
		{
			if (out.mTranslate == null)
				out.mTranslate = new float[3];
			out.mTranslate[0] += in.translate[0] * dist ;
			out.mTranslate[1] += in.translate[1] *dist ;
			out.mTranslate[2] += in.translate[2] *dist ;
		}

		
		if (out.mRotateAnim && in.rotateActive)
		{
			if (out.mRotate == null)
				out.mRotate = new float[3];
			out.mRotate[0] += in.rotate[0] *dist;
			out.mRotate[1] += in.rotate[1] *dist;
			out.mRotate[2] += in.rotate[2] *dist;
		}
		
		if (out.mScaleAnim && in.scaleActive)
		{
			if (out.mScale == null)
				out.mScale = new float[3];
			out.mScale[0] *= in.scale[0] * dist;
			out.mScale[1] *= in.scale[1] * dist;
			out.mScale[2] *= in.scale[2] * dist;			
		}

		
		if (out.mTranslate2Anim && in.translate2Active)
		{
			if (out.mTranslate2 == null)
				out.mTranslate2 = new float[3];
			out.mTranslate2[0] += in.translate2[0] * dist;
			out.mTranslate2[1] += in.translate2[1] * dist;
			out.mTranslate2[2] += in.translate2[2] * dist;
		}

		
		if (out.mRotate2Anim && in.rotate2Active)
		{
			if (out.mRotate2 == null)
				out.mRotate2 = new float[3];
			out.mRotate2[0] += in.rotate2[0] * dist;
			out.mRotate2[1] += in.rotate2[1] * dist;
			out.mRotate2[2] += in.rotate2[2] * dist;
		}
		
	}
	
	private void clearArrays(AnimData.AnimFrame out, AnimFactory.AnimFrame in )
	{
		if (out.mTranslateAnim)
		{
			if (out.mTranslate == null)
				out.mTranslate = new float[3];
			out.mTranslate[0] = 0;
			out.mTranslate[1] = 0;
			out.mTranslate[2] = 0;
		}
		
		if (out.mRotateAnim)
		{
			if (out.mRotate == null)
				out.mRotate = new float[3];
			out.mRotate[0] = 0;
			out.mRotate[1] = 0;
			out.mRotate[2] = 0;
		}
		
		if (out.mScaleAnim)
		{
			if (out.mScale == null)
				out.mScale = new float[3];
			out.mScale[0] = 1;
			out.mScale[1] = 1;
			out.mScale[2] = 1;			
		}
		
		if (out.mTranslate2Anim)
		{
			if (out.mTranslate2 == null)
				out.mTranslate2 = new float[3];
			out.mTranslate2[0] = 0;
			out.mTranslate2[1] = 0;
			out.mTranslate2[2] = 0;
		}
		
		if (out.mRotate2Anim)
		{
			if (out.mRotate2 == null)
				out.mRotate2 = new float[3];
			out.mRotate2[0] = 0;
			out.mRotate2[1] = 0;
			out.mRotate2[2] = 0;
		}
		
	}

	
	private void fillFrameEnd(AnimFrame frame, AnimType atype, float[] values,int count , GameonModelRef ref)
	{
		AnimFactory.AnimFrame def = atype.frames.lastElement();
		storeArrays2(mEnd, def, values, count);
		if (def.operation  != null)
		{
			if (def.operation.equals("add"))
			{
				addArrays(mEnd, def , ref);
			}
		}		
		
	}

	private void fillFrameEnd2(AnimFrame frame, AnimType atype, GameonModelRef ref)
	{
		AnimFactory.AnimFrame def = atype.frames.lastElement();
		clearArrays(mEnd, def );
		addArrays(mEnd, def , ref);
		
	}
	
	private void fillFrameStart(AnimFrame frame, AnimType atype, GameonModelRef ref)
	{
		AnimFactory.AnimFrame def = atype.frames.get(0);
		storeArrays(mStart, def , ref);		
	}
	

	private void maskFrames2(AnimFrame frame, AnimFactory.AnimFrame inframe) {
		if (inframe.rotate2Active)
		{
			frame.mRotate2Anim = true;
		}else
		{
			frame.mRotate2Anim = false;
		}
		
		if (inframe.rotateActive)
		{
			frame.mRotateAnim = true;
		}else
		{
			frame.mRotateAnim = false;
		}		
		if (inframe.scaleActive)
		{
			frame.mScaleAnim = true;
		}else
		{
			frame.mScaleAnim = false;
		}
		
		if (inframe.translate2Active)
		{
			frame.mTranslate2Anim = true;
		}else
		{
			frame.mTranslate2Anim = false;
		}
		
		if (inframe.translateActive)
		{
			frame.mTranslateAnim = true;
		}else
		{
			frame.mTranslateAnim = false;
		}		
	}
	
	private void maskFrames(AnimFrame startFrame, AnimFrame endFrame,
			GameonModelRef start, GameonModelRef end) {
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
	
	private void maskFrame(AnimFrame frame, 
			GameonModelRef start, GameonModelRef end) {
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

	
	private void fillFrames(AnimType atype, GameonModelRef start,
			GameonModelRef end) {
		
		float div = 1.0f/(atype.frames.size()-1);
		float p = div;
		for (int a=1; a< atype.frames.size()-1; a++)
		{
			int id = a-1;
			AnimFrame frameout = null;
			if (mFrames == null)
				mFrames = new Vector<AnimFrame>();
			if (id < mFrames.size())
			{
				frameout = mFrames.get(id);
			}else
			{
				frameout = new AnimFrame();
				mFrames.add(frameout);
			}
			AnimFactory.AnimFrame framein = atype.frames.get(a);
			clearArrays(frameout, framein );
			maskFrame(frameout,start,end);			
			if (framein.operation.equals("add"))
			{
				storeArrays3(frameout, framein , start,end , p);
				addArrays(frameout, framein , end);

			}else if (framein.operation.equals("pdist"))
			{
				storeArrays3(frameout, framein , start,end , p);
				perctArrays(frameout, framein , start,end , p);
			}else
			{
				storeArrays(frameout, framein , end);
			}
			p += div;
			mActiveFrames++;
		}
	}
	
	private void endAnimation(GameonModelRef ref)
	{
		if (mBackupSaved)
		{
			ref.copy(mSavedRef);
			ref.copyMat(mSavedRef);
		}
		else
		{
			if (mEnd.mTranslateAnim)
			{
				ref.mPosition[0] = mEnd.mTranslate[0];
				ref.mPosition[1] = mEnd.mTranslate[1];
				ref.mPosition[2] = mEnd.mTranslate[2];
			}
			if (mEnd.mTranslate2Anim)
			{
				ref.mAreaPosition[0] = mEnd.mTranslate2[0];
				ref.mAreaPosition[1] = mEnd.mTranslate2[1];
				ref.mAreaPosition[2] = mEnd.mTranslate2[2];
			}
			
			if (mEnd.mRotate2Anim)
			{
				ref.mAreaRotation[0] = mEnd.mRotate2[0];
				ref.mAreaRotation[1] = mEnd.mRotate2[1];
				ref.mAreaRotation[2] = mEnd.mRotate2[2];
			}
			
			if (mEnd.mRotateAnim)
			{
				ref.mRotation[0] = mEnd.mRotate[0];
				ref.mRotation[1] = mEnd.mRotate[1];
				ref.mRotation[2] = mEnd.mRotate[2];
			}
			
			if (mEnd.mScaleAnim)
			{
				ref.mScale[0] = mEnd.mScale[0];
				ref.mScale[1] = mEnd.mScale[1];
				ref.mScale[2] = mEnd.mScale[2];
			}
	
		}
		
		ref.set();

		if (mOnEndHide)
		{
			ref.mEnabled = false;
		}
		
		mAnimDelay = 0;
		mRepeatDir = 0;
		mAnimRepeat = 1;		
		mCallback = "";
		mActiveFrames = 0;
		mBackupSaved = false;
		mOnEndHide = false;
		mApp.anims().decCount();
	}
	
	private void calcLinearData(AnimFrame start, AnimFrame end, float p, GameonModelRef ref)
	{
		// TODO directly change matrix
		if (start.mTranslateAnim)
		{
			ref.mPosition[0] = (end.mTranslate[0] - start.mTranslate[0]) * p + start.mTranslate[0];
			ref.mPosition[1] = (end.mTranslate[1] - start.mTranslate[1]) * p + start.mTranslate[1];
			ref.mPosition[2] = (end.mTranslate[2] - start.mTranslate[2]) * p + start.mTranslate[2];
		}
		if (start.mTranslate2Anim)
		{
			ref.mAreaPosition[0] = (end.mTranslate2[0] - start.mTranslate2[0]) * p + start.mTranslate2[0];
			ref.mAreaPosition[1] = (end.mTranslate2[1] - start.mTranslate2[1]) * p + start.mTranslate2[1];
			ref.mAreaPosition[2] = (end.mTranslate2[2] - start.mTranslate2[2]) * p + start.mTranslate2[2];
		}
		
		if (start.mRotate2Anim)
		{
			ref.mAreaRotation[0] = (end.mRotate2[0] - start.mRotate2[0]) * p + start.mRotate2[0];
			ref.mAreaRotation[1] = (end.mRotate2[1] - start.mRotate2[1]) * p + start.mRotate2[1];
			ref.mAreaRotation[2] = (end.mRotate2[2] - start.mRotate2[2]) * p + start.mRotate2[2];
		}
		
		if (start.mRotateAnim)
		{
			ref.mRotation[0] = (end.mRotate[0] - start.mRotate[0]) * p + start.mRotate[0];
			ref.mRotation[1] = (end.mRotate[1] - start.mRotate[1]) * p + start.mRotate[1];
			ref.mRotation[2] = (end.mRotate[2] - start.mRotate[2]) * p + start.mRotate[2];
		}
		
		if (start.mScaleAnim)
		{
			ref.mScale[0] = (end.mScale[0] - start.mScale[0]) * p + start.mScale[0];
			ref.mScale[1] = (end.mScale[1] - start.mScale[1]) * p + start.mScale[1];
			ref.mScale[2] = (end.mScale[2] - start.mScale[2]) * p + start.mScale[2];
		}

		ref.set();
	}
	
	
	
// public access members

	public AnimData(int id , GameonApp 	app)
	{
		mApp = app;
		mId = id;
	}

	public void setDelay(int delay, int repeat)
	{
		mAnimDelay += delay;
		if (repeat < 0)
		{
			mAnimRepeat = repeat  * -1 ;
			mRepeatDir = 1;
		}else
		{
			mAnimRepeat = repeat;
		}

	}
	
	public void saveBackup(GameonModelRef backup, boolean hide)
	{
		if (mSavedRef == null)
			mSavedRef = new GameonModelRef(null);
		
		mSavedRef.copy(backup);
		mSavedRef.copyMat(backup);
		mBackupSaved = true;
		mOnEndHide = hide;
	}
	public boolean isActive() {
		return mActive;
	}
	
	public void setActive(boolean active) {
		mActive = active;
	}

	public void finish()
	{
		mRepeat = 1;
		mToFinish = true;
	}
	
	public void apply()
	{

		if (mType == Type.COLOR)
		{
			
		}
		mSteps  = mRefCount-1;//mDestRefVec.size() -1;
		if (mSteps <= 0) {
			return;
		}
		
		float diff = (float)(mAnimDelay) / (float)mSteps;
		mTimeStep = diff;
		mActive = true;
		mDifftime = 0;
	}

	public boolean process(GL2 gl, long diff, boolean copyref) {
		//System.out.println( " process color " + diff);

		mDifftime += diff;
		if (mToFinish || mDifftime >= mAnimDelay) {
			//System.out.println( " process color finish ");
			mRepeat --;
			if (mRepeat <= 0) 
			{
				if (mType == Type.COLOR)
				{
					setColorEnd(gl);
				}
				// remove anim
				if (mCallback != null && mCallback.length() > 0)
				{
					mApp.execScript(mCallback);
				}
				
				reset();
				return false;
			} else
			{
				mDifftime = 0;
			}
		}
		
		float perct = setRef( mDifftime);
		if (mType == Type.COLOR)
		{
			calcLinearColor(gl, mCurrSourceCol, mCurrDestCol, perct);
		}else 
		if (mType == Type.SCROLLER)
		{
			calcLinearScroller(perct);
		}
		return true;
	}

	public void addFrameColor(GLColor c) {
		if (mColorPool == null)
		{
			mColorPool= new GLColor[mMaxFrames];
			for (int a=0; a< mColorPool.length; a++) {
				mColorPool[a] = new GLColor(0);
			}			
		}
		if (mRefCount < mMaxFrames) {
			GLColor col = mColorPool[mRefCount++];
			copyColor( c,  col );
		}
		mType = Type.COLOR;
	}

	public void setCallback(String callback) {
		mCallback = callback;
	}
	public void setAnimTime(String type) {
		// time , type
		StringTokenizer tok = new StringTokenizer(type, ",");
		long delay = Integer.parseInt( tok.nextToken() );
		
		mAnimDelay += delay;
		mDifftime = 0;
	}

	public void setup(AnimType atype, float[] values, int count, GameonModelRef ref) {
		// start to end
		// setup start
		if (mStart == null)
			mStart = new AnimFrame();
		if (mEnd == null)
			mEnd = new AnimFrame();

		
		maskFrames2(mStart,atype.frames.get(0));
		maskFrames2(mEnd,atype.frames.lastElement());
		clearArrays(mStart,atype.frames.get(0) );
		clearArrays(mEnd,atype.frames.lastElement() );
		fillFrameStart(mStart, atype,ref);
		fillFrameEnd(mEnd, atype,values,count , ref);
	}
	
	public void setup2(AnimType atype, GameonModelRef start, GameonModelRef end) {
		// start to end
		// setup start
		if (mStart == null)
			mStart = new AnimFrame();
		if (mEnd == null)
			mEnd = new AnimFrame();

		
		if (atype.frames.size() == 1)
		{
			addFrame(atype.frames.get(0),end);
		}
		maskFrames(mStart,mEnd,start,end);
		maskFrame(mStart,start,end);
		fillFrameStart(mStart, atype,start);
		fillFrameEnd2(mEnd, atype,end	);
		
		
		if (atype.frames.size() > 2)
		{
			fillFrames(atype,start,end);
		}
	}


	private void addFrame(AnimFactory.AnimFrame animFrame,
			GameonModelRef ref) {
		
		if (animFrame.rotateActive && animFrame.rotate != null)
		{
			ref.mRotation[0] += animFrame.rotate[0];
			ref.mRotation[1] += animFrame.rotate[1];
			ref.mRotation[2] += animFrame.rotate[2];
		}
		
		if (animFrame.rotate2Active && animFrame.rotate2 != null)
		{
			ref.mAreaRotation[0] += animFrame.rotate2[0];
			ref.mAreaRotation[1] += animFrame.rotate2[1];
			ref.mAreaRotation[2] += animFrame.rotate2[2];
		}
		
		if (animFrame.translate2Active && animFrame.translate2 != null)
		{
			ref.mAreaPosition[0] += animFrame.translate2[0];
			ref.mAreaPosition[1] += animFrame.translate2[1];
			ref.mAreaPosition[2] += animFrame.translate2[2];
		}		
		
		if (animFrame.translateActive && animFrame.translate != null)
		{
			ref.mPosition[0] += animFrame.translate[0];
			ref.mPosition[1] += animFrame.translate[1];
			ref.mPosition[2] += animFrame.translate[2];
		}		

		if (animFrame.scaleActive && animFrame.scale != null)
		{
			ref.mScale[0] += animFrame.scale[0];
			ref.mScale[1] += animFrame.scale[1];
			ref.mScale[2] += animFrame.scale[2];
		}		

		
	}

	public void activate() {
		mDifftime = 0;
		mApp.anims().incCount();	
		
	}

	public boolean process2(GameonModelRef ref, long delta)
	{
		mDifftime += delta;
		if (mDifftime >= mAnimDelay)
		{
			mAnimRepeat --;
			if (mAnimRepeat > 0)
			{
				mDifftime = 0;
				
				if (mRepeatDir == 1)
				{
					// which direction?
					AnimFrame tmp = mStart;
					mStart = mEnd;
					mEnd = tmp;
					mRepeatDir = -1;
				}else if (mRepeatDir == -1)
				{
					AnimFrame tmp = mStart;
					mStart = mEnd;
					mEnd = tmp;
					mRepeatDir = 1;					
				}
				
				return false;
			}
			
			mDifftime = 0;
			endAnimation(ref);

			if (mCallback != null && mCallback.length() > 0)
			{
				mApp.execScript(mCallback);
			}
			return true;
		}
		// process animation
		float p = (float)mDifftime / (float)mAnimDelay;
		if (mActiveFrames == 0)
		{
			calcLinearData(mStart, mEnd, p, ref);
		}
		else
		{
			// get frames! - get new p for frame!
			int steps = mActiveFrames + 1; // for start and end
			int frame = (int)Math.floor( (double)p * steps);
			float timeStep = (float)(mAnimDelay) / (float)steps;
			float p2 = (mDifftime - ((float)frame * (float)timeStep)) / (float)timeStep;
			if (frame == 0)
			{
				calcLinearData(mStart, mFrames.get(0), p2, ref);
			}else if(frame >= steps-1) 
			{
				calcLinearData(mFrames.lastElement(), mEnd, p2, ref);
			}else if (frame < mFrames.size())
			{
				calcLinearData(mFrames.get(frame-1), mFrames.get(frame), p2, ref);
			}
		}
		return false;
	}

	protected void calcLinearScroller(float perct)
	{
		if (mAreaOwner != null)
		{
			float currval = mAreaOwner.mScrollers[0];
			float newval = currval + (mPerctVal - currval)*perct;
			if (newval < mPerctMin)
			{
				newval = mPerctMin;
			}else 
			if (newval > mPerctMax)
			{
				newval = mPerctMax;
			}
			//System.out.println(" scrollval " + newval);
			mAreaOwner.setScrollerVal(newval);
		}
	}
	
	public void cancelAnimation(GameonModelRef ref)
	{
		this.endAnimation(ref);
	}
	
	public void addScrollerData(float add, int delay, float min, float max)
	{
		mType = AnimData.Type.SCROLLER;
		mPerctDiff = -add;
		if (mPerctVal == -1)
		{
			mPerctVal = mAreaOwner.mScrollers[0];
		}else
		{
			mPerctVal -= add;
		}
		mDifftime = 0;
		mAnimDelay = delay;
		mPerctMin = min;
		mPerctMax = max;
		mSteps = 1 ;
		mActive = true;
		mTimeStep = mAnimDelay; 
	}

	public void cancel() 
	{
		this.reset();
		
	}
}

