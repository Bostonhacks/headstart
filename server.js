require('dotenv').config()

const bodyParser = require('body-parser')
const configDB = require('./config/database.js')
const cookieParser = require('cookie-parser')
const express = require('express')
const favicon = require('serve-favicon')
const flash = require('connect-flash')
const fs = require('fs')
const mongoose = require('mongoose')
const morgan = require('morgan')
const multer = require('multer')
const passport = require('passport')
const path = require('path')
const session = require('express-session')

const app = express()
const port = process.env.PORT || 5000

var storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, path.join(__dirname, '/uploads/'))
  },
  // Simply to avoid users having multiple resumes saved
  filename: function (req, file, next) {
    var acceptedExtensions = ['.jpg', '.jpeg', '.pdf', '.png', '.gif']
    for (var i = 0; i < acceptedExtensions.length; i++) {
      var filepath = path.join(__dirname, '/uploads/' + req.user.local.email + '-resume' + acceptedExtensions[i])
      if (fs.existsSync(filepath)) { fs.unlink(filepath) };
    }

    next(null, req.user.local.email + '-resume' + path.extname(file.originalname))
  }
})

function fileFilter (req, file, next) {
  var acceptedExtensions = ['.jpg', '.jpeg', '.pdf', '.png', '.gif']
  if (acceptedExtensions.indexOf(path.extname(file.originalname)) > -1) {
    req.fileAccepted = true
    next(null, true)
  } else {
    req.fileAccepted = false
    next(null, false)
  }
};

var upload = multer({ fileFilter: fileFilter, storage: storage })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/img', express.static(path.join(__dirname, 'public/images')))
app.use('/js', express.static(path.join(__dirname, 'public/javascripts')))
app.use('/css', express.static(path.join(__dirname, 'public/stylesheets')))
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')))

mongoose.connect(configDB.url)
require('./config/passport')(passport)
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())

// Session Configuration
app.use(session({ secret: process.env.SESSION_SECRET }))

// Passport
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Routes
require('./routes')(app, passport, upload)

app.listen(port)
console.log('Now running on port: ' + port)
