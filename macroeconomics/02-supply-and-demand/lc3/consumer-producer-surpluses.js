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
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity<br>of Wheat',
            yname: 'Price of<br>Wheat'
        });

        // Supply Line
        var S = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S',
            color: 'orange'
        });
        translateLine(S, [-2, 0], 0);

        // Demand Line
        var D = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D',
            color: 'dodgerblue'
        });
        translateLine(D, [-2, 0], 0);

        // Intersection of Supply and Demand Lines - fixed
        var ISD = brd1.create('intersection', [S, D, 0], {
            visible: false
        });

        // Projection of intersection on y-axis
        var ptAxis = brd1.create('point', [0, ISD.Y()], {
            withLabel: false,
            visible: false
        });

        // Consumer surplus area
        var CS = brd1.create('polygon', [D.point1, ptAxis, ISD], {
            name:"Consumer<br>Surplus",
            withLabel: true,
            withLines: false,
            fillColor: 'dodgerblue',
            fillOpacity: 0.5,
            label: {
                offset: [-60, -30]
            }
        });

        // Producer surplus area
        var PS = brd1.create('polygon', [S.point1, ptAxis, ISD], {
            name:"Producer<br>Surplus",
            withLabel: true,
            withLines: false,
            fillColor: 'orange',
            fillOpacity: 0.5,
            label: {
                offset: [-60, 30]
            }
        });

        // Dashes to x, y axes for intersection of Suply and Demand lines
        var DSD = MacroLib.createDashedLines2Axis(brd1, ISD, {
            withLabel: true,
            xlabel: 'Q<sub>s</sub>',
            ylabel: 'P<sub>1</sub>',
            color: 'gray'
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
