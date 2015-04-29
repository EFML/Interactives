
# coding: utf-8

# #### Simple Chart Fillin for Macro
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/115f9d36001c4aaea5ba55ae0abe84b5

# In[2]:

import pandas as pd
pd.options.display.max_colwidth = 200


# In[3]:

### Active Table
Numeric = 'NUMERIC_RESPONSE'
questionTable = [
        ['Reserve Ratio','Multiplier','New Demand Deposits','Change in Circulating Currency','Maximum Change in the Money Supply'],
        ['10%',Numeric,Numeric,Numeric,Numeric],
        ['20%',Numeric,Numeric,Numeric,Numeric],
        ['25%',Numeric,Numeric,Numeric,Numeric],
    ]

responseTable = questionTable

answerTable = [
        ['Reserve Ratio','Multiplier','New Demand Deposits','Change in Circulating Currency','Maximum Change in the Money Supply'],
        ['10%',10,30000,-3000,27000],
        ['20%',5,15000,-3000,12000],
        ['25%',4,12000,-3000,9000],
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


# In[9]:

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

# In[6]:

import json        
def grader(e, ans):
    state = json.loads(ans)#['answer']
    response = state['response']
    colors = state['colors']
    #return {'ok': False, 'msg': '%s' % str(response)}
    
    Numeric = 'NUMERIC_RESPONSE'
    questionTable = [
        ['Reserve Ratio','Multiplier','New Demand Deposits','Change in Circulating Currency','Maximum Change in the Money Supply'],
        ['10%',Numeric,Numeric,Numeric,Numeric],
        ['20%',Numeric,Numeric,Numeric,Numeric],
        ['25%',Numeric,Numeric,Numeric,Numeric],
    ]
    
    answerTable = [
        ['Reserve Ratio','Multiplier','New Demand Deposits','Change in Circulating Currency','Maximum Change in the Money Supply'],
        ['10%',10,30000,-3000,27000],
        ['20%',5,15000,-3000,12000],
        ['25%',4,12000,-3000,9000],
    ]
    
    ### Must remove header for comparison in loop below
    ### JQuery takes cells without a header, so i,j values must only be fore table body.
    answerTable = answerTable[1::]

    def stringComparison(R,A):
        '''
        R: Response from edX State
        A: Answer from Key
        '''
        if str(R)==str(A):
            return True
        else:
            return False
    
    def returnID(row,column):
        return str(row)+'___'+str(column).replace(' ','')
    
    
    ### Loop through question Table and use indices to check answer table
    header = questionTable[0]
    numCorrects = 0
    for i,row in enumerate(questionTable[1::]):
        for j,cellValue in enumerate(row):
            ### Check for Active Cell
            if cellValue == 'NUMERIC_RESPONSE':
                ID = returnID(i,header[j])
                ### Test that ID is in passed answer from edX
                if ID in response:
                    #print i,j,header[j],ID,answerTable[i][j]
                    ### Compare Responses to Key
                    if not stringComparison(response[ID],answerTable[i][j]):
                        #print "Incorrect"
                        state['colors'][ID] = 'LightPink'
                    else:
                        numCorrects = numCorrects + 1
    
    if numCorrects == len(response.keys()):
        return {'ok': True, 'msg':'Great job!'}
    else:
        return {'ok': False, 'msg': 'You have %s cells out of %s correct.' % (str(numCorrects),str(len(response.keys()))) }

print grader('what',state)


# ####HTML Generation

# In[11]:

import re

tmpfile = html_doc
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'macro_Active_Table'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[ ]:



