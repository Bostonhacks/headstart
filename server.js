require('dotenv').config();

var express  = require('express')
  , connect = require('connect')
  , app      = express()
  , mongoose = require('mongoose')
  , passport = require('passport')
  , flash    = require('connect-flash')
  , morgan       = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , session      = require('express-session')
  , configDB = require('./config/database.js')
  , port     = process.env.PORT || 5000;

var path = require('path');
var fs = require('fs');

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads/');
  },
  filename: function (req, file, cb) {
    // Simply to avoid users having multiple resumes saved
    var acceptedExtensions = [".jpg", ".jpeg", ".pdf", ".png", ".gif"];
    for(i = 0; i < acceptedExtensions.length; i++){
      if (fs.existsSync(__dirname + '/uploads/' + req.user.local.email + '-resume' + acceptedExtensions[i])) {
        fs.unlink(__dirname + '/uploads/' + req.user.local.email + '-resume' + acceptedExtensions[i]);
      };
    }

    cb(null, req.user.local.email + '-resume' + path.extname(file.originalname));
  }
});

function fileFilter (req, file, cb) {
  var acceptedExtensions = [".jpg", ".jpeg", ".pdf", ".png", ".gif"];
  if(acceptedExtensions.indexOf(path.extname(file.originalname)) > -1) {
    console.log("accepted that shit!");
    cb(null, true);
    req.fileAccepted = true;
  } else {
    console.log("denied that shit!");
    cb(null, false);
    req.fileAccepted = false;
  }
};

var upload = multer({ fileFilter: fileFilter, storage: storage });

app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect(configDB.url);
require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

//Passport
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Routes
require('./routes.js')(app, passport, upload);

app.listen(port);
console.log('Now running on port: ' + port);