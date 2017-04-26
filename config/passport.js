const errorhandler = require('./errorhandler')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const validator = require('validator')

module.exports = function (passport) {
  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    req.flash('submittedEmail', email)

    // Make sure the email is actually valid serverside
    if (!validator.isEmail(email)) {
      return done(null, false, req.flash('signupMessage', 'Please make sure your email is valid.'))
    }

    // April 10th: Adding this code to only accept new signups from the following email domains
    var validLateRegistration = false
    var validEndings = ['@bu.edu', '@mit.edu', '@husky.neu.edu', '@citymail.cuny.edu', '@student.bridgew.edu', '@umass.edu', '@bhcc.edu', '@g.rit.edu', '@csh.rit.edu', '@mail.arcrealityinc.com', '@umich.edu']
    for(i = 0; i < validEndings.length; i++) {
      if (email.endsWith(validEndings[i])) {
        validLateRegistration = true
      }
    }

    if (!validLateRegistration) {
      return done(null, false, req.flash('signupMessage', 'We are now only accepting new applications from local Boston students.'))
    }

    User.findOne({ 'local.email': email }, function (err, user) {
      if (err) {
        errorhandler.logErrorMsg('passport.signup.lookup', err)
        return done(err)
      }
      if (user) return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
      if (password.length < 9) return done(null, false, req.flash('signupMessage', 'Password must be at least 9 characters.'))

      var newUser = new User()
      newUser.local.email = email
      newUser.local.password = newUser.generateHash(password)
      newUser.local.registered = false

      newUser.save(function (err) {
        if (err) errorhandler.logErrorMsg('passport.signup.save', err)
        return done(null, newUser)
      })
    })
  }))

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    req.flash('submittedEmail', email)
    User.findOne({ 'local.email': email }, function (err, user) {
      if (user && !err) return done(null, user)

      // The error message will usually be an invalid combination unless an error occurred
      var errorMessage = 'Invalid email/password combination.'
      if (err) {
        errorMessage = 'Server error. Please try again.'
        errorhandler.logErrorMsg('passport.login', err)
      }

      done(null, false, req.flash('loginMessage', errorMessage))
    })
  }))

  // "Why do we need these two functions?" -> https://github.com/jaredhanson/passport#sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) { done(err, user) })
  })
}
