
# coding: utf-8

# ###HTML Interactive Area

# In[12]:

get_ipython().run_cell_magic(u'HTML', u'', u'<html>\n    <head>\n        <meta charset="UTF-8">\n        <title>Phillips Curve Activity</title>\n        <link href="template_t1.0.css" rel="stylesheet" type="text/css">\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type="text/javascript" src="Macro.js" defer></script>\n        \n        <script type="text/javascript" src="template_1.0.js" defer></script>\n    </head>\n\n    <body> \n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:550px; height:450px; float:left; border: solid #1f628d 2px;\'></div>        \n        </div>\n    </body>\n</html>')


# ### Export HTML File

# In[ ]:

import re
### Finds the HMTL cell by searching through IPython inputs
index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'src="/Users/dseaton/Dropbox/Davidson/Interactives/DNextInteractives/JS/Macro.js"','src="/static/Macro.js"',tmpfile,flags=re.DOTALL)

filename = 'Phillips_LC3_HOA1_slide4_v3.0'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
# print tmpfile

