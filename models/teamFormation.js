const mongoose = require('mongoose')

const teamFormationSchema = mongoose.Schema({
  userId: String,
  questionId: String,
  responseId: String,
  question: String,
  response: String
})

module.exports = mongoose.model('Formation', teamFormationSchema)

