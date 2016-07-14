// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, ptA, ptB;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        board = MacroLib.createBoard('jxgbox1', {
            xname: 'Unemployment<br>Rate',
            yname: 'Inflation<br>Rate',
            bboxlimits: [-2.5, 12, 12, -1.75]
        });
        // Line - fixed
        var line = board.create(
            'segment',
            [[2, 9.5], [9.5, 2]],
            {
                strokeWidth: 5,
                strokeColor: 'dodgerblue'
            }
        );
        // Line label - fixed
        var lineLabel = board.create('text', [10, f(10), 'SRPC']);

        // Use points instead of gliders because these, when reaching the end of the line on
        // either end, will cycle back to the other end instead of 'freezing'.
        // Point A - fixed
        ptA = board.create('point', [5.75, f(5.75)], {
            strokeColor: 'gray',
            fillColor: 'gray',
            size: 5,
            withLabel: false
        });
        // Point B - moveable
        ptB = board.create('point', [5.75, f(5.75)], {
            fixed: false,
            highlight: true,
            strokeColor: 'gray',
            fillColor: 'gray',
            size: 5,
        });
        ptB.setLabelText('A');

        // Interactivity
        ptB.on('down', handleMouseDown);
        ptB.on('drag', function() {
            var xConstrained = clipToLineBounds(ptB.X()),
                yConstrained = f(xConstrained);
            this.setPositionDirectly(JXG.COORDS_BY_USER, [xConstrained, yConstrained]);
            this.prepareUpdate().update().updateRenderer();
        });
    }

    function handleMouseDown() {
        ptA.setAttribute({withLabel: true});
        ptB.setLabelText('B');
    }

    // Line function: y = ax + b with a= -1 and b = 11.5
    function f(x) {
        return -x + 11.5;
    }

    function clipToLineBounds(x) {
        if  (x < 2) {
            return 2;
        }
        else if (x > 9.5) {
            return 9.5;
        }
        else {
            return x;
        }
    }
    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    // Standard edX JSinput functions.
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr);

        if (state.xA && state.xB) {
            if (state.xA !== state.xB) {
                handleMouseDown();
                ptB.moveTo([state.xB, f(state.xB)]);
            }
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        console.info('State successfully saved.');
        return JSON.stringify({
            xA: ptA.X(),
            xB: ptB.X()
        });
    }

    function getGrade() {
        return getState();
    }

    init();
    MacroLib.onLoadPostMessage();
    MacroLib.createChannel(getGrade, getState, setState);

})(JXG, MacroLib, undefined);
