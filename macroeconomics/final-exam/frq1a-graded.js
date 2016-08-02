// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, LRAS, AD, SRAS, intersection1, intersection2, intersection3, dashes1, dashes2, dashes3, pt1, pt2, pointSize = 3, pointColor = 'red';

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
            [5.75, 11.0],
            [5.75, 0.0]
        ], {
            strokeColor: 'darkgray',
            strokeWidth: '3',
            name: 'LRAS',
            withLabel: true,
            label: {
                offset: [-15, 200]
            }
        });

        // AD - moveable
        AD = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'AD',
            color: 'dodgerblue',
        });
        AD.setAttribute({
            highlight: true,
            fixed: false
        });
        AD.point1.setAttribute({
            fixed: false
        });
        AD.point2.setAttribute({
            fixed: false
        });

        // SRAS - moveable
        SRAS = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'SRAS',
            color: 'orange',
        });
        SRAS.setAttribute({
            highlight: true,
            fixed: false
        });
        SRAS.point1.setAttribute({
            fixed: false
        });
        SRAS.point2.setAttribute({
            fixed: false
        });

        // Intersection of LRAS and AD
        intersection1 = board.create('intersection', [LRAS, AD, 0], {
            visible: true,
            name: '',
            strokecolor: pointColor,
            fillcolor: pointColor,
            size: pointSize
        });

        // Intersection of LRAS and SRAS
        intersection2 = board.create('intersection', [LRAS, SRAS, 0], {
            visible: true,
            name: '',
            strokecolor: pointColor,
            fillcolor: pointColor,
            size: pointSize
        });

        // Intersection of AD and SRAS
        intersection3 = board.create('intersection', [AD, SRAS, 0], {
            visible: true,
            name: '',
            strokecolor: pointColor,
            fillcolor: pointColor,
            size: pointSize
        });

        // Dashes for intersection 1 -- fixed
        dashes1 = MacroLib.createDashedLines2Axis(board, intersection1, {
            withLabel: false,
            fixed: false,
            color: 'darkgray'
        });
        dashes1.X1.setAttribute({
            strokecolor: pointColor,
            fillcolor: pointColor,
            size: pointSize
        });
        dashes1.Y1.setAttribute({
            strokecolor: pointColor,
            fillcolor: pointColor,
            size: pointSize
        });

        // Dashes for intersection 2 -- fixed
        dashes2 = MacroLib.createDashedLines2Axis(board, intersection2, {
            withLabel: false,
            fixed: false,
            color: 'darkgray'
        });
        dashes2.X1.setAttribute({
            strokecolor: pointColor,
            fillcolor: pointColor,
            size: pointSize
        });
        dashes2.Y1.setAttribute({
            strokecolor: pointColor,
            fillcolor: pointColor,
            size: pointSize
        });

        // Dashes for intersection 3 -- fixed
        dashes3 = MacroLib.createDashedLines2Axis(board, intersection3, {
            withLabel: false,
            fixed: false,
            color: 'darkgray'
        });
        dashes3.X1.setAttribute({
            strokecolor: pointColor,
            fillcolor: pointColor,
            size: pointSize
        });
        dashes3.Y1.setAttribute({
            strokecolor: pointColor,
            fillcolor: pointColor,
            size: pointSize
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
        params.name = 'Y<sub>1</sub>';
        pt1 = board.create('point', [3.0, 10.85], params);
        params.name = 'PL<sub>1</sub>';
        pt2 = board.create('point', [1.0, 10.85], params);
        //////////////////
        // Interactivity
        //////////////////
        AD.on('drag', lineDrag);
        SRAS.on('drag', lineDrag);
    }

    function lineDrag() {
        // Moving Dashed Lines
        dashes1.X1.moveTo([intersection1.X(), 0]);
        dashes1.Y1.moveTo([0, intersection1.Y()]);
        dashes1.X2.moveTo([intersection1.X(), intersection1.Y()]);
        dashes1.Y2.moveTo([intersection1.X(), intersection1.Y()]);

        dashes2.X1.moveTo([intersection2.X(), 0]);
        dashes2.Y1.moveTo([0, intersection2.Y()]);
        dashes2.X2.moveTo([intersection2.X(), intersection2.Y()]);
        dashes2.Y2.moveTo([intersection2.X(), intersection2.Y()]);

        dashes3.X1.moveTo([intersection3.X(), 0]);
        dashes3.Y1.moveTo([0, intersection3.Y()]);
        dashes3.X2.moveTo([intersection3.X(), intersection3.Y()]);
        dashes3.Y2.moveTo([intersection3.X(), intersection3.Y()]);
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

        if (state.AD && state.SRAS && state.pt1 && state.pt2) {
            var point1 = [state.AD.p1X, state.AD.p1Y],
                point2 = [state.AD.p2X, state.AD.p2Y];
            AD.point1.moveTo(point1, 0);
            AD.point2.moveTo(point2, 0);
            point1 = [state.SRAS.p1X, state.SRAS.p1Y];
            point2 = [state.SRAS.p2X, state.SRAS.p2Y];
            SRAS.point1.moveTo(point1, 0);
            SRAS.point2.moveTo(point2, 0);
            lineDrag();
            pt1.moveTo([state.pt1.x, state.pt1.y]);
            pt2.moveTo([state.pt2.x, state.pt2.y]);
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            AD: {
                p1X: AD.point1.X(),
                p2X: AD.point2.X(),
                p1Y: AD.point1.Y(),
                p2Y: AD.point2.Y()
            },
            SRAS: {
                p1X: SRAS.point1.X(),
                p2X: SRAS.point2.X(),
                p1Y: SRAS.point1.Y(),
                p2Y: SRAS.point2.Y()
            },
            pt1: {
                x: pt1.X(),
                y: pt1.Y()
            },
            pt2: {
                x: pt2.X(),
                y: pt2.Y()
            },
            int: {
                x: intersection3.X(),
                y: intersection3.Y()
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
