var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////

        var newBBox = [-1.5, 12, 12, -2.5];

        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: 'Q of US Dollars',
            yname: '&pound;/$',
            grid: false,
            'xpos': [8, -0.5],
            bboxlimits: newBBox
        });

        //Sliders
        var sliderx1 = brd1.create('slider', [
            [3.5, -1.2],
            [8.5, -1.2],
            [-2.0, 0, 0.0]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'DodgerBlue'
        });

        //Sliders
        var sliderx2 = brd1.create('slider', [
            [3.5, -2.0],
            [8.5, -2.0],
            [0.0, 0, 2.0]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'Orange'
        });

        //Positive Slider Transformation
        var sliderX1Positive = brd1.create('transform', [
            function() {
                return sliderx1.Value();
            },
            function() {
                return 0.0;
            }
        ], {
            type: 'translate'
        });

        var sliderX2Positive = brd1.create('transform', [
            function() {
                return sliderx2.Value();
            },
            function() {
                return 0.0;
            }
        ], {
            type: 'translate'
        });


        //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: '$S<sub>1</sub>',
            color: 'DodgerBlue'
        });
        SRAS1.setAttribute({
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        //Supply Line 2 - moveable
        var SRAS2 = MacroLib.createTransformLine(brd1, {
            'transformList': [sliderX1Positive],
            ltype: 'Supply',
            name: '$S<sub>2</sub>',
            color: 'DodgerBlue'
        });
        SRAS2.setAttribute({
            fixed: false,
            'highlight': false,
            withLabel: false
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: '$D<sub>1</sub>',
            color: 'Orange'
        });
        AD1.setAttribute({
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        //Demand Line 2 - moveable
        var AD2 = MacroLib.createTransformLine(brd1, {
            'transformList': [sliderX2Positive],
            ltype: 'Demand',
            name: '$D<sub>2</sub>',
            color: 'Orange'
        });
        AD2.setAttribute({
            fixed: false,
            'highlight': false,
            withLabel: false
        });


        ////////////
        // Intersection Box 1
        ////////////
        var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {
            visible: false
        });
        var iS2D = brd1.create('intersection', [AD2, SRAS2, 0], {
            visible: false
        });

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashesFixedB1 = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: '(&euro;/$)<sub>1</sub>',
            yoffsets: [-45, 0],
            color: 'DodgerBlue'
        });

        ////////////
        // Draggable Dashed Lines for Board 1
        ////////////
        var dashS2 = MacroLib.createDashedLines2Axis(brd1, iS2D, {
            fixed: false,
            withLabel: false,
            xlabel: 'Q<sub>2</sub>',
            ylabel: '(&euro;/$)<sub>2</sub>',
            yoffsets: [-45, 0],
            color: 'Orange'
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
            AD2.setAttribute({
                withLabel: true
            });
            SRAS2.setAttribute({
                withLabel: true
            });
            dashS2.Y1.setAttribute({
                withLabel: true
            });
            dashS2.X1.setAttribute({
                withLabel: true
            });
            brd1.update();
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
