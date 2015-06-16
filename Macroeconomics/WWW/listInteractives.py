
# coding: utf-8

# In[1]:

#!/usr/bin/env python
import os
from jinja2 import Environment, FileSystemLoader


# In[30]:

PATH = os.path.dirname(os.path.abspath("__file__"))
TEMPLATE_ENVIRONMENT = Environment(
    autoescape=False,
    loader=FileSystemLoader(os.path.join(PATH, 'templates')),
    trim_blocks=False)

ignorePaths = set(['../.ipynb_checkpoints','../OldStructure','../Python','../SASS','../WWW'])

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
    

# def new_crawl_directory_for_html(directory):
#     iList=[]
#     actList=[]
#     units={}
#     for dirpath, subdirs, files in os.walk(directory):
#         r = dirpath.split('/')
#         if len(r)>2:
#             if any(x not in dirpath for x in ignorePaths): 
#                 name = r[1]
#                 LC = r[2]
#                 print name,LC

#                 for file in files:
#                     if file.endswith('.html'):
#                         relURL = os.path.join(dirpath, file)  #e.g., ../11_Loanable_Funds/LC1/(file.html)
#                         unit = relURL.split('/')[0]  #e.g., 11_Loanable_Funds
#                         baseURL = 'https://dnextinteractives.s3.amazonaws.com/Macroeconomics/'



#                         #Create S3 Link
#                         link = baseURL + relURL.lstrip('../')
#                         print "Folder: %s" % dirpath
#                         iList.append(link)

#                         if "ActTable" in file:
#                 #                 print link
#                             actList.append(link)
    
            
    return iList, actList 

def create_index_html():
    fname = "MacroInteractives.html"
    iList, actList = new_crawl_directory_for_html('../')
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


# In[17]:

[word in dirpath for word in ignorePaths]


# In[12]:




# In[2]:




# In[ ]:



