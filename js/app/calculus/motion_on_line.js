var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var animBoundingBox = [-2.0, 5.0, 25.0, -5.0], graphBoundingBox = [-1.0, 22, 9.0, -3.0],
        t = 0.0, tMin = 0.0, tMax = 8.0, tStep = 0.02, xs = 0.0, precision = 2,
        animBoard, graphBoard, tSlider, tSliderValue, animateButton, backwardButton, forwardButton, animateIcon,
        isAnimating = false, anim,
        sPointLeft, sPointRight, sLine;

    init();

    function init() {
        $(window).on('resize', resizeBox);
        $(document).on('click', stopAnimation)
        $('#dnext-about-link').on('click', toggle);

        createAnimBoard();
        createGraphBoard();
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
        var animBoardWidth = $('.container').width();
        animBoard.needsFullUpdate = true;
        animBoard.resizeContainer(animBoardWidth, animBoard.canvasHeight);
        animBoard.setBoundingBox(animBoundingBox);
        animBoard.update();
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
        katex.render('y = s(t) = ' + position(t).toFixed(precision), $('#math-line1').get(0));
    }

    function position(t) {
        if (t < 1.0) {
            return 10.0*t;
        }
        else if (t < 3.0) {
            return 10.0;
        }
        else if (t < 5.0) {
            return 5.0*t - 5.0;
        }
        else if (t < 6.0) {
            return 20.0;
        }
        else {
            return -10.0*t + 80.0;
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
        animBoard.update();
        graphBoard.update();
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
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;
        animBoard = JXG.JSXGraph.initBoard('anim-board', {
            boundingbox: animBoundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false,
            grid: false
        });

        xAxis = animBoard.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false,
        });
        xAxis.removeAllTicks();
        animBoard.create('ticks', [xAxis, [0.0, 5.0, 10.0, 15.0, 20]], {
            strokeColor:'#ccc',
            majorHeight: 10,
            drawLabels: true,
            label: {offset: [5, -15]},
            labels: ['0', '5', '10', '15', '20'],
            minorTicks: 5,
            drawZero: false
        });

        sPointLeft = animBoard.create('point', [position(t), 0.0], {
            fixed: true,
            name: '',
            size: 2,
            strokeColor: "red",
            fillColor: "red"
        });
    }

    function createGraphBoard() {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;
        graphBoard = JXG.JSXGraph.initBoard('graph-board', {
            boundingbox: graphBoundingBox,
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
        xAxis.removeAllTicks();
        graphBoard.create('ticks', [xAxis, [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]], {
            strokeColor:'#ccc',
            majorHeight: 10,
            drawLabels: true,
            label: {offset: [5, -15]},
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
            minorTicks: 5,
            drawZero: false
        });

        yAxis = graphBoard.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = Math.abs(graphBoundingBox[2] - graphBoundingBox[0]) / 100.0;
        yOffset1 = Math.abs(graphBoundingBox[3] - graphBoundingBox[1]) / 25.0;
        xOffset2 = Math.abs(graphBoundingBox[2] - graphBoundingBox[0]) / 50.0;
        yOffset2 = Math.abs(graphBoundingBox[3] - graphBoundingBox[1]) / 25.0; // Different than in other applications

        xAxisLabel = graphBoard.create('text', [graphBoundingBox[2] - xOffset1, yOffset1, 't (s)'], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = graphBoard.create('text', [xOffset2, graphBoundingBox[1] - yOffset2, 's (ft)'], {
            anchorX: 'left',
            fixed:true
        });

        graphBoard.create(
            'curve',
            [[0.0, 1.0, 3.0, 5.0, 6.0, 8.0], [0.0, 10.0, 10.0, 20.0, 20.0, 0.0]],
            {strokeWidth: 2, strokeColor: 'blue', highlight: false}
        );

        sPointRight = graphBoard.create('point', [t, position(t)], {
            fixed: true,
            name: '',
            size: 2,
            strokeColor: "red",
            fillColor: "red"
        });

        sLine = graphBoard.create('line', [[t, 0.0], [t, position(t)]], {
            fixed: true,
            straightFirst:false,
            straightLast:false,
            strokeWidth: 2,
            strokeColor: '#cccccc',
            highlight: false
        });
    }

    function updateGraphs() {
        sPointLeft.setPosition(JXG.COORDS_BY_USER, [position(t), 0.0]);
        sPointRight.setPosition(JXG.COORDS_BY_USER, [t, position(t)]);
        sLine.point1.moveTo([t, 0.0], 0);
        sLine.point2.moveTo([t, position(t)], 0);
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
