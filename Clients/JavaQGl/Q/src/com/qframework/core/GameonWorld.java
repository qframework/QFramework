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

import java.util.Iterator;
import java.util.Vector;
import javax.media.opengl.GL2;



public class GameonWorld {

    public enum Display
    {
    	WORLD,
    	HUD
    }
    private Vector<GameonModel> mModelList = new Vector<GameonModel>();
    private Vector<GameonModel> mVisibleModelList = new Vector<GameonModel>();
    private Vector<GameonModel> mModelList2 = new Vector<GameonModel>();
    private Vector<GameonModel> mVisibleModelList2 = new Vector<GameonModel>();
    private Vector<GameonModel> mNewModels = new Vector<GameonModel>();
    private TextRender		mTexts;
    private TextRender		mTextsHud;
    private GameonModel mSplashModel;
    private float[] mAmbientLight = { 1.0f , 1.0f, 1.0f, 1.0f};
    private boolean mAmbientLightChanged = false;
    private GameonApp mApp;
    
	GameonWorld(GameonApp app) {
		mApp = app;
		mTexts = new TextRender(this);
		mTextsHud = new TextRender(this);
	}
	
	public void initSplash(GL2 gl , String name, float x1,float y1, float x2, float y2)
	{
		GameonModel model = new GameonModel("splash", mApp);
		model.createPlane(x1, y1, 0.0f, x2, y2, 0.0f, mApp.colors().white);
		mApp.textures().newTexture(gl, "q_splash", name, true);
		model.setTexture( mApp.textures().getTexture("q_splash"));
		GameonModelRef ref = new GameonModelRef(null);
		ref.mLoc = GameonWorld.Display.HUD;
		ref.set();
		model.addref(ref);
		mSplashModel = model;
        model.generate();
        model.mEnabled = true;		
	}
	public void test()
	{
		
        GameonModel model = new GameonModel("test", mApp);
        //model.createModel(GameonModelData.Type.CUBE, TextureFactory.get( TextureFactory.Type.SFIGURE));
        model.createPlane(-4.0f, -4.0f, -4.0f, 4.0f, 4.0f, 4.0f, mApp.colors().blue);
        //model.setScale(8.0f, 8.0f, 8.0f);
        //model.setPosition(-4.0f, 0, 0);
        model.generate();
        model.mEnabled = true;
        mModelList.add( model );		
	}
	
	public void add(GameonModel model)
	{
		if (model.isValid())
		{
			model.generate();
			mNewModels.add(model);
		}

	}
	
	public void remove(GameonModel model)
	{
		if (mModelList.indexOf(model) >= 0)
		{
			mModelList.remove(model);
		}
		if (mModelList2.indexOf(model) >= 0)
		{
			mModelList2.remove(model);
		}
		remVisible(model);
	}
		
	
	public void addModels()
	{
		Iterator<GameonModel> iter = mNewModels.iterator();
		while (iter.hasNext()) {
			GameonModel model= iter.next();
			if (model.mIsModel)
			{
				mModelList2.add(model);				
			}else
			{
            	mModelList.add(model);
			}
		}
		
		mNewModels.clear();


	}
	public void draw(GL2 gl) {
		if (mAmbientLightChanged)
		{
			gl.glLightModelfv(GL2.GL_LIGHT_MODEL_AMBIENT, mAmbientLight,0);
			mAmbientLightChanged = false;
		}

		int len = mVisibleModelList.size();
		for (int a=0; a< len; a++) {
			GameonModel model = mVisibleModelList.get(a);
			if (!model.mHasAlpha)
				model.draw(gl, GameonWorld.Display.WORLD);
		}
		for (int a=0; a < len ; a++) {
			GameonModel model = mVisibleModelList.get(a);
			if (model.mHasAlpha)
				model.draw(gl, GameonWorld.Display.WORLD);
		}

		len = mVisibleModelList2.size();
		for (int a=0; a< len; a++) {
			GameonModel model = mVisibleModelList2.get(a);
			if (!model.mHasAlpha)
				model.draw(gl, GameonWorld.Display.WORLD);
		}
		for (int a=0; a < len ; a++) {
			GameonModel model = mVisibleModelList2.get(a);
			if (model.mHasAlpha)
				model.draw(gl, GameonWorld.Display.WORLD);
		}
		
			mTexts.render(gl);
	}
	public void drawHud(GL2 gl) {
		
		int len = mVisibleModelList.size();
		//for (int a=0; a< len; a++) 
		for (int a=len-1; a>=0 ; a--)
		{
			GameonModel model = mVisibleModelList.get(a);
			model.draw(gl, GameonWorld.Display.HUD);
		}
		
		len = mVisibleModelList2.size();
		for (int a=len-1; a>=0 ; a--)
		{
			GameonModel model = mVisibleModelList2.get(a);
			model.draw(gl, GameonWorld.Display.HUD);
		}

		mTextsHud.render(gl);
	}

