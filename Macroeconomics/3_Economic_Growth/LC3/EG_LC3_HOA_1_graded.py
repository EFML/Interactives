
# coding: utf-8

# ###Economic Growth - LC3 HOA 1 multiple parts
# 
# Very similar to Aggregate Supply - LC2 HOA 1a
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/13fb122f2ceb413eba2d7ea6db8a4479

# In[11]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Economic Growth - LC3 HOA 1 multiple parts',
                                           MacroJS='../../JS/MacroAllBoards.js',
                                           JS='EG_LC3_HOA_1_graded.js',
                                           OutputFile='EG_LC3_HOA_1_graded.html',
                                           studioPaths=False 
                                          )


# ### HTML Interactive Cell

# In[36]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n    </head>\n\n    <body>\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getGrade();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        \n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <script type="text/javascript" src="../../JS/jschannel.js"></script>\n        <script type="text/javascript" src="../../JS/edxintegration.js"></script>\n        <script type="text/javascript" src="../../JS/params1Board.js"></script>\n        <script type="text/javascript" src="../../JS/MacroAllBoards.js"></script>\n        <script type="text/javascript" src="EG_LC3_HOA_1_graded.js"></script>\n    </body>\n</html>')


# ### Python Grading

# In[29]:

import json   

def grader(e, ans):
    answer = json.loads(ans)#['answer']
    #return {'ok': False, 'msg': '%s' % str(answer)}
    
    X = answer['LRAS2']['slider']
    
    ### Shift too small
    if abs(X) < 0.25:
        return {'ok': False, 'msg': 'Unable to discern size of shift. Try shifting frather from original position.'}
    
    if X > 0.0:
        return {'ok': True, 'msg': 'Good job.'}
    elif X < 0.0:
        return {'ok': False, 'msg': 'Incorrect. Please rethink your solution.'}
    else:
        return {'ok': False, 'msg': 'Something is wrong with you solution. Have you shifted any of the draggable curves?'}

print grader("huh?",state)


# ### Generate HTML File

# In[30]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



