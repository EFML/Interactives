
# coding: utf-8

# ### Money and the Money Market
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/17b6d950461e4d3ab8c27ff55795e395

# In[11]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Money and the Money Market: LC2 HOA #1',
                                           MacroJS='../../JS/Macro_1Board.js',
                                           JS='MMMLC2_Activity1.js',
                                           OutputFile='MMMLC2_Activity1.html',
                                           studioPaths=False 
                                          )


# ###HTML Interactive Area

# In[5]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        \n    </head>\n\n    <body>\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getGrade();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <script type="text/javascript" src="../../JS/jschannel.js"></script>\n        <script type="text/javascript" src="../../JS/edxintegration.js"></script>\n        <script type="text/javascript" src="../../JS/Macro_1Board.js"></script>\n        <script type="text/javascript" src="MMMLC2_Activity1.js"></script>\n    </body>\n</html>')


# ### Python Grading

# In[9]:

import json        
def grader(e, ans):
    state = json.loads(ans)#['answer']
    print len(state)

    if state['C1'] == 'red':
        return {'ok': True, 'msg': 'Good job.'}
    elif state['C1'] == 'Gray' and state['C2'] == 'Gray' and state['C3'] == 'Gray':
        return {'ok': False, 'msg': 'Are you sure you have selected a curve? If so, please refresh your browser and try again.'}
    else:
        return {'ok': False, 'msg': 'Please rethink your solution - explanation.'}

print grader('what is this?',state)


# ### Generate HTML File

# In[10]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



