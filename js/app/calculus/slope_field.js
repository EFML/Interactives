var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var board, initialPoint, slopeField = [], solutionCurve, asymptoteLine1, asymptoteLine2,

        dfFn = [df0, df1, df2, df3, df4, df5, df6],
        solFn = [sol0, sol1, sol2, sol3, sol4, sol5, sol6],

        config = window.slopeFieldSettings || {
            dfnNbr: 0,
            boundingBox: [-5.0, 3.0, 5.0, -3.0],
            initialPoint: {x: 0.0, y: 1.0},
            slopeField: {color: 'blue', xDiv: 10, yDiv: 10, lineLength: 0.3},
            solution: {color: 'red'}
        },
        dfnNbr = config.dfnNbr,
        boundingBox = config.boundingBox,

        df = dfFn[dfnNbr],
        sol = solFn[dfnNbr];

    init();

    function init() {
        $(window).on('resize', resizeBox);
        $('#dnext-about-link').on('click', toggle);

        createBoard();
        drawGraph();
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

    function df0(x, y) {
        return x+1.0;
    }

    function df1(x, y) {
        return y;
    }

    function df2(x, y) {
        return x-y;
    }

    function df3(x, y) {
        return -x*(y-3.0);
    }

    function df4(x, y) {
        return 0.5*x*x*y*(3.0-y);
    }

    function df5(x, y) {
        return x*y*y;
    }

    function df6(x, y) {
        return 2.0*y*(1.0-y);
    }

    // Solutions to the first order ODEs
    function c0(x, y) {
        return y - x*(0.5*x+1);
    }

    function sol0(x) {
        return x*(0.5*x+1.0) + c0(initialPoint.X(), initialPoint.Y());
    }

    function c1(x, y) {
        return y/Math.exp(x);
    }

    function sol1(x) {
        return c1(initialPoint.X(), initialPoint.Y())*Math.exp(x);
    }

    function c2(x, y) {
        return (y-x+1.0)/Math.exp(-x);
    }

    function sol2(x) {
        return c2(initialPoint.X(), initialPoint.Y())*Math.exp(-x) + x - 1.0;
    }

    function c3(x, y) {
        return (y-3)/(Math.exp(-0.5*x*x));
    }

    function sol3(x) {
        return c3(initialPoint.X(), initialPoint.Y())*Math.exp(-0.5*x*x) + 3.0;
    }

    function c4(x, y) {
        return ((3.0-y)/y)*Math.exp(0.5*x*x*x);
    }

    function sol4(x) {
        return (3.0*Math.exp(0.5*x*x*x)) / (c4(initialPoint.X(), initialPoint.Y()) + Math.exp(0.5*x*x*x));
    }

    function c5(x, y) {
        return (-2.0-x*x*y)/y;
    }

    function sol5(x) {
        return -2.0/(c5(initialPoint.X(), initialPoint.Y()) + x*x);
    }

    function c6(x, y) {
        return (1.0-y)*Math.exp(2.0*x)/y;
    }

    function sol6(x) {
        return Math.exp(2.0*x)/(c6(initialPoint.X(), initialPoint.Y()) + Math.exp(2.0*x));
    }

    function initialPointDown() {
        board.on('move', initialPointDrag);
        board.on('up', boardUp);
    }

    function initialPointDrag() {
        solutionCurve.updateCurve();
        board.update();
    }

    function boardUp() {
        board.off('move', initialPointDrag);
        board.off('up', boardUp);
    }

    function createBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;
        JXG.Options.axis.ticks.majorHeight = -1;
        board = JXG.JSXGraph.initBoard('jxgbox', {
            boundingbox: boundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
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

    function drawSlopeField(xMin, xMax, xDiv, yMin, yMax, yDiv, color, lineLength) {
        var slope, len = lineLength/2.0, theta,
            xMid, yMid, xStart, xEnd, yStart, yEnd, dx, dy, i, j,
            xInc = (xMax - xMin)/xDiv,
            yInc = (yMax - yMin)/yDiv;

        for (i = 0, xMid = xMin; i <= xDiv; i++, xMid += xInc) {
            for (j = 0, yMid = yMin; j <= yDiv; j++, yMid += yInc) {
                slope = df(xMid, yMid);
                theta = Math.atan(slope);

                dx = len*Math.cos(theta);
                dy = len*Math.sin(theta);

                xStart = xMid - dx;
                yStart = yMid - dy;

                xEnd = xMid + dx;
                yEnd = yMid + dy;

                slopeField.push(board.create(
                    'line',
                    [[xStart, yStart], [xEnd, yEnd]],
                    {
                        fixed: true,
                        straightFirst:false,
                        straightLast:false,
                        strokeWidth: 1,
                        strokeColor: color,
                        highlight: false
                    }
                ));
            }
        }
    }

    function drawGraph() {
        var xMin = boundingBox[0], xMax = boundingBox[2], yMin = boundingBox[3], yMax = boundingBox[1],
            xPadding = (xMax-xMin)/20.0, yPadding = (yMax-yMin)/20.0;

        drawSlopeField(
            xMin + xPadding,
            xMax - xPadding,
            config.slopeField.xDiv,
            yMin + yPadding,
            yMax - yPadding,
            config.slopeField.yDiv,
            config.slopeField.color,
            config.slopeField.lineLength
        );

        initialPoint = board.create('point', [config.initialPoint.x, config.initialPoint.y], {
            name: '',
            strokeColor: 'black',
            fillColor: 'white',
            size: 5,
        });

        initialPoint.on('down', initialPointDown);

        solutionCurve = board.create(
            'functiongraph',
            [sol],
            {strokeWidth: 3, strokeColor: config.solution.color, highlight: false}
        );

        initialPointDrag();

        // Vertical asymptote lines, not implemented yet
        /*
        asymptoteLine1 = board.create('line', [[-3.0, -10.0], [-3.0, 10.0]], {
            strokeWidth: 2, strokeColor: 'green', dash: 2,  highlight: false
        });

        asymptoteLine2 = board.create('line', [[3.0, -10.0], [3.0, 10.0]], {
            strokeWidth: 2, strokeColor: 'green',dash: 2,  highlight: false
        });
        */
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
