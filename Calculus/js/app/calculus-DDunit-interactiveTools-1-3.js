var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-6.0, 6.0, 6.0, -6.0],
        fFn = [constant, linearUp, linearDown, piecewise, curve],
        intfFn = [intConstant, intLinearUp, intLinearDown, intPiecewise, intCurve],
        aVal = -1.0, xMin = -5.0, xMax = 5.0, xStep = 0.1, precision = 6, k = 1.35, // for parabola curve
        graphBoard, xSlider, xSliderValue,
        animateButton, backwardButton, forwardButton, animateIcon, isAnimating = false, anim,
        fCurve, aLine, xLine, areas = [],
        zonesAll = [
            [-5.0, -1.0, 5.0],
            [-5.0, -3.0, -1.0, 5.0],
            [-5.0, 5.0],
            [-5.0, -2.0, -1.0, 1.0, 4.0, 5.0],
            [-5.0, -3.0, -1.0, 3.0, 5.0]
        ],
        config = window.ToolsSettings || {
            toolNbr: 1,
            fnInit: 1,
            xInit: 0.0
        },
        fnNbr = config.fnInit, f = fFn[fnNbr], intf = intfFn[fnNbr], xVal = config.xInit, zones = zonesAll[fnNbr];

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
        $(document).on('click', stopAnimation)
        $('#dnext-help-link').on('click', toggle);

        if (config.toolNbr === 1) {
            $('#constant-radio-button').on('change', function() {
                radioButtonHandler(0);
            });
            $('#linear-radio-button').on('change', function() {
                radioButtonHandler(1);
            });
        }
        else if (config.toolNbr === 2) {
            $('#constant-radio-button').on('change', function() {
                radioButtonHandler(0);
            });
            $('#linear-up-radio-button').on('change', function() {
                radioButtonHandler(1);
            });
            $('#linear-down-radio-button').on('change', function() {
                radioButtonHandler(2);
            });
        }
        else if (config.toolNbr === 3) {
            $('#piecewise-radio-button').on('change', function() {
                radioButtonHandler(3);
            });
            $('#curve-radio-button').on('change', function() {
                radioButtonHandler(4);
            });
        }

        createGraphBoard();
        createAreas();
        createSlider();
        outputDynamicMath();
        updateFixedShapes();
        updateMovingShapes();

        animateButton = $('#animate');
        animateButton.on('click', animateButtonHandler);

        backwardButton = $('#backward');
        backwardButton.on('click', backwardButtonHandler);

        forwardButton = $('#forward');
        forwardButton.on('click', forwardButtonHandler);

        animateIcon = animateButton.children('i');
    }

    function resizeBox(){
        var containerWidth = $('.dnext-tool-container').width();
        graphBoard.needsFullUpdate = true;
        graphBoard.resizeContainer(0.49*containerWidth, graphBoard.canvasHeight);
        graphBoard.setBoundingBox(boundingBox);
        graphBoard.update();
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
        xSliderValue = $('#x-slider-value');
        xSlider = $('#x-slider');
        xSlider.slider({
            min: xMin,
            max: xMax,
            step: xStep,
            value: xVal,
            slide: function(event, ui ) {
                xSliderValue.html(ui.value);
                xVal = ui.value;
                updateMovingShapes();
                outputDynamicMath();
            }
        });
    }

    function animateButtonHandler(event) {
        if (isAnimating) {
            stopAnimation();
        }
        else {
            startAnimation();
        }
        event.stopPropagation();
    };

    function backwardButtonHandler(event) {
        xSlider.slider('value', xSlider.slider('value') - xStep);
        updateAnimation();
    };

    function forwardButtonHandler(event) {
        xSlider.slider('value', xSlider.slider('value') + xStep);
        updateAnimation();
    };

    function radioButtonHandler(nbr) {
        fnNbr = nbr;
        f = fFn[fnNbr];
        intf = intfFn[fnNbr];
        zones = zonesAll[fnNbr];
        createAreas();
        updateFixedShapes();
        updateMovingShapes();
        outputDynamicMath();
    }

    function outputDynamicMath() {
        katex.render(areaStr(), $('#math-line1').get(0));
    }

    function areaStr() {
        var area = intf(aVal, xVal);
        return 'a = -1 \\quad \\int_{a}^{x}f(t)dt = ' + nbrToString(area);
    }

    function nbrToString(nbr) {
        var nbrStr = nbr.toFixed(precision);

        return parseFloat(nbrStr).toString(); // Removes insignificant trailing zeroes
    }

    function constant(x) {
        return 3.0;
    }

    function linearUp(x) {
        return x/3.0 + 1.0;
    }

    function linearDown(x) {
        return -0.5*(x+1.0);
    }

    function piecewise(x) {
        if (x <= -3.0) {
            return -1.0;
        }
        else if (x <= 0.0) {
            return x + 2.0;
        }
        else if (x <= 2.0) {
            return -2.0*(x-1);
        }
        else {
            return x - 4.0;
        }
    }

    function curve(x) {
        return k*(1.0 - x*x/9.0);
    }

    // Indefinite integral: y = 3x
    function intConstant(a, b) {
        return 3.0*(b-a);
    }

    // Indefinite integral: y = x^2/6 + x = x(x+6)/6
    function intLinearUp(a, b) {
        return (b*(b+6) - a*(a+6))/6.0;
    }

    // Indefinite integral: y = 0.5x(0.5x+1)
    function intLinearDown(a, b) {
        return -0.5*(b*(0.5*b+1.0) - a*(0.5*a+1.0));
    }

    function intPiecewise(a, b) {
        return intPiecewiseFromMin(b) - intPiecewiseFromMin(a);
    }

    // Definite integral from xMin to x
    function intPiecewiseFromMin(x) {
        if (x <= -3.0) {
            return intPiecewise1(xMin, x);
        }
        else if (x <= 0.0) {
            return intPiecewise1(xMin, -3.0) + intPiecewise2(-3.0, x);
        }
        else if (x <= 2.0) {
            return intPiecewise1(xMin, -3.0) + intPiecewise2(-3.0, 0.0) +
                   intPiecewise3(0.0, x);
        }
        else {
            return intPiecewise1(xMin, -3.0) + intPiecewise2(-3.0, 0.0) +
                   intPiecewise3(0.0, 2.0) + intPiecewise4(2.0, x);
        }

    }

    // Definite integrals of various pieces to their upper bounds
    // Indefinite integral of the pieces:
    // Piece 1: -x
    // Piece 2: x(0.5x+2)
    // Piece 3: x(2-x)
    // Piece 4: x(0.5x-4)
    function intPiecewise1(a, b) {
        return a - b;
    }

    function intPiecewise2(a, b) {
        return b*(0.5*b+2.0) - a*(0.5*a+2.0);
    }

    function intPiecewise3(a, b) {
        return b*(2.0-b) - a*(2.0-a);
    }

    function intPiecewise4(a, b) {
        return b*(0.5*b-4.0) - a*(0.5*a-4.0);
    }

    // Indefinite integral: y = kx(1-x^3/27)
    function intCurve(a, b) {
        return k*b*(1.0-b*b/27.0) - k*a*(1.0-a*a/27.0);
    }

    function startAnimation() {
        if (!isAnimating) {
            if (xSlider.slider('value') === xMax) {
                xSlider.slider('value', xMin);
                animateIcon.removeClass('fa-pause fa-backward');
                animateIcon.addClass('fa-play');
                updateAnimation();
            }
            else {
                animateIcon.removeClass('fa-play fa-backward');
                animateIcon.addClass('fa-pause');
                isAnimating = true;
                animate();
            }
        }
    }

    function stopAnimation() {
        if (xSlider.slider('value') === xMax) {
            animateIcon.removeClass('fa-pause fa-play');
            animateIcon.addClass('fa-backward');
        }
        else {
            animateIcon.removeClass('fa-pause fa-backward');
            animateIcon.addClass('fa-play');
        }
        isAnimating = false;
        cancelAnimationFrame(anim);
    }

    function updateAnimation() {
        xVal = xSlider.slider('value');
        xSliderValue.html(xVal);
        updateMovingShapes();
        outputDynamicMath();
    }

    function animate() {
        anim = requestAnimationFrame(animate);
        xSlider.slider('value', xSlider.slider('value') + xStep);
        if (xSlider.slider('value') === xMax) {
            stopAnimation();
        }
        updateAnimation();
    }

    function createGraphBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;

        graphBoard = JXG.JSXGraph.initBoard('graph-board', {
            boundingbox: boundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: true
        });

        xAxis = graphBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });

        yAxis = graphBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = Math.abs(boundingBox[2] - boundingBox[0]) / 100.0;
        yOffset1 = Math.abs(boundingBox[3] - boundingBox[1]) / 25.0;
        xOffset2 = Math.abs(boundingBox[2] - boundingBox[0]) / 50.0;
        yOffset2 = Math.abs(boundingBox[3] - boundingBox[1]) / 25.0; // Different than in other applications

        xAxisLabel = graphBoard.create('text', [boundingBox[2] - xOffset1, yOffset1, 'x'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = graphBoard.create('text', [xOffset2, boundingBox[1] - yOffset2, 'y'], {
            anchorX: 'left',
            fixed:true
        });

        fCurve = graphBoard.create(
            'curve',
            [[], []],
            {strokeWidth: 2, strokeColor: 'blue', highlight: false}
        );

        aLine = graphBoard.create('line', [[aVal, 0.0], [aVal, f(aVal)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: '#444444',
            highlight: false
        });

        xLine = graphBoard.create('line', [[xVal, 0.0], [xVal, f(xVal)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: '#444444',
            highlight: false
        });
    }

    function getAreaColor(x1, x2) {
        var area = intf(x1, x2);

        area = (x2 <= aVal) ? -area : area;

        return area < 0.0 ? 'red' : 'green';
    }

    function createAreas() {
        var i, fillColor;

        if (!_.isEmpty(areas)) {
            _.each(areas, function(area){
                graphBoard.removeObject(area);
            });
        }
        areas.length = 0;

        for (i = 0; i < zones.length - 1; i++) {
            fillColor = getAreaColor(zones[i], zones[i+1]);
            areas.push(
                graphBoard.create(
                    'curve',
                    [[], []],
                    {strokeWidth: 0, fillColor: fillColor, fillOpacity: 0.2, highlight: false}
                )
            );
        }
    }

    function updateFixedShapes() {
        var x, y, xMin, xMax, xInc = 0.01, dataX = [], dataY = [];

        xMin = boundingBox[0];
        xMax = boundingBox[2];

        for (x = xMin; x <= xMax; x += xInc) {
            y = f(x);
            dataX.push(x);
            dataY.push(y);
        }

        fCurve.dataX = dataX;
        fCurve.dataY = dataY;
        fCurve.updateCurve();

        aLine.point1.moveTo([aVal, 0.0], 0);
        aLine.point2.moveTo([aVal, f(aVal)], 0);
    }

    function updateMovingShapes() {
        var x, y, xMin, xMax, xInc = 0.01, i,
            dataX = [], dataY = [], xZone = [], yZone = [];

        xMin = Math.min(aVal, xVal);
        xMax = Math.max(aVal, xVal);

        for (x = xMin; x <= xMax; x += xInc) {
            y = f(x);
            dataX.push(x);
            dataY.push(y);
        }

        _.each(areas, function(area) {
            area.dataX.length = 0;
            area.dataY.length = 0;
            area.updateCurve();
        })

        for (i = 0; i < zones.length - 1; i++) {
            xZone.length = 0;
            yZone.length = 0;

            xZone = _.filter(dataX, function(num) {
                return zones[i] <= num && num <= zones[i+1];
            });

            if (!_.isEmpty(xZone)) {
                _.each(xZone, function(num) {
                    yZone.push(f(num));
                });
                xZone.push(_.last(xZone), _.first(xZone));
                yZone.push(0.0, 0.0);
            }

            areas[i].dataX = _.clone(xZone);
            areas[i].dataY = _.clone(yZone);
            areas[i].updateCurve();
        }

        xLine.point1.moveTo([xVal, 0.0], 0);
        xLine.point2.moveTo([xVal, f(xVal)], 0);

        graphBoard.update();
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