	public void prepare(GL2 gl) {
		gl.glEnableClientState(GL2.GL_TEXTURE_COORD_ARRAY);
        gl.glEnableClientState(GL2.GL_COLOR_ARRAY);
    	gl.glEnable( GL2.GL_COLOR_MATERIAL);
    	gl.glEnableClientState(GL2.GL_VERTEX_ARRAY);	
    	gl.glEnable(GL2.GL_CULL_FACE);
    	gl.glFrontFace(GL2.GL_CCW);
    	gl.glEnable(GL2.GL_TEXTURE_2D);
    	gl.glActiveTexture(GL2.GL_TEXTURE0);
        gl.glHint(GL2.GL_PERSPECTIVE_CORRECTION_HINT,
                GL2.GL_NICEST);
        
    	gl.glEnable(GL2.GL_DEPTH_TEST);
    	gl.glDepthFunc(GL2.GL_LEQUAL);
    	gl.glEnable(GL2.GL_BLEND);
    	gl.glBlendFunc(GL2.GL_SRC_ALPHA, GL2.GL_ONE_MINUS_SRC_ALPHA);
        
    	gl.glEnable(GL2.GL_ALPHA_TEST);
    	gl.glAlphaFunc(GL2.GL_GREATER,0.02f);

        gl.glEnable(GL2.GL_LIGHTING);
        gl.glLightModelfv(GL2.GL_LIGHT_MODEL_AMBIENT, mAmbientLight,0);
        
        gl.glClearColor(0.0f, 0.0f, 0.0f,1);
        gl.glShadeModel(GL2.GL_SMOOTH);
	}
	public void clear() {

		mModelList.clear();
		mNewModels.clear();
		mTexts.clear();
		mTextsHud.clear();
	}
	public void reinit() {
		int len = mModelList.size();
		for (int a=0; a< len; a++) {
			GameonModel model = mModelList.get(a);
			model.reset();
		}
		
	}

	public void setVisible(GameonModel model)
	{
		if (model.mIsModel)
		{
			if (mVisibleModelList2.indexOf(model) < 0)
			{
				for (int a=0; a < mVisibleModelList2.size(); a++)
				{
					GameonModel m = mVisibleModelList2.get(a);
					if (m.mTextureID == model.mTextureID)
					{
						mVisibleModelList2.add(a,model);
						return;
					}
				}
				mVisibleModelList2.add(model);	
			}
		}else
		{
			if (mVisibleModelList.indexOf(model) < 0)
			{
				for (int a=0; a < mVisibleModelList.size(); a++)
				{
					GameonModel m = mVisibleModelList.get(a);
					if (m.mTextureID == model.mTextureID)
					{
						mVisibleModelList.add(a,model);
						return;
					}
				}				
				mVisibleModelList.add(model);	
			}		
		}
	}
	
	public void remVisible(GameonModel model)
	{
		if (model.mIsModel)
		{
			if (mVisibleModelList2.indexOf(model) >= 0)
			{
				mVisibleModelList2.remove(model);	
			}
		}else
		{
			if (mVisibleModelList.indexOf(model) >= 0)
			{
				mVisibleModelList.remove(model);	
			}		
		}
	}

	public void drawSplash(GL2 gl) {
		if (mSplashModel != null)
		{
			if (mAmbientLightChanged)
			{
				gl.glLightModelfv(GL2.GL_LIGHT_MODEL_AMBIENT, mAmbientLight,0);
				mAmbientLightChanged = false;
			}
			
			mSplashModel.setState(LayoutArea.State.VISIBLE);
			mSplashModel.draw(gl, GameonWorld.Display.HUD);
			mSplashModel.setState(LayoutArea.State.HIDDEN);
		}
		
	}
	
	public void setAmbientLight(float a , float r, float g, float b)
	{
		this.mAmbientLight[0] = a;
		this.mAmbientLight[1] = r;
		this.mAmbientLight[2] = g;
		this.mAmbientLight[3] = b;
		this.mAmbientLightChanged = true;
	}
	
	public float[] getAmbientLight()
	{
		float [] ret = new float[4];
		ret[0] = this.mAmbientLight[0];
		ret[1] = this.mAmbientLight[1];
		ret[2] = this.mAmbientLight[2];
		ret[3] = this.mAmbientLight[3]; 
		return ret;
	}

	public void setAmbientLightGl(float a , float r, float g, float b, GL2 gl)
	{
		this.mAmbientLight[0] = a;
		this.mAmbientLight[1] = r;
		this.mAmbientLight[2] = g;
		this.mAmbientLight[3] = b;
		this.mAmbientLightChanged = true;
		gl.glLightModelfv(GL2.GL_LIGHT_MODEL_AMBIENT, this.mAmbientLight,0);

		
	}

	protected TextRender texts()
	{
		return mTexts;
		
	}
	
	protected TextRender textshud()
	{
		return mTextsHud;
	}
	
}

