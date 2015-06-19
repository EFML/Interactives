
# coding: utf-8

# ### Phillips Curve, LC1 Hands-On Activity 2  (2 Board)
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/7d71dd2ceda9481ca74c36718c81aa59

# In[1]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Phillips Curve: LC3 HOA #1',
                                           MacroJS='../../JS/Macro_2Board.js',
                                           JS='Phillips_LC3_HOA1_2Board_Slider.js',
                                           OutputFile='Phillips_LC3_HOA1_2Board_Slider.html',
                                           studioPaths=False 
                                          )


# ### HTML Interactive Cell

# In[3]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script src="https://code.jquery.com/jquery-1.10.2.js"></script>\n    </head>\n\n    <body>\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:350px; height:300px; float:left; border: solid #1f628d 2px;\'></div>        \n            <div id=\'jxgbox2\' class=\'jxgbox\' style=\'width:350px; height:300px; margin-left: 365px; border: solid #1f628d 2px;\'></div>\n        </div>\n        \n        <!--\n        <ul class="stack button-group">\n            <li><input class="btn" type="button" value="Reset" onClick="resetAnimation()"></li>\n        </ul>\n        -->\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getGrade();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <script type="text/javascript" src="../../JS/jschannel.js"></script>\n        <script type="text/javascript" src="../../JS/edxintegration.js"></script>\n        <script type="text/javascript" src="../../JS/Macro_2Board.js"></script>\n        <script type="text/javascript" src="Phillips_LC3_HOA1_2Board_Slider.js"></script>\n    </body>\n</html>')


# ### Generate HTML File

# In[96]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



