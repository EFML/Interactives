var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-11.0, 11.0, 11.0, -11.0],
        board,
        coeff,
        precision = 3,
        center = 0.0,
        degree = 1,
        radius = 2.0;

    var fCurve, taylorCurve, centerSeriesPoint, radiusLeftLine, radiusRightLine;

    init();

    function init() {
        $(window).on('resize', resizeBox);
        $('#dnext-about-link').on('click', toggle);

        createBoard();
        createSliders();
        outputMath();
        coeff = [f, df, d2f];
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

    function createSliders() {
        $('#center-slider').slider({
            min: -10.0,
            max: 10.0,
            step: 0.1,
            value: center,
            slide: function(event, ui ) {
                $("#center-slider-value" ).html(ui.value);
                center = ui.value;
                taylorCurve.Y = taylor(center, degree);
                taylorCurve.updateCurve();
                centerSeriesPoint.setPosition(JXG.COORDS_BY_USER, [center, f(center)]);
                updateRadiusLines();
                board.update();
                outputMath();
            }
        });

        $('#degree-slider').slider({
            min: 0,
            max: 2,
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

        $('#radius-slider').slider({
            min: 0.0,
            max: 12.0,
            step: 0.1,
            value: radius,
            slide: function(event, ui ) {
                $("#radius-slider-value" ).html(ui.value);
                radius = ui.value;
                updateRadiusLines();
            }
        });
    }

    function outputMath() {
        katex.render('f(x) = \\frac{\\cos(x)}{x+2}', $('#math-line1').get(0));
        katex.render('\\text{Taylor polynomial:}', $('#math-line2').get(0));
        katex.render(taylorString(), $('#math-line3').get(0));
    }

    function taylorString() {
        var result = '', i = 0, centerStr = '', centerSignStr = '', signStr = '', iStr = '';

        centerStr = center.toFixed(1);
        centerSignStr = Math.abs(center).toFixed(1);

        if (center > 0.0) {
            signStr = '-';
        }
        else if (center < 0.0) {
            signStr = '+';
        }
        else {
            centerSignStr = '';
            signStr = '';
        }

        while (i <= degree) {
            if (i === 0) {
                result += 'f(' + centerStr + ')';
            }
            else if (i === 1) {
                result += '+f\'(' + centerStr + ')(x' + signStr + centerSignStr + ')';
            }
            else if (i === 2) {
                result += '+\\frac{f\'\'(' + centerStr + ')}{2!}(x' + signStr + centerSignStr + ')^2';
            }
            else if (i >= 3) {
                iStr = i.toFixed();
                result += '+\\frac{f^{(' + iStr + ')}(' + centerStr + ')}{' + iStr + '!}(x'  + signStr + centerSignStr + ')^' + iStr;
            }
            i++;
        }

        return result;
    }

    function f(x) {
        return Math.cos(x) / (x+2.0);
    }

    function df(x) {
        return -((x+2.0)*Math.sin(x) + Math.cos(x)) / Math.pow(x+2.0, 2);
    }

    function d2f(x) {
        return (2.0*(x+2.0)*Math.sin(x) + (2.0-Math.pow(x+2.0, 2))*Math.cos(x)) / Math.pow(x+2.0, 3);
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
        }
    }

    function getTaylorTerm(a, i) {
        return function(x) {
            return (coeff[i](a)/factorial(i)) * Math.pow((x - a), i);
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
            [taylor(center, degree)],
            {strokeWidth: 3, strokeColor: "green", highlight: false}
        );

        radiusLeftLine = board.create('line', [[center+radius, -10.0], [center+radius, 10.0]], {
            strokeWidth: 2, strokeColor: "blue",dash: 2,  highlight: false
        });

        radiusRightLine = board.create('line', [[center-radius, -10.0], [center-radius, 10.0]], {
            strokeWidth: 2, strokeColor: "blue",dash: 2,  highlight: false
        });
    }

    function updateRadiusLines() {
        radiusLeftLine.point1.moveTo([center+radius, -10.0], 0);
        radiusLeftLine.point2.moveTo([center+radius, 10.0], 0);
        radiusRightLine.point1.moveTo([center-radius, -10.0], 0);
        radiusRightLine.point2.moveTo([center-radius, 10.0], 0);
    }

    function clearBoard() {
        JXG.JSXGraph.freeBoard(board);
        createBoard();
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
