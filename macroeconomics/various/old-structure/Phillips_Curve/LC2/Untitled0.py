# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <codecell>

%%HTML
<!DOCTYPE html>
<html>
    <head>
        <style> 
            body {
                margin: 10px;
                /*padding-top: 40px;*/
            }
        </style>
    </head>

    <body>
        
        
        <div style="width: 100%; overflow: hidden;">
            <div id='jxgbox1' class='jxgbox' style='width:350px; height:300px; float:left; border: solid #1f628d 2px;'></div>        
            <div id='jxgbox2' class='jxgbox' style='width:350px; height:300px; margin-left: 375px; border: solid #1f628d 2px;'></div> 
        </div>

        
        <!-- COMMENT: Where our Javascript begins. -->
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>
        <script type='text/javascript'>

            ////////////
            // BOX 1
            ////////////
            bboxlimits = [-2.3, 12, 12, -1.3];
            var brd1 = JXG.JSXGraph.initBoard('jxgbox1', {axis:false, 
                                                    showCopyright: false,
                                                    showNavigation: false,
                                                    zoom: false,
                                                    pan: false,
                                                    boundingbox:bboxlimits,
                                                    grid: false,
                                                    hasMouseUp: true, 
            });
            
            xaxis = brd1.create('axis', [[0, 0], [11, 0]], {withLabel: false});
            yaxis = brd1.create('axis', [[0, 0], [0, 11]], {withLabel: false});

            //Axes
            xaxis.removeAllTicks();
            yaxis.removeAllTicks();
            var xlabel = brd1.create('text',[-2,10,"Real<br>Interest<br>Rate"],{fixed:true});
            var ylabel = brd1.create('text',[4,-0.5,"Quantity of Loanable Funds"],{fixed:true});
            
            //Define Objects
            createDragLine = function(board,point1,point2,gname,color,xo,yo){
                return board.create('segment',[point1,point2],{strokeColor:color,strokeWidth:'3',name:gname,
                                            withLabel:true,label:{offset:[xo,yo]}});
            }

            
            var cS1 = [1.0,2.0];
            var cS2 = [9.0,10.0];
            var S1 = brd1.create('point',cS1,{withLabel:false,visible:false});
            var S2 = brd1.create('point',cS2,{withLabel:false,visible:false});
            var Supply = createDragLine(brd1,S1,S2,'S','Orange',-100,-100);
            
            var cD1 = [1.0,10.0];
            var cD2 = [9.0,2.0];
            var D1 = brd1.create('point',cD1,{withLabel:false,visible:false});
            var D2 = brd1.create('point',cD2,{withLabel:false,visible:false});
            var Demand = createDragLine(brd1,D1,D2,'D','Blue',-100,100);
            // Demand.setAttribute({'fixed':true});
                     
            ////////
            // Intersection Box 1
            ////////
            var iSD = brd1.create('intersection', [Supply, Demand, 0], {visible:false});    
            
            ////////////
            // Dashes in Box 1
            ////////////
            var dashB1Yp1 = brd1.create('point',[0, iSD.Y()],{withLabel:false,visible:false});
            var dashB1Yp2 = brd1.create('point',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});
            var dashB1Y1 = brd1.create('segment',[dashB1Yp1,dashB1Yp2],{straightFirst:false, straightLast:false,
                                                                           strokeColor:'gray',strokeWidth:'2',
                                                                           dash:'1',fixed:true}
                                  );

            var dashB1Xp1 = brd1.create('point',[iSD.X(), 0],{withLabel:false,visible:false});
            var dashB1Xp2 = brd1.create('point',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});
            var dashB1X1 = brd1.create('segment',[dashB1Xp1,dashB1Xp2],{straightFirst:false, straightLast:false,
                                                                           strokeColor:'gray',strokeWidth:'2',
                                                                           dash:'1',fixed:true}
                                  );
            
            
            brd1.on('move', function(){
                    
                //Dashed Lines 1
                dashB1Yp1.moveTo([0, iSD.Y()]);
                dashB1Yp2.moveTo([iSD.X(), iSD.Y()]);

                dashB1Xp1.moveTo([iSD.X(), 0]);
                dashB1Xp2.moveTo([iSD.X(), iSD.Y()]);
            });
            
            //Standard edX JSinput functions
            getInput = function(){
                state = {"dragLine":{'p1X':dragLine.point1.X(),'p2X':dragLine.point2.X(),
                                     'p1Y':dragLine.point1.Y(),'p2Y':dragLine.point2.Y()},
                         "staticLine":{'p1X':staticLine.point1.X(),'p2X':staticLine.point2.X(),
                                       'p1Y':staticLine.point1.Y(),'p2Y':staticLine.point2.Y()}};
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

            getState = function(){
                state = {'input': JSON.parse(getInput())};
                statestr = JSON.stringify(state);
                return statestr
            }

            setState = function(statestr){
                $('#msg').html('setstate ' + statestr);
                state = JSON.parse(statestr);
                console.log(statestr);
                console.debug('State updated successfully from saved.');
            }
            
            
        </script>
    </body>
</html>

# <codecell>


