'use strict'

var assert = require('chai').assert

var accessionOrderGateway = require('../src/core/accession-order-gateway')

describe('test', function() {
  it('test', function(done) {
    accessionOrderGateway.getAccessionOrderByMasterAccessionNo('17-16284', function (err, result) {
      if(err) return console.log(err)
      var ao = JSON.parse(result.json)
      console.log(ao.accessionOrder.panelSetOrders[0])
      done()
    })
  })
})
