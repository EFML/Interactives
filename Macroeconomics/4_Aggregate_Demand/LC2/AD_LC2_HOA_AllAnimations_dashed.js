var Macro = (function(JXG, MacroLib) {
    'use strict';
    var animationSpeed, curveShift, brd1, AD2, dashD2, G, D2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        animationSpeed = 1000;
        curveShift = 1.5;
            ////////////
            // BOARD 1
            ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: 'Real GDP',
            yname: 'Price<br>Level',
            grid: false,
            'xpos': [8, -0.5]
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'AD<sub>1</sub>',
            color: 'Gray'
        });
        AD1.setAttribute({
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        //Demand Line 2 - moveable
        AD2 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'AD<sub>2</sub>',
            color: 'DodgerBlue'
        });
        AD2.setAttribute({
            withLabel: false
        });

        var Gfix = brd1.create('glider', [6.0, 6.0, AD1], {
            fixed: true,
            visible: false
        });
        G = brd1.create('glider', [6.0, 6.0, AD2], {
            name: 'A'
        });

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashD1 = MacroLib.createDashedLines2Axis(brd1, Gfix, {
            fixed: true,
            withLabel: true,
            xlabel: 'R<sub>1</sub>',
            ylabel: 'P<sub>1</sub>',
            color: 'Gray'
        });


        ////////////
        // Draggable Dashed Lines for Board 1
        ////////////
        dashD2 = MacroLib.createDashedLines2Axis(brd1, G, {
            fixed: false,
            withLabel: false,
            xlabel: 'R<sub>2</sub>',
            ylabel: 'P<sub>2</sub>',
            color: 'DarkGray'
        });

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines in Board 1
            dashD2.Y1.moveTo([0, G.Y()]);
            dashD2.Y2.moveTo([G.X(), G.Y()]);

            dashD2.X1.moveTo([G.X(), 0]);
            dashD2.X2.moveTo([G.X(), G.Y()]);
            brd1.update();
        });

        brd1.on('mousedown', function() {
            toggleLabels(true);
            brd1.update();
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var increaseABtn = document.getElementById('increaseABtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    increaseABtn.addEventListener('click', increaseA);
    resetAnimationBtn.addEventListener('click', function() {
        resetAnimation();
    });

    function toggleLabels(toggle) {
        dashD2.X1.setAttribute({
            withLabel: toggle
        });
        dashD2.Y1.setAttribute({
            withLabel: toggle
        });
        AD2.setAttribute({
            withLabel: toggle
        });
    }

    //Animation for shifting curve SouthWest
    function decreaseXY() {
        resetAnimation();
        brd1.update();

        toggleLabels(true);

        D2.point1.moveTo([D2.point1.X() - curveShift, D2.point1.Y() - curveShift], animationSpeed);
        D2.point2.moveTo([D2.point2.X() - curveShift, D2.point2.Y() - curveShift], animationSpeed);

        dashD2.Y1.moveTo([0, G.Y() - curveShift], animationSpeed);
        dashD2.Y2.moveTo([G.X() - curveShift, G.Y() - curveShift], animationSpeed);

        dashD2.X1.moveTo([G.X() - curveShift, 0], animationSpeed);
        dashD2.X2.moveTo([G.X() - curveShift, G.Y() - curveShift], animationSpeed);

        brd1.update();
    }

    //Animation for shifting curve NorthEast
    function increaseXY() {
        resetAnimation();
        toggleLabels(true);
        brd1.update();

        AD2.point1.moveTo([AD2.point1.X() + curveShift, AD2.point1.Y() + curveShift], animationSpeed);
        AD2.point2.moveTo([AD2.point2.X() + curveShift, AD2.point2.Y() + curveShift], animationSpeed);

        dashD2.Y1.moveTo([0, G.Y() + curveShift], animationSpeed);
        dashD2.Y2.moveTo([G.X() + curveShift, G.Y() + curveShift], animationSpeed);

        dashD2.X1.moveTo([G.X() + curveShift, 0], animationSpeed);
        dashD2.X2.moveTo([G.X() + curveShift, G.Y() + curveShift], animationSpeed);

        brd1.update();
    }

    function increaseA() {
        resetAnimation();
        brd1.update();

        toggleLabels(true);
        G.moveTo([G.X() - curveShift, G.X() + curveShift], 1000);

        dashD2.Y1.moveTo([0, G.Y() + curveShift], animationSpeed);
        dashD2.Y2.moveTo([G.X() - curveShift, G.Y() + curveShift], animationSpeed);

        dashD2.X1.moveTo([G.X() - curveShift, 0], animationSpeed);
        dashD2.X2.moveTo([G.X() - curveShift, G.Y() + curveShift], animationSpeed);

        brd1.update();
    }

    function decreaseA() {
        resetAnimation();
        brd1.update();

        toggleLabels(true);
        G.moveTo([G.X() + curveShift, G.X() - curveShift], 1000);

        dashD2.Y1.moveTo([0, G.Y() - curveShift], animationSpeed);
        dashD2.Y2.moveTo([G.X() + curveShift, G.Y() - curveShift], animationSpeed);

        dashD2.X1.moveTo([G.X() + curveShift, 0], animationSpeed);
        dashD2.X2.moveTo([G.X() + curveShift, G.Y() - curveShift], animationSpeed);

        brd1.update();
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    }

    init();

})(JXG, MacroLib, undefined);
