
# coding: utf-8

# #### Momentum Hands-On Activity
# https://docs.google.com/document/d/1NBBPpMUNzLL2BL-pZbwbB8rYaJxIzQGvDUIz_KDQi0I/edit

# #Step 1:  Create an HTML Table with input cells
# 
# ### Active Table using Python's Pandas
# An Active Table is simply an html table with editable input cells. We want to provide data entry tools in a spreadsheet like format, but prototypes are constrained to just light data input and cell grading. Below is the first iteration of this functionality.
# 
# We use Pandas to quickly create HTML tables from structure data. Pandas is a data analysis tool for Python whose data are stored in dataframes - spreadsheet like data structures with references to rows and columns. Pandas has an option "to_html" that quickly creates html tables with custom elements.
# 
# * Integrating the Active Table creation via Pandas is not a part of the desired JSinput workflow. See grading section for more on how to merge this functionality with JSinput.
# 
# Related files:
#     * ActiveTable.py

# In[2]:

import sys
import pandas as pd
pd.options.display.max_colwidth = 200
import ActiveTable

ACTIVETABLE_HTML_FILENAME = 'ActiveTable_Momentum_4.3.2a.html'


# In[9]:

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

### Write ActiveTable to file
with open(ACTIVETABLE_HTML_FILENAME,'w') as hfile:
    hfile.write(AT)
print AT


# #Step 2: Create an HTML that embeds the Active Table
# 
# ### HTML 
# Below is the main HTML file. We piece together CSS, JS, and external resources from alternate files.
# 
# *Note, all code between the "\<!--START-BUTTON FOR PASS STATE--\>" and "\<!--END-BUTTON FOR PASS STATE--\>" tags is specific to this IPython workflow. We use this feature to combine python grading and HTML/CSS/JS development. 

# In[4]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Momentum Activity</title>\n        <link href="Momentum_4_3_2a.css" rel="stylesheet" type="text/css">\n        <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full"></script>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="https://code.jquery.com/jquery.min.js"></script>\n        <script type="text/javascript" src="Momentum_4_3_2a.js"></script>\n        \n        <script> \n        $(function(){\n          $("#ActiveTable").load("ActiveTable_Momentum_4.3.2a.html"); \n        });\n        </script> \n        \n    </head>\n\n    <body>\n        <div id="ActiveTable"></div>\n    \n        <!--START-BUTTON FOR PASS STATE-->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getInput();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!--END-BUTTON FOR PASS STATE-->\n    </body>\n</html>')


# Note, we are passing values and background colors for input cells. Right now, we only grade values and report the number of correct cells. In the future, we would like to change the background color to light red to indicate incorrect values.

# #Step 3: Create Studio ready HTML File
# 
# The general idea is to make it easy to upload an HTML file for JSinput in Studio. The below code reads the input from the "%%HTML" magic cell, then removes aspects related to IPython, and updates paths to JS/CSS files.

# Routines that:
#     remove "IPython" specifics
#     creaet necessary links for Studio (/static/)
#     
# *** Has the /static/ folder been depricated?

# In[10]:

import re

index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]
tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'href="Momentum_4.3.2a.css"','href="/static/Momentum_4.3.2a.css"',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'src="Momentum_4.3.2a.js"','src="/static/Momentum_4.3.2a.js"',tmpfile,flags=re.DOTALL)

html_filename = 'Momentum_4.3.2a.html'
with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)

print tmpfile


# #Step 4: Grade Coding inside the IPython Notebook
# 
# 
# ### Python Grading within an IPython Notebook
# IPython notebooks allow access to both HTML elements and Interactive Python. With a short command, we can pass HTML input to the IPython kernel. These commands are written in the JS code: src="Momentum_4.3.2a.js"
# 
# ### In order for grading to work, you have to use the "Get State" button underneath the Active Table

# In[7]:

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
            #print 100.*abs(abs(float(R) - float(K))/float(K))
            return 100.*abs(abs(float(R) - float(K))/float(K)) <= percent_tolerance
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
            #print R,K
            return numericalComparison(R,K,percent_tolerance=1.0)
            #return stringComparison(R,K)
        elif cellType == 'STRING_RESPONSE':
            return stringComparison(R,K)
                
    
    ### GRADING LOOP
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


# #Step 5: Get everything into studio
# 1. Upload "html" file from Step 3
# 2. Upload relative JSS/CS files used in the HTML file
# 3. Create JSinput problem in Studio
# 4. Copy and Paste python grading code into custom resonse section of JSinput problem
# 5. Uncomment "answer" in first line of grading code
#     * state = json.loads(ans)#['answer']     ->      state = json.loads(ans)['answer']

# In[ ]:




# In[ ]:




# In[ ]:



