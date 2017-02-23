const errorhandler = require('./errorhandler')
const User = require('../models/user')

module.exports = {
  mlhUpdate: function (id, data) {
    User.findOneAndUpdate({ '_id': id }, data, {upsert: true}, function (err, raw) {
      if (err) errorhandler.logErrorMsg('update.mlhUpdate', err)
      return raw
    })
  },
  additionalUpdate: function (id, data) {
    User.findOneAndUpdate({ '_id': id }, data, {upsert: true}, function (err, raw) {
      if (err) errorhandler.logErrorMsg('update.additionalUpdate', err)
      return raw
    })
  },
  registered: function (id) {
    User.findOneAndUpdate({ '_id': id }, {'local.registered': true, 'status': 'Pending'}, {upsert: true}, function (err, raw) {
      if (err) errorhandler.logErrorMsg('update.registered', err)
      return raw
    })
  },
  notAttending: function (id, data) {
    User.findOneAndUpdate({ '_id': id }, data, {upsert: true}, function (err, raw) {
      if (err) errorhandler.logErrorMsg('update.notAttending', err)
      return raw
    })
  }
}
