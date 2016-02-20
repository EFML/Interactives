var Macro = (function(JXG, MacroLib) {
    'use strict';
    var board;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        board = MacroLib.createBoard('jxgbox1', {
            xname: 'Consumer<br>Goods',
            yname: 'Capital<br>Goods',
            bboxlimits: [-2, 12, 12, -2]
        });

        // Slider
        var xSlider = board.create('slider', [
            [2.5, -1.2],
            [7.5, -1.2],
            [-2.0, 0.0, 2.0]
        ], {
            withLabel: false,
            color: 'DodgerBlue'
        });

        // Positive Slider Transformation
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

        var radius = 8.0;
        var pxFixed = board.create('point', [radius, 0.0], {
            visible: false
        });
        var px = board.create('point', [pxFixed, xSliderTransform], {
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

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
