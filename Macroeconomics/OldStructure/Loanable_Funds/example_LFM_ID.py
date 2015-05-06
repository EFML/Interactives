
# coding: utf-8

# In[1]:

from IPython.display import HTML


# ###Macroeconomics - Phillips Curve
# https://edge.edx.org/courses/DavidsonCollege/DAP002/2014/courseware/e8e30d44ee1a44268de4968dbc364642/43299eb8bd584086aef887739dd86768/

# In[4]:

get_ipython().run_cell_magic(u'HTML', u'', u'\n<!DOCTYPE html>\n<html>\n    <head>\n        <style> \n            body {\n                margin: 10px;\n                /*padding-top: 40px;*/\n            }\n        </style>\n    </head>\n\n    <body>\n        \n        \n        <div style="width: 100%; overflow: hidden;">\n            <div id=\'jxgbox1\' class=\'jxgbox\' style=\'width:350px; height:300px; float:left; border: solid #1f628d 2px;\'></div>        \n            <div id=\'jxgbox2\' class=\'jxgbox\' style=\'width:350px; height:300px; margin-left: 375px; border: solid #1f628d 2px;\'></div> \n        </div>\n\n        \n        <!-- COMMENT: Where our Javascript begins. -->\n        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>\n        <script type=\'text/javascript\'>\n\n            ////////////\n            // BOX 1\n            ////////////\n            bboxlimits = [-2.3, 12, 12, -1.3];\n            var brd1 = JXG.JSXGraph.initBoard(\'jxgbox1\', {axis:false, \n                                                    showCopyright: false,\n                                                    showNavigation: false,\n                                                    zoom: false,\n                                                    pan: false,\n                                                    boundingbox:bboxlimits,\n                                                    grid: false,\n                                                    hasMouseUp: true, \n            });\n            \n            xaxis = brd1.create(\'axis\', [[0, 0], [11, 0]], {withLabel: false});\n            yaxis = brd1.create(\'axis\', [[0, 0], [0, 11]], {withLabel: false});\n\n            //Axes\n            xaxis.removeAllTicks();\n            yaxis.removeAllTicks();\n            var xlabel = brd1.create(\'text\',[-2,10,"Real<br>Interest<br>Rate"],{fixed:true});\n            var ylabel = brd1.create(\'text\',[4,-0.5,"Quantity of Loanable Funds"],{fixed:true});\n            \n            ////////////\n            // BOX 2\n            ////////////\n\n            var brd2 = JXG.JSXGraph.initBoard(\'jxgbox2\', {axis:false, \n                                                    showCopyright: false,\n                                                    showNavigation: false,\n                                                    zoom: false,\n                                                    pan: false,\n                                                    boundingbox:bboxlimits,\n                                                    grid: false,\n                                                    hasMouseUp: true, \n            });\n            \n            xaxis = brd2.create(\'axis\', [[0, 0], [11, 0]], {withLabel: false});\n            yaxis = brd2.create(\'axis\', [[0, 0], [0, 11]], {withLabel: false});\n\n            //Axes\n            xaxis.removeAllTicks();\n            yaxis.removeAllTicks();\n            var xlabel = brd2.create(\'text\',[-2,10,"Real<br>Interest<br>Rate"],{fixed:true});\n            var ylabel = brd2.create(\'text\',[6.5,-0.5,"Investment $"],{fixed:true});\n            \n            //Define Objects\n            createDragLine = function(board,point1,point2,gname,color,xo,yo){\n                return board.create(\'segment\',[point1,point2],{strokeColor:color,strokeWidth:\'3\',name:gname,\n                                            withLabel:true,label:{offset:[xo,yo]}});\n            }\n\n            \n            var cS1 = [1.0,2.0];\n            var cS2 = [9.0,10.0];\n            var S1 = brd1.create(\'point\',cS1,{withLabel:false,visible:false});\n            var S2 = brd1.create(\'point\',cS2,{withLabel:false,visible:false});\n            var Supply = createDragLine(brd1,S1,S2,\'S\',\'Orange\',100,100);\n            \n            var cD1 = [1.0,10.0];\n            var cD2 = [9.0,2.0];\n            var D1 = brd1.create(\'point\',cD1,{withLabel:false,visible:false});\n            var D2 = brd1.create(\'point\',cD2,{withLabel:false,visible:false});\n            var Demand = createDragLine(brd1,D1,D2,\'D\',\'Blue\',100,-100);\n            // Demand.setAttribute({\'fixed\':true});\n            \n            var cID1 = [1.0,10.0];\n            var cID2 = [9.0,2.0];\n            var ID1 = brd2.create(\'point\',cID1,{withLabel:false,visible:false});\n            var ID2 = brd2.create(\'point\',cID2,{withLabel:false,visible:false});\n            var Invest = createDragLine(brd2,ID1,ID2,\'Investment Demand\',\'Crimson\',-100,100);\n            Invest.setAttribute({\'fixed\':true});\n                     \n            ////////\n            // Intersection Box 1\n            ////////\n            var iSD = brd1.create(\'intersection\', [Supply, Demand, 0], {visible:false});    \n            \n            ////////////\n            // Dashes in Box 1\n            ////////////\n            var dashB1Yp1 = brd1.create(\'point\',[0, iSD.Y()],{withLabel:false,visible:false});\n            var dashB1Yp2 = brd1.create(\'point\',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});\n            var dashB1Y1 = brd1.create(\'segment\',[dashB1Yp1,dashB1Yp2],{straightFirst:false, straightLast:false,\n                                                                           strokeColor:\'gray\',strokeWidth:\'2\',\n                                                                           dash:\'1\',fixed:true}\n                                  );\n\n            var dashB1Xp1 = brd1.create(\'point\',[iSD.X(), 0],{withLabel:false,visible:false});\n            var dashB1Xp2 = brd1.create(\'point\',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});\n            var dashB1X1 = brd1.create(\'segment\',[dashB1Xp1,dashB1Xp2],{straightFirst:false, straightLast:false,\n                                                                           strokeColor:\'gray\',strokeWidth:\'2\',\n                                                                           dash:\'1\',fixed:true}\n                                  );\n            \n            \n            ////////////\n            // Dashes in Box 2\n            ////////////            \n            \n            //DYNAMIC SET\n            var dashB2Yp1 = brd2.create(\'point\',[0, iSD.Y()],{withLabel:false,visible:false});\n            var dashB2Yp2 = brd2.create(\'point\',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});\n            var dashB2Y2 = brd2.create(\'segment\',[dashB2Yp1,dashB2Yp2],{straightFirst:false, straightLast:false,\n                                                                           strokeColor:\'DarkGray\',strokeWidth:\'2\',\n                                                                           dash:\'1\',fixed:true}\n                                  );\n\n            var dashB2Xp1 = brd2.create(\'point\',[iSD.X(), 0],{withLabel:false,visible:false});\n            var dashB2Xp2 = brd2.create(\'point\',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});\n            var dashB2X2 = brd2.create(\'segment\',[dashB2Xp1,dashB2Xp2],{straightFirst:false, straightLast:false,\n                                                                           strokeColor:\'DarkGray\',strokeWidth:\'2\',\n                                                                           dash:\'1\',fixed:true}\n                                  );\n            \n            \n            //STATIC SET\n            var dashYstaticp21 = brd2.create(\'point\',[0, iSD.Y()],{withLabel:false,visible:false});\n            var dashYstaticp22 = brd2.create(\'point\',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});\n            var dashYstatic2 = brd2.create(\'segment\',[dashYstaticp21,dashYstaticp22],{straightFirst:false, straightLast:false,\n                                                                           strokeColor:\'LightGray\',strokeWidth:\'2\',\n                                                                           dash:\'1\',fixed:true}\n                                  );\n\n            var dashXstaticp21 = brd2.create(\'point\',[iSD.X(), 0],{withLabel:false,visible:false});\n            var dashXstaticp22 = brd2.create(\'point\',[iSD.X(), iSD.Y()],{withLabel:false,visible:false});\n            var dashXstatic2 = brd2.create(\'segment\',[dashXstaticp21,dashXstaticp22],{straightFirst:false, straightLast:false,\n                                                                           strokeColor:\'LightGray\',strokeWidth:\'2\',\n                                                                           dash:\'1\',fixed:true}\n                                  );\n            \n            ////////\n            // Intersections Box 2\n            ////////\n            var iIDy = brd2.create(\'intersection\', [dashB2Y2, Invest, 0], {visible:false});\n            \n            \n            //////////\n            // Connect Boards and Movement\n            //////////\n            \n            brd1.addChild(brd2);\n            \n            brd1.on(\'move\', function(){\n                    \n                //Dashed Lines 1\n                dashB1Yp1.moveTo([0, iSD.Y()]);\n                dashB1Yp2.moveTo([iSD.X(), iSD.Y()]);\n\n                dashB1Xp1.moveTo([iSD.X(), 0]);\n                dashB1Xp2.moveTo([iSD.X(), iSD.Y()]);\n\n                //Dashed Lines 2\n                dashB2Yp1.moveTo([0, iSD.Y()]);\n                dashB2Yp2.moveTo([iIDy.X(), iSD.Y()]);\n\n                dashB2Xp1.moveTo([iIDy.X(), 0]);\n                dashB2Xp2.moveTo([iIDy.X(), iSD.Y()]);\n            });\n            \n            //Standard edX JSinput functions\n            getInput = function(){\n                state = {"dragLine":{\'p1X\':dragLine.point1.X(),\'p2X\':dragLine.point2.X(),\n                                     \'p1Y\':dragLine.point1.Y(),\'p2Y\':dragLine.point2.Y()},\n                         "staticLine":{\'p1X\':staticLine.point1.X(),\'p2X\':staticLine.point2.X(),\n                                       \'p1Y\':staticLine.point1.Y(),\'p2Y\':staticLine.point2.Y()}};\n                statestr = JSON.stringify(state);\n                console.log(statestr)\n                \n                //IPython Notebook Considerations\n                document.getElementById(\'spaceBelow\').innerHTML += \'<br>\'+statestr;\n                var command = "state = \'" + statestr + "\'";\n                console.log(command);\n\n                //Kernel\n                var kernel = IPython.notebook.kernel;\n                kernel.execute(command);\n\n                return statestr;\n            }\n\n            getState = function(){\n                state = {\'input\': JSON.parse(getInput())};\n                statestr = JSON.stringify(state);\n                return statestr\n            }\n\n            setState = function(statestr){\n                $(\'#msg\').html(\'setstate \' + statestr);\n                state = JSON.parse(statestr);\n                console.log(statestr);\n                console.debug(\'State updated successfully from saved.\');\n            }\n            \n            \n        </script>\n    </body>\n</html>')


