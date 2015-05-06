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
var SRAS1 = createSupply(brd1,{name:'SRAS<sub>1</sub>',color:'DodgerBlue'});
SRAS1.setAttribute({'fixed':true,'highlight':false});

//SRAS Line 2 - draggable
var SRAS2 = createSupply(brd1,{name:'SRAS<sub>2</sub>',color:'Lime'});
SRAS2.setAttribute({'fixed':false,'highlight':true,'withLabel':false});

//Demand Line 1 - fixed
var AD1 = createDemand(brd1,{name:'AD<sub>1</sub>',color:'DodgerBlue'});
AD1.setAttribute({'dash':1,'fixed':true,'highlight':false});

//Demand Line 2 - moveable
var AD2 = createDemand(brd1,{name:'AD<sub>2</sub>',color:'Orange'});
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
                        'label':{'offset':[-15,200]}});  

//LRAS Intersection
var iLSD = brd1.create('intersection', [LRAS, SRAS2, 0], {visible:false});

////////////
// Draggable Dashed Lines for Board 1
////////////
var dashS2 = createDashedLines2Axis(brd1,iS2D,
                                          {fixed:false,
                                           withLabel:false,
                                           xlabel:'Y<sub>2</sub',
                                           ylabel:'PL<sub>2</sub',
                                           color:'Orange'});

////////////
// 2nd SRAS2 Draggable Dashed Lines for Board 1
////////////
var dashLS = createDashedLines2Axis(brd1,iLSD,
                                          {fixed:false,
                                           withLabel:false,
                                           xlabel:'',
                                           ylabel:'PL<sub>3</sub$',
                                           color:'Lime'});

////////////
// Fixed Dashed Lines for Board 1
////////////
var dashesFixedB1 = createDashedLines2Axis(brd1,iSDfix,
                                          {withLabel:true,
                                           xlabel:'Y<sub>1</sub',
                                           ylabel:'PL<sub>1</sub',
                                           color:'DodgerBlue'});




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
          
});


brd1.on('mousedown', function() {      
    AD2.setAttribute({withLabel:true});
    SRAS2.setAttribute({withLabel:true});
    dashS2.Y1.setAttribute({withLabel:true});
    dashS2.X1.setAttribute({withLabel:true});
    
    dashLS.Y1.setAttribute({withLabel:true});
    brd1.update()
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
            
        