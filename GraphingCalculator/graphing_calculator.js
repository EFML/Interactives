var GraphingCalculator = (function($, _, MathJax, JXG, undefined) {
    'use strict';
    var initBoundingBox = [-11, 11, 11, -11];
    var board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: initBoundingBox, axis: true, showCopyright: false});
    var fCurves = [], dfCurves = [], tangents = [], mainMathjaxOutput = null,
    // http://www.w3schools.com/cssref/css_colornames.asp
    curveColors = [
        'Crimson', 'MediumSeaGreen', 'RoyalBlue', 'Orange', 'Turquoise'
    ],
    MAX_NBR_FUNC = 5;

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

    function createTab(funcNbr) {
        var functionCb, derivativeCb, tangentCb, deleteBt, mathInput, mathOutput,
            tabPanel = $("#function-tabs"),
            tabList = $("#function-tabs ul"),
            currentFunc = tabPanel.find('li').length,
            htmlFragment = [
            '<div id="tab-' + currentFunc + '">',
                //'<i class="fa fa-trash"></i>',
                '<span class="gc-mathjax-output" id="mathjax-output-' + currentFunc + '">``</span>',
                '<div class="half-line">',
                    '<input type="checkbox" id="show-function-' + currentFunc + '" checked>',
                    '<label for="show-function-' + currentFunc + '">',
                        '<i class="fa fa-square-o"></i><i class="fa fa-check-square-o"></i>Show f(x)',
                    '</label>',
                '</div>',
                '<div class="quarter-line">',
                    '<input type="checkbox" id="show-derivative-' + currentFunc + '">',
                    '<label for="show-derivative-' + currentFunc + '">',
                        '<i class="fa fa-square-o"></i><i class="fa fa-check-square-o"></i>Show derivative',
                    '</label>',
                '</div>',
                '<div class="quarter-line">',
                    '<input type="checkbox" id="show-tangent-' + currentFunc + '">',
                    '<label for="show-tangent-' + currentFunc + '">',
                        '<i class="fa fa-square-o"></i><i class="fa fa-check-square-o"></i>Show tangent',
                    '</label>',
                '</div>',
                '<div class="quarter-line">',
                    '<button class="button" id="delete-function-' + currentFunc + '">' + '<i class="fa fa-trash"></i></button>',
                '</div>',
            '</div>'
        ].join('');

        // Append tab title
        tabList.append(
            '<li><a href="#tab-' + currentFunc + '">#' + (currentFunc+1).toString() + '</a></li>'
        );
        // Append tab content
        tabPanel.append(htmlFragment);
        // Initialize or refresh tab panel
        if (currentFunc === 0) {
            $( "#function-tabs" ).tabs();
        }
        else {
            tabPanel.tabs('refresh');
        }
        // Set active tab to last
        tabPanel.tabs('option', 'active', currentFunc);

        // Display specific mathjax output in tab
        mathInput = $('#main-mathjax-input');
        mathOutput = $('#mathjax-output-' + currentFunc);
        mathOutput.html('`f_' + (funcNbr+1).toString() + '(x) = ' + mathInput.val() + '`')
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'mathjax-output-' + currentFunc]);
        mathOutput.css('color', curveColors[funcNbr]);

        // Add event listeners to checkboxes
        functionCb = $('#show-function-' + currentFunc);
        functionCb.on('change', function() {
            setVisibility($(this), fCurves[currentFunc]);
        });

        derivativeCb = $('#show-derivative-' + currentFunc);
        derivativeCb.on('change', function() {
            setVisibility($(this), dfCurves[currentFunc]);
        });

        tangentCb = $('#show-tangent-' + currentFunc);
        tangentCb.on('change', function() {
            setVisibility($(this), tangents[currentFunc].point);
            setVisibility($(this), tangents[currentFunc].line);
        });

        deleteBt = $('#delete-function-' + currentFunc);
        deleteBt.on('click', function() {
            if (tabPanel.find('.ui-tabs-nav li').length !== 1) {
                tabPanel.find('.ui-tabs-nav li').eq(currentFunc).remove();
                tabPanel.find('#tab-' + currentFunc).remove();
                tabPanel.tabs("refresh");

                board.removeObject(fCurves[currentFunc]);
                fCurves.splice(currentFunc, 1);

                board.removeObject(dfCurves[currentFunc]);
                dfCurves.splice(currentFunc, 1);

                board.removeObject(tangents[currentFunc].point);
                board.removeObject(tangents[currentFunc].line);
                tangents.splice(currentFunc, 1);
            }
            else {
                clearAll();
            }
        });
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
            funcNbr = fCurves.length, point, line;

        if (JXG.isFunction(f) && funcNbr < MAX_NBR_FUNC) {
            // Add curve
            fCurves.push(
                board.create('functiongraph',
                    [f],
                    {strokeWidth: 3, strokeColor: curveColors[funcNbr]}
                )
            );
            // Add derivative
            dfCurves.push(
                board.create('functiongraph',
                    [JXG.Math.Numerics.D(f)],
                    {dash:2, strokeColor: curveColors[funcNbr]}
                )
            );
            // Add point and tangent line at that point
            point = board.create('glider',
                [1.0, 0.0, fCurves[funcNbr]],
                {name:'drag me', strokeColor: curveColors[funcNbr], fillColor: curveColors[funcNbr]}
            );
            line = board.create('tangent',
                [point],
                {name:'drag me', strokeColor: 'rgb(0, 0, 0)'}
            );
            tangents.push(
                {
                    'point': point,
                    'line': line
                }
            );
        }
        // Set visibility of all elements
        fCurves[funcNbr].showElement();
        _.invoke([dfCurves[funcNbr], tangents[funcNbr].point, tangents[funcNbr].line], 'hideElement');

        createTab(funcNbr);
    }

    function clearAll() {
        var tabPanel = $("#function-tabs");
        JXG.JSXGraph.freeBoard(board);
        board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:initBoundingBox, axis:true, showCopyright:false});
        fCurves.length = 0;
        dfCurves.length = 0;
        tangents.length = 0;
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
                [zero,f_zero],
                {name:'f(x='+zero.toFixed(2)+')=0.0', strokeColor:'gray', face:'<>', fixed:true}
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