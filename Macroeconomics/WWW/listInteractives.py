
# coding: utf-8

# In[15]:

#!/usr/bin/env python
import os
from jinja2 import Environment, FileSystemLoader


# In[20]:

PATH = os.path.dirname(os.path.abspath("__file__"))
TEMPLATE_ENVIRONMENT = Environment(
    autoescape=False,
    loader=FileSystemLoader(os.path.join(PATH, 'templates')),
    trim_blocks=False)
 
def render_template(template_filename, context):
    return TEMPLATE_ENVIRONMENT.get_template(template_filename).render(context)
 
def crawl_directory_for_html(directory):
    iList=[]
    actList=[]
    for dirpath, subdirs, files in os.walk(directory):
        for file in files:
            relURL = os.path.join(dirpath, file)  #e.g., ../11_Loanable_Funds/LC1/(file.html)
            unit = relURL.split('/')[0]  #e.g., 11_Loanable_Funds
            baseURL = 'https://dnextinteractives.s3.amazonaws.com/Macroeconomics/'
            
            #Create S3 Link
            link = baseURL + relURL.lstrip('../')
            if file.endswith('.html'):
                if "OldStructure" in link or "WWW" in link: 
                    a = True
#                     print "Ignore folder: %s" % dirpath
                else:
                    iList.append(link)
    
            if "ActTable" in file:
#                 print link
                actList.append(link)
            
    return iList, actList 

def create_index_html():
    fname = "MacroInteractives.html"
    iList, actList = crawl_directory_for_html('../')
    context = {
        'TotalInteractives': len(iList) + len(actList),
        'JSXlist': iList,
        'actList': actList
    }
    
    with open(fname, 'w') as f:
        html = render_template('interactives.html', context)
        f.write(html)
 
 
def main():
    create_index_html()
 
########################################
 
if __name__ == "__main__":
    main()


# In[ ]:




# In[12]:




# In[2]:




# In[ ]:



