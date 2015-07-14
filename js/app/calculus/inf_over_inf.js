var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var fGraphBoundingBox = [], gGraphBoundingBox = [], x0, x0Min, x0Max, x0Step, fGraphxAxisTicks = [], fGraphxAxisLabels = [], fGraphyAxisTicks = [], fGraphyAxisLabels = [],
        gGraphxAxisTicks = [], gGraphxAxisLabels = [], gGraphyAxisTicks = [], gGraphyAxisLabels = [],
        fGraphBoard, gGraphBoard, x0Slider, x0SliderValue, fGraphBoundingBoxValue, gGraphBoundingBoxValue,
        halfSpan = 10.0, x0Precision = 2, precision = 6,

        fFn = [f0, f1, f2, f3, f4, f5],
        dfFn = [df0, df1, df2, df3, df4, df5],
        gFn = [g0, g1, g2, g3, g4, g5],
        dgFn = [dg0, dg1, dg2, dg3, dg4, dg5],
        fFnStr  = ['log(x^2) + 3x', '\\sqrt{e^x}-1', '3x', '', '3x + 2e^{-x}', '\\sqrt{x}'],
        dfFnStr = ['\\frac{2}{x} + 3', '\\frac{\\sqrt{e^x}}{2}', '3', '', '3 - 2e^{-x}', '\\frac{1}{2\\sqrt{x}}'],
        gFnStr  = ['2log(5x^2) + 4x', 'x', 'x + e^{-x}', '', '4x + e^{-x}', 'log(x+1)'],
        dgFnStr = ['\\frac{4}{x} + 4', '1', '1 - e^{-x}', '', '4 - e^{-x}', '\\frac{1}{x+1}'],

        config = window.infOverInfSettings || {
            fnNbr: 0,
            x0: 1.0,
            x0Min: 0.0,
            x0Max: 6.0,
            x0Step: 0.01,
            logSlider: true
        },
        fnNbr = config.fnNbr,
        logSlider = config.logSlider,
        x0 = config.x0,
        x0Min = logSlider ? JXG.Math.log10(config.x0Min) : config.x0Min,
        x0Max = logSlider ? JXG.Math.log10(config.x0Max) : config.x0Max,
        x0Step = config.x0Step,

        f = fFn[fnNbr],
        fStr = fFnStr[fnNbr],
        df = dfFn[fnNbr],
        dfStr = dfFnStr[fnNbr],
        g = gFn[fnNbr],
        gStr = gFnStr[fnNbr],
        dg = dgFn[fnNbr],
        dgStr = dgFnStr[fnNbr];console.log(JXG.Math.log10(config.x0))

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

        $('#dnext-about-link').on('click', toggle);

        calculateGraphsBounds();
        createfGraphBoard();
        creategGraphBoard();
        updateGraphs();
        createSlider();
        outputStaticMath();
        outputDynamicMath();
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
        x0SliderValue = $('#x0-slider-value');
        x0Slider = $('#x0-slider');
        x0Slider.slider({
            min: x0Min,
            max: x0Max,
            step: x0Step,
            value: logSlider ? 0.0 : 1.0,
            slide: function(event, ui) {
                if (logSlider) {
                    x0 = Math.pow(10.0, ui.value);
                }
                else {
                    x0 = ui.value;
                }
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
        katex.render("f(x) = " + fx0Str(), $('#math-line6').get(0));
        katex.render("g(x) = " + gx0Str(), $('#math-line7').get(0));
        katex.render("\\frac{f(x)}{g(x)} = " + fgFracStr(), $('#math-line8').get(0));
        katex.render("\\frac{f'(x)}{g'(x)} = " + dfdgFracStr(), $('#math-line9').get(0));
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

    function stripExtraValue(values, ticks) {
        // Happens when ticks are created with a range not multiple of 5 and when we reach a range that is
        if (values.length > ticks.length) {
            // Remove last element
            values.pop();
        }
    }

    function updateGraphs() {
        var xTickValues, yTickValues;

        // f graph
        fGraphBoard.setBoundingBox(fGraphBoundingBox);

        // x-axis
        xTickValues = getTickValues(fGraphBoundingBox[0], fGraphBoundingBox[2], 5.0);
        stripExtraValue(xTickValues, fGraphxAxisTicks);

        _.each(xTickValues, function(x, index)  {
            fGraphxAxisTicks[index].point1.moveTo([x, fGraphBoundingBox[3]]);
            fGraphxAxisTicks[index].point2.moveTo([x, fGraphBoundingBox[1]]);
        });

        // y-axis
        yTickValues = getTickValues(fGraphBoundingBox[3], fGraphBoundingBox[1], 5.0);
        // Remove first element
        yTickValues.shift();
        stripExtraValue(yTickValues, fGraphyAxisTicks);

        _.each(yTickValues, function(y, index)  {
            fGraphyAxisTicks[index].point1.moveTo([fGraphBoundingBox[0], y]);
            fGraphyAxisTicks[index].point2.moveTo([fGraphBoundingBox[2], y]);
        });

        fGraphBoard.fullUpdate();

        // g graph
        gGraphBoard.setBoundingBox(gGraphBoundingBox);

        // x-axis
        xTickValues = getTickValues(gGraphBoundingBox[0], gGraphBoundingBox[2], 5.0);
        stripExtraValue(xTickValues, gGraphxAxisTicks);

        _.each(xTickValues, function(x, index)  {
            gGraphxAxisTicks[index].point1.moveTo([x, gGraphBoundingBox[3]]);
            gGraphxAxisTicks[index].point2.moveTo([x, gGraphBoundingBox[1]]);
        });

        // y-axis
        yTickValues = getTickValues(gGraphBoundingBox[3], gGraphBoundingBox[1], 5.0);
        // Remove first element
        yTickValues.shift();
        stripExtraValue(yTickValues, gGraphyAxisTicks);

        _.each(yTickValues, function(y, index)  {
            gGraphyAxisTicks[index].point1.moveTo([gGraphBoundingBox[0], y]);
            gGraphyAxisTicks[index].point2.moveTo([gGraphBoundingBox[2], y]);
        });

        gGraphBoard.fullUpdate();
    }

    function x0Str() {
        return x0.toFixed(x0Precision);
    }

    function fx0Str() {
        return numberToString(f(x0));
    }

    function gx0Str() {
        return numberToString(g(x0));
    }

    function fgFracStr() {
        return numberToString(f(x0)/g(x0));
    }

    function dfdgFracStr() {
        return numberToString(df(x0)/dg(x0));
    }

    // Functions
    function f0(x) {
        return Math.log(x*x) + 3.0*x;
    }

    function f1(x) {
        return Math.sqrt(Math.exp(x)) - 1.0;
    }

    function f2(x) {
        return 3.0*x;
    }

    function f3(x) {
        // Not in use
    }

    function f4(x) {
        return 3.0*x + 2.0*Math.exp(-x);
    }

    function f5(x) {
        return Math.sqrt(x);
    }

    function df0(x) {
        return 2.0/x + 3.0;
    }

    function df1(x) {
        return Math.sqrt(Math.exp(x)) / 2.0;
    }

    function df2(x) {
        return 3.0;
    }

    function df3(x) {
        // Not in use
    }

    function df4(x) {
        return 3.0 - 2.0*Math.exp(-x);
    }

    function df5(x) {
        return 1.0/(2.0*Math.sqrt(x));
    }

    function g0(x) {
        return 2.0*Math.log(5.0*x*x) + 4.0*x;
    }

    function g1(x) {
        return x;
    }

    function g2(x) {
        return x + Math.exp(-x);
    }

    function g3(x) {
        // Not in use
    }

    function g4(x) {
        return 4.0*x + Math.exp(-x);
    }

    function g5(x) {
        return Math.log(x+1.0)
    }

    function dg0(x) {
        return 4.0/x + 4.0;
    }

    function dg1(x) {
        return 1.0;
    }

    function dg2(x) {
        return 1.0 - Math.exp(-x);
    }

    function dg3(x) {
        // Not in use
    }

    function dg4(x) {
        return 4.0 - Math.exp(-x);
    }

    function dg5(x) {
        return 1.0 / (x+1.0);
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

    function numberToString(nbr) {
        // Do not use scientific notation when numbers strictly inferior to a million
        // Limit total display to 6 digits
        var precision, str, mantissa, exponent;

        if (nbr < 1000000) {
            precision = 5 - Math.floor(JXG.Math.log10(Math.abs(nbr)));
            return nbr.toFixed(precision);
        }
        else {
            str = nbr.toExponential(5);
            mantissa = str.slice(0, str.indexOf('e'));
            exponent = str.charAt(str.length - 1); // Exponent always has only one digit
            return mantissa + '\\times' + '10^' + exponent;
        }
    }

    function numberToStringLabel(nbr, regularPrecision, scientificPrecision) {
        // Do not use scientific notation when numbers strictly inferior to a million
        if (nbr < 1000000) {
            return nbr.toFixed(regularPrecision);
        }
        else {
            return nbr.toExponential(scientificPrecision);
        }
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
            return numberToStringLabel(xAxisTicks[index].point1.X(), 0, 5);
        };

        yLabelxPos = function(index) {
            return yAxisTicks[index].point1.X() + 0.5;
        };

        yLabelyPos = function(index) {
            return yAxisTicks[index].point1.Y() - 1.0;
        };

        yLabelText = function(index) {
            return numberToStringLabel(yAxisTicks[index].point1.Y(), 0, 5);
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
