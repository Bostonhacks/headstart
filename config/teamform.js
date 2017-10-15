const errorhandler = require('./errorhandler')
const Formation = require('../models/formation')

module.exports = {
  submitAnswer: function (req, res, next) {
    var userResponse = JSON.parse(req.body.data)
    var userId = req.user.id
    // parse the questions with sliders
    if (typeof userResponse.question == "object") {
      // give the object a string question and sub question
      questionObj = userResponse.question
      userResponse.question = questionObj.fullQuestion
      userResponse.subQuestion = questionObj.category
      // parse the questionId out of the other fields
      userResponse.questionId = userResponse.responseId.split('-')[0]
    }
    // parse radio button responses
    if (userResponse.responseId.includes("-true") || userResponse.responseId.includes("-false")){
      // turn things like "team-true" and "team-false" to "team" 
      userResponse.responseId = userResponse.responseId.split('-')[0]
    }
    if (userResponse.unchecked) {
      Formation.remove({
        userId: userId,
        questionId: userResponse.questionId,
        responseId: userResponse.responseId
      }, 
      function(err){
        if (err) {
          errorhandler.logErrorMsg('teamFormation.updateQuery', err)
          console.log(err)
        }
        return next()
      })
    } 
    else {
      Formation.update({
        userId: userId,
        questionId: userResponse.questionId,
        responseId: userResponse.responseId
      }, 
      { $set: userResponse }, 
      { upsert : true }, 
      function(err) {
        if (err) {
          errorhandler.logErrorMsg('teamFormation.updateQuery', err)
          console.log(err)
        }
        return next()
      })
    }
  }
}