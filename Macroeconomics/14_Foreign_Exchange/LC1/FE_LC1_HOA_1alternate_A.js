var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////

        brd1 = MacroLib.createBoard('jxgbox1',{xname:' ',
                                          yname:"Price<br>( $/&euro; )",grid:false,'xpos':[8,-0.5],'ypos':[-1.25,10]});
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

    //Standard edX JSinput functions
    function setState(transaction,statestr){
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

    function getState(){
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