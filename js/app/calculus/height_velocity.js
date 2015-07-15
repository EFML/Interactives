var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var animBoundingBox = [-2.0, 12.0, 2.0, -12.0], heightGraphBoundingBox = [-1.0, 12, 11.0, -12.0],
        t = 0.0, tMin = 0.0, tMax = 10.0, tStep = 0.1, v0 = 4.0, a = 1.0, precision = 2,
        animBoard, heightGraphBoard, velocityGraphBoard, tSlider, tSliderValue, animateButton, backwardButton, forwardButton, animateIcon,
        isAnimating = false, anim,
        animPoint, heightGraphPoint, heightGraphLine, velocityGraphPoint, velocityGraphLine;

    init();

    function init() {
        $(window).on('resize', resizeBox);
        $(document).on('click', stopAnimation)
        $('#dnext-about-link').on('click', toggle);

        createAnimBoard();
        createHeightGraphBoard();
        createVelocityGraphBoard();
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
        animBoard.needsFullUpdate = true;
        animBoard.resizeContainer(0.19*containerWidth, animBoard.canvasHeight);
        animBoard.setBoundingBox(animBoundingBox);
        animBoard.update();
        heightGraphBoard.needsFullUpdate = true;
        heightGraphBoard.resizeContainer(0.79*containerWidth, heightGraphBoard.canvasHeight);
        heightGraphBoard.setBoundingBox(heightGraphBoundingBox);
        heightGraphBoard.update();
        velocityGraphBoard.needsFullUpdate = true;
        velocityGraphBoard.resizeContainer(0.79*containerWidth, velocityGraphBoard.canvasHeight);
        velocityGraphBoard.setBoundingBox(heightGraphBoundingBox);
        velocityGraphBoard.update();
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
                animBoard.update();
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
        katex.render('h(t) = ' + height(t).toFixed(precision), $('#math-line1').get(0));
        katex.render('v(t) = ' + velocity(t).toFixed(precision), $('#math-line2').get(0));
    }

    function height(t) {
        return v0*t -0.5*a*t*t;
    }

    function velocity(t) {
        return v0 - a*t;
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
        animBoard.update();
        heightGraphBoard.update();
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

    function createAnimBoard() {
        var yAxis, yAxisLabel, xOffset, yOffset;

        JXG.Options.text.fontSize = 14;

        animBoard = JXG.JSXGraph.initBoard('anim-board', {
            boundingbox: animBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        yAxis = animBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });
        yAxis.removeAllTicks();
        animBoard.create('ticks', [yAxis, [-10.0, -5.0, 0.0, 5.0, 10.0]], {
            strokeColor:'#ccc',
            majorHeight: 10,
            drawLabels: true,
            label: {offset: [5, -9]},
            labels: ['-10', '-5', '0', '5', '10'],
            minorTicks: 5,
            drawZero: false
        });

        xOffset = 3.0*(Math.abs(animBoundingBox[2] - animBoundingBox[0])) / 50.0; // Different than in other applications
        yOffset = Math.abs(animBoundingBox[3] - animBoundingBox[1]) / 25.0; // Different than in other applications

        yAxisLabel = animBoard.create('text', [xOffset, animBoundingBox[1] - yOffset, 'h'], {
            anchorX: 'left',
            fixed:true
        });

        animPoint = animBoard.create('point', [height(t), 0.0], {
            fixed: true,
            name: '',
            size: 2,
            strokeColor: "red",
            fillColor: "red"
        });
    }

    function createHeightGraphBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;

        JXG.Options.text.fontSize = 14;

        heightGraphBoard = JXG.JSXGraph.initBoard('height-graph-board', {
            boundingbox: heightGraphBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: true
        });

        xAxis = heightGraphBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });
        xAxis.removeAllTicks();
        heightGraphBoard.create('ticks', [xAxis, [0.0, 2.0, 4.0, 6.0, 8.0, 10.0]], {
            strokeColor:'#ccc',
            majorHeight: 10,
            drawLabels: true,
            label: {offset: [5, -15]},
            labels: ['0', '2', '4', '6', '8', '10'],
            minorTicks: 5,
            drawZero: false
        });

        yAxis = heightGraphBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = Math.abs(heightGraphBoundingBox[2] - heightGraphBoundingBox[0]) / 100.0;
        yOffset1 = Math.abs(heightGraphBoundingBox[3] - heightGraphBoundingBox[1]) / 25.0;
        xOffset2 = Math.abs(heightGraphBoundingBox[2] - heightGraphBoundingBox[0]) / 50.0;
        yOffset2 = Math.abs(heightGraphBoundingBox[3] - heightGraphBoundingBox[1]) / 25.0; // Different than in other applications

        xAxisLabel = heightGraphBoard.create('text', [heightGraphBoundingBox[2] - xOffset1, yOffset1, 't (s)'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = heightGraphBoard.create('text', [xOffset2, heightGraphBoundingBox[1] - yOffset2, 'h (ft)'], {
            anchorX: 'left',
            fixed:true
        });

        heightGraphBoard.create(
            'functiongraph',
            [height, 0.0, 10.0],
            {strokeWidth: 2, strokeColor: 'green', highlight: false}
        );

        heightGraphPoint = heightGraphBoard.create('point', [t, height(t)], {
            fixed: true,
            name: '',
            size: 2,
            strokeColor: "red",
            fillColor: "red"
        });

        heightGraphLine = heightGraphBoard.create('line', [[t, 0.0], [t, height(t)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: '#cccccc',
            highlight: false
        });
    }

    function createVelocityGraphBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;

        JXG.Options.text.fontSize = 14;

        velocityGraphBoard = JXG.JSXGraph.initBoard('velocity-graph-board', {
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
        yAxisLabel = velocityGraphBoard.create('text', [xOffset2, heightGraphBoundingBox[1] - yOffset2, 'v (ft/s)'], {
            anchorX: 'left',
            fixed:true
        });

        velocityGraphBoard.create(
            'functiongraph',
            [velocity, 0.0, 10.0],
            {strokeWidth: 2, strokeColor: 'blue', highlight: false}
        );

        velocityGraphPoint = velocityGraphBoard.create('point', [t, velocity(t)], {
            fixed: true,
            name: '',
            size: 2,
            strokeColor: "red",
            fillColor: "red"
        });

        velocityGraphLine = velocityGraphBoard.create('line', [[t, 0.0], [t, velocity(t)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: '#cccccc',
            highlight: false
        });
    }

    function updateGraphs() {
        animPoint.setPosition(JXG.COORDS_BY_USER, [0.0, height(t)]);
        heightGraphPoint.setPosition(JXG.COORDS_BY_USER, [t, height(t)]);
        heightGraphLine.point1.moveTo([t, 0.0], 0);
        heightGraphLine.point2.moveTo([t, height(t)], 0);
        velocityGraphPoint.setPosition(JXG.COORDS_BY_USER, [t, velocity(t)]);
        velocityGraphLine.point1.moveTo([t, 0.0], 0);
        velocityGraphLine.point2.moveTo([t, velocity(t)], 0);
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
