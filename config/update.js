var User = require('../models/user');

module.exports = {
  mlhUpdate: function(id, data) {
    User.findOneAndUpdate({ '_id': id }, data, {upsert: true}, function (err, raw) {
      if (err) return handleError(err);
        console.log(raw);
    })
  },
  additionalUpdate: function(id, data) {
    User.findOneAndUpdate({ '_id': id }, data, {upsert: true}, function (err, raw) {
      if (err) return handleError(err);
        console.log(raw);
    })
  },
  registered: function(id) {
    User.findOneAndUpdate({ '_id': id }, {'local.registered': true}, {upsert: true}, function (err, raw) {
      if (err) return handleError(err);
        console.log(raw);
    })
  }
} 