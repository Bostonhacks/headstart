import { saveResponse,
    createQuestionObject, 
    getQuestionId, 
    getQuestionText,
    processCheckboxResponse
} from './registration-gather-data.js';
// NOTE: Much of this logic is repeated throughout the code
// For example similar functions live in the registration-logic.js file.
$(document).ready(function() {
	$('.cr-other').keypress(function(event) {
    // if there's a function scheduled (global variable)
    if (typeof typeFunc !== 'undefined') {
      window.clearTimeout(typeFunc);
    }
    // schedule a submission
    typeFunc = window.setTimeout(function(event) {
      var classes = event.target.parentElement.classList;
      var questionId = getQuestionId(classes, 'q');
      var question = getQuestionText(questionId);
      var responseId = event.target.id;
      var response = $('#' + responseId).val();
      var userResponse = createQuestionObject(questionId, question, responseId, response);
      if (userResponse != undefined) return saveResponse(userResponse);
    }.bind(null, event), 350);
  });
});