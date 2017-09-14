const fs = require('fs')
const multer = require('multer')
const path = require('path')

const acceptedExtensions = ['.jpg', '.jpeg', '.pdf', '.png', '.gif']
const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, path.join(__dirname, '../uploads/'))
  },
  // Simply to avoid users having multiple resumes saved
  filename: function (req, file, next) {
    for (var i = 0; i < acceptedExtensions.length; i++) {
      var filepath = path.join(__dirname, '/uploads/' + req.user.local.email + '-resume' + acceptedExtensions[i])
      if (fs.existsSync(filepath)) { fs.unlink(filepath) };
    }

    next(null, req.user.local.email + '-resume' + path.extname(file.originalname))
  }
})

function fileFilter (req, file, next) {
  if (acceptedExtensions.indexOf(path.extname(file.originalname)) > -1) {
    req.fileAccepted = true
    next(null, true)
  } else {
    req.fileAccepted = false
    next(null, false)
  }
}

module.exports = multer({ fileFilter: fileFilter, storage: storage })
