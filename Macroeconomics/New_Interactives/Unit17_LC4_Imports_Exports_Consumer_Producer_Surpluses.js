var Macro = (function(JXG, MacroLib) {
    'use strict';
    var board, polygons = [], priceSlider;

    function init() {
        MacroLib.init(MacroLib.ONE_BOARD);
        JXG.Options.segment.strokeWidth = 3;
        JXG.Options.segment.fixed = true;
        JXG.Options.segment.highlight = false;
        ////////////
        // BOARD 1
        ////////////
        board = MacroLib.createBoard('jxgbox1', {
            bboxlimits: [-2, 12, 12, -2],
            xname: 'Quantity',
            yname: 'Price',
            xpos: [10, -1],
            ypos: [-1.5, 11]
        });

        var params = {visible: false};

        // Two points defining supply line
        var SBottomPt = board.create('point', [0, 2], params);
        var STopPt = board.create('point', [7.5, 9.5], params);

        // Two points defining demand line
        var DTopPt = board.create('point', [0, 9.5], params);
        var DBottomPt = board.create('point', [7.5, 2], params);

        // Intersection of supply and demand lines
        var ISDPt = board.create('point', [3.75, 5.75], params);

        // Three points used to define left vertical line segments
        var LTopPt = board.create('point', [0, 9.5], params);
        var LMiddlePt = board.create('point', [0, 5.75], params);
        var LBottomPt = board.create('point', [0, 2], params);

        // Three points used to define right vertical line segments
        var RTopPt = board.create('point', [7.5, 9.5], params);
        var RMiddlePt = board.create('point', [7.5, 5.75], params);
        var RBottomPt = board.create('point', [7.5, 2], params);

        // Invisible vertical line segments on the left used to get intersections and polygon points
        var LTop = board.create('segment', [LTopPt, LMiddlePt], params);
        var LBottom = board.create('segment', [LMiddlePt, LBottomPt], params);

        // Invisible vertical line segments on the right used to get intersections and polygon points
        var RTop = board.create('segment', [RTopPt, RMiddlePt], params);
        var RBottom = board.create('segment', [RMiddlePt, RBottomPt], params);

        // Invisible line segments representing supply line
        var SBottom = board.create('segment', [SBottomPt, ISDPt], params);
        var STop = board.create('segment', [ISDPt, STopPt], params);

        // Invisible line segments representing demand line
        var DTop = board.create('segment', [DTopPt, ISDPt], params);
        var DBottom = board.create('segment', [ISDPt, DBottomPt], params);

        // Supply Line:
        var S = MacroLib.createLine(board, {
            ltype: 'Supply',
            name: 'S',
            color: 'black'
        });
        S.setAttribute({
            strokeWidth: 2
        });
        translateLine(S, [-2, 0], 0);

        // Demand Line:
        var D = MacroLib.createLine(board, {
            ltype: 'Demand',
            name: 'D',
            color: 'black'
        });
        D.setAttribute({
            strokeWidth: 2
        });
        translateLine(D, [-2, 0], 0);

        // Equilibrium horizontal line
        var E = board.create('segment', [[0, 5.75], [7.5, 5.75]], {
            strokeColor: 'gray',
            strokeWidth: 2,
            dash: 1,
            withLabel: false
        });

        // World Price horizontal line
        var W = board.create('segment', [[0, 5.75], [7.5, 5.75]], {
            strokeColor: 'black',
            strokeWidth: 2,
            name: 'P world',
            withLabel: true,
            label: {
                offset: [150, 0]
            }
        });

        // Intersection points defining all silver polygons

        // Top
        // Intersection of world price and top left vertical line
        var IWLTopPt = board.create('glider', [0, 5.75, LTop], params);

        // Intersection of world price and top demand line
        var IWDTopPt = board.create('glider', [3.75, 5.75, DTop], params);

        // Intersection of world price and top supply line
        var IWSTopPt = board.create('glider', [3.75, 5.75, STop], params);

        // Intersection of world price and top right vertical line
        var IWRTopPt = board.create('glider', [7.5, 5.75, RTop], params);

        // Middle
        // Intersection of horizontal equilibrium line and left vertical line
        var IELPt = board.create('glider', [0, 5.75, LBottom], params);
        // Intersection of horizontal equilibrium line and right vertical line
        var IERPt = board.create('glider', [7.5, 5.75, RBottom], params);

        // Bottom
        // Intersection of world price and bottom left vertical line
        var IWLBottomPt = board.create('glider', [0, 5.75, LBottom], params);

        // Intersection of world price and bottom demand line
        var IWDBottomPt = board.create('glider', [3.75, 5.75, DBottom], params);

        // Intersection of world price and bottom supply line
        var IWSBottomPt = board.create('glider', [3.75, 5.75, SBottom], params);

        // Intersection of world price and bottom right vertical line
        var IWRBottomPt = board.create('glider', [7.5, 5.75, RBottom], params);

        // Polygons, start at top left point then traverse other points clockwise
        params = {
            name: '',
            withLabel: false,
            withLines: false,
            fillColor: 'silver',
            fillOpacity: 0.5
        };
        polygons.length = 0; // Clear elements if any

        // Top polygons, above world price horizontal line
        // Top Left
        params.name = '1';
        polygons.push(
            board.create('polygon', [IWLTopPt, DTopPt, IWDTopPt], params)
        );
        // Top Middle
        params.name = '2';
        polygons.push(
            board.create('polygon', [DTopPt, STopPt, IWSTopPt, IWDTopPt], params)
        );
        // Top Right
        params.name = '3';
        polygons.push(
            board.create('polygon', [IWSTopPt, STopPt, IWRTopPt], params)
        );

        // Middle top polygons, between equilibrium line and world price lines
        // Middle Top Left
        params.name = '4';
        polygons.push(
            board.create('polygon', [IWLTopPt, IWDTopPt, ISDPt, IELPt], params)
        );
        // Middle Top Middle
        params.name = '5';
        polygons.push(
            board.create('polygon', [IWDTopPt, IWSTopPt, ISDPt], params)
        );
        // Middle Top Right
        params.name = '6';
        polygons.push(
            board.create('polygon', [IWSTopPt, IWRTopPt, IERPt, ISDPt], params)
        );

        // Middle bottom polygons, between equilibrium line and world price lines
        // Middle Bottom Left
        params.name = '7';
        polygons.push(
            board.create('polygon', [IELPt, ISDPt, IWSBottomPt, IWLBottomPt], params)
        );
        // Middle Bottom Middle
        params.name = '8';
        polygons.push(
            board.create('polygon', [ISDPt, IWDBottomPt, IWSBottomPt], params)
        );
        // Middle Bottom Right
        params.name = '9';
        polygons.push(
            board.create('polygon', [ISDPt, IERPt, IWRBottomPt, IWDBottomPt], params)
        );

        // Bottom polygons, below world price horizontal line
        // Bottom Left
        params.name = '10';
        polygons.push(
            board.create('polygon', [IWLBottomPt, SBottomPt, IWSBottomPt], params)
        );
        // Bottom Middle
        params.name = '11';
        polygons.push(
            board.create('polygon', [SBottomPt, DBottomPt, IWDBottomPt, IWSBottomPt], params)
        );
        // Bottom Right
        params.name = '12';
        polygons.push(
            board.create('polygon', [IWDBottomPt, DBottomPt, IWRBottomPt], params)
        );

        // Draggable consumer surplus label to the bottom left
        var p1 = board.create('point', [0.5, -1], {
            visible: false
        });
        var p2 = board.create('point', [0.5, -1.5], {
            visible: false
        });
        var p3 = board.create('point', [1.0, -1.5], {
            visible: false
        });
        var p4 = board.create('point', [1.0, -1], {
            visible: false
        });
        var csLabel = board.create('polygon', [p1, p2, p3, p4], {
            name: 'Consumer<br>Surplus',
            hasInnerPoints: true,
            withLabel: true,
            withLines: false,
            fillColor: 'dodgerblue',
            highlightFillColor: 'dodgerblue',
            fillOpacity: 0.5,
            label: {
                offset: [35, 0]
            }
        });
        csLabel.on('mouseup', function(event){
            colorPolygons(this);
        });

        // Draggable producer surplus label to the bottom right
        var p5 = board.create('point', [4.5, -1], {
            visible: false
        });
        var p6 = board.create('point', [4.5, -1.5], {
            visible: false
        });
        var p7 = board.create('point', [5.0, -1.5], {
            visible: false
        });
        var p8 = board.create('point', [5.0, -1], {
            visible: false
        });
        var psLabel = board.create('polygon', [p5, p6, p7, p8], {
            name: 'Producer<br>Surplus',
            hasInnerPoints: true,
            withLabel: true,
            withLines: false,
            fillColor: 'orange',
            highlightFillColor: 'orange',
            fillOpacity: 0.5,
            label: {
                offset: [35, 0]
            }
        });
        psLabel.on('mouseup', function(event){
            colorPolygons(this);
        });

        // Draggable erase gray label to the bottom right
        var p9 = board.create('point', [8.5, -1], {
            visible: false
        });
        var p10 = board.create('point', [8.5, -1.5], {
            visible: false
        });
        var p11 = board.create('point', [9.0, -1.5], {
            visible: false
        });
        var p12 = board.create('point', [9.0, -1], {
            visible: false
        });
        var eraseLabel = board.create('polygon', [p9, p10, p11, p12], {
            name: '',
            hasInnerPoints: true,
            withLabel: false,
            withLines: false,
            fillColor: 'silver',
            highlightFillColor: 'silver',
            fillOpacity: 0.5,
            label: {
                offset: [35, 0]
            }
        });
        eraseLabel.on('mouseup', function(event){
            colorPolygons(this);
        });

        // Price slider
        priceSlider = board.create('slider', [
            [-1.5, 2.0],
            [-1.5, 9.5],
            [2.0, 5.75, 9.5]
        ], {
            withLabel: false,
            snapWidth: 0.05,
            color: 'crimson'
        });

        // Supply is: y = x + 2
        // Demand is: y = -x + 9.5
        priceSlider.on('drag', function() {
            var price = priceSlider.Value();
            W.point1.moveTo([0, price]);
            W.point2.moveTo([7.5, price]);
            // All these gliders get constrained to their line segments
            IWLTopPt.moveTo([0, price]);
            IWDTopPt.moveTo([9.5 - price, price]);
            IWSTopPt.moveTo([price - 2, price]);
            IWRTopPt.moveTo([7.5, price]);
            IWLBottomPt.moveTo([0, price]);
            IWDBottomPt.moveTo([9.5 - price, price]);
            IWSBottomPt.moveTo([price - 2, price]);
            IWRBottomPt.moveTo([7.5, price]);
        });
    }

    /////////////////////////
    // External DOM buttons
    /////////////////////////
    var resetAnimationBtn = document.getElementById('resetAnimationBtn');
    var checkBtn = document.getElementById('checkBtn');

    //Interactivity
    if (resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', resetAnimation);
    }
    if (checkBtn) {
        checkBtn.addEventListener('click', check);
    }

    function resetAnimation() {
        JXG.JSXGraph.freeBoard(board);
        init();
    }

    function check() {
        var i, iStr, len = polygons.length, polColor, polColor, polStr = '', price = priceSlider.Value(), priceStr,
            excludedIndices = [], csPols = [], psPols = [], csAnswer, psAnswer, csStr = '', psStr = '';

        // Get price zone and exclude polygons that are not apparent
        if (price === 5.75) {
            priceStr = 'World price is the same as domestic price.'
            // Exclude all middle polygons (top and bottom)
            excludedIndices = [3, 4, 5, 6, 7, 8];
        }
        else if (price > 5.75) {
            priceStr = 'World price is higher than domestic price.'
            // Exclude all middle bottom polygons
            excludedIndices = [6, 7, 8];
        }
        else {
            priceStr = 'World price is lower than domestic price.'
            // Exclude all middle top polygons
            excludedIndices = [3, 4, 5];
        }

        for (i = 0; i < len; i++) {
            // Not part of excluded, invisible polygons, report its state
            if (excludedIndices.indexOf(i) === -1) {
                iStr = (i+1).toString();
                polColor = polygons[i].getAttribute('fillColor');
                if (polColor === 'silver') {
                    polStr += 'Polygon ' + iStr + ' has not been labeled.';
                }
                else if (polColor === 'dodgerblue') {
                    polStr += 'Polygon ' + iStr + ' has been labeled as a Consumer Surplus.';
                    csPols.push(i);
                }
                else if (polColor === 'orange') {
                    polStr += 'Polygon ' + iStr + ' has been labeled as a Producer Surplus.';
                    psPols.push(i);
                }
                polStr += '\n';
            }
        }

        csAnswer = csCorrect(csPols);
        psAnswer = psCorrect(psPols);

        if (csAnswer) {
            csStr = "YOU HAVE CORRECTLY IDENTIFIED THE CONSUMER SURPLUS AREA."
        }
        else {
            csStr = "YOU HAVE NOT CORRECTLY IDENTIFIED THE CONSUMER SURPLUS AREA."
        }
        csStr += '\n';

        if (psAnswer) {
            psStr = "YOU HAVE CORRECTLY IDENTIFIED THE PRODUCER SURPLUS AREA."
        }
        else {
            psStr = "YOU HAVE NOT CORRECTLY IDENTIFIED THE PRODUCER SURPLUS AREA."
        }
        psStr += '\n';

        alert(csStr + '\n' + psStr + '\n' + polStr + '\n' + priceStr);
    }

    // Consumer surplus area has been correctly marked
    function csCorrect(pols) {
        var i, len, price = priceSlider.Value(), csIndices = [], result;

        if (price === 5.75 || price > 5.75) {
            csIndices = [0];
        }
        else {
            csIndices = [0, 6, 7];
        }

        if (csIndices.length !== pols.length) {
            return false;
        }

        for (i = 0, len = csIndices.length; i < len; i++) {

            if (csIndices[i] !== pols[i]) {
                return false;
            }
        }
        return true;
    }

    // Producer surplus area has been correctly marked
    function psCorrect(pols) {
        var i, len, price = priceSlider.Value(), psIndices = [], result;

        if (price === 5.75 || price < 5.75) {
            psIndices = [9];
        }
        else {
            psIndices = [3, 4, 9];
        }

        if (psIndices.length !== pols.length) {
            return false;
        }

        for (i = 0, len = psIndices.length; i < len; i++) {

            if (psIndices[i] !== pols[i]) {
                return false;
            }
        }
        return true;
    }

    function colorPolygons(label) {
        var i, len = polygons.length, fillColor = label.getAttribute('fillColor');

        for (i = 0; i < len; i++) {
            if (labelOnPolygon(label, polygons[i])) {
                polygons[i].setAttribute({
                    fillColor: fillColor
                });
            }
        }
    }

    function labelOnPolygon(label, polygon) {
        var i, lenLab = label.vertices.length - 1, lenPol = polygon.vertices.length - 1, px, py, xPol = [], yPol = [];
        // Build the polygon's x and y vertices arrays
        for (i = 0; i < lenPol; i++) {
            xPol.push(polygon.vertices[i].coords.usrCoords[1]);
            yPol.push(polygon.vertices[i].coords.usrCoords[2]);
        }
        for (i = 0; i < lenLab; i++) {
            px = label.vertices[i].coords.usrCoords[1];
            py = label.vertices[i].coords.usrCoords[2];
            if (pointInPolygon(lenPol, xPol, yPol, px, py)) {
                return true;
            }
        }
        return false;
    }

    // http://stackoverflow.com/questions/17223806/how-to-check-if-point-is-in-polygon-in-javascript
    // nvert: Number of vertices in the polygon. No need to repeat the first vertex at the end.
    // vertx, verty: Arrays containing the x and y coordinates of the polygon's vertices.
    // testx, testy: x and y coordinates of the test point.
    function pointInPolygon(nvert, vertx, verty, testx, testy) {
        var i, j, c = false;
        for (i = 0, j = nvert-1; i < nvert; j = i++) {
            if (((verty[i]>testy) !== (verty[j]>testy)) &&
                (testx < (vertx[j]-vertx[i]) * (testy-verty[i]) / (verty[j]-verty[i]) + vertx[i])) {
                c = !c;
            }
        }
        return c;
    }

    function translatePoint(pt, trans) {
        return [pt.X() + trans[0], pt.Y() + trans[1]];
    }

    function translateLine(line, trans, animLength) {
        line.point1.moveTo(translatePoint(line.point1, trans), animLength);
        line.point2.moveTo(translatePoint(line.point2, trans), animLength);
    }

    // function labelOnTriangle(label, triangle) {
    //     var i, len = label.vertices.length - 1,
    //         pt1 = triangle.vertices[0],
    //         pt2 = triangle.vertices[1],
    //         pt3 = triangle.vertices[2],
    //         x1 = pt1.X(), y1 = pt1.Y(),
    //         x2 = pt2.X(), y2 = pt2.Y(),
    //         x3 = pt3.X(), y3 = pt3.Y(),
    //         px, py;

    //         for (i = 0; i < len; i++) {
    //             px = label.vertices[i].coords.usrCoords[1];
    //             py = label.vertices[i].coords.usrCoords[2];
    //             if (pointInTriangle(px, py, x1, y1, x2, y2, x3, y3)) {
    //                 return true;
    //             }
    //         }
    //     return false;
    // }

    // function pointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
    //     var o1 = getOrientationResult(x1, y1, x2, y2, px, py);
    //     var o2 = getOrientationResult(x2, y2, x3, y3, px, py);
    //     var o3 = getOrientationResult(x3, y3, x1, y1, px, py);

    //     return (o1 === o2) && (o2 === o3);
    // }

    // function getOrientationResult(x1, y1, x2, y2, px, py) {
    //     var orientation = ((x2 - x1) * (py - y1)) - ((px - x1) * (y2 - y1));
    //     if (orientation > 0) {
    //         return 1;
    //     }
    //     else if (orientation < 0) {
    //         return -1;
    //     }
    //     else {
    //         return 0;
    //     }
    // }

    init();

})(JXG, MacroLib, undefined);
