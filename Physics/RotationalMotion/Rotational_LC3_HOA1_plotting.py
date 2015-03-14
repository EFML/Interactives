
# coding: utf-8

# #### Torque Experiment
# https://studio.edge.edx.org/container/i4x://DavidsonX/APPY003/vertical/4b24278bd4814da8856c45056c11448b

# In[1]:

import pandas as pd
pd.options.display.max_colwidth = 200


# In[2]:

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


# In[8]:

from IPython.display import HTML

### HTML
html_doc = """
    <!DOCTYPE HTML>
    <html>
        <head>
            <style type="text/css">
            <!-- Table syling: http://www.textfixer.com/html/html-table-generator.php -->
            <!-- CSS_STYLING -->
            </style>

        </head>
        <body>
            
            <div id='jxgbox1' class='jxgbox' style='width:600px; height:500px; float:left; border: solid #1f628d 2px;'></div>        
            
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
            
            <input class="btn" type="button" value="Plot Data" onClick="points = plotData()">
            <input class="btn" type="button" value="Clear Board" onClick="brd1 = initBoard()">
            <input class="btn" type="button" value="Best Fit Line" onClick="toggleFitLine()">
        
            <script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
            <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>

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
        font-size: 12px;
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
        var state={};
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
        var i;
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
        var ID='',state={};
        state = JSON.parse(statestr);
        
        for (ID in state['response']) {
            //console.log(state['response'][ID]);
            console.log(statestr);
            document.getElementById(ID).value = state['response'][ID];
            document.getElementById(ID).style.backgroundColor = state['colors'][ID];
        }
    }

    
    ////////////
    // BOARD 1
    ////////////
    
    var bboxlimits = [-0.05, 10, 0.35, -1]
    
    function initBoard() {
        var board,xlabel,ylabel;
        
        //JXG.JSXGraph.freeBoard(board);
        
        board = JXG.JSXGraph.initBoard('jxgbox1', {axis:true, 
                                                showCopyright: false,
                                                showNavigation: false,
                                                zoom: false,
                                                pan: false,
                                                boundingbox:bboxlimits,
                                                grid: false,
                                                hasMouseUp: true, 
        });

        //Axis Labels
        var ylabel = board.create('text',[-0.04,9,"Torque<br>T*D (N*m)"],{fixed:true});
        var xlabel = board.create('text',[0.3,-0.6,"Mass, M (kg)"],{fixed:true});
    
        return board;
    }
    
    var brd1 = initBoard();
    var showBestFit = true;
    
    function plotData() {        
        brd1 = initBoard();
        var XCol = 0,
            YCol = 5, //Input Field
            table = document.getElementById("myActiveTable"),
            cells = table.getElementsByTagName('td'),
            x=0, y=0, i=0,points=[],params=[]; //

        for (i = 0; i < cells.length; i += 6) {
            x = cells[i+XCol].innerHTML;
            y = cells[i+YCol].getElementsByTagName('input')[0].value;
        
            if (x.length > 0 && y.length > 0) {
                var p = brd1.create('point',[Number(x),Number(y)],{fixed:true, label:{offset:[0,-15]}});
                points.push(p);
            }
        }
        
        params = bestFitLine(points);
        return points;
    }

    bestFitLine = function(points) {
        if (points.length < 0) {
            return alert("No data entered in table.");
        }
        
        var ydata = [];
        var xdata = [];
        for (i=0;i<points.length;i++) {
            ydata.push(points[i].Y());
            xdata.push(points[i].X());
        }
            
        var fit = linearRegression(ydata,xdata);
        console.log(fit);
        brd1.create('functiongraph',
                       [function(x){ return fit['slope']*x + fit['intercept'];}, bboxlimits[0], bboxlimits[2]],
                       {name:'Best Fit','strokeWidth':'2'}
                    );
        return fit;
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



