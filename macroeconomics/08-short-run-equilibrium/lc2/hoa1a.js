var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.5, 12, 12, -2],
            xname: 'Real GDP',
            yname: 'Price<br>Level',
            grid: false
        });

        //Sliders
        var sliderx = brd1.create('slider', [
            [3.0, -1.25],
            [8, -1.25],
            [0.0, 0, 1.4]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'crimson'
        });

        //Positive Slider Transformation
        var sliderXPositive = brd1.create('transform', [
            function() {
                return sliderx.Value();
            },
            function() {
                return sliderx.Value();
            }
        ], {
            type: 'translate'
        });

        //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'AS<sub>1917</sub>',
            color: 'dodgerblue'
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'AD<sub>1917</sub>',
            color: 'crimson'
        });
        AD1.setAttribute({
            dash: 1
        });

        //Demand Line 2 - moveable
        var AD2 = MacroLib.createTransformLine(brd1, {
            transformList: [sliderXPositive],
            ltype: 'Demand',
            name: 'AD<sub>1919</sub>',
            color: 'crimson'
        });
        AD2.setAttribute({
            withLabel: false,
            highlight: true,
            visible: true
        });

        //Fake line for intersection at equilibrium
        var H1 = MacroLib.createLine(brd1, {
            ltype: 'Horizontal',
            name: 'H',
            color: 'orange'
        });
        H1.setAttribute({
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
        var iSD = brd1.create('intersection', [H1, AD2, 0], {
            visible: false
        });

        var iDonly = brd1.create('intersection', [H1, AD2, 0], {
            visible: true,
            withLabel: false,
            color: 'red'
        });
        var iSonly = brd1.create('intersection', [H1, SRAS1, 0], {
            visible: true,
            withLabel: false,
            color: 'blue'
        });


        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashesFixedB1 = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'RGDP<sub>1917</sub>',
            ylabel: '100',
            color: 'darkgray'
        });


        ////////////
        // Dashes for Supply Only
        ////////////
        var dashesSonly = MacroLib.createDashedLines2Axis(brd1, iSonly, {
            withLabel: false,
            xlabel: 'QAS<sup>*</sup>',
            xoffsets: [25, 40],
            ylabel: '',
            yoffsets: [30, 15],
            color: 'dodgerblue'
        });

        ////////////
        // Dashes for Demand and Supply
        ////////////
        var dashesSD = MacroLib.createDashedLines2Axis(brd1, iSD, {
            withLabel: false,
            xlabel: 'RGDP<sub>1919</sub>',
            xoffsets: [5, 15],
            ylabel: '',
            yoffsets: [5, 10],
            color: 'crimson'
        });

        ////////////
        // Dashes for Demand Only
        ////////////
        var dashesDonly = MacroLib.createDashedLines2Axis(brd1, iDonly, {
            withLabel: false,
            xlabel: 'QAD<sup>*</sup>',
            xoffsets: [25, 40],
            ylabel: '',
            yoffsets: [5, 10],
            color: 'lime'
        });

        //////////////////
        // Interactivity
        //////////////////
        sliderx.on('down', function() {
            AD2.setAttribute({
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
            brd1.update();
        });

        sliderx.on('drag', function() {
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
