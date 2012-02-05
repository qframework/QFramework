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

function ItemFactory( app) 
{

    this.mApp = app;

	this.mInitialized = false;

	this.mModels = {};

	this.mWorld = app.mWorld;

}

ItemFactory.prototype.create = function()
{
	
}

ItemFactory.prototype.createItem = function(type, item)
{
	var tok = type.split(".");
	
	var imageset = tok[0];
	var model = this.mModels[imageset];
	
	if (model == undefined) {
		return undefined;
	}
	
	var  imageid = -1;
	if (tok.length> 1)
		imageid = parseInt(tok[1]);
	
	return this.createItemFromModel(model, imageid, item);

}


ItemFactory.prototype.createItemFromModel = function(model, itemID, item)
{
	var fig = item;
	if (fig == undefined)
	{
		fig = new LayoutItem(this.mApp);
	}
	fig.mType = model.mModelTemplate;
	fig.mModel = model;
	fig.mItemID = itemID;
	fig.mOwner = itemID;
	fig.mOwnerMax = model.mSubmodels;
	

	return fig;
	
}

ItemFactory.prototype.createCard52 = function(itemID, data, item) {
	var fig = item;
	if (fig == undefined)
	{
		fig = new LayoutItem();
	}
	fig.mType = GameonModelData_Type.CARD52; 
	fig.mModel = this.mCard52;
	fig.mItemID = itemID;

	fig.mOwner = itemID;
	fig.mOwnerMax = 64;
	
	return fig;
}


ItemFactory.prototype.newFromTemplate = function(strType, strData) {
	var model = this.getFromTemplate(strType, strData);
	if (model != undefined)
	{
		this.mModels[strType] = model;
	}
}

ItemFactory.prototype.getFromTemplate = function(strType, strData) {
	var model = new GameonModel(strData , this.mApp);
	if (strData == "cube")
	{
		var model = this.createFromType(GameonModelData_Type.CUBE, this.mApp.mColors.white, this.mApp.mTextures.mTextureDefault);
		model.mModelTemplate = GameonModelData_Type.CUBE;
		model.mIsModel = true;
		return model;
		
	}else
	if (strData == "sphere")
	{
		var model = this.createFromType(GameonModelData_Type.SPHERE, this.mApp.mColors.white, this.mApp.mTextures.mTextureDefault);
		model.mModelTemplate = GameonModelData_Type.SPHERE;
		model.mIsModel = true;
		return model;
		
	}		
	if (strData == "cylinder")
	{
		model.createModel(GameonModelData_Type.CYLINDER, TextureFactory.mTextureDefault);
		model.mModelTemplate = GameonModelData_Type.SFIGURE;
		model.mIsModel = true;
	} else if (strData == "plane")
	{
		model.createPlane(-0.5,-0.5,0.0,0.5, 0.5,0.0, this.mApp.mColors.white);
		model.mModelTemplate = GameonModelData_Type.SFIGURE;
		model.mIsModel = true;
	} else if (strData == "dicemodel")
	{
		model.createModel(GameonModelData_Type.DICE, TextureFactory.mTextureDefault);
		model.mModelTemplate = GameonModelData_Type.DICE;
		model.mIsModel = true;
	} else if (strData == "card52")
	{
		model.createCard2(-0.5,-0.5,0.0,0.5, 0.5,0.0, this.mApp.mColors.transparent);
		model.mModelTemplate = GameonModelData_Type.CARD52;
		model.mForceHalfTexturing = true;
		model.mForcedOwner = 32;   
		model.mHasAlpha = true;
		model.mIsModel = true;
	} else if (strData == "cardbela")
	{
		model.createCard(-0.5,-0.5,0.0,0.5, 0.5,0.0, this.mApp.mColors.transparent);
		model.mModelTemplate = GameonModelData_Type.CARD52;
		model.mForceHalfTexturing = true;
		model.mForcedOwner = 32;   
		model.mHasAlpha = true;
		model.mIsModel = true;
	}else if (strData == "background")
	{
		model.createPlane(-0.5,-0.5,0.0,0.5, 0.5,0.0, this.mApp.mColors.white);
		model.mModelTemplate = GameonModelData_Type.BACKGROUND;
		model.mHasAlpha = true;
		model.mIsModel = false;
	} else
	{
		return undefined;
	}
	
	return model;

}

