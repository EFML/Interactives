var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, ptDemand, ptAxis2;

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
            yname: 'Price per <br>Textbook',
            xpos: [9, -1],
            ypos: [-2.6, 10.5]
        });

        // Demand Line
        var D = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D',
            color: 'DodgerBlue'
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

        ptAxis2 = brd1.create('point', [0, yl], {
            name: 'P',
            withLabel: true,
            visible: true,
            fixed: true,
            strokeColor: 'Gray',
            fillColor: 'Gray',
            label: {
                offset: [-25, 0]
            }
        });
        ptDemand =  brd1.create('point', [xl, yl], {
            withLabel: false,
            visible: true
        });

        var CS = brd1.create('polygon', [D.point1, ptDemand, ptAxis2, ptAxis1], {
            withLabel: false,
            withLines: false,
            fillColor: 'DodgerBlue',
            fillOpacity: 0.5,
            label: {
                offset: [-80, -20]
            }
        });
        // Consumer surplus label to the right
        var p1 = brd1.create('point', [7, 9.5], {
            visible: false
        });
        var p2 = brd1.create('point', [7, 7.5], {
            visible: false
        });
        var p3 = brd1.create('point', [9, 7.5], {
            visible: false
        });
        var CSLabel = brd1.create('polygon', [p1, p2, p3], {
            name:"Consumer<br>Surplus",
            withLabel: true,
            withLines: false,
            fillColor: 'DodgerBlue',
            fillOpacity: 0.5,
            label: {
                offset: [35, 0]
            }
        });
        // Dashed horizontal line
        var DL = brd1.create('segment', [ptAxis2, ptDemand], {
            withLabel: false,
            strokeColor: 'gray',
            strokeWidth: '2',
            dash: '2'
        });
        // Price slider
        var priceSlider = brd1.create('slider', [
            [-2.6, 2.0],
            [-2.6, 9.5],
            [2.0, 4.0, 9.5]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'Crimson'
        });

        priceSlider.on('drag', function() {
            var price = priceSlider.Value(),
                xD = 9.5 - price;
            ptDemand.moveTo([xD, price]);
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
    });

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
