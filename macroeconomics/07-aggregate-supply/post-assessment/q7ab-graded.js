// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, AD1, AD2, SRAS1, SRAS2, dashS2, iS1D, iS2D;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.5, 12, 12, -1.2],
            xname: 'Real GDP',
            yname: 'Price<br>Level'
        });

        //Supply Line 1 - fixed
        SRAS1 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'SRAS<sub>1</sub>',
            color: 'dodgerblue'
        });
        SRAS1.setAttribute({
            dash: 1
        });

        //Supply Line 2 - moveable
        SRAS2 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'SRAS<sub>2</sub>',
            color: 'dodgerblue'
        });
        SRAS2.setAttribute({
            withLabel: false,
            highlight: true,
            fixed: false
        });
        SRAS2.point1.setAttribute({
            fixed: false
        });
        SRAS2.point2.setAttribute({
            fixed: false
        });

        //Demand Line 1 - fixed
        AD1 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'AD<sub>1</sub>',
            color: 'orange'
        });
        AD1.setAttribute({
            dash: 1
        });

        //Demand Line 2 - moveable
        AD2 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'AD<sub>2</sub>',
            color: 'orange'
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
        // Intersection
        ////////////
        iS1D = board.create('intersection', [AD1, SRAS1, 0], {
            visible: false
        });
        iS2D = board.create('intersection', [AD2, SRAS2, 0], {
            visible: false
        });

        ////////////
        // Draggable dashed lines
        ////////////
        dashS2 = MacroLib.createDashedLines2Axis(board, iS2D, {
            withLabel: false,
            xlabel: 'Y<sub>2</sub>',
            ylabel: 'PL<sub>2</sub>',
            color: 'orange'
        });

        ////////////
        // Fixed dashed lines
        ////////////
        var dashesFixedB1 = MacroLib.createDashedLines2Axis(board, iS1D, {
            withLabel: true,
            xlabel: 'Y<sub>1</sub>',
            ylabel: 'PL<sub>1</sub>',
            color: 'dodgerblue'
        });

        ////////////
        //LRAS - Straight vertical line
        ////////////
        var LRAS = board.create('segment', [
            [7.0, 11.0],
            [7.0, 0.0]
        ], {
            strokeColor: 'darkgray',
            strokeWidth: '3',
            name: 'LRAS',
            withLabel: true,
            label: {
                offset: [-15, 200]
            }
        });
        var labelLRAS = board.create('text', [6.7, -0.4, 'Y<sub>F</sub>']);

        //////////////////
        // Interactivity
        //////////////////
        AD2.on('down', AD2LineDown);
        AD2.on('drag', lineDrag);
        SRAS2.on('down', SRAS2LineDown);
        SRAS2.on('drag', lineDrag);
    }

    function AD2LineDown() {
        AD2.setAttribute({
            withLabel: true
        });
        showDashS2Labels();
        board.update();
    }

    function SRAS2LineDown() {
        SRAS2.setAttribute({
            withLabel: true
        });
        showDashS2Labels();
        board.update();
    }

    function showDashS2Labels() {
        dashS2.X1.setAttribute({
            withLabel: true
        });
        dashS2.Y1.setAttribute({
            withLabel: true
        });
    }

    function lineDrag() {
        //Moving Dashed Lines in Board
        dashS2.X1.moveTo([iS2D.X(), 0]);
        dashS2.Y1.moveTo([0, iS2D.Y()]);
        dashS2.X2.moveTo([iS2D.X(), iS2D.Y()]);
        dashS2.Y2.moveTo([iS2D.X(), iS2D.Y()]);
    }

    // pt1 and pt2 are arrays, pt3 and pt4 points
    function linesAreEqual(pt1, pt2, pt3, pt4) {
        return pt1[0] == pt3.X() && pt1[1] == pt3.Y() &&
               pt2[0] == pt4.X() && pt2[1] == pt4.Y();
    }

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    //Standard edX JSinput functions
    function setState(transaction, statestr) {
        var state = JSON.parse(statestr);

        if (state.AD1 && state.SRAS1 && state.AD2 && state.SRAS2 && state.PL2) {
            var point1 = [state.AD2.p1X, state.AD2.p1Y];
            var point2 = [state.AD2.p2X, state.AD2.p2Y];
            if (!linesAreEqual(point1, point2, AD2.point1, AD2.point2)) {
                AD2.point1.moveTo(point1, 0);
                AD2.point2.moveTo(point2, 0);
                AD2LineDown();
                lineDrag();
            }
            point1 = [state.SRAS2.p1X, state.SRAS2.p1Y];
            point2 = [state.SRAS2.p2X, state.SRAS2.p2Y];
            if (!linesAreEqual(point1, point2, SRAS2.point1, SRAS2.point2)) {
                SRAS2.point1.moveTo(point1, 0);
                SRAS2.point2.moveTo(point2, 0);
                SRAS2LineDown();
                lineDrag();
            }
            board.update();
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            AD1: {
                p1X: AD1.point1.X(),
                p2X: AD1.point2.X(),
                p1Y: AD1.point1.Y(),
                p2Y: AD1.point2.Y()
            },
            AD2: {
                p1X: AD2.point1.X(),
                p2X: AD2.point2.X(),
                p1Y: AD2.point1.Y(),
                p2Y: AD2.point2.Y()
            },
            SRAS1: {
                p1X: SRAS1.point1.X(),
                p2X: SRAS1.point2.X(),
                p1Y: SRAS1.point1.Y(),
                p2Y: SRAS1.point2.Y()
            },
            SRAS2: {
                p1X: SRAS2.point1.X(),
                p2X: SRAS2.point2.X(),
                p1Y: SRAS2.point1.Y(),
                p2Y: SRAS2.point2.Y()
            },
            PL1: iS1D.Y(),
            PL2: iS2D.Y()
        };
        console.info('State successfully saved.');
        return JSON.stringify(state);
    }

    function getGrade() {
        return getState();
    }

    init();
    MacroLib.onLoadPostMessage();
    MacroLib.createChannel(getGrade, getState, setState);

})(JXG, MacroLib, undefined);
