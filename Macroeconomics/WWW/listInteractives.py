
# coding: utf-8

# In[2]:

#!/usr/bin/env python
import os
from jinja2 import Environment, FileSystemLoader


# In[ ]:

PATH = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_ENVIRONMENT = Environment(
    autoescape=False,
    loader=FileSystemLoader(os.path.join(PATH, 'templates')),
    trim_blocks=False)
 
 
def render_template(template_filename, context):
    return TEMPLATE_ENVIRONMENT.get_template(template_filename).render(context)
 
 
def create_index_html():
    fname = "output.html"
    urls = ['http://example.com/1', 'http://example.com/2', 'http://example.com/3']
    context = {
        'urls': urls
    }
    #
    with open(fname, 'w') as f:
        html = render_template('index.html', context)
        f.write(html)
 
 
def main():
    create_index_html()
 
########################################
 
if __name__ == "__main__":
    main()


# In[ ]:




# In[12]:

iList = []
for root, dirs, files in os.walk('../'):
    for file in files:
        if file.endswith('.html'):
            iList.append(file)

numInteractives = len(iList)
            
page = jinja.Template('''
<!DOCTYPE html>
<html>
  <head>
    <title>Flask Template Example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <style type="text/css">
      .container {
        max-width: 500px;
        padding-top: 100px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Number of Macro Interactives: {{numInteractives}}</p>
      <p>Loop through the list:</p>
      <ul>
        {% for f in iList %}
        <li>{{f}}</li>
        {% endfor %}
      </ul>
    </div>
    <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
  </body>
</html>
''')


# In[14]:

print page.render()


# In[ ]:



