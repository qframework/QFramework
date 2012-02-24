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

import java.util.NoSuchElementException;
import java.util.StringTokenizer;
import java.util.Vector;

import org.base64.Base64Coder;

public class LayoutArea {

    public enum Border {

        NONE,
        //
        THINRECT
    }
    
    public enum Type {

        NONE,
        //
        TEXT,
        LABEL,
        TABLE,
        BUTTON,
        LAYOUT,
        CARDS
    }

    public enum State {

        NONE,
        VISIBLE,
        HIDDEN
    }

    public enum Layout {

        NONE,
        HORIZONTAL,
        VERTICAL,
        NORTH_WEST,
        NORTH_EAST,
        SOUTH_WEST,
        SOUTH_EAST,
        DIAMOND,
        CIRCLE,
        SQUARE,
        NORTH_SOUTH,
        EAST_WEST,
        SOUTH_NORTH,
        WEST_EAST
    }

    public enum TextAlign {

        NONE,
        NORTH,
        SOUTH,
        WEST,
        EAST,
        NORTH_WEST,
        NORTH_EAST,
        SOUTH_WEST,
        SOUTH_EAST,
        CENTER
    }

    public enum BorderType {

        NONE,
        ROUND,
        RECT
    }

    public enum FieldItemType {

        ITEM,
        TEXT,
        TEXTH
    }
    
    protected String mID;
    protected float[] mBounds = new float[3];
    protected float[] mLocation = new float[5];
    protected float[] mRotation = new float[3];
    protected float[] mScale = new float[3];
    protected float[] mScrollers = new float[6]; // 
    
    protected Type mType = Type.NONE;
    protected State mState = State.VISIBLE;
    protected State mInitState = State.VISIBLE;
    protected LayoutGrid mParent;
    protected Layout mLayout = Layout.NONE;
    protected GameonWorld.Display mDisplay = GameonWorld.Display.WORLD;
    protected Vector<LayoutField> mItemFields = new Vector<LayoutField>();
    protected String mText;
    protected String mData;
    protected int mSize, mSizeW, mSizeH = 1;
    protected int mSizeText = -1;
    protected GLColor mColorForeground;
    protected int mColorForeground2 = 1;
    protected GLColor mColorBackground = null;
    protected int		mColorBackground2 = 1;
    protected String	mStrColorBackground2;
    protected String mOnclick;
    protected String mOnFocusLost;
    protected String mOnFocusGain;
    protected GameonApp mApp;
    protected String mPageId;
    protected GLColor mColors[] = new GLColor[4];
    protected GameonModel mModel;
	protected GameonModel	mModelBack;
	protected Border mBorder = Border.NONE;
	protected boolean mDisabledInput = false;
	protected boolean mPageVisible = false;
	protected boolean mHasScrollH = false;
	protected boolean mHasScrollV = false;
	protected AnimData	mScollerAnim;
	protected int mActiveItems = 1;
	
    public LayoutArea(GameonApp app) {
    	mApp = app;
        mColorForeground = null;
        mColors[0] = mApp.colors().white;
        mColors[1] = mApp.colors().white;
        mColors[2] = mApp.colors().white;
        mColors[3] = mApp.colors().white;
        
        mScale[0] = 1.0f;
        mScale[1] = 1.0f;
        mScale[2] = 1.0f;
        mBounds[0] = 1.0f;
        mBounds[1] = 1.0f;
        mBounds[2] = 1.0f;
        
		mScrollers[0] = 0.0f;
		mScrollers[1] = -0.5f;
		mScrollers[2] = 0.5f;

        
    }

    public void initLayout() 
    {
    }


    public void removeFigure(int index) {
        // 
        if (index >= 0 && index < mItemFields.size()) {
            mItemFields.get(index).removeFigure();
        }
    }

    public void updateData(String strData) {
        // 
    }

    public void setText(String strData) {
    	if (strData == null)
    		return;
		if (strData.startsWith("#64#"))
		{
			mText = Base64Coder.decodeString(strData.substring(4));
		}else
		{
			mText = strData;
		}    	
    }

    public void setTextColor(String strData) {
    	for (int a=0; a< mItemFields.size(); a++) {
            LayoutField f = mItemFields.get(a);
    		if (f.mText != null)
    		{
    			f.mText.setOffset( Integer.parseInt( strData) );
    		}
        }    	
    }
    
    public void fieldSetItem(int index, String itemID) {

        if (index >= 0 && index < mSize) {
        	setField(index);
            mItemFields.get(index).setItem(itemID, false , false);
        }
    }

    public void updateDisplay(String strData) {
        String style = strData;
        if (style.equals("hud")) {
            mDisplay = GameonWorld.Display.HUD;
        }else
        {
            mDisplay = GameonWorld.Display.WORLD;
        }

    }

