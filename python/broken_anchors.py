#!/usr/bin/python
import fnmatch
import os
import sys
import re
import json
from collections import OrderedDict


# Set the directory you want to start from. Defaults to '.''
if len(sys.argv) > 1:
    rootdir = sys.argv[1]
else:
    rootdir = '.'

print('Starting %s directory walk' % rootdir)

outputfile = open(rootdir+'/broken-anchors.json', 'w')

found_list = []
nbr_anchors = 0
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
                        anchors_content = re.findall(r'(?<=<a href).+(?=</a>)', problem_bytes)
                        for anchor_content in anchors_content:
                            if anchor_content.find('javascript:') != -1:
                                od = OrderedDict(
                                    [
                                        ('anchor', '<a href' + anchor_content + '</a>'),
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
                                nbr_anchors += 1
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
                        html_bytes = html_file.read()
                        anchors_content = re.findall(r'(?<=<a href).+(?=</a>)', html_bytes)
                        for anchor_content in anchors_content:
                            if anchor_content.find('javascript:') != -1:
                                od = OrderedDict(
                                    [
                                        ('anchor', '<a href' + anchor_content + '</a>'),
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
                                nbr_anchors += 1
outputfile.write('Total number of incorrect anchors: %s\n\n' % str(nbr_anchors))
found_list_string = json.dumps(found_list, indent=4)
outputfile.write(found_list_string)
outputfile.close()
# json.dumps (Python 2.7.9 on Ubuntu 15.04), when used with indent, will append trailing white space.
# Remove them and insert a newline at the end of the file
outputfile = open(rootdir+'/broken-anchors.json', 'r')
lines = outputfile.readlines()
outputfile.close()
outputfile = open(rootdir+'/broken-anchors.json', 'w')
for line in lines:
    line = line.rstrip() + '\n'
    outputfile.write(line)
outputfile.close()
