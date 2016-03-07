(function(JXG, MacroLib) {
    'use strict';
    var brd1, dashS1, S, iSD;

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
            name: 'M<sub>D1</sub>',
            color: 'orange'
        });

        ////////////
        //LRAS - straight line
        ////////////
        var Sx1 = 5.75;
        var Sx2 = Sx1;
        var Sy1 = 0.5;
        var Sy2 = 10.5;

        var Sfix = brd1.create('segment', [
            [5.75, 10.5],
            [5.75, 0.5]
        ], {
            strokeColor: 'gray',
            strokeWidth: '5',
            name: 'M<sub>S1</sub>',
            withLabel: true,
            dash: 1,
            label: {
                offset: [-10, 180]
            }
        });

        S = brd1.create('segment', [
            [5.75, 10.5],
            [5.75, 0.5]
        ], {
            strokeColor: 'dodgerblue',
            strokeWidth: '5',
            name: 'M<sub>S2</sub>',
            withLabel: false,
            label: {
                offset: [-10, 180]
            }
        });

        var iSDfix = brd1.create('intersection', [Sfix, D1, 0], {
            visible: false
        });

        iSD = brd1.create('intersection', [S, D1, 0], {
            visible: false
        });

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        dashS1 = MacroLib.createDashedLines2Axis(brd1, iSD, {
            withLabel: false,
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'R<sub>2</sub>',
            color: 'gray'
        });

        var dashSfix = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: 'R<sub>1</sub>',
            color: 'gray'
        });
    }

    var delta = 2.0;

    function toggleLabels(toggle) {
        dashS1.X1.setAttribute({
            withLabel: toggle
        });
        dashS1.Y1.setAttribute({
            withLabel: toggle
        });
        S.setAttribute({
            withLabel: toggle
        });
    }

    //Animation for shifting curve SouthWest
    function decreaseXY() {
        resetAnimation();
        brd1.update();

        var speed = 1000;
        toggleLabels(true);

        S.point1.moveTo([S.point1.X() - delta, S.point1.Y()], speed);
        S.point2.moveTo([S.point2.X() - delta, S.point2.Y()], speed);

        dashS1.Y1.moveTo([0, iSD.Y() + delta], speed);
        dashS1.Y2.moveTo([iSD.X() - delta, iSD.Y() + delta], speed);

        dashS1.X1.moveTo([iSD.X() - delta, 0], speed);
        dashS1.X2.moveTo([iSD.X() - delta, iSD.Y() + delta], speed);

        brd1.update();
    }

    //Animation for shifting curve NorthEast
    function increaseXY() {
        var speed = 1000;
        resetAnimation();
        toggleLabels(true);

        S.point1.moveTo([S.point1.X() + delta, S.point1.Y()], speed);
        S.point2.moveTo([S.point2.X() + delta, S.point2.Y()], speed);

        dashS1.Y1.moveTo([0, iSD.Y() - delta], speed);
        dashS1.Y2.moveTo([iSD.X() + delta, iSD.Y() - delta], speed);

        dashS1.X1.moveTo([iSD.X() + delta, 0], speed);
        dashS1.X2.moveTo([iSD.X() + delta, iSD.Y() - delta], speed);

        brd1.update();
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var startAnimationBtn = document.getElementById('startAnimationBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    startAnimationBtn.addEventListener('click', decreaseXY);
    resetAnimationBtn.addEventListener('click', resetAnimation);

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
