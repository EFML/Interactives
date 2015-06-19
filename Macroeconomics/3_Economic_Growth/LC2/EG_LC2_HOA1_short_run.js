////////////
// BOARD 1
////////////
var newBBox = [-2.2, 12, 12, -1.75];

var brd1 = createBoard('jxgbox1',{xname:"Capital Goods", yname:"Consumer<br>Goods",
                                  grid:false,'xpos':[8,-0.5],'ypos':[-2.1,10],bboxlimits:newBBox});

// //Sliders
// var sliderx = brd1.create('slider',[[2.5,-1.2],[7.5,-1.2],[-2.0,0.0,2.0]],{withLabel:false,snapWidth:0.01,
//                                                                        color:'DodgerBlue'});

//Sliders
var slidery = brd1.create('slider',[[-1.5,2],[-1.5,7],[3.0,5.0,7.0]],{withLabel:false,snapWidth:0.01,
                                                                       color:'Crimson'});

//Postive Slider Transformation
var sliderYPositive = brd1.create('transform',[
    function(){return slidery.Value()},
    function(){return 0.0}],
    {type:'translate'}
    );

// var sliderRX = brd1.create('transform',[
//     function(){return sliderx.Value()},
//     function(){return 0.0}],
//     {type:'translate'}
//     );

// var sliderRY = brd1.create('transform',[
//     function(){return 0.0},
//     function(){return sliderx.Value()}],
//     {type:'translate'}
//     );

// Create an arc out of three free points
var Radius = 8.0;
var po = brd1.create('point', [-1, -1],{visible:false});
var tmpx = brd1.create('point',[Radius, 0.0],{visible:false});
// var px = brd1.create('point', [tmpx, [sliderRX]],{visible:false});
var tmpy = brd1.create('point',[0.0, Radius],{visible:false});
// var py = brd1.create('point', [tmpy, [sliderRY]],{visible:false});

// var semifix = brd1.create('arc', [po, tmpx, tmpy],{strokeWidth:4,strokeColor:'Gray',highlight:false,dash:1});
var semi = brd1.create('arc', [po, tmpx, tmpy],{strokeWidth:5,strokeColor:'DodgerBlue',highlight:false});


var hx = brd1.create('point', [0.0,function(){return slidery.Value();}],{visible:false});
var hy = brd1.create('point', [10.0,function(){return slidery.Value();}],{visible:false});
var hA = brd1.create('segment',[hx,hy],{visible:false});
var iA = brd1.create('intersection',[hA,semi],{name:'A'});

////////////
// Fixed Dashed Lines for Board 1
////////////
var dashA = createDashedLines2Axis(brd1,iA,
                                  {fixed:true,
                                   withLabel:true,
                                   xlabel:'K<sub>A</sub>',
                                   ylabel:'C<sub>A</sub>',
                                   color:'Gray'});

//////////////////
// Interactivity
//////////////////
brd1.on('move', function() {      
    //Moving Dashed Lines in Board 1
    
    dashA.Y1.moveTo([0, iA.Y()]);
    dashA.Y2.moveTo([iA.X(), iA.Y()]);

    dashA.X1.moveTo([iA.X(), 0]);
    dashA.X2.moveTo([iA.X(), iA.Y()]);

});

brd1.on('mousedown', function() {      
    // AD2.setAttribute({withLabel:true});
    // SRAS2.setAttribute({withLabel:true});
    // dashS2.Y1.setAttribute({withLabel:true});
    // dashS2.X1.setAttribute({withLabel:true});
    // brd1.update()
});


//Standard edX JSinput functions
setState = function(transaction,statestr){
    state = JSON.parse(statestr);
    //console.log(state);
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
    var state = {"iS2D":{'X':iS2D.X(),'Y':iS2D.Y()},
                 "iSDfix":{'X':iSDfix.X(),'Y':iSDfix.Y()},
                 "AD2":{'p1X':AD2.point1.X(),'p2X':AD2.point2.X(),
                        'p1Y':AD2.point1.Y(),'p2Y':AD2.point2.Y()},
                 "AD1":{'p1X':AD1.point1.X(),'p2X':AD1.point2.X(),
                        'p1Y':AD1.point1.Y(),'p2Y':AD1.point2.Y()},
                 "SRAS2":{'p1X':SRAS2.point1.X(),'p2X':SRAS2.point2.X(),
                          'p1Y':SRAS2.point1.Y(),'p2Y':SRAS2.point2.Y()},
                 "SRAS1":{'p1X':SRAS1.point1.X(),'p2X':SRAS1.point2.X(),
                          'p1Y':SRAS1.point1.Y(),'p2Y':SRAS1.point2.Y()}
                };
    statestr = JSON.stringify(state);
    //console.log('hello',statestr);
    return statestr;
}

createChannel(getGrade, getState, setState);


