var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.TWO_BOARDS);
        //General Parameters for Macro
        JXG.Options.segment.strokeColor = 'gray';
        JXG.Options.text.fontSize = 15;

        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-3.0, 12, 12, -3.0],
            xname: 'Quantity<br>of Money',
            yname: 'Nominal<br>Interest<br>Rate',
            grid: true
        });

        ////////////
        // BOARD 2
        ////////////
        var brd2 = MacroLib.createBoard('jxgbox2', {
            bboxlimits: [-3.0, 12, 12, -3.0],
            xname: 'Quantity of Bonds<br>per Period',
            yname: 'Price of<br>Bonds',
            grid: true
        });

        //Sliders
        var slidery = brd1.create('slider', [
            [-2.5, 2],
            [-2.5, 8],
            [-1.5, 0, 1.5]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'orange'
        });

        //Positive Slider Transformation
        var sliderPositive = brd1.create('transform', [
            function() {
                return 0.0;
            },
            function() {
                return slidery.Value();
            }
        ], {
            type: 'translate'
        });

        //Negative Slider Transformation
        var sliderNegative = brd1.create('transform', [
            function() {
                return 0.0;
            },
            function() {
                return -slidery.Value();
            }
        ], {
            type: 'translate'
        });

        //Demand Board 1
        var S1 = brd1.create('segment', [
            [5.75, 1.0],
            [5.75, 11.0]
        ], {
            withLabel: true,
            name: 'M<sub>S</sub>',
            label: {
                offset: [-10, 112]
            }
        });

        //Supply Board 1 - with slider transformation
        var d1B1 = brd1.create('point', [2.0, 9.5], {
            visible: false
        });
        var d2B1 = brd1.create('point', [9.5, 2.0], {
            visible: false
        });
        var pD1 = brd1.create('point', [d1B1, [sliderPositive]], {
            visible: false
        });
        var pD2 = brd1.create('point', [d2B1, [sliderPositive]], {
            visible: false
        });

        var D1fixed = brd1.create('segment', [d1B1, d2B1], {
            withLabel: false,
            name: 'D<sub>1</sub>',
            dash: '1',
            strokeWidth: '3',
            label: {
                offset: [90, -90]
            }
        });

        var D1 = brd1.create('segment', [pD1, pD2], {
            withLabel: true,
            name: 'M<sub>D2</sub>',
            color: 'dodgerblue',
            label: {
                offset: [100, -70]
            }
        });

        //Intersection of SD board 1
        var iSDB = brd1.create('intersection', [S1, D1], {
            withLabel: false
        });

        brd1.addChild(brd2);

        //Demand Board 2 - with a Positive transformation
        var S2 = brd2.create('segment', [
            [2.0, 2.0],
            [9.5, 9.5]
        ], {
            withLabel: true,
            name: 'S<sub>2</sub>',
            label: {
                offset: [90, 90]
            }
        });

        //Supply Board 2 - with a Negative transformation
        var d1B2 = brd2.create('point', [2.0, 9.5], {
            visible: false
        });
        var d2B2 = brd2.create('point', [9.5, 2.0], {
            visible: false
        });
        var As = brd2.create('point', [d1B2, [sliderNegative]], {
            visible: false
        });
        var Bs = brd2.create('point', [d2B2, [sliderNegative]], {
            visible: false
        });

        var D2fixed = brd2.create('segment', [d1B2, d2B2], {
            withLabel: false,
            name: 'D<sub>1</sub>',
            dash: '1',
            strokeWidth: '3',
            label: {
                offset: [90, -90]
            }
        });

        var D2 = brd2.create('segment', [As, Bs], {
            withLabel: true,
            name: 'D<sub>2</sub>',
            color: 'dodgerblue',
            label: {
                offset: [100, -70]
            }
        });

        var iSDB2 = brd2.create('intersection', [S2, D2], {
            withLabel: false
        });

        //Dashed Lines - Board 1
        var dashB1fixed = MacroLib.createDashedLines2Axis(brd1, iSDB, {
            withLabel: false,
            color: 'gray'
        });
        var dashB1 = MacroLib.createDashedLines2Axis(brd1, iSDB, {
            fixed: false,
            withLabel: true,
            color: 'dodgerblue',
            xlabel: 'Q',
            ylabel: 'NIR<sub>2</sub>',
            xoffsets: [15, 25]
        });

        //Dashed Lines - Board 2
        var dashB2fixed = MacroLib.createDashedLines2Axis(brd2, iSDB2, {
            withLabel: false,
            color: 'gray'
        });
        var dashB2 = MacroLib.createDashedLines2Axis(brd2, iSDB2, {
            fixed: false,
            withLabel: true,
            color: 'dodgerblue',
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'P<sub>2</sub>',
            xoffsets: [15, 25]
        });

        //////////////////
        // Interactivity
        //////////////////
        slidery.on('drag', function() {
            //Moving 1st set of Dashed Lines in Board 1
            dashB1.Y1.moveTo([0, iSDB.Y()]);
            dashB1.Y2.moveTo([iSDB.X(), iSDB.Y()]);

            dashB1.X1.moveTo([iSDB.X(), 0]);
            dashB1.X2.moveTo([iSDB.X(), iSDB.Y()]);

            //Moving Board 2 Dashed Lines
            dashB2.Y1.moveTo([0, iSDB2.Y()]);
            dashB2.Y2.moveTo([iSDB2.X(), iSDB2.Y()]);

            dashB2.X1.moveTo([iSDB2.X(), 0]);
            dashB2.X2.moveTo([iSDB2.X(), iSDB2.Y()]);
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
