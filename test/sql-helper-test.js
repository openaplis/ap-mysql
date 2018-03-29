const assert = require('chai').assert
const path = require('path')

var sqlHelper = require('../src/core/sql-helper')

var inputParams = {
  reportNo: '18-99999',
  accepted: false
}

var updateObj = {
  tableName : 'abc',
  type : 'update',
  primaryKey : 'ReportNo',
  primaryKeyValue : '18-99999',
  fields : [
    {
      name : 'Result',
      value : 'Negative'
    }
  ]
}

describe('Sql Statement Tests', function () {
  it('Update', function (done) {
    sqlHelper.createUpdateStatement(updateObj, function(err, statement) {
      if(err) console.log(err)
      var updateStatement = 'update abc set Result = \'Negative\' where ReportNo = \'18-99999\';'
      assert.equal(statement, updateStatement)
      done()
    })
  })
})
