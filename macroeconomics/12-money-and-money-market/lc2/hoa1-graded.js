// Used as JSInput
(function(JXG, MacroLib) {
    'use strict';
    var brd1, C1, C2, C3;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // brd1 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2.5, 12, 12, -2.0],
            xname: 'Quantity<br>of Money',
            yname: 'Nominal<br>Interest<br>Rate'
        });

        //Curve 1 - fixed
        C1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'C<sub>1</sub>',
            color: 'gray'
        });
        C1.setAttribute({
            highlight: true
        });

        //Curve 2 - fixed
        C2 = MacroLib.createLine(brd1, {
            ltype: 'Supply',
            name: 'C<sub>2</sub>',
            color: 'gray'
        });
        C2.setAttribute({
            highlight: true
        });

        C3 = MacroLib.createLine(brd1, {
            ltype: 'Vertical',
            name: 'C<sub>3</sub>',
            color: 'gray'
        });
        C3.setAttribute({
            highlight: true
        });

        brd1.update();

        C1.on('down', function() {
            resetColors([C1, C2, C3]);
            C1.setAttribute({
                strokeColor: 'red',
                strokeWidth: 6
            });
        });

        C2.on('down', function() {
            resetColors([C1, C2, C3]);
            C2.setAttribute({
                strokeColor: 'red',
                strokeWidth: 6
            });
        });

        C3.on('down', function() {
            resetColors([C1, C2, C3]);
            C3.setAttribute({
                strokeColor: 'red',
                strokeWidth: 6
            });
        });

        function resetColors(curves) {
            for (var i = 0; i < curves.length; i++) {
                curves[i].setAttribute({
                    strokeColor: 'gray',
                    strokeWidth: 4
                });
            }
        }
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    //Standard edX JSinput functions
    function getGrade() {
        var state = {
            C1: C1.getAttribute('strokeColor'),
            C2: C2.getAttribute('strokeColor'),
            C3: C3.getAttribute('strokeColor'),
        };
        var statestr = JSON.stringify(state);
        return statestr;
    }

    function getState() {
        var state = {
            input: JSON.parse(getGrade())
        };
        var statestr = JSON.stringify(state);
        console.info('State successfully saved.');
        return statestr;
    }

    function setState(statestr) {
        var state = JSON.parse(statestr);
        state = state.input;
        if (state.C1 && state.C2 && state.C3) {
            C1.setAttribute({
                strokeColor: state.C1
            });
            C2.setAttribute({
                strokeColor: state.C2
            });
            C3.setAttribute({
                strokeColor: state.C3
            });
        }
        brd1.update();
        console.info('State updated successfully from saved.');
    }

    init();
    MacroLib.onLoadPostMessage();
    MacroLib.createChannel(getGrade, getState, setState);

})(JXG, MacroLib, undefined);
