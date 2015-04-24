
# coding: utf-8

# ###Money and the Money Market: LC3, HOA 1b
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/aacf380485f64dd38f1c5ad130327634

# In[2]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Money and the Money Market: LC3 HOA #2a',
                                           MacroJS='../../JS/Macro_1Board.js',
                                           JS='MMMLC3_SallyScenario2.js',
                                           OutputFile='MMMLC3_SallyScenario2.html',
                                           studioPaths=False 
                                          )


# In[3]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        \n    </head>\n\n    <body>\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:350px; height:300px; float:left; border: solid #1f628d 2px;\'></div>        \n            <div id=\'jxgbox2\' class=\'jxgbox\' style=\'width:350px; height:300px; margin-left: 375px; border: solid #1f628d 2px;\'></div>\n        </div>\n        \n        <script type="text/javascript" src="../../JS/Macro_1Board.js"></script>\n        <script type="text/javascript" src="MMMLC3_SallyScenario2.js"></script>\n    </body>\n</html>')


# ### Generate HTML File

# In[4]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



