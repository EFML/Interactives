
# coding: utf-8

# #### Momentum Hands-On Activity
# https://docs.google.com/document/d/1NBBPpMUNzLL2BL-pZbwbB8rYaJxIzQGvDUIz_KDQi0I/edit

# ### Active Table using Python's Pandas
# An Active Table is simply an html table with editable cells. We want to provide data entry tools in a spreadsheet like format. Below is the first iteration of this functionality.
# 
# Pandas is a data analysis tool for Python whose data are stored in dataframes - spreadsheet like data structures with references to rows and columns. The power of Pandas is the ability to export dataframes, one option which is "to_html". We use this feature to quickly create html tables with custom elements.

# In[2]:

import sys
import pandas as pd
pd.options.display.max_colwidth = 200
sys.path.insert(0, '../../Python')
import ActiveTable

ACTIVETABLE_HTML_FILENAME = 'ActiveTable_Momentum_4.3.2a.html'


# In[14]:

reload(ActiveTable)

### Active Table
Numeric = 'NUMERIC_RESPONSE'
questionTable = [
        ['Carts','v_initial','v_final','Delta v'],
        ['green','2.0','-1.2',Numeric],
        ['red','-2.0','1.2',Numeric],
    ]

answerTable = [
        ['Carts','v_initial','v_final','Delta v'],
        ['green','2.0','-1.2','-3.2'],
        ['red','-2.0','1.2','3.2'],
    ]

print questionTable[0][:]

AT = ActiveTable.ActivteTable().create(questionTable[1::][:],questionTable[0][:])

with open(ACTIVETABLE_HTML_FILENAME,'w') as hfile:
    hfile.write(AT)
print AT


# ### HTML 
# Below is the main HTML file. We piece together CSS, JS, and external resources from alternate files.

# In[15]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Momentum Activity</title>\n        <link href="Momentum_4.3.2a.css" rel="stylesheet" type="text/css">\n        <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full"></script>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="https://code.jquery.com/jquery.min.js"></script>\n        <script type="text/javascript" src="Momentum_4.3.2a.js"></script>\n        \n        <script> \n        $(function(){\n          $("#ActiveTable").load("ActiveTable_Momentum_4.3.2a.html"); \n        });\n        </script> \n        \n    </head>\n\n    <body>\n        <div id="ActiveTable"></div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <input class="btn" type="button" value="Pass State for Grading" onClick="getState()">\n        <input class="btn" type="button" value="Set State" onClick="setState(getState())">\n        <div id="spaceBelow">State:</div>\n        <!--END-BUTTON FOR PASS STATE-->\n    </body>\n</html>')


# In[22]:

import re

index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]
tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)

html_filename = 'Momentum_4.3.2a.html'
with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)

# print tmpfile


# ### Python Grading within an IPython Notebook
# IPython notebooks allow access to both HTML elements and Interactive Python. With a short command, we can pass HTML input to the IPython kernel. These commands are written in the JS code: src="Momentum_4.3.2a.js"

# In[20]:

import json        
def grader(e, ans):
    state = json.loads(ans)#['answer']
    response = state['response']
    colors = state['colors']
    #return {'ok': False, 'msg': '%s' % str(response)}
    
    Numeric = 'NUMERIC_RESPONSE'
    questionTable = [
        ['Carts','v_initial','v_final','Delta v'],
        ['green','2.0','-1.2',Numeric],
        ['red','-2.0','1.2',Numeric],
    ]

    answerTable = [
        ['Carts','v_initial','v_final','Delta v'],
        ['green','2.0','-1.2','-3.2'],
        ['red','-2.0','1.2','3.2'],
    ]
    
    ### Must remove header for comparison in loop below
    ### JQuery takes cells without a header, so i,j values must only be fore table body.
    answerTable = answerTable[1::]

    def stringComparison(R,K):
        '''
        R: Response from student
        K: Answer from (K)ey
        '''
        if str(R)==str(K):
            return True
        else:
            return False
    
    def testNumeric(X):
        '''
        X: entry taken from Active Table
        '''
        try:
            float(X)
            return True
        except:
            return False
    
    def numericalComparison(R,K,**kwargs):
        '''
        R: Response from student 
        K: Answer from (K)ey
        tolerance: percentage tolerance allowed in numerical response
            *** Implement edX tolerance: https://github.com/edx/edx-platform/blob/dbc465a51871bd685dd925c23bf73b981e07abe6/common/lib/capa/capa/util.py#L14
            Currently Calculated:  return 100.*abs(student - instructor)/instructor <= tolerance
        '''
        percent_tolerance = kwargs.get('percent_tolerance',1.0)
        
        if testNumeric(R) and testNumeric(K):
            return 100.*abs(float(R) - float(K))/float(K) <= percent_tolerance
        else:
            #print "Issue with grading rubric. Could not convert Response to float."
            return False
    
    def returnID(row,column):
        return str(row)+'___'+str(column).replace(' ','')
    
    def feedback(cellType,R,K):
        '''
        cellType: type of cell input, options are [NUMERIC_RESPONSE,STRING_RESPONSE]
        R: short-hand for student Response Value
        K: short-hand for answer Key Value
        '''
        if cellType == 'NUMERIC_RESPONSE':
            return numericalComparison(R,K,percent_tolerance=5.0)
            #return stringComparison(R,K)
        elif cellType == 'STRING_RESPONSE':
            return stringComparison(R,K)
                
    
    ### Loop through question Table and use indices to check answer table
    header = questionTable[0]
    numCorrects = 0
    for i,row in enumerate(questionTable[1::]):
        for j,cellType in enumerate(row):
            ID = returnID(i,header[j])
            #print i,j,header[j],ID,answerTable[i][j]
            
            ### Check for Existent Active Cell
            if ID in response:
                ### Compare answer key and contents of cell
                if feedback(cellType, response[ID], answerTable[i][j]):
                    numCorrects = numCorrects + 1
                else:
                    state['colors'][ID] = 'LightPink'
    
    if numCorrects == len(response.keys()):
        return {'ok': True, 'msg':'Great job!'}
    else:
        return {'ok': False, 'msg': 'You have %s cells out of %s correct.' % (str(numCorrects),str(len(response.keys()))) }

print grader('what is this?',state)


# In[ ]:



