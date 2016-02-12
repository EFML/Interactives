var Macro = (function(JXG, MacroLib) {
    'use strict';
    var board, supplyLine1, supplyLine2, demandLine, glider1, glider2, dashes1, dashes2, supplySlider;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity of Wheat',
            yname: 'Price of<br>Wheat',
            ypos: [-1.8, 11]
        });

        // Supply Line 1 - fixed
        supplyLine1 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'Gray'
        });
        supplyLine1.setAttribute({
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        // Supply Line 2 - moveable
        supplyLine2 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>2</sub>',
            color: 'Orange'
        });
        supplyLine2.setAttribute({
            withLabel: false
        });

        // Demand Line - fixed
        demandLine = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D',
            color: 'DodgerBlue'
        });
        demandLine.setAttribute({
            'fixed': true,
            'highlight': false
        });

        // Glider on Supply Line 1
        glider1 = board.create('glider', [5.75, 5.75, supplyLine1], {
            withLabel: false
        });

        // Glider on Supply Line 2
        glider2 = board.create('glider', [5.75, 5.75, supplyLine2], {
            withLabel: false
        });
        glider2.hideElement();

        // Dashes to x, y axes for glider 1
        dashes1 = MacroLib.createDashedLines2Axis(board, glider1, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: 'P<sub>1</sub>',
            color: 'Gray'
        });

        // Dashes to x, y axes for glider 2
        dashes2 = MacroLib.createDashedLines2Axis(board, glider2, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'P<sub>2</sub>',
            color: 'Gray'
        });
        dashedLinesVisibility(dashes2, false);

        // Slider
        supplySlider = board.create('slider', [
            [3.75, -1.5],
            [7.75, -1.5],
            [-1.0, 0.0, 1.0]
        ], {
            withLabel: false,
            snapWidth: 0.01,
            color: 'Orange'
        });

        supplySlider.on('mousedown', function() {
            supplyLine2.setAttribute({
                withLabel: true,
                offset: [125, -85]
            });
            glider2.showElement();
            dashedLinesVisibility(dashes2, true);
        });

        supplySlider.on('drag', function() {
            var t = supplySlider.Value();
            shiftSupply([t, -t]);
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var decreaseSupplyBtn = document.getElementById('decreaseSupplyBtn');

    //Interactivity
    if (resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', resetAnimation);
    }

    // Supply lines are y = ax + b with a = 1 and b = 0. Middle of line segment: (5.75, 5.75)

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(board);
        init();
    }

    function shiftSupply(trans) {
        var destPt0 = board.create('point', [glider1.X() + trans[0], glider1.Y() + trans[1]], {
                visible: false
            }),
            destPt1 = board.create('point', [supplyLine1.point1.X() + trans[0], supplyLine1.point1.Y() + trans[1]], {
                visible: false
            }),
            destPt2 = board.create('point', [supplyLine1.point2.X() + trans[0], supplyLine1.point2.Y() + trans[1]], {
                visible: false
            });
        moveLine(supplyLine2, destPt1, destPt2, 0);
        moveDashedLines(dashes2, destPt0, 0);
        board.update();
    }

    function movePoint(point, destPt, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        point.moveTo([destPt.X(), destPt.Y()], duration);
    }

    function moveLine(line, destPt1, destPt2, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        movePoint(line.point1, destPt1, animDuration);
        movePoint(line.point2, destPt2, animDuration);
    }

    function moveDashedLines(dashedLines, destPt, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        dashedLines.X1.moveTo([destPt.X(), 0], duration);
        dashedLines.X2.moveTo([destPt.X(), destPt.Y()], duration);
        dashedLines.Y1.moveTo([0, destPt.Y()], duration);
        dashedLines.Y2.moveTo([destPt.X(), destPt.Y()], duration);
    }

    function dashedLinesVisibility(dashedLines, vis) {
        if (vis) {
            dashedLines.X1.showElement();
            dashedLines.XLine.showElement();
            dashedLines.Y1.showElement();
            dashedLines.YLine.showElement();
        }
        else {
            dashedLines.X1.hideElement();
            dashedLines.XLine.hideElement();
            dashedLines.Y1.hideElement();
            dashedLines.YLine.hideElement();
        }
    }

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
