JXG.Options.point.showInfobox = false;

////////////
// BOARD 1
////////////
// var newBBox = [-1.5, 12, 12, -1.2];

var brd1 = createBoard('jxgbox1',{xname:"Real GDP", yname:"Price<br>Level",
                                  grid:false,'xpos':[9,-0.5],'ypos':[-1.25,10]});


createDemand = function(board,options) {
    var name = options.name || '';
    var color = options.color || JXG.Options.segment.strokeColor;
    var fixed = options.type || true;
    var c1 = options.c1 || [2.0,9.5];
    var c2 = options.c2 || [9.5,2.0];
    var D1,D2,offset;

    offset = [labelOffset.X,-labelOffset.Y];

    D1 = board.create('point',c1,{withLabel:false,visible:false});
    D2 = board.create('point',c2,{withLabel:false,visible:false});
    return board.create('segment',[D1,D2],{'strokeColor':color,
                                           'name':name,'withLabel':true,
                                           'label':{'offset':offset}
                                          });
}


c1 = [2.0,9.5];
c2 = [9.5,2.0];
//Demand Line 1 - fixed
var AD = createDemand(brd1,{c1:c1,c2:c2, name:'AD',color:'Gray'});
AD.setAttribute({'fixed':true,'highlight':false});

c1 = [1.5,9];
c2 = [9,1.5];
//Demand Line 1 - fixed
var AD1 = createDemand(brd1,{c1:c1,c2:c2, name:'AD<sub>1</sub>',color:'DodgerBlue'});
AD1.setAttribute({'fixed':true,'highlight':false});

c1 = [0.75,8.25];
c2 = [8.25,0.75];
//Demand Line 1 - fixed
var AD1 = createDemand(brd1,{c1:c1,c2:c2, name:'AD<sub>2</sub>',color:'Blue'});
AD1.setAttribute({'fixed':true,'highlight':false});

// G = brd1.create('glider',[6.0,6.0,AD2],{name:'A'});

// brd1.on('mousedown', function() {
//     AD2.setAttribute({withLabel:true,offset:[125,-85]});
//     brd1.update()
// });


//Standard edX JSinput functions
setState = function(transaction, statestr){
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

getState = function(){
    var state = JSON.parse(getGrade());
    statestr = JSON.stringify(state);
    console.log(statestr);
    return statestr;
}

getGrade = function() {
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


