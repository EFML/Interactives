var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, brd2;

    function init() {
        MacroLib.init(MacroLib.TWO_BOARDS);
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: 'Real GDP',
            yname: 'PL',
            grid: false
        });

        //Supply Line 1 - fixed
        var SB1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'SRAS',
            color: 'Gray'
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'AD<sub>1</sub>',
            color: 'Gray'
        });
        AD1.setAttribute({
            dash: 1
        });

        //Demand Line 2 - moveable
        var AD2 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'AD<sub>2</sub>',
            color: 'Orange'
        });
        AD2.setAttribute({
            withLabel: false,
            highlight: true,
            fixed: false
        });
        AD2.point1.setAttribute({
            fixed: false
        });
        AD2.point2.setAttribute({
            fixed: false
        });

        ////////////
        // Intersection Box 1
        ////////////
        var iSDfix = brd1.create('intersection', [AD1, SB1, 0], {
            visible: false
        });
        var iS2D = brd1.create('intersection', [AD2, SB1, 0], {
            visible: false
        });

        ////////////
        // Dashes for fixed Line
        ////////////
        var dashesB1fixed = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'rY<sub>1</sub>',
            ylabel: 'PL<sub>1</sub>',
            color: 'Gray'
        });

        ////////////
        // Dashes for draggable Moveable Line
        ////////////
        var dashesB1 = MacroLib.createDashedLines2Axis(brd1, iS2D, {
            withLabel: true,
            xlabel: 'rY<sub>2</sub>',
            ylabel: 'PL<sub>2</sub>',
            color: 'Orange'
        });

        dashesB1.Y1.setAttribute({
            visible: false
        });
        dashesB1.X1.setAttribute({
            visible: false
        });
        dashesB1.XLine.setAttribute({
            visible: false
        });
        dashesB1.YLine.setAttribute({
            visible: false
        });

        ////////////
        // BOARD 2
        ////////////
        brd2 = MacroLib.createBoard('jxgbox2', {
            bboxlimits: [-3, 12, 12, -1.5],
            xname: 'UR',
            yname: 'Inflation<br>Rate',
            grid: false
        });

        //////////
        // Connect Boards and Movement
        //////////
        brd1.addChild(brd2);

        //SRPC - fixed
        var SRPC = MacroLib.createLine(brd2, {
            ltype: 'Demand',
            name: 'SRPC',
            color: 'Blue'
        });

        ////////
        // Dashed Line Box 2
        ////////
        var DB2YP1 = brd2.create('point', [0, iS2D.Y()], {
            withLabel: false,
            visible: false
        });
        var DB2YP2 = brd2.create('point', [iS2D.X(), iS2D.Y()], {
            withLabel: false,
            visible: false
        });
        var DB2Y = brd2.create('segment', [DB2YP1, DB2YP2], {
            visible: false,
            strokeColor: 'gray',
            strokeWidth: '2',
            dash: '1'
        });
        ////////
        //Intersection for SRPC
        ////////
        var iB2SRPC = brd2.create('intersection', [DB2Y, SRPC, 0], {
            name: 'A<sub>2</sub>',
            withLabel: true,
            visible: false
        });
        var iB2fixed = brd2.create('point', [iB2SRPC.X(), iB2SRPC.Y()], {
            name: 'A<sub>1</sub>',
            visible: true,
            fillColor: 'Gray',
            strokeColor: 'Gray'
        });

        //////////////////
        // Interactivity
        //////////////////
        AD2.on('down', function() {
            AD2.setAttribute({
                withLabel: true
            });
            iB2SRPC.setAttribute({
                visible: true
            });

            dashesB1.Y1.setAttribute({
                visible: true
            });
            dashesB1.X1.setAttribute({
                visible: true
            });

            dashesB1.XLine.setAttribute({
                visible: true
            });
            dashesB1.YLine.setAttribute({
                visible: true
            });

            brd1.update();
        });

        AD2.on('drag', function() {
            //Moving Dashed Lines in Board 1
            dashesB1.Y1.moveTo([0, iS2D.Y()]);
            dashesB1.Y2.moveTo([iS2D.X(), iS2D.Y()]);

            dashesB1.X1.moveTo([iS2D.X(), 0]);
            dashesB1.X2.moveTo([iS2D.X(), iS2D.Y()]);

            DB2YP1.moveTo([0, iS2D.Y()]);
            DB2YP2.moveTo([iB2SRPC.X(), iS2D.Y()]);

        });
    }

    ////////////////////////
    // External DOM button
    ////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
