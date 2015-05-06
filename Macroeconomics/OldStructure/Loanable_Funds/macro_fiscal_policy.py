
# coding: utf-8

# In[1]:

from IPython.display import HTML


# #Macroeconmics - Fiscal Policy
# Taking some themes from the following [youtube video](https://www.youtube.com/watch?v=v4dmUrUqvWs).
# 
# Potential Question: "If taxes are increased, which curve represents the new aggregate demand (AD)?

# In[2]:

get_ipython().run_cell_magic(u'HTML', u'', u'\n<!DOCTYPE html>\n<html>\n    <head>\n        <style> \n            body {\n                margin: 10px;\n                /*padding-top: 40px;*/\n            }\n        </style>\n    </head>\n\n    <body>\n        <!-- COMMENT: Define the jxgbox - aka, where all the interactive graphing will go. -->\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:450px; height:350px; float:left; border: solid #1f628d 2px;\'></div>\n        </div>\n        \n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <!-- COMMENT: Buttons below are used to add debugging features to an interactive. Conole logging allows you to see\n            output within a browser\'s console. Try reading about Chrome\'s console. -->\n        \n        <input class="btn" type="button" value="Pass State for Grading" onClick="passState()">\n        <div id="spaceBelow">State:</div>\n        <!--END-BUTTON FOR PASS STATE-->\n        \n        <!-- COMMENT: Where our Javascript begins. -->\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type=\'text/javascript\'>\n\n            bboxlimits = [-1.1, 12, 12, -1.1];\n            var board = JXG.JSXGraph.initBoard(\'jxgbox1\', {axis:false, \n                                                    showCopyright: false,\n                                                    showNavigation: false,\n                                                    zoom: false,\n                                                    pan: false,\n                                                    boundingbox:bboxlimits,\n                                                    grid: false,\n                                                    hasMouseUp: true, \n            });\n            \n            xaxis = board.create(\'axis\', [[0, 0], [12, 0]], {withLabel: true, name: "Real GDP", label: {offset: [320,-20]}});\n            yaxis = board.create(\'axis\', [[0, 0], [0, 12]], {withLabel: true, name: "Price Level", label: {offset: [-60,260]}});\n\n            //Axes\n            xaxis.removeAllTicks();\n            yaxis.removeAllTicks();\n            var xlabel = board.create(\'text\',[-1,10,"Price<br>Level"],{fixed:true});\n            var ylabel = board.create(\'text\',[9,-0.5,"Real GDP"],{fixed:true});\n            \n            //Define Functions\n            var f1 = board.create(\'functiongraph\', [function(x){ return 10.0/x;},0.01,15], {strokeColor:\'DarkGrey\',strokeWidth:\'3\',name:\'AD1\'});\n            var f1label = board.create(\'text\',[3.5,6,"AD#1"]);\n            var f2 = board.create(\'functiongraph\', [function(x){ return 10.0/(x-1.0)+1.0;},0.01,15], {strokeColor:\'DarkGrey\',strokeWidth:\'3\',name:\'AD2\'});\n            var f2label = board.create(\'text\',[1.0,4.5,"AD#2"]);\n            var f3 = board.create(\'functiongraph\', [function(x){ return Math.exp(0.3*x);},0.01,15], {strokeColor:\'black\',strokeWidth:\'3\',name:\'SRAS\',highlight:false});\n\n            //First set of dashed lines\n            var i13 = board.create(\'intersection\', [f1, f3, 0], {visible:false});\n            var d1 = board.create(\'line\',[[i13.X(), 0],[i13.X(),i13.Y()]],{straightFirst:false, straightLast:false,\n                                                                           strokeColor:\'gray\',strokeWidth:\'2\',\n                                                                           dash:\'1\',fixed:true}\n                                  );\n            var d2 = board.create(\'line\',[[0, i13.Y()],[i13.X(),i13.Y()]],{straightFirst:false, straightLast:false,\n                                                                           strokeColor:\'gray\',strokeWidth:\'2\',\n                                                                           dash:\'1\',fixed:true}\n                                  );\n            \n            //Second set of dashed lines\n            var i23 = board.create(\'intersection\', [f2, f3, 0], {visible:false});\n            var d3 = board.create(\'line\',[[i23.X(), 0],[i23.X(),i23.Y()]],{straightFirst:false, straightLast:false,\n                                                                           strokeColor:\'gray\',strokeWidth:\'2\',\n                                                                           dash:\'1\',fixed:true}\n                                  );\n            var d4 = board.create(\'line\',[[0, i23.Y()],[i23.X(),i23.Y()]],{straightFirst:false, straightLast:false,\n                                                                           strokeColor:\'gray\',strokeWidth:\'2\',\n                                                                           dash:\'1\',fixed:true}\n                                  );\n        \n            \n            f1.on(\'down\', function () {\n                resetColors(f1);\n                resetColors(f2);\n                f1.setAttribute({strokeColor: \'red\',strokeWidth: 4});\n            });\n            \n            f2.on(\'down\', function () {\n                resetColors(f1);\n                resetColors(f2);\n                f2.setAttribute({strokeColor: \'red\',strokeWidth: 4});\n            });\n            \n            resetColors = function(curve) {\n                curve.setAttribute({strokeColor: \'DarkGrey\',strokeWidth: 3});\n            }\n            \n            \n            //Grading Functions\n            \n            //START-PASS STATE TO IPYTHON KERNEL\n            passState = function(){\n                var state = {\'f1\':f1.getAttribute(\'strokeColor\'),\'f2\':f2. getAttribute(\'strokeColor\')};\n                statestr = JSON.stringify(state);\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = \'" + statestr + "\'";\n                console.log(command);\n\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr\n            }\n                \n            //END-PASS STATE TO IPYTHON KERNEL\n            \n            //Standard edX JSinput functions\n            getInput = function(){\n                var state = {\'f1\':f1.getAttribute(\'strokeColor\'),\'f2\':f2. getAttribute(\'strokeColor\')};\n                statestr = JSON.stringify(state);\n                //console.log(statestr);\n                return statestr;\n            }\n\n            getState = function(){\n                state = JSON.parse(getInput());\n                statestr = JSON.stringify(state);\n                // console.log(statestr);\n                return statestr;\n            }\n\n            setState = function(statestr){\n                state = JSON.parse(statestr);\n\n                if (state["f1"]) {\n                    f1.setAttribute({strokeColor: state["f1"],strokeWidth: 4});\n                    f2.setAttribute({strokeColor: state["f2"],strokeWidth: 4});\n                    board.update();\n                }\n                //alert(statestr);\n                console.debug(\'State updated successfully from saved.\');\n            }\n            \n        </script>\n    </body>\n</html>')


