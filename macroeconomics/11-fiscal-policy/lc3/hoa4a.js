var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.5, 12, 12, -1],
            xname: 'Real GDP',
            yname: 'Price<br>Level'
        });

        //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createSupply(brd1, {
            name: 'SRAS<sub>1</sub>',
            color: 'DodgerBlue'
        });
        SRAS1.setAttribute({
            'dash': 0,
            'fixed': true,
            'highlight': false
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createDemand(brd1, {
            name: 'AD<sub>1</sub>',
            color: 'Orange'
        });
        AD1.setAttribute({
            'dash': 0,
            'fixed': true,
            'highlight': false
        });

        ////////////
        // Intersection Box 1
        ////////////
        var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {
            visible: false
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

        ////////////
        //LRAS - straight line
        ////////////
        var LRAS = brd1.create('segment', [
            [7.75, 11.0],
            [7.75, 0.0]
        ], {
            'strokeColor': 'DarkGray',
            'strokeWidth': '3',
            'highlight': false,
            'name': 'LRAS',
            'withLabel': true,
            'fixed': true,
            'label': {
                'offset': [-15, 200]
            }
        });
        var labelLRAS = brd1.create('text', [7.45, -0.4, 'rY<sub>F</sub>'], {
            fixed: true
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
