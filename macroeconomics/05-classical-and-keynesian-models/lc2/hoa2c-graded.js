(function(JXG, MacroLib) {
    'use strict';
    var board, supplyTopPt, demandTopPt, eqPt, demandBottomPt, supplyBottomPt, supplyTopDashes, demandTopDashes,
        eqDashes, supplyBottomDashes, demandBottomDashes, w2Pt, l1Pt, l2Pt;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // Board
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1, 12, 12, -1.2],
            xname: 'Labor',
            yname: 'W'
        });
        // Demand Line - fixed
        var demandLine = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D<sub>L</sub>',
            color: 'orange'
        });
        // Supply Line - fixed
        var supplyLine = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>L</sub>',
            color: 'dodgerblue'
        });
        // Invisible top line - fixed
        var invTopLine = MacroLib.createLine(board, {
            c1: [0, 7.75],
            c2: [12, 7.75]
        });
        invTopLine.setAttribute({
            withLabel: false,
            highlight: false,
            visible: false
        });
        // Invisible bottom line - fixed
        var invBottomLine = MacroLib.createLine(board, {
            c1: [0, 3.75],
            c2: [12, 3.75]
        });
        invBottomLine.setAttribute({
            withLabel: false,
            highlight: false,
            visible: false
        });
        ////////////
        // Intersections
        ////////////
        demandTopPt = board.create('intersection', [invTopLine, demandLine, 0], {
            visible: true,
            withLabel: false,
            color: 'orange'
        });

        supplyTopPt = board.create('intersection', [invTopLine, supplyLine, 0], {
            visible: true,
            withLabel: false,
            color: 'dodgerblue'
        });
        // Equilibrium point is (5.75, 5.75)
        eqPt = board.create('intersection', [demandLine, supplyLine, 0], {
            visible: false
        });
        demandBottomPt = board.create('intersection', [invBottomLine, demandLine, 0], {
            visible: true,
            withLabel: false,
            color: 'orange'
        });

        supplyBottomPt = board.create('intersection', [invBottomLine, supplyLine, 0], {
            visible: true,
            withLabel: false,
            color: 'dodgerblue'
        });
        ////////////
        // Dashed Lines
        ////////////
        demandTopDashes = MacroLib.createDashedLines2Axis(board, demandTopPt, {
            withLabel: false
        });

        supplyTopDashes = MacroLib.createDashedLines2Axis(board, supplyTopPt, {
            withLabel: false
        });

        eqDashes = MacroLib.createDashedLines2Axis(board, eqPt, {
            withLabel: false,
        });

        demandBottomDashes = MacroLib.createDashedLines2Axis(board, demandBottomPt, {
            withLabel: false
        });

        supplyBottomDashes = MacroLib.createDashedLines2Axis(board, supplyBottomPt, {
            withLabel: false,
        });
        // Fixed point
        w2Pt = board.create('point', [0, 7.75], {
            name: 'W<sub>2</sub>',
            color: 'darkgray',
            size: 5,
            label: {
                offset: [10, 15]
            }
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
        params.name = 'L<sub>1</sub>';
        l1Pt = board.create('point', [4, 11], params);
        params.name = 'L<sub>2</sub>';
        l2Pt = board.create('point', [6, 11], params);
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    // Standard edX JSinput functions
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr);

        if (state.l1x && state.l1y && state.l2x && state.l2y) {
            l1Pt.moveTo([state.l1x, state.l1y]);
            l2Pt.moveTo([state.l2x, state.l2y]);
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            l1x: l1Pt.X(),
            l1y: l1Pt.Y(),
            l2x: l2Pt.X(),
            l2y: l2Pt.Y()
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
