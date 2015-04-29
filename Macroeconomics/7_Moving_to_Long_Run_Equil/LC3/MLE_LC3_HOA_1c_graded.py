
# coding: utf-8

# ###Moving to Long-Run Equilibrium
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/ee567d7e52294aeaa8a32cd1c3f09cf3?action=new

# In[1]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Moving Toward Long-Run Equilibrium: LC3 HOA #1c',
                                           MacroJS='../../JS/Macro_1Board.js',
                                           JS='MLE_LC3_HOA_1abc.js',
                                           OutputFile='MLE_LC3_HOA_1c_graded.html',
                                           studioPaths=False 
                                          )


# ###HTML Interactive Cell

# In[4]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Moving Toward Long-Run Equilibrium</title>\n        <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full"></script>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="underscore-min.js"></script>\n        <script type="text/javascript" src="jquery.min.js"></script>\n        <script type="text/javascript" src="jquery-ui.min.js"></script>\n        \n    </head>\n\n    <body>\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getGrade();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <script type="text/javascript" src="../../JS/jschannel.js"></script>\n        <script type="text/javascript" src="../../JS/edxintegration.js"></script>\n        <script type="text/javascript" src="../../JS/Macro_1Board.js"></script>\n        <script type="text/javascript" src="MLE_LC3_HOA_1abc.js"></script>\n    </body>\n</html>')


# ### Grading

# In[5]:

import json   

def dist1D(xf,xi):
    #print xf,xi,xf-xi
    return xf-xi
    
def grader(e, ans):
    answer = json.loads(ans)#['answer']
    #return {'ok': False, 'msg': '%s' % str(answer)}
    
    deltaADX = dist1D(answer['AD2']['p1X'],answer['AD1']['p1X'])
    deltaADY = dist1D(answer['AD2']['p1Y'],answer['AD1']['p1Y'])
    
    deltaSRASX = dist1D(answer['SRAS2']['p1X'],answer['SRAS1']['p1X'])
    deltaSRASY = dist1D(answer['SRAS2']['p1Y'],answer['SRAS1']['p1Y'])
    
    if abs(deltaADX) > 0.1 or abs(deltaADY) > 0.1:
        return {'ok': False, 'msg': 'Incorrect. Please rethink your solution.'}
    
    if deltaSRASX < 0 and deltaSRASY > 0:
        if abs(deltaSRASX) > 0.5 and abs(deltaSRASY) > 0.5:
            return {'ok': True, 'msg': 'Good job.'}
        else:
            return {'ok': False, 'msg': 'Unable to discern size of shift. Try shifting frather from original position.'}
    elif deltaSRASX > 0 or deltaSRASY < 0:
        return {'ok': False, 'msg': 'Incorrect. Please rethink your solution.'}
    else:
        return {'ok': False, 'msg': 'Something is wrong with you solution. Have you shifted any of the draggable curves?'}

print grader("huh?",state)




# ### Generate HTML File

# In[6]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



