var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-0.5, 5.0, 3.5, -5.0],
        board,
        a = 1.0, b = 1.0;

    var fCurve;

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
        $('#a-slider').slider({
            min: -3.0,
            max: 3.0,
            step: 0.1,
            value: a,
            slide: function(event, ui ) {
                $("#a-slider-value" ).html(ui.value);
                a = ui.value;
                outputDynamicMath();
                board.update();
            }
        });

        $('#b-slider').slider({
            min: -3.0,
            max: 3.0,
            step: 0.1,
            value: b,
            slide: function(event, ui ) {
                $("#b-slider-value" ).html(ui.value);
                b = ui.value;
                outputDynamicMath();
                board.update();
            }
        });
    }

    function outputDynamicMath() {
        katex.render('y = Asin(x) + Bcos(x) = ' + functionString(), $('#math-line1').get(0));
    }

    function functionString() {
        var aStr = '', bOp = '', bStr = '';

        if (a !== 0.0) {
            if (a === -1.0) {
                aStr = '-sin(x)';
            }
            else if (a === 1.0) {
                aStr = 'sin(x)'
            }
            else {
                aStr = nbrToString(a) + 'sin(x)'
            }
        }

        if (b > 0.0 && a !== 0.0) {
                bOp = '+'
        }
        else if (b < 0.0 && a !== 0.0) {
                bOp = '-'
        }

        if (b !== 0.0) {
            if (b === -1.0 || b === 1.0) {
                bStr = 'cos(x)';
            }
            else {
                bStr = nbrToString(Math.abs(b)) + 'cos(x)'
            }
        }

        return aStr + bOp + bStr;
    }

    function nbrToString(nbr) {
        var nbrStr = nbr.toFixed(1);

        return parseFloat(nbrStr).toString(); // Removes insignificant trailing zeroes
    }

    function f(x) {
        return a*Math.sin(Math.PI*x) + b*Math.cos(Math.PI*x);
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
        xAxis.removeAllTicks();
        board.create('ticks', [xAxis, [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0]], {
            strokeColor:'#ccc',
            majorHeight: -1,
            drawLabels: true,
            label: {offset: [10, -10]},
            labels: ['0', '&pi;/2', '&pi;', '3&pi;/2', '2&pi;', '5&pi;/2', '3&pi;'],
            minorTicks: 5,
            drawZero: true
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
            {strokeWidth: 3, strokeColor: 'blue', highlight: false}
        );
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
