(function () {

    function inherit(proto) {
        function f() { };
        f.prototype = proto;
        return new f;
    };

    var genomMixer = function () {
        var instance,
            genStorage = [],
            genProperties = {
                strikes: true,
                force: true,
                pace: true,
                genMin: true,
                genMax: true,
                minHealth: true,
                maxHealth: true,
                minLife: true,
                maxLife: true
            };
        this.genProperties = genProperties;
        genomMixer = function () { return instance };
        genomMixer.prototype = this;
        instance = new genomMixer();
        instance.constructor = genomMixer;

    };

    genomMixer.prototype.isEqual = function (gen1, gen2) {
        for (var prop in this.genProperties) {
            if (gen1[prop] != gen2[prop]) {
                return false;
            };
        }

        return true;
    };

    genomMixer.prototype.genomID = function (gen) {
        var result = '',
            val;
        for (var prop in this.genProperties) {
            if (!gen[prop]) val = '0';
            else val = '' + gen[prop];
            result += prop + val;
        };

        return result;
    };

    genomMixer.prototype.make = function (gen1, gen2) {
        var res;
        res = {
            col: gen1.col,
            strikes: gen1.strikes,
            force: gen1.force,
            pace: gen1.pace,
            genMin: gen1.genMin,
            genMax: gen1.genMax,
            minHealth: gen1.minHealth,
            maxHealth: gen1.maxHealth,
            minLife: gen1.minLife,
            maxLife: gen1.maxLife,
            sign: gen1.sign,
            gen: gen1.gen
        };

        //S+
        if (gen1.gen.F) {
            res.strikes = Math.max(res.strikes, gen2.strikes);
            res.force = Math.max(res.force, gen2.force);
            res.pace = Math.max(res.pace, gen2.pace);
        }
        //S-
        else {
            res.strikes = Math.min(res.strikes, gen2.strikes);
            res.force = Math.min(res.force, gen2.force);
            res.pace = Math.min(res.pace, gen2.pace);
        };

        //H+
        if (gen2.gen.F) {
            if (res.maxHealth < gen2.maxHealth) {
                res.minHealth = gen2.minHealth;
                res.maxHealth = gen2.maxHealth;
            }
        }
        //H-
        else {
            if (gen2.minHealth < res.minHealth) {
                res.minHealth = gen2.minHealth;
                res.maxHealth = gen2.maxHealth;
            }
        };

        //A+
        if (gen1.gen.S) {
            if (res.maxLife < gen2.maxLife) {
                res.minLife = gen2.minLife;
                res.maxLife = gen2.maxLife;
            }
        }
        //A-
        else {
            if (gen2.minLife < res.minLife) {
                res.minLife = gen2.minLife;
                res.maxLife = gen2.maxLife;
            }
        };

        //G+
        if (gen2.gen.S) {
            if (res.genMin > gen2.genMin) {
                res.genMin = gen2.genMin;
                res.genMax = gen2.genMax;
            }
        }
        //G-
        else {
            if (res.genMax < gen2.genMax) {
                res.genMin = gen2.genMin;
                res.genMax = gen2.genMax;
            }
        };

        //var resID = this.genomID(res);
        //if(this.isEqual(res,gen1)){
        //    res.sign = gen1.sign;
        //}
        //else
        //if(this.isEqual(res,gen2)){
        //    res.sign = gen2.sign;
        //}
        //else 
        res.sign = -1;//new sign

        return res;
    };

    var genMixer = new genomMixer();

    var amebaClass = function (args) {
        var args = args || {};

        this.col = args.col || '#C80000';

        this.hover = false;
        this.selected = false;
        this.clamped = false;
        this.update = true;
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.sign = -1,//args.sign || 0;

        this.genMin = args.genMin || 8,
        this.genMax = args.genMax || 10;
        this.genSpeed = getRandom(this.genMin, this.genMax);

        this.minHealth = args.minHealth || 4;
        this.maxHealth = args.maxHealth || 5;
        this.health = getRandom(this.minHealth, this.maxHealth);//args.health || 5;

        this.minLife = args.minLife || 300;
        this.maxLife = args.maxLife || 350;

        this.strikes = args.strikes || 0;
        this.force = args.force || 2;
        this.pace = args.pace || 5;

        this.nextSplit = (curTime || 0) + this.genSpeed;
        this.nextStrike = (curTime || 0) + this.pace;
        this.endTime = (curTime || 0) + getRandom(this.minLife, this.maxLife);

        this.gen = args.gen || {
            F: 0,
            S: 1
        };
    };


    amebaClass.prototype.getGenom = function (neibs) {
        var res;
        if (neibs.length) {
            res = genMixer.make(this, neibs[0]);
        }
        else res = {
            col: this.col,
            strikes: this.strikes,
            force: this.force,
            pace: this.pace,
            genMin: this.genMin,
            genMax: this.genMax,
            minHealth: this.minHealth,
            maxHealth: this.maxHealth,
            minLife: this.minLife,
            maxLife: this.maxLife,
            sign: this.sign,
            gen: this.gen
        };

        return res;
    };

    amebaClass.prototype.split = function (envire) {

        if (!envire || !envire.length) return;

        var freeCells = [];
        var neibs = [];
        for (var i = 0; i < envire.length; i++) {
            if (!envire[i].val) 
                freeCells.push(envire[i]);
            else
                if (envire[i].val.col == this.col && envire[i].val.sign != this.sign) 
                    neibs.push(envire[i].val);
        };

        if (!freeCells.length) return;

        var selCell;
        if (freeCells.length == 1) selCell = freeCells[0];
        else selCell = freeCells[getRandom(0, freeCells.length - 1)];

        var lGenom = this.getGenom(neibs);
        lGenom.x = selCell.x;
        lGenom.y = selCell.y;
        return new this.constructor(lGenom);
    };

    amebaClass.prototype.fight = function (enemy) {
        var len = Math.min(this.strikes, enemy.length || 0)
        for (var i = 0; i < len; i++) {
            var unit = enemy[i];
            if (unit.health > 0) {
                unit.health -= this.force;
            }
        };
    };

    amebaHiveClass = function (max) {
        var freeIndexes = [],
            genomSamples = {},
            nextSign = 0,
            maxItems = max || 0;

        this.push = function () {
            var index,
                unit = arguments[0];

            if (!unit) return;

            if (unit.sign == -1) {
                var curID = genMixer.genomID(unit),
                    curSign = genomSamples[curID];
                if (curSign === undefined) {
                    curSign = nextSign;
                    nextSign++;
                    genomSamples[curID] = curSign;
                };
                unit.sign = curSign;
            };

            if (freeIndexes.length) {
                index = freeIndexes.pop();
                this[index] = unit;
                unit._index = index;
            }
            else {
                if (maxItems && this.length >= maxItems) return -1;
                index = Array.prototype.push.apply(this, arguments);
                unit._index = index - 1;
            };

            //bField().cellValue(unit.x,unit.y,unit);

            this.unitsCount++;
            return index;
        };

        this.splice = function () {

            if (arguments[1] != 1 && arguments[1] != undefined) throw 'Ameba hive splice ERROR';

            var unit = this[arguments[0]];
            //bField().cellValue(unit.x,unit.y,undefined);
            freeIndexes.push(arguments[0]);
            this[arguments[0]] = undefined;
            this.unitsCount--;
        };

        this.unitsCount = 0;
    };
    amebaHiveClass.prototype = inherit(Array.prototype);
    //amebaHiveClass.prototype.

    blueAmeba = function (args) {
        args.col = '#3B83F4';
        amebaClass.call(this, args);
    };

    blueAmeba.prototype = inherit(amebaClass.prototype);
    blueAmeba.prototype.constructor = blueAmeba;

    redAmeba = function (args) {
        args.col = '#C83131';
        amebaClass.call(this, args);
    };

    redAmeba.prototype = inherit(amebaClass.prototype);
    redAmeba.prototype.constructor = redAmeba;

})();
