var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, GS, ISD2, DGD1, DGD1Fixed; // Board 1
    var brd2, GD, IDS2, DGD3, DGD3Fixed; // Board 2
    var config = window.MacroSettings || {
            supplyGliderCoords: [8.0, 8.0],
            demandGliderCoords: [3.5, 8.0]
        };

    function init() {
        MacroLib.init(MacroLib.TWO_BOARDS);
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-3, 12, 12, -2],
            xname: 'Quantity of Wheat',
            yname: 'Price of<br>Wheat',
            xpos: [6, -1],
            ypos: [-2.6, 11]
        });

        // Demand Line 1 - fixed
        var D1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>1</sub>',
            color: 'DodgerBlue'
        });
        D1.setAttribute({
            'fixed': true,
            'highlight': false
        });
        translateLine(D1, [-1, -1]);

        // Demand Line 2 - fixed
        var D2 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>2</sub>',
            color: 'DodgerBlue'
        });
        D2.setAttribute({
            'fixed': true,
            'highlight': false
        });
        translateLine(D2, [1, 1]);

         // Supply Line - fixed
        var S = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S',
            color: 'Orange'
        });
        S.setAttribute({
            'fixed': true,
            'highlight': false
        });

        // Intersection of Supply and Demand Line 1
        var ISD1 = brd1.create('intersection', [S, D1, 0], {
            visible: false
        });

        // Intersection of Supply and Demand Line 2
        ISD2 = brd1.create('intersection', [S, D2, 0], {
            visible: false
        });

        // Glider on Supply Line, initially positioned ay ISD1
        GS = brd1.create('glider', [ISD1.X(), ISD1.Y(), S], {
            visible: false
        });

        // Dashes to x, y axes for Supply Line glider point
        DGD1 = MacroLib.createDashedLines2Axis(brd1, GS, {
            withLabel: false,
            xlabel: 'Q<sub>1</sub>',
            xoffsets: [5, 15],
            ylabel: 'P<sub>1</sub>',
            yoffsets: [5, 15],
            color: 'Gray',
            visible: false
        });

        // Same as above but fixed and initially hidden
        DGD1Fixed = MacroLib.createDashedLines2Axis(brd1, GS, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            xoffsets: [5, 15],
            ylabel: 'P<sub>1</sub>',
            yoffsets: [5, 15],
            color: 'Gray',
            visible: false
        });
        // dashedLinesVisibility(DGD1Fixed, false);

        // Dashes to x, y axes for Intersection of Supply and Demand Line 2
        var DGD2 = MacroLib.createDashedLines2Axis(brd1, ISD2, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            xoffsets: [5, 15],
            ylabel: 'P<sub>2</sub>',
            yoffsets: [5, 15],
            color: 'Gray'
        });

        ////////////
        // BOARD 2
        ////////////
        brd2 = MacroLib.createBoard('jxgbox2', {
            bboxlimits: [-3, 12, 12, -2],
            xname: 'Quantity of Wheat',
            yname: 'Price of<br>Wheat',
            xpos: [6, -1],
            ypos: [-2.6, 11]
        });

        // Supply Line 1 - fixed
        var S1 = MacroLib.createLine(brd2, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'Orange'
        });
        S1.setAttribute({
            'fixed': true,
            'highlight': false
        });
        translateLine(S1, [1, -1]);

        // Supply Line 2 - fixed
        var S2 = MacroLib.createLine(brd2, {
            ltype: 'Supply',
            name: 'S<sub>2</sub?',
            color: 'Orange'
        });
        S2.setAttribute({
            'fixed': true,
            'highlight': false
        });
        translateLine(S2, [-1, 1]);

         // Demand Line - fixed
        var D = MacroLib.createLine(brd2, {
            ltype: 'Demand',
            name: 'D',
            color: 'DodgerBlue'
        });
        D.setAttribute({
            'fixed': true,
            'highlight': false
        });

        // Intersection of Demand and Supply Line 1
        var IDS1 = brd2.create('intersection', [D, S1, 0], {
            visible: false
        });

        // Intersection of Demand and Supply Line 2
        IDS2 = brd2.create('intersection', [D, S2, 0], {
            visible: false
        });

        // Glider on Demand Line, initially positioned at IDS1
        GD = brd2.create('glider', [IDS1.X(), IDS1.Y(), D], {
            visible: false
        });

        // Dashes to x, y axes for Demand Line glider point
        DGD3 = MacroLib.createDashedLines2Axis(brd2, GD, {
            withLabel: false,
            xlabel: 'Q<sub>1</sub>',
            xoffsets: [5, 15],
            ylabel: 'P<sub>1</sub>',
            yoffsets: [5, 15],
            color: 'Gray'
        });

        // Same as above but fixed and initially hidden
        DGD3Fixed = MacroLib.createDashedLines2Axis(brd2, GD, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            xoffsets: [5, 15],
            ylabel: 'P<sub>1</sub>',
            yoffsets: [5, 15],
            color: 'Gray',
            visible: false
        });
        // dashedLinesVisibility(DGD1Fixed, false);


        // Dashes to x, y axes for Intersection of Demand and Supply Line 2
        var DGD4 = MacroLib.createDashedLines2Axis(brd2, IDS2, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            xoffsets: [5, 15],
            ylabel: 'P<sub>2</sub>',
            yoffsets: [5, 15],
            color: 'Gray'
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var animABtn = document.getElementById('animABtn');
    var animBBtn = document.getElementById('animBBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    // Interactivity
    if (animABtn) {
        animABtn.addEventListener('click', equilibrium1);
    }
    if (animBBtn) {
        animBBtn.addEventListener('click', equilibrium2);
    }
    if (resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', resetAnimation);
    }

    // Supply lines are y = ax + b with a = 1 and b = 0
    // Demand lines are y = ax + b with a = -1 and b = 11.5
    function equilibrium1() {
        resetAnimation();
        brd1.update();
        dashedLinesVisibility(DGD1Fixed, true);
        // Supply glider and associated dashed lines
        GS.moveTo([ISD2.X(), ISD2.Y()], 1000);
        DGD1.X1.moveTo([ISD2.X(), 0], 1000, {
            callback: changeDashedLinesLabels1
        });
        DGD1.X2.moveTo([ISD2.X(), ISD2.Y()], 1000);
        DGD1.Y1.moveTo([0, ISD2.Y()], 1000);
        DGD1.Y2.moveTo([ISD2.X(), ISD2.Y()], 1000);

        brd1.update();
    }

    function equilibrium2() {
        resetAnimation();
        brd2.update();
        dashedLinesVisibility(DGD3Fixed, true);
        // Demand glider and associated dashed lines
        GD.moveTo([IDS2.X(), IDS2.Y()], 1000);
        DGD3.X1.moveTo([IDS2.X(), 0], 1000, {
            callback: changeDashedLinesLabels2
        });
        DGD3.X2.moveTo([IDS2.X(), IDS2.Y()], 1000);
        DGD3.Y1.moveTo([0, IDS2.Y()], 1000);
        DGD3.Y2.moveTo([IDS2.X(), IDS2.Y()], 1000);

        brd1.update();
    }

    function changeDashedLinesLabels1() {
        DGD1.X1.setAttribute({
            withLabel: false
        });
        DGD1.Y1.setAttribute({
            withLabel: false
        });
    }

    function changeDashedLinesLabels2() {
        DGD3.X1.setAttribute({
            withLabel: false
        });
        DGD3.Y1.setAttribute({
            withLabel: false
        });
    }

    function dashedLinesVisibility(object, visible) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (visible) {
                    object[property].showElement();
                }
                else {
                    object[property].hideElement();
                }
            }
        }
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(brd1);
        JXG.JSXGraph.freeBoard(brd2);
        init();
    }

    function translatePoint(pt, trans) {
        return [pt.X() + trans[0], pt.Y() + trans[1]];
    }

    function translateLine(line, trans) {
        line.point1.moveTo(translatePoint(line.point1, trans));
        line.point2.moveTo(translatePoint(line.point2, trans));
    }

    init();

})(JXG, MacroLib, undefined);
