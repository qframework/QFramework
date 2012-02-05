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

function ObjectsFactory(app)
{
	this.mApp = app;
	this.mItems = {};
}
	

ObjectsFactory.prototype.get = function(name)
{
	var model = this.mItems[name];
	return model;

}

ObjectsFactory.prototype.addModel = function( name, item)
{
	if ( this.mItems[name] != undefined)
	{
		return;
	}
	this.mApp.mWorld.add(item.mModel);
	item.mModel.mEnabled = true;
	this.mItems[name] =  item;
}

ObjectsFactory.prototype.removeModel = function( name)
{
	if (this.mItems[name] == undefined)
	{
		return;
	}	
	var item = this.mItems[name];

	var model = item.mModel;
	model.setVisible(false);

	delete this.mItems[name];
	this.mApp.mWorld.remove(model);
	// todo check if model hangs on in world
}

ObjectsFactory.prototype.create = function(name, data) 
{
	if ( this.mItems[name] != undefined)
	{
		return;
	}
	
	
	var model = this.mApp.mItems.getFromTemplate(name,data);
	if (model != undefined)
	{
		var item = new LayoutItem(this.mApp);
		item.mModel = model;
		this.addModel(name,item);
	}
}	

ObjectsFactory.prototype.place = function(name, data) 
{
	var item = this.mItems[name];
	if (item == undefined)
	{
		return;
	}
	var model = item.mModel;

	// TODO submodels
	if (model.mRefs.length == 0)
	{
		var ref = new GameonModelRef(model);
		model.addref(ref);
		item.mModelRef = ref;
	}
	// parse loc
	var tok = data.split(",");
	var x =0 ,y =0 ,z =0 ;
	
	if (data.length > 0)x = parseFloat(tok[0]);
	if (data.length > 1)y = parseFloat(tok[1]);
	if (data.length > 2)z = parseFloat(tok[2]);
	item.setPosition2(x,y,z);

}

ObjectsFactory.prototype.scale = function(name, data) 
{
	var item = this.mItems[name];
	if (item == undefined)
	{
		return;
	}
	var model = item.mModel;

	
	// TODO submodels
	if (model.mRefs.length == 0)
	{
		var ref = new GameonModelRef(model);
		model.addref(ref);
	}
	// parse loc
	var tok = data.split(",");
	var x =0 ,y =0 ,z =0 ;
	
	if (data.length > 0)x = parseFloat(tok[0]);
	if (data.length > 1)y = parseFloat(tok[1]);
	if (data.length > 2)z = parseFloat(tok[2]);
	var r = model.ref(0);
	r.setScale(x, y, z);
	r.set();
}

ObjectsFactory.prototype.texture = function(name, data) 
{
	var item = this.mItems[name];
	if (item == undefined)
	{
		return;
	}
	
	var model = item.mModel;
	
	var text = this.mApp.mTextures.getTexture(data);
	model.setTexture(text);
}
//TODO mutliple references with name.refid , default 0!

ObjectsFactory.prototype.state = function(name, data) 
{
	var item = this.mItems[name];
	if (item == undefined)
	{
		return;
	}
	
	var model = item.mModel;

	var visible = false;
	if (data == "visible")
	{
		visible = true;
	}
	if (model.mRefs.length == 0)
	{
		this.place(name, "0,0,0");
	}
	
	model.ref(0).setVisible(visible);
	model.setVisible(visible);
}


ObjectsFactory.prototype.remove = function(name, data) 
{
	var item = this.mItems[name];
	if (item == undefined)
	{
		return;
	}
	var model = item.mModel;
	this.removeModel(name);
}		


ObjectsFactory.prototype.initObjects = function(response)
{
	var areas;
	areas = response["object"];
	for (var a=0; a< areas.length; a++)
	{
		//ServerkoAreaData* pCurr = [response.mAreaDatas objectAtIndex:a];
		var pCurr = areas[a];
		this.processObject(pCurr);
	}	

}

ObjectsFactory.prototype.processObject = function( objData) {
	var name = objData["name"];
	var template = objData["template"];
	this.create(name , template);
	
	if (objData["location"] != undefined)
	{	        
		var data = objData["location"];    
		this.place(name, data);
	}
	
	if (objData["bounds"] != undefined)
	{	        
		var data = objData["bounds"];    
		this.scale(name, data);
	}
	
	if (objData["texture"] != undefined)
	{	        
		var data = objData["texture"];    
		this.texture(name, data);
	}
	
	if (objData["state"] != undefined)
	{	        
		var data = objData["state"];    
		this.state(name, data);
	}	

}

