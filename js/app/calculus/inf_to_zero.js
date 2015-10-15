var DataEntry = (function($, _, JXG, undefined) {
    'use strict';

    var x0Slider, x0SliderValue,

        fFn = [f0, f1],
        gFn = [g0, g1],
        fpowgFn = [fpowg0, fpowg1],
        fFnStr  = ['\\frac{x}{2} + 1', 'e^{2x}+1'],
        gFnStr  = ['\\frac{1}{x}', '\\frac{1}{x}'],
        fpowgFnStr = ['(\\frac{x}{2} + 1)^{\\frac{1}{x}}', '(e^{2x} + 1)^{\\frac{1}{x}}'],

        config = window.infToZeroSettings || {
            fnNbr: 0,
            x0: 1.0,
            x0Min: 0.0,
            x0Max: 6.0,
            x0Step: 0.01,
        },
        fnNbr = config.fnNbr,
        x0 = config.x0,
        x0Min = config.x0Min,
        x0Max = config.x0Max,
        x0Step = config.x0Step,

        f = fFn[fnNbr],
        fStr = fFnStr[fnNbr],
        g = gFn[fnNbr],
        gStr = gFnStr[fnNbr],
        fpowg = fpowgFn[fnNbr],
        fpowgStr = fpowgFnStr[fnNbr];

    init();

    function init() {
        $('#dnext-about-link').on('click', toggle);

        createSlider();
        outputStaticMath();
        outputDynamicMath();
    }

    function toggle() {
        var link = $('#dnext-about-link'),
            text = $('#dnext-about-text');

        text.toggle();

        if (text.css('display') === 'none') {
            link.text('+ about');
        }
        else {
            text.css('display', 'block');
            link.text('- about');
        }
    }

    function createSlider() {
        x0SliderValue = $('#x0-slider-value');
        x0Slider = $('#x0-slider');
        x0Slider.slider({
            min: x0Min,
            max: x0Max,
            step: x0Step,
            value: x0,
            slide: function(event, ui) {
                x0 = ui.value;
                if (x0 === 0.0) {
                    x0 = 1.0;
                }
                outputDynamicMath();
            }
        });
    }

    function outputStaticMath() {
        katex.render('f(x) = ' +  fStr, $('#math-line1').get(0));
        katex.render('g(x) = ' +  gStr, $('#math-line2').get(0));
        katex.render('(f(x))^{g(x)} = ' + fpowgStr, $('#math-line3').get(0));
        if (fnNbr === 1) {
            katex.render('e^2 \\approx 7.3890561', $('#math-line8').get(0));
        }
    }

    function outputDynamicMath() {
        katex.render(x0Str(), $('#x0-slider-value').get(0));
        katex.render('x = ' + x0Str(), $('#math-line4').get(0));
        katex.render('f(x) = ' + fx0Str(), $('#math-line5').get(0));
        katex.render('g(x) = ' + gx0Str(), $('#math-line6').get(0));
        katex.render('(f(x))^{g(x)} = ' + fpowgx0Str(), $('#math-line7').get(0));
    }

    function x0Str() {
        return numberToString(x0);
    }

    function fx0Str() {
        return numberToString(f(x0));
    }

    function gx0Str() {
        return numberToString(g(x0));
    }

    function fpowgx0Str() {
        return fnNbr === 0 ? numberToString(fpowg(x0)) : fpowg(x0).toFixed(7);
    }

    // Functions
    function f0(x) {
        return x/2.0 + 1.0;
    }

    function f1(x) {
        return Math.exp(2.0*x) + 1.0;
    }

    function g0(x) {
        return 1.0/x;
    }

    function g1(x) {
        return 1.0/x;
    }

    function fpowg0(x) {
        return Math.pow((x/2.0 + 1), 1.0/x);
    }

    function fpowg1(x) {
        return Math.pow(Math.exp(2.0*x) + 1.0, 1.0/x);
    }

    function numberToString(nbr) {
        // Do not use scientific notation when numbers strictly superior to 10^{-5} and stricly inferior to 10^{6}
        // Limit total display to 6 digits
        var precision, str, eIndex, exponentSign, mantissa, exponent;

        if (0.00001 < nbr && nbr < 1000000) {
            precision = 5 - Math.floor(JXG.Math.log10(Math.abs(nbr)));
            str = nbr.toFixed(precision);
            return parseFloat(str).toString(); // Removes insignificant trailing zeroes
        }
        else {
            str = nbr.toExponential(5);
            eIndex = str.indexOf('e');
            mantissa = str.slice(0, eIndex);
            mantissa = parseFloat(mantissa).toString(); // Removes insignificant trailing zeroes
            exponentSign = str.charAt(eIndex+1);
            exponentSign = exponentSign === '+' ? '' : '-';
            exponent = str.slice(eIndex+2);
            return mantissa + '\\times' + '10^{' + exponentSign + exponent + '}';
        }
    }

    return {
        // Any field and/or method that needs to be public
    };
})(jQuery, _, JXG);
