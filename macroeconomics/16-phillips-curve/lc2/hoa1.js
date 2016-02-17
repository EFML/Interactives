var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, SRPC2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.5, 12, 12, -1],
            xname: 'UR',
            yname: '\u03c0' // fontSize: 24,
        });

        //Supply Line 1 - fixed
        var SRPC1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'SRPC1',
            color: 'Gray'
        });
        SRPC1.setAttribute({
            dash: 1,
        });

        //Supply Line 1 - fixed
        SRPC2 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'SRPC2',
            color: 'DodgerBlue'
        });
        SRPC2.setAttribute({
            'withLabel': false,
            'highlight': false
        });
    }

    //Animation for Inflationary Expectations
    function increaseInfExpect() {
        SRPC2.point1.moveTo([3.0, 10.5], 1000);
        SRPC2.point2.moveTo([10.5, 3.0], 1000);
        SRPC2.setAttribute({
            withLabel: true
        });
        brd1.update();
    }

    //Animation for Increase in Key Input Price (same as Inf. Expectations)
    function increaseKeyInputPrice() {
        SRPC2.point1.moveTo([3.0, 10.5], 1000);
        SRPC2.point2.moveTo([10.5, 3.0], 1000);
        SRPC2.setAttribute({
            withLabel: true
        });
        brd1.update();
    }

    //Animation for Unknown Condition
    function increaseLaborProd() {
        SRPC2.setAttribute({
            withLabel: true
        });
        SRPC2.point1.moveTo([1.0, 8.5], 1000);
        SRPC2.point2.moveTo([8.5, 1.0], 1000);
        SRPC2.setAttribute({
            withLabel: true
        });
        brd1.update();
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var increaseLaborProdBtn = document.getElementById('increaseLaborProdBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    increaseLaborProdBtn.addEventListener('click', increaseLaborProd);

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
