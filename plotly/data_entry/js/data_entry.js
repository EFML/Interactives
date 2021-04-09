



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
        // drawChart();

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
        var chooseColumnsBt, plotTableBt, fitLineBtn, resetBtn, htmlFragment;
    
        htmlFragment = [
            '<div class="half-line">',
                '<div id="table-' + table.id + '" />',
            '</div>',
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
        chooseColumnsBt = $('#choose-columns-' + table.id);
        chooseColumnsBt.on('click', function() {
            openChooseColumnsDialog();
        });
    
        plotTableBt = $('#plot-table-' + table.id);
        plotTableBt.on('click', function() {
            try {
                plotTable(table);
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

    function drawChart() {
        // get data
        var data = getData()
    };

    function getData(){
        // get data from table in x y format to plot
        var x=[],y=[],type='scatter';

        // may want to change this...
    }
    var trace = {
        x: [1, 2, 3, 4, 5],
        y: [1, 2, 4, 8, 16],
        mode: 'lines'
    };
    
    var data = [trace];
    var config = {responsive: true}
    Plotly.newPlot('chart-div',data,config)
}
// $(window).on('resize', resizeBox);
/* Current Plotly.js version */
// console.log( Plotly.BUILD );