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
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity',
            yname: 'Price'
        });

        // Supply Line
        var S = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S',
            color: 'orange'
        });
        translateLine(S, [-2, 0], 0);

        // Demand Line:
        // Hide Demand Line and use 2 line segments instead to avoid
        // drawing the portion under the producer surplus polygon.
        var D = MacroLib.createLine(brd1, {
            ltype: 'Demand'
        });
        translateLine(D, [-2, 0], 0);
        D.setAttribute({
            visible: false
        });

        // World Price horizontal line
        // (D and S intersect at (3.75, 5.75))
        var W = brd1.create('segment', [[0, 7.5], [7.5, 7.5]], {
            strokeColor: 'black',
            strokeWidth: 2,
            name: 'P world',
            withLabel: true,
            label: {
                offset: [150, 2]
            }
        });

        // Intersection of World Price and Demand Line
        var IWD = brd1.create('intersection', [W, D, 0], {
            visible: false
        });

        // Intersection of World Price and Supply Line
        var IWS = brd1.create('intersection', [W, S, 0], {
            visible: false
        });

        // Intersection of Supply and Demand Lines
        var IDS = brd1.create('intersection', [S, D, 0], {
            visible: false
        });

        // Projection of IWD or IWS on y-axis
        var ptAxis = brd1.create('point', [0, IWS.Y()], {
            withLabel: false,
            visible: false
        });

        // Consumer surplus area
        var CS = brd1.create('polygon', [D.point1, ptAxis, IWD], {
            withLabel: false,
            withLines: false,
            fillColor: 'dodgerblue',
            fillOpacity: 0.5
        });

        // Producer surplus area
        var PS = brd1.create('polygon', [S.point1, ptAxis, IWS], {
            withLabel: false,
            withLines: false,
            fillColor: 'orange',
            fillOpacity: 0.5
        });

        // Lines segments representing Demand Line
        var D1 = brd1.create('segment', [D.point1, IWD], {
            strokeColor: 'dodgerblue',
            strokeWidth: 3,
            withLabel: false,
            layer:0
        });

        var D2 = brd1.create('segment', [IDS, D.point2], {
            strokeColor: 'dodgerblue',
            strokeWidth: 3,
            name: 'D',
            withLabel: true,
            label: {
                offset: [83, -80]
            },
            layer: 0
        });

        // Consumer surplus label
        var CSL = brd1.create('segment', [[0.7, 8], [2.7, 10]], {
            strokeColor: 'black',
            strokeWidth: 2,
            name: 'Consumer<br>surplus',
            withLabel: true,
            label: {
                offset: [45, 37]
            }
        });

        // Producer surplus label
        var CSL = brd1.create('segment', [[0.7, 3.3], [2.7, 1.3]], {
            strokeColor: 'black',
            strokeWidth: 2,
            name: 'Producer<br>surplus',
            withLabel: true,
            label: {
                offset: [45, -27]
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
