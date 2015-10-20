var Macro = (function(JXG, MacroLib) {
    'use strict';
    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        var bbox = [-1.5, 12, 12, -1.75];

        var brd1 = MacroLib.createBoard('jxgbox1', {
            xname: 'Real GDP',
            yname: 'Price<br>Level',
            grid: false,
            'xpos': [8, -0.5],
            'ypos': [-1.25, 10],
            bboxlimits: bbox
        });


        //Guides
        var L = bbox[1];
        var GY1 = brd1.create('segment', [
            [L / 4, 0.0],
            [L / 4, L]
        ], {
            name: 'GY1',
            color: 'DarkGray',
            dash: 1,
            strokeWidth: 2
        });
        var GY2 = brd1.create('segment', [
            [L / 2, 0.0],
            [L / 2, L]
        ], {
            name: 'GY2',
            color: 'DarkGray',
            dash: 1,
            strokeWidth: 2
        });
        var GY3 = brd1.create('segment', [
            [(3 / 4) * L, 0.0],
            [(3 / 4) * L, L]
        ], {
            name: 'GY3',
            color: 'DarkGray',
            dash: 1,
            strokeWidth: 2
        });

        var GX1 = brd1.create('segment', [
            [0.0, (1 / 4) * L],
            [L, (1 / 4) * L]
        ], {
            name: 'GX1',
            color: 'DarkGray',
            dash: 1,
            strokeWidth: 2
        });
        var GX2 = brd1.create('segment', [
            [0.0, (1 / 2) * L],
            [L, (1 / 2) * L]
        ], {
            name: 'GX2',
            color: 'DarkGray',
            dash: 1,
            strokeWidth: 2
        });
        var GX3 = brd1.create('segment', [
            [0.0, (3 / 4) * L],
            [L, (3 / 4) * L]
        ], {
            name: 'GX3',
            color: 'DarkGray',
            dash: 1,
            strokeWidth: 2
        });

        //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'SRAS',
            color: 'Gray'
        });
        SRAS1.setAttribute({
            'fixed': true,
            'highlight': false
        });
        SRAS1.point2.moveTo([10.0, 10.0], 0);
        brd1.update();
    }
    init();
})(JXG, MacroLib, undefined);
