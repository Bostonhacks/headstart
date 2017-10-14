import { getQuestionId, getQuestionText } from './registration-gather-data.js';
// NOTE: Much of this logic is repeated throughout the code
// For example similar functions live in the registration-logic.js file.
$(document).ready(function() {
	$('.cr-other').keypress(function(event) {
    // if there's a function scheduled (global variable)
    debugger
    // schedule a submission
    var classes = event.target.classList;
    var questionId = getQuestionId(classes, 'cr');
    var question = getQuestionText(questionId);
    var responseId = event.target.id;
    var response = $('#' + responseId).val();
    var userResponse = createQuestionObject(questionId, question, responseId, response);
    if (userResponse != undefined) return saveResponse(userResponse);
  });


});