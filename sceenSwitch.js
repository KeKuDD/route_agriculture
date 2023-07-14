function screenSwitch() {
  // Create WebSocket connection.
  const socket = new WebSocket('ws://Acer-Ubuntu:8081/simstate');
  study.socket = socket;
  socket.onopen = function(event) {
      console.log("WebSocket is open now.");
      };
  socket.onclose = function(event) {
      console.log("WebSocket is closed now.");
      };
      
// Listen for messages
socket.onmessage = function(event) {
  var msg = JSON.parse(event.data);
  console.log(msg);
  var simstate = msg.transitionDto.name;
  debugger;
  checkSimstate(simstate, transition=study.transition, torReceived=study.torReceived);
  }
};

 function checkSimstate(simstate, transition){
  blank = document.querySelector("img.blank");
  switch (simstate)
  {
    case "Available":
      console.log("entered case Available");
      document.querySelector("button#continue").disabled = false;
      break;
    case "TakeoverRequest":
      console.log("entered case TakeoverRequest");
      study.transition = "tor";
      study.torReceived = true;
      blank.style.display = "block";
      break;      
    case "MandatoryTakeover":
      console.log("entered case MandatoryTakeover");
      study.transition = "forcedTakeover";
      blank.style.display = "block";
      break;
    case "OptionalTakeover":
      console.log("entered case OptionalTakeover");
      study.transition = "optionalTakeover";
      blank.style.display = "block";
      break;
    case "Takeback":
      console.log("entered case Takeback");
      checkPriorTransition(transition=transition, torReceived=torReceived);
      break;   
  }
 }
 
 function checkPriorTransition(transition, torReceived) {
    if (torReceived===true) {
        console.log("entered nested case forcedTakeover");
        study.transition = "finalTakeback";
        clickFinalButton();
        } else if (transition === "optionalTakeover" || transition === "forcedTakeover"){
        console.log("entered nested case OptionalTakeover");
      	study.transition = "takeback";
      	checkStudyAffordance();
      	};
      };
 
/*function checkPriorTransition(transition, torReceived) {
   switch ([transition, torReceived]) {
      case "tor": case true:
        console.log("entered nested case forcedTakeover");
        study.transition = "finalTakeback";
        clickFinalButton();
        break;
      case "optionalTakeover": case "forcedTakeover":
      	console.log("entered nested case OptionalTakeover");
      	study.transition = "takeback";
      	checkStudyAffordance();
        break;
      default:
        console.log("entered nested case takeback");  	 
        break;
    };
  };
 */
 function clickFinalButton() {
  let btnFinal = document.getElementById('end');
  if(typeof(btnFinal) != 'undefined' && btnFinal != null) {
  console.log('btnFinal will be clicked.');
  study.options.datastore.state.response = 'final';
  study.socket.close();
  btnFinal.click();
  };
 };

 
function checkStudyAffordance() {
  blank = document.querySelector("img.blank");
  if(condition !=="0") {
    blank.style.display = "none";
    if(study.configuration.problemState === "easy") {
      console.log('stepped into if probSTate is easy');
      //this.end();
      let btnSkip = document.getElementById('skip');
      if(typeof(btnSkip) != 'undefined' && btnSkip != null) {
        console.log('btnSkip will be clicked.');
        btnSkip.click();
      }
    }
  }
 }
