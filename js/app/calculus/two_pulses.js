(function($, _, JXG, undefined) {
    'use strict';

    var boundingBox = [-0.25, 1.5, 11.0, -1.5],
        config = window.twoPulsesSettings || {
            forwardPulseWidth: 0.5,
            forwardPulseAmp: 0.5,
            backwardPulseWidth: 0.5,
            backwardPulseAmp: 0.5,
            c: 2.0
        },
        backwardPulseWidth = config.backwardPulseWidth,
        backwardPulseAmp = config.backwardPulseAmp,
        forwardPulseWidth = config.forwardPulseWidth,
        forwardPulseAmp = config.forwardPulseWidth,
        c = config.c,
        t = 0.0, tMin = 0.0, tMax = 5.0, tStep = 0.01,
        forwardWaveBoard, backwardWaveBoard,
        forwardWaveCurve, backwardWaveCurve,
        tSlider, tSliderValue, animateButton, backwardButton, forwardButton, animateIcon,
        isAnimating = false, anim;

    init();

    function init() {
        $(window).on('resize', resizeBox);
        $('#dnext-about-link').on('click', toggle);

        createForwardWaveBoard();
        createBackwardWaveBoard();
        createSlider();
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
        forwardWaveBoard.needsFullUpdate = true;
        forwardWaveBoard.resizeContainer(containerWidth, forwardWaveBoard.canvasHeight);
        forwardWaveBoard.setBoundingBox(boundingBox);
        forwardWaveBoard.update();
        backwardWaveBoard.needsFullUpdate = true;
        backwardWaveBoard.resizeContainer(containerWidth, backwardWaveBoard.canvasHeight);
        backwardWaveBoard.setBoundingBox(boundingBox);
        backwardWaveBoard.update();
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

    function forwardPulse(x) {
        return (0.0 <= x && x <= forwardPulseWidth) ? forwardPulseAmp : 0.0;
    }

    function backwardPulse(x) {
        return (10.0 <= x && x <= 10.0 + backwardPulseWidth) ? backwardPulseAmp : 0.0;
    }

    function forwardWave(x) {
        return forwardPulse(x - c*t);
    }

    function backwardWave(x) {
        return backwardPulse(x + c*t);
    }

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
    }

    function animate() {
        anim = requestAnimationFrame(animate);
        tSlider.slider('value', tSlider.slider('value') + tStep);
        if (tSlider.slider('value') === tMax) {
            stopAnimation();
        }
        updateAnimation();
    }

    function createForwardWaveBoard() {
        JXG.Options.text.fontSize = 14;

        forwardWaveBoard = JXG.JSXGraph.initBoard('forward-wave-board', {
            boundingbox: boundingBox,
            axis: true,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        forwardWaveCurve = forwardWaveBoard.create(
            'curve',
            [[], []],
            {strokeWidth: 2, strokeColor: 'blue', highlight: false}
        );
    }

    function createBackwardWaveBoard() {
        JXG.Options.text.fontSize = 14;

        backwardWaveBoard = JXG.JSXGraph.initBoard('backward-wave-board', {
            boundingbox: boundingBox,
            axis: true,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        backwardWaveCurve = backwardWaveBoard.create(
            'curve',
            [[], []],
            {strokeWidth: 2, strokeColor: 'blue', highlight: false}
        );
    }

    function updateGraphs() {
        var dataX = [], forwardWaveDataY = [], backwardWaveDataY = [], superpositionWaveDataY = [],
            x, xMin = -0.001, xMax = 11.0, xInc = 0.01;

        for (x = xMin; x <= xMax; x += xInc) {
            dataX.push(x);
            forwardWaveDataY.push(forwardWave(x));
            backwardWaveDataY.push(backwardWave(x));
        }

        forwardWaveCurve.dataX = dataX;
        forwardWaveCurve.dataY = forwardWaveDataY;

        backwardWaveCurve.dataX = dataX;
        backwardWaveCurve.dataY = backwardWaveDataY;

        forwardWaveBoard.update();
        backwardWaveBoard.update();
    }
})(jQuery, _, JXG);
