function Social(qapp)
{
    this.login = function(callback)
    {
        serverko.appendEvent(500, ""  ,callback);    
    }
    
    this.login_ = function(callback)
    {
        serverko.appendEvent_(500  , "" , callback);    
    }
    
    this.submit = function(value, callback)
    {
        serverko.appendEvent(510 , value , callback);       
    }
    
    this.submit_ = function(value, callback)
    {
        serverko.appendEvent_(510 , value , callback);    
    }
    
    this.showscores = function(value , callback)
    {
        serverko.appendEvent(520 , value , callback);       
    }
    
    this.showscores_ = function(value , callback)
    {
        serverko.appendEvent_(520 , value , callback);    
    }
    
    this.reload = function(value , callback)
    {
        serverko.appendEvent(521 , value , callback);       
    }
    
    this.reload_ = function(value , callback)
    {
        serverko.appendEvent_(521 , value , callback);    
    }    
    
}
