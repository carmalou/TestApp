function writeLogFile(message) {
    var fs = require('fs');
    var today = Date.now();
    fs.appendFile('C:\\Users\\IEUser\\Desktop\\logs.txt', '\r\n Timestamp ' + today + '\r\n' + message + '\r\n', 'utf8', function(err) {
      if(err) {
        console.log('Whoops! ' + err);
      } else {
        console.log('Success!');
      }
    });
  }
  
  // module.exports = writeLogFile;
  writeLogFile('whatever whatever whatever');