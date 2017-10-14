/** Ajax set-up for saving user's responses as they fill out the team forming questionairre
  If its .q, then these are the check boxes. If its .slider-answer-option, 
  then its the sliders. If its .question-options, then its the radios
*/

/**
Creates and populates a dictionary containing information 
about the question and the user's response.
*/
var createQuestionObject = function(questionId, question, responseId, response) {
  var questionResponse = {};
  questionResponse['questionId'] = questionId;
  questionResponse['responseId'] = responseId;
  questionResponse['question'] = question;
  questionResponse['response'] = response;
  return questionResponse;
};

/**
Helper for getting the question id to get the question itself.
This is getting reused in multiple files and we are 
relayin on a modern browser support for the exports. See Issue #57 
in the github repo for more information.
*/
export function getQuestionId(classes, type) {
  var typeLength = type.length
  for (var i = 0; i < classes.length; i++) {
    console.log(classes[i].substr(0,typeLength));
    if (classes[i].substr(0, typeLength) == type) {
      debugger
      if (classes[i].length > 1) {
        return classes[i];
      }
    }
  }
};

/**
Gets the text inside an element with the passed in id
*/
export function getQuestionText(questionId) {
  return $("#" + questionId).text();
};


var processCheckboxResponse = function(event) {
  var classes = event.target.parentElement.classList;
  var questionId = getQuestionId(classes, 'q');
  if (questionId == undefined) return;
  var question = getQuestionText(questionId);
  var responseId = event.target.id;
  //var response = $("label[for='" + responseId + "']").text();
  var response = $($('#' + responseId)[0].labels[0]).text(); // cause javascript
  userResponse = createQuestionObject(questionId, question, responseId, response);
  // if the user unchecked the box, mark that
  if (!event.target.checked) userResponse.unchecked = true;
  return userResponse;
}

/**
Makes an ajax post request to the server.
*/
var saveResponse = function(userPreferenceObject) {
  var data = { 'data': JSON.stringify(userPreferenceObject) };
  $.post("/save-question-response", data, function(data, status) {
    // console.log(data);
    // console.log(status);
  });
}

/**
  Listens to click actions on the checkbox elements
  */
$('.q').click(function(event) {
  var userPreferenceObject = processCheckboxResponse(event);
  // console.log(userPreferenceObject);
  if (userPreferenceObject != undefined) return saveResponse(userPreferenceObject);
});

/**
  Listens to keypress actions on 'Other' input fields.
  Debounce (don't send a request every keypress, only when they stop typing)
  */
$('.other').keypress(function(event) {
  // if there's a function scheduled (global variable)
  if (typeof typeFunc !== 'undefined') {
    window.clearTimeout(typeFunc);
  }
  // schedule a submission
  typeFunc = window.setTimeout(function(event) {
    var classes = event.target.parentElement.classList;
    var questionId = getQuestionId(classes);
    var question = getQuestionText(questionId);
    var responseId = event.target.id;
    var response = $('#' + responseId).val();
    var userResponse = createQuestionObject(questionId, question, responseId, response);
    if (userResponse != undefined) return saveResponse(userResponse);
  }.bind(null, event), 350);
});

/**
 * Get data from team selection preferences at the end of the form
 */

$('.radio').click(function(event) {
	var classes = event.target.classList;
	var questionId = getQuestionId(classes, 'q');
	var question = getQuestionText(questionId);
	var response = event.target.value;
	var responseId = event.target.id;
	var userResponse = createQuestionObject(questionId, question, responseId, response);
  if (userResponse != undefined) return saveResponse(userResponse);
})