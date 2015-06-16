//Custom Parameters
labelOffset = {'X':130,'Y':140};

bbox = [-1.5, 12, 12, -1.5];
var brd1 = createBoard('jxgbox1',{bboxlimits:bbox,xname:"Real National Income", 'xpos':[8.75,-0.65],
                                  yname:"Price<br>Level",grid:false,'ypos':[-1.25,10.0]});

// //Sliders
// var sliderx = brd1.create('slider',[[3.0,-1.0],[8,-1.0],[0.0,0,1.4]],{withLabel:false,snapWidth:0.05,
//                                                                        color:'Orange'});
// var slidery = brd1.create('slider',[[-1.0,2.75],[-1.0,8.75],[0.0,0.0,1.4]],{withLabel:false,snapWidth:0.05,
//                                                                        color:'Black'});

// //Postivit Slider Transformation
// sliderXPositive = brd1.create('transform',[
//     function(){return sliderx.Value()},
//     function(){return sliderx.Value()}],
//     {type:'translate'}
//     );

// sliderYPositive = brd1.create('transform',[
//     function(){return slidery.Value()},
//     function(){return slidery.Value()}],
//     {type:'translate'}
//     );

//Supply Line 1 - fixed
var SRAS1 = createLine(brd1,{'ltype':'Supply','name':'SRAS',color:'DodgerBlue'});
SRAS1.setAttribute({'fixed':true,'highlight':false});

//Demand Line 1 - fixed
var AD1 = createLine(brd1,{'ltype':'Demand','name':'AD<sub>1</sub>','color':'Orange'});
AD1.setAttribute({'dash':1,'fixed':true,'highlight':false});

//Demand Line 2 - moveable
var AD2 = createLine(brd1,{'ltype':'Demand','name':'AD<sub>2</sub>','color':'Orange'});
AD2.setAttribute({'withLabel':false,'highlight':false,"visible":true});


////////////
//LRAS - straight line
////////////
var LRAS = brd1.create('segment',[[5.75,11.0],[5.75,0.0]],
                       {'strokeColor':'DarkGray','strokeWidth':'3',
                        'name':'LRAS','withLabel':true, 'fixed':true,
                        'label':{'offset':[-15,200]}});


////////////
// Intersection Box 1
////////////
var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {'visible':false}); 
var iSD = brd1.create('intersection', [SRAS1, AD2, 0], {'visible':false});


////////////
// Fixed Dashed Lines for Board 1
////////////
var dashesFixedB1 = createDashedLines2Axis(brd1,iSDfix,
                                          {withLabel:true,
                                           xlabel:'RGDP<sub>1</sub>',
                                           ylabel:'PL<sub>1</sub>',
                                           yoffsets:[5,10],
                                           color:'DarkGray'});

////////////
// Dashes for Demand and Supply 
////////////
var dashesSD = createDashedLines2Axis(brd1,iSD,
                                           {withLabel:false,
                                           xlabel:'RGDP<sub>2</sub>',
                                           xoffsets:[5,15],
                                           ylabel:'PL<sub>2</sub>',
                                           yoffsets:[5,10],
                                           color:'Orange'
                                           });


//////////////////
// Interactivity
//////////////////
brd1.on('move', function() {      
    //Moving Dashed Lines for Demand/Supply
    dashesSD.Y1.moveTo([0, iSD.Y()]);
    dashesSD.Y2.moveTo([iSD.X(), iSD.Y()]);

    dashesSD.X1.moveTo([iSD.X(), 0]);
    dashesSD.X2.moveTo([iSD.X(), iSD.Y()]);

});

brd1.on('mousedown', function() {      
    // AD2.setAttribute({withLabel:true});
    // dashesSD.Y1.setAttribute({withLabel:true});
    // dashesSD.X1.setAttribute({withLabel:true});
    // brd1.update()
});

//Standard edX JSinput functions
setState = function(transaction, statestr){
    state = JSON.parse(statestr);
    console.log(statestr);
    //console.log(state["dragLine"]);

    if (state["AD2"] && state["SRAS2"]) {
        //brd1.removeObject('AD2');
        var point1 = [state["AD2"]["p1X"],state["AD2"]["p1Y"]];
        var point2 = [state["AD2"]["p2X"],state["AD2"]["p2Y"]]
        AD2.point1.moveTo(point1,0);
        AD2.point2.moveTo(point2,0);

        var point1 = [state["SRAS2"]["p1X"],state["SRAS2"]["p1Y"]];
        var point2 = [state["SRAS2"]["p2X"],state["SRAS2"]["p2Y"]]
        SRAS2.point1.moveTo(point1,0);
        SRAS2.point2.moveTo(point2,0);

        brd1.update();
    }
    
    console.debug('State updated successfully from saved.');
}

getState = function(){
    var state = JSON.parse(getGrade());
    statestr = JSON.stringify(state);
    // console.log(statestr);
    return statestr;
}

getGrade = function() {    
    var state = {"AD2":{'p1X':AD2.point1.X(),'p2X':AD2.point2.X(),
                        'p1Y':AD2.point1.Y(),'p2Y':AD2.point2.Y()},
                 "AD1":{'p1X':AD1.point1.X(),'p2X':AD1.point2.X(),
                        'p1Y':AD1.point1.Y(),'p2Y':AD1.point2.Y()},
                 "SRAS2":{'p1X':SRAS2.point1.X(),'p2X':SRAS2.point2.X(),
                          'p1Y':SRAS2.point1.Y(),'p2Y':SRAS2.point2.Y()},
                 "SRAS1":{'p1X':SRAS1.point1.X(),'p2X':SRAS1.point2.X(),
                          'p1Y':SRAS1.point1.Y(),'p2Y':SRAS1.point2.Y()}
                };
    statestr = JSON.stringify(state);
    return statestr;
}

createChannel(getGrade, getState, setState);


