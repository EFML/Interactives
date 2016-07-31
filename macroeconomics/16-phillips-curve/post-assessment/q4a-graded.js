// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, LRAS, SRPC, intersection, dashes, pt1, pt2, pt3;

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

        // SRPC - fixed
        SRPC = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'SRPC',
            color: 'dodgerblue'
        });

        // Intersections of LRAS and SRPC
        intersection = board.create('intersection', [LRAS, SRPC, 0], {
            visible: false
        });

        // Dashes for SRPC -- fixed
        dashes = MacroLib.createDashedLines2Axis(board, intersection, {
            withLabel: true,
            xlabel: '',
            ylabel: '',
            color: 'darkgray'
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
        params.name = '5%';
        pt1 = board.create('point', [7.5, 11], params);
        params.name = '6%';
        pt2 = board.create('point', [9, 11], params);
        params.name = '8%';
        pt3 = board.create('point', [10.5, 11], params);
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

        if (state.pt1 && state.pt2 && state.pt3) {
            pt1.moveTo([state.pt1.x, state.pt1.y]);
            pt2.moveTo([state.pt2.x, state.pt2.y]);
            pt2.moveTo([state.pt2.x, state.pt2.y]);
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            pt1: {
                x: pt1.X(),
                y: pt1.Y()
            },
            pt2: {
                x: pt2.X(),
                y: pt2.Y()
            },
            pt3: {
                x: pt3.X(),
                y: pt3.Y()
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
