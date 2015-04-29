import re
from os import path

class templateGenerator:
    def __init__(self,**kwargs):
        self.course_id = kwargs.get('course_id',None)
        self.Title = kwargs.get('Title',None)
        self.MacroJS = kwargs.get('MacroJS','Macro_1Board.js')
        self.MacroCSS = kwargs.get('MacroCSS','Macro_1Board.css')
        self.JS = kwargs.get('JS',None)
        self.OutputFile = kwargs.get('OutputFile',None)
        self.studioPaths = kwargs.get('studioPaths',True)

        print "JSinput Ipython Workflow. Below are parameters of your template:\n"
        
        print "Course: %s" % self.course_id
        print "Title: %s" % self.Title
        print "JS - main Javascript File: %s" % self.JS
        print "MacroJS - file for generalized functions: %s" % self.MacroJS
        print "MacroCSS - if you have it: %s" % self.MacroCSS
        print "OutputFile: %s" % self.OutputFile

        
    def scrapeHTMLfromIPython(self,inputCell):
        '''
        _ih: List of IPython cell inputs (any executed cell exists in the list)

        Searches through IPython input cells for %%HTML magic command in IPython notebooks.
        Removes any IPython specific commands:
            * %%HTML
            * Pass State Button
        
        Returns the HTML content as a string.        
        '''        
        
        ### Remove IPython specific commands
        render = re.sub('%%HTML','',inputCell)
        render = re.sub(r'<!--START-BUTTON FOR PASS STATE(.*?)END-BUTTON FOR PASS STATE-->','',render,flags=re.DOTALL)
        
        ### Set Title in HTML 
        A = '<title></title>'
        B = '<title>%s</title>' % self.Title
        render = re.sub(A,B,render,flags=re.DOTALL)

        ### Clear Any Relative Paths
        if self.studioPaths:
            render = self.cleanPaths(render)

        return render
    

    def findIPythonHTMLCell(self,_ih):
        '''
        Searches through IPython input cells for %%HTML magic command in IPython notebooks.
        '''
        ### Check code being run in IPython notebook
        if _ih:
            ### Search through IPython inputs, and pull in last executed cell containing %%HTML
            index_htmlinput = [ i for i,x in enumerate(_ih) if "run_cell_magic(u'HTML'" in x and "re.sub('%%HTML','',tmpfile)" not in x]
            # print index_htmlinput
            return int(index_htmlinput[-1])

        ### Warning and crash if not in an IPython instance
        else:
            print '''Code must be run inside an IPython Notebook. 
                     Or check that cells have been executed before running this code.
                  '''
            sys.exit(17) 


    def cleanPaths(self,tmp):
        '''
        Cleans any relative paths in accordance with Studio structure (i.e., /static/ or /c4x/edX/edX101/)
        '''
        ### Replace relative links with the appropriate edX links
        # tmpfile = re.sub(r'src="../../JS/Macro_t1.0.js"','src="/c4x/DavidsonCollege/DAP002/asset/Macro_t1.0.js"',tmpfile,flags=re.DOTALL)
        # tmp = re.sub(path.dirname("../../JS/Macro_1Board.js"),'/c4x/DavidsonCollege/DAP002/asset',tmp,flags=re.DOTALL)
        
        ### Template JS files - like Macro_1Board or Macro_2Board
        C = 'src="%s"' % self.MacroJS
        D = 'src="/c4x/DavidsonCollege/DAP002/asset/%s"' % path.basename(self.MacroJS)
        tmp = re.sub(C,D,tmp,flags=re.DOTALL)
        
        ### Main JS file for the interactive
        E = 'src="%s"' % self.JS
        F = 'src="/c4x/DavidsonCollege/DAP002/asset/%s"' % self.JS
        tmp = re.sub(E,F,tmp,flags=re.DOTALL)

        return tmp


    def writeOutputFile(self,htmlFile):
        with open(self.OutputFile,'w') as hfile:
            hfile.write(htmlFile)
        print htmlFile

        return None




