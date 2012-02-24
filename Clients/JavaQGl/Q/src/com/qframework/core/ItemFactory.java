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
import java.util.NoSuchElementException;
import java.util.StringTokenizer;

import javax.media.opengl.GL2;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ItemFactory {
	public GameonWorld mWorld;
	boolean	mInitialized = false;
	GameonApp mApp;
	HashMap<String,GameonModel>	mModels = new HashMap<String,GameonModel>();
	
	public ItemFactory(GameonApp app) {
		
		mApp = app;
		mWorld = mApp.world();
	}
	public void create()
	{
		
		
	}

	
	LayoutItem	createItem(String type, LayoutItem item)
	{
        try {
        StringTokenizer tok = new StringTokenizer(type, ".");
        String imageset = tok.nextToken();
        //String imagetype = tok.nextToken();
        GameonModel model = mModels.get(imageset);
        if (model == null) {
        	return null;
        }
        int  imageid = -1;
        if (tok.hasMoreTokens())
        	imageid = Integer.parseInt(tok.nextToken());
        
        return createItemFromModel(model, imageid, item);
        
        } catch(NoSuchElementException e)
        {
            return null;
        }

	}

	private LayoutItem createItemFromModel(GameonModel model, int itemID, LayoutItem item)
	{
		LayoutItem fig = item;
		if (fig == null)
		{
			fig = new LayoutItem(mApp);
		}
	    fig.mType = model.mModelTemplate;
	    fig.mModel = model;
		fig.mOwner = itemID;
		fig.mOwnerMax = model.mSubmodels;
		return fig;
		
	}
	
	public void newFromTemplate(String strType, String strData) {
		GameonModel model = getFromTemplate(strType, strData);
		
		if (model != null)
		{
			mModels.put( strType , model);
		}

	}
	
	public GameonModel getFromTemplate(String strType, String strData) {
		if (strData.equals("sphere"))
		{
			GameonModel model = createFromType(GameonModelData.Type.SPHERE, mApp.colors().white, mApp.textures().mTextureDefault);
	        model.mModelTemplate = GameonModelData.Type.SPHERE;
	        model.mIsModel = true;
	        return model;
			
		}else if (strData.equals("cube"))
		{
			//GameonModel model = new GameonModel(strData , mApp);
			//model.createObject(8,8);
			GameonModel model = createFromType(GameonModelData.Type.CUBE, mApp.colors().white, mApp.textures().mTextureDefault);
	        model.mModelTemplate = GameonModelData.Type.CUBE;
	        model.mIsModel = true;
	        return model;
			
		}

		GameonModel model = new GameonModel(strData , mApp);
		if (strData.equals("cylinder"))
		{
			model.createModel(GameonModelData.Type.CYLINDER, mApp.textures().mTextureDefault);
	        model.mModelTemplate = GameonModelData.Type.CYLINDER;
	        model.mIsModel = true;
	    } else if (strData.equals("plane"))
	    {
	        model.createPlane(-0.5f,-0.5f,0.0f,0.5f, 0.5f,0.0f, mApp.colors().white);
	        model.mModelTemplate = GameonModelData.Type.CYLINDER;
	        model.mIsModel = true;
	    } else if (strData.equals("card52"))
	    {
	        model.createCard2(-0.5f,-0.5f,0.0f,0.5f, 0.5f,0.0f, mApp.colors().transparent);
	        model.mModelTemplate = GameonModelData.Type.CARD52;
			model.mForceHalfTexturing = true;
			model.mForcedOwner = 32;   
	        model.mHasAlpha = true;
	        model.mIsModel = true;
	    } else if (strData.equals("cardbela"))
	    {
	        model.createCard(-0.5f,-0.5f,0.0f,0.5f, 0.5f,0.0f, mApp.colors().transparent);
	        model.mModelTemplate = GameonModelData.Type.CARD52;
			model.mForceHalfTexturing = true;
			model.mForcedOwner = 32;   
	        model.mHasAlpha = true;
	        model.mIsModel = true;
	    } else if (strData.equals("background"))
	    {
	        model.createPlane(-0.5f,-0.5f,0.0f,0.5f, 0.5f,0.0f, mApp.colors().white);
	        model.mModelTemplate = GameonModelData.Type.BACKGROUND;
	        model.mHasAlpha = true;
	        model.mIsModel = false;
	    }  else
	    {
	        return null;
	    }
		
		return model;

	}
	

	
	
	
	public void setTexture(String strType, String strData) {
		// get object
		GameonModel model = mModels.get(strType);
		if (model == null) {
			return;
		}
		
		int offsetx = 0, offsety = 0;
		String texture = null;
    	StringTokenizer tok =  new StringTokenizer(strData, ";");
    	if (tok.countTokens() == 1)
    	{
    		// no offset
    		texture = strData;
    	}else {
    		texture = tok.nextToken();
    		String offset = tok.nextToken();
    		StringTokenizer tok2 =  new StringTokenizer(offset, ",");
    		offsetx = Integer.parseInt(tok2.nextToken());
    		offsety = Integer.parseInt(tok2.nextToken());
    	}
    	
		model.mTextureID = mApp.textures().getTexture(texture);
		model.setTextureOffset(offsetx, offsety);
	}
	public void createModel(String strType, String strData) {
		// get object
		GameonModel model = mModels.get(strType);
		if (model == null) {
			return;
		}
		model.mIsModel = true;
		mWorld.add(model);
	}	
	public void setSubmodels(String strType, String strData) {
		// get object
		GameonModel model = mModels.get(strType);
		if (model == null) {
			return;
		}
		int[]vals = new int[2];
		int count = ServerkoParse.parseIntArray(vals , strData );
		if (count > 0) model.mSubmodels = vals[0];
		if (count > 1) model.mForcedOwner = vals[1];
	}		
	
	public GameonModel createFromType(GameonModelData.Type template, GLColor color, int texture) {
		GameonModel model = new GameonModel("template" , mApp);
	
		if (template == GameonModelData.Type.SPHERE)
		{
			model.createModel(GameonModelData.Type.SPHERE, mApp.textures().mTextureDefault);
	        model.mModelTemplate = GameonModelData.Type.SPHERE;
	        model.mIsModel = true;
	        model.mName = "sphere";
	    }else if (template == GameonModelData.Type.CUBE)
		{
			model.createModel(GameonModelData.Type.CUBE, mApp.textures().mTextureDefault);
	        model.mModelTemplate = GameonModelData.Type.CUBE;
	        model.mIsModel = true;
	        model.mName = "cube";
	    } else if (template == GameonModelData.Type.CARD52)
	    {
	        model.createCard2(-0.5f,-0.5f,0.0f,0.5f, 0.5f,0.0f, mApp.colors().transparent);
	        model.mModelTemplate = GameonModelData.Type.CARD52;
			model.mForceHalfTexturing = true;
			model.mForcedOwner = 32;   
	        model.mHasAlpha = true;
	        model.mIsModel = true;
	    } else if (template == GameonModelData.Type.BACKGROUND)
	    {
	        model.createPlane(-0.5f,-0.5f,0.0f,0.5f, 0.5f,0.0f, color);
	        model.mModelTemplate = GameonModelData.Type.BACKGROUND;
			model.mForceHalfTexturing = false;
	        model.mHasAlpha = true;
	        model.mIsModel = false;
	        model.setTexture(texture);
	    }else if (template == GameonModelData.Type.BACKIMAGE)
	    {
	        model.createPlane2(-0.5f,-0.5f,0.0f,0.5f, 0.5f,0.0f, color);
	        model.mModelTemplate = GameonModelData.Type.BACKGROUND;
			model.mForceHalfTexturing = false;
	        model.mHasAlpha = true;
	        model.mIsModel = false;
	        model.setTexture(texture);
	    }
		
		return model;

	}
	
	public void initModels(GL2 gl, JSONObject response)
    {
        // init layout
		try {
	    	JSONArray areas;
			areas = response.getJSONArray("model");
        
	        for (int a=0; a< areas.length(); a++)
	        {
	            JSONObject pCurr = areas.getJSONObject(a);
	            processObject(gl, pCurr);
	        }
		} catch (JSONException e) {
			e.printStackTrace();
        }

	}

    private void processObject(GL2 gl, JSONObject objData) {
    	try {
			String name = objData.getString("name");
			String template = objData.getString("template");
			
			newFromTemplate(name , template);
			
			if (objData.has("texture"))
			{
				String data = objData.getString("texture");
				setTexture(name, data);
			}
			if (objData.has("submodels"))
			{
				String data = objData.getString("submodels");
				setSubmodels(name, data);
			}			
			createModel(name,"");
    	}
    	catch (JSONException e) {
    		e.printStackTrace();
        }    	
    }

}
