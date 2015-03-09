# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <markdowncell>

# ###Scenario 1, Question 1

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
            <div id='jxgbox1' class='jxgbox' style='width:450px; height:350px; float:left; border: solid #1f628d 2px;'></div>        
        </div>

        <input class="btn" type="button" value="Shift in Aggregate Demand" onClick="startAnimation()">
        <input class="btn" type="button" value="Reset" onClick="resetAnimation()">
        
        
        
        <!-- COMMENT: Where our Javascript begins. -->
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>
        
        <!-- COMMENT: Specific Davidson Next calls built on JSXGraph. Must be loaded after JSXgraph. -->
        <script type="text/javascript" src="../../../JS/Macro_JSXgraph.js"></script>
        
        <script type='text/javascript'>

            ////////////
            // BOX 1
            ////////////
            bboxlimits = [-1.5, 12, 12, -1];
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
            var xlabel = brd1.create('text',[-1.2,10,"PL"],{fixed:true});
            var ylabel = brd1.create('text',[9,-0.5,"RGDP"],{fixed:true});
            
            //Supply Line 1 - fixed
            var Supply = createSupply();
            Supply.setAttribute({'name':'SRAS','fixed':true,'highlight':false});
            
            //Demand Line 1 - fixed
            var AD1 = createDemand();
            AD1.setAttribute({'name':'AD1','dash':1,'fixed':true,'highlight':false});
            
            //Demand Line 2 - moveable
            var AD2 = createDemand();
            AD2.setAttribute({'name':'AD2',strokeColor:'Orange',withLabel:false});
            
            ////////
            // Intersection Box 1
            ////////
            var iSDfix = brd1.create('intersection', [AD1, Supply, 0], {visible:false}); 
            var iS2D = brd1.create('intersection', [AD2, Supply, 0], {visible:false});
            
            ////////////
            // Dashes for fixed Line
            ////////////
            var dashB1Yp1 = brd1.create('point',[0, iSDfix.Y()],{withLabel:false,visible:false});
            var dashB1Yp2 = brd1.create('point',[iSDfix.X(), iSDfix.Y()],{withLabel:false,visible:false});
            var dashB1Y1 = brd1.create('segment',[dashB1Yp1,dashB1Yp2],{strokeColor:'gray',strokeWidth:'2',
                                                                        dash:'1',fixed:true} );

            var dashB1Xp1 = brd1.create('point',[iSDfix.X(), 0],{withLabel:false,visible:false});
            var dashB1Xp2 = brd1.create('point',[iSDfix.X(), iSDfix.Y()],{withLabel:false,visible:false});
            var dashB1X1 = brd1.create('segment',[dashB1Xp1,dashB1Xp2],{strokeColor:'gray',strokeWidth:'2',
                                                                          dash:'1',fixed:true} );
        
            ////////////
            // Dashes for draggable Moveable Line
            ////////////
            var dashS2Yp1 = brd1.create('point',[0, iS2D.Y()],{withLabel:false,visible:false});
            var dashS2Yp2 = brd1.create('point',[iS2D.X(), iS2D.Y()],{withLabel:false,visible:false});
            var dashS2Y1 = brd1.create('segment',[dashS2Yp1,dashS2Yp2],{strokeColor:'gray',strokeWidth:'2',
                                                                        dash:'1',fixed:true} );

            var dashS2Xp1 = brd1.create('point',[iS2D.X(), 0],{withLabel:false,visible:false});
            var dashS2Xp2 = brd1.create('point',[iS2D.X(), iS2D.Y()],{withLabel:false,visible:false});
            var dashS2X1 = brd1.create('segment',[dashS2Xp1,dashS2Xp2],{strokeColor:'gray',strokeWidth:'2',
                                                                          dash:'1',fixed:true} );
        
            
            
            brd1.on('move', function() {      
                dashS2Yp1.moveTo([0, iS2D.Y()]);
                dashS2Yp2.moveTo([iS2D.X(), iS2D.Y()]);

                dashS2Xp1.moveTo([iS2D.X(), 0]);
                dashS2Xp2.moveTo([iS2D.X(), iS2D.Y()]);
            });
            
            brd1.on('mousedown', function() {      
                AD2.setAttribute({withLabel:true});
                brd1.update()
            });
            
            //Animation
            startAnimation = function() {
                var c1 = [1.0,10.0];
                var c2 = [9.0,2.0];
                AD2.point1.moveTo([c1[0]+1,c1[1]+1],1000);
                AD2.point2.moveTo([c2[0]+1,c2[1]+1],1000);
                AD2.setAttribute({withLabel:true});
                brd1.update();
            };
            
            resetAnimation = function() {
                var c1 = [1.0,10.0];
                var c2 = [9.0,2.0];
                AD2.point1.moveTo(c1,10);
                AD2.point2.moveTo(c2,10);
                AD2.setAttribute({withLabel:false});
                brd1.update();
            };
            
            
            //Standard edX JSinput functions
            getInput = function(){
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

# <markdowncell>

# ### Generate HTML File

# <codecell>

import re

#tmpfile = _i86
index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'Phillips_LC1_HOA1'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile

# <codecell>


