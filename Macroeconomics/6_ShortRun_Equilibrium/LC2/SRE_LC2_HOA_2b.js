var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        //Custom Parameters
        MacroLib.labelOffset({
            'X': 130,
            'Y': 140
        });

        var bbox = [-1.5, 12, 12, -1.5];
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: bbox,
            xname: 'Real GDP',
            'xpos': [9, -0.5],
            yname: 'Price<br>Level',
            grid: false,
            'ypos': [-1.25, 10.0]
        });

        //Sliders
        var sliderx = brd1.create('slider', [
            [8.0, -1.0],
            [8, -1.0],
            [-1.4, -1.39, -1.39]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'White'
        });
        var slidery = brd1.create('slider', [
            [-1.0, 2.75],
            [-1.0, 8.75],
            [-1.4, 0, 0]
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
                return sliderx.Value();
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
            'ltype': 'Supply',
            'name': 'AS<sub>1929</sub>',
            color: 'DodgerBlue'
        });
        SRAS1.setAttribute({
            'fixed': true,
            'highlight': false
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            'ltype': 'Demand',
            'name': 'AD<sub>1929</sub>',
            'color': 'Crimson'
        });
        AD1.setAttribute({
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        //Demand Line 2 - moveable
        var AD2 = MacroLib.createTransformLine(brd1, {
            'transformList': [sliderXPositive],
            'ltype': 'Demand',
            'name': 'AD<sub>1933</sub>',
            'color': 'Crimson'
        });
        AD2.setAttribute({
            'withLabel': false,
            'highlight': true,
            'visible': true
        });

        //Fake line for intersection at equilibrium
        //Fake line for intersection at equilibrium
        var H1 = MacroLib.createLine(brd1, {
            'ltype': 'Horizontal',
            'name': 'H',
            'color': 'Orange'
        });
        H1.setAttribute({
            'fixed': true,
            'withLabel': false,
            'highlight': true,
            'visible': false
        });

        var H2 = MacroLib.createTransformLine(brd1, {
            'transformList': [sliderYPositive],
            'ltype': 'Horizontal',
            'name': 'H',
            'color': 'Orange'
        });
        H2.setAttribute({
            'fixed': true,
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
        var iSD = brd1.create('intersection', [H2, AD2, 0], {
            'visible': false
        });

        var iDonly = brd1.create('intersection', [H1, AD2, 0], {
            'visible': true,
            withLabel: false,
            color: 'Red'
        });
        var iSonly = brd1.create('intersection', [H1, SRAS1, 0], {
            'visible': true,
            withLabel: false,
            color: 'Blue'
        });


        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashesFixedB1 = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'RGDP<sub>1929</sub>',
            ylabel: '100',
            yoffsets: [5, 10],
            color: 'DarkGray'
        });

        ////////////
        // Dashes for Demand and Supply
        ////////////
        var dashesSD = MacroLib.createDashedLines2Axis(brd1, iSD, {
            withLabel: false,
            xlabel: 'RGDP<sub>1933</sub>',
            xoffsets: [5, 15],
            ylabel: '',
            yoffsets: [5, 10],
            color: 'Crimson'
        });

        ////////////
        // Dashes for Supply Only
        ////////////
        var dashesSonly = MacroLib.createDashedLines2Axis(brd1, iSonly, {
            withLabel: false,
            xlabel: 'AS<sup>*</sup>',
            xoffsets: [5, 35],
            ylabel: '',
            yoffsets: [5, 10],
            color: 'DodgerBlue'
        });

        ////////////
        // Dashes for Demand Only
        ////////////
        var dashesDonly = MacroLib.createDashedLines2Axis(brd1, iDonly, {
            withLabel: false,
            xlabel: 'AD<sup>*</sup>',
            xoffsets: [5, 35],
            ylabel: '',
            yoffsets: [5, 10],
            color: 'Lime'
        });

        var sliderLabel128 = brd1.create('text', [0.15,
            function(y) {
                return (H2.point1.Y() + 0.3);
            },
            function() {
                return (100.0 - 22.0 * slidery.Value() / slidery._smin).toFixed(0);
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
            AD2.setAttribute({
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
            sliderLabel128.setAttribute({
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

})(JXG, MacroLib, undefined);
