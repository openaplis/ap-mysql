var assert = require('chai').assert
var path = require('path')

var cmdSubmitter = require(path.resolve('./src/core/cmd-submitter'))

describe('cmdSubmitter', function() {
  describe('submit', function() {
    
    /*
    it('Testing for an error', function(done) {
      var sql = 'This is nonsense sql'
      cmdSubmitter.submit(sql, function (err, rows) {
        assert.notEqual(err, null, 'This should have resulted in an error.')
        done()
      })
    })
    */

    it('Testing for rows in tblClient', function(done) {
      var sql = 'Select * from tblClient'
      cmdSubmitter.submit(queryStringGetCases, function (err, rows) {
        assert.equal(err, null, 'This should not have resulted in an error.')
        assert.isAtLeast(rows.length, 1, 'This query should have returned at least one row.')
        done()
      })
    })

  })
})
