const errorhandler = require('./errorhandler')
const User = require('../models/user')

module.exports = {
  userQuery: function (param, val) {
    // Remember to filter out students who said they aren't attending

    // 'school.name': 'Boston University'
    User.find({param: val}, function (err, users) {
      if (err) errorhandler.logErrorMsg('admin.userQuery', err)
      return users
    })
  },
  getAllUsers: function(req, res, next) {
  	// {"local.registered": false}
  	User.find({}, function(err, users) {
      // Not sure this is the right error message to log, just doing it based on the above function.
      if (err) errorhandler.logErrorMsg('admin.userQuery', err)
      return next(users)
    })
  },
  changeStatus: function(userid, stat, next) {
    User.update({_id: userid}, {$set: {status: stat}}, function(err, raw){
      return next()
    })
  },
  // returns true if the email given is an admin email
  isAdmin: function(emailAddr) {
    return process.env.ADMIN_EMAILS.includes(emailAddr)
  },
  checkUserIn: function(userid, next) {
    User.update({_id: userid}, {$set: {
      checkedIn: true, 
      checkInDate: (new Date()).toString()
    }}, function(err, raw){
      return next()
    })
  }, 
  unCheckUserIn: function(userid, next) {
    User.update({_id: userid}, {$set: {checkedIn: false}}, function(err, raw){
      return next()
    })
  }
}
