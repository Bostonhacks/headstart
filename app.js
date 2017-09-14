const bodyParser = require('body-parser')
const express = require('express')
const cookieParser = require('cookie-parser')
const debug = require('debug')('app')
const favicon = require('serve-favicon')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const morgan = require('morgan')
const passport = require('passport')
const path = require('path')
const session = require('express-session')

const index = require('./routes/index')
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({secret: process.env.SESSION, resave: true, saveUninitialized: true}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27107/headstart')
require('./config/passport')(passport)

app.use('/', index)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('404 Page Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    debug(err)
    res.status(err.status || 500)
    res.render('pages/error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('pages/error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
