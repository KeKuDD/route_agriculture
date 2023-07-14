/* function to draw randomly an integer*/
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

/* function to log takeover time */
function logTakeoverTime(){
  study.parameters.torTakeoverTime = performance.now();
  // study.parameters.timer_takeover = this.time();
}
/* function to save start-time */
function setLoadTime (){
  let loadTime = performance.now();
  study.parameters.LoadTime = loadTime;
  // study.parameters.timer_load = this.time();
}

function getLastArrayItem(array){
  //if the array is empty return null
  return array[array.length-1] || null 
}

/* calculate feedback and save results */

function provideFeedback(numCustomer, image){
    let count = 0; // -1;  // because inserting myMenu is counted
    let sorted2 = "";
    return function(event, ui) {
    study.feedback.classList.remove('alert-danger', 'empty', 'alert-warning', 'invisible', 'alert', 'alert-ok');
    study.feedback.innerHTML=('');
    study.tabVis.classList.remove('invisible');
    countAction = ++count;
    var result = $(this).sortable('toArray');
    sorted2 = result.map(Number).map(function(value) { 
      return value - 1; 
      } );
    sorted2 = sorted2.map(function(e) { 
        return e.toString();
      }); 
    result.unshift(numCustomer.toString()); // to prepend id of MyMenu to array  
    let cost = calculateCost(result); 
    let load = calculateLoad(result);
    function checkHome(arr) {
        return arr != numCustomer.toString()
        };
    let customer = result.filter(checkHome).length;
    /*pack all relevant values and conditions in one object*/
    let conditions={
      goal: {
        value: customer, 
        limit: study.MINCUSTOMERS
        },
      constraints: {
        time: {
          value: cost, 
          limit: study.MAXTIME
          },
        load: {
          value: load, 
          limit: study.MAXLOAD
          },
        pull: {
          value: countAction, 
          limit: study.MAXPULLS
          }
      },
      result: result,
      numCustomer: numCustomer
    };           
    let feedbackAlertObject = giveFeedbackAlert(conditions=conditions);
    if (typeof feedbackAlertObject !== 'undefined'){
      study.feedback.innerHTML = feedbackAlertObject.messageContent;
      $(study.feedback).addClass(feedbackAlertObject.messageStyle);
      };
    let locFBValues =  giveFeedbackValues(conditions=conditions, configuration=study.configuration);
    if (typeof locFBValues !== 'undefined'){
      study.locGoalLabel.innerHTML = locFBValues.goalLabel;
      study.locGoalValue.innerHTML = locFBValues.goalValue;
      // study.locTimeLabel.innerHTML = locFBValues.timeLabel;
      study.locConsLabel.innerHTML = locFBValues.consLabel;
      study.locTimeValue.innerHTML = locFBValues.timeValue;
      // study.locLoadLabel.innerHTML = locFBValues.loadLabel;
      study.locLoadValue.innerHTML = locFBValues.loadValue;
      // study.locPullLabel.innerHTML = locFBValues.pullLabel;
      study.locPullValue.innerHTML = locFBValues.pullValue;
      $(study.tabVis).addClass(locFBValues.tabVis);
      } else {};
    study.conditions = conditions;  
    if (typeof sorted2 != "undefined") {
          study.parameters.sorted2 = sorted2};
    study.parameters.route = result.toString();
    study.parameters.numberAttempts = countAction;
    //study.options.datastore.set({'intermRoute': result.toString(),'image': image, 'sortTimestamp': event.timeStamp});
   // study.options.datastore.commit();
   // console.log(study.conditions.constraints.pull.value + study.pullAlert);
    /*if (study.numPotRoutes % 3 == 0 && study.conditions.constraints.pull.value >= study.pullAlert) {
      document.getElementById("pause").disabled = false;
        };    */
   /* console.log(this.timeout === true);
    console.log(study.conditions.constraints.pull.value == study.pullAlert)
    if (study.timeout === true && study.conditions.constraints.pull.value == study.pullAlert) {
      btn = document.getElementById('pause')
      btn.addEventListener('click', countdown.abort.bind(countdown));
      // console.log(study.timeout === true);
      // console.log(study.conditions.constraints.pull.value == study.pullAlert);
      // takeoverAlert();
      countdown.start();
      // const btn = document.getElementById('pause');
      // turnOff();
    };*/
  };
};


function torHandling(){
  console.log('started torhandling');
  console.log(study.timeout === true);
  if (study.timeout === true && study.torCount == 0){
    let btn = document.getElementById('pause'); 
    btn.addEventListener('click', () => {
      countdown.abort.bind(countdown);
      logTakeoverTime();
      study.options.datastore.state.response = 'takeover';
    });
    // console.log(study.timeout === true);
    // console.log(study.conditions.constraints.pull.value == study.pullAlert);
    // takeoverAlert();
    countdown.start();
    study.parameters.torStartTime = performance.now();
    // study.parameters.timer_torStart = this.time();
    study.torCount++;
    console.log('torCount is:' + study.torCount)
    // const btn = document.getElementById('pause');
    // turnOff();
  };
} 
