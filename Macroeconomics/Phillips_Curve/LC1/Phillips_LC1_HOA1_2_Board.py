
# coding: utf-8

# ###Scenario 1, Question 1

# In[3]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <style> \n            body {\n                margin: 10px;\n                /*padding-top: 40px;*/\n            }\n        </style>\n    </head>\n\n    <body>\n        \n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:350px; height:300px; float:left; border: solid #1f628d 2px;\'></div>        \n            <div id=\'jxgbox2\' class=\'jxgbox\' style=\'width:350px; height:300px; margin-left: 375px; border: solid #1f628d 2px;\'></div>\n        </div>\n\n        <!-- TURNED OFF\n        <input class="btn" type="button" value="Shift in Aggregate Demand" onClick="startAnimation()">\n        <input class="btn" type="button" value="Reset" onClick="resetAnimation()">\n        -->\n        \n        \n        <!-- COMMENT: Where our Javascript begins. -->\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        \n        <!-- COMMENT: Specific Davidson Next calls built on JSXGraph. Must be loaded after JSXgraph. -->\n        <script type="text/javascript" src="../../../JS/Macro_JSXgraph.js"></script>\n        \n        <script type=\'text/javascript\'>\n            \n            JXG.Options.point.showInfobox = false;\n            JXG.Options.segment.strokeColor = \'Pink\';\n            \n            createSupply = function(board,gname,color) {\n                var c1 = [1.0,2.0];\n                var c2 = [9.0,10.0];\n                var S1 = board.create(\'point\',c1,{withLabel:false,visible:false});\n                var S2 = board.create(\'point\',c2,{withLabel:false,visible:false});\n                return board.create(\'segment\',[S1,S2],{\'strokeColor\':color,\'strokeWidth\':\'3\',\n                                                       \'name\':gname,\'withLabel\':true,\n                                                       \'label\':{\'offset\':[105,105]}\n                                                      });\n            }\n\n            createDemand = function(board,gname,color) {\n                var c1 = [1.0,10.0];\n                var c2 = [9.0,2.0];\n                var D1 = board.create(\'point\',c1,{withLabel:false,visible:false});\n                var D2 = board.create(\'point\',c2,{withLabel:false,visible:false});\n                return board.create(\'segment\',[D1,D2],{\'strokeColor\':color,\'strokeWidth\':\'3\',\n                                                       \'name\':gname,\'withLabel\':true,\n                                                       \'label\':{\'offset\':[105,-105]}\n                                                      });\n            }\n            \n            ////////////\n            // BOARD 1\n            ////////////\n            bboxlimits = [-1.5, 12, 12, -1];\n            var brd1 = JXG.JSXGraph.initBoard(\'jxgbox1\', {axis:false, \n                                                    showCopyright: false,\n                                                    showNavigation: false,\n                                                    zoom: false,\n                                                    pan: false,\n                                                    boundingbox:bboxlimits,\n                                                    grid: false,\n                                                    hasMouseUp: true, \n            });\n            \n            xaxis1 = brd1.create(\'axis\', [[0, 0], [11, 0]], {withLabel: false});\n            yaxis1 = brd1.create(\'axis\', [[0, 0], [0, 11]], {withLabel: false});\n\n            //Axes\n            xaxis1.removeAllTicks();\n            yaxis1.removeAllTicks();\n            var xlabel1 = brd1.create(\'text\',[-1.2,10,"PL"],{fixed:true});\n            var ylabel1 = brd1.create(\'text\',[9,-0.5,"RGDP"],{fixed:true});\n            \n            //Supply Line 1 - fixed\n            var Supply = createSupply(brd1,\'SRAS\',\'Gray\');\n            Supply.setAttribute({\'name\':\'SRAS\',\'fixed\':true,\'highlight\':false});\n            \n            //Demand Line 1 - fixed\n            var AD1 = createDemand(brd1,\'AD1\',\'Gray\');\n            AD1.setAttribute({\'dash\':1,\'fixed\':true,\'highlight\':false});\n            \n            //Demand Line 2 - moveable\n            var AD2 = createDemand(brd1,\'AD2\',\'Orange\');\n            AD2.setAttribute({withLabel:false});\n                        \n            ////////////\n            // Intersection Box 1\n            ////////////\n            var iSDfix = brd1.create(\'intersection\', [AD1, Supply, 0], {visible:false}); \n            var iS2D = brd1.create(\'intersection\', [AD2, Supply, 0], {visible:false});\n            \n            ////////////\n            // Dashes for fixed Line\n            ////////////\n            var dashB1Yp1 = brd1.create(\'point\',[0, iSDfix.Y()],{withLabel:true,name:\'PL1\',visible:true,\n                                                                 size:\'0.5\',strokeColor:\'Gray\',\n                                                                 \'label\':{\'offset\':[-25,-2]}});\n            var dashB1Yp2 = brd1.create(\'point\',[iSDfix.X(), iSDfix.Y()],{withLabel:true,visible:false});\n            var dashB1Y1 = brd1.create(\'segment\',[dashB1Yp1,dashB1Yp2],{strokeColor:\'gray\',strokeWidth:\'2\',\n                                                                        dash:\'1\',fixed:true});\n\n            var dashB1Xp1 = brd1.create(\'point\',[iSDfix.X(), 0],{withLabel:true,name:\'Y1\',visible:true,\n                                                                 size:\'0.5\',strokeColor:\'Gray\',\n                                                                 \'label\':{\'offset\':[-5,-8]}});\n            var dashB1Xp2 = brd1.create(\'point\',[iSDfix.X(), iSDfix.Y()],{withLabel:true,visible:false});\n            var dashB1X1 = brd1.create(\'segment\',[dashB1Xp1,dashB1Xp2],{strokeColor:\'gray\',\n                                                                        strokeWidth:\'2\',dash:\'1\',fixed:true});\n        \n            ////////////\n            // Dashes for draggable Moveable Line\n            ////////////\n            var dashS2Yp1 = brd1.create(\'point\',[0, iS2D.Y()],{withLabel:false,name:\'PL2\',visible:true,\n                                                               size:\'0.5\',strokeColor:\'Gray\',\n                                                               \'label\':{\'offset\':[-25,-2]}});\n            var dashS2Yp2 = brd1.create(\'point\',[iS2D.X(), iS2D.Y()],{withLabel:false,visible:false});\n            var dashS2Y1 = brd1.create(\'segment\',[dashS2Yp1,dashS2Yp2],{strokeColor:\'gray\',\n                                                                        strokeWidth:\'2\',dash:\'1\',fixed:true});\n\n            var dashS2Xp1 = brd1.create(\'point\',[iS2D.X(), 0],{withLabel:false,name:\'Y2\',visible:true,\n                                                               size:\'0.5\',strokeColor:\'Gray\',\n                                                               \'label\':{\'offset\':[-5,-8]}});\n            var dashS2Xp2 = brd1.create(\'point\',[iS2D.X(), iS2D.Y()],{withLabel:false,visible:false});\n            var dashS2X1 = brd1.create(\'segment\',[dashS2Xp1,dashS2Xp2],{strokeColor:\'gray\',strokeWidth:\'2\',\n                                                                        dash:\'1\',fixed:true});\n        \n            \n            ////////////\n            // BOARD 2\n            ////////////\n            bboxlimits2 = [-2.0, 12, 12, -1];\n            var brd2 = JXG.JSXGraph.initBoard(\'jxgbox2\', {axis:false, \n                                                    showCopyright: false,\n                                                    showNavigation: false,\n                                                    zoom: false,\n                                                    pan: false,\n                                                    boundingbox:bboxlimits2,\n                                                    grid: false,\n                                                    hasMouseUp: true, \n            });\n            \n            xaxis2 = brd2.create(\'axis\', [[0, 0], [11, 0]], {withLabel: false});\n            yaxis2 = brd2.create(\'axis\', [[0, 0], [0, 11]], {withLabel: false});\n            \n            //Axes\n            xaxis2.removeAllTicks();\n            yaxis2.removeAllTicks();\n            var ylabel2 = brd2.create(\'text\',[-1.8,10,"Inflation<br>Rate"],{fixed:true});\n            var xlabel2 = brd2.create(\'text\',[9,-0.5,"UR"],{fixed:true});\n        \n            //////////\n            // Connect Boards and Movement\n            //////////\n            brd1.addChild(brd2);\n        \n            //SRPC - fixed\n            var SRPC = createDemand(brd2,\'SRPC\',\'Blue\');\n            SRPC.setAttribute({\'fixed\':true,\'highlight\':false});\n        \n            ////////\n            // Dashed Line Box 2\n            ////////\n            var DB2YP1 = brd2.create(\'point\',[0, iS2D.Y()],{withLabel:false,visible:false});\n            var DB2YP2 = brd2.create(\'point\',[iS2D.X(), iS2D.Y()],{withLabel:false,visible:false});\n            var DB2Y = brd2.create(\'segment\',[DB2YP1,DB2YP2],{visible:false,strokeColor:\'gray\',strokeWidth:\'2\',\n                                                                        dash:\'1\',fixed:true} );\n            ////////\n            //Intersection for SRPC\n            ////////\n            var iB2SRPC = brd2.create(\'intersection\', [DB2Y, SRPC, 0], {name:\'A2\',withLabel:true,visible:false});\n            var iB2fixed = brd2.create(\'point\', [iB2SRPC.X(), iB2SRPC.Y()], {name:\'A1\',visible:true,\n                                                                             fixed:true,fillColor:\'Gray\',\n                                                                             strokeColor:\'Gray\'});\n\n        \n            //////////////////\n            // Interactivity\n            //////////////////\n            brd1.on(\'move\', function() {      \n                dashS2Yp1.moveTo([0, iS2D.Y()]);\n                dashS2Yp2.moveTo([iS2D.X(), iS2D.Y()]);\n\n                dashS2Xp1.moveTo([iS2D.X(), 0]);\n                dashS2Xp2.moveTo([iS2D.X(), iS2D.Y()]);\n                    \n                DB2YP1.moveTo([0, iS2D.Y()]);\n                DB2YP2.moveTo([iB2SRPC.X(),iS2D.Y()]);    \n            });\n            \n            brd1.on(\'mousedown\', function() {      \n                AD2.setAttribute({withLabel:true});\n                dashS2Yp1.setAttribute({withLabel:true});\n                dashS2Xp1.setAttribute({withLabel:true});\n                iB2SRPC.setAttribute({visible:true});\n                brd1.update()\n            });\n            \n            resetAnimation = function() {\n                //Initial line coords\n                var c1 = [1.0,10.0];\n                var c2 = [9.0,2.0];\n                \n                //Animated Curve\n                AD2.point1.moveTo(c1,10);\n                AD2.point2.moveTo(c2,10);\n                AD2.setAttribute({withLabel:false});\n                dashS2Yp1.setAttribute({withLabel:false});\n                dashS2Xp1.setAttribute({withLabel:false});\n                iB2SRPC.setAttribute({withLabel:false});\n                \n                brd1.update();\n\n                //Dashed Lines                \n                dashS2Yp1.moveTo([0, iS2D.Y()-1]);\n                dashS2Yp2.moveTo([iS2D.X()-1, iS2D.Y()-1]);\n\n                dashS2Xp1.moveTo([iS2D.X()-1, 0]);\n                dashS2Xp2.moveTo([iS2D.X()-1, iS2D.Y()-1]);\n                \n                brd1.update();\n            };\n            \n            \n            //Standard edX JSinput functions\n            getInput = function(){\n                state = {};\n                statestr = JSON.stringify(state);\n                console.log(statestr)\n                \n                //IPython Notebook Considerations\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = \'" + statestr + "\'";\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n\n            getState = function(){\n                state = {\'input\': JSON.parse(getInput())};\n                statestr = JSON.stringify(state);\n                return statestr\n            }\n\n            setState = function(statestr){\n                $(\'#msg\').html(\'setstate \' + statestr);\n                state = JSON.parse(statestr);\n                console.log(statestr);\n                console.debug(\'State updated successfully from saved.\');\n            }\n            \n            \n        </script>\n    </body>\n</html>')


# ### Generate HTML File

# In[128]:

import re

#tmpfile = _i86
index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'Phillips_LC1_HOA1_2_Board'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[ ]:



