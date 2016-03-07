(function(JXG, MacroLib) {
    'use strict';
    var brd1, demandLine11, demandLine12, supplyLine, glider11, glider12, dashes11, dashes12; // Board 1
    var brd2, supplyLine21, supplyLine22, demandLine, glider21, glider22, dashes21, dashes22; // Board 2

    function init1() {
        MacroLib.init(MacroLib.TWO_BOARDS);

        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-3, 12, 12, -3],
            xname: 'Quantity<br>of Wheat',
            yname: 'Price of<br>Wheat'
        });

        // Demand Line 1 - fixed
        demandLine11 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>1</sub>',
            color: 'gray'
        });
        demandLine11.setAttribute({
            dash: 1,
            fixed: true,
            highlight: false
        });

        // Demand Line 2 - moveable
        demandLine12 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>2</sub>',
            color: 'dodgerblue'
        });
        demandLine12.setAttribute({
            withLabel: false
        });

        // Supply Line - fixed
        supplyLine = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S',
            color: 'orange'
        });
        supplyLine.setAttribute({
            fixed: true,
            highlight: false
        });

        // Glider on Demand Line 1
        glider11 = brd1.create('glider', [5.75, 5.75, demandLine11], {
            withLabel: false
        });

        // Glider on Demand Line 2
        glider12 = brd1.create('glider', [5.75, 5.75, demandLine12], {
            withLabel: false
        });
        glider12.hideElement();

        // Dashes to x, y axes for glider 1
        dashes11 = MacroLib.createDashedLines2Axis(brd1, glider11, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: 'P<sub>1</sub>',
            color: 'gray'
        });

        // Dashes to x, y axes for glider 2
        dashes12 = MacroLib.createDashedLines2Axis(brd1, glider12, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'P<sub>2</sub>',
            color: 'gray'
        });
        dashedLinesVisibility(dashes12, false);
    }

    function init2() {
        MacroLib.init(MacroLib.TWO_BOARDS);

        brd2 = MacroLib.createBoard('jxgbox2', {
            bboxlimits: [-3, 12, 12, -3],
            xname: 'Quantity<br>of Wheat',
            yname: 'Price of<br>Wheat'
        });

        // Supply Line 1 - fixed
        supplyLine21 = MacroLib.createLine(brd2, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'gray'
        });
        supplyLine21.setAttribute({
            dash: 1,
            fixed: true,
            highlight: false
        });

        // Supply Line 2 - moveable
        supplyLine22 = MacroLib.createLine(brd2, {
            ltype: 'Supply',
            name: 'S<sub>2</sub>',
            color: 'orange'
        });
        supplyLine22.setAttribute({
            withLabel: false
        });

        // Demand Line - fixed
        demandLine = MacroLib.createLine(brd2, {
            ltype: 'Demand',
            name: 'D',
            color: 'dodgerblue'
        });
        demandLine.setAttribute({
            fixed: true,
            highlight: false
        });

        // Glider on Supply Line 1
        glider21 = brd2.create('glider', [5.75, 5.75, supplyLine21], {
            withLabel: false
        });

        // Glider on Supply Line 2
        glider22 = brd2.create('glider', [5.75, 5.75, supplyLine22], {
            withLabel: false
        });
        glider22.hideElement();

        // Dashes to x, y axes for glider 1
        dashes21 = MacroLib.createDashedLines2Axis(brd2, glider21, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: 'P<sub>1</sub>',
            color: 'gray'
        });

        // Dashes to x, y axes for glider 2
        dashes22 = MacroLib.createDashedLines2Axis(brd2, glider22, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'P<sub>2</sub>',
            color: 'gray'
        });
        dashedLinesVisibility(dashes22, false);
    }

    function init() {
        init1();
        init2();
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var decreaseDemandBtn = document.getElementById('decreaseDemandBtn');
    var increaseDemandBtn = document.getElementById('increaseDemandBtn');
    var decreaseSupplyBtn = document.getElementById('decreaseSupplyBtn');
    var increaseSupplyBtn = document.getElementById('increaseSupplyBtn');
    var resetAnimation1Btn = document.getElementById('resetAnimation1Btn');
    var resetAnimation2Btn = document.getElementById('resetAnimation2Btn');

    //Interactivity
    if (decreaseDemandBtn) {
        decreaseDemandBtn.addEventListener('click', decreaseDemand);
    }
    if (increaseDemandBtn) {
        increaseDemandBtn.addEventListener('click', increaseDemand);
    }
    if (resetAnimation1Btn) {
        resetAnimation1Btn.addEventListener('click', resetAnimation1);
    }
    if (decreaseSupplyBtn) {
        decreaseSupplyBtn.addEventListener('click', decreaseSupply);
    }
    if (increaseSupplyBtn) {
        increaseSupplyBtn.addEventListener('click', increaseSupply);
    }
    if (resetAnimation2Btn) {
        resetAnimation2Btn.addEventListener('click', resetAnimation2);
    }

    // Board 1
    // Demand lines are y = ax + b with a = -1 and b = 11.5. Middle of line segment: (5.75, 5.75)

    //Animation for shifting curve SouthWest
    function decreaseDemand() {
        shiftDemand([-1, -1]);
    }

    //Animation for shifting curve NorthEast
    function increaseDemand() {
        shiftDemand([1, 1]);
    }

    function resetAnimation1() {
        JXG.JSXGraph.freeBoard(brd1);
        init1();
    }

    function shiftDemand(trans) {
        var destPoint = brd1.create('point', [5.75, 5.75], {
                visible: false
            });
        resetAnimation1();
        translatePoint(destPoint, trans, 0);
        translateLine(demandLine12, trans);
        demandLine12.setAttribute({
            withLabel: true,
            offset: [125, -85]
        });
        glider12.showElement();
        dashedLinesVisibility(dashes12, true);
        moveDashedLines(dashes12, destPoint);
        brd1.update();
    }

    // Board 2
    // Supply lines are y = ax + b with a = 1 and b = 0. Middle of line segment: (5.75, 5.75)

    // Animation for shifting curve SouthWest
    function decreaseSupply() {
        shiftSupply([-1, 1]);
    }

    // Animation for shifting curve NorthEast
    function increaseSupply() {
        shiftSupply([1, -1]);
    }

    function resetAnimation2() {
        JXG.JSXGraph.freeBoard(brd2);
        init2();
    }

    function shiftSupply(trans) {
        var destPoint = brd2.create('point', [5.75, 5.75], {
                visible: false
            });
        resetAnimation2();
        translatePoint(destPoint, trans, 0);
        translateLine(supplyLine22, trans);
        supplyLine22.setAttribute({
            withLabel: true,
            offset: [125, -85]
        });
        glider22.showElement();
        dashedLinesVisibility(dashes22, true);
        moveDashedLines(dashes22, destPoint);
        brd2.update();
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
