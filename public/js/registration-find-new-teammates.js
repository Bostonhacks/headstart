// NOTE: Much of this logic is repeated throughout the code
// For example similar functions live in the registration-logic.js file.
import {
  getQuestionId,
  getQuestionText,
  createQuestionObject,
  saveResponse,
  processCheckboxResponse
} from './registration-gather-data.js';

var timer;

$('.ft-other').keyup(function(event) {  
  clearTimeout(timer);
  timer = setTimeout(function() {
    var classes = event.target.classList;
    var questionId = getQuestionId(classes, 'ft');
    var question = getQuestionText(questionId);
    var responseId = event.target.id;
    var response = $('#' + responseId).val();
    var userResponse = createQuestionObject(questionId, question, responseId, response);
    if (userResponse != undefined) return saveResponse(userResponse);
  }, 500);
});

$('.ft').click(function(event) {
  var userPreferenceObject = processCheckboxResponse(event, 'ft');
  if (userPreferenceObject != undefined) return saveResponse(userPreferenceObject);
});