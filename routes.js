const forgot = require('./config/forgot')
const querystring = require('querystring')
const request = require('request')
const updateUser = require('./config/update')

module.exports = function (app, passport, upload) {
  app.get('/', function (req, res) {
    res.render('pages/index.ejs')
  })

  app.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/home')
    } else {
      res.render('pages/login.ejs', {
        initialView: 'login',
        forgotMessageSuccess: '',
        forgotErrorMessage: '',
        message: req.flash('loginMessage'),
        email: req.flash('submittedEmail')
      })
    }
  })

  app.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), function (req, res) {
    console.log(req)
    res.redirect('/home')
  })

  app.get('/signup', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/home')
    } else {
      res.render('pages/login.ejs', {
        initialView: 'signup',
        forgotMessageSuccess: '',
        forgotErrorMessage: '',
        message: req.flash('signupMessage'),
        email: req.flash('submittedEmail')
      })
    }
  })

  app.post('/signup', passport.authenticate('signup', { failureRedirect: '/signup' }), function (req, res) {
    res.redirect('/home')
  })

  app.get('/forgot-password', function (req, res) {
    res.render('pages/login.ejs', {
      initialView: 'forgot',
      message: '',
      email: '',
      forgotErrorMessage: req.flash('forgotErrorMessage'),
      forgotMessageSuccess: req.flash('forgotMessageSuccess')
    })
  })

  app.post('/forgot-password', function (req, res) {
    forgot.resetPassword(req, res, function () {
      res.redirect('/forgot-password')
    })
  })

  app.get('/change-password/:ident/:timestamp-:hash', function (req, res) {
    forgot.checkValidLink(req, res, function (validLink) {
      if (validLink) {
        res.render('pages/change-password.ejs', {
          forgotErrorMessage: req.flash('forgotErrorMessage'),
          forgotMessageSuccess: req.flash('forgotMessageSuccess')
        })
      } else {
        res.redirect('/forgot-password')
      }
    })
  })

  app.post('/change-password/:ident/:timestamp-:hash', function (req, res) {
    forgot.changePassword(req, res, function (validLink) {
      if (validLink) {
        res.render('pages/change-password.ejs', {
          forgotErrorMessage: req.flash('forgotErrorMessage'),
          forgotMessageSuccess: req.flash('forgotMessageSuccess')
        })
      } else {
        res.redirect('/forgot-password')
      }
    })
  })

  app.get('/home', isLoggedIn, function (req, res) {
    if(req.user.local.email === process.env.ADMIN_EMAIL) {
      res.redirect('/admin')
      return
    }

    if (req.user.local.registered) {
      renderProfile(req, res)
    } else {
      // Format according to Authorization Code Flow: https://my.mlh.io/docs#oauth_flows
      var redirectUrl = 'https://my.mlh.io/oauth/authorize?' +
      querystring.stringify({
        client_id: process.env.MLH_ID,
        redirect_uri: process.env.MLH_CALLBACK_URL,
        response_type: 'code',
        scope: ''
      }) + 'email+phone_number+demographics+event+education+birthday'
        /*
            ^ This looks weird ^
            EXPLANATION: This is because querystring.stringify automatically
            uriencodes parameter values and my.mlh wants the +'s as is...
            */

      res.render('pages/application-preMLH.ejs', {
        user: req.user,
        redirectUrl: redirectUrl
      })
    }
  })

  app.get('/auth/mlh/callback', isLoggedIn, function (req, res) {
    if (req.query.hasOwnProperty('code')) {
      request.post('https://my.mlh.io/oauth/token', {
        form: {
          client_id: process.env.MLH_ID,
          client_secret: process.env.MLH_SECRET,
          code: req.query.code,
          redirect_uri: process.env.MLH_CALLBACK_URL,
          grant_type: 'authorization_code'
        }
      }, function (error, response, body) {
        if (typeof error !== 'undefined' && response.statusCode === 200) {
          request.get('https://my.mlh.io/api/v2/user.json', {
            form: { access_token: JSON.parse(body).access_token }
          }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
              updateUser.mlhUpdate(req.user.id, JSON.parse(body).data)
              res.redirect('/almost-done')
            } else {
              console.error('MLH_USER_GET ERROR:' + error)
            }
          })
        } else {
          console.error('MLH_AUTH_POST ERROR:' + error)
        }
      })
    } else {
      // Make this more detailed later. Should never happen, but MLH can fail!
      console.error('MLH_CALLBACK ERROR')
    }
  })

  app.get('/almost-done', isLoggedIn, function (req, res) {
    if (req.user.local.registered) {
      renderProfile(req, res)
    } else {
      res.render('pages/application-postMLH.ejs', {errormessage: '', uploadsuccess: ''})
    }
  })

  app.post('/submit-application', isLoggedIn, upload.single('resume'), function (req, res) {
    // Check for location & amount (since those are required). Checking for frontend tampering
    if (!req.body.firstHackathon || !req.body.reimbursementSeeking) {
      res.render('pages/application-postMLH.ejs', { errormessage: 'There was an error with your response. Please try again.' })
    } else if (req.fileAccepted === false) {
      res.render('pages/application-postMLH.ejs', { errormessage: 'Please only upload images of type .jpg, .jpeg, .pdf, .png, or .gif' })
    } else {
      updateUser.additionalUpdate(req.user.id, req.body)
      updateUser.registered(req.user.id)
      res.render('pages/application-submitted.ejs', {})
    }
  })

  app.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  app.get('/not-attending-confirmation', isLoggedIn, function (req, res) {
    res.render('pages/not-attending-confirmation.ejs')
  })

  app.post('/not-attending-confirmation', isLoggedIn, function (req, res) {
    updateUser.notAttending(req.user.id, {
      'status': 'Not Attending',
      'notAttendingReason': req.body.notAttendingReason
    }, function (err) {
      if (err) {
        req.flash('notAttendingMessageError', 'Server error trying to change your status: ' + err)
        console.log('Not Attending error: ' + err)
      } else {
        req.flash('notAttendingMessageSuccess', 'Successfully no longer attending.')
      }
      res.redirect('/home')
    })
  })

  app.get('/admin', isLoggedIn, function (req, res) {
    if(req.user.local.email !== process.env.ADMIN_EMAIL) {
      res.redirect('/')
      return
    }
    res.render('pages/admin-console.ejs')
  })

  app.get('/500', function (req, res) {
    console.log('500 hit')
    throw new Error('This is a 500 Error')
  })

  app.get('/*', isLoggedIn, function (req, res) {
    console.log('404 Error trying to hit "' + req.url + '"')
    res.render('pages/404.ejs')
  })
}

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}

function renderProfile (req, res) {
  res.render('pages/profile.ejs', {
    email: req.user.local.email,
    status: req.user.status,
    notAttendingMessageSuccess: req.flash('notAttendingMessageSuccess'),
    notAttendingMessageError: req.flash('notAttendingMessageError')
  })
}
