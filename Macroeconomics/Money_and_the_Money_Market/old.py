
# coding: utf-8

# ### Money & The Money Market -  Activity 1

# In[3]:

get_ipython().run_cell_magic(u'HTML', u'', u'\n<!DOCTYPE html>\n<html>\n    <head>\n        <style> \n            body {\n                margin: 10px;\n                /*padding-top: 40px;*/\n            }\n        </style>\n    </head>\n\n    <body>\n        <!-- COMMENT: Define the jxgbox - aka, where all the interactive graphing will go. -->\n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:450px; height:350px; float:left; border: solid #1f628d 2px;\'></div>\n        </div>\n        \n        <!-- COMMENT: Where our Javascript begins. -->\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type=\'text/javascript\'>\n\n            JXG.Options.point.showInfobox = false;\n        \n            bboxlimits = [-1.1, 12, 12, -1.1];\n            var board = JXG.JSXGraph.initBoard(\'jxgbox1\', {axis:false, \n                                                    showCopyright: false,\n                                                    showNavigation: false,\n                                                    zoom: false,\n                                                    pan: false,\n                                                    boundingbox:bboxlimits,\n                                                    grid: false,\n                                                    hasMouseUp: true, \n            });\n            \n            xaxis = board.create(\'axis\', [[0, 0], [12, 0]], {withLabel: true, name: "b=?", label: {offset: [320,-20]}});\n            yaxis = board.create(\'axis\', [[0, 0], [0, 12]], {withLabel: true, name: "a=?", label: {offset: [-60,260]}});\n\n            //Axes\n            xaxis.removeAllTicks();\n            yaxis.removeAllTicks();\n            var ylabel = board.create(\'text\',[-1.0,10,"a=?"],{fixed:true,fontsize:18,highlight:false});\n            var xlabel = board.create(\'text\',[9,-0.5,"b=?"],{fixed:true,fontsize:18,highlight:false});\n            \n            //Define Segments\n            var xi1 = 2.0\n            var yi1 = 10.0\n            var xi2 = 10.0\n            var yi2 = 2.0\n            var f1 = board.create(\'point\',[xi1,yi1],{withLabel:false,visible:false});\n            var f2 = board.create(\'point\',[xi2,yi2],{withLabel:false,visible:false});\n            \n            //AD1\n            var Curve = board.create(\'segment\',[f1,f2],{strokeColor:\'Blue\',strokeWidth:\'3\',\n                                                      name:\'c=?\',withLabel:true,\n                                                      fixed:true,highlight:false,\n                                                      label:{fontSize:20,color:\'Black\',highlight:false,offset:[125,-85]}});\n            \n            \n            \n        </script>\n    </body>\n</html>')


# ###Ungraded

# In[14]:

import re

#tmpfile = _i86
index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'AD_Label_Graph'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[ ]:



