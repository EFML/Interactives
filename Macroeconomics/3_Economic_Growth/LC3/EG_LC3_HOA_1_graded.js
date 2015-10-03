var Macro = (function(JXG) {
  'use strict';
  var brd1;

  function init() {
    ////////////
    // BOARD 1
    ////////////
    var newBBox = [-1.5, 12, 12, -1.75];

    brd1 = createBoard('jxgbox1',{xname:"Real GDP", yname:"Price<br>Level",
                                      grid:false,'xpos':[9,-0.5],'ypos':[-1.25,10], bboxlimits:newBBox});

    //Sliders
    var sliderx = brd1.create('slider',[[3.0,-1.2],[8.5,-1.2],[-2.25,0,2.25]],{withLabel:false,snapWidth:0.05,
                                                                           color:'DarkGray'});

    //Positive Slider Transformation
    var sliderXPositive = brd1.create('transform',[
        function(){return sliderx.Value()},
        function(){return 0.0}],
        {type:'translate'}
        );

    // //Supply Line 1 - fixed
    var SRAS1 = createLine(brd1,{ltype:'Horizontal',name:'SRAS',color:'DodgerBlue'});
    SRAS1.setAttribute({'visible':false,'fixed':true,'highlight':false});

    //LRAS 1 - fixed
    var LRAS1 = createLine(brd1,{ltype:'Vertical',name:'LRAS<sub>1</sub>',color:'DarkGray'});
    LRAS1.setAttribute({fixed:true,'dash':1,'fixed':true,'highlight':true});
    LRAS1.setAttribute({'label':{'offset':[20,0]}});

    //LRAS 2 - moveable
    var LRAS2 = createTransformLine(brd1,{'transformList':[sliderXPositive],ltype:'Vertical',
                                          name:'LRAS<sub>2</sub>',color:'DodgerBlue'});
    LRAS2.setAttribute({fixed:false,'highlight':false,withLabel:false});

    // ////////////
    // // Intersection Box 1
    // ////////////
    var iSDfix = brd1.create('intersection', [LRAS1, SRAS1, 0], {visible:false});
    var iS2D = brd1.create('intersection', [LRAS2, SRAS1, 0], {visible:false});

    ////////////
    // Draggable Dashed Lines for Board 1
    ////////////
    var dashS2 = createDashedLines2Axis(brd1,iS2D,
                                      {fixed:false,
                                       withLabel:false,
                                       xlabel:'Y<sub>2</sub>',
                                       ylabel:' ',
                                       color:'DodgerBlue'});

    dashS2.Y1.setAttribute({visible:false});
    dashS2.YLine.setAttribute({visible:false});

    ////////////
    // Fixed Dashed Lines for Board 1
    ////////////
    var dashesFixedB1 = createDashedLines2Axis(brd1,iSDfix,
                                              {withLabel:true,
                                               xlabel:'Y<sub>1</sub>',
                                               ylabel:' ',
                                               color:'DarkGray'});

    dashesFixedB1.Y1.setAttribute({visible:false});
    dashesFixedB1.YLine.setAttribute({visible:false});

    ////////////
    //LRAS - straight line
    ////////////
    // var LRASfix = brd1.create('segment',[[5.75,11.0],[5.75,0.0]],
    //                        {'strokeColor':'DarkGray','strokeWidth':'5',
    //                         'name':'LRAS','withLabel':true, 'fixed':true,
    //                         'label':{'offset':[-15,200]}});
    // LRASfix.setAttribute({'dash':1,'fixed':true,'highlight':false});

    // var LRAS = brd1.create('segment',[[5.75,11.0],[5.75,0.0]],
    //                        {'strokeColor':'DarkGray','strokeWidth':'6',
    //                         'name':'LRAS','withLabel':true, 'fixed':false,
    //                         'label':{'offset':[-15,200]}});


    //////////////////
    // Interactivity
    //////////////////
    brd1.on('move', function() {
        //Moving Dashed Lines in Board 1
        dashS2.Y1.moveTo([0, iS2D.Y()]);
        dashS2.Y2.moveTo([iS2D.X(), iS2D.Y()]);

        dashS2.X1.moveTo([iS2D.X(), 0]);
        dashS2.X2.moveTo([iS2D.X(), iS2D.Y()]);

    });

    brd1.on('mousedown', function() {
        LRAS2.setAttribute({withLabel:true});
        dashS2.X1.setAttribute({withLabel:true});
        dashS2.Y1.setAttribute({withLabel:true});
        brd1.update()
    });
  }

  /////////////////////////
  // External DOM button
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
      // console.log(state);
      //console.log(state["dragLine"]);

      if (state["LRAS2"]) {
          //Slider position is a function of the original slider position and the slider value
          var spos = state["LRAS2"]["X0"] + state["LRAS2"]["slider"];
          sliderx.moveTo([spos,0],0);
          LRAS2.setAttribute({withLabel:true});
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
      var state = {"LRAS2":{'X0':LRAS1.point1.X(),
                            'slider':sliderx.Value()}};
      statestr = JSON.stringify(state);
      //console.log('hello',statestr);
      return statestr;
  }

  createChannel(getGrade, getState, setState);

return {
    setState: setState,
    getState: getState,
    getGrade
  };
})(JXG, undefined);
