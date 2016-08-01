// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, LRPC, SRPC1, SRPC2, intersection1, intersection2, intersection3, dashes1, dashes2, ptA, ptB, ptC;

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
        LRPC = board.create('segment', [
            [4.75, 11.0],
            [4.75, 0.0]
        ], {
            strokeColor: 'darkgray',
            strokeWidth: '3',
            name: 'LRPC',
            withLabel: true,
            label: {
                offset: [-15, 200]
            }
        });

        // SRPC1 - fixed: y = -x + 10.5
        SRPC1 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'SRPC<sub>1</sub>',
            color: 'dodgerblue',
            c1: [1.0, 9.5],
            c2: [9.0, 1.5]
        });

        // SRPC2 - fixed: y = -x + 12.5
        SRPC2 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'SRPC<sub>2</sub>',
            color: 'dodgerblue',
            c1: [2.0, 10.5],
            c2: [10.0, 2.5]
        });

        // Intersections of LRPC and SRPC1 - fixed: (4.75, 5.75)
        intersection1 = board.create('intersection', [LRPC, SRPC1, 0], {
            visible: true,
            name: '',
            size: 0.5
        });

        // Intersections of LRPC and SRPC2 - fixed: (4.75, 7.75)
        intersection2 = board.create('intersection', [LRPC, SRPC2, 0], {
            visible: true,
            name: '',
            size: 0.5
        });

        // Dashes for SRPC1 -- fixed
        dashes1 = MacroLib.createDashedLines2Axis(board, intersection1, {
            withLabel: true,
            xlabel: '',
            ylabel: '',
            color: 'darkgray'
        });
        dashes1.X1.setAttribute({strokecolor: 'red'});
        dashes1.Y1.setAttribute({strokecolor: 'red'});

        // Dashes for SRPC2 -- fixed
        dashes2 = MacroLib.createDashedLines2Axis(board, intersection2, {
            withLabel: true,
            xlabel: '',
            ylabel: '',
            color: 'darkgray'
        });
        dashes2.X1.setAttribute({strokecolor: 'red'});
        dashes2.Y1.setAttribute({strokecolor: 'red'});

        // Intersections of SRPC1 and y dashes of SRPC2 - fixed: (2.75, 7.75)
        intersection3 = board.create('intersection', [SRPC1, dashes2.YLine, 0], {
            visible: true,
            name: '',
            size: 0.5
        });

        // Draggable points
        var params = {
            fixed: false,
            highlight: true,
            color: 'darkgray',
            highlightFillColor: 'gray',
            highlightStrokeColor: 'gray',
            size: 5,
            label: {
                offset: [10, 15]
            }
        }
        params.name = 'A';
        ptA = board.create('point', [7.5, 11], params);
        params.name = 'B';
        ptB = board.create('point', [9, 11], params);
        params.name = 'C';
        ptC = board.create('point', [10.5, 11], params);
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
        var state = JSON.parse(stateStr);

        if (state.ptA && state.ptB && state.ptC) {
            ptA.moveTo([state.ptA.x, state.ptA.y]);
            ptB.moveTo([state.ptB.x, state.ptB.y]);
            ptC.moveTo([state.ptC.x, state.ptC.y]);
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            ptA: {
                x: ptA.X(),
                y: ptA.Y()
            },
            ptB: {
                x: ptB.X(),
                y: ptB.Y()
            },
            ptC: {
                x: ptC.X(),
                y: ptC.Y()
            }
        };
        console.info('State successfully saved.');
        return JSON.stringify(state);
    }

    //Standard edX JSinput functions
    function getGrade() {
        return getState();
    }

    init();
    MacroLib.onLoadPostMessage();
    MacroLib.createChannel(getGrade, getState, setState);

})(JXG, MacroLib, undefined);
