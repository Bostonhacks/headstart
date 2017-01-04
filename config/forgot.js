var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var sgmail = require('sendgrid').mail;
var User = require('../models/user');
var emailfns = require('./emailfns');
var bcrypt   = require('bcrypt-nodejs');
var bases   = require('bases');

function generateLink(user, next) {
    var ident = user._id;
    var d = new Date();
    var today = bases.toBase36(d.getTime());
    // Doing this replace because bcrypt uses forward slashes which we can't use for data in URLs
    var hash = bcrypt.hashSync(user.local.email + user.local.password).replace(/\//g, "~")
    console.log(hash);

    // CHANGE THIS TO BOSTONHACKS.IO LATER!
    next("bostonhacks.io/change-password/" + ident + "/" + today + "-" + hash);
}

function sendForgotPasswordEmail(user) {
    generateLink(user, function(link) {
        var bodyContent = "<html>\
        <body>\
        Forgot your password? No problem!\n \
        Reset your password by clicking the link below or copying and pasting it into your browser: <br><br> \
        <a href='" + link + "'>" + link + "</a><br><br>\
        Questions? Shoot us an email at <a href='contact@bostonhacks.io'>contact@bostonhacks.io</a>\
        </body>\
        </html>"

        console.log(bodyContent);

        var from_email = new sgmail.Email('contact@bostonhacks.io');
        var to_email = new sgmail.Email(user.local.email);
        var subject = 'Reset your Bostonhacks Password';
        var content = new sgmail.Content('text/html', bodyContent);
        var mail = new sgmail.Mail(from_email, subject, to_email, content);

        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
        });

        sg.API(request, function(error, response) {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        });
    });

}

module.exports = {
    resetPassword: function(req, res, next) {
        if(emailfns.validateEmail(req.body.email)) {
            User.findOne({'local.email': new RegExp('^'+req.body.email+'$', "i")}, function(err, user) {
                if (err) {
                    // Change this once we have a proper errorhandler
                    console.log(err);
                    return "err";
                } else {
                    console.log(user);
                    if (user == null) {
                        req.flash('forgotMessage', 'There is no user with that email.');
                        next();
                    } else {
                        // Change this once we have a proper errorhandler
                        if (user == "err") {
                            req.flash('forgotMessage', 'There was an error, please try again.');
                            next();
                        } else {
                            sendForgotPasswordEmail(user);
                            req.flash('forgotMessageSuccess', 'An email has been sent to reset your password!');
                            next();
                        }
                    }
                }
            });
        } else {
            req.flash('forgotMessage', 'Please make sure your email is valid.');
            next();
        }
    },
    changePassword: function(req, res, next) {
        var ident = req.params.ident;
        var timestamp = req.params.timestamp;
        // Again, doing this replace because bcrypt uses forward slashes which we can't use for data in URLs
        var hash = req.params.hash.replace(/~/g, "/");

        console.log("hello");
        var d = new Date();
        // Make sure we sent them this link at least 24 hours ago

        console.log(bases.fromBase36(timestamp) + 86400);
        console.log(d.getTime());
        console.log(bases.fromBase36(timestamp) + 86400 > d.getTime());
        if (bases.fromBase36(timestamp) + 86400 > d.getTime()) {
            User.findOne({'_id': ident }, function(err, user) {
                if (err) {
                    // Change this once we have a proper errorhandler
                    console.log(err);
                    return "err";
                } else {
                    console.log(user);
                    if (user != null) {
                        // Change this once we have a proper errorhandler
                        if (user == "err") {
                            req.flash('forgotMessage', 'There was an error, please try again.');
                            next();
                        } else {
                            bcrypt.compare(user.local.email+user.local.password, hash, function(err, res) {
                                if (res) {
                                    console.log(req)
                                    User.findOneAndUpdate({ '_id': ident }, {'local.password': user.generateHash(password) }, {upsert: true}, function (err, raw) {
                                        if (err) {
                                            req.flash('forgotMessage', 'There was an error, please try again.');
                                            console.log("Error attempting to change password: " + err)
                                        } else {
                                            req.flash('forgotMessageSuccess', 'Your password has successfully been reset! Please try logging in.');
                                        }
                                    })
                                    next();
                                } else {
                                    req.flash('forgotMessage', 'Hmmmm.. looks like your link is invalid. Lets try this again!');
                                    next();
                                }
                            });
                        }
                    } else {
                        // There is no user with that id
                            req.flash('forgotMessage', 'Hmmmm.. looks like your link is invalid. Lets try this again!');
                        next();
                    }
                }
            });
        } else {
            console.log("actually expired.")
            req.flash('forgotMessage', 'Hmmmm.. looks like your link has expired. Lets try this again!');
            next();
        }



    }
}



