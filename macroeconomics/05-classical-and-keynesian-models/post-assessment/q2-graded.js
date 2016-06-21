(function(JXG, MacroLib) {
    'use strict';
    var board, supplyPt, demandPt, eqPt, supplyDashes, demandDashes, wSlider,
        tolerance = 0.00001, atEquilibrium;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // Board
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2.5, 12, 12, -1.2],
            xname: 'Labor',
            yname: 'Nominal<br>Wage'
        });
        // Slider
        wSlider = board.create('slider', [
            [-1.0, 2.75],
            [-1.0, 8.75],
            [-3.0, 0.0, 3.0]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'black'
        });
        // Positive Slider Transformation
        var wSliderTrans = board.create('transform', [
            function() {
                return 0.0;
            },
            function() {
                return wSlider.Value();
            }
        ], {
            type: 'translate'
        });
        // Demand Line 1 - fixed
        var demandLine = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'DL',
            color: 'orange'
        });
        // Supply Line 1 - fixed
        var supplyLine = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'SL',
            color: 'dodgerblue'
        });
        // Invisible line - moveable
        var invLine = MacroLib.createTransformLine(board, {
            transformList: [wSliderTrans],
            ltype: 'Horizontal',
        });
        invLine.setAttribute({
            withLabel: false,
            highlight: true,
            visible: false
        });
        ////////////
        // Intersections
        ////////////
        eqPt = board.create('intersection', [demandLine, supplyLine, 0], {
            visible: false
        });

        demandPt = board.create('intersection', [invLine, demandLine, 0], {
            visible: true,
            withLabel: false,
            color: 'orange'
        });

        supplyPt = board.create('intersection', [invLine, supplyLine, 0], {
            visible: true,
            withLabel: false,
            color: 'dodgerblue'
        });
        ////////////
        // Dashed Lines
        ////////////
        var eqDashes = MacroLib.createDashedLines2Axis(board, eqPt, {
            withLabel: true,
            xlabel: 'Q*',
            ylabel: 'W*',
            yoffsets: [30, 15],
            color: 'darkgray'
        });

        demandDashes = MacroLib.createDashedLines2Axis(board, demandPt, {
            withLabel: true,
            xlabel: 'D\'',
            xoffsets: [20, 23],
            ylabel: 'W\'',
            yoffsets: [23, 15],
            color: 'orange'
        });

        demandDashes.X1.setAttribute({
            label: {
                offset: [5, 15],
                strokeColor: 'orange'
            }
        });
        // Initially hide demand dashed lines as we are at equilibrium
        dashedLinesVisibility(demandDashes, false);

        supplyDashes = MacroLib.createDashedLines2Axis(board, supplyPt, {
            withLabel: true,
            xlabel: 'S\'',
            xoffsets: [20, 23],
            ylabel: '',
            yoffsets: [5, 10],
            color: 'dodgerblue'
        });

        supplyDashes.X1.setAttribute({
            label: {
                offset: [5, 15],
                strokeColor: 'dodgerblue'
            }
        });
        // Initially hide supply dashed lines as we are at equilibrium
        dashedLinesVisibility(supplyDashes, false);
        atEquilibrium = true;
        //////////////////
        // Interactivity
        //////////////////
        wSlider.on('drag', dragHandler);
    }

    function dragHandler() {
        // Move demand dashed lines
        moveDashedLines(demandDashes, demandPt);
        // Move supply dashed lines
        moveDashedLines(supplyDashes, supplyPt);
        // Hide moving parts only if at equilibrium
        if (nbrsAreEqual(demandPt.X(), eqPt.X()) &&
            nbrsAreEqual(demandPt.Y(), eqPt.Y())) {
            dashedLinesVisibility(demandDashes, false);
            dashedLinesVisibility(supplyDashes, false);
            atEquilibrium = true;
        }
        else {
            dashedLinesVisibility(demandDashes, true);
            dashedLinesVisibility(supplyDashes, true);
            atEquilibrium = false;
        }
    }

    function moveDashedLines(dashedLines, destPt) {
        dashedLines.X1.moveTo([destPt.X(), 0]);
        dashedLines.X2.moveTo([destPt.X(), destPt.Y()]);
        dashedLines.Y1.moveTo([0, destPt.Y()]);
        dashedLines.Y2.moveTo([destPt.X(), destPt.Y()]);
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
        board.update();
    }

    function nbrsAreEqual(x1, x2) {
        return Math.abs(x2-x1) <= tolerance;
    }

    // Map the slider values in [2.75, 8.75] (ie eqPt +- 3) to [0, 1]
    // This is used to set the slider value directly via the glider.
    function normalizeSliderValue(slider, value) {
        return (value - 2.75) / 6.0;
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(board);
        init();
    });

    // Standard edX JSinput functions
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr);

        if (state.supplyPt && state.demandPt) {
            wSlider.setGliderPosition(normalizeSliderValue(
                    wSlider, state.supplyPt.Y
            ));
            dragHandler();
        }
        console.info('State updated successfully from saved.');
    }

    function getState() {
        var state;

        // To avoid roundoff errors, set demand point and supply point
        // to equilibrium point (5.75, 5.75)
        if (atEquilibrium) {
            state = {
                demandPt: {
                    X: 5.75,
                    Y: 5.75
                },
                supplyPt: {
                    X: 5.75,
                    Y: 5.75
                }
            };
        }
        else {
            state = {
                demandPt: {
                    X: demandPt.X(),
                    Y: demandPt.Y()
                },
                supplyPt: {
                    X: supplyPt.X(),
                    Y: supplyPt.Y()
                }
            };
        }
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
