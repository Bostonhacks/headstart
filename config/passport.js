var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var emailfns = require('./emailfns');

module.exports = function(passport) {
    passport.use('signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, 
    function(req, email, password, done) {  
        req.flash('submittedEmail', email);
    
        // Make sure the email is actually valid serverside
        if (!emailfns.validateEmail(email)) {
            return done(null, false, req.flash('loginMessage', 'Please make sure your email is valid.'));
        }

        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err) {
                return done(err);
            } else if (user) {
                return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
            } else if (password.length < 9) {
                return done(null, false, req.flash('loginMessage', 'Password must be at least 9 characters.'));
            } else {
                var newUser = new User();
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.registered = false;

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });    
    }));

    passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        req.flash('submittedEmail', email);

        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err) {
                return done(err);
            } else if (!user || !user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Invalid email/password combination.'));
            }
            return done(null, user);
        });
    }));


    // "Why do we need these two functions?" -> https://github.com/jaredhanson/passport#sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
