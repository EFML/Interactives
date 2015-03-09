# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <markdowncell>

# ### Short Answer Response

# <codecell>

%%HTML
<!DOCTYPE html>
<html>
    <head>
        <style> 
            
        </style>
    </head>

    <body>
        
        <div>
            <textarea class="shortAnswer" id="R1" rows="10" cols="500" placeholder="Enter your response here...">
            </textarea>
            
        </div>
        <div>
            <input type="submit" value="Save" />
        </div>    
        
        
        <!-- COMMENT: Where our Javascript begins. -->
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.98/jsxgraphcore.js"></script>
        <script type='text/javascript'>
            
            //Standard edX JSinput functions
            getInput = function(){
                state = {};
                statestr = JSON.stringify(state);
                console.log(statestr)
                
                //IPython Notebook Considerations
                document.getElementById('spaceBelow').innerHTML += '<br>'+statestr;
                var command = "state = '" + statestr + "'";
                console.log(command);

                //Kernel
                var kernel = IPython.notebook.kernel;
                kernel.execute(command);

                return statestr;
            }

            getState = function(){
                state = {'input': JSON.parse(getInput())};
                statestr = JSON.stringify(state);
                return statestr
            }

            setState = function(statestr){
                $('#msg').html('setstate ' + statestr);
                state = JSON.parse(statestr);
                console.log(statestr);
                console.debug('State updated successfully from saved.');
            }
            
            
        </script>
    </body>
</html>

# <codecell>


