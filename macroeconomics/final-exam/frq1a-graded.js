// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, LRAS, AD, SRAS, intersection1, intersection2, intersection3, dashes1, dashes2, dashes3, pt1, pt2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.0, 12, 12, -1.0],
            xname: 'RGDP',
            yname: 'PL'
        });

        // LRAS - fixed
        LRAS = board.create('segment', [
            [6.75, 11.0],
            [6.75, 0.0]
        ], {
            strokeColor: 'darkgray',
            strokeWidth: '3',
            name: 'LRAS',
            withLabel: true,
            label: {
                offset: [-15, 200]
            }
        });

        // AD - fixed
        AD = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'AD',
            color: 'dodgerblue',
        });

        // SRAS - fixed
        SRAS = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'SRAS',
            color: 'orange',
        });

        // Intersections of LRAS and AD -- fixed
        intersection1 = board.create('intersection', [LRAS, AD, 0], {
            visible: true,
            name: '',
            size: 0.5
        });

        // Intersections of LRAS and SRAS -- fixed
        intersection2 = board.create('intersection', [LRAS, SRAS, 0], {
            visible: true,
            name: '',
            size: 0.5
        });

        // Intersections of AD and SRAS -- fixed
        intersection3 = board.create('intersection', [AD, SRAS, 0], {
            visible: true,
            name: '',
            size: 0.5
        });

        // Dashes for intersection 1 -- fixed
        dashes1 = MacroLib.createDashedLines2Axis(board, intersection1, {
            withLabel: true,
            xlabel: '',
            ylabel: '',
            color: 'darkgray'
        });
        dashes1.X1.setAttribute({strokecolor: 'red'});
        dashes1.Y1.setAttribute({strokecolor: 'red'});

        // Dashes for intersection 2 -- fixed
        dashes2 = MacroLib.createDashedLines2Axis(board, intersection2, {
            withLabel: true,
            xlabel: '',
            ylabel: '',
            color: 'darkgray'
        });
        dashes2.X1.setAttribute({strokecolor: 'red'});
        dashes2.Y1.setAttribute({strokecolor: 'red'});

        // Dashes for intersection 3 -- fixed
        dashes3 = MacroLib.createDashedLines2Axis(board, intersection3, {
            withLabel: true,
            xlabel: '',
            ylabel: '',
            color: 'darkgray'
        });
        dashes3.X1.setAttribute({strokecolor: 'red'});
        dashes3.Y1.setAttribute({strokecolor: 'red'});

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
        params.name = 'Y<sub>1</sub>';
        pt1 = board.create('point', [3.0, 10.85], params);
        params.name = 'PL<sub>1</sub>';
        pt2 = board.create('point', [1.0, 10.85], params);
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

        if (state.pt1 && state.pt1) {
            pt1.moveTo([state.pt1.x, state.pt1.y]);
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
