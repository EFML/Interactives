var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, D2, dashD2, G1, G2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        var bboxlimits = [-1.6, 12, 12, -1.1];
        var brd1 = JXG.JSXGraph.initBoard('jxgbox1', {
            axis: false,
            showCopyright: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            boundingbox: bboxlimits,
            grid: false,
            hasMouseUp: true,
        });

        var xaxis = brd1.create('axis', [
            [0, 0],
            [12, 0]
        ], {
            withLabel: true,
            label: {
                offset: [320, -20]
            }
        });
        var yaxis = brd1.create('axis', [
            [0, 0],
            [0, 12]
        ], {
            withLabel: true,
            label: {
                offset: [-60, 260]
            }
        });

        //Axes
        xaxis.removeAllTicks();
        yaxis.removeAllTicks();
        var ylabel = brd1.create('text', [-1.5, 10, 'Interest<br>Rate'], {
            fixed: true
        });
        var xlabel = brd1.create('text', [8, -0.5, 'Quantity of Money'], {
            fixed: true
        });

        //Demand 1
        var D1 = MacroLib.createDemand(brd1, {
            name: 'D<sub>1</sub>',
            color: 'Gray'
        });
        D1.setAttribute({
            fixed: true,
            dash: 1
        });
        G1 = brd1.create('glider', [6.0, 6.0, D1], {
            fixed: true,
            visible: false
        });

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashD1 = MacroLib.createDashedLines2Axis(brd1, G1, {
            fixed: true,
            withLabel: true,
            xlabel: 'Y<sub>1</sub>',
            ylabel: 'R<sub>1</sub>',
            color: 'Gray'
        });


        //Demand 2
        D2 = MacroLib.createDemand(brd1, {
            name: 'D<sub>2</sub>',
            color: 'DodgerBlue'
        });
        D2.setAttribute({
            withLabel: false,
            offset: [125, -85]
        });

        //Glider along demand curve
        G2 = brd1.create('glider', [6.0, 6.0, D2], {
            name: 'A',
            withLabel: false,
            fixed: true
        });

        ////////////
        // Draggable Dashed Lines for Board 1
        ////////////
        dashD2 = MacroLib.createDashedLines2Axis(brd1, G2, {
            fixed: false,
            withLabel: false,
            xlabel: 'Y<sub>2</sub>',
            ylabel: '',
            color: 'DodgerBlue'
        });

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines in Board 1
            dashD2.Y1.moveTo([0, G2.Y()]);
            dashD2.Y2.moveTo([G2.X(), G2.Y()]);

            dashD2.X1.moveTo([G2.X(), 0]);
            dashD2.X2.moveTo([G2.X(), G2.Y()]);
            brd1.update();
        });

        brd1.on('mousedown', function() {
            toggleLabels(true);
            brd1.update();
        });
    }

    function toggleLabels(toggle) {
        dashD2.X1.setAttribute({
            withLabel: toggle
        });
        dashD2.Y1.setAttribute({
            withLabel: toggle
        });
        D2.setAttribute({
            withLabel: toggle
        });
    }

    //Animation for shifting curve SouthWest
    function decreaseXY() {
        resetAnimation();
        brd1.update();

        var speed = 1000;
        toggleLabels(true);

        D2.point1.moveTo([D2.point1.X() - 1.5, D2.point1.Y()], speed);
        D2.point2.moveTo([D2.point2.X() - 1.5, D2.point2.Y()], speed);

        dashD2.Y1.moveTo([0, G2.Y()], speed);
        dashD2.Y2.moveTo([G2.X() - 1.5, G2.Y()], speed);

        dashD2.X1.moveTo([G2.X() - 1.5, 0], speed);
        dashD2.X2.moveTo([G2.X() - 1.5, G2.Y()], speed);

        brd1.update();
    }

    //Animation for shifting curve NorthEast
    function increaseXY() {
        var speed = 1000;
        resetAnimation();
        toggleLabels(true);
        brd1.update();

        D2.point1.moveTo([D2.point1.X() + 1.5, D2.point1.Y()], speed);
        D2.point2.moveTo([D2.point2.X() + 1.5, D2.point2.Y()], speed);

        dashD2.Y1.moveTo([0, G2.Y()], speed);
        dashD2.Y2.moveTo([G2.X() + 1.5, G2.Y()], speed);

        dashD2.X1.moveTo([G2.X() + 1.5, 0], speed);
        dashD2.X2.moveTo([G2.X() + 1.5, G2.Y()], speed);

        brd1.update();
    }

    function resetAnimation(speed) {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    }

    init();

})(JXG, MacroLib, undefined);
