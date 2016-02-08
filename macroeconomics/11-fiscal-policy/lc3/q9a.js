var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        //Custom Parameters
        MacroLib.labelOffset({
            X: 130,
            Y: 140
        });

        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.5, 12, 12, -1.5],
            xname: 'RGD',
            xpos: [10.5, -0.65],
            yname: 'Price<br>Level',
            grid: false,
            ypos: [-1.25, 10.0]
        });

        //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'SRAS',
            color: 'DodgerBlue'
        });
        SRAS1.setAttribute({
            fixed: true,
            highlight: false
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'AD<sub>1</sub>',
            color: 'Orange'
        });
        AD1.setAttribute({
            dash: 1,
            fixed: true,
            highlight: false
        });

        //Demand Line 2 - fixed
        var AD2 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'AD<sub>2</sub>',
            color: 'Orange'
        });
        AD2.setAttribute({
            withLabel: false,
            highlight: false,
            fixed: true,
            visible: true
        });


        ////////////
        //LRAS - straight line
        ////////////
        var LRAS = brd1.create('segment', [
            [5.75, 11.0],
            [5.75, 0.0]
        ], {
            strokeColor: 'DarkGray',
            strokeWidth: '3',
            name: 'LRAS',
            withLabel: true,
            fixed: true,
            highlight: false,
            label: {
                offset: [-15, 200]
            }
        });


        ////////////
        // Intersection Box 1
        ////////////
        var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {
            visible: false
        });
        var iSD = brd1.create('intersection', [SRAS1, AD2, 0], {
            visible: false
        });


        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashesFixedB1 = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'RGDP<sub>1</sub>',
            ylabel: 'PL<sub>1</sub>',
            yoffsets: [5, 10],
            color: 'DarkGray'
        });

        ////////////
        // Dashes for Demand and Supply
        ////////////
        var dashesSD = MacroLib.createDashedLines2Axis(brd1, iSD, {
            withLabel: false,
            xlabel: 'RGDP<sub>2</sub>',
            xoffsets: [5, 15],
            ylabel: 'PL<sub>2</sub>',
            yoffsets: [5, 10],
            color: 'Orange'
        });
    }

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
