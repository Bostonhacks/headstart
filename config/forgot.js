const bases = require('bases')
const bcrypt = require('bcrypt-nodejs')
const errorhandler = require('./errorhandler')
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
const sgmail = require('sendgrid').mail
const User = require('../models/user')
const validator = require('validator')

function generateLink (user, next) {
  const d = new Date()

  // Doing this replace because bcrypt uses forward slashes which we can't use for data in URLs
  const hash = bcrypt.hashSync(user.local.email + user.local.password).replace(/\//g, '~')
  next('bostonhacks.io/change-password/' + user._id + '/' + bases.toBase36(d.getTime()) + '-' + hash)
}

function sendForgotPasswordEmail (user) {
  generateLink(user, function (link) {
    var bodyContent = '<html><body>Forgot your password? No problem!<br><br>' +
        'Reset your password by clicking the link below or copying and pasting it into your browser: <br><br>' +
        '<a href="' + link + '">' + link + '</a><br><br>' +
        'Questions? Shoot us an email at <a href="contact@bostonhacks.io">contact@bostonhacks.io</a></body></html>'

    var fromEmail = new sgmail.Email('contact@bostonhacks.io')
    var toEmail = new sgmail.Email(user.local.email)
    var subject = 'Reset your Bostonhacks Password'
    var content = new sgmail.Content('text/html', bodyContent)
    var mail = new sgmail.Mail(fromEmail, subject, toEmail, content)

    sg.API(sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    }))
  })
}

module.exports = {
  resetPassword: function (req, res, next) {
    if (!validator.isEmail(req.body.email)) {
      req.flash('forgotErrorMessage', 'Please make sure your email is valid.')
      return next()
    }

    User.findOne({'local.email': new RegExp('^' + req.body.email + '$', 'i')}, function (err, user) {
      if (err) {
        errorhandler.logErrorMsg('forgot.resetPassword', err)
        req.flash('forgotErrorMessage', 'There was an error, please try again')
      } else if (user) {
        sendForgotPasswordEmail(user)
        req.flash('forgotMessageSuccess', 'An email has been sent to reset your password!')
      } else {
        req.flash('forgotErrorMessage', 'There is no user with that email.')
      }
      next()
    })
  },
  checkValidLink: function (req, res, next) {
    var d = new Date()
    var ident = req.params.ident
    var timestamp = req.params.timestamp
    var errorMessage = 'Hmmmm.. looks like your link is invalid. Lets try this again!'

    // Again, doing this replace because bcrypt uses forward slashes which we can't use for data in URLs
    var hash = req.params.hash.replace(/~/g, '/')

    // Make sure we sent them this link at least 24 hours ago
    if (bases.fromBase36(timestamp) + 86400000 <= d.getTime()) {
      // Link actually expired
      req.flash('forgotErrorMessage', errorMessage)
      return next(false)
    }

    User.findOne({'_id': ident}, function (err, user) {
      if (user && !err) {
        bcrypt.compare(user.local.email + user.local.password, hash, function (err, response) {
          if (response && !err) {
            return next(true, user)
          }

          if (!response) req.flash('forgotErrorMessage', errorMessage)
          if (err) {
            errorhandler.logErrorMsg('forgot.checkValidLink.bcrypt', 'Error encountered when trying to compare ' +
              user.local.email + ' and ' + user.local.password + '!\n ' + err)
          }

          next(false, user)
        })
        return
      }

      // Either there was an error or there is no such user with the id in the link
      if (err) errorhandler.logErrorMsg('forgot.checkValidLink', err)
      req.flash('forgotErrorMessage', errorMessage)
      next(false, user)
    })
  },
  changePassword: function (req, res, next) {
    this.checkValidLink(req, res, function (validLink, user) {
      // Exit if link wasn't valid
      if (!validLink) return next(false)

      if (req.body.password.length < 9) {
        req.flash('forgotErrorMessage', 'Invalid password. Must be at least 9 characters long!')
        return next(true)
      }

      User.findOneAndUpdate({'_id': req.params.ident}, {'local.password': user.generateHash(req.body.password)}, function (err, raw) {
        if (err) {
          errorhandler.logErrorMsg('forgot.changePassword', err)
          req.flash('forgotErrorMessage', 'There was an error, please try again.')
        } else {
          req.flash('forgotMessageSuccess', 'Your password has successfully been reset! Please try logging in.')
        }
        next(true)
      })
    })
  }
}

