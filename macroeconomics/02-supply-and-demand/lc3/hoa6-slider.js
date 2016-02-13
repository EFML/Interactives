var Macro = (function(JXG, MacroLib) {
    'use strict';
    var board, demandLine1, demandLine2, supplyLine, glider1, glider2, dashes1, dashes2, demandSlider;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity of Wheat',
            yname: 'Price of<br>Wheat'
        });

        // Demand Line 1 - fixed
        demandLine1 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D<sub>1</sub>',
            color: 'Gray'
        });
        demandLine1.setAttribute({
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        // Demand Line 2 - moveable
        demandLine2 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D<sub>2</sub>',
            color: 'DodgerBlue'
        });
        demandLine2.setAttribute({
            withLabel: false
        });

        // Supply Line - fixed
        supplyLine = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S',
            color: 'Orange'
        });
        supplyLine.setAttribute({
            'fixed': true,
            'highlight': false
        });

        // Glider on Demand Line 1
        glider1 = board.create('glider', [5.75, 5.75, demandLine1], {
            withLabel: false
        });

        // Glider on Demand Line 2
        glider2 = board.create('glider', [5.75, 5.75, demandLine2], {
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
        demandSlider = board.create('slider', [
            [3.75, -1.5],
            [7.75, -1.5],
            [-1.0, 0.0, 1.0]
        ], {
            withLabel: false,
            snapWidth: 0.01,
            color: 'DodgerBlue'
        });

        demandSlider.on('mousedown', function() {
            demandLine2.setAttribute({
                withLabel: true,
                offset: [125, -85]
            });
            glider2.showElement();
            dashedLinesVisibility(dashes2, true);
        });

        demandSlider.on('drag', function() {
            var t = demandSlider.Value();
            shiftDemand([t, t]);
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    //Interactivity
    if (resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', resetAnimation);
    }

    // Demand lines are y = ax + b with a = -1 and b = 11.5. Middle of line segment: (5.75, 5.75)

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(board);
        init();
    }

    function shiftDemand(trans) {
        var destPt0 = board.create('point', [glider1.X() + trans[0], glider1.Y() + trans[1]], {
                visible: false
            }),
            destPt1 = board.create('point', [demandLine1.point1.X() + trans[0], demandLine1.point1.Y() + trans[1]], {
                visible: false
            }),
            destPt2 = board.create('point', [demandLine1.point2.X() + trans[0], demandLine1.point2.Y() + trans[1]], {
                visible: false
            });
        moveLine(demandLine2, destPt1, destPt2, 0);
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