# ### Save HTML file
# Removes any IPython Notebook specific functions

# In[17]:

###PYTHON GRADER
import json

def overallGrader(e, ans):
    answer = json.loads(ans)

    if answer['f1'] == 'red' and answer['f2'] == 'DarkGrey':
        return {'ok': True, 'msg': 'Good job.'}
    else:
        return {'ok': False, 'msg': 'Something wrong.'}

print overallGrader('',state)


# In[18]:

# def findHTMLInputCell(**kwargs):
#     specify

### Currently have to use the input ?variables from iPython (little blue numbers next to each cell) 
### - you can look at the list by type _i and hitting tab. _ih contains all the current input.

import re

tmpfile = _i15
tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'macro_fiscal_policy'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
#print tmpfile


# In[19]:

from string import Template
variables = {
    "PYTHON_GRADER": re.sub('print overallGrader('',state)','', _i17, flags=re.DOTALL),
    "HEIGHT":500,
    "WIDTH":450,
    "HTML_FILE":"/static/%s" % (html_filename),
}

problem = Template('''
<problem display_name="webGLDemo">
<script type="loncapa/python">
<![CDATA[

$PYTHON_GRADER

]]>
</script>
  
<p>
Text of the question goes here. Feel free to make it fancier.
</p>
  
<customresponse cfn="overallGrader">
  <jsinput gradefn="getInput"
    get_statefn="getState"
    set_statefn="setState"
    initial_state='{}'
    width="$WIDTH"
    height="$HEIGHT"
    html_file="$HTML_FILE"
    sop="true"/>
</customresponse>
</problem>
''')

problem = problem.substitute(variables)

problem_filename = '%s.problem' % filename

with open(problem_filename,'w') as pfile:
    pfile.write(problem)
#print tmpfile


# In[ ]:



