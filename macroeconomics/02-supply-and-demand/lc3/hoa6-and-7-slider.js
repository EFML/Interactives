var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, demandLine11, demandLine12, supplyLine, glider11, glider12, dashes11, dashes12, demandSlider; // Board 1
    var brd2, supplyLine21, supplyLine22, demandLine, glider21, glider22, dashes21, dashes22, supplySlider; // Board 2

    function init1() {
        MacroLib.init(MacroLib.TWO_BOARDS);

        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-3, 12, 12, -2],
            xname: 'Quantity of Wheat',
            yname: 'Price of<br>Wheat',
            xpos: [6, -0.5],
            ypos: [-2.6, 11]
        });

        // Demand Line 1 - fixed
        demandLine11 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>1</sub>',
            color: 'Gray'
        });
        demandLine11.setAttribute({
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        // Demand Line 2 - moveable
        demandLine12 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>2</sub>',
            color: 'DodgerBlue'
        });
        demandLine12.setAttribute({
            withLabel: false
        });

        // Supply Line - fixed
        supplyLine = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S',
            color: 'Orange'
        });
        supplyLine.setAttribute({
            'fixed': true,
            'highlight': false
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
            xoffsets: [5, 12],
            ylabel: 'P<sub>1</sub>',
            yoffsets: [5, 12],
            color: 'Gray'
        });

        // Dashes to x, y axes for glider 2
        dashes12 = MacroLib.createDashedLines2Axis(brd1, glider12, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            xoffsets: [5, 12],
            ylabel: 'P<sub>2</sub>',
            yoffsets: [5, 12],
            color: 'Gray'
        });
        dashedLinesVisibility(dashes12, false);

        // Slider
        demandSlider = brd1.create('slider', [
            [3.75, -1.4],
            [7.75, -1.4],
            [-1.0, 0.0, 1.0]
        ], {
            withLabel: false,
            snapWidth: 0.01,
            color: 'DodgerBlue'
        });

        demandSlider.on('mousedown', function() {
            demandLine12.setAttribute({
                withLabel: true,
                offset: [125, -85]
            });
            glider12.showElement();
            dashedLinesVisibility(dashes12, true);
        });

        demandSlider.on('drag', function() {
            var t = demandSlider.Value();
            shiftDemand([t, t]);
        });
    }

    function init2() {
        MacroLib.init(MacroLib.TWO_BOARDS);

        brd2 = MacroLib.createBoard('jxgbox2', {
            bboxlimits: [-3, 12, 12, -2],
            xname: 'Quantity of Wheat',
            yname: 'Price of<br>Wheat',
            xpos: [6, -0.46],
            ypos: [-2.6, 11]
        });

        // Supply Line 1 - fixed
        supplyLine21 = MacroLib.createLine(brd2, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'Gray'
        });
        supplyLine21.setAttribute({
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        // Supply Line 2 - moveable
        supplyLine22 = MacroLib.createSupply(brd2, {
            ltype: 'Supply',
            name: 'S<sub>2</sub>',
            color: 'Orange'
        });
        supplyLine22.setAttribute({
            withLabel: false
        });

        // Demand Line - fixed
        demandLine = MacroLib.createLine(brd2, {
            ltype: 'Demand',
            name: 'D',
            color: 'DodgerBlue'
        });
        demandLine.setAttribute({
            'fixed': true,
            'highlight': false
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
            xoffsets: [5, 12],
            ylabel: 'P<sub>1</sub>',
            yoffsets: [5, 12],
            color: 'Gray'
        });

        // Dashes to x, y axes for glider 2
        dashes22 = MacroLib.createDashedLines2Axis(brd2, glider22, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            xoffsets: [5, 12],
            ylabel: 'P<sub>2</sub>',
            yoffsets: [5, 12],
            color: 'Gray'
        });
        dashedLinesVisibility(dashes22, false);

        // Slider
        supplySlider = brd2.create('slider', [
            [3.75, -1.4],
            [7.75, -1.4],
            [-1.0, 0.0, 1.0]
        ], {
            withLabel: false,
            snapWidth: 0.01,
            color: 'Orange'
        });

        supplySlider.on('mousedown', function() {
            supplyLine22.setAttribute({
                withLabel: true,
                offset: [125, -85]
            });
            glider22.showElement();
            dashedLinesVisibility(dashes22, true);
        });

        supplySlider.on('drag', function() {
            var t = supplySlider.Value();
            shiftSupply([t, -t]);
        });
    }

    function init() {
        init1();
        init2();
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimation1Btn = document.getElementById('resetAnimation1Btn');
    var resetAnimation2Btn = document.getElementById('resetAnimation2Btn');

    //Interactivity
    if (resetAnimation1Btn) {
        resetAnimation1Btn.addEventListener('click', resetAnimation1);
    }
    if (resetAnimation2Btn) {
        resetAnimation2Btn.addEventListener('click', resetAnimation2);
    }

    // Board 1
    // Demand lines are y = ax + b with a = -1 and b = 11.5. Middle of line segment: (5.75, 5.75)

    function shiftDemand(trans) {
        var destPt0 = brd1.create('point', [glider11.X() + trans[0], glider11.Y() + trans[1]], {
                visible: false
            }),
            destPt1 = brd1.create('point', [demandLine11.point1.X() + trans[0], demandLine11.point1.Y() + trans[1]], {
                visible: false
            }),
            destPt2 = brd1.create('point', [demandLine11.point2.X() + trans[0], demandLine11.point2.Y() + trans[1]], {
                visible: false
            });
        moveLine(demandLine12, destPt1, destPt2, 0);
        moveDashedLines(dashes12, destPt0, 0);
        brd1.update();
    }

    function resetAnimation1() {
        JXG.JSXGraph.freeBoard(brd1);
        init1();
    }

    // Board 2
    // Supply lines are y = ax + b with a = 1 and b = 0. Middle of line segment: (5.75, 5.75)

    function shiftSupply(trans) {
        var destPt0 = brd2.create('point', [glider21.X() + trans[0], glider21.Y() + trans[1]], {
                visible: false
            }),
            destPt1 = brd2.create('point', [supplyLine21.point1.X() + trans[0], supplyLine21.point1.Y() + trans[1]], {
                visible: false
            }),
            destPt2 = brd2.create('point', [supplyLine21.point2.X() + trans[0], supplyLine21.point2.Y() + trans[1]], {
                visible: false
            });
        moveLine(supplyLine22, destPt1, destPt2, 0);
        moveDashedLines(dashes22, destPt0, 0);
        brd2.update();
    }

    function resetAnimation2() {
        JXG.JSXGraph.freeBoard(brd2);
        init2();
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
