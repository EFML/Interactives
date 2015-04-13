
# coding: utf-8

# ###HTML Interactive Area

# In[3]:

get_ipython().run_cell_magic(u'HTML', u'', u'<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Money and the Money Market - Activity 2</title>\n        <link href="MMM_Activity3_t1.0.css" rel="stylesheet" type="text/css">\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="../../JS/Macro_t1.0.js" defer></script>\n        \n        <script type="text/javascript" src="MMMLC2_Activity3_t1.0.js" defer></script>\n    </head>\n\n    <body> \n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:550px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        \n        <div class="line">\n            <input class="btn" type="button" value="Fall in Money Demand" onClick="increaseXY()">\n            <input class="btn" type="button" value="Rise in Money Demand" onClick="decreaseXY()">\n            <input class="btn" type="button" value="Reset" onClick="resetAnimation()">\n        </div>\n        \n        <!--START-BUTTON FOR PASS STATE-->\n        <!-- ------------------------------------------------------------------------------- -->\n        <div id=\'StateGrab\' style=\'width:350px; float:left;\'>        \n            <input class="btn" type="button" value="Get State" onClick="getNotebookState()">\n            <div id="spaceBelow">State:</div>\n        </div>\n        <script type="text/javascript">\n            getNotebookState = function(){\n                state = getInput();\n                statestr = JSON.stringify(state);\n\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = " + statestr;\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n        </script>\n        <!-- ------------------------------------------------------------------------------- -->\n        <!--END-BUTTON FOR PASS STATE-->\n        \n    </body>\n</html>')


# ### Generate HTML File

# In[4]:

import re

### Find the HTML cell within the IPython inputs
index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)

### Remove IPython specific commands
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

### Replace relative links with the appropriate edX links
tmpfile = re.sub(r'src="../../js/Macro_t1.0.js"','src="/c4x/DavidsonCollege/DAP002/asset/Macro_t1.0.js"',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'src="MMM_Activity3_t1.0.js"','src="/c4x/DavidsonCollege/DAP002/asset/MMM_Activity3_t1.0.js"',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'href="MMM_Activity3_t1.0.css"','src="/c4x/DavidsonCollege/DAP002/asset/MMM_Activity3_t1.0.css"',tmpfile,flags=re.DOTALL)

### Would be cool if it just took the title of the notebook
html_filename = 'MMMLC2_Activity3' + '.html'

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[ ]:



