
# coding: utf-8

# ###Moving to Long-Run Equilibrium
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/ee567d7e52294aeaa8a32cd1c3f09cf3?action=new

# In[11]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Moving Toward Long-Run Equilibrium</title>\n        <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full"></script>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="underscore-min.js"></script>\n        <script type="text/javascript" src="jquery.min.js"></script>\n        <script type="text/javascript" src="jquery-ui.min.js"></script>\n        \n    </head>\n\n    <body>\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getInput();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <script type="text/javascript" src="../../JS/Macro_t1.0.js"></script>\n        <script type="text/javascript" src="MLE_LC2_HOA_1b_graded.js"></script>\n    </body>\n</html>')


# ### Grading

# In[14]:

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
    
    if deltaSRASX > 0 and deltaSRASY < 0:
        if abs(deltaSRASX) > 0.5 or abs(deltaSRASY) > 0.5:
            return {'ok': True, 'msg': 'Good job.'}
        elif abs(deltaSRASX) > 0.1 and abs(deltaSRASY) > 0.1:
            return {'ok': False, 'msg': 'Unable to discern size of shift. Try shifting frather from original position.'}
    elif deltaSRASX < 0 or deltaSRASY > 0:
        return {'ok': False, 'msg': 'Incorrect. Please rethink your solution.'}
    else:
        return {'ok': False, 'msg': 'Something is wrong with you solution. Have you shifted any of the draggable curves?'}

# import json   

# def dist1D(xf,xi):
#     #print xf,xi,xf-xi
#     return xf-xi
    
# def grader(e, ans):
#     answer = json.loads(ans)['answer']
    
#     ### For edX
#     #answer = json.loads(json.loads(ans)['answer'])
#     #return {'ok': False, 'msg': '%s' % str(answer)}
    
#     delta = dist1D(answer['dragLine']['p1Y'],answer['staticLine']['p1Y'])
    
#     if delta > 0:
#         if delta > 0.5:
#             return {'ok': True, 'msg': 'Good job.'}
#     elif delta < 0:
#         return {'ok': False, 'msg': 'Please rethink your solution - explanation.'}
#     else:
#         return {'ok': False, 'msg': 'Something wrong with you solution. Be sure you are shifting the Orange line with your mouse.'}
    
print grader("huh?",state)




# ### Generate HTML File

# In[26]:

import re
from os import path

### Find the HTML cell within the IPython inputs
index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)

### Remove IPython specific commands
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

### Replace relative links with the appropriate edX links
# tmpfile = re.sub(r'src="../../JS/Macro_t1.0.js"','src="/c4x/DavidsonCollege/DAP002/asset/Macro_t1.0.js"',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(path.dirname("../../JS/Macro_t1.0.js"),'/c4x/DavidsonCollege/DAP002/asset',tmpfile,flags=re.DOTALL)

### Specific Files
tmpfile = re.sub('src="MLE_LC2_HOA_1b_graded.js"','src="/c4x/DavidsonCollege/DAP002/asset/MLE_LC2_HOA_1b_graded.js"',tmpfile,flags=re.DOTALL)
tmpfile = re.sub('src="MLE_LC2_HOA_1b_graded.css"','src="/c4x/DavidsonCollege/DAP002/asset/MLE_LC2_HOA_1b_graded.css"',tmpfile,flags=re.DOTALL)


### Would be cool if it just took the title of the notebook
html_filename = 'MLE_LC2_HOA_1b_graded' + '.html'

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[142]:

s = '{\"answer\":{\"dragLine\":{\"p1X\":1,\"p2X\":9,\"p1Y\":10,\"p2Y\":2},\"staticLine\":{\"p1X\":1,\"p2X\":9,\"p1Y\":10,\"p2Y\":2}}}'
print json.loads(s)['answer']
print state


# In[143]:

s = '"{\"answer\":{\"dragLine\":{\"p1X\":1,\"p2X\":9,\"p1Y\":10,\"p2Y\":2},\"staticLine\":{\"p1X\":1,\"p2X\":9,\"p1Y\":10,\"p2Y\":2}}}"'


# In[144]:

json.loads(state)


# In[145]:

print str(str(state))


# In[ ]:



