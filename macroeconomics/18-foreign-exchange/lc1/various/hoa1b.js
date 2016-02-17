var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: 'Q of US Dollars',
            yname: '&pound;/$',
            grid: false,
            xpos: [8, -0.5]
        });

        //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: '$S<sub>1</sub>',
            color: 'DodgerBlue'
        });
        SRAS1.setAttribute({
            dash: 1,
            fixed: true,
            highlight: false
        });

        //Supply Line 2 - moveable
        var SRAS2 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: '$S<sub>2</sub>',
            color: 'DodgerBlue'
        });
        SRAS2.setAttribute({
            fixed: true,
            highlight: false,
            withLabel: false
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: '$D<sub>1</sub>',
            color: 'Orange'
        });
        AD1.setAttribute({
            dash: 1,
            fixed: true,
            highlight: false
        });

        //Demand Line 2 - moveable
        var AD2 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: '$D<sub>2</sub>',
            color: 'Orange'
        });
        AD2.setAttribute({
            fixed: true,
            highlight: false,
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
        // Draggable Dashed Lines for Board 1
        ////////////
        var dashS2 = MacroLib.createDashedLines2Axis(brd1, iS2D, {
            fixed: false,
            withLabel: true,
            xlabel: 'Q<sup>*</sup>',
            ylabel: '$2/&pound;1',
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
