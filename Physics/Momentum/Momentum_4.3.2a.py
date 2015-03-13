
# coding: utf-8

# #### Momentum Hands-On Activity
# https://docs.google.com/document/d/1NBBPpMUNzLL2BL-pZbwbB8rYaJxIzQGvDUIz_KDQi0I/edit

# In[13]:

import sys
import pandas as pd
pd.options.display.max_colwidth = 200
sys.path.insert(0, '../../Python')
import ActiveTable

HTML_FILENAME = 'Momentum_4.3.2a.html'


# In[15]:

reload(ActiveTable)

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

AT = ActiveTable.ActivteTable().create(questionTable[1::][:],questionTable[0][:])

with open(HTML_FILENAME,'w') as hfile:
    hfile.write(AT)
print AT


# In[ ]:



