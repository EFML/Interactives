(function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity<br>of Wheat',
            yname: 'Price of<br>Wheat'
        });

        // Supply Line -- fixed
        var S = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S',
            color: 'orange'
        });
        S.setAttribute({
            fixed: true,
            highlight: false
        });

        // Demand Line  - fixed
        var D = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D',
            color: 'dodgerblue'
        });
        D.setAttribute({
            fixed: true,
            highlight: false
        });

        // Intersection of Supply and Demand Lines - fixed
        var ISD = brd1.create('intersection', [S, D, 0], {
            visible: false
        });

        // Dashes to x, y axes for previous intersection point
        var DISD = MacroLib.createDashedLines2Axis(brd1, ISD, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: 'P<sub>1</sub>',
            color: 'gray'
        });
    }

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
