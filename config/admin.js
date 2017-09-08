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
  // getAllAdminInfo: function (req, res, next) {
  //   // The admin panel needs to see all registered users
    // User.find({"local.registered": false}, function(err, users) {
    //   // Not sure this is the right error message to log, just doing it based on the above function.
    //   if (err) errorhandler.logErrorMsg('admin.userQuery', err)
    //   return next(users)
    // })
  // }
  getAllUsers: function(req, res, next) {
  	User.find({"local.registered": false}, function(err, users) {
      // Not sure this is the right error message to log, just doing it based on the above function.
      if (err) errorhandler.logErrorMsg('admin.userQuery', err)
      return next(users)
    })
  }
}
