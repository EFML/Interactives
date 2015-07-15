var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var yCenter = 1.0, xMin = -10.0, xMax = 10.0, yMin = -4.0, yMax = 6.0,
        zoom = 1.0, precision = 3,
        boundingBox = [zoom*xMin, yCenter + zoom*yMax, zoom*xMax, yCenter + zoom*yMin],
        board;

    var fCurve, discontinuityPoint;

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
        $('#zoom-slider').slider({
            min: 0.001,
            max: 1.0,
            step: 0.001,
            value: zoom,
            slide: function(event, ui ) {
                $("#a-slider-value" ).html(ui.value);
                zoom = ui.value;
                updateGraph();
                board.update();
                outputDynamicMath();
            }
        });
    }

    function outputStaticMath() {
        katex.render('\\text{Curve: } y = \\frac {\\sin (x)}{x}', $('#math-line1').get(0));
    }

    function outputDynamicMath() {
        katex.render('\\text{Window: }' + boundingBoxString(), $('#math-line2').get(0));
    }

    function boundingBoxString() {
       return '[' +
              boundingBox[0].toFixed(precision) + ', ' +
              boundingBox[2].toFixed(precision) + '] \\times [' +
              boundingBox[3].toFixed(precision) + ', ' +
              boundingBox[1].toFixed(precision) +
              ']';
    }

    function f(x) {
        return x !== 0.0 ? Math.sin(x)/x : 1.0;
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

    function plotGraph() {
        fCurve = board.create(
            'functiongraph',
            [f],
            {strokeWidth: 3, strokeColor: 'blue', highlight: false}
        );

        discontinuityPoint = board.create('point', [0.0, 1.0], {
            fixed: true,
            name: '',
            strokeColor: 'blue',
            fillColor: 'white'
        });
    }

    function updateGraph() {
        boundingBox = [zoom*xMin, yCenter + zoom*yMax, zoom*xMax, yCenter + zoom*yMin];
        board.setBoundingBox(boundingBox);
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
