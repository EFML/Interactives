// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, SRPC1, SRPC2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2.25, 12, 12, -1],
            xname: 'UR',
            yname: 'Inflation<br>Rate'
        });

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

        //////////////////
        // Interactivity
        //////////////////
        SRPC2.on('down', function() {
            SRPC2.setAttribute({
                withLabel: true
            });
            board.update();
        });
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
                SRPC2.setAttribute({
                    withLabel: true
                });
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
