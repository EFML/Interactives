//General Parameters for Macro
JXG.Options.point.showInfobox = false;
JXG.Options.segment.strokeColor = 'Pink';
JXG.Options.segment.strokeWidth = '5';
JXG.Options.text.fontSize = 15;
JXG.Options.text.highlight = false;

//Bounding Box Limits
var ThreeBoardDefaultBBox = [-1.75, 12, 12, -2.0];

//Custom Parameters
labelOffset = {'X':70,'Y':70};

createBoard = function(brdName,options) {
    var xname = options.xname || 'x-label';
    var xpos = options.xpos || [8,-1];

    var yname = options.yname || 'y-label';
    var ypos = options.ypos || [-1.5,10];

    var bboxlimits = options.bboxlimits || ThreeBoardDefaultBBox;
    var grid = options.grid || false;

    var board = JXG.JSXGraph.initBoard(brdName, {axis:false, 
                                      showCopyright: false,
                                      showNavigation: false,
                                      zoom: false,
                                      pan: false,
                                      boundingbox:bboxlimits,
                                      grid: grid,
                                      hasMouseUp: true, 
    });         

    xaxis = board.create('axis', [[0, 0], [11, 0]], {withLabel: false, highlight: false});
    yaxis = board.create('axis', [[0, 0], [0, 11]], {withLabel: false, highlight: false});

    //Axes
    xaxis.removeAllTicks();
    yaxis.removeAllTicks();
    var xlabel = board.create('text',[xpos[0],xpos[1],xname],{fixed:true});
    var ylabel = board.create('text',[ypos[0],ypos[1],yname],{fixed:true});

    return board;
}


lineCoords = function(ltype) {
    var ltype = ltype || 'Supply';
    var c1,c2,offset;
    if (ltype == 'Demand') {
        c1 = [2.0,9.5];
        c2 = [9.5,2.0];
        offset = [labelOffset.X,-labelOffset.Y];
    }
    else if (ltype =='Supply') {
        c1 = [2.0,2.0];
        c2 = [9.5,9.5];
        offset = [labelOffset.X,labelOffset.Y];
    }
    else if (ltype =='Vertical') {
        c1 = [5.75,1.0];
        c2 = [5.75,11.0];
        offset = [0,labelOffset.Y+25]
    }

    return [c1,c2,offset];
}


createLine = function(board,options) {
    var name = options.name || '';
    var color = options.color || JXG.Options.segment.strokeColor;
    var ltype = options.ltype || 'Supply';
    var fixed = options.type || true;
    var c1,c2,D1,D2,offset;

    var tmp = lineCoords(ltype);
    c1 = tmp[0];
    c2 = tmp[1];
    offset = tmp[2];

    D1 = board.create('point',c1,{withLabel:false,visible:false});
    D2 = board.create('point',c2,{withLabel:false,visible:false});
    return board.create('segment',[D1,D2],{'strokeColor':color,
                                           'name':name,'withLabel':true,
                                           'label':{'offset':offset}
                                          });
}


createTransformLine = function(board,options) {
    var name = options.name || '';
    var color = options.color || JXG.Options.segment.strokeColor;
    var ltype = options.ltype || 'Supply';
    var fixed = options.type || true;
    var transformList = options.transformList || [undefined];
    var c1,c2,D1,D2,offset;

    var tmp = lineCoords(ltype);
    c1 = tmp[0];
    c2 = tmp[1];
    offset = tmp[2];

    //Supply Board 1 - with slider transformation
    var s1B1 = board.create('point',c1,{visible:false});
    var s2B1 = board.create('point',c2,{visible:false});
    var pS1 = board.create('point',[s1B1,transformList],{visible:false});
    var pS2 = board.create('point',[s2B1,transformList],{visible:false});
    return board.create('segment',[pS1,pS2],{withLabel:true,highlight:false,'name':name,
                                             color:color,'label':{'offset':offset}
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
    var visible = options.visible || true;
    
    var Y1,Y2,YLine,X1,X2,XLine,obj={};
    var Y1 = board.create('point',[0, intersection.Y()],
                     {'withLabel':withLabel,'name':ylabel,'visible':true,'size':'0.5','highlight':false,
                     'fixed':fixed,'strokeColor':'Gray','label':{'offset':[4,-10]}});

    var Y2 = board.create('point',[intersection.X(), intersection.Y()],
                     {'withLabel':false,'visible':false,'fixed':fixed,'size':'0.0','strokeColor':''});

    var YLine = board.create('segment',[Y1,Y2],
                        {'strokeColor':color,'strokeWidth':'2','dash':'1','fixed':fixed,'visible':visible});

    var X1 = board.create('point',[intersection.X(), 0],
                     {'withLabel':withLabel,'name':xlabel,'visible':true,'size':'0.5','fixed':fixed,
                     'highlight':false,'strokeColor':'Gray','label':{'offset':[2,10]}});

    var X2 = board.create('point',[intersection.X(), intersection.Y()],
                     {'withLabel':false,'visible':false,'fixed':fixed,'size':'0.0','strokeColor':''});

    var XLine = board.create('segment',[X1,X2],
                        {'strokeColor':color,'strokeWidth':'2','dash':'1','fixed':fixed,'visible':visible});
    
    
    var obj = {
        Y1: Y1,
        Y2: Y2,
        YLine: YLine,
        X1: X1,
        X2: X2,
        XLine: XLine
    }
    
    return obj;
}
