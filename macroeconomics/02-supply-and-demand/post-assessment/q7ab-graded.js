(function(JXG, MacroLib) {
    'use strict';
    var board, demandLine1, demandLine2, supplyLine1, supplyLine2, intersection1, intersection2, dashes1, dashes2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity<br>of Shoes',
            yname: 'Price of<br>Shoes'
        });

        // Demand Line 1 - fixed
        demandLine1 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D<sub>1</sub>',
            color: 'gray'
        });
        demandLine1.setAttribute({
            dash: 1,
        });

        // Demand Line 2 - moveable
        demandLine2 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D<sub>2</sub>',
            color: 'dodgerblue'
        });
        demandLine2.setAttribute({
            withLabel: false,
            highlight: true,
            fixed: false
        });
        demandLine2.point1.setAttribute({
            fixed: false
        });
        demandLine2.point2.setAttribute({
            fixed: false
        });

        // Supply Line 1 - fixed
        supplyLine1 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'gray'
        });
        supplyLine1.setAttribute({
            dash: 1
        });

        // Supply Line 2 - moveable
        supplyLine2 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>2</sub>',
            color: 'orange'
        });
        supplyLine2.setAttribute({
            withLabel: false,
            highlight: true,
            fixed: false
        });
        supplyLine2.point1.setAttribute({
            fixed: false
        });
        supplyLine2.point2.setAttribute({
            fixed: false
        });

        // Fixed Intersection of Demand Line 1 and Supply Line 1
        intersection1 = board.create('intersection', [demandLine1, supplyLine1, 0], {
            withLabel: false,
            color: 'gray'
        });

        // Moving Intersection of Demand Line 2 and Supply Line 2
        intersection2 = board.create('intersection', [demandLine2, supplyLine2, 0], {
            withLabel: false,
            fixed: false,
            color: 'red'
        });

        // Dashes to x,y axes for Intersection 1
        dashes1 = MacroLib.createDashedLines2Axis(board, intersection1, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: 'P<sub>1</sub>',
            color: 'gray'
        });

        // Dashes to x,y axes for Intersection 2
        dashes2 = MacroLib.createDashedLines2Axis(board, intersection2, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'P<sub>2</sub>',
            color: 'gray'
        });
        dashedLinesVisibility(dashes2, false);

        //////////////////
        // Interactivity
        //////////////////
        demandLine2.on('down', function() {
            demandLine2.setAttribute({
                withLabel: true
            });
            dashedLinesVisibility(dashes2, true);
            board.update();
        });
        demandLine2.on('drag', function() {
            moveDashedLines(dashes2, intersection2);
            board.update();
        });
        supplyLine2.on('down', function() {
            supplyLine2.setAttribute({
                withLabel: true
            });
            dashedLinesVisibility(dashes2, true);
            board.update();
        });
        supplyLine2.on('drag', function() {
            moveDashedLines(dashes2, intersection2);
            board.update();
        });
    }

    function moveDashedLines(dashedLines, destPt) {
        dashedLines.X1.moveTo([destPt.X(), 0]);
        dashedLines.X2.moveTo([destPt.X(), destPt.Y()]);
        dashedLines.Y1.moveTo([0, destPt.Y()]);
        dashedLines.Y2.moveTo([destPt.X(), destPt.Y()]);
    }

    function dashedLinesVisibility(dashedLines, vis) {
        if (vis) {
            dashedLines.X1.showElement();
            dashedLines.XLine.showElement();
            dashedLines.Y1.showElement();
            dashedLines.YLine.showElement();
        }
        else {
            dashedLines.X1.hideElement();
            dashedLines.XLine.hideElement();
            dashedLines.Y1.hideElement();
            dashedLines.YLine.hideElement();
        }
    }

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    if (resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', resetAnimation);
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(board);
        init();
    }

    // Standard edX JSinput functions
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr);

        if (state.demand2 && state.supply2 && state.eq2) {
            var point1, point2;
            // Demand Line 2
            point1 = [state.demand2.p1X, state.demand2.p1Y];
            point2 = [state.demand2.p2X, state.demand2.p2Y];
            demandLine2.point1.moveTo(point1, 0);
            demandLine2.point2.moveTo(point2, 0);
            // Suppy Line 2
            point1 = [state.supply2.p1X, state.supply2.p1Y];
            point2 = [state.supply2.p2X, state.supply2.p2Y];
            supplyLine2.point1.moveTo(point1, 0);
            supplyLine2.point2.moveTo(point2, 0);
            // Intersection point will move automatically when the above lines do.
            board.update();
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            demand2: {
                p1X: demandLine2.point1.X(),
                p2X: demandLine2.point2.X(),
                p1Y: demandLine2.point1.Y(),
                p2Y: demandLine2.point2.Y()
            },
            supply2: {
                p1X: supplyLine2.point1.X(),
                p2X: supplyLine2.point2.X(),
                p1Y: supplyLine2.point1.Y(),
                p2Y: supplyLine2.point2.Y()
            },
            eq2: {
                X: intersection2.X(),
                Y: intersection2.Y()
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
