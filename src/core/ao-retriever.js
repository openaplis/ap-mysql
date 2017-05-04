'use strict'

var cmdSubmitter = require('./cmd-submitter')
var aoBuilder = require('./ao-builder')

module.exports.retrieve = (masterAccessionNo, callback) => {
  var sql = 'Set @MasterAccessionNo = \'' + masterAccessionNo + '\'; CALL prcGetAccessionOrder_2(@MasterAccessionNo);'
  cmdSubmitter.submit(sql, function (err, rows) {
    if(err) return callback(err)
    aoBuilder.build(rows, function (err, ao) {
      if(err) return callback(err)
      callback(null, ao)
    })
  })
}
