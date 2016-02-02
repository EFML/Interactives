var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, brd2;

    function init() {
        MacroLib.init(MacroLib.TWO_BOARDS);
        ////////////
        // BOX 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2.3, 12, 13, -2.3],
            xname: 'Quantity Loanable Funds (Public and Private)',
            'xpos': [4, -1.1],
            yname: 'Real<br>Interest<br>Rate',
            grid: false,
            'ypos': [-2.2, 10.0]
        });


        //Supply Line 1 - fixed
        var SBfix = MacroLib.createLine(brd1, {
            'ltype': 'Supply',
            'name': 'S<sub>LF</sub>',
            color: 'Orange',
            storkeWidth: 4
        });
        SBfix.setAttribute({
            'dash': 1,
            'fixed': true,
            'withLabel': false
        });

        //Supply Line 2 - moveable
        var SB1 = MacroLib.createLine(brd1, {
            'ltype': 'Supply',
            'name': 'S<sub>LF</sub>',
            color: 'Orange'
        });
        SB1.setAttribute({
            'highlight': false,
            'withLabel': true
        });

        //Demand Line 1 - fixed
        var DB1 = MacroLib.createLine(brd1, {
            'ltype': 'Demand',
            'name': 'D<sub>LF</sub>',
            'color': 'DodgerBlue',
            storkeWidth: 4
        });
        DB1.setAttribute({
            'dash': 1,
            'fixed': true,
            'withLabel': false,
            'highlight': false
        });

        //Demand Line 2 - moveable -- Error?
        DB1 = MacroLib.createLine(brd1, {
            'ltype': 'Demand',
            'name': 'D<sub>LF</sub>',
            'color': 'DodgerBlue'
        });
        DB1.setAttribute({
            'withLabel': true,
            'highlight': false
        });

        ////////////
        // BOX 2
        ////////////
        brd2 = MacroLib.createBoard('jxgbox2', {
            bboxlimits: [-2.3, 12, 13, -2.3],
            xname: 'Private Investment $',
            'xpos': [6.0, -1.5],
            yname: 'Real<br>Interest<br>Rate',
            grid: false,
            'ypos': [-2.2, 10.0]
        });

        //Demand Line 2 - moveable
        var DB2 = MacroLib.createLine(brd2, {
            'ltype': 'Demand',
            'name': 'Invest<br>Demand</sub>',
            'color': 'Crimson'
        });
        DB2.setAttribute({
            'fixed': true,
            'withLabel': true,
            'highlight': false
        });

        ////////
        // Intersection Box 1
        ////////
        var iSDB1 = brd1.create('intersection', [SB1, DB1, 0], {
            visible: false
        });

        ////////////
        // Dashes for Board 1
        ////////////
        var dashesB1 = MacroLib.createDashedLines2Axis(brd1, iSDB1, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            xoffsets: [5, 15],
            ylabel: 'RIR<sub>1</sub>',
            // yoffsets:[5,10],
            color: 'Gray'
        });



        ////////////
        // Dashes in Box 2
        ////////////

        // FIXED
        var dashesB2fix = MacroLib.createDashedLines2Axis(brd2, iSDB1, {
            withLabel: false,
            fixed: true,
            xlabel: 'I<sub>1</sub>',
            // xoffsets:[5,15],
            ylabel: 'RIR<sub>1</sub>',
            // yoffsets:[5,10],
            color: 'Gray'
        });

        //DYNAMIC SET

        var dashesB2 = MacroLib.createDashedLines2Axis(brd2, iSDB1, {
            withLabel: true,
            xlabel: 'I<sub>2</sub>',
            // xoffsets:[5,15],
            ylabel: 'RIR<sub>2</sub>',
            // yoffsets:[5,10],
            color: 'DarkGray'
        });

        ////////
        // Intersections Box 2
        ////////
        var iIDy = brd2.create('intersection', [dashesB2.YLine, DB2, 0], {
            visible: false
        });


        //////////
        // Connect Boards and Movement
        //////////

        brd1.addChild(brd2);

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines in Board 1
            dashesB1.Y1.moveTo([0, iSDB1.Y()]);
            dashesB1.Y2.moveTo([iSDB1.X(), iSDB1.Y()]);
            dashesB1.X1.moveTo([iSDB1.X(), 0]);
            dashesB1.X2.moveTo([iSDB1.X(), iSDB1.Y()]);

            //Moving Dashed Lines in Board 2
            dashesB2.Y1.moveTo([0, iSDB1.Y()]);
            dashesB2.Y2.moveTo([iIDy.X(), iSDB1.Y()]);
            dashesB2.X1.moveTo([iIDy.X(), 0]);
            dashesB2.X2.moveTo([iIDy.X(), iSDB1.Y()]);
        });
    }

    ////////////////////////
    // External DOM button
    ////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        JXG.JSXGraph.freeBoard(brd2);
        init();
    });

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
