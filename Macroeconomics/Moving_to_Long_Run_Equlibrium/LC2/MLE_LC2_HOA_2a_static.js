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
Supply.setAttribute({'name':'SRAS','fixed':true,'highlight':false});
 
//Demand Line 2 - fixed
var AD2 = createDemand(brd1,{name:'AD1',color:'Orange'});
AD2.setAttribute({fixed:true,withLabel:true,'highlight':false});    

////////////
// Intersection Box 1
////////////
var iS2D = brd1.create('intersection', [AD2, Supply, 0], {visible:false});

////////////
// Fixed Dashed Lines for Board 1
////////////
var dashS2 = createDashedLines2Axis(brd1,iS2D,
                                  {fixed:true,
                                   withLabel:true,
                                   xlabel:'Y1',
                                   ylabel:'PL1',
                                   color:'DodgerBlue'});

////////////
//LRAS - straight line
////////////
var LRAS = brd1.create('segment',[[3.0,11.0],[3.0,0.0]],
                       {'strokeColor':'DodgerBlue','strokeWidth':'2',
                        'name':'LRAS','withLabel':true,'highlight':false,
                        'label':{'offset':[-15,140]}});
var labelLRAS = brd1.create('text',[2.7,-0.4,"rYF"],{fixed:true});