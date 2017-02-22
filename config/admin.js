const errorhandler = require('./errorhandler')
const User = require('../models/user')

module.exports = {
  userQuery: function (param, val) {
    // 'school.name': 'Boston University'
    User.find({param: val}, function (err, users) {
      if (err) errorhandler.logErrorMsg(err)
      return users
    })
  }
}
