var Macro = (function(JXG, MacroLib) {
    'use strict';
    var board, slider;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        board = MacroLib.createBoard('jxgbox1', {
            xname: 'Consumer<br>Goods',
            yname: 'Capital<br>Goods',
            bboxlimits: [-2, 12, 12, -2]
        });

        // Slider
        slider = board.create('slider', [
            [2.5, -1.2],
            [7.5, -1.2],
            [-2.0, 0.0, 2.0]
        ], {
            withLabel: false,
            color: 'dodgerblue'
        });

        // Positive Slider Transformation
        var sliderTransform = board.create('transform', [
            function() {
                return slider.Value();
            },
            function() {
                return 0.0;
            }
        ], {
            type: 'translate'
        });

        var radius = 8.0;
        var pxFixed = board.create('point', [radius, 0.0], {
            visible: false
        });
        var px = board.create('point', [pxFixed, sliderTransform], {
            visible: false
        });
        var py = board.create('point', [0.0, radius], {
            visible: false
        });
        // Bezier curve control points
        var pControl1 = board.create('point', [0.73*radius, 0.73*radius], {visible: false});
        var pControl2 = board.create('point', [0.73*radius, 0.73*radius], {visible: false});

        // Fixed curve
        var fixedCurve = board.create(
            'curve',
            JXG.Math.Numerics.bezier([pxFixed, pControl1, pControl2, py]),
            {
                strokeColor: 'gray',
                strokeWidth: 5,
                fixed: true
            }
        );

        // Moving curve
        var movingCurve = board.create(
            'curve',
            JXG.Math.Numerics.bezier([px, pControl1, pControl2, py]),
            {
                strokeColor: 'dodgerblue',
                strokeWidth: 5,
                fixed: true
            }
        );
    }

    // Map the slider values in [slider._smin, slider._smax] to [0, 1]
    // This is used to set the slider value directly via the glider.
    function normalizeSliderValue(slider, value) {
        return (value - slider._smin) / (slider._smax - slider._smin);
    }

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    init();

    // Standard edX JSinput functions
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr), normVal, val;

        if (state.sliderValue) {
            if (state.sliderValue !== 0.0) {
                normVal = normalizeSliderValue(slider, state.sliderValue);
                val = slider.point1.X() + normVal*(slider.point2.X() - slider.point1.X());
                slider.moveTo([val, 0], 0);
            }
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            sliderValue: slider.Value()
        };
        console.info('State successfully saved.');
        return JSON.stringify(state);
    }

    function getGrade() {
        return getState();
    }

    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade: getGrade
    };

})(JXG, MacroLib, undefined);
