////////////
// BOARD 1
////////////
bboxlimits = [-1.5, 12, 12, -1.2];
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

var xlabel1 = brd1.create('text',[9,-0.5,"Real GDP"],{fixed:true});
var ylabel1 = brd1.create('text',[-1.2,10,"Price<br>Level"],{fixed:true});

//Sliders
var slidery = brd1.create('slider',[[-1.0,2.75],[-1.0,8.75],[-3.0,0.0,3.0]],{withLabel:false,snapWidth:0.05,
                                                                       color:'Black'});

//Postivit Slider Transformation
sliderYPositive = brd1.create('transform',[
    function(){return 0.0},
    function(){return slidery.Value()}],
    {type:'translate'}
    );

//Supply Line 1 - fixed
var SRAS1 = createLine(brd1,{'ltype':'Supply','name':'S<sub>1</sub>',color:'DodgerBlue'});
SRAS1.setAttribute({'fixed':true,'highlight':false});

//Demand Line 1 - fixed
var AD1 = createLine(brd1,{'ltype':'Demand','name':'AD<sub>1</sub>','color':'Crimson'})
AD1.setAttribute({'fixed':true,'highlight':false});

//Demand Line 2 - moveable
var H = createTransformLine(brd1,{'transformList':[sliderYPositive],'ltype':'Horizontal','name':'H','color':'Orange'})
H.setAttribute({'withLabel':false,'highlight':true,"visible":false});


////////////
// Intersection Box 1
////////////
var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {'visible':false}); 

var iDonly = brd1.create('intersection', [H, AD1, 0], {"visible":true,withLabel:false,color:"Red"}); 
var iSonly = brd1.create('intersection', [H, SRAS1, 0], {"visible":true,withLabel:false,color:"Blue"});


////////////
// Fixed Dashed Lines for Board 1
////////////
var dashesFixedB1 = createDashedLines2Axis(brd1,iSDfix,
                                          {withLabel:true,
                                           xlabel:'RGDP<sub>0</sub>',
                                           ylabel:'PL<sub>0</sub>',
                                           yoffsets:[5,10],
                                           color:'DarkGray'});


////////////
// Dashes for Supply Only
////////////
var dashesSonly = createDashedLines2Axis(brd1,iSonly,
                                           {withLabel:false,
                                           xlabel:'S<sup>*</sup>',
                                           xoffsets:[5,15],
                                           ylabel:'PL<sup>*</sup>',
                                           yoffsets:[5,10],
                                           color:'DodgerBlue'
                                           });

////////////
// Dashes for Demand Only
////////////
var dashesDonly = createDashedLines2Axis(brd1,iDonly,
                                           {withLabel:false,
                                           xlabel:'AD<sup>*</sup>',
                                           xoffsets:[5,15],
                                           ylabel:'',
                                           yoffsets:[5,10],
                                           color:'Crimson'
                                           });



//////////////////
// Interactivity
//////////////////
brd1.on('move', function() {      
    //Moving Dashed Lines for Supply
    dashesSonly.Y1.moveTo([0, iSonly.Y()]);
    dashesSonly.Y2.moveTo([iSonly.X(), iSonly.Y()]);

    dashesSonly.X1.moveTo([iSonly.X(), 0]);
    dashesSonly.X2.moveTo([iSonly.X(), iSonly.Y()]);

    //Moving Dashed Lines for Demand
    dashesDonly.Y1.moveTo([0, iDonly.Y()]);
    dashesDonly.Y2.moveTo([iDonly.X(), iDonly.Y()]);

    dashesDonly.X1.moveTo([iDonly.X(), 0]);
    dashesDonly.X2.moveTo([iDonly.X(), iDonly.Y()]);

});

brd1.on('mousedown', function() {      
    dashesSonly.Y1.setAttribute({withLabel:true});
    dashesSonly.X1.setAttribute({withLabel:true});
    dashesDonly.Y1.setAttribute({withLabel:true});
    dashesDonly.X1.setAttribute({withLabel:true});
    brd1.update()
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


