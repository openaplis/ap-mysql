var fs = require('fs')
var path = require('path')

var dirPath = './src/core/object'
fs.readdir(dirPath, function (err, files) {
  if(err) return console.log(err)
    files.map(function (err, idx) {
      objName = path.basename(files[idx], '.json')
      console.log('{ objectName: \'' + objName + '\', tableName: \'tbl' + objName + '\' }, ')
    })
})
