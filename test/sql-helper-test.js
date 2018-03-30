const assert = require('chai').assert
const path = require('path')

var sqlHelper = require('../src/core/sql-helper')

var inputParams = {
  reportNo: '18-99999',
  accepted: false
}

var updateObj = [
  {
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
  },
  {
    tableName : 'xyz',
    type : 'update',
    primaryKey : 'TheKey',
    primaryKeyValue : 'TheKeyValue',
    fields : [
      {
        name : 'Field1',
        value : 'Field1Value'
      },
      {
        name : 'Field2',
        value : 'Field2Value'
      },
    ]
  }
]

describe('Sql Statement Tests', function () {
  it('Update', function (done) {
    var statement = sqlHelper.createUpdateStatement(updateObj)
    var updateStatement = 'update abc set Result = \'Negative\' where ReportNo = \'18-99999\'; update xyz set Field1 = \'Field1Value\',Field2 = \'Field2Value\' where TheKey = \'TheKeyValue\';'
    assert.equal(statement, updateStatement)
    done()
  })
})