# In[28]:

def grader(e, ans):
    import json
    answer = json.loads(ans)

    def dist1D(xf,xi):
        #print xf,xi,xf-xi
        return xf-xi

    delta = dist1D(answer['dragLine']['p1Y'],answer['staticLine']['p1Y'])
    if delta > 0:
        if delta > 0.5:
            return {'ok': True, 'msg': 'Good job.'}
    elif delta < 0:
        return {'ok': False, 'msg': 'Please rethink your solution - explanation.'}
    else:
        return {'ok': False, 'msg': 'Something wrong.'}


# In[44]:

grader('what',state)


# ### Save HTML

# In[4]:

# def findHTMLInputCell(**kwargs):
#     specify

### Currently have to use the input ?variables from iPython (little blue numbers next to each cell) 
### - you can look at the list by type _i and hitting tab. _ih contains all the current input.

import re

#tmpfile = _i86
index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]

tmpfile = eval('_i%d' % int(index_htmlinput[-1]))
tmpfile = re.sub('%%HTML','',tmpfile)
tmpfile = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',tmpfile,flags=re.DOTALL)
tmpfile = re.sub(r'//START-PASS STATE TO IPYTHON KERNEL(.*?)//END-PASS STATE TO IPYTHON KERNEL','',tmpfile,flags=re.DOTALL)

filename = 'example_LFM_ID'
html_filename = '%s.html' % filename

with open(html_filename,'w') as hfile:
    hfile.write(tmpfile)
print tmpfile


# In[ ]:



