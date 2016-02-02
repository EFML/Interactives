var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        JXG.Options.point.showInfobox = false;

        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: 'Real GDP',
            yname: 'Price<br>Level',
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

        c1 = [2.5, 10];
        c2 = [10, 2.5];
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

        c1 = [3.25, 10.75];
        c2 = [10.75, 3.25];
        //Demand Line 1 - fixed -- Error here?
        AD1 = MacroLib.createDemand(brd1, {
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
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
