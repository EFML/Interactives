var Macro = (function(JXG, MacroLib) {
    'use strict';
    var board, xSlider, ySlider;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        board = MacroLib.createBoard('jxgbox1', {
            xname: 'Consumer<br>Goods',
            yname: 'Capital<br>Goods',
            bboxlimits: [-2, 12, 12, -2]
        });

        // xSlider
        xSlider = board.create('slider', [
            [2.5, -1.2],
            [7.5, -1.2],
            [-2.0, 0.0, 2.0]
        ], {
            withLabel: false,
            color: 'dodgerblue'
        });

        // xSlider Transformation
        var xSliderTransform = board.create('transform', [
            function() {
                return xSlider.Value();
            },
            function() {
                return 0.0;
            }
        ], {
            type: 'translate'
        });

        // ySlider
        ySlider = board.create('slider', [
            [-1.2, 2.5],
            [-1.2, 7.5],
            [-2.0, 0.0, 2.0]
        ], {
            withLabel: false,
            color: 'dodgerblue'
        });

        // ySlider Transformation
        var ySliderTransform = board.create('transform', [
            function() {
                return 0.0;
            },
            function() {
                return ySlider.Value();
            }
        ], {
            type: 'translate'
        });


        var radius = 8.0;
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
        // Bezier curve control points
        var pControl1 = board.create('point', [0.73*radius, 0.73*radius], {visible: false});
        var pControl2 = board.create('point', [0.73*radius, 0.73*radius], {visible: false});

        // Fixed curve
        var fixedCurve = board.create(
            'curve',
            JXG.Math.Numerics.bezier([pxFixed, pControl1, pControl2, pyFixed]),
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

        if (state.xSliderValue) {
            if (state.xSliderValue !== 0.0) {
                normVal = normalizeSliderValue(xSlider, state.xSliderValue);
                val = xSlider.point1.X() + normVal*(xSlider.point2.X() - xSlider.point1.X());
                xSlider.moveTo([val, 0], 0);
            }
        }
        if (state.ySliderValue) {
            if (state.ySliderValue !== 0.0) {
                normVal = normalizeSliderValue(ySlider, state.ySliderValue);
                val = ySlider.point1.Y() + normVal*(ySlider.point2.Y() - ySlider.point1.Y());
                ySlider.moveTo([0, val], 0);
            }
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            xSliderValue: xSlider.Value(),
            ySliderValue: ySlider.Value()
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
