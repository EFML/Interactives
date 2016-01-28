//General Parameters for Macro
JXG.Options.point.showInfobox = false;
JXG.Options.segment.strokeColor = 'Pink';

createDragLine = function(board,point1,point2,gname,color,xo,yo) {
    return board.create('segment',[point1,point2],{strokeColor:color,strokeWidth:'3',name:gname,withLabel:true,label:{offset:[xo,yo]}});
}

createSupply = function(board,options) {
    var name = options.name || '';
    var color = options.color || JXG.Options.segment.strokeColor;
    var c1,c2,S1,S2;

    c1 = [1.0,2.0];
    c2 = [9.0,10.0];
    S1 = board.create('point',c1,{withLabel:false,visible:false});
    S2 = board.create('point',c2,{withLabel:false,visible:false});
    return board.create('segment',[S1,S2],{'strokeColor':color,'strokeWidth':'3',
                                           'name':name,'withLabel':true,
                                           'label':{'offset':[105,105]}
                                          });
}

createDemand = function(board,options) {
    var name = options.name || '';
    var color = options.color || JXG.Options.segment.strokeColor;
    var c1,c2,D1,D2;

    c1 = [1.0,10.0];
    c2 = [9.0,2.0];
    D1 = board.create('point',c1,{withLabel:false,visible:false});
    D2 = board.create('point',c2,{withLabel:false,visible:false});
    return board.create('segment',[D1,D2],{'strokeColor':color,'strokeWidth':'3',
                                           'name':name,'withLabel':true,
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
    var visible = options.visible || true;
    
    var Y1,Y2,YLine,X1,X2,XLine,obj={};
    var Y1 = board.create('point',[0, intersection.Y()],
                     {'withLabel':withLabel,'name':ylabel,'visible':true,'size':'0.5','strokeColor':'Gray','label':{'offset':[-25,-2]}});

    var Y2 = board.create('point',[intersection.X(), intersection.Y()],
                     {'withLabel':false,'visible':false,'size':'0.0','strokeColor':''});

    var YLine = board.create('segment',[Y1,Y2],
                        {'strokeColor':color,'strokeWidth':'2','dash':'1','fixed':fixed,'visible':visible});

    var X1 = board.create('point',[intersection.X(), 0],
                     {'withLabel':withLabel,'name':xlabel,'visible':true,'size':'0.5','strokeColor':'Gray','label':{'offset':[-5,-8]}});

    var X2 = board.create('point',[intersection.X(), intersection.Y()],
                     {'withLabel':false,'visible':false,'size':'0.0','strokeColor':''});

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
