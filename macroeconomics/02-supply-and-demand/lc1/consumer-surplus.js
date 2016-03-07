(function(JXG, MacroLib) {
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
            bboxlimits: [-3.4, 12, 12, -2],
            xname: 'Quantity of<br>Textbooks',
            yname: 'Price per <br>Textbook'
        });

        // Demand Line
        var D = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D',
            color: 'dodgerblue'
        });
        translateLine(D, [-2, 0], 0);

        // Consumer surplus area
        var ptAxis1 = brd1.create('point', [0, D.point1.Y()], {
            withLabel: false,
            visible: false
        });
        // Demand line is y = -x + 11.5, translated -2 on x-axis
        var yl = D.point2.Y() + 2;
        var xl = -yl + 11.5 - 2;

        var ptAxis2 = brd1.create('point', [0, yl], {
            withLabel: false,
            visible: false
        });
        var ptDemand =  brd1.create('point', [xl, yl], {
            withLabel: false,
            visible: false
        });

        var CS = brd1.create('polygon', [D.point1, ptDemand, ptAxis2, ptAxis1], {
            name:"Consumer<br>Surplus",
            withLabel: true,
            withLines: false,
            fillColor: 'dodgerblue',
            fillOpacity: 0.5,
            label: {
                offset: [-80, -20]
            }
        });
        // Dashed horizontal line
        var DL = brd1.create('segment', [ptAxis2, ptDemand], {
            name: '75 ecobucks',
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
