var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, GS, GD, ISD, DGS, DGD;
    var config = window.MacroSettings || {
            supplyGliderCoords: [8.0, 8.0],
            demandGliderCoords: [3.5, 8.0]
        },
        GSx = config.supplyGliderCoords[0],
        GSy = config.supplyGliderCoords[1],
        GDx = config.demandGliderCoords[0],
        GDy = config.demandGliderCoords[1];

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

        // Supply Line -- fixed
        var S = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S',
            color: 'Orange'
        });
        S.setAttribute({
            'fixed': true,
            'highlight': false
        });

        // Demand Line  - fixed
        var D = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D',
            color: 'DodgerBlue'
        });
        D.setAttribute({
            'fixed': true,
            'highlight': false
        });

        // Glider on Supply Line
        GS = brd1.create('glider', [GSx, GSy, S], {
            visible: false
        });

        // Glider on Demand Line
        GD = brd1.create('glider', [GDx, GDy, D], {
            visible: false
        });

        // Dashes to x, y axes for previous Supply Line glider point
        DGS = MacroLib.createDashedLines2Axis(brd1, GS, {
            withLabel: true,
            xlabel: 'QS',
            xoffsets: [5, 15],
            ylabel: 'P<sub>1</sub>',
            yoffsets: [5, 15],
            color: 'Gray'
        });

        // Dashes to x, y axes for previous Demand Line glider point
        DGD = MacroLib.createDashedLines2Axis(brd1, GD, {
            withLabel: true,
            xlabel: 'QD',
            xoffsets: [5, 15],
            ylabel: 'P<sub>1</sub>',
            yoffsets: [5, 15],
            color: 'Gray'
        });

        // Intersection of Supply and Demand Lines (equilibrium) - fixed
        ISD = brd1.create('intersection', [S, D, 0], {
            visible: false
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var animBtn = document.getElementById('animBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    //Interactivity
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
        // Supply glider and associated dashed lines
        GS.moveTo([ISD.X(), ISD.Y()], 1000);
        DGS.X1.moveTo([ISD.X(), 0], 1000, {
            callback: changeDashedLinesLabels
        });
        DGS.X2.moveTo([ISD.X(), ISD.Y()], 1000);
        DGS.Y1.moveTo([0, ISD.Y()], 1000);
        DGS.Y2.moveTo([ISD.X(), ISD.Y()], 1000);
        // Demand glider and associated dashed lines
        GD.moveTo([ISD.X(), ISD.Y()], 1000);
        DGD.X1.moveTo([ISD.X(), 0], 1000, {
            callback: changeDashedLinesLabels
        });
        DGD.X2.moveTo([ISD.X(), ISD.Y()], 1000);
        DGD.Y1.moveTo([0, ISD.Y()], 1000);
        DGD.Y2.moveTo([ISD.X(), ISD.Y()], 1000);

        brd1.update();
    }

    function changeDashedLinesLabels() {
        // Set both x labels of dashed lines to 'QE'
        DGS.X1.setAttribute({
            name: 'QE'
        });
        DGS.Y1.setAttribute({
            name: 'PE'
        });
        DGD.X1.setAttribute({
            name: 'QE'
        });
        DGD.Y1.setAttribute({
            name: 'PE'
        });
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    }

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
