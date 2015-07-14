var GraphingCalculator = (function($, _, MathJax, JXG, undefined) {
    'use strict';
    var initBoundingBox = [-11, 11, 11, -11];
    var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: initBoundingBox, axis: true, showCopyright: false});
    var fCurves = [], dfCurves = [], tangents = [], mainMathjaxOutput = null, plots = [],
    // http://www.w3schools.com/cssref/css_colornames.asp
    plotColors = [
        'Crimson', 'MediumSeaGreen', 'RoyalBlue', 'Orange', 'Turquoise'
    ],
    plotNames = ['1', '2', '3', '4', '5'],
    precision = 3, epsilon = Math.pow(10.0, -precision);

    init();

    function init() {
        // Check version of JQuery
        // Studio and LMS: 1.7.2
        // Current: 2.1.3
        console.log('JQuery version:' + $.fn.jquery);
        // Check version of UnderscoreJS
        // Studio and LMS: 1.4.4
        // Current: 1.8.2
        console.log('UnderscoreJS version: ' + _.VERSION);
        // Check version of jQuery UI
        // Studio and LMS: 1.10.0
        // Current: 1.11
        console.log('JQuery UI version: ' + $.ui.version);
        // Check version of MathJax
        // Studio and LMS use CDN and are up to date with current version 2.5.1
        console.log('MathJax CDN version: ' + MathJax.cdnVersion);
        // Check version of JSXGraph:
        // Current: 0.99.3
        console.log('JSXGraph version: ' + JXG.version);

        // Redefine some constants in board.jc
        delete board.jc.builtIn.EULER;
        delete board.jc.builtIn.PI;
        board.jc.builtIn.pi = Math.PI;
        board.jc.builtIn.e = Math.E;

        // Set up MathJax
        MathJax.Hub.queue.Push(function () {
            mainMathjaxOutput = MathJax.Hub.getAllJax("#main-mathjax-output")[0];
        });

        $('#plot').on('click', plotter);
        $('#clear-all').on('click', clearAll);
        $('#main-mathjax-input').on('input', updateMainMathjaxOutput);
        $('#main-mathjax-input').on('dblclick', preventDoubleClickDefault);
        $(window).on('resize', resizeBox);
    }

    function resizeBox(){
        var boardWidth = 0.58*$('.container').width();
        board.needsFullUpdate = true;
        board.resizeContainer(boardWidth, board.canvasHeight);
        board.setBoundingBox(initBoundingBox);
        board.update();
    }

    // On Mac OSX, double clicking the equation input to select all the text will make the browser go to top of the page.
    // Avoid this behavior.
    function preventDoubleClickDefault(event){
        event.preventDefault();
    }

    function updateMainMathjaxOutput() {
        MathJax.Hub.queue.Push(['Text', mainMathjaxOutput, 'f(x) = ' + $(this).val()]);
    }

    function createTab(plot) {
        var functionCb, derivativeCb, tangentCb,
            deleteBt, findZeroBtn, findDerivativeBtn, findIntegralBtn, mathInput, mathOutput,
            tabPanel = $("#function-tabs"),
            tabList = $("#function-tabs ul"),
            currentTab = tabPanel.find('li').length,
            htmlFragment = [
            '<div id="tab-' + plot.id + '">',
                '<div class="mathjax-output" id="mathjax-output-' + plot.id + '">``</div>',
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
                '<div class="half-line">',
                    '<span class="regular-text">x<sub>1</sub> = <input type="text" class="regular-text" id="x-start-' + plot.id + '"></span>',
                    '<span class="regular-text">x<sub>2</sub> = <input type="text" class="regular-text" id="x-end-' + plot.id + '"></span>',
                '</div>',
                '<div class="half-line">',
                    '<button class="button" id="find-zero-' + plot.id + '">Zero</button>',
                    '<button class="button" id="find-derivative-' + plot.id + '">Derivative</button>',
                    '<button class="button" id="find-integral-' + plot.id + '">Integral</button>',
                    '<button class="button" id="delete-function-' + plot.id + '">' + '<i class="fa fa-trash"></i></button>',
                '</div>',
                '<div class="full-line">',
                    '<span class="mathjax-output" id="mathjax-output-secondary-' + plot.id + '"></span>',
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
        mathOutput.html('`f_' + plot.name + '(x) = ' + mathInput.val() + '`');
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

        findZeroBtn = $('#find-zero-' + plot.id);
        findZeroBtn.on('click', function() {
            findZero(plot);
        });

        findDerivativeBtn = $('#find-derivative-' + plot.id);
        findDerivativeBtn.on('click', function() {
            findDerivative(plot);
        });

        findIntegralBtn = $('#find-integral-' + plot.id);
        findIntegralBtn.on('click', function() {
            findIntegral(plot);
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
        if (checkbox.prop('checked')) {
            element.showElement();
        }
        else {
            element.hideElement();
        }
    }

    function plotter() {
        var fStr = $('#main-mathjax-input').val(), f,
            plot, fCurve, dfCurve, tangentPoint, tangentLine,
            availableColors = _.difference(plotColors, getUsedColors()),
            availableNames = _.difference(plotNames, getUsedNames());

        $('.error-message').hide();
        try {
            f = board.jc.snippet(fStr, true, 'x', true);

            if (availableColors.length > 0) {
                // Add curve
                fCurve = board.create(
                    'functiongraph',
                    [f],
                    {highlight: false, strokeWidth: 3, strokeColor: availableColors[0]}
                );

                // Add derivative
                dfCurve = board.create(
                    'functiongraph',
                    [JXG.Math.Numerics.D(f)],
                    {highlight: false, dash:2, strokeColor: availableColors[0]}
                );

                // Add point and tangent line at that point.
                // Extra check here as entering something like f(x) = x/0 throws an exception that is not caught.

                if (_.isFinite(f(1.0))) {
                    tangentPoint = board.create(
                        'glider',
                        [1.0, 0.0, fCurve],
                        {name: 'drag me', strokeColor: availableColors[0], fillColor: availableColors[0]}
                    );

                    tangentLine = board.create(
                        'tangent',
                        [tangentPoint],
                        {highlight: false, name: 'drag me', strokeColor: 'rgb(0, 0, 0)'}
                    );
                }
                else {
                    throw new UserException('Invalid function.');
                }

                plot = {
                    'id': _.uniqueId(),
                    'fStr': fStr,
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
        catch (e) {
            $('.error-message').text('Invalid function.').show();
        }
    }

    function clearAll() {
        var tabPanel = $("#function-tabs");
        if (plots.length > 0) {
            JXG.JSXGraph.freeBoard(board);
            board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: initBoundingBox, axis: true, showCopyright: false});
            plots.length = 0;
            tabPanel.tabs( "destroy" );
            tabPanel.contents().each(function() {
                $(this).remove();
            });
            tabPanel.append('<ul></ul>');
        }
    }

    function findZero(plot) {
        var x1Str = $('#x-start-' + plot.id).val(),
            f, x1, zero, mathOutput;
        $('.error-message').hide();

        try {
            f = board.jc.snippet(plot.fStr, true, 'x', true);
            x1 = parseNumber(x1Str);
            if (_.isFinite(x1)) {
                mathOutput = $('#mathjax-output-secondary-' + plot.id);
                zero = JXG.Math.Numerics.fzero(f, x1);
                mathOutput.html('`f_' + plot.name + '(' + numberToString(zero) + ') = 0`');
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'mathjax-output-secondary-' + plot.id]);
                mathOutput.css('color', plot.color);
            }
            else {
                throw new UserException('Invalid starting point for zero search.');
            }
        }
        catch (e) {
            $('.error-message').text(e.message).show();
        }
    }

    function findDerivative(plot) {
        var x0Str = $('#x-start-' + plot.id).val(),
            x0, f, df, dfx0, mathOutput;
        $('.error-message').hide();

        try {
            f = board.jc.snippet(plot.fStr, true, 'x', true);
            df = JXG.Math.Numerics.D(f);
            x0 = parseNumber(x0Str);
            if (_.isFinite(x0)) {
                dfx0 = df(x0);
                mathOutput = $('#mathjax-output-secondary-' + plot.id);
                mathOutput.html(
                    '`(df_' + plot.name + ')/dt (' + numberToString(x0) +' ) = ' + numberToString(dfx0) + '`'
                );
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'mathjax-output-secondary-' + plot.id]);
                mathOutput.css('color', plot.color);
            }
            else {
                throw new UserException('Invalid point for derivative evaluation.');
            }
        }
        catch (e) {
            $('.error-message').text(e.message).show();
        }
    }

    function findIntegral(plot) {
        var x1Str = $('#x-start-' + plot.id).val(),
            x2Str = $('#x-end-' + plot.id).val(),
            x1, x2, f, intfx1x2, mathOutput;
        $('.error-message').hide();

        try {
            f = board.jc.snippet(plot.fStr, true, 'x', true);
            x1 = parseNumber(x1Str);
            x2 = parseNumber(x2Str);
            if (_.isFinite(x1) && _.isFinite(x2)) {
                intfx1x2 = JXG.Math.Numerics.I([x1, x2], f);
                mathOutput = $('#mathjax-output-secondary-' + plot.id);
                mathOutput.html(
                    '`int_' + numberToString(x1) + '^' + numberToString(x2) + 'f_' + plot.name + '(x)dx = ' +
                    numberToString(intfx1x2) + '`'
                );
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'mathjax-output-secondary-' + plot.id]);
                mathOutput.css('color', plot.color);
            }
            else {
                throw new UserException('Invalid point for definite integral evaluation.');
            }
        }
        catch (e) {
            $('.error-message').text(e.message).show();
        }
    }

    // To evaluate expression in x_1 and x_2 that contain pi and e
    function parseNumber(nbrStr) {
        var fNbr = board.jc.snippet(nbrStr, true, '', true);
        return fNbr();
    }

    function numberToString(nbr) {
        // All number smaller than display precision are rounded to zero to avoid strings like '-0.000'
        nbr = Math.abs(nbr) < epsilon ? 0.0 : nbr;

        return nbr.toFixed(precision);
    }

    function UserException(message) {
        this.message = message;
        this.name = "UserException";
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, MathJax, JXG);

