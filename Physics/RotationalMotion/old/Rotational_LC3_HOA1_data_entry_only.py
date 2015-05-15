
# coding: utf-8

# #### Torque Experiment
# https://studio.edge.edx.org/container/i4x://DavidsonX/APPY003/vertical/4b24278bd4814da8856c45056c11448b

# In[1]:

import pandas as pd
pd.options.display.max_colwidth = 200


# In[30]:

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

### Pandas "to_html" does not have an "id" kwarg https://github.com/pydata/pandas/issues/8496
def df_to_html_with_id(df, id, *args, **kwargs):
    s = df.to_html(*args, **kwargs)
    return s[:7] + 'id="%s" ' % id + s[7:]

active_table = pd.DataFrame(data=questionTable[1::][:],columns=questionTable[0][:])

### Code for creating input cells - also used for creation of the responseTable
for col in active_table.columns:
    for row in active_table[col].index:
        if active_table.ix[row,col] == 'NUMERIC_RESPONSE':
            ID = str(row)+'___'+str(col).replace(' ','')
            s = '<input type="text" id="%s" class="Active" size="10px" placeholder ="input"></input>' % (ID)
            active_table.ix[row,col] = s
                     
active_table = df_to_html_with_id(active_table,'myActiveTable',index=False)
active_table = active_table.replace('&lt;','<').replace('&gt;','>')
#active_table = active_table.replace('NUMERIC_RESPONSE','<input class="Active" type="text" size="10px"></input>')
print active_table


# In[50]:

from IPython.display import HTML

### HTML
html_doc = """
    <html>
        <head>
            <style type="text/css">
            <!-- Table syling: http://www.textfixer.com/html/html-table-generator.php -->
            <!-- CSS_STYLING -->
            </style>

        </head>
        <body>
            
            <!-- ACTIVE_TABLE -->
            
            <!-- COMMENT: Buttons below are used to add debugging features to an interactive. Console logging allows you to see
            output within a browser's console. Try reading about Chrome's console. -->
        
            <!--START-BUTTON FOR PASS STATE-->
            <!-- COMMENT: Buttons below are used to add debugging features to an interactive. Conole logging allows you to see
                output within a browser's console. Try reading about Chrome's console. -->

            <input class="btn" type="button" value="Pass State for Grading" onClick="getState()">
            <input class="btn" type="button" value="Set State" onClick="setState(getState())">
            <div id="spaceBelow">State:</div>
            <!--END-BUTTON FOR PASS STATE-->
        
            <script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
            <script type='text/javascript'>
            <!-- JAVASCRIPT_ROUTINES -->
            </script>
            
        </body>
    </html>
"""

#### CSS
css_style = """ 
    body {
        margin: 10px;
    }
    
    
    input[type="text"] {
        font-size: 18px;
    }
    
    input[type="text"].placeholder {
        color   : Gray;
        border  : 1px;
        padding : 0 10px;
        margin  : 0;
    }
    
    input[type="text"]:focus {
        color:RoyalBlue;
        this.value = '';
    }
    
    .dataframe  {font-size:18px;color:#333333;width:100%;border-width: 1px;border-color: #729ea5;border-collapse: collapse;}
    .dataframe  th {font-size:18px;background-color:#acc8cc;border-width: 1px;padding: 8px;border-style: solid;border-color: #729ea5;text-align:left;}
    .dataframe  tr {background-color:#d4e3e5;}
    .dataframe  td {font-size:18px;border-width: 1px;padding: 8px;border-style: solid;border-color: #729ea5;}
    .dataframe  tr:hover {background-color:#ffffff;}
    
    
"""

### Javascript for passing to grader
jscript = """
    //Standard edX JSinput functions
    getState = function(){
        state = getInput();
        statestr = JSON.stringify(state);        
        
        //START-PASS STATE TO IPYTHON KERNEL    
        document.getElementById('spaceBelow').innerHTML += '<br>'+statestr;
        var command = "state = '" + statestr + "'";
        //console.log(command);
        
        var kernel = IPython.notebook.kernel;
        kernel.execute(command);
        //END-PASS STATE TO IPYTHON KERNEL
        
        return statestr;
    }
    
    getInput = function() {
        var data = {};
        data['response'] = {};
        
        //Colors
        data['colors'] = {};
        
        var cells = document.getElementsByClassName('Active');
        for (i=0;i<cells.length;i++) {
            data['response'][cells[i].id] = cells[i].value;
            data['colors'][cells[i].id] = 'white';
        }
        //console.log(data);
        return data;
    }

    setState = function(statestr){
        state = JSON.parse(statestr);
        
        for (ID in state['response']) {
            //console.log(state['response'][ID]);
            console.log(statestr);
            document.getElementById(ID).value = state['response'][ID];
            document.getElementById(ID).style.backgroundColor = state['colors'][ID];
        }
    }


"""

### Final form
html_doc = html_doc.replace('<!-- CSS_STYLING -->',css_style)
html_doc = html_doc.replace('<!-- ACTIVE_TABLE -->',active_table)
html_doc = html_doc.replace('<!-- JAVASCRIPT_ROUTINES -->',jscript)

HTML(html_doc)


# ## Grader

# In[54]:

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
                    
#             ### Check for Active Cell
#             if cellType == 'NUMERIC_RESPONSE':
#                 ID = returnID(i,header[j])
#                 ### Test that ID is in passed answer from edX
#                 if ID in response:
#                     #print i,j,header[j],ID,answerTable[i][j]
#                     ### Compare Responses to Key
#                     if not stringComparison(response[ID],answerTable[i][j]):
#                         #print "Incorrect"
#                         state['colors'][ID] = 'LightPink'
#                     else:
#                         numCorrects = numCorrects + 1
    
    if numCorrects == len(response.keys()):
        return {'ok': True, 'msg':'Great job!'}
    else:
        return {'ok': False, 'msg': 'You have %s cells out of %s correct.' % (str(numCorrects),str(len(response.keys()))) }

print grader('what',state)


# ####HTML Generation

# In[55]:

import re

tmpfile = html_doc
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'Rotational_LC3_HOA1'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[ ]:



