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
import java.util.Vector;

import javax.media.opengl.GL2;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.qframework.core.AnimData.Type;

public class AnimFactory {

	class AnimFrame
	{
		float[] rotate;
		float[] scale;
		float[] translate;

		float[] rotate2;
		float[] scale2;
		float[] translate2;

		boolean rotateActive = false;
		boolean rotate2Active = false;
		boolean scaleActive = false;
		boolean scale2Active = false;
		
		boolean translateActive = false;
		boolean translate2Active = false;
		
		String operation;
	}
	class AnimType
	{
		String id;
		Vector<AnimFrame> frames;
		int	repeat;
		int delay;
	}
	
	private HashMap<String, AnimType>	mAnimations = new HashMap<String, AnimType>();
	
	private AnimData mAnimPool[];
	private AnimData mFallback; 
	private int mCount = 0;
	private GameonApp mApp;
	

    private void buildObjectAdata(GameonModelRef ref, AnimType atype, int delay, int repeat, String data, String callback)
    {
    	AnimData adata = ref.getAnimData(mApp);
    	// fill anim data!
    	
    	// for object destination is stored in data
    	float[] values = new float[32];
    	int count = ServerkoParse.parseFloatArray(values, data);
    	adata.setDelay(delay, repeat);    	
    	adata.setup(atype,values,count,ref);

    	adata.setCallback(callback);
    	ref.activateAnim();
    	
    	
    }
	
    private void processAnimFrame(GL2 gl, JSONObject objData , AnimFrame frame) {
    	int count = 0;
    	try {
			
			if (objData.has("rotate"))
			{
				String data = objData.getString("rotate");
				frame.rotate = new float[3];
				count = ServerkoParse.parseFloatArray(frame.rotate, data);
				frame.rotateActive = count > 0;
			}
			if (objData.has("scale"))
			{
				String data = objData.getString("scale");
				frame.scale= new float[3];
				count = ServerkoParse.parseFloatArray(frame.scale, data);
				frame.scaleActive = count > 0;
			}
			if (objData.has("translate"))
			{
				String data = objData.getString("translate");
				frame.translate= new float[3];
				count = ServerkoParse.parseFloatArray(frame.translate, data);
				frame.translateActive = count > 0;
			}
			
			if (objData.has("rotate2"))
			{
				String data = objData.getString("rotate2");
				frame.rotate2 = new float[3];
				count = ServerkoParse.parseFloatArray(frame.rotate2, data);
				frame.rotate2Active = count > 0;
			}

			if (objData.has("translate2"))
			{
				String data = objData.getString("translate2");
				frame.translate2= new float[3];
				count = ServerkoParse.parseFloatArray(frame.translate2, data);
				frame.translate2Active = count > 0;
			}
			
			if (objData.has("operation"))
			{
				String data = objData.getString("operation");
				frame.operation = data;
			}			
			
    	}
    	catch (JSONException e) {
    		e.printStackTrace();
        }    	
    }

	
//public members	
	public AnimFactory(GameonApp app)
	{
		mApp = app;
		mAnimPool = new AnimData[16];
		// we are using this only for ambient light, anim - will be removed
		for (int a=0; a< mAnimPool.length; a++ ) {
			mAnimPool[a] = new AnimData(a, mApp);
		}
		
		mFallback = new AnimData(255 , mApp);
		mCount = 0;
	}
	
	public AnimData get() {
		for (int a=0; a< mAnimPool.length; a++) {
			if (mAnimPool[a].isActive() == false) {
				mAnimPool[a].setActive(true);
				mCount ++;
				return mAnimPool[a];
			}
		}
		return mFallback;
	}
	
	public void process(GL2 gl, long framedelta)
	{
		//System.out.println( "anim delta " + framedelta);
		int len = mAnimPool.length;
		for (int a=0; a< len; a++) 
		{
			AnimData adata = mAnimPool[a];
			if (adata.isActive() && adata.process(gl , framedelta , true) == false)
			{
					//mCount--;
					//Log.d("model", "anim cnt = " + mCount);
			}
		}
	}


	public void createAnimColor(int delay, GLColor color1,
			GLColor color2, GLColor color3) {
		AnimData adata = get();
		
		adata.setDelay(delay , 1);
		adata.addFrameColor( color1);
		adata.addFrameColor( color2);
		if (color3 != null)
			adata.addFrameColor( color3);
		adata.apply();
	}

	////
	public void move(String name, String location, String data, String callback)
	{
		animObject("move", name, location, data, callback);
	}
	public void rotate(String name, String angles,String data, String callback)
	{
		animObject("rotate", name, angles, data, callback);
	}	

