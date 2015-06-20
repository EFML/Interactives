JXG.Options.point.showInfobox = false;

////////////
// BOARD 1
////////////
bboxlimits = [-1.5, 12, 12, -1.2];
var brd1 = JXG.JSXGraph.initBoard('jxgbox1', {axis:false, 
                                        showCopyright: false,
                                        showNavigation: false,
                                        zoom: false,
                                        pan: false,
                                        boundingbox:bboxlimits,
                                        grid: false,
                                        hasMouseUp: true, 
});

xaxis1 = brd1.create('axis', [[0, 0], [11, 0]], {withLabel: false});
yaxis1 = brd1.create('axis', [[0, 0], [0, 11]], {withLabel: false});

//Axes
xaxis1.removeAllTicks();
yaxis1.removeAllTicks();
var xlabel1 = brd1.create('text',[9,-0.5,"Real GDP"],{fixed:true});
var ylabel1 = brd1.create('text',[-1.2,10,"Price<br>Level"],{fixed:true});

//Demand Line 1 - fixed
var AD1 = createDemand(brd1,{name:'AD<sub>1</sub>',color:'Gray'});
AD1.setAttribute({'dash':1,'fixed':true,'highlight':false});

//Demand Line 2 - moveable
var AD2 = createDemand(brd1,{name:'AD<sub>2</sub>',color:'DodgerBlue'});
AD2.setAttribute({withLabel:false});

G = brd1.create('glider',[6.0,6.0,AD2],{name:'A'});

brd1.on('mousedown', function() {      
    AD2.setAttribute({withLabel:true,offset:[125,-85]});
    brd1.update()
});

//Animation for shifting curve SouthWest
decreaseXY = function() {
    resetAnimation();
    brd1.update();
    AD2.point1.moveTo([1.0,9.0],1000);
    AD2.point2.moveTo([9.0,1.0],1000);
    AD2.setAttribute({withLabel:true,offset:[125,-85]});                
    brd1.update();
}

//Animation for shifting curve NorthEast
increaseXY = function() {
    resetAnimation();
    brd1.update();
    AD2.point1.moveTo([3.0,11.0],1000);
    AD2.point2.moveTo([11.0,3.0],1000);
    AD2.setAttribute({withLabel:true,offset:[125,-85]});
    brd1.update();
}

increaseA = function() {
    resetAnimation();
    brd1.update();
    G.moveTo([4.0,8.0],1000);
    brd1.update();
}

decreaseA = function() {
    resetAnimation();
    brd1.update();
    G.moveTo([8.0,4.0],1000);
    brd1.update();
}

resetAnimation = function() {
    AD2.point1.moveTo([2.0,9.5],10);
    AD2.point2.moveTo([9.5,2.0],10);
    G.moveTo([6.0,6.0],10);
    brd1.update();
    AD2.setAttribute({withLabel:false,offset:[125,-85]});
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

