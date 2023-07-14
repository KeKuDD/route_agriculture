function giveFeedbackAlert(conditions) {
// no edge available
if (isNaN(conditions.constraints.time.value)){
    return {
        messageContent: 'Keine gültige Verbindung!', 
        messageStyle: 'alert alert-warning'
    };
    } else if (0 < conditions.result.length-1 && conditions.result.length-1 <= conditions.goal.limit && 
    conditions.result[conditions.result.length-1]==conditions.numCustomer){
        return {
            messageContent: 'Die Route ist unvollständig. Es fehlen noch Kunden!',
            messageStyle: 'alert',
        };
    } else if (
        conditions.constraints.time.value > conditions.constraints.time.limit ||
        (conditions.constraints.time.value == conditions.constraints.time.limit &&
            conditions.result[conditions.result.length-1]!=conditions.numCustomer)){
            return {
                messageContent: 'Die Zeit reicht nicht!',
                messageStyle: 'alert',
            };
        } else if (
            conditions.constraints.pull.value > conditions.constraints.pull.limit ||
            (conditions.constraints.pull.value == conditions.constraints.pull.limit &&
                conditions.result[conditions.result.length-1]!=conditions.numCustomer)){
                return {
                    messageContent: 'Die Sortieraktionen reichen nicht. Überspringen Sie!',
                    messageStyle: 'alert alert-warning',
                };
            } else if (
            conditions.constraints.load.value > conditions.constraints.load.limit){
                return {
                    messageContent: 'Die Essensportionen reichen nicht!',
                    messageStyle: 'alert',
                };
                } else if (
                    (conditions.constraints.time.value > conditions.constraints.time.limit ||
                    (conditions.constraints.time.value == conditions.constraints.time.limit &&
                        conditions.result[conditions.result.length-1]!=conditions.numCustomer)) &&
                        conditions.constraints.load.value > conditions.constraints.load.limit){
                        return {
                            messageContent: 'Weder Zeit noch Essensportionen reichen!',
                            messageStyle: 'alert',
                        };                
                                           
                    } else if (conditions.goal.value == conditions.goal.limit){
                            if (conditions.result[conditions.result.length-1]==conditions.numCustomer){
                                return {
                                    messageContent: 'Sie haben die Aufgabe gelöst!',
                                    messageStyle: 'alert alert-ok background-ok',
                                };
                            } else {
                                return {
                                    messageContent:  'Genügend Kunden vorhanden. Sie können zu MyFarm zurückkehren.',
                                    messageStyle: 'alert',
                                };                       
                            }
                        } else if (conditions.goal.value > conditions.goal.limit && 
                            conditions.result[conditions.result.length-1]==conditions.numCustomer){
                                return {
                                    messageContent: 
                                    'Toll, Sie haben die Erwartungen übertroffen!',
                                    messageStyle: 'alert alert-ok background-ok',
                                };
                            } else {
                                    return {
                                    messageContent: '',
                                    messageStyle: 'invisible',
                                };
                            }
                        }

/* code for take over handling */                      

function takeoverAlert() {
    const element = document.querySelector(".takeover");
    if (element != null){
        console.log('TOR turned on');
        element.style.cssText = "visibility: visible;";
        element.classList.add("alert", "alert-danger");
        document.getElementById("pause").disabled = false;
    };
}

function turnOffTOR() {
    console.log('tor turned off');
    const element = document.querySelector(".takeover");
    element.style.cssText = "visibility: invisible;";
    element.classList.remove("alert", "alert-danger"); 
    document.getElementById("pause").disabled = true;
} 

/* to wait for 10 minutes, check for task processing status */
var wait = ms => new Promise((r, j)=>setTimeout(r, ms))

/* Countdown Class from https://stackoverflow.com/questions/59597093/how-to-stop-the-execution-of-an-asynchronous-processing-by-an-external-command 
 here you can set Time Budget until handover */
class Countdown {
    constructor(onStart, onEnd, onAbort)
      {
      this.timeout       = null;
      this.handleCatch   = onAbort;
      this.handleFinally = onEnd;
      this.starter       = (res, rej) => {
                              onStart();
                              this.timeout = setTimeout(function(){
                                  let btn = document.getElementById('pause');
                                  if(typeof(btn) != 'undefined' && btn != null){
                                    btn.click();
                                    study.options.datastore.state.response = 'handover';
                                    study.parameters.torHandoverTime = performance.now();
                                    // study.parameters.timer_handover = this.time();
                                }
                              }, 8000);
                              

                              // Pass the `reject` function to a property to be used later
                              this.aborter = rej;
                            };
      }
    async start()
      {
      try 
        {
        // Only one `Promise` is needed.
        this.main = await new Promise(this.starter);
        } 
      catch(e)  /* This will run on abort */
        {
        // Stop the timeout
        clearTimeout(this.timeout);
        // Reset the property to make sure `abort` can only be run once for each valid timeout.
        this.aborter = null;
        this.handleCatch();
        } 
      finally /* This will run after everything ends */
        {
        this.handleFinally();
        } 
      }
    abort()
      {
      if (typeof this.aborter === 'function')
        {
        // Use the `reject` that is passed to this property earlier.
        this.aborter();    
        }
      }
    }

/* here you can set things to to in countdown */

