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
            grid: false
        });

        //Demand Line AD - fixed
        var AD = MacroLib.createLine(brd1, {
            c1: [2.0, 9.5],
            c2: [9.5, 2.0],
            name: 'AD',
            color: 'Gray'
        });
        AD.setAttribute({
            fixed: true
        });

        //Demand Line AD1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            c1: [2.5, 10],
            c2: [10, 2.5],
            name: 'AD<sub>1</sub>',
            color: 'DodgerBlue'
        });
        AD1.setAttribute({
            fixed: true
        });

        //Demand Line AD2 - fixed
        var AD2 = MacroLib.createLine(brd1, {
            c1: [3.25, 10.75],
            c2: [10.75, 3.25],
            name: 'AD<sub>2</sub>',
            color: 'Blue'
        });
        AD2.setAttribute({
            fixed: true
        });
    }

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
