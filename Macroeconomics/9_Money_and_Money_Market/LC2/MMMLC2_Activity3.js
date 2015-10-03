var Macro = (function(JXG) {
    'use strict';
    var brd1, D2, dashD2, G;

    function init() {
        var bboxlimits = [-1.85, 12, 12, -1.1];
        brd1 = JXG.JSXGraph.initBoard('jxgbox1', {axis:false,
                                                showCopyright: false,
                                                showNavigation: false,
                                                zoom: false,
                                                pan: false,
                                                boundingbox:bboxlimits,
                                                grid: false,
                                                hasMouseUp: true,
        });

        var xaxis = brd1.create('axis', [[0, 0], [12, 0]], {withLabel: true, label: {offset: [320,-20]}});
        var yaxis = brd1.create('axis', [[0, 0], [0, 12]], {withLabel: true, label: {offset: [-60,260]}});

        //Axes
        xaxis.removeAllTicks();
        yaxis.removeAllTicks();
        var ylabel = brd1.create('text',[-1.75,10,"Nominal<br>Interest<br>Rate"],{fixed:true});
        var xlabel = brd1.create('text',[8,-0.5,"Quantity of Money"],{fixed:true});

        //Demand 1
        var D1 = createDemand(brd1,{name:'D<sub>1</sub>',color:'Gray'});
        D1.setAttribute({fixed:true, dash:1});
        G = brd1.create('glider',[6.0,6.0,D1],{fixed:true,visible:false});

        ////////////
        // Fixed Dashed Lines for Board 1
        ////////////
        var dashD1 = createDashedLines2Axis(brd1,G,
                                          {fixed:true,
                                           withLabel:true,
                                           xlabel:'M<sub>1</sub>',
                                           ylabel:'r<sub>1</sub>',
                                           color:'Gray'});


        //Demand 2
        D2 = createDemand(brd1,{name:'D<sub>2</sub>',color:'DodgerBlue'});
        D2.setAttribute({withLabel:false,offset:[125,-85]});

        //Glider along demand curve
        G = brd1.create('glider',[6.0,6.0,D2],{name:'A',withLabel:false,fixed:true});

        ////////////
        // Draggable Dashed Lines for Board 1
        ////////////
        dashD2 = createDashedLines2Axis(brd1,G,
                                          {fixed:false,
                                           withLabel:false,
                                           xlabel:'M<sub>2</sub>',
                                           ylabel:'',
                                           color:'DodgerBlue'});

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
    var riseMoneyDemandBtn = document.getElementById('riseMoneyDemandBtn');
    var fallMoneyDemandBtn = document.getElementById('fallMoneyDemandBtn');
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    riseMoneyDemandBtn.addEventListener('click', increaseXY);
    fallMoneyDemandBtn.addEventListener('click', decreaseXY);
    resetAnimationBtn.addEventListener('click', resetAnimation);

    function toggleLabels(toggle) {
        dashD2.X1.setAttribute({withLabel:toggle});
        dashD2.Y1.setAttribute({withLabel:toggle});
        D2.setAttribute({withLabel:toggle});
    };

    //Animation for shifting curve SouthWest
    function decreaseXY() {
        resetAnimation();
        brd1.update();

        var speed = 1000;
        toggleLabels(true);

        D2.point1.moveTo([D2.point1.X()-1.5,D2.point1.Y()],speed);
        D2.point2.moveTo([D2.point2.X()-1.5,D2.point2.Y()],speed);

        dashD2.Y1.moveTo([0, G.Y()],speed);
        dashD2.Y2.moveTo([G.X()-1.5, G.Y()],speed);

        dashD2.X1.moveTo([G.X()-1.5, 0],speed);
        dashD2.X2.moveTo([G.X()-1.5, G.Y()],speed);

        brd1.update();
    }

    //Animation for shifting curve NorthEast
    function increaseXY() {
        var speed = 1000;
        resetAnimation();
        toggleLabels(true);
        brd1.update();

        D2.point1.moveTo([D2.point1.X()+1.5,D2.point1.Y()],speed);
        D2.point2.moveTo([D2.point2.X()+1.5,D2.point2.Y()],speed);

        dashD2.Y1.moveTo([0, G.Y()],speed);
        dashD2.Y2.moveTo([G.X()+1.5, G.Y()],speed);

        dashD2.X1.moveTo([G.X()+1.5, 0],speed);
        dashD2.X2.moveTo([G.X()+1.5, G.Y()],speed);

        brd1.update();
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    }

    init();

    //Standard edX JSinput functions
    function getInput(){
        state = {};
        statestr = JSON.stringify(state);
        console.log(statestr)

        //IPython Notebook Considerations
        document.getElementById('spaceBelow').innerHTML += '<br>'+statestr;
        var command = "state = '" + statestr + "'";
        console.log(command);

        //Kernel
        var kernel = IPython.notebook.kernel;
        kernel.execute(command);

        return statestr;
    }

    function getState(){
        state = {'input': JSON.parse(getInput())};
        statestr = JSON.stringify(state);
        return statestr
    }

    function setState(statestr){
        $('#msg').html('setstate ' + statestr);
        state = JSON.parse(statestr);
        console.log(statestr);
        console.debug('State updated successfully from saved.');
    }

    return {
        setState: setState,
        getState: getState,
        getGrade
    };
})(JXG, undefined);
