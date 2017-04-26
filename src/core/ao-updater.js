'use strict'

const updateCmdBuilder = require('./update-cmd-builder')
const insertCmdBuilder = require('./insert-cmd-builder')
const cmdSubmitter = require('./cmd-submitter')
const async = require('async')

module.exports.update = (ao, aoClone, callback) => {

  var updateStatements = []
  var insertStatements = []

  async.waterfall([

    function (callback) {
      updateCmdBuilder.build(ao, aoClone, function (err, statements) {
        if(err) return callback(err)
        updateStatements = statements
        callback(null)
      })
    },
    function (callback) {
      insertCmdBuilder.build(ao, aoClone, function (err, statements) {
        if(err) return callback(err)
        insertStatements = statements
        callback(null)
      })
    },
    function (callback) {
      cmdSubmitter.submit(insertStatements[0], function (err, result) {
        if(err) return callback(err)
        callback(null, insertStatements.length + ' insert statement(s) were executed.')
      })
    }

  ], function (err, result) {
    if(err) return callback(err)
    callback(null, result)
  })

}
