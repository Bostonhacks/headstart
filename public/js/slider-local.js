/**
  This file is responsible for getting data from the sliders in the 
  form and sending it to the server.
*/

$(function() {

  /**
  Makes an ajax post request to the server.
  */
  var saveResponse = function(userPreferenceObject) {
    var data = { 'data': JSON.stringify(userPreferenceObject) };
    // console.log(JSON.parse(data.data))
    $.post("/save-question-response", data, function(data, status) {
      console.log(data);
      console.log(status);
    });
  }

  var createResponseObject = function(responseId, response, questionClasses, question, fullQuestion) {
    var result = {};
    var questionObject = {};
    // questionObject['fullQuestion'] = fullQuestion;
    // questionObject['category'] = question;
    // result['question'] = questionObject;
    result['question'] = fullQuestion
    result['subQuestion'] = question
    result['response'] = response;
    result['questionId'] = responseId.split('-')[0]
    // result['questionClasses'] = questionClasses;
    result['responseId'] = responseId;
    return result;
  }

  /**
  ** Section for getting data from an experience slider
  */

  var processExperienceSlider = function(event, ui) {
    var responseId = event.target.id;
    var responseArr = responseId.split('-');
    var response = experienceLabels[ui.value];
    var questionClasses = responseArr[0] + '.' + responseArr[1];
    var question = $('.' + questionClasses).text();
    var fullQuestion = $('.' + responseArr[0] + '-question').text();
    var experienceObject = createResponseObject(responseId, response, questionClasses, question, fullQuestion);
    return experienceObject;
  };

  var experienceLabels = {
    0: 'No experience',
    1: 'Some experience',
    2: 'Completed one project/course',
    3: 'Completed multiple projects/courses',
  };

  $('.experience-slider').labeledslider({
    min: 0,
    max: 3,
    change: function(event, ui) {
      var userResponse = processExperienceSlider(event, ui);
      if (userResponse != undefined) return saveResponse(userResponse);
    },
    tickArray: [0, 1, 2, 3],
    tickLabels: experienceLabels
  });

  /**
  ** Section for getting data from a rating slider
  */
  var ratings = [1, 2, 3, 4, 5];


  var processRateSlider = function(event, ui) {
    var responseId = event.target.id;
    var responseArr = responseId.split('-');
    var response = ui.value;
    var questionClasses = responseArr[0] + '.' + responseArr[1];
    var question = $('.' + questionClasses).text();
    var fullQuestion = $('.' + responseArr[0] + '-question').text();
    var ratingObject = createResponseObject(responseId, response, questionClasses, question, fullQuestion);
    return ratingObject;
  };


  $('.rate-slider').labeledslider({
    change: function(event, ui) {
      var userResponse = processRateSlider(event, ui);
      if(userResponse != undefined) saveResponse(userResponse);
    },
    min: 1,
    max: 5,
    tickInterval: 1,
    tickArray: ratings
  });
});