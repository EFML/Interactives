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
        // Curve - fixed
        var curve = board.create(
            'functiongraph',
            [f, 2.25, 10],
            {
                strokeWidth: 5,
                strokeColor: 'dodgerblue'
            }
        );
        // Curve label - fixed
        var curveLabel = board.create('text', [10.6, f(10.6) + 0.1, 'SRPC']);

        // Use points instead of gliders because these, when reaching the end of the curve on
        // either end, will cycle back to the other end instead of 'freezing'.
        // Point A - fixed
        ptA = board.create('point', [4, f(4)], {
            strokeColor: 'gray',
            fillColor: 'gray',
            size: 5,
            withLabel: false
        });
        // Point B - moveable
        ptB = board.create('point', [4, f(4)], {
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
            var xConstrained = clipToCurveBounds(ptB.X()),
                yConstrained = f(xConstrained);
            this.setPositionDirectly(JXG.COORDS_BY_USER, [xConstrained, yConstrained]);
            this.prepareUpdate().update().updateRenderer();
        });
    }

    function handleMouseDown() {
        ptA.setAttribute({withLabel: true});
        ptB.setLabelText('B');
    }

    // Curve function
    function f(x) {
        return Math.exp(5/(x));
    }

    function clipToCurveBounds(x) {
        if  (x < 2.25) {
            return 2.25;
        }
        else if (x > 10.0) {
            return 10.0;
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
