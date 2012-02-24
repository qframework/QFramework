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
import java.util.Iterator;
import java.util.StringTokenizer;
import java.util.Vector;

import javax.media.opengl.GL2;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

    
public class LayoutGrid {
	class Areas {
		public Vector<LayoutArea> areas = new Vector<LayoutArea>();
		public boolean mVisible = false;
		public boolean mIsHiding;
	};

	private Vector<LayoutArea> mVisibleAreas = new Vector<LayoutArea>();
	private HashMap<String, LayoutArea> mAreas = new HashMap<String, LayoutArea>();
	private HashMap<String, LayoutArea> mAreasHud = new HashMap<String, LayoutArea>();
	private HashMap<String, Areas> mPageIds = new HashMap<String, Areas>();
    protected GameonWorld mWorld;
    private GameonApp	  mApp;
    protected String		  mPagePopup;
    
    public LayoutGrid (GameonWorld world, GameonApp app) 
    {
    	mWorld = world;
    	mApp = app;
    	mPagePopup = "" ;
    }
    

    public void initLayout2(JSONObject response)
    {
        // init layout
		try {
	    	JSONArray areas;
			areas = response.getJSONArray("area");
        
	        for (int a=0; a< areas.length(); a++)
	        {
	            JSONObject pCurr = areas.getJSONObject(a);
	            LayoutArea area = processAreaData2(pCurr);
	            String pageid = response.getString("pageid");
	            addToPage(area,pageid);
	            if (pageid.equals( "*") )//|| area.mPageVisible)
	            {
	            	area.mPageVisible = true;
	            	area.updateState("visible",false, true);
	            }
    	}
		} catch (JSONException e) {
			e.printStackTrace();
        }

	}


    private LayoutArea processAreaData2(JSONObject areaData) {
    	String items = null;
    	String fields = null;
    	
    	try {
			String type = areaData.getString("type");
			String id = areaData.getString("id");
			LayoutArea areaold = this.getArea(id);
			if (areaold != null)
			{
				//System.out.println("removing area " + areaold.mID);
				removeArea(areaold);
			}
			//System.out.println("create area " + id);
	        LayoutArea area = createArea(type);
	        if (area == null) {
		            return null;
	        }
	        area.mParent = this;
	        area.mID = areaData.getString("id");
	        area.mParent = this;

	        Iterator<String> iter = areaData.keys();
	        while(iter.hasNext())
	        {
	        	String obj = (String)iter.next();
	        	//System.out.println( areaData.getString(obj) );
	        	
		        if (obj.equals("size"))
		        {	        
		        	area.setSize(areaData.getString(obj));
		        }else if (obj.equals("location"))
		        {
		        	area.updateLocation(areaData.getString(obj));
		        }else if (obj.equals("bounds"))
		        {
		        	area.updateBounds(areaData.getString(obj));
		        }else if (obj.equals("state"))
		        {
		            area.updateState(areaData.getString(obj) , true, false );
		        }else if (obj.equals("display"))
		        {	        
		            area.updateDisplay(areaData.getString(obj));
		        }else if (obj.equals("layout"))
		        {	        
		            area.updateLayout(areaData.getString(obj));
		        }else if (obj.equals("text"))
		        {	        
		            area.setText(areaData.getString(obj));
		        }else if (obj.equals("onclick"))
		        {	        
		            area.updateOnclick(areaData.getString(obj));
		        }else if (obj.equals("onfocusgain"))
		        {	        
		            area.updateOnFocusGain(areaData.getString(obj));
		        }else if (obj.equals("onfocuslost"))
		        {	        
		            area.updateOnFocusLost(areaData.getString(obj));
		        }else if (obj.equals("data"))
		        {	        	        
		            area.mData = areaData.getString(obj);
		        }else if (obj.equals("background"))
		        {	        	        
		            area.updateBackground(areaData.getString(obj), false);
		        }else if (obj.equals("foreground"))
		        {	        	        
		            area.updateForeground(areaData.getString(obj));
		        }else if (obj.equals("colors"))
		        {	        	        
		            area.updateColors(areaData.getString(obj));
		        }else if (obj.equals("border"))
		        {	        	        
		        	area.updateBorder(areaData.getString(obj));
		        }else if (obj.equals("fields"))
		        {	        	        
		            fields = areaData.getString(obj);
		        }else if (obj.equals("items"))
		        {	        	        
		            items = areaData.getString(obj);
		        }else if (obj.equals("rotation"))
		        {	        	        
		            area.setRotation(areaData.getString(obj));
		        }else if (obj.equals("scrollers"))
		        {	        	        
		            area.setScrollers(areaData.getString(obj));
		        }	        		        
	        	
	        }
	        
	        
	        if (fields != null)
	        {
	        	area.createFields(fields);
	        }
	        area.initLayout();
	        if (items != null)
	        {
	        	area.createItems(items, false);
	        }
	        area.createWorldModel();
	        area.updateModelsTransformation();
	        
	        if (area.mDisplay == GameonWorld.Display.HUD) {
	            mAreasHud.put(area.mID, area);
	        } else {
		        mAreas.put(area.mID, area);
	        }
        

	        return area;
		} catch (JSONException e) {
			
			e.printStackTrace();
            }
		return null;
    }


