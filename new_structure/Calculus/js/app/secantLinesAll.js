var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var configs = [
            {
                f: f0,
                fStr: 'y = 2\\sqrt x',
                df: df0,
                boundingBox: [-1.0, 8.0, 11.0, -1.0],
                a: {
                    init: 0.5,
                    min: 0.0,
                    max: 10.0,
                    step: 0.1
                },
                b: 4.0
            },
            {
                f: f1,
                fStr: 'y = \\frac{x}{x+1}',
                df: df1,
                boundingBox: [-1.0, 1.5, 4.5, -1.5],
                a: {
                    init: 0.5,
                    min: -0.5,
                    max: 4.0,
                    step: 0.1
                },
                b: 3.0
            },
            {
                f: f2,
                fStr: 'y = x^2',
                df: df2,
                boundingBox: [-6.0, 10.5, 6.0, -3.0],
                a: {
                    init: -3.0,
                    min: -5.0,
                    max: 5.0,
                    step: 0.1
                },
                b: 2.0
            }
        ],
        toolNbr = window.toolNbr || 0,
        config, f, fStr, df, boundingBox,
        a, aMin, aMax, aStep, b,
        fixedSecantStr, slope, precision = 6, board, aSlider, aSliderValue;

    var fCurve, secantLine, aPointAxis, aPointCurve, bPointAxis, bPointCurve, aLine, bLine;

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
        $('#dnext-help-link').on('click', toggle);
        aSliderValue = $('#a-slider-value');

        initializeApp();
        createSlider();
        createDropdown();
        createBoard();
        calculateSlope();
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
        var link = $('#dnext-help-link'),
            text = $('#dnext-help-text');

        text.toggle();

        if (text.css('display') === 'none') {
            link.text('+ help');
        }
        else {
            text.css('display', 'block');
            link.text('- help');
        }
    }

    function createSlider() {
        aSlider = $('#a-slider').slider({
            min: aMin,
            max: aMax,
            step: aStep,
            value: a,
            slide: function(event, ui) {
                aSliderValue.html(ui.value);
                a = ui.value;
                updateMovingShapes();
                board.update();
                calculateSlope();
                outputDynamicMath();
            }
        });
    }

    function createDropdown() {
        $('#curve-select-menu').selectmenu({
            change: function(event, ui) {
                toolNbr = ui.item.value;
                initializeApp();
                updateApp();
            }
        });
    }

    function initializeApp() {
        config = configs[toolNbr];
        f = config.f;
        fStr = config.fStr;
        df = config.df;
        boundingBox = config.boundingBox;
        a = config.a.init;
        aMin = config.a.min;
        aMax = config.a.max;
        aStep = config.a.step;
        b = config.b;
        fixedSecantStr = fixedSecantString();
    }

    function updateApp() {
        aSlider.slider('option', {
            'min': aMin,
            'max': aMax,
            'step': aStep,
            'value': a
        });
        aSliderValue.html(a);

        board.setBoundingBox(boundingBox);
        calculateSlope();
        outputStaticMath();
        outputDynamicMath();
        updateShapes();
    }

    function outputStaticMath() {
        katex.render(fStr, $('#math-line1').get(0));
    }

    function outputDynamicMath() {
        katex.render('\\text{Line: }' + secantString(), $('#math-line2').get(0));
    }

    function secantString() {
        return 'y = ' + slope.toFixed(precision) + fixedSecantStr;
    }

    function fixedSecantString() {
        var bStr = nbrToString(Math.abs(b)), bOp = '',
            yb = f(b), ybStr = nbrToString(Math.abs(yb)), ybOp = '';

        if (b > 0) {
            bOp = '-';
        }
        else if (b === 0.0) {
            bStr = '';
        }
        else if (b < 0.0) {
            bOp = '+';
        }

        if (yb > 0) {
            ybOp = '+';
        }
        else if (yb === 0.0) {
            ybStr = '';
        }
        else if (b < 0.0) {
            ybOp = '-';
        }

        return '(x' + bOp + bStr + ')' + ybOp + ybStr;
    }

    function nbrToString(nbr) {
        var nbrStr = nbr.toFixed(precision);

        return parseFloat(nbrStr).toString(); // Removes insignificant trailing zeroes
    }

    function calculateSlope() {
        // Equation of line is y = mx + n. When a = b, use derivative for the slope
        slope = a !== b ? Math.abs((f(b)-f(a)) / (b-a)) : df(a);
    }

    function f0(x) {
        return 2.0*Math.sqrt(x);
    }

    function f1(x) {
        return x/(x+1.0);
    }

    function f2(x) {
        return x*x;
    }

    function df0(x) {
        return 1.0/Math.sqrt(x);
    }

    function df1(x) {
        return 1.0/((x+1)*(x+1));
    }

    function df2(x) {
        return 2.0*x;
    }

    function createBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;
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
        yOffset1 = Math.abs(boundingBox[3] - boundingBox[1]) / 25.0;
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

    function plotGraph() {
        fCurve = board.create(
            'functiongraph',
            [f],
            {strokeWidth: 3, strokeColor: '#444444', highlight: false}
        );

        aPointAxis = board.create('point', [a, 0.0], {
            fixed: true,
            name: '',
            strokeColor: 'red',
            fillColor: 'red'
        });

        aPointCurve = board.create('point', [a, f(a)], {
            fixed: true,
            name: '',
            strokeColor: 'red',
            fillColor: 'red'
        });

        bPointAxis = board.create('point', [b, 0.0], {
            fixed: true,
            name: '',
            strokeColor: 'red',
            fillColor: 'red'
        });

        bPointCurve = board.create('point', [b, f(b)], {
            fixed: true,
            name: '',
            strokeColor: 'red',
            fillColor: 'red'
        });

        secantLine = board.create('line', [[a, f(a)], [b, f(b)]], {
            fixed: true,
            strokeWidth: 2,
            strokeColor: 'blue',
            highlight: false
        });

        aLine = board.create('line', [[a, 0.0], [a, f(a)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: 'red',
            dash: 2,
            highlight: false
        });

        bLine = board.create('line', [[b, 0.0], [b, f(b)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: 'red',
            dash: 2,
            highlight: false
        });
    }

    function updateShapes() {
        var fa = f(a),
            fb = f(b);
        board.removeObject(fCurve);
        fCurve = board.create(
            'functiongraph',
            [f],
            {strokeWidth: 3, strokeColor: '#444444', highlight: false}
        );
        aPointAxis.setPosition(JXG.COORDS_BY_USER, [a, 0.0]);
        aPointCurve.setPosition(JXG.COORDS_BY_USER, [a, fa]);
        bPointAxis.setPosition(JXG.COORDS_BY_USER, [b, 0.0]);
        bPointCurve.setPosition(JXG.COORDS_BY_USER, [b, fb]);
        aLine.point1.moveTo([a, 0.0], 0);
        aLine.point2.moveTo([a, fa], 0);
        bLine.point1.moveTo([b, 0.0], 0);
        bLine.point2.moveTo([b, fb], 0);
        secantLine.point1.moveTo([a, fa], 0);
        secantLine.point2.moveTo([b, fb], 0);
    }

    function updateMovingShapes() {
        var fa = f(a),
            fb = f(b);
        aPointAxis.setPosition(JXG.COORDS_BY_USER, [a, 0.0]);
        aPointCurve.setPosition(JXG.COORDS_BY_USER, [a, fa]);
        aLine.point1.moveTo([a, 0.0], 0);
        aLine.point2.moveTo([a, fa], 0);
        if (a !== b) {
            secantLine.point1.moveTo([a, fa], 0);
        }
        else {
            // Use x = b + 1 and derivative for the slope
            secantLine.point1.moveTo([b + 1.0, slope + fb], 0);
        }
        secantLine.point2.moveTo([b, fb], 0);
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
