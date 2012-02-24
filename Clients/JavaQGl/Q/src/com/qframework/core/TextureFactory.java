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

import java.applet.Applet;
import java.awt.Component;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.IntBuffer;
import java.util.HashMap;
import java.util.Vector;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.media.opengl.GL;
import javax.media.opengl.GL2;
import javax.media.opengl.GLException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.jogamp.common.nio.Buffers;
import com.jogamp.opengl.util.texture.Texture;
import com.jogamp.opengl.util.texture.TextureIO;


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
	Vector<Texture>  mTextureIds = new Vector<Texture>();
	Vector<StringString> mInfos = new Vector<StringString>();
	Vector<String>	mToDelete = new Vector<String>();
	
	boolean mUpdated = false;
	GameonApp mApp;
	public TextureFactory(GameonApp app)
	{
		mApp = app;
	}
	private int loadTextureFromFile(GL2 gl , String fname, boolean system)
	{
            String location = "";
            location += fname;
            //System.out.println(" name " + location + "\n");
            InputStream  instream = mApp.getInputStream(location , system);
            try {
                Texture text = TextureIO.newTexture(instream, true, "png");
                gl.glTexParameterf(GL2.GL_TEXTURE_2D, GL.GL_TEXTURE_MAG_FILTER, GL.GL_LINEAR);
                gl.glTexParameterf(GL2.GL_TEXTURE_2D, GL.GL_TEXTURE_MIN_FILTER, GL.GL_LINEAR);
                gl.glTexParameterf(GL2.GL_TEXTURE_2D, GL2.GL_TEXTURE_WRAP_S, GL2.GL_CLAMP_TO_EDGE);
                gl.glTexParameterf(GL2.GL_TEXTURE_2D, GL2.GL_TEXTURE_WRAP_T, GL2.GL_CLAMP_TO_EDGE);
                gl.glTexEnvf(GL2.GL_TEXTURE_ENV, GL2.GL_TEXTURE_ENV_MODE,GL2.GL_MODULATE);
                //text.enable(gl);
                text.enable(gl);
                int id = mTextureIds.size();
                mTextureIds.add( text);
                mUpdated = true;
                //return text.getTextureObject(gl);
                return text.getTextureObject(gl);
            } catch (IOException ex) {
            	return -1;
                //Logger.getLogger(TextureFactory.class.getName()).log(Level.SEVERE, null, ex);
            } catch (GLException ex) {
            	return -1;
                //Logger.getLogger(TextureFactory.class.getName()).log(Level.SEVERE, null, ex);
            }
            //return -1;
	}
	
	public void init(GL2 gl) {

		mTextures.clear();
		mTextureDefault = loadTextureFromFile( gl, "whitesys.png", true);
		mTextureFont = loadTextureFromFile( gl, "fontsys.png" , true);
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
		//Log.d("model", " get failed " + strData);
		return mTextureDefault;
	}
	
	public void deleteTexture(GL2 gl, String textname)
	{
		mToDelete.add(textname);
	}
	
	public void flushTextures(GL2 gl)
	{
		for (int a=0; a< mToDelete.size(); a++)
		{
			clearTexture(gl, mToDelete.get(a));
		}
		mToDelete.clear();
	}
	
	private void clearTexture(GL2 gl, String textname)
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
	}
	

	public void newTexture(GL2 gl,String textname , String textfile, boolean add)
	{

		
		int texture =  loadTextureFromFile( gl, textfile, false);
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
        }else
        {
        	System.out.println("cant load " + textname);
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

	public void setParam(float u1, float v1, float u2, float v2, float cp) {
		mU1 = u1;
		mV1 = v1;
		mU2 = u2;
		mV2 = v2;
		mCp = cp;
		
	}
	
    public void initTextures(GL2 gl, JSONObject response)
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

    private void processTexture(GL2 gl, JSONObject areaData) {
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
