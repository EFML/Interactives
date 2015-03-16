var GraphingCalculator = (function($, _, MathJax, JXG, undefined) {
    'use strict';
    var initBoundingBox = [-11, 11, 11, -11];
    var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: initBoundingBox, axis: true, showCopyright: false});
    var fCurves = [], dfCurves = [], tangents = [], mainMathjaxOutput = null, plots = [],
    // http://www.w3schools.com/cssref/css_colornames.asp
    plotColors = [
        'Crimson', 'MediumSeaGreen', 'RoyalBlue', 'Orange', 'Turquoise'
    ],
    plotNames = ['1', '2', '3', '4', '5'];

    init();

    function init() {
        // Check version of JQuery
        // Studio and LMS: 1.7.2
        // Current: 2.1.3
        console.log($.fn.jquery);
        // Check version of UnderscoreJS
        // Studio and LMS: 1.4.4
        // Current: 1.8.2
        console.log(window.parent._.VERSION);
        // Check version of jQuery UI
        // Studio and LMS: 1.10.0
        // Current: 1.11
        console.log($.ui.version);
        // Check version of MathJax
        // Studio and LMS use CDN and are up to date with current version 2.5.1
        console.log(MathJax.cdnVersion);

        // Set up MathJax
        MathJax.Hub.queue.Push(function () {
            mainMathjaxOutput = MathJax.Hub.getAllJax("#main-mathjax-output")[0];
        });

        $('#plot').on('click', plotter);
        $('#clear-all').on('click', clearAll);
        $('#main-mathjax-input').on('input', updateMainMathjaxOutput);
        $(window).on('resize', resizeBox);
    }

    function resizeBox(){
        var boardWidth = 0.58*$('#gc-container').width();
        board.needsFullUpdate = true;
        board.resizeContainer(boardWidth, board.canvasHeight);
        board.setBoundingBox(initBoundingBox);
        board.update();
    }

    function updateMainMathjaxOutput() {
        MathJax.Hub.queue.Push(['Text', mainMathjaxOutput, 'f(x) = ' + $(this).val()]);
    }

    function createTab(plot) {
        var functionCb, derivativeCb, tangentCb, deleteBt, mathInput, mathOutput,
            tabPanel = $("#function-tabs"),
            tabList = $("#function-tabs ul"),
            currentTab = tabPanel.find('li').length,
            htmlFragment = [
            '<div id="tab-' + plot.id + '">',
                //'<i class="fa fa-trash"></i>',
                '<span class="gc-mathjax-output" id="mathjax-output-' + plot.id + '">``</span>',
                '<div class="half-line">',
                    '<input type="checkbox" id="show-function-' + plot.id + '" checked>',
                    '<label for="show-function-' + plot.id + '">',
                        '<i class="fa fa-square-o"></i><i class="fa fa-check-square-o"></i>Show f(x)',
                    '</label>',
                '</div>',
                '<div class="quarter-line">',
                    '<input type="checkbox" id="show-derivative-' + plot.id + '">',
                    '<label for="show-derivative-' + plot.id + '">',
                        '<i class="fa fa-square-o"></i><i class="fa fa-check-square-o"></i>Show derivative',
                    '</label>',
                '</div>',
                '<div class="quarter-line">',
                    '<input type="checkbox" id="show-tangent-' + plot.id + '">',
                    '<label for="show-tangent-' + plot.id + '">',
                        '<i class="fa fa-square-o"></i><i class="fa fa-check-square-o"></i>Show tangent',
                    '</label>',
                '</div>',
                '<div class="quarter-line">',
                    '<button class="button" id="delete-function-' + plot.id + '">' + '<i class="fa fa-trash"></i></button>',
                '</div>',
            '</div>'
        ].join('');

        // Append tab title
        tabList.append(
            '<li><a href="#tab-' + plot.id + '">#' + plot.name + '</a></li>'
        );
        // Append tab content
        tabPanel.append(htmlFragment);
        // Initialize or refresh tab panel
        if (currentTab === 0) {
            tabPanel.tabs();
            tabPanel.find('.ui-tabs-nav').sortable({
                axis: 'x',
                stop: function() {
                    tabPanel.tabs('refresh');
                }
            });
        }
        else {
            tabPanel.tabs('refresh');
        }
        // Set active tab to last
        tabPanel.tabs('option', 'active', currentTab);

        // Display specific mathjax output in tab
        mathInput = $('#main-mathjax-input');
        mathOutput = $('#mathjax-output-' + plot.id);
        mathOutput.html('`f_' + plot.name + '(x) = ' + mathInput.val() + '`')
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'mathjax-output-' + plot.id]);
        mathOutput.css('color', plot.color);

        // Add event listeners to checkboxes
        functionCb = $('#show-function-' + plot.id);
        functionCb.on('change', function() {
            setVisibility($(this), plot.fCurve);
        });

        derivativeCb = $('#show-derivative-' + plot.id);
        derivativeCb.on('change', function() {
            setVisibility($(this),  plot.dfCurve);
        });

        tangentCb = $('#show-tangent-' + plot.id);
        tangentCb.on('change', function() {
            setVisibility($(this), plot.tangentPoint);
            setVisibility($(this), plot.tangentLine);
        });

        deleteBt = $('#delete-function-' + plot.id);
        deleteBt.on('click', function() {
            var plotIndex;
            if (tabPanel.find('.ui-tabs-nav li').length !== 1) {
                tabPanel.find('.ui-tabs-nav li').children('a[href="#tab-' + plot.id + '"]').parent().remove();
                tabPanel.find('#tab-' + plot.id).remove();
                tabPanel.tabs("refresh");

                // Remove all plot elements from board
                board.removeObject(plot.fCurve);
                board.removeObject(plot.dfCurve);
                board.removeObject(plot.tangentPoint);
                board.removeObject(plot.tangentLine);

                // Delete plot from plots array
                plotIndex = _.indexOf(_.pluck(plots, 'id'), plot.id);
                plots.splice(plotIndex, 1);
            }
            else {
                clearAll();
            }
        });
    }

    function getUsedColors() {
        var colors = [];
        _.each(plots, function(plot) {
            colors.push(plot.color);
        });
        return colors;
    }

    function getUsedNames() {
        var names = [];
        _.each(plots, function(plot) {
            names.push(plot.name);
        });
        return names;
    }

    function setVisibility(checkbox, element) {
        var checked = !_.isUndefined(checkbox.attr('checked'));

        if (checked) {
            element.showElement();
        }
        else {
            element.hideElement();
        }
    }

    function plotter() {
        var inputText = $('#main-mathjax-input').val(),
            f = board.jc.snippet(inputText, true, 'x', true),
            plot, fCurve, dfCurve, tangentPoint, tangentLine,
            availableColors = _.difference(plotColors, getUsedColors()),
            availableNames = _.difference(plotNames, getUsedNames());

        if (JXG.isFunction(f) && availableColors.length > 0) {
            // Add curve
            fCurve = board.create(
                'functiongraph',
                [f],
                {strokeWidth: 3, strokeColor: availableColors[0]}
            );

            // Add derivative
            dfCurve = board.create(
                'functiongraph',
                [JXG.Math.Numerics.D(f)],
                {dash:2, strokeColor: availableColors[0]}
            );

            // Add point and tangent line at that point
            tangentPoint = board.create(
                'glider',
                [1.0, 0.0, fCurve],
                {name: 'drag me', strokeColor: availableColors[0], fillColor: availableColors[0]}
            );
            tangentLine = board.create(
                'tangent',
                [tangentPoint],
                {name: 'drag me', strokeColor: 'rgb(0, 0, 0)'}
            );

            plot = {
                'id': _.uniqueId(),
                'name': availableNames[0],
                'color': availableColors[0],
                'fCurve': fCurve,
                'dfCurve': dfCurve,
                'tangentPoint': tangentPoint,
                'tangentLine': tangentLine
            };
            // Set visibility of all elements
            plot.fCurve.showElement();
            _.invoke([plot.dfCurve, plot.tangentPoint, plot.tangentLine], 'hideElement');
            plots.push(plot);

            createTab(plot);
        }
    }

    function clearAll() {
        var tabPanel = $("#function-tabs");
        JXG.JSXGraph.freeBoard(board);
        board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: initBoundingBox, axis: true, showCopyright: false});
        plots.length = 0;
        tabPanel.tabs( "destroy" );
        tabPanel.contents().each(function() {
            $(this).remove();
        });
        tabPanel.append('<ul></ul>');
    }

    // Not in use for the moment
    function findZeroes() {
        var zeroraw = $('#inputZstart').val();
        if (JXG.isFunction(f) && isNumeric(zeroraw)) {
            board.suspendUpdate();
            var zero = JXG.Math.Numerics.fzero(f,parseFloat(zeroraw));
            var f_zero = f(zero);
            var p = board.create(
                'point',
                [zero, f_zero],
                {name: 'f(x='+zero.toFixed(2)+')=0.0', strokeColor: 'gray', face: '<>', fixed: true}
            );
            board.unsuspendUpdate();
        }
    }

    // Not in use for the moment
    function isNumeric(num){
        return !isNaN(num)
    }

    return {
        // Any field/method that needs to be public
    };
})(window.parent.jQuery, window.parent._, MathJax, JXG);