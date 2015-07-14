var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var xMin = -11.0, xMax = 11.0, yMin = -8.0, yMax = 8.0, zoom = 4.0/11.0, xPos = 1.3,xCenter = 0.0, boundsPrecision = 3, precision = 6,
        boundingBox = [zoom*xMin, zoom*yMax, zoom*xMax, zoom*yMin],
        board, fCurve, gCurve, xAxis, yAxis, xAxisGlider, fPoint, gPoint, fgLine,

        fFn = [f0, f1, f2, f3, f4],
        dfFn = [df0, df1, df2, df3, df4],
        gFn = [g0, g1, g2, g3, g4],
        dgFn = [dg0, dg1, dg2, dg3, dg4],
        fFnStr  = ['\\sqrt{e^{x}} - 1',        '\\sqrt{e^{x}} - 1',        '\\sin(2x)',  '\\log(x)',     'e^{3x} - 1'],
        dfFnStr = ['\\frac{\\sqrt{e^{x}}}{2}', '\\frac{\\sqrt{e^{x}}}{2}', '2\\cos(2x)', '\\frac{1}{x}', '3e^{3x}'],
        gFnStr  = ['\\sin(-x)',                'x',                        '\\sin(x)',   'x-1',          'e^{x}'],
        dgFnStr = ['-\\cos(-x)',               '1',                        '\\cos(x)',   '1',            'e^{x}'],

        config = window.LHospitalZoomSettings || {fnNbr: 0},
        fnNbr = config.fnNbr,

        f = fFn[fnNbr],
        fStr = fFnStr[fnNbr],
        df = dfFn[fnNbr],
        dfStr = dfFnStr[fnNbr],
        g = gFn[fnNbr],
        gStr = gFnStr[fnNbr],
        dg = dgFn[fnNbr],
        dgStr = dgFnStr[fnNbr];

    init();

    function init() {
        // Check version of JQuery
        // Studio and LMS: 1.7.2
        // Current: 2.1.3
        console.log('JQuery version:' + $.fn.jquery);
        // Check version of UnderscoreJS
        // Studio and LMS: 1.4.4
        // Current: 1.8.2
        console.log('UnderscoreJS version: ' + _.VERSION);
        // Check version of jQuery UI
        // Studio and LMS: 1.10.0
        // Current: 1.11
        console.log('JQuery UI version: ' + $.ui.version);
        // Check version of MathJax
        // Studio and LMS use CDN and are up to date with current version 2.5.1
        // console.log('MathJax CDN version: ' + MathJax.cdnVersion);
        // Check version of JSXGraph:
        // Current: 0.99.3
        console.log('JSXGraph version: ' + JXG.version);

        $(window).on('resize', resizeBox);
        $('#dnext-about-link').on('click', toggle);

        setBoardInitValues();
        createBoard();
        createSlider();
        outputStaticMath();
        outputDynamicMath();
        plotGraph();
    }

    function resizeBox(){
        var boardWidth = $('.container').width();
        board.needsFullUpdate = true;
        board.resizeContainer(boardWidth, board.canvasHeight);
        board.setBoundingBox(boundingBox);
        board.update();
    }

    function toggle() {
        var link = $('#dnext-about-link'),
            text = $('#dnext-about-text');

        text.toggle();

        if (text.css('display') === 'none') {
            link.text('+ about');
        }
        else {
            text.css('display', 'block');
            link.text('- about');
        }
    }

    function createSlider() {
        $('#zoom-slider').slider({
            min: 0.001,
            max: 1.0,
            step: 0.001,
            value: zoom,
            slide: function(event, ui ) {
                $("#a-slider-value" ).html(ui.value);
                zoom = ui.value;
                updateGraph();
                board.update();
                outputDynamicMath();
            }
        });
    }

    function outputStaticMath() {
        katex.render("f(x) = " +  fStr, $('#math-line1-col1').get(0));
        katex.render("f'(x) = " + dfStr, $('#math-line1-col2').get(0));
        katex.render("g(x) = " +  gStr, $('#math-line2-col1').get(0));
        katex.render("g'(x) = " + dgStr, $('#math-line2-col2').get(0));
    }

    function outputDynamicMath() {
        katex.render("a = " + xStr() +
                     "\\quad\\quad \\frac{f(a)}{g(a)} = " + fgFracStr() +
                     "\\quad\\quad \\frac{f'(a)}{g'(a)} = " + dfdgFracStr(), $('#math-line3').get(0));
        katex.render('\\text{Window: }' + boundingBoxString(), $('#math-line4').get(0));
    }

    function xStr() {
        return xPos.toFixed(precision);
    }

    function fgFracStr() {
        return (f(xPos)/g(xPos)).toFixed(precision);
    }

    function dfdgFracStr() {
        return (df(xPos)/dg(xPos)).toFixed(precision);
    }

    function setBoardInitValues() {
        if (fnNbr === 3) {
            xMin = -10.0;
            xMax = 12.0;
            xPos = 2.3;
            xCenter = 1.0;
        }
        boundingBox = [xCenter + zoom*xMin, zoom*yMax, xCenter + zoom*xMax, zoom*yMin];
    }

    function boundingBoxString() {
       return '[' +
              boundingBox[0].toFixed(boundsPrecision) + ', ' +
              boundingBox[2].toFixed(boundsPrecision) + '] \\times [' +
              boundingBox[3].toFixed(boundsPrecision) + ', ' +
              boundingBox[1].toFixed(boundsPrecision) +
              ']';
    }

    // Functions
    function f0(x) {
        return Math.sqrt(Math.exp(x)) - 1.0;
    }

    function df0(x) {
        return 0.5*Math.sqrt(Math.exp(x));
    }

    function g0(x) {
        return -Math.sin(x);
    }

    function dg0(x) {
        return -Math.cos(x);
    }

    function f1(x) {
        return Math.sqrt(Math.exp(x)) - 1.0;
    }

    function df1(x) {
        return 0.5*Math.sqrt(Math.exp(x));
    }

    function g1(x) {
        return x;
    }

    function dg1(x) {
        return 1.0;
    }

    function f2(x) {
        return Math.sin(2.0*x);
    }

    function df2(x) {
        return 2.0*Math.cos(2.0*x);
    }

    function g2(x) {
        return Math.sin(x);
    }

    function dg2(x) {
        return Math.cos(x);
    }

    function f3(x) {
        return Math.log(x);
    }

    function df3(x) {
        return 1/x;
    }

    function g3(x) {
        return x - 1;
    }

    function dg3(x) {
        return 1.0;
    }

    function f4(x) {
        return Math.exp(3.0*x) - 1.0;
    }

    function df4(x) {
        return 3.0*Math.exp(3.0*x);
    }

    function g4(x) {
        return Math.exp(x);
    }

    function dg4(x) {
        return Math.exp(x);
    }

    function createBoard() {
        var xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;
        board = JXG.JSXGraph.initBoard('jxgbox', {
            boundingbox: boundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: true
        });

        xAxis = board.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });

        yAxis = board.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = Math.abs(boundingBox[2] - boundingBox[0]) / 100.0;
        yOffset1 = Math.abs(boundingBox[3] - boundingBox[1]) / 40.0;
        xOffset2 = Math.abs(boundingBox[2] - boundingBox[0]) / 50.0;
        yOffset2 = Math.abs(boundingBox[3] - boundingBox[1]) / 50.0;

        xAxisLabel = board.create('text', [boundingBox[2] - xOffset1, yOffset1, 'x'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = board.create('text', [xOffset2, boundingBox[1] - yOffset2, 'y'], {
            anchorX: 'left',
            fixed:true
        });
    }

    function xAxisGliderDown() {
        board.on('move', xAxisGliderDrag);
        board.on('up', boardUp);
    }

    function xAxisGliderDrag() {
        var fxPos, gxPos, yMin, yMax;

        xPos = xAxisGlider.X();
        if (Math.abs(xPos - xCenter) < 0.00005) {
            xPos = fnNbr !== 3 ? 0.0 : 1.0;
        }

        fxPos = f(xPos);
        gxPos = g(xPos);
        yMin = Math.min(fxPos, gxPos, 0.0);
        yMax = Math.max(fxPos, gxPos, 0.0);

        fPoint.moveTo([xPos, fxPos], 0);
        gPoint.moveTo([xPos, gxPos], 0);

        fgLine.point1.moveTo([xPos, yMin], 0);
        fgLine.point2.moveTo([xPos, yMax], 0);

        board.update();

        outputDynamicMath();
    }

    function boardUp() {
        board.off('move', xAxisGliderDrag);
        board.off('up', boardUp);
    }

    function plotGraph() {
        fCurve = board.create(
            'functiongraph',
            [f],
            {strokeWidth: 3, strokeColor: 'blue', highlight: false}
        );

        gCurve = board.create(
            'functiongraph',
            [g],
            {strokeWidth: 3, strokeColor: 'red', highlight: false}
        );

        xAxisGlider = board.create('glider', [xPos, 0.0, xAxis], {
            strokeColor: 'black',
            fillColor: 'white',
            size: 5,
            name: ''
        });

        // Do not use mousedown: http://www.intmath.com/cg3/jsxgraph-coding-summary.php (Check behavior on IE11)
        xAxisGlider.on('down', xAxisGliderDown);

        fPoint = board.create('point', [xPos, f(xPos)], {
            fixed: true,
            name: '',
            size: 2,
            strokeColor: 'blue',
            fillColor: 'blue'
        });

        gPoint = board.create('point', [xPos, g(xPos)], {
            fixed: true,
            name: '',
            size: 2,
            strokeColor: 'red',
            fillColor: 'red'
        });

        fgLine = board.create('line', [[xPos, Math.min(f(xPos), g(xPos), 0.0)], [xPos,  Math.max(f(xPos), g(xPos), 0.0)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: 'black',
            dash: 1,
            highlight: false
        });
    }

    function updateGraph() {
        var xMinPadded, xMaxPadded, xSpan;

        boundingBox = [xCenter + zoom*xMin, zoom*yMax, xCenter + zoom*xMax, zoom*yMin];
        board.setBoundingBox(boundingBox);

        xSpan = boundingBox[2] - boundingBox[0];
        xMinPadded = boundingBox[0] + 0.05*xSpan;
        xMaxPadded = boundingBox[2] - 0.05*xSpan;

        if (xPos < xMinPadded || xPos > xMaxPadded) {
            if (xPos < xMinPadded) {
                xPos = xMinPadded;
            }
            else {
                xPos = xMaxPadded;
            }
            xAxisGlider.moveTo([xPos, 0.0], 0);
            xAxisGliderDrag();
        }
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
