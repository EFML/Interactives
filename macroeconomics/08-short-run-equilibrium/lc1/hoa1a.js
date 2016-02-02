var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.5, 12, 12, -1.2],
            xname: 'Real GDP',
            yname: 'Price<br>Level'
        });

        //Sliders
        var slidery = brd1.create('slider', [
            [-1.0, 2.75],
            [-1.0, 8.75],
            [0.0, 3.0, 3.0]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'Black'
        });

        //Positive Slider Transformation
        var sliderYPositive = brd1.create('transform', [
            function() {
                return 0.0;
            },
            function() {
                return slidery.Value();
            }
        ], {
            type: 'translate'
        });

        //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createLine(brd1, {
            'ltype': 'Supply',
            'name': 'AS<sub>0</sub>',
            color: 'DodgerBlue'
        });
        SRAS1.setAttribute({
            'fixed': true,
            'highlight': false
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            'ltype': 'Demand',
            'name': 'AD<sub>0</sub>',
            'color': 'Crimson'
        });
        AD1.setAttribute({
            'fixed': true,
            'highlight': false
        });

        //Demand Line 2 - moveable
        var H = MacroLib.createTransformLine(brd1, {
            'transformList': [sliderYPositive],
            'ltype': 'Horizontal',
            'name': 'H',
            'color': 'Orange'
        });
        H.setAttribute({
            'withLabel': false,
            'highlight': true,
            'visible': false
        });


        ////////////
        // Intersection Box 1
        ////////////
        var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {
            'visible': false
        });

        var iDonly = brd1.create('intersection', [H, AD1, 0], {
            'visible': true,
            withLabel: false,
            color: 'Red'
        });
        var iSonly = brd1.create('intersection', [H, SRAS1, 0], {
            'visible': true,
            withLabel: false,
            color: 'Blue'
        });


        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashesFixedB1 = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'RGDP<sub>0</sub>',
            ylabel: 'PL<sub>0</sub>',
            yoffsets: [5, 10],
            color: 'DarkGray'
        });


        ////////////
        // Dashes for Supply Only
        ////////////
        var dashesSonly = MacroLib.createDashedLines2Axis(brd1, iSonly, {
            withLabel: true,
            xlabel: 'AS<sup>*</sup>',
            xoffsets: [5, 15],
            ylabel: 'PL<sup>*</sup>',
            yoffsets: [5, 10],
            color: 'DodgerBlue'
        });

        dashesSonly.X1.setAttribute({
            label: {
                offset: [5, 15],
                strokeColor: 'blue'
            }
        });

        ////////////
        // Dashes for Demand Only
        ////////////
        var dashesDonly = MacroLib.createDashedLines2Axis(brd1, iDonly, {
            withLabel: true,
            xlabel: 'AD<sup>*</sup>',
            xoffsets: [5, 15],
            ylabel: '',
            yoffsets: [5, 10],
            color: 'Crimson'
        });

        dashesDonly.X1.setAttribute({
            label: {
                offset: [5, 15],
                strokeColor: 'red'
            }
        });


        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines for Supply
            dashesSonly.Y1.moveTo([0, iSonly.Y()]);
            dashesSonly.Y2.moveTo([iSonly.X(), iSonly.Y()]);

            dashesSonly.X1.moveTo([iSonly.X(), 0]);
            dashesSonly.X2.moveTo([iSonly.X(), iSonly.Y()]);

            //Moving Dashed Lines for Demand
            dashesDonly.Y1.moveTo([0, iDonly.Y()]);
            dashesDonly.Y2.moveTo([iDonly.X(), iDonly.Y()]);

            dashesDonly.X1.moveTo([iDonly.X(), 0]);
            dashesDonly.X2.moveTo([iDonly.X(), iDonly.Y()]);

        });

        brd1.on('mousedown', function() {
            dashesSonly.Y1.setAttribute({
                withLabel: true
            });
            dashesSonly.X1.setAttribute({
                withLabel: true
            });
            dashesDonly.Y1.setAttribute({
                withLabel: true
            });
            dashesDonly.X1.setAttribute({
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