    public boolean onKey(int keyCode) {
        return false;
    }

    public void clear(boolean all) {
    	
    	if (mModelBack != null && all)
    	{
    		mApp.world().remove(mModelBack);
    		mModelBack = null;
    	}
    	
    	if (mModel != null && all)
    	{
    		mApp.world().remove(mModel);
    		mModel = null;
    		
    	}    	
        mText = "";
        mData = "";
        for (int a = 0; a < mItemFields.size(); a++) {
            mItemFields.get(a).clear();
        }
        
        if (mScollerAnim != null)
        {
        	mScollerAnim.cancel();
        }
    }


    public void updateForeground(String strData) {
        if (strData.equals("none")) {
            mColorForeground = null;
        } else {
            // for now color only
        	StringTokenizer tok =  new StringTokenizer(strData, ",");
        	if (tok.hasMoreElements())
        		mColorForeground = mApp.colors().getColor(tok.nextToken());
        	if (tok.hasMoreElements())
        	{
        		mColorForeground2 = mApp.textures().getTexture(tok.nextToken());
        		if (mModel != null)
        		{
        			mModel.mTextureID = mColorForeground2;
	            }
	        }
	
	    }
    }


    public void updateBackground(String strData , boolean clear) {
        if (strData.equals("none")) {
            mColorBackground = null;
        } else {
            //for now color only
        	StringTokenizer tok =  new StringTokenizer(strData, ",");
        	if (tok.hasMoreElements())
        		mColorBackground = mApp.colors().getColor(tok.nextToken());
        	if (tok.hasMoreElements())
        	{
        		String str = tok.nextToken();
    			mColorBackground2 = mApp.textures().getTexture(str);
    			mStrColorBackground2 = str;
    			if (mModelBack != null)
    			{	
    				mModelBack.mTextureID = mColorBackground2;
    			}
        	}
        }
        if (clear)
        {
        	if (mStrColorBackground2 != null && mModelBack != null)
        	{
	        	StringTokenizer tok = new StringTokenizer(mStrColorBackground2, ".");
				String back = tok.nextToken();
				if (tok.hasMoreTokens())
				{
					int text = mApp.textures().getTexture(back);
					int n = Integer.parseInt( tok.nextToken() );
					int w = Integer.parseInt( tok.nextToken() );
					int h = Integer.parseInt( tok.nextToken() );

					mModelBack.setTexture(text);
					GameonModelRef ref = mModelBack.ref(0);
					ref.mOwner = n;
					ref.mTransformOwner = true;
					mModelBack.setTextureOffset( w , h);
					ref.mOwnerMax = w * h;
					mModelBack.mSubmodels = w * h;
				}
	        }
        }
    }


    public void updateLayout(String areaLayout) {
        // area layout
        if (areaLayout.equals("hor")) {
            mLayout = LayoutArea.Layout.HORIZONTAL;
        } else if (areaLayout.equals("ver")) {
            mLayout = LayoutArea.Layout.VERTICAL;
        } else if (areaLayout.equals("south-east")) {
            mLayout = LayoutArea.Layout.SOUTH_EAST;
        } else if (areaLayout.equals("south-west")) {
            mLayout = LayoutArea.Layout.SOUTH_WEST;
        } else if (areaLayout.equals("north-east")) {
            mLayout = LayoutArea.Layout.NORTH_EAST;
        } else if (areaLayout.equals("north-west")) {
            mLayout = LayoutArea.Layout.NORTH_WEST;
        } else if (areaLayout.equals("circle")) {
            mLayout = LayoutArea.Layout.CIRCLE;
        } else if (areaLayout.equals("square")) {
            mLayout = LayoutArea.Layout.SQUARE;
        } else if (areaLayout.equals("diamond")) {
            mLayout = LayoutArea.Layout.DIAMOND;
        } else if (areaLayout.equals("north-south")) {
            mLayout = LayoutArea.Layout.NORTH_SOUTH;
        } else if (areaLayout.equals("east-west")) {
            mLayout = LayoutArea.Layout.EAST_WEST;
        } else if (areaLayout.equals("south-north")) {
            mLayout = LayoutArea.Layout.SOUTH_NORTH;
        } else if (areaLayout.equals("west-east")) {
            mLayout = LayoutArea.Layout.WEST_EAST;
        }
    }

    public void setInitState()
    {
    	
        if (mPageVisible && mState == LayoutArea.State.VISIBLE)
        {
        	mParent.setVisibleArea(this , true);
        }else {
        	 mParent.setVisibleArea(this  , false);    
        }

        updateModelState(mState);    
    }
    
