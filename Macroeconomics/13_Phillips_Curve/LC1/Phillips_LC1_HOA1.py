
# coding: utf-8

# ###Phillips Curve
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/7d71dd2ceda9481ca74c36718c81aa59

# In[17]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Phillips Curve: LC1 HOA #1',
                                           MacroJS='../../JS/Macro_1Board.js',
                                           JS='Phillips_LC1_HOA1.js',
                                           OutputFile='Phillips_LC1_HOA1.html',
                                           studioPaths=False 
                                          )


# ### HTML Interactive Cell

# In[24]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        \n    </head>\n\n    <body>\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        \n        <ul class="stack button-group">\n            <li><input class="btn" type="button" value="Reset" onClick="resetAnimation()"></li>\n        </ul>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getGrade();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <script type="text/javascript" src="../../JS/jschannel.js"></script>\n        <script type="text/javascript" src="../../JS/edxintegration.js"></script>\n        <script type="text/javascript" src="../../JS/Macro_1Board.js"></script>\n        <script type="text/javascript" src="Phillips_LC1_HOA1.js"></script>\n    </body>\n</html>')


# ### Python Grading

# In[19]:

import json

def grader(e, ans):
    answer = json.loads(ans)#['answer']
    #return {'ok': False, 'msg': '%s' % str(answer)}

    def dist1D(xf,xi):
        #print xf,xi,xf-xi
        return xf-xi

    delta = dist1D(answer['dragLine']['p1Y'],answer['staticLine']['p1Y'])
    if delta > 0:
        if delta > 0.5:
            return {'ok': True, 'msg': 'Good job.'}
    elif delta < 0:
        return {'ok': False, 'msg': 'Please rethink your solution.'}
    else:
        return {'ok': False, 'msg': 'Something wrong.'}
    
print grader("huh?",state)


# ### Generate HTML File

# In[20]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



