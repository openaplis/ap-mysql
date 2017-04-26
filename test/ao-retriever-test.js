'use strict'

const assert = require('assert')
const aoRetriever = require('../src/core/ao-retriever')

describe('ao-retriever', function() {
  it('Retrieve', function(done) {
    aoRetriever.retrieve('17-123', function (err, ao) {
      assert.equal(ao.AccessionOrder.MasterAccessionNo, '17-123', 'the master accessionno is not correct')
      done()
    })
  })
})
