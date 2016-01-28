////////////
// BOX 1
////////////
bboxlimits = [-2.3, 12, 12, -1.3];
var brd1 = JXG.JSXGraph.initBoard('jxgbox1', {axis:false, 
                                        showCopyright: false,
                                        showNavigation: false,
                                        zoom: false,
                                        pan: false,
                                        boundingbox:bboxlimits,
                                        grid: false,
                                        hasMouseUp: true, 
});

xaxis = brd1.create('axis', [[0, 0], [11, 0]], {withLabel: false});
yaxis = brd1.create('axis', [[0, 0], [0, 11]], {withLabel: false});

//Axes
xaxis.removeAllTicks();
yaxis.removeAllTicks();
var ylabel = brd1.create('text',[-2,10,"Real<br>Interest<br>Rate"],{fixed:true});
var xlabel = brd1.create('text',[7,-0.5,"Quantity of Money"],{fixed:true});

////////////
// BOX 2
////////////

var brd2 = JXG.JSXGraph.initBoard('jxgbox2', {axis:false, 
                                        showCopyright: false,
                                        showNavigation: false,
                                        zoom: false,
                                        pan: false,
                                        boundingbox:bboxlimits,
                                        grid: false,
                                        hasMouseUp: true, 
});

xaxis = brd2.create('axis', [[0, 0], [11, 0]], {withLabel: false});
yaxis = brd2.create('axis', [[0, 0], [0, 11]], {withLabel: false});

//Axes
xaxis.removeAllTicks();
yaxis.removeAllTicks();
var ylabel = brd2.create('text',[-2,10,"Price of<br>Bonds"],{fixed:true});
var xlabel = brd2.create('text',[4.5,-0.5,"Quantity of Bonds per Period"],{fixed:true});


createSupply = function(board,options) {
    var name = options.name || '';
    var color = options.color || JXG.Options.segment.strokeColor;
    var c1,c2,S1,S2,N;

    c1 = [2.0,2.0];
    c2 = [9.5,9.5];
    S1 = board.create('point',c1,{withLabel:false,visible:false});
    S2 = board.create('point',c2,{withLabel:false,visible:false});
    //N = board.create('text',[S2.X(),S2.Y(),name]);
    return board.create('segment',[S1,S2],{'strokeColor':color,
                                           'name':name,'withLabel':true,
                                           'label':{'offset':[0,160]}
                                          });
}

createDemand = function(board,options) {
    var name = options.name || '';
    var color = options.color || JXG.Options.segment.strokeColor;
    var c1,c2,D1,D2;

    c1 = [2.0,9.5];
    c2 = [9.5,2.0];
    D1 = board.create('point',c1,{withLabel:false,visible:false});
    D2 = board.create('point',c2,{withLabel:false,visible:false});
    return board.create('segment',[D1,D2],{'strokeColor':color,
                                           'name':name,'withLabel':true,
                                           'label':{'offset':[130,-130]}
                                          });
}


//Supply Line 1 - fixed
var S = createSupply(brd1,{name:'S',color:"Orange"});
S.point1.moveTo([5.75,1],0);
S.point2.moveTo([5.75,11],0);
S.setAttribute( {'label':{'offset':[-35,-2]}} );
brd1.update()

//Demand Line 1 - fixed
var AD = createDemand(brd1,{name:'AD',color:"DodgerBlue"});

//Demand Line 1 - fixed
var ID = createDemand(brd2,{name:'D',color:"Crimson"});
ID.setAttribute({fixed:true, highlight:false})
         
////////
// Intersection Box 1
////////
var iSD = brd1.create('intersection', [S, AD, 0], {visible:false});    

////////////
// Dashes in Box 1
////////////
// var dashB1Yp1 = brd1.create('point',[0, iSD.Y()],{withLabel:false,visible:false});
// var dashB1Yp2 = brd1.create('point',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});
// var dashB1Y1 = brd1.create('segment',[dashB1Yp1,dashB1Yp2],{straightFirst:false, straightLast:false,
//                                                                strokeColor:'gray',strokeWidth:'2',
//                                                                dash:'1',fixed:true}
//                       );

////////////
// Draggable Dashed Lines for Board 1
////////////
var dashSD = createDashedLines2Axis(brd1,iSD,
                                  {fixed:false,
                                   withLabel:false,
                                   xlabel:'Y2',
                                   ylabel:'PL2',
                                   color:'Gray'});

////////////
// Dashes in Box 2
////////////            

var dashFixIB2 = createDashedLines2Axis(brd2,iSD,
                                  {fixed:true,
                                   withLabel:false,
                                   xlabel:'Y2',
                                   ylabel:'PL2',
                                   color:'LightGray'});

var dashIB2 = createDashedLines2Axis(brd2,iSD,
                                  {fixed:false,
                                   withLabel:false,
                                   xlabel:'Y2',
                                   ylabel:'PL2',
                                   color:'Gray'});



////////
// Intersections Box 2
////////
var iIDy = brd2.create('intersection', [dashIB2.YLine, ID, 0], {visible:false});


//////////
// Connect Boards and Movement
//////////

brd1.addChild(brd2);

brd1.on('move', function(){
        
    //Dashed Lines Board 1
    dashSD.Y1.moveTo([0, iSD.Y()]);
    dashSD.Y2.moveTo([iSD.X(), iSD.Y()]);

    dashSD.X1.moveTo([iSD.X(), 0]);
    dashSD.X2.moveTo([iSD.X(), iSD.Y()]);

    //Dashed Lines 2
    dashIB2.Y1.moveTo([0, iSD.Y()]);
    dashIB2.Y2.moveTo([iIDy.X(), iSD.Y()]);

    dashIB2.X1.moveTo([iIDy.X(), 0]);
    dashIB2.X2.moveTo([iIDy.X(), iSD.Y()]);
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
            
        