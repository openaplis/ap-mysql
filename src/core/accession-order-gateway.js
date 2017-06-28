'use strict'

var path = require('path')

var aoBuilder = require(path.join(__dirname, 'ao-builder'))
var aoRetriever = require(path.join(__dirname, 'ao-retriever'))

module.exports = {
  getAccessionOrderByMasterAccessionNo: function (masterAccessionNo, callback) {
    aoRetriever.retrieve(masterAccessionNo, function (err, ao) {
      if(err) return callback(err)
      callback(null, { masterAccessionNo: masterAccessionNo, json: JSON.stringify(ao) })
    })
  }
}
