$(function() {

  var createExperienceObject = function(responseId, response, questionClasses, question, fullQuestion) {
    var result = {};
    var questionObject = {};
    questionObject['fullQuestion'] = fullQuestion;
    questionObject['category'] = question;
    result['question'] = questionObject;
    result['response'] = response;
    result['questionClasses'] = questionClasses;
    result['responseId'] = responseId;
    return result;
  }

  var processExperienceSlider = function(event, ui) {    
    var responseId = event.target.id;
    var responseArr = responseId.split('-');    
    var response = experienceLabels[ui.value];
    var questionClasses = responseArr[0] + '.' + responseArr[1];
    var question = $('.' + questionClasses).text();
    var fullQuestion = $('.' + responseArr[0] + '-question').text();
    var experienceObject = createExperienceObject(responseId, response, questionClasses, question, fullQuestion);
    return 0;
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
    change: function( event, ui ) {
      processExperienceSlider(event, ui);      
    },
    tickArray: [0, 1, 2, 3],
    tickLabels: experienceLabels
  });


  $('.rate-slider').labeledslider({min: 1, max: 5, tickInterval: 1, tickArray: [1, 2, 3, 4, 5] });
});