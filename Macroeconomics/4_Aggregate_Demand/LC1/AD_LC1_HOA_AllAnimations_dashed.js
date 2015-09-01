var animationSpeed = 1000;
var curveShift = 1.5
////////////
// BOARD 1
////////////
var brd1 = createBoard('jxgbox1',{xname:"Real GDP", yname:"Price<br>Level",
                                  grid:false,'xpos':[8,-0.5]});

//Demand Line 1 - fixed
var AD1 = createLine(brd1,{ltype:'Demand',name:'AD<sub>1</sub>',color:'Gray'});
AD1.setAttribute({'dash':1,'fixed':true,'highlight':false});

//Demand Line 2 - moveable
var AD2 = createLine(brd1,{ltype:'Demand',name:'AD<sub>2</sub>',color:'DodgerBlue'});
AD2.setAttribute({withLabel:false});

var Gfix = brd1.create('glider',[6.0,6.0,AD1],{fixed:true,visible:false});
var G = brd1.create('glider',[6.0,6.0,AD2],{name:'A'});

////////////
// Fixed Dashed Lines for Board 1
////////////
var dashD1 = createDashedLines2Axis(brd1,Gfix,
                                  {fixed:true,
                                   withLabel:true,
                                   xlabel:'R<sub>1</sub>',
                                   ylabel:'P<sub>1</sub>',
                                   color:'Gray'});


////////////
// Draggable Dashed Lines for Board 1
////////////
var dashD2 = createDashedLines2Axis(brd1,G,
                                  {fixed:false,
                                   withLabel:false,
                                   xlabel:'R<sub>2</sub>',
                                   ylabel:'P<sub>2</sub>',
                                   color:'DarkGray'});

toggleLabels = function(toggle) {
    dashD2.X1.setAttribute({withLabel:toggle});
    dashD2.Y1.setAttribute({withLabel:toggle});
    AD2.setAttribute({withLabel:toggle});
};

//////////////////
// Interactivity
//////////////////
brd1.on('move', function() {
    //Moving Dashed Lines in Board 1
    dashD2.Y1.moveTo([0, G.Y()]);
    dashD2.Y2.moveTo([G.X(), G.Y()]);

    dashD2.X1.moveTo([G.X(), 0]);
    dashD2.X2.moveTo([G.X(), G.Y()]);
    brd1.update()
});

brd1.on('mousedown', function() {
    toggleLabels(true);
    brd1.update()
});

//Animation for shifting curve SouthWest
decreaseXY = function() {
    resetAnimation(0);
    brd1.update();

    toggleLabels(true);

    D2.point1.moveTo([D2.point1.X()-curveShift,D2.point1.Y()-curveShift],animationSpeed);
    D2.point2.moveTo([D2.point2.X()-curveShift,D2.point2.Y()-curveShift],spanimationSpeedeed);

    dashD2.Y1.moveTo([0, G.Y()-curveShift],animationSpeed);
    dashD2.Y2.moveTo([G.X()-curveShift, G.Y()-curveShift],animationSpeed);

    dashD2.X1.moveTo([G.X()-curveShift, 0],speed);
    dashD2.X2.moveTo([G.X()-curveShift, G.Y()-curveShift],speed);

    brd1.update();
}

//Animation for shifting curve NorthEast
increaseXY = function() {
    resetAnimation(0);
    toggleLabels(true);
    brd1.update();

    AD2.point1.moveTo([AD2.point1.X()+curveShift,AD2.point1.Y()+curveShift],animationSpeed);
    AD2.point2.moveTo([AD2.point2.X()+curveShift,AD2.point2.Y()+curveShift],animationSpeed);

    dashD2.Y1.moveTo([0, G.Y()+curveShift],animationSpeed);
    dashD2.Y2.moveTo([G.X()+curveShift, G.Y()+curveShift],animationSpeed);

    dashD2.X1.moveTo([G.X()+curveShift, 0],animationSpeed);
    dashD2.X2.moveTo([G.X()+curveShift, G.Y()+curveShift],animationSpeed);

    brd1.update();
}

resetAnimation = function(speed) {
    toggleLabels(false);
    AD2.point1.moveTo([2.0,9.5],speed);
    AD2.point2.moveTo([9.5,2.0],speed);

    G.moveTo([Gfix.X(),Gfix.X()],speed);

    dashD2.Y1.moveTo([0, 5.75],speed);
    dashD2.Y2.moveTo([5.75, 5.75],speed);

    dashD2.X1.moveTo([5.75, 0],speed);
    dashD2.X2.moveTo([5.75, 5.75],speed);

    brd1.update();
}

increaseA = function() {
    resetAnimation();
    brd1.update();

    toggleLabels(true);
    G.moveTo([G.X()-curveShift,G.X()+curveShift],1000);

    dashD2.Y1.moveTo([0, G.Y()+curveShift],animationSpeed);
    dashD2.Y2.moveTo([G.X()-curveShift, G.Y()+curveShift],animationSpeed);

    dashD2.X1.moveTo([G.X()-curveShift, 0],animationSpeed);
    dashD2.X2.moveTo([G.X()-curveShift, G.Y()+curveShift],animationSpeed);

    brd1.update();
}

decreaseA = function() {
    resetAnimation();
    brd1.update();

    toggleLabels(true);
    G.moveTo([G.X()+curveShift,G.X()-curveShift],1000);

    dashD2.Y1.moveTo([0, G.Y()-curveShift],animationSpeed);
    dashD2.Y2.moveTo([G.X()+curveShift, G.Y()-curveShift],animationSpeed);

    dashD2.X1.moveTo([G.X()+curveShift, 0],animationSpeed);
    dashD2.X2.moveTo([G.X()+curveShift, G.Y()-curveShift],animationSpeed);

    brd1.update();
}

//Standard edX JSinput functions
setState = function(transaction, statestr){
    state = JSON.parse(statestr);
    // console.log(statestr);
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

getState = function(){
    var state = JSON.parse(getGrade());
    statestr = JSON.stringify(state);
    console.log(statestr);
    return statestr;
}

getGrade = function() {
    var state = {"AD2":{'p1X':AD2.point1.X(),'p2X':AD2.point2.X(),
                        'p1Y':AD2.point1.Y(),'p2Y':AD2.point2.Y()},
                 "AD1":{'p1X':AD1.point1.X(),'p2X':AD1.point2.X(),
                        'p1Y':AD1.point1.Y(),'p2Y':AD1.point2.Y()},
                 "SRAS2":{'p1X':SRAS2.point1.X(),'p2X':SRAS2.point2.X(),
                          'p1Y':SRAS2.point1.Y(),'p2Y':SRAS2.point2.Y()},
                 "SRAS1":{'p1X':SRAS1.point1.X(),'p2X':SRAS1.point2.X(),
                          'p1Y':SRAS1.point1.Y(),'p2Y':SRAS1.point2.Y()}
                };
    statestr = JSON.stringify(state);
    return statestr;
}

createChannel(getGrade, getState, setState);


