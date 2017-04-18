var assert = require('assert')
var path = require('path')

var cmdBuilder = require(path.resolve('./src/core/cmd-builder'))
var cmdSubmitter = require(path.resolve('./src/core/cmd-submitter'))

describe('cmdSubmitter', function() {
  describe('submit', function() {
    it('???', function(done) {

      cmdSubmitter.submit(sql, function (err, rows) {
        if(err) done(err)
        assert.equal(0, rows[0].fieldCount)
        done()
      })
    })
  })
})
