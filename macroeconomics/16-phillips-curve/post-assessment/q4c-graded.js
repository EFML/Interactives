// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, LRAS, SRPC1, SRPC2, int1, int2, dashes1, dashes2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2.5, 12, 12, -1.75],
            xname: 'Unemployment<br>Rate',
            yname: 'Inflation<br>Rate'
        });

        // LRPC - fixed
        var LRAS = board.create('segment', [
            [5.75, 11.0],
            [5.75, 0.0]
        ], {
            strokeColor: 'darkgray',
            strokeWidth: '3',
            name: 'LRPC',
            withLabel: true,
            label: {
                offset: [-15, 200]
            }
        });
        var labelLRAS = board.create('text', [5.45, -0.4, '5%']);

        // SRPC1 - fixed
        SRPC1 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'SRPC<sub>1</sub>',
            color: 'gray'
        });
        SRPC1.setAttribute({
            dash: 1
        });

        // SRPC2 - moveable
        SRPC2 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'SRPC<sub>2</sub>',
            color: 'dodgerblue'
        });
        SRPC2.setAttribute({
            withLabel: false,
            highlight: true,
            fixed: false
        });
        SRPC2.point1.setAttribute({
            fixed: false
        });
        SRPC2.point2.setAttribute({
            fixed: false
        });

        // Intersections of LRAS and, SRPC1 and SRPC2
        int1 = board.create('intersection', [LRAS, SRPC1, 0], {
            visible: false
        });
        int2 = board.create('intersection', [LRAS, SRPC2, 0], {
            visible: false
        });

        // Dashes for SRPC1 -- fixed
        dashes1 = MacroLib.createDashedLines2Axis(board, int1, {
            withLabel: true,
            xlabel: '',
            ylabel: '6%',
            color: 'darkgray'
        });

        // Dashes for SRPC2 -- moveable
        dashes2 = MacroLib.createDashedLines2Axis(board, int2, {
            withLabel: true,
            fixed: false,
            xlabel: '',
            ylabel: '',
            color: 'dodgerblue'
        });

        dashes2.XLine.setAttribute({strokeColor: 'darkgray'});
        dashes2.Y1.setAttribute({
            strokeColor: 'dodgerblue',
            fillColor: 'dodgerblue'
        });

        //////////////////
        // Interactivity
        //////////////////
        SRPC2.on('down', lineDown);
        SRPC2.on('drag', lineDrag);
    }

    function lineDown() {
        SRPC2.setAttribute({
            withLabel: true
        });
        board.update();
    }

    function lineDrag() {
        // Move dashes 2
        dashes2.X1.moveTo([int2.X(), 0]);
        dashes2.Y1.moveTo([0, int2.Y()]);
        dashes2.X2.moveTo([int2.X(), int2.Y()]);
        dashes2.Y2.moveTo([int2.X(), int2.Y()]);
    }

    function pointsDiffer(pt1, pt2) {
        return pt1[0] !== pt2[0] || pt1[1] !== pt2[1];
    }

    ////////////////////////
    // External DOM button
    ////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    // Standard edX JSinput functions
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr), point1, point2, point3, point4;

        if (state.SRPC2) {
            point1 = [state.SRPC2.pt1x, state.SRPC2.pt1y];
            point2 = [state.SRPC2.pt2x, state.SRPC2.pt2y];
            point3 = [state.SRPC1.pt1x, state.SRPC1.pt1y];
            point4 = [state.SRPC1.pt2x, state.SRPC1.pt2y];

            if (pointsDiffer(point1, point3) && pointsDiffer(point2, point4)) {
                SRPC2.point1.moveTo(point1, 0);
                SRPC2.point2.moveTo(point2, 0);
                lineDown();
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
            SRPC1: {
                pt1x: SRPC1.point1.X(),
                pt2x: SRPC1.point2.X(),
                pt1y: SRPC1.point1.Y(),
                pt2y: SRPC1.point2.Y()
            },
            SRPC2: {
                pt1x: SRPC2.point1.X(),
                pt2x: SRPC2.point2.X(),
                pt1y: SRPC2.point1.Y(),
                pt2y: SRPC2.point2.Y()
            },
        };
        return JSON.stringify(state);
    }

    init();
    MacroLib.onLoadPostMessage();
    MacroLib.createChannel(getGrade, getState, setState);

})(JXG, MacroLib, undefined);
