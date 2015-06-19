
# coding: utf-8

# In[23]:

import os
PATH = os.path.dirname(os.path.abspath("__file__"))
from jinja2 import Environment, FileSystemLoader
env = Environment(loader=FileSystemLoader(os.path.join(PATH, 'templates')))


# In[28]:

template = env.get_template('index.html')
print template.render()


# In[24]:




# In[ ]:




# In[12]:




# In[2]:




# In[ ]:



