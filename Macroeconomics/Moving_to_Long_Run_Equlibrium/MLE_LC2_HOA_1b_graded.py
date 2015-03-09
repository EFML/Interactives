
# coding: utf-8

# ###Moving to Long-Run Equilibrium
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/ee567d7e52294aeaa8a32cd1c3f09cf3?action=new

# In[10]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <style> \n            body {\n                margin: 10px;\n                /*padding-top: 40px;*/\n            }\n        </style>\n    </head>\n\n    <body>\n        \n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:350px; height:300px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n\n        <!-- TURNED OFF\n        <input class="btn" type="button" value="Shift in Aggregate Demand" onClick="startAnimation()">\n        <input class="btn" type="button" value="Reset" onClick="resetAnimation()">\n        -->\n        \n        \n        <!-- COMMENT: Where our Javascript begins. -->\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        \n        <!-- COMMENT: Specific Davidson Next calls built on JSXGraph. Must be loaded after JSXgraph. -->\n        <script type="text/javascript" src="../../JS/Macro.js"></script>\n        \n        <script type=\'text/javascript\'>\n            \n            ////////////\n            // BOARD 1\n            ////////////\n            bboxlimits = [-1.5, 12, 12, -1];\n            var brd1 = JXG.JSXGraph.initBoard(\'jxgbox1\', {axis:false, \n                                                    showCopyright: false,\n                                                    showNavigation: false,\n                                                    zoom: false,\n                                                    pan: false,\n                                                    boundingbox:bboxlimits,\n                                                    grid: false,\n                                                    hasMouseUp: true, \n            });\n            \n            xaxis1 = brd1.create(\'axis\', [[0, 0], [11, 0]], {withLabel: false});\n            yaxis1 = brd1.create(\'axis\', [[0, 0], [0, 11]], {withLabel: false});\n\n            //Axes\n            xaxis1.removeAllTicks();\n            yaxis1.removeAllTicks();\n            var xlabel1 = brd1.create(\'text\',[-1.2,10,"PL"],{fixed:true});\n            var ylabel1 = brd1.create(\'text\',[9,-0.5,"RGDP"],{fixed:true});\n            \n            //Supply Line 1 - fixed\n            var Supply = createSupply(brd1,{name:\'SRAS\',color:\'DodgerBlue\'});\n            Supply.setAttribute({\'name\':\'SRAS\',\'fixed\':false,\'highlight\':false});\n            \n            //Demand Line 1 - fixed\n            var AD1 = createDemand(brd1,{name:\'AD1\',color:\'Orange\'});\n            AD1.setAttribute({\'dash\':1,\'fixed\':true,\'highlight\':false});\n            \n            //Demand Line 2 - moveable\n            var AD2 = createDemand(brd1,{name:\'AD2\',color:\'Orange\'});\n            AD2.setAttribute({withLabel:false});\n            \n             \n            ////////////\n            // Intersection Box 1\n            ////////////\n            var iSDfix = brd1.create(\'intersection\', [AD1, Supply, 0], {visible:false}); \n            var iS2D = brd1.create(\'intersection\', [AD2, Supply, 0], {visible:false});\n            \n            ////////////\n            // Draggable Dashed Lines for Board 1\n            ////////////\n            var dashesDragB1 = createDashedLines2Axis(brd1,iS2D,\n                                                      {fixed:false,\n                                                       withLabel:false,\n                                                       xlabel:\'Y2\',\n                                                       ylabel:\'PL2\',\n                                                       color:\'Orange\'});\n            \n            ////////////\n            // Fixed Dashed Lines for Board 1\n            ////////////\n            \n            var dashesFixedB1 = createDashedLines2Axis(brd1,iSDfix,\n                                          {withLabel:true,\n                                           xlabel:\'rY1\',\n                                           ylabel:\'PL1\',\n                                           color:\'DodgerBlue\'});\n            \n            ////////////\n            //LRAS - straight line\n            ////////////\n            var LRAS = brd1.create(\'segment\',[[7.0,11.0],[7.0,0.0]],\n                                   {\'strokeColor\':\'DodgerBlue\',\'strokeWidth\':\'2\',\n                                    \'name\':\'LRAS\',\'withLabel\':true,\n                                    \'label\':{\'offset\':[-15,140]}});\n            var labelLRAS = brd1.create(\'text\',[6.7,-0.4,"rYF"],{fixed:true});\n            \n            \n        \n            //////////////////\n            // Interactivity\n            //////////////////\n            brd1.on(\'move\', function() {      \n                //Moving Dashed Lines in Board 1\n                dashesDragB1.Y1.moveTo([0, iS2D.Y()]);\n                dashesDragB1.Y2.moveTo([iS2D.X(), iS2D.Y()]);\n\n                dashesDragB1.X1.moveTo([iS2D.X(), 0]);\n                dashesDragB1.X2.moveTo([iS2D.X(), iS2D.Y()]);\n        \n            });\n            \n            brd1.on(\'mousedown\', function() {      \n                AD2.setAttribute({withLabel:true});\n                dashesDragB1.Y1.setAttribute({withLabel:true});\n                dashesDragB1.X1.setAttribute({withLabel:true});\n                brd1.update()\n            });\n            \n            \n            \n            \n        </script>\n    </body>\n</html>')


# ### Generate HTML File

# In[17]:

import re

#tmpfile = _i86
index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'MLE_test_4_2'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[ ]:



