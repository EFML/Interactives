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

//SRAS Line 1 - fixed
var SRAS1 = createSupply(brd1,{name:'SRAS1',color:'DodgerBlue'});
SRAS1.setAttribute({'name':'SRAS1','fixed':true,'highlight':false});

//SRAS Line 2 - draggable
var SRAS2 = createSupply(brd1,{name:'SRAS2',color:'Lime'});
SRAS2.setAttribute({'name':'SRAS2','fixed':false,'highlight':true,'withLabel':false});

//Demand Line 1 - fixed
var AD1 = createDemand(brd1,{name:'AD1',color:'DodgerBlue'});
AD1.setAttribute({'dash':1,'fixed':true,'highlight':false});

//Demand Line 2 - moveable
var AD2 = createDemand(brd1,{name:'AD2',color:'Orange'});
AD2.setAttribute({withLabel:false, 'highlight':true});

////////////
// Intersection Box 1
////////////
var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {visible:false}); 
var iS2D = brd1.create('intersection', [AD2, SRAS1, 0], {visible:false});

////////////
//LRAS - straight line
////////////
var LRAS = brd1.create('segment',[[iSDfix.X(),11.0],[iSDfix.X(),0.0]],
                       {'strokeColor':'DodgerBlue','strokeWidth':'2',
                        'name':'LRAS','withLabel':true,
                        'fixed':true,
                        'label':{'offset':[-15,140]}});  

//LRAS Intersection
var iLSD = brd1.create('intersection', [LRAS, SRAS2, 0], {visible:false});

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
// 2nd SRAS2 Draggable Dashed Lines for Board 1
////////////
var dashLS = createDashedLines2Axis(brd1,iLSD,
                                          {fixed:false,
                                           withLabel:false,
                                           xlabel:'',
                                           ylabel:'PL3',
                                           color:'Lime'});

////////////
// Fixed Dashed Lines for Board 1
////////////
var dashesFixedB1 = createDashedLines2Axis(brd1,iSDfix,
                                          {withLabel:true,
                                           xlabel:'Y1',
                                           ylabel:'PL1',
                                           color:'DodgerBlue'});

////////////
// BOARD 2
////////////
bboxlimits2 = [-2.0, 12, 12, -1];
var brd2 = JXG.JSXGraph.initBoard('jxgbox2', {axis:false, 
                                        showCopyright: false,
                                        showNavigation: false,
                                        zoom: false,
                                        pan: false,
                                        boundingbox:bboxlimits2,
                                        grid: false,
                                        hasMouseUp: true, 
});

xaxis2 = brd2.create('axis', [[0, 0], [11, 0]], {withLabel: false});
yaxis2 = brd2.create('axis', [[0, 0], [0, 11]], {withLabel: false});

//Axes
xaxis2.removeAllTicks();
yaxis2.removeAllTicks();
var ylabel2 = brd2.create('text',[-1.8,10,"Inflation<br>Rate"],{fixed:true});
var xlabel2 = brd2.create('text',[9,-0.5,"UR"],{fixed:true});


//////////
// Connect Boards and Movement
//////////
brd1.addChild(brd2);

//SRPC2 - draggable
//var SRPC2 = createDemand(brd2,'SRPC2','Lime');
//SRPC2.setAttribute({'fixed':true,highlight:false});

//COMPLICATED TRANSFORM USING REFLECTION
var refLine = brd2.create('line',[[10,0],[10,12]],{dash:1,visible:false});
var reflectBrd2 = brd2.create('transform',[refLine],{type:'reflect'});
var shiftC = brd2.create('transform',[10,0],{type:'translate'});
var C2 = brd2.create('point',[SRAS2.point1,[shiftC,reflectBrd2]],{name:'C2',visible:false});

var shiftD = brd2.create('transform',[10,0],{type:'translate'});
var D2 = brd2.create('point',[SRAS2.point2,[shiftD,reflectBrd2]],{name:'D2',visible:false});
var SRPC2 = brd2.create('segment',[C2,D2],{fixed:false,strokeWidth:3,strokeColor:'Lime',highlight:false});

var gr2 = brd2.create('group',[C2,D2]);


//SRPC1 - fixed
var SRPC1 = createDemand(brd2,{name:'SRPC1',color:'DodgerBlue'});
SRPC1.setAttribute({'fixed':true,highlight:false});

////////////
//LRPC - straight line
////////////
var LRPC = brd2.create('segment',[[6,0],[6,11]],//[[iSDfix.X(),11.0],[iSDfix.X(),0.0]],
                       {'strokeColor':'DodgerBlue','strokeWidth':'2',
                        'dash':3,fixed:true,'highlight':false,
                        'name':'LRPC','withLabel':true,
                        'label':{'offset':[-15,140]}});  

////////
// Invisible axis line - allows us to move points up and down the SRPC1 curve
// See the next intersection. DB2Y intersects with SRPC1
////////
var DB2YP1 = brd2.create('point',[0, iS2D.Y()],{withLabel:false,visible:false});
var DB2YP2 = brd2.create('point',[iS2D.X(), iS2D.Y()],{withLabel:false,visible:false});
var DB2Y = brd2.create('segment',[DB2YP1,DB2YP2],{visible:false,strokeColor:'gray',strokeWidth:'2',
                                                            dash:'1',fixed:true} );
            
