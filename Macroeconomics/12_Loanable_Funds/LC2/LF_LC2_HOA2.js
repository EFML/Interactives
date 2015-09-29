var brd1, brd2;

function init() {
  ////////////
  // BOX 1
  ////////////
  bbox1 = [-2.3, 12, 13, -2.3];
  brd1 = createBoard('jxgbox1',{bboxlimits:bbox1,xname:"Quantity Loanable Funds (Public and Private)", 'xpos':[4,-1.1],
                                    yname:"Real<br>Interest<br>Rate",grid:false,'ypos':[-2.2,10.0]});


  //Supply Line 1 - fixed
  var SBfix = createLine(brd1,{'ltype':'Supply','name':'S<sub>LF</sub>',color:'Orange',storkeWidth:4});
  SBfix.setAttribute({'dash':1,'fixed':true, 'withLabel':false});

  //Supply Line 2 - moveable
  var SB1 = createLine(brd1,{'ltype':'Supply','name':'S<sub>LF</sub>',color:'Orange'});
  SB1.setAttribute({'highlight':false,'withLabel':true});

  //Demand Line 1 - fixed
  var DB1 = createLine(brd1,{'ltype':'Demand','name':'D<sub>LF</sub>','color':'DodgerBlue',storkeWidth:4})
  DB1.setAttribute({'dash':1,'fixed':true, 'withLabel':false,'highlight':false});

  //Demand Line 2 - moveable
  var DB1 = createLine(brd1,{'ltype':'Demand','name':'D<sub>LF</sub>','color':'DodgerBlue'})
  DB1.setAttribute({'withLabel':true,'highlight':false});

  ////////////
  // BOX 2
  ////////////
  bbox2 = [-2.3, 12, 13, -2.3];
  brd2 = createBoard('jxgbox2',{bboxlimits:bbox2,xname:"Private Investment $", 'xpos':[6.0,-1.5],
                                    yname:"Real<br>Interest<br>Rate",grid:false,'ypos':[-2.2,10.0]});

  //Demand Line 2 - moveable
  var DB2 = createLine(brd2,{'ltype':'Demand','name':'Invest<br>Demand</sub>','color':'Crimson'})
  DB2.setAttribute({'fixed':true,'withLabel':true,'highlight':false});

  ////////
  // Intersection Box 1
  ////////
  var iSDB1 = brd1.create('intersection', [SB1, DB1, 0], {visible:false});

  ////////////
  // Dashes for Board 1
  ////////////
  var dashesB1 = createDashedLines2Axis(brd1,iSDB1,
                                             {withLabel:true,
                                             xlabel:'Q<sub>1</sub>',
                                             xoffsets:[5,15],
                                             ylabel:'RIR<sub>1</sub>',
                                             // yoffsets:[5,10],
                                             color:'Gray'
                                             });



  ////////////
  // Dashes in Box 2
  ////////////

  // FIXED
  var dashesB2fix = createDashedLines2Axis(brd2,iSDB1,
                                             {withLabel:false,
                                             fixed: true,
                                             xlabel:'I<sub>1</sub>',
                                             // xoffsets:[5,15],
                                             ylabel:'RIR<sub>1</sub>',
                                             // yoffsets:[5,10],
                                             color:'Gray'
                                             });

  //DYNAMIC SET

  var dashesB2 = createDashedLines2Axis(brd2,iSDB1,
                                             {withLabel:true,
                                             xlabel:'I<sub>2</sub>',
                                             // xoffsets:[5,15],
                                             ylabel:'RIR<sub>2</sub>',
                                             // yoffsets:[5,10],
                                             color:'DarkGray'
                                             });

  // var dashB2Yp1 = brd2.create('point',[0, iSD.Y()],{withLabel:false,visible:false});
  // var dashB2Yp2 = brd2.create('point',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});
  // var dashB2Y2 = brd2.create('segment',[dashB2Yp1,dashB2Yp2],{straightFirst:false, straightLast:false,
  //                                                                strokeColor:'DarkGray',strokeWidth:'2',
  //                                                                dash:'1',fixed:true}
  //                       );

  // var dashB2Xp1 = brd2.create('point',[iSD.X(), 0],{withLabel:false,visible:false});
  // var dashB2Xp2 = brd2.create('point',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});
  // var dashB2X2 = brd2.create('segment',[dashB2Xp1,dashB2Xp2],{straightFirst:false, straightLast:false,
  //                                                                strokeColor:'DarkGray',strokeWidth:'2',
  //                                                                dash:'1',fixed:true}
  //                       );


  // //STATIC SET
  // var dashYstaticp21 = brd2.create('point',[0, iSD.Y()],{withLabel:false,visible:false});
  // var dashYstaticp22 = brd2.create('point',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});
  // var dashYstatic2 = brd2.create('segment',[dashYstaticp21,dashYstaticp22],{straightFirst:false, straightLast:false,
  //                                                                strokeColor:'LightGray',strokeWidth:'2',
  //                                                                dash:'1',fixed:true}
  //                       );

  // var dashXstaticp21 = brd2.create('point',[iSD.X(), 0],{withLabel:false,visible:false});
  // var dashXstaticp22 = brd2.create('point',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});
  // var dashXstatic2 = brd2.create('segment',[dashXstaticp21,dashXstaticp22],{straightFirst:false, straightLast:false,
  //                                                                strokeColor:'LightGray',strokeWidth:'2',
  //                                                                dash:'1',fixed:true}
  //                       );

  ////////
  // Intersections Box 2
  ////////
  var iIDy = brd2.create('intersection', [dashesB2.YLine, DB2, 0], {visible:false});


  //////////
  // Connect Boards and Movement
  //////////

  brd1.addChild(brd2);

  // brd1.on('move', function(){

  //     //Dashed Lines 1
  //     dashB1Yp1.moveTo([0, iSD.Y()]);
  //     dashB1Yp2.moveTo([iSD.X(), iSD.Y()]);

  //     dashB1Xp1.moveTo([iSD.X(), 0]);
  //     dashB1Xp2.moveTo([iSD.X(), iSD.Y()]);

  //     //Dashed Lines 2
  //     dashB2Yp1.moveTo([0, iSD.Y()]);
  //     dashB2Yp2.moveTo([iIDy.X(), iSD.Y()]);

  //     dashB2Xp1.moveTo([iIDy.X(), 0]);
  //     dashB2Xp2.moveTo([iIDy.X(), iSD.Y()]);
  // });


  //////////////////
  // Interactivity
  //////////////////
  brd1.on('move', function() {
      //Moving Dashed Lines in Board 1
      dashesB1.Y1.moveTo([0, iSDB1.Y()]);
      dashesB1.Y2.moveTo([iSDB1.X(), iSDB1.Y()]);
      dashesB1.X1.moveTo([iSDB1.X(), 0]);
      dashesB1.X2.moveTo([iSDB1.X(), iSDB1.Y()]);

      //Moving Dashed Lines in Board 2
      dashesB2.Y1.moveTo([0, iSDB1.Y()]);
      dashesB2.Y2.moveTo([iIDy.X(), iSDB1.Y()]);
      dashesB2.X1.moveTo([iIDy.X(), 0]);
      dashesB2.X2.moveTo([iIDy.X(), iSDB1.Y()]);

      // //Green Dashed Lines Board 1
      // dashesLRASB1.Y1.moveTo([0, iSLB1.Y()]);
      // dashesLRASB1.Y2.moveTo([iSLB1.X(), iSLB1.Y()]);
      // dashesLRASB1.X1.moveTo([iSLB1.X(), 0]);
      // dashesLRASB1.X2.moveTo([iSLB1.X(), iSLB1.Y()]);
      // brd1.update()

      // //BOARD 2
      // //Moving Point A2
      // // DB2YP1.moveTo([0, iS2D.Y()]);
      // // DB2YP2.moveTo([iB2SRPC1.X(),iS2D.Y()]);

      // //Orange Dashed Lines Board 2
      // dashesA2B2.Y1.moveTo([0, iB2SRPC1.Y()]);
      // dashesA2B2.Y2.moveTo([iB2SRPC1.X(), iB2SRPC1.Y()]);
      // dashesA2B2.X1.moveTo([iB2SRPC1.X(), 0]);
      // dashesA2B2.X2.moveTo([iB2SRPC1.X(), iB2SRPC1.Y()]);

  });
}

