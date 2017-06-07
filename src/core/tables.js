'use strict'

const async = require('async')
const path = require('path')
const cmdSubmitter = require(path.join(__dirname, 'cmd-submitter'))
const fs = require('fs')

var script = null

var self = module.exports = {


  getList: function(callback) {
    var sql = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'lis\' and table_type = \'BASE TABLE\' and TABLE_NAME like \'tbl%\';'
    cmdSubmitter.submit(sql, function(err, result) {
      if(err) return callback(err)
      callback(null, result)
    })
  },

  getCreateStatement: function(tableName, callback) {
    var sql = 'show create table ' + tableName + ';'
    cmdSubmitter.submit(sql, function(err, result) {
      if(err) return callback(err)
      callback(null, result)
    })
  },

  writeToFile: function(filename, script, callback) {
    var dataToAppend = script + '\r\n'
    fs.appendFile(filename, dataToAppend, function(err, result) {
      if(err) return callback(err)
      callback(null, 'success')
    })
  },

  removeFile: function(filename, callback) {
    fs.access(filename, fs.constants.F_OK, function(err, result) {
      if(err) {
        callback(null, 'success')
      }
      else {
        fs.unlink(filename, function(err, result) {
          if(err) return callback(err)
          callback(null, 'success')
        })
      }
    })
  },

  generateCreateTableFile: function(databasename, filename, callback) {
    async.series([

      function(callback) {
        self.removeFile(filename, function(err, result) {
          if(err) return callback(err)
          console.log('removed file')
          callback(null, result)
        })
      },

      function(callback) {
        script = 'Create database ' + databasename + ';\n'
        script += 'use ' + databasename + ';\n'
        self.getList(function(err, tables) {
          if(err) return callback(err)
          console.log('got table list')
          async.eachSeries(tables, function(table, callback) {
            self.getCreateStatement(table['table_name'], function(err, statements) {
              if(err) return callback(err)
              script += statements[0]['Create Table'] + ';\n'
              console.log(statements[0]['Create Table'] + ';\n')
              callback(null, 'success')
            })
          })
        })
      },

      function(callback) {
        console.log('before write to file')
        self.writeToFile(filename, script, function(err, result) {
          if(err) return callback(err)
          console.log('wrote to file')
          callback(result)
        })
      }

    ],

    function(err, results) {
     if(err) return callback(err)
     callback(null, 'success')
    })
  }
}
