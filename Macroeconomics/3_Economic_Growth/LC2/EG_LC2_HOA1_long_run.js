var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        var newBBox = [-2.2, 12, 12, -1.75];

        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: 'Capital Goods',
            yname: 'Consumer<br>Goods',
            grid: false,
            'xpos': [8, -0.5],
            'ypos': [-2.1, 10],
            bboxlimits: newBBox
        });

        //Sliders
        var sliderx = brd1.create('slider', [
            [2.5, -1.2],
            [7.5, -1.2],
            [-2.0, 0.0, 2.0]
        ], {
            withLabel: false,
            snapWidth: 0.01,
            color: 'DodgerBlue'
        });

        //Sliders
        //Positive Slider Transformation
        var sliderXPositive = brd1.create('transform', [
            function() {
                return sliderx.Value();
            },
            function() {
                return 0.0;
            }
        ], {
            type: 'translate'
        });

        var sliderRX = brd1.create('transform', [
            function() {
                return sliderx.Value();
            },
            function() {
                return 0.0;
            }
        ], {
            type: 'translate'
        });

        var sliderRY = brd1.create('transform', [
            function() {
                return 0.0;
            },
            function() {
                return sliderx.Value();
            }
        ], {
            type: 'translate'
        });

        // Create an arc out of three free points
        var Radius = 8.0;
        var po = brd1.create('point', [-1, -1], {
            visible: false
        });
        var tmpx = brd1.create('point', [Radius, 0.0], {
            visible: false
        });
        var px = brd1.create('point', [tmpx, [sliderRX]], {
            visible: false
        });
        var tmpy = brd1.create('point', [0.0, Radius], {
            visible: false
        });
        var py = brd1.create('point', [tmpy, [sliderRY]], {
            visible: false
        });

        var semifix = brd1.create('arc', [po, tmpx, tmpy], {
            strokeWidth: 4,
            strokeColor: 'Gray',
            highlight: false,
            dash: 1
        });
        var semi = brd1.create('arc', [po, px, py], {
            strokeWidth: 5,
            strokeColor: 'DodgerBlue',
            highlight: false
        });

        var hA = brd1.create('segment', [
            [0.0, 5.5],
            [10.0, 5.5]
        ], {
            visible: false
        });
        var iA = brd1.create('intersection', [hA, semi], {
            name: 'A'
        });

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashA = MacroLib.createDashedLines2Axis(brd1, iA, {
            fixed: true,
            withLabel: true,
            xlabel: 'K<sub>A</sub>',
            ylabel: 'C<sub>A</sub>',
            color: 'Gray'
        });

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines in Board 1

            dashA.Y1.moveTo([0, iA.Y()]);
            dashA.Y2.moveTo([iA.X(), iA.Y()]);

            dashA.X1.moveTo([iA.X(), 0]);
            dashA.X2.moveTo([iA.X(), iA.Y()]);

        });
    }

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    init();

})(JXG, MacroLib, undefined);
