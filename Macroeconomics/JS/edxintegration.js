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
  }
  else {
    console.log(msg);
  }
  console.log('Hello',channel);
}

/*
  NOTES ON EDX INTEGRATION:

  To integrate an application, lets say app/ampPhaseFirstOrder.js


  1. Add the following import at the beginning of the file:

  var edx = require('edxintegration');


  2. Add a state variable like the t value of tSlider :

  var state = {
    't': 0.0
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