	public void initAnimation(GL2 gl, JSONObject response)
    {
        // init layout
		try {
			
	    	JSONArray frames;
			frames = response.getJSONArray("frames");
			AnimType atype = new AnimType();
			atype.frames = new Vector<AnimFrame>();
			
			if (response.has("id"))
			{
				atype.id = response.getString("id");
			}			
			if (response.has("delay"))
			{
				atype.delay= Integer.parseInt( response.getString("delay") );
			}
			if (response.has("repeat"))
			{
				atype.repeat= Integer.parseInt( response.getString("repeat") );
			}
			
	        for (int a=0; a< frames.length(); a++)
	        {
	            JSONObject pCurr = frames.getJSONObject(a);
	            AnimFrame frame = new AnimFrame();
	            processAnimFrame(gl, pCurr , frame);
	            atype.frames.add(frame);
	        }
	        mAnimations.put(atype.id, atype);
		} catch (JSONException e) {
			e.printStackTrace();
        }

	}

    public void animObject(String animid,String objectid,String data, String delaydata,String callback)
    {
    	// find AnimType
    	if (mAnimations.containsKey(animid) == false)
    	{
    		return;
    	}
    	LayoutItem item = mApp.objects().get(objectid);
    	GameonModelRef ref = item.mModelRef;
    	/*
    	if (ref.animating())
    	{
    		return;
    	}*/
    	
    	int[] intdata = new int[2];
    	int count = ServerkoParse.parseIntArray(intdata, delaydata);
    	
    	AnimType atype = mAnimations.get(animid);
    	
    	// find ref

    	// generate AnimData from AnimType
    	// configure AnimData with ref!
    	int repeat = atype.repeat;
    	int delay = atype.delay;
    	if (count >= 1)
    		delay = intdata[0];    	
    	if (count == 2)
    		repeat = intdata[1];
    	buildObjectAdata(ref, atype, delay, repeat , data , callback);
    }
    
    
    public void animRef(String animid, GameonModelRef start, GameonModelRef end,String delaydata)
    {
    	if (mAnimations.containsKey(animid) == false)
    	{
    		return;
    	}
    	/*
    	if (end.animating())
    	{
    		return;
    	}*/
    	
    	int[] intdata = new int[2];
    	AnimType atype = mAnimations.get(animid);
    	AnimData adata = end.getAnimData(mApp);
    	int repeat = atype.repeat;
    	int delay = atype.delay;
    	int count = ServerkoParse.parseIntArray(intdata, delaydata);
    	if (count >= 1)
    		delay = intdata[0];    	
    	if (count == 2)
    		repeat = intdata[1];
    	adata.setDelay(delay, repeat);
    	adata.setup2(atype,start,end);
    	end.activateAnim();
    }
    
	public void createAnim(GameonModelRef start,
			GameonModelRef end, GameonModelRef def, 
			int delay , int steps, LayoutItem owner, 
			int repeat, boolean hide) {
/*
    	if (def.animating())
    	{
    		return;
    	}	*/	
		AnimData adata = def.getAnimData(mApp);
		AnimType atype = mAnimations.get("transform");
		adata.setDelay(delay, repeat);
		adata.setup2(atype,start,end);
		adata.saveBackup(def , hide);
		def.activateAnim();
		
	}

	public void incCount() {
		mCount ++;
	}

	
	public void decCount() {
		mCount --;
	}

	public int getCount() {
		return mCount;
	}


	public AnimData getScollerAnim(LayoutArea owner)
	{
		AnimData adata = null;
		for (int a=0; a< mAnimPool.length; a++) 
		{
			AnimData data = mAnimPool[a]; 
			if (data.isActive() == false) 
			{
				if (data.mAreaOwner != null && data.mAreaOwner == owner)
				{
					adata = data;
					break;
				}
				if (adata == null)
				{
					adata = data;
				}
			}
		}
		return adata;
	}
	
	 public void animModelRef(String animid,GameonModelRef ref, String delaydata , String data)
	    {
	    	// find AnimType
	    	if (mAnimations.containsKey(animid) == false)
	    	{
	    		return;
	    	}
	    	
	    	int[] intdata = new int[2];
	    	int count = ServerkoParse.parseIntArray(intdata, delaydata);
	    	
	    	AnimType atype = mAnimations.get(animid);
	    	
	    	// find ref

	    	// generate AnimData from AnimType
	    	// configure AnimData with ref!
	    	int repeat = atype.repeat;
	    	int delay = atype.delay;
	    	if (count >= 1)
	    		delay = intdata[0];    	
	    	if (count == 2)
	    		repeat = intdata[1];
	    	buildObjectAdata(ref, atype, delay, repeat , data , null);
	    }	
}
