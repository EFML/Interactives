// Used as JSInput
var Macro = (function(JXG, MacroLib) {
    'use strict';
    var board, state = {}, savedState, selectedLine = {}, lineDown = false,
        eqPoint, dashedLines, LRASxLabel;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.5, 12, 12, -1],
            xname: 'RGDP (rY)',
            yname: 'PL'
        });

        board.on('down', function(event) {
            if (!lineDown) {
                unselectLine();
            }
        });
    }

    function createSavedShapes() {
        var key, c1, c2;
        console.info("Creating saved shapes.");
        for(key in savedState) {
            if (key === 'SRAS' || key === 'AD' || key === 'LRAS') {
                c1 = [savedState[key].point1.x, savedState[key].point1.y];
                c2 = [savedState[key].point2.x, savedState[key].point2.y];
            }
            if (key === 'SRAS') {
                createLine(1, c1, c2, savedState[key].label);
            }
            else if (key === 'AD') {
                createLine(2, c1, c2, savedState[key].label);
            }
            else if (key === 'LRAS') {
                createLine(3, c1, c2, savedState[key].label);
            }
        }
    }

    function createLine(lineType, c1, c2, label) {
        var line, key, ltype, color, SRAS, AD;

        switch(lineType) {
            case 1:
                key = 'SRAS';
                ltype = 'Supply';
                color = 'orange';
                break;
            case 2:
                key = 'AD';
                ltype = 'Demand';
                color = 'dodgerblue';
                break;
            case 3:
                key = 'LRAS';
                ltype = 'Vertical';
                color = 'darkslategray';
                c1 = c1 || [7.5, 0];
                c2 = c2 || [7.5, 11];
                break;
        }

        if (!state.hasOwnProperty(key)) {
            line = MacroLib.createLine(board, {
                c1: c1,
                c2: c2,
                ltype: ltype,
                name: label || '',
                color: color
            });

            state[key] = {
                id: line.id,
                point1: {
                    x: line.point1.X(),
                    y: line.point1.Y(),
                },
                point2: {
                    x: line.point2.X(),
                    y: line.point2.Y(),
                },
                label: line.getName()
            };

            // Make the line draggable
            line.setAttribute({
                highlight: true,
                fixed: false
            });
            line.point1.setAttribute({
                fixed: false
            });
            line.point2.setAttribute({
                fixed: false
            });
            line.on('down', function() {
                unselectLine();
                selectLine(this);
                this.setAttribute({
                    strokeColor: 'red'
                });
                lineDown = true;
            });
            if (key === 'AD' || key === 'SRAS') {
                line.on('drag', function() {
                    state[key].point1.x = line.point1.X();
                    state[key].point1.y = line.point1.Y();
                    state[key].point2.x = line.point2.X();
                    state[key].point2.y = line.point2.Y();
                    // Change equilibrium point and associated dashed lines
                    if (state.hasOwnProperty('eqPoint')) {
                        state.eqPoint.x = eqPoint.X();
                        state.eqPoint.y = eqPoint.Y();
                        dashedLines.Y1.moveTo([0, eqPoint.Y()]);
                        dashedLines.Y2.moveTo([eqPoint.X(), eqPoint.Y()]);
                        dashedLines.X1.moveTo([eqPoint.X(), 0]);
                        dashedLines.X2.moveTo([eqPoint.X(), eqPoint.Y()]);
                    }
                });
            }
            else if (key === 'LRAS') {
                // Create x-axis label
                LRASxLabel = board.create('text', [line.point1.X(), -0.48, 'rY<sub>F</sub>'], {anchorX: 'middle'});
                // Store its id for removal
                state.LRASxLabel = {id: LRASxLabel.id};
                // Constrain movement to x coord only
                line.on('drag', function(event) {
                    var coords = board.getUsrCoordsOfMouse(event);
                    line.point1.moveTo([coords[0], 0]);
                    line.point2.moveTo([coords[0], 11]);
                    LRASxLabel.moveTo([coords[0], -0.48]);
                    state[key].point1.x = line.point1.X();
                    state[key].point1.y = line.point1.Y();
                    state[key].point2.x = line.point2.X();
                    state[key].point2.y = line.point2.Y();
                });
            }
            line.on('up', function() {
                lineDown = false;
            });
        }
        // If we have an SRAS and an AD, add an equilibrium point and its related dotted lines and label
        if (!state.hasOwnProperty('eqPoint')) {
            if (state.hasOwnProperty('SRAS') && state.hasOwnProperty('AD')) {
                SRAS = board.objects[state.SRAS.id];
                AD = board.objects[state.AD.id];
                eqPoint = board.create('intersection', [AD, SRAS, 0], {
                    visible: false
                });
                state.eqPoint = {
                    id: eqPoint.id,
                    x: eqPoint.X(),
                    y: eqPoint.Y()
                };
                dashedLines = MacroLib.createDashedLines2Axis(board, eqPoint, {
                    fixed: false,
                    withLabel: true,
                    xlabel: 'rY<sub>1</sub>',
                    ylabel: 'PL<sub>1</sub>',
                    color: 'gray'
                });
                // Store ids for removal
                state.dashedLines = {
                    ids: [
                        dashedLines.X1.id,
                        dashedLines.X2.id,
                        dashedLines.Y1.id,
                        dashedLines.Y2.id,
                        dashedLines.XLine.id,
                        dashedLines.YLine.id
                    ]
                };
            }
        }
    }

    function selectLine(line) {
        selectedLine = {
            id: line.id,
            strokeColor: line.getAttribute('strokeColor')
        }
    }

    function unselectLine() {
        if (lineSelected()) {
            board.objects[selectedLine.id].setAttribute({
                strokeColor: selectedLine.strokeColor
            });
        }
        selectedLine = {};
    }

    function removeLine() {
        var key, i;
        if (lineSelected()) {
            for(key in state) {
                if (state[key].id === selectedLine.id) {
                    delete state[key];
                    // If we delete an AD or SRAS line, we must delete the intersection and associated dashed lines
                    if ((key === 'AD' || key === 'SRAS') && state.hasOwnProperty('eqPoint')) {
                        board.removeObject(board.objects[state.eqPoint]);
                        for (i = 0; i < state.dashedLines.ids.length; i++) {
                            board.removeObject(board.objects[state.dashedLines.ids[i]]);
                        }
                        delete state.eqPoint;
                        delete state.dashedLines;
                    }
                    // If we dete LRAS, we must delete the its x-axis label
                    if (key === 'LRAS') {
                        board.removeObject(board.objects[state.LRASxLabel.id]);
                        delete state.LRASxLabel;
                    }
                }
            }
            board.removeObject(board.objects[selectedLine.id]);
            selectedLine = {};
        }
    }

    function addLabelToLine(label) {
        var key;
        if (lineSelected()) {
            board.objects[selectedLine.id].setAttribute({
                name: label
            });
            for(key in state) {
                if (state[key].id === selectedLine.id) {
                    state[key].label = label;
                }
            }
        }
    }

    function lineSelected() {
        // selectedLine dictionary is not empty
        return !(Object.keys(selectedLine).length === 0);
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var lineSelect = document.getElementById('lines');
    var labelSelect = document.getElementById('labels');
    var addBtn = document.getElementById('addBtn');
    var removeBtn = document.getElementById('removeBtn');
    var resetBtn = document.getElementById('resetBtn');

    addBtn.addEventListener('click', function() {
        var type = parseInt(lineSelect.options[lineSelect.selectedIndex].value);
        if (lineSelected()) {
            addLabelToLine(labelSelect.options[labelSelect.selectedIndex].value);
        }
        else {
            createLine(type);
        }
    });

    removeBtn.addEventListener('click', function() {
        removeLine();
    });

    resetBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(board);
        selectedLine = {};
        state = {};
        init();
    });

    init();
    MacroLib.onLoadPostMessage();

    //Standard edX JSinput functions
    function setState(transaction, stateStr) {
        savedState = JSON.parse(stateStr);
        createSavedShapes();
        console.info('State updated successfully from saved.');
    }

    function getState() {
        return JSON.stringify(state);
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
