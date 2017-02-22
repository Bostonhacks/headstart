const fs = require('fs')
const logFileName = 'errorlog.txt'

module.exports = {
  logErrorMsg: function (source, error) {
    const message = 'via ' + source + ': \n' + error + '\n\n'
    fs.exists(logFileName, function (exists) {
      if (exists) {
        fs.appendFile(logFileName, message)
        return
      }
      fs.writeFile(logFileName, message)
    })
  }
}