    private LayoutArea createArea(String areaType) {

        StringTokenizer tok;
        String type = null, subtype = null;

        tok = new StringTokenizer(areaType, ".");

        if (tok.hasMoreTokens()) {
            type = tok.nextToken();
        }
        if (tok.hasMoreTokens()) {
            subtype = tok.nextToken();
        }

        if (type == null) {
            return null;
        }

        if (type.equals("table")) {
            return new LayoutAreaTable(subtype , mApp);
        } else if (type.equals("text")) {
            return new LayoutAreaText(subtype, mApp);
        } else if (type.equals("layout")) {
            return new LayoutAreaLayout(subtype, mApp);
        } else if (type.equals("cards")) {
            return new LayoutAreaCards(subtype, mApp);
        } ///////////////
        else {
            return null;
        }
    }


    public void moveFigure(String areaFrom, int indexFrom, String areaTo,
            int indexTo) {

        LayoutItem item = null;
        LayoutArea arearemove = null;
        LayoutArea areaset = null;

        arearemove = this.getArea(areaFrom);
        areaset = this.getArea(areaTo);
         if (arearemove != null) {
            item = arearemove.getItem(indexFrom);
            arearemove.removeFigure(indexFrom);
        }
         
        if (item == null) {
        	return;
        }
        if (areaset != null) {
            areaset.placeFigure(indexTo, item, false);
            if (item != null) {
            }
        }
    }

    public void setAreaState(String areaid, String strState) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
        	Areas areas = mPageIds.get(area.mPageId);
            if (areas == null)
            {
                return;
            }
            boolean pagevis = areas.mVisible;
        	
