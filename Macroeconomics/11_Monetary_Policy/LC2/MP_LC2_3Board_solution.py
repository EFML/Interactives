
# coding: utf-8

# ###Monetary Policy LC2 - 3 Board solution (suggestion from Sally and Brian Held)
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/5e27cf18f81d49af84d152950b919eff

# In[1]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Prototype 3 Board',
                                           MacroJS='../../JS/Macro_3Board.js',
                                           JS='MP_LC2_3Board_solution.js',
                                           OutputFile='MP_LC2_3Board_solution.html',
                                           studioPaths=False 
                                          )


# In[6]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        \n    </head>\n\n    <body>\n        <div style="width: 750;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:250px; height:240px; float:left; border: solid #1f628d 2px;\'></div>        \n            <div id=\'jxgbox2\' class=\'jxgbox\' style=\'width:250px; height:240px; float:left; margin-left: 10px; border: solid #1f628d 2px;\'></div>\n            <div id=\'jxgbox3\' class=\'jxgbox\' style=\'width:250px; height:240px; float:left; margin-left: 10px; border: solid #1f628d 2px;\'></div>\n        </div>\n        \n        <script type="text/javascript" src="../../JS/jschannel.js"></script>\n        <script type="text/javascript" src="../../JS/edxintegration.js"></script>\n        <script type="text/javascript" src="../../JS/Macro_3Board.js"></script>\n        <script type="text/javascript" src="MP_LC2_3Board_solution.js"></script>\n    </body>\n</html>')


# ### Generate HTML File

# In[6]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



