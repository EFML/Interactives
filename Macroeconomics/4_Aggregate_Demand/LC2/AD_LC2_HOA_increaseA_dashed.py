
# coding: utf-8

# ### Phillips Curve - LC2, Hands-On Activity 1
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/b8d0395c0a0e45eca2f108b255e4cfe5
# 
# Useful links:
# Pi Symbol:  http://www.intmath.com/cg3/jsxgraph-axes-ticks-grids.php

# In[43]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Aggregate Demand: LC2 HOA #1a',
                                           MacroJS='../../JS/MacroAllBoards.js',
                                           JS='AD_LC2_HOA_AllAnimations_dashed.js',
                                           OutputFile='AD_LC2_HOA_increaseA_dashed.html',
                                           studioPaths=False 
                                          )


# ###HTML Interactive Cell

# In[44]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        \n    </head>\n\n    <body>\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        \n        <ul class="stack button-group">\n        <li><input class="btn" type="button" value="Show Economic Effect" onClick="increaseA()"></li>\n        \n        <li><input class="btn" type="button" value="Reset" onClick="resetAnimation()"></li>\n        </ul>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        \n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getGrade();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <script type="text/javascript" src="../../JS/jschannel.js"></script>\n        <script type="text/javascript" src="../../JS/edxintegration.js"></script>\n        <script type="text/javascript" src="../../JS/params1Board.js"></script>\n        <script type="text/javascript" src="../../JS/MacroAllBoards.js"></script>\n        <script type="text/javascript" src="AD_LC2_HOA_AllAnimations_dashed.js"></script>\n    </body>\n</html>')


# ###Ungraded

# In[42]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



