var Macro = (function(JXG, MacroLib) {
    'use strict';
    var brd1;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        //General Parameters for Macro
        JXG.Options.segment.strokeColor = 'Gray';
        JXG.Options.text.fontSize = 15;

        ////////////
        // BOARD 1
        ////////////
        var bboxlimits = [-2.5, 12, 12, -2.0];
        brd1 = JXG.JSXGraph.initBoard('jxgbox1', {
            axis: false,
            showCopyright: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            boundingbox: bboxlimits,
            grid: true,
            hasMouseUp: true,
        });

        var xaxis1 = brd1.create('axis', [
            [0, 0],
            [11, 0]
        ], {
            withLabel: false
        });
        var yaxis1 = brd1.create('axis', [
            [0, 0],
            [0, 11]
        ], {
            withLabel: false
        });

        //Axes
        xaxis1.removeAllTicks();
        yaxis1.removeAllTicks();
        var xlabel1 = brd1.create('text', [6, -0.5, "Quantity of Money"], {
            fixed: true
        });
        var ylabel1 = brd1.create('text', [-2.45, 10, "Nominal<br>Interest<br>Rate"], {
            fixed: true
        });

        ////////////
        // BOARD 2
        ////////////
        var bboxlimits2 = [-2.5, 12, 12, -2.0];
        var brd2 = JXG.JSXGraph.initBoard('jxgbox2', {
            axis: false,
            showCopyright: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            boundingbox: bboxlimits2,
            grid: true,
            hasMouseUp: true,
        });

        var xaxis2 = brd2.create('axis', [
            [0, 0],
            [11, 0]
        ], {
            withLabel: false
        });
        var yaxis2 = brd2.create('axis', [
            [0, 0],
            [0, 11]
        ], {
            withLabel: false
        });

        //Axes
        xaxis2.removeAllTicks();
        yaxis2.removeAllTicks();
        var xlabel2 = brd2.create('text', [3.0, -0.5, "Quantity of Bonds per Period"], {
            fixed: true,
            highlight: false
        });
        var ylabel2 = brd2.create('text', [-2.45, 10, "Price of<br>Bonds"], {
            fixed: true,
            highlight: false
        });

        //Sliders
        var slidery = brd1.create('slider', [
            [-1.5, 2.0],
            [-1.5, 8],
            [-1.5, 0, 1.5]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'Orange'
        });

        //Positive Slider Transformation
        var sliderPositive = brd1.create('transform', [
            function() {
                return 0.0
            },
            function() {
                return slidery.Value()
            }
        ], {
            type: 'translate'
        });

        //Negative Slider Transformation
        var sliderNegative = brd1.create('transform', [
            function() {
                return 0.0
            },
            function() {
                return -slidery.Value()
            }
        ], {
            type: 'translate'
        });

        //Demand Board 1
        var S1 = brd1.create('segment', [
            [5.75, 1.0],
            [5.75, 11.0]
        ], {
            withLabel: true,
            name: 'M<sub>S</sub>',
            label: {
                offset: [0, 115]
            }
        });

        //Supply Board 1 - with slider transformation
        var d1B1 = brd1.create('point', [2.0, 9.5], {
            visible: false
        });
        var d2B1 = brd1.create('point', [9.5, 2.0], {
            visible: false
        });
        var pD1 = brd1.create('point', [d1B1, [sliderPositive]], {
            visible: false
        });
        var pD2 = brd1.create('point', [d2B1, [sliderPositive]], {
            visible: false
        });

        var D1fixed = brd1.create('segment', [d1B1, d2B1], {
            withLabel: false,
            fixed: true,
            'name': 'D<sub>1</sub>',
            highlight: false,
            dash: '1',
            strokeWidth: '3',
            label: {
                offset: [90, -90]
            }
        });

        var D1 = brd1.create('segment', [pD1, pD2], {
            withLabel: true,
            highlight: false,
            'name': 'M<sub>D2</sub>',
            color: 'DodgerBlue',
            label: {
                offset: [90, -90]
            }
        });

        //Intersection of SD board 1
        var iSDB = brd1.create('intersection', [S1, D1], {
            withLabel: false,
            highlight: false
        });

        brd1.addChild(brd2);

        //Demand Board 2 - with a Positive transformation
        //var S2 = createSupply(brd2,{withLabel:true,'name':'S<sub>2</sub>'});
        var S2 = brd2.create('segment', [
            [2.0, 2.0],
            [9.5, 9.5]
        ], {
            withLabel: true,
            name: 'S<sub>2</sub>',
            label: {
                offset: [90, 90]
            }
        });

        //Supply Board 2 - with a Negative transformation
        var d1B2 = brd2.create('point', [2.0, 9.5], {
            visible: false
        });
        var d2B2 = brd2.create('point', [9.5, 2.0], {
            visible: false
        });
        var As = brd2.create('point', [d1B2, [sliderNegative]], {
            visible: false
        });
        var Bs = brd2.create('point', [d2B2, [sliderNegative]], {
            visible: false
        });

        var D2fixed = brd2.create('segment', [d1B2, d2B2], {
            withLabel: false,
            fixed: true,
            'name': 'D<sub>1</sub>',
            highlight: false,
            dash: '1',
            strokeWidth: '3',
            label: {
                offset: [90, -90]
            }
        });

        var D2 = brd2.create('segment', [As, Bs], {
            withLabel: true,
            'name': 'D<sub>2</sub>',
            highlight: false,
            color: 'DodgerBlue',
            label: {
                offset: [90, -90]
            }
        });

        var iSDB2 = brd2.create('intersection', [S2, D2], {
            withLabel: false,
            highlight: false
        });


        function createDashedLines2Axis(board, intersection, options) {
            var fixed = options.fixed || true; // defaults
            var withLabel = options.withLabel || false;
            var xlabel = options.xlabel || '';
            var ylabel = options.ylabel || '';
            var color = options.color || 'gray';
            var visible = options.visible || true;

            var Y1, Y2, YLine, X1, X2, XLine, obj = {};
            var Y1 = board.create('point', [0, intersection.Y()], {
                'withLabel': withLabel,
                'name': ylabel,
                'visible': true,
                'size': '0.5',
                'strokeColor': 'Gray',
                'label': {
                    'offset': [2, 12]
                }
            });

            var Y2 = board.create('point', [intersection.X(), intersection.Y()], {
                'withLabel': false,
                'visible': false,
                'size': '0.0',
                'strokeColor': ''
            });

            var YLine = board.create('segment', [Y1, Y2], {
                'strokeColor': color,
                'strokeWidth': '2',
                'dash': '1',
                'fixed': fixed,
                'visible': visible
            });

            var X1 = board.create('point', [intersection.X(), 0], {
                'withLabel': withLabel,
                'name': xlabel,
                'visible': true,
                'size': '0.5',
                'strokeColor': 'Gray',
                'label': {
                    'offset': [2, 12]
                }
            });

            var X2 = board.create('point', [intersection.X(), intersection.Y()], {
                'withLabel': false,
                'visible': false,
                'size': '0.0',
                'strokeColor': ''
            });

            var XLine = board.create('segment', [X1, X2], {
                'strokeColor': color,
                'strokeWidth': '2',
                'dash': '1',
                'fixed': fixed,
                'visible': visible
            });


            var obj = {
                Y1: Y1,
                Y2: Y2,
                YLine: YLine,
                X1: X1,
                X2: X2,
                XLine: XLine
            }

            return obj;
        }


        //Dashed Lines - Board 1
        var dashB1fixed = createDashedLines2Axis(brd1, iSDB, {
            fixed: true,
            withLabel: false,
            color: 'Gray'
        });
        var dashB1 = createDashedLines2Axis(brd1, iSDB, {
            fixed: false,
            withLabel: true,
            color: 'DodgerBlue',
            xlabel: 'Q',
            ylabel: 'NIR<sub>2</sub>'
        });

        //Dashed Lines - Board 2
        var dashB2fixed = createDashedLines2Axis(brd2, iSDB2, {
            fixed: true,
            withLabel: false,
            color: 'Gray'
        });
        var dashB2 = createDashedLines2Axis(brd2, iSDB2, {
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
            dashB1.Y1.moveTo([0, iSDB.Y()]);
            dashB1.Y2.moveTo([iSDB.X(), iSDB.Y()]);

            dashB1.X1.moveTo([iSDB.X(), 0]);
            dashB1.X2.moveTo([iSDB.X(), iSDB.Y()]);

            //Moving Board 2 Dashed Lines
            dashB2.Y1.moveTo([0, iSDB2.Y()]);
            dashB2.Y2.moveTo([iSDB2.X(), iSDB2.Y()]);

            dashB2.X1.moveTo([iSDB2.X(), 0]);
            dashB2.X2.moveTo([iSDB2.X(), iSDB2.Y()]);
        });
    }

    /////////////////////////
    // External DOM button
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');

    resetAnimationBtn.addEventListener('click', function() {
        JXG.JSXGraph.freeBoard(brd1);
        init();
    });

    init();
})(JXG, MacroLib, undefined);