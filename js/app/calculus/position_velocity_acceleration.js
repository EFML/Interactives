var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var posBoundingBox = [-0.5, 1.5, 3.2, -1.5],
        velBoundingBox = [-0.5, 14.0, 3.2, -14.0],
        accBoundingBox = [-0.5, 140, 3.2, -140.0],
        t = 0.0, tMin = 0.0, tMax = 3.0, tStep = 0.05, precision = 2,
        posBoard, velBoard, accBoard,
        posPoint, posLine, velPoint, velLine, accPoint, accLine,
        tSlider, tSliderValue, animateButton, backwardButton, forwardButton, animateIcon,
        isAnimating = false, anim;

    init();

    function init() {
        $(window).on('resize', resizeBox);
        $('#dnext-about-link').on('click', toggle);

        createPosBoard();
        createVelBoard();
        createAccBoard();
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
        posBoard.needsFullUpdate = true;
        posBoard.resizeContainer(containerWidth, posBoard.canvasHeight);
        posBoard.setBoundingBox(posBoundingBox);
        posBoard.update();
        velBoard.needsFullUpdate = true;
        velBoard.resizeContainer(containerWidth, velBoard.canvasHeight);
        velBoard.setBoundingBox(velBoundingBox);
        velBoard.update();
        accBoard.needsFullUpdate = true;
        accBoard.resizeContainer(containerWidth, velBoard.canvasHeight);
        accBoard.setBoundingBox(accBoundingBox);
        accBoard.update();
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
        tSlider.slider('value', tSlider.slider('value') - tStep);
        updateAnimation();
    }

    function forwardButtonHandler(event) {
        tSlider.slider('value', tSlider.slider('value') + tStep);
        updateAnimation();
    }

    function outputDynamicMath() {
        katex.render('x = ' + position(t).toFixed(precision), $('#math-line1').get(0));
        katex.render('v = \\frac{dx}{dt} = ' + velocity(t).toFixed(precision), $('#math-line2').get(0));
        katex.render('a = \\frac{d^2x}{dt^2} = ' + acceleration(t).toFixed(precision), $('#math-line3').get(0));
    }

    function position(t) {
        return Math.sin(t*t);
    }

    function velocity(t) {
        return 2.0*t*Math.cos(t*t);
    }

    function acceleration(t) {
        var tSquared = t*t;

        return 2.0*Math.cos(tSquared) - 4.0*tSquared*Math.sin(tSquared);
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
        posBoard.update();
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

    function createPosBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;

        JXG.Options.text.fontSize = 14;

        posBoard = JXG.JSXGraph.initBoard('position-board', {
            boundingbox: posBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        xAxis = posBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });

        yAxis = posBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = Math.abs(posBoundingBox[2] - posBoundingBox[0]) / 100.0;
        yOffset1 = Math.abs(posBoundingBox[3] - posBoundingBox[1]) / 10.0; // Different than in other
        xOffset2 = Math.abs(posBoundingBox[2] - posBoundingBox[0]) / 25.0; // Different than in other applications
        yOffset2 = Math.abs(posBoundingBox[3] - posBoundingBox[1]) / 25.0; // Different than in other applications

        xAxisLabel = posBoard.create('text', [posBoundingBox[2] - xOffset1, yOffset1, 't (s)'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = posBoard.create('text', [xOffset2, posBoundingBox[1] - yOffset2, 'x (ft)'], {
            anchorX: 'left',
            fixed:true
        });

        posBoard.create(
            'functiongraph',
            [position, 0.0, 10.0],
            {strokeWidth: 2, strokeColor: 'green', highlight: false}
        );

        posPoint = posBoard.create('point', [t, position(t)], {
            fixed: true,
            name: '',
            size: 2,
            strokeColor: 'green',
            fillColor: 'green'
        });

        posLine = posBoard.create('line', [[t, 0.0], [t, position(t)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: 'black',
            strokeOpacity: 0.4,
            highlight: false
        });
    }

    function createVelBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;

        JXG.Options.text.fontSize = 14;

        velBoard = JXG.JSXGraph.initBoard('velocity-board', {
            boundingbox: velBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        xAxis = velBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });

        yAxis = velBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = Math.abs(velBoundingBox[2] - velBoundingBox[0]) / 100.0;
        yOffset1 = Math.abs(velBoundingBox[3] - velBoundingBox[1]) / 10.0; // Different than in other
        xOffset2 = Math.abs(velBoundingBox[2] - velBoundingBox[0]) / 25.0; // Different than in other applications
        yOffset2 = Math.abs(velBoundingBox[3] - velBoundingBox[1]) / 25.0; // Different than in other applications

        xAxisLabel = velBoard.create('text', [velBoundingBox[2] - xOffset1, yOffset1, 't (s)'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = velBoard.create('text', [xOffset2, velBoundingBox[1] - yOffset2, 'v (ft/s)'], {
            anchorX: 'left',
            fixed:true
        });

        velBoard.create(
            'functiongraph',
            [velocity, 0.0, 10.0],
            {strokeWidth: 2, strokeColor: 'blue', highlight: false}
        );

        velPoint = velBoard.create('point', [t, velocity(t)], {
            fixed: true,
            name: '',
            size: 2,
            strokeColor: 'blue',
            fillColor: 'blue'
        });

        velLine = velBoard.create('line', [[t, 0.0], [t, velocity(t)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: 'black',
            strokeOpacity: 0.4,
            highlight: false
        });
    }

    function createAccBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;

        JXG.Options.text.fontSize = 14;

        accBoard = JXG.JSXGraph.initBoard('acceleration-board', {
            boundingbox: accBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        xAxis = accBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });

        yAxis = accBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = Math.abs(accBoundingBox[2] - accBoundingBox[0]) / 100.0;
        yOffset1 = Math.abs(accBoundingBox[3] - accBoundingBox[1]) / 10.0; // Different than in other
        xOffset2 = Math.abs(accBoundingBox[2] - accBoundingBox[0]) / 25.0; // Different than in other applications
        yOffset2 = Math.abs(accBoundingBox[3] - accBoundingBox[1]) / 25.0; // Different than in other applications

        xAxisLabel = accBoard.create('text', [accBoundingBox[2] - xOffset1, yOffset1, 't (s)'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = accBoard.create('text', [xOffset2, accBoundingBox[1] - yOffset2, 'a (ft/s^2)'], {
            anchorX: 'left',
            fixed:true
        });

        accBoard.create(
            'functiongraph',
            [acceleration, 0.0, 10.0],
            {strokeWidth: 2, strokeColor: 'red', highlight: false}
        );

        accPoint = accBoard.create('point', [t, acceleration(t)], {
            fixed: true,
            name: '',
            size: 2,
            strokeColor: 'red',
            fillColor: 'red'
        });

        accLine = accBoard.create('line', [[t, 0.0], [t, acceleration(t)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: 'black',
            strokeOpacity: 0.4,
            highlight: false
        });
    }

    function updateGraphs() {
        posPoint.setPosition(JXG.COORDS_BY_USER, [t, position(t)]);
        posLine.point1.moveTo([t, 0.0], 0);
        posLine.point2.moveTo([t, position(t)], 0);
        velPoint.setPosition(JXG.COORDS_BY_USER, [t, velocity(t)]);
        velLine.point1.moveTo([t, 0.0], 0);
        velLine.point2.moveTo([t, velocity(t)], 0);
        accPoint.setPosition(JXG.COORDS_BY_USER, [t, acceleration(t)]);
        accLine.point1.moveTo([t, 0.0], 0);
        accLine.point2.moveTo([t, acceleration(t)], 0);
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
