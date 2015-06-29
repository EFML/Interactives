var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-10.0, 1.1, 160.0, -1.1],
        board,
        n = 1,
        nMax = 150,
        aVals = [],
        sVals = [],
        precision = 3;

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
        outputDynamicMath();
        calculateSeriesPoints();
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
        $('#n-slider').slider({
            min: 1,
            max: nMax,
            value: n,
            slide: function(event, ui ) {
                $("#n-slider-value" ).html(ui.value);
                n = ui.value;
                setSeriesPointsVisibility();
                board.update();
                outputDynamicMath();
            }
        });
    }

    function outputDynamicMath() {
        katex.render(seriesItemStr(), $('#math-line1').get(0));
        katex.render(seriesSumStr(), $('#math-line2').get(0));
    }

    function seriesItemStr() {
        var nStr = n.toFixed();
        return 'a_{' + nStr + '} = ' + '\\frac{(-1)^{' + (n-1).toFixed() + '}}{' + nStr + '} = ' + seriesItem(n).toFixed(precision);
    }

    function seriesSumStr() {
        var nStr = n.toFixed();
        return 'S_n = \\displaystyle\\sum_{n=1}^{' + nStr + '} \\frac{(-1)^{n-1}}{n} = ' + seriesSum(n).toFixed(precision);
    }

    function seriesItem(k) {
        return Math.pow(-1.0, k-1)/k;
    }

    function seriesSum(k) {
        var result = 0.0, i;

        for (i = 1; i <= k; i++) {
            result += seriesItem(i);
        }

        return result;
    }

    function calculateSeriesPoints() {
        var i, aVal, sVal;

        // Push two dummy items for index = 0
        aVals.push(
            board.create('point', [-15, 0], {
                fixed: true,
                name: ''
            })
        );

        sVals.push(
            board.create('point', [-15, 0], {
                fixed: true,
                name: ''
            })
        );


        for (i = 1; i <= nMax; i++) {
            aVal = board.create('point', [i, seriesItem(i)], {
                fixed: true,
                name: '',
                size: 2,
                strokeColor: "red",
                fillColor: "red"
            });
            if (i !== 1) {
                aVal.hideElement();
            }
            aVals.push(aVal);

            sVal = board.create('point', [i, seriesSum(i)], {
                fixed: true,
                name: '',
                size: 2,
                strokeColor: "blue",
                fillColor: "blue"
            });
            if (i !== 1) {
                sVal.hideElement();
            }
            sVals.push(sVal);
        }
    }

    function setSeriesPointsVisibility() {
        var i = 1;

        while (i <= n) {
            aVals[i].showElement();
            sVals[i].showElement();
            i++;
        }

        while (i <= nMax) {
            aVals[i].hideElement();
            sVals[i].hideElement();
            i++;
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
            grid: false
        });

        xAxis = board.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });
        xAxis.removeAllTicks();
        board.create('ticks', [xAxis, 25], {
            strokeColor:'#ccc',
            majorHeight: -1,
            drawLabels: true,
            label: {offset: [7, -20]},
            minorTicks: 5,
            drawZero: true
        });

        yAxis = board.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });
        yAxis.removeAllTicks();
        board.create('ticks', [yAxis, 0.5], {
            strokeColor:'#ccc',
            majorHeight: -1,
            drawLabels: true,
            label: {offset: [-30, -2]},
            minorTicks: 5,
            drawZero:false
        });

        xOffset1 = Math.abs(boundingBox[2] - boundingBox[0]) / 100.0;
        yOffset1 = Math.abs(boundingBox[3] - boundingBox[1]) / 25.0;
        xOffset2 = Math.abs(boundingBox[2] - boundingBox[0]) / 50.0;
        yOffset2 = Math.abs(boundingBox[3] - boundingBox[1]) / 50.0;

        xAxisLabel = board.create('text', [boundingBox[2] - xOffset1, yOffset1, 'n'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = board.create('text', [xOffset2, boundingBox[1] - yOffset2, 'y'], {
            anchorX: 'left',
            fixed:true
        });
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);