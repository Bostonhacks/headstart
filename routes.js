var request = require('request');
var updateUser = require('./config/update');
var path = require('path');

module.exports = function(app, passport, upload) {
    app.get('/', function(req, res) {
        res.render('pages/index.ejs');
    });

    app.get('/login', loginCheck, function(req, res) {
        res.render('pages/login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.post('/login', checkLoginCredentials, passport.authenticate('login', {
        successRedirect : '/home',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/signup', function(req, res) {
        res.render('pages/login.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', checkSignupCredentials, passport.authenticate('signup', {
        successRedirect : '/home',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.get('/forgot-password', isLoggedIn, function(req, res) {
        res.render('pages/forgot-password.ejs');
    });

    app.get('/home', isLoggedIn, function(req, res) {
        console.log(req.user);
        if(req.user.local.registered){
            res.render('pages/profile.ejs', {
                user : req.user
            });
        } else {
            res.render('pages/application-preMLH.ejs', {
                user : req.user
            });
        }
    });
  
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('pages/profile.ejs', {
            user : req.user
        });
    });

    app.get('/auth/mlh/callback', isLoggedIn, function(req, res) {
        if(req.query.hasOwnProperty("code")){
            authURL = 'https://my.mlh.io/oauth/token?client_id='+process.env.MLH_ID+
            '&client_secret='+process.env.MLH_SECRET+'&code='+req.query.code+'&redirect_uri='+
            process.env.MLH_CALLBACK_URL+'&grant_type=authorization_code';

            request.post(authURL,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        authResponse = JSON.parse(body);
                        request.get(
                            'https://my.mlh.io/api/v1/user',
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
            console.error("MLH_CALLBACK ERROR:" + error);
        }
    });


    app.get('/almost-done', isLoggedIn, function(req, res) {
        res.render('pages/application-postMLH.ejs', {errormessage: '', uploadsuccess: ''});
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
        console.log(pageRoute, pageArgs);
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

    app.get('/500', function(req, res){
        console.log("500 hit")
        throw new Error('This is a 500 Error');
    });

    app.get('/*', isLoggedIn, function(req, res){
        console.log('404 Error trying to hit "' + req.url + '"');
        res.render('pages/404.ejs');
    });
};

function checkFile(req, res, next) {
    console.log("here is one: ");
    console.log(req.file);
    console.log(req.files);
    console.log(req.files);
    console.log(req.body);
    console.log(req.params);
    return next();
}

function checkLoginCredentials(req, res, next) {
    if (req.body.email.length == 0 || req.body.password.length == 0) {
        req.flash('loginMessage', 'Invalid email/password combination.');
    } 
    return next();
}

function checkSignupCredentials(req, res, next) {
    if (req.body.email.length == 0 || req.body.password.length == 0) {
        req.flash('signupMessage', 'Invalid email/password combination.');
    }
    return next();
}


function loginCheck(req, res, next) {
    if (req.isAuthenticated()){
        res.redirect('/home');
    }
    return next();
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}