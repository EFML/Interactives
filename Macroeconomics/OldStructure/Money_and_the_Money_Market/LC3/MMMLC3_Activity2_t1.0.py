
# coding: utf-8

# ###Scenario 1, Question 1

# In[71]:

get_ipython().run_cell_magic(u'HTML', u'', u'<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Phillips Curve Activity</title>\n        <link href="MMMLC3_Activity2_t1.0.css" rel="stylesheet" type="text/css">\n        <script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full"></script>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="underscore-min.js"></script>\n        <script type="text/javascript" src="jquery.min.js"></script>\n        <script type="text/javascript" src="jquery-ui.min.js"></script>\n        <script type="text/javascript" src="../../JS/Macro_t1.0.js" defer></script>\n        \n        <script type="text/javascript" src="MMMLC3_Activity2_t1.0.js" defer></script>\n    </head>\n\n    <body> \n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:360px; height:300px; float:left; border: solid #1f628d 2px;\'></div>        \n            <div id=\'jxgbox2\' class=\'jxgbox\' style=\'width:360px; height:300px; margin-left: 375px; border: solid #1f628d 2px;\'></div>\n        </div>\n    </body>\n</html>')


# In[72]:

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
tmpfile = re.sub('src="MMMLC3_Activity2_t1.0.js"','src="/c4x/DavidsonCollege/DAP002/asset/MMMLC3_Activity2_t1.0.js"',tmpfile,flags=re.DOTALL)
tmpfile = re.sub('src="MMMLC3_Activity2_t1.0.css"','src="/c4x/DavidsonCollege/DAP002/asset/MMMLC3_Activity2_t1.0.css"',tmpfile,flags=re.DOTALL)


### Would be cool if it just took the title of the notebook
html_filename = 'MMMLC3_Activity2_t1.0' + '.html'

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[10]:

from os import path
path.dirname('src="MMMLC3_Activity2_t1.0.js"')


# In[ ]:



