const bases = require('bases')
const bcrypt = require('bcrypt-nodejs')
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
const sgmail = require('sendgrid').mail
const User = require('../models/user')
const validator = require('validator')

function generateLink (user, next) {
  var ident = user._id
  var d = new Date()
  var today = bases.toBase36(d.getTime())

    // Doing this replace because bcrypt uses forward slashes which we can't use for data in URLs
  var hash = bcrypt.hashSync(user.local.email + user.local.password).replace(/\//g, '~')
  console.log(hash)

  next('bostonhacks.io/change-password/' + ident + '/' + today + '-' + hash)
}

function sendForgotPasswordEmail (user) {
  generateLink(user, function (link) {
    var bodyContent = "<html>\
        <body>\
        Forgot your password? No problem!\n \
        Reset your password by clicking the link below or copying and pasting it into your browser: <br><br> \
        <a href='" + link + "'>" + link + "</a><br><br>\
        Questions? Shoot us an email at <a href='contact@bostonhacks.io'>contact@bostonhacks.io</a>\
        </body>\
        </html>"

    console.log(bodyContent)

    var from_email = new sgmail.Email('contact@bostonhacks.io')
    var to_email = new sgmail.Email(user.local.email)
    var subject = 'Reset your Bostonhacks Password'
    var content = new sgmail.Content('text/html', bodyContent)
    var mail = new sgmail.Mail(from_email, subject, to_email, content)

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    })

    sg.API(request, function (error, response) {
      console.log(response.statusCode)
      console.log(response.body)
      console.log(response.headers)
    })
  })
}

module.exports = {
  resetPassword: function (req, res, next) {
    if (!validator.isEmail(req.body.email)) {
      User.findOne({'local.email': new RegExp('^' + req.body.email + '$', 'i')}, function (err, user) {
        if (err) {
                    // Change this once we have a proper errorhandler
          console.log(err)
          return 'err'
        } else {
          console.log(user)
          if (user == null) {
            req.flash('forgotErrorMessage', 'There is no user with that email.')
            next()
          } else {
                        // Change this once we have a proper errorhandler
            if (user == 'err') {
              req.flash('forgotErrorMessage', 'There was an error, please try again')
              next()
            } else {
              sendForgotPasswordEmail(user)
              req.flash('forgotMessageSuccess', 'An email has been sent to reset your password!')
              next()
            }
          }
        }
      })
    } else {
      req.flash('forgotErrorMessage', 'Please make sure your email is valid.')
      next()
    }
  },
  checkValidLink: function (req, res, next) {
    var d = new Date()
    var ident = req.params.ident
    var timestamp = req.params.timestamp
    var errorMessage = 'Hmmmm.. looks like your link is invalid. Lets try this again!'

        // Again, doing this replace because bcrypt uses forward slashes which we can't use for data in URLs
    var hash = req.params.hash.replace(/~/g, '/')

        // Make sure we sent them this link at least 24 hours ago
    console.log(bases.fromBase36(timestamp) + 86400000)
    console.log(d.getTime())
    console.log(bases.fromBase36(timestamp) + 86400000 > d.getTime())

    if (bases.fromBase36(timestamp) + 86400000 <= d.getTime()) {
      console.log('Link actually expired.')
      req.flash('forgotErrorMessage', errorMessage)
      next(false)
      return
    }

    User.findOne({'_id': ident }, function (err, user) {
      if (err || user == null) { // There is no user with that id
        console.log(err ? err : 'no user found.') // Should handle these better..
        req.flash('forgotErrorMessage', errorMessage)
        next(false, user)
      } else {
        bcrypt.compare(user.local.email + user.local.password, hash, function (err, response) {
          if (!res) {
            req.flash('forgotErrorMessage', errorMessage)
          }
          next(true, user)
        })
      }
    })
  },

  changePassword: function (req, res, next) {
    this.checkValidLink(req, res, function (validLink, user) {
      if (!validLink) { // Exit if link wasn't valid
        next(false)
        return
      } else if (req.body.password.length < 9) {
        req.flash('forgotErrorMessage', 'Invalid password. Must be at least 9 characters long!')
        next(true)
        return
      }

      User.findOneAndUpdate({ '_id': req.params.ident }, {'local.password': user.generateHash(req.body.password) }, function (err, raw) {
        if (err) {
          req.flash('forgotErrorMessage', 'There was an error, please try again.')
          console.log('Error attempting to change password: ' + err)
        } else {
          req.flash('forgotMessageSuccess', 'Your password has successfully been reset! Please try logging in.')
          console.log('User ' + user.local.email + ' successfully reset their password.')
        }
        next(true)
      })
    })
  }
}

