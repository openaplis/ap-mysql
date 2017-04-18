var fs = require('fs')
var path = require('path')

var dirPath = './src/core/object'
fs.readdir(dirPath, function (err, files) {
  if(err) return console.log(err)
    files.map(function (err, file) {
      var oldPath = path.join(dirPath, files[file])
      var newPath = path.join(dirPath, files[file].substring(3, files[file].length))
      fs.rename(oldPath, newPath, function (err) {
        if(err) return console.log(err)
      })
    })
})
