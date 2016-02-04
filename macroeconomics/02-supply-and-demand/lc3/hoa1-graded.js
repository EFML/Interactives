var Macro = (function(JXG, MacroLib) {
    'use strict';
    var leftComponents = {el: 'jxgbox1'}, rightComponents = {el: 'jxgbox2'};

    function initBoard(c, moveableDemand, moveableSupply) {
        var demandSliderY = -2.0, supplySliderY = -2.0;

        MacroLib.init(MacroLib.TWO_BOARDS);
        MacroLib.labelOffset({
            X: 100,
            Y: 75
        });

        c.board = MacroLib.createBoard(c.el, {
            bboxlimits: [-2, 12, 12, -4],
            xname: 'Quantity',
            yname: 'Price',
            xpos: [9.25, -0.75],
            ypos: [-1.75, 11]
        });

        // Demand Line 1 - fixed
        c.demandLine1 = MacroLib.createLine(c.board, {
            ltype: 'Demand',
            name: 'D<sub>1</sub>',
            color: 'DodgerBlue'
        });
        c.demandLine1.setAttribute({
            dash: 1,
            fixed: true,
            highlight: false
        });

        // Demand Line 2 - moveable
        c.demandLine2 = MacroLib.createLine(c.board, {
            ltype: 'Demand',
            name: 'D<sub>2</sub>',
            color: 'DodgerBlue'
        });
        c.demandLine2.setAttribute({
            withLabel: false,
            fixed: true,
            highlight: false
        });

        // Supply Line 1 - fixed
        c.supplyLine1 = MacroLib.createLine(c.board, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'Orange'
        });
        c.supplyLine1.setAttribute({
            dash: 1,
            fixed: true,
            highlight: false
        });

        // Supply Line 2 - moveable
        c.supplyLine2 = MacroLib.createLine(c.board, {
            ltype: 'Supply',
            name: 'S<sub>2</sub>',
            color: 'Orange'
        });
        c.supplyLine2.setAttribute({
            withLabel: false,
            fixed: true,
            highlight: false
        });

        // Intersection of Demand Line 1 and Supply line 1 - fixed
        c.intersection1 = c.board.create('intersection', [c.demandLine1, c.supplyLine1, 0], {
            withLabel: false,
            visible: true
        });

        // Intersection of Demand Line 2 and Supply line 2 - moveable
        c.intersection2 = c.board.create('intersection', [c.demandLine2, c.supplyLine2, 0], {
            withLabel: false,
            visible: false
        });

        // Dashes to x, y axes for intersection 1
        c.dashes1 = MacroLib.createDashedLines2Axis(c.board, c.intersection1, {
            withLabel: true,
            xlabel: 'Q<sub>1</sub>',
            ylabel: 'P<sub>1</sub>',
            color: 'Gray'
        });

        // Dashes to x, y axes for intersection 2
        c.dashes2 = MacroLib.createDashedLines2Axis(c.board, c.intersection2, {
            withLabel: true,
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'P<sub>2</sub>',
            color: 'Gray'
        });
        dashedLinesVisibility(c.dashes2, false);

        // Create a board with two sliders
        if (moveableDemand && moveableSupply) {
            demandSliderY = -2.0;
            supplySliderY = -3.25;
        }
        else {
            if (moveableDemand) {
                demandSliderY = -2.0;
            }
            else if (moveableSupply) {
                supplySliderY = -2.0;
            }
        }

        if (moveableDemand) {
            // Demand Slider
            c.demandSlider = c.board.create('slider', [
                [3.75, demandSliderY],
                [7.75, demandSliderY],
                [-1.0, 0.0, 1.0]
            ], {
                withLabel: false,
                snapWidth: 0.01,
                color: 'DodgerBlue'
            });
            c.demandSliderText = c.board.create(
                'text',
                [3.25, demandSliderY,'<strong>&Delta;D</strong>'],
                {strokeColor: 'DodgerBlue', anchorX: 'right', anchorY: 'middle'}
            );
            c.demandSlider.on('mousedown', function() {
                demandSliderMouseDown(c)
            });
            c.demandSlider.on('drag', function() {
                demandSliderMouseDrag(c)
            });
        }

        if (moveableSupply) {
            // Supply Slider
            c.supplySlider = c.board.create('slider', [
                [3.75, supplySliderY],
                [7.75, supplySliderY],
                [-1.0, 0.0, 1.0]
            ], {
                withLabel: false,
                snapWidth: 0.01,
                color: 'Orange'
            });
            c.supplySliderText = c.board.create(
                'text',
                [3.25, supplySliderY,'<strong>&Delta;S</strong>'],
                {strokeColor: 'Orange', anchorX: 'right', anchorY: 'middle'}
            );
            c.supplySlider.on('mousedown', function() {
                supplySliderMouseDown(c)
            });
            c.supplySlider.on('drag', function() {
                supplySliderMouseDrag(c);
            });
        }
    }

    function init() {
        initBoard(leftComponents, true, false);
        initBoard(rightComponents, false, true);
    }

    function demandSliderMouseDown(c) {
        if (c.supplySlider && c.supplySlider.Value() !== 5.75) {
            shiftSupply(c.board, c.supplyLine1, c.supplyLine2, c.dashes2, c.intersection2, [0, 0]);
            // Set slider to initial position
            c.supplySlider.setGliderPosition(0.5);
        }
        c.demandLine2.setAttribute({
            withLabel: true,
            offset: [125, -85]
        });
        c.intersection2.showElement();
        dashedLinesVisibility(c.dashes2, true);
    }

    function demandSliderMouseDrag(c) {
        var t = c.demandSlider.Value();
        shiftDemand(c.board, c.demandLine1, c.demandLine2, c.dashes2, c.intersection2, [t, t]);
    }

    function supplySliderMouseDown(c) {
        if (c.demandSlider && c.demandSlider.Value() !== 5.75) {
            shiftDemand(c.board, c.demandLine1, c.demandLine2, c.dashes2, c.intersection2, [0, 0]);
            // Set slider to initial position
            c.demandSlider.setGliderPosition(0.5);
        }
        c.supplyLine2.setAttribute({
            withLabel: true,
            offset: [125, -85]
        });
        c.intersection2.showElement();
        dashedLinesVisibility(c.dashes2, true);
    }

    function supplySliderMouseDrag(c) {
        var t = c.supplySlider.Value();
        shiftSupply(c.board, c.supplyLine1, c.supplyLine2, c.dashes2, c.intersection2, [t, -t]);
    }

    // Map the slider values in [slider._smin, slider._smax] to [0, 1]
    // This is used to set the slider value directly via the glider.
    function normalizeSliderValue(slider, value) {
        return (value - slider._smin) / (slider._smax - slider._smin);
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

    // Demand lines are y = ax + b with a = -1 and b = 11.5. Middle of line segment: (5.75, 5.75)
    // Supply lines are y = ax + b with a = 1 and b = 0. Middle of line segment: (5.75, 5.75)

    function resetAnimation1() {
        JXG.JSXGraph.freeBoard(leftComponents.board);
        initBoard(leftComponents, true, false);
    }

    function resetAnimation2() {
        JXG.JSXGraph.freeBoard(rightComponents.board);
        initBoard(rightComponents, false, true);
    }

    // function region(val) {
    //     if (val < 0) {
    //         return -1;
    //     }
    //     else if (val === 0) {
    //         return 0;
    //     }
    //     else {
    //         return 1;
    //     }
    // }

    // function check() {
    //     var demandLeft = region(leftComponents.demandSlider.Value()),
    //         supplyLeft = region(leftComponents.supplySlider.Value()),
    //         demandRight = region(rightComponents.demandSlider.Value()),
    //         supplyRight = region(rightComponents.supplySlider.Value()),
    //         demandChange = demandLeft + demandRight,
    //         supplyChange = supplyLeft + supplyRight,
    //         demandStr = 'No change in Demand.',
    //         supplyStr = 'No change in Supply.',
    //         pDemand = 0, qDemand = 0, pSupply = 0, qSupply = 0,
    //         pChange,
    //         qChange,
    //         pStr = 'No change in Price.',
    //         qStr = 'No change in Quantity.';

    //     if (demandChange < 0) {
    //         demandStr = 'Decrease in Demand.';
    //         pDemand = -1;
    //         qDemand = -1;
    //     }
    //     else if (demandChange > 0) {
    //         demandStr = 'Increase in Demand.';
    //         pDemand = 1;
    //         qDemand = 1;
    //     }
    //     else {
    //         if (demandLeft !== 0 && demandRight !== 0) {
    //             demandStr = 'Indeterminate Demand.'
    //         }
    //     }

    //     if (supplyChange < 0) {
    //         supplyStr = 'Decrease in Supply.';
    //         pSupply = 1;
    //         qSupply = -1;
    //     }
    //     else if (supplyChange > 0) {
    //         supplyStr = 'Increase in Supply.';
    //         pSupply = -1;
    //         qSupply = 1;
    //     }
    //     else {
    //         if (supplyLeft !== 0 && supplyRight !== 0) {
    //             supplyStr = 'Indeterminate Supply.'
    //         }
    //     }

    //     pChange = pDemand + pSupply;
    //     qChange = qDemand + qSupply;

    //     if (pChange < 0) {
    //         pStr = 'Decrease in Price.';
    //     }
    //     else if (pChange > 0) {
    //         pStr = 'Increase in Price.';
    //     }
    //     else {
    //         if (pDemand !== 0 && pSupply !== 0) {
    //             pStr = 'Indeterminate Price.'
    //         }
    //     }

    //     if (qChange < 0) {
    //         qStr = 'Decrease in Quantity.';
    //     }
    //     else if (qChange > 0) {
    //         qStr = 'Increase in Quantity.';
    //     }
    //     else {
    //         if (qDemand !== 0 && qSupply !== 0) {
    //             qStr = 'Indeterminate Quantity.'
    //         }
    //     }

    //     if (demandStr === 'Indeterminate Demand.' || supplyStr === 'Indeterminate Supply.') {
    //         pStr = 'Indeterminate Price.'
    //         qStr = 'Indeterminate Quantity.'
    //     }

    //     alert(demandStr + '\n' + supplyStr + '\n' + qStr + '\n' + pStr);
    // }

    function shiftDemand(board, demandLine1, demandLine2, dashes2, intersection2, trans) {
        var destPt1 = board.create('point', [demandLine1.point1.X() + trans[0], demandLine1.point1.Y() + trans[1]], {
                visible: false
            }),
            destPt2 = board.create('point', [demandLine1.point2.X() + trans[0], demandLine1.point2.Y() + trans[1]], {
                visible: false
            });
        moveLine(demandLine2, destPt1, destPt2, 0);
        moveDashedLines(dashes2, intersection2, 0);
        board.update();
    }

    function shiftSupply(board, supplyLine1, supplyLine2, dashes2, intersection2, trans) {
        var destPt1 = board.create('point', [supplyLine1.point1.X() + trans[0], supplyLine1.point1.Y() + trans[1]], {
                visible: false
            }),
            destPt2 = board.create('point', [supplyLine1.point2.X() + trans[0], supplyLine1.point2.Y() + trans[1]], {
                visible: false
            });
        moveLine(supplyLine2, destPt1, destPt2, 0);
        moveDashedLines(dashes2, intersection2, 0);
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

    // Standard edX JSinput functions.
    // These are adapted to a left board containing only a demand slider and to
    // a right board containing only a supply slider.
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr);

        if (state.demand) {
            if (state.demand !== 0.0) {
                leftComponents.demandSlider.setGliderPosition(normalizeSliderValue(
                    leftComponents.demandSlider, state.demand)
                );
                demandSliderMouseDown(leftComponents);
                demandSliderMouseDrag(leftComponents);
            }
        }
        if (state.supply) {
            if (state.supply !== 0.0) {
                rightComponents.supplySlider.setGliderPosition(normalizeSliderValue(
                    rightComponents.supplySlider, state.supply)
                );
                supplySliderMouseDown(rightComponents);
                supplySliderMouseDrag(rightComponents);
            }
        }
        console.debug('State updated successfully from saved.');
    }

    function getState() {
        var state = {
            'demand': leftComponents.demandSlider.Value(),
            'supply': rightComponents.supplySlider.Value()
        };
        return JSON.stringify(state);
        console.debug('State successfully saved.');
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
