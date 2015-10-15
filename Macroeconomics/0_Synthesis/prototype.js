var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1, brd2, brd3, brd4, brd5, brd6;

    function init() {
        MacroLib.init(MacroLib.THREE_BOARDS);

        //General Parameters for Macro
        JXG.Options.segment.strokeColor = 'Gray';
        JXG.Options.segment.strokeWidth = 5;

        ////Custom Parameters
        var bboxlimits = [-2.5, 12, 12, -2.0];

        MacroLib.labelOffset({
            'X': 65,
            'Y': 55
        });
        MacroLib.defaultXpos([6, -0.5]);
        MacroLib.defaultYpos([-2.45, 10]);

        ////////////
        // BOARD 1
        ////////////
        brd1 = MacroLib.createBoard('jxgbox1', {
            bboxlimits: bboxlimits,
            xname: 'Q Money',
            yname: 'NIR',
            grid: true
        });

        ////////////
        // BOARD 2
        ////////////
        brd2 = MacroLib.createBoard('jxgbox2', {
            bboxlimits: bboxlimits,
            xname: 'Q Bonds per Period',
            yname: 'Price<br>Bonds',
            grid: true
        });

        ////////////
        // BOARD 3
        ////////////
        brd3 = MacroLib.createBoard('jxgbox3', {
            bboxlimits: bboxlimits,
            grid: true
        });

        ////////////
        // BOARD 4
        ////////////
        brd4 = MacroLib.createBoard('jxgbox4', {
            bboxlimits: bboxlimits,
            grid: true
        });

        ////////////
        // BOARD 5
        ////////////
        brd5 = MacroLib.createBoard('jxgbox5', {
            bboxlimits: bboxlimits,
            grid: true
        });

        ////////////
        // BOARD 6
        ////////////
        brd6 = MacroLib.createBoard('jxgbox6', {
            bboxlimits: bboxlimits,
            grid: true
        });

        //Sliders
        var sliderx = brd1.create('slider', [
            [2.0, -1.25],
            [8, -1.25],
            [-1.5, 0, 1.5]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'Orange'
        });

        //Positive Slider Transformation
        var sliderPositive = brd1.create('transform', [
            function() {
                return sliderx.Value();
            },
            function() {
                return 0.0;
            }
        ], {
            type: 'translate'
        });

        //Negative Slider Transformation
        var sliderNegative = brd1.create('transform', [
            function() {
                return -sliderx.Value();
            },
            function() {
                return 0.0;
            }
        ], {
            type: 'translate'
        });

        ////////////
        // BOARD 1
        ////////////
        //Demand Board 1
        var D1 = MacroLib.createLine(brd1, {
            ltype: 'Demand',
            name: 'M<sub>D</sub>',
            color: 'DodgerBlue'
        });
        //Supply Board 1
        var S1 = MacroLib.createLine(brd1, {
            ltype: 'Vertical',
            name: 'M<sub>S1</sub>',
            color: 'Gray'
        });
        S1.setAttribute({
            fixed: true
        });

        var S2 = MacroLib.createTransformLine(brd1, {
            ltype: 'Vertical',
            transformList: [sliderPositive],
            name: 'M<sub>S2</sub>',
            color: 'DodgerBlue'
        });
        S2.setAttribute({
            withLabel: false
        });

        //Intersection of SD board 1
        var iSDB1 = brd1.create('intersection', [S2, D1], {
            withLabel: false,
            highlight: false
        });

        brd1.addChild(brd2);
        brd1.addChild(brd3);
        brd1.addChild(brd4);
        brd1.addChild(brd5);
        brd1.addChild(brd6);

        ////////////
        // BOARD 2
        ////////////
        //Demand Board 2 - with a Positive transformation
        var SB2 = MacroLib.createLine(brd2, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'Gray'
        });
        //Supply Board 2
        var D1B2 = MacroLib.createLine(brd2, {
            ltype: 'Demand',
            name: 'D<sub>1</sub>',
            color: 'Gray'
        });
        D1B2.setAttribute({
            fixed: true
        });

        var D2B2 = MacroLib.createTransformLine(brd2, {
            ltype: 'Demand',
            transformList: [sliderPositive],
            name: 'D<sub>2</sub>',
            color: 'DodgerBlue'
        });
        D2B2.setAttribute({
            withLabel: false
        });
        //Intersection Board 2
        var iSDB2 = brd2.create('intersection', [SB2, D2B2], {
            withLabel: false,
            highlight: false
        });

        ////////////
        // BOARD 3
        ////////////
        //Demand Board 2 - with a Positive transformation
        var SB3 = MacroLib.createLine(brd3, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'Gray'
        });
        //Supply Board 2
        var D1B3 = MacroLib.createLine(brd3, {
            ltype: 'Demand',
            name: 'D<sub>1</sub>',
            color: 'Gray'
        });
        D1B3.setAttribute({
            fixed: true
        });

        var D2B3 = MacroLib.createTransformLine(brd3, {
            ltype: 'Demand',
            transformList: [sliderNegative],
            name: 'D<sub>2</sub>',
            color: 'DodgerBlue'
        });
        D2B3.setAttribute({
            withLabel: false
        });
        //Intersection Board 2
        var iSDB3 = brd3.create('intersection', [SB3, D2B3], {
            withLabel: false,
            highlight: false
        });

        ////////////
        // BOARD 4
        ////////////
        //Demand Board 2 - with a Positive transformation
        var SB4 = MacroLib.createLine(brd4, {
            ltype: 'Supply',
            name: 'S<sub>1</sub>',
            color: 'Gray'
        });
        //Supply Board 2
        var D1B4 = MacroLib.createLine(brd4, {
            ltype: 'Vertical',
            name: 'D<sub>1</sub>',
            color: 'Gray'
        });
        D1B4.setAttribute({
            fixed: true
        });

        var D2B4 = MacroLib.createTransformLine(brd4, {
            ltype: 'Vertical',
            transformList: [sliderNegative],
            name: 'D<sub>2</sub>',
            color: 'DodgerBlue'
        });
        D2B4.setAttribute({
            withLabel: false
        });
        //Intersection Board 2
        var iSDB4 = brd4.create('intersection', [SB4, D2B4], {
            withLabel: false,
            highlight: false
        });

        ////////////
        // BOARD 5
        ////////////
        //Demand Board 1
        var S5 = MacroLib.createLine(brd5, {
            ltype: 'Supply',
            name: 'S',
            color: 'DodgerBlue'
        });
        //Supply Board 1
        var D1B5 = MacroLib.createLine(brd5, {
            ltype: 'Demand',
            name: 'D',
            color: 'Gray'
        });
        D1B5.setAttribute({
            fixed: true
        });

        var D2B5 = MacroLib.createTransformLine(brd5, {
            ltype: 'Demand',
            transformList: [sliderNegative],
            name: 'L<sub>2</sub>',
            color: 'DodgerBlue'
        });
        D2B5.setAttribute({
            withLabel: false
        });

        //Intersection of SD board 1
        var iSDB5 = brd5.create('intersection', [D2B5, S5], {
            withLabel: false,
            highlight: false
        });

        ////////////
        // BOARD 6
        ////////////
        //Demand Board 1
        var S6 = MacroLib.createLine(brd6, {
            ltype: 'Supply',
            name: 'S',
            color: 'DodgerBlue'
        });
        //Supply Board 1
        var D1B6 = MacroLib.createLine(brd6, {
            ltype: 'Demand',
            name: 'D',
            color: 'Gray'
        });
        D1B6.setAttribute({
            fixed: true
        });

        var D2B6 = MacroLib.createTransformLine(brd6, {
            ltype: 'Demand',
            transformList: [sliderPositive],
            name: 'L<sub>2</sub>',
            color: 'DodgerBlue'
        });
        D2B6.setAttribute({
            withLabel: false
        });

        //Intersection of SD board 1
        var iSDB6 = brd6.create('intersection', [D2B6, S6], {
            withLabel: false,
            highlight: false
        });

        //Dashed Lines - Board 1
        var dashB1fixed = MacroLib.createDashedLines2Axis(brd1, iSDB1, {
            fixed: true,
            withLabel: false,
            color: 'Gray'
        });
        var dashB1 = MacroLib.createDashedLines2Axis(brd1, iSDB1, {
            fixed: false,
            withLabel: true,
            color: 'DodgerBlue',
            xlabel: 'Q<sub>S</sub>',
            ylabel: 'NIR'
        });

        //Dashed Lines - Board 2
        var dashB2fixed = MacroLib.createDashedLines2Axis(brd2, iSDB2, {
            fixed: true,
            withLabel: false,
            color: 'Gray'
        });
        var dashB2 = MacroLib.createDashedLines2Axis(brd2, iSDB2, {
            fixed: false,
            withLabel: true,
            color: 'DodgerBlue',
            xlabel: 'Q<sub>2</sub>',
            ylabel: 'P<sub>2</sub>'
        });

        //////////////////
        // Interactivity
        //////////////////
        brd1.on('move', function() {
            //Moving 1st set of Dashed Lines in Board 1
            dashB1.Y1.moveTo([0, iSDB1.Y()]);
            dashB1.Y2.moveTo([iSDB1.X(), iSDB1.Y()]);

            dashB1.X1.moveTo([iSDB1.X(), 0]);
            dashB1.X2.moveTo([iSDB1.X(), iSDB1.Y()]);

            //Moving Board 2 Dashed Lines
            dashB2.Y1.moveTo([0, iSDB2.Y()]);
            dashB2.Y2.moveTo([iSDB2.X(), iSDB2.Y()]);

            dashB2.X1.moveTo([iSDB2.X(), 0]);
            dashB2.X2.moveTo([iSDB2.X(), iSDB2.Y()]);
        });
    }

    ////////////////////////
    // External DOM button
    ////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        JXG.JSXGraph.freeBoard(brd2);
        JXG.JSXGraph.freeBoard(brd3);
        JXG.JSXGraph.freeBoard(brd4);
        JXG.JSXGraph.freeBoard(brd5);
        JXG.JSXGraph.freeBoard(brd6);
        init();
    });

    init();
})(JXG, MacroLib, undefined);
