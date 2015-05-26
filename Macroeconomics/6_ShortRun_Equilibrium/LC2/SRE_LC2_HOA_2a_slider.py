
# coding: utf-8

# ###Short-Run Macro Equilibrium
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/3cc3b0f4321f47cca9430aa893a646eb

# In[24]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Short-Run Macro Equilibrium',
                                           MacroJS='../../JS/Macro_1Board.js',
                                           JS='SRE_LC2_HOA_2a.js',
                                           OutputFile='SRE_LC2_HOA_2a_slider.html',
                                           studioPaths=False 
                                          )


# ###HTML Interactive Cell

# In[42]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="http://code.jquery.com/jquery-2.1.4.min.js"></script>\n    </head>\n    <body>    \n        <div id="JSXdiv" style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n       \n        <div class="list-group">\n            <input id="reset" class="btn" type="button" value="Reset" onclick="resetBoard()">\n        </div>\n        \n        <script type="text/javascript" src="../../JS/params1Board.js"></script>\n        <script type="text/javascript" src="../../JS/MacroAllBoards.js"></script>\n        <script type="text/javascript" src="SRE_LC2_HOA_2a_v2.0.js"></script>\n        \n    </body>\n</html>')


# ### Generate HTML File

# In[43]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:




# In[ ]:




# In[ ]:



