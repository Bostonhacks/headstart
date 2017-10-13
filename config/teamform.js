const errorhandler = require('./errorhandler')
const Formation = require('../models/formation')

module.exports = {
  submitAnswer: function (req, res, next) {
    var userResponse = JSON.parse(req.body.data)
    console.log("User Response: ")
    console.log(userResponse)
    var userId = req.user.id
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
      {
        $set: userResponse
        // {
        //   question: userResponse.question,
        //   response: userResponse.response,
        // }
      }, 
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
