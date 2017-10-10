const errorhandler = require('./errorhandler')
const Formation = require('../models/teamFormation')

module.exports = {
  submitAnswer: function (userId, userResponse, next) {
    if (userResponse.unchecked) {
      Formation.remove({
        userId: userId,
        questionId: userResponse.questionId,
        responseId: userResponse.responseId
      }, function(err, res){
        if (err) errorhandler.logErrorMsg('teamFormation.updateQuery', err)
        return next()
      })
    } else {
      // DOESN'T YET WORK
      Formation.insert({
        userId: 1,
        questionId: 2,
        responseId: 3,
        question: "yes?",
        response: "no."
      }, function(err, next) {
        console.log("returning here")
        if (err) console.log(err)
        if (err) errorhandler.logErrorMsg('teamFormation.updateQuery', err)
        return next()
      })
    }
  }
}

/*
      Formation.update({
        userId: userId,
        questionId: userResponse.questionId,
        responseId: userResponse.responseId
      }, {
        $set : {
          question: userResponse.question,
          response: userResponse.response
        }
      }, {
        upsert: true
      }, function (err, res) {
        if (err) errorhandler.logErrorMsg('teamFormation.updateQuery', err)
        return next()
      }) 
  */

