var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, brd2;

    function init() {
        MacroLib.init(MacroLib.TWO_BOARDS);
        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1',{xname:"Real GDP", yname:"PL",grid:false});

        //Supply Line 1 - fixed
        var SB1 = MacroLib.createLine(brd1,{'ltype':'Supply','name':'SRAS',color:'Gray'});
        SB1.setAttribute({'fixed':true,'highlight':false});

        //Demand Line 1 - fixed
        var AD1 = MacroLib.createLine(brd1,{'ltype':'Demand','name':'AD<sub>1</sub>','color':'Gray'})
        AD1.setAttribute({'dash':1,'fixed':true,'highlight':false});

        //Demand Line 2 - moveable
        var AD2 = MacroLib.createLine(brd1,{'ltype':'Demand','name':'AD<sub>2</sub>','color':'Orange'})
        AD2.setAttribute({withLabel:false});

        ////////////
        // Intersection Box 1
        ////////////
        var iSDfix = brd1.create('intersection', [AD1, SB1, 0], {visible:false});
        var iS2D = brd1.create('intersection', [AD2, SB1, 0], {visible:false});

        ////////////
        // Dashes for fixed Line
        ////////////
        var dashesB1fixed = MacroLib.createDashedLines2Axis(brd1,iSDfix,
                                                   {withLabel:true,
                                                   xlabel:'rY<sub>1</sub>',
                                                   ylabel:'PL<sub>1</sub>',
                                                   color:'Gray'
                                                   });

        ////////////
        // Dashes for draggable Moveable Line
        ////////////
        var dashesB1 = MacroLib.createDashedLines2Axis(brd1,iS2D,
                                                   {withLabel:true,
                                                   xlabel:'rY<sub>2</sub>',
                                                   ylabel:'PL<sub>2</sub>',
                                                   color:'Orange'
                                                   });

        dashesB1.Y1.setAttribute({visible:false});
        dashesB1.X1.setAttribute({visible:false});
        dashesB1.XLine.setAttribute({visible:false});
        dashesB1.YLine.setAttribute({visible:false});

        ////////////
        // BOARD 2
        ////////////
        var bboxlimits2 = [-2.5, 12, 12, -1.5];
        brd2 = MacroLib.createBoard('jxgbox2',{bboxlimits:bboxlimits2,xname:"UR", yname:"Inflation<br>Rate", 'ypos':[-2.4,10], grid:false});

        //////////
        // Connect Boards and Movement
        //////////
        brd1.addChild(brd2);

        //SRPC - fixed
        var SRPC = MacroLib.createLine(brd2,{'ltype':'Demand','name':'SRPC','color':'Blue'});
        SRPC.setAttribute({'fixed':true,'highlight':false});

        ////////
        // Dashed Line Box 2
        ////////
        var DB2YP1 = brd2.create('point',[0, iS2D.Y()],{withLabel:false,visible:false});
        var DB2YP2 = brd2.create('point',[iS2D.X(), iS2D.Y()],{withLabel:false,visible:false});
        var DB2Y = brd2.create('segment',[DB2YP1,DB2YP2],{visible:false,strokeColor:'gray',strokeWidth:'2',
                                                                    dash:'1',fixed:true} );
        ////////
        //Intersection for SRPC
        ////////
        var iB2SRPC = brd2.create('intersection', [DB2Y, SRPC, 0], {name:'A<sub>2</sub>',withLabel:true,visible:false});
        var iB2fixed = brd2.create('point', [iB2SRPC.X(), iB2SRPC.Y()], {name:'A<sub>1</sub>',visible:true,
                                                                         fixed:true,fillColor:'Gray',
                                                                         strokeColor:'Gray'});

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines in Board 1
            dashesB1.Y1.moveTo([0, iS2D.Y()]);
            dashesB1.Y2.moveTo([iS2D.X(), iS2D.Y()]);

            dashesB1.X1.moveTo([iS2D.X(), 0]);
            dashesB1.X2.moveTo([iS2D.X(), iS2D.Y()]);

            DB2YP1.moveTo([0, iS2D.Y()]);
            DB2YP2.moveTo([iB2SRPC.X(),iS2D.Y()]);

        });

        brd1.on('mousedown', function() {
            AD2.setAttribute({withLabel:true});
            iB2SRPC.setAttribute({visible:true});

            dashesB1.Y1.setAttribute({visible:true});
            dashesB1.X1.setAttribute({visible:true});

            dashesB1.XLine.setAttribute({visible:true});
            dashesB1.YLine.setAttribute({visible:true});

            brd1.update()
        });
    }

    ////////////////////////
    // External DOM button
    ////////////////////////
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

        // if (state["dragLine"]) {
        //     brd1.removeObject('AD2');
        //     var point1 = [state["dragLine"]["p1X"],state["dragLine"]["p1Y"]];
        //     var point2 = [state["dragLine"]["p2X"],state["dragLine"]["p2Y"]]

        //     //Demand Line 2 - moveable
        //     AD2.point1.moveTo(point1,0);
        //     AD2.point2.moveTo(point2,0);

        //     brd1.update();
        // }
        //alert(statestr);
        console.debug('State updated successfully from saved.');
    }

    function getState(){
        state = JSON.parse(getGrade());
        statestr = JSON.stringify(state);
        // console.log(statestr);
        return statestr;
    }

    //Standard edX JSinput functions
    function getGrade(){
        // state = {"dragLine":{'p1X':AD2.point1.X(),'p2X':AD2.point2.X(),
        //                      'p1Y':AD2.point1.Y(),'p2Y':AD2.point2.Y()},
        //          "staticLine":{'p1X':AD1.point1.X(),'p2X':AD1.point2.X(),
        //                        'p1Y':AD1.point1.Y(),'p2Y':AD1.point2.Y()}};
        // statestr = JSON.stringify(state);
        // console.log(statestr);

        return statestr;
    }

    MacroLib.createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade: getGrade
    };
})(JXG, MacroLib, undefined);