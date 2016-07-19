// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, D1, D2, S1, S2, iS2D2, dashes2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        // Interesection only appears when Demand and Supply segments
        // effectively intersect.
        JXG.Options.intersection.alwaysIntersect = false;
        ////////////
        // BOARD
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Q<sub>$</sub>',
            yname: '\u00A3/$'
        });

        // Supply Line 1 - fixed
        S1 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>$1</sub>',
            color: 'dodgerblue',
            c1: [3.25, 0.75],
            c2: [10.75, 8.25]
        });
        S1.setAttribute({
            dash: 1
        });

        // Supply Line 2 - moveable
        S2 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>$2</sub>',
            color: 'dodgerblue',
            c1: [3.25, 0.75],
            c2: [10.75, 8.25]
        });
        S2.setAttribute({
            withLabel: false,
            highlight: true,
            fixed: false
        });
        S2.point1.setAttribute({
            fixed: false
        });
        S2.point2.setAttribute({
            fixed: false
        });

        // Demand Line 1 - fixed
        D1 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D<sub>$1</sub>',
            color: 'orange'
        });
        D1.setAttribute({
            dash: 1
        });

        // Demand Line 2 - moveable
        D2 = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D<sub>$2</sub>',
            color: 'orange'
        });
        D2.setAttribute({
            withLabel: false,
            highlight: true,
            fixed: false
        });
        D2.point1.setAttribute({
            fixed: false
        });
        D2.point2.setAttribute({
            fixed: false
        });

        ////////////
        // Intersections of S1,D1 and S2,D2
        ////////////
        var iS1D1 = board.create('intersection', [D1, S1, 0], {
            visible: false
        });
        iS2D2 = board.create('intersection', [D2, S2, 0], {
            visible: false
        });

        ////////////
        // Fixed Dashed Lines for iS1D1
        ////////////
        var dashes1 = MacroLib.createDashedLines2Axis(board, iS1D1, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: '',
            color: 'gray'
        });
        setLabel(dashes1);

        ////////////
        // Draggable Dashed Lines for iS2D2
        ////////////
        dashes2 = MacroLib.createDashedLines2Axis(board, iS2D2, {
            withLabel: false,
            xlabel: 'Q<sub>2</sub>',
            ylabel: '',
            color: 'gray'
        });


        //////////////////
        // Interactivity
        //////////////////
        S2.on('down', lineS2Down);
        S2.on('drag', lineDrag);
        D2.on('down', lineD2Down);
        D2.on('drag', lineDrag);
    }

    // Supply line is initially y = -x + 11.5
    // Gets the line coords when one point is given
    // function getSupplyLineCoords(coords, dir) {
    //     var x2 = coords[0] + dir*7.5,
    //         y2 = coords[1] + dir*7.5;
    //     return [x2, y2];
    // }

    // Demand line is initially y = x + 7.5
    // Gets the line coords when one point is given
    // function getDemandLineCoords(coords, dir) {
    //     var x2 = coords[0] + dir*7.5,
    //         y2 = coords[1] - dir*7.5;
    //     return [x2, y2];
    // }

    // Use the following determinant to find the position of a point c
    // relative to line defined by a, b
    // | bx-ax  cy-ax |
    // | by-ay  cy-ay |
    // det < 0: on the left
    // det = 0: on line
    // det > 0: on the right
    // function det(a, b, c) {
    //     return (b.X()-a.X())*(c.Y()-a.Y()) - (b.Y()-a.Y())*(c.X()-a.X())
    // }

    function lineS2Down() {
        S2.setAttribute({
            withLabel: true
        });
        lineDown();
    }

    function lineD2Down() {
        D2.setAttribute({
            withLabel: true
        });
        lineDown();
    }

    function lineDown() {
        dashes2.X1.setAttribute({
            withLabel: true
        });
        dashes2.Y1.setAttribute({
            withLabel: true
        });
        board.update();
    }

    function lineDrag() {
        // Moving Dashed Lines
        dashes2.X1.moveTo([iS2D2.X(), 0]);
        dashes2.X2.moveTo([iS2D2.X(), iS2D2.Y()]);
        dashes2.Y1.moveTo([0, iS2D2.Y()]);
        dashes2.Y2.moveTo([iS2D2.X(), iS2D2.Y()]);
        setLabel(dashes2);
    }

    function pointsDiffer(pt1, pt2) {
        return pt1[0] !== pt2[0] || pt1[1] !== pt2[1];
    }

    function getLabelText(nbr) {
        return '\u00A3' + getLabelNumber(nbr).toFixed(2, 10);
    }

    function getLabelNumber(nbr) {
        // Adjust to [0, 1.2] range and round to nearest 0.1
        return Math.round(nbr*10)/100;
    }

    function setLabel(dashes) {
        var nbr = dashes.Y2.Y();
        dashes.Y1.setLabelText(getLabelText(nbr));
        dashes.Y1.prepareUpdate().update().updateRenderer();
    }

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    // Standard edX JSinput functions
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr),
            S1point1, S1point2, S2point1, S2point2, D1point1, D1point2, D2point1, D2point2;

        if (state.S2 && state.D2) {
            S1point1 = [state.S1.pt1x, state.S1.pt1y];
            S1point2 = [state.S1.pt2x, state.S1.pt2y];
            S2point1 = [state.S2.pt1x, state.S2.pt1y];
            S2point2 = [state.S2.pt2x, state.S2.pt2y];
            D1point1 = [state.D1.pt1x, state.D1.pt1y];
            D1point2 = [state.D1.pt2x, state.D1.pt2y];
            D2point1 = [state.D2.pt1x, state.D2.pt1y];
            D2point2 = [state.D2.pt2x, state.D2.pt2y];

            if (pointsDiffer(S1point1 , S2point1) || pointsDiffer(S1point2 , S2point2)) {
                S2.point1.moveTo(S2point1, 0);
                S2.point2.moveTo(S2point2, 0);
                lineS2Down();
                lineDrag();
            }

            if (pointsDiffer(D1point1 , D2point1) || pointsDiffer(D1point2 , D2point2)) {
                D2.point1.moveTo(D2point1, 0);
                D2.point2.moveTo(D2point2, 0);
                lineD2Down();
                lineDrag();
            }

            board.update();
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        // When intersection is not visible, set yInt to 100 which will grade false
        var yInt = !Number.isNaN(iS2D2.Y()) ? getLabelNumber(iS2D2.Y()) : 100,
            state = {
                S1: {
                    pt1x: S1.point1.X(),
                    pt2x: S1.point2.X(),
                    pt1y: S1.point1.Y(),
                    pt2y: S1.point2.Y()
                },
                S2: {
                    pt1x: S2.point1.X(),
                    pt2x: S2.point2.X(),
                    pt1y: S2.point1.Y(),
                    pt2y: S2.point2.Y()
                },
                D1: {
                    pt1x: D1.point1.X(),
                    pt2x: D1.point2.X(),
                    pt1y: D1.point1.Y(),
                    pt2y: D1.point2.Y()
                },
                D2: {
                    pt1x: D2.point1.X(),
                    pt2x: D2.point2.X(),
                    pt1y: D2.point1.Y(),
                    pt2y: D2.point2.Y()
                },
                yInt: yInt
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
