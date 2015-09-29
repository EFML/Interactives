var brd1;

function init() {
    ////////////
    // brd1 1
    ////////////
    bboxlimits = [-1.7, 12, 12, -1];
    brd1 = JXG.JSXGraph.initBoard('jxgbox1', {axis:false,
                                            showCopyright: false,
                                            showNavigation: false,
                                            zoom: false,
                                            pan: false,
                                            boundingbox:bboxlimits,
                                            grid: false,
                                            hasMouseUp: true,
    });

    xaxis1 = brd1.create('axis', [[0, 0], [11, 0]], {withLabel: false});
    yaxis1 = brd1.create('axis', [[0, 0], [0, 11]], {withLabel: false});

    //Axes
    xaxis1.removeAllTicks();
    yaxis1.removeAllTicks();
    var xlabel1 = brd1.create('text',[-1.6,10,"Nominal<br>Interest<br>Rate"],{fixed:true});
    var ylabel1 = brd1.create('text',[8,-0.5,"Quantity of Money"],{fixed:true});

    //Curve 1 - fixed
    var C1 = createDemand(brd1,{name:'C<sub>1</sub>',color:'Gray'});
    C1.setAttribute({fixed:true,withLabel:true, 'highlight':true});

    //Curve 2 - fixed
    var C2 = createSupply(brd1,{name:'C<sub>2</sub>',color:'Gray'});
    C2.setAttribute({fixed:true,withLabel:true, 'highlight':true});

    //Curve 3 - fixed
    var C3 = brd1.create('segment',[[5.75,11.0],[5.75,1.0]],
                           {'strokeColor':'Gray','strokeWidth':'5',
                            'name':'C<sub>3</sub>','withLabel':true,'fixed':true,
                            'label':{'offset':[0,-190]}});

    brd1.update();

    C1.on('down', function () {
        resetColors([C1,C2,C3]);
        C1.setAttribute({strokeColor: 'red',strokeWidth: 6});
    });

    C2.on('down', function () {
        resetColors([C1,C2,C3]);
        C2.setAttribute({strokeColor: 'red',strokeWidth: 6});
    });

    C3.on('down', function () {
        resetColors([C1,C2,C3]);
        C3.setAttribute({strokeColor: 'red',strokeWidth: 6});
    });

    resetColors = function(curves) {
        for(i=0;i<curves.length;i++) {
            curves[i].setAttribute({strokeColor: 'Gray',strokeWidth: 4});
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

init();

//Standard edX JSinput functions
getGrade = function(){
    var state = {'C1':C1.getAttribute('strokeColor'),
                 'C2':C2.getAttribute('strokeColor'),
                 'C3':C3.getAttribute('strokeColor'),
                };
    statestr = JSON.stringify(state);
    //console.log(statestr)

    return statestr;
}

getState = function(){
    state = {'input': JSON.parse(getGrade())};
    statestr = JSON.stringify(state);
    return statestr
}

setState = function(statestr){
    state = JSON.parse(statestr);
    state = state['input'];
    //console.log(state['input']);
    if (state["C1"] && state["C2"] && state["C3"]) {
        C1.setAttribute({strokeColor: state['C1']});
        C2.setAttribute({strokeColor: state['C2']});
        C3.setAttribute({strokeColor: state['C3']});
    }
    brd1.update();
    //console.log(statestr);
    console.debug('State updated successfully from saved.');
}

createChannel(getGrade, getState, setState);
