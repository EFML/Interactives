// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, D1, D2, S1, S2, int1, int2, dashes1, dashes2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.5, 12, 12, -1],
            xname: 'Quantity',
            yname: 'RIR'
        });

        // Supply Line 1 - fixed
        S1 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S LF<sub>1</sub>',
            color: 'dodgerblue'
        });
        S1.setAttribute({
            dash: 1
        });

        // Supply Line 2 - moveable
        S2 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S LF<sub>2</sub>',
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
            name: 'D LF<sub>1</sub>',
            color: 'orange'
        });
        D1.setAttribute({
            dash: 1
        });

        // Demand Line 2 - moveable
        D2 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D LF<sub>2</sub>',
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
        // Intersections of Demand and Supply lines
        ////////////
        int1 = board.create('intersection', [D1, S1, 0], {
            visible: false
        });
        int2 = board.create('intersection', [D2, S2, 0], {
            visible: false
        });

        ////////////
        // Fixed Dashed Lines
        ////////////
        dashes1 = MacroLib.createDashedLines2Axis(board, int1, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: 'RIR<sub>1</sub>',
            color: 'dodgerblue'
        });

        ////////////
        // Draggable Dashed Lines
        ////////////
        dashes2 = MacroLib.createDashedLines2Axis(board, int2, {
            fixed: false,
            withLabel: false,
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'RIR<sub>2</sub>',
            color: 'orange'
        });

        //////////////////
        // Interactivity
        //////////////////
        S2.on('down', lineS2Down);
        S2.on('drag', lineDrag);
        D2.on('down', lineD2Down);
        D2.on('drag', lineDrag);
    }

    function lineD2Down() {
        D2.setAttribute({
            withLabel: true
        });
        lineDown();
    }

    function lineS2Down() {
        S2.setAttribute({
            withLabel: true
        });
        lineDown();
    }

    function lineDown() {
        dashes2.Y1.setAttribute({
            withLabel: true
        });
        dashes2.X1.setAttribute({
            withLabel: true
        });
        board.update();
    }

    function lineDrag() {
        // Moving Dashed Lines
        dashes2.Y1.moveTo([0, int2.Y()]);
        dashes2.Y2.moveTo([int2.X(), int2.Y()]);

        dashes2.X1.moveTo([int2.X(), 0]);
        dashes2.X2.moveTo([int2.X(), int2.Y()]);

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

    // Standard edX JSinput functions
    function setState(transaction, statestr) {
        var state = JSON.parse(statestr);

        if (state.D2 && state.S2) {
            var point1 = [state.D2.p1X, state.D2.p1Y],
                point2 = [state.D2.p2X, state.D2.p2Y];
            if (pointsDiffer(point1, [D2.point1.X(), D2.point1.Y()]) || pointsDiffer(point2, [D2.point2.X(), D2.point2.Y()])) {
                D2.point1.moveTo(point1, 0);
                D2.point2.moveTo(point2, 0);
                lineD2Down();
                lineDrag();
            }
            point1 = [state.S2.p1X, state.S2.p1Y];
            point2 = [state.S2.p2X, state.S2.p2Y];
            if (pointsDiffer(point1, [S2.point1.X(), S2.point1.Y()]) || pointsDiffer(point2, [S2.point2.X(), S2.point2.Y()])) {
                S2.point1.moveTo(point1, 0);
                S2.point2.moveTo(point2, 0);
                lineS2Down();
                lineDrag();
            }
            board.update();
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            D2: {
                p1X: D2.point1.X(),
                p2X: D2.point2.X(),
                p1Y: D2.point1.Y(),
                p2Y: D2.point2.Y()
            },
            S2: {
                p1X: S2.point1.X(),
                p2X: S2.point2.X(),
                p1Y: S2.point1.Y(),
                p2Y: S2.point2.Y()
            },
            int1: {
                X: int1.X(),
                Y: int1.Y()
            },
            int2: {
                X: int2.X(),
                Y: int2.Y()
            }
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
