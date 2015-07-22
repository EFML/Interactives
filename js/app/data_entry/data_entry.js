var DataEntry = (function($, _, JXG, undefined) {
    'use strict';
    var config = window.DataEntrySettings || {
        tables: [
          	{
            	name: "Experience 1",
                data: [
              		[0.0, 0.0], [1.0, 1.0], [2.0, 3.0], [3.0, 5.0], [4.0, 7.0], [5.0, 10.0]
            	],
            	headers: ['x', 'y'],
                xColumn: 0,
                yColumn: 1,
            	dataPoints: {
            		color: 'Crimson',
            	},
            	fitLine: {
            		color: 'MediumSeaGreen',
                    precision: 3,
                    render: true
            	},
                readOnly: false
          	}
        ],
        initBoundingBox: [-11.0, 11.0, 11.0, -11.0],
        render: true
    };

    var tables = [],
        boundingBox = config.initBoundingBox,
        board, chooseColumnsDialog, resetDialog,
        singleTableEl, singleTable, // Last minute hack to get the table resize when browser window does;
        textHeaders = []; // Last minute hack to deal with headers containing HTML markup as <sub></sub>, <sup></sup>

    init();

    function init() {
        // Deep clone config.tables
        $.extend(true, tables, config.tables);

        $(window).on('resize', resizeBox);

        setTableIds();
        createTabPanel();
        createBoard(tables[0]);
        createResetDialog();

        if (config.render) {
            plotTable(tables[0]);
        }
    }

    function resizeBox(){
        var boardWidth = $('.container').width();
        board.needsFullUpdate = true;
        board.resizeContainer(boardWidth, board.canvasHeight);
        board.setBoundingBox(boundingBox);
        board.update();
        // Last minute hack to get the table resize when browser window does
        singleTableEl.width(boardWidth - 40);
        singleTable.render();
    }

    function createBoard(table) {
        var xAxis, yAxis, xAxisLabel, yAxisLabel, xOffset1, yOffset1, xOffset2, yOffset2;

        JXG.Options.text.fontSize = 14;

        board = JXG.JSXGraph.initBoard('jxgbox', {
            boundingbox: boundingBox,
            axis: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            showCopyright: false
        });

        xAxis = board.create('axis', [[0.0, 0.0], [1.0, 0.0]], {
            withLabel: false
        });
        yAxis = board.create('axis', [[0.0, 0.0], [0.0, 1.0]], {
            withLabel: false
        });

        xOffset1 = Math.abs(boundingBox[2] - boundingBox[0]) / 100.0;
        yOffset1 = Math.abs(boundingBox[3] - boundingBox[1]) / 25.0;
        xOffset2 = Math.abs(boundingBox[2] - boundingBox[0]) / 50.0;
        yOffset2 = Math.abs(boundingBox[3] - boundingBox[1]) / 50.0;

        xAxisLabel = board.create('text', [boundingBox[2] - xOffset1, yOffset1, table.headers[table.xColumn]], {
            anchorX: 'right',
            fixed:true
        });
        yAxisLabel = board.create('text', [xOffset2, boundingBox[1] - yOffset2, table.headers[table.yColumn]], {
            anchorX: 'left',
            fixed:true
        });
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
            $("#table-tabs").tabs();
        }
        else {
            panel = $('<div class="half-line ui-tabs-panel" />');
            $('.control-panel').append(panel);
            // Last minute hack to get the table resize when browser window does
            singleTable = createTabContent(panel, tables[0]);
            singleTableEl = $(singleTable.rootElement);
        }
    }

    function createTab(table) {
        var tabPanel = $("#table-tabs"),
            tabTitle = tabPanel.children('ul'),
            tab = $('<div id="tab-' + table.id + '" />');
        // Append tab title
        tabTitle.append('<li><a href="#tab-' + table.id + '">' + table.name + '</a></li>');
         // Append tab
        tabPanel.append(tab);
        // Append tab content
        createTabContent(tab, table);
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
                '<button class="button" id="fit-line-' + table.id + '" disabled>Fit Line</button>',
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
            try {
                fitLine(table);
            }
            catch (err) {
                window.alert(err.toString());
            }
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

    function createChooseColumnsDialog() {
        var index = getActiveTable(),
            optionsHtmlFragment = '', htmlFragment, el, text;

        el = $('<div/>');

        _.each(tables[index].headers, function(header) {
            // Last minute hack, strip HTML from headers.
            el.html(header);
            text = el.text();
            optionsHtmlFragment += '<option>' + text + '</option>';
            textHeaders.push(text);
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

        $("#x-column").selectmenu({
            width: 300,
        });

        $("#y-column").selectmenu({
            width: 300,
        });

        $("#x-column").val(textHeaders[tables[index].xColumn]);
        $("#x-column").selectmenu("refresh");

        $("#y-column").val(textHeaders[tables[index].yColumn]);
        $("#y-column").selectmenu("refresh");
    }

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

    function openChooseColumnsDialog() {
        createChooseColumnsDialog();
        chooseColumnsDialog.dialog('open');
    }

    function okChooseColumnsDialog() {
        var xColumnSelectedItem = $("#x-column").val(),
            yColumnSelectedItem = $("#y-column").val(),
            index = getActiveTable();
        tables[index].xColumn = textHeaders.indexOf(xColumnSelectedItem);
        tables[index].yColumn = textHeaders.indexOf(yColumnSelectedItem);
        chooseColumnsDialog.dialog('close');
    }

    function cancelChooseColumnsDialog() {
        chooseColumnsDialog.dialog('close');
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

    function plotTable(table) {
        var fitLineBtn = $('#fit-line-' + table.id);
        setBoundingBox(table);
        clearBoard();
        createBoard(table);
        plotData(table);
        fitLineBtn.attr('disabled', false);
    }

    function fitLine(table) {
        var f, m, b, vals, xVals, yVals, regLineEq;

        setBoundingBox(table);
        clearBoard();
        createBoard(table);
        plotData(table);

        regLineEq = $('#reg-line-eq-' + table.id);
        vals = getXYVals(table);
        validatePlottedColumns(vals);
        xVals = vals.xVals;
        yVals = vals.yVals;

        if (xVals.length > 1 && yVals.length > 1) {
            f = JXG.Math.Numerics.regressionPolynomial(1, xVals, yVals);
            // f.getTerm()); => doesn't work!
            // Calculate parameters of line manually, y = mx + b
            b = f(0.0);
            m = f(1.0) - b;
            regLineEq.html('y = ' + m.toFixed(table.fitLine.precision) + 'x + ' +  b.toFixed(table.fitLine.precision));
            regLineEq.css('color', table.fitLine.color);
            board.create(
                'functiongraph',
                [f],
                {strokeWidth: 3, strokeColor: table.fitLine.color, highlight: false}
            );
        }
    }

    function plotData(table) {
        var i, j, row;

        for (i = 0; i < table.data.length; i++) {
            row = table.data[i];
            board.create('point', [row[table.xColumn], row[table.yColumn]], {
                fixed: true,
                name: '',
                strokeColor: table.dataPoints.color,
                fillColor: table.dataPoints.color
            });
        }
    }

    function validatePlottedColumns(vals) {
        var msg1 = 'Some cells contain invalid data marked in red and the data could not be plotted.' +
                   ' Please enter numeric values only and try again.',
            xVals = [], yVals = [];

        // Check if the values are numeric or empty
        _.each(vals.xVals, function(val, index) {
            if (!_.isFinite(val) && !_.isEmpty(val)) {
                throw msg1;
            }
        });

        _.each(vals.yVals, function(val, index) {
            if (!_.isFinite(val) && !_.isEmpty(val)) {
                throw msg1;
            }
        });

        // Only keep rows that contain two valid cells
        _.each(vals.xVals, function(val, index) {
            if (_.isFinite(val) && _.isFinite(vals.yVals[index])) {
                xVals.push(val);
                yVals.push(vals.yVals[index]);
            }
        });
        vals.xVals = xVals;
        vals.yVals = yVals;
    }

    function getXYVals(table) {
        var i, j, xVals = [], yVals = [];

        for (i = 0; i < table.data.length; i++) {
            xVals.push(table.data[i][table.xColumn]);
            yVals.push(table.data[i][table.yColumn]);
        }

        return {
            'xVals': xVals,
            'yVals': yVals
        }
    }

    function getXYBounds(table) {
        var i, j, vals, xVals = [], yVals = [];

        vals = getXYVals(table);
        validatePlottedColumns(vals);
        xVals = vals.xVals;
        yVals = vals.yVals;

        if (_.isEmpty(xVals) || _.isEmpty(yVals)) {
            return null;
        }
        else {
            return {
                'xMin': Math.min.apply(null, xVals),
                'xMax': Math.max.apply(null, xVals),
                'yMin': Math.min.apply(null, yVals),
                'yMax': Math.max.apply(null, yVals)
            }
        }
    }

    function setBoundingBox(table) {
        var bounds, xMin, yMin, xSpan, ySpan, xOffset, yOffset;

        bounds = getXYBounds(table);

        if (bounds != null) {
            xSpan = Math.abs(bounds.xMax - bounds.xMin);
            ySpan = Math.abs(bounds.yMax - bounds.yMin);
            xOffset = xSpan / 5.0;
            yOffset = ySpan / 5.0;

            xOffset = xOffset === 0.0 ? 1.0 : xOffset;
            yOffset = yOffset === 0.0 ? 1.0 : yOffset;

            xMin = Math.min(0.0, bounds.xMin); // Get the y-axis in the plotting range
            yMin = Math.min(0.0, bounds.yMin); // Get the x-axis in the plotting range

            boundingBox = [xMin - xOffset, bounds.yMax + yOffset, bounds.xMax + xOffset, yMin - yOffset];
        }
        else {
            boundingBox = [-11.0, 11.0, 11.0, -11.0];
        }
    }

    function clearBoard() {
        JXG.JSXGraph.freeBoard(board);
    }

    function getActiveTable() {
        return tables.length > 1 ? $("#table-tabs").tabs('option', 'active') : 0;
    }

    function resetCellsBoard() {
        var data, tableIndex = getActiveTable();

        // Deep clone relevant table
        $.extend(true, tables[tableIndex], config.tables[tableIndex]);

        data = tables[tableIndex].data;

        // Update table display
        tables[tableIndex].htmlTable.loadData(data);

        if (config.render) {
            plotTable(tables[tableIndex]);
        }
    }

    function clearRegLineEq() {
        var table, tableIndex = getActiveTable();

        table = tables[tableIndex];

        $('#fit-line-' + table.id).attr('disabled', true);
        $('#reg-line-eq-' + table.id).html('');
    }

    function reset() {
        clearRegLineEq();
        resetCellsBoard();
        plotTable(tables[getActiveTable()]);
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
