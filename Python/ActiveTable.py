
# coding: utf-8

# ####Class for Active Tables

# In[10]:

import pandas as pd
pd.options.display.max_colwidth = 200


# In[11]:

class ActivteTable:
    def __init__(self):
        return None
    
    ### Pandas "to_html" does not have an "id" 
    def df_to_html_with_id(self,df, id, *args, **kwargs):
        '''
        Pandas "to_html" does not allow assignment of an "id".
        This function adds an "id"; adapted from kwarg https://github.com/pydata/pandas/issues/8496
        '''
        s = df.to_html(*args, **kwargs)
        return s[:7] + 'id="%s" ' % id + s[7:]

    def create(self,tableBody,header):
        '''
        Utilizes Pandas to creaet an html table from a DataFrame.
        Parameters
        ----------
        questionTable: 2D list
        header: column names

        Example
        ----------
        questionTable = [ ['A','B','C'], [1,2,3], ['First','Second','Third'] ]

        ActiveTable.create(questionTable[1::][:],questionTable[0][:])
        '''
        active_table = pd.DataFrame(data=tableBody,columns=header)
        
        ### Code for creating input cells - also used for creation of the responseTable
        for col in active_table.columns:
            for row in active_table[col].index:
                if active_table.ix[row,col] == 'NUMERIC_RESPONSE':
                    ID = str(row)+'___'+str(col).replace(' ','')
                    s = '<input type="text" id="%s" class="Active" size="10px" placeholder ="input"></input>' % (ID)
                    active_table.ix[row,col] = s

        active_table = self.df_to_html_with_id(active_table,'myActiveTable',index=False)
        active_table = active_table.replace('&lt;','<').replace('&gt;','>')

        return active_table


# In[ ]:



