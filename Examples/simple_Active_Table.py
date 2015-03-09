
# coding: utf-8

# #### Simple Chart Fill

# In[1]:

import pandas as pd
pd.options.display.max_colwidth = 100


# In[2]:

### Pandas "to_html" does not have an "id" kwarg https://github.com/pydata/pandas/issues/8496
def df_to_html_with_id(df, id, *args, **kwargs):
    s = df.to_html(*args, **kwargs)
    return s[:7] + 'id="%s" ' % id + s[7:]

def creaetPandasTable(inputDF,inputType):
    if inputType == 'list':
        active_table = pd.DataFrame(data=inputDF[1::][:],columns=inputDF[0][:])
    elif inputType == 'excel':
        active_table = pd.read_excel(inputDF,'Sheet1')
        
    ### Code for creating input cells - also used for creation of the responseTable
    for col in active_table.columns:
        for row in active_table[col].index:
            if active_table.ix[row,col] == 'NUMERIC_RESPONSE':
                ID = str(row)+'___'+str(col).replace(' ','')
                s = '<input id="%s" class="Active" size="10px"></input>' % (ID)
                active_table.ix[row,col] = s
    
    #Add ID to Table
    active_table = df_to_html_with_id(active_table,'myActiveTable',index=False)
    #Clean up formatting
    active_table = active_table.replace('&lt;','<').replace('&gt;','>')
    
    return active_table


# In[3]:

### Active Table
Numeric = 'NUMERIC_RESPONSE'    

questionTable = [
        ['Points','X','Y'],
        ['a',Numeric,Numeric],
        ['b',Numeric,Numeric],
        ['c',Numeric,Numeric],
        ['d',Numeric,Numeric],
    ]

# questionTable = [
#         ['Points','X','Y'],
#         ['a',1,1.1],
#         ['b',2.1,1.9],
#         ['c',3.0,3.15],
#         ['d',3.9,4.1],
#     ]

active_table = creaetPandasTable(questionTable,inputType='list')
print active_table




# In[4]:

from IPython.display import HTML

### HTML
html_doc = """
<!DOCTYPE html>
    <html>
        <head>
            <style> 
                <!-- CSS_STYLING -->
            </style>
        </head>
        <body>
            
            
            
            <!-- COMMENT: Buttons below are used to add debugging features to an interactive. Console logging allows you to see
            output within a browser's console. Try reading about Chrome's console. -->
        
            <!-- Jxg Box -->
            <div style="width: 100%; overflow: hidden;">
                
                <div id='DataTable' style='width:350px; float:left;'>        
                    <!-- ACTIVE_TABLE -->
                
                    <input class="btn" type="button" value="Plot Data" onClick="plotData()">
                    <input class="btn" type="button" value="Best Fit" onClick="bestFitLine(points)">
                    <input class="btn" type="button" value="Grab Table Data" onClick="getState()">
                    <div id="spaceBelow">State:</div>
                </div>
                <div id='jxgbox1' class='jxgbox' style='width:350px; height:300px; margin-left: 375px; border: solid #1f628d 2px;'></div>
        
            </div>
        
            <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>
        
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
        
        //Colors
        //data['colors'] = {};
        
        var cells = document.getElementsByClassName('Active');
        for (i=0;i<cells.length;i++) {
            data['response'][cells[i].id] = cells[i].value;
            //data['colors'][cells[i].id] = 'white';
        }
        console.log(data);
        return data;
    }

    bboxlimits = [-2, 12, 12, -2];
    var board = JXG.JSXGraph.initBoard('jxgbox1', {boundingbox: bboxlimits, axis:true, showCopyright:false});
    state = {};
    points = [];

    plotData = function() {
        points = [];
    
        var rows = Array.prototype.slice.call(document.getElementById("myActiveTable").getElementsByTagName("tr"));
        rows.shift();
        for(r in rows) {
            //Read somewhere that innerText does not generalize to Firefox - likely can simplify below
            var datum = {
                'name':rows[r].cells[0].id,
                'x':rows[r].cells[1].children[0].value, 
                'y':rows[r].cells[2].children[0].value
//                 'name':rows[r].cells[0].id,
//                 'x':Number(rows[r].cells[1].innerText || rows[r].cells[1].innerHTML), 
//                 'y':Number(rows[r].cells[2].innerText || rows[r].cells[2].innerHTML)
            
            };

            var p = board.create('point',[datum['x'],datum['y']],{name:datum['name'],fixed:true});
            points.push(p);
        }
    }
    
    var bestFitLine = function(points) {
        if (points.length < 0) {
            return alert("No data entered in table.");
        }
        
        var ydata = [];
        var xdata = [];
        for (i=0;i<points.length;i++) {
            ydata.push(points[i].Y());
            xdata.push(points[i].X());
        }
        
        console.log(ydata);
        
        var fit = linearRegression(ydata,xdata);
        
        var graph = board.create('functiongraph',
                       [function(x){ return fit['slope']*x + fit['intercept'];}, -1, 9],
                       {name:'Best Fit','strokeWidth':'2'}
                    );
        
    }


    function linearRegression(y,x){
        //http://trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/
        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;
        
        for (var i = 0; i < y.length; i++) {
            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i]*y[i]);
            sum_xx += (x[i]*x[i]);
            sum_yy += (y[i]*y[i]);
        } 
    
        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
        lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

        return lr;
    }

"""

### Final form
html_doc = html_doc.replace('<!-- CSS_STYLING -->',css_style)
html_doc = html_doc.replace('<!-- ACTIVE_TABLE -->',active_table)
html_doc = html_doc.replace('<!-- JAVASCRIPT_ROUTINES -->',jscript)

HTML(html_doc)


# In[5]:




# In[58]:

import re

#tmpfile = _i86
# index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

# tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
# tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = html_doc
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'simple_Active_Table'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[ ]:




# In[ ]:




# In[ ]:




# In[ ]:




# In[ ]:



