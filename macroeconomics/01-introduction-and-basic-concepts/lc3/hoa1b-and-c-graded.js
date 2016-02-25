// Used as JSInput
var Macro = (function(JXG, MacroLib) {
    'use strict';
    var board, regCurve, points = [], xVals = [], yVals = [], xyVals = [],
        f = '', a = '', b = '', c = '', curveWasGenerated = false, xMin = 0.0, xMax = 7.0;

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
        var poly, curveXMinMax;
        // Use regression library from https://github.com/Tom-Alexander/regression-js
        // JXG.Math.Numerics.regressionPolynomial is buggy
        poly = regression('polynomial', xyVals, 2);
        a = poly.equation[2];
        b = poly.equation[1];
        c = poly.equation[0];
        if (!isValid(a) || !isValid(b) || !isValid(c)) {
            // Approximate by a vertical line through origin
            a = Number.MAX_VALUE;
            b = 0;
            c = 0;
        }

        f = function(x) {
            return a*x*x + b*x + c;
        }

        curveXMinMax = findCurveXMinMax();

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
        curveWasGenerated = true;
    }

    // Find if there's a root in max plotting range (first quadrant), [0, xMax]
    // If it exist in that range, use it as the max boundary for curve plotting
    function findCurveXMinMax() {
        var delta = b*b - 4*a*c, df,
            root1, root2, root1InRange = false, root2InRange = false,
            xRangeMin = xMin, xRangeMax = xMax;

        if (delta > 0 && a !== 0) {
            root1 = (-b - Math.sqrt(delta))/(2*a);
            root2 = (-b + Math.sqrt(delta))/(2*a);
            root1InRange = inRange(root1);
            root2InRange = inRange(root2);
            if (root1InRange && root2InRange) {
                // Concave down, take everything between the roots
                if (a < 0) {
                    xRangeMin = Math.min(root1, root2);
                    xRangeMax = Math.max(root1, root2);
                }
                // Concave up,  take everything up to smallest root
                else if (a > 0) {
                    xRangeMax = Math.min(root1, root2);
                }
            }
            else if (root1InRange) {
                // Calculate derivative at root1
                df = 2*a*root1 + b;
                // Take everything before
                if (df < 0) {
                    xRangeMax = root1;
                }
                // Take everything after
                else if (df > 0) {
                    xRangeMin = root1;
                }
            }
            else if (root2InRange) {
                // Calculate derivative at root2
                df = 2*a*root2 + b;
                // Take everything before
                if (df < 0) {
                    xRangeMax = root2;
                }
                // Take everything after
                else if (df > 0) {
                    xRangeMin = root2;
                }
            }
        }
        // Do not clip anything when delta = 0 (double root) or when delta < 0 (no roots)
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
        c = '';
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    plotBtn.addEventListener('click', function() {
        // Need at least 2 points to define the quadratic curve
        if (xVals.length > 1 && yVals.length > 1) {
            generateRegCurve();
        }
        else {
            console.info('Please create at least 2 points before trying to generate the quadratic regression curve.');
        }
    })

    init();
    MacroLib.onLoadPostMessage();

    // Standard edX JSinput functions
    function getState() {
        var state = {
            xVals: xVals,
            yVals: yVals,
            xyVals: xyVals,
            curveWasGenerated: curveWasGenerated,
            a: a,
            b: b,
            c: c
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

    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade: getGrade
    };
})(JXG, MacroLib, undefined);
