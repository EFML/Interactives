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
            		color: 'MediumSeaGreen'
            	},
                readOnly: false
          	}
        ],
        render: true
    };

    var tables = [],
        boundingBox = [-11.0, 11.0, 11.0, -11.0],
        board, chooseColumnsDialog, resetDialog,
        precision = 3;

    init();

    function init() {
        createChannel();

        // Deep clone config.tables
        $.extend(true, tables, config.tables);

        $(window).on('resize', resizeBox);
    }

    function resizeBox(){
        var boardWidth = $('.container').width();
        board.needsFullUpdate = true;
        board.resizeContainer(boardWidth, board.canvasHeight);
        board.setBoundingBox(boundingBox);
        board.update();
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
            createTabContent(panel, tables[0]);
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

    function cellValidator(value, callback) {
        if (_.isFinite(value) || _.isEmpty(value)) {
            callback(true);
        }
        else {
            callback(false);
        }
    }

    function createTabContent(container, table) {
        var chooseColumnsBt, plotTableBt, fitLineBtn, resetBtn, htmlFragment, columns = [];

        htmlFragment = [
            '<div class="half-line">',
                '<div id="table-' + table.id + '" />',
            '</div>',
            '<div class="half-line" id="reg-line-eq-' + table.id + '" />',
            '<div class="full-line">',
                '<button class="button" id="choose-columns-' + table.id + '">Choose Columns</button>',
                '<button class="button" id="plot-table-' + table.id + '">Plot Table</button>',
                '<button class="button" id="fit-line-' + table.id + '" disabled>Fit Line</button>',
                '<button class="button" id="reset-' + table.id + '">Reset</button>',
            '</div>',
            '<div class="half-line" />'
            ].join('');
        // Append tab content to container
        container.append(htmlFragment);
        // Generate columns array
        _.each(table.headers, function() {
            columns.push({
                validator: cellValidator,
                allowInvalid: true
            });
        });
        // Generate handsontable
        table.htmlTable = new Handsontable($('#table-' + table.id).get(0), {
            data: table.data,
            colHeaders: table.headers,
            columns: columns,
            height: 280,
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

        resetBtn = $('#reset-' + table.id);
        resetBtn.on('click', function() {
            openResetDialog();
        });
    }

    function createChooseColumnsDialog() {
        var index = getActiveTable(),
            optionsHtmlFragment = '', htmlFragment;

        _.each(tables[index].headers, function(header) {
            optionsHtmlFragment += '<option>' + header + '</option>';
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
                title: 'Warning',
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

        $("#x-column").val(tables[index].headers[tables[index].xColumn]);
        $("#x-column").selectmenu("refresh");

        $("#y-column").val(tables[index].headers[tables[index].yColumn]);
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

        tables[index].xColumn = tables[index].headers.indexOf(xColumnSelectedItem);
        tables[index].yColumn = tables[index].headers.indexOf(yColumnSelectedItem);
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
        xVals = vals.xVals;
        yVals = vals.yVals;

         if (xVals.length > 1 && yVals.length > 1) {
            f = JXG.Math.Numerics.regressionPolynomial(1, xVals, yVals);
            // f.getTerm()); => doesn't work!
            // Calculate parameters of line manually, y = mx + b
            b = f(0.0);
            m = f(1.0) - b;
            regLineEq.html('y = ' + m.toFixed(precision) + 'x + ' +  b.toFixed(precision));
            regLineEq.css('color', table.fitLine.color);
            board.create(
                'functiongraph',
                [f],
                {strokeWidth: 3, strokeColor: table.fitLine.color}
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
        var msg = 'Some cells contain invalid data marked in red and the data could not be plotted.' +
        ' Please enter numeric values only and try again.'

        _.each(vals.xVals, function(val, index) {
            if (!_.isFinite(val) && !_.isEmpty(val)) {
                throw msg;
            }
        });

        _.each(vals.yVals, function(val, index) {
            if (!_.isFinite(val) && !_.isEmpty(val)) {
                throw msg;
            }
        });
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

    // Establish a channel to communicate with edX when the application is used
    // inside a JSInput and hosted completely on a different domain.
    function createChannel() {
        var channel,
            msg = 'The application is not embedded in an iframe. ' +
                  'A channel could not be established';

        // Establish a channel only if this application is embedded in an iframe.
        // This will let the parent window communicate with the child window using
        // RPC and bypass SOP restrictions.
        if (window.parent !== window) {
            channel = Channel.build({
                window: window.parent,
                origin: '*',
                scope: 'JSInput'
            });

            channel.bind('getGrade', getGrade);
            channel.bind('getState', getState);
            channel.bind('setState', setState);
        }
        else {
            console.log(msg);
        }
    }

    function getState() {
        return JSON.stringify({data: tables[0].data});
    }

    // Transaction object argument is not used here
    // (see http://mozilla.github.io/jschannel/docs/)
    function setState(transaction, stateStr) {
        var state = JSON.parse(stateStr);
        // Erase and deep clone
        tables[0].data.length = 0;
        $.extend(true, tables[0].data, state.data);

        setTableIds();
        createTabPanel();
        createBoard(tables[0]);
        createResetDialog();

        if (config.render) {
            plotTable(tables[0]);
        }
    }

    function getGrade() {
        // The following return value may or may not be used to grade server-side.
        // If getState and setState are used, then the Python grader also gets
        // access to the return value of getState and can choose it instead to grade
        return JSON.stringify({data: tables[0].data});
    }

    return {
        // Any field and/or method that needs to be public
        getState: getState,
        setState: setState,
        getGrade: getGrade
    };
})(jQuery, _, JXG);
