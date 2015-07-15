var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-7.0, 11.0, 11.0, -7.0],
        board,
        xp = 0.7, yp = f(xp), slope = df(xp);

    var fCurve, pPoint;

    init();

    function init() {
        $(window).on('resize', resizeBox);
        $('#dnext-about-link').on('click', toggle);

        createBoard();
        createSlider();
        outputStaticMath();
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
        $('#p-slider').slider({
            min: -6.5,
            max: 11.5,
            step: 0.1,
            value: xp,
            slide: function(event, ui ) {
                $("#p-slider-value" ).html(ui.value);
                xp = ui.value;
                yp = f(xp);
                slope = df(xp);
                outputDynamicMath();
                updateGraph();
                board.update();
            }
        });
    }

    function outputStaticMath() {
        katex.render('\\text{Curve: } \\frac{dy}{dx} = 2e^{-2x} + x - 1', $('#math-line1').get(0));
    }

    function outputDynamicMath() {
        katex.render('\\text{Point P: }' + pString(), $('#math-line2').get(0));
        katex.render('\\text{Slope at P: }' + numberToString(slope), $('#math-line3').get(0));
    }

    function pString() {
        var xpStr = xp.toFixed(1);

        xpStr = parseFloat(xpStr).toString(); // Removes insignificant trailing zeroes

        return '(' + xpStr + ', ' + numberToString(yp) + ')';
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

    function f(x) {
        return 2.0*Math.exp(-2.0*x) + x - 1.0;
    }

    function df(x) {
        return -4.0*Math.exp(-2.0*x) + 1.0;
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
