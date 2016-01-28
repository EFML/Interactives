#!/usr/bin/python
import os
import subprocess
import sys


# Set the directory you want to start from. Defaults to '.'
if len(sys.argv) > 1:
    rootdir = sys.argv[1]
else:
    rootdir = '.'

print('Opening all HTML files in %s with Chromium' % rootdir)
nbr_html_files = 0

excluded_dir = ['CSS', 'JS', 'Macro_Interactive_ToDo', 'OldStructure', 'Python', 'WWW']
for dir, subdirs, files in os.walk(rootdir):
    subdirs[:] = [d for d in subdirs if d not in excluded_dir]
    for file in files:
        if file.endswith('.html'):
            nbr_html_files += 1
            file_name = os.path.join(dir, file)
            subprocess.call(['chromium-browser', file_name])
            print('Opening %s with Chromium' % file_name)
print('Number of HTML files: %s\n' % str(nbr_html_files))

