



window.onload = function(){

    //get the table data
    var config =window.DataEntrySettings,
        tables = [],
        boundingBox = config.initBoundingBox,
        board, chooseColumnsDialog, chooseFitDialog, resetDialog,
        singleTableEl, singleTable, // Last minute hack to get the table resize when browser window does;
        textHeaders = [];

    //initialize the tables
    init();

    function init() {
    // Deep clone config.tables
        $.extend(true, tables, config.tables);

         $(window).on('resize', resizeBox);

        setTableIds();
        createTabPanel();
        createResetDialog();
        // createChooseFitDialog();
        var data = getData(tables[0]);
        // console.log(data)    
        drawChart(tables[0],data);

    }

    function resizeBox(){
        var boardWidth = $('.container').width();
        // board.needsFullUpdate = true;
        // board.resizeContainer(boardWidth, board.canvasHeight);
        // board.setBoundingBox(boundingBox);
        // board.update();
        // Last minute hack to get the table resize when browser window does
        singleTableEl.width(boardWidth - 40);
        singleTable.render();
    }

    function setTableIds() {
        _.each(tables, function(table) {
             table.id = _.uniqueId();
             // Temporary, remove when HTML will have been changed
            if (_.isUndefined(table.xColumn)) {
                table.xColumn = 0;
            }
            if (_.isUndefined(table.yColumn)) {
                table.yColumn = 1;
            }
        });
    }

    function createTabPanel() {
        var panel;
        // Create a tab panel if we have more than one experiment
        if (tables.length > 1) {
            $('.control-panel').append('<div class="half-line" id="table-tabs"><ul></ul></div>');
            _.each(tables, function(table) {
                createTab(table);
            });
            $('#table-tabs').tabs();
        }
        else {
            panel = $('<div class="half-line ui-tabs-panel" />');
            $('.control-panel').append(panel);
            // Last minute hack to get the table resize when browser window does
            singleTable = createTabContent(panel, tables[0]);
            singleTableEl = $(singleTable.rootElement);
        }
    }

    function createTabContent(container, table) {
        var chooseColumnsBt, plotTableBt, 
        fitLineBtn, resetBtn, htmlFragment,addRowBt;
    
        htmlFragment = [
            '<div class="half-line">',
                '<div id="table-' + table.id + '" />',
            '</div>',
            '<button class="button" id="add-row-' + table.id + '">Add Row</button>',
            '<div class="half-line" id="reg-line-eq-' + table.id + '" />',
            '<div class="half-line">',
                '<button class="button" id="choose-columns-' + table.id + '">Choose Columns</button>',
                '<button class="button" id="plot-table-' + table.id + '">Plot Table</button>',
                '<button class="button" id="fit-line-' + table.id + '" >Choose Fit</button>',
                
                '<button class="button" id="reset-' + table.id + '">Reset</button>',
            '</div>'
            ].join('');
        // Append tab content to container
        container.append(htmlFragment);
        // Generate handsontable
        table.htmlTable = new Handsontable($('#table-' + table.id).get(0), {
            data: table.data,
            colHeaders: table.headers,
            // Last minute hack to get the table resize when browser window does
            width: $('.container').width() - 40,
            stretchH: 'all',
            height: 390,
            // End hack
            readOnly: table.readOnly
        });
        // Bind button event listeners
        addRowBt = $('#add-row-' + table.id);
        addRowBt.on('click', function() {
            addRow();
        });

        chooseColumnsBt = $('#choose-columns-' + table.id);
        chooseColumnsBt.on('click', function() {
            openChooseColumnsDialog();
        });
    
        plotTableBt = $('#plot-table-' + table.id);
        plotTableBt.on('click', function() {
            try {
                var data=getData(table);
                drawChart(table,data);
            }
            catch (err) {
                window.alert(err.toString());
            }
        });
    
        fitLineBtn = $('#fit-line-' + table.id);
        fitLineBtn.on('click', function() {
            openChooseFitDialog();
            //try {
            //    fitLine(table);
            //}
            //catch (err) {
            //    window.alert(err.toString());
            //}
        });
    
        if(!table.fitLine.render) {
            fitLineBtn.hide();
        }
    
        resetBtn = $('#reset-' + table.id);
        resetBtn.on('click', function() {
            openResetDialog();
        });
    
        // Last minute hack to get the table resize when browser window does
        return table.htmlTable;
    }
    function addRow(){
        // add row to table and regenerate table
        var index =getActiveTable(),
        table = tables[index],
        blankRow = [];
        for(i=0;i<table.data[0].length;i++){
            blankRow.push('')
        }
        table.data.push(blankRow)

        // now redraw
        // Generate handsontable
        table.htmlTable = new Handsontable($('#table-' + table.id).get(0), {
            data: table.data,
            colHeaders: table.headers,
            // Last minute hack to get the table resize when browser window does
            width: $('.container').width() - 40,
            stretchH: 'all',
            height: 390,
            // End hack
            readOnly: table.readOnly
        });
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }
    function drawChart(table,data) {
        // data should be in {data:[trace]} format
        // var data = getData(table),
        var config = {responsive: true}, xlabel,ylabel,
        layout;

        xlabel = table.headers[table.xColumn];
        ylabel = table.headers[table.yColumn];

        // console.log(xlabel)
        
        xlabel=xlabel.replace("\\(","")
        xlabel=xlabel.replace("\\)","")
        ylabel=ylabel.replace("\\(","")
        ylabel=ylabel.replace("\\)","")
        layout={
        xaxis: {
            title: {
                text: "$".concat(xlabel,"$"),
                font: {
                    
                    size: 18,
                    color: '#7f7f7f'
              }
            },
          },
          yaxis: {
            title: {
                text: "$".concat(ylabel,"$"),
                font: {                
                    size: 18,
                    color: '#7f7f7f',
                textangle:0
              }
            }
          }
        };

        //add layout and config to data json
        data.layout=layout;
        data.config=config;
        // console.log(layout)
        Plotly.newPlot('chart-div',data)

    };

    function createResetDialog() {
        resetDialog = $('#reset-dialog-form')
            .append('<p>The items you entered will be permanently deleted and cannot be recovered. Are you sure?</p>')
            .dialog({
                autoOpen: false,
                title: 'Warning',
                modal: true,
                buttons: {
                    'OK': okResetDialog,
                    'Cancel': cancelResetDialog
                }
            });
    }

    function createChooseColumnsDialog() {
   
        var index = getActiveTable(),
            optionsHtmlFragment = '', htmlFragment, el, text,col=0;
    
        el = $('<div/>');
    
        _.each(tables[index].headers, function(header) {
            // Last minute hack, strip HTML from headers.
            el.html(header);
            text = el.text();
            //replace text with col index          
            optionsHtmlFragment += '<option>' + col + '</option>';
            //pushing column index rather than name to avoid MathJax issues
            textHeaders.push(col);
            col++;
        });
        
        htmlFragment = [            
            '<label class="quarter-line" for="x-column">Select a column for x</label>',
            '<select class="full-line" name="x-column" id="x-column">',
                optionsHtmlFragment,
            '</select>',
            '<p></p>',
            '<label for="y-column">Select a column for y</label>',
            '<select name="y-column" id="y-column">',
                optionsHtmlFragment,
            '</select>'
        ].join('');
    
        chooseColumnsDialog = $('#choose-columns-dialog-form').empty();
    
        chooseColumnsDialog
            .append(htmlFragment)
            .dialog({
                autoOpen: false,
                title: 'Choose Columns',
                modal: true,
                width: 350,
                resizable: false,
                buttons: {
                    'OK': okChooseColumnsDialog,
                    'Cancel': cancelChooseColumnsDialog
                }
            });
    
        $('.ui-dialog').css({
            overflow: 'visible'
        });
    
        $('#x-column').selectmenu({
            width: 300,
        });
    
        $('#y-column').selectmenu({
            width: 300,
        });
    
        // $('#x-column').val(textHeaders[tables[index].xColumn]);
        $('#x-column').selectmenu('refresh');
    
        $('#y-column').val(textHeaders[tables[index].yColumn]);
        $('#y-column').selectmenu('refresh');
        //add mathjax queue but not working once column selected?
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        
    
    }

    function openChooseColumnsDialog() {
        createChooseColumnsDialog();
        chooseColumnsDialog.dialog('open');
    }

    function okChooseColumnsDialog() {
        var xColumnSelectedItem = $('#x-column').val(),
            yColumnSelectedItem = $('#y-column').val(),            
            index = getActiveTable();
        tables[index].xColumn = xColumnSelectedItem;
        tables[index].yColumn = yColumnSelectedItem;
        //tables[index].xColumn = textHeaders.indexOf(xColumnSelectedItem);
        //tables[index].yColumn = textHeaders.indexOf(yColumnSelectedItem);
        chooseColumnsDialog.dialog('close');
    }
    
    function cancelChooseColumnsDialog() {
        chooseColumnsDialog.dialog('close');
    }

    function openChooseFitDialog() {
        createChooseFitDialog();
        chooseFitDialog.dialog('open');
    }

    function createChooseFitDialog() {
       
        var index = getActiveTable(),
            optionsHtmlFragment2 = '', htmlFragment2, el, text,col=0,
            trendlines=['linear','cubic','quadratic','exponential'];
        
        el = $('<div/>');
        
        _.each(tables[index].headers, function(header) {
            // Last minute hack, strip HTML from headers.
            el.html(header);
            text = el.text();
            //replace text with col index          
            optionsHtmlFragment2 += '<option>' + trendlines[col] + '</option>';
            //pushing column index rather than name to avoid MathJax issues
            textHeaders.push(col);
            col++;
        });
                
        htmlFragment2 = [            
            '<label class="quarter-line" for="trendline">Select a trendline</label>',
            '<select class="full-line" name="trendline" id="trendline">',
             optionsHtmlFragment2,
            '</select>',
            '<p></p>'
                    
            ].join('');
        
        chooseFitDialog = $('#choose-fit-dialog-form').empty();
        
        chooseFitDialog
            .append(htmlFragment2)
            .dialog({
                autoOpen: false,
                title: 'Choose Type of Fit',
                modal: true,
                width: 350,
                resizable: false,
                buttons: {
                    'Plot': okFitPlot,
                    'Close': cancelFitDialog
                }
                });
        
        $('.ui-dialog').css({
            overflow: 'visible'
        });
        
        $('#trendline').selectmenu({
            width: 300,
        });
        
        $('#trendline').val(textHeaders[tables[index].xColumn]);
        $('#trendline').selectmenu('refresh');
        
        //add mathjax queue but not working once column selected?
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                
        
    }
    
    function cancelFitDialog() {
        chooseFitDialog.dialog('close');
    }

    function okFitPlot() {
        var trendlineType = $('#trendline').val(),
                
        index = getActiveTable();
                
        if(trendlineType=="linear"){
            try {
            fitLine(tables[index]);
            }
            catch (err) {
                window.alert(err.toString());
            }            
        }else if(trendlineType=='cubic'){
            try {
                fitLine(tables[index],3);
            }
            catch (err) {
                 window.alert(err.toString());
            } 
        }else if(trendlineType=='quadratic'){
            try {
                fitLine(tables[index],2);
            }
            catch (err) {
                window.alert(err.toString());
            } 
        }else if(trendlineType=='expontential'){
            try {
                fitLine(tables[index],1);
            }
            catch (err) {
                window.alert(err.toString());
            } 
        }
                    //index = getActiveTable();
                //tables[index].xColumn = xColumnSelectedItem;
                //tables[index].yColumn = yColumnSelectedItem;
                //tables[index].xColumn = textHeaders.indexOf(xColumnSelectedItem);
                //tables[index].yColumn = textHeaders.indexOf(yColumnSelectedItem);
        chooseFitDialog.dialog('close');
    }

    function openResetDialog() {
        resetDialog.dialog('open');
    }
        
    function okResetDialog() {
        reset();
        resetDialog.dialog('close');
    }
        
    function cancelResetDialog() {
        resetDialog.dialog('close');
    }

    function fitLine(table){
        var x=[],y=[],type='scatter',lr={},
        index=getActiveTable();

        // get trace data
        data=getData(table)
        // console.log(trace.data[0].x)
        //get bounds
        var fit_from = Math.min(...data.data[0].x)
        var fit_to = Math.max(...data.data[0].x)     
        //fit line
        
        lr = linearRegression(data.data[0].x,data.data[0].y);
        // console.log(lr)
        var fit={
            x:[fit_from,fit_to],
            y: [fit_from*lr.sl+lr.off, fit_to*lr.sl+lr.off],
            mode: 'lines',
            type: 'scatter',
            }
        
        data.data.push(fit)//= {data:[trace,fit]}
        
        drawChart(tables[index],data)
        // drawChart(table,trace)
    }

    function getActiveTable() {
                return tables.length > 1 ? $('#table-tabs').tabs('option', 'active') : 0;
    }

    function getData(table){
        // get data from table in x y format to plot
        var x=[],y=[],type='scatter';

        // may want to change this...
        for (i = 0; i < table.data.length; i++) {
            x.push(table.data[i][table.xColumn]);
            y.push(table.data[i][table.yColumn]);
            };
                    
        
        
        // trace.x=x;
        // trace.y=y;
        var trace={
            x:x,
            y:y,
            mode:'markers',
            type:type,
            marker:{size:12,opacity:0.5,line:{width:1}}
        }
        
        return {data: [trace]};
            
    }

    function clearRegLineEq() {
        var table, tableIndex = getActiveTable();

        table = tables[tableIndex];

        $('#fit-line-' + table.id).attr('disabled', true);
        $('#reg-line-eq-' + table.id).html('');
    }

    function resetCellsBoard() {
        var data, tableIndex = getActiveTable();
        
        // Deep clone relevant table
        $.extend(true, tables[tableIndex], config.tables[tableIndex]);
        
        data = tables[tableIndex].data;
        
        // Update table display
        tables[tableIndex].htmlTable.loadData(data);
        
        if (config.render) {
            drawChart(tables[tableIndex]);
        }
    }

    function reset() {
        clearRegLineEq();
        resetCellsBoard();
        drawChart(tables[getActiveTable()]);
    }

    // Linear fitting
    function linearRegression(x,y){
        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {

            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i]*y[i]);
            sum_xx += (x[i]*x[i]);
            sum_yy += (y[i]*y[i]);
        } 

        lr['sl'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
        lr['off'] = (sum_y - lr.sl * sum_x)/n;
        lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

        return lr;
    }
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}


// $(window).on('resize', resizeBox);
/* Current Plotly.js version */
// console.log( Plotly.BUILD );