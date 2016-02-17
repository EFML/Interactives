var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, AD2, G;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.5, 12, 12, -1.2],
            xname: 'Real GDP',
            yname: 'Price<br>Level'
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

        G = brd1.create('glider', [6.0, 6.0, AD2], {
            name: 'A'
        });

        brd1.on('down', function() {
            AD2.setAttribute({
                withLabel: true,
                offset: [125, -85]
            });
            brd1.update();
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var increaseInterestRateBtn = document.getElementById('increaseInterestRateBtn');
    var higherPriceLevelBtn = document.getElementById('higherPriceLevelBtn');
    var decreaseGovernmentSpendingBtn = document.getElementById('decreaseGovernmentSpendingBtn');
    var increaseRealBalancesBtn = document.getElementById('increaseRealBalancesBtn');
    var increaseExportsBtn = document.getElementById('increaseExportsBtn');
    var increasePersonalIncomeTaxesBtn = document.getElementById('increasePersonalIncomeTaxesBtn');
    var increaseConsumerConfidenceBtn = document.getElementById('increaseConsumerConfidenceBtn');

    var decreaseABtn = document.getElementById('decreaseABtn');
    var increaseABtn = document.getElementById('increaseABtn');
    var decreaseXYBtn = document.getElementById('decreaseXYBtn');
    var increaseXYBtn = document.getElementById('increaseXYBtn');

    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    //Interactivity
    if (increaseInterestRateBtn) {
        increaseInterestRateBtn.addEventListener('click', decreaseXY);
    }
    if (higherPriceLevelBtn) {
        higherPriceLevelBtn.addEventListener('click', increaseA);
    }
    if (decreaseGovernmentSpendingBtn) {
        decreaseGovernmentSpendingBtn.addEventListener('click', decreaseXY);
    }
    if (increaseRealBalancesBtn) {
        increaseRealBalancesBtn.addEventListener('click', decreaseA);
    }
    if (increaseExportsBtn) {
        increaseExportsBtn.addEventListener('click', increaseXY);
    }
    if (increasePersonalIncomeTaxesBtn) {
        increasePersonalIncomeTaxesBtn.addEventListener('click', decreaseXY);
    }
    if (increaseConsumerConfidenceBtn) {
        increaseConsumerConfidenceBtn.addEventListener('click', increaseXY);
    }

    if (decreaseABtn) {
        decreaseABtn.addEventListener('click', decreaseA);
    }
    if (increaseABtn) {
        increaseABtn.addEventListener('click', increaseA);
    }
    if (decreaseXYBtn) {
        decreaseXYBtn.addEventListener('click', decreaseXY);
    }
    if (increaseXYBtn) {
        increaseXYBtn.addEventListener('click', increaseXY);
    }

    if (resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', resetAnimation);
    }

    //Animation for shifting curve SouthWest
    function decreaseXY() {
        resetAnimation();
        brd1.update();
        AD2.point1.moveTo([1.0, 9.0], 1000);
        AD2.point2.moveTo([9.0, 1.0], 1000);
        AD2.setAttribute({
            withLabel: true,
            offset: [125, -85]
        });
        brd1.update();
    }

    //Animation for shifting curve NorthEast
    function increaseXY() {
        resetAnimation();
        brd1.update();
        AD2.point1.moveTo([3.0, 11.0], 1000);
        AD2.point2.moveTo([11.0, 3.0], 1000);
        AD2.setAttribute({
            withLabel: true,
            offset: [125, -85]
        });
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

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
