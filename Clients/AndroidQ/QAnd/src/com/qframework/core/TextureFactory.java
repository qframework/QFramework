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

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Vector;

import javax.microedition.khronos.opengles.GL10;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.opengl.GLUtils;
import android.util.Log;

public class TextureFactory {

	public enum Type {
		DEFAULT,
		FONT,
	}

	public float mU1;
	public float mV1;
	public float mU2;
	public float mV2;
	public float mCp;

	public int mTextureDefault;
	public int mTextureFont;
	HashMap<String, Integer>	mTextures = new HashMap<String, Integer>();
	Vector<Integer>  mTextureIds = new Vector<Integer>();
	Vector < StringString > mInfos = new Vector <StringString>();
        Vector<String>	mToDelete = new Vector<String>();
	Context mContext;
	int mTextCounter = 1;
	boolean mUpdated = false;
	GameonApp mApp;
	public TextureFactory(GameonApp app)
	{
		mApp = app;
	}
	
	private int loadTextureFromFile(GL10 gl , String filename, Context context, boolean system)
	{
        int[] textures = new int[1];
        gl.glGenTextures(1, textures, 0);
        String text = " texture " + filename + " "  + mTextCounter + " " + textures[0];
        //Log.d("model", text);
        int textureid = mTextCounter ; //textures[0];
        mTextCounter++;
        //int textureid = textures[0];
        gl.glBindTexture(GL10.GL_TEXTURE_2D, textureid);
        gl.glTexParameterf(GL10.GL_TEXTURE_2D, GL10.GL_TEXTURE_MIN_FILTER, GL10.GL_LINEAR);
        gl.glTexParameterf(GL10.GL_TEXTURE_2D, GL10.GL_TEXTURE_MAG_FILTER, GL10.GL_LINEAR);
        gl.glTexParameterf(GL10.GL_TEXTURE_2D, GL10.GL_TEXTURE_WRAP_S, GL10.GL_CLAMP_TO_EDGE);
        gl.glTexParameterf(GL10.GL_TEXTURE_2D, GL10.GL_TEXTURE_WRAP_T, GL10.GL_CLAMP_TO_EDGE);
        mUpdated = true;
        gl.glTexEnvf(GL10.GL_TEXTURE_ENV, GL10.GL_TEXTURE_ENV_MODE,GL10.GL_MODULATE);
        AssetManager assets = context.getAssets();
	    
	    InputStream is = null;
		try {
			if (system)
			{
				is = assets.open( "qres/" + filename );				
			}else
			{
				is = assets.open( "res/" + filename );
			}
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			return -1;
		}        
        Bitmap bitmap;
        try {
            bitmap = BitmapFactory.decodeStream(is);
        } finally {
            try {
                is.close();
            } catch(IOException e) {
                // Ignore.
            }
        }
        
        GLUtils.texImage2D(GL10.GL_TEXTURE_2D, 0, bitmap, 0);
        
        return textureid;

	}

	public void init(GL10 gl, Context context) {

		mContext = context;
		mTextCounter  = 1;
		mTextures.clear();
		mTextureDefault = loadTextureFromFile( gl, "whitesys.png" , mContext , true);
		if (mApp.cs().getCanvasW() < 500)
		{
			mTextureFont = loadTextureFromFile( gl, "fontsyss.png" , mContext , true);
		}
		else
		{
			mTextureFont = loadTextureFromFile( gl, "fontsys.png" , mContext, true);
		}
		for (int a=0; a< mInfos.size(); a++)
		{
			StringString e = mInfos.get(a);
			newTexture(gl,e.b, e.a , false);
		}

        //loadAssetsTextures(gl);
        
	}	
	public int get(Type type) {
		switch (type) {
		
			case FONT: return mTextureFont; 
			case DEFAULT: return mTextureDefault;
			//mTextureFont;
		}
		//Log.d("model", " get failed ");
		return mTextureDefault;
	}
	public int getTexture(String strData) {
		//Log.d("model" , " getTexture " + strData);
		
		if (mTextures.containsKey(strData))
		{
			//Log.d("model" , " returning " + mTextures.get(strData));
			return mTextures.get(strData);
		}
		Log.d("model", " get failed " + strData);
		return mTextureDefault;
	}
	
	public void deleteTexture(GL10 gl, String textname)
	{
		mToDelete.add(textname);
	}
	
	public void flushTextures(GL10 gl)
	{
		for (int a=0; a< mToDelete.size(); a++)
		{
			clearTexture(gl, mToDelete.get(a));
		}
		mToDelete.clear();
	}
	
	private void clearTexture(GL10 gl, String textname)
	{
		if (mTextures.containsKey(textname))
		{
			int id = mTextures.get(textname);
			gl.glDeleteTextures(1 , new int[]{id} ,0);
			mTextures.remove(textname);
			for (int a=0; a < mInfos.size(); a++)
			{
				StringString info = mInfos.get(a);
				if (info.b.equals(textname))
				{
					mInfos.remove(a);
					break;
				}
			}
		}
		
	}
	public void clear() {
		// TODO Auto-generated method stub
		mTextures.clear();
		mInfos.clear();
		mTextCounter = 1;
		
	}
	

	
	public void newTexture(GL10 gl,String textname , String textfile, boolean add)
	{
	
		int texture =  loadTextureFromFile( gl, textfile , mContext, false);

		if (texture > 0)
		{
			mTextures.put(textname, texture);
			if (add)
			{
				StringString info = new StringString();
				info.a = textfile;
				info.b = textname;
				mInfos.add( info );
			}
			if (textname.equals("font"))
			{
				mTextureFont = texture;
			}			
		}				
		
	}
	public boolean isUpdated()
	{
		return mUpdated;
	}
	
	public void resetUpdated()
	{
		mUpdated = false;
	}

	public  void setParam(float u1, float v1, float u2, float v2, float cp) {
		mU1 = u1;
		mV1 = v1;
		mU2 = u2;
		mV2 = v2;
		mCp = cp;
		
	}
	
    public void initTextures(GL10 gl, JSONObject response)
    {
        // init layout
		try {
	    	JSONArray areas;
			areas = response.getJSONArray("texture");
        
	        for (int a=0; a< areas.length(); a++)
	        {
	            JSONObject pCurr = areas.getJSONObject(a);
	            processTexture(gl, pCurr);
	        }
		} catch (JSONException e) {
			e.printStackTrace();
        }

	}

    private void processTexture(GL10 gl, JSONObject areaData) {
    	try {
			String name = areaData.getString("name");
			String file = areaData.getString("file");
			
			if (name != null && name.length() > 0 && file != null && file.length() > 0)
			{
				newTexture(gl ,name , file , true);
			}
    	}
    	catch (JSONException e) {
		
    		e.printStackTrace();
         }    	
    }
    
}
