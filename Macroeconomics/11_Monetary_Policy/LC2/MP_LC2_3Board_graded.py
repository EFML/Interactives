
# coding: utf-8

# ###Monetary Policy LC2 - 3 Board (suggestion from Sally and Brian Held)
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/5e27cf18f81d49af84d152950b919eff

# In[1]:

import sys
import re
sys.path.append('../../Python')

import templateGenerator
reload(templateGenerator)
tGen = templateGenerator.templateGenerator(course_id='DavidsonCollege/DAP002/3T2014',
                                           Title='Prototype 3 Board',
                                           MacroJS='../../JS/Macro_3Board.js',
                                           JS='MP_LC2_3Board_graded.js',
                                           OutputFile='MP_LC2_3Board_graded.html',
                                           studioPaths=False 
                                          )


# In[5]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title></title>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        \n    </head>\n\n    <body>\n        <div style="width: 750;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:250px; height:240px; float:left; border: solid #1f628d 2px;\'></div>        \n            <div id=\'jxgbox2\' class=\'jxgbox\' style=\'width:250px; height:240px; float:left; margin-left: 10px; border: solid #1f628d 2px;\'></div>\n            <div id=\'jxgbox3\' class=\'jxgbox\' style=\'width:250px; height:240px; float:left; margin-left: 10px; border: solid #1f628d 2px;\'></div>\n        </div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getGrade();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <script type="text/javascript" src="../../JS/jschannel.js"></script>\n        <script type="text/javascript" src="../../JS/edxintegration.js"></script>\n        <script type="text/javascript" src="../../JS/Macro_3Board.js"></script>\n        <script type="text/javascript" src="MP_LC2_3Board_graded.js"></script>\n    </body>\n</html>')


# ###Python Grading

# In[3]:

import json   

def grader(e, ans):
    answer = json.loads(ans)#['answer']
    #return {'ok': False, 'msg': '%s' % str(answer)}
    
    print answer
    if not answer['sliderB1'] and not answer['sliderB2'] and not answer['sliderB3']:
        return {'ok': False, 'msg': 'Error grading interactive. Please contact Davidson Next.'}
    
    sliderValues = [answer['sliderB1'],answer['sliderB2'],answer['sliderB3']]
    boards = ['Board 1', 'Board 2', 'Board 3']
    corrects = [False, False, False]
    
    for i,s in enumerate(sliderValues):
        if s > 1.1:
            corrects[i] = True            
    
    errmsg = 'You have errors in: '
    for i,c in enumerate(corrects):
        if c == False:
            errmsg += boards[i]
            if i != len(corrects)-1:
                errmsg += ',  '
    
    if len([c for c in corrects if c==True])==3:
        return {'ok': True, 'msg': 'Good job.'}
    else:
        return {'ok': True, 'msg': errmsg}
    
print grader("huh?",state)


# ### Generate HTML File

# In[4]:

# reload(templateGenerator)
inputCell = eval('_i%d' % tGen.findIPythonHTMLCell(_ih))
htmlFile = tGen.scrapeHTMLfromIPython(inputCell)
tGen.writeOutputFile(htmlFile)


# In[ ]:



