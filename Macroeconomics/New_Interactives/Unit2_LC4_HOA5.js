var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, GD, IDS2, DGD1, DGD1Fixed;
    var config = window.MacroSettings || {
            supplyGliderCoords: [8.0, 8.0],
            demandGliderCoords: [3.5, 8.0]
        };

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity of Wheat',
            yname: 'Price of<br>Wheat',
            xpos: [8, -1],
            ypos: [-1.8, 11]
        });

        // Supply Line 1 - fixed
        var S1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'Orange'
        });
        S1.setAttribute({
            'fixed': true,
            'highlight': false
        });

        // Supply Line 2 - fixed
        var S2 = MacroLib.createLine(brd1, {
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
        var D = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D',
            color: 'DodgerBlue'
        });
        D.setAttribute({
            'fixed': true,
            'highlight': false
        });

        // Intersection of Demand and Supply Line 1
        var IDS1 = brd1.create('intersection', [D, S1, 0], {
            visible: false
        });

        // Intersection of Demand and Supply Line 2
        IDS2 = brd1.create('intersection', [D, S2, 0], {
            visible: false
        });

        // Glider on Demand Line, initially positioned at IDS1
        GD = brd1.create('glider', [IDS1.X(), IDS1.Y(), D], {
            visible: false
        });

        // Dashes to x, y axes for Demand Line glider point
        DGD1 = MacroLib.createDashedLines2Axis(brd1, GD, {
            withLabel: false,
            xlabel: 'Q<sub>1</sub>',
            xoffsets: [5, 15],
            ylabel: 'P<sub>1</sub>',
            yoffsets: [5, 15],
            color: 'Gray'
        });

        // Same as above but fixed and initially hidden
        DGD1Fixed = MacroLib.createDashedLines2Axis(brd1, GD, {
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
        var DGD2 = MacroLib.createDashedLines2Axis(brd1, IDS2, {
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
    var animBtn = document.getElementById('animBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    // Interactivity
    if (animBtn) {
        animBtn.addEventListener('click', equilibrium);
    }
    if (resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', resetAnimation);
    }

    // Supply lines are y = ax + b with a = 1 and b = 0
    // Demand lines are y = ax + b with a = -1 and b = 11.5
    function equilibrium() {
        resetAnimation();
        brd1.update();
        dashedLinesVisibility(DGD1Fixed, true);
        // Demand glider and associated dashed lines
        GD.moveTo([IDS2.X(), IDS2.Y()], 1000);
        DGD1.X1.moveTo([IDS2.X(), 0], 1000, {
            callback: changeDashedLinesLabels
        });
        DGD1.X2.moveTo([IDS2.X(), IDS2.Y()], 1000);
        DGD1.Y1.moveTo([0, IDS2.Y()], 1000);
        DGD1.Y2.moveTo([IDS2.X(), IDS2.Y()], 1000);

        brd1.update();
    }

    function changeDashedLinesLabels() {
        DGD1.X1.setAttribute({
            withLabel: false
        });
        DGD1.Y1.setAttribute({
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
