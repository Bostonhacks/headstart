var User = require('../models/user')

module.exports = {
  mlhUpdate: function (id, data) {
    User.findOneAndUpdate({ '_id': id }, data, {upsert: true}, function (err, raw) {
      if (err) return err
      console.log(raw)
    })
  },
  additionalUpdate: function (id, data) {
    User.findOneAndUpdate({ '_id': id }, data, {upsert: true}, function (err, raw) {
      if (err) return err
      console.log(raw)
    })
  },
  registered: function (id) {
    User.findOneAndUpdate({ '_id': id }, {'local.registered': true, 'status': 'Pending'}, {upsert: true}, function (err, raw) {
      if (err) return err
      console.log(raw)
    })
  },
  notAttending: function (id, data, next) {
    next(User.findOneAndUpdate({ '_id': id }, data, {upsert: true}, function (err, raw) {
      if (err) return err
      console.log(raw)
    }))
  }
}
