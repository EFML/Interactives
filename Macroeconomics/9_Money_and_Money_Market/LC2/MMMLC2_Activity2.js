var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, AD2, G;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // brd1 1
        ////////////
        var bboxlimits = [-1.85, 12, 12, -1.1];
        brd1 = JXG.JSXGraph.initBoard('jxgbox1', {
            axis: false,
            showCopyright: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            boundingbox: bboxlimits,
            grid: false,
            hasMouseUp: true,
        });

        var xaxis1 = brd1.create('axis', [
            [0, 0],
            [11, 0]
        ], {
            withLabel: false
        });
        var yaxis1 = brd1.create('axis', [
            [0, 0],
            [0, 11]
        ], {
            withLabel: false
        });

        //Axes
        xaxis1.removeAllTicks();
        yaxis1.removeAllTicks();
        var xlabel1 = brd1.create('text', [-1.75, 10, "Nominal<br>Interest<br>Rate"], {
            fixed: true
        });
        var ylabel1 = brd1.create('text', [8, -0.5, "Quantity of Money"], {
            fixed: true
        });


        //Demand Line 1 - fixed
        var AD1 = MacroLib.createDemand(brd1, {
            color: 'Gray'
        });
        AD1.setAttribute({
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        //Demand Line 2 - moveable
        var AD2 = MacroLib.createDemand(brd1, {
            name: 'AD<sub>1</sub>',
            color: 'DodgerBlue'
        });
        AD2.setAttribute({
            withLabel: true,
            'highlight': true
        });

        var original = AD2;

        G = brd1.create('glider', [6.75, 6.75, AD2], {
            name: 'A'
        });

        brd1.on('mousedown', function() {
            brd1.update()
        });
    }

    //Animation for shifting curve SouthWest
    function decreaseXY() {
        resetAnimation();
        brd1.update();
        AD2.point1.moveTo([1.0, 8.5], 1000);
        AD2.point2.moveTo([8.5, 1.0], 1000);
        brd1.update();
    }

    //Animation for shifting curve NorthEast
    function increaseXY() {
        resetAnimation();
        brd1.update();
        AD2.point1.moveTo([3.0, 10.5], 1000);
        AD2.point2.moveTo([10.5, 3.0], 1000);
        brd1.update();
    }

    function increaseA() {
        resetAnimation();
        brd1.update();
        G.moveTo([4.0, 8.0], 1000);
        brd1.update();
    }

    function decreaseA() {
        resetAnimation();
        brd1.update();
        G.moveTo([8.0, 4.0], 1000);
        brd1.update();
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var animationEconomicsEffectBtn = document.getElementById('animationEconomicsEffectBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    //Interactivity
    animationEconomicsEffectBtn.addEventListener('click', increaseA);
    resetAnimationBtn.addEventListener('click', resetAnimation);

    init();

})(JXG, MacroLib, undefined);
