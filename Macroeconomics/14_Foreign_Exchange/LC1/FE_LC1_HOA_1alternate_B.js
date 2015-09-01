////////////
// BOARD 1
////////////

var brd1 = createBoard('jxgbox1',{xname:' ',
                                  yname:"Price<br>( $/&euro; )",grid:false,'xpos':[8,-0.5],'ypos':[-1.25,10]});

//Supply Line 1 - fixed
var SRAS1 = createLine(brd1,{ltype:'Supply',name:'$S<sub>1</sub>',color:'DodgerBlue'});
SRAS1.setAttribute({fixed:true,'dash':1,'fixed':true,'highlight':false});

//Supply Line 2 - moveable
var SRAS2 = createLine(brd1,{ltype:'Supply',name:'$S<sub>2</sub>',color:'DodgerBlue'});
SRAS2.setAttribute({fixed:true,'highlight':false,withLabel:false});

//Demand Line 1 - fixed
var AD1 = createLine(brd1,{ltype:'Demand',name:'$D<sub>1</sub>',color:'Orange'});
AD1.setAttribute({fixed:true,'dash':1,'fixed':true,'highlight':false});

//Demand Line 2 - moveable
var AD2 = createLine(brd1,{ltype:'Demand',name:'$D<sub>2</sub>',color:'Orange'});
AD2.setAttribute({fixed:true,'highlight':false,withLabel:false});


////////////
// Intersection Box 1
////////////
var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {visible:false});
var iS2D = brd1.create('intersection', [AD2, SRAS2, 0], {visible:false});


////////////
// Draggable Dashed Lines for Board 1
////////////
var dashS2 = createDashedLines2Axis(brd1,iS2D,
                                  {fixed:false,
                                   withLabel:true,
                                   xlabel:'Q<sup>*</sup>',
                                   ylabel:'E1',
                                   yoffsets:[-35,0],
                                   color:'Orange'});

dashS2.X1.setAttribute({visible:false});
dashS2.XLine.setAttribute({visible:false});

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

// brd1.on('mousedown', function() {
//     AD2.setAttribute({withLabel:true});
//     SRAS2.setAttribute({withLabel:true});
//     dashS2.Y1.setAttribute({withLabel:true});
//     dashS2.X1.setAttribute({withLabel:true});
//     brd1.update()
// });


//Standard edX JSinput functions
setState = function(transaction,statestr){
    state = JSON.parse(statestr);
    //console.log(state);
    //console.log(state["dragLine"]);

    // if (state["AD2"] && state["SRAS2"]) {
    //     //brd1.removeObject('AD2');
    //     var point1 = [state["AD2"]["p1X"],state["AD2"]["p1Y"]];
    //     var point2 = [state["AD2"]["p2X"],state["AD2"]["p2Y"]]
    //     AD2.point1.moveTo(point1,0);
    //     AD2.point2.moveTo(point2,0);

    //     var point1 = [state["SRAS2"]["p1X"],state["SRAS2"]["p1Y"]];
    //     var point2 = [state["SRAS2"]["p2X"],state["SRAS2"]["p2Y"]]
    //     SRAS2.point1.moveTo(point1,0);
    //     SRAS2.point2.moveTo(point2,0);

    //     brd1.update();
    // }

    console.debug('State updated successfully from saved.');
}

getState = function(){
    var state = JSON.parse(getGrade());
    statestr = JSON.stringify(state);
    // console.log(statestr);
    return statestr;
}

getGrade = function() {
    var state = {};
    statestr = JSON.stringify(state);
    //console.log('hello',statestr);
    return statestr;
}

createChannel(getGrade, getState, setState);


