var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, ptSupply, ptAxis2;

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
            color: 'Orange'
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

        ptAxis2 = brd1.create('point', [0, yl], {
            name: 'P',
            withLabel: true,
            visible: true,
            strokeColor: 'Gray',
            fillColor: 'Gray',
            label: {
                offset: [-25, 0]
            }
        });
        ptSupply =  brd1.create('point', [xl, yl], {
            withLabel: false,
            visible: true
        });

        var PS = brd1.create('polygon', [S.point1, ptSupply, ptAxis2, ptAxis1], {
            withLabel: false,
            withLines: false,
            fillColor: 'Orange',
            fillOpacity: 0.5,
            label: {
                offset: [-70, 30]
            }
        });
        // Producer surplus label to the right
        var p1 = brd1.create('point', [7, 2], {
            visible: false
        });
        var p2 = brd1.create('point', [7, 4], {
            visible: false
        });
        var p3 = brd1.create('point', [9, 4], {
            visible: false
        });
        var PSLabel = brd1.create('polygon', [p1, p2, p3], {
            name:"Producer<br>Surplus",
            withLabel: true,
            withLines: false,
            fillColor: 'Orange',
            fillOpacity: 0.5,
            label: {
                offset: [25, 0]
            }
        });
        // Dashed horizontal line
        var DL = brd1.create('segment', [ptAxis2, ptSupply], {
            withLabel: false,
            strokeColor: 'gray',
            strokeWidth: '2',
            dash: '2',
        });
        // Price slider
        var priceSlider = brd1.create('slider', [
            [-2.6, 2.0],
            [-2.6, 9.5],
            [2.0, 7.0, 9.5]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'Crimson'
        });

        priceSlider.on('drag', function() {
            var price = priceSlider.Value(),
                xS = price - 2;
            ptSupply.moveTo([xS, price]);
            ptAxis2.moveTo([0, price]);
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    })

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
