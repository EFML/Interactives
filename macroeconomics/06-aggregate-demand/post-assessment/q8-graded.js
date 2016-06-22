(function(JXG, MacroLib) {
    'use strict';
    var board, AD1, AD2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            xname: 'Real GDP',
            yname: 'Price<br>Level',
        });

        // All lines are of the form y = -x + b

        // Demand Line AD (b = 12.5) - fixed
        var AD = MacroLib.createLine(board, {
            c1: [2.5, 10.0],
            c2: [10.0, 2.5],
            name: 'AD',
            color: 'gray'
        });
        // Demand Line AD1 (b = 14) - moveable
        AD1 = MacroLib.createLine(board, {
            c1: [3.25, 10.75],
            c2: [10.75, 3.25],
            name: 'AD<sub>1</sub>',
            color: 'dodgerblue'
        });
        AD1.setAttribute({
            fixed: false,
            highlight: true
        });
        AD1.point1.setAttribute({
            fixed: false
        });
        AD1.point2.setAttribute({
            fixed: false
        });
        // Demand Line AD2 (b = 11) - moveable
        AD2 = MacroLib.createLine(board, {
            c1: [1.75, 9.25],
            c2: [9.25, 1.75],
            name: 'AD<sub>2</sub>',
            color: 'blue'
        });
        AD2.setAttribute({
            fixed: false,
            highlight: true
        });
        AD2.point1.setAttribute({
            fixed: false
        });
        AD2.point2.setAttribute({
            fixed: false
        });
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

        if (state.AD1 && state.AD2) {
            var point1, point2;
            // AD1 Line
            point1 = [state.AD1.p1X, state.AD1.p1Y];
            point2 = [state.AD1.p2X, state.AD1.p2Y];
            AD1.point1.moveTo(point1, 0);
            AD1.point2.moveTo(point2, 0);
            // AD2 Line
            point1 = [state.AD2.p1X, state.AD2.p1Y];
            point2 = [state.AD2.p2X, state.AD2.p2Y];
            AD2.point1.moveTo(point1, 0);
            AD2.point2.moveTo(point2, 0);
            board.update();
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        // p1X, p1Y, p2X, p2Y are used to reposition lines on reload after saving state
        // b is used for grading ie to find the relative position of AD, AD1, AD2
        var state = {
            AD1: {
                p1X: AD1.point1.X(),
                p1Y: AD1.point1.Y(),
                p2X: AD1.point2.X(),
                p2Y: AD1.point2.Y(),
                b:   AD1.point1.X() + AD1.point1.Y()
            },
            AD2: {
                p1X: AD2.point1.X(),
                p1Y: AD2.point1.Y(),
                p2X: AD2.point2.X(),
                p2Y: AD2.point2.Y(),
                b:   AD2.point1.X() + AD2.point1.Y()
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
