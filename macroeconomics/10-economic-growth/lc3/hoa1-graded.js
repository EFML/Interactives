// Used as JSInput
var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, sliderx, LRAS1, LRAS2, iS2D, dashS2;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////
        var newBBox = [-1.5, 12, 12, -1.75];

        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: 'Real GDP',
            yname: 'Price<br>Level',
            grid: false,
            bboxlimits: newBBox
        });

        //Sliders
        sliderx = brd1.create('slider', [
            [3.0, -1.2],
            [8.5, -1.2],
            [-2.25, 0, 2.25]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'DarkGray'
        });

        //Positive Slider Transformation
        var sliderXPositive = brd1.create('transform', [
            function() {
                return sliderx.Value();
            },
            function() {
                return 0.0;
            }
        ], {
            type: 'translate'
        });

        // //Supply Line 1 - fixed
        var SRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Horizontal',
            name: 'SRAS',
            color: 'DodgerBlue'
        });
        SRAS1.setAttribute({
            visible: false
        });

        //LRAS 1 - fixed
        LRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Vertical',
            name: 'LRAS<sub>1</sub>',
            color: 'DarkGray'
        });
        LRAS1.setAttribute({
            dash: 1,
            highlight: true
        });
        LRAS1.setAttribute({
            label: {
                offset: [20, 0]
            }
        });

        //LRAS 2 - moveable
        LRAS2 = MacroLib.createTransformLine(brd1, {
            transformList: [sliderXPositive],
            ltype: 'Vertical',
            name: 'LRAS<sub>2</sub>',
            color: 'DodgerBlue'
        });
        LRAS2.setAttribute({
            fixed: false,
            withLabel: false
        });

        // ////////////
        // // Intersection Box 1
        // ////////////
        var iSDfix = brd1.create('intersection', [LRAS1, SRAS1, 0], {
            visible: false
        });
        iS2D = brd1.create('intersection', [LRAS2, SRAS1, 0], {
            visible: false
        });

        ////////////
        // Draggable Dashed Lines for Board 1
        ////////////
        dashS2 = MacroLib.createDashedLines2Axis(brd1, iS2D, {
            fixed: false,
            withLabel: false,
            xlabel: 'Y<sub>2</sub>',
            ylabel: ' ',
            color: 'DodgerBlue'
        });

        dashS2.Y1.setAttribute({
            visible: false
        });
        dashS2.YLine.setAttribute({
            visible: false
        });

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashesFixedB1 = MacroLib.createDashedLines2Axis(brd1, iSDfix, {
            withLabel: true,
            xlabel: 'Y<sub>1</sub>',
            ylabel: ' ',
            color: 'DarkGray'
        });

        dashesFixedB1.Y1.setAttribute({
            visible: false
        });
        dashesFixedB1.YLine.setAttribute({
            visible: false
        });

        //////////////////
        // Interactivity
        //////////////////
        sliderx.on('down', sliderDown);

        sliderx.on('drag', sliderDrag);
    }

    function sliderDown() {
        LRAS2.setAttribute({
            withLabel: true
        });
        dashS2.X1.setAttribute({
            withLabel: true
        });
        dashS2.Y1.setAttribute({
            withLabel: true
        });
    }

    function sliderDrag() {
        //Moving Dashed Lines in Board 1
        dashS2.Y1.moveTo([0, iS2D.Y()]);
        dashS2.Y2.moveTo([iS2D.X(), iS2D.Y()]);

        dashS2.X1.moveTo([iS2D.X(), 0]);
        dashS2.X2.moveTo([iS2D.X(), iS2D.Y()]);
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
    function setState(transaction, statestr) {
        var state = JSON.parse(statestr);

        if (state.LRAS2) {
            //Slider position is a function of the original slider position and the slider value
            var spos = state.LRAS2.X0 + state.LRAS2.slider;
            sliderx.moveTo([spos, 0], 0);
            LRAS2.setAttribute({
                withLabel: true
            });
            sliderDown();
            sliderDrag();
            brd1.update();
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = JSON.parse(getGrade());
        var statestr = JSON.stringify(state);
        console.info('State successfully saved.');
        return statestr;
    }

    function getGrade() {
        var state = {
            'LRAS2': {
                'X0': LRAS1.point1.X(),
                'slider': sliderx.Value()
            }
        };
        var statestr = JSON.stringify(state);
        return statestr;
    }

    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade: getGrade
    };
})(JXG, MacroLib, undefined);
