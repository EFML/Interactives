#!/usr/bin/python
import os
import sys
from urlparse import urlparse
import json


def find_url(data, name):
    result = []
    for el in data:
        file_name = urlparse(el['url']).path.split("/")[3:]
        file_name = './' + '/'.join(file_name)
        if file_name == name:
            result.append(el)
    return result

def infos_interactives(data):
    nbr_s3_iframe = 0
    nbr_internal_iframe = 0
    nbr_internal_resizing_iframe = 0
    nbr_s3_jsinput = 0
    nbr_internal_jsinput = 0

    for el in data:
        if el['type'] == 'IFrame':
            if el['storage'] == 'S3':
                nbr_s3_iframe += 1
            else: # internal
                if el['resizing']:
                    nbr_internal_resizing_iframe += 1
                else:
                     nbr_internal_iframe  += 1
        else: # JSInput
            if el['storage'] == 'S3':
                nbr_s3_jsinput += 1
            else: # internal
                nbr_internal_jsinput += 1
    return {
        'nbr_s3_iframe': nbr_s3_iframe,
        'nbr_internal_iframe': nbr_internal_iframe,
        'nbr_internal_resizing_iframe': nbr_internal_resizing_iframe,
        'nbr_s3_jsinput': nbr_s3_jsinput,
        'nbr_internal_jsinput': nbr_internal_jsinput
    }

# Set the directory you want to start from. Defaults to '.''
if len(sys.argv) > 1:
    rootdir = sys.argv[1]
else:
    rootdir = '.'

print('Checking out used and unused interactives in %s' % rootdir)
total_html = 0
used_html = 0
unused_html = 0
s3_base_url = 'https://dnext.s3.amazonaws.com/macroeconomics/v2'
s3_urls = []

list_file = open(rootdir + '/list.json', 'r')
json_data = list_file.read()
data = json.loads(json_data)
list_file.close
infos = infos_interactives(data)
output_file = open(rootdir + '/usage.txt', 'w')

excluded_dir = ['css', 'fonts', 'js', 'various']
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
                s3_urls.append(s3_base_url + file_name[1:]) # Remove '.' before prepending s3_base_url
                for el in result:
                    output_file.write('  type: ' + el['type'] + '\n')
                    output_file.write('  location: ' + '\n')
                    output_file.write('    chapter: ' + el['location']['chapter'] + '\n')
                    output_file.write('    sequential: ' + el['location']['sequential'] + '\n')
                    output_file.write('    vertical: ' + el['location']['vertical'] + '\n')
                    output_file.write('    name: ' + el['location']['name'] + '\n')
                    output_file.write('  path: ' + el['path'] + '\n')
                    output_file.write('  url: ' + el['url'] + '\n\n')
                used_html += 1
            else:
                output_file.write('##### File %s is not used\n\n' % file_name)
                unused_html += 1
s3_urls.sort()
output_file.write('Total number of used HTML files: %s\n' % str(used_html))
output_file.write('Total number of unused HTML files: %s\n' % str(unused_html))
output_file.write('Total number of HTML files: %s\n' % str(total_html))
output_file.write('Total number of S3 IFrame: %s\n' % str(infos['nbr_s3_iframe']))
output_file.write('Total number of S3 JSInput: %s\n' % str(infos['nbr_s3_jsinput']))
output_file.write('Total number of Internal IFrame: %s\n' % str(infos['nbr_internal_iframe']))
output_file.write('Total number of Internal JSInput: %s\n' % str(infos['nbr_internal_jsinput']))
output_file.write('Total number of Internal Resizing Iframe: %s\n' % str(infos['nbr_internal_resizing_iframe']))
output_file.write('\nS3 URLs:\n')
output_file.write('\n'.join(s3_urls))
output_file.close()
