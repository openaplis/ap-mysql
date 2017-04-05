var fs = require('fs')
var deepDiff = require('deep-diff')
var clone = require('clone')
var mysql = require('mysql')
var _ = require('lodash')
var path = require('path')
var mysqlConfig = require(path.resolve('../ap-secrets/secrets/mysql-config/mysqlConfig'))

module.exports.submit = (sql, callback) => {
  var connection = mysql.createConnection(mysqlConfig.secret)
  connection.connect()

  var query = connection.query(sql)
  var rows = []

  query
    .on('error', function(err) {
      callback(err)
    })
    .on('fields', function(fields) {
      // the field packets for the rows to follow
    })
    .on('result', function(row) {      
      rows.push(Object.assign({}, row))
    })
    .on('end', function() {
      callback(null, rows)
    })

  connection.end()
}
