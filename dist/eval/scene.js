(function () {

    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    //min<=RESULT<=max
    window.getRandom = function (min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    };

    window.calcGenom = function (hive) {
        var res = {};
        hive.forEach(function (unit) {
            if (!unit) return;
            var lSign = '' + unit.sign;
            if (!res[lSign]) res[lSign] = 0;
            res[lSign]++;
        });
        for (var lSign in res) {
            console.log(lSign + ':' + res[lSign]);
        }
    };

    var _step = 10,
        _bWidth = 2;

    curTime = 0;

    window.scene = {
        canvas: undefined,
        ctx: undefined,
        fwidth: 640,
        fheight: 480,
        blues: new amebaHiveClass(3070),
        reds: new amebaHiveClass(3070),
        delUnits: [],

        selUnit: undefined,
        curUnit: undefined,
        runing: false,
        //curTime: 0,
        addBlue: function (args) {
            //if(this.blues.unitsCount < this.maxBlues) {
            //var args = args || {};//{'x':x,'y':y,'curTime':curTime,'genMin':8,'genMax':10};
            var newAmeba = new blueAmeba(args);
            this.blues.push(newAmeba);
            bField().cellValue(newAmeba.x, newAmeba.y, newAmeba);
            //};
            analytics.blues = this.blues.unitsCount;
        },
        addRed: function (args) {
            //if(this.reds.unitsCount < this.maxReds) {
            //var args = args || {};//{'x':x,'y':y,'curTime':curTime,'genMin':8,'genMax':10};
            var newAmeba = new redAmeba(args);
            this.reds.push(newAmeba);
            bField().cellValue(newAmeba.x, newAmeba.y, newAmeba);
            //};
            analytics.reds = this.reds.unitsCount;
        },
        deleteUnit: function (lUnit) {

            this.delUnits.push({ 'x': lUnit.x, 'y': lUnit.y });

            lUnit.update = true;
            var env = bField().getNeighbours(lUnit.x, lUnit.y);
            for (var i = 0; i < env.length; i++) {
                env[i].clamped = false;
                env[i].update = true;
            }

            if (lUnit.constructor == blueAmeba) this.blues.splice(lUnit._index);
            else this.reds.splice(lUnit._index);
            bField().cellValue(lUnit.x, lUnit.y, undefined);
        },
        addNew: function (lUnit) {

            if (lUnit.health <= 0) return;

            //lUnit.clamped = true;

            var lContainer;
            if (lUnit.constructor == blueAmeba) {
                lContainer = this.blues;
                //if(!(lContainer.unitsCount < this.maxBlues)) return;
            }
            else {
                lContainer = this.reds;
                //if(!(lContainer.unitsCount < this.maxReds)) return;
            };

            var env = bField().getEnvironment(lUnit.x, lUnit.y);
            var newAmeba = lUnit.split(env);
            if (!newAmeba) return;
            //if(newAmeba.sign == -1) {
            //    newAmeba.sign = lContainer.nexSign;
            //    lContainer.nexSign++;
            //};
            if (lContainer.push(newAmeba) == -1) return;

            bField().cellValue(newAmeba.x, newAmeba.y, newAmeba);

            lUnit.clamped = true;
            lUnit.update = true;
            for (var i = 0; i < env.length; i++) {
                if (env[i].val == undefined) {
                    lUnit.clamped = false;
                    lUnit.update = true;
                    break;
                }
                else
                    if (env[i].val.col != lUnit.col) {
                        lUnit.clamped = false;
                        lUnit.update = true;
                        break;
                    }
            };

            if (!newAmeba) return;

            analytics.blues = this.blues.unitsCount;
            analytics.reds = this.reds.unitsCount;

            var env = bField().getNeighbours(newAmeba.x, newAmeba.y);
            for (var i = 0; i < env.length; i++) {
                env[i].clamped = false;
                env[i].update = true;
            }
        },
        combat: function (lUnit) {

            if ((lUnit.health <= 0) || (lUnit.nextStrike > curTime)) return;//still charging...

            var env = bField().getNeighbours(lUnit.x, lUnit.y);
            if (!env.length) return;//the surrounding area is empty

            var lEnv = env.length,
                enemy = [];

            for (var i = 0; i < lEnv; i++) {
                if (env[i].col != lUnit.col) enemy.push(env[i]);
            };

            if (!enemy.length) return;

            lUnit.fight(enemy);
            enemy.forEach(unit => {
                if (unit.health <= 0) this.deleteUnit(unit);
            });

            lUnit.nextStrike = curTime + lUnit.pace;
        },
        drawGrid: function () {
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#ccc';
            for (var i = _step; i < this.fwidth; i += _step) {
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, this.fheight);
            }
            for (var i = _step; i < this.fheight; i += _step) {
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(this.fwidth, i);
            }
            this.ctx.stroke();
        },
        signLogo: {
            '_1': {
                x: 3,
                y: 3
            },
            '_2': {
                x: _step / 2,
                y: 3
            },
            '_3': {
                x: _step - 3,
                y: 3
            },
            '_4': {
                x: 3,
                y: _step / 2
            },
            '_5': {
                x: _step - 3,
                y: _step / 2
            },
            '_6': {
                x: 3,
                y: _step - 3
            },
            '_7': {
                x: _step / 2,
                y: _step - 3
            },
            '_8': {
                x: _step - 3,
                y: _step - 3
            }
        },
        drawUnit: function (unit) {

            if (unit == undefined || !unit.update) return;

            this.ctx.lineWidth = _bWidth;
            this.ctx.fillStyle = unit.col;
            this.ctx.fillRect(unit.x * _step, unit.y * _step, _step, _step);

            if (unit.hover) this.ctx.strokeStyle = 'cyan';
            else
                if (unit.selected) this.ctx.strokeStyle = 'yellow';
                else this.ctx.strokeStyle = 'black';

            this.ctx.strokeRect(unit.x * _step + 1, unit.y * _step + 1, _step - 1, _step - 1);

            sLogo = this.signLogo['_' + unit.sign];
            if (sLogo) this.ctx.strokeRect(unit.x * _step + sLogo.x, unit.y * _step + sLogo.y, 1, 1);

            unit.update = false;
        },
        draw: function () {
            var _this = this;

            this.blues.forEach(function (element) { _this.drawUnit(element) });
            this.reds.forEach(function (element) { _this.drawUnit(element) });
            this.delUnits.forEach(function (element) {
                _this.ctx.clearRect(element.x * _step + 1, element.y * _step + 1, _step - 1, _step - 1);
            });
            this.delUnits = [];
        },
        mark: function (x, y) {
            var unit = bField().getValue(x, y);
            if (this.selUnit) {
                this.selUnit.hover = false;
                this.selUnit.update = true;
            };
            this.selUnit = unit;
            if (this.selUnit) {
                this.selUnit.hover = true;
                this.selUnit.update = true;
            };
        },
        animate: function (startTime) {
            // update
            var time = (new Date()).getTime() - startTime,
                _this = this;
            //if(this.runing) 
            this.draw();

            analytics.incFps();
            // request new frame
            requestAnimFrame(function () {
                _this.animate(startTime);
            });
        },
        init: function () {
            this.canvas.width = this.fwidth;
            this.canvas.height = this.fheight;
            bField().init(this.fwidth / _step, this.fheight / _step);

            this.ctx = this.canvas.getContext('2d');

            var args = { 'genMin': 8, 'genMax': 10 };

            args.x = getRandom(0, 31);
            args.y = getRandom(0, 47);
            this.addBlue(args);

            args.x = getRandom(0, 41);
            args.y = getRandom(0, 47);
            this.addRed(args);

            args.strikes = 1;
            args.gen = { F: 1, S: 0 };

            args.genMin = 6;
            args.genMax = 8;
            args.x = getRandom(32, 63);
            args.y = getRandom(0, 47);
            this.addBlue(args);

            args.genMin = 7;
            args.genMax = 9;
            args.x = getRandom(32, 63);
            args.y = getRandom(0, 47);
            this.addRed(args);

            //scene.blues[0].strikes = 1;
            //scene.blues[0].gen = {F:1,S:0};
            //scene.blues.nexSign = 2;

            //scene.blues[1].genMin = 6;
            //scene.blues[1].genMax = 8;

            //scene.reds[0].strikes = 1;
            //scene.reds[0].gen = {F:1,S:0};
            //scene.reds.nexSign = 2;
            //
            //scene.reds[1].genMin = 7;
            //scene.reds[1].genMax = 9;

            this.drawGrid();
            this.draw();
            var _this = this;

            setTimeout(function () {
                var startTime = (new Date()).getTime();
                _this.animate(startTime);
            }, 1000);

            setInterval(function () {
                if (!_this.runing) return;

                curTime++;

                analytics.incProc();
                analytics.startPoint();

                _this.blues.forEach(function (element) {
                    if (!element) return;

                    if (element.endTime < curTime) {
                        element.health = 0;
                        _this.deleteUnit(element);
                        return;
                    };

                    if (element.clamped) return;
                    if (element.nextSplit < curTime) {
                        element.nextSplit = curTime + element.genSpeed;
                        _this.addNew(element);
                    };
                    _this.combat(element);
                });
                _this.reds.forEach(function (element) {
                    if (!element) return;

                    if (element.endTime < curTime) {
                        element.health = 0;
                        _this.deleteUnit(element);
                        return;
                    };

                    if (element.clamped) return;
                    if (element.nextSplit < curTime) {
                        element.nextSplit = curTime + element.genSpeed;
                        _this.addNew(element);
                    };
                    _this.combat(element);
                });

                analytics.endPoint();

            }, 100);
        }
    };

    scene.canvas = document.getElementById("example");
    scene.canvas.onmousemove = function () {
        var lx = Math.round(arguments[0].offsetX / 10 - 0.8),
            ly = Math.round(arguments[0].offsetY / 10 - 0.8);
        if (lx < 0 || lx > 63 || ly < 0) return;
        scene.mark(lx, ly);
    };
    scene.canvas.onclick = function () {
        if (scene.selUnit) {
            if (scene.curUnit) {
                scene.curUnit.selected = false;
                scene.curUnit.update = true;
            };
            scene.selUnit.selected = true;
            scene.selUnit.update = true;
            scene.curUnit = scene.selUnit;
            scene.curUnit.output();
        };
    };
    scene.init();

})();