// Used as JSInput
var Macro = (function(JXG, MacroLib) {
    'use strict';
    var board, points = [],
        state = {
            selectedPointIndex: -1
        };

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        board = MacroLib.createBoard('jxgbox1', {
            xname: 'Consumer<br>Goods',
            yname: 'Capital<br>Goods',
            bboxlimits: [-2.0, 12, 12, -2]
        });

        var radius = 8.0;
        // Invisible center point
        var center = board.create('point', [0, 0], {
            visible: false
        });

        // Points on arc
        var x, y, i, angle, inc = Math.PI/6.0;
        for (i = 0; i < 4; i++) {
            angle = i*inc;
            x = radius*Math.cos(angle);
            y = radius*Math.sin(angle);

            points.push(board.create('point', [x, y], {
                highlight: true,
                withLabel: false,
                strokeColor: 'gray',
                fillColor: 'gray',
                size: 5
            }));
            // Interactivity
            points[i].on('down', function() {
                var index = getIndex(points, this);
                selectPoint(index);
            });
        }
        // Points above and below arc
        // Below
        points.push(board.create('point', [4, 4], {
            highlight: true,
            withLabel: false,
            strokeColor: 'gray',
            fillColor: 'gray',
            size: 5
        }));
        // Interactivity
        points[points.length-1].on('down', function() {
            var index = getIndex(points, this);
            selectPoint(index);
        });
        // Above
        points.push(board.create('point', [7, 7], {
            highlight: true,
            withLabel: false,
            strokeColor: 'gray',
            fillColor: 'gray',
            size: 5
        }));
        // Interactivity
        points[points.length-1].on('down', function() {
            var index = getIndex(points, this);
            selectPoint(index);
        });

        // Create an arc out of three free points
        var semi = board.create('arc', [center, points[0], points[3]], {
            strokeWidth: 5,
            strokeColor: 'dodgerblue'
        });
    }

    function getIndex(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return i;
            }
        }
        return -1;
    }

    // Color selected point in red and unselected in gray.
    // index = -1 indicates that no point is selected.
    function selectPoint(index) {
        var i, len = points.length, color;

        state.selectedPointIndex = index;
        for (i = 0; i < len; i++) {
            if (i !== index) {
                color = 'gray';
            }
            else {
                color = 'red';
            }
            points[i].setAttribute({
                strokeColor: color,
                fillColor: color
            });
        }
    }

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        state.selectedPointIndex = -1;
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    init();

    // Standard edX JSinput functions.
    function setState(transaction, stateStr) {
        state = JSON.parse(stateStr);

        if (state.selectedPointIndex.length !== 0) {
            selectPoint(state.selectedPointIndex);
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        console.info('State successfully saved.');
        return JSON.stringify(state);
    }

    function getGrade() {
        return getState();
    }

    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade: getGrade
    };

})(JXG, MacroLib, undefined);
