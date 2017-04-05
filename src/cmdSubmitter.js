var fs = require('fs')
var deepDiff = require('deep-diff')
var clone = require('clone')
var mysql = require('mysql')
var _ = require('lodash')

var connection = mysql.createConnection({
  host     : '10.1.2.26',
  user     : 'sqldude',
  password : '123Whatsup',
  database : 'lis',
  multipleStatements: true,
})

module.exports.submit = (sql, callback) => {
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
