const querystring = require('querystring')
  , request = require('request')
  , path = require('path')
  , updateUser = require('./config/update')
  , forgot = require('./config/forgot');


module.exports = function(app, passport, upload) {
    app.get('/', function(req, res) {
        res.render('pages/index.ejs');
    });

    app.get('/login', function(req, res) {
        if (req.isAuthenticated()){
            res.redirect('/home');
        } else {
            res.render('pages/login.ejs', {
                message: req.flash('loginMessage'),
                email: req.flash('submittedEmail')
            }); 
        }
    });

    app.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), function(req, res) {
        res.redirect('/home');
    });

    app.get('/signup', function(req, res) {
        if (req.isAuthenticated()){
            res.redirect('/home');
        } else {
            res.render('pages/signup.ejs', {
                message: req.flash('signupMessage'),
                email: req.flash('submittedEmail'),
            }); 
        }
    });

    app.post('/signup', passport.authenticate('signup', { failureRedirect: '/signup' }), function(req, res) {
        res.redirect('/home');
    });


    app.get('/forgot-password', function(req, res) {
        res.render('pages/forgot-password.ejs', {
            forgotErrorMessage: req.flash('forgotErrorMessage'),
            forgotMessageSuccess: req.flash('forgotMessageSuccess')
        });
    });

    app.post('/forgot-password', function(req, res) {
        forgot.resetPassword(req, res, function() {
            res.redirect('/forgot-password');
        });
    });


    app.get('/change-password/:ident/:timestamp-:hash', function(req, res) {
        forgot.checkValidLink(req, res, function(validLink) {
            if (validLink) {
                res.render('pages/change-password.ejs', {
                    forgotErrorMessage: req.flash('forgotErrorMessage'),
                    forgotMessageSuccess: req.flash('forgotMessageSuccess')
                });
            } else {
                res.redirect('/forgot-password');
            }
        });
    });


    app.post('/change-password/:ident/:timestamp-:hash', function(req, res) {
        forgot.changePassword(req, res, function(validLink) {
            if (validLink) {
                res.render('pages/change-password.ejs', {
                    forgotErrorMessage: req.flash('forgotErrorMessage'),
                    forgotMessageSuccess: req.flash('forgotMessageSuccess')
                });
            } else {
                res.redirect('/forgot-password');
            }
        });
    });


    app.get('/home', isLoggedIn, function(req, res) {
        if(req.user.local.registered){
            renderProfile(req, res);
        } else {
            // Format according to Authorization Code Flow: https://my.mlh.io/docs#oauth_flows
            var redirect_url = 'https://my.mlh.io/oauth/authorize?' + 
                querystring.stringify(
                    {
                        client_id: process.env.MLH_ID,
                        redirect_uri: process.env.MLH_CALLBACK_URL,
                        response_type: 'code',
                        scope: ''
                    }
                ) + 'email+phone_number+demographics+event+education+birthday';
                /* 
                    ^ This looks weird ^
                    EXPLANATION: This is because querystring.stringify automatically 
                    uriencodes parameter values and my.mlh wants the +'s as is...
                */

            res.render('pages/application-preMLH.ejs', {
                user : req.user,
                redirect_url: redirect_url
            });
        }
    });

    app.get('/auth/mlh/callback', isLoggedIn, function(req, res) {
        if(req.query.hasOwnProperty("code")){
            request.post('https://my.mlh.io/oauth/token',
                {
                    form: {
                        client_id:      process.env.MLH_ID,
                        client_secret:  process.env.MLH_SECRET,
                        code:           req.query.code,
                        redirect_uri:   process.env.MLH_CALLBACK_URL,
                        grant_type:     'authorization_code'
                    }
                },
                function (error, response, body) {
                    if (typeof error !== 'undefined' && response.statusCode == 200) {
                        authResponse = JSON.parse(body);
                        request.get(
                            'https://my.mlh.io/api/v2/user.json',
                            { form: { access_token: authResponse.access_token } },
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    userResponse = JSON.parse(body);
                                    updateUser.mlhUpdate(req.user.id, userResponse.data);
                                    res.redirect('/almost-done');
                                } else {
                                    console.error("MLH_USER_GET ERROR:" + error);
                                }
                            }
                        );
                    } else {
                        console.error("MLH_AUTH_POST ERROR:" + error);
                    }                    
                }
            );
        } else {
            // Make this more detailed later. Should never happen, but MLH can fail!
            console.error("MLH_CALLBACK ERROR"); 
        }
    });


    app.get('/almost-done', isLoggedIn, function(req, res) {
        if(req.user.local.registered){
            renderProfile(req, res);
        } else {
            res.render('pages/application-postMLH.ejs', {errormessage: '', uploadsuccess: ''});
        }
    });

    app.post('/submit-application', isLoggedIn, upload.single('resume'), function(req, res) {
        var pageRoute = 'pages/application-submitted.ejs';
        var pageArgs = {};
        if (req.body.firstHackathon && req.body.reimbursementSeeking) {  //Add checks for location & amount
            if(req.fileAccepted == false) {
                pageRoute = 'pages/application-postMLH.ejs';
                pageArgs =  { errormessage: 'Please only upload images of type .jpg, .jpeg, .pdf, .png, or .gif' };
            }
        } else {
            pageRoute = 'pages/application-postMLH.ejs';
            pageArgs =  {
                errormessage: 'There was an error with your response. Please try again.'
            };            
        }
        if(pageRoute == 'pages/application-submitted.ejs') {
            updateUser.additionalUpdate(req.user.id, req.body);
            updateUser.registered(req.user.id);
        }
        res.render(pageRoute, pageArgs);
    });

     app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // app.get('/change-account-information', function(req, res) {
    //     res.render('pages/change-account-information.ejs');
    // });

    app.get('/not-attending-confirmation', isLoggedIn, function(req, res) {
        res.render('pages/not-attending-confirmation.ejs', {
            notAttendingTrollMessage: ''
        });
    });

    app.post('/not-attending-confirmation', isLoggedIn, function(req, res) {
        if(req.body.notAttending == 'false') {
            res.render('pages/not-attending-confirmation.ejs', {
                notAttendingTrollMessage: 'Nice troll. Really though, can you no longer attend?'
            });
        } else {
            updateErr = updateUser.notAttending(req.user.id, {
                'status': 'Not Attending',
                'notAttendingReason': req.body.notAttendingReason
            });

            if (updateErr) {
                req.flash('notAttendingMessageError', 'Server error trying to change your status: ' + err);
                console.log("Not Attending error: " + err);
            } else {
                req.flash('notAttendingMessageSuccess', 'Successfully no longer attending.');
            }

            res.render('pages/profile.ejs', {
                email : req.user.local.email,
                status: req.user.local.status,
                notAttendingMessageSuccess: req.flash('notAttendingMessageSuccess'),
                notAttendingMessageError: req.flash('notAttendingMessageError')
            });
        }
    });

    app.get('/500', function(req, res){
        console.log("500 hit")
        throw new Error('This is a 500 Error');
    });

    app.get('/*', isLoggedIn, function(req, res){
        console.log('404 Error trying to hit "' + req.url + '"');
        res.render('pages/404.ejs');
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

function renderProfile(req, res) {
    res.render('pages/profile.ejs', {
        email : req.user.local.email,
        status: req.user.status,
        notAttendingMessageSuccess: '',
        notAttendingMessageError: ''
    });
}