    public float getX(int x, int max, float w) {

        // calculate divx
        float divx = (x) / ( (float)max);

        // get x coordinate
        float rx =  w * divx;
        return (float) rx;
    	
    }

    public float getY(int y, int max, float h) {

        // calculate divx
    	float divx = ((y)) / ( (float)max);

        // get x coordinate
        float ry =  h * divx;
        return (float) ry;    	
    }

    public float getDivX(float x, float w) {

        // calculate x bounds
        // calculate divx
        float divx = (w) / x;

        return (float) divx;

    }

    public float getDivY(float y, float h) {


        float divy = ( h) / (y);

        return (float) divy;

    }

    public void updateInitState(String strState, boolean initstate) {
        if (mState == LayoutArea.State.VISIBLE) {
            mParent.setVisibleArea(this, true);
        } else if (mState == LayoutArea.State.HIDDEN) {
            mParent.setVisibleArea(this, false);
        } else if (strState.equals("disabled")) {
        } else if (strState.equals("grayed")) {
        }
        if (initstate)
        {
        	mInitState = mState;
        }
        updateModelState(mState);
    }

    public void updateState(String strState, boolean initstate , boolean visible) {

        if (strState.equals("visible")) {
            mState = LayoutArea.State.VISIBLE;
            if (visible)
            {
            
            	mParent.setVisibleArea(this, true);
            }
        } else if (strState.equals("hidden")) {
            if (mScollerAnim != null)
            {
            	mScollerAnim.cancel();
            }
            mState = LayoutArea.State.HIDDEN;
            mParent.setVisibleArea(this, false);
        } 
        if (initstate)
        {
        	mInitState = mState;
        }
        
        if (mState == LayoutArea.State.VISIBLE && !visible)
            return;
        
        updateModelState(mState);
    }

    void updateModelState(State state)
    {
        if (!mPageVisible)
            state= LayoutArea.State.HIDDEN;
        
    	if (mModelBack != null)
    	{
    		mModelBack.setState(state);
    	}
    	if (mModel != null)
    	{
    		mModel.setState(state);
    	}    	
    	for (int a=0; a< mItemFields.size(); a++)
    	{
    		mItemFields.get(a).setState(state);
    	}
    }
    
    public void updateLocation(String strData) {
    	int num = ServerkoParse.parseFloatArray(mLocation, strData);
    	if (num == 5)
    	{
    		mBounds[0] = mLocation[2];
    		mBounds[1] = mLocation[3];
    		mLocation[2] = mLocation[4];    		
    	}else if (num == 4)
    	{
    		mBounds[0] = mLocation[2];
    		mBounds[1] = mLocation[3];
    		mLocation[2] = 0.0f;    		
    		
    	}

    	this.updateModelsTransformation();
    }
    public void updateBounds(String strData) {
    	ServerkoParse.parseFloatArray(mBounds, strData);
    	this.updateModelsTransformation();
    }
    public void setRotation(String strData) {
    	ServerkoParse.parseFloatArray(mRotation, strData);
    	this.updateModelsTransformation();
    }

    public void setScale(String strData) {
    	ServerkoParse.parseFloatArray(mScale, strData);
    	this.updateModelsTransformation();
    }

    public void setItemScale(String strData) {
    	float[] scale = new float[4];
    	int len = ServerkoParse.parseFloatArray(scale, strData);
    	if (len != 4)
    	{
    		return;
    	}
    	
        int i = (int)scale[0];
        if ( i < 0 || i >= mItemFields.size() || mItemFields.get(i) == null)
        {
        	return;
        }
        
        float[] scale2 = new float[3];
        scale2[0] = scale[1];
        scale2[1] = scale[2];
        scale2[2] = scale[3];
        
        LayoutField f = mItemFields.elementAt(i);
        if (f.mItem != null)
        {
        	f.mItem.mModelRef.setAddScale(scale2);
        	f.mItem.mModelRef.set();
        }
        
    }

   
    public void setSize(String strData) {
        StringTokenizer tok = new StringTokenizer(strData, ",");
        try {
            try {
                mSize = Integer.parseInt(tok.nextToken());
            } catch (NumberFormatException e) {
            }
            try {
                mSizeW = Integer.parseInt(tok.nextToken());
            } catch (NumberFormatException e) {
            }
            try {
                mSizeH = Integer.parseInt(tok.nextToken());
            } catch (NumberFormatException e) {
            }
        } catch (NoSuchElementException e) {
        }
    }

    protected void setField(int count) {
        if (count < mItemFields.size()) {
            return;
        } else {
        		while (count >= mItemFields.size())
        		{
	                LayoutField field = new LayoutField(this);
	                field.mID = count;
	                mItemFields.add(field);
        		}
            }
        }

