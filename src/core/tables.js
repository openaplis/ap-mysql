'use strict'

var _ = require('lodash')
var camelCase = require('./camel-case')
const async = require('async')
const path = require('path')
const cmdSubmitter = require(path.join(__dirname, 'cmd-submitter'))
const fs = require('fs')

var script = ''
var data = null

var self = module.exports = {
  getTableConstraints: function(callback) {
    var sql = 'SELECT u.TABLE_NAME tableName, 0 written, GROUP_CONCAT(u.REFERENCED_TABLE_NAME) '
    sql += 'referencedTableName FROM INFORMATION_SCHEMA.TABLES t  join '
    sql += 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE u on t.TABLE_NAME = u.TABLE_NAME WHERE '
    sql += 'u.TABLE_SCHEMA = \'lis\' and u.CONSTRAINT_NAME like \'fk%\' and t.TABLE_SCHEMA '
    sql += '= \'lis\' and t.TABLE_NAME like \'tbl%\' group by t.TABLE_NAME union select '
    sql += 'TABLE_NAME tableName, 0 written, null referencedTableName from INFORMATION_SCHEMA.TABLES '
    sql += 'where TABLE_NAME not in (Select TABLE_NAME from '
    sql += 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE where TABLE_SCHEMA = \'lis\' and '
    sql += 'CONSTRAINT_NAME like \'fk%\') and TABLE_SCHEMA = \'lis\' and TABLE_NAME like '
    sql += '\'tbl%\' order by tableName;'

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

  generateOrderedTableScriptFile: function(databasename, jsonfilename, sqlfilename, callback) {
    async.series([

      function(callback) {
        fs.readFile(jsonfilename, function(err, result) {
          if(err) return (err)
          data = JSON.parse(result)
          callback()
        })
      },

      function(callback) {
        self.removeFile(sqlfilename, function(err, result) {
          if(err) return callback(err)
          callback()
        })
      },

      function(callback) {
        script = 'Create database ' + databasename + ';\n\n'
        script += 'use ' + databasename + ';\n\n'
        async.eachSeries(data, function(table, callback) {
          self.getCreateStatement(table['tableName'], function(err, statements) {
            if(err) return callback(err)
            script += statements[0]['Create Table'] + ';\n\n'
            callback()
          })
        }, function(err) {
            if(err) return callback(err)
            callback()
        })
      },

      function(callback) {
        fs.appendFile(sqlfilename, script, function(err, result) {
          if(err) return callback(err)
          callback()
        })
      }
    ],
    function(err, results) {
      if(err) return callback(err)
      callback(null, 'success')
    })
  },

  generateOrderedTableFile: function(filename, callback) {
    script = '['
    async.series([
      function(callback) {
        self.removeFile(filename, function(err, result) {
          if(err) return callback(err)
          callback()
        })
      },

      function(callback) {
        self.getTableConstraints(function(err, result) {
          if(err) return callback(err)
          async.eachSeries(result, function(tableConstraint, callback) {
            self.orderTables(tableConstraint, result, function(err, result) {
              if(err) return callback(err)
              callback()
            })
          },
          function(err) {
            if(err) return callback(err)
            callback()
            })
          })
        }
    ],
    function(err, results) {
      if(err) return callback(err)
      script = script.slice(0, -2);
      script += ']'
      fs.appendFile(filename, script, function(err, result) {
        if(err) return callback(err)
        callback(null, 'success')
      })
    })
  },

  orderTables: function(tableConstraint, tableConstraintArray, callback) {
    if(tableConstraint['written'] === 0) {
      if(tableConstraint['referencedTableName'] === null) {
        script += '{\"' + 'tableName\":\"' + tableConstraint['tableName'] + '\" },\n'
        tableConstraint['written'] = 1
        callback()
      }
      else {
        var referenceTables = tableConstraint['referencedTableName'].split(',')
        async.series([
          function(callback) {
            async.eachSeries(referenceTables, function(referenceTable, callback) {
              var table = _.find(tableConstraintArray, function(o) { return o.tableName === referenceTable})
              self.orderTables(table, tableConstraintArray, function(err, result) {
                if(err) return callback(err)
                callback()
              })
            },
            function(err) {
              if(err) return callback(err)
              callback()
            })
          },

          function(callback) {
            script += '{\"' + 'tableName\":\"' + tableConstraint['tableName'] + '\" },\n'
            tableConstraint['written'] = 1
            callback()
          }
        ],
        function(err, results) {
          if(err) return callback(err)
          callback()
        })
      }
    }
    else {
      callback()
    }
  }
}
