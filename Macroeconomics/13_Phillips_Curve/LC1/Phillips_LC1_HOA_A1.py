# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <codecell>

from IPython.display import HTML

# <markdowncell>

# ###Macroeconomics - Phillips Curve
# https://edge.edx.org/courses/DavidsonCollege/DAP002/2014/courseware/e8e30d44ee1a44268de4968dbc364642/43299eb8bd584086aef887739dd86768/

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
        <!-- COMMENT: Define the jxgbox - aka, where all the interactive graphing will go. -->
        <div style="width: 100%; overflow: hidden;">
            <div id='jxgbox1' class='jxgbox' style='width:450px; height:350px; float:left; border: solid #1f628d 2px;'></div>
        </div>
        
        <!-- COMMENT: Buttons below are used to add debugging features to an interactive. Conole logging allows you to see
            output within a browser's console. Try reading about Chrome's console. -->
        
        <input class="btn" type="button" value="Pass State for Grading" onClick="getInput()">
        <div id="spaceBelow">State:</div>

        
        <!-- COMMENT: Where our Javascript begins. -->
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>
        <script type='text/javascript'>

            bboxlimits = [-1.1, 12, 12, -1.1];
            var board = JXG.JSXGraph.initBoard('jxgbox1', {axis:false, 
                                                    showCopyright: false,
                                                    showNavigation: false,
                                                    zoom: false,
                                                    pan: false,
                                                    boundingbox:bboxlimits,
                                                    grid: false,
                                                    hasMouseUp: true, 
            });
            
            xaxis = board.create('axis', [[0, 0], [11, 0]], {withLabel: false});
            yaxis = board.create('axis', [[0, 0], [0, 11]], {withLabel: false});

            //Axes
            xaxis.removeAllTicks();
            yaxis.removeAllTicks();
            var xlabel = board.create('text',[-1,10,"Real<br>GDP"],{fixed:true});
            var ylabel = board.create('text',[9,-0.5,"Price Level"],{fixed:true});
            
            //Define Functions
            c1 = [1.0,2.0]
            c2 = [9.0,10.0]
            var staticLine = board.create('segment',[c1,c2],{strokeColor:'gray',strokeWidth:'1',dash:'1',fixed:true});
            var f2 = board.create('functiongraph', [function(x){ return -1.0*x +10.0;},1.0,9.0], 
                                  {strokeColor:'black',strokeWidth:'3',name:'SRAS',withLabel:true,highlight:false});
            
            var p1 = board.create('point',c1,{withLabel:false,visible:false});
            var p2 = board.create('point',c2,{withLabel:false,visible:false});
            var dragLine = board.create('segment',[p1,p2],{strokeColor:'blue',strokeWidth:'3',name:'AD',withLabel:true,
                                                           label:{offset:[-100,-100]}});            
            
            
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

def grader(e, ans):
    import json
    answer = json.loads(ans)

    def dist1D(xf,xi):
        #print xf,xi,xf-xi
        return xf-xi

    delta = dist1D(answer['dragLine']['p1Y'],answer['staticLine']['p1Y'])
    if delta > 0:
        if delta > 0.5:
            return {'ok': True, 'msg': 'Good job.'}
    elif delta < 0:
        return {'ok': False, 'msg': 'Please rethink your solution - explanation.'}
    else:
        return {'ok': False, 'msg': 'Something wrong.'}

# <codecell>

grader('what',state)

# <markdowncell>

# #### File Templating

# <codecell>

answer.keys()

# <codecell>


