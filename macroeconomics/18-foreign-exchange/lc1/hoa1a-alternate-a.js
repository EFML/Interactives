var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////

        brd1 = MacroLib.createBoard('jxgbox1', {
            xname: ' ',
            yname: 'Price<br>( $/&euro; )',
            grid: false,
            xpos: [8, -0.5],
            ypos: [-1.25, 10]
        });
    }

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
