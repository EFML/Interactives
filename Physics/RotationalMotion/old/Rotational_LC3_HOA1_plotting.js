////////////
// BOARD 1
////////////

var bboxlimits = [-0.05, 10, 0.35, -1]

function initBoard() {
    var board,xlabel,ylabel;
    
    //JXG.JSXGraph.freeBoard(board);
    
    board = JXG.JSXGraph.initBoard('jxgbox1', {axis:true, 
                                            showCopyright: false,
                                            showNavigation: false,
                                            zoom: false,
                                            pan: false,
                                            boundingbox:bboxlimits,
                                            grid: false,
                                            hasMouseUp: true, 
    });

    //Axis Labels
    var ylabel = board.create('text',[-0.045,9,"Torque<br>T*D (N*m)"],{fixed:true});
    var xlabel = board.create('text',[0.25,-0.6,"Mass, M (kg)"],{fixed:true});

    return board;
}

var brd1 = initBoard();
var fit = {};


function linearRegression(y,x){
    //http://trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;
    
    for (var i = 0; i < y.length; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    } 

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
}

bestFitLine = function(points) {
    if (points.length < 0) {
        return alert("No data entered in table.");
    }
    
    var ydata = [];
    var xdata = [];
    for (i=0;i<points.length;i++) {
        ydata.push(points[i].Y());
        xdata.push(points[i].X());
    }
        
    fit = {};
    fit = linearRegression(ydata,xdata);
    console.log(fit);
    brd1.create('functiongraph',
                   [function(x){ return fit['slope']*x + fit['intercept'];}, bboxlimits[0], bboxlimits[2]],
                   {name:'Best Fit<br>Parameters','strokeWidth':'3',withLabel: true,label:{offset:[0,-20]}}
                );
    return fit;
}

function plotData() {        
    brd1 = initBoard();
    var XCol = 0,
        YCol = 5, //Input Field
        table = document.getElementById("myActiveTable"),
        cells = table.getElementsByTagName('td'),
        x=0, y=0, i=0,points=[],params=[]; //

    for (i = 0; i < cells.length; i += 6) {
        x = cells[i+XCol].innerHTML;
        y = cells[i+YCol].getElementsByTagName('input')[0].value;
    
        if (x.length > 0 && y.length > 0) {
            var p = brd1.create('point',[Number(x),Number(y)],{fixed:true, label:{offset:[0,-15]}});
            points.push(p);
        }
    }
    
    params = bestFitLine(points);
    return points;
}

function toggleFitLine(E) {
    //E stands for element
    if (E.getAttribute('visible')) {
        E.setAttribute({visible:false});
    }
    else {
        E.setAttribute({visible:true});
    }
}

//Standard edX JSinput functions
getState = function(){
    var state={};
    state = getInput();
    statestr = JSON.stringify(state);        
    return statestr;
}

getInput = function() {
    var i;
    var data = {};
    data['response'] = {};
    
    //Colors
    data['colors'] = {};
    
    var cells = document.getElementsByClassName('Active');
    for (i=0;i<cells.length;i++) {
        data['response'][cells[i].id] = cells[i].value;
        data['colors'][cells[i].id] = 'white';
    }
    //console.log(data);
    return data;
}

setState = function(statestr){
    var ID='',state={};
    state = JSON.parse(statestr);
    
    for (ID in state['response']) {
        //console.log(state['response'][ID]);
        console.log(statestr);
        document.getElementById(ID).value = state['response'][ID];
        document.getElementById(ID).style.backgroundColor = state['colors'][ID];
    }
}

    