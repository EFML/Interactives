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
var Supply = createSupply(brd1,{name:'SRAS',color:'DodgerBlue'});
Supply.setAttribute({'name':'SRAS','fixed':false,'highlight':false});

//Demand Line 1 - fixed
var AD1 = createDemand(brd1,{name:'AD1',color:'Orange'});
AD1.setAttribute({'dash':1,'fixed':true,'highlight':false});

//Demand Line 2 - moveable
var AD2 = createDemand(brd1,{name:'AD2',color:'Orange'});
AD2.setAttribute({withLabel:false});

 
////////////
// Intersection Box 1
////////////
var iSDfix = brd1.create('intersection', [AD1, Supply, 0], {visible:false}); 
var iS2D = brd1.create('intersection', [AD2, Supply, 0], {visible:false});

////////////
// Draggable Dashed Lines for Board 1
////////////
var dashS2 = createDashedLines2Axis(brd1,iS2D,
                                  {fixed:false,
                                   withLabel:false,
                                   xlabel:'Y2',
                                   ylabel:'PL2',
                                   color:'Orange'});

////////////
// Fixed Dashed Lines for Board 1
////////////
var dashesFixedB1 = createDashedLines2Axis(brd1,iSDfix,
                                          {withLabel:true,
                                           xlabel:'rY1',
                                           ylabel:'PL1',
                                           color:'DodgerBlue'});

////////////
//LRAS - straight line
////////////
var LRAS = brd1.create('segment',[[7.0,11.0],[7.0,0.0]],
                       {'strokeColor':'DodgerBlue','strokeWidth':'2',
                        'name':'LRAS','withLabel':true,
                        'label':{'offset':[-15,140]}});
var labelLRAS = brd1.create('text',[6.7,-0.4,"rYF"],{fixed:true});



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
    AD2.setAttribute({withLabel:true});
    dashS2.Y1.setAttribute({withLabel:true});
    dashS2.X1.setAttribute({withLabel:true});
    brd1.update()
});


