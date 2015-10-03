var Macro = (function(JXG) {
  'use strict';
    var animationSpeed, curveShift, brd1, AD2, dashD2, G;

    function init() {
        animationSpeed = 1000;
        curveShift = 1.5
        ////////////
        // BOARD 1
        ////////////
        brd1 = createBoard('jxgbox1',{xname:"Real GDP", yname:"Price<br>Level",
                                          grid:false,'xpos':[8,-0.5]});

        //Demand Line 1 - fixed
        var AD1 = createLine(brd1,{ltype:'Demand',name:'AD<sub>1</sub>',color:'Gray'});
        AD1.setAttribute({'dash':1,'fixed':true,'highlight':false});

        //Demand Line 2 - moveable
        AD2 = createLine(brd1,{ltype:'Demand',name:'AD<sub>2</sub>',color:'DodgerBlue'});
        AD2.setAttribute({withLabel:false});

        var Gfix = brd1.create('glider',[6.0,6.0,AD1],{fixed:true,visible:false});
        G = brd1.create('glider',[6.0,6.0,AD2],{name:'A'});

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashD1 = createDashedLines2Axis(brd1,Gfix,
                                          {fixed:true,
                                           withLabel:true,
                                           xlabel:'R<sub>1</sub>',
                                           ylabel:'P<sub>1</sub>',
                                           color:'Gray'});


        ////////////
        // Draggable Dashed Lines for Board 1
        ////////////
        dashD2 = createDashedLines2Axis(brd1,G,
                                          {fixed:false,
                                           withLabel:false,
                                           xlabel:'R<sub>2</sub>',
                                           ylabel:'P<sub>2</sub>',
                                           color:'DarkGray'});

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving Dashed Lines in Board 1
            dashD2.Y1.moveTo([0, G.Y()]);
            dashD2.Y2.moveTo([G.X(), G.Y()]);

            dashD2.X1.moveTo([G.X(), 0]);
            dashD2.X2.moveTo([G.X(), G.Y()]);
            brd1.update()
        });

        brd1.on('mousedown', function() {
            toggleLabels(true);
            brd1.update()
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var decreaseABtn = document.getElementById('decreaseABtn');
    var increaseABtn = document.getElementById('increaseABtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    if (decreaseABtn) {
        decreaseABtn.addEventListener('click', decreaseA);
    }
    if (increaseABtn) {
        increaseABtn.addEventListener('click', increaseA);
    }
    resetAnimationBtn.addEventListener('click', function() {
        resetAnimation();
    });

    function toggleLabels(toggle) {
        dashD2.X1.setAttribute({withLabel:toggle});
        dashD2.Y1.setAttribute({withLabel:toggle});
        AD2.setAttribute({withLabel:toggle});
    };

    //Animation for shifting curve SouthWest
    function decreaseXY() {
        resetAnimation();
        brd1.update();

        toggleLabels(true);

        D2.point1.moveTo([D2.point1.X()-curveShift,D2.point1.Y()-curveShift],animationSpeed);
        D2.point2.moveTo([D2.point2.X()-curveShift,D2.point2.Y()-curveShift],spanimationSpeedeed);

        dashD2.Y1.moveTo([0, G.Y()-curveShift],animationSpeed);
        dashD2.Y2.moveTo([G.X()-curveShift, G.Y()-curveShift],animationSpeed);

        dashD2.X1.moveTo([G.X()-curveShift, 0],speed);
        dashD2.X2.moveTo([G.X()-curveShift, G.Y()-curveShift],speed);

        brd1.update();
    }

    //Animation for shifting curve NorthEast
    function increaseXY() {
        resetAnimation();
        toggleLabels(true);
        brd1.update();

        AD2.point1.moveTo([AD2.point1.X()+curveShift,AD2.point1.Y()+curveShift],animationSpeed);
        AD2.point2.moveTo([AD2.point2.X()+curveShift,AD2.point2.Y()+curveShift],animationSpeed);

        dashD2.Y1.moveTo([0, G.Y()+curveShift],animationSpeed);
        dashD2.Y2.moveTo([G.X()+curveShift, G.Y()+curveShift],animationSpeed);

        dashD2.X1.moveTo([G.X()+curveShift, 0],animationSpeed);
        dashD2.X2.moveTo([G.X()+curveShift, G.Y()+curveShift],animationSpeed);

        brd1.update();
    }

    function increaseA() {
        resetAnimation();
        brd1.update();

        toggleLabels(true);
        G.moveTo([G.X()-curveShift,G.X()+curveShift],1000);

        dashD2.Y1.moveTo([0, G.Y()+curveShift],animationSpeed);
        dashD2.Y2.moveTo([G.X()-curveShift, G.Y()+curveShift],animationSpeed);

        dashD2.X1.moveTo([G.X()-curveShift, 0],animationSpeed);
        dashD2.X2.moveTo([G.X()-curveShift, G.Y()+curveShift],animationSpeed);

        brd1.update();
    }

    function decreaseA() {
        resetAnimation();
        brd1.update();

        toggleLabels(true);
        G.moveTo([G.X()+curveShift,G.X()-curveShift],1000);

        dashD2.Y1.moveTo([0, G.Y()-curveShift],animationSpeed);
        dashD2.Y2.moveTo([G.X()+curveShift, G.Y()-curveShift],animationSpeed);

        dashD2.X1.moveTo([G.X()+curveShift, 0],animationSpeed);
        dashD2.X2.moveTo([G.X()+curveShift, G.Y()-curveShift],animationSpeed);

        brd1.update();
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    }

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

    createChannel(getGrade, getState, setState);

    return {
        setState: setState,
        getState: getState,
        getGrade
    };
})(JXG, undefined);
