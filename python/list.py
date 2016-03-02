#!/usr/bin/python
import fnmatch
import os
import sys
import re
import json
from collections import OrderedDict


# Returns additional interactive infos:
# type: IFrame or JSInput
# storage: internal (/static/) or S3 (bucket URL)
# resizing: if it's the internal IFrame used for resizing
def interactive_infos(url, type):
    if url.startswith('/static/'):
        storage = 'Internal'
        resizing = url == '/static/resize-iframes.html'
    else:
        storage = 'S3'
        resizing = False
    return {'type': type, 'storage': storage, 'resizing': resizing}

# Set the directory you want to start from. Defaults to '.''
if len(sys.argv) > 1:
    rootdir = sys.argv[1]
else:
    rootdir = '.'

print('Starting %s directory walk' % rootdir)

outputfile = open(rootdir+'/list.json', 'w')

found_list = []
# Open course XML
for dir, subdir, files in os.walk(rootdir + '/course'):
    for file in files:
        course_path = os.path.join(dir, file)
        course_file = open(course_path, 'r')
        course_bytes = course_file.read()
        course_file.close()
        course_name = ''.join(re.findall(r'display_name="(.*?)"', course_bytes))
        chapters = re.findall(r'<chapter url_name="(.*?)"', course_bytes)
        for chapter in chapters:
            chapter_path = './chapter/' + chapter + '.xml'
            chapter_file = open(chapter_path, 'r')
            chapter_bytes = chapter_file.read()
            chapter_file.close()
            chapter_name = ''.join(re.findall(r'display_name="(.*?)"', chapter_bytes))
            sequentials = re.findall(r'<sequential url_name="(.*?)"', chapter_bytes)
            for sequential in sequentials:
                sequential_path = './sequential/' + sequential + '.xml'
                sequential_file = open(sequential_path, 'r')
                sequential_bytes = sequential_file.read()
                sequential_file.close()
                sequential_name = ''.join(re.findall(r'display_name="(.*?)"', sequential_bytes))
                verticals = re.findall(r'<vertical url_name="(.*?)"', sequential_bytes)
                for vertical in verticals:
                    vertical_path = './vertical/' + vertical + '.xml'
                    vertical_file = open(vertical_path, 'r')
                    vertical_bytes = vertical_file.read()
                    vertical_file.close()
                    vertical_name = ''.join(re.findall(r'vertical display_name="(.*?)"', vertical_bytes))
                    # Find all problems
                    problems = re.findall(r'<problem url_name="(.*?)"', vertical_bytes)
                    for problem in problems:
                        problem_path = './problem/' + problem + '.xml'
                        problem_file = open(problem_path, 'r')
                        problem_bytes = problem_file.read()
                        problem_name = ''.join(re.findall(r'problem display_name="(.*?)"', problem_bytes))
                        problem_file.close()
                        problem_file = open(problem_path, 'r')
                        for line in problem_file:
                            # Problem files can contain JSInput and IFrame
                            found_jsinput = line.find('<jsinput') != -1
                            found_iframe = line.find('<iframe') != -1
                            if found_jsinput or found_iframe:
                                if found_jsinput:
                                    jsinput_url = re.findall(r'(?<=html_file=\").+(?=html)', line)
                                    if jsinput_url:
                                        jsinput_url = ''.join(jsinput_url) + 'html'
                                        infos = interactive_infos(jsinput_url, 'JSInput')
                                        od = OrderedDict(
                                            [
                                                ('type', infos['type']),
                                                ('storage', infos['storage']),
                                                ('resizing', infos['resizing']),
                                                ('url', jsinput_url),
                                                ('location', OrderedDict(
                                                    [
                                                        ('chapter', chapter_name),
                                                        ('sequential', sequential_name),
                                                        ('vertical', vertical_name),
                                                        ('name', problem_name)
                                                    ]
                                                )),
                                                ('path', problem_path)
                                            ]
                                        )
                                        found_list.append(od)
                                if found_iframe:
                                    html_url = re.findall(r'(?<=src=\").+(?=html)', line)
                                    if html_url:
                                        html_url = ''.join(html_url) + 'html'
                                        infos = interactive_infos(html_url, 'IFrame')
                                        od = OrderedDict(
                                            [
                                                ('type', infos['type']),
                                                ('storage', infos['storage']),
                                                ('resizing', infos['resizing']),
                                                ('url', html_url),
                                                ('location', OrderedDict(
                                                    [
                                                        ('chapter', chapter_name),
                                                        ('sequential', sequential_name),
                                                        ('vertical', vertical_name),
                                                        ('name', problem_name)
                                                    ]
                                                )),
                                                ('path', problem_path)
                                            ]
                                        )
                                        found_list.append(od)
                        problem_file.close()
                    # Find all HTML
                    htmls = re.findall(r'<html url_name="(.*?)"', vertical_bytes)
                    for html in htmls:
                         # The HTML name is contained in the associated xml file
                        html_xml_path = './html/' + html + '.xml'
                        html_xml_file = open(html_xml_path, 'r')
                        html_xml_bytes = html_xml_file.read()
                        html_name = ''.join(re.findall(r'display_name="(.*?)"', html_xml_bytes))
                        html_xml_file.close()
                        html_path = './html/' + html + '.html'
                        html_file = open(html_path, 'r')
                        for line in html_file:
                            if line.find('<iframe') != -1:
                                html_url = re.findall(r'(?<=src=\").+(?=html)', line)
                                if html_url:
                                    html_url = ''.join(html_url) + 'html'
                                    infos = interactive_infos(html_url, 'IFrame')
                                    od = OrderedDict(
                                        [
                                            ('type', infos['type']),
                                            ('storage', infos['storage']),
                                            ('resizing', infos['resizing']),
                                            ('url', html_url),
                                            ('location', OrderedDict(
                                                [
                                                    ('chapter', chapter_name),
                                                    ('sequential', sequential_name),
                                                    ('vertical', vertical_name),
                                                    ('name', html_name)
                                                ]
                                            )),
                                            ('path', html_path)
                                        ]
                                    )
                                    found_list.append(od)
                        html_file.close()
found_list_string = json.dumps(found_list, indent=4)
outputfile.write(found_list_string)
outputfile.close()
# json.dumps (Python 2.7.9 on Ubuntu 15.04), when used with indent, will append trailing white space.
# Remove them and insert a newline at the end of the file
outputfile = open(rootdir+'/list.json', 'r')
lines = outputfile.readlines()
outputfile.close()
outputfile = open(rootdir+'/list.json', 'w')
for line in lines:
    line = line.rstrip() + '\n'
    outputfile.write(line)
outputfile.close()
