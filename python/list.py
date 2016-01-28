#!/usr/bin/python
import fnmatch
import os
import sys
import re
import json

# Set the directory you want to start from. Defaults to '.''
if len(sys.argv) > 1:
    rootdir = sys.argv[1]
else:
    rootdir = '.'

print('Starting %s directory walk' % rootdir)

outputfile = open(rootdir+'/list.json', 'w')

jsinput_nbr = 0
iframe_nbr = 0
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
                    vertical_name = ''.join(re.findall(r'display_name="(.*?)"', vertical_bytes))
                    # Find all problems
                    problems = re.findall(r'<problem url_name="(.*?)"', vertical_bytes)
                    for problem in problems:
                        problem_path = './problem/' + problem + '.xml'
                        problem_file = open(problem_path, 'r')
                        problem_bytes = problem_file.read()
                        problem_name = ''.join(re.findall(r'display_name="(.*?)"', problem_bytes))
                        problem_file.close()
                        problem_file = open(problem_path, 'r')
                        for line in problem_file:
                            # Problem files can contain JSInput and IFrame
                            if line.find('<jsinput') != -1 or line.find('<iframe') != -1:
                                if line.find('<jsinput') != -1:
                                    jsinput_url = re.findall(r'(?<=html_file=\").+(?=html)', line)
                                    found_list.append({
                                        'type': 'JSInput',
                                        'path': problem_path,
                                        'location': {
                                            'chapter': chapter_name,
                                            'sequential': sequential_name,
                                            'vertical': vertical_name,
                                            'name': problem_name
                                         },
                                         'url': ''.join(jsinput_url) + 'html'
                                    })
                                    jsinput_nbr += 1
                                if line.find('<iframe') != -1:
                                    html_url = re.findall(r'(?<=src=\").+(?=html)', line)
                                    found_list.append({
                                        'type': 'IFrame',
                                        'path': problem_path,
                                        'location': {
                                            'chapter': chapter_name,
                                            'sequential': sequential_name,
                                            'vertical': vertical_name,
                                            'name': problem_name
                                         },
                                         'url': ''.join(html_url) + 'html'
                                    })
                                    iframe_nbr += 1
                        problem_file.close()
                    # Find all HTML
                    htmls = re.findall(r'<html url_name="(.*?)"', vertical_bytes)
                    for html in htmls:
                        html_path = './html/' + html + '.html'
                        html_file = open(html_path, 'r')
                        html_bytes = html_file.read()
                        html_name = ''.join(re.findall(r'display_name="(.*?)"', html_bytes))
                        html_file.close()
                        html_file = open(html_path, 'r')
                        for line in html_file:
                            if line.find('<iframe') != -1:
                                html_url = re.findall(r'(?<=src=\").+(?=html)', line)
                                found_list.append({
                                    'type': 'IFrame',
                                    'path': html_path,
                                    'location': {
                                        'chapter': chapter_name,
                                        'sequential': sequential_name,
                                        'vertical': vertical_name,
                                        'name': html_name
                                        },
                                        'url': ''.join(html_url) + 'html'
                                    })
                                iframe_nbr += 1
                        html_file.close()
# outputfile.write('Number of JSInput: %s\n' % str(jsinput_nbr))
# outputfile.write('Number of IFrame: %s\n' % str(iframe_nbr))
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

