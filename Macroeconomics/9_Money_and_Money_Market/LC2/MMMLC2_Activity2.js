////////////
// brd1 1
////////////
bboxlimits = [-1.85, 12, 12, -1.1];
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
var xlabel1 = brd1.create('text',[-1.75,10,"Nominal<br>Interest<br>Rate"],{fixed:true});
var ylabel1 = brd1.create('text',[8,-0.5,"Quantity of Money"],{fixed:true});


//Demand Line 1 - fixed
var AD1 = createDemand(brd1,{color:'Gray'});
AD1.setAttribute({'dash':1,'fixed':true,'highlight':false});

//Demand Line 2 - moveable
var AD2 = createDemand(brd1,{name:'AD<sub>1</sub>',color:'DodgerBlue'});
AD2.setAttribute({withLabel:true, 'highlight':true});

var original = AD2;
console.log(original.point1.X(),original.point1.Y())

G = brd1.create('glider',[6.75,6.75,AD2],{name:'A'});

brd1.on('mousedown', function() {
    //AD2.setAttribute({withLabel:true,offset:[125,-85]});
    brd1.update()
});

//Animation for shifting curve SouthWest
decreaseXY = function() {
    resetAnimation();
    brd1.update();
    AD2.point1.moveTo([1.0,8.5],1000);
    AD2.point2.moveTo([8.5,1.0],1000);
    brd1.update();
}

//Animation for shifting curve NorthEast
increaseXY = function() {
    resetAnimation();
    brd1.update();
    AD2.point1.moveTo([3.0,10.5],1000);
    AD2.point2.moveTo([10.5,3.0],1000);
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
    //AD2.point1.moveTo([2.0,10.0],10);
    //AD2.point2.moveTo([10.0,2.0],10);
    AD2.point1.moveTo([2.0,9.5],10);
    AD2.point2.moveTo([9.5,2.0],10);
    brd1.update();

    G.moveTo([6.0,6.0],10);
    brd1.update();
}



//Standard edX JSinput functions
getGrade = function(){
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
    state = {'input': JSON.parse(getGrade())};
    statestr = JSON.stringify(state);
    return statestr
}

setState = function(statestr){
    $('#msg').html('setstate ' + statestr);
    state = JSON.parse(statestr);
    console.log(statestr);
    console.debug('State updated successfully from saved.');
}


createChannel(getGrade, getState, setState);



