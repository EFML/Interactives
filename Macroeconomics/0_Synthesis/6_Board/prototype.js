//General Parameters for Macro
JXG.Options.point.showInfobox = false;
JXG.Options.segment.strokeColor = 'Gray';
JXG.Options.segment.strokeWidth = '5';
JXG.Options.text.fontSize = 15;

////////////
// BOARD 1
////////////
var brd1 = createBoard('jxgbox1', {
    bboxlimits: bboxlimits,
    xname: "Q Money",
    yname: "NIR"
})

////////////
// BOARD 2
////////////
var brd2 = createBoard('jxgbox2', {
    bboxlimits: bboxlimits,
    xname: "Q Bonds per Period",
    yname: "Price<br>Bonds"
})

////////////
// BOARD 3
////////////
var brd3 = createBoard('jxgbox3', {
    bboxlimits: bboxlimits
})

////////////
// BOARD 4
////////////
var brd4 = createBoard('jxgbox4', {
    bboxlimits: bboxlimits
})

////////////
// BOARD 5
////////////
var brd5 = createBoard('jxgbox5', {
    bboxlimits: bboxlimits
})

////////////
// BOARD 5
////////////
var brd6 = createBoard('jxgbox6', {
    bboxlimits: bboxlimits
})

//Sliders
var sliderx = brd1.create('slider', [
    [2.0, -1.25],
    [8, -1.25],
    [-1.5, 0, 1.5]
], {
    withLabel: false,
    snapWidth: 0.05,
    color: 'Orange'
});

//Postivit Slider Transformation
sliderPositive = brd1.create('transform', [
    function() {
        return sliderx.Value()
    },
    function() {
        return 0.0
    }
], {
    type: 'translate'
});

//Negative Slider Transformation
sliderNegative = brd1.create('transform', [
    function() {
        return -sliderx.Value()
    },
    function() {
        return 0.0
    }
], {
    type: 'translate'
});


////////////
// BOARD 1
////////////
//Demand Board 1
var D1 = createLine(brd1, {
    'ltype': 'Demand',
    'name': 'M<sub>D</sub>',
    color: 'DodgerBlue'
});
//Supply Board 1
var S1 = createLine(brd1, {
    'ltype': 'Vertical',
    'name': 'M<sub>S1</sub>',
    color: 'Gray'
});
S1.setAttribute({
    'fixed': true
});

var S2 = createTransformLine(brd1, {
    'ltype': 'Vertical',
    'transform': sliderPositive,
    'name': 'M<sub>S2</sub>',
    color: 'DodgerBlue'
});

//Intersection of SD board 1
var iSDB1 = brd1.create('intersection', [S2, D1], {
    withLabel: false,
    highlight: false
});
//var gSDB1 = brd1.create('glider',[3.75,7.75,S1],{withLabel:false,highlight:false});

brd1.addChild(brd2);
brd1.addChild(brd3);
brd1.addChild(brd4);
brd1.addChild(brd5);
brd1.addChild(brd6);

////////////
// BOARD 2
////////////
//Demand Board 2 - with a Positive transformation
var SB2 = createLine(brd2, {
    'ltype': 'Supply',
    'name': 'S<sub>1</sub>',
    color: 'Gray'
});
//Supply Board 2
var D1B2 = createLine(brd2, {
    'ltype': 'Demand',
    'name': 'D<sub>1</sub>',
    color: 'Gray'
});
D1B2.setAttribute({
    'fixed': true
});

var D2B2 = createTransformLine(brd2, {
    'ltype': 'Demand',
    'transform': sliderPositive,
    'name': 'D<sub>2</sub>',
    color: 'DodgerBlue'
});
//Intersection Board 2
var iSDB2 = brd2.create('intersection', [SB2, D2B2], {
    withLabel: false,
    highlight: false
});


////////////
// BOARD 3
////////////
//Demand Board 2 - with a Positive transformation
var SB3 = createLine(brd3, {
    'ltype': 'Supply',
    'name': 'S<sub>1</sub>',
    color: 'Gray'
});
//Supply Board 2
var D1B3 = createLine(brd3, {
    'ltype': 'Demand',
    'name': 'D<sub>1</sub>',
    color: 'Gray'
});
D1B3.setAttribute({
    'fixed': true
});

var D2B3 = createTransformLine(brd3, {
    'ltype': 'Demand',
    'transform': sliderNegative,
    'name': 'D<sub>2</sub>',
    color: 'DodgerBlue'
});
//Intersection Board 2
var iSDB3 = brd3.create('intersection', [SB3, D2B3], {
    withLabel: false,
    highlight: false
});


////////////
// BOARD 4
////////////
//Demand Board 2 - with a Positive transformation
var SB4 = createLine(brd4, {
    'ltype': 'Supply',
    'name': 'S<sub>1</sub>',
    color: 'Gray'
});
//Supply Board 2
var D1B4 = createLine(brd4, {
    'ltype': 'Vertical',
    'name': 'D<sub>1</sub>',
    color: 'Gray'
});
D1B4.setAttribute({
    'fixed': true
});

