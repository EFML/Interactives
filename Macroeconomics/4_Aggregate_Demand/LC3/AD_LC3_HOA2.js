var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        JXG.Options.point.showInfobox = false;

        ////////////
        // BOARD 1
        ////////////
        // var newBBox = [-1.5, 12, 12, -1.2];

        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: "Real GDP",
            yname: "Price<br>Level",
            grid: false,
            'xpos': [9, -0.5],
            'ypos': [-1.25, 10]
        });

        var c1 = [2.0, 9.5];
        var c2 = [9.5, 2.0];
        //Demand Line 1 - fixed
        var AD = MacroLib.createDemand(brd1, {
            c1: c1,
            c2: c2,
            name: 'AD',
            color: 'Gray'
        });
        AD.setAttribute({
            'fixed': true,
            'highlight': false
        });

        c1 = [1.5, 9];
        c2 = [9, 1.5];
        //Demand Line 1 - fixed
        var AD1 = MacroLib.createDemand(brd1, {
            c1: c1,
            c2: c2,
            name: 'AD<sub>1</sub>',
            color: 'DodgerBlue'
        });
        AD1.setAttribute({
            'fixed': true,
            'highlight': false
        });

        c1 = [0.75, 8.25];
        c2 = [8.25, 0.75];
        //Demand Line 1 - fixed
        var AD1 = MacroLib.createDemand(brd1, {
            c1: c1,
            c2: c2,
            name: 'AD<sub>2</sub>',
            color: 'Blue'
        });
        AD1.setAttribute({
            'fixed': true,
            'highlight': false
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    init();

})(JXG, MacroLib, undefined);
