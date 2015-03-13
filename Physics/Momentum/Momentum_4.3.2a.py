
# coding: utf-8

# #### Momentum Hands-On Activity
# https://docs.google.com/document/d/1NBBPpMUNzLL2BL-pZbwbB8rYaJxIzQGvDUIz_KDQi0I/edit

# In[25]:

import sys
import pandas as pd
pd.options.display.max_colwidth = 200
sys.path.insert(0, '../../Python')
import ActiveTable

HTML_FILENAME = 'Momentum_4.3.2a.html'


# In[42]:

reload(ActiveTable)

### Active Table
Numeric = 'NUMERIC_RESPONSE'
questionTable = [
        ['Carts','$$v_initial$$','$$v_final$$','$$\Delta v$$'],
        ['green','2.0','-1.2',Numeric],
        ['red','-2.0','1.2',Numeric],
    ]

answerTable = [
        ['Carts','$$v_initial$$','$$v_final$$','$$\Delta v$$'],
        ['green','2.0','-1.2','-3.2'],
        ['red','-2.0','1.2','0.8'],
    ]

print questionTable[0][:]

AT = ActiveTable.ActivteTable().create(questionTable[1::][:],questionTable[0][:])

with open(HTML_FILENAME,'w') as hfile:
    hfile.write(AT)
print AT


# In[41]:

get_ipython().run_cell_magic(u'HTML', u'', u'<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Momentum Activity</title>\n        <link href="Momentum_4.3.2a.css" rel="stylesheet" type="text/css">\n        <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=AM_HTMLorMML-full"></script>\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="https://code.jquery.com/jquery.min.js"></script>\n        \n        <script> \n        $(function(){\n          $("#ActiveTable").load("Momentum_4.3.2a.html"); \n        });\n        </script> \n        \n    </head>\n\n    <body>\n        <div id="ActiveTable"></div>\n    </body>\n</html>')


# In[ ]:



