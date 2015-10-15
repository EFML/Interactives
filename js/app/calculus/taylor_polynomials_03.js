var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-11.0, 11.0, 11.0, -11.0],
        board,
        coeff,
        precision = 3,
        center = 1.0,
        degree = 1;

    var fCurve, taylorCurve, centerSeriesPoint;

    init();

    function init() {
        $(window).on('resize', resizeBox);
        $('#dnext-about-link').on('click', toggle);

        createBoard();
        createSliders();
        outputMath();
        coeff = [f, df, d2f, d3f, d4f, d5f, d6f, d7f, d8f, d9f, d10f];
        plotCurves();
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

    function createSliders() {
        $('#center-slider').slider({
            min: -10.0,
            max: 10.0,
            value: center,
            slide: function(event, ui ) {
                $('#center-slider-value' ).html(ui.value);
                center = ui.value;
                taylorCurve.Y = taylor(center, degree);
                taylorCurve.updateCurve();
                centerSeriesPoint.setPosition(JXG.COORDS_BY_USER, [center, f(center)]);
                board.update();
                outputMath();
            }
        });

        $('#degree-slider').slider({
            min: 0,
            max: 10,
            value: degree,
            slide: function(event, ui ) {
                $('#degree-slider-value' ).html(ui.value);
                degree = ui.value;
                taylorCurve.Y = taylor(center, degree);
                taylorCurve.updateCurve();
                board.update();
                outputMath();
            }
        });
    }

    function outputMath() {
        katex.render('f(x) = 1-x + e^{1-x}', $('#math-line1').get(0));
        katex.render('\\text{Taylor polynomial:}', $('#math-line2').get(0));
        katex.render(taylorString(), $('#math-line3').get(0));
    }

    function taylorString() {
        var result = '', i = 0, centerStr = '', expStr = '', expPoint, signStr, expPointNumStr, expPointDenStr;

        if (center < 0.0) {
            centerStr = '+' + Math.abs(center).toFixed();
        }
        else if (center > 0.0) {
            centerStr = '-' + center.toFixed();
        }

        expPoint = Math.abs(1.0-center);

        if (expPoint === 0.0) {
            expStr = '';
        }
        else if (expPoint === 1.0) {
            expStr = 'e';
        }
        else {
             expStr = 'e^{' + expPoint.toFixed() +'}';
        }

        expPoint = 1.0 - center;

        if (expPoint >= 0) {
            expPointNumStr = '';
            expPointDenStr = expStr;
        }
        else {
            expPointNumStr = expStr;
            expPointDenStr = '';
        }

        while (i <= degree) {
            if (i === 0) {
                if (expPoint > 0.0) {
                    result += expPoint.toFixed() + '+' + expStr;
                }
                else if (expPoint === 0.0) {
                    result += '1';
                }
                else {
                    result += expPoint.toFixed() + '+\\frac{1}{' + expStr + '}';
                }
            }
            else if (i === 1) {
                if (expPoint > 0.0) {
                    result += '+(-1 -' + expStr + ')';
                }
                else if (expPoint === 0.0) {
                    result += '-2';
                }
                else {
                    result +='+(-1 -' + '\\frac{1}{' + expStr + '})';
                }
                result += '(x' + centerStr + ')';
            }
            else {
                signStr = i % 2 === 0 ? '-' : '+';
                result += signStr + '\\frac{' + expPointNumStr + '(x' + centerStr + ')^{' + i.toFixed() + '}}{' + factorial(i).toFixed() + expPointDenStr + '}';
            }

            i++;
        }

        return result;
    }

    function g(x, n) {
        return Math.pow(-1.0, n)*Math.exp(1.0-x);
    }

    function f(x) {
        return 1.0-x + Math.exp(1.0-x);
    }

    function df(x) {
        return -1.0 + g(x, 1.0);
    }

    function d2f(x) {
        return g(x, 2.0);
    }

    function d3f(x) {
        return g(x, 3.0);
    }

    function d4f(x) {
        return g(x, 4.0);
    }

    function d5f(x) {
        return g(x, 5.0);
    }

    function d6f(x) {
        return g(x, 6.0);
    }

    function d7f(x) {
        return g(x, 7.0);
    }

    function d8f(x) {
        return g(x, 8.0);
    }

    function d9f(x) {
        return g(x, 9.0);
    }

    function d10f(x) {
        return g(x, 10.0);
    }

    function factorial(n) {
        if (n === 0) {
            return 1;
        }
        else {
            return n * factorial(n - 1);
        }
    }

    function taylor(a, n) {
        var i = 0, taylorTerms = [];

        while (i <= n) {
            taylorTerms.push(getTaylorTerm(a, i));
            i++;
        }

        return function(x) {
            var i, result = 0.0;

            for (i = 0; i < taylorTerms.length; i++) {
                result += taylorTerms[i](x);
            }

            return result;
        };
    }

    function getTaylorTerm(a, i) {
        return function(x) {
            return (coeff[i](a)/factorial(i)) * Math.pow((x - a), i);
        };
    }

    function createBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;

        JXG.Options.text.fontSize = 14;

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

    function plotCurves() {
        fCurve = board.create(
            'functiongraph',
            [f],
            {strokeWidth: 3, strokeColor: 'red', highlight:false}
        );

        centerSeriesPoint = board.create('point', [center, f(center)], {
            fixed: true,
            name: '',
            strokeColor: 'blue',
            fillColor: 'blue'
        });

        taylorCurve = board.create(
            'functiongraph',
            [taylor(center, degree)],
            {strokeWidth: 3, strokeColor: 'green', highlight:false}
        );
    }

    function clearBoard() {
        JXG.JSXGraph.freeBoard(board);
        createBoard();
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
