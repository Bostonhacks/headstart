const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String,
    registered: Boolean
  },
  dateRegistered: Date,
  email: String,
  first_name: String,
  last_name: String,
  survery_id: mongoose.Schema.Types.ObjectId,
  level_of_study: String,
  major: String,
  shirt_size: String,
  dietary_restrictions: String,
  special_needs: String,
  date_of_birth: Date,
  gender: String,
  phone_number: String,
  school: {
    id: Number,
    name: String
  },
  firstHackathon: Boolean,
  reimbursementSeeking: Boolean,
  reimbursementLocation: String,
  reimbursementAmount: Number,
  additional: String,
  status: String, // Possible values so far: {'Pending', 'Not Attending'}
  notAttendingReason: String,
  dataSharingAgreed: Boolean
})

// Hash Generation
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password)
}

// Password validation
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password)
}

module.exports = mongoose.model('User', userSchema)
