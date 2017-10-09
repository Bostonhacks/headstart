'use es6';
/* Ajax set-up for saving user's responses as they fill out the team forming questionairre */
$(document).ready(function() {
  /*
   	Divs that contain answer to questions have a general q class and 
   	qX class where X is the number of the question. The div that contains 
   	question formulation has an id of qX. Therefore, when a user clicks
   	on a question response, we get the qX by first getting a list of classes of
   	a clicked object, then finding a string that starts with q and has 
   	length > 1 (qX), and then get the question with id=qX.	 		
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
  */
  var getQuestionId = function(questionClasses) {
    for (var i = 0; i < questionClasses.length; i++) {
      if (questionClasses[i].charAt(0) == 'q') {
        if (questionClasses[i].length > 1) {
          return questionClasses[i];
        }
      }
    }
  };

  /**
  Gets the text inside an element with the passed in id
  */
  var getQuestionText = function(questionId) {
    return $("#" + questionId).text();
  };

  var processCustomInputFromOtherField = function(questionId) {
    return $("#" + questionId).text();
  };

  var checkTypeOfInput = function(questionClasses) {
    for (var i = 0; i < questionClasses.length; i++) {
      if (questionClasses[i].charAt(0) == 'q') {
        if (questionClasses[i].length > 1) {
          return questionClasses[i];
        }
      }
    }
  };

  var processUserPreference = function(event) {
    // debugger;
    var questionClasses = event.target.parentElement.classList;
    var questionId = getQuestionId(questionClasses);
    if (questionId == undefined) return;
    var question = getQuestionText(questionId);
    
    var responseId = event.target.id;
    var response;
    if(questionClasses.indexOf("other") > 0) {
			response = $('#' + responseId).val();
    } else {
    	response = $($('#' + responseId)[0].labels[0]).text(); // cause javascript
    }
        
    return createQuestionObject(questionId, question, responseId, response);
  }

  var saveResponse = function(userPreferenceObject) {
    var data = {'data': 	JSON.stringify(userPreferenceObject) };
    $.post("/save-question-response", data, function(data, status){
    	console.log(data);
      console.log(status);
    });
  }

  /**
  On click listener for when a user interacts with the 
  items in the survey. Calls the driver function processUserPreference
  which is responsible for program flow and returns the object that
  could be sent to the backend.
  */
  $('.q').click(function(event) {
    var userPreferenceObject = processUserPreference(event);
    console.log(userPreferenceObject);
    if (userPreferenceObject != undefined) return saveResponse(userPreferenceObject);
    // debugger;
  });

});