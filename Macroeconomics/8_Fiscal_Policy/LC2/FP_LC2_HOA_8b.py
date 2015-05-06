
# coding: utf-8

# ###Fiscal Policy - LC2 HOA 8a
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/53de12c80b4844a6b43d425fa9f225bc

# In[1]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Fiscal Policy: LC2 HOA #8b',
                                           MacroJS='../../JS/Macro_1Board.js',
                                           JS='FP_LC2_HOA_8b.js',
                                           OutputFile='FP_LC2_HOA_8b.html',
                                           studioPaths=False 
                                          )


# ### HTML Interactive Cell

# In[2]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n    </head>\n\n    <body>\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getGrade();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <script type="text/javascript" src="../../JS/jschannel.js"></script>\n        <script type="text/javascript" src="../../JS/edxintegration.js"></script>\n        <script type="text/javascript" src="../../JS/Macro_1Board.js"></script>\n        <script type="text/javascript" src="FP_LC2_HOA_8b.js"></script>\n    </body>\n</html>')


# ### Python Grading

# In[11]:

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
    
    if abs(deltaSRASX) > 0.1 or abs(deltaSRASY) > 0.1:
        return {'ok': False, 'msg': 'Incorrect. Please rethink your solution.'}
    
    if deltaADX < 0 and deltaADY < 0:
        if abs(deltaADX) > 0.5 or abs(deltaADY) > 0.5:
            return {'ok': True, 'msg': 'Good job.'}
        elif abs(deltaADX) < 0.1 and abs(deltaADY) < 0.1:
            return {'ok': False, 'msg': 'Unable to discern size of shift. Try shifting frather from original position.'}
    elif deltaADX > 0 or deltaADY > 0:
        return {'ok': False, 'msg': 'Incorrect. Please rethink your solution.'}
    else:
        return {'ok': False, 'msg': 'Something is wrong with you solution. Have you shifted any of the draggable curves?'}

print grader("huh?",state)


# ### Generate HTML File

# In[13]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



