// Used as JSInput
var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, MS1, MS2, iB1SD, dashS2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        var cfx = 800.0 / 12.0;
        var cfy = 27.0 / 12.0;
        var newbbox = [-120, 27, 800, -4];

        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: ' ',
            yname: ' ',
            grid: false,
            bboxlimits: newbbox
        });

        var xaxis = brd1.create('axis', [
            [0, 0],
            [1, 0]
        ], {
            name: 'Quantity of Money ($billions)',
            withLabel: false,
        });
        xaxis.removeAllTicks();
        brd1.create('ticks', [xaxis, [0, 100, 200, 300, 400, 500, 600, 700, 800]], {
            strokeColor: 'Black',
            majorHeight: 15,
            drawLabels: true,
            label: {
                offset: [0, -20]
            }
        });
        var xlabel1 = brd1.create('text', [380, -2.75, 'Quantity of Money ($billions)'], {
            fixed: true,
            highlight: false
        });

        var yaxis = brd1.create('axis', [
            [0, 0],
            [0, 1]
        ], {
            name: '',
            withLabel: true,
        });
        yaxis.removeAllTicks();
        brd1.create('ticks', [yaxis, [0, 5, 10, 15, 20, 25, 30]], {
            strokeColor: 'Black',
            majorHeight: 15,
            drawLabels: true
        });
        var ylabel1 = brd1.create('text', [-110, 22, 'Nominal<br>Interest<br>Rate'], {
            fixed: true,
            highlight: false
        });

        //Supply Line 1 - fixed
        MS1 = brd1.create('segment', [
            [cfx * 6.0, cfy * 11.0],
            [cfx * 6.0, cfy * 1.0]
        ], {
            strokeColor: 'Gray',
            strokeWidth: '5',
            name: '',
            withLabel: false,
            fixed: true,
            dash: 1,
            highlight: false,
        });

        //Demand Line 1 - fixed
        var MD1 = brd1.create('segment', [
            [cfx * 1.45, cfy * 9.0],
            [cfx * 9.0, cfy * 1.45]
        ], {
            strokeColor: 'Orange',
            strokeWidth: '5',
            name: 'M<sub>D</sub>',
            withLabel: true,
            fixed: true,
            highlight: false,
            label: {
                offset: [150, -140]
            }
        });

        //Supply Line 2 - moveable
        MS2 = brd1.create('segment', [
            [cfx * 6.0, cfy * 11.0],
            [cfx * 6.0, cfy * 1.0]
        ], {
            strokeColor: 'DodgerBlue',
            strokeWidth: '5',
            name: 'M<sub>S</sub>',
            withLabel: true,
            fixed: false,
            highlight: true,
            label: {
                offset: [-10, 185]
            }
        });

        ////////////
        // Intersection Box 1
        ////////////
        //S Intersection
        iB1SD = brd1.create('intersection', [MS2, MD1, 0], {
            size: 4,
            visible: true,
            color: 'DarkBlue',
            strokeColor: 'DarkBlue'
        });

        ////////////
        // Draggable Dashed Lines for Board 1
        ////////////
        dashS2 = MacroLib.createDashedLines2Axis(brd1, iB1SD, {
            fixed: false,
            withLabel: false,
            xlabel: '',
            ylabel: '',
            color: 'Gray'
        });

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving 1st set of Dashed Lines in Board 1
            dashS2.Y1.moveTo([0, iB1SD.Y()]);
            dashS2.Y2.moveTo([iB1SD.X(), iB1SD.Y()]);

            dashS2.X1.moveTo([iB1SD.X(), 0]);
            dashS2.X2.moveTo([iB1SD.X(), iB1SD.Y()]);
        });
    }

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    init();
    MacroLib.onLoadPostMessage();

    //Standard edX JSinput functions
    function getGrade() {
        var state = {
            'MS1': {
                'X1': MS1.point1.X(),
                'X2': MS1.point2.X(),
                'Y1': MS1.point1.Y(),
                'Y2': MS1.point2.Y()
            },
            'MS2': {
                'X1': MS2.point1.X(),
                'X2': MS2.point2.X(),
                'Y1': MS2.point1.Y(),
                'Y2': MS2.point2.Y()
            }
        };
        var statestr = JSON.stringify(state);

        return statestr;
    }

    function getState() {
        var state = JSON.parse(getGrade());
        var statestr = JSON.stringify(state);
        return statestr;
    }

    function setState(transaction, statestr) {
        var state = JSON.parse(statestr);

        if (state.MS1 && state.MS2) {
            MS1.point1.moveTo([state.MS1.X1, state.MS1.Y1], 0);
            MS1.point2.moveTo([state.MS1.X2, state.MS1.Y2], 0);

            MS2.point1.moveTo([state.MS2.X1, state.MS2.Y1], 0);
            MS2.point2.moveTo([state.MS2.X2, state.MS2.Y2], 0);

            dashS2.Y1.moveTo([0, iB1SD.Y()]);
            dashS2.Y2.moveTo([iB1SD.X(), iB1SD.Y()]);

            dashS2.X1.moveTo([iB1SD.X(), 0]);
            dashS2.X2.moveTo([iB1SD.X(), iB1SD.Y()]);
            brd1.update();

        }
        brd1.update();
        console.debug('State updated successfully from saved.');
    }

    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade: getGrade
    };
})(JXG, MacroLib, undefined);
