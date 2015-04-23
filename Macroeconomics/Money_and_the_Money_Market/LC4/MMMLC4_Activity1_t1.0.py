
# coding: utf-8

# ###Scenario 1, Question 1

# In[17]:

get_ipython().run_cell_magic(u'HTML', u'', u'<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Phillips Curve Activity</title>\n        <link href="MMMLC4_Activity1_t1.0.css" rel="stylesheet" type="text/css">\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="../../JS/Macro_t1.0.js" defer></script>\n        \n        <script type="text/javascript" src="MMMLC4_Activity1_t1.0.js" defer></script>\n    </head>\n\n    <body> \n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:550px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <!-- ------------------------------------------------------------------------------- -->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getInput();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!-- ------------------------------------------------------------------------------- -->\n        <!--END-BUTTON FOR PASS STATE-->\n        \n    </body>\n</html>')


# ### Python Grading

# In[170]:

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

# In[169]:

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
tmpfile = re.sub('src="MMMLC4_Activity1_t1.0.js"','src="/c4x/DavidsonCollege/DAP002/asset/MMMLC4_Activity1_t1.0.js"',tmpfile,flags=re.DOTALL)
tmpfile = re.sub('src="MMMLC4_Activity1_t1.0.css"','src="/c4x/DavidsonCollege/DAP002/asset/MMMLC4_Activity1_t1.0.css"',tmpfile,flags=re.DOTALL)


### Would be cool if it just took the title of the notebook
html_filename = 'MMMLC4_Activity1_t1.0' + '.html'

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[10]:

from os import path
path.dirname('src="MMMLC3_Activity2_t1.0.js"')


# In[ ]:



