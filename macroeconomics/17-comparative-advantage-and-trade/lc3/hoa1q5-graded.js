// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var leftComponents = {el: 'jxgbox1'}, rightComponents = {el: 'jxgbox2'};

    function initBoard(c, title, xInit, yInit) {
        MacroLib.init(MacroLib.TWO_BOARDS);

        c.board = MacroLib.createBoard(c.el, {
            bboxlimits: [-28, 75, 75, -8],
            xname: 'Steel',
            yname: 'Computers'
        });

        c.title = c.board.create('text', [30, 70.5, title]);

        c.fixedXPoint = c.board.create('point', [xInit, 0], {
            strokeColor: 'gray',
            fillColor: 'gray',
            size: 5,
            name: xInit.toString(),
            label: {
                offset: [10, -10]
            }
        });
        c.moveableXPoint = c.board.create('point', [xInit, 0], {
            fixed: false,
            highlight: true,
            strokeColor: 'dodgerblue',
            fillColor: 'dodgerblue',
            size: 5,
            name: '',
            label: {
                offset: [10, 15]
            }
        });
        c.fixedYPoint = c.board.create('point', [0, yInit], {
            strokeColor: 'gray',
            fillColor: 'gray',
            size: 5,
            name: yInit.toString(),
            label: {
                offset: [-30, 12]
            }
        });
        c.moveableYPoint = c.board.create('point', [0, yInit], {
            fixed: false,
            highlight: true,
            strokeColor: 'dodgerblue',
            fillColor: 'dodgerblue',
            size: 5,
            name: ''
        });

        c.fixedLine = c.board.create(
            'segment',
            [c.fixedXPoint, c.fixedYPoint],
            {
                dash: 1,
                strokeWidth: 5,
                strokeColor: 'gray'
            }
        );
        c.moveableLine = c.board.create(
            'segment',
            [c.moveableXPoint, c.moveableYPoint],
            {
                strokeWidth: 5,
                strokeColor: 'dodgerblue'
            }
        );

        // Interactivity
        c.moveableXPoint.on('down', function() {
            this.setAttribute({withLabel: true});
            this.setLabelText(getLabelText(this.X()));
            this.prepareUpdate().update().updateRenderer();
        });
        c.moveableXPoint.on('drag', function() {
            var xConstrained = clipToAxisBounds(this.X()),
                yConstrained = 0;
            this.setPositionDirectly(JXG.COORDS_BY_USER, [xConstrained, yConstrained]);
            this.setLabelText(getLabelText(this.X()));
            this.prepareUpdate().update().updateRenderer();
        });

        c.moveableYPoint.on('down', function() {
            this.setAttribute({withLabel: true});
            this.setLabelText(getLabelText(this.Y()));
            this.prepareUpdate().update().updateRenderer();
        });
        c.moveableYPoint.on('drag', function() {
            var xConstrained = 0,
                yConstrained = clipToAxisBounds(this.Y());
            this.setPositionDirectly(JXG.COORDS_BY_USER, [xConstrained, yConstrained]);
            this.setAttribute({withLabel: true});
            this.setLabelText(getLabelText(this.Y()));
            this.prepareUpdate().update().updateRenderer();
        });
    }

    function clipToAxisBounds(n) {
        if  (n < 0) {
            return 0;
        }
        else if (n > 60) {
            return 60;
        }
        else {
            return n;
        }
    }

    function getLabelText(nbr) {
        // Round to nearest 0.5
        nbr = Math.round(nbr*2)/2;
        // One of the correct answer is not a multiple of 0.5,
        // display it instead
        nbr = nbr !== 33.5 ? nbr : 33.3;
        return nbr.toFixed(1, 10);
    }

    function setLabel(comp, nbr) {
        comp.setAttribute({withLabel: true});
        comp.setLabelText(getLabelText(nbr));
        comp.prepareUpdate().update().updateRenderer();
    }

    function init() {
        initBoard(leftComponents, 'Producer G', 20, 25);
        initBoard(rightComponents, 'Producer H', 25, 50);
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimation1Btn = document.getElementById('resetAnimation1Btn');
    var resetAnimation2Btn = document.getElementById('resetAnimation2Btn');

    //Interactivity
    if (resetAnimation1Btn) {
        resetAnimation1Btn.addEventListener('click', resetAnimation1);
    }
    if (resetAnimation2Btn) {
        resetAnimation2Btn.addEventListener('click', resetAnimation2);
    }

    function resetAnimation1() {
        JXG.JSXGraph.freeBoard(leftComponents.board);
        initBoard(leftComponents, 'Producer G', 20, 25);
    }

    function resetAnimation2() {
        JXG.JSXGraph.freeBoard(rightComponents.board);
        initBoard(rightComponents, 'Producer H', 25, 50);
    }

    // Standard edX JSinput functions.
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr);

        if (state.xLeft && state.yLeft && state.xRight && state.yRight) {
            leftComponents.moveableXPoint.moveTo([state.xLeft, 0]);
            leftComponents.moveableYPoint.moveTo([0, state.yLeft]);
            rightComponents.moveableXPoint.moveTo([state.xRight, 0]);
            rightComponents.moveableYPoint.moveTo([0, state.yRight]);
            if (state.xLeft !== 20) {
                setLabel(leftComponents.moveableXPoint, state.xLeft);
            }
            if (state.yLeft !== 25) {
                setLabel(leftComponents.moveableYPoint, state.yLeft);
            }
            if (state.xRight !== 25) {
                setLabel(rightComponents.moveableXPoint, state.xRight);
            }
            if (state.yRight !== 50) {
                setLabel(rightComponents.moveableYPoint, state.yRight);
            }
        }

        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            xLeft: leftComponents.moveableXPoint.X(),
            yLeft: leftComponents.moveableYPoint.Y(),
            xRight: rightComponents.moveableXPoint.X(),
            yRight: rightComponents.moveableYPoint.Y(),
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