    protected String getData(String val) {
        int index = val.indexOf(']');
        if (index == -1) {
            return val;
        }
        return val.substring(index + 1);
    }

    protected FieldItemType getType(String val) {
        if (val.charAt(0) != '[') {
            return FieldItemType.TEXT;
        }
        if (val.charAt(1) == 'i') {
            return FieldItemType.ITEM;
        }
        if (val.charAt(1) == 't') {
            return FieldItemType.TEXT;
        }
        if (val.charAt(1) == 'T') {
            return FieldItemType.TEXTH;
        }

        return FieldItemType.TEXT;
    }

    protected void pushFrontItem(String strData) {
    	// go through fields
    	for (int a=mItemFields.size()-1; a > 0 ; a--)
    	{
    		LayoutField f2 = mItemFields.elementAt(a);
			f2.clear();
			LayoutField f1 = mItemFields.elementAt(a-1);
			if (f1.mText != null && f1.mText.mText != null )
			{
				f2.setText(f1.mText.mText, mSizeText);
			}
    	}
    	
    	this.createItem(0, strData ,false);

    }
    protected void updateItems(String strData) {
        createItems(strData, false);

    }

    public void updateItem(String strData, boolean showback) {
		// 

        StringTokenizer tok = new StringTokenizer(strData, ",");
        int field = Integer.parseInt( tok.nextToken());
        String item = tok.nextToken();
        createItem(field, item, showback);
	}    
    
    public void createItem(int fieldind, String val, boolean showback) {
        FieldItemType type = FieldItemType.TEXT;
        LayoutField field = null;
        String data;
        type = getType(val);
        data = getData(val);
        if (fieldind < 0 || fieldind > mItemFields.size())
        {
        	System.out.println( " ERRRRRROR field index out of bounds " + this.mID + " " + fieldind);
        	return;
        }
        setField(fieldind);
        field = mItemFields.get(fieldind);
        mActiveItems ++;
        if (type == FieldItemType.ITEM) {
                // just draw item
                //field.mItem = mApp.items().createItem(data, null);
            	if (field.mW > 0) {
            		field.setItem(data, false, showback);
            	}                
                field.mText = null;
            } else if (type == FieldItemType.TEXT) {
                field.setText(data, mSizeText);
                field.mItem = null;
            }else if (type == FieldItemType.TEXTH) {
                field.setText(data, mSizeText);
                field.mItem = null;
            }
    }

    public void createItems(String strData, boolean doeffect) {
        if (strData == null) {
            return;
        }

        StringTokenizer tok = new StringTokenizer(strData, ",");
        String val;
        String data;
        FieldItemType type = FieldItemType.TEXT;
        LayoutField field = null;
        int count = 0;

        // update vector of items on fields
        //&& count < mSize
        mActiveItems ++;
        while (tok.hasMoreTokens()) {
            val = tok.nextToken();
            type = getType(val);
            data = getData(val);
            setField(count);
            field = mItemFields.get(count++);
            if (type == FieldItemType.ITEM) {
                // just draw item
            	if (field.mW > 0) {
            		field.setItem(data, doeffect, false);
            	}
                field.mText = null;
            } else if (type == FieldItemType.TEXT) {
                field.setText(data, mSizeText);
                //field.mColorFore = mColorForeground;
                field.mItem = null;
            } else {
            }
        }

    }

    public void updateFields(String fields) {
        createFields(fields);
    }

    protected String getFinfo(int[] info, String token) {
        String tt;
        StringTokenizer tok;
        int a = 0;
        tok = new StringTokenizer(token, ",");
        tt = tok.nextToken();
        // default values
        info[0] = 0;
        info[1] = 0;
        info[2] = 1;
        info[3] = 0;
        info[4] = 0;
        info[5] = 1;
        info[6] = 1;
        while (tok.hasMoreTokens() && a < 6) {
            info[a++] = Integer.parseInt(tok.nextToken());
        }
        
        return tt;
    }

