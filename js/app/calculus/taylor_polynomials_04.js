var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-5.0, 5.0, 5.0, -5.0],
        board,
        precision = 3,
        center = 0.0,
        degree = 1,
        radius = 1.0;

    var fCurve, taylorCurve, centerSeriesPoint, radiusLeftLine, radiusRightLine;

    init();

    function init() {
        $(window).on('resize', resizeBox);
        $('#dnext-about-link').on('click', toggle);

        createBoard();
        createSlider();
        outputMath();
        plotGraph();
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

    function createSlider() {
        $('#degree-slider').slider({
            min: 0,
            max: 25,
            value: degree,
            slide: function(event, ui ) {
                $("#degree-slider-value" ).html(ui.value);
                degree = ui.value;
                taylorCurve.Y = taylor(center, degree);
                taylorCurve.updateCurve();
                board.update();
                outputMath();
            }
        });
    }

    function outputMath() {
        katex.render('f(x) = \\tan^{-1}(x)', $('#math-line1').get(0));
        katex.render('\\text{Taylor polynomial:}', $('#math-line2').get(0));
        katex.render(taylorString(), $('#math-line3').get(0));
    }

    function taylorString() {
        var result = '', i = 0, sign, opStr = '', iStr = '';

        if (degree === 0) {
            return '0';
        }

        while (i <= degree) {
            // The are only odd terms
            if (i % 2 !== 0) {
                if (i === 1) {
                    result += 'x';
                }
                else {
                    sign = Math.pow(-1.0, (i-1)/2);
                    opStr = sign < 0.0 ? '-' : '+';
                    iStr = i.toFixed();
                    result += opStr + '\\frac{x^{' + iStr +   '}}{' + iStr + '}';
                }
            }
            i++;
        }

        return result;
    }

    function f(x) {
        return Math.atan(x);
    }

    // Taylor series is: x − x^3/3 + x^5/5 − x^7/7 + x^9/9 -...
    // Math.pow(-1.0, n)*Math.pow(x, 2*n+1)/(2n+1);
    function getTaylorTerm(x, n) {
        return function(x) {
            if (n % 2 === 0) {
                return 0.0;
            }
            else {
                return Math.pow(-1.0, (n-1)/2)*Math.pow(x, n)/n;
            }
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
        }
    }

    function createBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;
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

    function plotGraph() {
        fCurve = board.create(
            'functiongraph',
            [f],
            {strokeWidth: 3, strokeColor: "red", highlight: false}
        );

        centerSeriesPoint = board.create('point', [center, f(center)], {
            fixed: true,
            name: '',
            strokeColor: "blue",
            fillColor: "blue"
        });

        taylorCurve = board.create(
            'functiongraph',
            [taylor(degree)],
            {strokeWidth: 3, strokeColor: "green", highlight: false}
        );

        radiusLeftLine = board.create('line', [[center+radius, -10.0], [center+radius, 10.0]], {
            strokeWidth: 2, strokeColor: "blue",dash: 2,  highlight: false
        });

        radiusRightLine = board.create('line', [[center-radius, -10.0], [center-radius, 10.0]], {
            strokeWidth: 2, strokeColor: "blue",dash: 2,  highlight: false
        });
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
