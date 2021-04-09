



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
        drawChart(tables[0]);

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
                '<button class="button" id="fit-line-' + table.id + '" disabled>Choose Fit</button>',
                
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
                drawChart(table);
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
    }
    function drawChart(table) {
        // get data
        var data = getData(table),
        config = {responsive: true}, xlabel,ylabel,
        layout;

        xlabel = table.headers[table.xColumn];
        ylabel = table.headers[table.yColumn];

        // console.log(xlabel)
        
        layout={
        xaxis: {
            title: {
                text: xlabel,
                font: {
                    
                    size: 18,
                    color: '#7f7f7f'
              }
            },
          },
          yaxis: {
            title: {
                text: ylabel,
                font: {                
                    size: 18,
                    color: '#7f7f7f'
              }
            }
          }
        };

        console.log(layout)
        Plotly.newPlot('chart-div',[data],layout,config)

    };

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
        
        return trace
            
        }

    // var trace = {
    //     x: [1, 2, 3, 4, 5],
    //     y: [1, 2, 4, 8, 16],
    //     mode: 'lines'
    // };
    
    // var data = [trace];
    // var config = {responsive: true}
    // Plotly.newPlot('chart-div',data,config)
}
// $(window).on('resize', resizeBox);
/* Current Plotly.js version */
// console.log( Plotly.BUILD );