    public void createFields(String strData) {
        if (strData == null) {
            return;
        }

        StringTokenizer tok;
        int fieldinfo[] = new int[7];
        int fieldc = 0;
        String type = new String();


        tok = new StringTokenizer(strData, ";");

        // get field Width / height
        int count = 0;
        int max = 0;
        int fieldind = 0;
        int x = 0,y = 0;
        int szx = 0;
        int szy = 0;
        while (tok.hasMoreTokens()) {
            type = getFinfo(fieldinfo, tok.nextToken());
            x = fieldinfo[0];
            y = fieldinfo[1];
            max = fieldinfo[2];
            szx = fieldinfo[5];
            szy = fieldinfo[5];
            for (count = 0; count < max; count++) {
                setField(fieldind);
                LayoutField field = mItemFields.get(fieldind++);
                field.mGridx = x;
                field.mGridy = y;
                field.mGridSzX = szx;
                field.mGridSzY = szy;
                if (type.equals("empty")) {
                    field.mFieldType = LayoutField.FieldType.EMPTY;
                }else
            	if (type.equals("empty2")) {
                    field.mFieldType = LayoutField.FieldType.EMPTY2;
                }else                	
            	if (type.equals("norm")) {
                    field.mFieldType = LayoutField.FieldType.NORM_FIELD;
                }else                	
                if (type.equals("play")) {
                    field.mFieldType = LayoutField.FieldType.PLAY_FIELD;
                } else if (type.equals("norm")) {
                    field.mFieldType = LayoutField.FieldType.NORM_FIELD;
                } else if (type.equals("start")) {
                    field.mFieldType = LayoutField.FieldType.PLAYER_START;
                } else if (type.equals("end")) {
                    field.mFieldType = LayoutField.FieldType.PLAYER_END;
                } 

                field.mID = fieldc;
                x += fieldinfo[3];
                y += fieldinfo[4];

                fieldc++;
            }
        }
    }

    LayoutItem getItem(int index) {
        if (index < mItemFields.size()) {
            return mItemFields.get(index).mItem;
        }
        return null;
    }

    void placeFigure(int index, LayoutItem item, boolean showback) {
        if (index < mItemFields.size()) {
            LayoutField f = mItemFields.get(index);
            f.removeFigure();
        	f.setItem2(item, false, showback);
        }
        
    }
    void updateOnFocusLost(String data) {
    	mOnFocusLost = data;
    }

    void updateOnFocusGain(String data) {
    	mOnFocusGain = data;
    }
    
    void updateOnclick(String data) {

    	mOnclick = data;

    }

	public void updateItemsA(String strData) {
        createItems(strData, true);
	}


