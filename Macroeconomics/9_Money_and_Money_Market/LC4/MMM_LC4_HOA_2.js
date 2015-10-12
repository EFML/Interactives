var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, dashS1, S, iSD;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        var bboxlimits = [-1.6, 12, 12, -1.1];
        brd1 = JXG.JSXGraph.initBoard('jxgbox1', {
            axis: false,
            showCopyright: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            boundingbox: bboxlimits,
            grid: false,
            hasMouseUp: true,
        });

        var xaxis = brd1.create('axis', [
            [0, 0],
            [12, 0]
        ], {
            withLabel: true,
            label: {
                offset: [320, -20]
            }
        });
        var yaxis = brd1.create('axis', [
            [0, 0],
            [0, 12]
        ], {
            withLabel: true,
            label: {
                offset: [-60, 260]
            }
        });

        //Axes
        xaxis.removeAllTicks();
        yaxis.removeAllTicks();
        var ylabel = brd1.create('text', [-1.5, 10, "Interest<br>Rate"], {
            fixed: true
        });
        var xlabel = brd1.create('text', [8.5, -0.5, "Quantity of Money"], {
            fixed: true
        });

        //Demand 1
        var D1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'D<sub>1</sub>',
            color: 'DodgerBlue'
        });
        D1.setAttribute({
            fixed: true
        });

        ////////////
        //LRAS - straight line
        ////////////
        var Sx1 = 5.75;
        var Sx2 = Sx1;
        var Sy1 = 0.5;
        var Sy2 = 10.5;

        var Sfix = brd1.create('segment', [
            [5.75, 10.5],
            [5.75, 0.5]
        ], {
            'strokeColor': 'Gray',
            'strokeWidth': '3',
            'name': 'S<sub>1</sub>',
            'withLabel': true,
            'fixed': true,
            'dash': 1,
            'highlight': false,
            'label': {
                'offset': [0, 185]
            }
        });

        S = brd1.create('segment', [
            [5.75, 10.5],
            [5.75, 0.5]
        ], {
            'strokeColor': 'Lime',
            'strokeWidth': '5',
            'name': 'S<sub>2</sub>',
            'withLabel': false,
            'fixed': false,
            'highlight': true,
            'label': {
                'offset': [0, 185]
            }
        });

        var iSDfix = brd1.create('intersection', [Sfix, D1, 0], {
            visible: false
        });

        iSD = brd1.create('intersection', [S, D1, 0], {
            visible: false
        });

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        dashS1 = MacroLib.createDashedLines2Axis(brd1, iSD, {
            fixed: false,
            withLabel: false,
            xlabel: 'Y<sub>2</sub>',
            ylabel: 'R<sub>2</sub>',
            color: 'Gray'
        });

        var dashSfix = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            fixed: true,
            withLabel: true,
            xlabel: 'Y<sub>1</sub>',
            ylabel: 'R<sub>1</sub>',
            color: 'Gray'
        });

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines in Board 1
            dashS1.Y1.moveTo([0, iSD.Y()]);
            dashS1.Y2.moveTo([iSD.X(), iSD.Y()]);

            dashS1.X1.moveTo([iSD.X(), 0]);
            dashS1.X2.moveTo([iSD.X(), iSD.Y()]);
            brd1.update()
        });

        brd1.on('mousedown', function() {
            toggleLabels(true);
            brd1.update()
        });
    }

    var delta = 2.0;

    function toggleLabels(toggle) {
        dashS1.X1.setAttribute({
            withLabel: toggle
        });
        dashS1.Y1.setAttribute({
            withLabel: toggle
        });
        S.setAttribute({
            withLabel: toggle
        });
    };

    //Animation for shifting curve SouthWest
    function decreaseXY() {
        resetAnimation();
        brd1.update();

        var speed = 1000;
        toggleLabels(true);

        S.point1.moveTo([S.point1.X() - delta, S.point1.Y()], speed);
        S.point2.moveTo([S.point2.X() - delta, S.point2.Y()], speed);

        dashS1.Y1.moveTo([0, iSD.Y() + delta], speed);
        dashS1.Y2.moveTo([iSD.X() - delta, iSD.Y() + delta], speed);

        dashS1.X1.moveTo([iSD.X() - delta, 0], speed);
        dashS1.X2.moveTo([iSD.X() - delta, iSD.Y() + delta], speed);

        brd1.update();
    }

    //Animation for shifting curve NorthEast
    function increaseXY() {
        var speed = 1000;
        resetAnimation();
        toggleLabels(true);
        //brd1.update();

        S.point1.moveTo([S.point1.X() + delta, S.point1.Y()], speed);
        S.point2.moveTo([S.point2.X() + delta, S.point2.Y()], speed);

        dashS1.Y1.moveTo([0, iSD.Y() - delta], speed);
        dashS1.Y2.moveTo([iSD.X() + delta, iSD.Y() - delta], speed);

        dashS1.X1.moveTo([iSD.X() + delta, 0], speed);
        dashS1.X2.moveTo([iSD.X() + delta, iSD.Y() - delta], speed);

        brd1.update();
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var startAnimationBtn = document.getElementById('startAnimationBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    startAnimationBtn.addEventListener('click', decreaseXY);
    resetAnimationBtn.addEventListener('click', resetAnimation);

    init();

    //Standard edX JSinput functions
    function getInput() {
        state = {};
        statestr = JSON.stringify(state);
        console.log(statestr)

        //IPython Notebook Considerations
        document.getElementById('spaceBelow').innerHTML += '<br>' + statestr;
        var command = "state = '" + statestr + "'";
        console.log(command);

        //Kernel
        var kernel = IPython.notebook.kernel;
        kernel.execute(command);

        return statestr;
    }

    function getState() {
        state = {
            'input': JSON.parse(getInput())
        };
        statestr = JSON.stringify(state);
        return statestr
    }

    function setState(statestr) {
        $('#msg').html('setstate ' + statestr);
        state = JSON.parse(statestr);
        console.log(statestr);
        console.debug('State updated successfully from saved.');
    }
    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade: getGrade
    };
})(JXG, MacroLib, undefined);