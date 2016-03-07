// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var board, supplyLine1, supplyLine2, glider1, glider2, dashes1, dashes2, supplySlider, priceSlider, supplySliderText, priceSliderText;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity',
            yname: 'Price'
        });

        // Supply Line 1 - fixed
        supplyLine1 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'gray'
        });
        supplyLine1.setAttribute({
            dash: 1
        });

        // Supply Line 2 - moveable
        supplyLine2 = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S<sub>2</sub>',
            color: 'orange'
        });
        supplyLine2.setAttribute({
            withLabel: false
        });

        // Glider on Supply Line 1
        glider1 = board.create('glider', [5.75, 5.75, supplyLine1], {
            withLabel: false
        });

        // Glider on Supply Line 2
        glider2 = board.create('glider', [5.75, 5.75, supplyLine2], {
            withLabel: false
        });
        glider2.hideElement();

        // Dashes to x, y axes for glider 1
        dashes1 = MacroLib.createDashedLines2Axis(board, glider1, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: 'P<sub>1</sub>',
            color: 'gray'
        });

        // Dashes to x, y axes for glider 2
        dashes2 = MacroLib.createDashedLines2Axis(board, glider2, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'P<sub>2</sub>',
            color: 'gray'
        });
        dashedLinesVisibility(dashes2, false);

        // Supply Slider
        supplySlider = board.create('slider', [
            [3.75, -1.5],
            [7.75, -1.5],
            [-1.0, 0.0, 1.0]
        ], {
            withLabel: false,
            snapWidth: 0.01,
            color: 'orange'
        });
        supplySliderText = board.create(
            'text',
            [3.25, -1.55,'<strong>&Delta;S</strong>'],
            {strokeColor: 'orange', anchorX: 'right', anchorY: 'middle'}
        );
        supplySlider.on('down', supplySliderMouseDown);
        supplySlider.on('drag', supplySliderMouseDrag);

        // Price slider
        priceSlider = board.create('slider', [
            [-1.5, 4.0],
            [-1.5, 7.5],
            [4.0, 5.75, 7.5]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'crimson'
        });
        priceSliderText = board.create(
            'text',
            [-1.90, 3.5,'<strong>&Delta;QS</strong>'],
            {strokeColor: 'crimson', anchorY: 'top'}
        );
        priceSlider.on('down', priceSliderMouseDown);
        priceSlider.on('drag', priceSliderMouseDrag);
    }

    function supplySliderMouseDown() {
        if (priceSlider.Value() !== 5.75) {
            shiftPrice(5.75);
            // Set slider to initial position
            priceSlider.setGliderPosition(0.5)
        }
        supplyLine2.setAttribute({
            withLabel: true,
            offset: [125, -85]
        });
        glider2.showElement();
        dashedLinesVisibility(dashes2, true);
    }

    function supplySliderMouseDrag() {
        var t = supplySlider.Value();
        shiftSupply([t, -t]);
    }

    function priceSliderMouseDown() {
        if (supplySlider.Value() !== 0) {
            shiftSupply([0, 0]);
            // Set slider to initial position
            supplySlider.setGliderPosition(0.5);
        }
        // supplyLine2.setAttribute({
        //     withLabel: true,
        //     offset: [125, -85]
        // });
        glider2.showElement();
        dashedLinesVisibility(dashes2, true);
    }

    function priceSliderMouseDrag() {
        var price = priceSlider.Value();
        shiftPrice(price);
    }

    // Map the slider values in [slider._smin, slider._smax] to [0, 1]
    // This is used to set the slider value directly via the glider.
    function normalizeSliderValue(slider, value) {
        return (value - slider._smin) / (slider._smax - slider._smin);
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    //Interactivity
    if (resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', resetAnimation);
    }

    // Supply lines are y = ax + b with a = 1 and b = 0. Middle of line segment: (5.75, 5.75)

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(board);
        init();
    }

    // function check() {
    //     var supply = supplySlider.Value(),
    //         price = priceSlider.Value(),
    //         str = 'No change.';

    //     str = supply < 0.0 ? 'Decrease in Supply.' : str;
    //     str = supply > 0.0 ? 'Increase in Supply.' : str;
    //     str = price < 5.75 ? 'Decrease in Quantity Supplied.' : str;
    //     str = price > 5.75 ? 'Increase in Quantity Supplied.' : str;

    //     alert(str);
    // }

    function shiftSupply(trans) {
        var destPt0 = board.create('point', [glider1.X() + trans[0], glider1.Y() + trans[1]], {
                visible: false
            }),
            destPt1 = board.create('point', [supplyLine1.point1.X() + trans[0], supplyLine1.point1.Y() + trans[1]], {
                visible: false
            }),
            destPt2 = board.create('point', [supplyLine1.point2.X() + trans[0], supplyLine1.point2.Y() + trans[1]], {
                visible: false
            });
        moveLine(supplyLine2, destPt1, destPt2, 0);
        moveDashedLines(dashes2, destPt0, 0);
        board.update();
    }

    function shiftPrice(price) {
        glider2.moveTo([price, price])
        moveDashedLines(dashes2, glider2, 0);
        board.update();
    }

    function movePoint(point, destPt, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        point.moveTo([destPt.X(), destPt.Y()], duration);
    }

    function moveLine(line, destPt1, destPt2, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        movePoint(line.point1, destPt1, animDuration);
        movePoint(line.point2, destPt2, animDuration);
    }

    function moveDashedLines(dashedLines, destPt, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        dashedLines.X1.moveTo([destPt.X(), 0], duration);
        dashedLines.X2.moveTo([destPt.X(), destPt.Y()], duration);
        dashedLines.Y1.moveTo([0, destPt.Y()], duration);
        dashedLines.Y2.moveTo([destPt.X(), destPt.Y()], duration);
    }

    function dashedLinesVisibility(dashedLines, vis) {
        if (vis) {
            dashedLines.X1.showElement();
            dashedLines.XLine.showElement();
            dashedLines.Y1.showElement();
            dashedLines.YLine.showElement();
        }
        else {
            dashedLines.X1.hideElement();
            dashedLines.XLine.hideElement();
            dashedLines.Y1.hideElement();
            dashedLines.YLine.hideElement();
        }
    }

    init();

    //Standard edX JSinput functions
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr);

        if (state.supply) {
            if (state.supply !== 0.0) {
                supplySlider.setGliderPosition(normalizeSliderValue(
                    supplySlider, state.supply)
                );
                supplySliderMouseDown();
                supplySliderMouseDrag();
            }
        }
        if (state.price) {
            if (state.price !== 5.75) {
                priceSlider.setGliderPosition(normalizeSliderValue(
                    priceSlider, state.price)
                );
                priceSliderMouseDown();
                priceSliderMouseDrag();
            }
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            supply: supplySlider.Value(),
            price: priceSlider.Value()
        };
        console.info('State successfully saved.');
        return JSON.stringify(state);
    }

    function getGrade() {
        return getState();
    }

    MacroLib.createChannel(getGrade, getState, setState);

})(JXG, MacroLib, undefined);