	public void createWorldModel() {
		if (mModelBack == null) {
			if (mColorBackground != null) {
	            GameonModelRef ref = new GameonModelRef(null);

				// create plane for background
				if (mStrColorBackground2 != null)
				{
					StringTokenizer tok = new StringTokenizer(mStrColorBackground2, ".");
					String back = tok.nextToken();
					if (tok.hasMoreTokens())
					{
						int text = mApp.textures().getTexture(back);
						int n = Integer.parseInt( tok.nextToken() );
						int w = Integer.parseInt( tok.nextToken() );
						int h = Integer.parseInt( tok.nextToken() );
						
						if (mType == Type.LAYOUT)
						{
							mModelBack = mApp.items().createFromType(GameonModelData.Type.BACKIMAGE , mColorBackground , text);
						}else
						{
							mModelBack = mApp.items().createFromType(GameonModelData.Type.BACKGROUND , mColorBackground , text);
						}
						ref.mOwner = n;
						ref.mTransformOwner = true;
						mModelBack.setTextureOffset( w , h);
						ref.mOwnerMax = w * h;
						mModelBack.mSubmodels = w * h;
					}else
					{
						if (mType == Type.LAYOUT)
						{
							mModelBack = mApp.items().createFromType(GameonModelData.Type.BACKIMAGE , mColorBackground , mColorBackground2);
						}else
						{						
							mModelBack = mApp.items().createFromType(GameonModelData.Type.BACKGROUND , mColorBackground , mColorBackground2);
						}
					}
				}else
				{
					if (mType == Type.LAYOUT)
					{					
						mModelBack = mApp.items().createFromType(GameonModelData.Type.BACKIMAGE , mColorBackground , mColorBackground2);
					}else
					{
						mModelBack = mApp.items().createFromType(GameonModelData.Type.BACKGROUND , mColorBackground , mColorBackground2);
					}
				}
				mModelBack.mLoc = mDisplay;
				mModelBack.mEnabled = true;
				
	            if (mColorBackground.alpha < 255)
	            {
	            	mModelBack.mHasAlpha = true;
	            }
	            
	            if (mBorder == Border.THINRECT)
	            {
	            	mModelBack.createFrame(-0.5f,-0.5f,0.00f,0.5f, 0.5f,0.00f, 0.03f/mBounds[0], 0.03f/mBounds[1], this.mColorForeground);
	            }
	            
	            
	            ref.mLoc = mDisplay;
            	//ref.setAreaScale(mBounds);
            	ref.setAreaPosition(mLocation);
	            mModelBack.addref(ref);
	            mModelBack.mName = "back " + mID;
				mApp.world().add(mModelBack);
			}
		}
		if (mType == Type.LABEL || mType == Type.TABLE)
		{
			createWorldModelItems();
		}
	}
	public void createWorldModelItems()
	{
		if ( mItemFields.size() == 0 || mModel != null)
		{
			return;
		}
		int count  = 0;
		mActiveItems = 0;
		for (int a=0; a < mItemFields.size(); a++)
		{
			LayoutField field = mItemFields.get(a);
			if (field.mFieldType == LayoutField.FieldType.NONE ||
				field.mFieldType == LayoutField.FieldType.EMPTY ||
				field.mFieldType == LayoutField.FieldType.EMPTY2)
			{
				count ++;
			}
			if (field.mText != null || field.mItem != null)
			{
				mActiveItems++;
			}
		}
		if (count == mItemFields.size()){
			createCustomModel();
			return;
		}
		mModel = new GameonModel("area"+ this.mID , mApp);
		GameonModel model = mModel;
		//Log.d("model" , " cordstart ------");
		for (int a=0; a< mItemFields.size(); a++ ) {
			LayoutField field = mItemFields.get(a);
	        float w = field.mW ;
	        float h = field.mH ;
	        float x = field.mX / mBounds[0] - w/2;
	        float y = field.mY / mBounds[1]- h/2;
                float z = field.mZ;
	        float dw = w/80;
	        float dh = h/80;        
			float up = 0.001f;
			//Log.d("model" , x + " " + y + " "  + w + " " + h);
	        GLColor fcolor = null;
	        if (mColorForeground != null)
	        {
	            fcolor = mColorForeground;
	        }else {
	            fcolor = mApp.colors().white;//getPlayerColor(owner);
	        }
	        
			switch (field.mFieldType)
			{
				case NORM_FIELD:
	                if (mColorForeground != null)
	                {					
	                	model.createPlane( x, y, z+up ,  x +w , y + h, z+up  ,   fcolor);	                	
	                }
	                else
	                {
	                	model.createPlane4( x, y, z+up ,  x +w , y + h, z+up  ,   fcolor, fcolor);
	                }
					field.mZ = 0;
				break;
				case PLAY_FIELD:
					if (mColorForeground != null)
					{
						model.createOctogon( x+dw, y+dh, z+up ,  x +w-dw-dw , y + h-dh-dh, z+up ,   fcolor);
					}else
					{
						model.createOctogon( x+dw, y+dh, z+up ,  x +w-dw-dw , y + h-dh-dh, z+up ,   fcolor);
					}
					field.mZ = 0;
				break;
				case PLAYER_START:
					//model.createPlane2( x, y, mZ+0.001f ,  x +w , y + h, mZ+0.001f  ,   fcolor);
					model.createPlane( x+dw, y+dh, z+up ,  x +w-dw-dw , y + h-dh-dh, z+up ,   fcolor);
					field.mZ = 0;
					break;				
				case PLAYER_END:
				//case EMPTY2:
					model.createPlane3( x, y, z+up ,  x +w , y + h, z+up  ,   fcolor);
					field.mZ = 0;
					break;
				case EMPTY:
					field.mZ = 0;
					break;
			}
			
			field.mRef.setPosition(field.mX,field.mY,field.mZ);
			field.mRef.setScale(w,h,1);
			//Log.d("model", (field.mScreenY) +" "+ (y));
		}
	    GameonModelRef ref = new GameonModelRef(null);
	    ref.mLoc = mDisplay;
	    ref.setScale(mBounds);
	    model.addref(ref);    
		model.mEnabled = true;
	    model.mIsModel = false;
	    if (mColorForeground2 > 0)
	    {
	        mModel.setTexture(mColorForeground2);
	    }
	    mApp.world().add(model);

	}

	
	public AreaIndexPair fieldClicked(float eye[], float[] ray) {
		if (mDisabledInput || !hasTouchEvent() )
			return null;
		if (this.mPageVisible == false || this.mState != LayoutArea.State.VISIBLE)
		{
			return null;
		}
	    if ( mParent.mPagePopup.length() > 0 &&  !this.mPageId.equals(mParent.mPagePopup))
	    {
	        return null;
	    }

		float mindist = 1e06f;
		int index = 0;
		float loc[] = new float[3];
		for (int a=0; a < mItemFields.size(); a++)
		{
			// give priority to those with items or texts 
			LayoutField f = mItemFields.get(a);
			if (f.mText != null || f.mItem != null)
			{
				GameonModelRef ref = f.mRef;
				float dist = ref.intersectsRay(eye, ray , loc);
				if (dist < mindist)
				{
					mindist = dist;
					index = a;
				}
			}
		}		
		if (mindist != 1e6f)
		{
			AreaIndexPair pair = new AreaIndexPair();
			pair.mArea = mID;
			pair.mOnclick = mOnclick;
			pair.mOnFocusLost = mOnFocusLost;
			pair.mOnFocusGain = mOnFocusGain;
			pair.mIndex = index;
			pair.mLoc[0] = loc[0];
			pair.mLoc[1] = loc[1];
			pair.mLoc[2] = loc[2];
			return pair;							
		}

		for (int a=0; a < mItemFields.size(); a++)
		{
			LayoutField f = mItemFields.get(a);
			GameonModelRef ref = f.mRef;
			float dist = ref.intersectsRay(eye, ray , loc);
			if (dist < mindist)
			{
				mindist = dist;
				index = a;
			}
		}		
		if (mindist != 1e6f)
		{
			AreaIndexPair pair = new AreaIndexPair();
			pair.mArea = mID;
			pair.mOnclick = mOnclick;
			pair.mOnFocusLost = mOnFocusLost;
			pair.mOnFocusGain = mOnFocusGain;
			pair.mIndex = index;
			pair.mLoc[0] = loc[0];
			pair.mLoc[1] = loc[1];
			pair.mLoc[2] = loc[2];			
			return pair;							
		}
		
		
		
		if (mModelBack != null)
		{
			GameonModelRef ref = mModelBack.ref(0);
			float dist = ref.intersectsRay(eye,ray , loc);
			if (dist <= mindist)
			{
				mindist = dist;
				index = -1;
			}			
		}
		if (mModel != null)
		{
			GameonModelRef ref = mModel.ref(0);
			float dist = ref.intersectsRay(eye,ray, loc);
			if (dist <= mindist)
			{
				mindist = dist;
				index = -1;
			}
		}			
		if (mindist != 1e6f)
		{
			AreaIndexPair pair = new AreaIndexPair();
			pair.mArea = mID;
			pair.mOnclick = mOnclick;
			pair.mOnFocusLost = mOnFocusLost;
			pair.mOnFocusGain = mOnFocusGain;
			pair.mIndex = index;
			pair.mLoc[0] = loc[0];
			pair.mLoc[1] = loc[1];
			pair.mLoc[2] = loc[2];			
			return pair;							
		}
				
		return null;
	}

	
	public void itemsAnim(String strData) {

		// get type
		//get delay
        StringTokenizer tok = new StringTokenizer(strData, ",");

        String movetype = tok.nextToken();
        String delay = tok.nextToken();
        if (tok.hasMoreTokens())
        {
        	delay += ",";
        	delay += tok.nextToken();
        }

        LayoutItem item = null;
        for (int a=0; a< mItemFields.size(); a++) {
        	item = mItemFields.get(a).mItem;
        	if (item != null && item.mModelRef != null)
        	{
        		mApp.anims().animRef(movetype, item.mModelRef , item.mModelRef, delay);
        	}
        }
	}

