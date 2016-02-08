var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        var newBBox = [-1.5, 12, 12, -1.75];

        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: 'Real GDP',
            yname: 'Price<br>Level',
            grid: false,
            xpos: [8, -0.5],
            ypos: [-1.25, 10],
            bboxlimits: newBBox
        });

        //Sliders
        var sliderx = brd1.create('slider', [
            [3.25, -1.2],
            [8.25, -1.2],
            [-2.0, 0, 2.0]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'DarkGray'
        });

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

        // //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'SRAS',
            color: 'DodgerBlue'
        });
        SRAS1.setAttribute({
            fixed: true,
            highlight: false
        });

        //LRAS 1 - fixed
        var LRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Vertical',
            name: 'LRAS<sub>1</sub>',
            color: 'DarkGray'
        });
        LRAS1.setAttribute({
            dash: 1,
            fixed: true,
            highlight: true
        });
        LRAS1.setAttribute({
            label: {
                'offset': [20, 0]
            }
        });

        //LRAS 2 - moveable
        var LRAS2 = MacroLib.createTransformLine(brd1, {
            transformList: [sliderXPositive],
            ltype: 'Vertical',
            name: 'LRAS<sub>2</sub>',
            color: 'DarkGray'
        });
        LRAS2.setAttribute({
            fixed: false,
            highlight: false,
            withLabel: false
        });

        // ////////////
        // // Intersection Box 1
        // ////////////
        var iSDfix = brd1.create('intersection', [LRAS1, SRAS1, 0], {
            visible: false
        });
        var iS2D = brd1.create('intersection', [LRAS2, SRAS1, 0], {
            visible: false
        });

        ////////////
        // Draggable Dashed Lines for Board 1
        ////////////
        var dashS2 = MacroLib.createDashedLines2Axis(brd1, iS2D, {
            fixed: false,
            withLabel: false,
            xlabel: 'Y<sub>2</sub>',
            ylabel: 'PL<sub>2</sub>',
            color: 'DarkGray'
        });

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashesFixedB1 = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'Y<sub>1</sub>',
            ylabel: 'PL<sub>1</sub>',
            color: 'DodgerBlue'
        });

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines in Board 1
            dashS2.Y1.moveTo([0, iS2D.Y()]);
            dashS2.Y2.moveTo([iS2D.X(), iS2D.Y()]);

            dashS2.X1.moveTo([iS2D.X(), 0]);
            dashS2.X2.moveTo([iS2D.X(), iS2D.Y()]);

        });

        brd1.on('mousedown', function() {
            LRAS2.setAttribute({
                withLabel: true
            });
            dashS2.X1.setAttribute({
                withLabel: true
            });
            dashS2.Y1.setAttribute({
                withLabel: true
            });
            brd1.update();
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
