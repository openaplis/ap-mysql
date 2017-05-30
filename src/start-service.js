var path = require('path')
var fs = require('fs')

var mysqlService = require(path.join(__dirname, './core/mysql-service'))

mysqlService.start(function (err, message) {
  if(err) return console.log(err)
  console.log(message)
})
