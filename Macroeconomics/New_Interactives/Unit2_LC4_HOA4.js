var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, GS, ISD2, DGD1, DGD1Fixed;
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
        // Supply glider and associated dashed lines
        GS.moveTo([ISD2.X(), ISD2.Y()], 1000);
        DGD1.X1.moveTo([ISD2.X(), 0], 1000, {
            callback: changeDashedLinesLabels
        });
        DGD1.X2.moveTo([ISD2.X(), ISD2.Y()], 1000);
        DGD1.Y1.moveTo([0, ISD2.Y()], 1000);
        DGD1.Y2.moveTo([ISD2.X(), ISD2.Y()], 1000);

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
