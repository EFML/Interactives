(function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        ////////////
        // BOARD 1
        ////////////

        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-1.75, 12, 12, -1.0],
            xname: ' ',
            yname: 'Price<br>( $/&euro; )',
            grid: false
        });
    }

    init();
    MacroLib.onLoadPostMessage();

})(JXG, MacroLib, undefined);
