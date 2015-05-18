
# coding: utf-8

# ###Short-Run Macro Equilibrium
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/25543c043c364633bd416d3b36d9326a

# In[20]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Short-Run Macro Equilibrium',
                                           MacroJS='../../JS/Macro_1Board.js',
                                           JS='SRE_LC2_HOA_1abc.js',
                                           OutputFile='SRE_LC2_HOA_1a_slider.html',
                                           studioPaths=False 
                                          )


# ###HTML Interactive Cell

# In[25]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n    </head>\n    <body>    \n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        <!--<div class="list-group">\n            <input class="btn" type="button" value="Reset" onClick="resetBoard()">\n        </div>\n        -->\n        <script type="text/javascript" src="../../JS/params1Board.js"></script>\n        <script type="text/javascript" src="../../JS/MacroAllBoards.js"></script>\n        <script type="text/javascript" src="SRE_LC2_HOA_1a.js"></script>\n    </body>\n</html>')


# ### Generate HTML File

# In[26]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:




# In[ ]:




# In[ ]:



