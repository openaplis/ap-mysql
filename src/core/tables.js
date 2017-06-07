'use strict'

const async = require('async')
const path = require('path')
const cmdSubmitter = require(path.join(__dirname, 'cmd-submitter'))
const fs = require('fs')

var tablesexp = module.exports = {

    getList: function(callback) {
      var sql = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'lis\' and table_type = \'BASE TABLE\' and TABLE_NAME like \'tbl%\';'
      cmdSubmitter.submit(sql, function(err, result){
        if(err) return callback(err)
        callback(null, result)
      })
    },

    getCreateStatement: function(tableName, callback) {
      var sql = 'show create table ' + tableName + ';'
      cmdSubmitter.submit(sql, function(err, result){
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
          tablesexp.removeFile(filename, function(err, result) {
            if(err) return callback(err)
            callback(null, result)
          })
        },

        function(callback) {
          var dbname = 'Create database ' + databasename + ';\n'
          tablesexp.writeToFile(filename, dbname, function(err, result) {
            if(err) return callback(err)
            callback(null, result)
          })
        },

        function(callback) {
          var dbname = 'use ' + databasename + ';\n'
          tablesexp.writeToFile(filename, dbname, function(err, result) {
            if(err) return callback(err)
            callback(null, 'success')
          })
        },

        function(callback) {
          tablesexp.getList(function(err, tables) {
            if(err)return callback(err)
            async.eachSeries(tables, function(table, callback) {
              async.waterfall([
                function (callback) {
                  tablesexp.getCreateStatement(table['table_name'], function(err, statements) {
                    if(err) return callback(err)
                    callback(null, statements[0])
                  })
                },
                function(statement, callback) {
                  tablesexp.writeToFile(filename, statement['Create Table'] + ';\n', function(err, result) {
                    if(err) return callback(err)
                    callback(null, 'success')
                })
              }
              ], function (err, result) {
                if(err) return callback(err)
                callback(null, result)
              })

            }, function (err) {
              if (err) return callback(err)
              callback(null, 'success')
            })
          })
        }
      ],
        function(err, results) {
          if(err) return callback(err)
          callback(null, 'success')
        })
    }
}
