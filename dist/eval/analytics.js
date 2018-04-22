(function(){
    var analyticsClass = function(){
       var DOMcFPS = document.getElementById('cFps').childNodes[1],
           DOMcProc = document.getElementById('cProcessed').childNodes[1],
           DOMcPerf = document.getElementById('cPerfomance').childNodes[1];
           DOMcBLU = document.getElementById('cBlues').childNodes[1];
           DOMcRED = document.getElementById('cReds').childNodes[1];

       function analyticsOut(){
           DOMcFPS.textContent = 'FPS: ' + Math.round((1000/500)*this.fpsCnt);
           this.fpsCnt = 0;
           DOMcPerf.textContent = 'PERF(ms): ' + (this.perfCalc/(this.procCnt||1)).toFixed(1);
           this.perfCalc = 0;
           DOMcProc.textContent = 'PROC: ' + Math.round((1000/500)*this.procCnt);
           this.procCnt = 0;
           DOMcBLU.textContent = 'BLU: ' + this.blues;
           DOMcRED.textContent = 'RED: ' + this.reds;
       }; 
       var _this = this;
       setInterval(function(){analyticsOut.call(_this)},500);
       var begInterval;
       this.fpsCnt = 0;
       this.procCnt = 0;
       this.perfCalc = 0;
       this.blues = 0;
       this.reds = 0;
       this.incFps = function(){this.fpsCnt++};
       this.incProc = function(){this.procCnt++};
       this.startPoint = function(){
           begInterval = performance.now();
       };
       this.endPoint = function(){
           this.perfCalc += (performance.now() - begInterval);
       };
   };

   analytics = new analyticsClass();

})();