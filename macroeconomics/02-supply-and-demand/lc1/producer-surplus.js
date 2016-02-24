var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        JXG.Options.segment.strokeWidth = 3;
        JXG.Options.segment.fixed = true;
        JXG.Options.segment.highlight = false;
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-4, 12, 12, -2],
            xname: 'Quantity of<br>Shoes',
            yname: 'Price per pair<br>of Shoes'
        });

        // Supply Line
        var S = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S',
            color: 'orange'
        });
        translateLine(S, [-2, 0], 0);

        // Producer surplus area
        var ptAxis1 = brd1.create('point', [0, S.point1.Y()], {
            withLabel: false,
            visible: false
        });
        // Demand line is y = x, translated -2 on x-axis
        var yl = S.point1.Y() + 5;
        var xl = yl - 2;

        var ptAxis2 = brd1.create('point', [0, yl], {
            withLabel: false,
            visible: false
        });
        var ptSupply =  brd1.create('point', [xl, yl], {
            withLabel: false,
            visible: false
        });

        var PS = brd1.create('polygon', [S.point1, ptSupply, ptAxis2, ptAxis1], {
            name:"Producer<br>Surplus",
            withLabel: true,
            withLines: false,
            fillColor: 'orange',
            fillOpacity: 0.5,
            label: {
                offset: [-70, 30]
            }
        });
        // Dashed horizontal line
        var DL = brd1.create('segment', [ptAxis2, ptSupply], {
            name: '300 ecobucks',
             withLabel: true,
            strokeColor: 'gray',
            strokeWidth: '2',
            dash: '2',
            label: {
                offset: [-187, 3]
            }
        });
    }

    function translatePoint(pt, trans) {
        return [pt.X() + trans[0], pt.Y() + trans[1]];
    }

    function translateLine(line, trans, animLength) {
        line.point1.moveTo(translatePoint(line.point1, trans), animLength);
        line.point2.moveTo(translatePoint(line.point2, trans), animLength);
    }

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
