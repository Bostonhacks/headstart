var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, 
    function(req, email, password, done) {
        process.nextTick(function() {

            if (!validateEmail(req.body.email)) {
                return done(null, false, req.flash('signupMessage', 'Please make sure your email is valid.'));
            }

            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err) {
                    return done(err);
                } else if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else if (password.length < 6) {
                    return done(null, false, req.flash('signupMessage', 'Password must be at least 6 characters.'));
                } else {
                    var newUser = new User();
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.registered = false;
                    newUser.major = "peen";

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });    
        });
    }));

    passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {        
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err) {
                return done(err);
            } else if (!user) {
                return done(null, false, req.flash('loginMessage', 'Invalid email/password combination.'));
            }
            return done(null, user);
        });
    }));
}
