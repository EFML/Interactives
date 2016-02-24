// Used as JSInput
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

        // Positive Slider Transformations
        var xSliderTransform = board.create('transform', [
            function() {
                return slider.Value();
            },
            function() {
                return 0.0;
            }
        ], {
            type: 'translate'
        });

        var ySliderTransform = board.create('transform', [
            function() {
                return 0.0;
            },
            function() {
                return slider.Value();
            }
        ], {
            type: 'translate'
        });

        var radius = 8.0;
        var center = board.create('point', [-1, -1], {
            visible: false
        });
        var pxFixed = board.create('point', [radius, 0.0], {
            visible: false
        });
        var px = board.create('point', [pxFixed, xSliderTransform], {
            visible: false
        });
        var pyFixed = board.create('point', [0.0, radius], {
            visible: false
        });
        var py = board.create('point', [pyFixed, ySliderTransform], {
            visible: false
        });
        // Fixed curve
        var fixedCurve = board.create('arc', [center, pxFixed, pyFixed], {
            strokeWidth: 5,
            strokeColor: 'gray',
            ficed: true
        });
        // Moving curve
        var movingCurve = board.create('arc', [center, px, py], {
            strokeWidth: 5,
            strokeColor: 'dodgerblue',
            fixed: true
        });
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
