////////////
// BOARD 1
////////////
var cfx = 800.0/12.0;
var cfy = 30.0/12.0;
bboxlimits = [-120, 30, 800, -4];
var brd1 = JXG.JSXGraph.initBoard('jxgbox1', {axis:false, 
                                        showCopyright: false,
                                        showNavigation: false,
                                        zoom: false,
                                        pan: false,
                                        boundingbox:bboxlimits,
                                        grid: false,
                                        hasMouseUp: true, 
                                        axis:false,
});

// xaxis1 = brd1.create('axis', [[0, 0], [11, 0]], {withLabel: false});
// yaxis1 = brd1.create('axis', [[0, 0], [0, 11]], {withLabel: false});

//Axes
// xaxis1.removeAllTicks();
// yaxis1.removeAllTicks();
// 
// 
xaxis = brd1.create('axis', [[0, 0], [1,0]], 
      {name:'Quantity of Money ($billions)', 
      withLabel: false, 
      // label: {position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
      //      offset: [-10, -50]   // (in pixels)
      //      }
      });
xaxis.removeAllTicks();
brd1.create('ticks', [xaxis, [0,100,200,300,400,500,600,700,800]], {strokeColor: 'Black', majorHeight: 15, drawLabels: true, label:{offset:[0,-20]}});
var xlabel1 = brd1.create('text',[400,-2.75,"Quantity of Money ($billions)"],{fixed:true, highlight:false});


yaxis = brd1.create('axis', [[0, 0], [0, 1]], 
      {name:'', 
      withLabel: true, 
      // label: {
      //   position: 'rt',  // possible values are 'lft', 'rt', 'top', 'bot'
      //   offset: [-20, 0]   // (in pixels)
      //   }
      });         
yaxis.removeAllTicks();
brd1.create('ticks', [yaxis, [0,5,10,15,20,25,30]], {strokeColor: 'Black', majorHeight: 15, drawLabels: true});
var ylabel1 = brd1.create('text',[-110,26,"Nominal<br>Interest<br>Rate"],{fixed:true, highlight:false});



//Demand Line 1 - fixed
var AD1 = brd1.create('segment',[[cfx*1.5,cfy*9.0],[cfx*9.0,cfy*1.5]],
                       {'strokeColor':'Gray','strokeWidth':'3',
                        'name':'D','withLabel':false,
                        'fixed':true,'dash':1,
                        'highlight':false,
                        'label':{'offset':[140,-145]}});  


//Demand Line 2 - moveable
var AD2 = brd1.create('segment',[[cfx*1.5,cfy*9.0],[cfx*9.0,cfy*1.5]],
                       {'strokeColor':'Orange','strokeWidth':'4',
                        'name':'M<sub>s</sub>','withLabel':true,
                        'fixed':false,
                        'highlight':true,
                        'label':{'offset':[150,-150]}});  

////////////
//LRAS - straight line
////////////
var S = brd1.create('segment',[[cfx*6.0,cfy*11.0],[cfx*6.0,cfy*1.0]],
                       {'strokeColor':'DodgerBlue','strokeWidth':'3',
                        'name':'M<sub>d</sub>','withLabel':true,
                        'fixed':true,
                        'highlight':false,
                        'label':{'offset':[0,185]}});  

////////////
// Intersection Box 1
////////////
//S Intersection
var iB1SD = brd1.create('intersection', [S, AD2, 0], {size:4,visible:true,color:'DarkBlue',strokeColor:'DarkBlue'});

////////////
// Draggable Dashed Lines for Board 1
////////////
var dashS2 = createDashedLines2Axis(brd1,iB1SD,
                                          {fixed:false,
                                           withLabel:false,
                                           xlabel:'',
                                           ylabel:'',
                                           color:'Gray'});


//////////////////
// Interactivity
//////////////////
brd1.on('move', function() {      
    //Moving 1st set of Dashed Lines in Board 1
    dashS2.Y1.moveTo([0, iB1SD.Y()]);
    dashS2.Y2.moveTo([iB1SD.X(), iB1SD.Y()]);

    dashS2.X1.moveTo([iB1SD.X(), 0]);
    dashS2.X2.moveTo([iB1SD.X(), iB1SD.Y()]);
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
            
        