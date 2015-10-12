var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////

        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: "Real GDP",
            yname: "Price<br>Level",
            grid: false,
            'xpos': [9, -0.5]
        });

        //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createSupply(brd1, {
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
        var SRAS2 = MacroLib.createSupply(brd1, {
            name: 'SRAS<sub>2</sub>',
            color: 'DodgerBlue'
        });
        SRAS2.setAttribute({
            fixed: true,
            'highlight': false,
            withLabel: false
        });

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createDemand(brd1, {
            name: 'AD<sub>1</sub>',
            color: 'Orange'
        });
        AD1.setAttribute({
            fixed: true,
            'dash': 1,
            'fixed': true,
            'highlight': false
        });

        //Demand Line 2 - moveable
        var AD2 = MacroLib.createDemand(brd1, {
            name: 'AD<sub>2</sub>',
            color: 'Orange'
        });
        AD2.setAttribute({
            fixed: true,
            'highlight': false,
            withLabel: false
        });


        ////////////
        // Intersection Box 1
        ////////////
        var iSDfix = brd1.create('intersection', [AD1, SRAS1, 0], {
            visible: false
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
            'highlight': false,
            'name': 'LRAS',
            'withLabel': true,
            'fixed': true,
            'label': {
                'offset': [-15, 200]
            }
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

        // if (state["AD2"] && state["SRAS2"]) {
        //     //brd1.removeObject('AD2');
        //     var point1 = [state["AD2"]["p1X"],state["AD2"]["p1Y"]];
        //     var point2 = [state["AD2"]["p2X"],state["AD2"]["p2Y"]]
        //     AD2.point1.moveTo(point1,0);
        //     AD2.point2.moveTo(point2,0);

        //     var point1 = [state["SRAS2"]["p1X"],state["SRAS2"]["p1Y"]];
        //     var point2 = [state["SRAS2"]["p2X"],state["SRAS2"]["p2Y"]]
        //     SRAS2.point1.moveTo(point1,0);
        //     SRAS2.point2.moveTo(point2,0);

        //     brd1.update();
        // }

        console.debug('State updated successfully from saved.');
    }

    function getState() {
        var state = JSON.parse(getGrade());
        statestr = JSON.stringify(state);
        // console.log(statestr);
        return statestr;
    }

    function getGrade() {
        var state = {};
        statestr = JSON.stringify(state);
        //console.log('hello',statestr);
        return statestr;
    }

    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade: getGrade
    };
})(JXG, MacroLib, undefined);