const querystring = require('querystring')
const request = require('request')
const passport = require('passport')
const debug = require('debug')('routes:index')

const errorhandler = require('../config/errorhandler')
const forgot = require('../config/forgot')
const updateUser = require('../config/update')
const upload = require('../multer')
const adminFunc = require('../config/admin')
const teamFormation = require('../config/teamform')

const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  return res.redirect('/signup')
})

router.get('/login', function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home')
  } else {
    return res.render('pages/login', {
      initialView: 'login',
      forgotMessageSuccess: '',
      forgotErrorMessage: '',
      message: req.flash('loginMessage'),
      email: req.flash('submittedEmail')
    })
  }
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), function (req, res, next) {
  return res.redirect('/home')
})

router.get('/signup', function (req, res, next) {
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

router.post('/signup', passport.authenticate('signup', { failureRedirect: '/signup' }), function (req, res, next) {
  res.redirect('/home')
})

router.get('/forgot-password', function (req, res, next) {
  res.render('pages/login.ejs', {
    initialView: 'forgot',
    message: '',
    email: '',
    forgotErrorMessage: req.flash('forgotErrorMessage'),
    forgotMessageSuccess: req.flash('forgotMessageSuccess')
  })
})

router.post('/forgot-password', function (req, res, next) {
  forgot.resetPassword(req, res, function () {
    res.redirect('/forgot-password')
  })
})

router.get('/change-password/:ident/:timestamp-:hash', function (req, res, next) {
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

router.post('/change-password/:ident/:timestamp-:hash', function (req, res, next) {
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

router.get('/home', isLoggedIn, function (req, res, next) {
  // If user is admin
  if (adminFunc.isAdmin(req.user.local.email)) {
    return res.redirect('/admin')
  }

  // If user has already registered
  if (req.user.local.registered) {
    return renderProfile(req, res)
  }

  // Format according to Authorization form: https://my.mlh.io/docs#oauth_flows
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
      uri-encodes parameter values and my.mlh wants the +'s as is...
    */

  res.render('pages/application-preMLH.ejs', {
    errormessage: req.flash('mlhErrorMessage'),
    redirectUrl: redirectUrl
  })
})

router.get('/auth/mlh/callback', isLoggedIn, function (req, res, next) {
  // Generic functions for MLH errors
  function mlhError (whichCB, err) {
    errorhandler.logErrorMsg('routes.mlhcallback' + whichCB, err)
    req.flash('mlhErrorMessage', 'We encountered an error when connecting with My.MLH... lets try this again!')
    return res.redirect('/home')
  }

  function checkResponse (whichCB, err, statusCode) {
    if (err) return mlhError(whichCB, 'MLH Callback with the token produced an error:\n ' + err)
    return mlhError(whichCB, 'MLH Callback with the token return a non 200: ' + statusCode)
  }

  // Flow begins here
  if (!req.query.hasOwnProperty('code')) {
    return mlhError('1', 'MLH Callback req.query had no code:\n ' + req.query)
  }

  request.post('https://my.mlh.io/oauth/token', {
    form: {
      client_id: process.env.MLH_ID,
      client_secret: process.env.MLH_SECRET,
      code: req.query.code,
      redirect_uri: process.env.MLH_CALLBACK_URL,
      grant_type: 'authorization_code'
    }
  }, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      return checkResponse('2', err, response.statusCode)
    }

    request.get('https://my.mlh.io/api/v2/user.json', {
      form: { access_token: JSON.parse(body).access_token }
    }, function (err, response, body) {
      if (err || response.statusCode !== 200) {
        return checkResponse('3', err, response.statusCode)
      }

      // Successfully got the data from the MLH API!
      updateUser.mlhUpdate(req.user.id, JSON.parse(body).data)
      res.redirect('/almost-done')
    })
  })
})

router.get('/almost-done', isLoggedIn, function (req, res, next) {
  if (req.user.local.registered) return renderProfile(req, res)
  res.render('pages/registration.ejs', {errormessage: '', uploadsuccess: ''})
})

router.get('/team-formation', isLoggedIn, function (req, res, next) {
  // if (req.user == undefined) res.redirect('/login')
  res.render('pages/application-postMLH.ejs', {errormessage: '', uploadsuccess: ''});
})

router.get('/create-new-team', isLoggedIn, function (req, res, next) {
  // TODO: add a finishing page??
  res.render('pages/registration-create-new-team.ejs', {errormessage: '', uploadsuccess: ''});
})

router.get('/join-existing-team', isLoggedIn, function (req, res, next) {
  // TODO: add a finishing page??
  res.render('pages/registration-join-existing-team.ejs', {errormessage: '', uploadsuccess: ''});
})

router.get('/find-new-teammates', isLoggedIn, function (req, res, next) {
  // TODO: add a finishing page??
  res.render('pages/find-new-teammates.ejs', {errormessage: '', uploadsuccess: ''});
})

router.get('/finish-registration', isLoggedIn, function (req, res, next) {
  // TODO: add a finishing page??
})

// TODO: how would I separate registration related routes and logic
// into a separate file?
router.post('/save-question-response', isLoggedIn, function (req, res, next) {
  console.log(req.body.data);
  // console.log(req.user.id);
  teamFormation.submitAnswer(req, res, function() {
    res.send('success');
  }) 
})

router.post('/submit-application', isLoggedIn, upload.single('resume'), function (req, res, next) {
  // Check for location & amount (since those are required). Checking for frontend tampering
  if (!req.body.firstHackathon || !req.body.reimbursementSeeking) {
    console.log(req.body)
    res.render('pages/registration.ejs', { errormessage: 'There was an error with your response. Please try again.' })
  } else if (req.fileAccepted === false) {
    res.render('pages/registration.ejs', { errormessage: 'Please only upload images of type .jpg, .jpeg, .pdf, .png, or .gif' })
  } else {
    updateUser.additionalUpdate(req.user.id, req.body)
    updateUser.registered(req.user.id)
    res.render('pages/application-submitted.ejs', {})
  }
})

router.get('/logout', function (req, res, next) {
  req.logout()
  res.redirect('/')
})

router.get('/not-attending-confirmation', isLoggedIn, function (req, res, next) {
  res.render('pages/not-attending-confirmation.ejs')
})

router.post('/not-attending-confirmation', isLoggedIn, function (req, res, next) {
  updateUser.notAttending(req.user.id, {
    'status': 'Not Attending',
    'notAttendingReason': req.body.notAttendingReason
  })

  req.flash('notAttendingMessageSuccess', 'Successfully no longer attending.')
  res.redirect('/home')
})

router.get('/admin', isLoggedIn, function (req, res, next) {
  if (!adminFunc.isAdmin(req.user.local.email)) {
    res.redirect('/')
    return
  }
  res.render('pages/admin-console.ejs')
})

router.get('/admin-all-registrants', isLoggedIn, function(req, res, next) {
  if (!adminFunc.isAdmin(req.user.local.email)) {
    res.redirect('/')
    return
  }
  adminFunc.getAllUsers(req, res, function(responseData) {
    res.json(responseData)
  })
})

router.get('/changeStatus/:userid/:stat', isLoggedIn, function(req, res) {
  if (!adminFunc.isAdmin(req.user.local.email)) {
    return res.redirect('/')
  }
  adminFunc.changeStatus(req.params.userid, req.params.stat, function() {
    return res.sendStatus(200)
  })
})

function isLoggedIn (req, res, next) {
  debug(req)
  if (true) {
    return next()
  } else {
    res.redirect('/login')
  }
}

function renderProfile (req, res) {
  res.render('pages/profile.ejs', {
    email: req.user.local.email,
    status: req.user.status,
    notAttendingMessageSuccess: req.flash('notAttendingMessageSuccess')
  })
}

module.exports = router
