var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        JXG.Options.point.showInfobox = false;

        ////////////
        // BOARD 1
        ////////////
        // var newBBox = [-1.5, 12, 12, -1.2];

        brd1 = MacroLib.createBoard('jxgbox1',{xname:"Real GDP", yname:"Price<br>Level",
                                          grid:false,'xpos':[9,-0.5],'ypos':[-1.25,10]});

        var c1 = [2.0,9.5];
        var c2 = [9.5,2.0];
        //Demand Line 1 - fixed
        var AD = MacroLib.createDemand(brd1,{c1:c1,c2:c2, name:'AD',color:'Gray'});
        AD.setAttribute({'fixed':true,'highlight':false});

        c1 = [2.5,10];
        c2 = [10,2.5];
        //Demand Line 1 - fixed
        var AD1 = MacroLib.createDemand(brd1,{c1:c1,c2:c2, name:'AD<sub>1</sub>',color:'DodgerBlue'});
        AD1.setAttribute({'fixed':true,'highlight':false});

        c1 = [3.25,10.75];
        c2 = [10.75,3.25];
        //Demand Line 1 - fixed
        var AD1 = MacroLib.createDemand(brd1,{c1:c1,c2:c2, name:'AD<sub>2</sub>',color:'Blue'});
        AD1.setAttribute({'fixed':true,'highlight':false});

        // G = brd1.create('glider',[6.0,6.0,AD2],{name:'A'});

        // brd1.on('mousedown', function() {
        //     AD2.setAttribute({withLabel:true,offset:[125,-85]});
        //     brd1.update()
        // });
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
    function setState(transaction, statestr){
        state = JSON.parse(statestr);
        // console.log(statestr);
        //console.log(state["dragLine"]);

        if (state["AD2"] && state["SRAS2"]) {
            //brd1.removeObject('AD2');
            var point1 = [state["AD2"]["p1X"],state["AD2"]["p1Y"]];
            var point2 = [state["AD2"]["p2X"],state["AD2"]["p2Y"]]
            AD2.point1.moveTo(point1,0);
            AD2.point2.moveTo(point2,0);

            var point1 = [state["SRAS2"]["p1X"],state["SRAS2"]["p1Y"]];
            var point2 = [state["SRAS2"]["p2X"],state["SRAS2"]["p2Y"]]
            SRAS2.point1.moveTo(point1,0);
            SRAS2.point2.moveTo(point2,0);

            brd1.update();
        }

        console.debug('State updated successfully from saved.');
    }

    function getState(){
        var state = JSON.parse(getGrade());
        statestr = JSON.stringify(state);
        console.log(statestr);
        return statestr;
    }

    function getGrade() {
        var state = {"AD2":{'p1X':AD2.point1.X(),'p2X':AD2.point2.X(),
                            'p1Y':AD2.point1.Y(),'p2Y':AD2.point2.Y()},
                     "AD1":{'p1X':AD1.point1.X(),'p2X':AD1.point2.X(),
                            'p1Y':AD1.point1.Y(),'p2Y':AD1.point2.Y()},
                     "SRAS2":{'p1X':SRAS2.point1.X(),'p2X':SRAS2.point2.X(),
                              'p1Y':SRAS2.point1.Y(),'p2Y':SRAS2.point2.Y()},
                     "SRAS1":{'p1X':SRAS1.point1.X(),'p2X':SRAS1.point2.X(),
                              'p1Y':SRAS1.point1.Y(),'p2Y':SRAS1.point2.Y()}
                    };
        statestr = JSON.stringify(state);
        return statestr;
    }

    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade: getGrade
    };
})(JXG, MacroLib, undefined);
