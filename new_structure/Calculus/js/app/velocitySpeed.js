var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var heightGraphBoundingBox = [-1.0, 12, 11.0, -12.0],
        t = 0.0, tMin = 0.0, tMax = 10.0, tStep = 0.1, v0 = 4.0, a = 1.0, precision = 2,
        animBoard, velocityGraphBoard, speedGraphBoard, tSlider, tSliderValue, animateButton, backwardButton, forwardButton, animateIcon,
        isAnimating = false, anim,
        velocityGraphLineLeft, velocityGraphLineRight, leftArea, centerArea, rightArea, totalArea, speedGraphLineLeft, speedGraphLineRight;

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

        createVelocityGraphBoard();
        createSpeedGraphBoard();
        createSlider();
        outputDynamicMath();
        updateGraphs();

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
        velocityGraphBoard.needsFullUpdate = true;
        velocityGraphBoard.resizeContainer(0.49*containerWidth, velocityGraphBoard.canvasHeight);
        velocityGraphBoard.setBoundingBox(heightGraphBoundingBox);
        velocityGraphBoard.update();
        speedGraphBoard.needsFullUpdate = true;
        speedGraphBoard.resizeContainer(0.49*containerWidth, speedGraphBoard.canvasHeight);
        speedGraphBoard.setBoundingBox(heightGraphBoundingBox);
        speedGraphBoard.update();
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
        tSliderValue = $('#t-slider-value');
        tSlider = $('#t-slider');
        tSlider.slider({
            min: tMin,
            max: tMax,
            step: tStep,
            value: t,
            slide: function(event, ui ) {
                tSliderValue.html(ui.value);
                t = ui.value;
                updateGraphs();
                velocityGraphBoard.update();
                speedGraphBoard.update();
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
        tSlider.slider('value', tSlider.slider('value') - tStep);
        updateAnimation();
    };

    function forwardButtonHandler(event) {
        tSlider.slider('value', tSlider.slider('value') + tStep);
        updateAnimation();
    };

    function outputDynamicMath() {
        katex.render(areaVelocityStr(), $('#math-line1').get(0));
        katex.render(areaSpeed(t).toFixed(precision), $('#math-line2').get(0));
    }

    function areaVelocityStr() {
        var area = areaVelocity(0.0, t);
        return Math.abs(area) < 0.001 ? '0.00' : area.toFixed(precision);
    }

    function velocity(t) {
        // Positive for [0, 2.5[, zero for 2.5, negative for ]2.5, 7.5[, zero for 7.5, positive for ]7.5, 10.0]
        return 5.0*Math.cos(Math.PI*t/5.0);
    }

    function areaVelocity(a, b) {
        return (25.0/Math.PI)*(Math.sin(Math.PI*b/5.0) - Math.sin(Math.PI*a/5.0));
    }

    function speed(t) {
        return Math.abs(velocity(t));
    }

    function areaSpeed(t) {
        if (t <= 2.5) {
            return areaVelocity(0.0, t);
        }
        else if (t <= 7.5) {
            return areaVelocity(0.0, 2.5) + areaVelocity(7.5, 5.0 + t);
        }
        else {
            return areaVelocity(0.0, 2.5) + areaVelocity(7.5, 12.5) + areaVelocity(7.5, t);
        }
    }

    // Animation: tSlider.slider('option', 'min');
    function startAnimation() {
        if (!isAnimating) {
            if (tSlider.slider('value') === tMax) {
                tSlider.slider('value', tMin);
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
        if (tSlider.slider('value') === tMax) {
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
        t = tSlider.slider('value');
        tSliderValue.html(t);
        updateGraphs();
        velocityGraphBoard.update();
        outputDynamicMath();
    }

    function animate() {
        anim = requestAnimationFrame(animate);
        tSlider.slider('value', tSlider.slider('value') + tStep);
        if (tSlider.slider('value') === tMax) {
            stopAnimation();
        }
        updateAnimation();
    }

    function createVelocityGraphBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;

        velocityGraphBoard = JXG.JSXGraph.initBoard('height-graph-board', {
            boundingbox: heightGraphBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: true
        });

        xAxis = velocityGraphBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });
        xAxis.removeAllTicks();
        velocityGraphBoard.create('ticks', [xAxis, [0.0, 2.0, 4.0, 6.0, 8.0, 10.0]], {
            strokeColor:'#ccc',
            majorHeight: 10,
            drawLabels: true,
            label: {offset: [5, -15]},
            labels: ['0', '2', '4', '6', '8', '10'],
            minorTicks: 5,
            drawZero: false
        });

        yAxis = velocityGraphBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = Math.abs(heightGraphBoundingBox[2] - heightGraphBoundingBox[0]) / 100.0;
        yOffset1 = Math.abs(heightGraphBoundingBox[3] - heightGraphBoundingBox[1]) / 25.0;
        xOffset2 = Math.abs(heightGraphBoundingBox[2] - heightGraphBoundingBox[0]) / 50.0;
        yOffset2 = Math.abs(heightGraphBoundingBox[3] - heightGraphBoundingBox[1]) / 25.0; // Different than in other applications

        xAxisLabel = velocityGraphBoard.create('text', [heightGraphBoundingBox[2] - xOffset1, yOffset1, 't (s)'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = velocityGraphBoard.create('text', [xOffset2, heightGraphBoundingBox[1] - yOffset2, 'velocity (ft/s)'], {
            anchorX: 'left',
            fixed:true
        });

        velocityGraphBoard.create(
            'functiongraph',
            [velocity, 0.0, 10.0],
            {strokeWidth: 2, strokeColor: 'blue', highlight: false}
        );

        leftArea = velocityGraphBoard.create(
            'curve',
            [[], []],
            {strokeWidth: 0, fillColor:'green', fillOpacity: 0.2, highlight: false}
        );

        centerArea = velocityGraphBoard.create(
            'curve',
            [[], []],
            {strokeWidth: 0, fillColor:'red', fillOpacity: 0.2, highlight: false}
        );

        rightArea = velocityGraphBoard.create(
            'curve',
            [[], []],
            {strokeWidth: 0, fillColor:'green', fillOpacity: 0.2, highlight: false}
        );

        velocityGraphLineLeft = velocityGraphBoard.create('line', [[t, 0.0], [t, velocity(t)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: '#444444',
            highlight: false
        });

        velocityGraphLineRight = velocityGraphBoard.create('line', [[t, 0.0], [t, velocity(t)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: '#444444',
            highlight: false
        });
    }

    function createSpeedGraphBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;
        speedGraphBoard = JXG.JSXGraph.initBoard('velocity-graph-board', {
            boundingbox: heightGraphBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: true
        });

        xAxis = speedGraphBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });
        xAxis.removeAllTicks();
        speedGraphBoard.create('ticks', [xAxis, [0.0, 2.0, 4.0, 6.0, 8.0, 10.0]], {
            strokeColor:'#ccc',
            majorHeight: 10,
            drawLabels: true,
            label: {offset: [5, -15]},
            labels: ['0', '2', '4', '6', '8', '10'],
            minorTicks: 5,
            drawZero: false
        });

        yAxis = speedGraphBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = Math.abs(heightGraphBoundingBox[2] - heightGraphBoundingBox[0]) / 100.0;
        yOffset1 = Math.abs(heightGraphBoundingBox[3] - heightGraphBoundingBox[1]) / 25.0;
        xOffset2 = Math.abs(heightGraphBoundingBox[2] - heightGraphBoundingBox[0]) / 50.0;
        yOffset2 = Math.abs(heightGraphBoundingBox[3] - heightGraphBoundingBox[1]) / 25.0; // Different than in other applications

        xAxisLabel = speedGraphBoard.create('text', [heightGraphBoundingBox[2] - xOffset1, yOffset1, 't (s)'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = speedGraphBoard.create('text', [xOffset2, heightGraphBoundingBox[1] - yOffset2, 'speed (ft/s)'], {
            anchorX: 'left',
            fixed:true
        });

        speedGraphBoard.create(
            'functiongraph',
            [speed, 0.0, 10.0],
            {strokeWidth: 2, strokeColor: 'blue', highlight: false}
        );

        totalArea = speedGraphBoard.create(
            'curve',
            [[], []],
            {strokeWidth: 0, fillColor:'green', fillOpacity: 0.2, highlight: false}
        );

        speedGraphLineLeft = speedGraphBoard.create('line', [[t, 0.0], [t, speed(t)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: '#444444',
            highlight: false
        });

        speedGraphLineRight = speedGraphBoard.create('line', [[t, 0.0], [t, speed(t)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: '#444444',
            highlight: false
        });
    }

    function updateGraphs() {
        var x, y, xInc = 0.01, xLeft = [], yLeft = [], xCenter = [], yCenter = [], xRight = [], yRight = [], xTotal = [], yTotal = [], yCenterPos =[];

        for (x = 0.0; x <= t; x += xInc) {
            y = velocity(x);
            if (x <= 2.5) {
                xLeft.push(x);
                yLeft.push(y);
            }
            else if (x <= 7.5) {
                xCenter.push(x);
                yCenter.push(y);
                yCenterPos.push(Math.abs(y));
            }
            else {
                xRight.push(x);
                yRight.push(y);
            }
        }

        xLeft.push(t, 0.0);
        yLeft.push(0.0, 0.0);
        leftArea.dataX = xLeft;
        leftArea.dataY = yLeft;
        leftArea.updateCurve();

        xCenter.push(t, 0.0);
        yCenter.push(0.0, 0.0);
        yCenterPos.push(0.0, 0.0);
        centerArea.dataX = xCenter;
        centerArea.dataY = yCenter;
        centerArea.updateCurve();

        xRight.push(t, 0.0);
        yRight.push(0.0, 0.0);
        rightArea.dataX = xRight;
        rightArea.dataY = yRight;
        rightArea.updateCurve();

        xTotal = xLeft.concat(xCenter, xRight);
        yTotal = yLeft.concat(yCenterPos, yRight);
        totalArea.dataX = xTotal;
        totalArea.dataY = yTotal;
        totalArea.updateCurve();

        velocityGraphLineRight.point1.moveTo([t, 0.0], 0);
        velocityGraphLineRight.point2.moveTo([t, velocity(t)], 0);
        speedGraphLineRight.point1.moveTo([t, 0.0], 0);
        speedGraphLineRight.point2.moveTo([t, speed(t)], 0);
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
