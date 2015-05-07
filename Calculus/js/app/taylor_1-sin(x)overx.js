var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-11.0, 11.0, 11.0, -6.0],
        board,
        precision = 3,
        coeff,
        center = 0.0,
        degree = 0;

    var fCurve, taylorCurve, centerSeriesPoint, mainMathjaxOutput = null;

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

        $(window).on('resize', resizeBox);
        $('#dnext-help-link').on('click', toggle);

        createBoard();
        createSliders();
        createStaticMath();
        outputDynamicMath();
        coeff = [f, df, d2f, d3f, d4f];
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

    function createSliders() {
        $('#center-slider').slider({
            min: -10.0,
            max: 10.0,
            value: center,
            slide: function(event, ui ) {
                $("#center-slider-value" ).html(ui.value);
                center = ui.value;
                taylorCurve.Y = taylor(center, degree);
                taylorCurve.updateCurve();
                centerSeriesPoint.setPosition(JXG.COORDS_BY_USER, [center, f(center)]);
                board.update();
                outputDynamicMath();
            }
        });

        $('#degree-slider').slider({
            min: 0,
            max: 4,
            value: degree,
            slide: function(event, ui ) {
                $("#degree-slider-value" ).html(ui.value);
                degree = ui.value;
                taylorCurve.Y = taylor(center, degree);
                taylorCurve.updateCurve();
                board.update();
                outputDynamicMath();
            }
        });
    }

    function createStaticMath() {
        var mathOutput1, mathOutput2;

        mathOutput1 = $('#math-line1');
        mathOutput1.hide();
        mathOutput1.html('\\( f(x) = \\begin{cases}1 - \\frac{sin(x)}{x} & x \\not= 0 \\\\0 & x = 0 \\end{cases} \\)');
        mathOutput1.css('color', 'Red');
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'math-line1']);

        mathOutput2 = $('#math-line2');
        mathOutput2.hide();
        mathOutput2.html('\\( \\text{Taylor polynomial:} \\)');
        mathOutput2.css('color', 'Green');
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'math-line2']);

        mathOutput1.show();
        mathOutput2.show();
    }

    function outputDynamicMath() {
        var mathOutput;

        mathOutput = $('#math-line3');
        mathOutput.html('\\(' + taylorString() +  '\\)');
        mathOutput.css('color', 'Green');
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'math-line3']);

    }

    function taylorString() {
        var result = '', i = 0, centerStr = '', centerSignStr = '', signStr = '', iStr = '';

        centerStr = center.toFixed();
        centerSignStr = Math.abs(center).toFixed();

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
        return x !== 0.0 ? 1.0 - Math.sin(x)/x : 0.0;
    }

    function df(x) {
        return x !== 0.0 ? (Math.sin(x) - x*Math.cos(x))/(x*x) : 0.0;
    }

    function d2f(x) {
        return x !== 0 ? ((x*x - 2.0)*Math.sin(x) + 2.0*x*Math.cos(x)) / (Math.pow(x, 3)) : 1.0/3.0;
    }

    function d3f(x) {
        return x !== 0.0 ? (-3.0*(x*x - 2.0)*Math.sin(x) + (Math.pow(x, 3) - 6.0*x)*Math.cos(x)) / Math.pow(x, 4) : 0.0;
    }

    function num(x) {
        return -3.0*(x*x - 2.0)*Math.sin(x) + (Math.pow(x, 3) - 6.0*x)*Math.cos(x);
    }

    function dnum(x) {
        return -Math.pow(x, 3)*Math.sin(x);
    }

    function d4f(x) {
        return x !== 0.0 ? (dnum(x)*Math.pow(x, 4) - 4.0*Math.pow(x, 3)*num(x)) / Math.pow(x, 8) : -1.0/5.0;
    }

    function d5f(x) {
        return -Math.cos(x);
    }

    function d6f(x) {
        return Math.sin(x);
    }

    function d7f(x) {
        return Math.cos(x);
    }

    function d8f(x) {
        return -Math.sin(x);
    }

    function d9f(x) {
        return -Math.cos(x);
    }

    function d10f(x) {
        return Math.sin(x);
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

    function plotCurves() {
        fCurve = board.create(
            'functiongraph',
            [f],
            {strokeWidth: 3, strokeColor: "red", highlight:false}
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
            {strokeWidth: 3, strokeColor: "green", highlight:false}
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