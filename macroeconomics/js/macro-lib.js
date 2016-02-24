var MacroLib = (function(JXG) {
    'use strict';
    var ONE_BOARD = 1,
        TWO_BOARDS = 2,
        THREE_BOARDS = 3;

    //Bounding Box Limits
    var defaultBBox;

    //Custom Parameters
    var labelOffset;

    var defaultXoffset, defaultYoffset;

    function init(nbrBoards) {
        //General Parameters for Macro
        JXG.Options.segment.strokeWidth = 5;
        JXG.Options.point.showInfobox = false;
        JXG.Options.point.highlight = false;
        JXG.Options.point.fixed = true;
        JXG.Options.text.highlight = false;
        JXG.Options.text.fixed = true;
        JXG.Options.line.highlight = false;
        JXG.Options.line.fixed = true;
        JXG.Options.curve.highlight = false;
        JXG.Options.curve.fixed = true;
        JXG.Options.slider.highlight = true;
        JXG.Options.slider.fixed = false;
        JXG.Options.slider.withTicks = false;

        switch (nbrBoards) {
            case ONE_BOARD:
                JXG.Options.text.fontSize = 16;
                defaultBBox = [-1.5, 12, 12, -1.0];
                labelOffset = {
                    X: 10,
                    Y: 10
                };
                defaultXoffset = [0, -6];
                defaultYoffset = [-8, 0];
                break;
            case TWO_BOARDS:
                JXG.Options.text.fontSize = 15;
                defaultBBox = [-1.5, 12, 12, -1.5];
                labelOffset = {
                    X: 5,
                    Y: 5
                };
                defaultXoffset = [0, -4];
                defaultYoffset = [-6, 0];
                break;
            case THREE_BOARDS:
                JXG.Options.text.fontSize = 15;
                defaultBBox = [-1.75, 12, 12, -2.0];
                labelOffset = {
                    X: 5,
                    Y: 5
                };
                defaultXoffset = [0, -2];
                defaultYoffset = [-4, 0];
                break;
        }
    }

    function createBoard(brdName, options) {
        var xname = options.xname || 'x-label';
        var yname = options.yname || 'y-label';

        var bboxlimits = options.bboxlimits || defaultBBox;
        var grid = options.grid || false;

        var board = JXG.JSXGraph.initBoard(brdName, {
            axis: false,
            showCopyright: false,
            showNavigation: false,
            zoom: false,
            pan: false,
            boundingbox: bboxlimits,
            grid: grid,
            hasMouseUp: true,
        });

        var xaxis = board.create('axis', [
            [0, 0],
            [11, 0]
        ], {
            withLabel: false
        });
        var yaxis = board.create('axis', [
            [0, 0],
            [0, 11]
        ], {
            withLabel: false
        });

        //Axes
        xaxis.removeAllTicks();
        yaxis.removeAllTicks();
        // x-axis label is right-justified and has:
        // x offset of xwidth/40 from right edge of graph
        // y offset of yheight/50 from x-axis
        var dx1 = (bboxlimits[2]-bboxlimits[0])/40;
        var dy1 = (bboxlimits[3]-bboxlimits[1])/100;
        var xlabel = board.create('text', [bboxlimits[2] - dx1, dy1, xname], {
            anchorX: 'right',
            anchorY: 'top'
        });
        // y-axis label is right-justified and has:
        // x offset of xwidth/50 from y-axis
        // y offset of yheight/40 from top edge of graph
        var dx2 = (bboxlimits[2]-bboxlimits[0])/50;
        var dy2 = (bboxlimits[1]-bboxlimits[3])/40;
        var ylabel = board.create('text', [-dx2, bboxlimits[1] - dy2, yname], {
            anchorX: 'right',
            anchorY: 'top'
        });

        return board;
    }

    function lineCoords(ltype) {
        var c1, c2;

        ltype = ltype || 'Supply';

        if (ltype === 'Demand') {
            c1 = [2.0, 9.5];
            c2 = [9.5, 2.0];
        } else if (ltype === 'Supply') {
            c1 = [2.0, 2.0];
            c2 = [9.5, 9.5];
        }
        else if (ltype === 'Vertical') {
            c1 = [5.75, 0.5];
            c2 = [5.75, 11.0];
        } else if (ltype === 'Horizontal') {
            c1 = [0.5, 5.75];
            c2 = [11.0, 5.75];
        }

        return [c1, c2];
    }

    function createLine(board, options) {
        var name = options.name || '';
        var strokeColor = options.color || JXG.Options.segment.strokeColor;
        var ltype = options.ltype || 'Supply';
        var fixed = options.type || true;
        var c1, c2, D1, D2, coords;

        if (!options.c1 && !options.c2) {
            coords = lineCoords(ltype);
            c1 = coords[0];
            c2 = coords[1];
        }
        else {
            c1 = options.c1;
            c2 = options.c2;
        }

        D1 = board.create('point', c1, {
            withLabel: false,
            visible: false
        });
        D2 = board.create('point', c2, {
            withLabel: false,
            visible: false
        });

        return board.create('segment', [D1, D2], {
            name: name,
            strokeColor: strokeColor,
            withLabel: true,
            label: getLabelOffset(D1, D2, ltype)
        });
    }

    function createTransformLine(board, options) {
        var name = options.name || '';
        var strokeColor = options.color || JXG.Options.segment.strokeColor;
        var ltype = options.ltype || 'Supply';
        var fixed = options.type || true;
        var transformList = options.transformList || [undefined];
        var c1, c2, D1, D2, coords;

        if (!options.c1 && !options.c2) {
            coords = lineCoords(ltype);
            c1 = coords[0];
            c2 = coords[1];
        }
        else {
            c1 = options.c1;
            c2 = options.c2;
        }

        //Supply Board 1 - with slider transformation
        var s1B1 = board.create('point', c1, {
             withLabel: false,
            visible: false
        });
        var s2B1 = board.create('point', c2, {
            withLabel: false,
            visible: false
        });
        var pS1 = board.create('point', [s1B1, transformList], {
             withLabel: false,
            visible: false
        });
        var pS2 = board.create('point', [s2B1, transformList], {
            withLabel: false,
            visible: false
        });

        return board.create('segment', [pS1, pS2], {
            name: name,
            strokeColor: strokeColor,
            withLabel: true,
            label: getLabelOffset(pS1, pS2, ltype)
        });
    }

    function getLabelOffset(point1, point2, ltype) {
        var x1, x2, y1, y2, dx, dy, anchorX, anchorY;

        x1 = point1.coords.scrCoords[1];
        x2 = point2.coords.scrCoords[1];
        y1 = point1.coords.scrCoords[2];
        y2 = point2.coords.scrCoords[2];
        dx = Math.round((x2-x1)/2);
        dy = -Math.round((y2-y1)/2);

        dx += Math.sign(dx)*labelOffset.X;
        dy += Math.sign(dy)*labelOffset.Y;

        if (ltype === 'Demand' || ltype === 'Supply' || ltype === 'Horizontal') {
            anchorX = 'left';
            anchorY = 'middle';
        }
        else if (ltype === 'Vertical') {
            anchorX = 'middle';
            anchorY = 'bottom';

        }

        return {
            offset: [dx, dy],
            anchorX: anchorX,
            anchorY: anchorY
        }

    }

    /////////////////////////////////////////////////////////////
    // Dashed Lines
    function createDashedLines2Axis(board, intersection, options) {
        var fixed = options.fixed || true; // defaults
        var withLabel = options.withLabel || false;

        var xlabel = options.xlabel || '';
        // Was var xoffsets = options.xoffsets || [-5,-15]; in MacroAllBoards.js
        var xoffsets = options.xoffsets || defaultXoffset;

        var ylabel = options.ylabel || '';
        // Was var yoffsets = options.yoffsets || [-35,-2]; in MacroAllBoards.js
        var yoffsets = options.yoffsets || defaultYoffset;

        var color = options.color || 'gray';
        var visible = options.visible || true;

        var Y1 = board.create('point', [0, intersection.Y()], {
            withLabel: withLabel,
            name: ylabel,
            visible: true,
            size: 0.5,
            fixed: fixed,
            strokeColor: 'gray',
            label: {
                offset: yoffsets,
                anchorX: 'right',
                anchorY: 'middle'
            }
        });

        var Y2 = board.create('point', [intersection.X(), intersection.Y()], {
            withLabel: false,
            visible: false,
            size: 0.0,
            strokeColor: ''
        });

        var YLine = board.create('segment', [Y1, Y2], {
            strokeColor: color,
            strokeWidth: 2,
            dash: 1,
            fixed: fixed,
            visible: visible
        });

        var X1 = board.create('point', [intersection.X(), 0], {
            withLabel: withLabel,
            name: xlabel,
            visible: true,
            size: 0.5,
            fixed: fixed,
            strokeColor: 'gray',
            label: {
                offset: xoffsets,
                anchorX: 'middle',
                anchorY: 'top'
            }
        });

        var X2 = board.create('point', [intersection.X(), intersection.Y()], {
            withLabel: false,
            visible: false,
            size: 0.0,
            strokeColor: ''
        });

        var XLine = board.create('segment', [X1, X2], {
            strokeColor: color,
            strokeWidth: 2,
            dash: 1,
            fixed: fixed,
            visible: visible
        });


        var obj = {
            Y1: Y1,
            Y2: Y2,
            YLine: YLine,
            X1: X1,
            X2: X2,
            XLine: XLine
        };

        return obj;
    }

    // When an interactive is loaded in an iFrame, we try to post a message containing its height
    // to the parent window so that it can resize it.
    function onLoadPostMessage() {
        var parent = window.parent,
            url = window.location.href,
            height, data;

        // Interactive is loaded in an iFrame
        if (parent !== window) {
            window.addEventListener('load', function(event) {
                height = getDocumentHeight();
                console.info('Interactive located at ' + url);
                try {
                    data = {
                        type: 'iframe-resize',
                        url: url,
                        height: height
                    };
                    parent.postMessage(data, '*');
                    console.info('Posted a message containing its height ' + height + 'px');
                }
                catch (e) {
                    console.info(
                        'Could not post a message containing its height.' +
                        'No resizing will occur and default iFrame size will be used.'
                    );
                }
            });
        }
    }

    function getDocumentHeight() {
        var d = document;

        return Math.max(
            d.body.scrollHeight, d.documentElement.scrollHeight,
            d.body.offsetHeight, d.documentElement.offsetHeight,
            d.body.clientHeight, d.documentElement.clientHeight
        );
    }

    // Establish a channel to communicate with edX when the application is used
    // inside a JSInput and hosted completely on a different domain.
    function createChannel(getGrade, getState, setState) {
        var channel,
            msg = 'The application is not embedded in an iframe. ' +
            'A channel could not be established';

        // Establish a channel only if this application is embedded in an iframe.
        // This will let the parent window communicate with the child window using
        // RPC and bypass SOP restrictions.
        if (window.parent !== window) {
            channel = Channel.build({
                window: window.parent,
                origin: '*',
                scope: 'JSInput'
            });

            channel.bind('getGrade', getGrade);
            channel.bind('getState', getState);
            channel.bind('setState', setState);
        } else {
            console.info(msg);
        }
    }

    /*
      NOTES ON EDX INTEGRATION:

      To integrate an application, lets say app/ampPhaseFirstOrder.js


      1. Add the following import at the beginning of the file:

      var edx = require('edxintegration');


      2. Add a state variable like the t value of tSlider :

      var state = {
        t: 0.0
      };


      3. Add the 3 functions that will communicate with the edX parent frame.

      function getState() {
        return JSON.stringify(state);
      }

      // Transaction object argument is not used here
      // (see http://mozilla.github.io/jschannel/docs/)
      function setState(transaction, stateStr) {
        state = JSON.parse(stateStr);
        tSlider.setValue(state.t);
      }

      function getGrade() {
        // The following return value may or may not be used to grade server-side.
        // If getState and setState are used, then the Python grader also gets
        // access to the return value of getState and can choose it instead to grade
        return JSON.stringify(state);
      }


      4. Add edx.createChannel(getGrade, getState, setState); to initializeTool():

      function initializeTool() {
        // The try catch block checks if certain features are present.
        // If not, we exit and alert the user.
        try {
          U.testForFeatures(false, false, false, true); // Test for SVG only
        }
        catch (err) {
          window.alert(err.toString() + ' The tool is disabled.');
        }

        edx.createChannel(getGrade, getState, setState);

        initTool();
      }


      5. Make sure you exclude edxintegration from the build of the application.
         Otherwise edxintegration and its dependency, jschannel will be pulled in
         and concatenated with the application file.

        In tools/build.js

        ...
        {
          name: 'app/ampPhaseFirstOrder',
          include: ['app/ampPhaseFirstOrder'],
          exclude: ['lib/common', 'underscore', 'exdapplication']
        },
        ...


      6. Make sure you have similar XML for the JSInput using the Mathlet:

      <problem display_name="Amplitude and Phase: First Order">
        <script type="loncapa/python">
        <![CDATA[
        import json
        def vglcfn(e, ans):
          par = json.loads(ans)
          state = json.loads(par["state"])
          return state["t"] >= 1
        ]]>
        </script>
        <p>
        The Mathlet below will grade correctly for t >= 1.
        </p>
        <customresponse cfn="vglcfn">
          <jsinput gradefn="getGrade"
            get_statefn="getState"
            set_statefn="setState"
            width="100%"
            height="640"
            html_file="https://pathtomathlet/ampPhaseFirstOrder.html"
            sop="false"/>
        </customresponse>
      </problem>
    */

    function setLabelOffset(val) {
        labelOffset = val;
    }

    function setDefaultXoffset(val) {
        defaultXoffset = val;
    }

    function setDefaultYoffset(val) {
        defaultYoffset = val;
    }

    return {
        // Constants
        ONE_BOARD: ONE_BOARD,
        TWO_BOARDS: TWO_BOARDS,
        THREE_BOARDS: THREE_BOARDS,
        // Public field setters
        labelOffset: setLabelOffset,
        defaultXoffset: setDefaultXoffset,
        defaultYoffset: setDefaultYoffset,
        // Public methods
        init: init,
        createBoard: createBoard,
        lineCoords: lineCoords,
        createLine: createLine,
        createTransformLine: createTransformLine,
        createDashedLines2Axis: createDashedLines2Axis,
        onLoadPostMessage: onLoadPostMessage,
        createChannel: createChannel
    };
})(JXG, undefined);
