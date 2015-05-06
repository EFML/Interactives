JXG.Options.text.fontSize = 14;

////////////
// BOARD 1
////////////
bboxlimits = [-2.5, 12, 12, -1.2];
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
var xlabel1 = brd1.create('text',[6,-0.5,"Quantity of Money"],{fixed:true});
var ylabel1 = brd1.create('text',[-2.45,10,"Nominal<br>Interest<br>Rate"],{fixed:true});

//Demand Line 1 - fixed
var AD1 = brd1.create('segment',[[2.0,9.5],[9.5,2.0]],
                       {'strokeColor':'Gray','strokeWidth':'3',
                        'name':'D','withLabel':false,
                        'fixed':true,'dash':1,
                        'highlight':false,
                        'label':{'offset':[140,-145]}});  


//Demand Line 2 - moveable
var AD2 = brd1.create('segment',[[2.0,9.5],[9.5,2.0]],
                       {'strokeColor':'Orange','strokeWidth':'4',
                        'name':'D','withLabel':true,
                        'fixed':false,
                        'highlight':true,
                        'label':{'offset':[100,-100]}});  

////////////
//LRAS - straight line
////////////
var S = brd1.create('segment',[[5.75,11.0],[5.75,1.0]],
                       {'strokeColor':'DodgerBlue','strokeWidth':'3',
                        'name':'S','withLabel':true,
                        'fixed':true,
                        'highlight':false,
                        'label':{'offset':[0,125]}});  

////////////
// Intersection Box 1
////////////
//S Intersection
var iB1SD = brd1.create('intersection', [S, AD2, 0], {visible:true});

////////////
// Draggable Dashed Lines for Board 1
////////////
var dashS2 = createDashedLines2Axis(brd1,iB1SD,
                                          {fixed:false,
                                           withLabel:false,
                                           xlabel:'Q<sub>2</sub>',
                                           ylabel:'R<sub>2</sub>',
                                           color:'Gray'});

////////////
// BOARD 2
////////////

///////////////////WHAT A CRAZY HACK!!! ///////////////
// Multiply everything in the right board by 2.0, and that will slow down the speed of the animation
// Shift in supply in right curve does not have a 1 to 1 connection. 
///////////////////////////////////////////////////////
var cF = 1.0

bboxlimits2 = [-2.4, 12, 12, -1.2];
for(var i=0; i<bboxlimits2.length; i++) {
    bboxlimits2[i] *= cF;
}

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
var xlabel2 = brd2.create('text',[3.25*cF,-0.5*cF,"Quantity of Bonds per Period"],{fixed:true});
var ylabel2 = brd2.create('text',[-2.25*cF,10*cF,"Price of<br>Bonds"],{fixed:true});

//////////
// Connect Boards and Movement
//////////
brd1.addChild(brd2);

//DBoard2 - fixed
//Demand Line 1 - Fixed
var SB2 = brd2.create('segment',[[2.0*cF,2.0*cF],[9.5*cF,9.5*cF]],
                       {'strokeColor':'DodgerBlue','strokeWidth':'4',
                        'name':'S','withLabel':true,
                        'fixed':true,
                        'highlight':false,
                        'label':{'offset':[100,100]}});  

//DBoard2 - fixed
//Supply Line 1 - Fixed
var DB2fix = brd2.create('segment',[[9.5*cF,2.0*cF],[2.0*cF,9.5*cF]],
                       {'strokeColor':'Gray','strokeWidth':'3',
                        'name':'D','withLabel':false,
                        'fixed':true,'dash':1,
                        'highlight':false,
                        'label':{'offset':[100,100]}});  


//COMPLICATED TRANSFORM USING REFLECTION
var refLine = brd2.create('line',[[0*cF,11*cF],[12*cF,11*cF]],{dash:1,visible:false});
var reflectBrd2 = brd2.create('transform',[refLine],{type:'reflect'});
var shiftC = brd2.create('transform',[0.0,3*cF],{type:'translate'});
var C2 = brd2.create('point',[AD2.point1,[shiftC,reflectBrd2]],{name:'C2',visible:false});

var shiftD = brd2.create('transform',[0,18.0*cF],{type:'translate'});
var D2 = brd2.create('point',[AD2.point2,[shiftD,reflectBrd2]],{name:'D2',visible:false});
var DB2 = brd2.create('segment',[C2,D2],{name:'D',fixed:false,withLabel:true,visible:true,
                                         strokeWidth:4,strokeColor:'Crimson',highlight:false,
                                         label:{offset:[100,-100]}});

var gr2 = brd2.create('group',[C2,D2]);
            
////////
//Intersection for Board 2
////////

var iB2 = brd2.create('intersection', [SB2, DB2, 0], {name:'',highlight:false,
                                                              fillColor:'Blue',strokeColor:'Blue',
                                                              withLabel:false,visible:true});

////////////
// Draggable Dashed Lines for SRPC2
////////////
var dashB2 = createDashedLines2Axis(brd2,iB2,
                                          {fixed:false,
                                           withLabel:true,
                                           xlabel:'Q<sub>2</sub>',
                                           ylabel:'P<sub>2</sub>',
                                           color:'Gray',
                                           visible:false});
dashB2.X1;

//////////////////
// Interactivity
//////////////////
brd1.on('move', function() {      
    //Moving 1st set of Dashed Lines in Board 1
    dashS2.Y1.moveTo([0, iB1SD.Y()]);
    dashS2.Y2.moveTo([iB1SD.X(), iB1SD.Y()]);

    dashS2.X1.moveTo([iB1SD.X(), 0]);
    dashS2.X2.moveTo([iB1SD.X(), iB1SD.Y()]);
        
    //Moving Dashed Lines in Board 2
    dashB2.Y1.moveTo([0, iB2.Y()]);
    dashB2.Y2.moveTo([iB2.X(), iB2.Y()]);

    dashB2.X1.moveTo([iB2.X(), 0]);
    dashB2.X2.moveTo([iB2.X(), iB2.Y()]);

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
            
        