var D2B4 = createTransformLine(brd4, {
    'ltype': 'Vertical',
    'transform': sliderNegative,
    'name': 'D<sub>2</sub>',
    color: 'DodgerBlue'
});
//Intersection Board 2
var iSDB4 = brd4.create('intersection', [SB4, D2B4], {
    withLabel: false,
    highlight: false
});


////////////
// BOARD 5
////////////
//Demand Board 1
var S5 = createLine(brd5, {
    'ltype': 'Supply',
    'name': 'S',
    color: 'DodgerBlue'
});
//Supply Board 1
var D1B5 = createLine(brd5, {
    'ltype': 'Demand',
    'name': 'D',
    color: 'Gray'
});
D1B5.setAttribute({
    'fixed': true
});

var D2B5 = createTransformLine(brd5, {
    'ltype': 'Demand',
    'transform': sliderNegative,
    'name': 'L<sub>2</sub>',
    color: 'DodgerBlue'
});

//Intersection of SD board 1
var iSDB = brd5.create('intersection', [D2B5, S5], {
    withLabel: false,
    highlight: false
});
//var gSDB1 = brd1.create('glider',[3.75,7.75,S1],{withLabel:false,highlight:false});


////////////
// BOARD 6
////////////
//Demand Board 1
var S6 = createLine(brd6, {
    'ltype': 'Supply',
    'name': 'S',
    color: 'DodgerBlue'
});
//Supply Board 1
var D1B6 = createLine(brd6, {
    'ltype': 'Demand',
    'name': 'D',
    color: 'Gray'
});
D1B6.setAttribute({
    'fixed': true
});

var D2B6 = createTransformLine(brd6, {
    'ltype': 'Demand',
    'transform': sliderPositive,
    'name': 'L<sub>2</sub>',
    color: 'DodgerBlue'
});

//Intersection of SD board 1
var iSDB = brd6.create('intersection', [D2B6, S6], {
    withLabel: false,
    highlight: false
});
//var gSDB1 = brd1.create('glider',[3.75,7.75,S1],{withLabel:false,highlight:false});



createDashedLines2Axis = function(board, intersection, options) {
    var fixed = options.fixed || true; // defaults
    var withLabel = options.withLabel || false;
    var xlabel = options.xlabel || '';
    var ylabel = options.ylabel || '';
    var color = options.color || 'gray';
    var visible = options.visible || true;

    var Y1, Y2, YLine, X1, X2, XLine, obj = {};
    var Y1 = board.create('point', [0, intersection.Y()], {
        'withLabel': withLabel,
        'name': ylabel,
        'visible': true,
        'size': '0.5',
        'strokeColor': 'Gray',
        'label': {
            'offset': [2, 12]
        }
    });

    var Y2 = board.create('point', [intersection.X(), intersection.Y()], {
        'withLabel': false,
        'visible': false,
        'size': '0.0',
        'strokeColor': ''
    });

    var YLine = board.create('segment', [Y1, Y2], {
        'strokeColor': color,
        'strokeWidth': '2',
        'dash': '1',
        'fixed': fixed,
        'visible': visible
    });

    var X1 = board.create('point', [intersection.X(), 0], {
        'withLabel': withLabel,
        'name': xlabel,
        'visible': true,
        'size': '0.5',
        'strokeColor': 'Gray',
        'label': {
            'offset': [2, 12]
        }
    });

    var X2 = board.create('point', [intersection.X(), intersection.Y()], {
        'withLabel': false,
        'visible': false,
        'size': '0.0',
        'strokeColor': ''
    });

    var XLine = board.create('segment', [X1, X2], {
        'strokeColor': color,
        'strokeWidth': '2',
        'dash': '1',
        'fixed': fixed,
        'visible': visible
    });


    var obj = {
        Y1: Y1,
        Y2: Y2,
        YLine: YLine,
        X1: X1,
        X2: X2,
        XLine: XLine
    }

    return obj;
}


//Dashed Lines - Board 1
var dashB1fixed = createDashedLines2Axis(brd1, iSDB1, {
    fixed: true,
    withLabel: false,
    color: 'Gray'
});
var dashB1 = createDashedLines2Axis(brd1, iSDB1, {
    fixed: false,
    withLabel: true,
    color: 'DodgerBlue',
    xlabel: 'Q<sub>S</sub>',
    ylabel: 'NIR'
});

//Dashed Lines - Board 2
var dashB2fixed = createDashedLines2Axis(brd2, iSDB2, {
    fixed: true,
    withLabel: false,
    color: 'Gray'
});
var dashB2 = createDashedLines2Axis(brd2, iSDB2, {
    fixed: false,
    withLabel: true,
    color: 'DodgerBlue',
    xlabel: 'Q<sub>2</sub>',
    ylabel: 'P<sub>2</sub>'
});

//////////////////
// Interactivity
//////////////////
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
});