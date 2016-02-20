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

        // Positive Slider Transformations
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

        var ySliderTransform = board.create('transform', [
            function() {
                return 0.0;
            },
            function() {
                return xSlider.Value();
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
        // Bezier curve control points
        // var pControl1 = board.create('point', [0.73*radius, 0.73*radius], {visible: false});
        // var pControl2 = board.create('point', [0.73*radius, 0.73*radius], {visible: false});

        // // Fixed curve
        // var curve1 = board.create(
        //     'curve',
        //     JXG.Math.Numerics.bezier([pxFixed, pControl1, pControl2, pyFixed]),
        //     {
        //         strokeColor: 'gray',
        //         strokeWidth: 5,
        //         fixed: true
        //     }
        // );

        // // Moveable curve
        // var curve2 = board.create(
        //     'curve',
        //     JXG.Math.Numerics.bezier([px, pControl1, pControl2, py]),
        //     {
        //         strokeColor: 'dodgerblue',
        //         strokeWidth: 5,
        //         fixed: true
        //     }
        // );
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