////////////////////////
// External DOM button
////////////////////////
var resetAnimationBtn = document.getElementById('resetAnimationBtn');

resetAnimationBtn.addEventListener('click', function() {
    JXG.JSXGraph.freeBoard(brd1);
    JXG.JSXGraph.freeBoard(brd2);
    init();
});

init();

//Standard edX JSinput functions
getInput = function(){
    state = {"dragLine":{'p1X':dragLine.point1.X(),'p2X':dragLine.point2.X(),
                         'p1Y':dragLine.point1.Y(),'p2Y':dragLine.point2.Y()},
             "staticLine":{'p1X':staticLine.point1.X(),'p2X':staticLine.point2.X(),
                           'p1Y':staticLine.point1.Y(),'p2Y':staticLine.point2.Y()}};
    statestr = JSON.stringify(state);
    console.log(statestr)

    //IPython Notebook Considerations
    document.getElementById('spaceBelow').innerHTML += '<br>'+statestr;
    var command = "state = '" + statestr + "'";
    console.log(command);

    //Kernel
    var kernel = IPython.notebook.kernel;
    kernel.execute(command);

    return statestr;
}

getState = function(){
    state = {'input': JSON.parse(getInput())};
    statestr = JSON.stringify(state);
    return statestr
}

setState = function(statestr){
    $('#msg').html('setstate ' + statestr);
    state = JSON.parse(statestr);
    console.log(statestr);
    console.debug('State updated successfully from saved.');
}
