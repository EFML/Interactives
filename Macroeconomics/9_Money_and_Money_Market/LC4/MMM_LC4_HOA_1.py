
# coding: utf-8

# ###Money and the Money Market - LC4 Activity 1
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/f2addd2f7142454cbac9862b62373d05

# In[1]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Money and the Money Market: LC4 HOA #1',
                                           MacroJS='../../JS/Macro_1Board.js',
                                           JS='MMM_LC4_HOA_1.js',
                                           OutputFile='MMM_LC4_HOA_1.html',
                                           studioPaths=False 
                                          )


# ###HTML Interactive Cell

# In[3]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n    </head>\n\n    <body>\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getInput();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <script type="text/javascript" src="../../JS/jschannel.js"></script>\n        <script type="text/javascript" src="../../JS/edxintegration.js"></script>\n        <script type="text/javascript" src="../../JS/params1Board.js"></script>\n        <script type="text/javascript" src="../../JS/MacroAllBoards.js"></script>\n        <script type="text/javascript" src="MMM_LC4_HOA_1.js"></script>\n    </body>\n</html>')


# ### Python Grading

# In[4]:

import json
def grader(e, ans):
    '''
    Grading shift of macro curve. The M_D curve should shift left.
    '''
#     state = json.loads(json.loads(ans)['answer'])
    state = json.loads(ans)#['answer']
    
    def dist1D(A,B):
        return abs(A-B)
    
    print dist1D(state['MD2']['X1'],state['MD1']['X1'])

    ### First Check Y Direction - should be no shift
    if dist1D(state['MD2']['Y1'],state['MD1']['Y1']) < 1.5:
    
        ### Now Check X Direction - should shift to the left
        if dist1D(state['MD2']['X1'],state['MD1']['X1']) < 20.0:
            return {'ok': False, 'msg': 'Have you tried moving the orange line? If so, please shift by a larger amount.'}
        elif state['MD2']['X1'] < state['MD1']['X1']:
            return {'ok': True, 'msg': 'Good job.'}
        else:
            return {'ok': False, 'msg': 'Please rethink your solution.'}
        
    elif dist1D(state['MD2']['Y1'],state['MD1']['Y1']) > 2.0:
        return {'ok': False, 'msg': 'Please rethink your solution?'}
    else:
        return {'ok': False, 'msg': 'Please rethink your solution.'}

print grader('what is this?',state)


# ### HTML File

# In[5]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[10]:

from os import path
path.dirname('src="MMMLC3_Activity2_t1.0.js"')


# In[ ]:



