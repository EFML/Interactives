// Used as JSInput
var Macro = (function(JXG, MacroLib) {
    'use strict';
    var boundingBox, board, xAxis, yAxis, xTicks, yTicks, xLabels, yLabels,
        supplyLine, demandLine, supplyDashedLines, demandDashedLines,
        yAxisPts, supplyLinePts, demandLinePts,
        state = {
            selectedPointIndex: '',
            QD: '',
            QS: '',
            P: ''
        };

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);

        boundingBox = [-50, 6, 300, -1];
        xLabels = [], yLabels = [], yAxisPts = [], supplyLinePts = [], demandLinePts = [];

        board = JXG.JSXGraph.initBoard('jxgbox1', {
            boundingbox: boundingBox,
            showCopyright: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            axis: false,
            grid: false,
            hasMouseUp: true
        });

        xAxis = board.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            name: 'Q',
            highlight: false,
            withLabel: true,
            label: {
                //position: 'rt',
                offset: [240, -15]
            }
        });
        xAxis.removeAllTicks();
        xTicks = board.create('ticks', [xAxis, [0, 50, 100, 150, 200, 250]], {
            strokeColor:'#ccc',
            majorHeight: -1,
            drawLabels: false,
            minorTicks: 5
        });

        // Unfortunately, it seems that text elements in the xTicks.labels and yTicks.labels arrays
        // cannot have their attributes changed once they've been created. So instead, we use our own
        // text elements.

        var xVals = [0, 50, 100, 150, 200, 250];
        for (i = 0; i < xVals.length; i++) {
            xLabels.push(
                board.create('text', [xVals[i] + 4.4, -0.24, xVals[i].toString()], {
                    fixed: true
                })
            );
        }

        yAxis = board.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            name: 'P',
            highlight: false,
            withLabel: true,
            label: {
                position: 'rt',
                offset: [-20, 0]
            }
        });
        yAxis.removeAllTicks();
        yTicks = board.create('ticks', [yAxis, [1, 2, 3, 4, 5]], {
            strokeColor:'#ccc',
            majorHeight: -1,
            drawLabels: false,
            minorTicks: 5,
        });
        var yVals = [0, 1, 2, 3, 4, 5];
        for (i = 0; i < yVals.length; i++) {
            yLabels.push(
                board.create('text', [-14, yVals[i] + 0.155, yVals[i].toString()], {
                    fixed: true
                })
            );
        }

        // Supply Line - fixed
        supplyLine = board.create('segment', [[50, 1], [250, 5]], {
            strokeColor: 'orange',
            name: 'S',
            withLabel: true,
            label: {
                offset: [155, 140]
            },
            fixed: true,
            highlight: false
        });

        // Demand Line - fixed
        demandLine = board.create('segment', [[50, 5], [250, 1]], {
            strokeColor: 'dodgerblue',
            name: 'D',
            withLabel: true,
            label: {
                offset: [155, -140]
            },
            fixed: true,
            highlight: false
        });

        for (var i = 1; i < 6; i++) {
            supplyLinePts.push(
                board.create('point', [i*50, i], {
                    fixed: true,
                    highlight: false,
                    strokeColor: 'orange',
                    fillColor: 'orange',
                    withLabel: false,
                    visible: true
                })
            );

            demandLinePts.push(
                board.create('point', [i*50, 6-i], {
                    fixed: true,
                    highlight: false,
                    strokeColor: 'dodgerblue',
                    fillColor: 'dodgerblue',
                    withLabel: false,
                    visible: true
                })
            );

            yAxisPts.push(
                board.create('point', [0, i], {
                    fixed: true,
                    strokeColor: 'gray',
                    fillColor: 'gray',
                    withLabel: false,
                    visible: true,
                    size: 5
                })
            );
            // Interactivity
            yAxisPts[i-1].on('mousedown', function() {
                var index = getIndex(yAxisPts, this);
                selectPoint(index)
            });
        }

        // Dashes to x, y axes for point on Supply Line
        supplyDashedLines = MacroLib.createDashedLines2Axis(board, supplyLinePts[0], {
            withLabel: true,
            xlabel: 'QS',
            xoffsets: [5, 15],
            ylabel: 'P',
            yoffsets: [15, 10],
            color: 'gray'
        });
        supplyDashedLines.X1.setAttribute({
            strokeColor: 'red',
            fillColor: 'red',
            labelColor: 'red'
        });
        supplyDashedLines.Y1.setAttribute({
            strokeColor: 'red',
            fillColor: 'red',
            labelColor: 'red',
            size: 5
        });
        dashedLinesVisibility(supplyDashedLines, false);

        // Dashes to x, y axes for point on Demand Line
        demandDashedLines = MacroLib.createDashedLines2Axis(board, demandLinePts[4], {
            withLabel: true,
            xlabel: 'QD',
            xoffsets: [5, 15],
            ylabel: 'P',
            yoffsets: [15, 10],
            color: 'gray'
        });
        demandDashedLines.X1.setAttribute({
            strokeColor: 'red',
            fillColor: 'red',
            labelColor: 'red'
        });
        demandDashedLines.Y1.setAttribute({
            strokeColor: 'red',
            fillColor: 'red',
            labelColor: 'red',
            size: 5
        });
        dashedLinesVisibility(demandDashedLines, false);
    }

    function selectPoint(index) {
        var i;
        dashedLinesVisibility(supplyDashedLines, true);
        dashedLinesVisibility(demandDashedLines, true);
        moveDashedLines(supplyDashedLines, supplyLinePts[index], 0);
        moveDashedLines(demandDashedLines, demandLinePts[4-index], 0);
        state.selectedPointIndex = index;
        state.QS = supplyLinePts[index].X().toPrecision();
        state.QD = demandLinePts[4-index].X().toPrecision();
        state.P = supplyLinePts[index].Y().toPrecision();

        for (i = 0; i < xLabels.length; i++) {
            xLabels[i].setAttribute({
                strokecolor: 'black'
            });
            yLabels[i].setAttribute({
                strokecolor: 'black'
            });
        }
        xLabels[index+1].setAttribute({
            strokecolor: 'red'
        });
        xLabels[5-index].setAttribute({
            strokecolor: 'red'
        });
        yLabels[index+1].setAttribute({
            strokecolor: 'red'
        });

        // Equilibrium
        if (index === 2) {
            supplyDashedLines.X1.setAttribute({
                name: 'QS = QD'
            });
            demandDashedLines.X1.setAttribute({
                name: ''
            });
        }
        else {
            supplyDashedLines.X1.setAttribute({
                name: 'QS'
            });
            demandDashedLines.X1.setAttribute({
                name: 'QD'
            });
        }
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    // Interactivity
    if (resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', resetAnimation);
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(board);
        state = {
            selectedPointIndex: '',
            QD: '',
            QS: '',
            P: ''
        };
        init();
    }

    // function check() {
    //     alert('QD = ' + QD + '\n' + 'QS = ' + QS + '\n' + 'P = ' + P);
    // }

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

    function moveDashedLines(dashedLines, destPt, animDuration) {
        var duration = (typeof animDuration === 'undefined') ? 1000 : animDuration;

        dashedLines.X1.moveTo([destPt.X(), 0], duration);
        dashedLines.X2.moveTo([destPt.X(), destPt.Y()], duration);
        dashedLines.Y1.moveTo([0, destPt.Y()], duration);
        dashedLines.Y2.moveTo([destPt.X(), destPt.Y()], duration);
    }

    function getIndex(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return i;
            }
        }
    }

    init();

    // Standard edX JSinput functions.
    function setState(transaction, stateStr) {
        state = JSON.parse(stateStr);

        if (state.selectedPointIndex.length !== 0) {
            selectPoint(state.selectedPointIndex);
        }
        console.debug('State updated successfully from saved.');
    }

    function getState() {
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
