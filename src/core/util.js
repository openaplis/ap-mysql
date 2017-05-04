var fs = require('fs')
var path = require('path')
var camelCase = require('./camel-case')
var dir = path.join(__dirname, 'object')

fs.readdir(dir, (err, files) => {
  files.forEach(file => {
    fs.readFile(path.join(__dirname, 'object', file), function (err, data) {
      if(err) return console.log(err)
      var obj = JSON.parse(data)
      obj.objectName = camelCase.toLower(obj.objectName)

      obj.fields.forEach(field => {
        field.sqlName = field.name
        field.name = camelCase.toLower(field.name)        
      })

      var dataOut = JSON.stringify(obj)
      fs.writeFile(path.join(__dirname, 'object2', obj.objectName + '.json'), dataOut, function (err) {
        if(err) return console.log(err)
      })
    })
  });
})
