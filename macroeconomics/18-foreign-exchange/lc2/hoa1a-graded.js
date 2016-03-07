// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, D1, D2, S1, S2, iS2D2, dashes2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity<br>of Dollars',
            yname: 'Euros/<br>Dollars'
        });

        // Supply Line 1 - fixed
        S1 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>$1</sub>',
            color: 'dodgerblue'
        });
        S1.setAttribute({
            dash: 1
        });

        // Supply Line 2 - moveable
        S2 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>$2</sub>',
            color: 'dodgerblue'
        });
        S2.setAttribute({
            withLabel: false,
            highlight: true,
            fixed: false
        });
        S2.point1.setAttribute({
            fixed: false
        });
        S2.point2.setAttribute({
            fixed: false
        });

        // Demand Line 1 - fixed
        D1 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D<sub>$1</sub>',
            color: 'orange'
        });
        D1.setAttribute({
            dash: 1
        });

        // Demand Line 2 - moveable
        D2 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D<sub>$2</sub>',
            color: 'orange'
        });
        D2.setAttribute({
            withLabel: false,
            highlight: true,
            fixed: false
        });
        D2.point1.setAttribute({
            fixed: false
        });
        D2.point2.setAttribute({
            fixed: false
        });

        ////////////
        // Intersections of S1,D1 and S2,D2
        ////////////
        var iS1D1 = board.create('intersection', [D1, S1, 0], {
            visible: false
        });
        iS2D2 = board.create('intersection', [D2, S2, 0], {
            visible: false
        });

        ////////////
        // Fixed Dashed Lines for iS1D1
        ////////////
        var dashes1 = MacroLib.createDashedLines2Axis(board, iS1D1, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: 'e<sub>1</sub>',
            color: 'gray'
        });

        ////////////
        // Draggable Dashed Lines for iS2D2
        ////////////
        dashes2 = MacroLib.createDashedLines2Axis(board, iS2D2, {
            withLabel: false,
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'e<sub>2</sub>',
            color: 'gray'
        });

        //////////////////
        // Interactivity
        //////////////////
        S2.on('down', lineS2Down);
        S2.on('drag', lineDrag);
        D2.on('down', lineD2Down);
        D2.on('drag', lineDrag);
    }

    function lineS2Down() {
        S2.setAttribute({
            withLabel: true
        });
        lineDown();
    }

    function lineD2Down() {
        D2.setAttribute({
            withLabel: true
        });
        lineDown();
    }

    function lineDown() {
        dashes2.X1.setAttribute({
            withLabel: true
        });
        dashes2.Y1.setAttribute({
            withLabel: true
        });
        board.update();
    }

    function lineDrag() {
        // Moving Dashed Lines
        dashes2.X1.moveTo([iS2D2.X(), 0]);
        dashes2.X2.moveTo([iS2D2.X(), iS2D2.Y()]);
        dashes2.Y1.moveTo([0, iS2D2.Y()]);
        dashes2.Y2.moveTo([iS2D2.X(), iS2D2.Y()]);
    }

    function pointsDiffer(pt1, pt2) {
        return pt1[0] !== pt2[0] || pt1[1] !== pt2[1];
    }

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    init();
    MacroLib.onLoadPostMessage();

    // Standard edX JSinput functions
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr),
            S1point1, S1point2, S2point1, S2point2, D1point1, D1point2, D2point1, D2point2;

        if (state.S2 && state.D2) {
            S1point1 = [state.S1.pt1x, state.S1.pt1y];
            S1point2 = [state.S1.pt2x, state.S1.pt2y];
            S2point1 = [state.S2.pt1x, state.S2.pt1y];
            S2point2 = [state.S2.pt2x, state.S2.pt2y];
            D1point1 = [state.D1.pt1x, state.D1.pt1y];
            D1point2 = [state.D1.pt2x, state.D1.pt2y];
            D2point1 = [state.D2.pt1x, state.D2.pt1y];
            D2point2 = [state.D2.pt2x, state.D2.pt2y];

            if (pointsDiffer(S1point1 , S2point1) || pointsDiffer(S1point2 , S2point2)) {
                S2.point1.moveTo(S2point1, 0);
                S2.point2.moveTo(S2point2, 0);
                lineS2Down();
                lineDrag();
            }

            if (pointsDiffer(D1point1 , D2point1) || pointsDiffer(D1point2 , D2point2)) {
                D2.point1.moveTo(D2point1, 0);
                D2.point2.moveTo(D2point2, 0);
                lineD2Down();
                lineDrag();
            }

            board.update();
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = JSON.parse(getGrade()),
            stateStr = JSON.stringify(state);
        console.info('State successfully saved.');
        return stateStr;
    }

    //Standard edX JSinput functions
    function getGrade() {
        var state = {
            S1: {
                pt1x: S1.point1.X(),
                pt2x: S1.point2.X(),
                pt1y: S1.point1.Y(),
                pt2y: S1.point2.Y()
            },
            S2: {
                pt1x: S2.point1.X(),
                pt2x: S2.point2.X(),
                pt1y: S2.point1.Y(),
                pt2y: S2.point2.Y()
            },
            D1: {
                pt1x: D1.point1.X(),
                pt2x: D1.point2.X(),
                pt1y: D1.point1.Y(),
                pt2y: D1.point2.Y()
            },
            D2: {
                pt1x: D2.point1.X(),
                pt2x: D2.point2.X(),
                pt1y: D2.point1.Y(),
                pt2y: D2.point2.Y()
            }
        };
        return JSON.stringify(state);
    }

    MacroLib.createChannel(getGrade, getState, setState);

})(JXG, MacroLib, undefined);
