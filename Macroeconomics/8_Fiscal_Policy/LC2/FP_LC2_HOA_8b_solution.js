var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////

        var newBBox = [-1.5, 12, 12, -1.75];

        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: "Real GDP",
            yname: "Price<br>Level",
            grid: false,
            'xpos': [9, -0.5],
            'ypos': [-1.2, 10],
            bboxlimits: newBBox
        });

        //Sliders
        var sliderx = brd1.create('slider', [
            [3.5, -1.2],
            [8.5, -1.2],
            [-2.0, 0, 0.0]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'Orange'
        });

        //Positive Slider Transformation
        var sliderXPositive = brd1.create('transform', [
            function() {
                return sliderx.Value()
            },
            function() {
                return 0.0
            }
        ], {
            type: 'translate'
        });

        //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'SRAS<sub>1</sub>',
            color: 'DodgerBlue'
        });
        SRAS1.setAttribute({
            fixed: true,
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        //Supply Line 2 - moveable
        var SRAS2 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: '',
            color: 'DodgerBlue'
        });
        SRAS2.setAttribute({
            fixed: false,
            'highlight': false,
            withLabel: false
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'AD<sub>1</sub>',
            color: 'Orange'
        });
        AD1.setAttribute({
            fixed: true,
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        // //Demand Line 2 - moveable
        var AD2 = MacroLib.createTransformLine(brd1, {
            'transformList': [sliderXPositive],
            ltype: 'Demand',
            name: 'AD<sub>2</sub>',
            color: 'Orange'
        });
        AD2.setAttribute({
            fixed: false,
            'highlight': false,
            withLabel: false
        });


        ////////////
        // Intersection Box 1
        ////////////
        var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {
            visible: false
        });
        var iS2D = brd1.create('intersection', [AD2, SRAS2, 0], {
            visible: false
        });

        ////////////
        // Draggable Dashed Lines for Board 1
        ////////////
        var dashS2 = MacroLib.createDashedLines2Axis(brd1, iS2D, {
            fixed: false,
            withLabel: false,
            xlabel: 'Y<sub>2</sub>',
            ylabel: 'PL<sub>2</sub>',
            color: 'Orange'
        });

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashesFixedB1 = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'Y<sub>1</sub>',
            ylabel: 'PL<sub>1</sub>',
            color: 'DodgerBlue'
        });

        ////////////
        //LRAS - straight line
        ////////////
        var LRAS = brd1.create('segment', [
            [5.75, 11.0],
            [5.75, 0.0]
        ], {
            'strokeColor': 'DarkGray',
            'strokeWidth': '3',
            'name': 'LRAS',
            'withLabel': true,
            'fixed': true,
            'label': {
                'offset': [-15, 200]
            }
        });

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines in Board 1
            dashS2.Y1.moveTo([0, iS2D.Y()]);
            dashS2.Y2.moveTo([iS2D.X(), iS2D.Y()]);

            dashS2.X1.moveTo([iS2D.X(), 0]);
            dashS2.X2.moveTo([iS2D.X(), iS2D.Y()]);

        });

        brd1.on('mousedown', function() {
            AD2.setAttribute({
                withLabel: true
            });
            SRAS2.setAttribute({
                withLabel: true
            });
            dashS2.Y1.setAttribute({
                withLabel: true
            });
            dashS2.X1.setAttribute({
                withLabel: true
            });
            brd1.update()
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    init();

    //Standard edX JSinput functions
    function setState(transaction, statestr) {
        state = JSON.parse(statestr);
        //console.log(state);
        //console.log(state["dragLine"]);

        if (state["AD2"] && state["SRAS2"]) {
            //brd1.removeObject('AD2');
            var point1 = [state["AD2"]["p1X"], state["AD2"]["p1Y"]];
            var point2 = [state["AD2"]["p2X"], state["AD2"]["p2Y"]]
            AD2.point1.moveTo(point1, 0);
            AD2.point2.moveTo(point2, 0);

            var point1 = [state["SRAS2"]["p1X"], state["SRAS2"]["p1Y"]];
            var point2 = [state["SRAS2"]["p2X"], state["SRAS2"]["p2Y"]]
            SRAS2.point1.moveTo(point1, 0);
            SRAS2.point2.moveTo(point2, 0);

            brd1.update();
        }

        console.debug('State updated successfully from saved.');
    }

    function getState() {
        var state = JSON.parse(getGrade());
        statestr = JSON.stringify(state);
        // console.log(statestr);
        return statestr;
    }

    function getGrade() {
        var state = {
            "iS2D": {
                'X': iS2D.X(),
                'Y': iS2D.Y()
            },
            "iSDfix": {
                'X': iSDfix.X(),
                'Y': iSDfix.Y()
            },
            "AD2": {
                'p1X': AD2.point1.X(),
                'p2X': AD2.point2.X(),
                'p1Y': AD2.point1.Y(),
                'p2Y': AD2.point2.Y()
            },
            "AD1": {
                'p1X': AD1.point1.X(),
                'p2X': AD1.point2.X(),
                'p1Y': AD1.point1.Y(),
                'p2Y': AD1.point2.Y()
            },
            "SRAS2": {
                'p1X': SRAS2.point1.X(),
                'p2X': SRAS2.point2.X(),
                'p1Y': SRAS2.point1.Y(),
                'p2Y': SRAS2.point2.Y()
            },
            "SRAS1": {
                'p1X': SRAS1.point1.X(),
                'p2X': SRAS1.point2.X(),
                'p1Y': SRAS1.point1.Y(),
                'p2Y': SRAS1.point2.Y()
            }
        };
        statestr = JSON.stringify(state);
        //console.log('hello',statestr);
        return statestr;
    }

    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade
    };
})(JXG, MacroLib, undefined);