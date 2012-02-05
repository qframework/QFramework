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

import java.util.Vector;
import javax.media.opengl.GL;
import javax.media.opengl.GL2;



public class TextRender {

	protected Vector<TextItem>	mTexts = new Vector<TextItem>();
	protected Vector<TextItem>	mVisibleTexts = new Vector<TextItem>();
	private GameonWorld 	mWorld;

	public TextRender(GameonWorld world)
	{
		mWorld = world;
	}
	public void remove(TextItem item) {
		if ( mTexts.contains(item))
		{
			mTexts.remove(item);
			removeVisible(item);
		}
	}
	
	public void add(TextItem item, boolean visible) {
		if (!mTexts.contains(item)) {
			mTexts.add(item);
		}
		if (visible)
		{
			addVisible(item);
		}
	}
	
	public void render(GL2 gl) {
		int len = mVisibleTexts.size();
		if (len == 0)
			return;

		for(int a=0; a< len ;a++) {
			TextItem item = mVisibleTexts.get(a);
			item.draw(gl , a);
		}
	}

	public void clear() {
		mTexts.clear();
	}

	public void addVisible(TextItem textItem) {
		if (mVisibleTexts.indexOf(textItem) < 0)
		{
			mVisibleTexts.add(textItem);
		}
		
	}

	public void removeVisible(TextItem textItem) {
		if (mVisibleTexts.indexOf(textItem) >= 0)
		{
			mVisibleTexts.remove(textItem);
		}		
		
	}

}
