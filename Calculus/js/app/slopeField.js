var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var board, initialPoint, slopeField = [], solCurveForward, solCurveBackward, asymptoteLine1, asymptoteLine2,

        dfFn = [df0, df1, df2, df3, df4, df5, df6],

        config = window.slopeFieldSettings || {
            dfnNbr: 0,
            boundingBox: [-5.0, 3.0, 5.0, -3.0],
            initialPoint: {x: 0.0, y: 1.0},
            slopeField: {xDiv: 10, yDiv: 10, lineLength: 0.3}
        },
        dfnNbr = config.dfnNbr,
        boundingBox = config.boundingBox,

        df = dfFn[dfnNbr];

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
        // Studio and LMS use CDN and are up to date with current version 2.5.1config.initPoint
        // console.log('MathJax CDN version: ' + MathJax.cdnVersion);
        // Check version of JSXGraph:
        // Current: 0.99.3
        console.log('JSXGraph version: ' + JXG.version);

        $(window).on('resize', resizeBox);
        $('#dnext-help-link').on('click', toggle);

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

    function fOne() {
        return 1.0;
    }

    function initialPointDown() {
        board.on('move', initialPointDrag);
        board.on('up', boardUp);
    }

    function initialPointDrag() {
        var pt0 = {
                x: initialPoint.X(),
                y: initialPoint.Y()
            },
            points = solution(pt0, 0.05);

        solCurveForward.dataX = points.dataX;
        solCurveForward.dataY = points.dataY;
        solCurveForward.updateCurve();

        // Clear array
        points.length = 0;

        points = solution(pt0, -0.05);
        solCurveBackward.dataX = points.dataX;
        solCurveBackward.dataY = points.dataY;
        solCurveBackward.updateCurve();

        board.update();
    }

    function boardUp() {
        board.off('move', initialPointDrag);
        board.off('up', boardUp);
    }

    //4th Order Runge-Kutta method
    //http://www.jbmballistics.com/ballistics/topics/rk.shtml
    function rk4(pt, h, dx, dy) {
        var j1, j2, j3, j4;
        var k1, k2, k3, k4;
        var xNew, yNew;

        j1 = h*dx(pt.x, pt.y);
        k1 = h*dy(pt.x, pt.y);

        j2 = h*dx(pt.x + 0.5*j1, pt.y + 0.5*k1);
        k2 = h*dy(pt.x + 0.5*j1, pt.y + 0.5*k1);

        j3 = h*dx(pt.x + 0.5*j2, pt.y + 0.5*k2);
        k3 = h*dy(pt.x + 0.5*j2, pt.y + 0.5*k2);

        j4 = h*dx(pt.x + j3, pt.y + k3);
        k4 = h*dy(pt.x + j3, pt.y + k3);

        xNew = pt.x + (1.0/6.0)*(j1 + 2.0*j2 + 2.0*j3 + j4);
        yNew = pt.y + (1.0/6.0)*(k1 + 2.0*k2 + 2.0*k3 + k4);

        return {
            x: xNew,
            y: yNew
        };
    }

    function solution(pt0, inc) {
        var pt1, pt2, dataX = [], dataY = [], nbrInc;

        nbrInc = 0;

        //Go forward or backward depending on sign of inc
        pt1 = pt0;
        while (nbrInc < 500) {
            pt2 = rk4(pt1, inc, fOne, df);
            dataX.push(pt1.x);
            dataY.push(pt1.y);
            pt1 = pt2;
            nbrInc++;
        }

        return {
            dataX: dataX,
            dataY: dataY
        }
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

    function drawSlopeField(xMin, xMax, xDiv, yMin, yMax, yDiv, lineLength) {
        var slope, len = lineLength/2.0, theta,
            xMid, yMid, xStart, xEnd, yStart, yEnd, x, y, i, j,
            xInc = (xMax - xMin)/xDiv,
            yInc = (yMax - yMin)/yDiv;

        for (i = 0, xMid = xMin; i <= xDiv; i++, xMid += xInc) {
            for (j = 0, yMid = yMin; j <= yDiv; j++, yMid += yInc) {
                slope = df(xMid, yMid);
                theta = Math.atan(slope);

                x = len*Math.cos(theta);
                y = len*Math.sin(theta);

                xStart = xMid - x;
                yStart = yMid - y;

                xEnd = xMid + x;
                yEnd = yMid + y;

                slopeField.push(board.create(
                    'line',
                    [[xStart, yStart], [xEnd, yEnd]],
                    {
                        fixed: true,
                        straightFirst:false,
                        straightLast:false,
                        strokeWidth: 1,
                        strokeColor: 'blue', // #777777
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
            config.slopeField.lineLength
        );

        initialPoint = board.create('point', [config.initialPoint.x, config.initialPoint.y], {
            name: '',
            strokeColor: 'black',
            fillColor: 'white',
            size: 5,
        });

        initialPoint.on('down', initialPointDown);

        solCurveForward = board.create(
            'curve',
            [[], []],
            {
                strokeWidth: 2,
                strokeColor: 'red',
                highlight: false
            }
        );

        solCurveBackward = board.create(
            'curve',
            [[], []],
            {
                strokeWidth: 2,
                strokeColor: 'red',
                highlight: false
            }
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
