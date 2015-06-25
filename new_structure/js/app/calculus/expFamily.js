var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-7.0, 11.0, 11.0, -7.0],
        board,
        xp = 0.0, yp = 1.0, a = 1.0;

    var fCurve, pPoint;

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
        outputDynamicMath();
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
        $('#x-slider').slider({
            min: -6.5,
            max: 11.5,
            step: 0.1,
            value: xp,
            slide: function(event, ui ) {
                $("#x-slider-value" ).html(ui.value);
                xp = ui.value;
                yp = f(xp);
                outputDynamicMath();
                updateGraph();
                board.update();
            }
        });

        $('#a-slider').slider({
            min: -5.0,
            max: 5.0,
            step: 0.1,
            value: a,
            slide: function(event, ui ) {
                $("#a-slider-value" ).html(ui.value);
                a = ui.value;
                yp = f(xp);
                outputDynamicMath();
                updateGraph();
                board.update();
            }
        });
    }

    function outputDynamicMath() {
        katex.render('\\text{Curve: } y = Ae^x = ' + expString(), $('#math-line1').get(0));
        katex.render('\\text{Point P: }' + pString(), $('#math-line2').get(0));
        katex.render('\\text{Slope at P: }' + numberToString(yp), $('#math-line3').get(0));
    }

    function expString() {
        if (a === -1.0) {
            return '-e^x';
        }
        else if(a === 0.0) {
            return '0';
        }
        else if (a === 1.0) {
            return 'e^x';
        }
        else {
            return nbrToString(a) + 'e^x';
        }
    }

    function pString() {
        return '(' + nbrToString(xp) + ', ' + numberToString(yp) + ')';
    }

    function nbrToString(nbr) {
        var nbrStr = nbr.toFixed(1);

        return parseFloat(nbrStr).toString(); // Removes insignificant trailing zeroes
    }

    function numberToString(nbr) {
        // Do not use scientific notation when numbers strictly superior to 10^{-5} and stricly inferior to 10^{6}
        // Limit total display to 6 digits
        var precision, str, eIndex, exponentSign, mantissa, exponent;

        if (0.00001 < nbr && nbr < 1000000) {
            precision = 5 - Math.floor(JXG.Math.log10(Math.abs(nbr)));
            str = nbr.toFixed(precision);
            return parseFloat(str).toString(); // Removes insignificant trailing zeroes
        }
        else {
            str = nbr.toExponential(5);
            eIndex = str.indexOf('e')
            mantissa = str.slice(0, eIndex);
            mantissa = parseFloat(mantissa).toString(); // Removes insignificant trailing zeroes
            exponentSign = str.charAt(eIndex+1);
            exponentSign = exponentSign === '+' ? '' : '-';
            exponent = str.slice(eIndex+2);
            return mantissa + '\\times' + '10^{' + exponentSign + exponent + '}';
        }
    }

    // f' = f, slope = yp
    function f(x) {
        return a*Math.exp(x);
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
            {strokeWidth: 3, strokeColor: 'red', highlight: false}
        );

        pPoint = board.create('point', [xp, yp], {
            fixed: true,
            name: 'P',
            label: {offset: [10, -10]},
            strokeColor: 'blue',
            fillColor: 'blue'
        });
    }

    function updateGraph() {
        pPoint.setPosition(JXG.COORDS_BY_USER, [xp, yp]);
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
