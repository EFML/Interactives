
# coding: utf-8

# #### Torque Experiment
# https://studio.edge.edx.org/container/i4x://DavidsonX/APPY003/vertical/4b24278bd4814da8856c45056c11448b

# #### Create the HTML Table using Python's Pandas Library
# Two cells below are only for initial generation of the Active Table. The table is saved to file, then referenced in the following cells.

# In[16]:

import sys
import pandas as pd
pd.options.display.max_colwidth = 200
sys.path.insert(0, '../../Python')
import ActiveTable

ACTIVETABLE_HTML_FILENAME = 'Rotational_LC3_HOA1_plotting.html'


# In[23]:

### Active Table
Numeric = 'NUMERIC_RESPONSE'
questionTable = [
        ['Mass of Falling Object<br>M(kg)','Distance Object Fall<br>D(m)',
         'Times for Fall<br>t(s)','Calculated Average Acceleration of Falling Object<br>a(m/s^2)',
         'Calculated Tension in String<br>T(N)', 'Calculated Torque Exerted on Post of Apparatus<br>T*D(m*N)'],
        ['0.100','0.500','9.7, 10.0, 10.3','0.010',Numeric,Numeric],
        ['0.150','0.500','6.9, 7.1, 7.3','0.020',Numeric,Numeric],
        ['0.200','0.500','5.8, 5.7, 5.6','0.031',Numeric,Numeric],
        ['0.250','0.500','4.9, 4.9, 4.8','0.042',Numeric,Numeric],
    ]

responseTable = questionTable

answerTable = [
        ['Mass of Falling Object<br>M(kg)','Distance Object Fall<br>D(m)',
         'Times for Fall<br>t(s)','Calculated Average Acceleration of Falling Object<br>a(m/s^2)',
         'Calculated Tension in String<br>T(N)', 'Calculated Torque Exerted on Post of Apparatus<br>T*D(m*N)'],
        ['0.100','0.500','9.7, 10.0, 10.3','0.010',0.96,0.0011],
        ['0.150','0.500','6.9, 7.1, 7.3','0.020',1.47,0.0016],
        ['0.200','0.500','5.8, 5.7, 5.6','0.031',1.95,0.0021],
        ['0.250','0.500','4.9, 4.9, 4.8','0.042',2.44,0.0027],
    ]

# print questionTable[0][:]

AT = ActiveTable.ActivteTable().create(questionTable[1::][:],questionTable[0][:])

with open(ACTIVETABLE_HTML_FILENAME,'w') as hfile:
    hfile.write(AT)
# print AT


# ### HTML 
# Below is the main HTML file. We piece together CSS, JS, and external resources from alternate files.

# In[22]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Momentum Activity</title>\n        <link href="Rotational_LC3_HOA1_plotting.css" rel="stylesheet" type="text/css">\n        <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full"></script>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="https://code.jquery.com/jquery.min.js"></script>\n        <script type="text/javascript" src="Rotational_LC3_HOA1_plotting.js"></script>\n        \n        <script> \n        $(function(){\n          $("#ActiveTable").load("Rotational_LC3_HOA1_plotting.html"); \n        });\n        </script> \n        \n    </head>\n\n    <body>\n        <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:400px; float:left; border: solid #1f628d 2px;\'></div>        \n        <div id="ActiveTable"></div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <input class="btn" type="button" value="Pass State for Grading" onClick="getState()">\n        <div id="spaceBelow">State:</div>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <input class="btn" type="button" value="Plot Data" onClick="points = plotData()">\n        <input class="btn" type="button" value="Clear Board" onClick="brd1 = initBoard()">\n        <input class="btn" type="button" value="Best Fit Line" onClick="toggleFitLine">\n    </body>\n</html>')


# In[19]:




# In[ ]:




# ## Grader

# In[10]:

import json        
def grader(e, ans):
    state = json.loads(ans)#['answer']
    response = state['response']
    colors = state['colors']
    #return {'ok': False, 'msg': '%s' % str(response)}
    
    Numeric = 'NUMERIC_RESPONSE'
    questionTable = [
        ['Mass of Falling Object<br>M(kg)','Distance Object Fall<br>D(m)',
         'Times for Fall<br>t(s)','Calculated Average Acceleration of Falling Object<br>a(m/s^2)',
         'Calculated Tension in String<br>T(N)', 'Calculated Torque Exerted on Post of Apparatus<br>T*D(m*N)'],
        ['0.100','0.500','9.7, 10.0, 10.3','0.010',Numeric,Numeric],
        ['0.150','0.500','6.9, 7.1, 7.3','0.020',Numeric,Numeric],
        ['0.200','0.500','5.8, 5.7, 5.6','0.031',Numeric,Numeric],
        ['0.250','0.500','4.9, 4.9, 4.8','0.042',Numeric,Numeric],
    ]

    answerTable = [
        ['Mass of Falling Object<br>M(kg)','Distance Object Fall<br>D(m)',
         'Times for Fall<br>t(s)','Calculated Average Acceleration of Falling Object<br>a(m/s^2)',
         'Calculated Tension in String<br>T(N)', 'Calculated Torque Exerted on Post of Apparatus<br>T*D(m*N)'],
        ['0.100','0.500','9.7, 10.0, 10.3','0.010',0.96,0.0011],
        ['0.150','0.500','6.9, 7.1, 7.3','0.020',1.47,0.0016],
        ['0.200','0.500','5.8, 5.7, 5.6','0.031',1.95,0.0021],
        ['0.250','0.500','4.9, 4.9, 4.8','0.042',2.44,0.0027],
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

print grader('what',state)


# ####HTML Generation

# In[80]:

import re

tmpfile = html_doc
# tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'Rotational_LC3_HOA1_plotting'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[ ]:



