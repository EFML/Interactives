(function(JXG, MacroLib) {
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
            color: 'gray'
        });

        //Demand Line AD1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            c1: [1.5, 9],
            c2: [9, 1.5],
            name: 'AD<sub>1</sub>',
            color: 'dodgerblue'
        });
        AD1.setAttribute({
            fixed: true,
            highlight: false
        });

        //Demand Line AD2 - fixed
        var AD2 = MacroLib.createLine(brd1, {
            c1: [0.75, 8.25],
            c2: [8.25, 0.75],
            name: 'AD<sub>2</sub>',
            color: 'blue'
        });
    }

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
