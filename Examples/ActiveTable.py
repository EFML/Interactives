
# coding: utf-8

# ### Active Tables
# Allow students to input values into a table, each of which is graded.

# In[1]:

import pandas as pd
pd.options.display.max_colwidth = 100


# ### Potential Generalized Functions

# In[2]:

(/Grading, Functions)
(/START-PASS, STATE, TO, IPYTHON, KERNEL)
passState = function(){
    var state = {'f1':f1.getAttribute('strokeColor'),'f2':f2. getAttribute('strokeColor')};
    statestr = JSON.stringify(state);
    document.getElementById('spaceBelow').innerHTML += '<br>'+statestr;
    var command = "state = '" + statestr + "'";
    console.log(command);

    var kernel = IPython.notebook.kernel;
    kernel.execute(command);

    return statestr
}

(/END-PASS, STATE, TO, IPYTHON, KERNEL)


# In[3]:

Numeric = 'NUMERIC_RESPONSE'

questionTable = [
        ['Last name','First name','Birth Year'],
        ['Obama','Barack',Numeric],
        ['Bush','George',Numeric],
        ['Clinton','William',Numeric],
    ]

# header = questionTable.pop(0)
# print pd.DataFrame(data=answerTable,columns=header).to_html(index=False)

answerTable = [
        ['Last name','First name','Birth Year'],
        ['Obama','Barack',1961],
        ['Bush','George',1946],
        ['Clinton','William',1946],
    ]

table =  pd.DataFrame(data=questionTable[1::][:],columns=questionTable[0][:])
print table
html_table = table.to_html(index=False).replace('NUMERIC_RESPONSE','<input size="10px"></input>')
print html_table
# print pd.DataFrame(data=answerTable[1::][:],columns=answerTable[0][:])


# In[4]:

from IPython.display import HTML

input_form = html_table

HTML(input_form)


# ###Grading

# In[5]:

def overallGrader(e, ans):
    return {'ok': True, 'msg': 'Good job!'}

import json
answer = json.loads(state)
    
if answer['f1'] == 'red' and answer['f2'] == 'DarkGrey':
    print {'ok': True, 'msg': 'Good job.'}
else:
    print {'ok': False, 'msg': 'Something wrong.'}


# In[ ]:




# In[5]:

from IPython.display import HTML

### HTML
html_doc = """
    <html>
        <head>
            <style> 
                <!-- CSS_STYLING -->
            </style>
        </head>
        <body>
            
            <!-- ACTIVE_TABLE -->
            
            <!-- COMMENT: Buttons below are used to add debugging features to an interactive. Console logging allows you to see
            output within a browser's console. Try reading about Chrome's console. -->
        
            <input class="btn" type="button" value="Grab Table Data" onClick="getState()">
            <div id="spaceBelow">State:</div>
        
            <script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
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
"""

### Active Table
import pandas
Numeric = 'NUMERIC_RESPONSE'
questionTable = [
        ['Last name','First name','Birth Year'],
        ['Obama','Barack',Numeric],
        ['Bush','George',Numeric],
        ['Clinton','William',Numeric],
    ]

answerTable = [
        ['Last name','First name','Birth Year'],
        ['Obama','Barack',1],
        ['Bush','George',2],
        ['Clinton','William',3],
    ]

### Pandas "to_html" does not have an "id" kwarg https://github.com/pydata/pandas/issues/8496
def df_to_html_with_id(df, id, *args, **kwargs):
    s = df.to_html(*args, **kwargs)
    return s[:7] + 'id="%s" ' % id + s[7:]

active_table = pd.DataFrame(data=questionTable[1::][:],columns=questionTable[0][:])

for col in active_table.columns:
    for row in active_table[col].index:
        if active_table.ix[row,col] == 'NUMERIC_RESPONSE':
            ID = str(row)+'___'+str(col).replace(' ','')
            s = '<input id="%s" class="Active" size="10px"></input>' % (ID)
            active_table.ix[row,col] = s
            

# print active_table
            
active_table = df_to_html_with_id(active_table,'myActiveTable',index=False)
active_table = active_table.replace('&lt;','<').replace('&gt;','>')
#active_table = active_table.replace('NUMERIC_RESPONSE','<input class="Active" type="text" size="10px"></input>')


### Javascript for passing to grader
jscript = """
    //Standard edX JSinput functions
    setState = function(){
        return 'None';
    }

    getState = function(){
        state = getInput();
        statestr = JSON.stringify(state);
        
        document.getElementById('spaceBelow').innerHTML += '<br>'+statestr;
        var command = "state = '" + statestr + "'";
        console.log(command);

        //Kernel
        var kernel = IPython.notebook.kernel;
        kernel.execute(command);
        
        return statestr;
    }
    
    getInput = function() {
        var data = {};
        data['response'] = {};
        data['colors'] = {};
        var cells = document.getElementsByClassName('Active');
        for (i=0;i<cells.length;i++) {
            data['response'][cells[i].id] = cells[i].value;
            data['colors'][cells[i].id] = 'white';
        }
        console.log(data);
        return data;
    }

"""

### Final form
html_doc = html_doc.replace('<!-- CSS_STYLING -->',css_style)
html_doc = html_doc.replace('<!-- ACTIVE_TABLE -->',active_table)
html_doc = html_doc.replace('<!-- JAVASCRIPT_ROUTINES -->',jscript)

HTML(html_doc)


# In[36]:

import json
    
def grader(e, ans):
    answer = json.loads(ans)['response']
    #return {'ok': False, 'msg': '%s' % str(answer)}
    
    if answer['0___BirthYear'] and answer['1___BirthYear'] and answer['2___BirthYear']:
        if int(answer['0___BirthYear'])==1 and int(answer['1___BirthYear'])==2 and int(answer['2___BirthYear'])==3:
            return {'ok': True, 'msg': 'Good job.'}
        else:
            return {'ok': False, 'msg': 'Something wrong.'}
    else:
        return {'ok': False, 'msg': 'All responses not logged.'}
    
# print grader('what',state)


# In[ ]:




# In[ ]:




# In[35]:

import re

#tmpfile = _i86
# index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

# tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
# tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = html_doc
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'Active_Table'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[9]:

print html_doc


# In[ ]:



