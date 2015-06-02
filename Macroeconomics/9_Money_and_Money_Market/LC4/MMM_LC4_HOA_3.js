////////////
// BOARD 1
////////////
var cfx = 800.0/12.0;
var cfy = 27.0/12.0;
newbbox = [-120, 27, 800, -4];

var brd1 = createBoard('jxgbox1',{xname:" ", 
                                  yname:" ",
                                  grid:false,bboxlimits:newbbox});

// xaxis1 = brd1.create('axis', [[0, 0], [11, 0]], {withLabel: false});
// yaxis1 = brd1.create('axis', [[0, 0], [0, 11]], {withLabel: false});

// //Axes
// xaxis1.removeAllTicks();
// yaxis1.removeAllTicks();


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
var ylabel1 = brd1.create('text',[-110,22,"Nominal<br>Interest<br>Rate"],{fixed:true, highlight:false});


//Demand Line 1 - fixed
var MD1 = brd1.create('segment',[[cfx*1.45,cfy*9.0],[cfx*9.0,cfy*1.45]],
                       {'strokeColor':'Orange','strokeWidth':'7',
                        'name':'D','withLabel':false,
                        'fixed':true,'dash':0,
                        'highlight':false,
                        'label':{'offset':[140,-145]}});  


// //Demand Line 2 - moveable
// var MD2 = brd1.create('segment',[[cfx*1.45,cfy*9.0],[cfx*9.0,cfy*1.45]],
//                        {'strokeColor':'Orange','strokeWidth':'5',
//                         'name':'M<sub>D</sub>','withLabel':true,
//                         'fixed':false,
//                         'highlight':true,
//                         'label':{'offset':[150,-140]}});  

////////////
//LRAS - straight line
////////////
var MS1 = brd1.create('segment',[[cfx*6.0,cfy*11.0],[cfx*6.0,cfy*1.0]],
                       {'strokeColor':'Gray','strokeWidth':'5','dash':1,
                        'name':'M<sub>S1</sub>','withLabel':true,
                        'fixed':true,
                        'highlight':false,
                        'label':{'offset':[0,185]}});  

var MS2 = brd1.create('segment',[[cfx*6.0,cfy*11.0],[cfx*6.0,cfy*1.0]],
                       {'strokeColor':'DodgerBlue','strokeWidth':'7',
                        'name':'M<sub>S2</sub>','withLabel':false,
                        'fixed':false,
                        'highlight':false,
                        'label':{'offset':[0,185]}});  

////////////
// Intersection Box 1
////////////
//S Intersection
var iB1SD = brd1.create('intersection', [MS2, MD1, 0], {size:4,visible:true,color:'DarkBlue',strokeColor:'DarkBlue'});

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

brd1.on('mousedown', function() {      
    MS2.setAttribute({withLabel:true});
    brd1.update()
});


//Standard edX JSinput functions
getInput = function(){
    var state = {'MS1':{'X1':MS1.point1.X(),'X2':MS1.point2.X(),'Y1':MS1.point1.Y(),'Y2':MS1.point2.Y()},
                 'MS2':{'X1':MS2.point1.X(),'X2':MS2.point2.X(),'Y1':MS2.point1.Y(),'Y2':MS2.point2.Y()}
                };
    statestr = JSON.stringify(state);
    //console.log(statestr)

    return statestr;
}

getState = function(){
    state = {'input': JSON.parse(getInput())};
    statestr = JSON.stringify(state);
    return statestr
}

setState = function(statestr){
    state = JSON.parse(statestr);
    state = state['input'];
    //console.log(state['input']);
    if (state["MS1"] && state["MS2"]) {
        MD1.point1.moveTo([state['MS1']['X1'],state['MS1']['Y1']],0);
        MD1.point2.moveTo([state['MS1']['X2'],state['MS1']['Y2']],0);

        MD2.point1.moveTo([state['MS2']['X1'],state['MS2']['Y1']],0);
        MD2.point2.moveTo([state['MS2']['X2'],state['MS2']['Y2']],0);
        
        dashS2.Y1.moveTo([0, iB1SD.Y()]);
        dashS2.Y2.moveTo([iB1SD.X(), iB1SD.Y()]);

        dashS2.X1.moveTo([iB1SD.X(), 0]);
        dashS2.X2.moveTo([iB1SD.X(), iB1SD.Y()]);
        brd1.update();

    }
    brd1.update();
    //console.log(statestr);
    console.debug('State updated successfully from saved.');
}
            
        