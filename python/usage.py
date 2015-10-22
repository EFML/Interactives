#!/usr/bin/python
import os
import sys
from urlparse import urlparse
import json

def find_url(data, name):
    result = []
    for el in data:
        file_name = urlparse(el['url']).path.split("/")[2:]
        file_name = './' + '/'.join(file_name)
        if file_name == name:
            result.append(el)
    return result

def nbr_iframe(data):
    count = 0
    for el in data:
        if el['type'] == 'IFrame':
            count += 1
    return count

def nbr_jsinput(data):
    count = 0
    for el in data:
        if el['type'] == 'JSInput':
            count += 1
    return count

# Set the directory you want to start from. Defaults to '.''
if len(sys.argv) > 1:
    rootdir = sys.argv[1]
else:
    rootdir = '.'

print('Checking out used and unused interactives in %s' % rootdir)
total_html = 0
used_html = 0
unused_html = 0

list_file = open(rootdir + '/list.json', 'r')
json_data = list_file.read()
data = json.loads(json_data)
list_file.close
total_iframe = nbr_iframe(data)
total_jsinput = nbr_jsinput(data)
output_file = open(rootdir + '/usage.txt', 'w')

excluded_dir = ['CSS', 'JS', 'Macro_Interactive_ToDo', 'OldStructure', 'Python', 'WWW']
for dir, subdirs, files in os.walk(rootdir):
    subdirs[:] = sorted([d for d in subdirs if d not in excluded_dir])
    for file in files:
        if file.endswith('.html'):
            total_html += 1
            file_name = os.path.join(dir, file)
            result = find_url(data, file_name)
            if result:
                count = len(result)
                times_str = 'time' if count == 1 else 'times'
                output_file.write('##### File: {0} is used {1} {2} in:\n\n'.format(file_name, count, times_str))
                for el in result:
                     output_file.write('  url: ' + el['url'] + '\n')
                     output_file.write('  path: ' + el['path'] + '\n')
                     output_file.write('  type: ' + el['type'] + '\n')
                     output_file.write('  location: ' + '\n')
                     output_file.write('    chapter: ' + el['location']['chapter'] + '\n')
                     output_file.write('    sequential: ' + el['location']['sequential'] + '\n')
                     output_file.write('    vertical: ' + el['location']['vertical'] + '\n')
                     output_file.write('    name: ' + el['location']['name'] + '\n\n')
                used_html += 1
            else:
                output_file.write('##### File %s is not used\n\n' % file_name)
                unused_html += 1
output_file.write('Total number of used HTML files: %s\n' % str(used_html))
output_file.write('Total number of unused HTML files: %s\n' % str(unused_html))
output_file.write('Total number of HTML files: %s\n' % str(total_html))
output_file.write('Total number of Iframe: %s\n' % str(total_iframe))
output_file.write('Total number of JSInput: %s\n' % str(total_jsinput))
output_file.close()

