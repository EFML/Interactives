var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, SRPC2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        var bboxlimits = [-1.5, 12, 12, -1];
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

        var xaxis1 = brd1.create('axis', [
            [0, 0],
            [11, 0]
        ], {
            withLabel: false
        });
        var yaxis1 = brd1.create('axis', [
            [0, 0],
            [0, 11]
        ], {
            withLabel: false
        });

        //Axes
        xaxis1.removeAllTicks();
        yaxis1.removeAllTicks();
        var xlabel = brd1.create('text', [-1.2, 10, "\u03c0"], {
            fontSize: 24,
            fixed: true
        });
        var ylabel = brd1.create('text', [9, -0.5, "UR"], {
            fixed: true
        });

        //Supply Line 1 - fixed
        var SRPC1 = MacroLib.createDemand(brd1, {
            name: 'SRPC1',
            color: 'Gray'
        });
        SRPC1.setAttribute({
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        //Supply Line 1 - fixed
        SRPC2 = MacroLib.createDemand(brd1, {
            name: 'SRPC2',
            color: 'DodgerBlue'
        });
        SRPC2.setAttribute({
            'withLabel': false,
            'highlight': false
        });

        //Interactivity
        brd1.on('mousedown', function() {
            SRPC2.setAttribute({
                withLabel: true
            });
            brd1.update()
        });
    }

    //Animation for Inflationary Expectations
    function increaseInfExpect() {
        SRPC2.point1.moveTo([3.0, 10.5], 1000);
        SRPC2.point2.moveTo([10.5, 3.0], 1000);
        SRPC2.setAttribute({
            withLabel: true
        });
        brd1.update();
    }

    //Animation for Increase in Key Input Price (same as Inf. Expectations)
    function increaseKeyInputPrice() {
        SRPC2.point1.moveTo([3.0, 10.5], 1000);
        SRPC2.point2.moveTo([10.5, 3.0], 1000);
        SRPC2.setAttribute({
            withLabel: true
        });
        brd1.update();
    }

    //Animation for Unknown Condition
    function increaseLaborProd() {
        SRPC2.point1.moveTo([1.0, 8.5], 1000);
        SRPC2.point2.moveTo([8.5, 1.0], 1000);
        SRPC2.setAttribute({
            withLabel: true
        });
        brd1.update();
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var increaseLaborProdBtn = document.getElementById('increaseLaborProdBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    increaseLaborProdBtn.addEventListener('click', increaseLaborProd);

    init();

    //Standard edX JSinput functions
    function setState(transaction, statestr) {
        state = JSON.parse(statestr);
        //console.log(state);
        //console.log(state["dragLine"]);

        // if (state["dragLine"]) {
        //     brd1.removeObject('AD2');
        //     var point1 = [state["dragLine"]["p1X"],state["dragLine"]["p1Y"]];
        //     var point2 = [state["dragLine"]["p2X"],state["dragLine"]["p2Y"]]

        //     //Demand Line 2 - moveable
        //     AD2.point1.moveTo(point1,0);
        //     AD2.point2.moveTo(point2,0);

        //     brd1.update();
        // }
        //alert(statestr);
        console.debug('State updated successfully from saved.');
    }

    function getState() {
        state = JSON.parse(getGrade());
        statestr = JSON.stringify(state);
        // console.log(statestr);
        return statestr;
    }

    //Standard edX JSinput functions
    function getGrade() {
        // state = {"dragLine":{'p1X':AD2.point1.X(),'p2X':AD2.point2.X(),
        //                      'p1Y':AD2.point1.Y(),'p2Y':AD2.point2.Y()},
        //          "staticLine":{'p1X':AD1.point1.X(),'p2X':AD1.point2.X(),
        //                        'p1Y':AD1.point1.Y(),'p2Y':AD1.point2.Y()}};
        // statestr = JSON.stringify(state);
        // console.log(statestr);

        return statestr;
    }

    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade: getGrade
    };
})(JXG, MacroLib, undefined);