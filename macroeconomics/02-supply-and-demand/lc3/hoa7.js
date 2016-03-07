(function(JXG, MacroLib) {
    'use strict';
    var board, supplyLine1, supplyLine2, demandLine, glider1, glider2, dashes1, dashes2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity<br>of Wheat',
            yname: 'Price of<br>Wheat'
        });

        // Supply Line 1 - fixed
        supplyLine1 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'gray'
        });
        supplyLine1.setAttribute({
            dash: 1,
            fixed: true,
            highlight: false
        });

        // Supply Line 2 - moveable
        supplyLine2 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>2</sub>',
            color: 'orange'
        });
        supplyLine2.setAttribute({
            withLabel: false
        });

        // Demand Line - fixed
        demandLine = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D',
            color: 'dodgerblue'
        });
        demandLine.setAttribute({
            fixed: true,
            highlight: false
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
            color: 'gray'
        });

        // Dashes to x, y axes for glider 2
        dashes2 = MacroLib.createDashedLines2Axis(board, glider2, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'P<sub>2</sub>',
            color: 'gray'
        });
        dashedLinesVisibility(dashes2, false);
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var decreaseSupplyBtn = document.getElementById('decreaseSupplyBtn');
    var increaseSupplyBtn = document.getElementById('increaseSupplyBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    //Interactivity
    if (decreaseSupplyBtn) {
        decreaseSupplyBtn.addEventListener('click', decreaseSupply);
    }
    if (increaseSupplyBtn) {
        increaseSupplyBtn.addEventListener('click', increaseSupply);
    }
    if (resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', resetAnimation);
    }

    // Supply lines are y = ax + b with a = 1 and b = 0. Middle of line segment: (5.75, 5.75)

    // Animation for shifting curve SouthWest
    function decreaseSupply() {
        shiftSupply([-1, 1]);
    }

    // Animation for shifting curve NorthEast
    function increaseSupply() {
        shiftSupply([1, -1]);
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(board);
        init();
    }

    function shiftSupply(trans) {
        var destPoint = board.create('point', [5.75, 5.75], {
                visible: false
            });
        resetAnimation();
        translatePoint(destPoint, trans, 0);
        translateLine(supplyLine2, trans);
        supplyLine2.setAttribute({
            withLabel: true,
            offset: [125, -85]
        });
        glider2.showElement();
        dashedLinesVisibility(dashes2, true);
        moveDashedLines(dashes2, destPoint);
        board.update();
    }

    function movePoint(point, destPt, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        point.moveTo([destPt.X(), destPt.Y()], duration);
    }

    function moveDashedLines(dashedLines, destPt, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        dashedLines.X1.moveTo([destPt.X(), 0], duration);
        dashedLines.X2.moveTo([destPt.X(), destPt.Y()], duration);
        dashedLines.Y1.moveTo([0, destPt.Y()], duration);
        dashedLines.Y2.moveTo([destPt.X(), destPt.Y()], duration);
    }

    function translatePoint(point, trans, animDuration) {
        // var duration = animDuration || 1000; Doesn't work with 0!
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        point.moveTo(getTransPt(point, trans), duration);
    }

    function translateLine(line, trans, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        translatePoint(line.point1, trans, duration);
        translatePoint(line.point2, trans, duration);
    }

    function translateDashedLines(dashedLines, trans, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        translatePoint(dashedLines.X1, trans, duration);
        translatePoint(dashedLines.X2, trans, duration);
        translatePoint(dashedLines.Y1, trans, duration);
        translatePoint(dashedLines.Y2, trans, duration);
    }

    function getTransPt(pt, trans) {
        return [pt.X() + trans[0], pt.Y() + trans[1]];
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
