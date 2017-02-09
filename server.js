require('dotenv').config();

const bodyParser    = require('body-parser')
  , configDB        = require('./config/database.js')
  , connect         = require('connect')
  , cookieParser    = require('cookie-parser')
  , express         = require('express')
  , favicon         = require('serve-favicon')
  , flash           = require('connect-flash')
  , fs              = require('fs')
  , mongoose        = require('mongoose')
  , morgan          = require('morgan')
  , multer          = require('multer')
  , passport        = require('passport')
  , path            = require('path')
  , session         = require('express-session');

const app = express();
const port = process.env.PORT || 5000;


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
app.use('/img',express.static(path.join(__dirname, 'public/images')));
app.use('/js',express.static(path.join(__dirname, 'public/javascripts')));
app.use('/css',express.static(path.join(__dirname, 'public/stylesheets')));
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));


mongoose.connect(configDB.url);
require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

//Passport
app.use(session({ 
    secret: process.env.SESSION_SECRET
    // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Routes
require('./routes.js')(app, passport, upload);

app.listen(port);
console.log('Now running on port: ' + port);
