////////////
// BOARD 1
////////////
bboxlimits = [-1.5, 12, 12, -1];
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
var xlabel1 = brd1.create('text',[-1.2,10,"PL"],{fixed:true});
var ylabel1 = brd1.create('text',[9,-0.5,"RGDP"],{fixed:true});

//Supply Line 1 - fixed
var Supply = createSupply(brd1,{name:'SRAS',color:'Gray'});
Supply.setAttribute({'fixed':true,'highlight':false});

//Demand Line 1 - fixed
var AD1 = createDemand(brd1,{name:'AD<sub>1</sub>',color:'Gray'});
AD1.setAttribute({'dash':1,'fixed':true,'highlight':false});

//Demand Line 2 - moveable
var AD2 = createDemand(brd1,{name:'AD<sub>2</sub>',color:'DodgerBlue'});
AD2.setAttribute({withLabel:false});
            
////////////
// Intersection Box 1
////////////
var iSDfix = brd1.create('intersection', [AD1, Supply, 0], {visible:false}); 
var iS2D = brd1.create('intersection', [AD2, Supply, 0], {visible:false});

////////////
// Dashes for fixed Line
////////////
var dashB1 = createDashedLines2Axis(brd1,iSDfix,
                              {fixed:true,
                               withLabel:true,
                               xlabel:'',
                               ylabel:'PL<sub>1</sub>',
                               color:'Gray'});

////////////
// Dashes for draggable Moveable Line
////////////
var dashS2 = createDashedLines2Axis(brd1,iS2D,
                              {fixed:false,
                               withLabel:false,
                               xlabel:'',
                               ylabel:'PL<sub>2</sub>',
                               color:'DodgerBlue'});




//////////////////
// Interactivity
//////////////////
brd1.on('move', function() {      
    dashS2.Y1.moveTo([0, iS2D.Y()]);
    dashS2.Y2.moveTo([iS2D.X(), iS2D.Y()]);

    dashS2.X1.moveTo([iS2D.X(), 0]);
    dashS2.X2.moveTo([iS2D.X(), iS2D.Y()]);
});

brd1.on('mousedown', function() {      
    AD2.setAttribute({withLabel:true});
    dashS2.Y1.setAttribute({withLabel:true});
    brd1.update()
});

//Animation
startAnimation = function() {
    //Initial line coords
    c1 = [2.0,9.5];
    c2 = [9.5,2.0];
    
    AD2.setAttribute({withLabel:true});
    dashS2.Y1.setAttribute({withLabel:true});
    
    //Animated Curve
    AD2.point1.moveTo([c1[0]+1,c1[1]+1],1000);
    AD2.point2.moveTo([c2[0]+1,c2[1]+1],1000);
    
    //Dashed Lines
    dashS2.Y1.moveTo([0, iS2D.Y()+1],1000);
    dashS2.Y2.moveTo([iS2D.X()+1, iS2D.Y()+1],1000);

    dashS2.X1.moveTo([iS2D.X()+1, 0],1000);
    dashS2.X2.moveTo([iS2D.X()+1, iS2D.Y()+1],1000);
    
    brd1.update();                
};

resetAnimation = function() {
    //Initial line coords
    var c1 = [2.0,9.5];
    var c2 = [9.5,2.0];
    
    //Animated Curve
    AD2.point1.moveTo(c1,10);
    AD2.point2.moveTo(c2,10);
    AD2.setAttribute({withLabel:false});
    
    
    brd1.update();

    //Dashed Lines                
    dashS2.Y1.moveTo([0, iS2D.Y()],0);
    dashS2.Y2.moveTo([iS2D.X(), iS2D.Y()],0);

    dashS2.X1.moveTo([iS2D.X(), 0],0);
    dashS2.X2.moveTo([iS2D.X(), iS2D.Y()],0);
    dashS2.Y1.setAttribute({withLabel:false});
    
    brd1.update();
};


setState = function(transaction,statestr){
    state = JSON.parse(statestr);
    //console.log(state);
    //console.log(state["dragLine"]);

    if (state["dragLine"]) {
        brd1.removeObject('AD2');
        var point1 = [state["dragLine"]["p1X"],state["dragLine"]["p1Y"]];
        var point2 = [state["dragLine"]["p2X"],state["dragLine"]["p2Y"]]
        
        //Demand Line 2 - moveable
        AD2.point1.moveTo(point1,0);
        AD2.point2.moveTo(point2,0);

        brd1.update();
    }
    //alert(statestr);
    console.debug('State updated successfully from saved.');
}

getState = function(){
    state = JSON.parse(getGrade());
    statestr = JSON.stringify(state);
    // console.log(statestr);
    return statestr;
}

//Standard edX JSinput functions
getGrade = function(){
    state = {"dragLine":{'p1X':AD2.point1.X(),'p2X':AD2.point2.X(),
                         'p1Y':AD2.point1.Y(),'p2Y':AD2.point2.Y()},
             "staticLine":{'p1X':AD1.point1.X(),'p2X':AD1.point2.X(),
                           'p1Y':AD1.point1.Y(),'p2Y':AD1.point2.Y()}};
    statestr = JSON.stringify(state);
    console.log(statestr);

    return statestr;
}


createChannel(getGrade, getState, setState);