            area.updateState(strState, false, pagevis);
        }
    }

    public void setAreaLocation(String areaid, String strData) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
        	//area.clear();
            area.updateLocation(strData);
        }
    }

    public void setAreaRotation(String areaid, String strData) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
        	//area.clear();
            area.setRotation(strData);
        }
    }    
    
    public void areaSetScrollers(String areaid, String strData) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
        	//area.clear();
            area.setScrollers(strData);
        }
    }    
    
    
    public void setAreaScale(String areaid, String strData) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
            area.setScale(strData);
        }
    }
    
    public void setAreaItemScale(String areaid, String strData) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
            area.setItemScale(strData);
        }
    }    
    public void setAreaSize(String areaid, String strData) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
            area.setSize(strData);
        }
    }

    public void areaDataUpdate(String areaID, String strData) {
        LayoutArea area = getArea(areaID);
        if (area != null) {
            area.updateData(strData);
        }

    }


    public LayoutArea getArea(String ID) {

    	LayoutArea area = mAreas.get(ID);
    	if (area != null)
    		return area;

    	LayoutArea areahud = mAreasHud.get(ID);
    	if (areahud != null)
    		return areahud;
    	
        return null;
    }


    public void areaFieldSetItem(String itemID, String areaID, int index) {

        LayoutArea area = getArea(areaID);
        if (area != null) {
            area.fieldSetItem(index, itemID);
        }

    }

    public void areaUpdateItems(String areaID, String strData) {

        LayoutArea area = getArea(areaID);
        if (area != null) {
            area.updateItems(strData);
        }

    }

    public void areaUpdateText(String areaid, String strData) {
            LayoutArea area = getArea(areaid);
            if (area != null) {
                area.setText(strData);
            }
        }
    public void areaUpdateTextColor(String areaid, String strData) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
            area.setTextColor(strData);
        }
    }    

    public void onKey(int keyCode) {

    }

    public void onAreaDelete(String areaID, String strData) {
    	LayoutArea area = getArea(areaID);
    	if (area != null)
    	{
    		removeArea(area);
    	}
    }

    public void clearArea(String areaID) {

        if (areaID.equals("*")) {
            for (int a = mAreas.size() - 1; a >= 0; a--) {
                mAreas.get(a).clear(false);
            }
        } else {
            LayoutArea area = getArea(areaID);
            if (area != null) {
                area.clear(false);
            }
        }

    }

    public void areaUpdateForeground(String areaid, String strData) {

        LayoutArea area = getArea(areaid);
        if (area != null) {
            area.updateForeground(strData);
        }

    }

    public void areaUpdateBackground(String areaid, String strData) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
            area.updateBackground(strData, true);
        }
    }


    public void areaUpdateFields(String areaid, String strData) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
            area.updateFields(strData);
        }
    }

    public void areaUpdateLayout(String areaid, String strData) {
        LayoutArea area = getArea(areaid);
        if (area != null) {
            area.updateLayout(strData);
        }
    }

    public void onAreaUpdateLocation(String areaID, String strData) {
        LayoutArea area = getArea(areaID);
        if (area != null) {
            area.updateLocation(strData);
        }

    }

    public void removeFigure(String areaID, int indexFrom) {
        LayoutArea area = getArea(areaID);
        if (area != null) {
            area.removeFigure(indexFrom);
        }

    }


    void onAreaUpdateOnclick(String areaID, String data) {
        LayoutArea area = getArea(areaID);
        if (area != null) {
            area.updateOnclick(data);
        }
        
    }

    void onAreaUpdateOnFocusLost(String areaID, String data) {
        LayoutArea area = getArea(areaID);
        if (area != null) {
            area.updateOnFocusLost(data);
        }
        
    }
    void onAreaUpdateOnFocusGain(String areaID, String data) {
        LayoutArea area = getArea(areaID);
        if (area != null) {
            area.updateOnFocusGain(data);
        }
        
    }

    void clearAll() {
        mAreas.clear();
        mAreasHud.clear();
  
    }


    void onEvent2(GL2 gl, JSONObject response)
    {
        try {
			String respid = response.getString("id");
			String respdata = null;
			String respdata2 = null;
			String respdata3 = null;
			String respdata4 = null;
			String resptype = response.getString("type");
			if (response.has("data"))
			{
				respdata = response.getString("data");
			}
			
			if (response.has("data2"))
			{
				respdata2 = response.getString("data2");
			}
			if (response.has("data3"))
			{
				respdata3 = response.getString("data3");
			}
			if (response.has("data4"))
			{
				respdata4 = response.getString("data4");
			}						
			
			int eventid = Integer.parseInt( respid);
		  switch (eventid) {

		  case 2012:
    		mPagePopup = resptype;			  
		  case 2010:
		    showPage(resptype , null);
		    break;
		  case 2013:
            mPagePopup = resptype;
		  case 2011:
            showPage(resptype , respdata);
            break;  
		  case 2015:
	            clearPage(resptype);
		  case 2020:
            if (mPagePopup.equals(resptype))
                mPagePopup = "";
            hidePage(resptype, null);
            break;
		  case 2021:
			  if (mPagePopup.equals(resptype))
				  mPagePopup = "";
			  hidePage(resptype, respdata);
			  break;            		
		  case 2030:
			animScreen(resptype, respdata);
			break;
		  case 2500:
		    onCameraFit(resptype , respdata);
		    break;
		  case 2501:
		    onCameraSet(resptype , respdata);
		    break;            
		  case 2502:
		    onCameraProj(resptype , respdata, respdata2);
		    break;				    
		  case 2510:
		    onCameraFitHud(resptype , respdata);
		    break;
		  case 2511:
		    onCameraSetHud(resptype , respdata);
		    break;
		  case 2512:
		    onCameraProjHud(resptype , respdata , respdata2);				    
		    break;
			    
		case 3001:
			onAreaDelete(resptype, respdata);
			break;				    
		case 3002:
			onAreaClear(resptype, respdata, true);
			break;
		case 3003:
			onAreaSwapId(resptype, respdata);
			break;			                   
		case 3004:
			onAreaClear(resptype, respdata, false);
			break;
			
		case 3050:
			onAreaFieldSetItem(resptype, respdata);
			break;
         
		case 3051:	// figure move
			onAreaFieldMoveItem(resptype, respdata);
			break;
		case 3053:	// figure move
			onAreaFieldMoveItemA(resptype, respdata);
			break;
		case 3054:	// figure move
			onItemsAnim(resptype, respdata);
			break;              
		case 3055:	// figure move
			onItemAnim(resptype, respdata);
			break;              
		case 3052:
			onAreaFieldRemoveItem(resptype, respdata);
			break;
		case 3110:	
			setAreaState(resptype, respdata);
			break;
		case 3130:	
			setAreaSize(resptype, respdata);
			break;
		case 3190:	
			setAreaLocation(resptype, respdata);
			break;
		case 3191:	
			setAreaScale(resptype, respdata);
			break;              
		case 3195:	
			setAreaRotation(resptype, respdata);
			break;              

		case 3192:	
			setAreaItemScale(resptype, respdata);
			break;                            
		case 3220:
			onAreaUpdateItems(resptype, respdata);
			break;
		case 3221:
			onAreaUpdateItemsA(resptype, respdata);
			break;
		case 3222:
			onAreaUpdateItem(resptype, respdata, false);
			break;
		case 3223:              
			onAreaInvertItem(resptype , respdata );
			break;
		case 3224:
			onAreaUpdateItem(resptype, respdata, true);
			break;
		case 3225:
			onAreaPushFrontItem(resptype, respdata);
			break;	              
		case 3240:
			areaUpdateForeground(resptype, respdata);
			break;
		case 3250:
			areaUpdateBackground(resptype, respdata);
			break;
		case 3200:
			onAreaUpdateOnclick(resptype, respdata);
			break;
		case 3201:
			onAreaUpdateOnFocusGain(resptype, respdata);
			break;
		case 3202:
			onAreaUpdateOnFocusLost(resptype, respdata);
			break;          
		case 3180:
			areaUpdateText(resptype, respdata);
			break;
		
		case 3120:
			areaUpdateTextColor(resptype, respdata);
			break;			
		case 3400:
			areaSetScrollers(resptype, respdata);
			break;
		case 3210:
			areaAnim(resptype, respdata  , respdata2 , respdata3);
			break;				
		  }		  

        } catch (JSONException e) {
			e.printStackTrace();
        }
	}
	

    private void areaAnim(String areaid, String type, String delay, String data)
    {
    	
        LayoutArea area = getArea(areaid);
        if (area != null) {
        	area.anim(type, delay , data);
        }
    	
    }
	private void onAreaClear(String type, String strData, boolean items) {
        LayoutArea area = getArea(type);
        if (area != null) {
        	area.clear(items);
        }
		
	}
	

	private void onItemsAnim(String type, String strData) {
        LayoutArea area = getArea(type);
        if (area != null) {
        	area.itemsAnim(strData);
        }
		
	}
	private void onItemAnim(String type, String strData) {
        LayoutArea area = getArea(type);
        if (area != null) {
    		StringTokenizer tok = new StringTokenizer(strData, "|");
    		String indexes = tok.nextToken();
    		String animtype = tok.nextToken();

        	area.itemAnim(indexes, animtype);
        }
		
	}



	private void onAreaPushFrontItem(String type, String strData) {
        LayoutArea area = getArea(type);
        if (area != null) {
        	area.pushFrontItem(strData);
        }
		
	}
	private void onAreaUpdateItemsA(String type, String strData) {
        LayoutArea area = getArea(type);
        if (area != null) {
        	area.updateItemsA(strData);
        }
	
    }



	public void onAreaFieldSetItem(String type, String strData) {
        StringTokenizer tok = new StringTokenizer(strData, ",");

        String areaid = tok.nextToken();
        int index = Integer.parseInt(tok.nextToken());
        LayoutArea area = getArea(areaid);
        if (area != null) {
        	area.fieldSetItem(index , type);
        }

    }

    public void onAreaFieldMoveItem(String type, String strData) {
        // areaFrom, indexFrom,  areaTo, indexTo
        StringTokenizer tok = new StringTokenizer(strData, ",");
        String areaFrom = tok.nextToken();
        int indexFrom = Integer.parseInt(tok.nextToken());
        String areaTo = tok.nextToken();
        int indexTo = Integer.parseInt(tok.nextToken());

        moveFigure(areaFrom, indexFrom, areaTo, indexTo);
    }

    public void onAreaFieldMoveItemA(String type, String strData) {
        // areaFrom, indexFrom,  areaTo, indexTo
        StringTokenizer tok = new StringTokenizer(strData, ",");
        String areaFrom = tok.nextToken();
        int indexFrom = Integer.parseInt(tok.nextToken());
        String areaTo = tok.nextToken();
        int indexTo = Integer.parseInt(tok.nextToken());

        String movetype = tok.nextToken();
        String delay = tok.nextToken();
        
        Vector <AreaIndexPair> path = new Vector<AreaIndexPair>();
        while (tok.hasMoreTokens()) {
        	AreaIndexPair p = new AreaIndexPair();
        	p.mArea = tok.nextToken();
        	p.mIndex = Integer.parseInt(tok.nextToken());
        	path.add(p);
        }
        moveFigureA(areaFrom, indexFrom, areaTo, indexTo, movetype, delay, path);
    }

    public void onAreaFieldRemoveItem(String type, String strData) {
        int indexFrom = Integer.parseInt(strData);
        LayoutArea area = getArea(type);
        if (area != null) {
        	area.removeFigure(indexFrom);
        }
    }
    public void onAreaUpdateItems(String type, String strData) {
        LayoutArea area = getArea(type);
        if (area != null) {
        	area.updateItems(strData);
        }
    }
    
    void onAreaInvertItem(String type,  String strData)
    {
        LayoutArea area = getArea(type);
        if (area != null) {
        	area.invertItem(strData);
        }		
    }
    
    private void onAreaUpdateItem(String type, String strData, boolean showback) {
        LayoutArea area = getArea(type);
        if (area != null) {
        	area.updateItem(strData, showback);
        }		
	}
    
    public void moveFigureA(String areaFrom, int indexFrom, String areaTo,
            int indexTo, String movetype, String delay , Vector <AreaIndexPair> path) {
    	//System.out.println(  "moveFigureA " + areaFrom + " " + indexFrom + " "+ areaTo + " " + indexTo);
    	if (indexFrom < 0 || indexTo < 0)
    	{
    		//System.out.println(  "moveFigureA " + areaFrom + " " + indexFrom + " "+ areaTo + " " + indexTo);
    		return;
    	}
        // TODO move animation
        GameonModelRef startAnim = null;
        GameonModelRef endAnim = null;
        LayoutItem item = null;
        LayoutArea arearemove = null;
        LayoutArea areaset = null;

        arearemove = this.getArea(areaFrom);
        areaset = this.getArea(areaTo);
        //
        if (arearemove != null) {
            item = arearemove.getItem(indexFrom);
            if (item == null) {
            	// ERROR
            	//Log.d("model", "error " + areaFrom + " " + indexFrom + " "+ areaTo + " " + indexTo);
            	return;
            }
            startAnim = new GameonModelRef(null);
            
            startAnim.copy( item.mModelRef);
            startAnim.copyMat( item.mModelRef);
            arearemove.removeFigure(indexFrom);
        }
         
        if (item == null) {
        	return;
        }
        
        if (areaset != null) {
        	if (movetype.equals("walk2back"))
        	{
        		areaset.placeFigure(indexTo, item, true);
        	}else
        	{
        		areaset.placeFigure(indexTo, item, false);
        	}
            endAnim = item.mModelRef;
        }

        if (startAnim != null && endAnim != null) {
        
        	mApp.anims().animRef(movetype, startAnim , endAnim, delay);

        }
    }

    public AreaIndexPair onDragNearest(float[] vec, float[] vecHud)
    {
    	return this.findNearest(vec, vecHud, false);
    }
    public AreaIndexPair onClickNearest(float[] vec, float[] vecHud) 
    {
    	return this.findNearest(vec, vecHud, true);
    }
    
    public AreaIndexPair findNearest(float[] vec, float[] vecHud, boolean click)
    {
    	AreaIndexPair nearest =null;    	
    	float mindist = 1e7f;

    	for (int a=mVisibleAreas.size()-1; a>=0 ; a--)
        {
        	LayoutArea ahud = mVisibleAreas.get(a);
        	if (ahud.mActiveItems == 0)
        	{
        		continue;
        	}
        	if (click)
        	{
        		if ( ahud.mOnclick == null || ahud.mOnclick.length() == 0 )
        			continue;
        	}else
        	{
        		if (!ahud.mHasScrollV && !ahud.mHasScrollH)
        		{
        			if ( (ahud.mOnFocusGain== null || ahud.mOnFocusGain.length() == 0) &&  
        			(ahud.mOnFocusLost== null || ahud.mOnFocusLost.length() == 0))
        				continue;
        		}
        	}
        	
        	if (ahud.mDisplay != GameonWorld.Display.HUD )
        	{
        		continue;
        	}
        	AreaIndexPair pair = ahud.fieldClicked(mApp.cs().eyeHud() , vecHud);
        	if (pair != null)
        	{
        		if (pair.mDist <= mindist) {
        			// set nearest
        			nearest = pair;
        			mindist = pair.mDist;
        		}        		
        	}
        }
        if (mindist != 1e7f){
        	return nearest;
        }        
        for (int a=mVisibleAreas.size()-1; a>=0 ; a--)
        {
        	LayoutArea ahud = mVisibleAreas.get(a);
        	if (ahud.mActiveItems == 0)
        	{
        		continue;
        	}
        	
        	if (click)
        	{
        		if ( ahud.mOnclick == null || ahud.mOnclick.length() == 0 )
        			continue;
        	}else
        	{
        		if (!ahud.mHasScrollV && !ahud.mHasScrollH)
        		{
        		
	        		if ( (ahud.mOnFocusGain== null || ahud.mOnFocusGain.length() == 0) &&  
	        			(ahud.mOnFocusLost== null || ahud.mOnFocusLost.length() == 0))
	        			continue;
        		}
        	}
        	if (ahud.mDisplay == GameonWorld.Display.HUD)
        	{
        		continue;
        	}
        	AreaIndexPair pair = ahud.fieldClicked(mApp.cs().eye() , vec);
        	if (pair != null)
        	{
        		if (pair.mDist <= mindist) {
        			// set nearest
        			nearest = pair;
        			mindist = pair.mDist;
        		}        		
        	}
        }        
    	
        if (mindist != 1e7f){
        	return nearest;
        }    	
    	
    	return null;
    }
    
    protected void onCameraFit(String type , String  strData)
    {
        
        if ( type.equals("fit"))
        {
        	StringTokenizer tok =  new StringTokenizer(strData, ",");
        	float canvasw = 0;
        	float canvash = 0;
        	if (tok.hasMoreTokens())
        	{
        		canvasw = Float.parseFloat( tok.nextToken());
        		canvash = Float.parseFloat( tok.nextToken());
        	}

        	float eye[] = { 0.0f,0.0f,1};
            float center[] ={ 0.0f, 0.0f, 0.0f};
            float up[] = { 0.0f, 1.0f, 0.0f };
            mApp.cs().init( canvasw/2 , canvash/2 , 0 );
            float z = mApp.cs().snap_cam_z(eye  ,  center , up); 
            mApp.setScreenBounds();
        }
    }

    void onCameraSet(String lookAt , String  eyeStr)
    {
        
    	StringTokenizer tok =  new StringTokenizer(lookAt, ","); 
        float lookat[] = new float[3];
    	if (tok.hasMoreTokens()) lookat[0] = Float.parseFloat( tok.nextToken());
    	if (tok.hasMoreTokens()) lookat[1] = Float.parseFloat( tok.nextToken());
    	if (tok.hasMoreTokens()) lookat[2] = Float.parseFloat( tok.nextToken());
    		
    	StringTokenizer tok2 =  new StringTokenizer(eyeStr, ","); 
        float eye[] = new float[3];
    	if (tok2.hasMoreTokens()) eye[0] = Float.parseFloat( tok2.nextToken());
    	if (tok2.hasMoreTokens()) eye[1] = Float.parseFloat( tok2.nextToken());
    	if (tok2.hasMoreTokens()) eye[2] = Float.parseFloat( tok2.nextToken());

    	mApp.cs().setCamera(lookat, eye);
    	mApp.setScreenBounds();
    }

    void onCameraFitHud(String type , String  strData)
    {
      
        if ( type.equals("fit"))
        {
        	StringTokenizer tok =  new StringTokenizer(strData, ",");
        	float canvasw = 0;
        	float canvash = 0;
        	if (tok.hasMoreTokens())
        	{
        		canvasw = Float.parseFloat( tok.nextToken());
        		canvash = Float.parseFloat( tok.nextToken());
        	}
        	float eye[] = { 0.0f,0.0f,1};
            float center[] ={ 0.0f, 0.0f, 0.0f};
            float up[] = { 0.0f, 1.0f, 0.0f };
            mApp.cs().init( canvasw/2 , canvash/2 , 0 );
            float z = mApp.cs().snap_cam_z_hud(eye  ,  center , up);
            mApp.setScreenBounds();
        }
    }

    void onCameraSetHud(String lookAt , String  eyeStr)
    {
    	StringTokenizer tok =  new StringTokenizer(lookAt, ","); 
        float lookat[] = new float[3];
    	if (tok.hasMoreTokens()) lookat[0] = Float.parseFloat( tok.nextToken());
    	if (tok.hasMoreTokens()) lookat[1] = Float.parseFloat( tok.nextToken());
    	if (tok.hasMoreTokens()) lookat[2] = Float.parseFloat( tok.nextToken());
    		
    	StringTokenizer tok2 =  new StringTokenizer(eyeStr, ","); 
        float eye[] = new float[3];
    	if (tok2.hasMoreTokens()) eye[0] = Float.parseFloat( tok2.nextToken());
    	if (tok2.hasMoreTokens()) eye[1] = Float.parseFloat( tok2.nextToken());
    	if (tok2.hasMoreTokens()) eye[2] = Float.parseFloat( tok2.nextToken());

    	mApp.cs().setCameraHud(lookat, eye);
    	mApp.setScreenBounds();
    	
    }

    void onCameraProjHud(String fov , String  far, String near)
    {
    	float fovf = Float.parseFloat(fov);
    	
    	float farf = 0;
    	float nearf = 0;
    	nearf = Float.parseFloat( far);
    	farf = Float.parseFloat( near);

    	mApp.view().setFovHud(fovf, nearf, farf);
    	mApp.setScreenBounds();
    	
    }
    
    void onCameraProj(String fov , String  far, String near)
    {
    	float fovf = Float.parseFloat(fov);
    	
    	float farf = 0;
    	float nearf = 0;
    	nearf = Float.parseFloat( far);
    	farf = Float.parseFloat( near);

    	mApp.view().setFov(fovf, nearf, farf);
    	mApp.setScreenBounds();
    }

    
    void setVisibleArea(LayoutArea area , boolean visible)
    {
        Areas areas = mPageIds.get(area.mPageId);
        if (areas == null)
        {
        	return;
        }
        boolean pagevis = areas.mVisible;
        if (visible && pagevis)
        {
        	
            if ( mVisibleAreas.indexOf(area) < 0)
            {
                mVisibleAreas.add(area);
            }
        }else if (!visible && !pagevis){
            if ( mVisibleAreas.indexOf(area) >= 0)
            {
                mVisibleAreas.remove(area);
            }
        }

    }

    void addToPage(LayoutArea area , String pageid)
    {
        if (area == null)
        {
            return;
        }
        
        Areas areas = mPageIds.get(pageid);
        if (areas == null)
        {
            areas = new Areas();
            if (pageid.equals("*"))
            {
            	areas.mVisible = true;
            }
            mPageIds.put( pageid , areas);
        }
        area.mPageId = pageid;
        if (areas.areas.indexOf(area) < 0)
        {
        	areas.areas.add(area);
        	area.mPageVisible = areas.mVisible;
        }
    }


    void showPage(String pageid, String respdata)
    {
        Areas areas = mPageIds.get(pageid);
        
        if (areas == null)
        {
            return;
        }
        //System.out.println(" show page " + pageid);
        areas.mVisible = true;
        for (int a =0 ; a< areas.areas.size(); a++)
        {
            LayoutArea area = areas.areas.get(a);
            if (respdata != null)
            {
                area.initAnim(respdata , false);            
            }            
            area.mDisabledInput = false;
            area.mPageVisible = true;
            area.setInitState();
        }
    }

    void hidePage(String pageid, String respdata)
    {

        Areas areas = mPageIds.get(pageid);
        if (areas == null)
        {
            return;
        }
        
        if (!areas.mVisible)
        {
            return;
        }    
        
        if (respdata != null && areas.mIsHiding)
        {
            return;
        }
        
        
        if (respdata == null)
        {
            areas.mVisible = false;
            areas.mIsHiding = false;
        }else {
            areas.mIsHiding = true;
        }

        
        //areas.mVisible = false;
        int delay = 0;
        for (int a =0 ; a< areas.areas.size(); a++)
        {
            LayoutArea area = areas.areas.get(a);
            if (respdata != null)
            {
                delay = area.initAnim(respdata, true);
                
            }else
            {
            	area.mPageVisible = false;
            	area.setInitState();
            }
            area.disableInput(true);
        }
        
        if (respdata != null)
        {
            mApp.sendExec(Integer.toString(delay) , "Q.layout.hide_('"+pageid+"');");
        }        
    }
    
    void removeArea(LayoutArea area)
    {
    	area.clear(true);
        if ( mVisibleAreas.indexOf(area) >= 0)
        {
        	mVisibleAreas.remove(area);
        }
        if ( mAreas.containsKey(area.mID))
        {
        	mAreas.remove(area);
        }
        if ( mAreasHud.containsKey(area.mID))
        {
        	mAreasHud.remove(area);
        }
        Areas areap = mPageIds.get(area.mPageId);
        areap.areas.remove(area);
   	
        
    }
    
    void onAreaSwapId(String areaid1, String areaid2)
    {
    	LayoutArea area1 = getArea(areaid1);
    	LayoutArea area2 = getArea(areaid2);
    	if (area1 == null || area2 == null)
    	{
    		return;
    	}
        if ( mAreas.containsKey(area1.mID))
        {
        	mAreas.remove(area1);
        }
        if ( mAreas.containsKey(area2.mID))
        {
        	mAreas.remove(area2);
        }
        
    	String id = area1.mID;
    	area1.mID = area2.mID;
    	area2.mID = id;

    	mAreas.put(area1.mID, area1);
    	mAreas.put(area2.mID, area2);
        
    }
    
    void animScreen(String resptype, String respdata)
    {
    	if (resptype.equals("color"))
    	{
    		//"1000,FFFFFFFF,00000000,FFFFFFFF"
    		StringTokenizer tok =  new StringTokenizer(respdata, ",");
    		GLColor color1 = mApp.colors().white;
    		GLColor color2 = mApp.colors().black;
    		GLColor color3 = null;
    		
    		
    		int delay = Integer.parseInt( tok.nextToken() );
    		if (tok.hasMoreElements())
        		color1 = mApp.colors().getColor(tok.nextToken());
    		if (tok.hasMoreElements())
        		color2 = mApp.colors().getColor(tok.nextToken());
    		if (tok.hasMoreElements())
        		color3 = mApp.colors().getColor(tok.nextToken());    
    		
    		mApp.anims().createAnimColor( delay, color1, color2, color3);
    		
    	}
    }
	private void clearPage(String pageid) {
    	Areas areas = mPageIds.get(pageid);
        if (areas == null)
        {
            return;
        }
		
		this.hidePage(pageid, null);
		
		int len = areas.areas.size();
		for (int a=0; a < len; a++)
		{
			LayoutArea area = areas.areas.get(a);
			area.clear(true);
		}
		mPageIds.remove(areas);
	}
    
}
