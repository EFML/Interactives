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
        var boardWidth = 0.58*$('.gc-container').width();
        board.needsFullUpdate = true;
        board.resizeContainer(boardWidth, board.canvasHeight);
        board.setBoundingBox(initBoundingBox);
        board.update();
    }

    function updateMainMathjaxOutput() {
        MathJax.Hub.queue.Push(['Text', mainMathjaxOutput, 'f(x) = ' + $(this).val()]);
    }

    function createAccordeon(funcNbr) {
        var id = _.uniqueId('function-'), functionCb, derivativeCb, tangentCb, mathInput, mathOutput,
            funcNbr = $('#functions').find('h3').length,
            htmlFragment = [
            '<h3 id="toggle-function-container-' + id + '">Function</h3>',
            '<div class="gc-container" id="function-container-' + id + '">',
                '<div class="gc-mathjax-output" id="mathjax-output-' + id + '">``</div>',
                '<div class="line">',
                    '<input type="checkbox" class="gc-toggle" id="show-function-' + id + '" checked>',
                    '<label for="show-function-' + id + '">Show f(x)</label>',
                    '<input type="checkbox" class="gc-toggle" id="show-derivative-' + id + '">',
                    '<label for="show-derivative-' + id + '">Show derivative</label>',
                    '<input type="checkbox" class="gc-toggle" id="show-tangent-' + id + '">',
                    '<label for="show-tangent-' + id + '">Show tangent</label>',
                '</div>',
            '</div>'
        ].join('');

        if (funcNbr === 0) {
            $('#functions').accordion({
                active: false,
                collapsible: true
            });
        }
        $('#functions').append(htmlFragment);

        mathInput = $('#main-mathjax-input');
        mathOutput = $('#mathjax-output-' + id);
        mathOutput.html('`f_' + (funcNbr+1).toString() + '(x) = ' + mathInput.val() + '`')
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'mathjax-output-' + id]);
        mathOutput.css('color', curveColors[funcNbr]);

        functionCb = $('#show-function-' + id);
        functionCb.on('change', function() {
            setVisibility($(this), fCurves[funcNbr]);
        });

        derivativeCb = $('#show-derivative-' + id);
        derivativeCb.on('change', function() {
            setVisibility($(this), dfCurves[funcNbr]);
        });

        tangentCb = $('#show-tangent-' + id);
        tangentCb.on('change', function() {
            setVisibility($(this), tangents[funcNbr].point);
            setVisibility($(this), tangents[funcNbr].line);
        });

        $('#functions').accordion('refresh');
        $('#functions').accordion('option', 'active', funcNbr);
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

        createAccordeon(funcNbr);
    }

    function clearAll() {
        JXG.JSXGraph.freeBoard(board);
        board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox:initBoundingBox, axis:true, showCopyright:false});
        fCurves.length = 0;
        dfCurves.length = 0;
        tangents.length = 0;
        $('#functions').accordion( "destroy" );
        $('#functions').contents().each(function() {
            $(this).remove();
        });
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