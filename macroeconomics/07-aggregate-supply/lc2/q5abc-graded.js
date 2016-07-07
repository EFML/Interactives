(function(JXG, MacroLib) {
    'use strict';
    var brd1, LRAS2, ptAxis2, sliderx;

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
            [3.25, -1.2],
            [8.25, -1.2],
            [-2.0, 0, 2.0]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'darkgray'
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

        //LRAS 1 - fixed
        var LRAS1 = MacroLib.createLine(brd1, {
            ltype: 'Vertical',
            name: 'LRAS<sub>1</sub>',
            color: 'darkgray'
        });
        LRAS1.setAttribute({
            dash: 1
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
            color: 'darkgray'
        });
        LRAS2.setAttribute({
            fixed: false,
            withLabel: false
        });

        //Projection of LRAS1 on x-axis - fixed
        var ptAxis1 = brd1.create('point', [LRAS1.point1.X(), 0], {
            name: 'Y<sub>1</sub>',
            withLabel: true,
            size: '0.5',
            strokeColor: 'gray',
            visible: true,
            label: {
                offset: [-5, -15]
            }
        });

        var dash1 = brd1.create('segment', [ptAxis1, LRAS1.point1], {
            strokeColor: 'darkgray',
            strokeWidth: 2,
            dash: 1
        });

        //Projection of LRAS2 on x-axis - moveable
        ptAxis2 = brd1.create('point', [LRAS2.point1.X(), 0], {
            name: 'Y<sub>2</sub>',
            withLabel: false,
            size: '0.5',
            strokeColor: 'gray',
            visible: true,
            label: {
                offset: [-5, -15]
            }
        });

        var dash2 = brd1.create('segment', [ptAxis2, LRAS2.point1], {
            strokeColor: 'darkgray',
            strokeWidth: 2,
            dash: 1
        });

        //////////////////
        // Interactivity
        //////////////////
        sliderx.on('down', function() {
            LRAS2.setAttribute({
                withLabel: true
            });
            ptAxis2.setAttribute({
                withLabel: true
            });
            brd1.update();
        });

        sliderx.on('drag', dragHandler);

        sliderx.on('up', function() {
            //Moving projection of LRAS2 on x-axis
            ptAxis2.moveTo([LRAS2.point1.X(), 0]);
            brd1.update();
        });
    }

    function dragHandler() {
        //Moving projection of LRAS2 on x-axis
        ptAxis2.moveTo([LRAS2.point1.X(), 0]);
        brd1.update();
    }

    // Map the slider values in [-2.0, 2.0] to [0, 1]
    // This is used to set the slider value directly via the glider.
    function normalizeSliderValue(slider, value) {
        return (value + 2.0) / 4.0;
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    // Standard edX JSinput functions
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr);

        if (state.Y2) {
            sliderx.setGliderPosition(normalizeSliderValue(
                    sliderx, state.Y2
            ));
            dragHandler();
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
                Y2: sliderx.Value()
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
