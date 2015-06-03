var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var fGraphBoundingBox = [], gGraphBoundingBox = [], x0 = 1.0, x0Min = 0.0, x0Max = 6.0, x0Step = 0.01, fGraphxAxisTicks = [], fGraphxAxisLabels = [], fGraphyAxisTicks = [], fGraphyAxisLabels = [],
        gGraphxAxisTicks = [], gGraphxAxisLabels = [], gGraphyAxisTicks = [], gGraphyAxisLabels = [],
        fGraphBoard, gGraphBoard, x0Slider, x0SliderValue, fGraphBoundingBoxValue, gGraphBoundingBoxValue,
        halfSpan = 10.0, x0Precision = 2, precision = 6,

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

        calculateGraphsBounds();
        createfGraphBoard();
        creategGraphBoard();
        updateGraphs();
        createSlider();
        outputStaticMath();
        outputDynamicMath();
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
            value: 0,
            slide: function(event, ui) {
                x0 = Math.pow(10.0, ui.value);
                if (x0 <= 50.0) {
                    x0Precision = 2;
                }
                else {
                    x0Precision = 0;
                }
                x0SliderValue.html(x0.toFixed(x0Precision));
                calculateGraphsBounds();
                updateGraphs();
                outputDynamicMath();
            }
        });
    }

    function outputStaticMath() {
        katex.render("f(x) = " +  fStr, $('#math-line1').get(0));
        katex.render("f'(x) = " + dfStr, $('#math-line2').get(0));
        katex.render("g(x) = " +  gStr, $('#math-line3').get(0));
        katex.render("g'(x) = " + dgStr, $('#math-line4').get(0));
    }

    function outputDynamicMath() {
        katex.render("x = " + x0Str(), $('#math-line5').get(0));
        katex.render("\\frac{f(x)}{g(x)} = " + fgFracStr(), $('#math-line6').get(0));
        katex.render("\\frac{f'(x)}{g'(x)} = " + dfdgFracStr(), $('#math-line7').get(0));
    }

    function calculateGraphsBounds() {
        var y0, xMin, xMax, yMin, yMax;

        xMin = x0 - halfSpan;
        xMax = x0 + halfSpan;

        // f graph
        y0 = f(x0);
        yMin = y0 - halfSpan;
        yMax = y0 + halfSpan;
        fGraphBoundingBox = [xMin, yMax, xMax, yMin];

        // g graph
        y0 = g(x0);
        yMin = y0 - halfSpan;
        yMax = y0 + halfSpan;
        gGraphBoundingBox = [xMin, yMax, xMax, yMin];
    }

    function updateGraphs() {
        var xTickValues, yTickValues;

        // f graph
        fGraphBoard.setBoundingBox(fGraphBoundingBox);

        // x-axis
        xTickValues = getTickValues(fGraphBoundingBox[0], fGraphBoundingBox[2], 5.0);

        _.each(xTickValues, function(x, index)  {
            fGraphxAxisTicks[index].point1.moveTo([x, fGraphBoundingBox[3]]);
            fGraphxAxisTicks[index].point2.moveTo([x, fGraphBoundingBox[1]]);
        });

        // y-axis
        yTickValues = getTickValues(fGraphBoundingBox[3], fGraphBoundingBox[1], 5.0);
        // Remove first element
        yTickValues.shift();

        _.each(yTickValues, function(y, index)  {
            fGraphyAxisTicks[index].point1.moveTo([fGraphBoundingBox[0], y]);
            fGraphyAxisTicks[index].point2.moveTo([fGraphBoundingBox[2], y]);
        });

        fGraphBoard.fullUpdate();

        // g graph
        gGraphBoard.setBoundingBox(gGraphBoundingBox);

        // x-axis
        xTickValues = getTickValues(gGraphBoundingBox[0], gGraphBoundingBox[2], 5.0);

        _.each(xTickValues, function(x, index)  {
            gGraphxAxisTicks[index].point1.moveTo([x, gGraphBoundingBox[3]]);
            gGraphxAxisTicks[index].point2.moveTo([x, gGraphBoundingBox[1]]);
        });

        // y-axis
        yTickValues = getTickValues(gGraphBoundingBox[3], gGraphBoundingBox[1], 5.0);
        // Remove first element
        yTickValues.shift();

        _.each(yTickValues, function(y, index)  {
            gGraphyAxisTicks[index].point1.moveTo([gGraphBoundingBox[0], y]);
            gGraphyAxisTicks[index].point2.moveTo([gGraphBoundingBox[2], y]);
        });

        gGraphBoard.fullUpdate();
    }

    function x0Str() {
        return x0.toFixed(x0Precision);
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

    function getTickValues(min, max, step) {
        var tickMin, tickMax, nTicks, t, i, result = [];

        // Take in account the JS modulo operator bug:
        // http://javascript.about.com/od/problemsolving/a/modulobug.htm

        tickMin = min <= 0.0 ? min + Math.abs(min % step)
                             : min - Math.abs(min % step) + step;

        tickMax = max <= 0.0 ? max - Math.abs(max % step)
                             : max - Math.abs(max % step);

        nTicks = Math.round((tickMax - tickMin)/step);

        t = tickMin;

        for (t = tickMin, i = 0; i <= nTicks; i++, t += step) {
            result.push(t);
        }

        return result
    }

    function createTicksLabels(graph, tickStep) {
        var board, boundingBox, xTickValues, xAxisTicks, xAxisLabels, yTickValues, yAxisTicks, yAxisLabels,
            xLabelxPos, xLabelyPos, xLabelText, yLabelxPos, yLabelyPos, yLabelText;

        if (graph === 'fGraph') {
            board = fGraphBoard;
            boundingBox = fGraphBoundingBox;
            xAxisTicks =fGraphxAxisTicks;
            xAxisLabels = fGraphxAxisLabels;
            yAxisTicks = fGraphyAxisTicks;
            yAxisLabels = fGraphyAxisLabels;
        }
        else {
            board = gGraphBoard;
            boundingBox = gGraphBoundingBox;
            xAxisTicks =gGraphxAxisTicks;
            xAxisLabels = gGraphxAxisLabels;
            yAxisTicks = gGraphyAxisTicks;
            yAxisLabels = gGraphyAxisLabels;
        }


        xTickValues = getTickValues(boundingBox[0], boundingBox[2], tickStep),
        yTickValues = getTickValues(boundingBox[3], boundingBox[1], tickStep),

        // x-axis
        xLabelxPos = function(index) {
            return xAxisTicks[index].point1.X() + 0.25;
        };

        xLabelyPos = function(index) {
            return xAxisTicks[index].point1.Y() + 1.0;
        };

        xLabelText = function(index) {
            return xAxisTicks[index].point1.X().toFixed();
        };

        yLabelxPos = function(index) {
            return yAxisTicks[index].point1.X() + 0.5;
        };

        yLabelyPos = function(index) {
            return yAxisTicks[index].point1.Y() - 1.0;
        };

        yLabelText = function(index) {
            return yAxisTicks[index].point1.Y().toFixed();
        };

        // x-axis
        _.each(xTickValues, function(x, index)  {
            xAxisTicks.push(board.create(
                'line',
                [[x, boundingBox[1]], [x, boundingBox[3]]],
                {
                    strokeColor:'#000',
                    strokeOpacity: 0.2,
                    dash: 1,
                    fixed: true,
                    highlight: false
                }
            ));

            xAxisLabels.push(board.create(
                'text',
                [
                    _.partial(xLabelxPos, index),
                    _.partial(xLabelyPos, index),
                    _.partial(xLabelText, index)
                ],
                {
                    anchorX: 'left',
                    fixed: true
                }
            ));
        });

        // y-axis
        // Remove first element to avoid clashing with first element of x-axis
        yTickValues.shift();
        _.each(yTickValues, function(y, index)  {
            yAxisTicks.push(board.create(
                'line',
                [[boundingBox[0], y], [boundingBox[2], y]],
                {
                    strokeColor:'#000',
                    strokeOpacity: 0.2,
                    dash: 1,
                    fixed: true,
                    highlight: false
                }
            ));

            yAxisLabels.push(board.create(
                'text',
                [
                    _.partial(yLabelxPos, index),
                    _.partial(yLabelyPos, index),
                    _.partial(yLabelText, index)
                ],
                {
                    anchorX: 'left',
                    fixed: true
                }
            ));
        });
    }

    function createfGraphBoard() {
        JXG.Options.axis.ticks.insertTicks = false;
        JXG.Options.axis.ticks.majorHeight = 100;
        JXG.Options.axis.ticks.ticksDistance = 5;

        fGraphBoard = JXG.JSXGraph.initBoard('height-graph-board', {
            boundingbox: fGraphBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        createTicksLabels('fGraph', 5.0);

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

        createTicksLabels('gGraph', 5.0);

        gGraphBoard.create(
            'functiongraph',
            [g],
            {strokeWidth: 2, strokeColor: 'red', highlight: false}
        );
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