	public void itemAnim(String indexes, String strData) {

		// get type
		//get delay
        StringTokenizer tok = new StringTokenizer(strData, ",");

        String movetype = tok.nextToken();
        String delay = tok.nextToken();
        if (tok.hasMoreTokens())
        {
        	delay += ",";
        	delay += tok.nextToken();
        }
        LayoutItem item = null;
        
        StringTokenizer tokind = new StringTokenizer(indexes, ",");
        
        while(tokind.hasMoreTokens()) 
        {
        	int a= Integer.parseInt(tokind.nextToken());
        	item = mItemFields.get(a).mItem;
                if(item != null)
        	     mApp.anims().animRef(movetype, item.mModelRef , item.mModelRef, delay);

        }
	}

	void invertItem(String strData ) {
	    // 
	    
	    int field = Integer.parseInt(strData);
	    LayoutField f = null;
	    setField(field);
	    f = mItemFields.elementAt(field);
	    f.invertItem();
	    
	}    

	public void updateBorder(String border) {
		// 
		if (border.equals("thinrect"))
		{
			mBorder = Border.THINRECT;
		}
	}

	public int initAnim(String strData, boolean away)
	{
	    // get type
	    //get delay
        StringTokenizer tok = new StringTokenizer(strData, ",");
        	
	    String movetype = tok.nextToken();    
	    int delay = Integer.parseInt( tok.nextToken() );
	    
	    //
	    if (mModel != null)
	    {
	        mModel.createAnimTrans(movetype , delay, away, 0);
	    }
	    if (mModelBack != null)
	    {
	        mModelBack.createAnimTrans(movetype , delay , away, 0);
	    }    
	    for (int a=0; a< mItemFields.size(); a++)
	    {
	        LayoutField field = mItemFields.get(a);
	        field.createAnimTrans(movetype, delay , away);
	    }
	    return delay;
	}

	
	boolean hasTouchEvent() 
	{
		if (mHasScrollH || mHasScrollV)
			return true;
		
		if ( (mOnclick != null && mOnclick.length() > 0) || 
			(mOnFocusLost != null && mOnFocusLost.length() > 0) ||
			(mOnFocusGain != null && mOnFocusGain.length() > 0) )
		{
			return true;
		}
		return false;
	}
	
