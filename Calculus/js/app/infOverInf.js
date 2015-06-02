var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var fGraphBoundingBox = [-10.0, 10, 10.0, -10.0], gGraphBoundingBox = [-10.0, 10, 10.0, -10.0],
        x0 = 1.0, x0Min = 0.0, x0Max = 6.0, x0Step = 0.01, fGraphxAxisTicks = [], fGraphyAxisTicks = [], gGraphxAxis, gGraphyAxis, halfSpan = 10.0, precision = 6,
        fGraphBoard, gGraphBoard, x0Slider, x0SliderValue, fGraphBoundingBoxValue, gGraphBoundingBoxValue, jm,

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
            value: 0,
            slide: function(event, ui) {
                x0 = Math.pow(10.0, ui.value);
                x0SliderValue.html(x0.toFixed(2));
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
        var x0Round, y0Round, y0, xMin, xMax, yMin, yMax;

        y0 = f(x0);
        xMin = x0 - halfSpan;
        xMax = x0 + halfSpan;
        yMin = y0 - halfSpan;
        yMax = y0 + halfSpan;

        fGraphBoundingBox = [xMin, yMax, xMax, yMin];
        fGraphBoard.setBoundingBox(fGraphBoundingBox);

        // x-axis
        var xTickMax = xMax - xMax%5.0;
        var xTick2 = xTickMax - 5.0;
        var xTick1 = xTickMax - 10.0;
        var xTickMin = xTickMax - 15.0;


        fGraphxAxisTicks[0].point1.moveTo([xTickMax, yMin]);
        fGraphxAxisTicks[0].point2.moveTo([xTickMax, yMax]);

        fGraphxAxisTicks[1].point1.moveTo([xTick2, yMin]);
        fGraphxAxisTicks[1].point2.moveTo([xTick2, yMax]);

        fGraphxAxisTicks[2].point1.moveTo([xTick1, yMin]);
        fGraphxAxisTicks[2].point2.moveTo([xTick1, yMax]);

        fGraphxAxisTicks[3].point1.moveTo([xTickMin, yMin]);
        fGraphxAxisTicks[3].point2.moveTo([xTickMin, yMax]);

        // y-axis
        var yTickMax = yMax - yMax%5.0;
        var yTick2 = yTickMax - 5.0;
        var yTick1 = yTickMax - 10.0;
        var yTickMin = yTickMax - 15.0;

        fGraphyAxisTicks[0].point1.moveTo([xMin, yTickMax]);
        fGraphyAxisTicks[0].point2.moveTo([xMax, yTickMax]);

        fGraphyAxisTicks[1].point1.moveTo([xMin, yTick2]);
        fGraphyAxisTicks[1].point2.moveTo([xMax, yTick2]);

        fGraphyAxisTicks[2].point1.moveTo([xMin, yTick1]);
        fGraphyAxisTicks[2].point2.moveTo([xMax, yTick1]);

        fGraphyAxisTicks[3].point1.moveTo([xMin, yTickMin]);
        fGraphyAxisTicks[3].point2.moveTo([xMax, yTickMin]);

        //fGraphyAxis.point1.moveTo([xMin - 1, yMin]);
        //fGraphyAxis.point2.moveTo([xMin - 1, yMax]);
        //fGraphBoard.fullUpdate();

        gGraphBoundingBox = [x0 - halfSpan, g(x0) + halfSpan, x0 + halfSpan, g(x0) - halfSpan];
        gGraphBoard.setBoundingBox(gGraphBoundingBox);
        /*
        gGraphxAxis.point1.moveTo([x0 - halfSpan + 5, g(x0) - halfSpan + 1]);
        gGraphxAxis.point2.moveTo([x0 + halfSpan, g(x0) - halfSpan + 1]);
        gGraphyAxis.point1.moveTo([x0 - halfSpan, g(x0) - halfSpan]);
        gGraphyAxis.point2.moveTo([x0 - halfSpan, g(x0) + halfSpan]);
        */
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
        JXG.Options.axis.ticks.majorHeight = 100; // -1
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

        var xMin = fGraphBoundingBox[0], xMax = fGraphBoundingBox[2],
            yMin = fGraphBoundingBox[3], yMax = fGraphBoundingBox[1];

        // x-axis
        var xTickMax = xMax - xMax%5.0;
        var xTick2 = xTickMax - 5.0;
        var xTick1 = xTickMax - 10.0;
        var xTickMin = xTickMax - 15.0;

        fGraphxAxisTicks.push(fGraphBoard.create(
            'line',
            [[xTickMax, yMin], [xTickMax, yMax]],
            {
                strokeColor:'#ccc',
                dash: 1,
                fixed: true,
                highlight: false
            }
        ));

        fGraphxAxisTicks.push(fGraphBoard.create(
            'line',
            [[xTick2, yMin], [xTick2, yMax]],
            {
                strokeColor:'#ccc',
                dash: 1,
                fixed: true,
                highlight: false
            }
        ));

        fGraphxAxisTicks.push(fGraphBoard.create(
            'line',
            [[xTick1, yMin], [xTick1, yMax]],
            {
                strokeColor:'#ccc',
                dash: 1,
                fixed: true,
                highlight: false
            }
        ));

        fGraphxAxisTicks.push(fGraphBoard.create(
            'line',
            [[xTickMin, yMin], [xTickMin, yMax]],
            {
                strokeColor:'#ccc',
                dash: 1,
                fixed: true,
                highlight: false
            }
        ));

        fGraphxAxisTicks.push(fGraphBoard.create(
            'text',
            [
                function() {return fGraphxAxisTicks[0].point1.X() + 0.25;},
                function() {return fGraphxAxisTicks[0].point1.Y() + 1.0;},
                function() {return fGraphxAxisTicks[0].point1.X()}
            ],
            {
                anchorX: 'left',
                fixed:true
            }
        ));

        fGraphxAxisTicks.push(fGraphBoard.create(
            'text',
            [
                function() {return fGraphxAxisTicks[1].point1.X() + 0.25;},
                function() {return fGraphxAxisTicks[1].point1.Y() + 1.0;},
                function() {return fGraphxAxisTicks[1].point1.X()}
            ],
            {
                anchorX: 'left',
                fixed:true
            }
        ));

        fGraphxAxisTicks.push(fGraphBoard.create(
            'text',
            [
                function() {return fGraphxAxisTicks[2].point1.X() + 0.25;},
                function() {return fGraphxAxisTicks[2].point1.Y() + 1.0;},
                function() {return fGraphxAxisTicks[2].point1.X()}
            ],
            {
                anchorX: 'left',
                fixed:true
            }
        ));

        fGraphxAxisTicks.push(fGraphBoard.create(
            'text',
            [
                function() {return fGraphxAxisTicks[3].point1.X() + 0.25;},
                function() {return fGraphxAxisTicks[3].point1.Y() + 1.0;},
                function() {return fGraphxAxisTicks[3].point1.X()}
            ],
            {
                anchorX: 'left',
                fixed:true
            }
        ));

        // y-axis
        var yTickMax = yMax - yMax%5.0;
        var yTick2 = yTickMax - 5.0;
        var yTick1 = yTickMax - 10.0;
        var yTickMin = yTickMax - 15.0;

        fGraphyAxisTicks.push(fGraphBoard.create(
            'line',
            [[xMin, yTickMax], [xMax, yTickMax]],
            {
                strokeColor:'#ccc',
                dash: 1,
                fixed: true,
                highlight: false
            }
        ));

        fGraphyAxisTicks.push(fGraphBoard.create(
            'line',
            [[xMin, yTick2], [xMax, yTick2]],
            {
                strokeColor:'#ccc',
                dash: 1,
                fixed: true,
                highlight: false
            }
        ));

        fGraphyAxisTicks.push(fGraphBoard.create(
            'line',
            [[xMin, yTick1], [xMax, yTick1]],
            {
                strokeColor:'#ccc',
                dash: 1,
                fixed: true,
                highlight: false
            }
        ));

        fGraphyAxisTicks.push(fGraphBoard.create(
            'line',
            [[xMin, yTickMin], [xMax, yTickMin]],
            {
                strokeColor:'#ccc',
                dash: 1,
                fixed: true,
                highlight: false
            }
        ));

        fGraphyAxisTicks.push(fGraphBoard.create(
            'text',
            [
                function() {return fGraphyAxisTicks[0].point1.X() + 0.5;},
                function() {return fGraphyAxisTicks[0].point1.Y() - 1.0;},
                function() {return fGraphyAxisTicks[0].point1.Y()}
            ],
            {
                anchorX: 'left',
                fixed:true
            }
        ));

        fGraphyAxisTicks.push(fGraphBoard.create(
            'text',
            [
                function() {return fGraphyAxisTicks[1].point1.X() + 0.5;},
                function() {return fGraphyAxisTicks[1].point1.Y() - 1.0;},
                function() {return fGraphyAxisTicks[1].point1.Y()}
            ],
            {
                anchorX: 'left',
                fixed:true
            }
        ));

        fGraphyAxisTicks.push(fGraphBoard.create(
            'text',
            [
                function() {return fGraphyAxisTicks[2].point1.X() + 0.5;},
                function() {return fGraphyAxisTicks[2].point1.Y() - 1.0;},
                function() {return fGraphyAxisTicks[2].point1.Y()}
            ],
            {
                anchorX: 'left',
                fixed:true
            }
        ));

        /*
        fGraphyAxisTicks.push(fGraphBoard.create(
            'text',
            [
                function() {return fGraphyAxisTicks[3].point1.X() + 0.5;},
                function() {return fGraphyAxisTicks[3].point1.Y() - 1.0;},
                function() {return fGraphyAxisTicks[3].point1.Y()}
            ],
            {
                anchorX: 'left',
                fixed:true
            }
        ));
        */

        /*fGraphxAxis = fGraphBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            //withLabel: false,
            //drawZero: true
        });*/
        //fGraphxAxis.removeAllTicks();
        /*fGraphBoard.create('ticks', [fGraphxAxis, 10], { // The number here is the distance between Major ticks
            strokeColor:'#ccc',
            majorHeight: -1, // -1 Need this because the JXG.Options one doesn't apply
            drawLabels: true, // Needed, and only works for equidistant ticks
            label: {offset: [20, 25]},
            minorTicks: 5, // The NUMBER of small ticks between each Major tick
            drawZero: true,
            precision: 10
        }
        );*/


        /*fGraphyAxis = fGraphBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            //withLabel: false,
            //grid: false
        });
        fGraphyAxis.removeAllTicks();
        fGraphBoard.create('ticks', [fGraphyAxis, 10], { // The number here is the distance between Major ticks
            strokeColor:'#ccc',
            majorHeight: -1, // -1 Need this because the JXG.Options one doesn't apply
            drawLabels: true, // Needed, and only works for equidistant ticks
            label: {offset: [25, 10]},
            // minorTicks: 5, // The NUMBER of small ticks between each Major tick
            drawZero: true,
            precision: 10
        }
        );*/

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

        /*
        gGraphxAxis = gGraphBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });
        gGraphxAxis.removeAllTicks();

        gGraphyAxis = gGraphBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });
        gGraphyAxis.removeAllTicks();
        */

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
