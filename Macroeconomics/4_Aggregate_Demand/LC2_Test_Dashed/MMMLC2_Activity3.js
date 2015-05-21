bboxlimits = [-1.6, 12, 12, -1.1];
var brd1 = JXG.JSXGraph.initBoard('jxgbox1', {axis:false, 
                                        showCopyright: false,
                                        showNavigation: false,
                                        zoom: false,
                                        pan: false,
                                        boundingbox:bboxlimits,
                                        grid: false,
                                        hasMouseUp: true, 
});

xaxis = brd1.create('axis', [[0, 0], [12, 0]], {withLabel: true, label: {offset: [320,-20]}});
yaxis = brd1.create('axis', [[0, 0], [0, 12]], {withLabel: true, label: {offset: [-60,260]}});

//Axes
xaxis.removeAllTicks();
yaxis.removeAllTicks();
var ylabel = brd1.create('text',[-1.5,10,"Interest<br>Rate"],{fixed:true});
var xlabel = brd1.create('text',[8,-0.5,"Quantity of Money"],{fixed:true});

//Demand 1
var D1 = createDemand(brd1,{name:'D<sub>1</sub>',color:'Gray'});
D1.setAttribute({fixed:true, dash:1});
var G = brd1.create('glider',[6.0,6.0,D1],{fixed:true,visible:false});

////////////
// Fixed Dashed Lines for Board 1
////////////
var dashD1 = createDashedLines2Axis(brd1,G,
                                  {fixed:true,
                                   withLabel:true,
                                   xlabel:'Y<sub>1</sub>',
                                   ylabel:'R<sub>1</sub>',
                                   color:'Gray'});


//Demand 2
var D2 = createDemand(brd1,{name:'D<sub>2</sub>',color:'DodgerBlue'});
D2.setAttribute({withLabel:false,offset:[125,-85]});

//Glider along demand curve
var G = brd1.create('glider',[6.0,6.0,D2],{name:'A',withLabel:false,fixed:true});

////////////
// Draggable Dashed Lines for Board 1
////////////
var dashD2 = createDashedLines2Axis(brd1,G,
                                  {fixed:false,
                                   withLabel:false,
                                   xlabel:'Y<sub>2</sub>',
                                   ylabel:'',
                                   color:'DodgerBlue'});

toggleLabels = function(toggle) {
    dashD2.X1.setAttribute({withLabel:toggle});
    dashD2.Y1.setAttribute({withLabel:toggle});
    D2.setAttribute({withLabel:toggle});
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

    var speed = 1000;
    toggleLabels(true);
    
    D2.point1.moveTo([D2.point1.X()-1.5,D2.point1.Y()],speed);
    D2.point2.moveTo([D2.point2.X()-1.5,D2.point2.Y()],speed);
    
    dashD2.Y1.moveTo([0, G.Y()],speed);
    dashD2.Y2.moveTo([G.X()-1.5, G.Y()],speed);

    dashD2.X1.moveTo([G.X()-1.5, 0],speed);
    dashD2.X2.moveTo([G.X()-1.5, G.Y()],speed);
    
    brd1.update();
}

//Animation for shifting curve NorthEast
increaseXY = function() {
    var speed = 1000;
    resetAnimation(0);
    toggleLabels(true);
    brd1.update();
    
    D2.point1.moveTo([D2.point1.X()+1.5,D2.point1.Y()],speed);
    D2.point2.moveTo([D2.point2.X()+1.5,D2.point2.Y()],speed);
    
    dashD2.Y1.moveTo([0, G.Y()],speed);
    dashD2.Y2.moveTo([G.X()+1.5, G.Y()],speed);

    dashD2.X1.moveTo([G.X()+1.5, 0],speed);
    dashD2.X2.moveTo([G.X()+1.5, G.Y()],speed);
    
    brd1.update();
}

resetAnimation = function(speed) {
    toggleLabels(false);                
    D2.point1.moveTo([2.0,9.5],speed);
    D2.point2.moveTo([9.5,2.0],speed);
    
    dashD2.Y1.moveTo([0, 5.75],speed);
    dashD2.Y2.moveTo([5.75, 5.75],speed);

    dashD2.X1.moveTo([5.75, 0],speed);
    dashD2.X2.moveTo([5.75, 5.75],speed);
    
    brd1.update();
}

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
            
        