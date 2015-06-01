var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var fGraphBoundingBox = [-10.0, 10, 10.0, -10.0], gGraphBoundingBox = [-10.0, 10, 10.0, -10.0],
        x0 = 1.0, x0Min = 0.0, x0Max = 500000.0, x0Step = 1000.0, fGraphxAxis, fGraphyAxis, gGraphxAxis, gGraphyAxis, halfSpan = 10.0, precision = 6,
        fGraphBoard, gGraphBoard, x0Slider, x0SliderValue, fGraphBoundingBoxValue, gGraphBoundingBoxValue,

        fFn = [f0],
        dfFn = [df0],
        gFn = [g0],
        dgFn = [dg0],
        fFnStr  = ['log(x^2) + 3x'],
        dfFnStr = ['\\frac{2}{x} + 3'],
        gFnStr  = ['2log(5x^2) + 4x'],
        dgFnStr = ['\\frac{4}{x} + 4'],

        fnNbr = 0,

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

        $('#dnext-help-link').on('click', toggle);

        fGraphBoundingBoxValue = $('#math-line3');
        gGraphBoundingBoxValue = $('#math-line6');

        createfGraphBoard();
        creategGraphBoard();
        setGraphsBounds();
        createSlider();
        outputStaticMath();
        outputDynamicMath();
        updateGraphs();
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
        x0SliderValue = $('#x0-slider-value');
        x0Slider = $('#x0-slider');
        x0Slider.slider({
            min: x0Min,
            max: x0Max,
            step: x0Step,
            value: x0,
            slide: function(event, ui ) {
                var val = ui.value;
                if (val === 0.0) {
                    val = 1.0;
                }
                x0SliderValue.html(val);
                x0 =val;
                setGraphsBounds();
                outputDynamicMath();
            }
        });
    }

    function outputStaticMath() {
        katex.render("f(x) = " +  fStr, $('#math-line1').get(0));
        katex.render("f'(x) = " + dfStr, $('#math-line2').get(0));
        katex.render("g(x) = " +  gStr, $('#math-line4').get(0));
        katex.render("g'(x) = " + dgStr, $('#math-line5').get(0));
    }

    function outputDynamicMath() {
        fGraphBoundingBoxValue.html(fGraphBoundingBoxString());
        gGraphBoundingBoxValue.html(gGraphBoundingBoxString())
        katex.render("x = " + x0Str() +
                     "\\quad\\quad \\frac{f(x)}{g(x)} = " + fgFracStr() +
                     "\\quad\\quad \\frac{f'(x)}{g'(x)} = " + dfdgFracStr(), $('#math-line7').get(0));
    }

    function fGraphBoundingBoxString() { // For scientific notation, use NUmber.toExponential()
       return 'Window: [' +
              fGraphBoundingBox[0].toFixed() + ', ' +
              fGraphBoundingBox[2].toFixed() + '] x [' +
              fGraphBoundingBox[3].toFixed() + ', ' +
              fGraphBoundingBox[1].toFixed() +
              ']';
    }

    function gGraphBoundingBoxString() {
       return 'Window: [' +
              gGraphBoundingBox[0].toFixed() + ', ' +
              gGraphBoundingBox[2].toFixed() + '] x [' +
              gGraphBoundingBox[3].toFixed() + ', ' +
              gGraphBoundingBox[1].toFixed() +
              ']';
    }

    function setGraphsBounds() {
        fGraphBoundingBox = [x0 - halfSpan, f(x0) + halfSpan, x0 + halfSpan, f(x0) - halfSpan];
        fGraphBoard.setBoundingBox(fGraphBoundingBox);
        fGraphxAxis.point1.moveTo([x0 - halfSpan, f(x0) - halfSpan + 1]);
        fGraphxAxis.point2.moveTo([x0 + halfSpan, f(x0) - halfSpan + 1]);
        fGraphyAxis.point1.moveTo([x0 - halfSpan + 1, f(x0) - halfSpan]);
        fGraphyAxis.point2.moveTo([x0 - halfSpan + 1, f(x0) + halfSpan]);
        fGraphBoard.fullUpdate();

        gGraphBoundingBox = [x0 - halfSpan, g(x0) + halfSpan, x0 + halfSpan, g(x0) - halfSpan];
        gGraphBoard.setBoundingBox(gGraphBoundingBox);
        gGraphxAxis.point1.moveTo([x0 - halfSpan, g(x0) - halfSpan + 1]);
        gGraphxAxis.point2.moveTo([x0 + halfSpan, g(x0) - halfSpan + 1]);
        gGraphyAxis.point1.moveTo([x0 - halfSpan + 1, g(x0) - halfSpan]);
        gGraphyAxis.point2.moveTo([x0 - halfSpan + 1, g(x0) + halfSpan]);
        gGraphBoard.fullUpdate();
    }

    function x0Str() {
        return x0.toFixed();
    }

    function fgFracStr() {
        return (f(x0)/g(x0)).toFixed(precision);
    }

    function dfdgFracStr() {
        return (df(x0)/dg(x0)).toFixed(precision);
    }

    // Functions
    function f0(x) {
        return Math.log(x*x) + 3.0*x;
    }

    function df0(x) {
        return 2.0/x + 3.0;
    }

    function g0(x) {
        return 2.0*Math.log(5.0*x*x) + 4.0*x;
    }

    function dg0(x) {
        return 4.0/x + 4.0;
    }

    function createfGraphBoard() {
        JXG.Options.axis.ticks.insertTicks = false;
        fGraphBoard = JXG.JSXGraph.initBoard('height-graph-board', {
            boundingbox: fGraphBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        fGraphxAxis = fGraphBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false,
            grid: false
        });
        fGraphxAxis.removeAllTicks();


        fGraphyAxis = fGraphBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false,
            grid: false
        });
        fGraphyAxis.removeAllTicks();

        fGraphBoard.create(
            'functiongraph',
            [f],
            {strokeWidth: 2, strokeColor: 'blue', highlight: false}
        );
    }

    function creategGraphBoard() {
        gGraphBoard = JXG.JSXGraph.initBoard('velocity-graph-board', {
            boundingbox: gGraphBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        gGraphxAxis = gGraphBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });
        gGraphxAxis.removeAllTicks();

        gGraphyAxis = gGraphBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });
        gGraphyAxis.removeAllTicks();

        gGraphBoard.create(
            'functiongraph',
            [g],
            {strokeWidth: 2, strokeColor: 'red', highlight: false}
        );
    }

    function updateGraphs() {
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
