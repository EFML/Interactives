var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        var newBBox = [-3.0, 12, 12, -1.75];

        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: 'Capital Goods',
            yname: 'Consumer<br>Goods',
            grid: false,
            bboxlimits: newBBox
        });

        //Sliders
        var slidery = brd1.create('slider', [
            [-1.5, 2],
            [-1.5, 7],
            [3.0, 5.0, 7.0]
        ], {
            withLabel: false,
            snapWidth: 0.01,
            color: 'Crimson'
        });

        //Positive Slider Transformation
        var sliderYPositive = brd1.create('transform', [
            function() {
                return slidery.Value();
            },
            function() {
                return 0.0;
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
        // var px = brd1.create('point', [tmpx, [sliderRX]],{visible:false});
        var tmpy = brd1.create('point', [0.0, Radius], {
            visible: false
        });
        var semi = brd1.create('arc', [po, tmpx, tmpy], {
            strokeWidth: 5,
            strokeColor: 'DodgerBlue'
        });


        var hx = brd1.create('point', [0.0, function() {
            return slidery.Value();
        }], {
            visible: false
        });
        var hy = brd1.create('point', [10.0, function() {
            return slidery.Value();
        }], {
            visible: false
        });
        var hA = brd1.create('segment', [hx, hy], {
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
        brd1.on('drag', function() {
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
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
