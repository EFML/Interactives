var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.5, 12, 12, -1.5],
            xname: 'Real GDP',
            yname: 'Price<br>Level',
            grid: false
        });

        //Sliders
        var sliderx = brd1.create('slider', [
            [8.0, -1.0],
            [8, -1.0],
            [-1.4, -1.4, -1.39]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'White'
        });
        var slidery = brd1.create('slider', [
            [-1.0, 2.75],
            [-1.0, 8.75],
            [0.0, 0.0, 1.4]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'Crimson'
        });

        //Positive Slider Transformation
        var sliderXPositive = brd1.create('transform', [
            function() {
                return sliderx.Value();
            },
            function() {
                return -sliderx.Value();
            }
        ], {
            type: 'translate'
        });

        var sliderYPositive = brd1.create('transform', [
            function() {
                return slidery.Value();
            },
            function() {
                return slidery.Value();
            }
        ], {
            type: 'translate'
        });


        //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'AS<sub>1973</sub>',
            color: 'DodgerBlue'
        });
        SRAS1.setAttribute({
            dash: 1,
            fixed: true,
            highlight: false
        });

        //Demand Line 2 - moveable
        var SRAS2 = MacroLib.createTransformLine(brd1, {
            transformList: [sliderXPositive],
            ltype: 'Supply',
            name: 'AS<sub>1975</sub>',
            color: 'DodgerBlue'
        });
        SRAS2.setAttribute({
            withLabel: false,
            highlight: true,
            visible: true
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'AD',
            color: 'Crimson'
        });
        AD1.setAttribute({
            fixed: true,
            highlight: false
        });

        //Fake line for intersection at equilibrium
        var H1 = MacroLib.createLine(brd1, {
            ltype: 'Horizontal',
            name: 'H',
            color: 'Orange'
        });
        H1.setAttribute({
            fixed: true,
            withLabel: false,
            highlight: true,
            visible: false
        });

        var H2 = MacroLib.createTransformLine(brd1, {
            transformList: [sliderYPositive],
            ltype: 'Horizontal',
            name: 'H',
            color: 'Orange'
        });
        H2.setAttribute({
            fixed: true,
            withLabel: false,
            highlight: true,
            visible: false
        });


        ////////////
        // Intersection Box 1
        ////////////
        var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {
            visible: false
        });
        var iSD = brd1.create('intersection', [H2, SRAS2, 0], {
            visible: false
        });

        var iDonly = brd1.create('intersection', [H1, AD1, 0], {
            visible: true,
            withLabel: false,
            color: 'Red'
        });
        var iSonly = brd1.create('intersection', [H1, SRAS2, 0], {
            visible: true,
            withLabel: false,
            color: 'Blue'
        });


        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashesFixedB1 = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'RGDP<sub>1973</sub>',
            xoffsets: [-25, -15],
            ylabel: '106',
            yoffsets: [5, 10],
            color: 'DarkGray'
        });


        ////////////
        // Dashes for Supply Only
        ////////////
        var dashesSonly = MacroLib.createDashedLines2Axis(brd1, iSonly, {
            withLabel: false,
            xlabel: 'QAS<sup>*</sup>',
            xoffsets: [5, 24],
            ylabel: '',
            yoffsets: [5, 10],
            color: 'Lime'
        });

        ////////////
        // Dashes for Demand Only
        ////////////
        var dashesDonly = MacroLib.createDashedLines2Axis(brd1, iDonly, {
            withLabel: false,
            xlabel: 'QAD<sup>*</sup>',
            xoffsets: [5, 24],
            ylabel: '',
            yoffsets: [5, 10],
            color: 'DodgerBlue'
        });

        ////////////
        // Dashes for Demand and Supply
        ////////////
        var dashesSD = MacroLib.createDashedLines2Axis(brd1, iSD, {
            withLabel: false,
            xlabel: 'RGDP<sub>1975</sub>',
            xoffsets: [5, 10],
            ylabel: '',
            yoffsets: [5, 10],
            color: 'Crimson'
        });

        var sliderLabel126 = brd1.create('text', [0.15,
            function(y) {
                return (H2.point1.Y() + 0.3);
            },
            function() {
                return (106.0 + 20.0 * slidery.Value() / slidery._smax).toFixed(0);
            }
        ], {
            visible: false
        });


        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines for Demand/Supply
            dashesSD.Y1.moveTo([0, iSD.Y()]);
            dashesSD.Y2.moveTo([iSD.X(), iSD.Y()]);

            dashesSD.X1.moveTo([iSD.X(), 0]);
            dashesSD.X2.moveTo([iSD.X(), iSD.Y()]);

            //Moving Dashed Lines for Supply only
            dashesSonly.Y1.moveTo([0, iSonly.Y()]);
            dashesSonly.Y2.moveTo([iSonly.X(), iSonly.Y()]);

            dashesSonly.X1.moveTo([iSonly.X(), 0]);
            dashesSonly.X2.moveTo([iSonly.X(), iSonly.Y()]);

            //Moving Dashed Lines for Demand only
            dashesDonly.Y1.moveTo([0, iDonly.Y()]);
            dashesDonly.Y2.moveTo([iDonly.X(), iDonly.Y()]);

            dashesDonly.X1.moveTo([iDonly.X(), 0]);
            dashesDonly.X2.moveTo([iDonly.X(), iDonly.Y()]);

        });

        brd1.on('mousedown', function() {
            SRAS2.setAttribute({
                withLabel: true
            });
            dashesSD.Y1.setAttribute({
                withLabel: true
            });
            dashesSD.X1.setAttribute({
                withLabel: true
            });
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
            sliderLabel126.setAttribute({
                visible: true
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
