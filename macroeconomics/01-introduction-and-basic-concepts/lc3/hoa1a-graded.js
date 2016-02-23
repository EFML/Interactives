// Used as JSInput
var Macro = (function(JXG, MacroLib) {
    'use strict';
    var board, regLine, points = [], xVals = [], yVals = [],
        f = '', a = '', b = '', lineWasGenerated = false;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD
        ////////////
        var boundingBox = [-0.75, 7, 7, -0.75];

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
            if (!lineWasGenerated) {
                coords = board.getUsrCoordsOfMouse(event);
                // Only plot points in  first quadrant
                if (coords[0] >= 0 && coords[1] >= 0) {
                    xVals.push(coords[0]);
                    yVals.push(coords[1]);
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

    function inBounds(x, y) {
        return x >= 0 && y >= 0;
    }

    function generateRegLine() {
        var x1, y1, x2, y2;
        f = JXG.Math.Numerics.regressionPolynomial(1, xVals, yVals);
        // f.getTerm() doesn't work, calculate parameters of line (y = ax + b) manually instead
        b = f(0.0);
        a = f(1.0) - b;
        x1 = 0;
        y1 = b;
        // Check out to see if value for x = right boundary of graph is in first quadrant.
        // If not, calculate intercept with x-axis
        x2 = 7;
        y2 = f(7);
        if (y2 < 0) {
            x2 = -b/a; // a cannot be 0
            y2 = 0;
        }
        regLine = board.create(
            'segment',
            [[x1, y1], [x2, y2]], // plot the line only in first quadrant
            {
                withLabel: false,
                highlight: false,
                strokeWidth: 4,
                strokeColor: 'dodgerblue'
            }
        );
        lineWasGenerated = true;
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
        lineWasGenerated = false;
        f = '';
        a = '';
        b = '';
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    plotBtn.addEventListener('click', function() {
        // Need at least 2 points to define the regression line
        if (xVals.length > 1 && yVals.length > 1) {
            generateRegLine();
        }
        else {
            console.info('Please create at least 2 points before trying to generate the best fit line.');
        }
    });

    init();
    MacroLib.onLoadPostMessage();

    // Standard edX JSinput functions
    function getState() {
        var state = {
            xVals: xVals,
            yVals: yVals,
            lineWasGenerated: lineWasGenerated,
            a: a,
            b: b
        };
        console.info('State successfully saved.');
        return JSON.stringify(state);
    }

    function setState(transaction, statestr) {
        var state = JSON.parse(statestr), i, len;

        // Draw saved points
        if (state.xVals && state.yVals) {
            xVals = state.xVals;
            yVals = state.yVals;
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
            if (state.lineWasGenerated) {
                lineWasGenerated = state.lineWasGenerated;
                generateRegLine();
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