const countdown = new Countdown(
    /* onStart  */ ()=> {
                        console.log('start countdown')
                        takeoverAlert();
                        },
    /* onEnd    */ ()=> {
                        study.timeout === true;
                        },
    /* onAbort  */ ()=> {
                        // study.timeout === true;
                        }
    )

/*var handleTor = async function(){
    console.log('start waiting');
    await wait(4000);
    checkTaskProcessing();
    takeoverAlert();
    wait(8000);
    turnOffTOR();
    console.log('checked Timeout')
}

function checkTaskProcessing(){
    if (study.conditions != undefined){
        if (study.conditions.constraints.pull.value == study.pullAlert){
            console.log('true');
            return true;
        } else {
            console.log('false');
            return false;
        };
    };    
}*/

function giveFeedbackValues(conditions, configuration) {
    // no edge available
    if (/*isNaN(conditions.constraints.time.value)){
        return {
            goalLabel: '',
            goalValue: '',
            consLabel: '', // new feedback layout so only one label necessary
            //timeLabel: '',
            timeValue: '',
            //loadLabel: '',
            loadValue: '',
            //pullLabel: '',
            pullValue: '',
            tabVis: 'invisible',};
        } else if (*/
            configuration.declarative === "easy"){
                let neededCustomer = conditions.goal.limit - conditions.goal.value;
                let remainingTime = conditions.constraints.time.limit - conditions.constraints.time.value;
                let remainingLoad = conditions.constraints.load.limit - conditions.constraints.load.value;
                let remainingPulls = conditions.constraints.pull.limit - conditions.constraints.pull.value;
                return {
                    // goalLabel: 'Benötigte Kunden:',
                    goalLabel: 'Benötigt',
                    goalValue: neededCustomer.toString(),
                    consLabel: 'Verfügbar',
                    // timeLabel: 'Verfügbare Zeit:',
                    timeValue: remainingTime.toString(),
                    // loadLabel: 'Verfügbare Menge:',
                    loadValue: remainingLoad.toString(),
                    // pullLabel: 'Verfügbare Sortieraktionen:',
                    pullValue: remainingPulls.toString(),
                    tabVis: 'empty',};
                } else {
                    let neededCustomer = conditions.goal.value;
                    let remainingTime = conditions.constraints.time.value;
                    let remainingLoad = conditions.constraints.load.value;
                    let remainingPulls = conditions.constraints.pull.value;
                    return {
                        // goalLabel: 'Berücksichtigte Kunden:',
                        goalLabel: 'Bedient',
                        goalValue: neededCustomer.toString(),
                        consLabel: 'Verbraucht',
                        // timeLabel: 'Verbrauchte Zeit:',
                        timeValue: remainingTime.toString(),
                        // loadLabel: 'Gelieferte Menge:',
                        loadValue: remainingLoad.toString(),
                        // pullLabel: 'Getätigte Sortieraktionen:',
                        pullValue: remainingPulls.toString(),
                        tabVis: 'empty',}
                    }

            };

function isSolutionValid(conditions) {
    if (conditions.goal.value >= conditions.goal.limit &&
        conditions.constraints.time.value <= conditions.constraints.time.limit &&
        conditions.constraints.load.value <= conditions.constraints.load.limit &&
        conditions.constraints.pull.value <= conditions.constraints.pull.limit &&
        conditions.result[conditions.result.length-1]==conditions.numCustomer)
        { return true;
        } else {
            //alert("Ungültige Route!");
            //returnToPreviousPage();
            return false;
        };
    }

    //calculate Costs 
function costOf(nodeindex1, nodeindex2){
    var key = nodeindex1.toString().concat("-", nodeindex2.toString());
    return study.edges[key];
  }
  
  function calculateCost(arr){
    var sum = 0;
    for (i = 0; i<arr.length-1; i++){
      let j=i+1
      sum += costOf(arr[i], arr[j]);
     /* console.log('i ist:' + i.toString() + 'und arr[i] ist: ' + arr[i] +
      *'und j ist:' + j.toString() + 'und arr[j] ist: ' + arr[j] + 'sum ist: ' + sum)*/
    }
    return sum;
  }
  
  function calculateLoad(arr){
    var sum = 0;
    for (i = 1; i<arr.length; i++){
      var key=arr[i];
      sum += study.nodes[key];
    }
    return sum;
  } 

  
/* add My menu to the second list */
function addMyMenu(numCustomer) { 
    // erstelle ein neues listen Element
    // und gib ihm etwas Inhalt
    var newListItem = document.createElement("li"); 
    var newContent = document.createTextNode("MyFarm"); 
    newListItem.appendChild(newContent); // füge den Textknoten zum neu erstellten div hinzu.
    newListItem.setAttribute("id", numCustomer.toString());
    newListItem.setAttribute("class", "unsortable ui-state-default");
  
    // füge das neu erstellte Element und seinen Inhalt ins DOM ein
    var domLocation = document.getElementById("sortable2"); 
    domLocation.append(newListItem); 
  }

function setDragStartTime(){
    study.parameters.pfn_start =  performance.now();
}

function getFormValue(label){
    return study.options.datastore.get(label);
  }
  
function setCondition(trial) {
  switch(trial) {
    case '-1':   case '0':
      condition =getFormValue("ndt-training-condition");
      break;
    default:
      condition = getFormValue("ndt-between-condition");
  }
  return condition
}
