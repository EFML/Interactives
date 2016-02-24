var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, brd2;

    function init() {
        MacroLib.init(MacroLib.TWO_BOARDS);
        ////////////
        // BOX 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-3.5, 12, 13, -2.5],
            xname: 'Quantity Loanable Funds<br>(Public and Private)',
            yname: 'Real<br>Interest<br>Rate',
            grid: false
        });


        //Supply Line 1 - fixed
        var SBfix = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S<sub>LF</sub>',
            color: 'orange',
            storkeWidth: 4
        });
        SBfix.setAttribute({
            dash: 1,
            withLabel: false
        });

        //Supply Line 2 - moveable
        var SB1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'S<sub>LF</sub>',
            color: 'orange'
        });
        SB1.setAttribute({
            withLabel: true,
            highlight: true,
            fixed: false
        });
        SB1.point1.setAttribute({
            fixed: false
        });
        SB1.point2.setAttribute({
            fixed: false
        });

        //Demand Line 1 - fixed
        var DB1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>LF</sub>',
            color: 'dodgerblue',
            storkeWidth: 4
        });
        DB1.setAttribute({
            dash: 1,
            withLabel: false
        });

        //Demand Line 2 - moveable
        DB1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>LF</sub>',
            color: 'dodgerblue'
        });
        DB1.setAttribute({
            withLabel: true,
            highlight: true,
            fixed: false
        });
        DB1.point1.setAttribute({
            fixed: false
        });
        DB1.point2.setAttribute({
            fixed: false
        });

        ////////////
        // BOX 2
        ////////////
        brd2 = MacroLib.createBoard('jxgbox2', {
            bboxlimits: [-3.5, 12, 14, -2.5],
            xname: 'Private<br>Investment $',
            yname: 'Real<br>Interest<br>Rate',
            grid: false
        });

        //Demand Line 2 - moveable
        var DB2 = MacroLib.createLine(brd2, {
            ltype: 'Demand',
            name: 'Investment<br>Demand</sub>',
            color: 'crimson'
        });
        DB2.setAttribute({
            withLabel: true
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
            color: 'gray'
        });



        ////////////
        // Dashes in Box 2
        ////////////

        // FIXED
        var dashesB2fix = MacroLib.createDashedLines2Axis(brd2, iSDB1, {
            withLabel: false,
            xlabel: 'I<sub>1</sub>',
            // xoffsets:[5,15],
            ylabel: 'RIR<sub>1</sub>',
            // yoffsets:[5,10],
            color: 'gray'
        });

        //DYNAMIC SET

        var dashesB2 = MacroLib.createDashedLines2Axis(brd2, iSDB1, {
            withLabel: true,
            xlabel: 'I<sub>2</sub>',
            // xoffsets:[5,15],
            ylabel: 'RIR<sub>2</sub>',
            // yoffsets:[5,10],
            color: 'darkgray'
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
        SB1.on('drag', lineDrag);
        DB1.on('drag', lineDrag);

        function lineDrag() {
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
        }
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
