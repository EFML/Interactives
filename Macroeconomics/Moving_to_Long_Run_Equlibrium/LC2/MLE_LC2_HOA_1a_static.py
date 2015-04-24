
# coding: utf-8

# ###Moving to Long-Run Equilibrium
# https://studio.edge.edx.org/container/i4x://DavidsonCollege/DAP002/vertical/ee567d7e52294aeaa8a32cd1c3f09cf3?action=new

# In[26]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Moving Toward Long-Run Equilibrium</title>\n        <link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="underscore-min.js"></script>\n        <script type="text/javascript" src="jquery.min.js"></script>\n        <script type="text/javascript" src="jquery-ui.min.js"></script>\n    </head>\n    <body>    \n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:500px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n        <!--<div class="list-group">\n            <input class="btn" type="button" value="Reset" onClick="resetBoard()">\n        </div>\n        -->\n        <script type="text/javascript" src="../../JS/Macro_t1.0.js"></script>\n        <script type="text/javascript" src="MLE_LC2_HOA_1b_graded.js"></script>\n    </body>\n</html>')


# ### Generate HTML File

# In[13]:

import re
from os import path

### Find the HTML cell within the IPython inputs
index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)

### Remove IPython specific commands
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

### Replace relative links with the appropriate edX links
# tmpfile = re.sub(r'src="../../JS/Macro_t1.0.js"','src="/c4x/DavidsonCollege/DAP002/asset/Macro_t1.0.js"',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(path.dirname("../../JS/Macro_t1.0.js"),'/c4x/DavidsonCollege/DAP002/asset',tmpfile,flags=re.DOTALL)

### Specific Files
tmpfile = re.sub('src="MLE_LC2_HOA_1b_graded.js"','src="/c4x/DavidsonCollege/DAP002/asset/MLE_LC2_HOA_1b_graded.js"',tmpfile,flags=re.DOTALL)
tmpfile = re.sub('src="MLE_LC2_HOA_1a_static.css"','src="/c4x/DavidsonCollege/DAP002/asset/MLE_LC2_HOA_1a_static.css"',tmpfile,flags=re.DOTALL)


### Would be cool if it just took the title of the notebook
html_filename = 'MLE_LC2_HOA_1a_static' + '.html'

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[ ]:



