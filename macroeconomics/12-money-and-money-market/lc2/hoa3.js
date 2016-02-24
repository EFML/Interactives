var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, D2, dashD2, G;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2.5, 12, 12, -2],
            xname: 'Quantity<br>of Money',
            yname: 'Nominal<br>Interest<br>Rate'
        });

        //Demand 1
        var D1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>1</sub>',
            color: 'gray'
        });
        D1.setAttribute({
            dash: 1
        });
        G = brd1.create('glider', [6.0, 6.0, D1], {
            visible: false
        });

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashD1 = MacroLib.createDashedLines2Axis(brd1, G, {
            withLabel: true,
            xlabel: 'M<sub>1</sub>',
            ylabel: 'r<sub>1</sub>',
            color: 'gray'
        });


        //Demand 2
        D2 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>2</sub>',
            color: 'dodgerblue'
        });
        D2.setAttribute({
            withLabel: false,
            offset: [125, -85]
        });

        //Glider along demand curve
        G = brd1.create('glider', [6.0, 6.0, D2], {
            name: 'A',
            withLabel: false
        });

        ////////////
        // Draggable Dashed Lines for Board 1
        ////////////
        dashD2 = MacroLib.createDashedLines2Axis(brd1, G, {
            fixed: false,
            withLabel: false,
            xlabel: 'M<sub>2</sub>',
            ylabel: '',
            color: 'dodgerblue'
        });

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('drag', function() {
            //Moving Dashed Lines in Board 1
            dashD2.Y1.moveTo([0, G.Y()]);
            dashD2.Y2.moveTo([G.X(), G.Y()]);

            dashD2.X1.moveTo([G.X(), 0]);
            dashD2.X2.moveTo([G.X(), G.Y()]);
            brd1.update();
        });

        brd1.on('down', function() {
            toggleLabels(true);
            brd1.update();
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var riseMoneyDemandBtn = document.getElementById('riseMoneyDemandBtn');
    var fallMoneyDemandBtn = document.getElementById('fallMoneyDemandBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    riseMoneyDemandBtn.addEventListener('click', increaseXY);
    fallMoneyDemandBtn.addEventListener('click', decreaseXY);
    resetAnimationBtn.addEventListener('click', resetAnimation);

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

        D2.point1.moveTo([D2.point1.X() - 1.35, D2.point1.Y()], speed);
        D2.point2.moveTo([D2.point2.X() - 1.35, D2.point2.Y()], speed);

        dashD2.Y1.moveTo([0, G.Y()], speed);
        dashD2.Y2.moveTo([G.X() - 1.35, G.Y()], speed);

        dashD2.X1.moveTo([G.X() - 1.35, 0], speed);
        dashD2.X2.moveTo([G.X() - 1.35, G.Y()], speed);

        brd1.update();
    }

    //Animation for shifting curve NorthEast
    function increaseXY() {
        var speed = 1000;
        resetAnimation();
        toggleLabels(true);
        brd1.update();

        D2.point1.moveTo([D2.point1.X() + 1.35, D2.point1.Y()], speed);
        D2.point2.moveTo([D2.point2.X() + 1.35, D2.point2.Y()], speed);

        dashD2.Y1.moveTo([0, G.Y()], speed);
        dashD2.Y2.moveTo([G.X() + 1.35, G.Y()], speed);

        dashD2.X1.moveTo([G.X() + 1.35, 0], speed);
        dashD2.X2.moveTo([G.X() + 1.35, G.Y()], speed);

        brd1.update();
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    }

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
