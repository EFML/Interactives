////////////
// BOARD 1
////////////
var brd1 = createBoard('jxgbox1',{xname:"Q Money", yname:"NIR"})

////////////
// BOARD 2
////////////
var brd2 = createBoard('jxgbox2',{xpos:[4,-1], xname:"Investment Demand", yname:"RIR"})

////////////
// BOARD 3
////////////
var brd3 = createBoard('jxgbox3',{xname:"RGDP", yname:"PL"})

//Sliders
var sliderx = brd1.create('slider',[[2.0,-1.25],[8,-1.25],[-1.75,0,1.75]],{withLabel:false,snapWidth:0.05,
                                                                         color:'DodgerBlue'});

//Postivit Slider Transformation
sliderPositive = brd1.create('transform',[
    function(){return sliderx.Value()},
    function(){return 0.0}],
    {type:'translate'}
    );

//Negative Slider Transformation
sliderNegative = brd1.create('transform',[
    function(){return -sliderx.Value()},
    function(){return 0.0}],
    {type:'translate'}
    );


////////////
// BOARD 1
////////////
//Demand Board 1
var D1 = createLine(brd1,{'ltype':'Demand','name':'D<sub>M</sub>',color:'Gray'});
//Supply Board 1
var S1 = createLine(brd1,{'ltype':'Vertical','name':'S<sub>M1</sub>',color:'Gray'});
S1.setAttribute({dash:2,strokeWidth:3,'fixed':true});

var S2 = createTransformLine(brd1,{'ltype':'Vertical','transformList':[sliderPositive],'name':'S<sub>M2</sub>',color:'DodgerBlue'});
S2.setAttribute({withLabel:false});

//Intersection of SD board 1
var iSDB1 = brd1.create('intersection',[S2,D1],{withLabel:false,highlight:false});
//var gSDB1 = brd1.create('glider',[3.75,7.75,S1],{withLabel:false,highlight:false});

//Dashed Lines - Board 1
var dashB1fixed = createDashedLines2Axis(brd1,iSDB1,{fixed:true,withLabel:true,color:'Gray',
                                               xlabel:'Q<sub>1</sub>',ylabel:'N<sub>1</sub>'});
var dashB1 = createDashedLines2Axis(brd1,iSDB1,{fixed:false,withLabel:false,color:'DodgerBlue',
                                               xlabel:'Q<sub>2</sub>',ylabel:'N<sub>2</sub>'});


///////////////////////////////////
// Add Children to Board 1
///////////////////////////////////

brd1.addChild(brd2);
brd1.addChild(brd3);

////////////
// BOARD 2
////////////
//Demand Board 2 - with a Positive transformation
var SB2 = createTransformLine(brd2,{'ltype':'Vertical','transformList':[sliderPositive],'name':'S<sub>1</sub>',color:'Gray'});
SB2.setAttribute({visible:false});
//Supply Board 2
var D1B2 = createLine(brd2,{'ltype':'Demand','name':'D',color:'Gray'});
D1B2.setAttribute({'fixed':true});

// var D2B2 = createTransformLine(brd2,{'ltype':'Demand','transformList':[sliderPositive],'name':'D<sub>2</sub>',color:'DodgerBlue'});
//Intersection Board 2     
var iSDB2 = brd2.create('intersection',[SB2,D1B2],{withLabel:false,highlight:false});

//Dashed Lines - Board 2
var dashB2fixed = createDashedLines2Axis(brd2,iSDB2,{fixed:true,withLabel:true,color:'Gray',
                                                xlabel:'Q<sub>1</sub>',ylabel:'R<sub>1</sub>'});
var dashB2 = createDashedLines2Axis(brd2,iSDB2,{fixed:false,withLabel:false,color:'DodgerBlue',
                                                xlabel:'Q<sub>2</sub>',ylabel:'R<sub>2</sub>'});

////////////
// BOARD 3
////////////
//Supply Board 3 
var SB3 = createLine(brd3,{'ltype':'Supply','name':'SRAS',color:'Gray'});
SB3.setAttribute({'fixed':true});
//Demand Board 3
var D1B3 = createLine(brd3,{'ltype':'Demand','name':'AD<sub>1</sub>',color:'Gray'});
D1B3.setAttribute({dash:2,strokeWidth:3,'fixed':true});

var D2B3 = createTransformLine(brd3,{'ltype':'Demand','transformList':[sliderPositive],'name':'AD<sub>2</sub>',color:'DodgerBlue'});
D2B3.setAttribute({withLabel:false});
//Intersection Board 2     
var iSDB3 = brd3.create('intersection',[SB3,D2B3],{withLabel:false,highlight:false});

//Dashed Lines - Board 3
var dashB3fixed = createDashedLines2Axis(brd3,iSDB3,{fixed:true,withLabel:true,color:'Gray',
                                                xlabel:'Y<sub>1</sub>',ylabel:'P<sub>1</sub>'});
var dashB3 = createDashedLines2Axis(brd3,iSDB3,{fixed:false,withLabel:false,color:'DodgerBlue',
                                                xlabel:'Y<sub>2</sub>',ylabel:'P<sub>2</sub>'});


//////////////////
// Interactivity
//////////////////
brd1.on('mousedown', function() {
    dashB1.X1.setAttribute({withLabel:true});
    dashB1.Y1.setAttribute({withLabel:true});

    dashB2.X1.setAttribute({withLabel:true});
    dashB2.Y1.setAttribute({withLabel:true});

    dashB3.X1.setAttribute({withLabel:true});
    dashB3.Y1.setAttribute({withLabel:true});

    S2.setAttribute({withLabel:true});
    D2B3.setAttribute({withLabel:true});
});


brd1.on('move', function() {      
    //Moving 1st set of Dashed Lines in Board 1
    dashB1.Y1.moveTo([0, iSDB1.Y()]);
    dashB1.Y2.moveTo([iSDB1.X(), iSDB1.Y()]);

    dashB1.X1.moveTo([iSDB1.X(), 0]);
    dashB1.X2.moveTo([iSDB1.X(), iSDB1.Y()]);
        
    //Moving Board 2 Dashed Lines
    dashB2.Y1.moveTo([0, iSDB2.Y()]);
    dashB2.Y2.moveTo([iSDB2.X(), iSDB2.Y()]);

    dashB2.X1.moveTo([iSDB2.X(), 0]);
    dashB2.X2.moveTo([iSDB2.X(), iSDB2.Y()]);

    //Moving Board 2 Dashed Lines
    dashB3.Y1.moveTo([0, iSDB3.Y()]);
    dashB3.Y2.moveTo([iSDB3.X(), iSDB3.Y()]);

    dashB3.X1.moveTo([iSDB3.X(), 0]);
    dashB3.X2.moveTo([iSDB3.X(), iSDB3.Y()]);
});





