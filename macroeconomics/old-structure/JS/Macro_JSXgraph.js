//////////////////////////////////////////////////////////////////
// JSXgraph functions designed to help build Macro interactives.
//
// http://academics.davidson.edu/davidsonnext/
//
// http://jsxgraph.uni-bayreuth.de/wp/
//
//////////////////////////////////////////////////////////////////

//General Parameters for Macro
JXG.Options.point.showInfobox = false;
JXG.Options.segment.strokeColor = 'Pink';

createDragLine = function(board,point1,point2,gname,color,xo,yo) {
    return board.create('segment',[point1,point2],{strokeColor:color,strokeWidth:'3',name:gname,withLabel:true,label:{offset:[xo,yo]}});
}

createSupply = function(board,gname,color) {
    var c1 = [1.0,2.0];
    var c2 = [9.0,10.0];
    var S1 = board.create('point',c1,{withLabel:false,visible:false});
    var S2 = board.create('point',c2,{withLabel:false,visible:false});
    return board.create('segment',[S1,S2],{'strokeColor':color,'strokeWidth':'3',
                                           'name':gname,'withLabel':true,
                                           'label':{'offset':[105,105]}
                                          });
}

createDemand = function(board,gname,color) {
    var c1 = [1.0,10.0];
    var c2 = [9.0,2.0];
    var D1 = board.create('point',c1,{withLabel:false,visible:false});
    var D2 = board.create('point',c2,{withLabel:false,visible:false});
    return board.create('segment',[D1,D2],{'strokeColor':color,'strokeWidth':'3',
                                           'name':gname,'withLabel':true,
                                           'label':{'offset':[105,-105]}
                                          });
}


/////////////////////////////////////////////////////////////
// Dashed Lines
createDashedLines2Axis = function(board,intersection,options) {
    var fixed = options.fixed || true;  // defaults
    var withLabel = options.withLabel || false;
    var xlabel = options.xlabel || '';  
    var ylabel = options.ylabel || '';
    var color = options.color || 'gray';

    var dashYp1 = board.create('point',[0, intersection.Y()],
                                {withLabel:withLabel,name:ylabel,visible:true,size:'0.5',strokeColor:'Gray','label':{'offset':[-25,-2]}});

    var dashYp2 = board.create('point',[intersection.X(), intersection.Y()],
                                {withLabel:false,visible:false});
    var dashY1 = board.create('segment',[dashYp1,dashYp2],
                               {strokeColor:color,strokeWidth:'2',dash:'1',fixed:fixed});

    var dashXp1 = board.create('point',[intersection.X(), 0],
                                {withLabel:withLabel,name:xlabel,visible:true,size:'0.5',strokeColor:'Gray','label':{'offset':[-5,-8]}});

    var dashXp2 = board.create('point',[intersection.X(), intersection.Y()],
                                {withLabel:false,visible:false});

    var dashX1 = board.create('segment',[dashXp1,dashXp2],
                               {strokeColor:color,strokeWidth:'2',dash:'1',fixed:fixed});

    return [dashXp1,dashXp2,dashYp1,dashYp2];
}






