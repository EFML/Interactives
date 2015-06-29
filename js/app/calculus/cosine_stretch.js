var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var xMin = -2.1, xMax = 2.25, yMin = -5.0, yMax = 5.0,
        boundingBox = [xMin, yMax, xMax, yMin],
        amplitude = 1.0, board;

    var fCurve, gCurve;

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
        createSlider();
        outputStaticMath();
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

    function createSlider() {
        $('#amplitude-slider').slider({
            min: 0.0,
            max: 4.5,
            step: 0.1,
            value: amplitude,
            slide: function(event, ui ) {
                $("#amplitude-slider-value" ).html(ui.value);
                amplitude = ui.value;
                fCurve.updateCurve();
                board.update();
            }
        });
    }

    function outputStaticMath() {
        katex.render('y = Acos(3x)', $('#math-line1').get(0));
        katex.render('y = \\frac{sin(3(x+0.001)-sin(3x)}{0.001}', $('#math-line2').get(0));
    }

    function f(x) {
        return amplitude*Math.cos(3.0*Math.PI*x);
    }

    function g(x) {
        return (Math.sin(3.0*(Math.PI*(x+0.001))) - Math.sin(3.0*Math.PI*x))/(Math.PI*0.001);
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
            withLabel: false,
        });
        xAxis.removeAllTicks();
        board.create('ticks', [xAxis, [-2.0, -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0]], {
            strokeColor:'#ccc',
            majorHeight: -1,
            drawLabels: true,
            label: {offset: [10, -10]},
            labels: ['-2&pi;', '-3&pi;/2', '-&pi;', '&pi;/2', '0', '&pi;/2', '&pi;', '3&pi;/2', '2&pi;'],
            minorTicks: 5,
            drawZero: true
        });

        yAxis = board.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = 0.01;
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

        gCurve = board.create(
            'functiongraph',
            [g],
            {strokeWidth: 3, strokeColor: 'blue', dash: 2, highlight: false}
        );
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
