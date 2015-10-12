var Macro = (function(JXG, MacroLib) {
  'use strict';
  var brd1;

  function init() {
    MacroLib.init(MacroLib.ONE_BOARD);
    ////////////
    // BOARD 1
    ////////////
    var bboxlimits = [-1.5, 12, 12, -1];
    brd1 = JXG.JSXGraph.initBoard('jxgbox1', {axis:false,
                                            showCopyright: false,
                                            showNavigation: false,
                                            zoom: false,
                                            pan: false,
                                            boundingbox:bboxlimits,
                                            grid: false,
                                            hasMouseUp: true,
    });

    var xaxis1 = brd1.create('axis', [[0, 0], [11, 0]], {withLabel: false});
    var yaxis1 = brd1.create('axis', [[0, 0], [0, 11]], {withLabel: false});

    //Axes
    xaxis1.removeAllTicks();
    yaxis1.removeAllTicks();
    var xlabel1 = brd1.create('text',[-1.2,10,"Price<br>Level"],{fixed:true});
    var ylabel1 = brd1.create('text',[9,-0.5,"Real GDP"],{fixed:true});

    //Supply Line 1 - fixed
    var SRAS1 = MacroLib.createSupply(brd1,{name:'SRAS<sub>1</sub>',color:'DodgerBlue'});
    SRAS1.setAttribute({'dash':0,'fixed':true,'highlight':false});

    //Demand Line 1 - fixed
    var AD1 = MacroLib.createDemand(brd1,{name:'AD<sub>1</sub>',color:'Orange'});
    AD1.setAttribute({'dash':0,'fixed':true,'highlight':false});

    ////////////
    // Intersection Box 1
    ////////////
    var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {visible:false});

    ////////////
    // Fixed Dashed Lines for Board 1
    ////////////
    var dashesFixedB1 = MacroLib.createDashedLines2Axis(brd1,iSDfix,
                                              {withLabel:true,
                                               xlabel:'Y<sub>1</sub>',
                                               ylabel:'PL<sub>1</sub>',
                                               color:'DodgerBlue'});

    ////////////
    //LRAS - straight line
    ////////////
    var LRAS = brd1.create('segment',[[7.75,11.0],[7.75,0.0]],
                           {'strokeColor':'DarkGray','strokeWidth':'3','highlight':false,
                            'name':'LRAS','withLabel':true, 'fixed':true,
                            'label':{'offset':[-15,200]}});
    var labelLRAS = brd1.create('text',[7.45,-0.4,"rY<sub>F</sub>"],{fixed:true});
  }

  /////////////////////////
  // External DOM buttons
  /////////////////////////
  var resetAnimationBtn = document.getElementById('resetAnimationBtn');

  resetAnimationBtn.addEventListener('click', function() {
      JXG.JSXGraph.freeBoard(brd1);
      init();
  });

  init();

  //Standard edX JSinput functions
  function setState(transaction,statestr){
      state = JSON.parse(statestr);
      //console.log(state);
      //console.log(state["dragLine"]);

      if (state["AD2"] && state["SRAS2"]) {
          //brd1.removeObject('AD2');
          var point1 = [state["AD2"]["p1X"],state["AD2"]["p1Y"]];
          var point2 = [state["AD2"]["p2X"],state["AD2"]["p2Y"]]
          AD2.point1.moveTo(point1,0);
          AD2.point2.moveTo(point2,0);

          var point1 = [state["SRAS2"]["p1X"],state["SRAS2"]["p1Y"]];
          var point2 = [state["SRAS2"]["p2X"],state["SRAS2"]["p2Y"]]
          SRAS2.point1.moveTo(point1,0);
          SRAS2.point2.moveTo(point2,0);

          brd1.update();
      }

      console.debug('State updated successfully from saved.');
  }

  function getState(){
      var state = JSON.parse(getGrade());
      statestr = JSON.stringify(state);
      // console.log(statestr);
      return statestr;
  }

  function getGrade() {
      var state = {"iS2D":{'X':iS2D.X(),'Y':iS2D.Y()},
                   "iSDfix":{'X':iSDfix.X(),'Y':iSDfix.Y()},
                   "AD2":{'p1X':AD2.point1.X(),'p2X':AD2.point2.X(),
                          'p1Y':AD2.point1.Y(),'p2Y':AD2.point2.Y()},
                   "AD1":{'p1X':AD1.point1.X(),'p2X':AD1.point2.X(),
                          'p1Y':AD1.point1.Y(),'p2Y':AD1.point2.Y()},
                   "SRAS2":{'p1X':SRAS2.point1.X(),'p2X':SRAS2.point2.X(),
                            'p1Y':SRAS2.point1.Y(),'p2Y':SRAS2.point2.Y()},
                   "SRAS1":{'p1X':SRAS1.point1.X(),'p2X':SRAS1.point2.X(),
                            'p1Y':SRAS1.point1.Y(),'p2Y':SRAS1.point2.Y()}
                  };
      statestr = JSON.stringify(state);
      //console.log('hello',statestr);
      return statestr;
  }

  MacroLib.createChannel(getGrade, getState, setState);

  return {
      setState: setState,
      getState: getState,
      getGrade
  };
})(JXG, MacroLib, undefined);
