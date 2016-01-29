
# coding: utf-8

# ###Prototype 3 Board

# In[1]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Prototype 3 Board',
                                           MacroJS='../../JS/Macro_1Board.js',
                                           JS='prototype.js',
                                           OutputFile='prototype.html',
                                           studioPaths=False 
                                          )


# In[29]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        \n    </head>\n\n    <body>\n        <div style="width: 750; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:250px; height:200px; float:left; border: solid #1f628d 2px;\'></div>        \n            <div id=\'jxgbox2\' class=\'jxgbox\' style=\'width:250px; height:200px; float:left; margin-left: 10px; border: solid #1f628d 2px;\'></div>\n            <div id=\'jxgbox3\' class=\'jxgbox\' style=\'width:250px; height:200px; float:left; margin-left: 10px; border: solid #1f628d 2px;\'></div>\n        </div>\n        \n        <div style="width: 750; overflow: hidden;">\n            <div id=\'jxgbox4\' class=\'jxgbox\' style=\'width:250px; height:200px; float:left; margin-top: 10px; border: solid #1f628d 2px;\'></div>        \n            <div id=\'jxgbox5\' class=\'jxgbox\' style=\'width:250px; height:200px; float:left; margin-left: 10px; margin-top: 10px; border: solid #1f628d 2px;\'></div>\n            <div id=\'jxgbox6\' class=\'jxgbox\' style=\'width:250px; height:200px; float:left; margin-left: 10px; margin-top: 10px; border: solid #1f628d 2px;\'></div>\n        </div>\n        \n        <script type="text/javascript" src="Macro_6Board.js"></script>\n        <script type="text/javascript" src="prototype.js"></script>\n    </body>\n</html>')


# ### Generate HTML File

# In[30]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