	void updateColors(String strData)
	{
    	StringTokenizer tok =  new StringTokenizer(strData, ",");
    	if (tok.hasMoreElements())
    		mColors[0] = mApp.colors().getColor(tok.nextToken());
    	if (tok.hasMoreElements())
    		mColors[1] = mApp.colors().getColor(tok.nextToken());
    	if (tok.hasMoreElements())
    		mColors[2] = mApp.colors().getColor(tok.nextToken());
    	if (tok.hasMoreElements())
    		mColors[3] = mApp.colors().getColor(tok.nextToken());
		
	}
	
	void disableInput(boolean disable)
	{
	    mDisabledInput  = disable;
	}
	
	void updateModelsTransformation()
	{
		if (mModelBack != null)
		{
			GameonModelRef ref = mModelBack.ref(0);
            ref.setAreaPosition(mLocation);
            ref.setAreaRotate(mRotation);
            ref.setScale(mBounds);
            ref.setAddScale(mScale);
            ref.set();
		}
		if (mModel != null)
		{
			GameonModelRef ref = mModel.ref(0);
			ref.setAreaPosition(mLocation);
			ref.addAreaPosition(0, 0, 0.001f);
            ref.setAreaRotate(mRotation);
            ref.setScale(mBounds);
            ref.setAddScale(mScale);
            ref.set();
		}
		
		for (int a=0; a < mItemFields.size(); a++)
		{
			LayoutField f = mItemFields.get(a);
			f.setScale();
			if (f.mItem != null && f.mItem.mModelRef != null)
			{
				GameonModelRef ref = f.mItem.mModelRef;
				ref.setAreaPosition(mLocation);
	            ref.setAreaRotate(mRotation);
	            ref.mulScale(mBounds);
	            ref.setAddScale(mScale);
	            ref.set();
			}
			if (f.mText != null && f.mText.ref() != null)
			{
				GameonModelRef ref = f.mText.ref();
				ref.setAreaPosition(mLocation);
	            ref.setAreaRotate(mRotation);
	            ref.mulScale(mBounds);
	            ref.setAddScale(mScale);
	            ref.set();
			}
			
			GameonModelRef ref = f.mRef;
			ref.setAreaPosition(mLocation);
            ref.setAreaRotate(mRotation);
            ref.mulScale(mBounds);
            ref.setAddScale(mScale);
            ref.set();
		}
	}

	
	void updateScrollers()
	{
		
	}
	void createCustomModel()
	{
		
	}
	public void setScrollers(String data)
	{
		int num = ServerkoParse.parseFloatArray(mScrollers, data);
		if (num > 0)
		{
			// update scrollers
			if (mScrollers[0] < mScrollers[1])
			{
				mScrollers[0] = mScrollers[1];
			}else if (mScrollers[0] > mScrollers[2])
			{
				mScrollers[0] = mScrollers[2];
			}
			updateScrollers();
		}
	}

	
	public void setScrollerVal(float val)
	{
		mScrollers[0] = val;
		//System.out.println( "set scroll " + val);
		updateScrollers();
	}
	public void onDragg(float dx, float dy, float dz)
	{
		//System.out.println( "dragg " + dx + " " + dy + " " + dz);
		if (mHasScrollH || mHasScrollV)
		{
			if (mScollerAnim == null)
			{
				mScollerAnim = mApp.anims().getScollerAnim(this);
				mScollerAnim.setActive(true);
				mScollerAnim.mAreaOwner = this;
				mApp.anims().incCount();

			}
			if (mScollerAnim != null)
			{
				float p;
				if (mHasScrollV)
				{
					p = dy / mBounds[1];
				}else
				{
					p = -dx / mBounds[0];
				}
				mScollerAnim.addScrollerData(p, 200, mScrollers[1] , mScrollers[2] );
			}
						
		}
	}
	
	public void anim(String type, String delay, String data)
	{
	    //
	    if (mModel != null)
	    {
	        mModel.createAnim(type , 0,  delay , data);
	    }
	    if (mModelBack != null)
	    {
	        mModelBack.createAnim(type , 0, delay  , data);
	    }    
	    for (int a=0; a< mItemFields.size(); a++)
	    {
	        LayoutField field = mItemFields.get(a);
	        field.createAnim(type, delay , data );
	    }
	}
}