////////
//Intersection for SRPC1
////////
var iB2SRPC1 = brd2.create('intersection', [DB2Y, SRPC1, 0], {name:'A2',highlight:false,
                                                              fillColor:'Orange',strokeColor:'Orange',
                                                              withLabel:true,visible:false});

var iB2SRPC2 = brd2.create('intersection', [SRPC2, LRPC, 0], {name:'',highlight:false,
                                                              fillColor:'Lime',strokeColor:'Lime',
                                                              withLabel:false,visible:false});

var iB2fixed = brd2.create('point', [iB2SRPC1.X()+1, iB2SRPC1.Y()-1], {name:'A1',visible:true,highlight:false,
                                                                 fixed:true,fillColor:'DodgerBlue',
                                                                 strokeColor:'DogderBlue'});


////////////
// Fixed Dashed Lines for Point A1
////////////
var dashesFixedB2 = createDashedLines2Axis(brd2,iB2fixed,
                                          {withLabel:true,
                                           xlabel:'5%',
                                           ylabel:'2%',
                                           color:'DodgerBlue'});

////////////
// Draggable Dashed Lines for SRPC2
////////////
var dashSRPC1 = createDashedLines2Axis(brd2,iB2SRPC1,
                                          {fixed:false,
                                           withLabel:false,
                                           xlabel:'3%',
                                           ylabel:'4%',
                                           color:'Orange',
                                           visible:false});
for (element in dashSRPC1) {
    dashSRPC1[element].setAttribute({'visible':false});
};


///////////
// Draggable Dashed Lines for Point A2
////////////
var dashSRPC2 = createDashedLines2Axis(brd2,iB2SRPC2,
                                          {fixed:false,
                                           withLabel:false,
                                           xlabel:'',
                                           ylabel:'',
                                           color:'Lime',
                                           visible:false});
for (element in dashSRPC2) {
    dashSRPC2[element].setAttribute({'visible':false});
};


//////////////////
// Interactivity
//////////////////
brd1.on('move', function() {      
    //Moving 1st set of Dashed Lines in Board 1
    dashS2.Y1.moveTo([0, iS2D.Y()]);
    dashS2.Y2.moveTo([iS2D.X(), iS2D.Y()]);

    dashS2.X1.moveTo([iS2D.X(), 0]);
    dashS2.X2.moveTo([iS2D.X(), iS2D.Y()]);
        
    //Moving 2nd set of Dashed Lines in Board 1
    dashLS.Y1.moveTo([0, iLSD.Y()]);
    dashLS.Y2.moveTo([iLSD.X(), iLSD.Y()]);

    dashLS.X1.moveTo([iLSD.X(), 0]);
    dashLS.X2.moveTo([iLSD.X(), iLSD.Y()]);    
        
    //Moving Point A2
    DB2YP1.moveTo([0, iS2D.Y()]);
    DB2YP2.moveTo([iB2SRPC1.X(),iS2D.Y()]);    
        
    //Moving Dashed Lines in Board 2
    dashSRPC1.Y1.moveTo([0, iB2SRPC1.Y()]);
    dashSRPC1.Y2.moveTo([iB2SRPC1.X(), iB2SRPC1.Y()]);

    dashSRPC1.X1.moveTo([iB2SRPC1.X(), 0]);
    dashSRPC1.X2.moveTo([iB2SRPC1.X(), iB2SRPC1.Y()]);
        
    //Moving Dashed Lines in Board 2
    dashSRPC2.Y1.moveTo([0, iB2SRPC2.Y()]);
    dashSRPC2.Y2.moveTo([iB2SRPC2.X(), iB2SRPC2.Y()]);

    dashSRPC2.X1.moveTo([iB2SRPC2.X(), 0]);
    dashSRPC2.X2.moveTo([iB2SRPC2.X(), iB2SRPC2.Y()]);

    //Moving SRPC2 on Board 2
    //var diffX = (SRAS2.point1.X() - SRAS1.point1.X());
    //console.log(SRAS2.point1.X() - diffX);
    SRPC2.point1.moveTo([SRAS2.point1.X(),SRAS2.point2.Y()]);
    SRPC2.point2.moveTo([SRAS2.point2.X(),SRAS2.point1.Y()]);
});


brd1.on('mousedown', function() {      
    AD2.setAttribute({withLabel:true});
    SRAS2.setAttribute({withLabel:true});
    dashS2.Y1.setAttribute({withLabel:true});
    dashS2.X1.setAttribute({withLabel:true});
    
    dashLS.Y1.setAttribute({withLabel:true});
    brd1.update()
        
    dashSRPC1.Y1.setAttribute({withLabel:true});
    dashSRPC1.X1.setAttribute({withLabel:true});
    iB2SRPC1.setAttribute({visible:true});
    
    for (element in dashSRPC1) {
        if (element != 'Y2' && element != 'X2') {
            dashSRPC1[element].setAttribute({'visible':true});
        }
    };

    for (element in dashSRPC2) {
        if (element != 'Y2' && element != 'X2') {
            dashSRPC2[element].setAttribute({'visible':true});
        }
    };

    brd2.update()
});


//Standard edX JSinput functions
getInput = function(){
    state = {};
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
            
        