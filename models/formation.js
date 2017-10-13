const mongoose = require('mongoose')

const teamFormationSchema = mongoose.Schema({
  userId: String,
  questionId: String,
  responseId: String,
  question: String,
  response: String,
  subQuestion: {
  	type: String,
  	required: false
  }
})

module.exports = mongoose.model('Formation', teamFormationSchema)
