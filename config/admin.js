const errorhandler = require('./errorhandler')
const User = require('../models/user')

module.exports = {
  userQuery: function (param, val) {
    // Remember to filter out students who said they aren't attending

    // 'school.name': 'Boston University'
    User.find({param: val}, function (err, users) {
      if (err) errorhandler.logErrorMsg(err)
      return users
    })
  }
}