ItemFactory.prototype.setTexture = function(strType, strData) {
	// get object
	var model = this.mModels[strType];
	if (model == undefined) {
		return;
	}
	
	var offsetx = 0, offsety = 0;
	var texture = undefined;
	var tok = strData.split(";");
	
	if (tok.length == 1)
	{
		// no offset
		texture = strData;
	}else {
		texture = tok[0];
		var offset = tok[1];
		var tok2 =  offset.split(",");
		offsetx = tok2[0];
		offsety = tok2[1];
	}
	
	model.mTextureID = this.mApp.mTextures.getTexture(texture);
	model.setTextureOffset(offsetx, offsety);
}

ItemFactory.prototype.createModel = function(strType, strData) {
	// get object
	var model = this.mModels[strType];
	if (model == undefined) {
		return;
	}
	model.mIsModel = true;
	this.mWorld.add(model);
}	

ItemFactory.prototype.setSubmodels = function(strType, strData) {
	// get object
	var model = this.mModels[strType];
	if (model == undefined) {
		return;
	}
	var vals = [0,0];
	var count = ServerkoParse.parseIntArray(vals,strData);
	if (count == 1)
	{
		model.mSubmodels = vals[0];
	}
	else
	{
		model.mSubmodels = vals[0];
		model.mForcedOwner = vals[1];
	}
	
}		

ItemFactory.prototype.createFromType = function(template, color, texture) 
{
	var model = new GameonModel("template" , this.mApp);

	if (template == GameonModelData_Type.SFIGURE)
	{
		model.createModel(GameonModelData_Type.CYLINDER, TextureFactory.mTextureDefault);
		model.mModelTemplate = GameonModelData_Type.SFIGURE;
		model.mIsModel = true;
	} else if (template == GameonModelData_Type.CUBE)
	{
		model.createModel(GameonModelData_Type.CUBE, TextureFactory.mTextureDefault);
		model.mModelTemplate = GameonModelData_Type.CUBE;
		model.mIsModel = true;
	} else if (template == GameonModelData_Type.SPHERE)
	{
		model.createModel(GameonModelData_Type.SPHERE, TextureFactory.mTextureDefault);
		model.mModelTemplate = GameonModelData_Type.SPHERE;
		model.mIsModel = true;
	}else if (template == GameonModelData_Type.CARD52)
	{
		model.createCard2(-0.5,-0.5,0.0,0.5, 0.5,0.0, this.mApp.mColors.transparent);
		model.mModelTemplate = GameonModelData_Type.CARD52;
		model.mForceHalfTexturing = true;
		model.mForcedOwner = 32;   
		model.mHasAlpha = true;
		model.mIsModel = true;
	} else if (template == GameonModelData_Type.BACKGROUND)
	{
		model.createPlane(-0.5,-0.5,0.0,0.5, 0.5,0.0, color);
		model.mModelTemplate = GameonModelData_Type.BACKGROUND;
		model.mForceHalfTexturing = false;
		model.mHasAlpha = false;
		model.setTexture(texture);
	} else if (template == GameonModelData_Type.BACKIMAGE)
	{
		model.createPlane2(-0.5,-0.5,0.0,0.5, 0.5,0.0, color);
		model.mModelTemplate = GameonModelData_Type.BACKGROUND;
		model.mForceHalfTexturing = false;
		model.mHasAlpha = false;
		model.setTexture(texture);
	}
	
	return model;

}

ItemFactory.prototype.initModels = function(response)
{
	var areas;
	areas = response["model"];
	for (var a=0; a< areas.length; a++)
	{
		//ServerkoAreaData* pCurr = [response.mAreaDatas objectAtIndex:a];
		var pCurr = areas[a];
		this.processObject(pCurr);
	}	

}

ItemFactory.prototype.processObject = function( objData) {
	var name = objData["name"];
	var template = objData["template"];
	this.newFromTemplate(name , template);
	
	if (objData["texture"] != undefined)
	{	        
		var data = objData["texture"];    
		this.setTexture(name, data);
	}

	if (objData["texture"] != undefined)
	{	        
		var data = objData["texture"];    
		this.setTexture(name, data);
	}
	
	if (objData["submodels"] != undefined)
	{	        
		var data = objData["submodels"];    
		this.setSubmodels(name, data);
	}	
		
	this.createModel(name,"");

}
