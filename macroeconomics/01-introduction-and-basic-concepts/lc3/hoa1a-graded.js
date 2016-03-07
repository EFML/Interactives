// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, regCurve, points = [], xVals = [], yVals = [], xyVals = [],
        f = '', a = '', b = '', curveWasGenerated = false, xMin = 0.0, xMax = 7.0;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD
        ////////////
        var boundingBox = [-0.75, 7, xMax, -0.75];

        board = JXG.JSXGraph.initBoard('jxgbox1', {
            boundingbox: boundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        var xAxis = board.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });
        xAxis.removeAllTicks();
        board.create('ticks', [xAxis, 1], {
            strokeColor:'#ccc',
            majorHeight: -1,
            drawLabels: true,
            label: {offset: [-20, -10]},
            minorTicks: 5,
            drawZero: true
        });

        var yAxis = board.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });
        yAxis.removeAllTicks();
        board.create('ticks', [yAxis, 1], {
            strokeColor:'#ccc',
            majorHeight: -1,
            drawLabels: true,
            label: {offset: [-20, 0]},
            minorTicks: 5,
            drawZero: false
        });

        var xOffset1 = Math.abs(boundingBox[2] - boundingBox[0]) / 100.0;
        var yOffset1 = Math.abs(boundingBox[3] - boundingBox[1]) / 25.0;
        var xOffset2 = Math.abs(boundingBox[2] - boundingBox[0]) / 50.0;
        var yOffset2 = Math.abs(boundingBox[3] - boundingBox[1]) / 50.0;

        var xAxisLabel = board.create('text', [boundingBox[2] - xOffset1, yOffset1, 'Good A'], {
            anchorX: 'right',
            fixed: true
        });
        var yAxisLabel = board.create('text', [xOffset2, boundingBox[1] - yOffset2, 'Good B'], {
            anchorX: 'left',
            fixed: true
        });

        //////////////////
        // Interactivity
        //////////////////
        board.on('down', function(event) {
            var coords;
            if (!curveWasGenerated) {
                coords = board.getUsrCoordsOfMouse(event);
                // Only plot points in  first quadrant with a small 0.1 tolerance
                if (coords[0] >= -0.1 && coords[1] >= -0.1) {
                    // Put the points exactly on axis if they are slightly out of bounds because of clicking tolerance
                    coords[0] = coords[0] < 0.0 ? 0 : coords[0];
                    coords[1] = coords[1] < 0.0 ? 0 : coords[1];
                    xVals.push(coords[0]); // Used to replot points on reload
                    yVals.push(coords[1]); // Used to replot points on reload
                    xyVals.push([coords[0], coords[1]]); // Used with the regression library
                    points.push(
                        board.create('point', coords, {
                            withLabel: false,
                            strokeColor: 'gray',
                            fillColor: 'gray',
                            size: 5
                        })
                    );
                }
            }
        });
    }

    function generateRegCurve() {
        var poly, curveXMinMax, curveIsVertical = false;
        // Use regression library from https://github.com/Tom-Alexander/regression-js
        // JXG.Math.Numerics.regressionPolynomial is buggy
        poly = regression('polynomial', xyVals, 1);
        a = poly.equation[1];
        b = poly.equation[0];
        if (!isValid(a) || !isValid(b)) {
            // Approximate by a vertical line
            a = Number.MAX_VALUE;
            b = 0;
            curveIsVertical = true;
        }

        f = function(x) {
            return a*x + b;
            console.log(x)
        }

        curveXMinMax = findCurveXMinMax();

        if (!curveIsVertical) {
            regCurve = board.create(
                'functiongraph',
                [f, curveXMinMax[0], curveXMinMax[1]], // plot the curve only in first quadrant
                {
                    withLabel: false,
                    highlight: false,
                    strokeWidth: 4,
                    strokeColor: 'dodgerblue'
                }
            );
        }
        else {
            // Plot a vertical line using the first point
            regCurve = board.create('segment',
                [[xVals[0], 0],  [xVals[0], 7]],
                {
                    withLabel: false,
                    highlight: false,
                    strokeWidth: 4,
                    strokeColor: 'dodgerblue'
                }
            );
        }
        curveWasGenerated = true;
    }

    // Find if there's a root in plotting range (first quadrant), [xMin, xMax]
    function findCurveXMinMax() {
        var df, root, xRangeMin = xMin, xRangeMax = xMax;

        // Get the intersection of curve (a line) with the x-axis
        if (a !== 0) {
            root = -b/a;
            if (inRange(root)) {
                // Take everything from root
                if (a > 0) {
                    xRangeMin = root;
                }
                // a < 0
                // Take eveything up to root
                else {
                    xRangeMax = root
                }
            }
        }
        // Do not clip anything when a = 0 or when the root is out of range
        return [xRangeMin, xRangeMax];
    }

    // From UnderscoreJS: http://underscorejs.org/docs/underscore.html
    function isValid(nbr) {
        return isFinite(nbr) && !isNaN(parseFloat(nbr));
    };

    function inRange(x) {
        return xMin <= x && x <= xMax;
    }

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        // Clear arrays
        points.length = 0;
        xVals.length = 0;
        yVals.length = 0;
        xyVals.length = 0;
        curveWasGenerated = false;
        f = '';
        a = '';
        b = '';
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    plotBtn.addEventListener('click', function() {
        // Need at least 2 points to define the quadratic curve
        if (xVals.length > 1 && yVals.length > 1) {
            generateRegCurve();
        }
        else {
            console.info('Please create at least 2 points before trying to generate the linear regression curve.');
        }
    })

    // Standard edX JSinput functions
    function getState() {
        var state = {
            xVals: xVals,
            yVals: yVals,
            xyVals: xyVals,
            curveWasGenerated: curveWasGenerated,
            a: a,
            b: b
        };
        console.info('State successfully saved.');
        return JSON.stringify(state);
    }

    function setState(transaction, statestr) {
        var state = JSON.parse(statestr), i, len;

        // Draw saved points
        if (state.xVals.length !== 0 && state.yVals.length !== 0 && state.xyVals.length !== 0) {
            xVals = state.xVals;
            yVals = state.yVals;
            xyVals = state.xyVals;
            for (i = 0, len = xVals.length; i < len; i++) {
                points.push(
                    board.create('point', [xVals[i], yVals[i]], {
                        withLabel: false,
                        strokeColor: 'gray',
                        fillColor: 'gray',
                        size: 5
                    })
                );
            }
            // Generate and draw regression line if more than 2 points
            if (state.curveWasGenerated) {
                curveWasGenerated = state.curveWasGenerated;
                generateRegCurve();
            }
        }
        board.update();
        console.info('State updated successfully from saved.');
    }

    function getGrade() {
        return getState();
    }

    init();
    MacroLib.onLoadPostMessage();
    MacroLib.createChannel(getGrade, getState, setState);

})(JXG, MacroLib, undefined);
