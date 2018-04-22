bField = function(){

    var instance;
    bField = function(){return instance;};
    bField.prototype = this;
    instance = new bField();
    instance.constructor = bField;

    var _maxX = 0,
        _maxY = 0;
    var aField = new Array();

    instance.isPointFree = function(x,y){
        return aField[x][y] == undefined;
    };

    instance.isEnemy = function(x,y,col){
        return this.isPointFree(x,y)? false : aField[x][y].col != col;
    };

    instance.checkCell = function(x,y,col){
        var maxX = x+1>(_maxX-1)? x : x+1,
            minX = x-1<0? x : x-1,
            maxY = y+1>(_maxY-1)? y : y+1,
            minY = y-1<0? y : y-1;
        return this.isPointFree(x,y)  
    };

    instance.getNeighbours = function(x,y){
        var maxX = x+1>(_maxX-1)? x : x+1,
            minX = x-1<0? x : x-1,
            maxY = y+1>(_maxY-1)? y : y+1,
            minY = y-1<0? y : y-1,
            res = [];

        for (var i = minX; i <= maxX; i++)
            for (var j = minY; j <= maxY; j++) {
                if(i == x && j == y) continue;
                var lCell = aField[i][j];
                if(lCell != undefined) res.push(lCell);
            }

        return res;
    };

    instance.getEnvironment = function(x,y){
        var maxX = x+1>(_maxX-1)? x : x+1,
            minX = x-1<0? x : x-1,
            maxY = y+1>(_maxY-1)? y : y+1,
            minY = y-1<0? y : y-1,
            res = [];

        for (var i = minX; i <= maxX; i++)
            for (var j = minY; j <= maxY; j++) {
                if(i == x && j == y) continue;
                res.push({'x':i,'y':j,'val':aField[i][j]});
            }

        return res;
    };

    instance.init = function(dimX,dimY){
        _maxX = dimX;
        _maxY = dimY;
        aField = new Array(dimX);
        for(var i=0; i<dimX; i++) aField[i] = new Array(dimY);
    };

    instance.cellValue = function(x,y,unit){
        aField[x][y] = unit;
    };

    instance.getValue = function(x,y,unit){
        return aField[x][y];
    };

    instance.dimX = function(){return _maxX};
    instance.dimY = function(){return _maxY};

    return instance;
};
