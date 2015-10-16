(function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-6.0, 6.0, 6.0, -6.0],
        fFn = [constant, linearUp, linearDown, piecewise, curve, constant1, linear1, secondPiecewise, constant2, linear2, linear3],
        intfFn = [intConstant, intLinearUp, intLinearDown, intPiecewise, intCurve, intConstant1, intLinear1, intSecondPiecewise, intConstant2, intLinear2, intLinear3],
        tMin = boundingBox[0], tMax = boundingBox[2],
        aMin = -5.0, aMax = 5.0, aStep = 0.1,
        xMin = -5.0, xMax = 5.0, xStep = 0.1,
        precision = 6, k = 1.35, // for parabola curve
        graphBoard, aSlider, aSliderValue, xSlider, xSliderValue,
        animateButton, backwardButton, forwardButton, animateIcon, isAnimating = false, anim,
        fCurve, intfCurve, xPoint, xDottedLine, aLine, xLine, areas = [],
        zonesAll = [
            [-5.0, -1.0, 5.0],
            [-5.0, -3.0, -1.0, 5.0],
            [-5.0, 5.0],
            [-5.0, -2.0, 1.0, 4.0, 5.0], // the a value will be inserted afterwards
            [-5.0, -3.0, 3.0, 5.0], // the a value will be inserted afterwards
            [-5.0, 0.0, 5.0],
            [-5.0, 0.0, 4.0, 5.0],
            [-5.0, -2.0, 0.0, 2.0, 5.0],
            [-3.0, 3.0, 9.0],
            [-5.0, 0.0, 3.0, 5.0],
            [-5.0, -2.0, 0.0, 5.0], // the a value will be inserted afterwards
        ],
        config = window.definiteIntegralSettings || {
            toolNbr: 1,
            fnInit: 1,
            aInit: -1.0,
            xInit: 0.0
        },
        fnNbr = config.fnInit, f = fFn[fnNbr], intf = intfFn[fnNbr],
        aVal = config.aInit, xVal = config.xInit, zones = zonesAll[fnNbr],
        aStr = 'a = ' + nbrToString(config.aInit),
        showIntCurve = config.toolNbr === 4 || config.toolNbr === 5 ||
                       config.toolNbr === 6 || config.toolNbr === 7 ||
                       config.toolNbr === 8 || config.toolNbr === 9 ||
                       config.toolNbr === 10 || config.toolNbr === 11;

    init();

    function init() {
        $(window).on('resize', resizeBox);
        $(document).on('click', stopAnimation);
        $('#dnext-about-link').on('click', toggle);

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
        else if (config.toolNbr === 3 || config.toolNbr === 4 || config.toolNbr === 5) {
            $('#piecewise-radio-button').on('change', function() {
                radioButtonHandler(3);
            });
            $('#curve-radio-button').on('change', function() {
                radioButtonHandler(4);
            });
        }
        else if (config.toolNbr === 9) {
            boundingBox = [-3.5, 13.0, 10.0, -13.0];
            xMin = -3.0;
            xMax = 9.0;
            tMin = boundingBox[0];
            tMax = boundingBox[2];
        }
        else if (config.toolNbr === 10) {
            boundingBox = [-6.0, 12.0, 6.0, -12.0];
        }
        else if (config.toolNbr === 11) {
            $('#linear-radio-button').on('change', function() {
                radioButtonHandler(10);
            });
            $('#piecewise-radio-button').on('change', function() {
                radioButtonHandler(3);
            });
            $('#curve-radio-button').on('change', function() {
                radioButtonHandler(4);
            });
        }

        if (config.toolNbr === 5 || config.toolNbr === 11) {
            aStr = 'a = ' + aVal.toFixed(1);
            updateZones();
            aSliderValue = $('#a-slider-value');
            aSlider = $('#a-slider');
            aSlider.slider({
                min: aMin,
                max: aMax,
                step: aStep,
                value: aVal,
                slide: function(event, ui) {
                    aSliderValue.html(ui.value);
                    aVal = ui.value;
                    aStr = 'a = ' + aVal.toFixed(1);
                    updateZones();
                    createAreas();
                    updateFixedShapes();
                    updateMovingShapes();
                    outputDynamicMath();
                }
            });
        }

        createGraphBoard();
        createAreas();
        createSlider();
        updateFixedShapes();
        updateMovingShapes();
        outputDynamicMath();

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
        xSliderValue = $('#x-slider-value');
        xSlider = $('#x-slider');
        xSlider.slider({
            min: xMin,
            max: xMax,
            step: xStep,
            value: xVal,
            slide: function(event, ui) {
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
    }

    function backwardButtonHandler(event) {
        xSlider.slider('value', xSlider.slider('value') - xStep);
        updateAnimation();
    }

    function forwardButtonHandler(event) {
        xSlider.slider('value', xSlider.slider('value') + xStep);
        updateAnimation();
    }

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
        return aStr + '\\quad \\int_{a}^{x}f(t)dt = ' + nbrToString(area);
    }

    function nbrToString(nbr) {
        var nbrStr = nbr.toFixed(precision);

        return parseFloat(nbrStr).toString(); // Removes insignificant trailing zeroes
    }

    function constant(t) {
        return 3.0;
    }

    function linearUp(t) {
        return t/3.0 + 1.0;
    }

    function linearDown(t) {
        return -0.5*(t+1.0);
    }

    function piecewise(t) {
        if (t <= -3.0) {
            return -1.0;
        }
        else if (t <= 0.0) {
            return t + 2.0;
        }
        else if (t <= 2.0) {
            return -2.0*(t-1);
        }
        else {
            return t - 4.0;
        }
    }

    function curve(t) {
        return k*(1.0 - t*t/9.0);
    }

    function constant1(t) {
        return -2.0;
    }

    function linear1(t) {
        return -0.5*t + 2.0;
    }

    function secondPiecewise(t) {
        if (t <= 0.0) {
            return -t - 2.0;
        }
        else if (t <= 2.0) {
            return -Math.sqrt(4.0-t*t);
        }
        else {
            return t - 2.0;
        }
    }

    function constant2(t) {
        return 2.0;
    }

    function linear2(t) {
        return 2.0*t;
    }

    function linear3(t) {
        return 0.5*t + 1.0;
    }

    // Indefinite integral: y = 3t
    function intConstant(a, b) {
        return 3.0*(b-a);
    }

    // Indefinite integral: y = t^2/6 + t = t(t+6)/6
    function intLinearUp(a, b) {
        return (b*(b+6) - a*(a+6))/6.0;
    }

    // Indefinite integral: y = 0.5t(0.5t+1)
    function intLinearDown(a, b) {
        return -0.5*(b*(0.5*b+1.0) - a*(0.5*a+1.0));
    }

    function intPiecewise(a, b) {
        return intPiecewiseFromMin(b) - intPiecewiseFromMin(a);
    }

    // Indefinite integral: y = -2t
    function intConstant1(a, b) {
        return -2.0*(b-a);
    }

    // Indefinite integral: y = t(2-0.25t)
    function intLinear1(a, b) {
        return b*(2.0-0.25*b) - a*(2.0-0.25*a);
    }

    function intSecondPiecewise(a, b) {
        return intSecondPiecewiseFromMin(b) - intSecondPiecewiseFromMin(a);
    }

    // Definite integral from tMin to t
    function intPiecewiseFromMin(t) {
        if (t <= -3.0) {
            return intPiecewise1(tMin, t);
        }
        else if (t <= 0.0) {
            return intPiecewise1(tMin, -3.0) + intPiecewise2(-3.0, t);
        }
        else if (t <= 2.0) {
            return intPiecewise1(tMin, -3.0) + intPiecewise2(-3.0, 0.0) +
                   intPiecewise3(0.0, t);
        }
        else {
            return intPiecewise1(tMin, -3.0) + intPiecewise2(-3.0, 0.0) +
                   intPiecewise3(0.0, 2.0) + intPiecewise4(2.0, t);
        }

    }

    // Definite integral from tMin to t
    function intSecondPiecewiseFromMin(t) {
        if (t <= 0.0) {
            return intSecondPiecewise1(tMin, t);
        }
        else if (t <= 2.0) {
            return intSecondPiecewise1(tMin, 0.0) + intSecondPiecewise2(0.0, t);
        }
        else {
            return intSecondPiecewise1(tMin, 0.0) + intSecondPiecewise2(0.0, 2.0) +
                   intSecondPiecewise3(2.0, t);
        }

    }

    // Definite integrals of various pieces to their upper bounds
    // Indefinite integral of the pieces:
    // Piece 1: -t
    // Piece 2: t(0.5t+2)
    // Piece 3: t(2-t)
    // Piece 4: t(0.5t-4)
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

    // Definite integrals of various pieces to their upper bounds
    // Indefinite integral of the pieces:
    // Piece 1: -t(0.5t+2)
    // Piece 2: -0.5xsqrt(4-t^2) - 2arcsin(0.5t)
    // Piece 3: t(0.5t-2)
    function intSecondPiecewise1(a, b) {
        return a*(0.5*a+2.0) - b*(0.5*b+2.0);
    }

    function intSecondPiecewise2(a, b) {
        return 0.5*a*Math.sqrt(4.0-a*a) + 2.0*Math.asin(0.5*a) - 0.5*b*Math.sqrt(4.0-b*b) - 2.0*Math.asin(0.5*b);
    }

    function intSecondPiecewise3(a, b) {
        return b*(0.5*b-2.0) - a*(0.5*a-2.0);
    }

    // Indefinite integral: y = kt(1-t^3/27)
    function intCurve(a, b) {
        return k*b*(1.0-b*b/27.0) - k*a*(1.0-a*a/27.0);
    }

    // Indefinite integral: y = 2t
    function intConstant2(a, b) {
        return 2.0*(b-a);
    }

    // Indefinite integral: y = t^2
    function intLinear2(a, b) {
        return b*b - a*a;
    }

    // Indefinite integral: y = t(0.25t+1)
    function intLinear3(a, b) {
        return b*(0.25*b+1.0) - a*(0.25*a+1.0);
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

        JXG.Options.text.fontSize = 14;

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

        xAxisLabel = graphBoard.create('text', [boundingBox[2] - xOffset1, yOffset1, 't'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = graphBoard.create('text', [xOffset2, boundingBox[1] - yOffset2, 'y'], {
            anchorX: 'left',
            fixed:true
        });

        if (showIntCurve) {
            intfCurve = graphBoard.create(
                'curve',
                [[], []],
                {strokeWidth: 2, strokeColor: '#f9966b', highlight: false}
            );

            xDottedLine = graphBoard.create('line', [[xVal, 0.0], [xVal, intf(aVal, xVal)]], {
                fixed: true,
                straightFirst:false,
                straightLast:false,
                strokeWidth: 1,
                strokeColor: 'black',
                dash: 1,
                highlight: false
            });

            xPoint = graphBoard.create('point', [xVal, intf(aVal, xVal)], {
                fixed: true,
                name: '',
                size: 2,
                strokeColor: 'black',
                fillColor: 'black'
            });
        }

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

    function updateZones() {
        zones = _.clone(zonesAll[fnNbr]);
        zones.push(aVal);
        zones = _.sortBy(zones, function(num){
            return num;
        });
    }

    function getAreaColor(t1, t2) {
        var area = intf(t1, t2);

        area = (t2 <= aVal) ? -area : area;

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
        var t, tInc = 0.01, fDataX = [], fDataY = [], intfDataY = [];

        for (t = tMin; t <= tMax; t += tInc) {
            fDataX.push(t);
            fDataY.push(f(t));

            if (showIntCurve) {
                intfDataY.push(intf(aVal, t));
            }
        }

        fCurve.dataX = fDataX;
        fCurve.dataY = fDataY;
        fCurve.updateCurve();

        if (showIntCurve) {
            intfCurve.dataX = fDataX;
            intfCurve.dataY = intfDataY;
            intfCurve.updateCurve();
        }

        aLine.point1.moveTo([aVal, 0.0], 0);
        aLine.point2.moveTo([aVal, f(aVal)], 0);
    }

    function updateMovingShapes() {
        var t, tLocalMin, tLocalMax, tInc = 0.01, i,
            dataX = [], dataY = [], xZone = [], yZone = [];

        tLocalMin = Math.min(aVal, xVal);
        tLocalMax = Math.max(aVal, xVal);

        for (t = tLocalMin; t <= tLocalMax; t += tInc) {
            dataX.push(t);
            dataY.push(f(t));
        }

        _.each(areas, function(area) {
            area.dataX.length = 0;
            area.dataY.length = 0;
            area.updateCurve();
        });

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

        if (showIntCurve) {
            xDottedLine.point1.moveTo([xVal, 0.0], 0);
            xDottedLine.point2.moveTo([xVal, intf(aVal, xVal)], 0);
            xPoint.setPosition(JXG.COORDS_BY_USER, [xVal, intf(aVal, xVal)]);
        }

        graphBoard.update();
    }
})(jQuery, _, JXG);
